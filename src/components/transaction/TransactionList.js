import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPrint,
  faPlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../purchase/SearchComponen";
import Status from "../purchase/Status";
import { useNavigate } from "react-router-dom";
import {
  setAccDocNotran,
  setAccDocNo,
  setPartyName,
  setAccDocType,
} from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { API_VIEW_RESULT } from "../api/url";

function TransactionList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vTransaction_All = {
    viewName: "vTransaction_All",
    parameters: [
      // { field: "AccDocType", value: "PR" }, // การกรองข้อมูล
      // { field: "DocStatus", value: "0" },
    ],
    results: [
      { sourceField: "AccDocNo" },
      { sourceField: "PartyName" },
      { sourceField: "AccEffectiveDate" },
      { sourceField: "DocStatus" },
      { sourceField: "Amount" },
      { sourceField: "AccDocType" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vTransaction_All:", vTransaction_All);
        setLoading(true);
        const response = await axios.post(
          // "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
          API_VIEW_RESULT,
          vTransaction_All,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vTransaction_All", response.data);
          setTransactionAll(
            // response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
            response.data.sort((a, b) => b.AccEffectiveDate.localeCompare(a.AccEffectiveDate))
        
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
  const filteredTransactions = transactionall.filter((transaction) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    const searchNumber = parseFloat(searchTerm);
    return (
      transaction.AccDocNo.toLowerCase().includes(searchLower) ||
      transaction.PartyName.toLowerCase().includes(searchLower) ||
      (typeof transaction.Amount === "number" &&
        transaction.Amount === searchNumber)
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

  const handlePrint = (filteredTransactions) => {
    dispatch(setAccDocNotran(filteredTransactions.AccDocNo));
    navigate(`/uitestacc/TransactionPrint?accDocNo=${filteredTransactions.AccDocNo}`);
  };

    const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
      const existingTransaction = acc.find(item => item.AccDocNo === transaction.AccDocNo);
      if (existingTransaction) {
          existingTransaction.Amount += transaction.Amount;
      } else {
          acc.push({ ...transaction });
      }
      return acc;
  }, []);

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Transaction List</h2>
      <div style={{ display: "flex" }}>
        <div>
          {/* <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          /> */}
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
              <FontAwesomeIcon icon={faPrint} size="2x" style={{color:"#6700b7"}} onClick={() => handlePrint(transaction)}/>
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
                  <h4>{formatNumber(transaction.Amount)}</h4>
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
    </div>
  );
}

export default TransactionList;
