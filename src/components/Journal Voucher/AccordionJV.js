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
import { useState, useEffect } from "react";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE, URL } from "../api/url";
import AccordionPVHD from "../Payment Voucher/AccordionPVHD";
import AccordionPVDT from "../Payment Voucher/AccordionPVDT";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import useDocConfiguration from "../../hooks/useDocConfiguration";
import DocConfigHeader from "../DataFilters/DocConfigHeader";

export default function AccordionJV() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search || "");
  const journalNoFromUrl = params.get("journalNo") || null;

  // parent-managed current document (initialized from URL)
  const [currentAccDocNo, setCurrentAccDocNo] = useState(journalNoFromUrl || "");

  const [expandedPanels, setExpandedPanels] = useState({
    panel1: true,
    panel2: false,
  });
  const [apiData, setApiData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const DocType = `PV`
  const { categoryOptions, categoryOptionsThai, webAddress, handleGoMenu } = useDocConfiguration(DocType);
  // ฟังก์ชันสำหรับเปิด Panel Header
  const handleOpenHeaderPanel = () => {
    setExpandedPanels((prev) => ({
      ...prev,
      panel1: true,
    }));
  };

  // When page loaded/URL changed, if query param contains journalNo
  // set currentAccDocNo (used by children) and open panels so header + detail show that document.
  useEffect(() => {
    if (journalNoFromUrl) {
      setCurrentAccDocNo(journalNoFromUrl); // keep prop name for children compatibility
      setExpandedPanels({ panel1: true, panel2: true });

      // If apiData is available, try to find the matching index by JournalNo only
      if (Array.isArray(apiData) && apiData.length > 0) {
        const idx = apiData.findIndex((d) => d.JournalNo === journalNoFromUrl);
        if (idx >= 0) setCurrentIndex(idx);
      }

      // If apiData isn't loaded here and header/detail components fetch by accDocNo (we pass journalNo),
      // they will react to currentAccDocNo prop and load their data.
    }
    // re-run when URL search or apiData changes (to try find index once data available)
  }, [location.search, journalNoFromUrl, apiData]);

  useEffect(() => {
    // init from URL when location.search changes
    const p = new URLSearchParams(location.search || "");
    const j = p.get("journalNo");
    if (j && j !== currentAccDocNo) {
      setCurrentAccDocNo(j);
      // expand panels if needed
      setExpandedPanels?.({ panel1: true, panel2: true });
      console.log("AccordionPV: init currentAccDocNo from URL:", j);
    }
  }, [location.search]);

  return (
    <div style={{ paddingTop: "10px" }}>
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
          <Typography component="span" style={{ textAlign: "center", color: "white" }}>
            Header
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionPVHD
            apiData={apiData}
            setApiData={setApiData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrentAccDocNo={setCurrentAccDocNo}
            currentAccDocNo={currentAccDocNo}
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
          <AccordionPVDT
            accDocNo={currentAccDocNo}
            onSaveSuccess={handleOpenHeaderPanel}
          />
        </AccordionDetails>
      </Accordion>

      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={`${URL}${webAddress}`} />
    </div>
  );
}
