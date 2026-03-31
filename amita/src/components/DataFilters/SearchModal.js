import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import SearchComponent from "../../purchase/SearchComponen"; 
import SearchComponent from '../purchase/SearchComponen'; 

function SearchModal({ open, handleClose, onSearch, searchTerm }) {
  const handleSearchAndClose = (term) => {
    onSearch(term); // ส่งค่าค้นหากลับไป SRList
    handleClose(); // ปิด Modal หลังจากค้นหา
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
        ค้นหาข้อมูล
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
      <DialogContent dividers //style={{width: '90%'}}
      >
        <SearchComponent onSearch={handleSearchAndClose} initialSearchTerm={searchTerm} />
      </DialogContent>
    </Dialog>
  );
}

export default SearchModal;