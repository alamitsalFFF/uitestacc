import React, { useState,useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Box from '@mui/material/Box';

function SearchComponent({ onSearch,initialSearchTerm }) {
  // const [searchTerm, setSearchTerm] = useState("");
 const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  useEffect(() => {
    setSearchTerm(initialSearchTerm || "");
  }, [initialSearchTerm]);

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  //   // onSearch(event.target.value); // ส่งค่าค้นหาไปยัง PurchaseRequisitionList
  // };


  // return (
  //   <Box sx={{ display: "flex", alignItems: "flex-end" }}>
  //     <TextField id="input-with-sx"  variant="standard" onChange={handleSearchChange} value={searchTerm} />
  //     <FontAwesomeIcon
  //       icon={faMagnifyingGlass}
  //       size="1x"
  //       style={{ color: "#2f9901" }}
  //     />
  //   </Box>
  // );

   const handleInputChange = (event) => { // เปลี่ยนชื่อ function เพื่อความชัดเจน
    setSearchTerm(event.target.value);
    // ไม่เรียก onSearch ที่นี่แล้ว!
  };

  const handleApplySearch = () => { // เพิ่ม function สำหรับปุ่มค้นหา
    onSearch(searchTerm); // ส่งค่าค้นหาเมื่อกดปุ่มเท่านั้น
  };

  // ตัวอย่าง: ถ้าต้องการให้กด Enter แล้วค้นหาด้วย
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplySearch();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}> {/* เพิ่ม gap */}
      <TextField 
        id="search-input" 
        label="ป้อนคำค้นหา" 
        variant="outlined" 
        size="small" 
        onChange={handleInputChange} 
        onKeyPress={handleKeyPress} // เพิ่ม onKeyPress
        value={searchTerm} 
        fullWidth // ทำให้ TextField ขยายเต็มพื้นที่
      />
      <Button variant="contained" onClick={handleApplySearch}>
        ค้นหา {/* เพิ่มปุ่มค้นหา */}
      </Button>
    </Box>
  );

}


export default SearchComponent;
