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
import { formatNumber, formatInteger } from "../../purchase/formatNumber";
import MoreInfoDT from "../../AdditionData/AdditionDataTD/MoreInfoDT";
import ButtonSR from "./ButtonSR";
import Item from "antd/es/list/Item";
import axios from "../../Auth/axiosConfig";
import { useAuthFetch } from "../../Auth/fetchConfig";

function SREditDetail() {
  const authFetch = useAuthFetch();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.selectedProducts);

  const [searchParams] = useSearchParams();
  const accDocNo = searchParams.get("accDocNo");
  const accItemNo = searchParams.get("accItemNo"); // อ่านจาก query parameter
  // รับค่า docStatus จาก location.state
  const docStatusFromState = location.state ? location.state.docStatus : null;
  const selectedDocConfigIDState = location.state
    ? location.state.selectedDocConfigID
    : null;
  const [docStatus, setDocStatus] = useState(docStatusFromState);
  const [docConfigID, setDocConfigID] = useState(selectedDocConfigIDState);
  console.log("docStatus:", docStatus);
  console.log("docConfigID:", docConfigID);
  const navigate = useNavigate();

  const [rateVatValue, setRateVatValue] = useState([]);
  const [rateWhtValue, setRateWhtValue] = useState([]);
  const [vatTypeValue, setVatTypeValue] = useState([]);
  const [productSizeUnitValue, setProductSizeUnitValue] = useState([]);
  const [salesDescriptionValue, setSalesDescriptionValue] = useState([]);
  const [adddatadetail, setdAddataDetail] = useState({
    price: "1",
    qty: "1",
    currency: "THB",
    exchangeRate: "1",
    productSizeUnitValue: "",
    rateVat: "",
    rateWht: "",
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

  const [newData, setNewData] = useState(null);

  const fetchData = async (accDocNo, accItemNo) => {
    try {
      const response = await axios.get(
        `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/GetAccTransactionDT?accDocNo=${accDocNo}&accItemNo=${accItemNo}`
      );
      // axios puts the data in response.data, so for compatibility:
      response.ok = true;
      response.json = async () => response.data;
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
    const loadData = async () => {
      try {
        const data = await fetchData(accDocNo, accItemNo); // นำข้อมูลที่ได้มาใส่ใน state ของ component
        console.log("Data from API:", data);
        setdAddataDetail({
          price: data[0].price ? data[0].price.toString() : "1",
          qty: data[0].qty ? data[0].qty.toString() : "1",
          amount: data[0].amount ? data[0].amount.toString() : "1",
          exchangeRate: data[0].amount ? data[0].exchangeRate.toString() : "1",
          currency: data[0].currency || "THB",
          productSizeUnitValue: data[0].unitMea || "",
          salesDescriptionValue: data[0].salesDescription || "",
          saleProductCode: data[0].saleProductCode || "",
          rateVat: data[0].rateVat || 0,
          rateWht: data[0].rateWht || 0,
          vatType: data[0].vatType || 0,
        });
        setCurrency(data[0].currency || "THB");
        setProductSizeUnitValue(data[0].unitMea || "");
        setSalesDescriptionValue(data[0].salesDescription || "");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          text: error.message || "โปรดลองใหม่อีกครั้ง",
        });
      }
    };
    loadData();
  }, [accDocNo, accItemNo]);

  const saveDataToAPI = async (data) => {
    console.log("DATA UPDATE:", data);
    console.log("userToken:", localStorage.getItem("userToken"));
    // ตรวจสอบว่า token มีอยู่ใน localStorage หรือไม่
    try {
      const response = await authFetch(
        "http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/EditAccTransactionDT",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`, // แนบ token ที่เก็บไว้ใน localStorage
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // ถ้า response เป็น JSON
        const responseData = await response.json();
        console.log("API response (JSON):", responseData);
        return responseData;
      } else {
        // ถ้า response เป็น text
        const responseText = await response.text();
        console.log("API response (Text):", responseText);
        return { message: responseText }; // ส่ง object จำลอง
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
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
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

        navigate(`/uitestacc/SRListDT?accDocNo=${accDocNo}`);
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
    Swal.fire({
      title: `Are you sure? ${accDocNo}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await authFetch(
            `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/DeleteAccTransactionDT/${accDocNo}?accItemNo=${accItemNo}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${localStorage.getItem("userToken")}`, // แนบ token ที่เก็บไว้ใน localStorage
              },
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

          navigate(`/uitestacc/SRListDT?accDocNo=${accDocNo}`);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการลบข้อมูล",
            text: error.message || "โปรดลองใหม่อีกครั้ง",
          });
        }
      }
    });
  };

  const handleMoreInfo = async (accDocNo) => {
    await MoreInfoDT(accDocNo, navigate);
    navigate("/uitestacc/MoreInfoDT", {
      state: {
        accDocNo,
        accItemNo,
      },
    });
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/SRListDT?accDocNo=${accDocNo}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const calculateTotal = () => {
    return (
      parseFloat(adddatadetail.price) *
      parseFloat(adddatadetail.qty) *
      parseFloat(adddatadetail.exchangeRate)
    );
  };
  const amount = calculateTotal();
  const qtyRef = useRef(null);
  const currencyRef = useRef(null);
  const exchangeRateRef = useRef(null);
  const priceRef = useRef(null);

  const handlePriceKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // ป้องกันการ submit form
      qtyRef.current.focus(); // โฟกัสไปที่ qty
      priceRef.current.focus();
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
  const [currency, setCurrency] = React.useState("THB");

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

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2 style={{ textAlign: "center" }}>Edit SR Detail</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          // paddingTop: "18px",
        }}
      >
        <ButtonSR actions={buttonActions} />
      </div>
      <div className="row">
        <div style={{ display: "flex" }}>
          {/* <div className="col-6" style={{ cursor: "pointer", display: "grid" }}>
          &nbsp; &nbsp;
          </div> */}
          {/* {docStatus === 0 && (
            <div
              className="col-5"
              style={{
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
            >
              <FontAwesomeIcon
                icon={faPen}
                size="2x"
                style={{ color: "#72047b" }}
                onClick={handleUpdate}
              />
            </div>
          )}
          {docStatus === 0 && (
            <div
              className="col-1"
              style={{
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                style={{ color: "#ae0000" }}
                onClick={handleDelete}
              />
            </div>
          )} */}
        </div>
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
                // type="text"
                multiline
                variant="standard"
                style={{ width: "100%", paddingRight: "5px" }}
                onChange={(event) =>
                  setSalesDescriptionValue(event.target.value)
                }
                onKeyDown={handlePriceKeyDown}
                // onKeyDown={handleInputKeyDown}
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
              // defaultValue={1}
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
              // defaultValue={1}
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
              // onChange={handleInputChange}
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
              // onChange={(event) => setProductSizeUnitValue(event.target.value)}
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
              // onChange={(event) => setProductSizeUnitValue(event.target.value)}
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
          {/* <div className="col-md-12" style={{display:"flex"}}> */}
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
        </div>
        {/* </div> */}
      </div>
      {isMoreInfoModalOpen && ( // <-- เพิ่มเงื่อนไขนี้
        <MoreInfoDT
          open={isMoreInfoModalOpen}
          handleClose={handleCloseMoreInfoModal}
          accDocNo={accDocNo}
          accItemNo={accItemNo}
          docConfigID={docConfigID}
          // fetchDataFromApi={fetchDataFromApi}
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
            onClick={handleGoBack}
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
            onClick={scrollToTop}
          />
        </div>
      </div>
    </div>
  );
}

export default SREditDetail;
