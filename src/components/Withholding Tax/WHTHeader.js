import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPen,
    faTrash,
    faPlus,
    faFloppyDisk,
    faAnglesRight,
    faAngleRight,
    faUserTie,
    faUser,
    faFileInvoiceDollar,
    faSackDollar,
    faDatabase,
    faEllipsisVertical,
    faPrint
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Link from "@mui/material/Link";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import SupplierModal from "../Share/SupplierModal";
import CompanyProfileCheckbox from "../Share/CompanyProfileCheckbox";
import { API_BASE, DATA_BASE, REPORT_BASE } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";
import Divider from "@mui/material/Divider";
import { Card, CardContent, Grid, Typography, FormControl, InputLabel, Select, MenuItem, InputAdornment, Chip, Box } from "@mui/material";
import CustomerModal from "../Share/CustomerModal";

const WHTHeader = forwardRef(({ apiData, setApiData, currentIndex, setCurrentIndex,
    setCurrentAccDocNo, DocType }, ref) => {
    const authFetch = useAuthFetch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const docNoParam = params.get("docNo") || params.get("accDocNo");
    const [isNewMode, setIsNewMode] = useState(location.state?.isNew || false);
    const [openSupplierModal, setOpenSupplierModal] = useState(false);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [formData, setFormData] = useState({
        docNo: "",
        docDate: new Date().toISOString().slice(0, 10),
        taxNumber1: "", tName1: "", tAddress1: "", branch1: "", idCard1: "",
        taxNumber2: "", tName2: "", tAddress2: "", branch2: "", idCard2: "",
        taxNumber3: "", tName3: "", tAddress3: "", branch3: "", idCard3: "",
        seqInForm: 0,
        formType: 4, // Default to PND 1
        taxLawNo: "01", // Default value 01
        incRate: "",
        incOther: "",
        updateBy: localStorage.getItem("userName") || "",
        totalPayAmount: 0.00,
        totalPayTax: 0.00,
        soLicenseNo: "",
        soLicenseAmount: 0.00,
        soAccAmount: 0.00,
        payeeAccNo: "",
        soTaxNo: "",
        payTaxType: 1,
        payTaxOther: "",
        cancelProve: "",
        cancelReason: "",
        cancelDate: null,
        lastUpdate: new Date().toISOString(),
        teacherAmt: 0.00,
        isCSV: 0,
        // docStatus: 0
    });

    // Fetch Data Logic
    const fetchDataFromApi = async (specificDocNo = null) => {
        if (isNewMode && !specificDocNo) return;
        try {
            const targetDocNo = specificDocNo || docNoParam;
            console.log('targetDocNo fetching', targetDocNo);

            const apiUrl = `${API_BASE}/AccWHTax/GetWHTaxHD`;
            const response = await authFetch(apiUrl);
            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Sort descending by docNo
                data.sort((a, b) => b.docNo.localeCompare(a.docNo));
                setApiData(data);
                console.log('APIDATA', data);

                let safeIndex = 0;
                if (targetDocNo) {
                    const foundIndex = data.findIndex(item => item.docNo === targetDocNo);
                    if (foundIndex !== -1) {
                        safeIndex = foundIndex;
                    }
                } else if (currentIndex >= 0 && currentIndex < data.length) {
                    safeIndex = currentIndex;
                }

                setCurrentIndex(safeIndex);
                mapDataToState(data[safeIndex]);
            } else {
                handleNew();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const mapDataToState = (data) => {
        setFormData({
            ...formData,
            ...data,
            docDate: data.docDate ? data.docDate.split("T")[0] : "",
            cancelDate: data.cancelDate ? data.cancelDate.split("T")[0] : "",
        });
        setCurrentAccDocNo(data.docNo);
    };

    useEffect(() => {
        if (!isNewMode) fetchDataFromApi();
        else handleNew();
    }, [isNewMode]);

    useEffect(() => {
        if (apiData && apiData.length > 0 && apiData[currentIndex]) {
            mapDataToState(apiData[currentIndex]);
        }
    }, [currentIndex, apiData]);

    const handleInputChange = (e) => {
        const { id, value, name } = e.target;
        // Handle Select which uses name instead of id slightly differently usually
        const fieldId = id || name;
        setFormData({ ...formData, [fieldId]: value });
    };

    const handleSupplierSelect = (supplier) => {
        setFormData({
            ...formData,
            taxNumber1: supplier.taxNumber,
            branch1: supplier.taxBranch,
            tName1: supplier.supplierName,
            tAddress1: supplier.address1,
        });
        setOpenSupplierModal(false);
    };

    const handleCustomerSelect = (customer) => {
        setFormData({
            ...formData,
            taxNumber3: customer.taxNumber,
            branch3: customer.taxBranch,
            tName3: customer.customerName,
            tAddress3: customer.address1,
        });

        setOpenCustomerModal(false);
    };

    const handleProfileLoadedTax1 = (profileData) => {
        if (profileData) {
            setFormData({
                ...formData,
                taxNumber1: profileData.taxNumber,
                branch1: profileData.branch,
                tName1: profileData.name,
                tAddress1: profileData.address,
            });
        } else {
            setFormData({
                ...formData,
                taxNumber1: "",
                branch1: "",
                tName1: "",
                tAddress1: "",
            });
        }
    };

    const handleProfileLoadedTax2 = (profileData) => {
        if (profileData) {
            setFormData({
                ...formData,
                taxNumber2: profileData.taxNumber,
                branch2: profileData.branch,
                tName2: profileData.name,
                tAddress2: profileData.address,
            });
        } else {
            // Clear fields
            setFormData({
                ...formData,
                taxNumber2: "",
                branch2: "",
                tName2: "",
                tAddress2: "",
            });
        }
    };

    const handleProfileLoadedTax3 = (profileData) => {
        if (profileData) {
            setFormData({
                ...formData,
                taxNumber3: profileData.taxNumber,
                branch3: profileData.branch,
                tName3: profileData.name,
                tAddress3: profileData.address,
            });
        } else {
            setFormData({
                ...formData,
                taxNumber3: "",
                branch3: "",
                tName3: "",
                tAddress3: "",
            });
        }
    };

    const handleNew = () => {
        setFormData({
            ...formData,
            docNo: "",
            docDate: new Date().toISOString().slice(0, 10),
            taxNumber1: "", tName1: "", tAddress1: "", branch1: "", idCard1: "",
            taxNumber2: "", tName2: "", tAddress2: "", branch2: "", idCard2: "",
            taxNumber3: "", tName3: "", tAddress3: "", branch3: "", idCard3: "",
            seqInForm: 0,
            formType: 4, // Default to PND 1
            taxLawNo: "01", // Default value 01
            incRate: "",
            incOther: "",
            updateBy: localStorage.getItem("userName") || "",
            totalPayAmount: 0.00,
            totalPayTax: 0.00,
            soLicenseNo: "",
            soLicenseAmount: 0.00,
            soAccAmount: 0.00,
            payeeAccNo: "",
            soTaxNo: "",
            payTaxType: 1,
            payTaxOther: "",
            cancelProve: "",
            cancelReason: "",
            cancelDate: null,
            lastUpdate: new Date().toISOString(),
            teacherAmt: 0.00,
            isCSV: 0,
        });
    };
    const handleDataTest = () => {
        setFormData({
            ...formData,
            docNo: "WT-2506-0002",
            docDate: new Date().toISOString().slice(0, 10),
            taxNumber1: "19953246780", tName1: "สยามแม็คโคร", tAddress1: "1468 ถนนพัฒนาการ แขวงพัฒนาการ เขตสวนหลวง กรุงเทพฯ 10250", branch1: "00000", idCard1: "",
            taxNumber2: "0105544112818", tName2: "บริษัทตะวันเทคโนโลยี จำกัด", tAddress2: "507 บางนา-ตราด 56 บางนาใต้บางนา กรุงเทพมหานคร 10260", branch2: "00000", idCard2: "",
            taxNumber3: "1234567891234", tName3: "Company COSCO shipping line (Thailand)", tAddress3: "319 อาคารจัตุรัสจามจุรี ชั้น 25 ยูนิต 1-8 ถนนพญาไท แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330 ", branch3: "00000", idCard3: "",
            seqInForm: 0,
            formType: 1, // Default to PND 1
            taxLawNo: "01", // Default value 1
            incRate: "",
            incOther: "",
            updateBy: localStorage.getItem("userName") || "",
            totalPayAmount: 0.00,
            totalPayTax: 0.00,
            soLicenseNo: "",
            soLicenseAmount: 0.00,
            soAccAmount: 0.00,
            payeeAccNo: "",
            soTaxNo: "",
            payTaxType: 4,
            payTaxOther: "",
            cancelProve: "",
            cancelReason: "",
            cancelDate: null,
            lastUpdate: new Date().toISOString(),
            teacherAmt: 0.00,
            isCSV: 0,
            // docStatus: 0
        });
    };
    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                // seqInForm: Number(formData.seqInForm) || 0,
                // incRate: Number(formData.incRate) || 0,
                // totalPayAmount: Number(formData.totalPayAmount) || 0,
                // totalPayTax: Number(formData.totalPayTax) || 0,
                // soLicenseAmount: Number(formData.soLicenseAmount) || 0,
                // soAccAmount: Number(formData.soAccAmount) || 0,
                // teacherAmt: Number(formData.teacherAmt) || 0,
                // formType: Number(formData.formType) || 0,
                // payTaxType: Number(formData.payTaxType) || 0,
                // isCSV: Number(formData.isCSV) || 0,
                // cancelDate: formData.cancelDate === "" ? null : formData.cancelDate
                docDate: formData.docDate || new Date().toISOString(),
                seqInForm: 0,
                incRate: 0,
                totalPayAmount: 0,
                totalPayTax: 0,
                soLicenseAmount: 0,
                soAccAmount: 0,
                teacherAmt: 0,
                formType: formData.formType || 4,
                payTaxType: 1,
                isCSV: 0,
                cancelDate: null
            };
            // const response = await authFetch(`${API_BASE}/AccWHTax/SetWHTaxHD?cagetory=${DocType}`, {
            const response = await authFetch(`${API_BASE}/AccWHTax/SetWHTaxHD?category=${DocType}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },//?category=wh3
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const responseData = await response.json().catch(() => null);
                const docNo = responseData?.accDocNo || '';
                console.log('response data:', responseData);
                Swal.fire("Saved", `Data saved successfully.\nเลขเอกสาร: ${docNo}`, "success");
                setIsNewMode(false);
                setCurrentAccDocNo(docNo);
                navigate(`?docNo=${docNo}`, { replace: true });
                fetchDataFromApi(docNo);
            } else {
                const errorData = await response.json().catch(() => null);
                let errorMsg = "Failed to save data";
                if (errorData && errorData.errors) {
                    errorMsg = JSON.stringify(errorData.errors);
                } else if (errorData && errorData.title) {
                    errorMsg = errorData.title;
                } else if (typeof errorData === 'string') {
                    errorMsg = errorData;
                }
                console.error("SetWHTaxHD Error:", errorData);
                console.error("Payload sent:", payload);
                Swal.fire("Error (400)", errorMsg, "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "An error occurred", "error");
        }
    };

    useImperativeHandle(ref, () => ({
        updateTotalsAndSave: async (totalAmount, totalTax) => {
            setFormData(prev => {
                const updated = {
                    ...prev,
                    totalPayAmount: totalAmount,
                    totalPayTax: totalTax
                };
                handleUpdateWithData(updated, false);
                return updated;
            });
        }
    }));

    const handleUpdateWithData = async (dataToSave, showAlert = true) => {
        try {
            const payload = {
                ...dataToSave,
                seqInForm: Number(dataToSave.seqInForm) || 0,
                incRate: Number(dataToSave.incRate) || 0,
                totalPayAmount: Number(dataToSave.totalPayAmount) || 0,
                totalPayTax: Number(dataToSave.totalPayTax) || 0,
                soLicenseAmount: Number(dataToSave.soLicenseAmount) || 0,
                soAccAmount: Number(dataToSave.soAccAmount) || 0,
                teacherAmt: Number(dataToSave.teacherAmt) || 0,
                formType: Number(dataToSave.formType) || 0,
                payTaxType: Number(dataToSave.payTaxType) || 1,
                isCSV: Number(dataToSave.isCSV) || 0,
                cancelDate: dataToSave.cancelDate === "" ? null : dataToSave.cancelDate
            };
            const response = await authFetch(`${API_BASE}/AccWHTax/EditWHTaxHD`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                if (showAlert) Swal.fire("Updated", "Data updated successfully", "success");
                fetchDataFromApi(dataToSave.docNo);
            } else {
                const errorData = await response.json().catch(() => null);
                let errorMsg = "Failed to update data";
                if (errorData && errorData.errors) {
                    errorMsg = JSON.stringify(errorData.errors);
                } else if (errorData && errorData.title) {
                    errorMsg = errorData.title;
                }
                console.error("EditWHTaxHD Error:", errorData);
                console.error("Payload sent:", payload);
                if (showAlert) Swal.fire("Error (400)", errorMsg, "error");
            }
        } catch (error) {
            console.error(error);
            if (showAlert) Swal.fire("Error", "An error occurred", "error");
        }
    };

    const handleUpdate = async () => {
        await handleUpdateWithData(formData, true);
    };

    const handleDelete = async () => {
        Swal.fire({
            title: 'Cancel Document',
            text: "Please enter the reason for cancel:",
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!'
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const cancelReason = result.value;
                const cancelProve = localStorage.getItem("userName") || "";
                const cancelDate = new Date().toISOString();

                try {
                    const deletePayload = {
                        ...formData,
                        seqInForm: Number(formData.seqInForm) || 0,
                        incRate: Number(formData.incRate) || 0,
                        totalPayAmount: Number(formData.totalPayAmount) || 0,
                        totalPayTax: Number(formData.totalPayTax) || 0,
                        soLicenseAmount: Number(formData.soLicenseAmount) || 0,
                        soAccAmount: Number(formData.soAccAmount) || 0,
                        teacherAmt: Number(formData.teacherAmt) || 0,
                        formType: Number(formData.formType) || 0,
                        payTaxType: Number(formData.payTaxType) || 0,
                        isCSV: Number(formData.isCSV) || 0,
                        cancelReason,
                        cancelProve,
                        cancelDate
                    };

                    const response = await authFetch(`${API_BASE}/AccWHTax/EditWHTaxHD`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(deletePayload)
                    });
                    if (response.ok) {
                        Swal.fire("Deleted/Cancelled", "Data deleted/cancelled successfully", "success");
                        fetchDataFromApi();
                    } else {
                        const errorData = await response.json().catch(() => null);
                        let errorMsg = "Failed to delete data";
                        if (errorData && errorData.errors) {
                            errorMsg = JSON.stringify(errorData.errors);
                        } else if (errorData && errorData.title) {
                            errorMsg = errorData.title;
                        } else if (typeof errorData === 'string') {
                            errorMsg = errorData;
                        }
                        console.error("EditWHTaxHD (Cancel) Error:", errorData);
                        Swal.fire("Error", errorMsg, "error");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire("Error", "An error occurred", "error");
                }
            }
        })
    };

    const handleDelete1 = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await authFetch(`${API_BASE}/AccWHTax/DeleteWHTaxHD/${formData.docNo}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        Swal.fire("Deleted", "Data deleted successfully", "success");
                        fetchDataFromApi();
                    } else {
                        Swal.fire("Error", "Failed to delete data", "error");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire("Error", "An error occurred", "error");
                }
            }
        })
    };
    const isCancelled = !!formData.cancelProve;
    const handlePrint = async () => {
        const DocType = "WHTax";
        const DocNo = formData.docNo;
        console.log("AccDocNo:", DocNo);
        const printUrl = `${REPORT_BASE}/form?Form=Form${DocType}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${DocNo}`;
        window.open(printUrl, "_blank");
    };
    const buttonActions = [
        { icon: <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} />, name: "Add", onClick: handleNew },
        { icon: <FontAwesomeIcon icon={faFloppyDisk} style={{ color: isCancelled ? "gray" : "#115c02" }} />, name: "Save Data", onClick: handleSave, disabled: isCancelled },
        { icon: <FontAwesomeIcon icon={faPrint} style={{ color: isCancelled ? "gray" : "blue" }} />, name: "Print Data", onClick: handlePrint, disabled: isCancelled },
        { icon: <FontAwesomeIcon icon={faPen} style={{ color: isCancelled ? "gray" : "#72047b" }} />, name: "Update Data", onClick: handleUpdate, disabled: isCancelled },
        { icon: <FontAwesomeIcon icon={faTrash} style={{ color: isCancelled ? "gray" : "#ae0000" }} />, name: "Cancel Data", onClick: handleDelete, disabled: isCancelled },
        // { icon: <FontAwesomeIcon icon={faDatabase} style={{ color: isCancelled ? "gray" : "#0d93b4ff" }} />, name: "Test Data", onClick: handleDataTest, disabled: isCancelled }
    ];

    const buttonActionsLNPF = [
        { icon: <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} rotation={180} />, name: "ToLast", onClick: () => setCurrentIndex(apiData.length - 1) },
        { icon: <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} rotation={180} />, name: "ToNext", onClick: () => setCurrentIndex(prev => Math.min(prev + 1, apiData.length - 1)) },
        { icon: <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} />, name: "ToPrevious", onClick: () => setCurrentIndex(prev => Math.max(prev - 1, 0)) },
        { icon: <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} />, name: "ToFirst", onClick: () => setCurrentIndex(0) },
    ];

    // Helper for Section Headers
    const SectionHeader = ({ icon, title, color }) => (
        <Typography variant="h6" style={{ color: color || "#333", display: "flex", alignItems: "center", marginBottom: "15px", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={icon} style={{ marginRight: "10px" }} /> {title}
        </Typography>
    );

    return (
        <div style={{ padding: "20px 5%" }}>
            {/* Actions Toolbar */}
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: "20px" }}>
                {/* <Grid item xs={12} md={6}>
                    <Typography variant="h5" style={{ color: "#1976d2", fontWeight: "bold" }}> Withholding Tax Form</Typography>
                </Grid> */}
                <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <CircularButtonGroup actions={buttonActions} />

                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* 1. Document Info */}
                <Grid item xs={12}>
                    <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #1976d2" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start" } }}>
                                <SectionHeader icon={faFileInvoiceDollar} title="Document Information" color="#1976d2" />
                                {formData.cancelProve && (
                                    <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "flex-end" }, mb: 2 }}>
                                        <Chip size="small" label={`Cancel By: ${formData.cancelProve}`} style={{ backgroundColor: "#ffebee", color: "#c62828", fontWeight: "bold" }} />
                                        {formData.cancelDate && <Chip size="small" label={`Date: ${formData.cancelDate}`} style={{ backgroundColor: "#ffebee", color: "#c62828" }} />}
                                        {formData.cancelReason && <Chip size="small" label={`Reason: ${formData.cancelReason}`} style={{ backgroundColor: "#ffebee", color: "#c62828" }} />}
                                    </Box>
                                )}
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField id="docNo" label="Document No." value={formData.docNo || ""} onChange={handleInputChange} variant="outlined" size="small"
                                        InputProps={{ readOnly: true, style: { backgroundColor: "#cdcdd1", } }} fullWidth />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField id="docDate" label="Document Date" type="date" value={formData.docDate} onChange={handleInputChange} variant="outlined" size="small" fullWidth InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    {/* <TextField id="seqInForm" label="Book No./Seq No." value={formData.seqInForm} onChange={handleInputChange} variant="outlined" size="small" fullWidth placeholder="เล่มที่/เลขที่" /> */}
                                    <TextField id="seqInForm" label="Number" type="number" value={formData.seqInForm} onChange={handleInputChange} variant="outlined" size="small" fullWidth placeholder="เล่มที่/เลขที่" />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="formType-label">Type Of</InputLabel> {/*สำหรับยื่นแบบภาษี*/}
                                        <Select labelId="formType-label" id="formType" name="formType" value={formData.formType} label="Form Type" onChange={handleInputChange}>
                                            <MenuItem value={1}>ภ.ง.ด. 1 (P.N.D. 1)</MenuItem>
                                            <MenuItem value={2}>ภ.ง.ด. 1ก (P.N.D. 1 Kor)</MenuItem>
                                            <MenuItem value={3}>ภ.ง.ด. 2 (P.N.D. 2)</MenuItem>
                                            <MenuItem value={4}>ภ.ง.ด. 3 (P.N.D. 3)</MenuItem>
                                            <MenuItem value={5}>ภ.ง.ด. 2ก (P.N.D. 2 Kor)</MenuItem>
                                            <MenuItem value={6}>ภ.ง.ด. 3ก (P.N.D. 3 Kor)</MenuItem>
                                            <MenuItem value={7}>ภ.ง.ด. 53 (P.N.D. 53)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="taxLawNo-label">Tax Code</InputLabel> {/*(หักภาษีตามมาตรา)*/}
                                        {/* <Select labelId="taxLawNo-label" id="taxLawNo" name="taxLawNo" value={formData.taxLawNo} onChange={handleInputChange}> */}
                                        <Select labelId="taxLawNo-label" id="taxLawNo" name="taxLawNo" value={formData.taxLawNo} label="Tax Code" onChange={handleInputChange}>
                                            <MenuItem value="01">3 เตรส</MenuItem>
                                            <MenuItem value="02">65 จัตวา</MenuItem>
                                            <MenuItem value="03">69 ทวิ</MenuItem>
                                            <MenuItem value="04">48 ทวิ</MenuItem>
                                            <MenuItem value="05">50 ทวิ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. Payer (User Tie) */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #2e7d32" }}>
                        <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <SectionHeader icon={faUserTie} title="Tax Issuer" color="#2e7d32" /> {/* ผู้มีหน้าที่หัก ณ ที่จ่าย */}
                                <CompanyProfileCheckbox onProfileLoaded={handleProfileLoadedTax1} label="Use Profile" />
                            </div>
                            <Grid container spacing={2}>
                                <Grid item xs={8} style={{ position: "relative" }}>
                                    <TextField
                                        id="taxNumber1"
                                        label="Tax ID"
                                        value={formData.taxNumber1 || ''}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisVertical}
                                                        size="1x"
                                                        onClick={() => setOpenSupplierModal(true)}
                                                        style={{
                                                            cursor: "pointer"//, color: "#1976d2"
                                                        }}
                                                    />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField id="branch1" label="Branch" value={formData.branch1 || ''} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tName1" label="Name" value={formData.tName1 || ''} onChange={handleInputChange} variant="standard" fullWidth //multiline rows={2} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tAddress1" label="Address" value={formData.tAddress1} onChange={handleInputChange} variant="standard" fullWidth multiline rows={2} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="idCard1" label="ID Card (บุคคลธรรมดา)" value={formData.idCard1} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Payee (User) */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #d84315" }}>
                        <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <SectionHeader icon={faUser} title="Tax Agent" color="#d84315" /> {/* กระทำการแทนโดย/ตัวกลาง */}

                                <CompanyProfileCheckbox onProfileLoaded={handleProfileLoadedTax2} label="Use Profile" />
                            </div>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <TextField id="taxNumber2" label="Tax ID" value={formData.taxNumber2} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField id="branch2" label="Branch" value={formData.branch2} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tName2" label="Name" value={formData.tName2} onChange={handleInputChange} variant="standard" fullWidth // multiline rows={2} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tAddress2" label="Address" value={formData.tAddress2} onChange={handleInputChange} variant="standard" fullWidth multiline rows={2} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="idCard2" label="ID Card (บุคคลธรรมดา)" value={formData.idCard2} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Payee (Fields 3 - User requested) */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #6a1b9a" }}>
                        <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <SectionHeader icon={faUser} title="Tax Payer" color="#6a1b9a" /> {/* ผู้ถูกหักภาษี ณ ที่จ่าย */}
                                <CompanyProfileCheckbox onProfileLoaded={handleProfileLoadedTax3} label="Use Profile" />
                            </div>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {/* <TextField id="taxNumber3" label="Tax ID" value={formData.taxNumber3} onChange={handleInputChange} variant="standard" fullWidth /> */}
                                    <TextField
                                        id="taxNumber3"
                                        label="Tax ID"
                                        value={formData.taxNumber3 || ''}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisVertical}
                                                        size="1x"
                                                        onClick={() => setOpenCustomerModal(true)}
                                                        style={{
                                                            cursor: "pointer"//, color: "#1976d2" 
                                                        }}
                                                    />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField id="branch3" label="Branch" value={formData.branch3} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tName3" label="Name" value={formData.tName3} onChange={handleInputChange} variant="standard" fullWidth  // multiline rows={2} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="tAddress3" label="Address" value={formData.tAddress3} onChange={handleInputChange} variant="standard" fullWidth multiline rows={2} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="idCard3" label="ID Card (บุคคลธรรมดา)" value={formData.idCard3} onChange={handleInputChange} variant="standard" fullWidth /> {/*เลขประจำตัวประชาชน*/}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 4. Financials & Condition */}
                <Grid item xs={12}>
                    <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #f9a825" }}>
                        <CardContent>
                            <SectionHeader icon={faSackDollar} title="Tax Conditions & Totals" color="#f9a825" />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="payTaxType-label">Tex Condition</InputLabel> {/*รูปแบบการหักภาษี*/}
                                        <Select labelId="payTaxType-label" id="payTaxType" name="payTaxType" value={formData.payTaxType} onChange={handleInputChange}>
                                            <MenuItem value={1}>1. หัก ณ ที่จ่าย</MenuItem>
                                            <MenuItem value={2}>2. ออกให้ตลอดไป</MenuItem>
                                            <MenuItem value={3}>3. ออกให้ครั้งเดียว</MenuItem>
                                            <MenuItem value={4}>4. อื่นๆ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField id="payTaxOther" label="Condition Note" value={formData.payTaxOther} onChange={handleInputChange} variant="standard" fullWidth disabled={formData.payTaxType !== 4} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField id="incRate" label="Control Rate" value={formData.incRate} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField id="incOther" label="Description" value={formData.incOther} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField id="soLicenseNo" label="Social Security No" value={formData.soLicenseNo} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField id="soTaxNo" label="Social Payer No" value={formData.soTaxNo} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField id="soLicenseAmount" label="Social Amount" value={formData.soLicenseAmount} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField id="payeeAccNo" label="Provident Payer" value={formData.payeeAccNo} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField id="soAccAmount" label="Provident Amt" value={formData.soAccAmount} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField id="teacherAmt" label="Teacher Amt" value={formData.teacherAmt} onChange={handleInputChange} variant="standard" fullWidth />
                                </Grid>

                                <Grid item xs={12}><Divider style={{ margin: "10px 0" }} /></Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="totalPayAmount"
                                        label="Total Amount"
                                        value={formData.totalPayAmount}
                                        // onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                                            style: { fontSize: "1.2rem", color: "green", fontWeight: "bold" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="totalPayTax"
                                        label="Total Tax"
                                        value={formData.totalPayTax}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                                            style: { fontSize: "1.2rem", color: "red", fontWeight: "bold" }
                                        }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="taxLawNo-label">Tax Law (หักภาษีตามมาตรา)</InputLabel>
                                        <Select labelId="taxLawNo-label" id="taxLawNo" name="taxLawNo" value={formData.taxLawNo} onChange={handleInputChange}>
                                            <MenuItem value="1">3 เตรส</MenuItem>
                                            <MenuItem value="2">65 จัตวา</MenuItem>
                                            <MenuItem value="3">69 ทวิ</MenuItem>
                                            <MenuItem value="4">48 ทวิ</MenuItem>
                                            <MenuItem value="5">50 ทวิ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} style={{ display: "grid", marginTop: "10px", justifyContent: "flex-end" }}>
                    <CircularButtonGroup actions={buttonActionsLNPF} />
                </Grid>
            </Grid>
            <SupplierModal
                open={openSupplierModal}
                onClose={() => setOpenSupplierModal(false)}
                onSelect={handleSupplierSelect}
            />
            <CustomerModal
                open={openCustomerModal}
                onClose={() => setOpenCustomerModal(false)}
                onSelect={handleCustomerSelect}
            />
        </div>
    );
});

export default WHTHeader;
