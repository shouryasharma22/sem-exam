import ResourceExplorer from '../components/ResourcesExplorer';

function NotesPage() {
  return (
    <ResourceExplorer
      resourceType="Class Notes"
      pageTitle="Class Notes"
      pageDescription="Browse peer-shared notes by subject, department, and year."
    />
  );
}

export default NotesPage;