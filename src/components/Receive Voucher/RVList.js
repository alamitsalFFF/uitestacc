import React, { useState, useEffect, useCallback } from "react";
import axios from "../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
  faCalendarDays,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../purchase/SearchComponen";
import Status from "../purchase/Status";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName,
} from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { API_VIEW_RESULT, URL } from "../api/url";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import ButtonAction from "../DataFilters/ButtonAction";
import SearchModal from "../DataFilters/SearchModal";
import DateFilterModal from "../DataFilters/DateFilterModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import DocStatus from "../DataFilters/DocStatus";
import DriveImagePreview from "../Delivery/DraftData/Preview";
import Modal from '@mui/material/Modal';
import DocStatusPoint from "../DataFilters/DocStatusPoint";
import '../DataFilters/ConfigStatus.css';
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import DocConfigHeader from "../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../hooks/useDocConfiguration";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function RVHDList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accDocType = "RV";
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(
    dayjs().startOf("month").toDate()
  ); // วันที่ 1 ของเดือนปัจจุบัน
  const [filterEndDate, setFilterEndDate] = useState(
    dayjs().endOf("month").toDate()
  );
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);

  const { categoryOptions, categoryOptionsThai } = useDocConfiguration(accDocType);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");
    console.log("Fetching data from date:", dateFrom);
    console.log("filterEndDate:", dateTo);

    const vRV_All = {
      viewName: "vRV_All",
      parameters: [
        { field: "EntryDate", UseOperator: "BETWEEN", From: dateFrom, To: dateTo },
      ],
      results: [
        { sourceField: "EntryId" },
        { sourceField: "JournalNo" },
        { sourceField: "EntryDate" },
        { sourceField: "EffectiveDate" },
        { sourceField: "EntryBy" },
        { sourceField: "Description" },
        { sourceField: "TotalDebit" },
        { sourceField: "TotalCredit" },
        { sourceField: "Seq" },
        { sourceField: "AccCode" },
        { sourceField: "Description" },
        { sourceField: "AccDesc" },
        { sourceField: "Debit" },
        { sourceField: "Credit" },
      ],
    };

    try {
      console.log("vRV_All:", vRV_All);
      const response = await axios.post(API_VIEW_RESULT, vRV_All, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("data_vRV_All", response.data);
        setTransactionAll(
          response.data.sort((a, b) => b.JournalNo.localeCompare(a.JournalNo))
        );
        setSearchTerm("");
      } else {
        setLoading(false);
        console.error("Error:", response.statusText);
        setTransactionAll([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("userToken");
        if (window.loginModal && typeof window.loginModal === "function") {
          window.loginModal();
        }
      }
    }
  }, [filterStartDate, filterEndDate]); // เพิ่ม filterStartDate, filterEndDate ใน dependency array

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]); // เรียก fetchRequisitions เมื่อมีการเปลี่ยนแปลง filterStartDate หรือ filterEndDate

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filtered = transactionall.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    const searchNumber = parseFloat(searchTerm);

    // เงื่อนไขการค้นหาข้อความ/ตัวเลข
    const matchesSearchTerm =
      transaction.JournalNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalNet === "number" &&
        transaction.TotalNet === searchNumber);

    // เงื่อนไขการกรองวันที่
    let matchesDateRange = true;
    if (filterStartDate && filterEndDate) {
      const transactionDate = dayjs(transaction.EntryDate);
      const startFilterDateObj = dayjs(filterStartDate).startOf("day");
      const endFilterDateObj = dayjs(filterEndDate).endOf("day");

      // ตรวจสอบว่า Day.js object ที่สร้างขึ้น valid หรือไม่ก่อนใช้งาน
      if (
        transactionDate.isValid() &&
        startFilterDateObj.isValid() &&
        endFilterDateObj.isValid()
      ) {
        matchesDateRange =
          transactionDate.isSameOrAfter(startFilterDateObj) &&
          transactionDate.isSameOrBefore(endFilterDateObj);
      } else {
        // ถ้าวันที่ไม่ valid ให้ log ข้อความเพื่อ debug
        console.warn(
          "Invalid date encountered in filtering:",
          transaction.EntryDate,
          filterStartDate,
          filterEndDate
        );
        matchesDateRange = false; // หรือกำหนดให้เป็น true หากต้องการรวมรายการที่มีวันที่ไม่ถูกต้อง
      }
    }

    const matchesStatus = selectedStatusKey === null ||
      selectedStatusKey === undefined ||
      String(transaction.DocStatus) === selectedStatusKey;

    return matchesSearchTerm && matchesDateRange && matchesStatus;
  });

  // ฟังก์ชันเปิด/ปิด Modal
  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };
  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleOpenDateFilterModal = () => {
    setIsDateFilterModalOpen(true);
  };
  const handleCloseDateFilterModal = () => {
    setIsDateFilterModalOpen(false);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    // Modal จะถูกปิดโดย handleDateChangeAndClose ใน DateFilterModal.js
  };

  // ฟังก์ชันใหม่สำหรับจัดการการเลือกสถานะ
  const handleStatusSelect = (statusKey) => {
    // ถ้าคลิกซ้ำให้กลับไปที่ "ทั้งหมด" (null)
    setSelectedStatusKey(prevKey => prevKey === statusKey ? null : statusKey);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleEditClick = (filtered, index) => {
    setSelectedIndex(index);
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`/uitestacc/Accordion${accDocType}?journalNo=${filtered.JournalNo}`); // นำทางไปยัง AccordionDI
  };

  const handleEditClick1 = (filtered, index) => {
    setSelectedIndex(index);
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`/uitestacc/Accordion${accDocType}?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DIHeader
  };
  const handleDetailClick = (filtered) => {
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.Description));
    dispatch(setAccDocType(filtered.Debit));
    dispatch(setStatusName(filtered.Credit));
    navigate(`/uitestacc/Accordion${accDocType}?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
  };
  const groupedTransactions = filtered.reduce((acc, transaction) => {
    const existingTransaction = acc.find(
      (item) => item.JournalNo === transaction.JournalNo
    );
    if (existingTransaction) {
      existingTransaction.TotalNet += transaction.TotalNet;
    } else {
      acc.push({ ...transaction });
    }
    return acc;
  }, []);

  const handleAddNew = () => {
    dispatch(setAccDocType(accDocType));
    navigate(`/uitestacc/Accordion${accDocType}?accDocType=${accDocType}`, {
      state: { isNew: true },
    }); // ส่ง state เพื่อระบุว่าเป็นการสร้างใหม่
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ---------------------------------------------------
  // เพิ่ม State สำหรับ Modal Preview
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [globalPreviewFileId, setGlobalPreviewFileId] = useState(null);

  const handleRVDraftOCR = () => {
    // const ocrFileIdToPreview = `1OnLQCmFsj-pNkzqz1kCNBkdfezRlc5y-`;
    const ocrFileIdToPreview = `1cMIQT-StYc-9fCUB0WKKyrP7WQVqb62L`; //file ID:Input image OCR
    // const ocrFileIdToPreview = `1JSKKav_l_-KVgF8Q2ofLsAVee4d6izch`; 

    if (ocrFileIdToPreview && ocrFileIdToPreview.length > 10) {
      console.log("Previewing OCR with File ID:", ocrFileIdToPreview);
      setGlobalPreviewFileId(ocrFileIdToPreview);
      setIsPreviewModalOpen(true);
    } else {
      alert("กรุณาตั้งค่า Google Drive File ID จริงในโค้ด handleDIDraftOCR ก่อน");
    }
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setGlobalPreviewFileId(null);
  };
  // ------------------------------------------------------

  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="x" />
      ),
      name: "Add New",
      onClick: handleAddNew, // เรียก handleAddNew โดยตรง
    },
    // {
    //     icon: (
    //       <FontAwesomeIcon icon={faFileArrowDown} style={{ color: "#0000ff" }} size="x" />
    //     ),
    //     name: "Preview Document(OCR)",
    //     onClick: handleRVDraftOCR,
    //   },
    {
      icon: (
        <FontAwesomeIcon
          icon={faCalendarDays}
          style={{ color: "#fc4704" }}
          size="x"
        />
      ),
      name: "Filter Date",
      onClick: handleOpenDateFilterModal, // เรียกฟังก์ชันเปิด Modal วันที่
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ color: "#4301b3" }}
          size="x"
        />
      ),
      name: "Search Data",
      onClick: handleOpenSearchModal, // เรียกฟังก์ชันเปิด Modal ค้นหา
    },
  ];

  const handleGoMenu = () => {
    navigate(URL);
  };
  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <DocConfigHeader
        categoryOptions={categoryOptions}
        categoryOptionsThai={categoryOptionsThai}
        handleGoMenu={handleGoMenu}
      />
      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />
      </div>
      <SearchModal
        open={isSearchModalOpen}
        handleClose={handleCloseSearchModal}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />
      <DateFilterModal
        open={isDateFilterModalOpen}
        handleClose={handleCloseDateFilterModal}
        onDateRangeChange={handleDateRangeChange}
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
      />
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none" }}
      />
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <ul>
          {groupedTransactions.length > 0 ? (
            groupedTransactions.map((transaction, index) => (
              <div
                className="row"
                key={index}
                onClick={() => handleEditClick(transaction)}
                onMouseDown={() => setActiveIndex(index)}
                onMouseUp={() => setActiveIndex(null)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  background: activeIndex === index ? "#e0e0e0" : "transparent",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <ListItem style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }} onClick={() => handleDetailClick(transaction)}>
                      {transaction.JournalNo}&nbsp;
                      {/* <Status status={transaction.DocStatus} /> */}
                      {/* <DocStatus status={transaction.StatusName} /> */}
                    </h5>
                    <h6 style={{ marginBottom: "1px" }}>
                      &nbsp; {transaction.Description}
                      <i>
                        &nbsp; &nbsp; Date:
                        {formatDate(transaction.EntryDate)}
                      </i>
                    </h6>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{ display: "flex" }}>
                      <h4>{formatNumber(transaction.TotalDebit)}</h4>
                      &nbsp; &nbsp; &nbsp;
                    </div>
                  </div>
                </ListItem>
                <Divider
                  variant="middle"
                  component="li"
                  style={{ listStyle: "none" }}
                />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              ไม่พบรายการ {categoryOptions} ในช่วงวันที่ **{filterStartDate ?
                formatDate(filterStartDate) : "เริ่มต้น"}** ถึง **{filterEndDate ?
                  formatDate(filterEndDate) : "สิ้นสุด"}** {(searchTerm || selectedStatusKey)
                    && `และไม่ตรงกับคำค้นหา/สถานะที่เลือก ${searchTerm ? `"${searchTerm}"` : ""}
              ${selectedStatusKey ? ` (Status: ${selectedStatusKey})` : ""}`}
              <br />
            </p>
          )}
        </ul>
      )}
      <div>&nbsp;</div>
      {/* Modal สำหรับ Image Preview  */}
      <Modal
        open={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        aria-labelledby="global-image-preview-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '70%', md: '50%' }, // ปรับขนาดตามต้องการ
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <DriveImagePreview
            googleDriveFileId={globalPreviewFileId} // ส่ง File ID จาก Global State
            handleClose={handleClosePreviewModal}
          />
        </Box>
      </Modal>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default RVHDList;
