import 'dotenv/config';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import Resource from '../src/models/resource.model.js';

const ROOT_FOLDER_ID = '1dtSeqN8UvrP8QQkB2mBOLOrN02f4kV8_';

let uri = process.env.MONGODB_URI || '';
if (!uri.includes('college-resource-hub')) {
  uri = uri.replace(/\.net\/[^?]*(\?.*)?$/, '.net/college-resource-hub$1');
}

const drive = google.drive({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const parseMetadata = (fileName, folderPath = '') => {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
  const fullContext = `${cleanName} ${folderPath}`.toLowerCase();

  let resourceType = 'Exam Paper';
  if (
    fullContext.includes('textbook') ||
    fullContext.includes('edition') ||
    fullContext.includes('author') ||
    fullContext.includes('handbook')
  ) {
    resourceType = 'Textbook';
  } else if (
    fullContext.includes('notes') ||
    fullContext.includes('lecture') ||
    fullContext.includes('unit') ||
    fullContext.includes('module') ||
    fullContext.includes('slides') ||
    fullContext.includes('resources') ||
    fullContext.includes('lab')
  ) {
    resourceType = 'Class Notes';
  }

  const codeMatch = `${cleanName} ${folderPath}`.match(/\b([A-Z]{2,3}[-\s]?\d{3})\b/i);
  const subjectCode = codeMatch ? codeMatch[1].replace(/[-\s]/g, '').toUpperCase() : 'GENERAL';

  let department = 'computer science';
  if (/^CS/i.test(subjectCode)) department = 'computer science';
  else if (/^IT/i.test(subjectCode)) department = 'information technology';
  else if (/^EC/i.test(subjectCode)) department = 'electronics';
  else if (/^EE/i.test(subjectCode)) department = 'electrical';
  else if (/^ME/i.test(subjectCode)) department = 'mechanical';
  else if (/^CV|^WO/i.test(subjectCode)) department = 'civil';
  else if (/^CY/i.test(subjectCode)) department = 'chemistry';
  else if (/^PH/i.test(subjectCode)) department = 'physics';
  else if (/^MA/i.test(subjectCode)) department = 'mathematics';
  else if (/^MT/i.test(subjectCode)) department = 'materials science';
  else if (/^SM/i.test(subjectCode)) department = 'humanities';

  const yearMatch = fullContext.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  let examType = 'Other';
  if (fullContext.includes('mid') || fullContext.includes('minor') || fullContext.includes('mst')) {
    examType = 'Mid-Sem';
  } else if (fullContext.includes('end') || fullContext.includes('major') || fullContext.includes('est')) {
    examType = 'End-Sem';
  } else if (fullContext.includes('quiz') || fullContext.includes('test')) {
    examType = 'Quiz';
  }

  const tags = [
    subjectCode,
    department,
    resourceType,
    ...(yearMatch ? [year.toString()] : []),
    ...(examType !== 'Other' ? [examType] : []),
  ].filter(Boolean);

  const doc = {
    title: cleanName,
    department,
    resourceType,
    subjectCode,
    tags,
    isActive: true,
  };

  if (resourceType === 'Exam Paper') {
    doc.year = year;
    doc.examType = examType;
  } else {
    doc.year = year;
    doc.examType = 'Other';
  }

  return doc;
};

async function scanDriveFolder(folderId, currentPath = '') {
  let allResources = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
      pageSize: 100,
      pageToken: pageToken,
    });

    const items = res.data.files || [];

    for (const item of items) {
      const fullPath = currentPath ? `${currentPath} / ${item.name}` : item.name;

      if (item.mimeType === 'application/vnd.google-apps.folder') {
        console.log(`📁 Scanning: ${fullPath}`);
        const nested = await scanDriveFolder(item.id, fullPath);
        allResources = allResources.concat(nested);
      } else {
        const metadata = parseMetadata(item.name, currentPath);

        allResources.push({
          ...metadata,
          fileUrl: `https://drive.google.com/file/d/${item.id}/view`,
          publicId: `gdrive_${item.id}`,
        });
      }
    }

    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return allResources;
}

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log(`Connected to Database: "${mongoose.connection.name}"`);

    console.log(`Scanning Google Drive root: ${ROOT_FOLDER_ID}`);
    const resources = await scanDriveFolder(ROOT_FOLDER_ID);
    console.log(`\nFound ${resources.length} total files across Drive hierarchy.`);

    if (resources.length > 0) {
      console.log('Upserting resources into database (preventing duplicates)...');
      
      // Build bulk upsert operations matched on publicId
      const bulkOps = resources.map((doc) => ({
        updateOne: {
          filter: { publicId: doc.publicId },
          update: { $set: doc },
          upsert: true,
        },
      }));

      const result = await Resource.bulkWrite(bulkOps);
      console.log(`✅ Upsert complete!`);
      console.log(`   - Newly inserted: ${result.upsertedCount}`);
      console.log(`   - Updated existing: ${result.modifiedCount}`);
      console.log(`   - Matched unchanged: ${result.matchedCount}`);

      const totalInDb = await Resource.countDocuments();
      console.log(`📊 Total resources in database: ${totalInDb}`);
    }
  } catch (error) {
    console.error('Import process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

run();