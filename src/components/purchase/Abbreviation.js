import React from 'react';
function Abbreviation({ textName }) {
  const shortName = textName.length > 6 ? textName.substring(0, 6) + '...' : textName;
  console.log("shortName:", shortName); 
  return <span style={{ whiteSpace: 'normal' }} title={textName}>{shortName}</span>; //title={textName} แสดงข้อความเต็มเมื่อ hover
}
export default Abbreviation;