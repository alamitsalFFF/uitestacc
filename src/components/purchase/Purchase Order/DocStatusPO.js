import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import axios from '../../Auth/axiosConfig';
import { API_VIEW_RESULT } from '../../api/url';

// เพิ่ม onStatusNameFetched เข้ามาใน props
const DocStatusPO = ({ accDocNo, DocType, onStatusNameFetched }) => {
  const [displayedStatusName, setDisplayedStatusName] = useState('');
  const shortYear = new Date().getFullYear().toString().slice(-2);
  useEffect(() => {
    const fetchStatusName = async () => {
      if (!accDocNo || accDocNo === `${DocType}${shortYear}xx...`) {
        setDisplayedStatusName('');
        // ตรวจสอบให้แน่ใจว่าได้เรียก callback ด้วยค่าว่างหรือค่าเริ่มต้น
        if (onStatusNameFetched) {
          onStatusNameFetched('');
        }
        return;
      }

      try {
        const vPO_H_Payload = {
          viewName: "vPO_H",
          parameters: [
            { field: "AccDocNo", value: accDocNo },
          ],
          results: [
            { sourceField: "AccDocNo" },
            { sourceField: "StatusName" },
          ],
        };

        const response = await axios.post(API_VIEW_RESULT, vPO_H_Payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        console.log('DATA DocStatus:', data);
        let status = '';
        if (Array.isArray(data) && data.length > 0) {
          const foundDoc = data.find(item => item.AccDocNo === accDocNo);
          if (foundDoc) {
            status = foundDoc.StatusName;
          } else {
            status = 'Not Found';
          }
        } else {
          // status = 'No Data';
          status = 'OPEN';
        }
        setDisplayedStatusName(status);
        // เรียกใช้ callback เพื่อส่งค่า displayedStatusName กลับไป
        if (onStatusNameFetched) {
          onStatusNameFetched(status);
        }
      } catch (error) {
        console.error("Error fetching status name for AccDocNo:", accDocNo, error);
        setDisplayedStatusName('Error Loading');
        // เรียกใช้ callback ด้วยค่า error
        if (onStatusNameFetched) {
          onStatusNameFetched('Error Loading');
        }
      }
    };

    fetchStatusName();
  }, [accDocNo, onStatusNameFetched]); // เพิ่ม onStatusNameFetched ใน dependency array ด้วย

  return (
    <TextField
      id="docStatusDisplay"
      label="DocStatus"
      value={displayedStatusName || '0'}
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

export default DocStatusPO;