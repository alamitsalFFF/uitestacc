import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faAngleRight,
  faAnglesRight,
  //   faCheck,
  faHouseMedicalCircleCheck,
  faTrash,
  faPen,
  faCircleArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { pink } from "@mui/material/colors";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";

import InputLabel from "@mui/material/InputLabel";
import { Checkbox, FormGroup } from "@mui/material";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { API_BASE } from "../api/url";
import AccCodeModal from "../DataFilters/AccCodeModal";

function TypeService() {
  const [searchParams] = useSearchParams();
  const ProductTypeID = searchParams.get("productTypeID");
  const ProductTypeIDN = parseInt(ProductTypeID, 10);
  console.log("ProductTypeID:", ProductTypeIDN);
  console.log("ProductTypeID:", typeof ProductTypeIDN);
  const [allProductType, setAllproductType] = useState([]); // เก็บข้อมูล warehouse ทั้งหมด
  const [currentIndex, setCurrentIndex] = useState(0);

  const [formData, setFormData] = useState({
    productTypeID: "",
    productTypeCode: "",
    productTypeName: "",
    warehouseCode: "",
    isMaterial: "false",
    isService: "false",
    rateVat: "",
    rateWht: "",
    vatType: "",

    assetAccCode: "",
    incomeAccCode: "",
    expenseAccCode: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProductType = async () => {
      try {
        const response = await axios.get(
          // `${API_BASE}/ProductType/GetProductType`
          `${API_BASE}/ProductType/GetProductType?isMaterial=false&isService=true`
        );
        if (response.status === 200 && response.data.length > 0) {
          setAllproductType(response.data);
        } else {
          console.error("Failed to fetch warehouse data");
        }
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAllProductType();
  }, []);

  const [isMaterialChecked, setIsMaterialChecked] = useState(false);
  const [isServiceChecked, setIsServiceChecked] = useState(false);

  useEffect(() => {
    if (allProductType.length > 0 && ProductTypeIDN) {
      const selectProductType = allProductType.find(
        (productType) =>
          parseInt(productType.productTypeID, 10) === ProductTypeIDN // แปลง ProductTypeID เป็น number
      );
      console.log("allProductType:", allProductType);
      if (selectProductType) {
        setFormData(selectProductType);
        console.log("selectProductType:", selectProductType);
        console.log("rateVat:", typeof selectProductType.rateVat);
        console.log("rateVat:", selectProductType.rateVat);
        console.log("isMaterial:", selectProductType.isMaterial);
        console.log("isService:", selectProductType.isService);
        console.log("vatType from API:", selectProductType.vatType);

        setIsMaterialChecked(selectProductType.isMaterial === true);
        setIsServiceChecked(selectProductType.isService === true);
      } else {
        console.error("ProductType not found");
      }
    }
  }, [ProductTypeIDN, allProductType]);

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
  } = AccCodeModal(allAccCode, ['1', '2', '3']); //'1', '2', '3' สำหรับ Asset

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
    formDataToSend.productTypeID = 0;
    // ตรวจสอบว่าทุกช่อง (ยกเว้น productTypeID) ไม่ว่าง
    console.log("formData ก่อนตรวจสอบ:", formData); //
    if (
      !formDataToSend.productTypeCode ||
      !formDataToSend.productTypeName ||
      !formDataToSend.warehouseCode ||
      formDataToSend.isMaterial === "" ||
      formDataToSend.isService === "" ||
      formDataToSend.rateVat === "" ||
      formDataToSend.rateWht === "" ||
      formDataToSend.vatType === ""
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    console.log("formDataToSend ก่อนส่ง:", dataToSend);
    try {
      const response = await axios.post(
        `${API_BASE}/ProductType/SetProductType`,
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
        const allProductTypeResponse = await axios.get(
          `${API_BASE}/ProductType/GetProductType`
        );
        if (
          allProductTypeResponse.status === 200 &&
          allProductTypeResponse.data.length > 0
        ) {
          setAllproductType(allProductTypeResponse.data);
          // ค้นหา ProductType ที่เพิ่งบันทึก
          const savedProductType = allProductTypeResponse.data.find(
            (productType) =>
              productType.productTypeCode === formDataToSend.productTypeCode
          );
          if (savedProductType) {
            setFormData(savedProductType);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedProductType.productTypeName}`,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          console.error("Failed to fetch updated producttype data");
        }
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving producttype data:", error);
      Swal.fire({
        icon: "error",
        title: `ProductTypeCode ห้ามช้ำกัน!!`,
        text: `กรุณาแก้ ProductTypeCode:${formDataToSend.productTypeCode}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);
    try {
      const response = await axios.put(
        `${API_BASE}/ProductType/EditProductType`,
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
          title: `แก้ไข ${editData.productTypeCode} สำเร็จ`,
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
    if (!formData.productTypeID || isNaN(formData.productTypeID)) {
      alert("productTypeID ไม่ถูกต้อง");
      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.productTypeID);
    const productTypeIDToDelete = Number(formData.productTypeID);
    try {
      const response = await axios.delete(
        `${API_BASE}/ProductType/DeleteProductType/${productTypeIDToDelete}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Dalete ProductType:${formData.productTypeName}`,
        });

        // อัปเดต allProductType state
        setAllproductType(
          allProductType.filter(
            (productType) =>
              productType.productTypeID !== formData.productTypeID
          )
        );

        // อัปเดต formData state
        const currentIndexToDelete = allProductType.findIndex(
          (productType) => productType.productTypeID === formData.productTypeID
        );
        if (allProductType.length === 1) {
          setFormData({
            productTypeID: "",
            productTypeCode: "",
            productTypeName: "",
            warehouseCode: "",
            // isMaterial: false,
            // isService: false,
            isMaterial: "",
            isService: "",
            rateVat: "",
            rateWht: "",
            vatType: "",
          });
        } else if (currentIndexToDelete === allProductType.length - 1) {
          setFormData(allProductType[currentIndexToDelete - 1]);
        } else {
          setFormData(allProductType[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting productType data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const [warehouseOptions, setWarehouseOptions] = useState([]); // state สำหรับข้อมูลจาก API ตัวใหม่
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchWarehouseOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/Warehouses/GetWarehouse`);
        setWarehouseOptions(response.data); // อัปเดต state warehouseOptions
      } catch (error) {
        console.error("Error fetching warehouse options:", error);
      }
    };
    fetchWarehouseOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleWarehouseSelect = (
    warehouseCode,
    assetAccCode,
    incomeAccCode,
    expenseAccCode
  ) => {
    setFormData({
      ...formData,
      warehouseCode: warehouseCode,
      assetAccCode: assetAccCode,
      incomeAccCode: incomeAccCode,
      expenseAccCode: expenseAccCode,
    });
    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return warehouseOptions.slice(startIndex, endIndex);
  };

  const handleMaterialChange = (event) => {
    setIsMaterialChecked(event.target.checked);
    setFormData({ ...formData, isMaterial: event.target.checked });
  };

  const handleServiceChange = (event) => {
    setIsServiceChecked(event.target.checked);
    setFormData({ ...formData, isService: event.target.checked });
    console.log("formData.isService:", event.target.checked);
  };

  const rateVatOptions = [7, 0];
  const rateWhtOptions = [3, 1, 0];
  // const vatTypeOptions = ["VAT Exclusive", "VAT Inclusive", "Non VAT"];
  const vatTypeOptions = [
    { value: "2", label: "VAT Inclusive" },
    { value: "1", label: "VAT Exclusive" },
    { value: "0", label: "Non VAT" },
  ];

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(allProductType[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allProductType.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allProductType[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allProductType[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allProductType.length - 1);
    setFormData(allProductType[allProductType.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/uitestacc/TypeServiceList/");
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
    <div className="row" style={{ padding: "5%" }}>
      <h2 style={{ textAlign: "center" }} onClick={handleGoMenu}>
        Type Service
      </h2>
      <div style={{ display: "flex" }}>
        <div className="col-4">
          <FontAwesomeIcon
            icon={faHouseMedicalCircleCheck}
            size="2x"
            style={{ color: "green" }}
            onClick={handleSave}
          />
        </div>
        <div
          className="col-7"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <FontAwesomeIcon
            icon={faPen}
            size="2x"
            style={{ color: "#72047b" }}
            onClick={handleUpdate}
          />
        </div>
        <div
          className="col-1"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            size="2x"
            style={{ color: "#ae0000" }}
            onClick={handleDelete}
          />
        </div>
      </div>

      <div>&nbsp;</div>
      {/* <div className="col-md-2">
        <TextField
          id="productTypeID"
          label="ProductTypeID"
          value={formData.productTypeID || "Auto ProductTypeID"}
          type="number"
          variant="standard"
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      </div> */}
      <div className="col-md-5">
        <TextField
          required
          id="productTypeCode"
          label="TypeServiceCode"
          value={formData.productTypeCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-7">
        <TextField
          id="productTypeName"
          label="TypeServiceName"
          value={formData.productTypeName || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>

      <div className="col-md-6" style={{ display: "flex" }}>
        <TextField
          id="warehouseCode"
          label="WarehouseCode GL"
          value={formData.warehouseCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="1x"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        />
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            // border: "2px solid #000",
            borderRadius: "30px",
            padding: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <List>
            <h4 style={{ textAlign: "center" }}>Select Warehouse GL</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedData().map((warehouse) => (
              <ListItem key={warehouse.warehouseID} disablePadding>
                {/* <ListItemButton
                  onClick={() => handleWarehouseSelect(warehouse.warehouseCode)}
                > */}
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
                  {/* <ListItemText primary={warehouse.name} /> */}
                  <h5>{warehouse.name}</h5>
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
              // justifyContent: "space-between",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(warehouseOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                page={currentPage} // กำหนดหน้าปัจจุบัน
                onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
              />
            </Stack>
          </div>
        </div>
      </Modal>
      {/* <div className="col-md-4">
        <TextField
          id="isMaterial"
          label="IsMaterial"
          value={formData.isMaterial || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div> */}

      <div className="col-md-6">
        {/* <TextField
          id="isService"
          label="IsService"
          value={formData.isService || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        /> */}
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Select</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMaterialChecked}
                  onChange={handleMaterialChange}
                  color="success"
                />
              }
              label="IsMaterial"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isServiceChecked}
                  onChange={handleServiceChange}
                  color="success"
                />
              }
              label="IsService"
            />
          </FormGroup>
        </FormControl>
      </div>
      {/* ---- */}
      <div>&nbsp;</div>
      <div className="col-md-4" style={{ display: "flex" }}>
        <TextField
          id="assetAccCode"
          label="AssetAccCode"
          value={formData.assetAccCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          onKeyPress={(event) => {
          const regex = /^[0-9-]*$/;
          const isValid = regex.test(event.key);
          
          // ถ้าไม่ใช่ตัวเลขหรือเครื่องหมายขีดกลาง ให้ป้องกันการกรอก
          if (!isValid) {
            event.preventDefault();
          }
        }}
        />
        <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  size="1x"
                  onClick={handleOpenAssetModal}
                  style={{ cursor: "pointer" }}
                />
      </div>
      <div className="col-md-4" style={{ display: "flex" }}>
        <TextField
          id="incomeAccCode"
          label="IncomeAccCode"
          value={formData.incomeAccCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          // slotProps={{
          //   input: {
          //     readOnly: true,
          //   },
          // }}
          onKeyPress={(event) => {
            const regex = /^[0-9-]*$/;
            const isValid = regex.test(event.key);
            
            // ถ้าไม่ใช่ตัวเลขหรือเครื่องหมายขีดกลาง ให้ป้องกันการกรอก
            if (!isValid) {
              event.preventDefault();
            }
          }}
        />
         <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  size="1x"
                  onClick={handleOpenIncomeModal}
                  style={{ cursor: "pointer" }}
                />
      </div>
      <div className="col-md-4" style={{ display: "flex" }}>
        <TextField
          id="expenseAccCode"
          label="ExpenseAccCode"
          value={formData.expenseAccCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          // slotProps={{
          //   input: {
          //     readOnly: true,
          //   },
          // }}
          onKeyPress={(event) => {
            const regex = /^[0-9-]*$/;
            const isValid = regex.test(event.key);
            
            // ถ้าไม่ใช่ตัวเลขหรือเครื่องหมายขีดกลาง ให้ป้องกันการกรอก
            if (!isValid) {
              event.preventDefault();
            }
          }}
        />
         <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  size="1x"
                  onClick={handleOpenExpenseModal}
                  style={{ cursor: "pointer" }}
                />
      </div>
      {/* ----- */}
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
      
      {/* ----- */}
      <div className="col-md-4">
        {/* <TextField
          id="rateVat"
          label="RateVat"
          // value={formData.rateVat || ""}
          value={String(formData.rateVat)}
          type="number"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        /> */}
        <FormControl variant="standard" sx={{ minWidth: "100%" }}>
          <InputLabel id="rateVats">RateVat</InputLabel>
          <Select
            labelId="rateVat-label"
            id="rateVat"
            name="rateVat"
            // value={String(formData.rateVat)}
            value={formData.rateVat}
            label="RateVat"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
            type="number"
          >
            {rateVatOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-md-4">
        {/* <TextField
          id="rateWht"
          label="RateWht"
          type="number"
          variant="standard"
          // value={formData.rateWht || ""}
          // value={formData.rateWht}
          value={String(formData.rateWht)}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        /> */}
        <FormControl variant="standard" sx={{ minWidth: "100%" }}>
          <InputLabel id="rateWhts">RateWht</InputLabel>
          <Select
            labelId="rateWht-label"
            id="rateWht"
            name="rateWht"
            type="number"
            value={String(formData.rateWht)}
            // value={formData.rateWht || ""}
            label="RateWht"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
          >
            {rateWhtOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-md-4">
        {/* <TextField
          id="vatType"
          label="VatType"
          type="text"
          variant="standard"
          value={formData.vatType || ""}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        /> */}
        <FormControl variant="standard" sx={{ minWidth: "100%" }}>
          <InputLabel id="vatTypes">VatType</InputLabel>
          <Select
            labelId="vatType-label"
            id="vatType"
            name="vatType"
            type="text"
            value={formData.vatType || ""}
            label="VatType"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
            variant="standard"
          >
            {vatTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div>&nbsp;</div>
      <div style={{ display: "flex" }}>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAnglesRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToLast}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAngleRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToNext}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAngleRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToPrevious}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAnglesRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToFirst}
            //   disabled={isNavigationDisabled()}
          />
        </div>
      </div>
      <div>&nbsp;</div>
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
export default TypeService;
