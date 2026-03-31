import * as React from "react";
import { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import SRHeaderAU from "./SRHeaderAU";
import SRListDTAU from "./SRListDTAU";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import { API_BASE, URL } from "../../api/url";
import { useAuthFetch } from "../../Auth/fetchConfig";
import DocConfigHeader from "../../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../../hooks/useDocConfiguration";

export default function AccordionSR() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const accDocNo = params.get("accDocNo");
  const [expandedPanels, setExpandedPanels] = useState({
    panel1: true,
    panel2: false,
  }); // panel1 = Header, panel2 = Detail
  const [currentAccDocNo, setCurrentAccDocNo] = useState(""); // initialAccDocNo มาจาก URL หรือ Redux
  const [apiData, setApiData] = useState([]); // ข้อมูลทั้งหมด
  const [currentIndex, setCurrentIndex] = useState(0); // index ปัจจุบัน
  const authFetch = useAuthFetch();
  const DocType = `SR`
  const { categoryOptions, categoryOptionsThai, webAddress, handleGoMenu } = useDocConfiguration(DocType);

  // ฟังก์ชันสำหรับเปิด Panel Header
  const handleOpenHeaderPanel = () => {
    setExpandedPanels((prev) => ({
      ...prev,
      panel1: true,
    }));
  };

  return (
    <div>
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoMenu}>Sales Requisition</h2> */}
      <DocConfigHeader
        categoryOptions={categoryOptions}
        categoryOptionsThai={categoryOptionsThai}
        handleGoMenu={handleGoMenu}
      />
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
          <Typography component="span" style={{ textAlign: "center", color: "white" }}>Header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SRHeaderAU
            apiData={apiData}
            setApiData={setApiData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrentAccDocNo={setCurrentAccDocNo}
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
          <Typography component="span" style={{ justifyContent: "center", color: "white" }}>Detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SRListDTAU
            accDocNo={currentAccDocNo}
            onSaveSuccess={handleOpenHeaderPanel}
          />
        </AccordionDetails>
      </Accordion>
      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL + webAddress} />
    </div>
  );
}
