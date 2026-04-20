import React, { useState, useEffect, useRef } from "react";
import axios from "../Auth/axiosConfig";
import { useAuthFetch } from "../Auth/fetchConfig";
import "./Cash Sale.css";
import {
  Row,
  Form,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { faSquarePlus, faMoneyBillTransfer, faUserTie, faMoneyCheckDollar, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CashSaleData from "./AccordionCashSaleData";
import { API_BASE, StoredProcedures_Base } from "../api/url";
import AccordionSelectProductCS from "./AccordionSelectProductCS";
import AccCodeModal from "./AccCode";
import DocTypeModal from "./DocType";
import Swal from "sweetalert2";

function AccordionQuickPaymentMain({ onSaveSuccess }) {
  const [data, setData] = useState([]); // เก็บข้อมูลจาก API
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState("");
  const [options, setOptions] = useState([]); // ข้อมูลจาก API
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  // const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(1);
  const [currency, setCurrency] = useState("THB");
  const [excrate, setExcrate] = useState(1);

  const [costprice, setCostprice] = useState("0");
  const [profitrate, setProfitrate] = useState("0");
  const [note, setNote] = useState("");
  const [journalNo, setJournalNo] = useState("");
  const initialState = {
    productName: "",
    // qty: 1,
    price: 1,
    currency: "THB",
    excrate: 1,
    costprice: 0,
    profitrate: 0,
    note: "",
    // ---
    // productcode: "",
    // curr: "",
    // rate: 1,
    // qty: 1,
    // price: 1,
    // ref: "",
    // docdate date,
    // partycode varchar(20),
    // partytaxcode varchar(20),
    // partyname varchar(50),
    // partyaddr varchar(MAX),
    // userid varchar(20),
    // note varchar(max),
    // vatrate int,
    // whtrate int,
    // vattype int,--1 exc 2 inc
    // doctype varchar(5), --PC
    // acctype int,--0 สด 1 เชื่อ
    // acccode varchar(20),
    rcpno: "",
    trantype: "",
    bankacc: "",
    bankname: "",
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันการ reload หน้าเพจ
    event.stopPropagation(); // หยุดการส่ง event ไปยัง parent element

    const form = event.currentTarget;
    // ข้ามการตรวจ validity ของฟิลด์ expcode (name="expcode") และ acccode (name="acccode")
    const expEl = form.querySelector('[name="expcode"], #expcode');
    const accEl = form.querySelector('[name="acccode"], #acccode');
    const elementsToCheck = Array.from(form.elements).filter(
      (el) =>
        el !== expEl &&
        el !== accEl &&
        typeof el.checkValidity === "function" &&
        el.willValidate
    );
    const othersValid = elementsToCheck.every((el) => el.checkValidity());

    if (form.checkValidity() === false || !othersValid) {
      setValidated(true);
      return;
    }

    // ใช้ parseFloat() เพื่อแปลงค่า string ที่ได้จาก input เป็น number
    const excrateValue = parseFloat(excrate);

    // ตรวจสอบว่าค่าที่แปลงได้เป็นตัวเลขและมากกว่า 0 หรือไม่
    if (isNaN(excrateValue) || excrateValue <= 0) {
      setValidated(true);
      return; // หยุดการทำงานหากค่าไม่ถูกต้อง
    }

    // หากข้อมูลถูกต้อง
    setValidated(false); // ลบข้อความแจ้งเตือนหากทุกอย่างเรียบร้อย
    setError(null);
    // await handleSetJournalDT(costprice, profitrate);

    // ข้อมูลที่ต้องการส่งไปยัง API
    const currentDate = new Date();
    // const cleanedRate = parseFloat(event.target.rate.value).toString();
    // const cleanedQty = parseFloat(event.target.qty.value).toString();
    // const cleanedPrice = parseFloat(event.target.price.value).toString();
    const cleanedRate = parseFloat(excrate).toFixed(2); // ใช้ excrate state
    // const cleanedQty = parseFloat(qty).toFixed(2); // ใช้ qty state
    const cleanedPrice = parseFloat(price).toFixed(2); // ใช้ price state
    // const cleanedVatrate = parseInt(event.target.vatrate.value).toString();
    // const cleanedVatrate = parseInt(vatrate).toString(); // ใช้ vatrate state
    const cleanedVatrate = parseInt(event.target.vatrate.value).toString();
    const cleanedWhtrate = parseInt(event.target.whtrate.value).toString();
    const cleanedVattype = parseInt(event.target.vattype.value).toString();
    const cleanedAcctype = parseInt(event.target.acctype.value).toString();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD
    const formData = {
      name: "Insert_QuickPayment",
      parameters: [
        {
          param: "expcode",
          // value: event.target.expcode.value.split(" / ")[0].trim(), // ใช้ expcode state
          value: event.target.expcode.value, // ใช้ expcode state
        },
        {
          param: "curr",
          value: event.target.currency.value,
        },
        {
          param: "rate",
          // value: event.target.rate.value,
          value: cleanedRate,
          // value: 1,
        },
        // {
        //   param: "qty",
        //   // value: event.target.qty.value,
        //   value: cleanedQty,
        //   // value: 1,
        // },
        {
          param: "price",
          // value: event.target.price.value,
          value: cleanedPrice,
          // value: 10,
        },
        {
          param: "ref",
          value: event.target.ref.value,
        },
        {
          param: "docdate",
          value: event.target.docdate.value, //
        },
        {
          param: "partycode",
          value: event.target.partycode.value,
        },
        {
          param: "partytaxcode",
          value: event.target.partytaxcode.value,
        },
        {
          param: "partyname",
          value: event.target.partyname.value,
        },
        {
          param: "partyaddr",
          value: event.target.partyaddr.value,
        },
        {
          param: "userid",
          value: event.target.userid.value, //
        },
        {
          param: "note",
          value: event.target.note.value,
        },
        {
          param: "vatrate",
          // value: event.target.vatrate.value,
          value: cleanedVatrate,
          // value: 7,
        },
        {
          param: "whtrate",
          // value: event.target.whtrate.value,
          value: cleanedWhtrate,
          // value: 0,
        },
        {
          param: "vattype",
          // value: event.target.vattype.value,
          value: cleanedVattype,
          // value: parseInt(event.target.vattype.value).toString(),
          // value: 2,
        },
        {
          param: "doctype",
          // value: event.target.doctype.value,
          value: selectedDocType.code,
        },
        {
          param: "acctype",
          // value: event.target.acctype.value,
          value: cleanedAcctype, //PC
          // value: 0,
        },
        {
          param: "acccode",
          // value: event.target.acccode.value,
          value: selectedAccCode.code,
        },
        {
          param: "rcpno",
          value: event.target.rcpno.value,
        },
        {
          param: "trantype",
          value: event.target.trantype.value, //TRF/CASH/CHQ/CRCARD/DRCARD
        },
        {
          param: "bankacc",
          value: event.target.bankacc.value,
        },
        {
          param: "bankname",
          value: event.target.bankname.value,
        },
      ],
    };
    const result = await Swal.fire({
      title: "ยืนยันการบันทึกข้อมูล?",
      text: "คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        console.log("formData:", formData);
        setLoading(true);
        const response = await axios.post(`${StoredProcedures_Base}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setLoading(false);
          // alert("บันทึกข้อมูลสำเสร็จ");
          console.log("data", data);
          setJournalNo(response.data.data[0].JournalNo);
          onSaveSuccess(response.data.data);
          // navigate('/CashSaleData', { state: { data } });
        } else {
          setLoading(false);
          console.error("Error:", response.statusText);
          setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        console.log("response.data.data", response.data.data);
        console.log("response.data.data", response.data.data[0].JournalNo);
        Swal.fire({
          icon: "success",
          title: `บันทึก ${response.data.data[0].JournalNo} เรียบร้อยแล้ว`,
          showConfirmButton: false,
          timer: 3000,
        });
        setLoading(false);
        setData(response.data.data);
        // console.log('data2',data)
      } catch (error) {
        console.error("Error:", error);
        const errorMessage =
          error.response && error.response.data
            ? "Error 500: " + error.response.data
            : "เกิดข้อผิดพลาดภายใน (Error 500) กรุณาติดต่อผู้ดูแลระบบ";

        alert(errorMessage);
        console.log("error", errorMessage);
        setError(error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // ฟังก์ชันสำหรับเรียก API และอัปเดต options
    const fetchOptions = async () => {
      const response = await authFetch(`${API_BASE}/Product/GetProduct`);
      const dataproduct = await response.json();
      setOptions(dataproduct);
    };
    fetchOptions();
  }, []);

  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [productName, setProductName] = useState("");
  // Product select handler
  const handleProductSelect = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับเปิด Modal เลือกสินค้า
  const handleOpenProductModal = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับปิด Modal เลือกสินค้า
  const handleCloseProductModal = () => {
    setOpenProductModal(false);
  };
  const handleConfirmProductSelection = (productData) => {
    if (productData) {
      // สร้าง string ที่รวม productCode และ productName เข้าด้วยกัน
      const displayValue = `${productData.productCode} / ${productData.productName}`;

      // อัปเดต state ด้วย string ที่สร้างขึ้น
      setProductName(displayValue);
    }
    handleCloseProductModal();
  };

  // const [selectedAccCode, setSelectedAccCode] = useState(""); // เก็บค่า AccCode ที่เลือก เช่น '110001'
  const [selectedAccCode, setSelectedAccCode] = useState({
    code: "",
    name: "",
  });
  // selected value for EXPCODE (expense acccode)
  const [selectedExpCode, setSelectedExpCode] = useState({
    code: "",
    name: "",
  });
  const [openAccCodeModal, setOpenAccCodeModal] = useState(false); // สถานะการเปิด/ปิด Modal AccCode
  const [accCodeModalFilter, setAccCodeModalFilter] = useState(null); // null = no filter, 5 = expense only
  // which target field the modal should set: "primary" (acccode) or "exp" (expcode)
  const accCodeTargetRef = useRef("primary");
  // Function สำหรับเปิด Modal เลือก AccCode
  const handleOpenAccCodeModal = (target = "primary") => {
    accCodeTargetRef.current = target;
    // ถ้าเปิดเพื่อ EXPCODE ให้กรองหมวดเป็น 5 เท่านั้น
    setAccCodeModalFilter(target === "exp" ? 5 : null);
    setOpenAccCodeModal(true);
  };
  // Function สำหรับปิด Modal เลือก AccCode
  const handleCloseAccCodeModal = () => {
    setOpenAccCodeModal(false);
  };

  // 2. Function สำหรับยืนยันการเลือก AccCode
  const handleConfirmAccCodeSelection = (accCodeData) => {
    if (!accCodeData || !accCodeData.code) {
      handleCloseAccCodeModal();
      return;
    }
    const target = accCodeTargetRef.current;
    // Try checking common property names for category (category / cat / grp / group)
    const cat = accCodeData.category ?? accCodeData.cat ?? accCodeData.grp ?? accCodeData.group ?? accCodeData.type ?? null;

    if (target === "exp") {
      // ถ้ามี category และไม่ใช่ 5 ให้บล็อก
      if (cat != null && Number(cat) !== 5) {
        Swal.fire({
          icon: "warning",
          title: "เลือกไม่ได้",
          text: "กรุณาเลือกบัญชีหมวดประเภทค่าใช้จ่าย (หมวด 5) สำหรับ EXPCODE",
        });
        handleCloseAccCodeModal();
        return;
      }
      // ถ้าไม่มี category หรือเป็น 5 ให้ยอมรับ
      setSelectedExpCode(accCodeData);
    } else {
      // primary acccode field (no restriction)
      setSelectedAccCode(accCodeData);
    }
    handleCloseAccCodeModal();
  };

  const [selectedDocType, setSelectedDocType] = useState({
    code: "PC",
    name: "Cheque Payment",
  }); // ตั้งค่าเริ่มต้นให้เป็น "PC"
  // const [selectedDocType, setSelectedDocType] = useState("");
  const [openDocTypeModal, setOpenDocTypeModal] = useState(false); // สถานะการเปิด/ปิด Modal DocType

  const handleOpenDocTypeModal = () => {
    setOpenDocTypeModal(true);
  };

  // Function สำหรับปิด Modal เลือก DocType
  const handleCloseDocTypeModal = () => {
    setOpenDocTypeModal(false);
  };

  // Function สำหรับยืนยันการเลือก DocType
  const handleConfirmDocTypeSelection = (docTypeData) => {
    if (docTypeData && docTypeData.code) {
      console.log("docTypeData:", docTypeData);
      setSelectedDocType(docTypeData);
    }
    handleCloseDocTypeModal();
  };

  const currencies = [
    { value: "THB", label: "THB - Thai Baht" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CNY", label: "CNY - Chinese Yuan" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "CHF", label: "CHF - Swiss Franc" },
    { value: "HKD", label: "HKD - Hong Kong Dollar" },
    { value: "NZD", label: "NZD - New Zealand Dollar" },
    { value: "MB", label: "Million Baht" },
  ];
  const vatrates = [
    { value: "7", label: "7%" },
    { value: "0", label: "0%" },
  ];
  const whtrates = [
    { value: "0", label: "0%" },
    { value: "1", label: "1%" },
    { value: "3", label: "3%" },
  ];

  const vattypes = [
    { value: "2", label: "VAT Inclusive" },
    { value: "1", label: "VAT Exclusive" },
    // { value: "0", label: "Non VAT" },
  ];

  const acctypes = [
    { value: "0", label: "ซื้อสด" },
    { value: "1", label: "ซื้อเชื่อ" },
  ];

  const transtype = [
    // { value: "TR", label: "TR" },
    // { value: "CQ", label: "CQ" },
    { value: "TRF", label: "TRF/การโอนเงิน" },
    { value: "CASH", label: "CASH/เงินสด" },
    { value: "CHQ", label: "CHQ/เช็ค" },
    { value: "CRCARD", label: "CRCARD/บัตรเครดิต" },
    { value: "DRCARD", label: "DRCARD/บัตรเดบิต" }
  ];

  const handleClear = () => {
    // รีเซ็ตค่า state ทุกตัวให้กลับไปเป็นค่าเริ่มต้น
    setProductName(initialState.productName);
    // setQty(initialState.qty);
    setPrice(initialState.price);
    setCurrency(initialState.currency);
    setExcrate(initialState.excrate);
    setCostprice(initialState.costprice);
    setProfitrate(initialState.profitrate);
    setNote(initialState.note);
    setSelectedAccCode("");
    setSelectedDocType("");
    setValidated(false); // ปิดการแจ้งเตือน Validation
    setError(null); // ลบข้อความ Error
  };

  const SectionHeader = ({ icon, title, color }) => (
    <Typography variant="h6" style={{ color: color || "#333", display: "flex", alignItems: "center", marginBottom: "15px", fontWeight: "bold" }}>
      <FontAwesomeIcon icon={icon} style={{ marginRight: "10px" }} /> {title}
    </Typography>
  );

  return (
    <div style={{ padding: "20px 5%" }}>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="form-pr"
      >
        <Grid container spacing={3}>
          {/* 1. Expense & Amount */}
          <Grid item xs={12}>
            <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #1976d2" }}>
              <CardContent>
                <SectionHeader icon={faMoneyBillTransfer} title="Expense & Amount" color="#1976d2" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="expcode">
                    <Form.Label style={{ display: "flex", color: "#00008b", fontWeight: 700 }}>
                      EXPCODE &nbsp;
                      <Stack direction="row" spacing={1}>
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          size="xl"
                          style={{ color: "#0300b6ff", cursor: "pointer" }}
                          onClick={() => handleOpenAccCodeModal("exp")}
                        />
                      </Stack>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="expcode"
                        placeholder="รหัสค่าใช้จ่าย"
                        value={
                          selectedExpCode.code
                            ? `${selectedExpCode.code} / ${selectedExpCode.name}`
                            : ""
                        }
                        readOnly
                        style={{ backgroundColor: "#ffffe0" }}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="price">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="ราคาต่อหน่วย"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอราคาต่อหน่วย
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="currency">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Currency</Form.Label>
                    <Form.Select required defaultValue="THB" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกสกุลเงิน...</option>
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>{currency.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="1" controlId="rate">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Rate</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Rate"
                      value={excrate}
                      onChange={(e) => setExcrate(e.target.value)}
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="ref">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Ref Doc</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="เลขใบสั่งซื้อ/ใบส่งของ"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกเลขอ้างอิง
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="docdate">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Date</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Party Information */}
          <Grid item xs={12} md={7}>
            <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #2e7d32" }}>
              <CardContent>
                <SectionHeader icon={faUserTie} title="Party Information" color="#2e7d32" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="partycode">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>PartyCode</Form.Label>
                    <Form.Control type="text" placeholder="รหัสผู้จำหน่าย" required style={{ backgroundColor: "#ffffe0" }} />
                    <Form.Control.Feedback type="invalid">กรุณากรอกรหัสผู้จำหน่าย</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="8" controlId="partytaxcode">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>PartyTax</Form.Label>
                    <Form.Control type="text" placeholder="เลขประจำตัวผู้เสียภาษี/ลำดับสาขา" required style={{ backgroundColor: "#ffffe0" }} />
                    <Form.Control.Feedback type="invalid">กรุณากรอกเลขประจำตัวผู้เสียภาษี</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="partyname">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>PartyName</Form.Label>
                    <Form.Control type="text" placeholder="ชื่อผู้จำหน่าย" required style={{ backgroundColor: "#ffffe0" }} />
                    <Form.Control.Feedback type="invalid">กรุณากรอกชื่อผู้จำหน่าย</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="partyaddr">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>PartyAddr</Form.Label>
                    <Form.Control type="text" placeholder="ที่อยู่ผู้จำหน่าย" required style={{ backgroundColor: "#ffffe0" }} />
                    <Form.Control.Feedback type="invalid">กรุณากรอกที่อยู่ผู้จำหน่าย</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Notes & Support */}
          <Grid item xs={12} md={5}>
            <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #6a1b9a" }}>
              <CardContent>
                <SectionHeader icon={faNoteSticky} title="Notes & Support" color="#6a1b9a" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="userid">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Support By</Form.Label>
                    <Form.Control
                      required type="text"
                      defaultValue={localStorage.getItem("userName")}
                      readOnly
                      style={{ backgroundColor: "#cdcdd1" }}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="note">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Note</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="หมายเหตุ/สัญญาเลขที่"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">กรุณากรอกหมายเหตุ</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 4. Financials & Tax */}
          <Grid item xs={12}>
            <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #f9a825" }}>
              <CardContent>
                <SectionHeader icon={faMoneyCheckDollar} title="Financials & Tax" color="#f9a825" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="vatrate">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>VatRate</Form.Label>
                    <Form.Select required defaultValue="7" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกอัตราภาษี...</option>
                      {vatrates.map((vatrate) => (<option key={vatrate.value} value={vatrate.value}>{vatrate.label}</option>))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="whtrate">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>WhtRate</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกอัตราภาษีหัก ณ ที่จ่าย...</option>
                      {whtrates.map((whtrate) => (<option key={whtrate.value} value={whtrate.value}>{whtrate.label}</option>))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="vattype">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>VatType</Form.Label>
                    <Form.Select required defaultValue="1" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกประเภทการคิด...</option>
                      {vattypes.map((vattype) => (<option key={vattype.value} value={vattype.value}>{vattype.label}</option>))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="acctype">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Acctype</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกประเภทการชำระเงิน...</option>
                      {acctypes.map((acctype) => (<option key={acctype.value} value={acctype.value}>{acctype.label}</option>))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="doctype">
                    <Form.Label style={{ display: "flex", color: "#00008b", fontWeight: 700 }}>
                      DocType &nbsp;
                      <Stack direction="row" spacing={1}>
                        <FontAwesomeIcon icon={faSquarePlus} size="xl" style={{ color: "#0300b6ff", cursor: "pointer" }} onClick={handleOpenDocTypeModal} />
                      </Stack>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text" placeholder="กรุณาเลือกDocType+"
                        value={selectedDocType.code ? `${selectedDocType.code} / ${selectedDocType.name}` : ""}
                        required style={{ backgroundColor: "#ffffe0" }}
                      />
                      <Form.Control.Feedback type="invalid">กรุณาเลือก DocType</Form.Control.Feedback>
                    </InputGroup>
                    <DocTypeModal isOpen={openDocTypeModal} onClose={handleCloseDocTypeModal} onSelect={handleConfirmDocTypeSelection} />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="acccode">
                    <Form.Label style={{ display: "flex", color: "#00008b", fontWeight: 700 }}>
                      Acccode &nbsp;
                      <Stack direction="row" spacing={1}>
                        <FontAwesomeIcon icon={faSquarePlus} size="xl" style={{ color: "#0300b6ff", cursor: "pointer" }} onClick={() => handleOpenAccCodeModal("primary")} />
                      </Stack>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text" placeholder="กรุณาเลือกAccCode+"
                        value={selectedAccCode.code ? `${selectedAccCode.code} / ${selectedAccCode.name}` : ""}
                        required style={{ backgroundColor: "#ffffe0" }}
                      />
                      <Form.Control.Feedback type="invalid">กรุณาเลือก AccCode</Form.Control.Feedback>
                    </InputGroup>
                    <AccCodeModal isOpen={openAccCodeModal} onClose={handleCloseAccCodeModal} onSelect={handleConfirmAccCodeSelection} categoryFilter={accCodeModalFilter} />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="rcpno">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>RCPNO</Form.Label>
                    <Form.Control type="text" placeholder="เลขใบเสร็จ/ใบกำกับที่ได้มา" required style={{ backgroundColor: "#ffffe0" }} />
                    <Form.Control.Feedback type="invalid">กรุณากรอกเลขใบเสร็จ</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="trantype">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Trantype</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>เลือกประเภท...</option>
                      {transtype.map((trantype) => (<option key={trantype.value} value={trantype.value}>{trantype.label}</option>))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="bankacc">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Bank Account</Form.Label>
                    <Form.Control type="text" placeholder="ชื่อธนาคาร(กรณีเงินโอน)" required style={{ backgroundColor: "#ffffe0" }} />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="bankname">
                    <Form.Label style={{ color: "#00008b", fontWeight: 700 }}>Bankname</Form.Label>
                    <Form.Control type="text" placeholder="ชื่อสาขา/สมุดบัญชี/เลข Ref" required style={{ backgroundColor: "#ffffe0" }} />
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" style={{ marginRight: "10px" }} onClick={handleClear}>
            Clear
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AccordionQuickPaymentMain;
