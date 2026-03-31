import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ButtonGroup } from "@mui/material";
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
import { formatNumber, formatInteger } from "../../purchase/formatNumber";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE } from "../../api/url";
import MoreInfoDT from "../../AdditionData/AdditionDataTD/MoreInfoDT";
import ButtonAction from "../../DataFilters/ButtonAction";
import DocConfig from "../../purchase/Purchase Requisition/DocConfig";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import { Stack } from "react-bootstrap";

function AccordionDOEditDT({
  open,
  onClose,
  onBackdropClick,
  onSave,
  onDelete,
  accDocNo,
  accItemNo,
  docStatus: initialDocStatus,
  accDocType: initialAccDocType,
  isproductName,
  price: initialPrice,
  qty: initialQty,
  selectedDocConfigID: initialSelectedDocConfigID,
}) {
  const authFetch = useAuthFetch();
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const [docStatus, setDocStatus] = useState(initialDocStatus);
  const [accDocType, setAccDocType] = useState(initialAccDocType);
  const [selectedDocConfigIDState, setSelectedDocConfigIDState] = useState(
    initialSelectedDocConfigID
  );

  const [productSizeUnitValue, setProductSizeUnitValue] = useState("");
  const [salesDescriptionValue, setSalesDescriptionValue] = useState("");
  const [adddatadetail, setdAddataDetail] = useState({
    price: initialPrice ? initialPrice.toString() : "1",
    qty: initialQty ? initialQty.toString() : "1",
    currency: "THB",
    exchangeRate: "1",
    productSizeUnitValue: "",
    rateVat: "",
    rateWht: "",
    vatType: "",
    salesDescription: isproductName || "",
    saleProductCode: "",
  });

  // --- State for MoreInfoModal ---
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const handleOpenMoreInfoModal = () => setIsMoreInfoModalOpen(true);
  const handleCloseMoreInfoModal = () => setIsMoreInfoModalOpen(false);
  // ---------------------------------
  const handleOverlayClick = (event) => {
    // Check if the click is outside the main modal content, not on a child modal
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target)
    ) {
      onBackdropClick();
    }
  };

  // const handleInputChange = (event) => {
  //   const { id, value } = event.target;
  //   setdAddataDetail({ ...adddatadetail, [id]: value });
  // };
  const handleInputChange = (event) => {
    const name = event.target.name || event.target.id;
    const value = event.target.value;
    setdAddataDetail({ ...adddatadetail, [name]: value });
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
    if (open && accDocNo && accItemNo) {
      const loadData = async () => {
        try {
          const data = await fetchData(accDocNo, accItemNo);
          if (data && data.length > 0) {
            const itemData = data[0];
            setdAddataDetail({
              price: itemData.price ? itemData.price.toString() : "1",
              qty: itemData.qty ? itemData.qty.toString() : "1",
              amount: itemData.amount ? itemData.amount.toString() : "1",
              exchangeRate: itemData.exchangeRate
                ? itemData.exchangeRate.toString()
                : "1",
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
            setDocStatus(
              itemData.DocStatus !== undefined
                ? itemData.DocStatus
                : initialDocStatus
            );
            setAccDocType(itemData.AccDocType || initialAccDocType);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            text: error.message || "โปรดลองใหม่อีกครั้ง",
          });
          onClose();
        }
      };
      loadData();
    }
  }, [
    open,
    accDocNo,
    accItemNo,
    authFetch,
    initialDocStatus,
    initialAccDocType,
    onClose,
  ]);

  const saveDataToAPI = async (data) => {
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
        return responseData;
      } else {
        const responseText = await response.text();
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
        onSave();
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

      onDelete();
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
    console.log("Fetched Document Config ID:", configId);
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
    return null;
  }

  const handleBackdropClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "100001 !important",
        }}
        onClick={onClose}
      >
        <div
          ref={modalContentRef}
          style={{
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
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* เนื้อหา Modal หลัก */}
          <div
            className="row"
            style={{ padding: "5%", paddingTop: "1px", position: "relative" }}
          >
            {/* ... (เนื้อหาโค้ดเดิมทั้งหมดใน Modal หลัก) ... */}
            <DocConfig
              accDocType={accDocType}
              onDocConfigFetched={handleDocConfigFetched}
            />
            <h4
              style={{
                textAlign: "center",
                textDecorationLine: "underline",
                paddingTop: "20px",
              }}
            >
              Edit DocNo:{accDocNo} &nbsp;ItemNo:&nbsp;{accItemNo}
            </h4>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CircularButtonGroup actions={buttonActions} />
            </div>
            {/* ... (ส่วนโค้ดฟอร์มและ input ทั้งหมด) ... */}
            <div className="row">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "start",
                  justifyContent: "start",
                  paddingTop: "15px",
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
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    autoFocus
                  />
                ) : (
                  <h5
                    style={{
                      marginTop: "5px",
                      marginRight: "10px",
                      cursor: "pointer",
                      // textAlign: "end",
                      // justifyContent: "end",
                    }}
                  >
                    <span style={{ color: "#1976d2" }}>Description:</span>
                    &nbsp;{salesDescriptionValue} &nbsp;
                    <i>
                      <span style={{ color: "#f78a83ff", fontSize: "14px" }}>
                        {adddatadetail.rateVat
                          ? `(รวม VAT ${adddatadetail.rateVat} %)`
                          : "(ไม่รวม VAT)"}
                      </span>
                    </i>
                  </h5>
                )}
              </div>

              <div
                className="col-md-6"
                style={{ display: "flex", paddingTop: "10px" }}
              >
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
                <div>&nbsp;</div>
              </div>
              <div
                className="col-md-6"
                style={{ display: "flex", paddingTop: "10px" }}
              >
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
              </div>
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
                <TextField
                  id="unitStocks"
                  label="Unit"
                  value={productSizeUnitValue}
                  type="text"
                  variant="standard"
                  style={{ width: "100%" }}
                  onChange={(event) =>
                    setProductSizeUnitValue(event.target.value)
                  }
                />
              </div>
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
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
                <div>&nbsp;</div>
              </div>
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
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
              </div>
              {/* --- เพิ่มส่วน VAT, WHT, VAT Type ที่นี่ --- */}
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="rateVat-label">VAT Rate (%)</InputLabel>
                  <Select
                    labelId="rateVat-label"
                    id="rateVat"
                    name="rateVat" // เพิ่ม name
                    value={adddatadetail.rateVat}
                    onChange={handleInputChange}
                    label="VAT Rate"
                    type="number"
                  >
                    <MenuItem value={0}>0% (ยกเว้น)</MenuItem>
                    <MenuItem value={7}>7%</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="rateWht-label">WHT Rate (%)</InputLabel>
                  <Select
                    labelId="rateWht-label"
                    id="rateWht"
                    name="rateWht" // เพิ่ม name
                    value={adddatadetail.rateWht}
                    onChange={handleInputChange}
                    label="WHT Rate"
                    type="number"
                  >
                    <MenuItem value={0}>0% (ไม่มี)</MenuItem>
                    <MenuItem value={1}>1%</MenuItem>
                    <MenuItem value={3}>3%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                className="col-md-4"
                style={{ display: "flex", paddingTop: "10px" }}
              >
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="vatType-label">VAT Type</InputLabel>
                  <Select
                    labelId="vatType-label"
                    id="vatType"
                    name="vatType" // เพิ่ม name
                    value={adddatadetail.vatType}
                    onChange={handleInputChange}
                    label="VAT Type"
                    type="number"
                  >
                    <MenuItem value={2}>รวม VAT (Include)</MenuItem>
                    <MenuItem value={1}>ไม่รวม VAT (Exclude)</MenuItem>
                    <MenuItem value={0}>ไม่รวม/ยกเว้น VAT</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* ------------------------------------------- */}
          
              <div className="row">
                <ListItem style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                      Total
                    </h5>
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
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                marginTop: "1px",
              }}
            >
              <Button
                variant="contained"
                onClick={onClose}
                style={{ backgroundColor: "dimgrey", color: "white" }}
              >
                Close
              </Button>
            </Box>
            <div>&nbsp;</div>
          </div>
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
    </>
  );
}

export default AccordionDOEditDT;
