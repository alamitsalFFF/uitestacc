import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
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
import "../purchase/TPR.css";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { setAddProducts,setAccDocNo ,setSelectedProducts } from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from 'react-redux';
import { API_BASE } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";

function AddDetail() {
  // const location = useLocation();
  const authFetch = useAuthFetch();
  const dispatch = useDispatch();
  const accDocNo = useSelector((state) => state.accDocNo);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  
  const [price, setPrice] = useState(""); // Declare price state


  const navigate = useNavigate();

  const newaccItemNo = 0;

const [rateVatValue, setRateVatValue] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.rateVat) : []);
const [rateWhtValue, setRateWhtValue] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.rateWht) : []);
const [vatTypeValue, setVatTypeValue] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.vatType) : []);
// const [unitStockValue, setunitStockValue] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.unitStock) : []);
const [productSizeUnitValue, setProductSizeUnitValue] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.ProductSizeUnit) : []);
const [productCode, setproductCode] = useState(selectedProducts && selectedProducts.length > 0 ? selectedProducts.map(p => p.productCode) : []);
console.log("productCode:",productCode);

  const [adddatadetail, setdAddataDetail] = useState({
    price: "1",
    qty: "1",
    currency: "THB",
    exchangeRate: "1",
    // unitStocks: "",
    // unitStockValue: "",
    productSizeUnitValue: "",
  });

  
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setdAddataDetail({ ...adddatadetail, [id]: value });
  };

  const [newData, setNewData] = useState(null);

  const saveDataToAPI = async (data) => {

    try {
      const response = await authFetch(
        `${API_BASE}/AccTransaction/SetAccTransactionDT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
             // ตรวจสอบ status code และแสดงข้อความผิดพลาด
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text(); // รับข้อความ error จาก response
      console.error("API error message:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // ตรวจสอบ content type
        const responseText = await response.text();
        if (responseText === "AccTransactionDTs Created.") {
          // ถือว่าสำเร็จ (แต่ควรแก้ไข API)
          console.log("API response: AccTransactionDTs Created.");
          return { message: "AccTransactionDTs Created." }; // ส่ง object จำลอง
        } else {
          console.error("Response is not JSON:", responseText);
          throw new Error("Response is not JSON");
        }
      }
  
      const responseData = await response.json();
      console.log("API response:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error saving data to API:", error);
      throw error; // ส่งต่อ error เพื่อให้ handleSave จัดการ
    }
  };

  const handleSave = async () => {
    if (!adddatadetail.price || !adddatadetail.qty) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกราคาและจำนวน",
      });
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }
    // console.log(
    //   "location.state?.selectedProducts:",
    //   location.state?.selectedProducts
    // );
    console.log("selectedProducts:", selectedProducts);
    
    const addProducts = selectedProducts.map((product) => {
      return {
        accDocNo: product.accDocNo,
        newaccItemNo: newaccItemNo,
        // accSourceDocNo: '0',
        accSourceDocNo: "",
        accSourceDocItem: 0,//demo
        stockTransNo: 0,//demo
        qty: parseFloat(adddatadetail.qty),
        price: parseFloat(adddatadetail.price),
        unitMea: productSizeUnitValue[0],
        // unitMea: unitStockValue[0],
        currency: adddatadetail.currency,
        exchangeRate: parseFloat(adddatadetail.exchangeRate),
        amount: calculateTotal(),
        saleProductCode: productCode[0],
        // saleProductCode: product.productTypeCode,
        salesDescription: product.productName,
        // rateVat: rateVatValue,
        // rateWht: rateWhtValue,
        rateVat: parseFloat(rateVatValue[0]),
        rateWht: parseFloat(rateWhtValue[0]),
        vatType: parseFloat(vatTypeValue[0]),
        // vatType: 1,
      };
    });

    // console.log('addProducts before navigate:', addProducts);
    console.log(
      "addProducts before navigate:",
      JSON.stringify(addProducts, null, 2)
    ); // ตรวจสอบข้อมูล
    // const amount = calculateTotal();
    try {
      await saveDataToAPI(addProducts);
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate(`/uitestacc/PRListDT?accDocNo=${accDocNo}`, {
        state: {
          accDocNo: selectedProducts[0].accDocNo,
          addProducts: addProducts,
        },
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/PRListDT?accDocNo=${accDocNo}`);
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
  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const qtyRef = useRef(null);
  const currencyRef = useRef(null);
  const exchangeRateRef = useRef(null);

  const handlePriceKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // ป้องกันการ submit form
      qtyRef.current.focus(); // โฟกัสไปที่ qty
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
  useEffect(() => {
    console.log("accDocNo from Redux:", selectedProducts[0].accDocNo); 
  }, [selectedProducts[0].accDocNo]);

  return (
    <div className="row" style={{ padding: "5%"  ,paddingTop:"1px"}}>
      <h1 style={{ textAlign: "center" }}>Add PR Detail</h1>
      {/* <div>&nbsp;</div> */}
      {/* <div>&nbsp;</div> */}
      <div className="row">
              <div style={{ display: "flex" }}>
                <div className="col-6" style={{ cursor: "pointer", display: "grid" }}>
                  {/* <FontAwesomeIcon
                    icon={faFloppyDisk}
                    size="2x"
                    style={{ color: "green" }}
                    onClick={handleSave}
                  /> */}
                </div>
        
                <div
                  className="col-5"
                  style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
                >
                  {/* <FontAwesomeIcon
                    icon={faPen}
                    size="2x"
                    style={{ color: "#72047b" }}
                    // onClick={handleUpdate}
                  /> */}
                </div>
                <div
                  className="col-1"
                  style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    size="2x"
                    style={{ color: "green" }}
                    onClick={handleSave}
                  />
                </div>
              </div>

        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            {/* <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
              DocNo:&nbsp; {selectedProducts[0].accDocNo} &nbsp;
            </h5> */}
          </div>{" "}
          {/* พื้นที่ว่างด้านซ้าย */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
              {/* &nbsp; {productName}  */}
              &nbsp; {selectedProducts[0]?.productName}
              &nbsp;
            </h5>
            {/* <FontAwesomeIcon
              icon={faBoxOpen}
              size="2x"
              style={{ color: "#2d01bd" }}
            /> */}
          </div>
        </ListItem>
        {/* <div>&nbsp; &nbsp;</div> */}
        <div className="col-md-12" 
        style={{ display: "flex" }}
        >
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
              // value={1}
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
              value={rateVatValue}
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
              value={rateWhtValue}
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
                &nbsp; {adddatadetail.price}x{adddatadetail.qty}
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
      <div>&nbsp;</div>
      <div className="row">
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
    </div>
  );
}

export default AddDetail;
