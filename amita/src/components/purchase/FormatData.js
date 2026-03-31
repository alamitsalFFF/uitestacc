export const FormatDate = (dateString) => {
  // console.log("Input date string:", dateString);
  if (!dateString) {
    return "";
  }

  try {
     // ดึงค่า dateString ออกจาก object
     const dateStringN = dateString.dateString;
     if (!dateStringN) {
       return "Invalid Date";
     }
 
     const date = new Date(dateStringN);
 
     if (isNaN(date.getTime())) {
       return "Invalid Date";
     }
 

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    // console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};
// NaN