import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAnglesRight,
  faTrash,
  faPen,
  faEllipsisVertical,
  faPlus,
  faFloppyDisk,
  faBoxOpen,
  faRuler,
  faTag,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { API_BASE, API_VIEW_RESULT } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import HeaderBar from "../menu/HeaderBar";
import "./Product.css";

function Product() {
  const [searchParams] = useSearchParams();
  const ProductID = searchParams.get("productID");
  const ProductIDN = parseInt(ProductID, 10);

  const [allProduct, setAllProduct] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [formData, setFormData] = useState({
    productID: "",
    productCode: "",
    productName: "",
    brand: "",
    color: "",
    size: "",
    sizeUnit: "",
    volume: "",
    volumeUnit: "",
    unitStock: "",
    productTypeCode: "",
    assetAccCode: "",
    incomeAccCode: "",
    expenseAccCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [brandError, setBrandError] = useState(false);
  const [brandHelperText, setBrandHelperText] = useState("");

  // -------- vMas_Product view definition --------
  const vMas_Product = {
    viewName: "vMas_Product",
    // parameters: [
    //   { field: "IsMaterial", value: "1" },
    //   { field: "IsService", value: "0" },
    // ],
    results: [
      { sourceField: "productID" },
      { sourceField: "productCode" },
      { sourceField: "productName" },
      { sourceField: "productBrand" },
      { sourceField: "productColor" },
      { sourceField: "productSize" },
      { sourceField: "productSizeUnit" },
      { sourceField: "productVolume" },
      { sourceField: "productVolumeUnit" },
      { sourceField: "unitStock" },
      { sourceField: "productTypeCode" },
      { sourceField: "productTypeID" },
      { sourceField: "productTypeName" },
      { sourceField: "warehouseID" },
      { sourceField: "warehouseCode" },
      { sourceField: "warehouseName" },
      { sourceField: "assetAccCode" },
      { sourceField: "incomeAccCode" },
      { sourceField: "expenseAccCode" },
      { sourceField: "isMaterial" },
      { sourceField: "isService" },
      { sourceField: "rateVat" },
      { sourceField: "rateWht" },
      { sourceField: "vatType" },
    ],
  };

  // -------- Fetch all Products --------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_VIEW_RESULT}`, vMas_Product, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          setAllProduct(response.data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (allProduct.length > 0 && ProductIDN) {
      const selectedProduct = allProduct.find(
        (p) => parseInt(p.productID, 10) === ProductIDN
      );
      if (selectedProduct) setFormData(selectedProduct);
    }
  }, [ProductIDN, allProduct]);

  // -------- ProductType modal --------
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProductTypeOptions = async () => {
      try {
        const response = await axios.get(
          // `${API_BASE}/ProductType/GetProductType?isMaterial=true&isService=false`
          `${API_BASE}/ProductType/GetProductType`
        );
        setProductTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching producttype options:", error);
      }
    };
    fetchProductTypeOptions();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleProductTypeSelect = (productTypeCode, assetAccCode, incomeAccCode, expenseAccCode) => {
    setFormData({ ...formData, productTypeCode, assetAccCode, incomeAccCode, expenseAccCode });
    handleCloseModal();
  };

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return productTypeOptions.slice(startIndex, startIndex + itemsPerPage);
  };

  // -------- Input handlers --------
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    if (id === "brand") {
      if (value.length < 5) {
        setBrandError(true);
        setBrandHelperText("กรุณากรอก Brand อย่างน้อย 5 ตัวอักษร");
      } else {
        setBrandError(false);
        setBrandHelperText("");
      }
    }
  };

  // -------- CRUD --------
  const handleClear = () => {
    setFormData({
      productID: "",
      productCode: "",
      productName: "",
      brand: "",
      color: "",
      size: "",
      sizeUnit: "",
      volume: "",
      volumeUnit: "",
      unitStock: "",
      productTypeCode: "",
      assetAccCode: "",
      incomeAccCode: "",
      expenseAccCode: "",
    });
    setBrandError(false);
    setBrandHelperText("");
  };

  const handleSave = async () => {
    const formDataToSend = { ...formData };
    formDataToSend.productID = 0;

    if (
      !formDataToSend.productCode ||
      !formDataToSend.productName ||
      (formDataToSend.brand && formDataToSend.brand.length < 5) ||
      !formDataToSend.unitStock ||
      !formDataToSend.productTypeCode
    ) {
      Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง (Brand ต้องมีอย่างน้อย 5 ตัวอักษร)",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.post(`${API_BASE}/Product/SetProduct`, [formDataToSend], {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        Swal.fire({ icon: "success", title: `บันทึกสำเร็จ ${formDataToSend.productName}`, showConfirmButton: false, timer: 2000 });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "ProductCode ห้ามซ้ำกัน!!", text: `กรุณาแก้ ProductCode: ${formDataToSend.productCode}` });
    }
  };

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(`${API_BASE}/Product/EditProduct`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        Swal.fire({ icon: "success", title: `แก้ไข ${formData.productName} สำเร็จ` });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถแก้ไขข้อมูลได้" });
    }
  };

  const handleDelete = async () => {
    if (!formData.productID || isNaN(formData.productID)) {
      Swal.fire({ icon: "warning", title: "ProductID ไม่ถูกต้อง" });
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${API_BASE}/Product/DeleteProduct/${Number(formData.productID)}`);
      if (response.status === 200) {
        Swal.fire({ icon: "success", title: `ลบ ${formData.productName} สำเร็จ` });
        const updated = allProduct.filter((p) => p.productID !== formData.productID);
        setAllProduct(updated);
        const idx = allProduct.findIndex((p) => p.productID === formData.productID);
        if (updated.length === 0) handleClear();
        else if (idx === allProduct.length - 1) setFormData(updated[idx - 1]);
        else setFormData(updated[idx]);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
  };

  // -------- Navigation --------
  const goToPrevious = () => {
    if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setFormData(allProduct[currentIndex - 1]); }
  };
  const goToNext = () => {
    if (currentIndex < allProduct.length - 1) { setCurrentIndex(currentIndex + 1); setFormData(allProduct[currentIndex + 1]); }
  };
  const goToFirst = () => { setCurrentIndex(0); setFormData(allProduct[0]); };
  const goToLast = () => { setCurrentIndex(allProduct.length - 1); setFormData(allProduct[allProduct.length - 1]); };

  const navigate = useNavigate();
  const handleGoBack = () => navigate("/uitestacc/ProductList/");

  // -------- Button configs --------
  const buttonActions = [
    { icon: <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />, name: "New", onClick: handleClear },
    { icon: <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} size="1x" />, name: "Save", onClick: handleSave },
    { icon: <FontAwesomeIcon icon={faPen} style={{ color: "#72047b" }} size="1x" />, name: "Update", onClick: handleUpdate },
    { icon: <FontAwesomeIcon icon={faTrash} style={{ color: "#ae0000" }} size="1x" />, name: "Delete", onClick: handleDelete },
  ];

  const buttonActionsLNPF = [
    { icon: <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />, name: "ToLast", onClick: goToLast },
    { icon: <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />, name: "ToNext", onClick: goToNext },
    { icon: <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" />, name: "ToPrevious", onClick: goToPrevious },
    { icon: <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" />, name: "ToFirst", onClick: goToFirst },
  ];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <div className="product-container">
      {/* Header Row */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="product-header">
            <h4 className="product-title" onClick={handleGoBack}>
              Products
            </h4>
            <p className="product-subtitle">สินค้า / บริการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <CircularButtonGroup actions={buttonActions} />
      </div>

      {/* Cards */}
      <div className="product-content">

        {/* Card 1 – General Information */}
        <div className="product-card general full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h3 className="card-title">General Information</h3>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="form-group">
                <label className="product-form-label">Product Code *</label>
                <input
                  required
                  id="productCode"
                  className="form-control-custom"
                  value={formData.productCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group">
                <label className="product-form-label">Product Name *</label>
                <input
                  id="productName"
                  className="form-control-custom"
                  value={formData.productName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Brand *</label>
                <input
                  id="brand"
                  className="form-control-custom"
                  value={formData.brand || formData.productBrand || ""}
                  type="text"
                  onChange={handleInputChange}
                  style={brandError ? { borderColor: "#e74c3c" } : {}}
                />
                {brandHelperText && <p className="product-helper-text">{brandHelperText}</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Color</label>
                <input
                  id="color"
                  className="form-control-custom"
                  value={formData.color || formData.productColor || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 – Dimensions & Stock */}
        <div className="product-card details">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faRuler} />
            </div>
            <h3 className="card-title">Dimensions &amp; Stock</h3>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Size</label>
                <input
                  id="size"
                  className="form-control-custom"
                  value={formData.size || formData.productSize || ""}
                  type="number"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Size Unit</label>
                <input
                  id="sizeUnit"
                  className="form-control-custom"
                  value={formData.sizeUnit || formData.productSizeUnit || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Volume</label>
                <input
                  id="volume"
                  className="form-control-custom"
                  value={formData.volume || formData.productVolume || ""}
                  type="number"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="product-form-label">Volume Unit</label>
                <input
                  id="volumeUnit"
                  className="form-control-custom"
                  value={formData.volumeUnit || formData.productVolumeUnit || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="product-form-label">Unit Stock *</label>
                <input
                  id="unitStock"
                  className="form-control-custom"
                  value={formData.unitStock || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 – Product Type */}
        <div className="product-card type">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faTag} />
            </div>
            <h3 className="card-title">Product Type</h3>
          </div>
          <div className="form-group">
            <label className="product-form-label">Product Type Code *</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                id="productTypeCode"
                className="form-control-custom"
                value={formData.productTypeCode || ""}
                type="text"
                readOnly
                onChange={handleInputChange}
              />
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="lg"
                onClick={handleOpenModal}
                style={{ cursor: "pointer", color: "var(--primary-color)" }}
              />
            </div>
          </div>
        </div>

        {/* Card 4 – Account Configuration */}
        <div className="product-card account">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <h3 className="card-title">Account Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="product-form-label">Asset Account</label>
                <input
                  id="assetAccCode"
                  className="form-control-custom"
                  value={formData.assetAccCode || ""}
                  type="text"
                  onChange={handleInputChange}
                  onKeyPress={(e) => { if (!/^[0-9-]*$/.test(e.key)) e.preventDefault(); }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="product-form-label">Income Account</label>
                <input
                  id="incomeAccCode"
                  className="form-control-custom"
                  value={formData.incomeAccCode || ""}
                  type="text"
                  onChange={handleInputChange}
                  onKeyPress={(e) => { if (!/^[0-9-]*$/.test(e.key)) e.preventDefault(); }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="product-form-label">Expense Account</label>
                <input
                  id="expenseAccCode"
                  className="form-control-custom"
                  value={formData.expenseAccCode || ""}
                  type="text"
                  onChange={handleInputChange}
                  onKeyPress={(e) => { if (!/^[0-9-]*$/.test(e.key)) e.preventDefault(); }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>{/* end product-content */}

      {/* ProductType Selection Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={modalStyle}>
          <List>
            <h4 style={{ textAlign: "center" }}>Select Product Type</h4>
            <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
            {getPaginatedData().map((pt) => (
              <ListItem key={pt.productTypeID} disablePadding>
                <ListItemButton
                  onClick={() =>
                    handleProductTypeSelect(
                      pt.productTypeCode,
                      pt.assetAccCode,
                      pt.incomeAccCode,
                      pt.expenseAccCode
                    )
                  }
                >
                  <ListItemText primary={pt.productTypeCode} />
                  <h5 style={{ margin: 0 }}>{pt.productTypeName}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(productTypeOptions.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      {/* Navigation Buttons */}
      <div>&nbsp;</div>
      <div style={{ display: "grid", justifyContent: "flex-end", padding: "10px" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      <div style={{ marginTop: "40px" }}>&nbsp;</div>

      {/* Floating Action Bar */}
      <FloatingActionBar backPath="/uitestacc/ProductList/" />
    </div>
  );
}

export default Product;
