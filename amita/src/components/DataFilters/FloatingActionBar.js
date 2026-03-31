import React from 'react';
import { Box, Button } from '@mui/material';
import { FaArrowLeft, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // ต้องใช้ navigate ภายใน component

/**
 * คอมโพเนนต์แถบเมนูลอยด้านล่าง (Floating Action Bar)
 * ประกอบด้วยปุ่ม Back และปุ่ม Scroll To Top
 *
 * @param {object} props
 * @param {string} props.backPath - URL ที่จะ navigate ไปเมื่อกดปุ่ม Back
 */
function FloatingActionBar({ backPath }) {
  const navigate = useNavigate();

  // 1. ฟังก์ชันสำหรับการนำทางกลับ (ใช้ backPath ที่ส่งเข้ามา)
  const handleGoMenu = () => {
    navigate(backPath);
  };

  // 2. ฟังก์ชันสำหรับการเลื่อนกลับไปด้านบนสุดของหน้า
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        // ควรใช้ความกว้างที่สัมพันธ์กับ container หลัก, ถ้าใช้ 93% อาจต้องปรับให้เหมาะสมกับ viewport
        width: '93%',
        maxWidth: '1200px', // อาจกำหนด MaxWidth เพื่อให้ดูดีบนหน้าจอขนาดใหญ่
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000, // สำคัญ: กำหนด z-index ให้สูงกว่าองค์ประกอบอื่น ๆ
      }}
    >
      {/* --- ส่วนปุ่ม Back --- */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          paddingTop: 2,
          borderRadius: '25px !important',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={handleGoMenu}
          // sx={{
          //   color: 'green',
          //   borderColor: 'green',
          //   borderRadius: '25px',
          //   '&:hover': {
          //     borderColor: 'darkgreen',
          //     backgroundColor: 'rgba(0, 128, 0, 0.04)',
          //   },
          // }}
          sx={{
            px: 2,
            py: 1,
            // color: "#c62828",
            color: "#ffffff",
            borderColor: "#ef9a9a",
            borderWidth: 1,
            borderRadius: "25px",
            fontWeight: "600",
            // background: "transparent",
            background: "#ff0000",
            transition: "all 0.3s ease",
            '&:hover': {
              color: "#ff0000",
              backgroundColor: '#ffebee',
              borderColor: '#c62828',
              transform: "translateX(-4px)",
              boxShadow: "0 4px 12px rgba(198, 40, 40, 0.15)"
            }
          }}
        >
          Back
        </Button>
      </Box>

      {/* --- ส่วนปุ่ม Scroll To Top --- */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          paddingTop: 2,
          borderRadius: '25px !important',
        }}
      >
        <Button
          variant="outlined"
          endIcon={<FaArrowUp />}
          onClick={scrollToTop}
          // sx={{
          //   color: 'green',
          //   borderColor: 'green',
          //   borderRadius: '25px',
          //   '&:hover': {
          //     borderColor: 'darkgreen',
          //     backgroundColor: 'rgba(0, 128, 0, 0.04)',
          //   },
          // }}
          sx={{
            px: 2,
            py: 1,
            // color: "#c62828",
            color: "#ffffff",
            borderColor: "#ef9a9a",
            borderWidth: 1,
            borderRadius: "25px",
            fontWeight: "600",
            // background: "transparent",
            background: "#ff0000",
            transition: "all 0.3s ease",
            // backgroundColor: '#ffebee',

            '&:hover': {
              color: "#ff0000",
              // backgroundColor: 'transparent',
              backgroundColor: '#ffffff',
              borderColor: '#c62828',
              transform: "translateX(-4px)",
              boxShadow: "0 4px 12px rgba(198, 40, 40, 0.15)"
            }
          }}
        >
          Top
        </Button>
      </Box>
    </div>
  );
}

export default FloatingActionBar;