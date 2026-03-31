import React, { useState, useEffect } from "react";
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
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";
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
import { blue } from "@mui/material/colors";
import { API_VIEW_RESULT } from "../api/url";

function PVHDList1() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vPV_All = {
    viewName: "vPV_All",
    // parameters: [
    //   //   { field: "AccDocType", value: "PI" }, // การกรองข้อมูล
    //   // { field: "DocStatus", value: "0" },
    // ],
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
  useEffect(() => {
    (async () => {
      try {
        console.log("vPV_All:", vPV_All);
        setLoading(true);
        const response = await axios.post(
          `${API_VIEW_RESULT}`,
          vPV_All,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vPV_All", response.data);
          setTransactionAll(
            response.data.sort((a, b) => b.JournalNo.localeCompare(a.JournalNo))
          ); // เรียงลำดับข้อมูลจากมากไปน้อย
        } else {
          setLoading(false);
          console.error("Error:", response.statusText);
          // setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error("Error:", error);
        // setError(error.message);
        setLoading(false);
      }
    })();
  }, []);
  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };
  const filtered = transactionall.filter((transaction) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    const searchNumber = parseFloat(searchTerm);
    return (
      transaction.JournalNo.toLowerCase().includes(searchLower) ||
      transaction.Description.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalDebit === "number" &&
        transaction.TotalDebit === searchNumber)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditClick = (filtered) => {
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.Description));
    dispatch(setAccDocType(filtered.Debit));
    dispatch(setStatusName(filtered.Credit));
    navigate(`/uitestacc/AccordionPV?journalNo=${filtered.JournalNo}`);
  };
  const handleEditClick1 = (filtered) => {
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.Description));
    dispatch(setAccDocType(filtered.Debit));
    dispatch(setStatusName(filtered.Credit));
    // navigate(`/uitestacc/PVDTList?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
    navigate(`/uitestacc/PVHeader?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
  };

  const handleDetailClick = (filtered) => {
    dispatch(setAccDocNo(filtered.JournalNo));
    dispatch(setPartyName(filtered.Description));
    dispatch(setAccDocType(filtered.Debit));
    dispatch(setStatusName(filtered.Credit));
    navigate(`/uitestacc/PVDTList?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
  };

  const groupedTransactions = filtered.reduce((acc, transaction) => {
    const existingTransaction = acc.find(
      (item) => item.JournalNo === transaction.JournalNo
    );
    if (existingTransaction) {
      existingTransaction.TotalDebit = transaction.TotalDebit; //ไม่รวมเพราะเอา ค่าTotalDebit มาโชว์
    } else {
      acc.push({ ...transaction });
    }
    return acc;
  }, []);

  const handleAddNew = () => {
    const accDocType = "PV";
    dispatch(setAccDocType(accDocType));
    navigate(`/uitestacc/PVHeader?accDocType=${accDocType}`, {
      state: { isNew: true },
    }); // ส่ง state เพื่อระบุว่าเป็นการสร้างใหม่
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
      <h2 style={{ textAlign: "center" }} onClick={handleGoMenu}>
        Payment Voucher
      </h2>
      <div style={{ display: "flex" }}>
        {/* <div>
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          />
        </div> */}
        <div style={{ marginLeft: "auto" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="2x"
              style={{ color: "#2f9901" }}
              onClick={toggleSearch} // แสดงไอคอนค้นหาเมื่อ showSearch เป็น false
            />
          )}
        </div>
      </div>
      <ul>
        {groupedTransactions.map((transaction, index) => (
          <div className="row" key={index}>
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              {/* <FontAwesomeIcon
                icon={faChevronRight}
                size="2x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              /> */}
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}
                onClick={() => handleDetailClick(transaction)}
                >
                  &nbsp; {transaction.JournalNo}&nbsp;
                  {/* <Status status={transaction.DocStatus} /> */}
                </h5>
                <p>
                  &nbsp; &nbsp; {transaction.Description}
                  <i>
                    &nbsp; &nbsp; Date:
                    {formatDate(transaction.EffectiveDate)}
                  </i>
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ display: "flex" }}>
                  <h4>{formatNumber(transaction.TotalDebit)}</h4>
                  &nbsp; &nbsp; &nbsp;
                </div>
              </div>
              <i style={{color:"#2d01bd"}}>edit&nbsp;</i>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="1x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              />
            </ListItem>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
          </div>
        ))}
      </ul>
      <div>&nbsp;</div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          width: "93%", // กำหนดความกว้างเท่ากับ dashboard
          //maxWidth: "960px", // กำหนดความกว้างสูงสุดเท่ากับ dashboard
          left: "50%", // เลื่อนไปกึ่งกลาง
          transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจริงๆ
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px", // ลด padding ลงเล็กน้อยเพื่อให้พอดี
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={handleGoBack}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Back
          </Button>
        </Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderRadius: "25px !important",
          }}
        >
          <Button
            variant="outlined"
            endIcon={<FaArrowUp />}
            onClick={scrollToTop}
            sx={{
              color: "green",
              borderColor: "green",
              borderRadius: "25px",
              "&:hover": {
                borderColor: "darkgreen",
                backgroundColor: "rgba(0, 128, 0, 0.04)",
              },
            }}
          >
            Top
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default PVHDList1;
