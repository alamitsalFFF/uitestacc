import React, { useState, useEffect } from "react";
import axios from "../../components/Auth/axiosConfig.js";
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
import { API_VIEW_RESULT } from "../api/url.js";
import FloatingActionBar from "../DataFilters/FloatingActionBar.js";

function PVDTList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const JournalNo = useSelector((state) => state.accDocNo);
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
  const [pvall, setPVALL] = useState([]);

  useEffect(() => {
    if (JournalNo) {
      // ตรวจสอบว่า accDocNo มีค่าหรือไม่
      console.log("JournalNo from store:", JournalNo);

      const vPV_All = {
        viewName: "vPV_All",
        parameters: [
          // { field: "AccDocType", value: "PV" },
          // { field: "DocStatus", value: "0" },
          { field: "JournalNo", value: JournalNo }, // ใช้ accDocNo จาก Redux store
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
          { sourceField: "Seq" },
          { sourceField: "AccCode" },
          { sourceField: "AccName" },
          { sourceField: "AccDesc" },
          { sourceField: "Debit" },
          { sourceField: "Credit" },
        ],
      };

      (async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            API_VIEW_RESULT,
            vPV_All,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            setLoading(false);
            console.log("vPV_All:", response.data);

            const sortedData = response.data.sort(
              (a, b) => a.AccItemNo - b.AccItemNo
            );
            // setPIH(response.data);
            setPVALL(sortedData);
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
  }, [JournalNo]);
  
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
  
  const handleGoBack = () => {
    navigate(`/uitestacc/PVList?journalNo=${JournalNo}`);
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

  return (
    <div>
      <h1 style={{ textAlign: "center" }} onClick={handleGoMenu}>Payment Voucher</h1>
      <div className="row">
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <h2 style={{ marginTop: "5px", marginLeft: "10px" }}>{JournalNo}</h2>
          <br />
        </ListItem>
      <div style={{display:"flex"}}>
      <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "flex-end",
          }}
        >
          <h5 style={{paddingTop:"8px"}}>
          Description:{pvall && pvall.length >0 && (pvall[0].Description)} 
          </h5>
          {/* <i> ({pvall && pvall.length >0 && (pvall[pvall.length-1].AccDesc)})</i> */}
        </ListItem>
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <p style={{paddingTop:"8px"}}>
            Date:
            {pvall && pvall.length > 0 && (
              <FormatDate dateString={pvall[0].EffectiveDate} />
            )}
          </p>
        </ListItem>
        </div>
      </div>
      <div style={{display:"flex"}}>
          <div className="col-4">
          <h4 style={{textAlign:"center"}}>&nbsp; &nbsp; AccName</h4>
          </div>
          <div className="col-2">
          <h4 style={{textAlign:"center"}}>&nbsp; &nbsp; Detail</h4>
          </div>
          <div className="col-3" 
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
          <h4 style={{textAlign:"center"}}>Debit &nbsp;</h4>
          </div>
          <div className="col-3" 
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
          <h4 style={{textAlign:"center"}}>Credit &nbsp; &nbsp; &nbsp; &nbsp;
            </h4>
          </div>
      </div>
      {pvall.map((pvall, index) => (
        <div key={index}>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div className="col-4">
              <h5>
                &nbsp; {pvall.Seq}.&nbsp;{pvall.AccCode} &nbsp;
                {pvall.AccName}
                {/* <i>{pvall.AccDesc}</i> */}
              </h5>
            </div>
            <div className="col-2" style={{textAlign:"center"}}>
              <h5>
                {/* &nbsp; {pvall.Seq}.&nbsp;{pvall.AccCode} &nbsp;
                {pvall.AccName} */}
                {pvall.AccDesc}
              </h5>
            </div>
            {/* <div className="col-3" style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}>
            <h4>{formatNumber(pvall.Debit)}</h4> 
            </div>
            <div className="col-3" style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}>
            <h4>{formatNumber(pvall.Credit)} &nbsp;</h4>
            </div> */} {/* แสดง0.00 */}
            <div className="col-3" style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}>
              {pvall.Debit !== 0.00 && <h4>{formatNumber(pvall.Debit)}</h4>}
            </div>
            <div className="col-3" style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}>
              {pvall.Credit !== 0.00 && <h4>{formatNumber(pvall.Credit)} &nbsp;</h4>}
            </div>
          </ListItem>
        </div>
      ))}
      <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
      <div style={{display:"flex",paddingTop:"8px"}}>
          <div className="col-6">
          <h3 style={{textAlign:"center"}}>&nbsp; &nbsp; Total</h3>
          </div>
          <div className="col-3" 
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
          <h3 style={{textAlign:"center"}}>{pvall && pvall.length >0 && formatNumber(pvall[0].TotalDebit)}&nbsp;</h3>
          </div>
          <div className="col-3" style={{ cursor: "pointer", display: "grid", justifyItems: "end" ,marginLeft: "auto" }}>
          <h3 style={{textAlign:"center",}}>{pvall && pvall.length >0 && formatNumber(pvall[0].TotalCredit)} &nbsp; &nbsp;
            </h3>
          </div>
        {/* </ListItem> */}
      </div>
      <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
      <div className="row">

        <div style={{paddingTop:"50px"}}>&nbsp;</div>
        <FloatingActionBar backPath="/uitestacc/"/>
      </div>
    </div>
  );
}

export default PVDTList;
