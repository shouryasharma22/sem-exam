import ResourceExplorer from '../components/common/ResourcesExplorer';

function BooksPage() {
  return (
    <ResourceExplorer
      resourceType="Textbook"
      pageTitle="Books"
      pageDescription="Browse books by subject and department."
      allowedFilters={{ department: true, subjectCode: true, year: false, examType: false }}
    />
  );
}

export default BooksPage;