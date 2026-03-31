// import React, { Component } from "react";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PR from "./Purchase Requisition";

export default function Transaction() {
  const [doctype, setDoctype] = React.useState("");
  const [formData, setFormData] = useState({
    // เก็บข้อมูลในฟอร์ม
    AccDocNo: "",
    AccEffectiveCate: new Date().toISOString().slice(0, 10),
    PartyCode: "",
    PartyTaxCode: "",
    PartyName: "",
    PartyAddress: "",
    DocRefNo: "",
    DocStatus: "",
    AccBatchDate: new Date().toISOString().slice(0, 10),
    IssueBy: "ADMIN",
    AccPostDate: new Date().toISOString().slice(0, 10),
    FiscalYear: new Date().toISOString().slice(0, 10),
  });
  const [apiData, setApiData] = useState(null);

  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setDoctype(selectedCategory); // อัปเดตค่า doctype

    const selectedOption = categoryOptions.find(option => option.value === selectedCategory);
    if (selectedOption) {
      setSelectedEName(selectedOption.label);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);

  };


  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };


  const PR = "PR";
  const SR = "SR";
  const PI = "PI";
  const SI = "SI";

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedEName, setSelectedEName] = useState("");
  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categoryApiUrl = `http://103.225.168.137/apiaccbk2/api/Prototype/DocConfig/GetDocConfig`; // Replace with your actual API URL
        const response = await fetch(categoryApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

       
        if (Array.isArray(data)) {
          setCategoryOptions(
            data.map((item) => ({ value: item.category, label: item.eName }))
          );
        } else {
          console.error("Category API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCategoryOptions();
  }, []);

  const [showButton, setShowButton] = useState(false);

  const fetchDataFromApi = async (doctype) => {
    try {
      // สร้าง URL ของ API ตามประเภทเอกสาร (doctype)
      const apiUrl = `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/GetAccTransactionHD?accDocType=${doctype}`; // ตัวอย่าง URL, แก้ไขตาม API จริง
      // const apiUrl = `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/GetAccTransactionHD`; // ตัวอย่าง URL, แก้ไขตาม API จริง

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setApiData(data); // Update state ด้วยข้อมูลจาก API

      // อัปเดตค่าในฟอร์มด้วยข้อมูลจาก API (ถ้ามี)
      setFormData({
        ...formData,
        AccDocNo: data.accDocNo || "", // ถ้า API ส่งค่า AccDocNo มา ให้ใช้ค่าจาก API, ถ้าไม่ ให้ใช้ค่าว่าง
        AccBatchDate: data.accBatchDate || "",
        AccEffectiveDate: data.accEffectiveDate || "",
        PartyCode: data.partyCode || "",
        PartyTaxCode: data.partyTaxCode || "",
        PartyName: data.partyName || "",
        PartyAddress: data.partyAddress || "",
        
        DocRefNo: data.docRefNo || "",
        DocStatus: data.docStatus || "",
        IssueBy: data.issueBy || "",
        AccPostDate: data.accPostDate || "",
        FiscalYear: data.fiscalYear || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // จัดการ error เช่น แสดงข้อความให้ผู้ใช้
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="row" style={{ padding: "5%" }}>
      <div>&nbsp;</div>
      <div className="col-md-3">
        <Box sx={{ minWidth: 30 }} style={{ width: "100%" }}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={doctype} // Make sure doctype is still used if needed elsewhere
              label="Category"
              onChange={handleChange}
              style={{ fontSize: "18px" }}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {/* {option.label} */}
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="col-md-9">
        <div>&nbsp;</div>
        <TextField
          className="fonts"
          variant="standard"
          id="demo-simple-select"
          onChange={handleChange}
          // value={doctype}
          value={selectedEName}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        >
          <MenuItem value={PR}>Purchase Requisition</MenuItem>
          <MenuItem value={SR}>Sales Requisition</MenuItem>
          <MenuItem value={PI}>Payment Invoice</MenuItem>
          <MenuItem value={SI}>Sale Invoice</MenuItem>
        </TextField>
      </div>
      <div>&nbsp;</div>
          <PR />
    </div>
  );
}
