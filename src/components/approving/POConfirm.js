import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowUp,
  faCircleArrowLeft,
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
import Chip from "@mui/material/Chip";
import Swal from "sweetalert2";

function POConfirm() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocNo, setSelectedDocNo] = useState(null);
  const [approvedStatus, setApprovedStatus] = useState({});
  const [poNo, setPoNo] = useState("");

  const vPO_H = {
    viewName: "vPO_H",
    parameters: [
      { field: "AccDocType", value: "PO" }, // การกรองข้อมูล
      { field: "DocStatus", value: "0" },
    ],
    results: [
      { sourceField: "AccDocNo" },
      { sourceField: "PartyName" },
      { sourceField: "AccEffectiveDate" },
      { sourceField: "DocStatus" },
      { sourceField: "TotalNet" },
      { sourceField: "AccDocType" },
      { sourceField: "StatusName" },
      { sourceField: "AccBatchDate" },
      { sourceField: "PartyCode" },
      { sourceField: "PartyTaxCode" },
      { sourceField: "PartyAddress" },
      { sourceField: "IssueBy" },
      { sourceField: "AccPostDate" },
      { sourceField: "FiscalYear" },
      { sourceField: "DocRefNo" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vPO_H:", vPO_H);
        setLoading(true);
        const response = await axios.post(
          "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
          vPO_H,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data_vPO_H", response.data);
          setTransactionAll(
            response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
          ); // เรียงลำดับข้อมูลจากมากไปน้อย
          // Initialize approvedStatus
          const initialApprovedStatus = {};
          response.data.forEach((item) => {
            initialApprovedStatus[item.AccDocNo] = false;
          });
          setApprovedStatus(initialApprovedStatus);
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
  const filteredPO = transactionall.filter((transaction) => {
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

  const groupedTransactions = filteredPO.reduce((acc, transaction) => {
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

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAppove = async (transaction) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0]; // ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
      const dataToSend = {
        ...transaction,
        docStatus: 1,
        accPostDate: currentDate,
      }; // อัปเดต docStatus และ accPostDate
      // const dataToSend = { ...transaction, docStatus: 1 }; // อัปเดต docStatus เป็น 1
      const accDocNo = transaction.AccDocNo;

      const response = await fetch(
        `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/EditAccTransactionHD`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      console.log("Data updated successfully");
      // alert(`Appove: ${transaction.AccDocNo} `);
      Swal.fire({
        icon: "success",
        title: `Appove: ${transaction.AccDocNo}`,
        showConfirmButton: false,
        timer: 2000,
      });
      setApprovedStatus((prevStatus) => ({
        ...prevStatus,
        [accDocNo]: true,
      }));
      // await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("กรุณาลองใหม่");
    }
  };

  // const handlePO = async (accDocNo) => {
  //   try {
  //     const currentDate = new Date();
  //     const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

  //     const formData = {
  //       name: "Insert_POFromPR",
  //       parameters: [
  //         {
  //           param: "prno",
  //           value: accDocNo,
  //         },
  //         {
  //           param: "docdate",
  //           value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
  //         },
  //         {
  //           param: "duedate",
  //           value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
  //         },
  //         // {
  //         //   param: "refno",
  //         //   value: "",
  //         // },
  //         {
  //           param: "refno",
  //           value: accDocNo, // ส่งเลขPRเป็นเลขเเท็กเอกสาร
  //         },
  //         {
  //           param: "userid",
  //           value: "ADMIN", //ต้องแก้เมื่อทำระบบlogin
  //         }// ,
  //         // {
  //         // param: "itemno", //ถ้าไม่ส่งitemno จะนำPRทุกitemno,ponoไปทำPO param ไว้ใช้ตอนคีย์เอกสารนอกที่ไม่ใช่เอสกสารจากบัญชี
  //         //   value: 0,
  //         // },
  //         // {
  //         //   param: "pono",
  //         //   value: "",
  //         // },
  //       ],
  //     };
  //     console.log("formData:", formData);

  //     const response = await axios.post(
  //       "http://103.225.168.137/apiaccbk2/api/Prototype/StoredProcedures/GetResult/",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {

  //       // if (response.data && response.data.length > 0 && response.data[0] && response.data[0].PONo) {
  //         console.log("PO Header create successfully");
  //         console.log("PO:", response.data.data[0].PONo);
  //         // setPoNo(response.data.data.PONo); // อัปเดต state poNo
  //         Swal.fire({
  //           icon: "success",
  //           title: `Created PO: ${response.data.data[0].PONo}`, // ใช้ค่า poNo จาก state
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //         navigate(`/uitestacc/POHeader?accDocNo=${response.data.data[0].PONo}`);
  //       // } else {
  //       //   console.error("Error: Invalid response data", response.data);
  //       //   alert("เกิดข้อผิดพลาด: ข้อมูลตอบกลับไม่ถูกต้อง");
  //       // }
  //     } else {
  //       console.error("Error creating PO Header:", response.status, response.statusText);
  //       alert(`สร้าง PO Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${response.status})`);
  //     }
  //   } catch (error) {
  //     console.error("Error creating PO Header:", error);
  //     alert("เกิดข้อผิดพลาดในการสร้าง PO Header: " + error.message);
  //   }
  // };

  const handleGoBack = () => {
    navigate("/uitestacc/MenuCardAP/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Approve Purchase Order</h2>
      <div style={{ display: "flex" }}>
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
              {!approvedStatus[transaction.AccDocNo] && (
                <Chip
                  label="APPROVE"
                  variant="outlined"
                  color="success"
                  onClick={() => handleAppove(transaction)}
                />
              )}
              {/* {approvedStatus[transaction.AccDocNo] && (
                <Chip
                  label="Create PO"
                  // variant="outlined"
                  color="warning"
                  onClick={() => handlePO(transaction.AccDocNo)}
                />
              )} */}
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

export default POConfirm;
