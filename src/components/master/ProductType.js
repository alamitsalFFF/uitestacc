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
  faFileInvoiceDollar,
  faPercent,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import { API_BASE } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import HeaderBar from "../menu/HeaderBar";
import "./ProductType.css";

function ProductType() {
  const [searchParams] = useSearchParams();
  const ProductTypeID = searchParams.get("productTypeID");
  const ProductTypeIDN = parseInt(ProductTypeID, 10);

  const [allProductType, setAllproductType] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [formData, setFormData] = useState({
    productTypeID: "",
    productTypeCode: "",
    productTypeName: "",
    warehouseCode: "",
    isMaterial: false,
    isService: false,
    rateVat: "",
    rateWht: "",
    vatType: "",
    assetAccCode: "",
    incomeAccCode: "",
    expenseAccCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [isMaterialChecked, setIsMaterialChecked] = useState(false);
  const [isServiceChecked, setIsServiceChecked] = useState(false);

  // -------- Fetch all ProductTypes --------
  useEffect(() => {
    const fetchAllProductType = async () => {
      try {
        const response = await axios.get(`${API_BASE}/ProductType/GetProductType`);
        if (response.status === 200 && response.data.length > 0) {
          setAllproductType(response.data);
        }
      } catch (error) {
        console.error("Error fetching producttype data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProductType();
  }, []);

  useEffect(() => {
    if (allProductType.length > 0 && ProductTypeIDN) {
      const selectProductType = allProductType.find(
        (pt) => parseInt(pt.productTypeID, 10) === ProductTypeIDN
      );
      if (selectProductType) {
        setFormData(selectProductType);
        setIsMaterialChecked(selectProductType.isMaterial === true);
        setIsServiceChecked(selectProductType.isService === true);
      }
    }
  }, [ProductTypeIDN, allProductType]);

  // -------- Warehouse modal state --------
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWarehouseOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/Warehouses/GetWarehouse`);
        setWarehouseOptions(response.data);
      } catch (error) {
        console.error("Error fetching warehouse options:", error);
      }
    };
    fetchWarehouseOptions();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleWarehouseSelect = (warehouseCode, assetAccCode, incomeAccCode, expenseAccCode) => {
    setFormData({ ...formData, warehouseCode, assetAccCode, incomeAccCode, expenseAccCode });
    handleCloseModal();
  };

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return warehouseOptions.slice(startIndex, startIndex + itemsPerPage);
  };

  // -------- Handlers --------
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMaterialChange = (event) => {
    setIsMaterialChecked(event.target.checked);
    setFormData({ ...formData, isMaterial: event.target.checked });
  };

  const handleServiceChange = (event) => {
    setIsServiceChecked(event.target.checked);
    setFormData({ ...formData, isService: event.target.checked });
  };

  // -------- CRUD --------
  const handleClear = () => {
    setFormData({
      productTypeID: "",
      productTypeCode: "",
      productTypeName: "",
      warehouseCode: "",
      isMaterial: false,
      isService: false,
      rateVat: "",
      rateWht: "",
      vatType: "",
      assetAccCode: "",
      incomeAccCode: "",
      expenseAccCode: "",
    });
    setIsMaterialChecked(false);
    setIsServiceChecked(false);
  };

  const handleSave = async () => {
    const formDataToSend = { ...formData };
    formDataToSend.productTypeID = 0;

    if (
      !formDataToSend.productTypeCode ||
      !formDataToSend.productTypeName ||
      !formDataToSend.warehouseCode ||
      formDataToSend.rateVat === "" ||
      formDataToSend.rateWht === "" ||
      formDataToSend.vatType === ""
    ) {
      Swal.fire({ icon: "warning", title: "แจ้งเตือน", text: "กรุณากรอกข้อมูลให้ครบทุกช่อง", confirmButtonText: "ตกลง" });
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
      const response = await axios.post(`${API_BASE}/ProductType/SetProductType`, [formDataToSend], {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        const refreshed = await axios.get(`${API_BASE}/ProductType/GetProductType`);
        if (refreshed.status === 200 && refreshed.data.length > 0) {
          setAllproductType(refreshed.data);
          const saved = refreshed.data.find((pt) => pt.productTypeCode === formDataToSend.productTypeCode);
          if (saved) {
            setFormData(saved);
            setIsMaterialChecked(saved.isMaterial === true);
            setIsServiceChecked(saved.isService === true);
          }
        }
        Swal.fire({ icon: "success", title: `บันทึกสำเร็จ ${formDataToSend.productTypeName}`, showConfirmButton: false, timer: 2000 });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "ProductTypeCode ห้ามซ้ำกัน!!", text: `กรุณาแก้ ProductTypeCode: ${formDataToSend.productTypeCode}` });
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
      const response = await axios.put(`${API_BASE}/ProductType/EditProductType`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        Swal.fire({ icon: "success", title: `แก้ไข ${formData.productTypeCode} สำเร็จ` });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถแก้ไขข้อมูลได้" });
    }
  };

  const handleDelete = async () => {
    if (!formData.productTypeID || isNaN(formData.productTypeID)) {
      Swal.fire({ icon: "warning", title: "ProductTypeID ไม่ถูกต้อง" });
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
      const response = await axios.delete(`${API_BASE}/ProductType/DeleteProductType/${Number(formData.productTypeID)}`);
      if (response.status === 200) {
        Swal.fire({ icon: "success", title: `ลบ ${formData.productTypeName} สำเร็จ` });
        const updated = allProductType.filter((pt) => pt.productTypeID !== formData.productTypeID);
        setAllproductType(updated);
        const idx = allProductType.findIndex((pt) => pt.productTypeID === formData.productTypeID);
        if (updated.length === 0) handleClear();
        else if (idx === allProductType.length - 1) setFormData(updated[idx - 1]);
        else setFormData(updated[idx]);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
  };

  // -------- Navigation --------
  const goToPrevious = () => {
    if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setFormData(allProductType[currentIndex - 1]); }
  };
  const goToNext = () => {
    if (currentIndex < allProductType.length - 1) { setCurrentIndex(currentIndex + 1); setFormData(allProductType[currentIndex + 1]); }
  };
  const goToFirst = () => { setCurrentIndex(0); setFormData(allProductType[0]); };
  const goToLast = () => { setCurrentIndex(allProductType.length - 1); setFormData(allProductType[allProductType.length - 1]); };

  const navigate = useNavigate();
  const handleGoBack = () => navigate("/uitestacc/ProductTypeList/");

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

  const rateVatOptions = [7, 0];
  const rateWhtOptions = [3, 1, 0];
  const vatTypeOptions = [
    { value: "2", label: "VAT Inclusive" },
    { value: "1", label: "VAT Exclusive" },
    { value: "0", label: "Non VAT" },
  ];

  // -------- Modal style --------
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
    <div className="producttype-container">
      {/* Header Row */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="producttype-header">
            <h4 className="producttype-title" onClick={handleGoBack}>
              Product Type
            </h4>
            <p className="producttype-subtitle">ประเภทสินค้า / บริการ</p>
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
      <div className="producttype-content">

        {/* Card 1 – General Information */}
        <div className="producttype-card general full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h3 className="card-title">General Information</h3>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="form-group">
                <label className="producttype-form-label">Product Type Code *</label>
                <input
                  required
                  id="productTypeCode"
                  className="form-control-custom"
                  value={formData.productTypeCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group">
                <label className="producttype-form-label">Product Type Name *</label>
                <input
                  id="productTypeName"
                  className="form-control-custom"
                  value={formData.productTypeName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 – Warehouse & Type */}
        <div className="producttype-card type">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faTag} />
            </div>
            <h3 className="card-title">Warehouse &amp; Type</h3>
          </div>

          <div className="form-group">
            <label className="producttype-form-label">Warehouse Code *</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                id="warehouseCode"
                className="form-control-custom"
                value={formData.warehouseCode || ""}
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

          <div className="form-group">
            <label className="producttype-form-label">Product Category</label>
            <div className="producttype-checkbox-group">
              <label className="producttype-checkbox-label">
                <input type="checkbox" checked={isMaterialChecked} onChange={handleMaterialChange} />
                IsMaterial
              </label>
              <label className="producttype-checkbox-label">
                <input type="checkbox" checked={isServiceChecked} onChange={handleServiceChange} />
                IsService
              </label>
            </div>
          </div>
        </div>

        {/* Card 3 – Tax Configuration */}
        <div className="producttype-card tax">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faPercent} />
            </div>
            <h3 className="card-title">Tax Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">Rate VAT *</label>
                <select
                  name="rateVat"
                  className="producttype-select"
                  value={formData.rateVat}
                  onChange={handleSelectChange}
                >
                  <option value="">-- เลือก --</option>
                  {rateVatOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}%</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">Rate WHT *</label>
                <select
                  name="rateWht"
                  className="producttype-select"
                  value={String(formData.rateWht)}
                  onChange={handleSelectChange}
                >
                  <option value="">-- เลือก --</option>
                  {rateWhtOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}%</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">VAT Type *</label>
                <select
                  name="vatType"
                  className="producttype-select"
                  value={formData.vatType || ""}
                  onChange={handleSelectChange}
                >
                  <option value="">-- เลือก --</option>
                  {vatTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 – Account Configuration */}
        <div className="producttype-card account full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <h3 className="card-title">Account Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">Asset Account</label>
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
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">Income Account</label>
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
            <div className="col-md-4">
              <div className="form-group">
                <label className="producttype-form-label">Expense Account</label>
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

      </div>{/* end producttype-content */}

      {/* Warehouse Selection Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={modalStyle}>
          <List>
            <h4 style={{ textAlign: "center" }}>Select Warehouse GL</h4>
            <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
            {getPaginatedData().map((warehouse) => (
              <ListItem key={warehouse.warehouseID} disablePadding>
                <ListItemButton
                  onClick={() =>
                    handleWarehouseSelect(
                      warehouse.warehouseCode,
                      warehouse.assetAccCode,
                      warehouse.incomeAccCode,
                      warehouse.expenseAccCode
                    )
                  }
                >
                  <ListItemText primary={warehouse.warehouseCode} />
                  <h5 style={{ margin: 0 }}>{warehouse.name}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(warehouseOptions.length / itemsPerPage)}
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
      <FloatingActionBar backPath="/uitestacc/ProductTypeList/" />
    </div>
  );
}

export default ProductType;
