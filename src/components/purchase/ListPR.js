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
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "./SearchComponen";
import Status from "./Status";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNo,
  setPartyName,
  setAccDocType,
  setStatusName,

} from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE, URL } from "../api/url";
import { API_VIEW_RESULT } from "../api/url";
import FloatingActionBar from "../DataFilters/FloatingActionBar";

function PurchaseRequisitionList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vPR_H = {
    viewName: "vPR_H",
    parameters: [
      { field: "AccDocType", value: "PR" }, // การกรองข้อมูล
      // { field: "DocStatus", value: "0" },
    ],
    results: [
      { sourceField: "AccDocNo" },
      { sourceField: "PartyName" },
      { sourceField: "AccEffectiveDate" },
      { sourceField: "DocStatus" },
      { sourceField: "TotalNet" },
      { sourceField: "AccDocType" },
      { sourceField: "StatusName" },
      //   { sourceField: "AccDocNo"}
      //   ,{ sourceField: "AccBatchDate"}
      //   ,{ sourceField: "AccEffectiveDate"}
      //   ,{ sourceField: "PartyCode"}
      //   ,{ sourceField: "PartyTaxCode"}
      //   ,{ sourceField: "PartyName"}
      //   ,{ sourceField: "PartyAddress"}
      //   ,{ sourceField: "IssueBy"}
      //   ,{ sourceField: "AccDocType"}
      //   ,{ sourceField: "AccPostDate"}
      //   ,{ sourceField: "FiscalYear"}
      //   ,{ sourceField: "DocStatus"}
      //   ,{ sourceField: "DocRefNo"}
      //   ,{ sourceField: "TotalAmount"}
      //   ,{ sourceField: "TotalVa"}
      //   ,{ sourceField: "TotalWht"}
      //   ,{ sourceField: "TotalNet"}
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vPR_H:", vPR_H);
        setLoading(true);
        const response = await axios.post(
          API_VIEW_RESULT,
          vPR_H,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vPR_H", response.data);
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
  const filteredPR = transactionall.filter((transaction) => {
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

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleEditClick = (filteredPR) => {
    dispatch(setAccDocNo(filteredPR.AccDocNo));
    dispatch(setPartyName(filteredPR.PartyName));
    dispatch(setAccDocType(filteredPR.AccDocType));
    dispatch(setStatusName(filteredPR.StatusName));
    navigate(`/uitestacc/PRHeader?accDocNo=${filteredPR.AccDocNo}`); // นำทางไปยัง PRHeader
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
    navigate(`/uitestacc/PRHeader?accDocType=${accDocType}`, {
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
    navigate("/uitestacc/MenuCardPC/");
  };
  const handleGoMenu = () => {
    navigate(URL);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoMenu}>&nbsp;Purchase Requisition&nbsp;</h2>
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
      {/* <ul>
        {filteredPR  &&
          Array.isArray(filteredPR ) &&
          filteredPR.map((filteredPR , accDocNo) => (
            <div className="row" key={accDocNo}>
              <ListItem style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="2x"
                  style={{ color: "#2d01bd" }}
                  onClick={() =>handleEditClick(filteredPR)}
                />
                <div>
                  <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                    &nbsp; {filteredPR.AccDocNo}&nbsp;<Status status={filteredPR.DocStatus} />
                  </h5>
                  <p>&nbsp; &nbsp; {filteredPR.PartyName} <i>&nbsp; &nbsp; Date:{formatDate(filteredPR.AccEffectiveDate)}</i></p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div style={{ display: "flex" }}>
                    <h4>{filteredPR.TotalNet}</h4>
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
      </ul> */}

      <ul>
        {groupedTransactions.map((transaction, index) => (
          <div className="row" key={index}
            onClick={() => handleEditClick(transaction)}
            onMouseDown={() => setActiveIndex(index)}
            onMouseUp={() => setActiveIndex(null)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
              background: activeIndex === index ? "#e0e0e0" : "transparent",
              cursor: "pointer",
              borderRadius: "6px",
            }}>
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              {/* <FontAwesomeIcon
                icon={faPenToSquare}
                size="2x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(transaction)}
              /> */}
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                  {transaction.AccDocNo}&nbsp;
                  <Status status={transaction.DocStatus} />
                </h5>
                <h6 style={{ marginBottom: "1px" }}>
                  &nbsp; {transaction.PartyName}{" "}
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
        ))}
      </ul>
      <div>&nbsp;</div>
      <FloatingActionBar backPath="/uitestacc/" />
    </div>
  );
}

export default PurchaseRequisitionList;