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
import PRDTAU from "../../purchase/Purchase Requisition/PRDTAU";
import { useState, useEffect } from "react";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE, URL } from "../../api/url";
import AccordionDIHD from "./AccordionDIHD";
import AccordionDIDT from "./AccordionDIDT";
import DraftOCRDIHD from "./DraftOCRDIHD";
import DraftOCRDIDT from "./DraftOCRDIDT";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";

export default function DraftOCRDI() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const accDocNo = params.get("accDocNo");
  const [expandedPanels, setExpandedPanels] = useState({
    panel1: true,
    panel2: false,
  });
  const [apiData, setApiData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAccDocNo, setCurrentAccDocNo] = useState("");
  const [ocrDetailItems, setOcrDetailItems] = useState([]);
  const [productMaster, setProductMaster] = useState([]);
  const [detailAccDocNo, setDetailAccDocNo] = useState(null);
  const handleOcrDataLoaded = (ocrItems) => {
    setOcrDetailItems(ocrItems); // เก็บ Detail Items ที่ได้จาก OCR
  };
  const DocType = 'DI';
  const [categoryOptions, setCategoryOptions] = useState([]);
  console.log("Category Options:", categoryOptions);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${DocType}`;
        const response = await authFetch(categoryApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          setCategoryOptions(data[0].eName);
        } else {
          console.error("Category API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCategoryOptions();
  }, []);
  const [ModuleMenu, setModuleMenu] = useState([]);
  console.log("ModuleMenu:", ModuleMenu);
  const [WebAddress, setWebAddress] = useState([]);
  console.log("WebAddress:", WebAddress);
  useEffect(() => {
    const fetchWebAddress = async () => {
      try {
        const WebAddressAPI = `${API_BASE}/Module/GetModuleMenu?MenuID=${DocType}`;
        const response = await authFetch(WebAddressAPI);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('WebAddress from ModuleMenu', data);
        if (data && data.length > 0) {
          setModuleMenu(data);
          setWebAddress(data[0].webAddress);
        } else {
          console.error("Category API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchWebAddress();
  }, []);

  const handleGoMenu = () => {
    navigate(`${URL}${WebAddress}`);
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

  return (
    <div>
      <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        Data Entry:{categoryOptions}
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
          {/* <AccordionPOHD /> */}
          <DraftOCRDIHD
            apiData={apiData}
            setApiData={setApiData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrentAccDocNo={setCurrentAccDocNo}
            setOcrDetailItems={setOcrDetailItems}
            ocrDetailItems={ocrDetailItems}
            productMaster={productMaster}
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
          {(currentAccDocNo || ocrDetailItems.length > 0) && (
            <DraftOCRDIDT
              accDocNo={currentAccDocNo}
              initialOcrDetails={ocrDetailItems}
              onSaveSuccess={handleOpenHeaderPanel}
              productMaster={productMaster}
            />
          )}
        </AccordionDetails>
      </Accordion>

      <div style={{ padding: "30px" }}>&nbsp;</div>
      <FloatingActionBar backPath={`${URL}${WebAddress}`} />
    </div>
  );
}
