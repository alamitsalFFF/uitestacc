import React, { useState, useEffect ,useCallback} from "react";
import axios from "../Auth/axiosConfig";
import { useAuthFetch } from "../Auth/fetchConfig";
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
import { API_BASE, API_VIEW_RESULT } from "../api/url";
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
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import DocStatusPoint from "../DataFilters/DocStatusPoint";
import '../DataFilters/ConfigStatus.css';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function TransList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  // const [filterStartDate, setFilterStartDate] = useState(
  //   dayjs().startOf("month").toDate()
  // ); // วันที่ 1 ของเดือนปัจจุบัน
  // const [filterEndDate, setFilterEndDate] = useState(
  //   dayjs().endOf("month").toDate()
  // );
  // เปลี่ยนจาก .toDate() เป็นแบบนี้
const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month')); 
const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month'));

  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  // const accDocType = "DO";

  const [categoryOptions, setCategoryOptions] = useState([]);
  console.log("Category Options:", categoryOptions);
  const authFetch = useAuthFetch();
  
    useEffect(() => {
      const fetchCategoryOptions = async () => {
        try {
          // const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${accDocType}`;
          const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig`;
          const response = await authFetch(categoryApiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
  
          // if (Array.isArray(data)) {
          //   setCategoryOptions(
          //     data.map((item) => ({ value: item.category, label: item.eName,docConfigID: item.docConfigID, }))
          //   );
          if (data && data.length > 0) {
            setCategoryOptions(data[0].eName);
          } else {
            console.error("Category API did not return an array.");
          }
        } catch (error) {
          console.error("Error fetching category options:", error);
        }
      };
  
      fetchCategoryOptions();
    }, []);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    let CurrentMonth = new Date().toISOString().split("T")[0];
    console.log("CurrentMonth:", CurrentMonth);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");
    console.log("Fetching data from date:", dateFrom);
    console.log("filterEndDate:", dateTo);

    const vTransaction_H = {
    viewName: "vTransaction_H",
    parameters: [
      // { field: "AccBatchDate", value: dateForApi},
      { field: "AccBatchDate", UseOperator: "BETWEEN", From: dateFrom, To: dateTo },
    ],
    results: [         
        { sourceField: "AccDocNo" },
        { sourceField: "AccBatchDate" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "PartyCode" },
        { sourceField: "PartyTaxCode" },
        { sourceField: "PartyName" },
        { sourceField: "PartyAddress" },
        { sourceField: "IssueBy" },
        { sourceField: "AccDocType" },
        { sourceField: "AccPostDate" },
        { sourceField: "FiscalYear" },
        { sourceField: "DocStatus" },
        { sourceField: "DocRefNo" },
        { sourceField: "Text1" },
        { sourceField: "Date1" },
        { sourceField: "Num1" },
        { sourceField: "Text2" },
        { sourceField: "Date2" },
        { sourceField: "Num2" },
        { sourceField: "Text3" },
        { sourceField: "Date3" },
        { sourceField: "Num3" },
        { sourceField: "Text4" },
        { sourceField: "Date4" },
        { sourceField: "Num4" },
        { sourceField: "Text5" },
        { sourceField: "Date5" },
        { sourceField: "Num5" },
        { sourceField: "Text6" },
        { sourceField: "Date6" },
        { sourceField: "Num6" },
        { sourceField: "Text7" },
        { sourceField: "Date7" },
        { sourceField: "Num7" },
        { sourceField: "Text8" },
        { sourceField: "Date8" },
        { sourceField: "Num8" },
        { sourceField: "Text9" },
        { sourceField: "Date9" },
        { sourceField: "Num9" },
        { sourceField: "Text10" },
        { sourceField: "Date10" },
        { sourceField: "Num10" },
        { sourceField: "TotalAmount" },
        { sourceField: "TotalVat" },
        { sourceField: "TotalWht" },
        { sourceField: "TotalNet" },

    ],
  };

    try {
      console.log("vTransaction_H:", vTransaction_H);
      const response = await axios.post(API_VIEW_RESULT, vTransaction_H, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("data_vTransaction_H", response.data);
        setTransactionAll(
         response.data
          .sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo)) // เรียงลำดับจากมากไปน้อย
          .slice(0, 30) // เลือกเอาเฉพาะ 30 รายการแรกหลังจากเรียงแล้ว
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
      transaction.AccDocNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalNet === "number" &&
        transaction.TotalNet === searchNumber);

    // เงื่อนไขการกรองวันที่
    let matchesDateRange = true;
    if (filterStartDate && filterEndDate) {
      const transactionDate = dayjs(transaction.AccBatchDate);
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
          transaction.AccBatchDate,
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
    dispatch(setAccDocNo(filtered.AccDocNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`/uitestacc/Transaction?accDocNo=${filtered.AccDocNo}`); // นำทางไปยัง AccordionDI
  };

  const groupedTransactions = filtered.reduce((acc, transaction) => {
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
    const accDocType = "DO";
    dispatch(setAccDocType(accDocType));
    navigate(`/uitestacc/AccordionDO?accDocType=${accDocType}`, {
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

  const handleGoBack = () => {
    navigate("/uitestacc/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoBack}
      >
        {/* {categoryOptions} */}
        Transaction List
      </h2>
      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />

        {/* <div className="status-legend-wrapper">
          <DocStatusPoint accConfigCode={accDocType} 
                          onStatusSelect={handleStatusSelect}
                          selectedKey={selectedStatusKey} />
        </div> */}
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
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }} >
                      {transaction.AccDocNo}&nbsp;
                      {/* <DocStatus status={transaction.StatusName} /> */}
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
              ไม่พบรายการ 
              {/* {categoryOptions} */}
               ในช่วงวันที่ **{filterStartDate ? 
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
      <FloatingActionBar  backPath="/uitestacc"/>
    </div>
  );
}

export default TransList;
