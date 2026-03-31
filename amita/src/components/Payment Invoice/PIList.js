import React, { useState, useEffect, useCallback } from "react";
import axios from "../../components/Auth/axiosConfig";
import { API_VIEW_RESULT, URL } from "../api/url";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName
} from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import SearchModal from "../DataFilters/SearchModal";
import DateFilterModal from "../DataFilters/DateFilterModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import DocStatus from "../DataFilters/DocStatus";
import DocStatusPoint from "../DataFilters/DocStatusPoint";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import DocConfigHeader from "../DataFilters/DocConfigHeader";
import useDocConfiguration from "../../hooks/useDocConfiguration";
import '../DataFilters/ConfigStatus.css';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function PIHDList() {
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accDocType = "PI";
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(
    dayjs().startOf("month")
  );
  const [filterEndDate, setFilterEndDate] = useState(
    dayjs().endOf("month")
  );
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const { categoryOptions, categoryOptionsThai } = useDocConfiguration(accDocType);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");

    const vAP_H = {
      viewName: "vAP_H",
      parameters: [
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
        { sourceField: "TotalAmount" },
        { sourceField: "TotalVat" },
        { sourceField: "TotalWht" },
        { sourceField: "TotalNet" },
        { sourceField: "StatusName" },
        { sourceField: "DocNo" },
        { sourceField: "CancelBy" },
        { sourceField: "CancelReason" },
        { sourceField: "CancelDate" },
      ],
    };
    try {
      const response = await axios.post(API_VIEW_RESULT, vAP_H, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setLoading(false);
        setTransactionAll(
          response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
        );
        setSearchTerm("");
      } else {
        setLoading(false);
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
  }, [filterStartDate, filterEndDate]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filtered = transactionall.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    const searchNumber = parseFloat(searchTerm);

    const matchesSearchTerm =
      transaction.AccDocNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalNet === "number" &&
        transaction.TotalNet === searchNumber);

    let matchesDateRange = true;
    if (filterStartDate && filterEndDate) {
      const transactionDate = dayjs(transaction.AccBatchDate);
      const startFilterDateObj = dayjs(filterStartDate).startOf("day");
      const endFilterDateObj = dayjs(filterEndDate).endOf("day");
      if (transactionDate.isValid() && startFilterDateObj.isValid() && endFilterDateObj.isValid()) {
        matchesDateRange =
          transactionDate.isSameOrAfter(startFilterDateObj) &&
          transactionDate.isSameOrBefore(endFilterDateObj);
      } else {
        matchesDateRange = false;
      }
    }

    const matchesStatus = selectedStatusKey === null ||
      selectedStatusKey === undefined ||
      String(transaction.DocStatus) === selectedStatusKey;

    return matchesSearchTerm && matchesDateRange && matchesStatus;
  });

  const handleOpenSearchModal = () => setIsSearchModalOpen(true);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);
  const handleOpenDateFilterModal = () => setIsDateFilterModalOpen(true);
  const handleCloseDateFilterModal = () => setIsDateFilterModalOpen(false);

  const handleDateRangeChange = (startDate, endDate) => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
  };

  const handleStatusSelect = (statusKey) => {
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

  const groupedTransactions = filtered.reduce((acc, transaction) => {
    const existingTransaction = acc.find(item => item.AccDocNo === transaction.AccDocNo);
    if (existingTransaction) {
      existingTransaction.TotalNet += transaction.TotalNet;
    } else {
      acc.push({ ...transaction });
    }
    return acc;
  }, []);

  const handleEditClick = (filtered) => {
    dispatch(setAccDocNo(filtered.AccDocNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`${URL}AccordionPI?accDocNo=${filtered.AccDocNo}`);
  };

  const handleAddNew = () => {
    dispatch(setAccDocType(accDocType));
    navigate(`${URL}Accordion${accDocType}?accDocType=${accDocType}`, {
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
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="x" />
      ),
      name: "Add New",
      onClick: handleAddNew,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#fc4704" }} size="x" />
      ),
      name: "Filter Date",
      onClick: handleOpenDateFilterModal,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4301b3" }} size="x" />
      ),
      name: "Search Data",
      onClick: handleOpenSearchModal,
    },
  ];

  const handleGoMenu = () => {
    navigate(`${URL}`);
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
        <div className="status-legend-wrapper">
          <DocStatusPoint
            accConfigCode={accDocType}
            onStatusSelect={handleStatusSelect}
            selectedKey={selectedStatusKey}
          />
        </div>
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
                    <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                      {transaction.AccDocNo}&nbsp;
                      <DocStatus status={transaction.StatusName} />
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
                  formatDate(filterEndDate) : "สิ้นสุด"}**
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

export default PIHDList;
