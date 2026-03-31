import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import TextField from "@mui/material/TextField";
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
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { API_BASE, API_VIEW_RESULT } from "../api/url";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";

function Service() {
  const [searchParams] = useSearchParams();
  const ProductID = searchParams.get("productID");
  const ProductIDN = parseInt(ProductID, 10);
  console.log("ProductID:", ProductIDN);
  console.log("ProductID:", typeof ProductIDN);
  const [allProduct, setAllProduct] = useState([]); // เก็บข้อมูล Product ทั้งหมด
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
  });
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const fetchAllProduct = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_BASE}/Product/GetProduct` // ดึงข้อมูลทั้งหมด
  //       );
  //       if (response.status === 200 && response.data.length > 0) {
  //         setAllProduct(response.data);
  //       } else {
  //         console.error("Failed to fetch Product data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Product data:", error);
  //     } finally {
  //       setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
  //     }
  //   };
  //   fetchAllProduct();
  // }, []);

  const vMas_Product = {
        viewName: "vMas_Product",
        parameters: [
          { field: "IsMaterial", value: "0" }, // การกรองข้อมูล
          { field: "IsService", value: "1" }, // การกรองข้อมูล
        ],
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
          { sourceField: "warehouseLocation" },
          { sourceField: "warehouseAddress" },
          { sourceField: "assetAccCode" },
          { sourceField: "assetAccName" },
          { sourceField: "assetAccNameEN" },
          { sourceField: "assetAccType" },
          { sourceField: "assetAccTypeName" },
          { sourceField: "assetAccTypeNameEN" },
          { sourceField: "assetAccSide" },
          { sourceField: "assetAccMainCode" },
          { sourceField: "assetAccMainName" },
          { sourceField: "assetAccMainNameEN" },
          { sourceField: "incomeAccCode" },
          { sourceField: "incomeAccName" },
          { sourceField: "incomeAccNameEN" },
          { sourceField: "incomeAccType" },
          { sourceField: "incomeAccTypeName" },
          { sourceField: "incomeAccTypeNameEN" },
          { sourceField: "incomeAccSide" },
          { sourceField: "incomeAccMainCode" },
          { sourceField: "incomeAccMainName" },
          { sourceField: "incomeAccMainNameEN" },
          { sourceField: "expenseAccCode" },
          { sourceField: "expenseAccName" },
          { sourceField: "expenseAccNameEN" },
          { sourceField: "expenseAccType" },
          { sourceField: "expenseAccTypeName" },
          { sourceField: "expenseAccTypeNameEN" },
          { sourceField: "expenseAccSide" },
          { sourceField: "expenseAccMainCode" },
          { sourceField: "expenseAccMainName" },
          { sourceField: "expenseAccMainNameEN" },
          { sourceField: "isMaterial" },
          { sourceField: "isService" },
          { sourceField: "rateVat" },
          { sourceField: "rateWht" },
          { sourceField: "vatType" },
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
              setAllProduct(response.data);
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

  useEffect(() => {
    if (allProduct.length > 0 && ProductIDN) {
      const selectedProduct = allProduct.find(
        (product) => parseInt(product.productID, 10) === ProductIDN // แปลง ProductID เป็น number
      );
      console.log("allProduct:", allProduct);
      if (selectedProduct) {
        setFormData(selectedProduct);
        console.log("selectedProduct:", selectedProduct);
      } else {
        console.error("Product not found");
      }
    }
  }, [ProductIDN, allProduct]);

  const [brandError, setBrandError] = useState(false);
  const [brandHelperText, setBrandHelperText] = useState("");

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
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

  const handleSave = async () => {
    // สร้างสำเนาของ formData เพื่อแก้ไข
    const formDataToSend = { ...formData };
    formDataToSend.productID = 0;

    // ตรวจสอบว่าทุกช่อง (ยกเว้น WarehouseID) ไม่ว่าง
    if (
      !formDataToSend.productCode ||
      !formDataToSend.productName ||
      formDataToSend.brand.length < 5 ||
      !formDataToSend.color ||
      !formDataToSend.size ||
      !formDataToSend.sizeUnit ||
      !formDataToSend.volume ||
      !formDataToSend.volumeUnit ||
      !formDataToSend.unitStock ||
      !formDataToSend.productTypeCode
    ) {
      let errorMessage = "กรุณากรอกข้อมูลให้ครบทุกช่อง\n";
      if (!formDataToSend.brand || formDataToSend.brand.length < 5) {
        errorMessage += "- กรุณากรอก Brand อย่างน้อย 5 ตัวอักษร\n";
      }
      alert("errorMessage");
      return;
    }
    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    try {
      const response = await axios.post(
        `${API_BASE}/Product/SetProduct`,
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
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.productName}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        const allProductResponse = await axios.get(
          `${API_BASE}/Warehouses/GetWarehouse`
        );
        if (
          allProductResponse.status === 200 &&
          allProductResponse.data.length > 0
        ) {
          setAllProduct(allProductResponse.data);
          // ค้นหา warehouse ที่เพิ่งบันทึก
          const savedProduct = allProductResponse.data.find(
            (product) => product.productCode === formDataToSend.productCode
          );
          if (savedProduct) {
            setFormData(savedProduct);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedProduct.productName}`,
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
      Swal.fire({
        icon: "error",
        title: `ServiceCode ห้ามช้ำกัน!!`,
        text: `กรุณาแก้ ServiceCode:${formDataToSend.productCode}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);
    try {
      const response = await axios.put(
        `${API_BASE}/Product/EditProduct`,
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
          title: `แก้ไข ${editData.productName} สำเร็จ`,
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
    if (!formData.productID || isNaN(formData.productID)) {
      alert("ProductID ไม่ถูกต้อง");
      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.productID);
    const productIDToDelete = Number(formData.productID);
    try {
      const response = await axios.delete(
        `${API_BASE}/Product/DeleteProduct/${productIDToDelete}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Dalete Product/Services:${formData.productName}`,
        });

        // อัปเดต allWarehouses state
        setAllProduct(
          allProduct.filter(
            (product) => product.productID !== formData.productID
          )
        );

        // อัปเดต formData state
        const currentIndexToDelete = allProduct.findIndex(
          (product) => product.productID === formData.productID
        );
        if (allProduct.length === 1) {
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
          });
        } else if (currentIndexToDelete === allProduct.length - 1) {
          setFormData(allProduct[currentIndexToDelete - 1]);
        } else {
          setFormData(allProduct[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting product data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };
  // ---------------------
  const [productTypeOptions, setProductTypeOptions] = useState([]); // state สำหรับข้อมูลจาก API ตัวใหม่
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchProductTypeOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/ProductType/GetProductType?isMaterial=false&isService=true`
        );
        setProductTypeOptions(response.data); // อัปเดต state ProductTypeOptions
      } catch (error) {
        console.error("Error fetching warehouse options:", error);
      }
    };
    fetchProductTypeOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleProductTypeSelect = (productTypeCode, assetAccCode, incomeAccCode, expenseAccCode) => {
    setFormData({ ...formData, productTypeCode: productTypeCode, 
                               assetAccCode: assetAccCode, 
                               incomeAccCode: incomeAccCode, 
                               expenseAccCode: expenseAccCode });
    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productTypeOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(allProduct[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allProduct.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allProduct[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allProduct[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allProduct.length - 1);
    setFormData(allProduct[allProduct.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/uitestacc/ServiceList/");
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
        Services
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
          id="productID"
          label="ProductID"
          value={formData.productID || "Auto ProductID"}
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
          id="productCode"
          label="ServiceCode"
          value={formData.productCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-7">
        <TextField
          id="productName"
          label="ServiceName"
          value={formData.productName || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>

      <div className="col-md-6">
        <TextField
          id="brand"
          label="Brand"
          value={formData.brand || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          error={brandError}
          helperText={brandHelperText}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-6">
        <TextField
          id="color"
          label="Color"
          value={formData.color || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>

      <div className="col-md-4">
        <TextField
          id="size"
          label="Size"
          value={formData.size || ""}
          type="number"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-4">
        <TextField
          id="sizeUnit"
          label="SizeUnit"
          value={formData.sizeUnit || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-4">
        <TextField
          id="volume"
          label="Volume"
          type="number"
          variant="standard"
          value={formData.volume || ""}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>

      <div className="col-md-4">
        <TextField
          id="volumeUnit"
          label="VolumeUnit"
          value={formData.volumeUnit || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-4">
        <TextField
          id="unitStock"
          label="UnitStock"
          value={formData.unitStock || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-4" style={{ display: "flex" }}>
        <TextField
          id="productTypeCode"
          label="TypeServiceCode"
          type="text"
          variant="standard"
          value={formData.productTypeCode || ""}
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
            <h4 style={{ textAlign: "center" }}>Select TypeService</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedData().map((producttype) => (
              <ListItem key={producttype.producttypeID} disablePadding>
                <ListItemButton
                  onClick={() =>
                    handleProductTypeSelect(
                      producttype.productTypeCode,
                      producttype.assetAccCode,
                      producttype.incomeAccCode,
                      producttype.expenseAccCode
                    )}>
                  <ListItemText primary={producttype.productTypeCode} />
                  <h5>{producttype.productTypeName}</h5>
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
                count={Math.ceil(productTypeOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                page={currentPage} // กำหนดหน้าปัจจุบัน
                onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
              />
            </Stack>
          </div>
        </div>
      </Modal>
  {/* ---- */}
      <div>&nbsp;</div>
      <div className="col-md-4">
        <TextField
          id="assetAccCode"
          label="AssetAccCode"
          value={formData.assetAccCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          // --ปิดเมื่อต้องการให้สามารถแก้ไขได้
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
      </div>
      <div className="col-md-4">
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
      </div>
      <div className="col-md-4">
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
      </div>
      {/* ----- */}
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
      <div style={{paddingTop:"30px"}}>&nbsp;</div>
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
export default Service;
