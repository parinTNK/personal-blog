/**
 * Format a date string to a localized format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};