import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TAWAN_logo from "../../components/img/TAWAN_logo.png";
import tawan from "../../components/img/tawan.jpg";
import logo_chmt from "../../components/img/logo_chmt.png";
import en from "../../components/img/en.png";
import th from "../../components/img/thai.png";
import ENus from "../../components/img/tawan.jpg";
import THAI_LOGO from "../../components/img/THAI_LOGO.png";
import EN_LOGO from "../../components/img/EN_LOGO.png";
import { URL } from "../api/url";

export default function HeaderBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userName = localStorage.getItem("userName") || "";

  // สำหรับเมนูภาษา
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const langMenuOpen = Boolean(langAnchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // เปิดเมนูภาษา
  const handleLangAvatarClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };
  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  // ตัวอย่างเปลี่ยนภาษา (คุณต้องเพิ่ม logic เปลี่ยนภาษาเอง)
  const handleSelectLang = (lang) => {
    alert(`เปลี่ยนภาษาเป็น: ${lang}`);
    setLangAnchorEl(null);
  };

  const handleProfile = () => {
    window.location.href = `${URL}CompanyProfile`;
  };
  const handleLogout = () => {
    // ลบ token หรือข้อมูล user ออกจาก localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    // redirect ไปหน้า Login (หรือหน้าแรก)
    window.location.href = `${URL}Login`;
    // หรือถ้าใช้ useNavigate จาก react-router-dom:
    // navigate("/uitestacc/Login");
  };

  return (
    <div style={{ display: "flex", padding: "3px", alignItems: "center", justifyContent: "flex-end" }}>
      <Stack direction="row" spacing={2}>
        <Box
          component="img"
          // src={logo_chmt}
          src={tawan}
          alt="Tawan"
          sx={{
            height: { xs: "40px", sm: "50px", md: "60px", lg: "80px" },
            width: "auto",
            cursor: "pointer",
          }}
          onClick={handleAvatarClick}
        />
        {/* Avatar สำหรับเปลี่ยนภาษา */}
        {/* <Avatar
          alt="EN"
          src={en}
          sx={{ width: 25, height: 25, cursor: "pointer" }}
          onClick={handleLangAvatarClick}
        /> */}
      </Stack>
      {/* เมนูโปรไฟล์ */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>
          <Stack direction="row" spacing={1} alignItems="center">
            <span style={{ fontWeight: "bold", color: "#1976d2", paddingTop: "10px" }}>{userName}</span>
            <Avatar
              alt="User"
              src={EN_LOGO}
              variant="square"
              sx={{ width: 30, height: 25, cursor: "pointer", borderRadius: 0 }}
              onClick={handleLangAvatarClick} // เพิ่มตรงนี้
            />
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {/* เมนูเลือกภาษา */}
      <Menu
        anchorEl={langAnchorEl}
        open={langMenuOpen}
        onClose={handleLangMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleSelectLang("en")}>
          <Avatar alt="EN" src={en} sx={{ width: 20, height: 20, marginRight: 1 }} />
          English
        </MenuItem>
        <MenuItem onClick={() => handleSelectLang("th")}>
          <Avatar alt="TH" src={th} sx={{ width: 20, height: 20, marginRight: 1 }} />
          ไทย
        </MenuItem>
      </Menu>
    </div>
  );
}