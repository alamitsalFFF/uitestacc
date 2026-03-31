import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import DateRangePicker from "../../DataFilters/DateRangePicker"; 
import DateRangePicker from '../DataFilters/DateRangePicker'; 

function DateFilterModal({ open, handleClose, onDateRangeChange, filterStartDate, filterEndDate }) {
  const handleDateChangeAndClose = (startDate, endDate) => {
    onDateRangeChange(startDate, endDate); // ส่งค่าวันที่กลับไป SRList
    handleClose(); // ปิด Modal หลังจากเลือกวันที่
  };

  return (
    <Dialog open={open} onClose={handleClose} 
     // fullWidth 
      // maxWidth="sm" 
      sx={{ // <-- เพิ่ม sx prop ที่นี่
        '& .MuiDialog-paper': { 
          width: '70%', 
          maxWidth: '400px', 
          // minWidth: '250px', 
            borderRadius: 2,
            boxShadow: 5,   
            top: '-17%', 
        },
      }}>
      <DialogTitle>
        กรองข้อมูลตามวันที่
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* ส่งค่า filterStartDate และ filterEndDate ปัจจุบันไปให้ DateRangePicker เพื่อแสดงค่าที่เลือกอยู่ */}
        <DateRangePicker 
          onDateRangeChange={handleDateChangeAndClose} 
          initialStartDate={filterStartDate}
          initialEndDate={filterEndDate}
        />
      </DialogContent>
    </Dialog>
  );
}

export default DateFilterModal;