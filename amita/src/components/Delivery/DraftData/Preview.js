// DriveImagePreview.jsx (ควรแยกไฟล์นี้ออกมา)

import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function DriveImagePreview({ googleDriveFileId, handleClose }) { 
    const navigate = useNavigate();

  const handleDraftOCR = () => {
    // navigate("/uitestacc/DraftOCRDI", {
    navigate("/uitestacc/DraftDI", {
      state: { ocrFileId: googleDriveFileId,mode: "dataOnly" }  // ส่งค่าไปหน้า DraftOCRDIHD
    });
  };
  if (!googleDriveFileId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>ไม่พบ File ID สำหรับภาพ Preview</h3>
        <p>กรุณาตรวจสอบว่ามีการส่ง File ID ที่ถูกต้องมาหรือไม่</p>
        <button onClick={handleClose}>ปิด</button>
      </div>
    );
  }

  // **การแก้ไขสำคัญ:** ใช้ URL สำหรับ Thumbnail โดยใช้ File ID
  // URL นี้จะดึงภาพมาแสดงผลโดยตรง (ตั้งค่าขนาดกว้าง 800px)
  const imageUrl = `https://drive.google.com/thumbnail?id=${googleDriveFileId}&sz=w800`;
  // const imageUrl = `https://drive.google.com/uc?export=view&id=${googleDriveFileId}`;

return (
    <div className="image-preview-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h3 id="global-image-preview-modal-title" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        ภาพ Preview (OCR)
      </h3>

      <img src={imageUrl} alt="OCR Preview"
        style={{
          maxWidth: '100%',
          height: 'auto',
          margin: '10px auto',
          border: '1px solid #ddd'
        }}
        // style={{ maxWidth: '100%', height: 'auto' }}
      />

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        
        {/* ปุ่ม Draft OCR */}
        <Button 
          onClick={handleDraftOCR}
          variant="contained"
          sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#0d47a1' }}}
        >
          Draft OCR
        </Button>

        {/* ปุ่มปิด */}
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }}}
        >
          ปิด
        </Button>

      </div>
    </div>
  );
}

export default DriveImagePreview;