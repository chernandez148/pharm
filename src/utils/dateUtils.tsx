// utils/dateUtils.js
export const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',  // "2025"
        month: 'long',    // "April"
        day: 'numeric',   // "21"
    });

    return formattedDate;
};
