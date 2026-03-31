import React, { useState, useEffect } from "react";
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
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CashSaleData from "./AccordionCashSaleData";
import { API_BASE, StoredProcedures_Base } from "../api/url";
import AccordionSelectProductCS from "./AccordionSelectProductCS";
import Swal from "sweetalert2";

function AccordionCashSaleMain({ onSaveSuccess }) {
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

  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("1");
  const [currency, setCurrency] = useState("THB");
  const [excrate, setExcrate] = useState("1");
  const [costprice, setCostprice] = useState("0");
  const [profitrate, setProfitrate] = useState("0");
  const [note, setNote] = useState("");
 const [journalNo, setJournalNo] = useState("");
  const initialState = {
    productName: "",
    qty: "1",
    price: "1",
    currency: "THB",
    excrate: "1",
    costprice: "0",
    profitrate: "0",
    note: ""
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันการ reload หน้าเพจ
    event.stopPropagation(); // หยุดการส่ง event ไปยัง parent element

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
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
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD
    const formData = {
      name: "Insert_QuickCashSaleProduct",
      parameters: [
        {
          param: "userid",
          value: event.target.userid.value,
        },
        {
          param: "note",
          value: event.target.note.value,
        },
        {
          param: "cashbook",
          value: event.target.cashbook.value,
        },
        {
          param: "product",
          value: event.target.product.value,
        },
        {
          param: "qty",
          value: event.target.qty.value,
        },
        {
          param: "price",
          value: event.target.price.value,
        },
        {
          param: "curr",
          value: event.target.currency.value,
        },
        {
          param: "excrate",
          value: event.target.excrate.value,
        },
        {
          param: "docdate",
          value: event.target.docdate.value,
          // value: formattedDate,
        },
        {
          param: "costprice",
          value: event.target.costprice.value,
        },
        {
          param: "profitrate",
          value: event.target.profitrate.value,
        },
      ],
    };
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
        alert("บันทึกข้อมูลสำเสร็จ");
        console.log("data", data);
        setJournalNo(response.data.data[0].JournalNo);
        onSaveSuccess(response.data.data);
        Swal.fire({
              icon: "success",
              title: `บันทึก ${response.data.data[0].JournalNo} เรียบร้อยแล้ว`,
              showConfirmButton: false,
              timer: 3000,
            });
        // navigate('/CashSaleData', { state: { data } });
      } else {
        setLoading(false);
        console.error("Error:", response.statusText);
        setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
      console.log("response.data.data", response.data.data);
      console.log("response.data.data", response.data.data[0].JournalNo);
      setLoading(false);
      setData(response.data.data);
      // console.log('data2',data)
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // if (data.length > 0) {
  //   const searchParams = new URLSearchParams({ data: JSON.stringify(data) });
  //   const newPageUrl = `/uitestacc/CashSaleData?${searchParams.toString()}`;
  //   const win = window.open(newPageUrl, "_blank");
  //   if (win) {
  //     win.focus();
  //   }
  // }

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

  const currencies = [
    { value: "THB", label: "THB - Thai Baht" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
  ];

    const handleClear = () => {
    // รีเซ็ตค่า state ทุกตัวให้กลับไปเป็นค่าเริ่มต้น
    setProductName(initialState.productName);
    setQty(initialState.qty);
    setPrice(initialState.price);
    setCurrency(initialState.currency);
    setExcrate(initialState.excrate);
    setCostprice(initialState.costprice);
    setProfitrate(initialState.profitrate);
    setNote(initialState.note);

    setValidated(false); // ปิดการแจ้งเตือน Validation
    setError(null); // ลบข้อความ Error
  };

  return (
    <div>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="form-pr"
      >
        {/* <h2 className="h2-pr" style={{ textAlign: "center" }}>
        Quick Sale
        </h2> */}
        <Row className="mb-3">
          <Form.Group as={Col} md="3" controlId="userid">
            <Form.Label>Support By</Form.Label>
            <Form.Control
              required
              type="text"
              // defaultValue="ADMIN"
              defaultValue={localStorage.getItem("userName")}
            />
            {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
          </Form.Group>
          <Form.Group as={Col} md="5">
            <Form.Label>JournalNo</Form.Label>
            <Form.Control required type="text" value={journalNo}  readOnly />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="docdate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              required
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="cashbook">
            <Form.Label>Cashbook</Form.Label>
            <Form.Control
              type="text"
              placeholder="ผู้รับเงิน/ขายโดย"
              defaultValue={localStorage.getItem("userName")}
              required
            />
            <Form.Control.Feedback type="invalid">
              กรุณากรอกผู้รับเงิน/ขายโดย
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="note">
            <Form.Label>Note</Form.Label>
            <Form.Control
              type="text"
              placeholder="หมายเหตุ/สถานที่"
              defaultValue="TAWANNA"
              required
            />
            <Form.Control.Feedback type="invalid">
              กรุณากรอกหมายเหตุ/สถานที่.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          {/* ช่อง Product */}
          <Col xs={12} lg={12}>
            <Form.Group controlId="product">
              <Form.Label style={{ display: "flex" }}>
                Product &nbsp;
                {!showEditDetailModal && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="warning"
                      style={{
                        width: "184px",
                        height: "33px",
                      }}
                      onClick={handleProductSelect}
                    >
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        size="2x"
                        style={{ color: "#fff", justifyItems: "end" }}
                      />
                      &nbsp;Product/Service
                    </Button>
                  </Stack>
                )}
              </Form.Label>
              <InputGroup>
                <Form.Control type="text" value={productName} />
              </InputGroup>
            </Form.Group>
          </Col>

          {/* ปุ่มเลือก Product */}
          {/* <Col xs={12} lg={4} // style={{ paddingTop: '27px' }}
          >
          
            {!showEditDetailModal && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  style={{
                    width: "183px",
                    height: "33px",
                  }}
                  onClick={handleProductSelect}
                >
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    size="2x"
                    style={{ color: "#fff", justifyItems: "end" }}
                  />
                  &nbsp;Product/Service
                </Button>
              </Stack>
            )}
          </Col> */}

          <AccordionSelectProductCS
            isOpen={openProductModal}
            onClose={handleCloseProductModal}
            onSave={handleConfirmProductSelection}
          />
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="qty">
            <Form.Label>Qty</Form.Label>
            <Form.Control
              type="number"
              placeholder="จำนวน"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              กรุณากรอกจำนวน
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="ราคา"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              กรุณากรอกราคา
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="currency">
            <Form.Label>สกุลเงิน</Form.Label>
            <Form.Select required defaultValue="THB">
              <option value="" disabled>
                เลือกสกุลเงิน...
              </option>
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              กรุณากรอกสกุลเงิน
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="excrate">
            <Form.Label>Rate</Form.Label>
            <Form.Control
              type="number"
              placeholder="1"
              value={excrate} // ใช้ value จาก state
              onChange={(e) => setExcrate(e.target.value)} // อัปเดต state เมื่อค่าเปลี่ยนแปลง
              required
            />
            <Form.Control.Feedback type="invalid">
              กรุณากรอกเรต
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="costprice">
            <Form.Label>Costprice</Form.Label>
            <Form.Control
              type="number"
              placeholder="ต้นทุนต่อหน่วย"
              value={costprice}
              onChange={(e) => setCostprice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="profitrate">
            <Form.Label>Profitrate</Form.Label>
            <Form.Control
              type="number"
              placeholder="อัตรากำไร"
             value={profitrate}
              onChange={(e) => setProfitrate(e.target.value)}
              required
            />
          </Form.Group>
        </Row>

        <Button
          variant="contained"
          color="secondary"
          style={{ marginLeft: "auto", marginRight: "10px" }}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
        {/* </Link> */}
      </Form>
    </div>
  );
}

export default AccordionCashSaleMain;
