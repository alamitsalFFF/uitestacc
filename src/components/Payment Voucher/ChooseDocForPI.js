import React, { useState, useEffect } from "react";
import axios from "../../components/Auth/axiosConfig.js";
import { API_VIEW_RESULT } from "../api/url.js";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTimes,
  faFileInvoice,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "../purchase/formatNumber.js";
import { FormatDate } from "../purchase/FormatData.js";
import dayjs from "dayjs";

/**
 * ChooseDocForPI
 * Modal สำหรับเลือกเอกสาร PI (Payment Invoice) เพื่อสร้าง PV
 *
 * Props:
 *   isOpen    {boolean}  — แสดง/ซ่อน modal
 *   onClose   {fn}       — ปิด modal
 *   onSelect  {fn(docNo, partyName, totalNet)} — callback เมื่อเลือกรายการแล้ว
 */
function ChooseDocForPI({ isOpen, onClose, onSelect }) {
  const [docList, setDocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // date range — ย้อนหลัง 5 เดือน
  const dateFrom = dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD");
  const dateTo = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!isOpen) return;
    const fetchPIList = async () => {
      setLoading(true);
      try {
        const payload = {
          viewName: "vAP_H",
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
            { sourceField: "AccEffectiveDate" },
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
              // ซ่อน สถานะ CLOSED / CANCEL (DocStatus 3, 99)
              return [0].includes(doc.DocStatus);
            })
            .sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo));
          setDocList(sorted);
        }
      } catch (err) {
        console.error("ChooseDocForPI fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPIList();
    setSearchTerm("");
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = docList.filter((doc) => {
    // แสดงเฉพาะ DocStatus 0 — ซ่อน CLOSED / CANCEL
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
          boxShadow: "0 8px 32px rgba(33,150,243,0.25)",
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
            background: "linear-gradient(135deg, #1565c0, #0288d1)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FontAwesomeIcon
              icon={faFileInvoice}
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
              เลือก PI
            </span>
          </div>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}
            onClick={onClose}
          />
        </div>

        {/* Search bar */}
        <div style={{ padding: "12px 16px", flexShrink: 0, background: "#f0f8ff" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="ค้นหา PI No. หรือชื่อ Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: "#0288d1", fontSize: "0.9rem" }}
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
                  boxShadow: "0 1px 4px rgba(2,136,209,0.10)",
                  border: "1px solid #e1f5fe",
                  borderLeft: "4px solid #0288d1",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e8f4fd")
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
                        color: "#0d47a1",
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
                      color: "#0d47a1",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatNumber(doc.TotalNet)}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{
                      color: "#0288d1",
                      background: "#e1f5fe",
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

export default ChooseDocForPI;
