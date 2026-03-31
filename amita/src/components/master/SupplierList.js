import React, { useState, useEffect } from "react";
// import axios from "../../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE, URL } from "../api/url";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import HeaderBar from "../menu/HeaderBar";
import { IconButton, Tooltip, Typography } from "@mui/material";

export default function SupplierList() {
  const [listSupplier, setSupplier] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const Supplier = `${API_BASE}/Supplier/GetSupplier`;
        const response = await authFetch(Supplier);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setSupplier(data);
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchSupplier();
  }, []);

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };

  const filteredSupplier = listSupplier.filter((supplier) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    return (
      (supplier.supplierName || "").toLowerCase().includes(searchLower) ||
      (supplier.supplierEName || "").toLowerCase().includes(searchLower) ||
      (supplier.supplierCode || "").toLowerCase().includes(searchLower) ||
      (supplier.taxNumber || "").toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const handleEditClick = (supplierID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า supplier พร้อมส่ง supplier เป็นพารามิเตอร์
    navigate(`${URL}Supplier?supplierID=${supplierID}`);
  };

  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า supplier พร้อมล้าง query parameter
    navigate(`${URL}Supplier`);
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
    <div >
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoBack}>&nbsp;Suppliers&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Suppliers
            </h4>
            <p className="docconfig-subtitle">ผู้ให้บริการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex", padding: "10px", alignItems: "center" }}>
        <div>
          {/* <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          /> */}
          <CircularButtonGroup actions={buttonActions} />
        </div>
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
      {filteredSupplier.map((supplier, supplierID) => (
        <div key={supplierID} onClick={() => handleEditClick(supplier.supplierID)}>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h5 style={{// marginLeft: "10px", marginTop: "10px"
                margin: "3px 10px 3px 10px"
              }}>
                {supplierID + 1}.{supplier.supplierName}
                &nbsp; <br /> <i style={{ fontSize: "13px" }}>{supplier.taxNumber}</i>
              </h5>
              {/* <i style={{ fontSize: "13px" }}>{supplier.taxNumber}</i> */}
              <h6 style={{// marginRight: "10px", marginTop: "10px"
                margin: "3px 10px 3px 10px", color: "GrayText"
              }}>{supplier.supplierCode}</h6>
            </div>
          </ListItem>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
        </div>
      ))}
      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}
