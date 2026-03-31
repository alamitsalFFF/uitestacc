import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import { Box } from "@mui/material";
import PRDTAU from "../purchase/Purchase Requisition/PRDTAU";
import { useState, useEffect } from "react";
import AccordionCashSaleMain from "./AccordionCashSaleMain";
import AccordionCashSaleData from "./AccordionCashSaleData";

export default function AccordionCS() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const accDocNo = params.get("accDocNo");
  const [expandedPanels, setExpandedPanels] = useState({
    panel1: true,
    panel2: false,
  });
  const [apiData, setApiData] = useState([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAccDocNo, setCurrentAccDocNo] = useState("");

  const handleGoMenu = () => {
    navigate("/uitestacc/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ฟังก์ชันสำหรับเปิด Panel Header
  const handleOpenHeaderPanel = () => {
    setExpandedPanels((prev) => ({
      ...prev,
      panel1: true,
    }));
  };

  // ฟังก์ชันนี้จะถูกเรียกจาก Component ลูก (AccordionCashSaleMain)
  const handleSaveSuccess = (data) => {
    setApiData(data); // นำข้อมูลมาเก็บใน State ของ Component แม่
    setExpandedPanels({
      panel1: false, // ซ่อนฟอร์ม
      panel2: true,  // แสดงตารางข้อมูล
    });
  };

  return (
    <div>
      <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        Quick Sale (รายวันขาย)
      </h2>
      <Accordion
        expanded={expandedPanels.panel1}
        onChange={() =>
          setExpandedPanels((prev) => ({
            ...prev,
            panel1: !prev.panel1,
          }))
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{ backgroundColor: "#00008b" }}
          style={{ backgroundColor: "#7bf4a9ab" }}
        >
          <Typography component="span" style={{ textAlign: "center" }}>
            Header
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionCashSaleMain
            onSaveSuccess={handleSaveSuccess} // ส่งฟังก์ชันไปเป็น Props
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedPanels.panel2}
        onChange={() =>
          setExpandedPanels((prev) => ({
            ...prev,
            panel2: !prev.panel2,
          }))
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          style={{ backgroundColor: "#00008b" }} style={{ backgroundColor: "#7bf4a9ab" }}
        >
          <Typography component="span" style={{ justifyContent: "center" }}>
            Detail
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {apiData ? ( // แสดงตารางก็ต่อเมื่อมีข้อมูลแล้ว
            <AccordionCashSaleData data={apiData} /> // ส่งข้อมูลไปเป็น Props
          ) : (
            <Typography>กรุณากรอกและบันทึกข้อมูลด้านบน</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <div style={{ padding: "30px" }}>&nbsp;</div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          width: "93%", // กำหนดความกว้างเท่ากับ dashboard
          //maxWidth: "960px", // กำหนดความกว้างสูงสุดเท่ากับ dashboard
          left: "50%", // เลื่อนไปกึ่งกลาง
          transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจริงๆ
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px", // ลด padding ลงเล็กน้อยเพื่อให้พอดี
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={handleGoMenu}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Back
          </Button>
        </Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            endIcon={<FaArrowUp />}
            onClick={scrollToTop}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Top
          </Button>
        </Box>
      </div>
    </div>
  );
}
