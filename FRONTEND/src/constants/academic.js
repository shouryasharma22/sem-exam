export const departmentsList = [
  { id: 'computer science', name: 'Computer Science' },
  { id: 'electronics', name: 'Electronics and Communication Engineering' },
  { id: 'information technology', name: 'Information Technology' },
  { id: 'mechanical', name: 'Mechanical Engineering' },
  { id: 'civil', name: 'Civil Engineering' },
  { id: 'electrical', name: 'Electrical Engineering' },
  { id: 'chemical', name: 'Chemical Engineering' },
  { id: 'metallurgy', name: 'Metallurgy' },
  { id: 'mining', name: 'Mining' },
];
export const examTypes = ['Mid-Sem', 'End-Sem', 'Quiz', 'Other'];

export function getRecentYears(count = 6) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}