import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
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

function SIHDList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vAR_H = {
    viewName: "vAR_H",
    parameters: [
    //   { field: "AccDocType", value: "SI" }, // การกรองข้อมูล
      // { field: "DocStatus", value: "0" },
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
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vAR_H:", vAR_H);
        setLoading(true);
        const response = await axios.post(
          "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
          vAR_H,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vAR_H", response.data);
          setTransactionAll(
            response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
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
      transaction.AccDocNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.TotalNet === "number" &&
        transaction.TotalNet === searchNumber)
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
    dispatch(setAccDocNo(filtered.AccDocNo));
    dispatch(setPartyName(filtered.PartyName));
    dispatch(setAccDocType(filtered.AccDocType));
    dispatch(setStatusName(filtered.StatusName));
    navigate(`/uitestacc/SIHeader?accDocNo=${filtered.AccDocNo}`); // นำทางไปยัง DOHeader
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
    const accDocType = "SI";
    dispatch(setAccDocType(accDocType));
    navigate(`/uitestacc/SIHeader?accDocType=${accDocType}`, {
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
    navigate("/uitestacc/MenuCardFC/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Sale Invoice</h2>
      <div style={{ display: "flex" }}>
        <div>
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          />
        </div>
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
                icon={faPenToSquare}
                size="2x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              />
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                  &nbsp; {transaction.AccDocNo}&nbsp;
                  <Status status={transaction.DocStatus} />
                </h5>
                <p>
                  &nbsp; &nbsp; {transaction.PartyName}{" "}
                  <i>
                    &nbsp; &nbsp; Date:
                    {formatDate(transaction.AccEffectiveDate)}
                  </i>
                </p>
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
        ))}
      </ul>
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
                color: "#013898",
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

export default SIHDList;
