import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import WHTHeader from "./WHTHeader";
import WHTListDT from "./WHTListDT";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE, URL } from "../api/url";
import "../../components/DataFilters/MenuHeader.css";
import HeaderBar from "../menu/HeaderBar";

export default function AccordionWHT() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const accDocNoParam = params.get("docNo") || params.get("accDocNo");

    const [expandedPanels, setExpandedPanels] = useState({
        panel1: true,
        panel2: false,
    }); // panel1 = Header, panel2 = Detail

    const [currentAccDocNo, setCurrentAccDocNo] = useState("");
    const [apiData, setApiData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [webAddress, setWebAddress] = useState("");

    const headerRef = useRef(null);

    const handleUpdateTotals = (totalAmount, totalTax) => {
        if (headerRef.current) {
            headerRef.current.updateTotalsAndSave(totalAmount, totalTax);
        }
    };

    const authFetch = useAuthFetch();
    const DocType = "WH3"; // Assuming WHT is the doc type, verify if needed

    // Fetch Module Menu for Navigation
    useEffect(() => {
        const fetchWebAddress = async () => {
            try {
                // Adjust MenuID if WHT uses a different ID
                const WebAddressAPI = `${API_BASE}/Module/GetModuleMenu?MenuID=${DocType}`;
                const response = await authFetch(WebAddressAPI);
                if (!response.ok) {
                    // Fallback or ignore if module menu not found
                    console.warn(`Module menu for ${DocType} not found.`);
                    return;
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setWebAddress(data[0].webAddress);
                }
            } catch (error) {
                console.error("Error fetching web address:", error);
            }
        };
        fetchWebAddress();
    }, [authFetch]);

    const handleGoBack = () => {
        if (webAddress) {
            navigate(`${URL}${webAddress}`);
        } else {
            // Fallback navigation if webaddress not found
            console.log("No WebAddress found");
            navigate(`${URL}`);
        }
    };

    const handleOpenHeaderPanel = () => {
        setExpandedPanels((prev) => ({ ...prev, panel1: true }));
    };

    return (
        <div style={{ paddingLeft: "3%", paddingRight: "3%", paddingTop: "10px" }}>
            <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="col-8">
                    <div className="docconfig-header">
                        <h4 className="docconfig-title" onClick={handleGoBack}>
                            Withholding Tax
                        </h4>
                        <p className="docconfig-subtitle">ภาษีหัก ณ ที่จ่าย</p>
                    </div>
                </div>
                <div className="col-4">
                    <HeaderBar />
                </div>
            </div>
            {/* Header Panel */}
            <Accordion
                expanded={expandedPanels.panel1}
                onChange={() => setExpandedPanels((prev) => ({ ...prev, panel1: !prev.panel1 }))}
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
                    <WHTHeader
                        ref={headerRef}
                        apiData={apiData}
                        setApiData={setApiData}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        setCurrentAccDocNo={setCurrentAccDocNo}
                        DocType={DocType}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Detail Panel */}
            <Accordion
                expanded={expandedPanels.panel2}
                onChange={() => setExpandedPanels((prev) => ({ ...prev, panel2: !prev.panel2 }))}
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
                    <WHTListDT
                        docNo={currentAccDocNo || accDocNoParam}
                        onSaveSuccess={handleOpenHeaderPanel}
                        onUpdateTotals={handleUpdateTotals}
                    />
                </AccordionDetails>
            </Accordion>

            <div style={{ padding: "30px" }}>&nbsp;</div>
            <FloatingActionBar backPath={webAddress ? `${URL}${webAddress}` : "#"} />
        </div>
    );
}
