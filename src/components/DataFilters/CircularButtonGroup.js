import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'; // ใช้ในกรณีที่ต้องการแสดงข้อความใต้ไอคอน
import Tooltip from '@mui/material/Tooltip';
export default function CircularButtonGroup({ actions }) {
  return (
    <Box
      sx={{
        display: 'flex',              // ใช้ Flexbox ในการจัดเรียง
        flexWrap: 'wrap',             // ทำให้ปุ่มขึ้นบรรทัดใหม่ได้เมื่อพื้นที่ไม่พอ
        justifyContent: 'flex-start', // จัดเรียงปุ่มชิดซ้าย (หรือเปลี่ยนเป็น 'center' ถ้าต้องการตรงกลาง)
        alignItems: 'center',         // จัดเรียงปุ่มแนวตั้งในแต่ละแถวให้อยู่กึ่งกลาง
        gap: { xs: 1, sm: 2 },        // กำหนดระยะห่างระหว่างปุ่ม (ปรับตามขนาดจอได้)
        p: 1,                         // Padding รอบๆ กลุ่มปุ่มทั้งหมด
        width: '100%',                // ให้ Box ใช้ความกว้างเต็มพื้นที่ของ parent
        
      }}
    >
{actions.map((action) => (
        <Tooltip
          key={action.name}
          title={
            <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
              {action.name}
            </Typography>
          }
          arrow
          // placement="bottom"
          placement="top" //top-start=บนซ้าย,top=บนกลาง,top-end=บนขวา, bottom-start=ล่างซ้าย,bottom=ล่างกลาง,bottom-end=ล่างขวา
        >
          <IconButton
            aria-label={action.name}
            onClick={action.onClick}
            disabled={action.disabled}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              boxShadow: 2,
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              flexShrink: 0,
              p: 0.5,
            }}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}