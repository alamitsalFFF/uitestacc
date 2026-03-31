import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuthFetch } from "../../Auth/fetchConfig";

// const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhPl6X7YOKy44P72aWZmdMrkzVcZB0lr8qP_Wao-zG2L22RM5r0qtn3lyP10MuWY49/exec";
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzllsXgyVHMfAMpH1_cyFeRRR4vd66owtrpEu42oEIQXGc5tQJUQmpp0AVOUxviKwqM/exec";

function DraftDataFromOCR() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { ocrFileId } = location.state || {};
  // const ocrFileId = '1Jf17MrZIaiwR_22rU60ewhiET7cYJoqb';// Test File ID fromBoss
  const ocrFileId = '1_gRJb2IqdhoVGTDQUcoMKqiHGo__Keys';// Test File ID OCR2 ไฟล์ json
  // https://drive.google.com/file/d/1Jf17MrZIaiwR_22rU60ewhiET7cYJoqb/view?usp=sharing
  // const ocrFileId = '1XbT9c3UFQORMVh9K6S2Khzzat30AurcT';// Test File ID
  // const ocrFileId = 'AKfycbxhPl6X7YOKy44P72aWZmdMrkzVcZB0lr8qP_Wao-zG2L22RM5r0qtn3lyP10MuWY49';
  // const ocrFileId = '1OnLQCmFsj-pNkzqz1kCNBkdfezRlc5y-';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ocrFileId) {
      alert("ไม่พบ ocrFileId");
      navigate(-1);
      return;
    }

    console.log("[DraftDataFromOCR] Start using ocrFileId:", ocrFileId);

    fetchOCRDataByFileId(ocrFileId);
  }, [ocrFileId]);


  // -------------------------------------
  //   1) ดึงข้อมูลจาก outputOCR
  // -------------------------------------
  const authFetch = useAuthFetch();
  const fetchOCRDataByFileId = async (fileId) => {
    try {
      const url = `${GOOGLE_APPS_SCRIPT_URL}?fileId=${fileId}`;
      // const url = `${GOOGLE_APPS_SCRIPT_URL}?fileId=${fileId}&callback=c`;

      console.log("[DraftDataFromOCR] Fetch URL:", url);

      //  const response = await authFetch(url);
      const response = await fetch(url);
      //  const textData = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("[DraftDataFromOCR] Raw OCR Data:", data);
      //  const data = JSON.parse(textData);

      console.log("[DraftDataFromOCR] Raw OCR Data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("ไม่พบข้อมูล OCR ใน Google Sheet");
        navigate(-1);
        return;
      }

      const row = data[0]; // ใช้แถวแรกสุด
      const mapped = mapOCRRow(row);

      console.log("[DraftDataFromOCR] mapped:", mapped);

      // ส่งไปหน้า DraftOCRDIHD
      navigate("/uitestacc/DraftOCRDI", {
        state: {
          mappedOCR: mapped,
          fromOCRData: true,
        }
      });

    } catch (err) {
      console.error("[DraftDataFromOCR] error:", err);
      alert("Error จาก OCR API");
    } finally {
      setLoading(false);
    }
  };

  // ใน DraftDataFromOCR.js
  // -------------------------------------
  //   2) Mapping Logic
  // -------------------------------------
  const mapOCRRow = (row) => {
    // 'row' คือ Object JSON ที่มีคีย์ "detail"

    // เตรียมข้อมูลส่วน Detail
    const detailArray = Array.isArray(row.detail) ? row.detail : [];
    const convertThaiYearToAD = (dateStr) => {
      if (!dateStr) return null;

      // แยกส่วน DD, MM, YY
      const parts = dateStr.split('/');
      if (parts.length !== 3) return dateStr; // คืนค่าเดิมถ้าแยกไม่สำเร็จ
      let [day, month, year] = parts;
      // 1. แปลงปี (YY) ให้เป็น ค.ศ. 4 หลัก (YYYY)
      if (year.length === 2) {
        // **สมมติฐาน**: ถ้าเป็นเลข 2 หลัก ให้แปลงเป็นปี ค.ศ. 20xx
        // เช่น '25' -> '2025'
        year = (2000 + parseInt(year, 10)).toString();
      }
      // ถ้าเป็นปี พ.ศ. 4 หลักอยู่แล้ว (เช่น 2568) ให้แปลงเป็น ค.ศ.
      else if (year.length === 4 && parseInt(year, 10) > 2500) {
        year = (parseInt(year, 10) - 543).toString(); // แปลง พ.ศ. เป็น ค.ศ.
      }

      // 2. จัดรูปแบบให้เป็น YYYY-MM-DD เพื่อความเข้ากันได้กับ Date object
      // ตรวจสอบให้ Day/Month มี 2 หลักเสมอ
      day = day.padStart(2, '0');
      month = month.padStart(2, '0');

      return `${year}-${month}-${day}`; // ส่งออกเป็น YYYY-MM-DD
    };
    return {
      // ข้อมูลส่วน Header (เหมือนเดิม)
      partyName: row.to || "",
      taxNumber: row.vatid || "",
      address: row.address || "",
      invoiceNo: row.quotation || "",
      // invoiceDate: row.date || "",
      invoiceDate: convertThaiYearToAD(row.date),
      amount: row.total || 0,
      vatAmount: row.vat || 0,
      grandTotal: row.grandtotal || 0,
      docRefNo: "",
      googleFileId: ocrFileId,

      // ********** ส่วนที่เพิ่ม **********
      // ข้อมูลส่วนรายการสินค้า/บริการ
      detailItems: detailArray.map(item => ({
        // แมปชื่อคีย์ใน JSON (item 1, item 2, etc.) ไปเป็นชื่อคีย์ที่ UI คาดหวัง

        // ใช้ชื่อคีย์ตามโครงสร้าง JSON 
        itemNo: item.item || "", // 'item' ใน JSON คือลำดับที่
        partNameAndDescription: item.part_no_and_description || "",
        quantity: item.qty ? parseFloat(item.qty) : 0, // แปลงเป็นตัวเลข
        unitPrice: item.unit_price ? parseFloat(item.unit_price) : 0, // แปลงเป็นตัวเลข
        discount: item.discount ? parseFloat(item.discount) : 0,
        lineTotal: item.amount ? parseFloat(item.amount) : 0, // 'amount' คือยอดรวมของรายการนั้น

      })),
      // **********************************
    };
  };

  // -------------------------------------
  //   UI Loading
  // -------------------------------------
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>กำลังโหลดข้อมูลจาก OCR...</h2>
      <CircularProgress />
    </div>
  );

}

export default DraftDataFromOCR;
