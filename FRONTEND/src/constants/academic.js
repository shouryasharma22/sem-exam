export const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];
export const examTypes = ['Mid-Sem', 'End-Sem', 'Quiz', 'Other'];

export function getRecentYears(count = 6) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}