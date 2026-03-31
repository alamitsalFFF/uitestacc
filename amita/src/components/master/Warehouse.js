import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
// import TextField from "@mui/material/TextField"; // Removed MUI TextField
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faAngleRight,
  faAnglesRight,
  faCheck,
  faHouseMedicalCircleCheck,
  faTrash,
  faPen,
  faCircleArrowLeft,
  faPlus,
  faFloppyDisk,
  faEllipsisVertical,
  faBuilding,
  faMapMarkerAlt,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE, URL } from "../api/url";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import AccCodeModal from "../DataFilters/AccCodeModal";
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
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import HeaderBar from "../menu/HeaderBar";
import "./Warehouse.css"; // Import new CSS

function Warehouses() {
  const [searchParams] = useSearchParams();
  const WarehouseID = searchParams.get("warehouseID");
  const WarehouseIDN = parseInt(WarehouseID, 10);
  console.log("WarehouseID:", WarehouseIDN);
  console.log("WarehouseID:", typeof WarehouseIDN);
  const [allWarehouses, setAllWarehouses] = useState([]); // เก็บข้อมูล warehouse ทั้งหมด
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    warehouseID: "",
    warehouseCode: "",
    name: "",
    location: "",
    address: "",
    assetAccCode: "",
    incomeAccCode: "",
    expenseAccCode: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllWarehouses = async () => {
      try {
        const response = await axios.get(`${API_BASE}/Warehouses/GetWarehouse`);
        if (response.status === 200 && response.data.length > 0) {
          setAllWarehouses(response.data);
        } else {
          console.error("Failed to fetch warehouse data");
        }
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAllWarehouses();
  }, []);

  useEffect(() => {
    if (allWarehouses.length > 0 && WarehouseIDN) {
      const selectedWarehouse = allWarehouses.find(
        (warehouse) => parseInt(warehouse.warehouseID, 10) === WarehouseIDN // แปลง warehouseID เป็น number
      );
      console.log("allWarehouses:", allWarehouses);
      if (selectedWarehouse) {
        setFormData(selectedWarehouse);
        console.log("selectedWarehouse:", selectedWarehouse);
      } else {
        console.error("Warehouse not found");
      }
    }
  }, [WarehouseIDN, allWarehouses]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  // ----------------------------------
  // เพิ่ม state สำหรับเก็บข้อมูล AccCode ทั้งหมด
  const [allAccCode, setAllAccCode] = useState([]);

  // เพิ่ม useEffect เพื่อดึงข้อมูล AccCode
  useEffect(() => {
    const fetchAllAccCode = async () => {
      try {
        const response = await axios.get(`${API_BASE}/AccCode/GetAccCode`);
        if (response.status === 200 && response.data.length > 0) {
          setAllAccCode(response.data);
        } else {
          console.error("Failed to fetch acccode data");
        }
      } catch (error) {
        console.error("Error fetching acccode data:", error);
      }
    };
    fetchAllAccCode();
  }, []);

  const {
    openModal: openAssetModal,
    handleOpenModal: handleOpenAssetModal,
    handleCloseModal: handleCloseAssetModal,
    getPaginatedData: getPaginatedAssetData,
    handlePageChange: handlePageChangeAsset,
    accCodeOptions: assetOptions,
    currentPage: assetCurrentPage,
    itemsPerPage: assetItemsPerPage,
  } = AccCodeModal(allAccCode, ['1', '2', '3']); // '1' สำหรับ Asset

  const {
    openModal: openIncomeModal,
    handleOpenModal: handleOpenIncomeModal,
    handleCloseModal: handleCloseIncomeModal,
    getPaginatedData: getPaginatedIncomeData,
    handlePageChange: handlePageChangeIncome,
    accCodeOptions: incomeOptions,
    currentPage: incomeCurrentPage,
    itemsPerPage: incomeItemsPerPage,
  } = AccCodeModal(allAccCode, ['4']); // '4' สำหรับ Income

  const {
    openModal: openExpenseModal,
    handleOpenModal: handleOpenExpenseModal,
    handleCloseModal: handleCloseExpenseModal,
    getPaginatedData: getPaginatedExpenseData,
    handlePageChange: handlePageChangeExpense,
    accCodeOptions: expenseOptions,
    currentPage: expenseCurrentPage,
    itemsPerPage: expenseItemsPerPage,
  } = AccCodeModal(allAccCode, ['5']); // '5' สำหรับ Expense

  // เพิ่มฟังก์ชันสำหรับจัดการการเลือกค่าในแต่ละช่อง
  const handleAssetSelect = (accCode) => {
    setFormData({ ...formData, assetAccCode: accCode });
    handleCloseAssetModal();
  };

  const handleIncomeSelect = (accCode) => {
    setFormData({ ...formData, incomeAccCode: accCode });
    handleCloseIncomeModal();
  };

  const handleExpenseSelect = (accCode) => {
    setFormData({ ...formData, expenseAccCode: accCode });
    handleCloseExpenseModal();
  };
  // ----------------------------------
  const handleSave = async () => {
    // สร้างสำเนาของ formData เพื่อแก้ไข
    const formDataToSend = { ...formData };
    formDataToSend.warehouseID = 0;

    // ตรวจสอบว่าทุกช่อง (ยกเว้น WarehouseID) ไม่ว่าง
    if (
      !formDataToSend.warehouseCode ||
      !formDataToSend.name ||
      !formDataToSend.location ||
      !formDataToSend.address ||
      !formDataToSend.assetAccCode ||
      !formDataToSend.incomeAccCode ||
      !formDataToSend.expenseAccCode
    ) {
      Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
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

    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    try {
      const response = await axios.post(
        `${API_BASE}/Warehouses/SetWarehouse`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // alert(`บันทึกข้อมูลสำเร็จ ${formDataToSend.name}`);
        Swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.name}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        const allWarehousesResponse = await axios.get(
          `${API_BASE}/Warehouses/GetWarehouse`
        );
        if (
          allWarehousesResponse.status === 200 &&
          allWarehousesResponse.data.length > 0
        ) {
          setAllWarehouses(allWarehousesResponse.data);
          // ค้นหา warehouse ที่เพิ่งบันทึก
          const savedWarehouse = allWarehousesResponse.data.find(
            (warehouse) =>
              warehouse.warehouseCode === formDataToSend.warehouseCode
          );
          if (savedWarehouse) {
            setFormData(savedWarehouse);
            // await setFormData(savedWarehouse);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedWarehouse.name}`,
              // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          console.error("Failed to fetch updated warehouse data");
        }
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving warehouse data:", error);
      //alert(`WarehouseCode ห้ามช้ำกัน!! กรุณาแก้ WarehouseCode:${formDataToSend.warehouseCode}`);
      Swal.fire({
        icon: "error",
        title: `WarehouseCode ห้ามช้ำกัน!!`,
        text: `กรุณาแก้ WarehouseCode:${formDataToSend.warehouseCode}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);

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
      const response = await axios.put(
        `${API_BASE}/Warehouses/EditWarehouse`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // alert("แก้ไขข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `แก้ไข ${editData.name} สำเร็จ`,
          // text: `กรุณาแก้ WarehouseCode:${formDataToSend.warehouseCode}`,
        });
      } else {
        alert("แก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error updating warehouse data:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDelete = async () => {
    if (!formData.warehouseID || isNaN(formData.warehouseID)) {
      alert("WarehouseID ไม่ถูกต้อง");
      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.warehouseID);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    const warehouseIdToDelete = Number(formData.warehouseID);
    try {
      const response = await axios.delete(
        `${API_BASE}/Warehouses/DeleteWarehouse/${warehouseIdToDelete}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Delete Warehouse:${formData.name}`,
          // text: `กรุณาแก้ WarehouseCode:${formDataToSend.warehouseCode}`,
        });

        // อัปเดต allWarehouses state
        setAllWarehouses(
          allWarehouses.filter(
            (warehouse) => warehouse.warehouseID !== formData.warehouseID
          )
        );

        // อัปเดต formData state
        const currentIndexToDelete = allWarehouses.findIndex(
          (warehouse) => warehouse.warehouseID === formData.warehouseID
        );
        if (allWarehouses.length === 1) {
          setFormData({
            warehouseID: "",
            warehouseCode: "",
            name: "",
            location: "",
            address: "",
            assetAccCode: "",
            incomeAccCode: "",
            expenseAccCode: "",
          });
        } else if (currentIndexToDelete === allWarehouses.length - 1) {
          setFormData(allWarehouses[currentIndexToDelete - 1]);
        } else {
          setFormData(allWarehouses[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting warehouse data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleClear = () => {
    setFormData({
      warehouseID: "",
      warehouseCode: "",
      name: "",
      location: "",
      address: "",
      assetAccCode: "",
      incomeAccCode: "",
      expenseAccCode: "",
    });
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(allWarehouses[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allWarehouses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allWarehouses[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allWarehouses[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allWarehouses.length - 1);
    setFormData(allWarehouses[allWarehouses.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(URL + "Warehouses/");
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
        <FontAwesomeIcon
          icon={faPlus}
          style={{ color: "green" }}
          size="1x"
        />
      ),
      name: "New",
      onClick: handleClear,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} size="1x" />
      ),
      name: "Save",
      onClick: handleSave,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPen} style={{ color: "#72047b" }} size="1x" />
      ),
      name: "Update",
      onClick: handleUpdate,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faTrash} style={{ color: "#ae0000" }} size="1x" />
      ),
      name: "Delete",
      onClick: handleDelete,
    },
  ];
  const buttonActionsLNPF = [
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToLast",
      onClick: goToLast,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToNext",
      onClick: goToNext,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" />
      ),
      name: "ToPrevious",
      onClick: goToPrevious,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" />
      ),
      name: "ToFirst",
      onClick: goToFirst,
      // disabled: isNavigationDisabled(),
    },
  ];
  return (
    <div className="warehouse-container">
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoBack}>&nbsp;Warehouse GL&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="warehouse-header"// style={{ textAlign: "left" }}
          >
            <h4 className="warehouse-title" onClick={handleGoBack}>
              Warehouse GL
            </h4>
            <p className="warehouse-subtitle">คลังสินค้า</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        {/* <ButtonAction actions={buttonActions} /> */}
        <CircularButtonGroup actions={buttonActions} />
      </div>

      <div className="warehouse-content">
        {/* General Information Card */}
        {/* General Information & Location Card */}
        <div className="warehouse-card general full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <h3 className="card-title">General Information & Location</h3>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="warehouse-form-label" style={{ //color: "red",
                  fontWeight: "bold"
                }}>Warehouse Code*</label>
                <input
                  required
                  id="warehouseCode"
                  className="form-control-custom"
                  value={formData.warehouseCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="warehouse-form-label">Name*</label>
                <input
                  id="name"
                  className="form-control-custom"
                  value={formData.name || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="warehouse-form-label">Location*</label>
                <input
                  id="location"
                  className="form-control-custom"
                  value={formData.location || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="warehouse-form-label">Address*</label>
                <textarea
                  id="address"
                  className="form-control-custom"
                  value={formData.address || ""}
                  rows="1"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Config Card */}
        <div className="warehouse-card account full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <h3 className="card-title">Account Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="warehouse-form-label">Asset Account*</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    id="assetAccCode"
                    className="form-control-custom"
                    value={formData.assetAccCode || ""}
                    type="text"
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const regex = /^[0-9-]*$/;
                      const isValid = regex.test(event.key);
                      if (!isValid) event.preventDefault();
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    size="lg"
                    onClick={handleOpenAssetModal}
                    style={{ cursor: "pointer", color: "var(--primary-color)" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="warehouse-form-label">Income Account*</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    id="incomeAccCode"
                    className="form-control-custom"
                    value={formData.incomeAccCode || ""}
                    type="text"
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const regex = /^[0-9-]*$/;
                      const isValid = regex.test(event.key);
                      if (!isValid) event.preventDefault();
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    size="lg"
                    onClick={handleOpenIncomeModal}
                    style={{ cursor: "pointer", color: "var(--primary-color)" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="warehouse-form-label">Expense Account*</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    id="expenseAccCode"
                    className="form-control-custom"
                    value={formData.expenseAccCode || ""}
                    type="text"
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const regex = /^[0-9-]*$/;
                      const isValid = regex.test(event.key);
                      if (!isValid) event.preventDefault();
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    size="lg"
                    onClick={handleOpenExpenseModal}
                    style={{ cursor: "pointer", color: "var(--primary-color)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal สำหรับ AssetAccCode */}
      <Modal open={openAssetModal} onClose={handleCloseAssetModal}>
        <div style={{
          position: "absolute",
          boxShadow: 24,
          p: 4,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          position: "relative",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "30px",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}>
          <List>
            <h4 style={{ textAlign: "center" }}>เลือกสินทรัพย์ (Assets)</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedAssetData().map((accCode) => (
              <ListItem key={accCode.accCode} disablePadding>
                <ListItemButton
                  onClick={() => handleAssetSelect(accCode.accCode)}
                >
                  <ListItemText primary={accCode.accCode} />
                  <h5>{accCode.accName}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(assetOptions.length / assetItemsPerPage)}
                page={assetCurrentPage}
                onChange={handlePageChangeAsset}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      {/* Modal สำหรับ IncomeAccCode */}
      <Modal open={openIncomeModal} onClose={handleCloseIncomeModal}>
        <div style={{
          position: "absolute",
          boxShadow: 24,
          p: 4,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          position: "relative",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "30px",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}>
          <List>
            <h4 style={{ textAlign: "center" }}>เลือกบัญชีรายได้ (Income)</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedIncomeData().map((accCode) => (
              <ListItem key={accCode.accCode} disablePadding>
                <ListItemButton
                  onClick={() => handleIncomeSelect(accCode.accCode)}
                >
                  <ListItemText primary={accCode.accCode} />
                  <h5>{accCode.accName}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(incomeOptions.length / incomeItemsPerPage)}
                page={incomeCurrentPage}
                onChange={handlePageChangeIncome}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      {/* Modal สำหรับ ExpenseAccCode */}
      <Modal open={openExpenseModal} onClose={handleCloseExpenseModal}>
        <div style={{
          position: "absolute",
          boxShadow: 24,
          p: 4,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          position: "relative",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "30px",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}>
          <List>
            <h4 style={{ textAlign: "center" }}>เลือกบัญชีค่าใช้จ่าย (Expense)</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedExpenseData().map((accCode) => (
              <ListItem key={accCode.accCode} disablePadding>
                <ListItemButton
                  onClick={() => handleExpenseSelect(accCode.accCode)}
                >
                  <ListItemText primary={accCode.accCode} />
                  <h5>{accCode.accName}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(expenseOptions.length / expenseItemsPerPage)}
                page={expenseCurrentPage}
                onChange={handlePageChangeExpense}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      <div>&nbsp;</div>
      <div style={{ display: "grid", justifyContent: "flex-end", padding: "10px" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      <div style={{ marginTop: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL + "Warehouses/"} />
    </div>
  );
}

export default Warehouses;

