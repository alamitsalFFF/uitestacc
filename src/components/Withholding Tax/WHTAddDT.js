import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap"; // Keep bootstrapping for Modal layout
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE } from "../api/url";

const incTypeOptions = [
    { value: "1", label: "1.เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40(1)" },
    { value: "2", label: "2.ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40(2)" },
    { value: "3", label: "3.ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40(1)" },
    { value: "4", label: "4.(ก)ค่าดอกเบี้ย ฯลฯ ตามมาตรา 40(4)(ก)" },
    { value: "5", label: "4.(ข)(1)เงินปันผลเงินส่วนแบ่งกำไร (1.1) ร้อยละ 30" },
    { value: "6", label: "4.(ข)(1)เงินปันผลเงินส่วนแบ่งกำไร (1.2) ร้อยละ 25" },
    { value: "7", label: "4.(ข)(1)เงินปันผลเงินส่วนแบ่งกำไร (1.3) ร้อยละ 20" },
    { value: "8", label: "4.(ข)(1)เงินปันผลเงินส่วนแบ่งกำไร (1.4) อัตราอื่นๆ" },
    { value: "9", label: "4.(ข)(2)กรณีผู้รับเงินปันผลไม่ได้รับเครดิตภาษีเพราะกิจการได้รับยกเว้น" },
    { value: "10", label: "4.(ข)(3)เงินปันผลหรือส่วนแบ่งกำไรที่ได้รับยกเว้นไม่ต้องนำรวมมาคำนวณ" },
    { value: "11", label: "4.(ข)(4)กำไรที่รับรู้ทางบัญชีโดยวิธีส่วนได้เสีย" },
    { value: "12", label: "4.(ข)(5)อื่นๆ (ระบุ)" },
    { value: "13", label: "5.การจ่ายเงินได้ที่ต้องหักภาษี ณ ที่จ่ายตามคำสั่งกรมสรรพากรที่ออกตาม มาตรา 3 เตรส" },
    { value: "14", label: "6.อื่นๆ (ระบุ)" }
];

const docRefTypeOptions = [ //ต้องใช้ mas_docconfig คือ Prefig
    { value: "1", label: "PR" },
    { value: "2", label: "PO" },
    { value: "3", label: "PC" },
    { value: "4", label: "PI" },
    { value: "5", label: "PV" },
];

