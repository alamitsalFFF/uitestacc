import * as React from 'react';
import Dialog from '@mui/material/Dialog'; // เปลี่ยนจาก Popover เป็น Dialog
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// export default function AppsMenuDialog({ open, handleClose, actions }) { // ไม่ต้องรับ anchorEl แล้ว
//   const itemsPerRow = 3;

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       // BackdropProps={{ invisible: false }} // ปกติ Dialog มี Backdrop อยู่แล้ว ไม่ต้องกำหนด
//       sx={{
//         '& .MuiDialog-paper': { // กำหนด style ให้กับ Dialog paper (ตัว Dialog เอง)
//           borderRadius: 2, // เพิ่มความโค้งมน
//           boxShadow: 5,   // เพิ่มเงา
//           width: '30%', // ทำให้ Dialog กว้างตามที่คุณต้องการ
//           minWidth: '250px', // กำหนดความกว้างขั้นต่ำ
//           maxWidth: '400px', // กำหนดความกว้างสูงสุด
//           // สามารถกำหนดตำแหน่งของ Dialog ได้ด้วย
//           position: 'absolute', // ทำให้สามารถจัดตำแหน่งได้
//           top: '25%', // กำหนดตำแหน่งจากด้านบน
//           right: '17%', // กำหนดตำแหน่งจากด้านขวา
//           margin: 0, // ลบ margin เริ่มต้นออก
//         },
//         '& .MuiBackdrop-root': { // กำหนด style ให้กับ Backdrop
//           backgroundColor: 'rgba(0, 0, 0, 0.5)', // สีดำโปร่งแสง 50%
//         },
//       }}
//     >
//       <Box sx={{ p: 2 }}>
//         <Grid container spacing={2} sx={{ width: 'auto' }}>
//           {actions.map((action) => (
//             <Grid item xs={12 / itemsPerRow} key={action.name} sx={{ textAlign: 'center' }}>
//               <IconButton
//                 aria-label={action.name}
//                 onClick={() => {
//                   action.onClick();
//                   handleClose();
//                 }}
//                 disabled={action.disabled}
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   width: '100%',
//                   p: 1,
//                   '&:hover': {
//                     backgroundColor: 'action.hover',
//                   },
//                 }}
//               >
//                 {/* ไอคอน */}
//                 {action.icon}
//                 {/* ชื่อไอคอน */}
//                 <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.75rem', lineHeight: 1.2, color: 'text.secondary' }}>
//                   {action.name}
//                 </Typography>
//               </IconButton>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Dialog>
//   );
// }

export default function AppsMenuDialog({ open, handleClose, actions }) {
  const itemsPerRow = 3;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: 5,
          width: '30%',
          minWidth: '250px',
          maxWidth: '400px',
          position: 'absolute',
          top: '25%',
          right: '17%',
          margin: 0,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ width: 'auto' }}>
          {actions.map((action) => (
            <Grid item xs={12 / itemsPerRow} key={action.name} sx={{ textAlign: 'center' }}>
              <IconButton
                aria-label={action.name}
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                disabled={action.disabled}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                {action.icon}
                <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.75rem', lineHeight: 1.2, color: 'text.secondary' }}>
                  {action.name}
                </Typography>
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
}