import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import axios from '../../Auth/axiosConfig';
import { API_VIEW_RESULT, URL } from '../../api/url';

const DocStatusSI = ({ accDocNo, DocType }) => { // เปลี่ยนจาก statusName เป็น accDocNo
  const [displayedStatusName, setDisplayedStatusName] = useState(''); // State สำหรับเก็บ StatusName ที่จะแสดง
  const shortYear = new Date().getFullYear().toString().slice(-2);
  useEffect(() => {
    const fetchStatusName = async () => {
      // ตรวจสอบว่ามี accDocNo ก่อนเรียก API และ accDocNo ต้องไม่เป็น "SI25xx..." ซึ่งเป็นค่าเริ่มต้นชั่วคราว
      if (!accDocNo || accDocNo === `${DocType}${shortYear}xx...`) {
        setDisplayedStatusName(''); // เคลียร์ค่าหรือตั้งเป็นค่าว่างถ้า AccDocNo ไม่ถูกต้อง
        return;
      }

      try {
        const vAR_H_Payload = { // สร้าง payload สำหรับ API request
          viewName: "vAR_H",
          parameters: [
            { field: "AccDocNo", value: accDocNo }, // ใช้ AccDocNo ที่รับเข้ามา
          ],
          results: [
            { sourceField: "AccDocNo" },
            { sourceField: "StatusName" },
          ],
        };

        const response = await axios.post(API_VIEW_RESULT, vAR_H_Payload, {
          // const response = await authFetch.post(API_VIEW_RESULT, vSO_H_Payload, { // ถ้าใช้ authFetch
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          // หากมีข้อมูล ให้หา StatusName ของ AccDocNo ที่ตรงกัน (ควรมีแค่อันเดียว)
          const foundDoc = data.find(item => item.AccDocNo === accDocNo);
          if (foundDoc) {
            setDisplayedStatusName(foundDoc.StatusName);
          } else {
            setDisplayedStatusName('Not Found'); // กรณีไม่พบ AccDocNo ในผลลัพธ์
          }
        } else {
          setDisplayedStatusName('OPEN'); // กรณี API คืนค่าว่างเปล่า
        }
      } catch (error) {
        console.error("Error fetching status name for AccDocNo:", accDocNo, error);
        setDisplayedStatusName('Error Loading'); // แสดงข้อความ error
      }
    };

    fetchStatusName();
  }, [accDocNo]); // Dependency array: เรียก useEffect ใหม่เมื่อ accDocNo เปลี่ยนแปลง

  return (
    <TextField
      id="docStatusDisplay"
      label="DocStatus"
      value={displayedStatusName || '0'} // ใช้ state ที่เก็บ StatusName
      type="text"
      variant="standard"
      fullWidth
      InputProps={{
        readOnly: true,
        style: {
          backgroundColor: "#cdcdd1",
        }
      }}
      style={{ width: "100%" }}
    />
  );
};

export default DocStatusSI;