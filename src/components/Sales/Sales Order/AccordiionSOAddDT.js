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
function AccordiionSOAddDT({ open, onClose, onSave }) {
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accDocNo = useSelector((state) => state.accDocNo);
  const selectedProducts = useSelector((state) => state.selectedProducts);

  // เตรียม state สำหรับแต่ละ product ที่ถูกเลือก
  const [productDetails, setProductDetails] = useState([]);
  const [editingProductID, setEditingProductID] = useState(null);

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
    const { id, name, value } = event.target;
    const field = id || name;
    setProductDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.productID === productID ? { ...detail, [field]: value } : detail
      )
    );
  };

  const handleDescriptionClick = (productID) => {
    setEditingProductID(productID);
  };

  const handleDescriptionBlur = () => {
    setEditingProductID(null);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setEditingProductID(null);
    }
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
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "10px",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #056f03, #3ee963f5)",
              color: "white",
              padding: "10px 24px",
              borderRadius: "30px",
              boxShadow: "0 4px 12px rgba(0, 0, 139, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.5px" }}>
                &nbsp;&nbsp; &nbsp;&nbsp;Add Detail&nbsp;&nbsp; &nbsp;&nbsp;
              </div>
            </div>
          </div>
          <div style={{ padding: "3%" }}>
            {productDetails.map((detail) => (
              <div key={detail.productID} className="row">
                {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
                  <h5 style={{ paddingTop: "10px", display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#0a0133ff", marginRight: "10px", fontWeight: 700 }}>ProductCode:</span>
                  {detail.itemNo}.&nbsp;{detail.productCode}
                </h5>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleDescriptionClick(detail.productID)}
                >
                  {editingProductID === detail.productID ? (
                    <TextField
                      id="productName"
                      label="Description"
                      value={detail.productName}
                      type="text"
                      variant="standard"
                      style={{ width: "100%", marginTop: "5px" }}
                      onChange={(e) =>
                        handleInputChange(
                          { target: { name: "productName", value: e.target.value } },
                          detail.productID
                        )
                      }
                      onKeyDown={handleDescriptionKeyDown}
                      onBlur={handleDescriptionBlur}
                      autoFocus
                    />
                  ) : (
                    <h5
                      style={{
                        marginTop: "5px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ color: "#1976d2" }}>Description:</span>
                      &nbsp;&nbsp;{detail.productName}&nbsp;
                      <i>
                        <span style={{ color: "#f78a83ff", fontSize: "14px" }}>
                          {detail.rateVat
                            ? `(รวม VAT ${detail.rateVat} %)`
                            : "(ไม่รวม VAT)"}
                        </span>
                      </i>
                    </h5>
                  )}
                </div>
                {/* </ListItem> */}
                <div className="col-md-6" style={{ display: "flex" }}>
                  <TextField
                    id="price"
                    label="Price"
                    value={detail.price}
                    type="number"
                    variant="standard"
                    style={{ width: "100%" }}
                    onChange={(e) => handleInputChange(e, detail.productID)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#ffffe0" } }}
                    sx={{ "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                  />
                </div>
                <div className="col-md-6" style={{ display: "flex" }}>
                  <TextField
                    id="qty"
                    label="Qty"
                    value={detail.qty}
                    type="number"
                    variant="standard"
                    style={{ width: "100%" }}
                    onChange={(e) => handleInputChange(e, detail.productID)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#ffffe0" } }}
                    sx={{ "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                  />
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "10px" }}>
                  <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                    <InputLabel id="currency" sx={{ color: "#00008b", fontWeight: 700, "&.Mui-focused": { color: "#1976d2" } }}>Currency</InputLabel>
                    <Select
                      labelId="currency"
                      id="currency"
                      value={detail.currency}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                      label="Currency"
                      inputProps={{ name: "currency" }}
                      sx={{ "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" }, backgroundColor: "#ffffe0" }}
                    >
                      <MenuItem value={"THB"}>THB</MenuItem>
                      <MenuItem value={"USD"}>USD</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "5px" }}>
                  <TextField
                    id="exchangeRate"
                    label="ExchangeRate"
                    value={detail.exchangeRate}
                    type="number"
                    variant="standard"
                    style={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#ffffe0" } }}
                    sx={{ "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                    onChange={(e) => handleInputChange(e, detail.productID)}
                  />
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "10px" }}>
                  <TextField
                    id="unitMea"
                    label="Unit"
                    value={detail.unitMea}
                    type="text"
                    variant="standard"
                    style={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#ffffe0" } }}
                    sx={{ "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                    onChange={(e) => handleInputChange(e, detail.productID)}
                  />
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "10px" }}>
                  <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                    <InputLabel id="rateVat-label" sx={{ color: "#00008b", fontWeight: 700, "&.Mui-focused": { color: "#1976d2" } }}>VAT Rate (%)</InputLabel>
                    <Select
                      labelId="rateVat-label"
                      id="rateVat"
                      name="rateVat"
                      value={detail.rateVat}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                      label="VAT Rate"
                      type="number"
                      sx={{ backgroundColor: "#ffffe0", "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                    >
                      <MenuItem value={0}>0% (ยกเว้น)</MenuItem>
                      <MenuItem value={7}>7%</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "10px" }}>
                  <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                    <InputLabel id="rateWht-label" sx={{ color: "#00008b", fontWeight: 700, "&.Mui-focused": { color: "#1976d2" } }}>WHT Rate (%)</InputLabel>
                    <Select
                      labelId="rateWht-label"
                      id="rateWht"
                      name="rateWht"
                      value={detail.rateWht}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                      label="WHT Rate"
                      type="number"
                      sx={{ backgroundColor: "#ffffe0", "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                    >
                      <MenuItem value={0}>0% (ไม่มี)</MenuItem>
                      <MenuItem value={1}>1%</MenuItem>
                      <MenuItem value={3}>3%</MenuItem>
                      <MenuItem value={5}>5%</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4" style={{ display: "flex", paddingTop: "10px" }}>
                  <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                    <InputLabel id="vatType-label" sx={{ color: "#00008b", fontWeight: 700, "&.Mui-focused": { color: "#1976d2" } }}>VAT Type</InputLabel>
                    <Select
                      labelId="vatType-label"
                      id="vatType"
                      name="vatType"
                      value={detail.vatType}
                      onChange={(e) => handleInputChange(e, detail.productID)}
                      label="VAT Type"
                      type="number"
                      sx={{ backgroundColor: "#ffffe0", "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" } }}
                    >
                      <MenuItem value={2}>รวม VAT (Include)</MenuItem>
                      <MenuItem value={1}>ไม่รวม VAT (Exclude)</MenuItem>
                      <MenuItem value={0}>ไม่รวม/ยกเว้น VAT</MenuItem>
                    </Select>
                  </FormControl>
                </div>
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
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    backgroundColor: "#f5f7fa",
                    padding: "16px",
                    borderRadius: "12px",
                    marginTop: "20px",
                    marginBottom: "10px",
                    border: "1px solid #e4e7eb",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }}>
                    <div style={{ flex: "1 1 min-content" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#4b5563" }}>
                        Total Amount
                      </div>
                      <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px", wordBreak: "break-word" }}>
                        {formatNumber(parseFloat(detail.price) || 0)} x {formatNumber(parseFloat(detail.qty) || 0)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: "800", color: "#1976d2", lineHeight: "1", wordBreak: "break-all" }}>
                        {formatNumber(calculateAmount(detail.price, detail.qty, detail.exchangeRate))}
                      </div>
                      <div style={{ fontSize: "16px", color: "#6b7280", fontWeight: "600" }}>
                        {detail.currency}
                      </div>
                    </div>
                  </div>
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

export default AccordiionSOAddDT;