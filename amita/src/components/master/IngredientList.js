import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
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
import { API_VIEW_RESULT, URL } from "../api/url";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";

function IngredientList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);

  const vMas_Product = {
    viewName: "vMas_Product",
    parameters: [
      { field: "IsMaterial", value: "0" }, // การกรองข้อมูล
      { field: "IsService", value: "0" }, // การกรองข้อมูล
    ],
    results: [
      { sourceField: "ProductID" },
      { sourceField: "ProductCode" },
      { sourceField: "ProductName" },
      { sourceField: "ProductBrand" },
      { sourceField: "ProductColor" },
      { sourceField: "ProductSize" },
      { sourceField: "ProductSizeUnit" },
      { sourceField: "ProductVolume" },
      { sourceField: "ProductVolumeUnit" },
      { sourceField: "UnitStock" },
      // { sourceField: "ProductTypeCode" },
      // { sourceField: "ProductTypeID" },
      // { sourceField: "ProductTypeName" },
      // { sourceField: "WarehouseID" },
      // { sourceField: "WarehouseCode" },
      // { sourceField: "WarehouseName" },
      // { sourceField: "WarehouseLocation" },
      // { sourceField: "WarehouseAddress" },
      // { sourceField: "AssetAccCode" },
      // { sourceField: "AssetAccName" },
      // { sourceField: "AssetAccNameEN" },
      // { sourceField: "AssetAccType" },
      // { sourceField: "AssetAccTypeName" },
      // { sourceField: "AssetAccTypeNameEN" },
      // { sourceField: "AssetAccSide" },
      // { sourceField: "AssetAccMainCode" },
      // { sourceField: "AssetAccMainName" },
      // { sourceField: "AssetAccMainNameEN" },
      // { sourceField: "IncomeAccCode" },
      // { sourceField: "IncomeAccName" },
      // { sourceField: "IncomeAccNameEN" },
      // { sourceField: "IncomeAccType" },
      // { sourceField: "IncomeAccTypeName" },
      // { sourceField: "IncomeAccTypeNameEN" },
      // { sourceField: "IncomeAccSide" },
      // { sourceField: "IncomeAccMainCode" },
      // { sourceField: "IncomeAccMainName" },
      // { sourceField: "IncomeAccMainNameEN" },
      // { sourceField: "ExpenseAccCode" },
      // { sourceField: "ExpenseAccName" },
      // { sourceField: "ExpenseAccNameEN" },
      // { sourceField: "ExpenseAccType" },
      // { sourceField: "ExpenseAccTypeName" },
      // { sourceField: "ExpenseAccTypeNameEN" },
      // { sourceField: "ExpenseAccSide" },
      // { sourceField: "ExpenseAccMainCode" },
      // { sourceField: "ExpenseAccMainName" },
      // { sourceField: "ExpenseAccMainNameEN" },
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
        console.log("vMas_Product:", vMas_Product);
        setLoading(true);

        const response = await axios.post(`${API_VIEW_RESULT}`, vMas_Product, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setLoading(false);
          console.log("data", response.data);
          setProductData(response.data);
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
  const filteredProduct = productData.filter((product) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    return (
      product.ProductName.toLowerCase().includes(searchLower) ||
      product.ProductID.toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const handleEditClick = (ProductID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Product พร้อมส่ง Product เป็นพารามิเตอร์
    navigate(`${URL}FixedAsset?productID=${ProductID}`);
  };
  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Product พร้อมล้าง query parameter
    navigate(`${URL}FixedAsset`);
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
    navigate(`${URL}`);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoMenu}>
        {/* Ingredients List (รายการวัตถุดิบ) */}
        {/* Raw Materials List (รายการวัตถุดิบ) */}
        &nbsp;FixedAssets List(รายการสินทรัพย์ถาวร)&nbsp;
      </h2>
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

      {/* <ul style={{ textAlign: "center", alignItems: "center" }}> */}
      {filteredProduct.map((product, productID) => (
        <div
          // className="row"
          key={productID}
          onClick={() => handleEditClick(product.ProductID)}
        // style={{ textAlign: "center", alignItems: "center" }}
        >
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div >
              {/* <FontAwesomeIcon
              icon={faPenToSquare}
              size="2x"
              style={{ color: "#2d01bd" }}
              onClick={() => handleEditClick(product.ProductID)}
            /> */}
              <h5 style={{ marginLeft: "10px" }}>{product.ProductName}</h5>
              <h6 style={{ marginLeft: "10px", color: "GrayText" }}>{product.ProductCode}</h6>
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
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          width: "93%", // กำหนดความกว้างเท่ากับ dashboard
          //maxWidth: "960px", // กำหนดความกว้างสูงสุดเท่ากับ dashboard
          left: "50%", // เลื่อนไปกึ่งกลาง
          transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจริงๆ
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px", // ลด padding ลงเล็กน้อยเพื่อให้พอดี
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={handleGoBack}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Back
          </Button>
        </Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            endIcon={<FaArrowUp />}
            onClick={scrollToTop}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Top
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default IngredientList;
