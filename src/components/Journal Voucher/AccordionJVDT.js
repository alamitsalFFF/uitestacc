import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig.js";
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
import { API_VIEW_RESULT, URL } from "../api/url.js";
import JVEditDetail from "./JVEditDetail.js";

function AccordionJVDT({ accDocNo, onSaveSuccess }) {
  const location = useLocation();
  const dispatch = useDispatch();
  // const accDocNo = useSelector((state) => state.accDocNo);
  const JournalNoFromStore = useSelector((state) => state.accDocNo);
  const journalActive = accDocNo ?? JournalNoFromStore;

  // expose active journal for components below
  const JournalNo = journalActive;
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
  const [jvall, setJVAll] = useState([]);
  const [seq, setSeq] = useState([]);

  // pagination
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(0);

  // load detail when parent passes accDocNo OR when redux accDocNo changes
  useEffect(() => {
    const journal = accDocNo ?? JournalNoFromStore;
    if (!journal) return;

    const vJournal_All = {
      viewName: "vJournal_All",
      parameters: [{ field: "JournalNo", value: journal }],
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
        // { sourceField: "Text1" },
        // { sourceField: "Date1" },
        // { sourceField: "Num1" },
        // { sourceField: "Text2" },
        // { sourceField: "Date2" },
        // { sourceField: "Num2" },
        // { sourceField: "Text3" },
        // { sourceField: "Date3" },
        // { sourceField: "Num3" },
        // { sourceField: "Text4" },
        // { sourceField: "Date4" },
        // { sourceField: "Num4" },
        // { sourceField: "Text5" },
        // { sourceField: "Date5" },
        // { sourceField: "Num5" },
        // { sourceField: "Text6" },
        // { sourceField: "Date6" },
        // { sourceField: "Num6" },
        // { sourceField: "Text7" },
        // { sourceField: "Date7" },
        // { sourceField: "Num7" },
        // { sourceField: "Text8" },
        // { sourceField: "Date8" },
        // { sourceField: "Num8" },
        // { sourceField: "Text9" },
        // { sourceField: "Date9" },
        // { sourceField: "Num9" },
        // { sourceField: "Text10" },
        // { sourceField: "Date10" },
        // { sourceField: "Num10" },
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
        // { sourceField: "DText1" },
        // { sourceField: "DDate1" },
        // { sourceField: "DNum1" },
        // { sourceField: "DText2" },
        // { sourceField: "DDate2" },
        // { sourceField: "DNum2" },
        // { sourceField: "DText3" },
        // { sourceField: "DDate3" },
        // { sourceField: "DNum3" },
        // { sourceField: "DText4" },
        // { sourceField: "DDate4" },
        // { sourceField: "DNum4" },
        // { sourceField: "DText5" },
        // { sourceField: "DDate5" },
        // { sourceField: "DNum5" },
        // { sourceField: "DText6" },
        // { sourceField: "DDate6" },
        // { sourceField: "DNum6" },
        // { sourceField: "DText7" },
        // { sourceField: "DDate7" },
        // { sourceField: "DNum7" },
        // { sourceField: "DText8" },
        // { sourceField: "DDate8" },
        // { sourceField: "DNum8" },
        // { sourceField: "DText9" },
        // { sourceField: "DDate9" },
        // { sourceField: "DNum9" },
        // { sourceField: "DText10" },
        // { sourceField: "DDate10" },
        // { sourceField: "DNum10" },
      ],
    };

    (async () => {
      try {
        setLoading(true);
        const response = await axios.post(API_VIEW_RESULT, vJournal_All, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const sortedData = response.data.sort((a, b) => a.Seq - b.Seq);
          console.log("sortedData:", sortedData);
          setJVAll(sortedData);
          setCurrentPage(0); // reset to first page on new data load
        } else {
          console.error("Error fetching data");
          setJVAll([]);
        }
      } catch (err) {
        console.error("Error fetching JV detail:", err);
        setJVAll([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [accDocNo, JournalNoFromStore]);

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
      const itemNo = detailData.map((item) => item.seq);
      setSeq(itemNo);
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

  const EntryId = jvall.EntryId;
  const Seq = jvall.Seq;

  // เพิ่ม state สำหรับ modal / item ที่จะแก้ไข
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleEditDetail = async (index) => {
    try {
      const journalNo = jvall && jvall.length > 0 ? jvall[0].JournalNo : JournalNo;
      const entryId = jvall && jvall.length > 0 ? jvall[0].EntryId : null;
      const seq = jvall && jvall[index] ? jvall[index].ItemNo : null;
      if (!entryId || seq == null) return console.error("missing entryId/seq");

      setItemToEdit({ entryId, journalNo, seq, index });
      console.log("itemToEdit:", 'entryId', entryId, 'journalNo', journalNo, 'seq', seq, 'index', index);
      setShowEditDetailModal(true);
    } catch (error) {
      console.error("Error in handleEditDetail:", error);
    }
  };

  const handleCloseEditDetailModal = () => {
    setShowEditDetailModal(false);
    setItemToEdit(null);
  };

  const handleDetailUpdatedOrDeleted = async (refresh = true) => {
    // ปิด modal
    setShowEditDetailModal(false);
    setItemToEdit(null);
    if (refresh) {
      // รีเฟรชข้อมูล vJournal_All (เหมือนที่มีใน useEffect) โดยเรียก API อีกครั้ง
      if (JournalNo) {
        try {
          const vJournal_All = {
            viewName: "vJournal_All",
            parameters: [{ field: "JournalNo", value: JournalNo }],
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
              // { sourceField: "Text1" },
              // { sourceField: "Date1" },
              // { sourceField: "Num1" },
              // { sourceField: "Text2" },
              // { sourceField: "Date2" },
              // { sourceField: "Num2" },
              // { sourceField: "Text3" },
              // { sourceField: "Date3" },
              // { sourceField: "Num3" },
              // { sourceField: "Text4" },
              // { sourceField: "Date4" },
              // { sourceField: "Num4" },
              // { sourceField: "Text5" },
              // { sourceField: "Date5" },
              // { sourceField: "Num5" },
              // { sourceField: "Text6" },
              // { sourceField: "Date6" },
              // { sourceField: "Num6" },
              // { sourceField: "Text7" },
              // { sourceField: "Date7" },
              // { sourceField: "Num7" },
              // { sourceField: "Text8" },
              // { sourceField: "Date8" },
              // { sourceField: "Num8" },
              // { sourceField: "Text9" },
              // { sourceField: "Date9" },
              // { sourceField: "Num9" },
              // { sourceField: "Text10" },
              // { sourceField: "Date10" },
              // { sourceField: "Num10" },
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
              // { sourceField: "DText1" },
              // { sourceField: "DDate1" },
              // { sourceField: "DNum1" },
              // { sourceField: "DText2" },
              // { sourceField: "DDate2" },
              // { sourceField: "DNum2" },
              // { sourceField: "DText3" },
              // { sourceField: "DDate3" },
              // { sourceField: "DNum3" },
              // { sourceField: "DText4" },
              // { sourceField: "DDate4" },
              // { sourceField: "DNum4" },
              // { sourceField: "DText5" },
              // { sourceField: "DDate5" },
              // { sourceField: "DNum5" },
              // { sourceField: "DText6" },
              // { sourceField: "DDate6" },
              // { sourceField: "DNum6" },
              // { sourceField: "DText7" },
              // { sourceField: "DDate7" },
              // { sourceField: "DNum7" },
              // { sourceField: "DText8" },
              // { sourceField: "DDate8" },
              // { sourceField: "DNum8" },
              // { sourceField: "DText9" },
              // { sourceField: "DDate9" },
              // { sourceField: "DNum9" },
              // { sourceField: "DText10" },
              // { sourceField: "DDate10" },
              // { sourceField: "DNum10" },
            ],
          };
          const response = await axios.post(API_VIEW_RESULT, vJournal_All, {
            headers: { "Content-Type": "application/json" },
          });
          if (response.status === 200) {
            const sortedData = response.data.sort((a, b) => a.Seq - b.Seq);
            setJVAll(sortedData);
          }
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      }
    }
  };



  return (
    <div>
      {/* <h1 style={{ textAlign: "center" }}>Payment Voucher</h1> */}

      <div className="row">
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              background: "linear-gradient(135deg, #1a237e, #1565c0)",
              borderRadius: "20px",
              padding: "8px 20px",
              boxShadow: "0 2px 8px rgba(21, 101, 192, 0.4)",
              marginTop: "5px",
              marginLeft: "10px",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
              }}
            >
              {JournalNo ?? "—"}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 1)",
                letterSpacing: "0.05em",
                marginTop: "3px",
                width: "100%",
                textAlign: "right",
              }}
            >
              Date:&nbsp;
              {jvall && jvall.length > 0 && (
                <FormatDate dateString={jvall[0].EffectiveDate} />
              )}
            </span>
          </div>
        </ListItem>
      </div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <h5 style={{ margin: 0 }}>
            <span style={{ color: "#00008b", fontWeight: "bold" }}>&nbsp;Description: </span>
            <span style={{ color: "#1565c0" }}>{jvall && jvall.length > 0 && jvall[0].Description}</span>
          </h5>
        </ListItem>
      </div>

      <div style={{ overflowX: "auto", marginTop: "10px" }}>
        <div style={{ minWidth: "800px", paddingBottom: "10px" }}>
          <div style={{ display: "flex", marginBottom: "5px", padding: "0 12px", color: "#1a237e" }}>
            <div className="col-4">
              <h5 style={{ fontWeight: "bold", margin: 0, paddingLeft: "35px" }}>AccName</h5>
            </div>
            <div className="col-2">
              <h5 style={{ fontWeight: "bold", margin: 0 }}>Detail</h5>
            </div>
            <div className="col-3" style={{ display: "flex", justifyContent: "flex-end" }}>
              <h5 style={{ fontWeight: "bold", margin: 0 }}>Debit</h5>
            </div>
            <div className="col-3" style={{ display: "flex", justifyContent: "flex-end", paddingRight: "35px" }}>
              <h5 style={{ fontWeight: "bold", margin: 0 }}>Credit</h5>
            </div>
          </div>

          {/* paginated rows */}
          {jvall.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((item, pageIndex) => {
            const globalIndex = currentPage * PAGE_SIZE + pageIndex;
            return (
              <div
                key={globalIndex}
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  margin: "6px 4px",
                  padding: "10px 12px",
                  boxShadow: "inset 4px 0 0 0 #1565c0, 0 1px 4px rgba(26,35,126,0.08)",
                  border: "1px solid #e8eaf6",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="col-4" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  {/* Item number badge */}
                  <span
                    style={{
                      background: "#1565c0",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.ItemNo}
                  </span>
                  <span
                    style={{
                      color: "#1a237e",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {item.AccCode} / {item.AccName}
                  </span>
                </div>

                <div className="col-2">
                  <div style={{ color: "#607d8b", fontSize: "0.85rem" }}>
                    {item.AccDesc}
                  </div>
                </div>

                <div className="col-3" style={{ display: "flex", justifyContent: "flex-end" }}>
                  {item.Debit !== 0 && (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2e7d32", whiteSpace: "nowrap" }}>
                      {formatNumber(item.Debit)}
                    </span>
                  )}
                </div>

                <div className="col-3" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  {item.Credit !== 0 && (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#c62828" }}>
                      {formatNumber(item.Credit)}
                    </span>
                  )}
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size="sm"
                    style={{
                      color: "#1565c0",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "50%",
                      background: "#e3f2fd",
                      marginLeft: "15px"
                    }}
                    onClick={() => handleEditDetail(globalIndex)}
                  />
                </div>
              </div>
            );
          })}
          {/* pagination controls — show only when there are multiple pages */}
          {jvall.length > PAGE_SIZE && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "8px 0" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                style={{
                  padding: "4px 14px",
                  borderRadius: "6px",
                  border: "1px solid #0310ce",
                  background: currentPage === 0 ? "#e0e0e0" : "#0310ce",
                  color: currentPage === 0 ? "#888" : "#fff",
                  cursor: currentPage === 0 ? "default" : "pointer",
                  fontWeight: "bold",
                }}
              >
                &laquo; Prev
              </button>
              <span style={{ fontSize: "14px", color: "#555" }}>
                {currentPage + 1} / {Math.ceil(jvall.length / PAGE_SIZE)}
                &nbsp;({jvall.length} rows)
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(jvall.length / PAGE_SIZE) - 1, p + 1))}
                disabled={currentPage >= Math.ceil(jvall.length / PAGE_SIZE) - 1}
                style={{
                  padding: "4px 14px",
                  borderRadius: "6px",
                  border: "1px solid #0310ce",
                  background: currentPage >= Math.ceil(jvall.length / PAGE_SIZE) - 1 ? "#e0e0e0" : "#0310ce",
                  color: currentPage >= Math.ceil(jvall.length / PAGE_SIZE) - 1 ? "#888" : "#fff",
                  cursor: currentPage >= Math.ceil(jvall.length / PAGE_SIZE) - 1 ? "default" : "pointer",
                  fontWeight: "bold",
                }}
              >
                Next &raquo;
              </button>
            </div>
          )}
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, #e8eaf6, #e3f2fd)",
                borderRadius: "12px",
                margin: "8px 4px 4px 4px",
                padding: "12px 12px",
                // boxShadow: "inset 4px 0 0 0 #1565c0, 0 2px 8px rgba(26,35,126,0.10)",
                border: "1px solid #c5cae9",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div className="col-6">
                <h3 style={{ margin: 0, color: "#1a237e", fontWeight: "bold", textAlign: "right", paddingRight: "20px" }}>Total</h3>
              </div>
              <div className="col-3" style={{ display: "flex", justifyContent: "flex-end" }}>
                <h3 style={{ margin: 0, color: "#2e7d32", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {jvall && jvall.length > 0 ? formatNumber(jvall[0].TotalDebit) : formatNumber(0)}
                </h3>
              </div>
              <div className="col-3" style={{ display: "flex", justifyContent: "flex-end", paddingRight: "35px" }}>
                <h3 style={{ margin: 0, color: "#c62828", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {jvall && jvall.length > 0 ? formatNumber(jvall[0].TotalCredit) : formatNumber(0)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditDetailModal && itemToEdit && (
        <JVEditDetail
          open={showEditDetailModal}
          onClose={handleCloseEditDetailModal}
          onSaved={() => handleDetailUpdatedOrDeleted(true)}
          entryId={itemToEdit.entryId}
          journalNo={itemToEdit.journalNo}
          seq={itemToEdit.seq}
        />
      )}
    </div>
  );
}

export default AccordionJVDT;
