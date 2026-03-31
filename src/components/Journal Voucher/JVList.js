import React, { useState, useEffect } from "react";
import axios from "../../components/Auth/axiosConfig";
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
  faPrint,
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
import { blue } from "@mui/material/colors";
import { API_VIEW_RESULT, DATA_BASE, REPORT_BASE, URL } from "../api/url";
import FloatingActionBar from "../DataFilters/FloatingActionBar";

function JVList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [journalall, setJournalAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const targetPath = URL;

  const vJournal_All = {
    viewName: "vJournal_All",
    parameters: [
        // { field: "AccDocNo", value: "JV%" }, // การกรองข้อมูล
    //   // { field: "DocStatus", value: "0" },
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
      { sourceField: "DocNo" },
      { sourceField: "Seq" },
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
      { sourceField: "ItemNo" },
      { sourceField: "AccCode" },
      { sourceField: "AccName" },
      { sourceField: "AccMainCode" },
      { sourceField: "AccMainCodeName" },
      { sourceField: "AccRemark" },
      { sourceField: "AccDesc" },
      { sourceField: "Debit" },
      { sourceField: "Credit" },
      { sourceField: "AccTypeID" },
      { sourceField: "DText1" },
      { sourceField: "DDate1" },
      { sourceField: "DNum1" },
      { sourceField: "DText2" },
      { sourceField: "DDate2" },
      { sourceField: "DNum2" },
      { sourceField: "DText3" },
      { sourceField: "DDate3" },
      { sourceField: "DNum3" },
      { sourceField: "DText4" },
      { sourceField: "DDate4" },
      { sourceField: "DNum4" },
      { sourceField: "DText5" },
      { sourceField: "DDate5" },
      { sourceField: "DNum5" },
      { sourceField: "DText6" },
      { sourceField: "DDate6" },
      { sourceField: "DNum6" },
      { sourceField: "DText7" },
      { sourceField: "DDate7" },
      { sourceField: "DNum7" },
      { sourceField: "DText8" },
      { sourceField: "DDate8" },
      { sourceField: "DNum8" },
      { sourceField: "DText9" },
      { sourceField: "DDate9" },
      { sourceField: "DNum9" },
      { sourceField: "DText10" },
      { sourceField: "DDate10" },
      { sourceField: "DNum10" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vJournal_All:", vJournal_All);
        setLoading(true);
        const response = await axios.post(
          `${API_VIEW_RESULT}`,
          vJournal_All,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vJournal_All", response.data);
          const allData = response.data;
          
          // 2. กรองข้อมูลด้วย JavaScript
          const filteredData = allData.filter(item => 
            item.JournalNo && item.JournalNo.startsWith("JV")
          );
          setJournalAll(
            filteredData.sort((a, b) => b.JournalNo.localeCompare(a.JournalNo))
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
  const filtered = journalall.filter((transaction) => {
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
    // navigate(`/uitestacc/PVDTList?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
    navigate(`/uitestacc/PVHeader?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
  };

  const handleDetailClick = (filtered) => {
    dispatch(setAccDocNo(filtered.JournalNo));
    // dispatch(setAccDocNo(filtered.AccCode));
    dispatch(setPartyName(filtered.Description));
    dispatch(setAccDocType(filtered.Debit));
    dispatch(setStatusName(filtered.Credit));
    navigate(`/uitestacc/JVDTList?journalNo=${filtered.JournalNo}`); // นำทางไปยัง DOHeader
  };

    const handlePrint = async (filtered) => {
     dispatch(setAccDocNo(filtered.JournalNo));
      const GL = "GL"; // กำหนดค่า PR ให้ถูกต้อง
      // const accDocType = formData.accDocType;
    //   const journalNo = formData.journalNo;
      console.log("AccDocNo:", filtered.JournalNo);
      const printUrl = `${REPORT_BASE}/form?Form=Form${GL}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${filtered.JournalNo}`;
      // const printUrl = `${REPORT_BASE}/Form?Form=Form${accDocType}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${accDocNo}`;
      window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
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
  
//    const handlePrint = async (filtered) => {
//     const GL = "GL"; 
//     // const accDocType = formData.accDocType;
//     // const accDocNo = Data.accDocNo;
//     console.log("JournalNo:", filtered.JournalNo);
//     const printUrl = `http://203.154.140.51/accreport/form?Form=Form${GL}&Code=${filtered.JournalNo}`;
//     window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
//   };

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
        Journal Voucher
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
                 <FontAwesomeIcon
                icon={faPrint}
                size="2x"
                style={{ color: "#e56107" }}
                onClick={() => handlePrint(transaction)} 
              />
              {/* <FontAwesomeIcon
                icon={faChevronRight}
                size="2x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              /> */}
              <div>
                <h5
                  style={{ marginTop: "5px", marginLeft: "10px" }}
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
              {/* <i style={{ color: "#2d01bd" }}>edit&nbsp;</i>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="1x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              /> */}
            </ListItem>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
          </div>
        ))}
      </ul>
      <div style={{padding:"30px"}}>&nbsp;</div>
      {/* <div className="row" style={{ display: "flex" }}>
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
              color: "#013898",
              cursor: "pointer",
              display: "grid",
              justifyItems: "end",
            }}
            onClick={scrollToTop}
          />
        </div>
      </div> */}
      <FloatingActionBar backPath={URL}/>
    </div>
  );
}

export default JVList;
