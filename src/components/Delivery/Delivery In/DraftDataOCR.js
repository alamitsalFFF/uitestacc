import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE, URL } from "../../api/url";
import DraftDataHD from "./DraftDataHD";
import DraftDataDT from "./DraftDataDT";
import useDocConfiguration from "../../../hooks/useDocConfiguration";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import DocConfigHeader from "../../DataFilters/DocConfigHeader";
import HeaderBar from "../../menu/HeaderBar";

export default function DraftDataOCR() {
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
  const DocType = location.state?.accDocType || ''; // รับค่าจาก PreviewData หรือ fallback
  const authFetch = useAuthFetch();
  const { categoryOptions, categoryOptionsThai, webAddress, handleGoMenu } = useDocConfiguration(DocType);

  // useEffect(() => {
  //   const fetchCategoryOptions = async () => {
  //     try {
  //       const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${DocType}`; //TYPEDOC
  //       const response = await authFetch(categoryApiUrl);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       if (data && data.length > 0) {
  //         setCategoryOptions(data[0].eName);
  //       } else {
  //         console.error("Category API did not return an array.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching category options:", error);
  //     }
  //   };

  //   fetchCategoryOptions();
  // }, []);

  // const [ModuleMenu, setModuleMenu] = useState([]);
  // console.log("ModuleMenu:", ModuleMenu);
  // const [WebAddress, setWebAddress] = useState([]);
  // console.log("WebAddress:", WebAddress);
  // useEffect(() => {
  //   const fetchWebAddress = async () => {
  //     try {
  //       const WebAddressAPI = `${API_BASE}/Module/GetModuleMenu?MenuID=${DocType}`;
  //       const response = await authFetch(WebAddressAPI);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log('WebAddress from ModuleMenu', data);
  //       if (data && data.length > 0) {
  //         setModuleMenu(data);
  //         setWebAddress(data[0].webAddress);
  //       } else {
  //         console.error("Category API did not return an array.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching category options:", error);
  //     }
  //   };

  //   fetchWebAddress();
  // }, []);

  // const handleGoMenu = () => {
  //   navigate(`${URL}${WebAddress}`);
  // };

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
    <div style={{ paddingTop: "10px" }}>
      {/* <DocConfigHeader
        categoryOptions={categoryOptions}
        categoryOptionsThai={categoryOptionsThai}
        handleGoMenu={handleGoMenu}
      />
      <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        Data Entry
      </h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoMenu}>
              Data Entry: {categoryOptions}
            </h4>
            <p className="docconfig-subtitle">{categoryOptionsThai}</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
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
        // style={{ backgroundColor: "#7bf4a9ab" }}
        >
          <Typography component="span" style={{ textAlign: "center", color: "white" }}>
            Header
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DraftDataHD
            apiData={apiData}
            setApiData={setApiData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrentAccDocNo={setCurrentAccDocNo}
            setOcrDetailItems={setOcrDetailItems}
            ocrDetailItems={ocrDetailItems}
            productMaster={productMaster}
            accDocType={DocType}
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
          style={{ backgroundColor: "#00008b" }} //style={{ backgroundColor: "#7bf4a9ab" }}
        >
          <Typography component="span" style={{ justifyContent: "center", color: "white" }}>
            Detail
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(currentAccDocNo || ocrDetailItems.length > 0) && (
            <DraftDataDT
              accDocNo={currentAccDocNo}
              initialOcrDetails={ocrDetailItems}
              onSaveSuccess={handleOpenHeaderPanel}
              productMaster={productMaster}
            />
          )}
        </AccordionDetails>
      </Accordion>

      <div style={{ padding: "30px" }}>&nbsp;</div>
      {/* <div
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
      </div> */}
      <FloatingActionBar
        backPath={URL + webAddress}
      />
    </div>
  );
}
