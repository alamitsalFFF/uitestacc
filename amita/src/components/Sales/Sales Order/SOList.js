import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig";
import { API_BASE, API_VIEW_RESULT, URL } from "../../api/url";
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
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../../purchase/SearchComponen";
import Status from "../../purchase/Status";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName
} from "../../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import ButtonAction from "../../DataFilters/ButtonAction";
import SearchModal from "../../DataFilters/SearchModal";
import DateFilterModal from "../../DataFilters/DateFilterModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import DocStatus from "../../DataFilters/DocStatus";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import DocStatusPoint from "../../DataFilters/DocStatusPoint";
import '../../DataFilters/ConfigStatus.css';
import { useAuthFetch } from "../../Auth/fetchConfig";
import DocConfigHeader from "../../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../../hooks/useDocConfiguration";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function SOList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month').toDate()); // วันที่ 1 ของเดือนปัจจุบัน
  const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month').toDate());
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  const accDocType = "SO";
  const { categoryOptions, categoryOptionsThai } = useDocConfiguration(accDocType);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");
    console.log("Fetching data from date:", dateFrom);
    console.log("filterEndDate:", dateTo);
    const vSO_H = {
      viewName: "vSO_H",
      parameters: [
        { field: "AccBatchDate", UseOperator: "BETWEEN", From: dateFrom, To: dateTo },
      ],
      results: [
        { sourceField: "AccDocNo" },
        { sourceField: "PartyName" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "AccBatchDate" },
        { sourceField: "DocStatus" },
        { sourceField: "TotalNet" },
        { sourceField: "AccDocType" },
        { sourceField: "StatusName" },
      ],
    };

    try {
      console.log("vSO_H:", vSO_H);
      const response = await axios.post(API_VIEW_RESULT, vSO_H, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("data_vSO_H", response.data);
        setTransactionAll(
          response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
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
    const matchesSearchTerm = (
      transaction.AccDocNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalNet === "number" &&
        transaction.TotalNet === searchNumber)
    );

    // เงื่อนไขการกรองวันที่
    let matchesDateRange = true;
    if (filterStartDate && filterEndDate) {
      const transactionDate = dayjs(transaction.AccBatchDate);
      const startFilterDateObj = dayjs(filterStartDate).startOf('day');
      const endFilterDateObj = dayjs(filterEndDate).endOf('day');

      // ตรวจสอบว่า Day.js object ที่สร้างขึ้น valid หรือไม่ก่อนใช้งาน
      if (transactionDate.isValid() && startFilterDateObj.isValid() && endFilterDateObj.isValid()) {
        matchesDateRange = transactionDate.isSameOrAfter(startFilterDateObj) &&
          transactionDate.isSameOrBefore(endFilterDateObj);
      } else {
        // ถ้าวันที่ไม่ valid ให้ log ข้อความเพื่อ debug
        console.warn("Invalid date encountered in filtering:",
          transaction.AccBatchDate,
          filterStartDate,
          filterEndDate);
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
    setSelectedIndex(index); // set index ที่เลือก
    dispatch(setAccDocNo(filtered.AccDocNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`${URL}Accordion${accDocType}?accDocNo=${filtered.AccDocNo}`); // นำทางไปยัง SOHeader
  };

  const groupedTransactions = filtered.reduce((acc, transaction) => {
    const existingTransaction = acc.find(item => item.AccDocNo === transaction.AccDocNo);
    if (existingTransaction) {
      existingTransaction.TotalNet += transaction.TotalNet;
    } else {
      acc.push({ ...transaction });
    }
    return acc;
  }, []);

  const handleAddNew = () => {
    dispatch(setAccDocType(accDocType));
    // navigate(`/uitestacc/POHeader?accDocType=${accDocType}`, {
    // navigate(`/uitestacc/AccordionSO?accDocType=${accDocType}`, {
    navigate(`${URL}Accordion${accDocType}?accDocType=${accDocType}`, {
      state: { isNew: true },
    }); // ส่ง state เพื่อระบุว่าเป็นการสร้างใหม่
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="x" />
      ),
      name: "Add New",
      onClick: handleAddNew, // เรียก handleAddNew โดยตรง
    },
    {
      icon: (
        <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#fc4704" }} size="x" />
      ),
      name: "Filter Date",
      onClick: handleOpenDateFilterModal, // เรียกฟังก์ชันเปิด Modal วันที่
    },
    {
      icon: (
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4301b3" }} size="x" />
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
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoMenu}>&nbsp;Sales Order&nbsp;</h2> */}
      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActions} />
      </div> */}
      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />

        <div className="status-legend-wrapper">
          <DocStatusPoint accConfigCode={accDocType}
            onStatusSelect={handleStatusSelect}
            selectedKey={selectedStatusKey} />
        </div>
      </div>

      {/* Render Modal components ที่ซ่อนไว้ */}
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
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                      {transaction.AccDocNo}&nbsp;
                      {/* <Status status={transaction.DocStatus} /> */}  {/*ส่ง DocStatus ไปcase */}
                      <DocStatus status={transaction.StatusName} />
                    </h5>
                    <h6 style={{ marginBottom: "1px" }}>
                      &nbsp; {transaction.PartyName}
                      <i>
                        &nbsp; &nbsp; Date:
                        {formatDate(transaction.AccBatchDate)} {/*ตามวันที่เปิด*/}
                      </i>
                    </h6>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{ display: "flex" }}>
                      <h4>{formatNumber(transaction.TotalNet)}</h4>
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
      <FloatingActionBar backPath="/uitestacc/" />
    </div>
  );
}

export default SOList;
