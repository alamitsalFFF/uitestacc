import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faUserGroup,
  faSquarePlus,
  faCircleCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import axios from "../../Auth/axiosConfig";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import {
  faCircleArrowUp,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  setSelectedProducts,
  setAccDocNo,
} from "../../redux/TransactionDataaction";
import { useDispatch, useSelector } from "react-redux";
import SearchComponent from "../../purchase/SearchComponen";
import { API_VIEW_RESULT } from "../../api/url";
import { Padding } from "@mui/icons-material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
  padding: "30px !important",
};
const ItemNoContext = createContext({
  itemNo: 1,
  setItemNo: () => { },
});

const useItemNo = () => {
  const { itemNo, setItemNo } = useContext(ItemNoContext);
  return { itemNo, setItemNo };
};

function AccordionSelectProductSR({
  isOpen,
  onClose,
  onSave,
  accDocNo,
  nextItemNo,
}) {
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [materialCount, setMaterialCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // States ใหม่สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const VMasProduct = {
    viewName: "vMas_Product",
    parameters: [],
    results: [
      { sourceField: "productName" },
      { sourceField: "productTypeCode" },
      { sourceField: "productID" },
      { sourceField: "IsMaterial" },
      { sourceField: "IsService" },
      { sourceField: "ProductBrand" },
      { sourceField: "productCode" },
      { sourceField: "ProductColor" },
      { sourceField: "ProductID" },
      { sourceField: "ProductName" },
      { sourceField: "ProductSize" },
      { sourceField: "ProductSizeUnit" },
      { sourceField: "ProductTypeCode" },
      { sourceField: "ProductTypeID" },
      { sourceField: "ProductTypeName" },
      { sourceField: "ProductVolume" },
      { sourceField: "ProductVolumeUnit" },
      { sourceField: "rateVat" },
      { sourceField: "rateWht" },
      { sourceField: "unitStock" },
      { sourceField: "vatType" },
      { sourceField: "WarehouseAddress" },
      { sourceField: "WarehouseCode" },
      { sourceField: "WarehouseID" },
      { sourceField: "WarehouseLocation" },
      { sourceField: "WarehouseName" },
    ],
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_VIEW_RESULT}`, VMasProduct, {
          headers: { "Content-Type": "application/json" },
        });
        if (isMounted && response.status === 200) {
          setLoading(false);
          setProducts(response.data);
          const products_count = response.data.filter(
            (product) => product.IsService === false
          );
          const services = response.data.filter(
            (product) =>
              product.IsService === true && product.IsMaterial === false
          );

          setMaterialCount(products_count.length);
          setServiceCount(services.length);
        } else if (isMounted) {
          setLoading(false);
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error:", error);
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // ฟังก์ชันสำหรับแบ่งหน้าข้อมูล
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // กรองข้อมูลตามประเภทและคำค้นหาก่อนทำการแบ่งหน้า
    const filteredAndSearchedProducts = products
      .filter((product) => {
        if (selectedType === "product") {
          return product.IsService === false;
        }
        if (selectedType === "service") {
          return product.IsService === true && product.IsMaterial === false;
        }
        return true;
      })
      .filter((product) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          (product.ProductName ?? "").toLowerCase().includes(searchLower) ||
          (product.productCode ?? "").toLowerCase().includes(searchLower) ||
          //(product.ProductID?.toString() ?? "").toLowerCase().includes(searchLower)
          product.ProductID.toString().toLowerCase().includes(searchLower)
        );
      });

    return filteredAndSearchedProducts.slice(startIndex, endIndex);
  };

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.find(
      (p) => p.productID === product.productID
    );
    if (isSelected) {
      dispatch(
        setSelectedProducts(
          selectedProducts.filter((p) => p.productID !== product.productID)
        )
      );
    } else {
      dispatch(
        setSelectedProducts([
          ...selectedProducts,
          {
            ...product,
            accDocNo: accDocNo,
            itemNo: nextItemNo,
            productName: product.productName,
            productCode: product.productCode,
            rateVat: product.rateVat,
            rateWht: product.rateWht,
            unitStock: product.unitStock,
            checked: false,
          },
        ])
      );
    }
  };

  const handleProductTypeSelect = () => {
    setSelectedType("product");
    setSelectedButton("product");
    setCurrentPage(1);
  };

  const handleServiceSelect = () => {
    setSelectedType("service");
    setSelectedButton("service");
    setCurrentPage(1);
  };

  const handleConfirm = () => {
    const updatedSelectedProducts = selectedProducts.map((product, index) => ({
      ...product,
      // Assign itemNo using nextItemNo and the item's index in the array
      itemNo: nextItemNo + index,
      accDocNo: accDocNo, // Pass the AccDocNo as well
    }));

    dispatch(setSelectedProducts(updatedSelectedProducts));

    // Call the onSave function
    if (updatedSelectedProducts && updatedSelectedProducts.length > 0) {
      onSave(updatedSelectedProducts[0]);
    } else {
      onSave();
    }
    
    // Close the Modal
    if (onClose) {
      onClose();
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowSearch(!!term);
    setCurrentPage(1); // Reset หน้าเมื่อมีการค้นหา
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // คำนวณจำนวนหน้ารวมทั้งหมด
  const totalItems = products
    .filter((product) => {
      if (selectedType === "product") {
        return product.IsService === false;
      }
      if (selectedType === "service") {
        return product.IsService === true && product.IsMaterial === false;
      }
      return true;
    })
    .filter((product) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        product.ProductName.toLowerCase().includes(searchLower) ||
        product.productCode.toLowerCase().includes(searchLower) ||
        product.ProductID.toString().toLowerCase().includes(searchLower)
      );
    }).length;

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <div>
          <h1 style={{ textAlign: "center" }}>SelectProduct/Service</h1>
          <div>&nbsp;</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}
          >
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              sx={{ flex: 1 }}
            >
              <Badge
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                badgeContent={materialCount}
                max={999}
                color="primary"
                sx={{ "& .MuiBadge-badge": { border: "1px solid white" } }}
                style={{ marginLeft: "10px" }}
              >
                <Chip
                  label="PRODUCT"
                  color={selectedButton === "product" ? "primary" : "primary"}
                  variant={selectedButton === "product" ? "filled" : "outlined"}
                  onClick={handleProductTypeSelect}
                />
              </Badge>
              <Badge
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                badgeContent={serviceCount}
                max={999}
                color="success"
                sx={{ "& .MuiBadge-badge": { border: "1px solid white" } }}
                style={{ marginLeft: "10px" }}
              >
                <Chip
                  label="SERVICE"
                  color={selectedButton === "service" ? "success" : "success"}
                  variant={selectedButton === "service" ? "filled" : "outlined"}
                  onClick={handleServiceSelect}
                />
              </Badge>
            </Stack>
            <div style={{ display: "flex", alignItems: "center" }}>
              {showSearch ? (
                <SearchComponent onSearch={handleSearch} />
              ) : (
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  size="2x"
                  style={{ color: "#2f9901" }}
                  onClick={toggleSearch}
                />
              )}
            </div>
          </div>
          <ul>
            {getPaginatedData().map((product, index) => (
              <div
                className="row"
                key={product.productID}
                onClick={() => handleProductSelect(product)}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <ListItem style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                      &nbsp; {(currentPage - 1) * itemsPerPage + index + 1}. {product.productCode}/{product.productName}
                      <i>{product.rateVat ? `(รวม VAT${product.rateVat} %)` : "(ไม่รวม VAT)"}</i>
                      {/* &nbsp;&nbsp; */}
                      {selectedProducts.find(
                        (p) => p.productID === product.productID
                      ) && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="1x"
                            style={{ color: "#a10000" }}
                          />
                        )}
                    </h5>
                  </div>
                </ListItem>
                <Divider
                  variant="middle"
                  component="li"
                  style={{ listStyle: "none" }}
                />
              </div>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
          <div
            // className="row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={onClose}
              style={{ marginLeft: "auto", marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            // style={{ marginRight: "auto" }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default AccordionSelectProductSR;