export default function WHTAddDT({ isOpen, onClose, onSave, docNo, editItem }) {
    const authFetch = useAuthFetch();
    const [formData, setFormData] = useState({
        itemNo: 0,
        incType: 1,
        payDate: new Date().toISOString().slice(0, 10),
        payAmount: "0",
        payRate: "3",
        payTax: "0",
        payTaxDesc: "",
        jNo: "",
        docRefType: 1,
        docRefNo: "",
        docNo: docNo
    });

    useEffect(() => {
        if (isOpen) {
            if (editItem) {
                setFormData({
                    ...editItem,
                    payDate: editItem.payDate ? editItem.payDate.split("T")[0] : new Date().toISOString().slice(0, 10),
                    docNo: docNo
                });
            } else {
                setFormData({
                    itemNo: 0,
                    incType: 1,
                    payDate: new Date().toISOString().slice(0, 10),
                    payAmount: "0",
                    payRate: "3",
                    payTax: "0",
                    payTaxDesc: "",
                    jNo: "",
                    docRefType: 1,
                    docRefNo: "",
                    docNo: docNo
                });
            }
        }
    }, [isOpen, editItem, docNo]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        let newFormData = { ...formData, [id]: value };

        if (id === "payAmount" || id === "payRate") {
            const amount = parseFloat(id === "payAmount" ? value : formData.payAmount) || 0;
            const rate = parseFloat(id === "payRate" ? value : formData.payRate) || 0;
            const tax = (amount * rate) / 100;
            newFormData.payTax = tax.toFixed(2);
        }
        setFormData(newFormData);
    };

    const handleSave = async () => {
        try {
            const endpoint = editItem
                ? `${API_BASE}/WithholdingTax/EditWithholdingTaxDT`
                : `${API_BASE}/WithholdingTax/AddWithholdingTaxDT`;

            const method = editItem ? "PUT" : "POST";

            const response = await authFetch(endpoint, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Swal.fire("Success", "Detail saved.", "success");
                onSave();
            } else {
                Swal.fire("Error", "Failed to save detail.", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "An error occurred.", "error");
        }
    };

    const handleDelete = async () => {
        if (!editItem) return;
        Swal.fire({
            title: 'Delete Item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await authFetch(`${API_BASE}/WithholdingTax/DeleteWithholdingTaxDT?docNo=${docNo}&itemNo=${formData.itemNo}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        Swal.fire("Deleted", "Item deleted", "success");
                        onSave();
                    }
                } catch (err) {
                    Swal.fire("Error", "Failed to delete", "error");
                }
            }
        });
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton style={{ backgroundColor: "#f0f0f0" }}>
                <Modal.Title>{editItem ? "Edit Withholding Tax Detail" : "Add New Detail"}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px" }}>

                <div style={{ marginTop: "10px" }}>
                    <h6 style={{ color: "#666" }}>Reference (Optional)</h6>
                    <Row>
                        <Col md={6}>
                            <TextField
                                id="docRefType"
                                select
                                label="Ref Type"
                                value={formData.docRefType}
                                onChange={(e) => handleChange({ target: { id: "docRefType", value: e.target.value } })}
                                fullWidth
                                variant="standard"
                            >
                                {docRefTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Col>
                        <Col md={6}>
                            <TextField id="docRefNo" label="Ref No" value={formData.docRefNo} onChange={handleChange} fullWidth variant="standard" />
                        </Col>
                    </Row>
                </div>

                <Row className="mb-4" style={{ paddingTop: "15px", marginTop: "10px" }}>
                    <Col md={6}>
                        <TextField id="jNo" label="Job No" value={formData.jNo} onChange={handleChange} fullWidth variant="standard" />
                    </Col>
                    <Col md={6}>
                        <TextField id="payDate" label="Payment Date" type="date" value={formData.payDate} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
                    </Col>
                </Row>
                <Row className="mb-4" style={{ paddingTop: "15px", marginTop: "10px" }}>
                    <Col md={12}>
                        <TextField
                            id="incType"
                            select
                            label="Income Type (ประเภทเงินได้)"
                            value={formData.incType}
                            onChange={(e) => handleChange({ target: { id: "incType", value: e.target.value } })}
                            fullWidth
                            variant="outlined"
                        >
                            {incTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <TextField id="payTaxDesc" label="Description / Remarks" value={formData.payTaxDesc || ""} onChange={handleChange} fullWidth variant="outlined" multiline rows={2} />
                    </Col>
                </Row>
                <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                    <h6 style={{ color: "#1976d2", marginBottom: "15px" }}>Calculations</h6>
                    <Row>
                        <Col md={4}>
                            <TextField id="payAmount" label="Pay Amount" type="number" value={formData.payAmount} onChange={handleChange} fullWidth variant="outlined" style={{ backgroundColor: "white" }} />
                        </Col>
                        <Col md={4}>
                            <TextField id="payRate" label="Tax Rate (%)" type="number" value={formData.payRate} onChange={handleChange} fullWidth variant="outlined" style={{ backgroundColor: "white" }} />
                        </Col>
                        <Col md={4}>
                            <TextField id="payTax" label="Tax Amount" type="number" value={formData.payTax} onChange={handleChange} fullWidth variant="filled" InputProps={{ readOnly: true, style: { fontWeight: "bold", color: "red" } }} />
                        </Col>
                    </Row>
                </div>
                {/* ------ */}
                {/* <Row className="mb-3">
                    <Col md={12}>
                        <TextField id="payTaxDesc" label="Description / Remarks" value={formData.payTaxDesc} onChange={handleChange} fullWidth variant="outlined" multiline rows={2} />
                    </Col>
                </Row>

                <div style={{ borderTop: "1px solid #ddd", paddingTop: "15px", marginTop: "10px" }}>
                    <h6 style={{ color: "#666" }}>Reference (Optional)</h6>
                    <Row>
                        <Col md={4}>
                            <TextField id="jNo" label="Job No" value={formData.jNo} onChange={handleChange} fullWidth variant="standard" />
                        </Col>
                        <Col md={4}>
                            <TextField
                                id="docRefType"
                                select
                                label="Ref Type"
                                value={formData.docRefType}
                                onChange={(e) => handleChange({ target: { id: "docRefType", value: e.target.value } })}
                                fullWidth
                                variant="standard"
                            >
                                {docRefTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Col>
                        <Col md={4}>
                            <TextField id="docRefNo" label="Ref No" value={formData.docRefNo} onChange={handleChange} fullWidth variant="standard" />
                        </Col>
                    </Row>
                </div> */}
                {/* ---------------- */}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#f9f9f9" }}>
                {editItem && (
                    <Button variant="danger" onClick={handleDelete} style={{ marginRight: "auto" }}>
                        Delete Item
                    </Button>
                )}
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} style={{ backgroundColor: "#1976d2" }}>
                    Save Details
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
