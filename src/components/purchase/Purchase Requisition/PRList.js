import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
  faCalendarDays,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../SearchComponen";
import Status from "../Status";
import { useNavigate, useLocation } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName,
} from "../../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../Auth/axiosConfig";
import { API_BASE, API_VIEW_RESULT, URL } from "../../api/url";
import DateRangePicker from "../../DataFilters/DateRangePicker"

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import ButtonAction from "../../DataFilters/ButtonAction";
import SearchModal from "../../DataFilters/SearchModal";
import DateFilterModal from "../../DataFilters/DateFilterModal";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import DocStatus from "../../DataFilters/DocStatus";
import DocStatusPoint from "../../DataFilters/DocStatusPoint";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import '../../DataFilters/ConfigStatus.css';
import DocConfigHeader from "../../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../../hooks/useDocConfiguration";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// import "../../Share/Title.css";

function PRList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  // const [filterStartDate, setFilterStartDate] = useState(null); // สถานะเก็บวันที่เริ่มต้น
  // const [filterEndDate, setFilterEndDate] = useState(null); // สถานะเก็บวันที่สิ้นสุด
  // const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month').toDate()); // วันที่ 1 ของเดือนปัจจุบัน
  // const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month').toDate());
  const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month'));
  const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month'));
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const accDocType = "PR";
  const params = new URLSearchParams(location.search);
  const accDocNo = params.get("accDocNo");

  const { categoryOptions, categoryOptionsThai } = useDocConfiguration(accDocType);

  // const [categoryOptions, setCategoryOptions] = useState([]);
  // const [categoryOptionsThai, setCategoryOptionsThai] = useState([]);
  // console.log("Category Options:", categoryOptions);
  // const authFetch = useAuthFetch();

  // useEffect(() => {
  //   const fetchCategoryOptions = async () => {
  //     try {
  //       const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${accDocType}`;
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
  //         setCategoryOptionsThai(data[0].tName);
  //       } else {
  //         console.error("Category API did not return an array.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching category options:", error);
  //     }
  //   };

  //   fetchCategoryOptions();
  // }, []);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    let parameters = [
      { field: "AccDocType", value: "PR" },
    ];
    let CurrentMonth = new Date().toISOString().split("T")[0];
    let parameters1 = [{ field: "AccBatchDate", value: `${CurrentMonth}` }];
    console.log("CurrentMonth:", CurrentMonth);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");
    console.log("dateFrom:", dateFrom, "dateTo:", dateTo);
    // console.log("dateTo:", dateTo);
    const vPR_H = {
      viewName: "vPR_H",
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
      console.log("vPR_H:", vPR_H);
      const response = await axios.post(API_VIEW_RESULT, vPR_H, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Auto-expand date filter if no data found for current month
        if (response.data && response.data.length === 0) {
          const currentStartOfMonth = dayjs().startOf('month');
          if (dayjs(filterStartDate).isSame(currentStartOfMonth, 'day')) {
            setFilterStartDate(dayjs().subtract(1, 'month').startOf('month'));
            return; // Trigger re-fetch with new date range
          }
        }

        setLoading(false);
        console.log("data_vPR_H", response.data);
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

  const filteredPR = transactionall.filter((transaction) => {
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
      // const transactionDate = dayjs(transaction.AccEffectiveDate); 
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
  const handleEditClick = (transaction, index) => {
    setSelectedIndex(index); // set index ที่เลือก
    dispatch(setAccDocNo(transaction.AccDocNo));
    dispatch(setPartyName(transaction.PartyName));
    dispatch(setAccDocType(transaction.AccDocType));
    dispatch(setStatusName(transaction.StatusName));
    navigate(`${URL}PRHeader?accDocNo=${transaction.AccDocNo}`);
    // navigate(`/uitestacc/AccordionPR`, { state: { initialAccDocNo: transaction.AccDocNo } });
  };

  const handleEditClickAU = (transaction, index) => {
    setSelectedIndex(index);
    dispatch(setAccDocNo(transaction.AccDocNo));
    dispatch(setPartyName(transaction.PartyName));
    dispatch(setAccDocType(transaction.AccDocType));
    dispatch(setStatusName(transaction.StatusName));
    // navigate(`/uitestacc/AccordionPR`, { state: { initialAccDocNo: transaction.AccDocNo } });
    navigate(`${URL}AccordionPR?accDocNo=${transaction.AccDocNo}`);
  };

  const groupedTransactions = filteredPR.reduce((acc, transaction) => {
    const existingTransaction = acc.find(
      (item) => item.AccDocNo === transaction.AccDocNo
    );
    if (existingTransaction) {
      existingTransaction.TotalNet += transaction.TotalNet;
    } else {
      acc.push({ ...transaction });
    }
    return acc;
  }, []);

  const handleAddNew = () => {
    const accDocType = "PR";
    dispatch(setAccDocType(accDocType));
    // navigate(`/uitestacc/PRHeader?accDocType=${accDocType}`, {
    navigate(`${URL}AccordionPR?accDocType=${accDocType}`, {
      state: { isNew: true },
    });
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
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
      onClick: handleAddNew, // เรียก handleAddNew โดยตรง
    },
    {
      icon: (
        <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#fc4704" }} size="1x" />
      ),
      name: "Filter Date",
      onClick: handleOpenDateFilterModal, // เรียกฟังก์ชันเปิด Modal วันที่
    },
    {
      icon: (
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4301b3" }} size="1x" />
      ),
      name: "Search Data",
      onClick: handleOpenSearchModal, // เรียกฟังก์ชันเปิด Modal ค้นหา
    },
  ];

  const handleGoMenu = () => {
    navigate(URL);
  };

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "10px" }}>
      <DocConfigHeader
        categoryOptions={categoryOptions}
        categoryOptionsThai={categoryOptionsThai}
        handleGoMenu={handleGoMenu}
      />
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
                onClick={() => handleEditClickAU(transaction)} //Header Accordion
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
                      <DocStatus status={transaction.StatusName} />
                      {/* <Status status={transaction.DocStatus} /> */}
                    </h5>
                    <h6 style={{ marginBottom: "1px" }}>
                      &nbsp; {transaction.PartyName}
                      <i>
                        &nbsp; &nbsp; Date:
                        {formatDate(transaction.AccBatchDate)}
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
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default PRList;
