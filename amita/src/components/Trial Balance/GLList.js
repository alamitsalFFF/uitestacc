import React, { useState, useEffect } from "react";
import axios from "axios";
import { ButtonGroup } from "@mui/material";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setAccDocNo,
  setAccItemNo,
  setDetailData,
  setSelectedProducts,
  setAddProducts,
  setTotalAmount,
  setVatAmount,
  setWhtAmount,
  setIsVatEnabled,
  setIsWhtEnabled,
  setAccEffectiveDate,
  setPartyCode,
  setPartyName,
  setNameCategory,
} from "../redux/TransactionDataaction.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faUserGroup,
  faSquarePlus,
  faChevronRight,
  faCircleArrowLeft,
  faRectangleList,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import {
  Switch,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { formatNumber } from "../purchase/formatNumber.js";
import Abbreviation from "../purchase/Abbreviation.js";
import { FormatDate } from "../purchase/FormatData.js";
import { GET_VIEW_RESULT, REPORT_BASE } from "../api/url.js";

function GLList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const AccCode = useSelector((state) => state.accDocNo);
  const accItemNo = useSelector((state) => state.accItemNo);
  const detailData = useSelector((state) => state.detailData);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const addProducts = useSelector((state) => state.addProducts);
  const totalAmount = useSelector((state) => state.totalAmount);
  const vatAmount = useSelector((state) => state.vatAmount);
  const whtAmount = useSelector((state) => state.whtAmount);
  const isVatEnabled = useSelector((state) => state.isVatEnabled);
  const isWhtEnabled = useSelector((state) => state.isWhtEnabled);
  const accEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const partyCode = useSelector((state) => state.partyCode);
  const partyName = useSelector((state) => state.partyName);
  const nameCategory = useSelector((state) => state.nameCategory);

  const [isproductName, setProductName] = useState([]);
  const [price, setPrice] = useState([]);
  const [qty, setQty] = useState([]);
  const [productName, setproductName] = useState(false);
  const [itemCounter, setItemCounter] = useState(1);

  useEffect(() => {
    if (
      location.state?.addProducts &&
      Array.isArray(location.state.addProducts)
    ) {
      setAddProducts(location.state.addProducts);
      console.log("addProducts:", location.state.addProducts);
      // console.log("addProductsACCDOCNO:", location.state.addProducts[0].accDocNo);
    }
  }, [location.state?.addProducts]);

  useEffect(() => {
    if (location.state && location.state.accDocNo) {
      const accDocNoFromState = location.state.accDocNo;
      dispatch(setAccDocNo(accDocNoFromState));
      console.log("accDocNoFromState:", accDocNoFromState);
      console.log("accDocNoFromState:", typeof accDocNoFromState);
    }
  }, [location.state, dispatch]);

  const [loading, setLoading] = useState(false);
  const [jvall, setJVALL] = useState([]);

  useEffect(() => {
    if (AccCode) {
      // ตรวจสอบว่า accDocNo มีค่าหรือไม่
      console.log("AccCode from store:", AccCode);
      console.log("AccCode from store:", typeof AccCode);

      const vJournal_All = {
        viewName: "vJournal_All",
        parameters: [
          //   { field: "AccDocType", value: "PI" }, // การกรองข้อมูล
          { field: "AccCode", value: `${AccCode}` },
        ],
        results: [
          { sourceField: "EntryId" },
          { sourceField: "JournalNo" },
          { sourceField: "EntryDate" },
          { sourceField: "EffectiveDate" },
          { sourceField: "EntryBy" },
          { sourceField: "Description" },
          { sourceField: "TotalDebit" },
          { sourceField: "TotalCredit" },
          { sourceField: "DocNo" },
          { sourceField: "Seq" },
          { sourceField: "Text1" },
          { sourceField: "Date1" },
          { sourceField: "Num1" },
          { sourceField: "Text2" },
          { sourceField: "Date2" },
          { sourceField: "Num2" },
          { sourceField: "Text3" },
          { sourceField: "Date3" },
          { sourceField: "Num3" },
          { sourceField: "Text4" },
          { sourceField: "Date4" },
          { sourceField: "Num4" },
          { sourceField: "Text5" },
          { sourceField: "Date5" },
          { sourceField: "Num5" },
          { sourceField: "Text6" },
          { sourceField: "Date6" },
          { sourceField: "Num6" },
          { sourceField: "Text7" },
          { sourceField: "Date7" },
          { sourceField: "Num7" },
          { sourceField: "Text8" },
          { sourceField: "Date8" },
          { sourceField: "Num8" },
          { sourceField: "Text9" },
          { sourceField: "Date9" },
          { sourceField: "Num9" },
          { sourceField: "Text10" },
          { sourceField: "Date10" },
          { sourceField: "Num10" },
          { sourceField: "ItemNo" },
          { sourceField: "AccCode" },
          { sourceField: "AccName" },
          { sourceField: "AccMainCode" },
          { sourceField: "AccMainCodeName" },
          { sourceField: "AccRemark" },
          { sourceField: "AccDesc" },
          { sourceField: "Debit" },
          { sourceField: "Credit" },
          { sourceField: "AccTypeID" },
          { sourceField: "DText1" },
          { sourceField: "DDate1" },
          { sourceField: "DNum1" },
          { sourceField: "DText2" },
          { sourceField: "DDate2" },
          { sourceField: "DNum2" },
          { sourceField: "DText3" },
          { sourceField: "DDate3" },
          { sourceField: "DNum3" },
          { sourceField: "DText4" },
          { sourceField: "DDate4" },
          { sourceField: "DNum4" },
          { sourceField: "DText5" },
          { sourceField: "DDate5" },
          { sourceField: "DNum5" },
          { sourceField: "DText6" },
          { sourceField: "DDate6" },
          { sourceField: "DNum6" },
          { sourceField: "DText7" },
          { sourceField: "DDate7" },
          { sourceField: "DNum7" },
          { sourceField: "DText8" },
          { sourceField: "DDate8" },
          { sourceField: "DNum8" },
          { sourceField: "DText9" },
          { sourceField: "DDate9" },
          { sourceField: "DNum9" },
          { sourceField: "DText10" },
          { sourceField: "DDate10" },
          { sourceField: "DNum10" },
        ],
      };

      (async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            // "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
            GET_VIEW_RESULT,
            vJournal_All,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            setLoading(false);
            console.log("vJournal_All:", response.data);

            const sortedData = response.data.sort(
              (a, b) => a.AccItemNo - b.AccItemNo
            );
            // setPIH(response.data);
            setJVALL(sortedData);
          } else {
            setLoading(false);
            console.error("Error fetching data");
          }
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      })();
    }
  }, [AccCode]);

  useEffect(() => {
    if (
      location.state?.selectedProducts &&
      Array.isArray(location.state.selectedProducts)
    ) {
      const combinedProducts = [
        ...selectedProducts,
        ...location.state.selectedProducts,
      ];
      dispatch(setSelectedProducts(combinedProducts));
    }
  }, [location.state?.selectedProducts]);

  useEffect(() => {
    if (detailData) {
      // Calculate total amount when detailData changes
      const sum = detailData.reduce((accumulator, dataDetail) => {
        return accumulator + parseFloat(dataDetail.amount); // Parse amount as float
      }, 0);
      setTotalAmount(parseFloat(sum.toFixed(4)));

      const vatRate =
        detailData.length > 0 ? detailData[0].rateVat / 100 : 0.07;
      const whtRate = detailData.length > 0 ? detailData[0].rateWht / 100 : 0;

      const vat = isVatEnabled ? sum * vatRate : 0;
      setVatAmount(parseFloat(vat.toFixed(4)));

      let wht = 0; // Initialize wht to 0
      if (whtRate > 0 && isWhtEnabled) {
        // Check both whtRate and isWhtEnabled
        wht = sum * whtRate;
      }
      setWhtAmount(parseFloat(wht.toFixed(4)));
    } else {
      setTotalAmount(0); // Reset total if detailData is null or undefined
      setVatAmount(0); // Reset VAT as well
      setWhtAmount(0); // Reset WHT
    }
  }, [detailData, isVatEnabled, isWhtEnabled]);

  useEffect(() => {
    if (detailData && detailData.length > 0) {
      // ตรวจสอบ detailData ด้วย
      const itemNo = detailData.map((item) => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
      const productName = detailData.map((item) => item.salesDescription);
      setProductName(productName);
      const prices = detailData.map((item) => item.price);
      setPrice(prices);
      const qtys = detailData.map((item) => item.qty);
      setQty(qtys);

      setIsVatEnabled(detailData[0].rateVat > 0); // Enable if rateVat > 0
      setIsWhtEnabled(detailData[0].rateWht > 0); // Enable if rateWht > 0
    }
  }, [detailData]);

  const handlePrint = async (filtered) => {
    dispatch(setAccDocNo(filtered.AccCode));
    const DateFrom = "2025-01-01"; // กำหนดวันที่เริ่มต้น
    const DateTo = "2025-12-31"; // กำหนดวันที่สิ้นสุด
    const printUrl = `http://203.154.140.51/accreport?Form=GeneralLedger&Code=${filtered.AccCode}&DateFrom=${DateFrom}&DateTo=${DateTo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/TrialBalance`);
  };
  const handleGoMenu = () => {
    navigate(`/uitestacc/`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();
  const style = {
    p: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };
  const [formDataDT, setformDataDT] = useState({
    total: 0,
    // discount: 0,
    // totalAfterDiscount: 0,
    vat: 0,
    grandTotal: 0,
    withholdingTax: 0,
    vatRate: 0.07, // อัตรา VAT
    isVatExempt: false, // สถานะยกเว้น VAT
    withholdingTaxRate: 0, // อัตราภาษีหัก ณ ที่จ่าย
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setformDataDT({
      ...formDataDT,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleVatChange = (event) => {
    setIsVatEnabled(event.target.checked);
  };

  const handleWhtChange = (event) => {
    setIsWhtEnabled(event.target.checked);
  };

  const calculateVat = (totalAmount) => {
    const vat = totalAmount * 0.07;
    return parseFloat(vat.toFixed(4));
  };
  const calculateWht = (totalAmount) => {
    const wht = totalAmount * 0.03;
    return parseFloat(wht.toFixed(4));
  };
  useEffect(() => {
    if (detailData) {
      const sum = detailData.reduce((accumulator, dataDetail) => {
        return accumulator + parseFloat(dataDetail.amount);
      }, 0);
      setTotalAmount(parseFloat(sum.toFixed(4)));

      const vat = calculateVat(sum); // คำนวณ VAT
      setVatAmount(vat); // Update vatAmount state
      const wht = calculateWht(sum); // คำนวณ WHT
      setWhtAmount(wht);
    } else {
      setTotalAmount(0);
      setVatAmount(0); // Reset VAT ด้วย
      setWhtAmount(0);
    }
  }, [detailData]);

  const selectedItem = location.state?.selectedItem;
  useEffect(() => {
    if (selectedItem) {
      console.log("Selected item:", selectedItem);
    }
  }, [selectedItem]);

  const [editDetail, setEditDetail] = useState([]);

  useEffect(() => {
    if (
      location.state?.editDetail &&
      Array.isArray(location.state.editDetail)
    ) {
      setEditDetail((prevEditDetail) => [
        ...prevEditDetail,
        ...location.state.editDetail,
      ]);
    }
  }, [location.state?.editDetail]);

  const [addDetail, setAddDetail] = useState([]);

  useEffect(() => {
    if (detailData && detailData.length > 0) {
      const itemNo = detailData.map((item) => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setAccItemNo([]);
      setItemCounter(1);
    }
  }, [detailData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }} onClick={handleGoMenu}>
        General Ledger
      </h1>
      <div style={{ textAlign: "center", justifyContent: "center" }}>
        {/* <div style={{ display: "flex" }}> */}
        {/* <div className="col-1">
          <FontAwesomeIcon
            icon={faPrint}
            size="2x"
            style={{ color: "#e56107" }}
            onClick={handlePrint}
          />
          </div> */}
        {/* <div className="col-12" style={{display: "flex",alignItems: "center"}}>  */}
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "flex-end",
            justifyContent: "center",
          }}
        >
          <h3
            style={{ marginTop: "5px", marginLeft: "10px", color: "#013898" }}
          >
            รหัสบัญชี:
          </h3>
          <h3 style={{ marginTop: "5px", marginLeft: "10px" }}> {AccCode}</h3>
          <h3
            style={{ marginTop: "5px", marginLeft: "10px", color: "#013898" }}
          >
            ระหว่างวันที่ :
          </h3>
          <h3 style={{ marginTop: "5px", marginLeft: "10px" }}>
          
            {jvall && jvall.length > 0 && (
              <FormatDate dateString={jvall[0].EffectiveDate} />
            )}
            &nbsp;
          </h3>
          <h3
            style={{ marginTop: "5px", marginLeft: "10px", color: "#013898" }}
          >
            ถึงวันที่ :
          </h3>
          <h3 style={{ marginTop: "5px", marginLeft: "10px" }}>
            {jvall && jvall.length > 0 && (
              <FormatDate dateString={jvall[jvall.length - 1]?.EntryDate} />
            )}
            &nbsp;
          </h3>
          <br />
          <FontAwesomeIcon
            icon={faPrint}
            size="2x"
            style={{ color: "#e56107" }}
            onClick={handlePrint}
          />
        </ListItem>
      </div>
      <div style={{ display: "flex" }}>
        <div className="col-2">
          <h4 style={{ textAlign: "center" }}>&nbsp; &nbsp; Date</h4>
        </div>
        <div className="col-2">
          <h4 style={{ textAlign: "center" }}>Ref. &nbsp; </h4>
        </div>
        <div className="col-1">
          <h4 style={{ textAlign: "center" }}>Descr.</h4>
        </div>
        <div
          className="col-3"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h4 style={{ textAlign: "center" }}>Debit &nbsp;</h4>
        </div>
        <div
          className="col-2"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h4 style={{ textAlign: "center" }}>Credit &nbsp; &nbsp;</h4>
        </div>
        <div
          className="col-2"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h4 style={{ textAlign: "center" }}>Total &nbsp; &nbsp;</h4>
        </div>
      </div>
      {jvall.map((jvall, index) => (
        <div key={index}>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div className="col-2">
              <h5>
                &nbsp; {index + 1}.&nbsp;{formatDate(jvall.EntryDate)}
              </h5>
            </div>
            <div className="col-2">
              <h5>
                {jvall.JournalNo} &nbsp;
              </h5>
            </div>
            <div className="col-1">
              <h5>
                {jvall.Description} &nbsp;
              </h5>
            </div>
            <div
              className="col-3"
              style={{
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
            >
              <h4>{formatNumber(jvall.Debit)}</h4>
            </div>
            <div
              className="col-2"
              style={{
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
            >
              <h4>{formatNumber(jvall.Credit)} &nbsp;</h4>
            </div>
            <div
              className="col-2"
              style={{
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
            >
              <h4>{formatNumber(jvall.Credit)} &nbsp;</h4>
            </div>
          </ListItem>
        </div>
      ))}
      <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
      <div style={{ display: "flex", paddingTop: "8px" }}>
        {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
        <div className="col-5">
          <h3 style={{ textAlign: "center" }}>&nbsp; &nbsp; Total</h3>
        </div>
        <div
          className="col-3"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h3 style={{ textAlign: "center" }}>
            {jvall && jvall.length > 0 && formatNumber(jvall[0].TotalDebit)}
            &nbsp;
          </h3>
        </div>
        <div
          className="col-2"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h3 style={{ textAlign: "center" }}>
            {jvall && jvall.length > 0 && formatNumber(jvall[0].TotalCredit)}
            &nbsp; &nbsp;
          </h3>
        </div>
        <div
          className="col-2"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <h3 style={{ textAlign: "center" }}>
            {jvall && jvall.length > 0 && formatNumber(jvall[0].TotalCredit)}
            &nbsp; &nbsp;
          </h3>
        </div>
        {/* </ListItem> */}
      </div>
      <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
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

export default GLList;
