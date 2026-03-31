import React, { useState, useEffect,useCallback } from "react";
// import axios from "axios";
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
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../../purchase/SearchComponen";
import Status from "../../purchase/Status";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName,
} from "../../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../Auth/axiosConfig";
import { API_VIEW_RESULT } from "../../api/url";
import DateRangePicker from "../../DataFilters/DateRangePicker";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import ButtonSR from "./ButtonSR";
import SearchModal from "../../DataFilters/SearchModal";
import DateFilterModal from "../../DataFilters/DateFilterModal";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function SRListAU() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  // const [filterStartDate, setFilterStartDate] = useState(null); // สถานะเก็บวันที่เริ่มต้น
  // const [filterEndDate, setFilterEndDate] = useState(null); // สถานะเก็บวันที่สิ้นสุด
   const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month').toDate()); // วันที่ 1 ของเดือนปัจจุบัน
  const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month').toDate());
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    let parameters = [
      { field: "AccDocType", value: "SR" }, // ยังคงมี AccDocType: "SR"
    ];
    let CurrentMonth =  new Date().toISOString().split("T")[0];
    let parameters1 = [{ field: "AccEffectiveDate", value: `${CurrentMonth}` }];
        console.log("CurrentMonth:", CurrentMonth);
    const vSR_H = {
      viewName: "vSR_H",
      // parameters: parameters,
      results: [
        { sourceField: "AccDocNo" },
        { sourceField: "PartyName" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "DocStatus" },
        { sourceField: "TotalNet" },
        { sourceField: "AccDocType" },
        { sourceField: "StatusName" },
      ],
    };

    try {
      console.log("vSR_H:", vSR_H);
      const response = await axios.post(API_VIEW_RESULT, vSR_H, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("data_vSR_H", response.data);
        console.log("localStorage:", localStorage.getItem("userToken"));
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
    // ไม่ต้องปิด Modal ตรงนี้ เพราะ Modal จะถูกปิดจากปุ่ม "Apply" หรือ "Close"
  };
  // const handleSearch = (term) => {
  //   // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
  //   setSearchTerm(term);
  //   if (!term) {
  //     // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
  //     setShowSearch(false);
  //   }
  // };
  const filteredSR = transactionall.filter((transaction) => {
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
      const transactionDate = dayjs(transaction.AccEffectiveDate);
      const startFilterDateObj = dayjs(filterStartDate).startOf('day');
      const endFilterDateObj = dayjs(filterEndDate).endOf('day');

      // ตรวจสอบว่า Day.js object ที่สร้างขึ้น valid หรือไม่ก่อนใช้งาน
      if (transactionDate.isValid() && startFilterDateObj.isValid() && endFilterDateObj.isValid()) {
        matchesDateRange = transactionDate.isSameOrAfter(startFilterDateObj) &&
                           transactionDate.isSameOrBefore(endFilterDateObj);
      } else {
        // ถ้าวันที่ไม่ valid ให้ log ข้อความเพื่อ debug
        console.warn("Invalid date encountered in filtering:", 
                     transaction.AccEffectiveDate, 
                     filterStartDate, 
                     filterEndDate);
        matchesDateRange = false; // หรือกำหนดให้เป็น true หากต้องการรวมรายการที่มีวันที่ไม่ถูกต้อง
      }
    }

  return matchesSearchTerm && matchesDateRange;
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

  // const toggleSearch = () => {
  //   // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
  //   setShowSearch(!showSearch);
  //   setShowDateFilter(false);
  // };
  // const toggleDateFilter = () => {
  //   setShowDateFilter(!showDateFilter);
  //   setShowSearch(false); // ซ่อน Search เมื่อเปิด/ปิด Date filter
  // };
  // const handleDateRangeChange = (startDate, endDate) => {
  //   setFilterStartDate(startDate);
  //   setFilterEndDate(endDate);
  //   // คุณสามารถเลือกที่จะซ่อน DateRangePicker หลังจากเลือกวันที่ได้ที่นี่
  //   // setShowDateFilter(false);
  // };

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
    // navigate(`/uitestacc/SRHeader?accDocNo=${transaction.AccDocNo}`);
    navigate(`/uitestacc/AccordionUsage`, { state: { initialAccDocNo: transaction.AccDocNo } });
  };

  const groupedTransactions = filteredSR.reduce((acc, transaction) => {
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
    const accDocType = "SR";
    dispatch(setAccDocType(accDocType));
    navigate(`/uitestacc/SRHeader?accDocType=${accDocType}`, {
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

  const handleGoBack = () => {
    navigate("/uitestacc/");
  };
  const handleGoMenu = () => {
    navigate("/uitestacc/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <h2 style={{ textAlign: "center", textDecoration: "underline" }} onClick={handleGoMenu}>
        &nbsp;Sales Requisition&nbsp;
      </h2>
      {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901", cursor: "pointer" }}
            onClick={handleAddNew}
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <FontAwesomeIcon
            icon={faCalendarDays} 
            size="2x"
            style={{ color: "#007bff", cursor: "pointer" }} 
            onClick={toggleDateFilter}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="2x"
            style={{ color: "#2f9901", cursor: "pointer" }}
            onClick={toggleSearch}
          />
        </div>
      </div> */}

      {/* {showSearch && (
        <div style={{ marginBottom: "15px" }}>
          <SearchComponent onSearch={handleSearch} />
        </div>
      )}

      {showDateFilter && (
        <div style={{ marginBottom: "15px" }}>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
      )} */}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonSR actions={buttonActions} />
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
                      <Status status={transaction.DocStatus} />
                    </h5>
                    <h6 style={{ marginBottom: "1px" }}>
                      &nbsp; {transaction.PartyName}
                      <i>
                        &nbsp; &nbsp; Date:
                        {formatDate(transaction.AccEffectiveDate)}
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
              ไม่พบรายการ Sales Requisition ในช่วงวันที่ที่เลือก หรือเงื่อนไขการค้นหา
            </p>
          )}
        </ul>
      )}

      <div>&nbsp;</div>
      <div className="row" style={{ display: "flex" }}>
        <div className="col-6" style={{ display: "grid" }}>
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            size="2x"
            style={{
              color: "#013898",
              cursor: "pointer",
              display: "grid",
              justifyItems: "end",
            }}
            onClick={handleGoBack}
          />
        </div>
        <div
          className="col-6"
          style={{ display: "grid", justifyItems: "flex-end" }}
        >
          <FontAwesomeIcon
            icon={faCircleArrowUp}
            size="2x"
            style={{
              color: "#013899",
              cursor: "pointer",
              display: "grid",
              justifyItems: "end",
            }}
            onClick={scrollToTop}
          />
        </div>
      </div>
    </div>
  );
}

export default SRListAU;
