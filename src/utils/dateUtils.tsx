// utils/dateUtils.ts
export const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
  
    // Full date (e.g., "April 29, 2025")
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    // Short MM/YY format (e.g., "04/25")
    const formattedMonthYear = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  
    return { 
      formattedDate,  // "April 29, 2025"
      formattedMonthYear,  // "04/25"
    };
  };