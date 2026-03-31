import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
import {useAuthFetch} from "../../Auth/fetchConfig";
import { API_BASE, REPORT_BASE,BASE, DATA_BASE } from "../../api/url";
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
  faP,
  faI,
  faFileInvoice,
  faO,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { setAccDocNo, setAccDocType } from "../../redux/TransactionDataaction";
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
import Swal from "sweetalert2";
import ButtonSI from"./ButtonSI";
import { RVfromSI } from "./RVFromSI";

export default function SIHeader() {
  const AccDocNo = useSelector((state) => state.accDocNo); // ดึงข้อมูล transaction จาก Store
  const PartyName = useSelector((state) => state.partyName);
  const AccEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const DocStatus = useSelector((state) => state.docStatus);
  const amount = useSelector((state) => state.amount);
  const AccDocType = useSelector((state) => state.accDocType);
  const statusName = useSelector((state) => state.statusName);
  const authFetch = useAuthFetch();

  const location = useLocation();

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
    issueBy: "admin",
    accPostDate: new Date().toISOString().slice(0, 10),
    fiscalYear: new Date().toISOString().slice(0, 10),
  });
  const docStatusState = formData.docStatus;

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

  //   const PR = "PR";
  // const SR = "SR";
  // const PI = "PI";
  const SI = "SI";

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
          issueBy: "", //ต้องแก้เมื่อทำระบบlogin
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
      const dataToSendHD = { ...formData };
      delete dataToSendHD.accDocNo;
      if (dataToSendHD.docStatus > 0) {
        dataToSendHD.docStatus = 0;
      }
      if (
        dataToSendHD.accPostDate === "1900-01-01" ||
        !dataToSendHD.accPostDate
      ) {
        dataToSendHD.accPostDate = new Date().toISOString().split("T")[0];
      }

      if (
        formData.partyCode === "DEF" &&
        formData.partyTaxCode &&
        formData.partyTaxCode.includes("/")
      ) {
        dataToSendHD.partyTaxCode = formData.partyTaxCode.split("/")[0];
      } else if (formData.partyCode !== "DEF") {
        dataToSendHD.partyTaxCode = formData.partyTaxCode;
      }

      console.log(
        "Data to send for SetAccTransactionHD:",
        JSON.stringify(dataToSendHD)
      );

      const responseHD = await authFetch(
        `${API_BASE}/AccTransaction/SetAccTransactionHD`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other necessary headers
          },
          body: JSON.stringify(dataToSendHD),
        }
      );

      if (!responseHD.ok) {
        const errorData = await responseHD.json();
        throw new Error(
          `HTTP error! status: ${responseHD.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const responseDataHD = await responseHD.json();
      console.log("SetAccTransactionHD successful:", responseDataHD);

      const AccDocNo = responseDataHD.accDocNo;
      const accEffectiveDate = formData.accEffectiveDate;
      const partyCode = formData.partyCode;
      const partyTaxCode = formData.partyTaxCode;
      const partyName = formData.partyName;
      const partyAddress = formData.partyAddress;
      const nameCategory = selectedEName;

      // ฟังก์ชันสำหรับเรียก API SetCustomer
      const setCustomer = async (customerData) => {
        const response = await authFetch(
          `${API_BASE}/Customer/SetCustomer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
            body: JSON.stringify(customerData),
          }
        );
        if (!response.ok) {
          let errorMessage = `HTTP error during SetCustomer! status: ${response.status}`;
          try {
            const errorText = await response.text();
            errorMessage += `, message: ${errorText || "Unknown error"}`;
          } catch (e) {
            errorMessage += ", could not read error response text.";
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const responseData = await response.json();
            return responseData;
          } catch (e) {
            const textResponse = await response.text();
            console.warn("Error parsing JSON, got:", textResponse);
            return textResponse;
          }
        } else {
          const textResponse = await response.text();
          console.log("SetCustomer response (non-JSON):", textResponse);
          return textResponse;
        }
      };

      // ตรวจสอบค่า partyCode และดำเนินการเรียก API SetCustomer ถ้าไม่ใช่ 'DEF'
      if (partyCode !== "DEF") {
        const taxParts = partyTaxCode.split("/");
        const taxNumberForCustomer = taxParts[0];
        const taxBranchForCustomer =
          taxParts.length > 1 ? taxParts[1] : "00000";
        const customerPayload = [
          {
            customerCode: partyCode,
            taxNumber: taxNumberForCustomer,
            taxBranch: taxBranchForCustomer,
            customerName: partyName,
            address1: partyAddress,
          },
        ];

        console.log(
          "Data to send for SetCustomer:",
          JSON.stringify(customerPayload)
        );
       
      try {
        const setCustomerResponse = await setCustomer(customerPayload);
        console.log("SetCustomer response:", setCustomerResponse);
        // ตรวจสอบ Response หากมีข้อความระบุ Customer สร้างสำเร็จ
        if (typeof setCustomerResponse === 'string' && setCustomerResponse.includes("Customers Created.")) {
          console.log("Customers Created successfully");
        } else if (typeof setCustomerResponse === 'string' && setCustomerResponse.includes("Customer code already exists.")) {
          console.log("Customer code already exists, skipping success alert for Customer.");
          // ไม่ต้องทำอะไร ให้ข้ามไปแจ้งเตือนบันทึกสำเร็จของ Header
        } else if (typeof setCustomerResponse !== 'string') {
          // กรณี Response เป็น JSON อาจมี Logic อื่นๆ ในการตรวจสอบความสำเร็จ
          // หากไม่สำเร็จจริงๆ คุณอาจต้องการ Throw Error ที่นี่
          console.warn("Unexpected response from SetCustomer:", setCustomerResponse);
        }
      } catch (error) {
        console.error("Error during SetCustomer:", error);
        // ตรวจสอบ Error Message หากเป็น Customer Code ซ้ำ ให้ Log และข้ามการแจ้งเตือน Error
        if (error.message.includes("CustomerCode :") && error.message.includes("is already exsist.")) {
          console.log("Customer code already exists, skipping error alert for Customer.");
        } else {
          // ถ้าเป็น Error อื่นๆ ให้แจ้งเตือน Error ตามปกติ (ถ้าต้องการ)
          // Swal.fire({
          //   icon: "error",
          //   title: "เกิดข้อผิดพลาดในการสร้าง Customer",
          //   text: error.message || "โปรดลองใหม่อีกครั้ง",
          // });
        }
      }
    }
      // แสดง SweetAlert เมื่อบันทึก SetAccTransactionHD สำเร็จ (โดยไม่สนใจผลลัพธ์ SetCustomer ใน try block)
      Swal.fire({
        icon: "success",
        title: `บันทึกข้อมูลสำเร็จ SI:${AccDocNo}`,
        showConfirmButton: false,
        timer: 2000,
      });

      await fetchDataFromApi(doctype);
      // const accDocNo = formData.accDocNo;
      console.log("nameEDoc:", selectedEName);
      console.log("accDocNo:", AccDocNo);
      navigate(`/uitestacc/SIListDT?accDocNo=${AccDocNo}`, {
        state: {
          accDocNo: AccDocNo,
          accEffectiveDate: accEffectiveDate,
          partyCode: partyCode,
          partyName: partyName,
          nameCategory: nameCategory,
        },
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleUpdate = async () => {
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
      // alert("แก้ไขข้อมูลสำเร็จ");
      Swal.fire({
        icon: "success",
        title: `แก้ไขข้อมูล ${accDocNo} เรียบร้อย`,
        // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };
  const docStatus = formData.docStatus;

  const handleCancel = async () => {
  const accDocNo = formData.accDocNo;

  Swal.fire({
    title: `Are you sure? ${accDocNo}`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const dataCancel = { ...formData, docStatus: 99 };

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

        Swal.fire({
          title: `Deleted! ${accDocNo}`,
          text: "Your file has been cancel.",
          icon: "success",
        });

        await fetchDataFromApi(doctype);
      } catch (error) {
        console.error("Error updating data:", error);
        alert("ยกเลิกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
      }
    }
  });
};
  
  const handleDelete = async () => {
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
      // alert("ลบข้อมูลสำเร็จ");
      Swal.fire({
        icon: "success",
        title: `ลบข้อมูลสำเร็จ SI:${response.accDocNo}`,
        // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  }; //ไม่่ควรลบได้ ให้เปลี่ยนเป็น 99 ==>handleCancel

  const handleDetail = async () => {
    try {
      await fetchDataFromApi(doctype); // รอผลลัพธ์จาก fetchDataFromApi

      // const accDocNo = accDocNoFromApi; // เข้าถึง accDocNo จาก state
      const accDocNo = formData.accDocNo;
      console.log("accDocNoNew", accDocNo);
      const accEffectiveDate = formData.accEffectiveDate;
      console.log("accEffectiveDate:", formData.accEffectiveDate);
      console.log("accEffectiveDateNew:", accEffectiveDate);
      const partyCode = formData.partyCode;
      const partyName = formData.partyName;
      const nameCategory = selectedEName;
      // navigate(`/uitestacc/TransactionDT?accDocNo=${accDocNo}`, {
      navigate(`/uitestacc/SIListDT?accDocNo=${accDocNo}`, {
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
      accDocType: SI,
      accDocNo: "SI25xx...",
      accEffectiveDate: new Date().toISOString().slice(0, 10),
      partyCode: "DEF", //สำหรับ Customer ที่ไม่ต้องการลง Mas_Customer
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
        console.log("customerOptions:", customerOptions);
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
        partyCode: selectedCustomer.customerCode,
        partyTaxCode:
          selectedCustomer.taxNumber + "/" + selectedCustomer.taxBranch,
        partyName: selectedCustomer.customerName,
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
  // หน้า ใบแจ้งหนี้ SI ปุ่ม รับเงิน/รับชำระหนี้
  const handleRV = async (AccDocNo) => {
    // const userId = "admin"; // หรือจะดึงจากระบบ login
    const DocRefNo = formData.docRefNo;
    console.log("DocRefNo:",DocRefNo)
    await RVfromSI(AccDocNo,DocRefNo, navigate);
    navigate("/uitestacc/RVList", {
      state: {
        AccDocNo,
        DocRefNo
      },
    });
  };

  const handlePrint1 = async () => {
    const accDocType = formData.accDocType;
    const accDocNo = formData.accDocNo;
    console.log("AccDocNo:", accDocNo);
    const printUrl = `http://203.154.140.51/accreport/form?Form=Form${accDocType}&DB=${DATA_BASE}&Code=${accDocNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };
  const handlePrint = async () => {
    const accDocType = formData.accDocType;
    const accDocNo = formData.accDocNo;
    console.log("AccDocNo:", accDocNo);
    const printUrl = `${REPORT_BASE}/form?Form=Form${accDocType}&DB=${DATA_BASE}&Code=${accDocNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const handleGoBack = () => {
    navigate("/uitestacc/SIList/");
  };

  const handleGoMenu = () => {
    navigate("/uitestacc/SIList/");
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
      onClick:handlePrint,
    },
    ...(docStatusState === "0"
      ? [
          {
            icon: (
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <FontAwesomeIcon icon={faP} style={{ color: "#f94f01" }} size="2xs" />
                <FontAwesomeIcon icon={faO} style={{ color: "#f94f01" }} size="2xs" /> */}
                <FontAwesomeIcon
                  icon={faFileInvoice}
                  style={{ color: "#f94f01" }}
                  size="2x"
                />
              </div>
            ),
            name: "RV",
            onClick: () => handleRV(AccDocNo),
          },
        ]
      : []),
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="2x" />
      ),
      name: "New",
      onClick: handleNew,
    },
    ...(docStatusState === "0"
      ? [
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
        ]
      : []),
  ];

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2 style={{ textAlign: "center" }} onClick={handleGoMenu}>
        Sale Invoice
      </h2>
      &nbsp;
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonSI actions={buttonActions} />
      </div>
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
          {/* <MenuItem value={PR}>Purchase Requisition</MenuItem> */}
          {/* <MenuItem value={SR}>Sales Requisition</MenuItem> */}
          {/*<MenuItem value={PI}>Payment Invoice</MenuItem> */}
          <MenuItem value={SI}>Sale Invoice</MenuItem>
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
                count={Math.ceil(customerOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
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
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
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
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
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
        {/* <div className="col-md-6">
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
          >
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleNew}>New</Button>
            <Button onClick={handleDetail}>Detail</Button>
          </ButtonGroup>
        </div> */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
