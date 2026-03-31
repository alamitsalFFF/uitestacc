import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig"; // ใช้ axios ที่กำหนดเอง
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
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
} from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { API_VIEW_RESULT, URL } from "../api/url";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import HeaderBar from "../menu/HeaderBar";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../DataFilters/FloatingActionBar";


function ProductTypeList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productTypeData, setProductTypeData] = useState([]);

  const vMas_ProductType = {
    viewName: "vMas_ProductType",
    parameters: [
      // { field: "IsMaterial", value: "1" },
      // { field: "IsService", value: "0" },
    ],
    results: [
      { sourceField: "ProductTypeID" },
      { sourceField: "ProductTypeCode" },
      { sourceField: "ProductTypeName" },
      { sourceField: "WarehouseCode" },
      { sourceField: "IsMaterial" },
      { sourceField: "IsService" },
      { sourceField: "RateVat" },
      { sourceField: "RateWht" },
      { sourceField: "VatType" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vMas_ProductType:", vMas_ProductType);
        setLoading(true);

        const response = await axios.post(
          `${API_VIEW_RESULT}`,
          vMas_ProductType,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data", response.data);
          setProductTypeData(response.data);
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
  const filteredPrototype = productTypeData.filter((producttype) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    return (
      producttype.ProductTypeName.toLowerCase().includes(searchLower) ||
      producttype.ProductTypeID.toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleEditClick = (ProductTypeID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า ProductType พร้อมส่ง ProductType เป็นพารามิเตอร์
    navigate(`${URL}ProductType?productTypeID=${ProductTypeID}`);
  };
  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า ProductType พร้อมล้าง query parameter
    navigate(`${URL}ProductType`);
  };
  const handleGoBack = () => {
    navigate(`${URL}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleGoMenu = () => {
    navigate(URL);
  };

  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
      onClick: handleAddNew,
    },
  ];

  const searchActions = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ color: "#4301b3" }}
          size="1x"
        />
      ),
      name: "Search Data",
      onClick: handleSearch, // เรียกฟังก์ชันเปิด Modal ค้นหา
    },
  ];

  return (
    <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>
      {/* <h2 style={{ textAlign: "center" }} onClick={handleGoMenu}>TypeProduct</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoMenu}>
              Product Type And Services Type
            </h4>
            <p className="docconfig-subtitle">ประเภทสินค้า/ประเภทบริการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div>
          <CircularButtonGroup actions={buttonActions} />
        </div>
        {/* <div>
          <CircularButtonGroup actions={searchActions} />
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
      {filteredPrototype.map((producttype, producttypeID) => (
        <div
          // className="row" 
          key={producttypeID}
          onClick={() => handleEditClick(producttype.ProductTypeID)}
          style={{
            background: activeIndex === producttypeID ? "#e0e0e0" : "transparent",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h5 style={{ margin: "3px 10px 3px 10px" }}>
                {producttypeID + 1}.&nbsp;{producttype.ProductTypeName}
              </h5>

              <h6 style={{ margin: "3px 10px 3px 10px", color: "GrayText" }}>
                {producttype.ProductTypeCode}/{producttype.WarehouseCode}
              </h6>
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

export default ProductTypeList;
