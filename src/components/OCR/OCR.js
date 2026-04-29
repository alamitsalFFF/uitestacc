import React, { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { URL } from '../api/url';
import { parseOCRTextForPO, formatDateForForm } from './OCRFieldMapper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HeaderBar from '../menu/HeaderBar';

const STEPS = ['อัปโหลดเอกสาร', 'ประมวลผล OCR', 'ตรวจสอบ & นำเข้า'];

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e90b0b 0%, #8b0000 100%)', // Red theme matching login page
    padding: '24px 16px',
    fontFamily: 'Sarabun, Inter, sans-serif',
  },
  header: {
    textAlign: 'center',
    mb: 4,
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 3,
    p: 3,
    color: '#fff',
  },
  dropZone: (isDragging) => ({
    border: `2px dashed ${isDragging ? '#fff' : 'rgba(255,255,255,0.4)'}`,
    borderRadius: 3,
    p: 6,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isDragging ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
    '&:hover': { background: 'rgba(255,255,255,0.15)', borderColor: '#fff' },
  }),
  primaryBtn: {
    background: '#fff',
    color: '#e90b0b',
    fontWeight: 700,
    px: 4,
    py: 1.5,
    borderRadius: 2,
    '&:hover': { background: '#f0f0f0' },
  },
  fieldLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', mb: 0.5 },
  fieldInput: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#fff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
  },
  tableCell: { color: '#fff', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' },
  tableHeadCell: { color: '#fff', borderColor: 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: '0.8rem' },
};

async function pdfToImages(file) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    images.push(canvas.toDataURL('image/png'));
  }
  return images;
}

