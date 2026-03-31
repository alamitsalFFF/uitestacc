import React, { useState, useEffect, useCallback } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSquarePlus, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { Button, Chip } from "@mui/material";
import { API_BASE } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";
import WHTAddDT from "./WHTAddDT";
import Swal from "sweetalert2";

export default function WHTListDT({ accDocNo, onSaveSuccess }) {
    const [details, setDetails] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const authFetch = useAuthFetch();

    const fetchDetails = useCallback(async () => {
        if (!accDocNo) return;
        try {
            const response = await authFetch(`${API_BASE}/WithholdingTax/GetWithholdingTaxDT?docNo=${accDocNo}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDetails(data);
                } else {
                    setDetails([]);
                }
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    }, [accDocNo, authFetch]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleOpenAddModal = () => {
        setEditItem(null);
        setOpenAddModal(true);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setOpenAddModal(true);
    };

    const handleCloseModal = () => {
        setOpenAddModal(false);
        setEditItem(null);
    };

    const handleSaveSuccess = () => {
        fetchDetails();
        handleCloseModal();
        if (onSaveSuccess) onSaveSuccess();
    };

    // Format number helper
    const formatNum = (num) => parseFloat(num).toFixed(2);

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ color: "#333", display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faReceipt} style={{ marginRight: "10px", color: "#1976d2" }} />
                    Withholding Tax Details
                </h4>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ borderRadius: "20px", padding: "8px 20px", fontWeight: "bold" }}
                    onClick={handleOpenAddModal}
                >
                    <FontAwesomeIcon icon={faSquarePlus} size="lg" style={{ marginRight: "8px" }} />
                    Add Detail
                </Button>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                {details.length > 0 ? (
                    details.map((item, index) => (
                        <div key={index} style={{ transition: "background-color 0.2s", cursor: "pointer" }} onClick={() => handleEdit(item)}>
                            <ListItem style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ fontWeight: "bold", marginRight: "10px", color: "#555" }}>{item.itemNo}.</span>
                                        <h6 style={{ margin: 0, fontWeight: "bold", color: "#000" }}>{item.incType}</h6>
                                        {item.payDate && (
                                            <Chip size="small" label={`Paid: ${item.payDate.split("T")[0]}`} style={{ marginLeft: "10px", backgroundColor: "#e3f2fd", color: "#1976d2", fontSize: "0.75rem" }} />
                                        )}
                                    </div>
                                    {item.payTaxDesc && (
                                        <p style={{ margin: "5px 0 0 25px", fontSize: "0.9em", color: "#666" }}>{item.payTaxDesc}</p>
                                    )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ textAlign: "right", marginRight: "20px" }}>
                                        <h6 style={{ margin: 0, fontWeight: "bold" }}>{formatNum(item.payAmount)} <span style={{ fontSize: "0.8em", color: "#888" }}>THB</span></h6>
                                        <div style={{ fontSize: "0.85em", color: "green", marginTop: "2px" }}>
                                            Tax: {formatNum(item.payTax)} ({item.payRate}%)
                                        </div>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        style={{ color: "#aaa" }}
                                    />
                                </div>
                            </ListItem>
                            {index < details.length - 1 && <Divider variant="middle" component="li" style={{ margin: 0 }} />}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                        <FontAwesomeIcon icon={faReceipt} size="3x" style={{ color: "#ddd", marginBottom: "15px" }} />
                        <p>No tax details items yet.</p>
                    </div>
                )}
            </div>

            <WHTAddDT
                isOpen={openAddModal}
                onClose={handleCloseModal}
                onSave={handleSaveSuccess}
                docNo={accDocNo}
                editItem={editItem}
            />
        </div>
    );
}
