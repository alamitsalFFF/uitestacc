import React, { useState, useEffect } from "react";
import "./APIMenu.css";
import { Warehouse } from "./Warehouse";
import { Products } from "./Product Group";
import { ProductTypes } from "./ProductTypes";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import { API_BASE } from "./api/url";
import { useAuthFetch } from "../../src/components/Auth/fetchConfig";
import Grid from "@mui/material/Grid";

const MainCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  height: 120,
  margin: '8px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  cursor: 'pointer',
}));

// สไตล์สำหรับ Card รายการย่อย
const SubCard = styled(Card)(({ theme, level = 0 }) => ({
  minWidth: 180,
  height: 100,
  margin: '8px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  backgroundColor: level === 0 ? '#f8f9fa' : 
                   level === 1 ? '#f1f3f4' : 
                   '#e8eaed',
  border: `1px solid ${theme.palette.grey[300]}`,
}));
function APIMenu() {
  const [mainMenuData, setMainMenuData] = useState([]);
  const [subMenuData, setSubMenuData] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  // จำลอง authFetch และ API_BASE สำหรับตัวอย่าง
  // const authFetch = async (url) => {
  //   return fetch(url);
  // };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [mainMenuResponse, subMenuResponse] = await Promise.all([
          authFetch(`${API_BASE}/Module/GetModule`),
          authFetch(`${API_BASE}/Module/GetModuleMenu`),
        ]);

        setMainMenuData(await mainMenuResponse.json());
        setSubMenuData(await subMenuResponse.json());
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // ฟังก์ชันสำหรับจัดการการคลิกเมนู
   const handleMenuClick = (menu, level = 0) => {
    // ถ้ามี webAddress ให้ navigate ไปเลย
    if (menu.webAddress) {
      navigate(menu.webAddress);
      return;
    }

    // ถ้าไม่มี webAddress ให้ toggle การเปิดปิดเมนูย่อย
    const menuId = menu.moduleID || menu.menuID;
    
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };
  // ฟังก์ชันตรวจสอบว่ามีเมนูย่อยหรือไม่
  const hasSubMenus = (menuId, isModule = false) => {
    return subMenuData.some(subMenu => 
      isModule ? 
      subMenu.moduleID === menuId && !subMenu.headMenuID :
      subMenu.headMenuID === menuId
    );
  };

  // ฟังก์ชันดึงเมนูย่อย
  const getSubMenus = (parentId, isModule = false) => {
    return subMenuData.filter(subMenu => 
      isModule ? 
      subMenu.moduleID === parentId && !subMenu.headMenuID :
      subMenu.headMenuID === parentId
    ).sort((a, b) => a.seq - b.seq);
  };

  // ฟังก์ชันสร้างเมนูย่อยแบบ recursive
  const renderSubMenus = (parentId, level = 0, isModule = false) => {
    const subMenus = getSubMenus(parentId, isModule);

    if (subMenus.length === 0) return null;

    return (
      <Collapse in={openMenus[parentId]} timeout="auto" sx={{ width: '100%' }}>
        <Box sx={{ 
          width: '100%',
          padding: '16px 0',
          marginLeft: level > 0 ? `${level * 20}px` : '0px',
          borderLeft: level > 0 ? `2px solid ${level % 2 === 0 ? '#e0e0e0' : '#d0d0d0'}` : 'none'
        }}>
          <Grid container spacing={2} sx={{ width: '100%' }}>
            {subMenus.map(menu => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={menu.menuID}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <SubCard level={level}>
                    <CardActionArea 
                      sx={{ height: '100%' }}
                      onClick={() => handleMenuClick(menu, level)}
                    >
                      <CardContent sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        textAlign: 'center',
                        padding: '12px'
                      }}>
                        <Typography 
                          variant={level === 0 ? "h6" : "body1"}
                          component="div"
                          sx={{ 
                            fontWeight: level === 0 ? 600 : 500,
                            fontSize: level === 0 ? '1rem' : '0.9rem',
                            marginBottom: '4px',
                            lineHeight: 1.2
                          }}
                        >
                          {menu.menuNameEN}
                        </Typography>
                        {/* แสดงลูกศรถ้ามีเมนูย่อยอีก */}
                        {hasSubMenus(menu.menuID) && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem'
                            }}
                          >
                            <span>ดูย่อย</span>
                            <span style={{ fontSize: '10px' }}>
                              {openMenus[menu.menuID] ? '▲' : '▼'}
                            </span>
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </SubCard>
                  
                  {/* ⭐ แก้ไข: เรียก renderSubMenus โดยไม่ต้องตรวจสอบ openMenus ก่อน ⭐ */}
                  {renderSubMenus(menu.menuID, level + 1, false)}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    );
  };

  return (
    <Box sx={{ 
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* เมนูหลัก */}
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {mainMenuData.map(mainMenu => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={mainMenu.moduleID}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MainCard>
                <CardActionArea 
                  sx={{ height: '100%' }}
                  onClick={() => handleMenuClick(mainMenu, 0)}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    textAlign: 'center',
                    padding: '16px'
                  }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {mainMenu.moduleNameEN}
                    </Typography>
                    {/* แสดงลูกศรถ้ามีเมนูย่อย */}
                    {hasSubMenus(mainMenu.moduleID, true) && (
                      <Typography variant="caption" sx={{ mt: 1, opacity: 0.8, fontSize: '0.75rem' }}>
                        {openMenus[mainMenu.moduleID] ? '▲' : '▼'} ดูย่อย
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </MainCard>
              
              {/* เมนูย่อยระดับที่ 1 */}
              {renderSubMenus(mainMenu.moduleID, 0, true)}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
export default APIMenu;