export default function OCR() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [rawText, setRawText] = useState('');
  const [mapped, setMapped] = useState(null);
  const [error, setError] = useState('');

  const handleFileDrop = useCallback(async (f) => {
    if (!f) return;
    setFile(f);
    setError('');
    if (f.type === 'application/pdf') {
      try {
        setProgressStatus('กำลังโหลด PDF...');
        const imgs = await pdfToImages(f);
        setPreviewUrls(imgs);
      } catch (e) {
        setError('ไม่สามารถโหลด PDF ได้: ' + e.message);
      }
    } else {
      setPreviewUrls([URL.createObjectURL(f)]);
    }
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileDrop(f);
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFileDrop(f);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile(null);
    setPreviewUrls([]);
    setRawText('');
    setMapped(null);
    setProgress(0);
    setProgressStatus('');
    setError('');
  };

  const runOCR = async () => {
    if (!previewUrls.length) return;
    setActiveStep(1);
    setProgress(0);
    setError('');
    let fullText = '';
    try {
      for (let i = 0; i < previewUrls.length; i++) {
        setProgressStatus(`กำลังอ่านหน้า ${i + 1}/${previewUrls.length}...`);
        const result = await Tesseract.recognize(previewUrls[i], 'tha+eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const pageBase = (i / previewUrls.length) * 100;
              const pageShare = (1 / previewUrls.length) * 100;
              setProgress(Math.round(pageBase + m.progress * pageShare));
            }
          },
        });
        fullText += (i > 0 ? '\n\n' : '') + result.data.text;
      }
      setRawText(fullText);
      const parsedData = parseOCRTextForPO(fullText);
      // Convert dates
      if (parsedData.accEffectiveDate) parsedData.accEffectiveDate = formatDateForForm(parsedData.accEffectiveDate);
      if (parsedData.dueDate) parsedData.dueDate = formatDateForForm(parsedData.dueDate);
      setMapped(parsedData);
      setProgress(100);
      setProgressStatus('เสร็จสิ้น!');
      setActiveStep(2);
    } catch (e) {
      setError('เกิดข้อผิดพลาดใน OCR: ' + e.message);
      setActiveStep(0);
    }
  };

  const handleMappedChange = (field, value) => {
    setMapped((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (idx, field, value) => {
    setMapped((prev) => {
      const items = [...prev.lineItems];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, lineItems: items };
    });
  };

  // เพิ่มรายการใหม่ด้วยมือ
  const handleAddLineItem = () => {
    setMapped((prev) => {
      const nextSeq = String((prev.lineItems?.length || 0) + 1);
      return {
        ...prev,
        lineItems: [
          ...(prev.lineItems || []),
          { seq: nextSeq, description: '', qty: '1', unit: 'Unit', unitPrice: '0', amount: '0' },
        ],
      };
    });
  };

  // ลบรายการ
  const handleDeleteLineItem = (idx) => {
    setMapped((prev) => {
      const items = prev.lineItems.filter((_, i) => i !== idx);
      // re-seq
      const reSeqed = items.map((it, i) => ({ ...it, seq: String(i + 1) }));
      return { ...prev, lineItems: reSeqed };
    });
  };

  const handleImportToPO = () => { 
    if (!mapped) return;
    navigate(`${URL}AccordionPO`, {
      state: {
        fromOCR: true,
        ocrData: {
          accDocType: 'PO',
          accDocNo: mapped.accDocNo,
          accBatchDate: mapped.accEffectiveDate,   // วันที่เอกสาร (date[0])
          accEffectiveDate: mapped.dueDate || mapped.accEffectiveDate, // ครบกำหนด (date[1])
          partyName: mapped.partyName,
          partyTaxCode: mapped.partyTaxCode,
          partyAddress: mapped.partyAddress,
          docRefNo: mapped.jobName,
          issueBy: mapped.issueBy,
        },
        lineItems: mapped.lineItems,
      },
    });
  };

  return (
    <Box sx={styles.root}>
      <HeaderBar />
      {/* Header */}
      <Box sx={styles.header}>
        <DocumentScannerIcon sx={{ fontSize: 48, color: '#fff', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
          OCR Document Reader
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
          อ่านเอกสาร อัตโนมัติ — ลดข้อผิดพลาดในการคีย์ข้อมูล
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label, i) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: i <= activeStep ? '#fff !important' : 'rgba(255,255,255,0.2) !important',
                    '&.Mui-active': { color: '#fff !important' },
                    '&.Mui-completed': { color: '#4ade80 !important' },
                    '& .MuiStepIcon-text': {
                      fill: i <= activeStep ? '#e90b0b' : '#fff',
                      fontWeight: 'bold',
                    },
                  },
                }}
              >
                <Typography sx={{ color: i <= activeStep ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto', mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        {/* STEP 0: Upload */}
        {activeStep === 0 && (
          <Paper sx={styles.card}>
            <Box
              sx={styles.dropZone(isDragging)}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={onFileChange} />
              <CloudUploadIcon sx={{ fontSize: 56, color: '#fff', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                รองรับ PDF, PNG, JPG
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                {['PDF', 'PNG', 'JPG'].map((t) => (
                  <Chip key={t} label={t} size="small"
                    icon={t === 'PDF' ? <PictureAsPdfIcon /> : <ImageIcon />}
                    sx={{ color: '#fff', borderColor: '#fff', bgcolor: 'transparent' }} variant="outlined" />
                ))}
              </Box>
            </Box>

            {file && previewUrls.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {file.type === 'application/pdf' ? <PictureAsPdfIcon sx={{ color: '#fff' }} /> : <ImageIcon sx={{ color: '#fff' }} />}
                  {file.name} ({previewUrls.length} หน้า)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                  {previewUrls.map((url, i) => (
                    <Box key={i} sx={{ flexShrink: 0 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.5, textAlign: 'center' }}>
                        หน้า {i + 1}
                      </Typography>
                      <img src={url} alt={`page-${i + 1}`}
                        style={{ height: 200, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', objectFit: 'contain', background: '#fff' }} />
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button startIcon={<AutoFixHighIcon />} variant="contained" sx={styles.primaryBtn} onClick={runOCR}>
                    เริ่มอ่านเอกสาร (OCR)
                  </Button>
                  <Button startIcon={<DeleteIcon />} variant="outlined"
                    sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
                    onClick={handleReset}>
                    ล้างข้อมูล
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        )}

        {/* STEP 1: Processing */}
        {activeStep === 1 && (
          <Paper sx={styles.card}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <DocumentScannerIcon sx={{ fontSize: 64, color: '#fff', mb: 2,
                animation: 'pulse 1.5s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                กำลังประมวลผล OCR...
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>{progressStatus}</Typography>
              <Box sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                <LinearProgress variant="determinate" value={progress}
                  sx={{ height: 10, borderRadius: 5,
                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #fff, #ffcccc)' },
                    bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography sx={{ color: '#fff', mt: 1, fontWeight: 700 }}>{progress}%</Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                กรุณารอสักครู่ — ขึ้นอยู่กับขนาดและจำนวนหน้าของเอกสาร
              </Typography>
            </Box>
          </Paper>
        )}

        {/* STEP 2: Review & Map */}
        {activeStep === 2 && mapped && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip icon={<CheckCircleIcon />} label="OCR เสร็จสิ้น" sx={{ bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 700 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                ตรวจสอบและแก้ไขข้อมูลก่อนนำเข้าสู่ระบบ
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Button startIcon={<RestartAltIcon />} size="small"
                  sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.2)' }}
                  variant="outlined" onClick={handleReset}>เริ่มใหม่</Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {/* Raw text */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ ...styles.card, height: '100%' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>📄 ข้อความดิบจาก OCR</Typography>
                  <Box sx={{ background: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2, maxHeight: 500, overflowY: 'auto' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {rawText}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Mapped fields */}
              <Grid item xs={12} md={7}>
                <Paper sx={styles.card}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>🗂️ ข้อมูลที่ Map ได้</Typography>

                  <Grid container spacing={2}>
                    {[
                      { key: 'accDocNo', label: 'เลขที่เอกสาร (PO No.)' },
                      { key: 'accEffectiveDate', label: 'วันที่', type: 'date' },
                      { key: 'dueDate', label: 'ครบกำหนด', type: 'date' },
                      { key: 'issueBy', label: 'ผู้สั่งซื้อ' },
                      { key: 'jobName', label: 'ชื่องาน / อ้างอิง' },
                      { key: 'partyName', label: 'ชื่อผู้จำหน่าย (Supplier)' },
                      { key: 'partyTaxCode', label: 'เลขผู้เสียภาษี' },
                      { key: 'partyAddress', label: 'ที่อยู่' },
                    ].map(({ key, label, type }) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography sx={styles.fieldLabel}>{label}</Typography>
                        <TextField fullWidth size="small" type={type || 'text'}
                          value={mapped[key] || ''} onChange={(e) => handleMappedChange(key, e.target.value)}
                          sx={styles.fieldInput}
                          InputLabelProps={type === 'date' ? { shrink: true } : undefined} />
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                  <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>💰 สรุปยอดเงิน</Typography>
                  <Grid container spacing={2}>
                    {[
                      { key: 'totalAmount', label: 'รวมเงิน (บาท)' },
                      { key: 'vatAmount', label: 'ภาษีมูลค่าเพิ่ม 7%' },
                      { key: 'netAmount', label: 'จำนวนเงินรวมทั้งสิ้น' },
                      { key: 'whtAmount', label: 'หัก ณ ที่จ่าย' },
                      { key: 'payAmount', label: 'ยอดจ่าย' },
                    ].map(({ key, label }) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography sx={styles.fieldLabel}>{label}</Typography>
                        <TextField fullWidth size="small" value={mapped[key] || ''}
                          onChange={(e) => handleMappedChange(key, e.target.value)} sx={styles.fieldInput} />
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                  {/* ตาราง Line Items - แสดงเสมอ */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: '#e94560', fontWeight: 700 }}>📋 รายการสินค้า/บริการ</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleAddLineItem}
                      sx={{ color: '#4ade80', borderColor: '#4ade80', fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'rgba(74,222,128,0.1)', borderColor: '#4ade80' } }}
                    >
                      + เพิ่มรายการ
                    </Button>
                  </Box>

                  {(!mapped.lineItems || mapped.lineItems.length === 0) && (
                    <Box sx={{ p: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 2, textAlign: 'center', mb: 1 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                        ไม่พบรายการจาก OCR อัตโนมัติ — กด &quot;+ เพิ่มรายการ&quot; เพื่อเพิ่มด้วยตนเอง
                      </Typography>
                    </Box>
                  )}

                  {mapped.lineItems && mapped.lineItems.length > 0 && (
                    <Box sx={{ overflowX: 'auto' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {['#', 'รายละเอียด', 'จำนวน', 'หน่วย', 'ราคา/หน่วย', 'ยอด', ''].map((h) => (
                              <TableCell key={h} sx={styles.tableHeadCell}>{h}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mapped.lineItems.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={styles.tableCell}>{item.seq}</TableCell>
                              <TableCell sx={styles.tableCell}>
                                <TextField size="small" value={item.description} multiline
                                  onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                                  sx={{ ...styles.fieldInput, minWidth: 180 }} />
                              </TableCell>
                              {['qty', 'unit', 'unitPrice', 'amount'].map((f) => (
                                <TableCell key={f} sx={styles.tableCell}>
                                  <TextField size="small" value={item[f] || ''}
                                    onChange={(e) => handleLineItemChange(idx, f, e.target.value)}
                                    sx={{ ...styles.fieldInput, width: 90 }} />
                                </TableCell>
                              ))}
                              <TableCell sx={styles.tableCell}>
                                <Button size="small" onClick={() => handleDeleteLineItem(idx)}
                                  sx={{ color: '#e94560', minWidth: 0, p: '2px 6px', fontSize: '0.75rem' }}
                                >
                                  ✕
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<SendIcon />} sx={styles.primaryBtn} onClick={handleImportToPO}>
                      นำเข้าสู่ฟอร์ม PO
                    </Button>
                    <Button variant="outlined" startIcon={<RestartAltIcon />}
                      sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
                      onClick={handleReset}>
                      อัปโหลดเอกสารใหม่
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
