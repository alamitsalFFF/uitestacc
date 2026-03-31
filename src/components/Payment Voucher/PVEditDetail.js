import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  faBoxOpen,
  faCircleMinus,
  faCirclePlus,
  faRectangleList,
  faPen,
  faTrash,
  faFloppyDisk,
  faPrint,
  faCircleArrowUp,
  faCircleArrowLeft,
  faEllipsisVertical,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { setAddProducts, setAccDocNo } from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { formatNumber, formatInteger } from "../purchase/formatNumber";
import { toNumber } from "lodash";
import axios from "../../components/Auth/axiosConfig";
import { useAuthFetch } from "../../components/Auth/fetchConfig";
import {
  Modal,
  List,
  // ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { API_BASE, URL } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import MoreInfoDT from "../AdditionData/AdditionDataTD/MoreInfoDT";

function PVEditDetail({ open, onClose, entryId: entryIdProp, seq: seqProp, journalNo: journalNoProp, onSaved }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const authFetch = useAuthFetch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // determine inputs: props take precedence, fallback to URL/state (backward compatible)
  const entryIdFromParams = entryIdProp ?? searchParams.get("entryID");
  const seqFromParams = seqProp ?? searchParams.get("seq");
  const [journalNoFromState, setJournalNoFromState] = useState(journalNoProp ?? location.state?.journalNo);
  const DocType = "PV";
  useEffect(() => {
    // keep updating if props/location change
    setJournalNoFromState(journalNoProp ?? location.state?.journalNo);
  }, [journalNoProp, location.state]);
  // --- State for MoreInfoModal ---
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const handleOpenMoreInfoModal = () => setIsMoreInfoModalOpen(true);
  const handleCloseMoreInfoModal = () => setIsMoreInfoModalOpen(false);
  //----------------------------------
  const [rateVatValue, setRateVatValue] = useState([]);
  const [rateWhtValue, setRateWhtValue] = useState([]);
  const [vatTypeValue, setVatTypeValue] = useState([]);
  const [productSizeUnitValue, setProductSizeUnitValue] = useState([]);
  const [adddatadetail, setdAddataDetail] = useState({
    accCode: "",
    accDesc: "",
    accName: "",
    credit: 0,
    debit: 0,
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setdAddataDetail({ ...adddatadetail, [id]: value });
  };

  const fetchData = async (entryId, seq) => {
    try {
      const response = await authFetch(`${API_BASE}/Journal/GetJournalDT?entryId=${entryId}&seq=${seq}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    // load when open (modal) or when mounted (page) and entryId/seq available
    const loadData = async () => {
      if (!entryIdFromParams || !seqFromParams) return;
      try {
        const data = await fetchData(entryIdFromParams, seqFromParams);
        setdAddataDetail({
          accCode: data[0].accCode || "",
          accDesc: data[0].accDesc || "",
          accName: data[0].accName || "",
          credit: (data[0].credit ?? 0).toString(),
          debit: (data[0].debit ?? 0).toString(),
          seq: data[0].seq || 1,
        });
      } catch (error) {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการโหลดข้อมูล", text: error.message || "โปรดลองใหม่อีกครั้ง" });
      }
    };
    loadData();
  }, [entryIdFromParams, seqFromParams, open]);

  const saveDataToAPI = async (data) => {
    try {
      const response = await authFetch(`${API_BASE}/Journal/EditJournalDT`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const text = await response.text();
        return { message: text };
      }
    } catch (error) {
      console.error("Error saving data to API:", error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!adddatadetail.accCode || !adddatadetail.accName) {
      Swal.fire({ icon: "error", title: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      return;
    }

    const updatedProduct = {
      entryId: entryIdFromParams,
      seq: parseInt(seqFromParams),
      accCode: adddatadetail.accCode,
      accDesc: adddatadetail.accDesc,
      accName: adddatadetail.accName,
      credit: parseFloat(adddatadetail.credit),
      debit: parseFloat(adddatadetail.debit),
    };

    try {
      const response = await saveDataToAPI(updatedProduct);
      if (response && response.message === "JournalDT datail updated.") {
        Swal.fire({ icon: "success", title: `แก้ไข ${adddatadetail.accName} สำเร็จ`, showConfirmButton: false, timer: 1500 });
        if (onSaved) {
          onSaved(true);
        } else {
          navigate(`${URL}Accordion${DocType}?journalNo=${journalNoFromState}`);
        }
      } else {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", text: "โปรดลองใหม่อีกครั้ง" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", text: error.message || "โปรดลองใหม่อีกครั้ง" });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await authFetch(`${API_BASE}/Journal/DeleteJournalDT/${entryIdFromParams}?seq=${seqFromParams}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      Swal.fire({ icon: "success", title: `ลบ ${adddatadetail.accName} สำเร็จ`, showConfirmButton: false, timer: 1500 });
      if (onSaved) onSaved(true);
      else navigate(`${URL}Accordion${DocType}?journalNo=${journalNoFromState}`);
    } catch (error) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการลบข้อมูล", text: error.message || "โปรดลองใหม่อีกครั้ง" });
    }
  };

  const handleGoBack = () => {
    if (onClose) onClose();
    else navigate(`${URL}Accordion${DocType}?journalNo=${journalNoFromState}`);
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const qtyRef = useRef(null);
  const currencyRef = useRef(null);
  const exchangeRateRef = useRef(null);
  const modalContentRef = useRef(null);

  const [selectedDocConfigID, setSelectedDocConfigID] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedEName, setSelectedEName] = useState("");

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig`;
        const response = await authFetch(categoryApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (Array.isArray(data)) {
          setCategoryOptions(
            data.map((item) => ({ value: item.category, label: item.eName, docConfigID: item.docConfigID }))
          );
        } else {
          console.error("Category API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCategoryOptions();
  }, []);

  useEffect(() => {
    if (DocType && categoryOptions.length > 0) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === DocType
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
        setSelectedDocConfigID(matchedOption.docConfigID);
      } else {
        setSelectedEName("");
      }
    } else {
      setSelectedEName("");
    }
  }, [DocType, categoryOptions]);

  useEffect(() => {
    // lock body scroll when modal open
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handlePriceKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // ป้องกันการ submit form
      qtyRef.current.focus(); // โฟกัสไปที่ qty
    }
  };
  const handleQtyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      currencyRef.current.focus();
    }
  };

  const handleCurrencyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      exchangeRateRef.current.focus();
    }
  };
  const [currency, setCurrency] = React.useState("THB");

  const handleChangecurr = (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    if (selectedCurrency === "THB") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: "1",
        currency: selectedCurrency,
      });
    } else if (selectedCurrency === "USD") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: adddatadetail.exchangeRate,
        currency: selectedCurrency,
      });
    }
  };

  // ---------------------
  const [accCodeOptions, setAccCodeOptions] = useState([]); // state สำหรับข้อมูลจาก API Customer
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchAccCodeOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccCode/GetAccCode`
        );
        setAccCodeOptions(response.data); // อัปเดต state AccCode
      } catch (error) {
        console.error("Error fetching AccCode options:", error);
      }
    };
    fetchAccCodeOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAccCodeSelect = (accCode) => {
    const selectedAccCode = accCodeOptions.find(
      (acccode) => acccode.accCode === accCode
    );

    if (selectedAccCode) {
      setdAddataDetail({
        ...adddatadetail,
        accCode: selectedAccCode.accCode,
        accName: selectedAccCode.accName,
      });
    }

    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accCodeOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  const buttonActions = [
    // ...(docStatus === 0
    //   ? [
    {
      icon: (
        <FontAwesomeIcon
          icon={faPen}
          style={{ color: "#72047b" }}
          size="1x"
        />
      ),
      name: "Update",
      onClick: handleUpdate,
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color: "#ae0000" }}
          size="1x"
        />
      ),
      name: "Cancel",
      onClick: handleDelete,
    },
    // ]
    // : [])
    ,
    {
      icon: (
        <FontAwesomeIcon icon={faInfo} style={{ color: "#6c757d" }} size="1x" />
      ),
      name: "More Info",
      onClick: handleOpenMoreInfoModal,
    },
  ];

  const Content = (
    <div className="row"
      style={{ padding: "5%", paddingTop: "1px", position: "relative" }}
    >
      <h4 style={{
        textAlign: "center",
        textDecorationLine: "underline",
        paddingTop: "20px",
      }}>Edit DocNo:{journalNoFromState} Item:{seqProp} </h4>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActions} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          textAlign: "start",
          justifyContent: "start",
          paddingTop: "15px",
        }}>
          <TextField
            id="accCode"
            label="AccCode"
            value={adddatadetail.accCode}
            type="text"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
            inputRef={exchangeRateRef}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FontAwesomeIcon icon={faEllipsisVertical} size="lg" style={{ cursor: "pointer" }} onClick={() => setOpenModal(true)} />
          <div style={{ paddingTop: "15px" }}>
            <TextField
              id="accName"
              label="AccName"
              value={adddatadetail.accName}
              type="text"
              variant="standard"
              fullWidth
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <TextField
            id="debit"
            label="Debit"
            value={adddatadetail.debit}
            type="number"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
            onKeyDown={handlePriceKeyDown}
          // InputProps={{ readOnly: true }} //ปิดตรงนี้ถ้าต้องการให้แก้ไขได้
          />
        </div>

        <div>
          <TextField
            id="credit"
            label="Credit"
            value={adddatadetail.credit}
            type="number"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
            onKeyDown={handleQtyKeyDown}
          // InputProps={{ readOnly: true }} //ปิดตรงนี้ถ้าต้องการให้แก้ไขได้
          />
        </div>
      </div>
      <div style={{ padding: 10 }}></div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        // BackdropProps={{ style: { zIndex: 1350 } }} // สูงกว่า MUI dialog backdrop
        style={{ zIndex: 1351 }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "16px",
            boxShadow: 24,
          }}
        >
          <List>
            <h4 style={{ textAlign: "center" }}>Select AccName</h4>
            <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
            {getPaginatedData().map((acccode) => (
              <ListItem key={acccode.accCode} disablePadding>
                <ListItemButton onClick={() => handleAccCodeSelect(acccode.accCode)}>
                  <ListItemText primary={acccode.accCode} />
                  <span style={{ marginLeft: 12 }}>{acccode.accName}</span>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <Stack spacing={2}>
              <Pagination count={Math.ceil(accCodeOptions.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </div>
      </Modal>

      {isMoreInfoModalOpen && (
        <MoreInfoDT
          open={isMoreInfoModalOpen}
          handleClose={handleCloseMoreInfoModal}
          accDocNo={journalNoFromState}
          accItemNo={seqProp}
          docConfigID={selectedDocConfigID}
        />
      )}
    </div>

  );

  if (open !== undefined) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1100, // ลดลงให้ต่ำกว่า MUI modal (ค่าเริ่มต้น ~1300)
        }}
        onClick={onClose}
      >
        <div
          ref={modalContentRef}
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "30px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            position: "relative",
            width: "90%",
            maxWidth: "600px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ถ้าต้องการวาง DocConfig ให้เพิ่มที่นี่ เช่น:
               <DocConfig accDocType={accDocType} onDocConfigFetched={handleDocConfigFetched} />
          */}
          {Content}
        </div>
      </div>
    );
  }
  return Content;
}

export default PVEditDetail;
