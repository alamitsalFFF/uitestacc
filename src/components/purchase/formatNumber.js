// export const formatNumber = (number) => {
//   if (typeof number === "number") {
//     return number.toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   }
//   return number;
// };

export const formatNumber = (number) => {
  if (number === null || number === undefined) {
    return ""; 
  }

  if (typeof number === "string") {
    number = parseFloat(number); // แปลง string เป็น number
  }

  if (typeof number === "number" && !isNaN(number)) {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return ""; 
};

export const formatInteger = (number) => {
  if (number === null || number === undefined) {
    return "";
  }

  if (typeof number === "string") {
    number = parseInt(number, 10);
  }

  if (typeof number === "number" && !isNaN(number)) {
    return Math.floor(number).toLocaleString("en-US"); // ใช้ Math.floor และลบ maximumFractionDigits
  }

  return "";
};