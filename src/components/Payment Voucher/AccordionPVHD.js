import React, { useState, useEffect, useRef } from "react";
import axios from "../Auth/axiosConfig";
import { useAuthFetch } from "../Auth/fetchConfig";
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
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { setAccDocNo, setAccDocType } from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
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
import { PVfromPI } from "../Payment Invoice/PVFromPI";
import { API_BASE, API_VIEW_RESULT, DATA_BASE, REPORT_BASE } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import MoreInfoHD from "../AdditionData/AdditionDataHD/MoreInfoHD";
import { CancelJournal } from "./CancelJournal";

export default function AccordionPVHD({
  apiData,
  setApiData,
  currentIndex,
  setCurrentIndex,
  setCurrentAccDocNo,
  currentAccDocNo, // <-- new prop
}) {
  const JournalNo = useSelector((state) => state.accDocNo);
  // const AccDocNo = useSelector((state) => state.accDocNo); // ดึงข้อมูล transaction จาก Store
  const PartyName = useSelector((state) => state.partyName);
  const AccEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const DocStatus = useSelector((state) => state.docStatus);
  const amount = useSelector((state) => state.amount);
  const AccDocType = useSelector((state) => state.accDocType);
  const statusName = useSelector((state) => state.statusName);

  const DocRefNo = useSelector((formData) => formData.docRefNo);
  const location = useLocation();
  const authFetch = useAuthFetch();
  const dispatch = useDispatch();
  const isNewMode = location.state && location.state.isNew;

  const [doctype, setDoctype] = React.useState("PV"); // ตั้งค่าเริ่มต้นเป็น PV

  const [formData, setFormData] = useState({
    // เก็บข้อมูลในฟอร์ม
    entryId: 0,
    journalNo: "",
    entryDate: new Date().toISOString().slice(0, 10),
    effectiveDate: new Date().toISOString().slice(0, 10),
    entryBy: "",
    description: "",
    totalDebit: 0,
    totalCredit: 0,
  });

  // --- State for MoreInfoModal ---
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const handleOpenMoreInfoModal = () => setIsMoreInfoModalOpen(true);
  const handleCloseMoreInfoModal = () => setIsMoreInfoModalOpen(false);
  // ---------------------------------
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedDocConfigID, setSelectedDocConfigID] = useState(null);
  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setDoctype(selectedCategory); // อัปเดตค่า doctype

    const selectedOption = categoryOptions.find(
      (option) => option.value === selectedCategory
    );
    if (selectedOption) {
      setSelectedEName(selectedOption.label);
      setSelectedDocConfigID(selectedOption.DocConfigID);
      setSelectedDocType(selectedOption.Category);
      console.log("Selected DocConfigID:", selectedOption.DocConfigID);
      console.log("Selected DocType:", selectedOption.Category);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const DocType = "PV";
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
            data.map((item) => ({ value: item.category, label: item.eName, docConfigID: item.docConfigID }))
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
    if (DocType && categoryOptions.length > 0) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === DocType
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
  }, [DocType, categoryOptions]);

  const [showButton, setShowButton] = useState(false);
  const [journalNoFromApi, setJournalNoFromApi] = useState(null);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // refactored: fetch via view API (vPV_All). If journalNoParam provided, pass as parameter to filter.
  const fetchDataFromApi = async (journalNoParam = null) => {
    if (isNewMode) {
      return;
    }
    try {
      const vPV_All = {
        viewName: "vPV_All",
        parameters: journalNoParam ? [{ field: "JournalNo", value: journalNoParam }] : [],
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

      const response = await axios.post(API_VIEW_RESULT, vPV_All, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        console.error("Error fetching vPV_All:", response.statusText);
        setApiData([]);
        return [];
      }

      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length === 0) {
        setApiData([]);
        setCurrentIndex(0);
        // reset formData to defaults
        setFormData({
          entryId: "",
          journalNo: "",
          entryDate: new Date().toISOString().slice(0, 10),
          effectiveDate: new Date().toISOString().slice(0, 10),
          entryBy: "",
          description: "",
          totalDebit: 0,
          totalCredit: 0,
        });
        return [];
      }

      // sort newest -> oldest by JournalNo
      const sorted = [...data].sort((a, b) => (b.JournalNo || "").localeCompare(a.JournalNo || ""));
      setApiData(sorted);

      // if caller asked for specific journalNo, find index and set currentIndex/formData
      if (journalNoParam) {
        const matchedIndex = sorted.findIndex((it) => (it.JournalNo || it.journalNo) === journalNoParam);
        if (matchedIndex !== -1) {
          setCurrentIndex(matchedIndex);
          const item = sorted[matchedIndex];
          const rawEntryDate = item.EntryDate ?? item.entryDate ?? "";
          const rawEffectiveDate = item.EffectiveDate ?? item.effectiveDate ?? "";
          setFormData((prev) => ({
            ...prev,
            entryId: item.EntryId || item.entryId || "",
            journalNo: item.JournalNo || item.journalNo || "",
            entryDate: rawEntryDate ? rawEntryDate.split("T")[0] : "",
            effectiveDate: rawEffectiveDate ? rawEffectiveDate.split("T")[0] : "",
            entryBy: item.EntryBy || item.entryBy || "",
            description: item.Description || item.description || "",
            totalDebit: Number(item.TotalDebit ?? item.totalDebit) || 0,
            totalCredit: Number(item.TotalCredit ?? item.totalCredit) || 0,
          }));

          // Explicitly dispatch to sync Redux immediately when loaded from URL param
          const matchedJournal = item.JournalNo || item.journalNo || "";
          if (matchedJournal) {
            dispatch(setAccDocNo(matchedJournal));
          }

        } else {
          // keep currentIndex (do not force reset)
        }
      } else {
        // if full list fetch and no currentIndex set, ensure currentIndex valid
        setCurrentIndex((prev) => (prev != null && prev < sorted.length ? prev : 0));
      }

      // expose last fetched journalNo for other logic if needed
      setJournalNoFromApi(sorted[0]?.JournalNo || sorted[0]?.journalNo || null);
      return sorted;
    } catch (error) {
      console.error("Error fetching data via vPV_All:", error);
      setApiData([]);
      return [];
    }
  };

  // โหลดรายการทั้งหมดตอน component mount (อย่าใช้ PV เป็น journalNo)
  useEffect(() => {
    fetchDataFromApi(); // fetch ทั้งหมดเพื่อให้ navigation (Next/Prev) ทำงานได้
  }, []);

  // useEffect(() => {
  //   if (!doctype) {
  //     setDoctype(DocType);
  //   }
  //   if (doctype && !isNewMode) { // เพิ่มเงื่อนไข !isNewMode
  //     fetchDataFromApi(doctype);
  //   }
  // }, [doctype, isNewMode]);


  // add refs to avoid repeatedly resetting currentIndex
  const lastJournalNoRef = useRef(null);
  const initializedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastFetchedRef = useRef(null);

  useEffect(() => {
    // if (isNewMode) {
    //   handleNew();
    //   return;
    // }

    if (!apiData || apiData.length === 0) return;

    // เรียงข้อมูลสำรองสำหรับการค้นหา (ไม่แก้ apiData ต้นฉบับ)
    const sortedData = [...apiData].sort((a, b) => {
      const journalNoA = a.journalNo || "";
      const journalNoB = b.journalNo || "";
      return journalNoB.localeCompare(journalNoA);
    });

    // ถ้ามี JournalNo จาก Redux และแตกต่างจากครั้งก่อน ให้ตั้ง currentIndex ตาม JournalNo
    if (JournalNo && JournalNo !== lastJournalNoRef.current) {
      const matchedIndex = sortedData.findIndex((item) => item.journalNo === JournalNo);
      if (matchedIndex !== -1) {
        setCurrentIndex(matchedIndex);
      } else {
        // ถ้าไม่พบ JournalNo ใน list ให้คงสถานะเดิม (ไม่ reset เป็น 0)
        console.warn("JournalNo not found in list:", JournalNo);
      }
      lastJournalNoRef.current = JournalNo;
      initializedRef.current = true;
      return;
    }

    // กรณีโหลดครั้งแรก (ไม่มี JournalNo เหมาะสม) ให้ตั้งเป็นรายการแรกหนึ่งครั้งเท่านั้น
    if (!initializedRef.current) {
      setCurrentIndex(0);
      initializedRef.current = true;
    }

    // ไม่ตั้ง currentIndex ซ้ำในการ render ถัดไป เพื่อไม่ไปรบกวนการนำทางของผู้ใช้
  }, [JournalNo, apiData]);

  // debug: ดูค่า formData ในทุก render
  console.log("render formData:", formData);

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
        entryId: apiData[currentIndex].entryId || "", // ถ้า API ส่งค่า accDocNo มา ให้ใช้ค่าจาก API, ถ้าไม่ ให้ใช้ค่าว่าง
        journalNo: apiData[currentIndex].journalNo || "",
        entryDate: formatDate(apiData[currentIndex].entryDate) || "",
        effectiveDate: formatDate(apiData[currentIndex].effectiveDate) || "",

        entryBy: apiData[currentIndex].entryBy || "",
        description: apiData[currentIndex].description || "",

        totalDebit: Number(apiData[currentIndex].totalDebit) || "0",
        totalCredit: Number(apiData[currentIndex].totalCredit) || "0",
      });
      console.log("formData:", formData);
    }
  }, [currentIndex, apiData]);

  useEffect(() => {
    if (!apiData || apiData.length === 0) return;

    // clamp index
    let idx = currentIndex;
    if (idx == null || idx < 0) idx = 0;
    if (idx >= apiData.length) idx = apiData.length - 1;
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      return;
    }

    const item = apiData[idx];
    if (!item) return;

    const rawEntryDate = item.EntryDate ?? item.entryDate ?? "";
    const rawEffectiveDate = item.EffectiveDate ?? item.effectiveDate ?? "";

    setFormData((prev) => ({
      ...prev,
      entryId: item.EntryId ?? item.entryId ?? prev.entryId ?? "",
      journalNo: String(item.JournalNo ?? item.journalNo ?? prev.journalNo ?? ""),
      entryDate: rawEntryDate ? rawEntryDate.split("T")[0] : prev.entryDate ?? "",
      effectiveDate: rawEffectiveDate ? rawEffectiveDate.split("T")[0] : prev.effectiveDate ?? "",
      entryBy: String(item.EntryBy ?? item.entryBy ?? prev.entryBy ?? ""),
      description: String(item.Description ?? item.description ?? prev.description ?? ""),
      totalDebit: Number(item.TotalDebit ?? item.totalDebit ?? prev.totalDebit ?? 0),
      totalCredit: Number(item.TotalCredit ?? item.totalCredit ?? prev.totalCredit ?? 0),
    }));

    // แจ้ง parent (หรือ state กลาง) ว่า journal ที่ active เปลี่ยนแล้ว
    const newJournal = item.JournalNo ?? item.journalNo ?? "";
    if (newJournal && newJournal !== currentAccDocNo) {
      setCurrentAccDocNo(newJournal);
      console.log("AccordionPVHD setCurrentAccDocNo ->", newJournal);
    }
    // Update Redux so Detail component can see it too
    if (newJournal) {
      dispatch(setAccDocNo(newJournal));
    }
    // debug
    console.log("synced formData from item:", idx, item);
  }, [currentIndex, apiData, setCurrentIndex, dispatch]);

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
    // ปิดการนำทางเฉพาะเมื่อไม่มีข้อมูลหรือมีแค่รายการเดียวเท่านั้น
    return !apiData || apiData.length <= 1;
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const dataToSend = { ...formData };
      delete dataToSend.entryId;
      if (!dataToSend.totalDebit) {
        dataToSend.totalDebit = 0; // หรือค่าเริ่มต้นอื่นๆ ที่เหมาะสม
      }
      if (!dataToSend.totalCredit) {
        dataToSend.totalCredit = 0; // หรือค่าเริ่มต้นอื่นๆ ที่เหมาะสม
      }
      // ตรวจสอบ accPostDate และแก้ไขถ้าจำเป็น
      if (dataToSend.entryDate === "1900-01-01" || !dataToSend.entryDate) {
        dataToSend.entryDate = new Date().toISOString().split("T")[0]; // หรือวันที่ที่ถูกต้องอื่นๆ
      }
      console.log("DATATU:", JSON.stringify(dataToSend));
      const response = await authFetch(`${API_BASE}/Journal/SetJournalHD`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other necessary headers (e.g., authorization)
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the server
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
          }`
        );
      }

      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
      // Optionally, you can reset the form or update the UI after a successful save
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle errors, e.g., display an error message to the user
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleUpdate = async () => {
    console.log("Updated action from PVHeader");
    try {
      const dataToSend = { ...formData };
      const journalNo = formData.journalNo;

      const response = await authFetch(`${API_BASE}/Journal/EditJournalHD`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
          }`
        );
      }

      console.log("Data updated successfully");

      alert("แก้ไขข้อมูลสำเร็จ");
      await fetchDataFromApi(journalNo);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };
  const handleCancel1 = async () => {
    try {
      const dataCancel = { ...formData, docStatus: 99 }; ////**** */
      const journalNo = formData.journalNo;
      const response = await authFetch(`${API_BASE}/Journal/EditJournalHD`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataCancel),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
          }`
        );
      }

      console.log("Data Cancel successfully");

      alert("ยกเลิกข้อมูลสำเร็จ");
      await fetchDataFromApi(journalNo);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("ยกเลิกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleCancel = async () => {
    const journalNo = formData.journalNo;
    await CancelJournal(journalNo, navigate);
  };
  const handleDelete = async () => {
    //ไม่ควรใช้
    try {
      const journalNo = formData.journalNo;

      const response = await authFetch(
        `${API_BASE}/Journal/EditJournalHD/${journalNo}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
          }`
        );
      }

      console.log("Data deleted successfully");
      alert("ลบข้อมูลสำเร็จ");
      await fetchDataFromApi(journalNo);
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleDetail = async () => {
    console.log("Detail", formData.journalNo);
    console.log("Detail", formData.entryId);
    try {
      // await fetchDataFromApi(journalNo); // รอผลลัพธ์จาก fetchDataFromApi

      const journalNo = formData.journalNo;
      const entryId = formData.entryId;
      const entryDate = formData.entryDate;
      const effectiveDate = formData.effectiveDate;
      const entryBy = formData.entryBy;
      const description = formData.description;

      // navigate(`/uitestacc/PVDTList?journalNo=${journalNo}`, {
      navigate(`/uitestacc/PVListDT?journalNo=${journalNo}`, {
        // navigate(`/uitestacc/PVListDT?entryId=${entryId}`, {
        state: {
          entryId,
          journalNo,
          entryDate,
          effectiveDate,
          entryBy,
          description,
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
    const shortYear = new Date().getFullYear().toString().slice(-2);
    setFormData({
      entryId: "",
      journalNo: `${DocType}${shortYear}xx...`,
      entryDate: new Date().toISOString().slice(0, 10),
      effectiveDate: new Date().toISOString().slice(0, 10),
      entryBy: localStorage.getItem("userName"),
      description: "",
      totalDebit: "",
      totalCredit: "",
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

  const handlePrint = async () => {
    const PV = "PV"; // กำหนดค่า PR ให้ถูกต้อง
    // const accDocType = formData.accDocType;
    const journalNo = formData.journalNo;
    console.log("AccDocNo:", journalNo);
    const printUrl = `${REPORT_BASE}/Form?Form=Form${PV}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${journalNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faFloppyDisk}
          style={{ color: "green" }}
          size="1x"
        />
      ),
      name: "Save Payment Voucher",
      onClick: handleSave,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPrint} style={{ color: "blue" }} size="1x" />
      ),
      name: "Print Payment Voucher",
      onClick: handlePrint,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "New Payment Voucher",
      onClick: handleNew,
    },
    ...(docStatus === "0"
      ? [
        {
          icon: (
            <FontAwesomeIcon
              icon={faPen}
              style={{ color: "#72047b" }}
              size="1x"
            />
          ),
          name: "Update Data",
          onClick: handleUpdate,
        },
      ]
      : []),
    {
      icon: (
        <FontAwesomeIcon icon={faTrash} style={{ color: "#ae0000" }} size="1x" />
      ),
      name: "Cancel Data",
      onClick: handleCancel,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faInfo} style={{ color: "#6c757d" }} size="1x" />
      ),
      name: "More Info",
      onClick: handleOpenMoreInfoModal,
    },
  ];
  const buttonActionsLNPF = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faAnglesRight}
          style={{ color: "#2d01bd" }}
          size="1x"
          rotation={180}
        />
      ),
      name: "ToLast",
      onClick: goToLast,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faAngleRight}
          style={{ color: "#2d01bd" }}
          size="1x"
          rotation={180}
        />
      ),
      name: "ToNext",
      onClick: goToNext,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faAngleRight}
          style={{ color: "#2d01bd" }}
          size="1x"
        />
      ),
      name: "ToPrevious",
      onClick: goToPrevious,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faAnglesRight}
          style={{ color: "#2d01bd" }}
          size="1x"
        />
      ),
      name: "ToFirst",
      onClick: goToFirst,
      disabled: isNavigationDisabled(),
    },
  ];

  // ถ้ามี currentAccDocNo ให้ดึงรายการทั้งหมดแล้วหา index ของ journalNo โดยใช้ vPV_All -> API_VIEW_RESULT
  useEffect(() => {
    if (!currentAccDocNo) return;
    if (isFetchingRef.current) return;
    if (lastFetchedRef.current === currentAccDocNo) return;

    const fetchWithView = async () => {
      isFetchingRef.current = true;
      try {
        const vPV_All = {
          viewName: "vPV_All",
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

        const response = await axios.post(API_VIEW_RESULT, vPV_All, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status !== 200) {
          console.error("Error fetching vPV_All:", response.statusText);
          setApiData([]);
          lastFetchedRef.current = currentAccDocNo;
          return;
        }

        const data = Array.isArray(response.data) ? response.data : [];
        if (data.length === 0) {
          setApiData([]);
          lastFetchedRef.current = currentAccDocNo;
          return;
        }

        const sorted = [...data].sort((a, b) => {
          const aNo = a.JournalNo || "";
          const bNo = b.JournalNo || "";
          return bNo.localeCompare(aNo);
        });

        // deduplicate by JournalNo so navigation counts each Journal once
        const uniqueSorted = sorted.filter(
          (item, idx, arr) => arr.findIndex((x) => (x.JournalNo || x.journalNo) === (item.JournalNo || item.journalNo)) === idx
        );

        setApiData(uniqueSorted);

        const matchedIndex = uniqueSorted.findIndex((it) => (it.JournalNo || it.journalNo) === currentAccDocNo);
        if (matchedIndex !== -1) {
          setCurrentIndex(matchedIndex);
          const item = uniqueSorted[matchedIndex];
          const rawEntryDate = item.EntryDate ?? item.entryDate ?? "";
          const rawEffectiveDate = item.EffectiveDate ?? item.effectiveDate ?? "";
          const matchedJournal = item.JournalNo || item.journalNo || "";

          setFormData((prev) => ({
            ...prev,
            entryId: item.EntryId || item.entryId || "",
            journalNo: matchedJournal,
            entryDate: rawEntryDate ? rawEntryDate.split("T")[0] : "",
            effectiveDate: rawEffectiveDate ? rawEffectiveDate.split("T")[0] : "",
            entryBy: item.EntryBy || item.entryBy || "",
            description: item.Description || item.description || "",
            totalDebit: Number(item.TotalDebit ?? item.totalDebit) || 0,
            totalCredit: Number(item.TotalCredit ?? item.totalCredit) || 0,
          }));

          // Sync Redux
          if (matchedJournal) {
            dispatch(setAccDocNo(matchedJournal));
          }
        } else {
          setCurrentIndex((prev) => (prev != null && prev < uniqueSorted.length ? prev : 0));
        }

        lastFetchedRef.current = currentAccDocNo;
      } catch (err) {
        console.error("Error fetching HD list via vPV_All:", err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchWithView();
  }, [currentAccDocNo, dispatch]);

  const navInitRef = useRef(false);
  const lastNavSearchRef = useRef(null);

  useEffect(() => {
    const journalFromState = location.state?.journalNo || location.state?.JournalNo;
    const params = new URLSearchParams(location.search);
    const journalFromQuery = params.get("journalNo") || params.get("JournalNo"); // Support both cases
    const journalToUse = journalFromState || journalFromQuery;

    // ถ้าไม่มีค่าใน navigation/URL ให้ไม่ทำอะไร
    if (!journalToUse) {
      lastNavSearchRef.current = location.search;
      return;
    }

    // กรณี mount ครั้งแรก ให้ใช้ค่าจาก navigation/URL
    if (!navInitRef.current) {
      navInitRef.current = true;
      lastNavSearchRef.current = location.search;
      if (journalToUse !== currentAccDocNo) {
        setCurrentAccDocNo(journalToUse);
        // fetch เฉพาะตอน init จาก navigation
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchDataFromApi(journalToUse);
      }
      return;
    }

    // ถ้า location.search เปลี่ยน (URL เปลี่ยน) ให้ update ใหม่
    if (lastNavSearchRef.current !== location.search) {
      lastNavSearchRef.current = location.search;
      if (journalToUse !== currentAccDocNo) {
        setCurrentAccDocNo(journalToUse);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchDataFromApi(journalToUse);
      }
    }

  }, [location?.state, location?.search]);

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <CircularButtonGroup actions={buttonActions} />
      {/* <CircularButtonGroup actions={buttonActionsLNPF} /> */}
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none", paddingTop: "3px" }}
      />
      <div>&nbsp;</div>
      {/* <div className="col-md-3">
        <TextField
          className="fonts"
          variant="outlined"
          id="demo-simple-select"
          value="PV"
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
          value={selectedEName}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        >
          <MenuItem value={DocType}>Payment Voucher</MenuItem>
        </TextField>
      </div>
      <div>&nbsp;</div> */}

      <div className="col-md-4" style={{ paddingTop: "5px" }}>
        <TextField
          id="journalNo"
          label="JournalNo"
          value={String(formData?.journalNo ?? JournalNo ?? "")}
          type="text"
          style={{ width: "100%" }}
          onChange={handleInputChange}
        />
      </div>
      <div className="col-md-5" style={{ paddingTop: "5px" }}>
        <TextField
          id="description"
          label="Description"
          value={String(formData?.description ?? "")}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-3" style={{ paddingTop: "5px" }}>
        <TextField
          id="entryBy"
          label="EntryBy"
          value={String(formData?.entryBy ?? "")}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          InputProps={{
            readOnly: true,
            style: {
              backgroundColor: "#cdcdd1",
            }
          }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-6" style={{ paddingTop: "5px" }}>
        <TextField
          id="effectiveDate"
          label="EffectiveDate"
          type="date"
          variant="standard"
          value={formData?.effectiveDate ? String(formData.effectiveDate) : ""}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      {/* <div className="col-md-1">&nbsp;</div> */}
      <div className="col-md-6" style={{ paddingTop: "5px" }}>
        <TextField
          id="entryDate"
          label="EntryDate"
          value={formData?.entryDate ? String(formData.entryDate) : ""}
          type="date"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>

      {isMoreInfoModalOpen && (
        <MoreInfoHD
          open={isMoreInfoModalOpen}
          handleClose={handleCloseMoreInfoModal}
          accDocNo={formData.journalNo}
          accDocType={DocType}
          docConfigID={selectedDocConfigID}
          fetchDataFromApi={fetchDataFromApi}
        />
      )}
    </div>
  );
}
//ยังเลื่อนดูข้อมูลไม่ได้
