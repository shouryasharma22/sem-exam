export const departmentsList = [
  { id: 'computer science', name: 'Computer Science' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'information technology', name: 'Information Technology' },
  { id: 'mechanical', name: 'Mechanical' },
];
export const examTypes = ['Mid-Sem', 'End-Sem', 'Quiz', 'Other'];

export function getRecentYears(count = 6) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}