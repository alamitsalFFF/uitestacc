import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import axios from '../../Auth/axiosConfig';
import { useNavigate, useLocation } from "react-router-dom";
import { API_VIEW_RESULT, URL } from '../../api/url';
import { CircularProgress, List, ListItemText, ListItemButton, Paper, Typography, Divider, Box, TextField, InputAdornment, IconButton, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxf50Q5-BAMhiOxVXnM-ubP5hPEIlrEjBCSn-6VufdRs65ptvCOXtU2t13UgC5f77r6/exec";
const API_KEY = 'vp_2026_dev_ULTRA_SECRET_8f3k2';

const SearchControls = ({ value, onChange, onSearch }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {/* <TextField
      size="small"
      value={value}
      placeholder="กรุณากรอกชื่อ Sender..."
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonSearchIcon fontSize="small" sx={{ color: 'primary.main' }} />
          </InputAdornment>
        ),
      }}
      sx={{ width: 220, bgcolor: 'white', borderRadius: '8px' }}
    /> */}
    <TextField
      size="small"
      fullWidth
      value={value}
      placeholder="กรุณากรอกชื่อ Sender..."
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'grey.500' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange('')} edge="end">
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{ bgcolor: 'white', borderRadius: '8px' }}
    />

  </Box>
);

function PreviewData({ handleClose, accDocType }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [allDetails, setAllDetails] = useState([]); // Store all details
  const [error, setError] = useState(null);
  const [docSearchTerm, setDocSearchTerm] = useState(''); // ค้นหา DocumentID
  const location = useLocation();
  const { mappedOCR, fromOCRData } = location.state || {};
  const isNewMode = location.state && location.state.isNew;
  const [doctype, setDoctype] = React.useState("");
  const shortYear = new Date().getFullYear().toString().slice(-2);
  const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month'));
  const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month'));
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingDocRefNos, setExistingDocRefNos] = useState(new Set()); // เก็บ DocRefNo ที่มีอยู่แล้วในระบบ
  // Search State
  // const [senderFolder, setSenderFolder] = useState('');
  const [senderFolder, setSenderFolder] = useState('fern02');
  // const [senderFolder, setSenderFolder] = useState(['fernka', 'tawan02']);

  // --------------------------------
  // ดึง DocRefNo ทั้งหมดของ accDocType นี้จากระบบ เพื่อตรวจว่ามีเอกสารซ้ำหรือไม่
  const checkExistingDocs = useCallback(async () => {
    if (!accDocType) return;
    console.log("accDocType", accDocType);
    const vAll = "v" + `${accDocType}` + "_H"
    console.log("vAll", vAll);
    const vAll_H = {
      viewName: vAll,
      parameters: [
        { field: "AccDocType", value: accDocType },
      ],
      results: [
        { sourceField: "DocRefNo" },
        { sourceField: "AccDocNo" },
      ],
    };
    try {
      const response = await axios.post(API_VIEW_RESULT, vAll_H, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 && Array.isArray(response.data)) {
        // เก็บ DocRefNo ที่ไม่ว่างเป็น Set เพื่อตรวจสอบเร็ว
        const refNos = new Set(
          response.data
            .map(item => (item.DocRefNo || "").trim())
            .filter(v => v !== "")
        );
        console.log("Existing DocRefNos in system:", [...refNos]);
        setExistingDocRefNos(refNos);
      }
    } catch (error) {
      console.error("Error checking existing docs:", error);
    }
  }, [accDocType]);

  // ---------------------
  useEffect(() => {
    fetchDocuments();
    checkExistingDocs(); // ตรวจสอบเอกสารที่มีอยู่แล้วในระบบ
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const payload = {
        action: 'accountingPullLatest',
        senderFolder: senderFolder.trim(),
        "x-api-key": API_KEY
      };
      console.log("Sending Payload:", JSON.stringify(payload));
      const targetUrl = `${GOOGLE_APPS_SCRIPT_URL}?x-api-key=${API_KEY}`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Documents:", data);

      if (data.error) {
        throw new Error(`${data.error}`); // Show API error
      }

      // Handle { ok: true, data: { headers: [], lines: [] } } structure
      if (data.data && data.data.headers && Array.isArray(data.data.headers)) {
        setDocuments(data.data.headers);
        setAllDetails(data.data.lines || data.data.details || []);
      }
      // Handle flat { headers: [], details: [] } structure (Legacy/Fallback)
      else if (data.headers && Array.isArray(data.headers)) {
        setDocuments(data.headers);
        setAllDetails(data.details || []);
      } else if (Array.isArray(data)) {
        setDocuments(data);
        setAllDetails([]); // Assume flat structure has details inside
      } else if (data && Array.isArray(data.data)) { // This might be redundant now but keeping for safety if data.data is an array
        setDocuments(data.data);
        setAllDetails([]);
      } else {
        setDocuments([]);
        setAllDetails([]);
        console.warn("Unexpected API response format:", data);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = (doc) => {
    console.log("Selected Document:", doc);

    // Find matching details for this document
    let relevantDetails = [];
    if (doc.detail) {
      // If details are already nested
      relevantDetails = doc.detail;
    } else if (allDetails.length > 0 && doc.CompositeKey) {
      // Match details using CompositeKey logic
      // Header Key: "HDR::ID"
      // Detail Key: "LNS::ID::Seq"
      // Logic: Detail Key starts with "LNS::" + (Header Key without "HDR::")
      const headerId = doc.CompositeKey.replace(/^HDR::/, "");
      relevantDetails = allDetails.filter(d =>
        d.CompositeKey && d.CompositeKey.startsWith(`LNS::${headerId}`)
      );
    }

    const mappedData = mapDocumentToDraft(doc, relevantDetails);
    console.log("Mapped Data:", mappedData);

    navigate(`${URL}DraftDataEntry`, {
      state: {
        mappedOCR: mappedData,
        fromOCRData: true,
        originalData: doc,
        accDocType: accDocType || 'PO', // ส่ง DocType ไปด้วย
      }
    });
  };

  const mapDocumentToDraft = (doc, details) => {
    const convertThaiYearToAD = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('/');
      if (parts.length !== 3) return dateStr;
      let [day, month, year] = parts;
      if (year.length === 2) {
        year = (2000 + parseInt(year, 10)).toString();
      } else if (year.length === 4 && parseInt(year, 10) > 2500) {
        year = (parseInt(year, 10) - 543).toString();
      }
      day = day.padStart(2, '0');
      month = month.padStart(2, '0');
      return `${year} - ${month} - ${day}`;
    };

    const detailArray = Array.isArray(details) ? details : [];

    return {
      partyName: doc.SellerName || doc.sender || doc.to || "",
      taxNumber: doc.SellerTaxID || doc.vatid || "",
      address: doc.SellerAddressLine || doc.address || "",
      invoiceNo: doc.DocumentID || "",
      invoiceDate: (doc.IssueDate || doc.date) ? convertThaiYearToAD(doc.IssueDate || doc.date) : new Date().toISOString().split('T')[0],
      amount: parseFloat(doc.LineSubtotal || doc.total) || 0,
      vatAmount: parseFloat(doc.VATTotal) || 0,
      WHTAmount: parseFloat(doc.WHTAmount) || 0,
      grandTotal: parseFloat(doc.GrandTotal || doc.grandtotal) || 0,
      docRefNo: doc.ReferenceNo || doc.quotation || "",

      detailItems: detailArray.map((item, index) => {
        const qty = item.Quantity ? parseFloat(item.Quantity) : (item.qty ? parseFloat(item.qty) : 0);
        const lineTotal = item.LineNetAmount ? parseFloat(item.LineNetAmount) : (item.amount ? parseFloat(item.amount) : 0);
        // User requested to use UnitPrice from JSON and NOT calculate it
        let price = item.UnitPrice ? parseFloat(item.UnitPrice) : (item.Price ? parseFloat(item.Price) : (item.unit_price ? parseFloat(item.unit_price) : 0));

        return {
          itemNo: item.LineNo || item.item || (index + 1).toString(),
          partNameAndDescription: item.ItemDescription || item.part_no_and_description || item.description || "",
          quantity: qty,
          unitPrice: price,
          discount: item.Discount || item.discount ? parseFloat(item.Discount || item.discount) : 0,
          lineTotal: lineTotal,
          unitMea: item.UnitCode || "PCS",
          rateVat: 7, // Default
          vatType: item.IncludeVAT === "True" ? 1 : 2
        };
      })
    };
  };



  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>กำลังโหลดรายการเอกสาร...</Typography>
        <SearchControls value={senderFolder} onChange={setSenderFolder} onSearch={fetchDocuments} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'red' }}>
        <Typography variant="h6">เกิดข้อผิดพลาด</Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', my: 2 }}>{error}</Typography>

        <SearchControls value={senderFolder} onChange={setSenderFolder} onSearch={fetchDocuments} />

        <Button onClick={handleClose} sx={{ mt: 3 }} variant="outlined" color="secondary">ปิด</Button>
      </Box>
    );
  }

  return (
    <div className="preview-container">
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 700, borderBottom: '2px solid #ff0000', pb: 1 }}>
        เลือกเอกสาร (Draft Lists)
      </Typography>

      {/* Search Panel */}
      <Paper elevation={2} sx={{ mb: 2.5, p: 2, borderRadius: '12px', bgcolor: '#ff0000' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          {/* Sender Search */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: 0.8, mb: 0.75, display: 'block' }}>
              SENDER:
            </Typography>
            <SearchControls value={senderFolder} onChange={setSenderFolder} onSearch={fetchDocuments} />
          </Box>

          {/* Document Search */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: 0.8, mb: 0.75, display: 'block' }}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={docSearchTerm}
              placeholder="พิมพ์เลขที่เอกสาร / ชื่อลูกค้า..."
              onChange={(e) => setDocSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'grey.500' }} />
                  </InputAdornment>
                ),
                endAdornment: docSearchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setDocSearchTerm('')} edge="end">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{ bgcolor: 'white', borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            />
          </Box>
        </Box>
      </Paper>

      {documents.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>ไม่พบเอกสาร</Typography>
      ) : (
        <Paper style={{ maxHeight: '60vh', overflow: 'auto', backgroundColor: '#fffde7' }}>
          <List>
            {documents
              .filter(doc =>
                !docSearchTerm ||
                (doc.DocumentID || '').toLowerCase().includes(docSearchTerm.toLowerCase()) ||
                (doc.SellerName || '').toLowerCase().includes(docSearchTerm.toLowerCase())
              )
              .map((doc, index) => {
                const docId = (doc.DocumentID || "").trim();
                const isDuplicate = existingDocRefNos.has(docId);
                return (
                  <React.Fragment key={index}>
                    <ListItemButton
                      onClick={() => handleSelectDocument(doc)}
                      alignItems="flex-start"
                      sx={{
                        '&:hover': { bgcolor: 'white' },
                        bgcolor: isDuplicate ? '#fff3f3' : 'inherit', // พื้นหลังชมพูอ่อนถ้าซ้ำ
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {index + 1}. {doc.DocumentID || "Unknown Customer"}
                              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({doc.IssueDate || doc.date || "No Date"})
                              </Typography>
                            </Typography>
                            {isDuplicate && (
                              <Chip
                                label="มีแล้ว"
                                size="small"
                                sx={{
                                  bgcolor: '#d32f2f',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  height: '20px',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color={isDuplicate ? 'error' : 'text.primary'}>
                              {doc.SellerName} | Total: {doc.GrandTotal || doc.grandtotal || doc.total}
                            </Typography>
                            {isDuplicate && (
                              <Typography component="span" variant="caption" sx={{ display: 'block', color: '#d32f2f', fontWeight: 'bold' }}>
                                ⚠ เอกสารนี้ถูกนำเข้าระบบแล้ว
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                    {/* <Divider variant="inset" component="li" /> */}
                    <Divider
                      variant="middle"
                      component="li"
                      style={{ listStyle: "none" }}
                    />
                  </React.Fragment>
                );
              })}
          </List>
        </Paper>
      )}

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: 'grey', '&:hover': { bgcolor: 'darkgrey' } }}
        >
          ปิด
        </Button>
      </div>
    </div>
  );
}

export default PreviewData;