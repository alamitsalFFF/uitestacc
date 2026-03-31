import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE, URL } from "../../api/url";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import HeaderBar from "../../menu/HeaderBar";
import { IconButton, Tooltip, Typography } from "@mui/material";

function AccConfigList() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accConfigData, setAccConfigData] = useState([]);
  const [uniqueAccConfigs, setUniqueAccConfigs] = useState([]);

  useEffect(() => {
    const fetchAccConfig = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig`
        );
        if (response.status === 200 && response.data.length > 0) {
          setAccConfigData(response.data);
        } else {
          console.error("Failed to fetch accconfig data");
        }
      } catch (error) {
        console.error("Error fetching accconfig data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAccConfig();
  }, []);

  useEffect(() => {
    // สร้าง Set ของ configCode ที่ไม่ซ้ำกัน
    const uniqueCodes = new Set(accConfigData.map((config) => config.configCode));
    // กรอง accConfigData เพื่อให้เหลือเฉพาะรายการแรกของแต่ละ configCode ที่ไม่ซ้ำกัน
    const uniqueConfigs = Array.from(uniqueCodes).map((code) =>
      accConfigData.find((config) => config.configCode === code)
    ).filter(Boolean); // filter(Boolean) เพื่อกำจัดค่า undefined ที่อาจเกิดขึ้น
    setUniqueAccConfigs(uniqueConfigs);
  }, [accConfigData]);

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };

  const filteredAccConfig = uniqueAccConfigs.filter((accConfig) => {
    // กรองข้อมูลจากรายการที่ไม่ซ้ำกัน
    const searchLower = searchTerm.toLowerCase();
    return (
      accConfig.configCode.toLowerCase().includes(searchLower) ||
      accConfig.configKey.toString().toLowerCase().includes(searchLower)
    );
  });

  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const handleEditClick = (configCode) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า AccConfig พร้อมส่ง configCode เป็นพารามิเตอร์
    navigate(`/uitestacc/AccConfig?configCode=${configCode}`);
  };

  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า AccConfig พร้อมล้าง query parameter
    navigate(`${URL}AccConfig`);
  };

  const handleGoBack = () => {
    navigate(URL);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
      onClick: handleAddNew,
    },
    // {
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faMagnifyingGlass}
    //       style={{ color: "#4301b3" }}
    //       size="1x"
    //     />
    //   ),
    //   name: "Search Data",
    //   onClick: handleSearch, // เรียกฟังก์ชันเปิด Modal ค้นหา
    // },
  ];
  return (
    <div style={{ paddingLeft: "3%", paddingRight: "3%", paddingTop: "10px" }}>
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Configs
            </h4>
            <p className="docconfig-subtitle">ตั้งค่าอื่นๆ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
        <div>
          <CircularButtonGroup actions={buttonActions} />
        </div>
        <div style={{ marginLeft: "auto" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
          ) : (
            <Tooltip
              title={<Typography variant="caption" sx={{ fontSize: '0.9rem' }}>Search Data</Typography>}
              arrow
              placement="top"
            >
              <IconButton
                aria-label="Search Data"
                onClick={toggleSearch}
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
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4301b3" }} size="1x" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      {/* <ul> */}
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none" }}
      />
      {filteredAccConfig.map((accConfig, index) => (
        <div key={accConfig.configCode} onClick={() => handleEditClick(accConfig.configCode)}>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ marginLeft: "10px" }}>{index + 1}.{accConfig.configCode}</h5>
          </ListItem>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
        </div>
      ))}
      {/* </ul> */}
      <div style={{ marginTop: "40px" }}  >&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default AccConfigList;