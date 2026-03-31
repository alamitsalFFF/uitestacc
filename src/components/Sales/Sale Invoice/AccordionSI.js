import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE, URL } from "../../api/url";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import AccordionSIDT from "./AccordionSIDT";
import SIAccordionHD from "./AccordionSIHD";
import useDocConfiguration from "../../../hooks/useDocConfiguration";
import DocConfigHeader from "../../DataFilters/DocConfigHeader";

export default function AccordionSI() {
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
  const DocType = "SI";
  const { categoryOptions, categoryOptionsThai, webAddress, handleGoMenu } = useDocConfiguration(DocType);

  // const [categoryOptions, setCategoryOptions] = useState([]);
  // console.log("Category Options:", categoryOptions);
  // const authFetch = useAuthFetch();

  // useEffect(() => {
  //   const fetchCategoryOptions = async () => {
  //     try {
  //       const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=SI`; //TYPEDOC
  //       const response = await authFetch(categoryApiUrl);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);

  //       // if (Array.isArray(data)) {
  //       //   setCategoryOptions(
  //       //     data.map((item) => ({ value: item.category, label: item.eName,docConfigID: item.docConfigID, }))
  //       //   );
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

  const handleOpenHeaderPanel = () => {
    setExpandedPanels((prev) => ({
      ...prev,
      panel1: true,
    }));
  };

  return (
    <div>
      {/* <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        &nbsp;{categoryOptions}&nbsp;
      </h2> */}
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
          <SIAccordionHD
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
          <Typography component="span" style={{ justifyContent: "center", color: "white" }}>
            Detail
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionSIDT
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
