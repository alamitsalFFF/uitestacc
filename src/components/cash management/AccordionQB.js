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
import AccordionQuickBuyAssetMain from "./AccordionQuickBuyAssetMain";
import AccordionQuickBuyAssetResult from "./AccordionQuickBuyAssetResult";
import { URL } from "../api/url";
import DocConfigHeader from "../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../hooks/useDocConfiguration";
import FloatingActionBar from "../DataFilters/FloatingActionBar";


export default function AccordionQB() {
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

  const DocType = `QB`
  const { categoryOptions, categoryOptionsThai, webAddress, handleGoMenu } = useDocConfiguration(DocType);
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
    <div style={{ paddingTop: "10px" }}>
      <DocConfigHeader
        categoryOptions={categoryOptions}
        categoryOptionsThai={categoryOptionsThai}
        handleGoMenu={handleGoMenu}
      />
      {/* <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        QuickBuy (รายวันซื้อ)
      </h2> */}
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
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{ backgroundColor: "#00008b" }}
        >
          <Typography component="span" style={{ textAlign: "center", color: "white" }}>
            Header
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionQuickBuyAssetMain
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
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel2-content"
          id="panel2-header"
          style={{ backgroundColor: "#00008b" }}
        >
          <Typography component="span" style={{ justifyContent: "center", color: "white" }}>
            Detail
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {apiData ? ( // แสดงตารางก็ต่อเมื่อมีข้อมูลแล้ว
            <AccordionQuickBuyAssetResult data={apiData} /> // ส่งข้อมูลไปเป็น Props
          ) : (
            <Typography>กรุณากรอกและบันทึกข้อมูลด้านบน</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar
        backPath={URL}
      />
    </div>
  );
}
