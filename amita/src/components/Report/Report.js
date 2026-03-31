import React, { useState } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

// สมมติว่ามีค่าเหล่านี้จากไฟล์ api/url หรือ config
import { API_BASE, Base, DATA_BASE, REPORT_BASE } from "../api/url";

const ReportPage = () => {
  const [formData, setFormData] = useState({
    dateFrom: null,
    dateTo: null,
    name: '',
    status: '',
    reportType: 'Purchase', // กำหนดค่าเริ่มต้นตามภาพ
  });

  const reportOptions = [
    { value: 'Purchase', label: 'Purchase Report' },
    { value: 'Sales', label: 'Sales Report' },
    // เพิ่มรายงานอื่นๆ ที่ต้องการ
  ];

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePrint = () => {
    const params = new URLSearchParams();
    params.append('DB', DATA_BASE);
    params.append('SRC', Base);
    if (formData.reportType) {
      params.append('Form', `Report`+formData.reportType);
    }
    // params.append('From', 'Report');
    // เพิ่มค่าจากฟอร์มเข้าไปใน URL
    if (formData.dateFrom) {
      params.append('DateFrom', formData.dateFrom.toISOString().slice(0, 10));
    }
    if (formData.dateTo) {
      params.append('DateTo', formData.dateTo.toISOString().slice(0, 10));
    }
    if (formData.name) {
      params.append('Name', formData.name);
    }
    if (formData.status) {
      params.append('Status', formData.status);
    }


    const reportUrl = `${REPORT_BASE}?${params.toString()}`;

    // เปิด URL ในแท็บใหม่
    //http://203.154.140.51/AccReport?DB=Acctest2&SRC=Acctest2&Form=ReportPurchase&DateFrom=2025-07-01&DateTo=2025-07-31
    //http://203.154.140.51/AccReport?DB=Acctest2&SRC=Acctest2&Form=ReportPurchase&DateFrom=2025-05-01&DateTo=2025-07-31&Status=1&PartyName=%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97%E0%B8%95%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B52%20%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94
    
    //http://203.154.140.51/AccReport?DB=Acctest2&SRC=Acctest2&From=Report&DateFrom=2025-07-04&DateTo=2025-08-04&ReportType=Purchase
    
    window.open(reportUrl, '_blank');
  };

  return (
    <Box sx={{ p: 3, background: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Report
      </Typography>
      {/* <Grid container spacing={3} alignItems="center"> */}
        {/* Date From */}
        {/* <Grid item xs={12} sm={4}> */}
          <Typography variant="body1" sx={{ mb: 1 }}>Date From:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label=""
              value={formData.dateFrom}
              onChange={(newDate) => handleDateChange(newDate, 'dateFrom')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        {/* </Grid> */}
        
        {/* Date To */}
        {/* <Grid item xs={12} sm={4}> */}
          <Typography variant="body1" sx={{ mb: 1 }}>Date To:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label=""
              value={formData.dateTo}
              onChange={(newDate) => handleDateChange(newDate, 'dateTo')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        {/* </Grid> */}

        {/* Status */}
        {/* <Grid item xs={12} sm={4}> */}
          <Typography variant="body1" sx={{ mb: 1 }}>Status:</Typography>
          <TextField
            fullWidth
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />
        {/* </Grid> */}

        {/* Name */}
        {/* <Grid item xs={12} sm={4}> */}
          <Typography variant="body1" sx={{ mb: 1 }}>Name:</Typography>
          <TextField
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        {/* </Grid> */}

        {/* Report Dropdown */}
        {/* <Grid item xs={12} sm={4}> */}
          <Typography variant="body1" sx={{ mb: 1 }}>Report:</Typography>
          <TextField
            select
            fullWidth
            name="reportType"
            value={formData.reportType}
            onChange={handleInputChange}
            label=""
          >
            {reportOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        {/* </Grid> */}
      {/* </Grid> */}
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={handlePrint} 
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default ReportPage;