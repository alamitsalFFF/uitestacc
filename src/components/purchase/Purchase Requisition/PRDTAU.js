import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig.js";
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
  clearSelectedProducts,
} from "../../redux/TransactionDataaction.js";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import PREditDetailAU from "./PREditDTAU.js";
import { formatNumber } from "../formatNumber.js";
import { FormatDate } from "../FormatData.js";
import { API_VIEW_RESULT } from "../../api/url.js";
import AccordionSelectProductPR from "./AccordionSelectProductPR.js";
import AccordiionPRAddDT from "./AccordiionPRAddDT.js";
import { Box, Modal } from "@mui/material";

function PRDTAU({ accDocNo, onSaveSuccess, ocrLineItems = [] }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Redux states
  const accEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const detailData = useSelector((state) => state.detailData);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const partyCode = useSelector((state) => state.partyCode);
  const partyName = useSelector((state) => state.partyName);
  const nameCategory = useSelector((state) => state.nameCategory);

  // Local states
  const [loading, setLoading] = useState(false);
  const [prh, setPRH] = useState([]);
  const [prd, setPRD] = useState([]);
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemCounter, setItemCounter] = useState(1);

  // ****** States สำหรับควบคุม Modal
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddDTModal, setOpenAddDTModal] = useState(false);

  // Fetch PR Header & Detail
  const fetchDataPRDetails = useCallback(() => {
    if (accDocNo) {
      const vPR_H = {
        viewName: "vPR_H",
        parameters: [
          { field: "AccDocType", value: "PR" },
          { field: "AccDocNo", value: accDocNo },
        ],
        results: [
          { sourceField: "AccDocNo" },
          { sourceField: "AccBatchDate" },
          { sourceField: "AccEffectiveDate" },
          { sourceField: "PartyCode" },
          { sourceField: "PartyTaxCode" },
          { sourceField: "PartyName" },
          { sourceField: "PartyAddress" },
          { sourceField: "IssueBy" },
          { sourceField: "AccDocType" },
          { sourceField: "AccPostDate" },
          { sourceField: "FiscalYear" },
          { sourceField: "DocStatus" },
          { sourceField: "DocRefNo" },
          { sourceField: "TotalAmount" },
          { sourceField: "TotalVat" },
          { sourceField: "TotalWht" },
          { sourceField: "TotalNet" },
          { sourceField: "StatusName" },
        ],
      };

      const vPR_D = {
        viewName: "vPR_D",
        parameters: [
          { field: "AccDocType", value: "PR" },
          { field: "AccDocNo", value: accDocNo },
        ],
        results: [
          { sourceField: "AccDocNo" },
          { sourceField: "AccItemNo" },
          { sourceField: "SalesDescription" },
          { sourceField: "Price" },
          { sourceField: "Qty" },
          { sourceField: "Amount" },
          { sourceField: "Currency" },
          { sourceField: "UnitMea" },
          { sourceField: "RateVat" },
          { sourceField: "RateWht" },
        ],
      };

      (async () => {
        try {
          setLoading(true);
          const responseH = await axios.post(
            API_VIEW_RESULT,
            vPR_H,
            { headers: { "Content-Type": "application/json" } }
          );
          const responseD = await axios.post(
            API_VIEW_RESULT,
            vPR_D,
            { headers: { "Content-Type": "application/json" } }
          );
          if (responseH.status === 200 && responseD.status === 200) {
            setLoading(false);
            setPRH(responseH.data);
            setPRD(responseD.data.sort((a, b) => a.AccItemNo - b.AccItemNo));
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
  }, [accDocNo]);

  useEffect(() => {
    if (accDocNo) {
      fetchDataPRDetails(accDocNo);
    }
  }, [accDocNo]);

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

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Confirm" ที่ Modal เลือกสินค้า
  const handleConfirmProductSelection = () => {
    handleCloseProductModal(); // Close the product selection modal
    setOpenAddDTModal(true); // Open the detail modal
  };

  // ฟังก์ชันสำหรับปิด Modal เพิ่มรายละเอียด
  const handleCloseAddDTModal = () => {
    setOpenAddDTModal(false);
    dispatch(clearSelectedProducts()); // เคลียร์ค่าที่เลือกเมื่อปิด Modal
  };

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Save" ที่ Modal เพิ่มรายละเอียด
  const handleSaveDetail = () => {
    // 1. Close the modal
    handleCloseAddDTModal();

    // 2. Fetch the latest data from the server
    fetchDataPRDetails();

    // 3. Increment the item counter for the next batch
    //    We need to get the number of items that were successfully saved. 
    //    We can get this from the Redux state.
    const numberOfSavedItems = selectedProducts.length;
    setItemCounter(prevCounter => prevCounter + numberOfSavedItems);

    // 4. (Optional) Call a function from the parent component
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  // Edit detail modal handlers
  const handleEditDetail = (AccItemNo) => {
    const docStatus = prh[0]?.DocStatus;
    const accDocType = prh[0]?.AccDocType;
    setItemToEdit({
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    console.log("itemToEdit:", {
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    setShowEditDetailModal(true);
  };

  const handleCloseEditDetailModal = useCallback(() => {
    setShowEditDetailModal(false);
    setItemToEdit(null);
  }, []);

  const handleDetailUpdatedOrDeleted = useCallback(() => {
    fetchDataPRDetails();
    handleCloseEditDetailModal();
  }, [fetchDataPRDetails, handleCloseEditDetailModal]);

  // คำนวณ itemCounter
  useEffect(() => {
    if (prd && prd.length > 0) {
      const itemNo = prd.map((item) => item.AccItemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setItemCounter(1);
    }
  }, [prd]);

  // Render
  return (
    <div>
      <div className="row">
        <ListItem
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
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
              {accDocNo}
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
              Due Date:&nbsp;
              {prh[0]?.AccEffectiveDate ? (
                <FormatDate dateString={prh[0].AccEffectiveDate} />
              ) : (
                <FormatDate dateString={accEffectiveDate} />
              )}
            </span>
          </div>
        </ListItem>
      </div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <h5 style={{ color: "#00008b" }}>
            &nbsp;{prh[0]?.PartyName || partyName}
          </h5>
        </ListItem>
      </div>
      {prd.map((product, index) => (
        <div
          key={index}
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            margin: "6px 4px",
            padding: "10px 12px",
            boxShadow: "0 1px 4px rgba(26,35,126,0.08)",
            border: "1px solid #e8eaf6",
            borderLeft: "4px solid #1565c0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Item info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
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
                {product.AccItemNo}
              </span>
              {/* Description */}
              <span
                style={{
                  color: "#1a237e",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.SalesDescription}
              </span>
            </div>
            {/* Price × Qty */}
            <div
              style={{
                marginTop: "4px",
                color: "#607d8b",
                fontSize: "0.8rem",
                paddingLeft: "28px",
              }}
            >
              {formatNumber(product.Price)}&nbsp;{product.Currency}&nbsp;
              <span style={{ color: "#90a4ae" }}>x</span>&nbsp;
              {formatNumber(product.Qty)}&nbsp;{product.UnitMea}
            </div>
          </div>

          {/* Right: Amount + Edit */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", flexShrink: 0 }}>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1a237e",
              }}
            >
              {formatNumber(product.Amount)}
            </span>
            <FontAwesomeIcon
              icon={faChevronRight}
              size="sm"
              style={{
                color: "#1565c0",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                background: "#e3f2fd",
              }}
              onClick={() => handleEditDetail(product.AccItemNo)}
            />
          </div>
        </div>
      ))}

      {/* OCR Preview Items — แสดงเมื่อยังไม่มีข้อมูลจาก API */}
      {prd.length === 0 && ocrLineItems.length > 0 && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #fff8e1, #fffde7)',
            border: '1px solid #ffcc02',
            borderRadius: 8,
            padding: '8px 12px',
            margin: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ color: '#b8860b', fontWeight: 600, fontSize: '0.85rem' }}>
              รายการจาก OCR (Preview) — กด Save เพื่อบันทึกลงระบบ
            </span>
          </div>
          {ocrLineItems.map((item, index) => {
            const qty = parseFloat(item.qty) || 1;
            const price = parseFloat(item.unitPrice) || 0;
            const amount = parseFloat(item.amount) || (qty * price);
            return (
              <div key={`ocr-${index}`} style={{ background: '#fffdf0' }}>
                <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
                <ListItem style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <h5 style={{ color: '#555' }}>
                      &nbsp; {index + 1}.&nbsp;
                      {item.description || '(ไม่มีคำอธิบาย)'}
                      &nbsp;
                      <span style={{
                        background: '#ffcc02', color: '#333',
                        borderRadius: 4, padding: '1px 6px',
                        fontSize: '0.7rem', fontWeight: 700,
                      }}>OCR</span>
                    </h5>
                    <h6 style={{ color: '#888' }}>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {formatNumber(price)} THB x {formatNumber(qty)} {item.unit || 'Unit'}
                    </h6>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{ display: "flex" }}>
                      <h2 style={{ color: '#b8860b' }}>{formatNumber(amount)}</h2>
                      &nbsp;&nbsp;&nbsp;
                    </div>
                  </div>
                </ListItem>
              </div>
            );
          })}
        </>
      )}
      {(!prh.length || prh[0]?.DocStatus === 0) && (
        <>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <ListItem style={{ justifyContent: "center" }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="warning"
                style={{ width: "183px", height: "33px", borderRadius: "20px" }}
                onClick={handleProductSelect}
              >
                <FontAwesomeIcon icon={faSquarePlus} size="2x" style={{ color: "#fff", justifyItems: "end" }} />
                &nbsp;Product/Service
              </Button>
            </Stack>
          </ListItem>
        </>
      )}
      {/* เพิ่มส่วนของ Modal  */}
      <AccordionSelectProductPR
        isOpen={openProductModal}
        onClose={handleCloseProductModal}
        onSave={handleConfirmProductSelection}
        accDocNo={accDocNo}
        nextItemNo={itemCounter}
      />

      <AccordiionPRAddDT
        open={openAddDTModal}
        onClose={handleCloseAddDTModal}
        onSave={handleSaveDetail}
      />

      {showEditDetailModal && itemToEdit && (
        <>
          <PREditDetailAU
            open={showEditDetailModal}
            onClose={handleCloseEditDetailModal}
            onBackdropClick={handleCloseEditDetailModal}
            onSave={handleDetailUpdatedOrDeleted}
            onDelete={handleDetailUpdatedOrDeleted}
            accDocNo={itemToEdit.accDocNo}
            accItemNo={itemToEdit.accItemNo}
            docStatus={itemToEdit.docStatus}
            accDocType={itemToEdit.accDocType}
            selectedDocConfigID={itemToEdit.selectedDocConfigID}
            isproductName={itemToEdit.isproductName}
            price={itemToEdit.price}
            qty={itemToEdit.qty}
          />
        </>
      )}
      <div className="row">
        {prh.map((productH, index) => (
          <div
            key={index}
            style={{
              background: "linear-gradient(135deg, #e8eaf6, #e3f2fd)",
              borderRadius: "12px",
              margin: "8px 4px 4px 4px",
              padding: "10px 8px",
              boxShadow: "0 2px 8px rgba(26,35,126,0.10)",
              border: "1px solid #c5cae9",
            }}
          >
            {/* Row: TotalVat */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
              <h5 style={{ color: "#1565c0", fontWeight: 500, margin: 0 }}>TotalVat 7%</h5>
              <h2 style={{ margin: 0, color: "#1565c0" }}>{formatNumber(productH.TotalVat)}</h2>
            </div>

            {/* Row: TotalWht */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
              <h5 style={{ color: "#1565c0", fontWeight: 500, margin: 0 }}>TotalWht</h5>
              <h2 style={{ margin: 0, color: "#1565c0" }}>{formatNumber(productH.TotalWht)}</h2>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1.5px solid #9fa8da", margin: "6px 8px" }} />

            {/* Row: TotalAmount — highlighted */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                background: "linear-gradient(135deg, #1a237e, #1565c0)",
                borderRadius: "8px",
              }}
            >
              <h5 style={{ color: "#ffffff", fontWeight: 700, margin: 0, letterSpacing: "0.04em" }}>TotalAmount</h5>
              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                }}
              >
                {formatNumber(productH.TotalAmount)}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PRDTAU;