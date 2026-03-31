import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { API_VIEW_RESULT, URL } from "../api/url";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import HeaderBar from "../menu/HeaderBar";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../DataFilters/FloatingActionBar";

function ProductList() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const vMas_Product = {
    viewName: "vMas_Product",
    parameters: [
      // { field: "IsMaterial", value: "1" },
      // { field: "IsService", value: "0" },
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
        setLoading(true);
        const response = await axios.post(`${API_VIEW_RESULT}`, vMas_Product, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          setProductData(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) setShowSearch(false);
  };

  const filteredProduct = productData.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.ProductName.toLowerCase().includes(searchLower) ||
      product.ProductID.toString().toLowerCase().includes(searchLower) ||
      (product.ProductCode || "").toLowerCase().includes(searchLower)
    );
  });

  const toggleSearch = () => setShowSearch(!showSearch);

  const handleEditClick = (ProductID, idx) => {
    setActiveIndex(idx);
    navigate(`/uitestacc/Product?productID=${ProductID}`);
  };

  const handleAddNew = () => navigate(`/uitestacc/Product`);
  const handleGoBack = () => navigate("/uitestacc/");
  const handleGoMenu = () => navigate("/uitestacc/");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const buttonActions = [
    {
      icon: <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />,
      name: "Add New",
      onClick: handleAddNew,
    },
  ];

  return (
    <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>

      {/* Header Row */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoMenu}>
              Product And Services
            </h4>
            <p className="docconfig-subtitle">รหัสสินค้า/บริการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      {/* Action + Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div>
          <CircularButtonGroup actions={buttonActions} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} />
          ) : (
            <Tooltip
              title={<Typography variant="caption" sx={{ fontSize: "0.9rem" }}>Search Data</Typography>}
              arrow
              placement="top"
            >
              <IconButton
                aria-label="Search Data"
                onClick={toggleSearch}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  boxShadow: 2,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  "&:hover": { bgcolor: "action.hover" },
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
      {/* Product List Items */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
          กำลังโหลดข้อมูล...
        </div>
      ) : filteredProduct.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
          ไม่พบข้อมูลสินค้า
        </div>
      ) : (
        filteredProduct.map((product, idx) => (
          <div
            key={idx}
            onClick={() => handleEditClick(product.ProductID, idx)}
            style={{
              background: activeIndex === idx ? "#e8f0fe" : "transparent",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "background 0.2s",
            }}
          >
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}>
                <h5 style={{ margin: "3px 10px 3px 10px" }}>
                  {idx + 1}.&nbsp;{product.ProductName}
                </h5>
                <h6 style={{ margin: "3px 10px 3px 10px", color: "GrayText" }}>
                  {product.ProductCode}
                  {/* {product.ProductBrand ? ` / ${product.ProductBrand}` : ""} */}
                </h6>
              </div>
            </ListItem>
            <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          </div>
        ))
      )}

      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default ProductList;
