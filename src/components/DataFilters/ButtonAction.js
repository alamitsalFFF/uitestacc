import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// เปลี่ยนจาก AppsIcon เป็น MenuIcon
import MenuIcon from '@mui/icons-material/Menu'; // ไอคอนขีด 3 ขีด

// Import Component ที่สร้างขึ้นใหม่
import MenuDialog from './MenuDialog'; 
// import AppsMenuPopover 

export default function ButtonAction({ actions }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'apps-menu-popover' : undefined;

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', width: '100%', p: 1 }}>
      {/* ปุ่มขีด 3 ขีด */}
      <IconButton
        aria-describedby={id}
        aria-label="open menu" // เปลี่ยน aria-label ให้สอดคล้องกับไอคอน
        onClick={handleClick}
        color="inherit"
      >
        <MenuIcon /> {/* ใช้ MenuIcon แทน AppsIcon */}
      </IconButton>

      {/* Popover ที่แสดง Grid ของไอคอน */}
      <MenuDialog
        id={id}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        actions={actions}
      />
    </Box>
  );
}