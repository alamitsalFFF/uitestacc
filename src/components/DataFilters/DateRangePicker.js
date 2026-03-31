import React, { useState,useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import dayjs from 'dayjs';

function DateRangePicker({ onDateRangeChange, initialStartDate, initialEndDate }) {
  const [startDate, setStartDate] = useState(initialStartDate ? dayjs(initialStartDate) : null);
  const [endDate, setEndDate] = useState(initialEndDate ? dayjs(initialEndDate) : null);

    // useEffect เพื่ออัปเดต state หาก initialStartDate/EndDate เปลี่ยนแปลงจากภายนอก
  useEffect(() => {
    setStartDate(initialStartDate ? dayjs(initialStartDate) : null);
    setEndDate(initialEndDate ? dayjs(initialEndDate) : null);
  }, [initialStartDate, initialEndDate]);

  const handleApplyFilter = () => {
    const formattedStartDate = startDate ? dayjs(startDate).startOf('day').format("YYYY-MM-DD") : null;
    const formattedEndDate = endDate ? dayjs(endDate).endOf('day').toISOString() : null;
    console.log("Applying filter:", formattedStartDate, formattedEndDate); 
    onDateRangeChange(formattedStartDate, formattedEndDate);
  };

 return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        <DatePicker
          label="วันที่เริ่มต้น"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
        <DatePicker
          label="วันที่สิ้นสุด"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
        {/* <Button variant="contained" onClick={handleApplyFilter}>
          ค้นหาตามวันที่
        </Button> */}
      </Box>
       <Button variant="contained" onClick={handleApplyFilter} style={{justifyContent: 'center', display: 'flex', marginLeft: 'auto'}}>
          ค้นหาตามวันที่
        </Button>
    </LocalizationProvider>
  );
}

export default DateRangePicker;