import React, { useState, useEffect } from "react";
import axios from "../../components/Auth/axiosConfig";
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
import ButtonRV from "./ButtonRV";
import { API_BASE, DATA_BASE, REPORT_BASE } from "../api/url";

export default function RVHeader() {
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

  const [doctype, setDoctype] = React.useState("");
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

  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setDoctype(selectedCategory); // อัปเดตค่า doctype

    const selectedOption = categoryOptions.find(
      (option) => option.value === selectedCategory
    );
    if (selectedOption) {
      setSelectedEName(selectedOption.label);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const RV = "RV";
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
    if (RV && categoryOptions.length > 0) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === RV
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
      } else {
        setSelectedEName("");
      }
    } else {
      setSelectedEName("");
    }
  }, [RV, categoryOptions]);

  const [showButton, setShowButton] = useState(false);
  const [journalNoFromApi, setJournalNoFromApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiData, setApiData] = useState(null);

  const fetchDataFromApi = async () => {
    try {
      // สร้าง URL ของ API ตามประเภทเอกสาร (doctype)
      const apiUrl = `${API_BASE}/Journal/GetJournalHD`;

      const response = await authFetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data form journal:", data);

      if (Array.isArray(data) && data.length > 0) {
        setApiData(data); // Update state ด้วยข้อมูลจาก API

        // เรียงลำดับข้อมูลจากล่าสุดไปหาข้อมูลก่อนหน้า
        data.sort((a, b) => {
          const journalNoA = a.journalNo;
          const journalNoB = b.journalNo;
          return journalNoB.localeCompare(journalNoA); // เปรียบเทียบ string จากมากไปน้อย
        });

        console.log("apiData:", apiData); // ตรวจสอบ apiData
        console.log("currentIndex:", currentIndex); // ตรวจสอบ currentIndex
        console.log("formData:", formData); // ตรวจสอบ formData
      } else {
        // setApiData([]); // ล้างข้อมูลใน apiData state
        setCurrentIndex(0);
        setFormData({
          entryId: "",
          journalNo: "",
          entryDate: new Date().toISOString().slice(0, 10),
          effectiveDate: new Date().toISOString().slice(0, 10),
          entryBy: "",
          description: "",
          totalDebit: "",
          totalCredit: "",
        });
      }
      console.log("DataDoc:", data[0].journalNo);
      setJournalNoFromApi(data[0].journalNo);

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("ไม่มีข้อมูล",doctype)
      // จัดการ error เช่น แสดงข้อความให้ผู้ใช้
      // throw error; // โยน error ต่อไปเพื่อให้ handleDetail จัดการ
    }
  };

  useEffect(() => {
    if (RV) {
      fetchDataFromApi(RV);
    }
  }, [RV]);
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      // เรียงลำดับข้อมูลจากล่าสุดไปหาข้อมูลก่อนหน้า
      const sortedData = [...apiData].sort((a, b) => {
        const journalNoA = a.journalNo;
        const journalNoB = b.journalNo;
        return journalNoB.localeCompare(journalNoA); // เปรียบเทียบ string จากมากไปน้อย
      });

      // ค้นหา AccDocNo ในข้อมูลที่เรียงลำดับแล้ว
      const matchedIndex = sortedData.findIndex(
        (item) => item.journalNo === JournalNo
      );
      if (matchedIndex !== -1) {
        setCurrentIndex(matchedIndex);
      } else {
        setCurrentIndex(0); // แสดงข้อมูลแรกถ้าไม่พบ accDocNo ที่ตรงกัน
      }

      console.log("apiData (sorted):", sortedData); // ตรวจสอบ apiData ที่เรียงลำดับแล้ว
      console.log("currentIndex:", currentIndex); // ตรวจสอบ currentIndex
      console.log("JournalNo:", JournalNo); // ตรวจสอบ AccDocNo
    }
  }, [JournalNo, apiData]);

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
      delete dataToSend.entryId;
      // delete dataToSend.totalCredit;
      // ตรวจสอบว่า docStatus มีค่าหรือไม่ ถ้าไม่มีให้ใส่ค่าเริ่มต้น
      // if (!dataToSend.entryId) {
      //   dataToSend.entryId = 0; // หรือค่าเริ่มต้นอื่นๆ ที่เหมาะสม
      // }
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

      // const regex = /^[0-9]{13}$/;

      // if (!regex.test(formData.partyTaxCode)) {
      //   alert("PartyTaxCode ต้องเป็นตัวเลข (0-9) 13หลักเท่านั้น");
      //   return; // หยุดการทำงานของฟังก์ชัน ถ้าข้อมูลไม่ถูกต้อง
      // }

      console.log("DATATU:", JSON.stringify(dataToSend));
      const response = await authFetch(
        `${API_BASE}/Journal/SetJournalHD`,
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

      // Swal.fire({
      //   icon: "success",
      //   title: `บันทึกข้อมูล ${responseData.journalNo} สำเร็จ`,
      //   // text: "ข้อมูลสินค้า/บริการถูกลบเรียบร้อยแล้ว",
      //   showConfirmButton: false,
      //   timer: 2000,
      // });

      // await fetchDataFromApi(journalNo);
      // // ดึงค่า accDocNo และวันที่ที่ต้องการ
      // const journalNo = responseData.journalNo;
      // const entryDate = formData.entryDate;
      // const effectiveDate = formData.effectiveDate;
      // const entryBy = formData.entryBy;
      // const description = formData.description;

      // navigate(`/uitestacc/PVDTList?journalNo=${journalNo}`, {
      //   state: {
      //     journalNo,
      //     entryDate,
      //     effectiveDate,
      //     entryBy,
      //     description,
      //   },
      // });
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle errors, e.g., display an error message to the user
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleUpdate = async () => {
    console.log("Updated action from RVHeader");
    try {
      const dataToSend = { ...formData };
      const journalNo = formData.journalNo;

      const response = await authFetch(
        `${API_BASE}/Journal/EditJournalHD`,
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
      await fetchDataFromApi(journalNo);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };
  // const dialogs = useDialogs();
  // const [isDeleting, setIsDeleting] = React.useState(false);
  const handleCancel = async () => {
    try {
      const dataCancel = { ...formData, docStatus: 99 }; ////**** */
      const journalNo = formData.journalNo;

      // // ตรวจสอบข้อมูลก่อนส่ง
      // const regex = /^[0-9]{13}$/;
      // if (!regex.test(formData.partyTaxCode)) {
      //   alert("PartyTaxCode ต้องเป็นตัวเลข (0-9) 13 หลักเท่านั้น");
      //   return;
      // }

      const response = await authFetch(
        `${API_BASE}/Journal/EditJournalHD`,
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
      await fetchDataFromApi(journalNo);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("ยกเลิกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
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
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
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

      navigate(`/uitestacc/RVListDT?journalNo=${journalNo}`, {
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
    setFormData({
      entryId: "",
      journalNo: "RV25xx...",
      entryDate: new Date().toISOString().slice(0, 10),
      effectiveDate: new Date().toISOString().slice(0, 10),
      entryBy: "admin", //แก้เมื่อทำระบบlogin
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
  // const handlePV = async (AccDocNo) => {
  //   // const userId = "admin"; // หรือจะดึงจากระบบ login
  //   const DocRefNo = formData.docRefNo;
  //   await PVfromPI(AccDocNo,DocRefNo,navigate);
  //   navigate({
  //     state: { AccDocNo,
  //              DocRefNo
  //      },
  //   });
  // };

  const handlePrint = async () => {
    const RV = "RV"; // กำหนดค่า PR ให้ถูกต้อง
    // const accDocType = formData.accDocType;
    const journalNo = formData.journalNo;
    console.log("AccDocNo:", journalNo);
    const printUrl = `${REPORT_BASE}/form?Form=Form${RV}&DB=${DATA_BASE}&Code=${journalNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/RVList/`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faRectangleList}
          style={{ color: "#e56107" }}
          size="2x"
        />
      ),
      name: "Detail",
      onClick: handleDetail,
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faFloppyDisk}
          style={{ color: "green" }}
          size="2x"
        />
      ),
      name: "Save",
      onClick: handleSave,
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faPrint}
          style={{ color: "#0aa3ad" }}
          size="2x"
        />
      ),
      name: "Print",
      onClick: handlePrint,
    },
    // ...(docStatusState === "0"
    //   ? [
    //       {
    //         icon: (
    //           <div style={{ display: "flex", alignItems: "center" }}>
    //             {/* <FontAwesomeIcon icon={faP} style={{ color: "#f94f01" }} size="2xs" />
    //               <FontAwesomeIcon icon={faO} style={{ color: "#f94f01" }} size="2xs" /> */}
    //             <FontAwesomeIcon
    //               icon={faFileInvoice}
    //               style={{ color: "#f94f01" }}
    //               size="2x"
    //             />
    //           </div>
    //         ),
    //         name: "RV",
    //         onClick: () => handleRV(AccDocNo),
    //       },
    //     ]
    //   : []),
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="2x" />
      ),
      name: "New",
      onClick: handleNew,
    },
    // ...(docStatusState === "0"
    //   ? [
          {
            icon: (
              <FontAwesomeIcon
                icon={faPen}
                style={{ color: "#72047b" }}
                size="2x"
              />
            ),
            name: "Update",
            onClick: handleUpdate,
          },
          {
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "#ae0000" }}
                size="2x"
              />
            ),
            name: "Cancel",
            onClick: handleCancel,
          },
      //   ]
      // : []),
  ];

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2 style={{ textAlign: "center" }}>Receive Voucher</h2>
      {/* <div style={{ display: "flex" }}>
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
            onClick={handleSave} //เช็คjournalNo ไม่สร้างให้ ต้องกำหนดเอง
          />
        </div>
        <div
          className="col-4"
          style={{ paddingLeft: "10px", cursor: "pointer", display: "grid" }}
        >
          <FontAwesomeIcon
            icon={faPrint}
            size="2x"
            style={{ color: "blue" }}
            //  onClick={handlePrint}
          />
        </div>
        <div
          className="col-4"
          style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "green" }}
            onClick={handleNew}
          />
        </div>
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
      </div> */}
      &nbsp;
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonRV actions={buttonActions} />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-3">
        <TextField
          className="fonts"
          variant="outlined"
          id="demo-simple-select"
          // onChange={handleChange}
          // value={AccDocType}
          value="RV"
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
          <MenuItem value={RV}>Receive Voucher</MenuItem>
        </TextField>
      </div>
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="journalNo"
          label="JournalNo"
          value={formData.journalNo || JournalNo}
          // value={AccDocNo || ""}
          type="text"
          // slotProps={{
          //   input: {
          //     readOnly: true,
          //   },
          // }}
          style={{ width: "100%" }}
          onChange={handleInputChange}
          // onChange={handleChange}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="description"
          label="Description"
          value={formData.description}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="effectiveDate"
          label="EffectiveDate"
          type="date"
          variant="standard"
          value={formData.effectiveDate}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="entryDate"
          label="EntryDate"
          value={formData.entryDate}
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
