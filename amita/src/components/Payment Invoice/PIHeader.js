import React, { useState, useEffect } from "react";
import axios from "../../components/Auth/axiosConfig";
import { useAuthFetch } from "../../components/Auth/fetchConfig";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faAngleRight,
  faAnglesRight,
  faHouseMedicalCircleCheck,
  faPen,
  faTrash,
  faFloppyDisk,
  faListUl,
  faRectangleList,
  faEllipsisVertical,
  faPlus,
  faCircleArrowLeft,
  faPrint,
  faD,
  faI,
  faP,
  faV,
  faTruckRampBox,
  faTicket,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { setAccDocNo, setAccDocType } from "../redux/TransactionDataaction";
import { useSelector } from "react-redux";
import {
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import IconButton from "../purchase/Purchase Order/Iconbutton";
// import ScrollTop from "../purchase/Purchase Order/ScrollTop";
import { DIfromPO } from "../purchase/Purchase Order/DIfromPO";
import { PVfromPI } from "./PVFromPI";
import { API_BASE, BASE, DATA_BASE, REPORT_BASE } from "../api/url";
import { GetGLTemplate } from "../purchase/Purchase Order/GetGLTemplate";
import GLTemplateModal from "../purchase/Purchase Order/GLTemplateModal";
import { FaDochub, FaDocker } from "react-icons/fa";
// import { PVfromPO } from "../purchase/Purchase Order/PVFromPO";
// import { PIfromPO } from "../purchase/Purchase Order/PIFromPO";

export default function PIHeader() {
  const AccDocNo = useSelector((state) => state.accDocNo); // ดึงข้อมูล transaction จาก Store
  const PartyName = useSelector((state) => state.partyName);
  const AccEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const DocStatus = useSelector((state) => state.docStatus);
  const amount = useSelector((state) => state.amount);
  const AccDocType = useSelector((state) => state.accDocType);
  const statusName = useSelector((state) => state.statusName);

  const DocRefNo = useSelector((formData) => formData.docRefNo);
  const location = useLocation();
  const authFetch = useAuthFetch();
  const [doctype, setDoctype] = React.useState("");
  const [formData, setFormData] = useState({
    // เก็บข้อมูลในฟอร์ม
    accDocType: "",
    accDocNo: "",
    accEffectiveDate: new Date().toISOString().slice(0, 10),
    partyCode: "",
    partyTaxCode: "",
    partyName: "",
    partyAddress: "",
    docRefNo: "",
    docStatus: "",
    accBatchDate: new Date().toISOString().slice(0, 10),
    issueBy: "",
    accPostDate: new Date().toISOString().slice(0, 10),
    fiscalYear: new Date().toISOString().slice(0, 10),
  });
  const [selectedDocConfigID, setSelectedDocConfigID] = useState(null);
  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setDoctype(selectedCategory); // อัปเดตค่า doctype

    const selectedOption = categoryOptions.find(
      (option) => option.value === selectedCategory
    );
    if (selectedOption) {
      setSelectedEName(selectedOption.label);
      setSelectedDocConfigID(selectedOption.docConfigID);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const PI = "PI";
  // const SR = "SR";
  // const PI = "PI";
  // const SI = "SI";

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedEName, setSelectedEName] = useState("");

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig`;
        const response = await authFetch(categoryApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (Array.isArray(data)) {
          setCategoryOptions(
            data.map((item) => ({ value: item.category, label: item.eName }))
          );
        } else {
          console.error("Category API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCategoryOptions();
  }, []);

  useEffect(() => {
    if (AccDocType && categoryOptions.length > 0) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === AccDocType
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
        setSelectedDocConfigID(matchedOption.docConfigID);
      } else {
        setSelectedEName("");
      }
    } else {
      setSelectedEName("");
    }
  }, [AccDocType, categoryOptions]);

  const [showButton, setShowButton] = useState(false);
  const [accDocNoFromApi, setAccDocNoFromApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiData, setApiData] = useState(null);

  const fetchDataFromApi = async (AccDocType) => {
    try {
      // สร้าง URL ของ API ตามประเภทเอกสาร (doctype)
      const apiUrl = `${API_BASE}/AccTransaction/GetAccTransactionHD?accDocType=${AccDocType}`;

      const response = await authFetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data form accdoctype:", data);

      if (Array.isArray(data) && data.length > 0) {
        setApiData(data); // Update state ด้วยข้อมูลจาก API

        // เรียงลำดับข้อมูลจากล่าสุดไปหาข้อมูลก่อนหน้า
        data.sort((a, b) => {
          const accDocNoA = a.accDocNo;
          const accDocNoB = b.accDocNo;
          return accDocNoB.localeCompare(accDocNoA); // เปรียบเทียบ string จากมากไปน้อย
        });

        console.log("apiData:", apiData); // ตรวจสอบ apiData
        console.log("currentIndex:", currentIndex); // ตรวจสอบ currentIndex
        console.log("formData:", formData); // ตรวจสอบ formData
      } else {
        // setApiData([]); // ล้างข้อมูลใน apiData state
        setCurrentIndex(0);
        setFormData({
          accDocType: "",
          accDocNo: "",
          accEffectiveDate: new Date().toISOString().slice(0, 10),
          partyCode: "",
          partyTaxCode: "",
          partyName: "",
          partyAddress: "",
          docRefNo: "",
          docStatus: "",
          accBatchDate: new Date().toISOString().slice(0, 10),
          issueBy: "",
          accPostDate: new Date().toISOString().slice(0, 10),
          fiscalYear: new Date().toISOString().slice(0, 10),
        });
      }
      console.log("DataDoc:", data[0].accDocNo);
      console.log("DataDocS:", data[0].docStatus);
      setAccDocNoFromApi(data[0].accDocNo);

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("ไม่มีข้อมูล",doctype)
      // จัดการ error เช่น แสดงข้อความให้ผู้ใช้
      // throw error; // โยน error ต่อไปเพื่อให้ handleDetail จัดการ
    }
  };

  useEffect(() => {
    if (AccDocType) {
      fetchDataFromApi(AccDocType);
    }
  }, [AccDocType]);
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      // เรียงลำดับข้อมูลจากล่าสุดไปหาข้อมูลก่อนหน้า
      const sortedData = [...apiData].sort((a, b) => {
        const accDocNoA = a.accDocNo;
        const accDocNoB = b.accDocNo;
        return accDocNoB.localeCompare(accDocNoA); // เปรียบเทียบ string จากมากไปน้อย
      });

      // ค้นหา AccDocNo ในข้อมูลที่เรียงลำดับแล้ว
      const matchedIndex = sortedData.findIndex(
        (item) => item.accDocNo === AccDocNo
      );
      if (matchedIndex !== -1) {
        setCurrentIndex(matchedIndex);
      } else {
        setCurrentIndex(0); // แสดงข้อมูลแรกถ้าไม่พบ accDocNo ที่ตรงกัน
      }

      console.log("apiData (sorted):", sortedData); // ตรวจสอบ apiData ที่เรียงลำดับแล้ว
      console.log("currentIndex:", currentIndex); // ตรวจสอบ currentIndex
      console.log("AccDocNo:", AccDocNo); // ตรวจสอบ AccDocNo
    }
  }, [AccDocNo, apiData]);

  useEffect(() => {
    if (
      apiData &&
      apiData.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < apiData.length
    ) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const datePart = dateString.split("T")[0]; // แยกส่วนวันที่ออกจากส่วนเวลา
        return datePart;
      };
      if (currentIndex >= apiData.length) {
        setCurrentIndex(apiData.length - 1); // ปรับ currentIndex ให้ชี้ไปยังข้อมูลสุดท้าย
      } else if (currentIndex < 0) {
        setCurrentIndex(0); // ปรับ currentIndex ให้ชี้ไปยังข้อมูลแรก
      }
      // อัปเดตค่าในฟอร์มด้วยข้อมูลจาก API (ถ้ามี)
      setFormData({
        ...formData,
        accDocType: apiData[currentIndex].accDocType || "", // ถ้า API ส่งค่า accDocNo มา ให้ใช้ค่าจาก API, ถ้าไม่ ให้ใช้ค่าว่าง
        accDocNo: apiData[currentIndex].accDocNo || "",
        accBatchDate: formatDate(apiData[currentIndex].accBatchDate) || "",
        accEffectiveDate:
          formatDate(apiData[currentIndex].accEffectiveDate) || "",
        partyCode: apiData[currentIndex].partyCode || "",
        partyTaxCode: apiData[currentIndex].partyTaxCode || "",
        partyName: apiData[currentIndex].partyName || "",
        partyAddress: apiData[currentIndex].partyAddress || "",

        docRefNo: apiData[currentIndex].docRefNo || "",
        docStatus: Number(apiData[currentIndex].docStatus) || "0",
        issueBy: apiData[currentIndex].issueBy || "",
        accPostDate: formatDate(apiData[currentIndex].accPostDate) || "",
        fiscalYear: formatDate(apiData[currentIndex].fiscalYear) || "",
      });
      console.log("formData:", formData);
    }
  }, [currentIndex, apiData]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = Math.min(prevIndex + 1, apiData.length - 1);
      console.log("Next index:", nextIndex); // ตรวจสอบ nextIndex
      return nextIndex;
    });
  };

  const goToLast = () => {
    setCurrentIndex(apiData.length - 1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToFirst = () => {
    setCurrentIndex(0);
  };
  const isNavigationDisabled = () => {
    const disabled = !doctype || !apiData || apiData.length === 0;
    // console.log("Navigation disabled:", disabled); // ตรวจสอบค่า disabled
    return disabled;
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const dataToSend = { ...formData };
      // ลบ accDocNo
      delete dataToSend.accDocNo;
      // ตรวจสอบว่า docStatus มีค่าหรือไม่ ถ้าไม่มีให้ใส่ค่าเริ่มต้น
      if (!dataToSend.docStatus) {
        dataToSend.docStatus = 0; // หรือค่าเริ่มต้นอื่นๆ ที่เหมาะสม
      }
      // ตรวจสอบ accPostDate และแก้ไขถ้าจำเป็น
      if (dataToSend.accPostDate === "1900-01-01" || !dataToSend.accPostDate) {
        dataToSend.accPostDate = new Date().toISOString().split("T")[0]; // หรือวันที่ที่ถูกต้องอื่นๆ
      }

      const regex = /^[0-9]{13}$/;

      if (!regex.test(formData.partyTaxCode)) {
        alert("PartyTaxCode ต้องเป็นตัวเลข (0-9) 13หลักเท่านั้น");
        return; // หยุดการทำงานของฟังก์ชัน ถ้าข้อมูลไม่ถูกต้อง
      }

      console.log("DATATU:", JSON.stringify(dataToSend));
      const response = await authFetch(
        `${API_BASE}/AccTransaction/SetAccTransactionHD`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other necessary headers (e.g., authorization)
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the server
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
      // Optionally, you can reset the form or update the UI after a successful save
      alert("บันทึกข้อมูลสำเร็จ");
      await fetchDataFromApi(doctype);
      // ดึงค่า accDocNo และวันที่ที่ต้องการ
      const accDocNo = responseData.accDocNo;
      const accEffectiveDate = formData.accEffectiveDate;
      const partyCode = formData.partyCode;
      const partyName = formData.partyName;
      const nameCategory = selectedEName;
      console.log("nameEDoc:", selectedEName);

      navigate(`/uitestacc/PIDTList?accDocNo=${accDocNo}`, {
        state: {
          accDocNo: accDocNo,
          accEffectiveDate: accEffectiveDate,
          partyCode: partyCode,
          partyName: partyName,
          nameCategory: nameCategory,
        },
      });
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle errors, e.g., display an error message to the user
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleUpdate = async () => {
    console.log("Updated action from PIHeader");
    try {
      const dataToSend = { ...formData };
      const accDocNo = formData.accDocNo;

      // ตรวจสอบข้อมูลก่อนส่ง
      // const regex = /^[0-9]{13}$/;
      // if (!regex.test(formData.partyTaxCode)) {
      //   alert("PartyTaxCode ต้องเป็นตัวเลข (0-9) 13 หลักเท่านั้น");
      //   return;
      // }

      const response = await authFetch(
        `${API_BASE}/AccTransaction/EditAccTransactionHD`,
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

      alert("แก้ไขข้อมูลสำเร็จ");
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };
  // const dialogs = useDialogs();
  // const [isDeleting, setIsDeleting] = React.useState(false);
  const handleCancel = async () => {
    try {
      const dataCancel = { ...formData, docStatus: 99 };
      const accDocNo = formData.accDocNo;

      // ตรวจสอบข้อมูลก่อนส่ง
      const regex = /^[0-9]{13}$/;
      if (!regex.test(formData.partyTaxCode)) {
        alert("PartyTaxCode ต้องเป็นตัวเลข (0-9) 13 หลักเท่านั้น");
        return;
      }

      const response = await authFetch(
        `${API_BASE}/AccTransaction/EditAccTransactionHD`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataCancel),
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

      console.log("Data Cancel successfully");

      alert("ยกเลิกข้อมูลสำเร็จ");
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("ยกเลิกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleDelete = async () => {
    //ไม่ควรใช้
    try {
      const accDocNo = formData.accDocNo;

      const response = await authFetch(
        `${API_BASE}/AccTransaction/DeleteAccTransactionHD/${accDocNo}`,
        {
          method: "DELETE",
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

      console.log("Data deleted successfully");
      alert("ลบข้อมูลสำเร็จ");
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleDetail = async () => {
    try {
      await fetchDataFromApi(doctype); // รอผลลัพธ์จาก fetchDataFromApi

      // const accDocNo = accDocNoFromApi; // เข้าถึง accDocNo จาก state
      const accDocNo = formData.accDocNo;
      const accEffectiveDate = formData.accEffectiveDate;
      const partyCode = formData.partyCode;
      const partyName = formData.partyName;
      const nameCategory = selectedEName;
      // navigate(`/uitestacc/TransactionDT?accDocNo=${accDocNo}`, {
      navigate(`/uitestacc/PIDTList?accDocNo=${accDocNo}`, {
        state: {
          accDocNo: accDocNo,
          accEffectiveDate: accEffectiveDate,
          partyCode: partyCode,
          partyName: partyName,
          nameCategory: nameCategory,
        },
      });
    } catch (error) {
      // จัดการ error ที่อาจเกิดขึ้นจาก fetchDataFromApi
      console.error("Error in handleDetail:", error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.isNew) {
      handleNew(); // เรียกใช้ handleNew ถ้า isNew เป็น true
    }
  }, [location.state]);
  const handleNew = () => {
    setFormData({
      accDocType: PI,
      accDocNo: "PI25xx...",
      accEffectiveDate: new Date().toISOString().slice(0, 10),
      partyCode: "",
      partyTaxCode: "",
      partyName: "",
      partyAddress: "",
      docRefNo: "",
      docStatus: 0,
      accBatchDate: new Date().toISOString().slice(0, 10),
      issueBy: "admin", //แก้เมื่อทำระบบlogin
      accPostDate: new Date().toISOString().slice(0, 10),
      fiscalYear: new Date().toISOString().slice(0, 10),
    });
  };

  // ---------------------
  const [customerOptions, setCustomerOptions] = useState([]); // state สำหรับข้อมูลจาก API Customer
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchCustomerOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/Customer/GetCustomer`
        );
        setCustomerOptions(response.data); // อัปเดต state Customer
      } catch (error) {
        console.error("Error fetching Customer options:", error);
      }
    };
    fetchCustomerOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCustomerSelect = (partyCode) => {
    const selectedCustomer = customerOptions.find(
      (customer) => customer.customerCode === partyCode
    );

    if (selectedCustomer) {
      setFormData({
        ...formData,
        partyCode: partyCode,
        partyTaxCode: selectedCustomer.taxNumber,
        partyName: selectedCustomer.customerEName,
        partyAddress: selectedCustomer.address1,
      });
    }

    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return customerOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  const docStatus = formData.docStatus;
  // หน้า ใบแจ้งค่าใช้จ่าย PI ปุ่ม จ่ายเงิน/จ่ายชำระเงิน
  const handlePV = async (AccDocNo) => {
    // const userId = "admin"; // หรือจะดึงจากระบบ login
    const DocRefNo = formData.docRefNo;
    await PVfromPI(AccDocNo, DocRefNo, navigate);
    navigate({
      state: { AccDocNo, DocRefNo },
    });
  };

  // -------------------------------
    const [showModal, setShowModal] = useState(false);
    const [glData, setGLData] = useState(null);
      // ฟังก์ชันนี้จะถูกเรียกเมื่อต้องการดู GL Template 
    const docConfigID = selectedDocConfigID; 
    const handleGL = async (AccDocNo, docConfigID) => {  //เบื้องต้นดูได้อย่า่งเดียว ยังไม่ได้ส่งไปJNได้
      console.log("Modal", AccDocNo); // ตรวจสอบค่า AccDocNoC
      console.log("Modal", docConfigID); // ตรวจสอบค่า docConfigID
        const response = await GetGLTemplate(AccDocNo, docConfigID);
        if (response && response.data) {
            console.log("GL Template Data received, setting showModal to true.");
            setGLData(response.data); // set เฉพาะ array
            setShowModal(true);       // เปิด Modal
        } 
  };
  // -------------------------------

  const handlePrint = async () => {
    // const PR = "PR"; // กำหนดค่า PR ให้ถูกต้อง
    const accDocType = formData.accDocType;
    const accDocNo = formData.accDocNo;
    console.log("AccDocNo:", accDocNo);
     const printUrl = `${REPORT_BASE}/form?Form=Form${accDocType}&DB=${DATA_BASE}&Code=${accDocNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/PIList/`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2 style={{ textAlign: "center" }}>Purchase Invoice</h2>
      <div style={{ display: "flex" }}>
        <div className="col-1" style={{ cursor: "pointer", display: "grid" }}>
          <FontAwesomeIcon
            icon={faRectangleList}
            size="2x"
            style={{ color: "#e56107" }}
            onClick={handleDetail}
          />
        </div>
        <div
          className="col-1"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid" }}
        >
          <FontAwesomeIcon
            icon={faFloppyDisk}
            size="2x"
            style={{ color: "green" }}
            onClick={handleSave}
          />
        </div>

        <div
          className="col-2"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid" }}
        >
          <FontAwesomeIcon
            icon={faPrint}
            size="2x"
            style={{ color: "blue" }}
             onClick={handlePrint}
          />
        </div>
        <div
          className="col-1"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid" }}
        >
          <FontAwesomeIcon
            icon={faFileInvoice}
            size="2x"
            style={{ color: "green" }}
            onClick={() => handleGL(AccDocNo, docConfigID)}
          />
        </div>
        <GLTemplateModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          data={glData}
        />
        {/* {docStatus ===1 &&( */}
        {/* <div
          className="col-3"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid",display:"flex" }}
         onClick={()=>handleDI(AccDocNo,navigate)}
        >
          <FontAwesomeIcon
            icon={faD}
            size="2xs"
            style={{ color: "#ff7f00" }}
          />
          <FontAwesomeIcon
            icon={faI}
            size="2xs"
            style={{ color: "#ff7f00" }}
            //  onClick={handleDI}
          />
          <FontAwesomeIcon 
            icon={faTruckRampBox}
            size="2x"
            style={{ color: "#ff7f00" }}/>
        </div> */}
        {/* )} */}
        {docStatus == !1 && (
          <div
            className="col-3"
            style={{
              paddingLeft: "10px",
              cursor: "pointer",
              display: "grid",
              display: "flex",
            }}
            //  onClick={handlePIPV} //ซื้อสด/จ่ายชำระเงิน
            onClick={() => handlePV(AccDocNo, DocRefNo, navigate)}
          >
            <FontAwesomeIcon
              icon={faP}
              size="2xs"
              style={{ color: "#f94f01" }}
            />
            <FontAwesomeIcon
              icon={faV}
              size="2xs"
              style={{ color: "#f94f01" }}
            />
            <FontAwesomeIcon
              icon={faTicket}
              size="2x"
              style={{ color: "#f94f01" }}
            />
          </div>
        )}
        {/* {docStatus ==!1 &&( */}
        {/* <div
          className="col-1"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid",display:"flex" }}
        //  onClick={handlePI} //ซิ้อเช่ื่อ/รับวางบิล
         onClick={()=>handlePI(AccDocNo)}
        >
          <FontAwesomeIcon
            icon={faP}
            size="2xs"
            style={{ color: "#ed4d04" }}
          />
          <FontAwesomeIcon
            icon={faI}
            size="2xs"
            style={{ color: "#ed4d04" }}
          />
          <FontAwesomeIcon
            icon={faFileInvoice}
            size="2x"
            style={{ color: "#ed4d04" }}
          />
        </div> */}
        {/* )} */}
        {docStatus == !2 && (
          <div
            className="col-1"
            style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="2x"
              style={{ color: "green" }}
              onClick={handleNew}
            />
          </div>
        )}
        {docStatus == !2 && (
          <div
            className="col-1"
            style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
            <FontAwesomeIcon
              icon={faPen}
              size="2x"
              style={{ color: "#72047b" }}
              onClick={handleUpdate}
            />
          </div>
        )}
        {docStatus === "0" && (
          <div
            className="col-1"
            style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size="2x"
              style={{ color: "#ae0000" }}
              onClick={handleCancel}
            />
          </div>
        )}
      </div>
      {/* <div>
        <IconButton //onCopy={handleCopy}
          onCopy={handleNew}
          onSave={handleSave}
          //onPrint={handlePrint}
          //onShare={handleShare}
        />
      </div> */}
      <div>&nbsp;</div>
      <div className="col-md-3">
        <TextField
          className="fonts"
          variant="outlined"
          id="demo-simple-select"
          // onChange={handleChange}
          value={AccDocType}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        ></TextField>
      </div>
      <div className="col-md-9">
        <div>&nbsp;</div>
        <TextField
          className="fonts"
          variant="standard"
          id="demo-simple-select"
          // onChange={handleChange}
          // value={doctype}
          value={selectedEName}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        >
          <MenuItem value={PI}>Purchase Invoice</MenuItem>
        </TextField>
      </div>
      <div>&nbsp;</div>

      <div className="col-md-6">
        <TextField
          id="accDocNo"
          label="AccDocNo"
          value={formData.accDocNo || AccDocNo}
          // value={AccDocNo || ""}
          type="text"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{ width: "100%" }}
          // onChange={handleInputChange}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="accEffectiveDate"
          label="AccEffectiveDate"
          type="date"
          variant="standard"
          value={formData.accEffectiveDate}
          onChange={handleInputChange}
          // defaultValue={new Date().toISOString().slice(0, 10)}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6" style={{ display: "flex" }}>
        <TextField
          id="partyCode"
          label="PartyCode"
          value={formData.partyCode}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="1x"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        />
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            // border: "2px solid #000",
            borderRadius: "30px",
            padding: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <List>
            <h4 style={{ textAlign: "center" }}>Select Customer</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedData().map((customer) => (
              <ListItem key={customer.customerID} disablePadding>
                <ListItemButton
                  onClick={() => handleCustomerSelect(customer.customerCode)}
                >
                  <ListItemText primary={customer.customerCode} />
                  <h5>{customer.customerName}</h5>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <div
            style={{
              display: "flex",
              // justifyContent: "space-between",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(categoryOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                page={currentPage} // กำหนดหน้าปัจจุบัน
                onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
              />
            </Stack>
          </div>
        </div>
      </Modal>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="partyTaxCode"
          label="PartyTaxCode"
          value={formData.partyTaxCode}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-12">
        <TextField
          id="partyName"
          label="PartyName"
          value={formData.partyName}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-12">
        <TextField
          id="partyAddress"
          label="PartyAddress"
          value={formData.partyAddress}
          // type="text"
          multiline
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="docRefNo"
          label="DocRefNo"
          value={formData.docRefNo}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="docStatus"
          label="DocStatus"
          value={formData.docStatus}
          type="number"
          variant="standard"
          onChange={handleInputChange}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="accBatchDate"
          label="AccBatchDate"
          type="date"
          variant="standard"
          value={formData.accBatchDate}
          onChange={handleInputChange}
          // defaultValue={new Date().toISOString().slice(0, 10)}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="issueBy"
          label="IssueBy"
          value={formData.issueBy}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="accPostDate"
          label="AccPostDate"
          value={formData.accPostDate}
          type="date"
          variant="standard"
          style={{ width: "100%" }}
          onChange={handleInputChange}
          // defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="fiscalYear"
          label="FiscalYear"
          value={formData.fiscalYear}
          type="date"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          // defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div>&nbsp;</div>

      <div className="row" style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <div className="col-3">
            <FontAwesomeIcon
              icon={faAnglesRight}
              rotation={180}
              size="2x"
              style={{ color: "#2d01bd" }}
              onClick={goToLast}
              disabled={isNavigationDisabled()}
            />
          </div>
          <div className="col-3">
            <FontAwesomeIcon
              icon={faAngleRight}
              rotation={180}
              size="2x"
              style={{ color: "#2d01bd" }}
              onClick={goToNext}
              disabled={isNavigationDisabled()}
            />
          </div>
          <div className="col-3" style={{ textAlign: "right" }}>
            <FontAwesomeIcon
              icon={faAngleRight}
              size="2x"
              style={{ color: "#2d01bd" }}
              onClick={goToPrevious}
              disabled={isNavigationDisabled()}
            />
          </div>
          <div className="col-3" style={{ textAlign: "right" }}>
            <FontAwesomeIcon
              icon={faAnglesRight}
              size="2x"
              style={{ color: "#2d01bd" }}
              onClick={goToFirst}
              disabled={isNavigationDisabled()}
            />
          </div>
        </div>
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
            {/* <ScrollTop /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
