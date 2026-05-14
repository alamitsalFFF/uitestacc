import React from 'react';
function Abbreviations({ textName }) {
  const shortName = textName.length > 25 ? textName.substring(0, 25) + '...' : textName;
  console.log("shortName:", shortName);
  return <span style={{ whiteSpace: 'normal' }} title={textName}>{shortName}</span>; //title={textName} แสดงข้อความเต็มเมื่อ hover
}
export default Abbreviations;