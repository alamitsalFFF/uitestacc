import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import {
  faBoxOpen,
  faCircleMinus,
  faCirclePlus,
  faRectangleList,
  faPen,
  faTrash,
  faFloppyDisk,
  faPrint,
  faCircleArrowUp,
  faCircleArrowLeft,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { setAddProducts, setAccDocNo } from "../../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { formatNumber, formatInteger } from "../formatNumber";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE } from "../../api/url";
import MoreInfoDT from "../../AdditionData/AdditionDataTD/MoreInfoDT";
import ButtonAction from "../../DataFilters/ButtonAction";
import DocConfig from "./DocConfig";

function PREditDetail({
  open,          // prop สำหรับควบคุมการเปิด/ปิด Modal
  onClose,       // prop สำหรับฟังก์ชันปิด Modal
  onSave,        // prop สำหรับเมื่อบันทึกข้อมูลสำเร็จ (แจ้ง parent)
  onDelete,      // prop สำหรับเมื่อลบข้อมูลสำเร็จ (แจ้ง parent)
  // Props ที่รับมาแทน location.state / searchParams
  accDocNo,
  accItemNo,
  docStatus: initialDocStatus, // เปลี่ยนชื่อเพื่อไม่ให้ซ้ำกับ state
  accDocType: initialAccDocType, // เปลี่ยนชื่อเพื่อไม่ให้ซ้ำกับ state
  isproductName, // ตัวอย่าง props เพิ่มเติม
  price: initialPrice, // ตัวอย่าง props เพิ่มเติม
  qty: initialQty, // ตัวอย่าง props เพิ่มเติม
  selectedDocConfigID: initialSelectedDocConfigID, // ตัวอย่าง props เพิ่มเติม
  // ... (รับ props อื่นๆ ที่เคยได้รับจาก location.state หรือ searchParams)
}) {
  const authFetch = useAuthFetch();

  // ไม่ต้องใช้ useLocation, useNavigate, useSearchParams แล้วใน Component นี้
  // const location = useLocation();
  // const navigate = useNavigate();
  // const [searchParams] = useSearchParams();

  const [docStatus, setDocStatus] = useState(initialDocStatus);
  const [accDocType, setAccDocType] = useState(initialAccDocType);
  const [selectedDocConfigIDState, setSelectedDocConfigIDState] = useState(initialSelectedDocConfigID);

  const [rateVatValue, setRateVatValue] = useState([]);
  const [rateWhtValue, setRateWhtValue] = useState([]);
  const [vatTypeValue, setVatTypeValue] = useState([]);
  const [productSizeUnitValue, setProductSizeUnitValue] = useState("");
  const [salesDescriptionValue, setSalesDescriptionValue] = useState("");
  const [adddatadetail, setdAddataDetail] = useState({
    price: initialPrice ? initialPrice.toString() : "1", // ใช้ initialPrice จาก props
    qty: initialQty ? initialQty.toString() : "1", // ใช้ initialQty จาก props
    currency: "THB",
    exchangeRate: "1",
    productSizeUnitValue: "",
    rateVat: "",
    rateWht: "",
    vatType: "",
    salesDescription: isproductName || "", // ใช้ isproductName จาก props
    saleProductCode: "", // ต้อง fetch มาจาก API หรือส่งเป็น prop
  });

  // --- State for MoreInfoModal ---
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const handleOpenMoreInfoModal = () => setIsMoreInfoModalOpen(true);
  const handleCloseMoreInfoModal = () => setIsMoreInfoModalOpen(false);
  // ---------------------------------

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setdAddataDetail({ ...adddatadetail, [id]: value });
  };

  const fetchData = async (accDocNo, accItemNo) => {
    try {
      const response = await authFetch(
        `${API_BASE}/AccTransaction/GetAccTransactionDT?accDocNo=${accDocNo}&accItemNo=${accItemNo}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    // โหลดข้อมูลเมื่อ Modal เปิด และ accDocNo/accItemNo เปลี่ยน
    if (open && accDocNo && accItemNo) {
      const loadData = async () => {
        try {
          const data = await fetchData(accDocNo, accItemNo);
          console.log("Data from API:", data);
          if (data && data.length > 0) {
            const itemData = data[0];
            setdAddataDetail({
              price: itemData.price ? itemData.price.toString() : "1",
              qty: itemData.qty ? itemData.qty.toString() : "1",
              amount: itemData.amount ? itemData.amount.toString() : "1",
              exchangeRate: itemData.exchangeRate ? itemData.exchangeRate.toString() : "1",
              currency: itemData.currency || "THB",
              productSizeUnitValue: itemData.unitMea || "",
              salesDescription: itemData.salesDescription || "",
              saleProductCode: itemData.saleProductCode || "",
              rateVat: itemData.rateVat || 0,
              rateWht: itemData.rateWht || 0,
              vatType: itemData.vatType || 0,
            });
            setCurrency(itemData.currency || "THB");
            setProductSizeUnitValue(itemData.unitMea || "");
            setSalesDescriptionValue(itemData.salesDescription || "");
            // ตั้งค่า docStatus และ accDocType จากข้อมูลที่โหลดมา หรือใช้จาก props
            setDocStatus(itemData.DocStatus !== undefined ? itemData.DocStatus : initialDocStatus);
            setAccDocType(itemData.AccDocType || initialAccDocType);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            text: error.message || "โปรดลองใหม่อีกครั้ง",
          });
          onClose(); // ปิด Modal หากโหลดข้อมูลไม่สำเร็จ
        }
      };
      loadData();
    }
  }, [open, accDocNo, accItemNo, authFetch, initialDocStatus, initialAccDocType, onClose]);


  const saveDataToAPI = async (data) => {
    console.log("DATA UPDATE:", data);
    try {
      const response = await authFetch(
        `${API_BASE}/AccTransaction/EditAccTransactionDT`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        console.log("API response (JSON):", responseData);
        return responseData;
      } else {
        const responseText = await response.text();
        console.log("API response (Text):", responseText);
        return { message: responseText };
      }
    } catch (error) {
      console.error("Error saving data to API:", error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!adddatadetail.price || !adddatadetail.qty) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกราคาและจำนวน",
      });
      return;
    }

    const updatedProduct = {
      accDocNo: accDocNo,
      accItemNo: parseInt(accItemNo),
      accSourceDocNo: "",
      accSourceDocItem: 0,
      stockTransNo: 0,
      qty: parseInt(adddatadetail.qty),
      price: parseFloat(adddatadetail.price),
      unitMea: productSizeUnitValue,
      currency: adddatadetail.currency,
      exchangeRate: parseFloat(adddatadetail.exchangeRate),
      amount: calculateTotal(),
      saleProductCode: adddatadetail.saleProductCode,
      salesDescription: salesDescriptionValue,
      rateVat: parseFloat(adddatadetail.rateVat),
      rateWht: parseFloat(adddatadetail.rateWht),
      vatType: parseFloat(adddatadetail.vatType),
    };

    try {
      const response = await saveDataToAPI(updatedProduct);
      if (
        response &&
        response.message === "AccTransactionDT details updated."
      ) {
        Swal.fire({
          icon: "success",
          title: `แก้ไข ${salesDescriptionValue} สำเร็จ`,
          text: "ข้อมูลสินค้า/บริการถูกแก้ไขข้อมูลเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        onSave(); // เรียก callback prop เพื่อแจ้ง parent ว่ามีการบันทึกสำเร็จ
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          text: "โปรดลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await authFetch(
        `${API_BASE}/AccTransaction/DeleteAccTransactionDT/${accDocNo}?accItemNo=${accItemNo}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Swal.fire({
        icon: "success",
        title: `ลบ ${salesDescriptionValue} สำเร็จ`,
        text: "ข้อมูลสินค้า/บริการถูกลบเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });

      onDelete(); // เรียก callback prop เพื่อแจ้ง parent ว่ามีการลบสำเร็จ
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการลบข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleDocConfigFetched = (configId) => {
    setSelectedDocConfigIDState(configId);
  };

  const calculateTotal = () => {
    return (
      parseFloat(adddatadetail.price || 0) *
      parseFloat(adddatadetail.qty || 0) *
      parseFloat(adddatadetail.exchangeRate || 1)
    );
  };

  const qtyRef = useRef(null);
  const currencyRef = useRef(null);
  const exchangeRateRef = useRef(null);
  const priceRef = useRef(null);

  const handlePriceKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      qtyRef.current.focus();
    }
  };
  const handleQtyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      currencyRef.current.focus();
    }
  };

  const handleCurrencyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      exchangeRateRef.current.focus();
    }
  };
  const [currency, setCurrency] = useState("THB");

  const handleChangecurr = (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    if (selectedCurrency === "THB") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: "1",
        currency: selectedCurrency,
      });
    } else if (selectedCurrency === "USD") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: adddatadetail.exchangeRate,
        currency: selectedCurrency,
      });
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const handleDescriptionClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      priceRef.current.focus();
    }
  };

  const buttonActions = [
    ...(docStatus === 0
      ? [
          {
            icon: (
              <FontAwesomeIcon
                icon={faPen}
                style={{ color: "#72047b" }}
                size="x"
              />
            ),
            name: "Update",
            onClick: handleUpdate,
          },
          {
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "#ae0000" }}
                size="x"
              />
            ),
            name: "Cancel",
            onClick: handleDelete,
          },
        ]
      : []),
    {
      icon: (
        <FontAwesomeIcon icon={faInfo} style={{ color: "#6c757d" }} size="x" />
      ),
      name: "More Info",
      onClick: handleOpenMoreInfoModal,
    },
  ];

  if (!open) {
    return null; // ไม่แสดง Modal หาก open เป็น false
  }

  return (
    // นี่คือโครงสร้าง Modal ทั่วไป (คุณอาจจะต้องปรับแต่ง CSS หรือใช้ Modal Component จาก Library เช่น Material-UI)
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: "90%", maxWidth: "600px" }}> {/* ปรับขนาด modal */}
        <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
          <DocConfig
            accDocType={accDocType}
            onDocConfigFetched={handleDocConfigFetched}
          />
          <h2 style={{ textAlign: "center", textDecorationLine: "underline" }}>
            Edit PR Detail
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ButtonAction actions={buttonActions} />
          </div>
          <div className="row">
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flexGrow: 1 }}>
                <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
                  DocNo:&nbsp; {accDocNo} &nbsp;
                </h5>
              </div>
              <div
                className="col-7"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "end",
                  justifyContent: "end",
                }}
                onClick={handleDescriptionClick}
              >
                {isEditing ? (
                  <TextField
                    value={salesDescriptionValue}
                    multiline
                    variant="standard"
                    style={{ width: "100%", paddingRight: "5px" }}
                    onChange={(event) =>
                      setSalesDescriptionValue(event.target.value)
                    }
                    onKeyDown={handleInputKeyDown} // ใช้ handleInputKeyDown เพื่อเลื่อน focus
                    onBlur={handleInputBlur}
                    autoFocus
                  />
                ) : (
                  <h5
                    style={{
                      marginTop: "5px",
                      marginRight: "10px",
                      cursor: "pointer",
                      textAlign: "end",
                      justifyContent: "end",
                    }}
                  >
                    &nbsp; {salesDescriptionValue} &nbsp;
                  </h5>
                )}
              </div>
            </ListItem>
            <div className="col-md-12" style={{ display: "flex" }}>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="price"
                  label="Price"
                  value={adddatadetail.price}
                  type="number"
                  variant="standard"
                  style={{ width: "100%" }}
                  onChange={handleInputChange}
                  onKeyDown={handlePriceKeyDown}
                  inputRef={priceRef}
                />
              </ListItem>
              <div>&nbsp;</div>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="qty"
                  label="Qty"
                  value={adddatadetail.qty}
                  type="number"
                  variant="standard"
                  style={{ width: "100%" }}
                  onChange={handleInputChange}
                  inputRef={qtyRef}
                  onKeyDown={handleQtyKeyDown}
                />
              </ListItem>
            </div>

            <div className="col-md-12" style={{ display: "flex" }}>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="currency">Currency</InputLabel>
                  <Select
                    labelId="currency"
                    id="currency"
                    value={currency}
                    onChange={handleChangecurr}
                    type="text"
                    label="Currency"
                    inputRef={currencyRef}
                    onKeyDown={handleCurrencyKeyDown}
                  >
                    <MenuItem value={"THB"}>THB</MenuItem>
                    <MenuItem value={"USD"}>USD</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <div>&nbsp;</div>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="exchangeRate"
                  label="ExchangeRate"
                  value={adddatadetail.exchangeRate}
                  defaultValue={1}
                  type="number"
                  variant="standard"
                  style={{ width: "100%" }}
                  onChange={handleInputChange}
                  inputRef={exchangeRateRef}
                />
              </ListItem>
            </div>

            <div className="col-md-12" style={{ display: "flex" }}>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="unitStocks"
                  label="Unit"
                  value={productSizeUnitValue}
                  type="text"
                  variant="standard"
                  style={{ width: "100%" }}
                  onChange={(event) => setProductSizeUnitValue(event.target.value)}
                />
              </ListItem>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="rateVat"
                  label="RateVat"
                  value={adddatadetail.rateVat}
                  type="number"
                  variant="standard"
                  style={{ width: "100%" }}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  onChange={handleInputChange}
                />
              </ListItem>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="rateWht"
                  label="RateWht"
                  value={adddatadetail.rateWht}
                  type="number"
                  variant="standard"
                  style={{ width: "100%" }}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  onChange={handleInputChange}
                />
              </ListItem>
            </div>

            <div className="row">
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>Total</h5>
                  <p>
                    &nbsp; {formatNumber(adddatadetail.price)}x
                    {formatNumber(adddatadetail.qty)}
                  </p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div style={{ display: "flex" }}>
                    <h1>{formatNumber(calculateTotal())}</h1>
                    &nbsp; &nbsp; &nbsp;
                  </div>
                </div>
              </ListItem>
              <hr
                variant="middle"
                component="li"
                style={{ listStyle: "none" }}
              />
            </div>
          </div>
          {isMoreInfoModalOpen && (
            <MoreInfoDT
              open={isMoreInfoModalOpen}
              handleClose={handleCloseMoreInfoModal}
              accDocNo={accDocNo}
              accItemNo={accItemNo}
              docConfigID={selectedDocConfigIDState}
            />
          )}

          <div>&nbsp;</div>
          <div className="row" style={{ display: "flex" }}>
            <div className="col-6" style={{ display: "grid" }}>
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                size="2x"
                style={{
                  color: "#013898",
                  cursor: "pointer",
                  display: "grid",
                  justifyItems: "end",
                }}
                onClick={onClose} 
              />
            </div>
            <div
              className="col-6"
              style={{ display: "grid", justifyItems: "flex-end" }}
            >
              <FontAwesomeIcon
                icon={faCircleArrowUp}
                size="2x"
                style={{
                  color: "#013898",
                  cursor: "pointer",
                  display: "grid",
                  justifyItems: "end",
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PREditDetail;
