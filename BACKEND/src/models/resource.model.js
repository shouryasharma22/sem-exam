import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: function () {
      return this.resourceType !== 'Textbook'&&this.resourceType !== 'Class Notes';
    }
    },
    resourceType: {
      type: String,
      enum: ['Exam Paper', 'Textbook', 'Class Notes'],
      required: true
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true
    },
    year: {
      type: Number,
      required: function () {
      return this.resourceType !== 'Textbook'&&this.resourceType !== 'Class Notes';
    }
    },
    examType: {
      type: String,
      enum: ['Mid-Sem', 'End-Sem', 'Quiz', 'Other'],
      default: 'Other',
      required: function () {
      return this.resourceType !== 'Textbook'&&this.resourceType !== 'Class Notes';
    }
    },
    fileUrl: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    publicId: { type: String, required: true }
  },
  { timestamps: true }
);

resourceSchema.index(
  { subjectCode: 'text', title: 'text', tags: 'text' },
  { weights: { subjectCode: 10, title: 5, tags: 1 } }
);

export default mongoose.model('Resource', resourceSchema);
