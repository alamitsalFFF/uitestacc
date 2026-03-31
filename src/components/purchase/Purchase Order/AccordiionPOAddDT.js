import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  faBoxOpen,
  faCircleMinus,
  faCirclePlus,
  faPen,
  faTrash,
  faPrint,
  faFloppyDisk,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import {
  setAddProducts,
  setAccDocNo,
  setSelectedProducts,
} from "../../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE } from "../../api/url";
import { useAuthFetch } from "../../Auth/fetchConfig";
import axios from "../../Auth/axiosConfig";

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
  maxHeight: "80vh", // จำกัดความสูง
  overflowY: "auto", // เปิดใช้งาน scroll
  padding: "30px !important",
};
function AccordiionPOAddDT({ open, onClose, onSave }) {
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accDocNo = useSelector((state) => state.accDocNo);
  const selectedProducts = useSelector((state) => state.selectedProducts);

  // เตรียม state สำหรับแต่ละ product ที่ถูกเลือก
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const initialDetails = selectedProducts.map((product) => ({
        productID: product.productID, // ใช้ productID เป็น key
        price: 1,
        qty: 1,
        currency: "THB",
        exchangeRate: 1,
        unitMea: product.ProductSizeUnit || product.unitStock,
        rateVat: product.rateVat,
        rateWht: product.rateWht,
        vatType: product.vatType,
        productCode: product.productCode,
        productName: product.productName,
        accDocNo: product.accDocNo,
        itemNo: product.itemNo,
      }));
      setProductDetails(initialDetails);
    }
  }, [selectedProducts]);

  const handleInputChange = (event, productID) => {
    const { id, value } = event.target;
    setProductDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.productID === productID ? { ...detail, [id]: value } : detail
      )
    );
  };

  const calculateAmount = (price, qty, exchangeRate) => {
    return (
      parseFloat(price || 0) *
      parseFloat(qty || 0) *
      parseFloat(exchangeRate || 0)
    );
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const saveDataToAPI = async (product) => {
    console.log("Saving product:", product);
    try {
      const response = await axios.post(
        `${API_BASE}/AccTransaction/SetAccTransactionDT`,
        [product], // ส่งข้อมูลทีละรายการ
        {
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify(product),
        }
      );

      console.log("Data saved successfully:", response.data);
    
    } catch (error) {
      console.error("Error saving data to API:", error);
      // แสดงข้อความ error ให้ผู้ใช้ทราบ
      alert(`Error saving data: ${error.message}`);
    }
  };
  const saveDataToAPI1 = async (data) => {
    try {
      const response = await authFetch(
        `${API_BASE}/AccTransaction/SetAccTransactionDT`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        if (responseText === "AccTransactionDTs Created.") {
          console.log("API response: AccTransactionDTs Created.");
          return { message: "AccTransactionDTs Created." };
        } else {
          throw new Error("Response is not JSON");
        }
      }
      const responseData = await response.json();
      console.log("API response:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error saving data to API:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    for (const product of productDetails) {
      console.log("Processing product:", product);
      // เตรียมข้อมูลที่ต้องการส่ง
      const transactionData = {
        accDocNo: product.accDocNo,
        accItemNo: product.itemNo,
        accSourceDocNo: "",
        accSourceDocItem: 0,
        stockTransNo: 0,
        qty: parseFloat(product.qty) || 0, // ป้องกันค่าว่าง
        price: parseFloat(product.price) || 0, // ป้องกันค่าว่าง
        unitMea: product.unitMea,
        currency: product.currency,
        exchangeRate: parseFloat(product.exchangeRate) || 0, // ป้องกันค่าว่าง
        amount: calculateAmount(
          product.price,
          product.qty,
          product.exchangeRate
        ),
        saleProductCode: product.productCode,
        salesDescription: product.productName,
        rateVat: parseFloat(product.rateVat),
        rateWht: parseFloat(product.rateWht),
        vatType: parseFloat(product.vatType),
      };

      // await saveDataToAPI(transactionData);
    // }

    // onSave();
     try {
      await saveDataToAPI(transactionData);
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });
      // เรียกใช้ onSave เพื่ออัปเดตข้อมูลภายนอกและปิด Modal
      onSave();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }};
  };
  const handleSave1 = async () => {
    const productsToSave = productDetails.map((detail) => {
      const {
        price,
        qty,
        currency,
        exchangeRate,
        unitMea,
        rateVat,
        rateWht,
        vatType,
        productCode,
        productName,
        accDocNo,
        itemNo,
      } = detail;

      if (!price || !qty) {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: `กรุณากรอกราคาและจำนวนสำหรับ ${productName}`,
        });
        throw new Error("Missing price or quantity");
      }

      return {
        accDocNo: accDocNo,
        newaccItemNo: itemNo,
        accSourceDocNo: "",
        accSourceDocItem: 0,
        stockTransNo: 0,
        qty: parseFloat(qty),
        price: parseFloat(price),
        unitMea: unitMea,
        currency: currency,
        exchangeRate: parseFloat(exchangeRate),
        amount: calculateAmount(price, qty, exchangeRate),
        saleProductCode: productCode,
        salesDescription: productName,
        rateVat: parseFloat(rateVat),
        rateWht: parseFloat(rateWht),
        vatType: parseFloat(vatType),
      };
    });

    try {
      await saveDataToAPI(productsToSave);
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });
      // เรียกใช้ onSave เพื่ออัปเดตข้อมูลภายนอกและปิด Modal
      onSave();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className="row" style={{ padding: "3%" }}>
          <h4 style={{ textAlign: "center",textDecoration: "underline" }}>Add PO Detail</h4>
          <div style={{ padding: "3%" }}>
            {productDetails.map((detail) => (
              <div key={detail.productID} className="row">
                {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                  <div style={{ flexGrow: 1 }}>
                    <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
                      {detail.itemNo}.&nbsp;{detail.productCode}/{detail.productName} <i>{detail.rateVat ? `(รวม VAT${detail.rateVat} %)`:"(ไม่รวม VAT)"}</i> 
                    </h5>
                     {/* &nbsp;&nbsp;&nbsp;&nbsp;<i>({detail.productCode})</i> */}
                  </div>
                {/* </ListItem> */}
                <div className="col-md-6" style={{ display: "flex" }}>
                  
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                    <TextField
                      id="price"
                      label="Price"
                      value={detail.price}
                      type="number"
                      variant="standard"
                      style={{ width: "100%" }}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                    />
                  {/* </ListItem> */}
                  </div>
                  <div className="col-md-6" style={{ display: "flex" , paddingTop:"10px"}}>
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                    <TextField
                      id="qty"
                      label="Qty"
                      value={detail.qty}
                      type="number"
                      variant="standard"
                      style={{ width: "100%" }}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                    />
                  {/* </ListItem> */}
                </div>
                  <div className="col-md-4" style={{ display: "flex", paddingTop:"10px" }}>
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                    <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                      <InputLabel id="currency">Currency</InputLabel>
                      <Select
                        labelId="currency"
                        id="currency"
                        value={detail.currency}
                        onChange={(e) => handleInputChange(e, detail.productID)}
                        label="Currency"
                      >
                        <MenuItem value={"THB"}>THB</MenuItem>
                        <MenuItem value={"USD"}>USD</MenuItem>
                      </Select>
                    </FormControl>
                  {/* </ListItem> */}
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                  </div>
                  <div className="col-md-4" style={{ display: "flex", paddingTop:"5px" }}>
                    <TextField
                      id="exchangeRate"
                      label="ExchangeRate"
                      value={detail.exchangeRate}
                      type="number"
                      variant="standard"
                      style={{ width: "100%" }}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                    />
                  {/* </ListItem> */}
                </div>
                  <div className="col-md-4" style={{ display: "flex", paddingTop:"10px"}}>
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                    <TextField
                      id="unitMea"
                      label="Unit"
                      value={detail.unitMea}
                      type="text"
                      variant="standard"
                      style={{ width: "100%" }}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                    />
                  {/* </ListItem> */}
                  {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                  </div>
                  {/* <div className="col-md-3" style={{ display: "flex" }}>
                    <TextField
                      id="rateVat"
                      label="RateVat"
                      value={detail.rateVat}
                      type="number"
                      variant="standard"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    /> */}
                  {/* </div> */}
                  {/* <div className="col-md-3" style={{ display: "flex" }}>
                    <TextField
                      id="rateWht"
                      label="RateWht"
                      value={detail.rateWht}
                      type="number"
                      variant="standard"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    />
                </div> */}
                <div className="row">
                  <ListItem style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                        Total
                      </h5>
                      <p>
                        &nbsp; {detail.price} x {detail.qty}
                      </p>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <h1>
                        {formatNumber(
                          calculateAmount(
                            detail.price,
                            detail.qty,
                            detail.exchangeRate
                          )
                        )}
                      </h1>
                    </div>
                  </ListItem>
                </div>
              <Divider />
              </div>
              
            ))}
            
          </div>
          <div>&nbsp;</div>
          <div //className="row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={onClose}
              startIcon={
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  style={{ color: "white" }}
                />
              }
              style={{ marginLeft: "auto", marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              //style={{ marginRight: "auto" }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default AccordiionPOAddDT;
