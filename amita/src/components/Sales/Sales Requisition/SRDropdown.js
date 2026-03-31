import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../Auth/axiosConfig'; 
import { API_VIEW_RESULT } from '../../api/url';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
  Divider // เพิ่ม Divider เพื่อแยกระหว่างส่วน
} from '@mui/material';

// Import คอมโพเนนต์ Header และ Detail ที่มีอยู่แล้ว
import SRHeader from './SRHeader'; 
import SRListDT from './SRListDT'; 

function SRDropdowns() {
  const navigate = useNavigate();
  const location = useLocation();

  const [headers, setHeaders] = useState([]);
  const [selectedHeaderAccDocNo, setSelectedHeaderAccDocNo] = useState('');
  const [details, setDetails] = useState([]);
  const [selectedDetailLineID, setSelectedDetailLineID] = useState('');
  const [showComponent, setShowComponent] = useState(null); // 'header' หรือ 'detail' หรือ null

  // ดึงค่า AccDocNo เริ่มต้นที่ถูกส่งมาจากหน้าอื่น (เช่น SRList)
  const initialAccDocNo = location.state?.initialAccDocNo || '';

  // Effect แรก: ดึงข้อมูล Header ทั้งหมด และตั้งค่า Header เริ่มต้นหากมี
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const vSR_H_Payload = {
          viewName: "vSR_H",
          parameters: [{ field: "AccDocType", value: "SR" }],
          results: [
            { sourceField: "AccDocNo" },
            { sourceField: "PartyName" },
          ],
        };
        const response = await axios.post(API_VIEW_RESULT, vSR_H_Payload, {
          headers: { "Content-Type": "application/json" },
        });
        setHeaders(response.data);

        if (initialAccDocNo) {
          setSelectedHeaderAccDocNo(initialAccDocNo);
          setShowComponent('header'); // ถ้ามี initialAccDocNo ให้แสดง Header ทันที
        }
      } catch (error) {
        console.error("Error fetching SR Headers:", error);
      }
    };
    fetchHeaders();
  }, [initialAccDocNo]);

  // Effect ที่สอง: ดึงข้อมูล Detail ตาม Header ที่เลือก
  useEffect(() => {
    if (selectedHeaderAccDocNo) {
      const fetchDetails = async () => {
        try {
          const vSR_D_Payload = {
            viewName: "vSR_D", // ตรวจสอบชื่อ view สำหรับ Detail ของคุณ
            parameters: [{ field: "AccDocNo", value: selectedHeaderAccDocNo }],
            results: [
              { sourceField: "AccDocNo" },
            //   { sourceField: "LineID" },
              { sourceField: "SalesDescription" },
              { sourceField: "AccItemNo" },
            ],
          };
          const response = await axios.post(API_VIEW_RESULT, vSR_D_Payload, {
            headers: { "Content-Type": "application/json" },
          });
          setDetails(response.data);
          setSelectedDetailLineID(''); // รีเซ็ตการเลือก Detail เมื่อ Header เปลี่ยน
        } catch (error) {
          console.error("Error fetching SR Details:", error);
          setDetails([]);
        }
      };
      fetchDetails();
    } else {
      setDetails([]); // เคลียร์ Detail หากไม่มี Header ถูกเลือก
      setSelectedDetailLineID('');
      setShowComponent(null); // ซ่อนทั้ง Header และ Detail ถ้าไม่มีการเลือก
    }
  }, [selectedHeaderAccDocNo]);

  const handleHeaderChange = (event) => {
    const accNo = event.target.value;
    setSelectedHeaderAccDocNo(accNo);
    setShowComponent('header'); // เมื่อเลือก Header ให้แสดงคอมโพเนนต์ Header
    setSelectedDetailLineID(''); // รีเซ็ต Detail selection
  };

  const handleDetailChange = (event) => {
    const lineId = event.target.value;
    setSelectedDetailLineID(lineId);
    setShowComponent('detail'); // เมื่อเลือก Detail ให้แสดงคอมโพเนนต์ Detail
  };

  const handleAddNewSR = () => {
    navigate('/uitestacc/SRHeader', { state: { isNew: true } });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Select Sales Return Document
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewSR}
        sx={{ mb: 2 }}
      >
        Create New SR Header
      </Button>

      {/* Dropdown สำหรับ Header */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="header-select-label">Select SR Header</InputLabel>
        <Select
          labelId="header-select-label"
          value={selectedHeaderAccDocNo}
          label="Select SR Header"
          onChange={handleHeaderChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {headers.map((header) => (
            <MenuItem key={header.AccDocNo} value={header.AccDocNo}>
              {header.AccDocNo} - {header.PartyName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dropdown สำหรับ Detail (ถูก Disable หากไม่มี Header ถูกเลือก) */}
      <FormControl fullWidth margin="normal" disabled={!selectedHeaderAccDocNo}>
        <InputLabel id="detail-select-label">Select SR Detail Line</InputLabel>
        <Select
          labelId="detail-select-label"
          value={selectedDetailLineID}
          label="Select SR Detail Line"
          onChange={handleDetailChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {details.map((detail) => (
            <MenuItem key={`${detail.AccDocNo}-${detail.AccItemNo}`} value={detail.SalesDescription}>
              Line {detail.AccDocNo}: {detail.SalesDescription} (Item: {detail.AccItemNo})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 3 }} /> {/* แบ่งส่วนระหว่าง Dropdown และ Component ที่แสดงผล */}

      {/* Conditional Rendering ของ SRHeader หรือ SRListDT */}
      {showComponent === 'header' && selectedHeaderAccDocNo && (
        <Box sx={{ border: '1px solid #ccc', p: 2, mt: 2, borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>
            SR Header Details:
          </Typography>
          {/* นี่คือส่วนที่เรียกใช้ SRHeader Component เดิมของคุณ */}
          {/* SRHeader ของคุณควรจะสามารถรับ accDocNo เป็น prop ได้ */}
          {/* และมี logic ภายในสำหรับโหลดข้อมูลของ accDocNo นั้นๆ */}
          <SRHeader accDocNo={selectedHeaderAccDocNo} />
          {/* คุณอาจต้องปรับ SRHeader ให้รับ prop เช่น readOnly เพื่อควบคุมการแก้ไขในบางกรณี */}
        </Box>
      )}

      {showComponent === 'detail' && selectedHeaderAccDocNo && selectedDetailLineID && (
        <Box sx={{ border: '1px solid #ccc', p: 2, mt: 2, borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>
            SR Detail Line Details:
          </Typography>
          {/* นี่คือส่วนที่เรียกใช้ SRListDT Component เดิมของคุณ */}
          {/* SRListDT ของคุณควรจะสามารถรับ accDocNo และ lineId เป็น prop ได้ */}
          <SRListDT accDocNo={selectedHeaderAccDocNo} lineId={selectedDetailLineID} />
        </Box>
      )}

      {/* ปุ่ม Go to Detail Page อาจจะไม่จำเป็นแล้วถ้าแสดงผลในหน้าเดียวกัน */}
      {/* แต่ถ้ายังต้องการให้มี ก็สามารถคงไว้ได้ */}
      {/*
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          if (selectedHeaderAccDocNo && selectedDetailLineID) {
            navigate(`/uitestacc/SRListDT?accDocNo=${selectedHeaderAccNo}&lineId=${selectedDetailLineID}`);
          }
        }}
        disabled={!selectedDetailLineID}
        sx={{ mt: 2 }}
      >
        Go to Detail Page (New Window/Tab)
      </Button>
      */}
    </Box>
  );
}

export default SRDropdowns;