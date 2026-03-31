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

export default function CustomerList() {
  const [listCustomer, setCustomer] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const authFetch = useAuthFetch(); // ใช้ hook สำหรับ fetch ข้อมูล
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const Customer = `${API_BASE}/Customer/GetCustomer`;
        const response = await authFetch(Customer);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCustomer(data);

        // if (Array.isArray(data)) {
        //   setCategoryOptions(
        //     data.map((item) => ({ value: item.category, label: item.eName }))
        //   );
        // } else {
        //   console.error("Category API did not return an array.");
        // }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCustomer();
  }, []);

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    // if (!term) {
    //   // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
    //   setShowSearch(false);
    // }
  };

  const filteredCustomer = listCustomer.filter((customer) => {
    // กรองข้อมูล
    const searchLower = (searchTerm || "").toLowerCase();
    return (
      (customer.customerName || "").toLowerCase().includes(searchLower) ||
      (customer.customerEName || "").toLowerCase().includes(searchLower) ||
      (customer.customerCode || "").toLowerCase().includes(searchLower) ||
      (customer.taxNumber || "").toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const handleEditClick = (customerID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Product พร้อมส่ง Product เป็นพารามิเตอร์
    navigate(`${URL}Customer?customerID=${customerID}`);
  };

  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Customer พร้อมล้าง query parameter
    navigate(`${URL}Customer`);
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
    <div>
      {/* <h2 style={{ textAlign: "center", textDecoration: "underline" }}
        onClick={handleGoBack}>&nbsp;Customer&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Customers
            </h4>
            <p className="docconfig-subtitle">ผู้รับบริการ/ลูกค้า</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      {/* <div style={{ display: "flex" }}>
        <div>
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          />
        </div>
        <div style={{ marginLeft: "auto" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="2x"
              style={{ color: "#2f9901" }}
              onClick={toggleSearch} // แสดงไอคอนค้นหาเมื่อ showSearch เป็น false
            />
          )}
        </div>
      </div> */}
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

      {filteredCustomer.map((customer, customerID) => (
        <div key={customerID} onClick={() => handleEditClick(customer.customerID)}>
          {/* <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        /> */}
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h5 style={{ margin: "3px 10px 3px 10px", color: "#00008b" }}>
                {customerID + 1}.{customer.customerName}
                &nbsp; <br /> <i style={{ fontSize: "13px", color: "#051a1bff" }}>{customer.taxNumber}</i>
              </h5>
              <h6 style={{ margin: "3px 10px 3px 10px", color: "GrayText" }}>{customer.customerCode}</h6>
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
