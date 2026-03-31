import React, { useState, useEffect } from 'react';
import './Menu1.css';
import { Warehouse } from './Warehouse';
import { Products } from './Product Group';
import { ProductTypes } from './ProductTypes';
import { Link, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useAuthFetch } from '../../src/components/Auth/fetchConfig';
import { API_BASE } from './api/url';

const componentMap = {
  '/Warehouse': Warehouse,
  '/Product Group': Products,
  '/ProductTypes': ProductTypes
};

function MenuAPI2() {
  const [mainMenuData, setMainMenuData] = useState([]);
  const [subMenuData, setSubMenuData] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const authFetch = useAuthFetch();
  useEffect(() => {
    const fetchMenus = async () => {
      const [mainMenuResponse, subMenuResponse] = await Promise.all([
        authFetch(`${API_BASE}/Module/GetModule`),
        authFetch(`${API_BASE}/Module/GetModuleMenu`),
      ]);

      setMainMenuData(await mainMenuResponse.json());
      setSubMenuData(await subMenuResponse.json());
    };

    fetchMenus();
  }, []);

  const createSubMenuItem = (subMenu, subMenuData) => {
    const nestedSubMenus = subMenuData
      .filter(nestedSubMenu => nestedSubMenu.headMenuID === subMenu.menuID)
      .sort((a, b) => a.seq - b.seq);

    const handleClick = () => {
      // Handle click for menu items without webAddress, if needed
    };

    return (
        <Card key={subMenu.menuID} sx={{ minWidth: 200, margin: 1 }}> {/* Card Styling */}
          <CardActionArea onClick={subMenu.webAddress ? null : handleClick}> {/* Conditional onClick */}
            <CardContent>
              <Typography variant="h6" component="div">
                {subMenu.menuNameEN}
              </Typography>
              {nestedSubMenus.length > 0 && (
                <ul className="submenu">
                  {nestedSubMenus.map(nestedSubMenu =>
                    createSubMenuItem(nestedSubMenu, subMenuData)
                  )}
                </ul>
              )}
            </CardContent>
          </CardActionArea>
          {subMenu.webAddress && ( // Render Link outside CardActionArea for proper routing
            <Link to={subMenu.webAddress} style={{ display: 'none' }}></Link>
          )}
        </Card>
    );
  };


  const toggleSubMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}> {/* Use Box for card layout */}
      {mainMenuData.map(mainMenu => (
        <Card key={mainMenu.moduleID} sx={{ minWidth: 200, margin: 1 }}> {/* Card for Main Menu */}
          <CardActionArea onClick={() => toggleSubMenu(mainMenu.moduleID)}>
            <CardContent>
              <Typography variant="h5" component="div">
                {mainMenu.moduleNameEN}
                <span className="arrow">{openMenus[mainMenu.moduleID] ? '▲' : '▼'}</span>
              </Typography>
            </CardContent>
          </CardActionArea>
          {openMenus[mainMenu.moduleID] && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}> {/* Box for Submenu Cards */}
              {subMenuData
                .filter(subMenu => subMenu.moduleID === mainMenu.moduleID && !subMenu.headMenuID)
                .sort((a, b) => a.seq - b.seq)
                .map(subMenu => (
                  createSubMenuItem(subMenu, subMenuData)
                ))}
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
}

export default MenuAPI2;