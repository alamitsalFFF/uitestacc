import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
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
import SearchComponent from "../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE, API_VIEW_RESULT, URL } from "../api/url";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import HeaderBar from "../menu/HeaderBar";

function WarehouseList() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [warehouseData, setWarehouseData] = useState([]);

  const vMas_Warehouse = {
    viewName: "vMas_Warehouse",
    parameters: [
      // { field: "", value: "" }, // การกรองข้อมูล
    ],
    results: [
      { sourceField: "WarehouseID" },
      { sourceField: "WarehouseCode" },
      { sourceField: "Name" },
      { sourceField: "Location" },
      { sourceField: "Address" },
      { sourceField: "AssetAccCode" },
      { sourceField: "IncomeAccCode" },
      { sourceField: "ExpenseAccCode" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vMas_Warehouse:", vMas_Warehouse);
        setLoading(true);

        const response = await axios.post(
          `${API_VIEW_RESULT}`,
          vMas_Warehouse,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data", response.data);
          setWarehouseData(response.data);
        } else {
          setLoading(false);
          console.error("Error:", response.statusText);
          // setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error("Error:", error);
        // setError(error.message);
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };
  const filteredWarehouse = warehouseData.filter((warehouse) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    return (
      warehouse.Name.toLowerCase().includes(searchLower) ||
      warehouse.WarehouseCode.toLowerCase().includes(searchLower) ||
      warehouse.WarehouseID.toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleEditClick = (WarehouseID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Warehouse พร้อมส่ง warehouseID เป็นพารามิเตอร์
    navigate(`${URL}Warehouse?warehouseID=${WarehouseID}`);
  };
  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Warehouse พร้อมล้าง query parameter
    navigate(`${URL}Warehouse`);
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
    <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoBack}>&nbsp;Warehouse GL&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Warehouse GL
            </h4>
            <p className="docconfig-subtitle">คลังสินค้า</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <CircularButtonGroup actions={buttonActions} />
        </div>
        {/* <div style={{ marginLeft: "auto" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="1x"
              style={{
                color: "#4301b3",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 30,
                borderRadius: '50%',
                boxShadow: 2,
                bgcolor: 'background.paper',
                // color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                flexShrink: 0,
                p: 0.5,
                fontSize: '0.9rem'
              }}
              onClick={toggleSearch}
            />
          )}
        </div> */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} />
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
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none" }}
      />
      {/* <ul> */}
      {filteredWarehouse.map((warehouse, warehouseID) => (
        <div key={warehouseID} onClick={() => handleEditClick(warehouse.WarehouseID)}
          style={{
            background: activeIndex === warehouseID ? "#e0e0e0" : "transparent",
            cursor: "pointer",
            borderRadius: "6px",
          }}>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h5 style={{
                margin: "3px 10px 3px 10px"
                //marginLeft: "10px", marginTop: "10px" //,fontWeight:"bold"
              }}>{warehouseID + 1}.{warehouse.Name}</h5>
              <h6 style={{
                color: "GrayText", margin: "3px 10px 3px 10px" //marginRight: "10px", marginTop: "10px"
              }}>{warehouse.WarehouseCode}</h6>
            </div>
          </ListItem>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
        </div>
      ))}
      {/* </ul> */}
      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default WarehouseList;
