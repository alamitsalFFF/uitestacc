import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig.js";
import { API_VIEW_RESULT } from "../api/url.js";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTimes,
  faMoneyCheckDollar,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "../purchase/formatNumber.js";
import { FormatDate } from "../purchase/FormatData.js";
import dayjs from "dayjs";

/**
 * ChooseDocForPC
 * Modal สำหรับเลือกเอกสาร PC (Cheque Payment) เพื่อสร้าง PV
 *
 * Props:
 *   isOpen    {boolean}  — แสดง/ซ่อน modal
 *   onClose   {fn}       — ปิด modal
 *   onSelect  {fn(docNo, partyName, totalNet)} — callback เมื่อเลือกรายการแล้ว
 */
function ChooseDocForPC({ isOpen, onClose, onSelect }) {
  const [docList, setDocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // date range — ย้อนหลัง 5 เดือน
  const dateFrom = dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD");
  const dateTo = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!isOpen) return;
    const fetchPCList = async () => {
      setLoading(true);
      try {
        const payload = {
          viewName: "vPC_H",
          parameters: [
            {
              field: "AccBatchDate",
              UseOperator: "BETWEEN",
              From: dateFrom,
              To: dateTo,
            },
          ],
          results: [
            { sourceField: "AccDocNo" },
            { sourceField: "PartyName" },
            { sourceField: "AccBatchDate" },
            { sourceField: "DocStatus" },
            { sourceField: "StatusName" },
            { sourceField: "TotalNet" },
          ],
        };
        const response = await axios.post(API_VIEW_RESULT, payload, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const sorted = (response.data || [])
            .filter((doc) => {
              // แสดงเฉพาะ DocStatus 0=OPEN
              return [0].includes(doc.DocStatus);
            })
            .sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo));
          setDocList(sorted);
        }
      } catch (err) {
        console.error("ChooseDocForPC fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPCList();
    setSearchTerm("");
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = docList.filter((doc) => {
    if (![0].includes(doc.DocStatus)) return false;
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      doc.AccDocNo?.toLowerCase().includes(s) ||
      doc.PartyName?.toLowerCase().includes(s)
    );
  });

  const handleSelect = (doc) => {
    onSelect(doc.AccDocNo, doc.PartyName, doc.TotalNet);
  };

  const statusColor = (docStatus) => {
    if (docStatus === 0) return "#ff9800";
    if (docStatus === 1) return "#2e7d32";
    if (docStatus === 2) return "#1565c0";
    return "#607d8b";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 99998,
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(56,142,60,0.22)",
          width: "min(95vw, 520px)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2e7d32, #388e3c)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              style={{ color: "#fff", fontSize: "1.2rem" }}
            />
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.03em",
              }}
            >
              เลือก PC (Cheque Payment)
            </span>
          </div>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}
            onClick={onClose}
          />
        </div>

        {/* Search bar */}
        <div style={{ padding: "12px 16px", flexShrink: 0, background: "#f1f8e9" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="ค้นหา PC No. หรือชื่อ Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: "#388e3c", fontSize: "0.9rem" }}
                  />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", background: "#fff" },
            }}
          />
          <div style={{ fontSize: "0.75rem", color: "#90a4ae", marginTop: "6px", paddingLeft: "4px" }}>
            แสดงข้อมูลย้อนหลัง 5 เดือน ({dateFrom} - {dateTo}) · {filtered.length} รายการ
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 12px" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "120px",
              }}
            >
              <CircularProgress size={36} />
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#90a4ae",
                padding: "40px 0",
                fontSize: "0.9rem",
              }}
            >
              ไม่พบรายการ
            </div>
          ) : (
            filtered.map((doc, i) => (
              <div
                key={i}
                onClick={() => handleSelect(doc)}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  margin: "5px 0",
                  padding: "10px 14px",
                  boxShadow: "0 1px 4px rgba(56,142,60,0.10)",
                  border: "1px solid #dcedc8",
                  borderLeft: "4px solid #388e3c",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f1f8e9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                {/* Left info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#1b5e20",
                        fontSize: "0.95rem",
                      }}
                    >
                      {doc.AccDocNo}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#fff",
                        background: statusColor(doc.DocStatus),
                        borderRadius: "8px",
                        padding: "1px 8px",
                      }}
                    >
                      {doc.StatusName || doc.DocStatus}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#607d8b",
                      fontSize: "0.82rem",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {doc.PartyName}
                  </div>
                  <div style={{ color: "#90a4ae", fontSize: "0.75rem", marginTop: "2px" }}>
                    <FormatDate dateString={doc.AccBatchDate} />
                  </div>
                </div>

                {/* Right amount + arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                    marginLeft: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#1b5e20",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatNumber(doc.TotalNet)}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{
                      color: "#388e3c",
                      background: "#dcedc8",
                      borderRadius: "50%",
                      padding: "6px",
                      fontSize: "0.75rem",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ChooseDocForPC;
