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
import { API_VIEW_RESULT } from "../api/url";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";


function TypeIngredientList() {
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
      { field: "IsMaterial", value: "0" },
      { field: "IsService", value: "0" },
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

  const handleEditClick = (ProductTypeID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า ProductType พร้อมส่ง ProductType เป็นพารามิเตอร์
    navigate(`/uitestacc/TypeIngredient?productTypeID=${ProductTypeID}`);
  };
  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า ProductType พร้อมล้าง query parameter
    navigate(`/uitestacc/TypeIngredient`);
  };
  const handleGoBack = () => {
    navigate("/uitestacc/");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleGoMenu = () => {
    navigate("/uitestacc/");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoMenu}>FixedAssetsType List (ประเภทสินทรัพย์ถาวร)</h2>
      <div style={{ display: "flex" }}>
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
      </div>

      {/* <ul> */}
      {filteredPrototype.map((producttype, producttypeID) => (
        <div
          // className="row" 
          key={producttypeID}
          onClick={() => handleEditClick(producttype.ProductTypeID)}
        >
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div>
              {/* <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="2x"
                  style={{ color: "#2d01bd" }}
                  onClick={() => handleEditClick(producttype.ProductTypeID)}
                /> */}
              <h5 style={{ marginLeft: "10px" }}>
                {producttype.ProductTypeName}
              </h5>

              <h6 style={{ marginLeft: "10px", color: "GrayText" }}>
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
      {/* <div className="row" style={{ display: "flex" }}>
        <div className="col-6" style={{ display: "grid" }}>
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            size="2x"
            style={{
              color: "#013898",
              cursor: "pointer",
              display: "grid",
              justifyItems: "end",
            }}
            onClick={handleGoBack}
          />
        </div>
        <div
          className="col-6"
          style={{ display: "grid", justifyItems: "flex-end" }}
        >
          <FontAwesomeIcon
            icon={faCircleArrowUp}
            size="2x"
            style={{
              color: "#013898",
              cursor: "pointer",
              display: "grid",
              justifyItems: "end",
            }}
            onClick={scrollToTop}
          />
        </div>
      </div> */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        width: "93%", // กำหนดความกว้างเท่ากับ dashboard
        //maxWidth: "960px", // กำหนดความกว้างสูงสุดเท่ากับ dashboard
        left: "50%", // เลื่อนไปกึ่งกลาง
        transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจริงๆ
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px" // ลด padding ลงเล็กน้อยเพื่อให้พอดี
      }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, paddingTop: 2, borderRadius: "25px !important" }}>
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={handleGoBack}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              '&:hover': {
                borderColor: "darkgreen",
                backgroundColor: 'rgba(0, 128, 0, 0.04)'
              }
            }}
          >
            Back
          </Button>
        </Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, paddingTop: 2, borderRadius: "25px !important" }}>
          <Button
            variant="outlined"
            endIcon={<FaArrowUp />}
            onClick={scrollToTop}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              '&:hover': {
                borderColor: "darkgreen",
                backgroundColor: 'rgba(0, 128, 0, 0.04)'
              }
            }}
          >
            Top
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default TypeIngredientList;
