import { URL } from '../api/url';
import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig.js";
import { ButtonGroup, Chip, useMediaQuery } from "@mui/material";
import { faCircleArrowUp, faFileContract, faFileInvoiceDollar, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
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
import PVEditDetail from "../Payment Voucher/PVEditDetail.js";
import RVEditDetail from "./RVEditDetail.js";
import ChooseDocForSO from "./ChooseDocForSO.js";
import { RVfromSOFull } from "./RVFromSOFull.js";
import ChooseDocForSI from "./ChooseDocForSI.js";
import { RVfromSIFull } from "./RVFromSIFull.js";
import ChooseDocForRC from "../Cheque Receive/ChooseDocForRC.js";
import { RVfromRCFull } from "../Cheque Receive/RVFromRCFull.js";
import Swal from "sweetalert2";
// import AccordionPVEditDT from "./AccordionPVEditDT"; 

function AccordionRVDT({ accDocNo, onSaveSuccess }) {
  const location = useLocation();
  const dispatch = useDispatch();
  // const accDocNo = useSelector((state) => state.accDocNo);
  const JournalNoFromStore = useSelector((state) => state.accDocNo);
  const journalActive = accDocNo ?? JournalNoFromStore;

  // expose active journal for components below
  const JournalNo = journalActive;
  const isDesktop = useMediaQuery('(min-width:600px)');
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
  const [rvh, setRVH] = useState([]);
  const [rvd, setRVD] = useState([]);
  const [rvall, setRVAll] = useState([]);
  const [seq, setSeq] = useState([]);

  // pagination
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(0);

  // load detail when parent passes accDocNo OR when redux accDocNo changes
  useEffect(() => {
    const journal = accDocNo ?? JournalNoFromStore;
    if (!journal) return;

    const vRV_All = {
      viewName: "vRV_All",
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
        const response = await axios.post(API_VIEW_RESULT, vRV_All, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const sortedData = response.data.sort((a, b) => a.Seq - b.Seq);
          console.log('data', sortedData)
          setRVAll(sortedData);
        } else {
          console.error("Error fetching data");
          setRVAll([]);
        }
      } catch (err) {
        console.error("Error fetching RV detail:", err);
        setRVAll([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [accDocNo, JournalNoFromStore]);

  const handleAccCodeSelect = () => {
    // const handleProductSelect = () => {
    navigate(`${URL}PVselectAccCode/`, {
      state: {
        // selectedProducts,
        JournalNo,
        accEffectiveDate: accEffectiveDate,
        partyCode: partyCode,
        partyName: partyName,
        isnameCategory: nameCategory,
        selectedProducts: selectedProducts,
      },
    });
  };

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

  // const handlePlusClick = () => {
  //   navigate(`${URL}QCSupplier`);
  // };

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

  const EntryId = rvall.EntryId;
  const Seq = rvall.Seq;

  // เพิ่ม state สำหรับ modal / item ที่จะแก้ไข
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // ---- Choose SO → Create RV ----
  const [openChooseSO, setOpenChooseSO] = useState(false);

  const handleChooseSO = () => {
    setOpenChooseSO(true);
  };

  const handleSOSelected = async (docNo, partyName, totalNet) => {
    setOpenChooseSO(false);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const { value: formValues } = await Swal.fire({
        title: `สร้าง RV จาก SO: ${docNo}`,
        width: '580px',
        html:
          `<div style="display:grid;grid-template-columns:150px 1fr;gap:12px;text-align:right;align-items:center;padding-right:16px;">` +

          `<label style="font-weight:bold;">SO No:</label>` +
          `<input class="swal2-input" value="${docNo}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">ลูกค้า:</label>` +
          `<input class="swal2-input" value="${(partyName || "").replace(/"/g, '&quot;')}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">DocRef No:</label>` +
          `<input id="swal-so-taxno" class="swal2-input" placeholder="เลขใบเสร็จ/ใบหัก/บัตรประชาชน" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Receive Date:</label>` +
          `<input id="swal-so-docdate" class="swal2-input" type="date" value="${currentDate}" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Acc Code (Cash):</label>` +
          `<input id="swal-so-acccode" class="swal2-input" placeholder="รหัสบัญชีเงินสดที่รับ" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">RV No:</label>` +
          `<input class="swal2-input" value="${JournalNo || ''}" disabled style="margin:0;width:100%;background:#f5f7ff;font-weight:700;">` +

          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
          const taxno = document.getElementById('swal-so-taxno')?.value?.trim() || '';
          const docdate = document.getElementById('swal-so-docdate')?.value;
          const acccode = document.getElementById('swal-so-acccode')?.value?.trim() || '';
          const rvno = JournalNo || '';

          if (!docdate) {
            Swal.showValidationMessage('กรุณาระบุวันที่รับเงิน');
            return false;
          }
          return { taxno, docdate, acccode, rvno };
        },
      });

      if (!formValues) return;

      const { taxno, docdate, acccode, rvno } = formValues;

      const resp = await RVfromSOFull(
        docNo,
        taxno,
        docdate,
        rvno,
        acccode
      );
      console.log('RVfromSOFull response:', resp);
      if (!resp?.error) {
        await handleDetailUpdatedOrDeleted(true);
      }
    } catch (err) {
      console.error('handleSOSelected error:', err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || '',
      });
    }
  };
  // ---- End Choose SO ----

  // ---- Choose SI → Create RV ----
  const [openChooseSI, setOpenChooseSI] = useState(false);

  const handleChooseSI = () => {
    setOpenChooseSI(true);
  };

  const handleSISelected = async (docNo, partyName, totalNet) => {
    setOpenChooseSI(false);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const { value: formValues } = await Swal.fire({
        title: `สร้าง RV จาก SI: ${docNo}`,
        width: '560px',
        html:
          `<div style="display:grid;grid-template-columns:150px 1fr;gap:12px;text-align:right;align-items:center;padding-right:16px;">` +

          `<label style="font-weight:bold;">SI No:</label>` +
          `<input class="swal2-input" value="${docNo}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">ลูกค้า:</label>` +
          `<input class="swal2-input" value="${(partyName || "").replace(/"/g, '&quot;')}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">DocRef No:</label>` +
          `<input id="swal-si-taxno" class="swal2-input" placeholder="เลขใบเสร็จ/ใบหัก/บัตรประชาชน" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Receive Date:</label>` +
          `<input id="swal-si-docdate" class="swal2-input" type="date" value="${currentDate}" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">RV No:</label>` +
          `<input class="swal2-input" value="${JournalNo || ''}" disabled style="margin:0;width:100%;background:#f5f7ff;font-weight:700;">` +

          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
          const taxno = document.getElementById('swal-si-taxno')?.value?.trim() || '';
          const docdate = document.getElementById('swal-si-docdate')?.value;
          const rvno = JournalNo || '';

          if (!docdate) {
            Swal.showValidationMessage('กรุณาระบุวันที่รับเงิน');
            return false;
          }
          return { taxno, docdate, rvno };
        },
      });

      if (!formValues) return;

      const { taxno, docdate, rvno } = formValues;

      const resp = await RVfromSIFull(
        docNo,
        taxno,
        docdate,
        rvno
      );
      console.log('RVfromSIFull response:', resp);
      if (!resp?.error) {
        await handleDetailUpdatedOrDeleted(true);
      }
    } catch (err) {
      console.error('handleSISelected error:', err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || '',
      });
    }
  };
  // ---- End Choose SI ----

  // ---- Choose RC (Cheque Receive) → Create RV ----
  const [openChooseRC, setOpenChooseRC] = useState(false);

  const handleChooseRC = () => {
    setOpenChooseRC(true);
  };

  const handleRCSelected = async (docNo, partyName, totalNet) => {
    setOpenChooseRC(false);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const { value: formValues } = await Swal.fire({
        title: `สร้าง RV จาก RC: ${docNo}`,
        width: '600px',
        html:
          `<div style="display:grid;grid-template-columns:170px 1fr;gap:12px;text-align:right;align-items:center;padding-right:16px;">` +

          `<label style="font-weight:bold;">RC No:</label>` +
          `<input class="swal2-input" value="${docNo}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">ลูกค้า:</label>` +
          `<input class="swal2-input" value="${(partyName || "").replace(/"/g, '&quot;')}" disabled style="margin:0;width:100%;background:#f5f7ff;">` +

          `<label style="font-weight:bold;">Receive Date:</label>` +
          `<input id="swal-rc-docdate" class="swal2-input" type="date" value="${currentDate}" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Acc Code (Cash):</label>` +
          `<input id="swal-rc-acccode" class="swal2-input" placeholder="รหัสบัญชีเงินสดที่รับ" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Bank Charge:</label>` +
          `<input id="swal-rc-bankchg" class="swal2-input" placeholder="ค่าธรรมเนียมธนาคาร (ถ้าไม่มีใส่ 0)" value="0" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">Acc Credit:</label>` +
          `<input id="swal-rc-acccredit" class="swal2-input" placeholder="รหัสบัญชีรายได้/ค่าใช้จ่าย หมวด4" style="margin:0;width:100%;">` +

          `<label style="font-weight:bold;">RV No:</label>` +
          `<input class="swal2-input" value="${JournalNo || ''}" disabled style="margin:0;width:100%;background:#f5f7ff;font-weight:700;">` +

          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
          const docdate = document.getElementById('swal-rc-docdate')?.value;
          const acccode = document.getElementById('swal-rc-acccode')?.value?.trim() || '';
          const bankchg = document.getElementById('swal-rc-bankchg')?.value?.trim() || '0';
          const acccredit = document.getElementById('swal-rc-acccredit')?.value?.trim() || '';
          const rvno = JournalNo || '';

          if (!docdate) {
            Swal.showValidationMessage('กรุณาระบุวันที่รับเงิน');
            return false;
          }
          return { docdate, acccode, bankchg, acccredit, rvno };
        },
      });

      if (!formValues) return;

      const { docdate, acccode, bankchg, acccredit, rvno } = formValues;

      const resp = await RVfromRCFull(
        docNo,
        docdate,
        acccode,
        bankchg,
        rvno,
        acccredit
      );
      console.log('RVfromRCFull response:', resp);
      if (!resp?.error) {
        await handleDetailUpdatedOrDeleted(true);
      }
    } catch (err) {
      console.error('handleRCSelected error:', err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || '',
      });
    }
  };
  // ---- End Choose RC ----

  const handleEditDetail = async (index) => {
    try {
      const journalNo = rvall && rvall.length > 0 ? rvall[0].JournalNo : JournalNo;
      const entryId = rvall && rvall.length > 0 ? rvall[0].EntryId : null;
      const seq = rvall && rvall[index] ? rvall[index].Seq : null;
      if (!entryId || seq == null) return console.error("missing entryId/seq");

      setItemToEdit({ entryId, journalNo, seq, index });
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
      // รีเฟรชข้อมูล vRV_All (เหมือนที่มีใน useEffect) โดยเรียก API อีกครั้ง
      if (JournalNo) {
        try {
          const vRV_All = {
            viewName: "vRV_All",
            parameters: [{ field: "JournalNo", value: JournalNo }],
            results: [
              { sourceField: "EntryId" }, { sourceField: "JournalNo" }, { sourceField: "EntryDate" },
              { sourceField: "EffectiveDate" }, { sourceField: "EntryBy" }, { sourceField: "Description" },
              { sourceField: "TotalDebit" }, { sourceField: "TotalCredit" }, { sourceField: "Seq" },
              { sourceField: "AccCode" }, { sourceField: "AccName" }, { sourceField: "AccDesc" },
              { sourceField: "Debit" }, { sourceField: "Credit" },
            ],
          };
          const response = await axios.post(API_VIEW_RESULT, vRV_All, {
            headers: { "Content-Type": "application/json" },
          });
          if (response.status === 200) {
            const sortedData = response.data.sort((a, b) => a.Seq - b.Seq);
            console.log('data', sortedData)
            setRVAll(sortedData);
          }
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      }
    }
  };

  // useEffect(() => {
  //   if (!accDocNo) return;
  //   const fetchDetails = async () => {
  //     try {
  //       const vRV_All = {
  //         viewName: "vRV_All",
  //         parameters: [{ field: "JournalNo", value: accDocNo }],
  //         results: [
  //           { sourceField: "EntryId" }, { sourceField: "JournalNo" }, { sourceField: "Seq" },
  //           { sourceField: "AccCode" }, { sourceField: "AccName" },
  //           { sourceField: "Debit" }, { sourceField: "Credit" },
  //           { sourceField: "TotalDebit" }, { sourceField: "TotalCredit" },
  //         ],
  //       };
  //       const response = await axios.post(API_VIEW_RESULT, vRV_All, { headers: { "Content-Type": "application/json" } });
  //       if (response.status === 200) {
  //         const sortedData = response.data.sort((a, b) => a.Seq - b.Seq);
  //         console.log('data', sortedData)
  //         setRVAll(sortedData); // ชื่อ state ตามไฟล์เดิม
  //       }
  //     } catch (err) {
  //       console.error("Error fetching RV detail:", err);
  //     }
  //   };
  //   fetchDetails();
  // }, [accDocNo, JournalNoFromStore]);

  return (
    <div>
      {/* <h1 style={{ textAlign: "center" }}>Receive Voucher</h1> */}

      {/* Choose SO modal */}
      <ChooseDocForSO
        isOpen={openChooseSO}
        onClose={() => setOpenChooseSO(false)}
        onSelect={handleSOSelected}
      />

      {/* Choose SI modal */}
      <ChooseDocForSI
        isOpen={openChooseSI}
        onClose={() => setOpenChooseSI(false)}
        onSelect={handleSISelected}
      />

      {/* Choose RC modal */}
      <ChooseDocForRC
        isOpen={openChooseRC}
        onClose={() => setOpenChooseRC(false)}
        onSelect={handleRCSelected}
      />

      <div className="row">
        <ListItem
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            alignItems: isDesktop ? "center" : "stretch",
            justifyContent: "space-between",
            gap: "10px",
            padding: "8px 16px",
          }}
        >
          {/* ปุ่มกลุ่ม Choose */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
              order: isDesktop ? 1 : 2,
            }}
          >
            {/* Choose SO */}
            <Chip
              icon={
                <FontAwesomeIcon
                  icon={faFileContract}
                  style={{ color: "#fff", fontSize: "0.85rem" }}
                />
              }
              label="Choose SO"
              onClick={handleChooseSO}
              style={{
                background: "linear-gradient(135deg, #e65100, #f57c00)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(230,81,0,0.35)",
                padding: "4px 4px",
                borderRadius: "20px",
              }}
            />
            {/* Choose SI */}
            <Chip
              icon={
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  style={{ color: "#fff", fontSize: "0.85rem" }}
                />
              }
              label="Choose SI"
              onClick={handleChooseSI}
              style={{
                background: "linear-gradient(135deg, #6a1b9a, #8e24aa)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(106,27,154,0.35)",
                padding: "4px 4px",
                borderRadius: "20px",
              }}
            />
            {/* Choose RC */}
            <Chip
              icon={
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  style={{ color: "#fff", fontSize: "0.85rem" }}
                />
              }
              label="Choose RC"
              onClick={handleChooseRC}
              style={{
                background: "linear-gradient(135deg, #00695c, #00897b)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,137,123,0.35)",
                padding: "4px 4px",
                borderRadius: "20px",
              }}
            />
          </div>

          {/* Badge เลขเอกสาร */}
          <div
            style={{
              order: isDesktop ? 2 : 1,
              display: "inline-flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-end" : "center",
              background: "linear-gradient(135deg, #1a237e, #1565c0)",
              borderRadius: "16px",
              padding: "8px 20px",
              boxShadow: "0 2px 8px rgba(21, 101, 192, 0.4)",
              width: isDesktop ? "auto" : "100%",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.3rem, 5vw, 2rem)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.04em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {JournalNo ?? "—"}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.04em",
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Date:&nbsp;
              {rvall && rvall.length > 0 && (
                <FormatDate dateString={rvall[0].EffectiveDate} />
              )}
            </span>
          </div>
        </ListItem>
      </div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <h5 style={{ margin: 0 }}>
            <span style={{ color: "#00008b", fontWeight: "bold" }}>&nbsp;Description: </span>
            <span style={{ color: "#1565c0" }}>{rvall && rvall.length > 0 && rvall[0].Description}</span>
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
          {rvall.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((rvItem, pageIndex) => {
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
                    {rvItem.Seq}
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
                    {rvItem.AccCode} / {rvItem.AccName}
                  </span>
                </div>

                <div className="col-2">
                  <div style={{ color: "#607d8b", fontSize: "0.85rem" }}>
                    {rvItem.AccDesc}
                  </div>
                </div>

                <div className="col-3" style={{ display: "flex", justifyContent: "flex-end" }}>
                  {rvItem.Debit !== 0 && (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2e7d32", whiteSpace: "nowrap" }}>
                      {formatNumber(rvItem.Debit)}
                    </span>
                  )}
                </div>

                <div className="col-3" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  {rvItem.Credit !== 0 && (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#c62828", whiteSpace: "nowrap" }}>
                      {formatNumber(rvItem.Credit)}
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
          {rvall.length > PAGE_SIZE && (
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
                {currentPage + 1} / {Math.ceil(rvall.length / PAGE_SIZE)}
                &nbsp;({rvall.length} rows)
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(rvall.length / PAGE_SIZE) - 1, p + 1))}
                disabled={currentPage >= Math.ceil(rvall.length / PAGE_SIZE) - 1}
                style={{
                  padding: "4px 14px",
                  borderRadius: "6px",
                  border: "1px solid #0310ce",
                  background: currentPage >= Math.ceil(rvall.length / PAGE_SIZE) - 1 ? "#e0e0e0" : "#0310ce",
                  color: currentPage >= Math.ceil(rvall.length / PAGE_SIZE) - 1 ? "#888" : "#fff",
                  cursor: currentPage >= Math.ceil(rvall.length / PAGE_SIZE) - 1 ? "default" : "pointer",
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
                  {rvall && rvall.length > 0 ? formatNumber(rvall[0].TotalDebit) : formatNumber(0)}
                </h3>
              </div>
              <div className="col-3" style={{ display: "flex", justifyContent: "flex-end", paddingRight: "35px" }}>
                <h3 style={{ margin: 0, color: "#c62828", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {rvall && rvall.length > 0 ? formatNumber(rvall[0].TotalCredit) : formatNumber(0)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditDetailModal && itemToEdit && (
        <RVEditDetail
          open={showEditDetailModal}
          onClose={handleCloseEditDetailModal}
          onSave={() => handleDetailUpdatedOrDeleted(true)}
          entryId={itemToEdit.entryId}
          journalNo={itemToEdit.journalNo}
          seq={itemToEdit.seq}
        />
      )}
    </div>
  );
}

export default AccordionRVDT;
