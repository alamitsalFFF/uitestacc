import React, { useState, useEffect } from "react";
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
  faFileLines,
  faChessQueen,
  faMoneyCheck,
  faMoneyCheckAlt,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
// import { setAccDocNo, setAccDocType } from "../../redux/TransactionDataaction";
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
// import IconButton from "./Iconbutton";
// import ScrollTop from "./ScrollTop";
// import { DIfromPO } from "./DIfromPO";
// import IconButton from "../purchase/Purchase Order/Iconbutton";
import { API_BASE, DATA_BASE, REPORT_BASE, URL } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import MoreInfoHD from "../AdditionData/AdditionDataHD/MoreInfoHD";
import Swal from "sweetalert2";
import DocStatusPI from "./DocStatusPI";
import { CancelPI } from "./CancelPI";
import { GetGLTemplate } from "../purchase/Purchase Order/GetGLTemplate";
import { PVfromPI } from "./PVFromPI";
import GLTemplateModal from "../purchase/Purchase Order/GLTemplateModal";
import { PCfromPI } from "./PCFromPI";
import { PIToJournal } from "./PIToJournal";
import { DIfromPI } from "./DIfromPI";

export default function AccordionPIHD({
  apiData,
  setApiData,
  currentIndex,
  setCurrentIndex,
  setCurrentAccDocNo,
}) {
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
  const isNewMode = location.state && location.state.isNew;
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

  // --- State for MoreInfoModal ---
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const handleOpenMoreInfoModal = () => setIsMoreInfoModalOpen(true);
  const handleCloseMoreInfoModal = () => setIsMoreInfoModalOpen(false);
  // ---------------------------------
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
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);
  };

  const DocType = `PI`;

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

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
            data.map((item) => ({
              value: item.category,
              label: item.eName,
              docConfigID: item.docConfigID,
            }))
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
    // เมื่อ formData.accDocType หรือ apiData เปลี่ยน ให้ set AccDocType และ selectedEName ใหม่
    if (formData.accDocType) {
      // set AccDocType จาก formData
      // ถ้าใช้ Redux dispatch(setAccDocType(formData.accDocType));
      // ถ้าใช้ local state setDoctype(formData.accDocType);

      // set selectedEName จาก categoryOptions
      const matchedOption = categoryOptions.find(
        (option) => option.value === formData.accDocType
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
        console.log("Matched Option docConfigID:", matchedOption.docConfigID);
        setSelectedDocConfigID(matchedOption.docConfigID);
      } else {
        setSelectedEName("");
      }
    }
  }, [formData.accDocType, categoryOptions]);

  const [showButton, setShowButton] = useState(false);
  const [accDocNoFromApi, setAccDocNoFromApi] = useState(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [apiData, setApiData] = useState(null);
  const params = new URLSearchParams(location.search);
  const accDocNoFromUrl = params.get("accDocNo") || AccDocNo; // AccDocNo จาก redux fallback

  const fetchDataFromApi = async (AccDocType, accDocNoTarget) => {
    if (isNewMode) {
      return;
    }
    try {
      const apiUrl = `${API_BASE}/AccTransaction/GetAccTransactionHD?accDocType=${AccDocType}`;
      const response = await authFetch(apiUrl, {
        headers: {},
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data form accdoctype:", data);

      // หลัง fetch ข้อมูล
      if (Array.isArray(data) && data.length > 0) {
        setApiData(data);
        data.sort((a, b) => b.accDocNo.localeCompare(a.accDocNo));
        let matchedIndex = 0;
        if (accDocNoTarget) {
          const foundIndex = data.findIndex(
            (item) => item.accDocNo === accDocNoTarget
          );
          if (foundIndex !== -1) matchedIndex = foundIndex;
        }
        setCurrentIndex(matchedIndex);
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
        setDoctype(AccDocType || "");
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
    if (!doctype) {
      setDoctype(DocType);
    }
    if (doctype && !isNewMode) {
      // เพิ่มเงื่อนไข !isNewMode
      fetchDataFromApi(doctype, accDocNoFromUrl);
    }
  }, [doctype, accDocNoFromUrl, isNewMode]);

  // useEffect สำหรับจัดการโหมดสร้างใหม่ หรือเมื่อ apiData เปลี่ยนแปลง
  useEffect(() => {
    if (isNewMode) {
      // ถ้าเป็นการสร้างใหม่ ให้เรียก handleNew ทันที
      handleNew();
      return; // ไม่ต้องทำอย่างอื่นใน useEffect นี้
    }

    // ถ้าไม่ใช่โหมดสร้างใหม่ ให้ประมวลผล apiData ตามปกติ
    if (apiData && apiData.length > 0) {
      const sortedData = [...apiData].sort((a, b) => {
        const accDocNoA = a.accDocNo;
        const accDocNoB = b.accDocNo;
        return accDocNoB.localeCompare(accDocNoA);
      });

      const matchedIndex = sortedData.findIndex(
        (item) => item.accDocNo === accDocNoFromUrl
      );

      let newIndex = 0;
      if (matchedIndex !== -1) {
        newIndex = matchedIndex;
      }
      setCurrentIndex(newIndex);
      setFormData({
        accDocType: sortedData[newIndex].accDocType || "",
        accDocNo: sortedData[newIndex].accDocNo || "",
        accBatchDate: sortedData[newIndex].accBatchDate?.split("T")[0] || "",
        accEffectiveDate:
          sortedData[newIndex].accEffectiveDate?.split("T")[0] || "",
        partyCode: sortedData[newIndex].partyCode || "",
        partyTaxCode: sortedData[newIndex].partyTaxCode || "",
        partyName: sortedData[newIndex].partyName || "",
        partyAddress: sortedData[newIndex].partyAddress || "",
        docRefNo: sortedData[newIndex].docRefNo || "",
        docStatus: Number(sortedData[newIndex].docStatus) || 0,
        issueBy: sortedData[newIndex].issueBy || "",
        accPostDate: sortedData[newIndex].accPostDate?.split("T")[0] || "",
        fiscalYear: sortedData[newIndex].fiscalYear?.split("T")[0] || "",
      });
      setDoctype(sortedData[newIndex].accDocType || ""); // ตั้งค่า doctype ด้วย
    }
    // ถ้า apiData ไม่มีข้อมูล และไม่ใช่โหมดสร้างใหม่ (คือไม่มีข้อมูลสำหรับ AccDocType ที่เลือก)
    // การตั้งค่าเริ่มต้นจะถูกจัดการใน fetchDataFromApi แล้ว
  }, [apiData, accDocNoFromUrl, isNewMode]); // เพิ่ม isNewMode ใน dependency array

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, apiData.length - 1));
  };

  const goToLast = () => {
    setCurrentIndex(apiData.length - 1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToFirst = () => {
    setCurrentIndex(0);
  };
  const isNavigationDisabled = () => {
    const disabled = !doctype || !apiData || apiData.length === 0;
    // console.log("Navigation disabled:", disabled); // ตรวจสอบค่า disabled
    console.log(
      "Current Index:",
      currentIndex,
      "of",
      apiData ? apiData.length : 0
    );
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
          `HTTP error! status: ${responseHD.status}, message: ${errorData.message || "Unknown error"
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

      // ฟังก์ชันสำหรับเรียก API SetSupplier
      const setSupplier = async (supplierData) => {
        const response = await authFetch(`${API_BASE}/Supplier/SetSupplier`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other necessary headers
          },
          body: JSON.stringify(supplierData),
        });
        if (!response.ok) {
          let errorMessage = `HTTP error during SetSupplier! status: ${response.status}`;
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
          console.log("SetSupplier response (non-JSON):", textResponse);
          return textResponse;
        }
      };

      // ตรวจสอบค่า partyCode และดำเนินการเรียก API SetSupplier ถ้าไม่ใช่ 'DEF'
      if (partyCode !== "DEF") {
        const taxParts = partyTaxCode.split("/");
        const taxNumberForSupplier = taxParts[0];
        const taxBranchForSupplier =
          taxParts.length > 1 ? taxParts[1] : "00000";
        const supplierPayload = [
          {
            supplierCode: partyCode,
            taxNumber: taxNumberForSupplier,
            taxBranch: taxBranchForSupplier,
            supplierName: partyName,
            address1: partyAddress,
          },
        ];

        console.log(
          "Data to send for SetSupplier:",
          JSON.stringify(supplierPayload)
        );
        try {
          const setSupplierResponse = await setSupplier(supplierPayload);
          console.log("SetSupplier response:", setSupplierResponse);
          // ตรวจสอบ Response หากมีข้อความระบุ Supplier สร้างสำเร็จ
          if (
            typeof setSupplierResponse === "string" &&
            setSupplierResponse.includes("Suppliers Created.")
          ) {
            console.log("Supplier created successfully");
          } else if (
            typeof setSupplierResponse === "string" &&
            setSupplierResponse.includes("Supplier code already exists.")
          ) {
            console.log(
              "Supplier code already exists, skipping success alert for supplier."
            );
            // ไม่ต้องทำอะไร ให้ข้ามไปแจ้งเตือนบันทึกสำเร็จของ Header
          } else if (typeof setSupplierResponse !== "string") {
            // กรณี Response เป็น JSON อาจมี Logic อื่นๆ ในการตรวจสอบความสำเร็จ
            // หากไม่สำเร็จจริงๆ คุณอาจต้องการ Throw Error ที่นี่
            console.warn(
              "Unexpected response from SetSupplier:",
              setSupplierResponse
            );
          }
        } catch (error) {
          console.error("Error during SetSupplier:", error);
          // ตรวจสอบ Error Message หากเป็น Supplier Code ซ้ำ ให้ Log และข้ามการแจ้งเตือน Error
          if (
            error.message.includes("SupplierCode :") &&
            error.message.includes("is already exsist.")
          ) {
            console.log(
              "Supplier code already exists, skipping error alert for supplier."
            );
          } else {
          }
        }
      }

      // แจ้งเตือนบันทึกข้อมูลสำเร็จของ Header เสมอ
      Swal.fire({
        icon: "success",
        title: `บันทึกข้อมูลสำเร็จ PI:${AccDocNo}`,
        showConfirmButton: false,
        timer: 2000,
      });

      await fetchDataFromApi(doctype);

      console.log("nameEDoc:", selectedEName);
      console.log("accDocNo:", AccDocNo);

      navigate(`${URL}AccordionPI?accDocNo=${AccDocNo}`);
    } catch (error) {
      console.error("Error saving data (Header):", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึก Header",
        text: error.message || "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleUpdate = async () => {
    console.log("Updated action from DIHeader");
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
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
          }`
        );
      }

      console.log("Data updated successfully");
      // alert("แก้ไขข้อมูลสำเร็จ");
      Swal.fire({
        icon: "success",
        title: `แก้ไขข้อมูล PI:${accDocNo}สำเร็จ`,
        showConfirmButton: false,
        timer: 2000,
      });
      await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const AccDocNoC = formData.accDocNo;
  // --------------------------------------
  const [bankName, setBankName] = useState("");

  const handlePC = async (AccDocNoC) => {
    // show Swal with bank account (required), bank name (optional) and transtype select (TR/CQ)
    try {
      const prefillBankName = (bankName || "").replace(/"/g, "&quot;");
      const currentDate = new Date().toISOString().split('T')[0];
      const { value: formValues } = await Swal.fire({
        title: "ข้อมูลสำหรับสร้าง Cheque/Transfer Payment",
        width: '600px',
        html:
          `<div style="display: grid; grid-template-columns: 140px 1fr; gap: 15px; text-align: right; align-items: center; padding-right: 20px;">` +

          `<label for="swal-bankacc" style="font-weight: bold;">Bank Account:</label>` +
          `<input id="swal-bankacc" class="swal2-input" placeholder="Bank Account" style="margin: 0; width: 100%;">` +

          `<label for="swal-bankname" style="font-weight: bold;">Bank Name:</label>` +
          `<input id="swal-bankname" class="swal2-input" placeholder="Bank Name" value="${prefillBankName}" style="margin: 0; width: 100%;">` +

          `<label for="swal-rcpno" style="font-weight: bold;">Receipt No:</label>` +
          `<input id="swal-rcpno" class="swal2-input" placeholder="เลขใบเสร็จ/ใบกำกับ" style="margin: 0; width: 100%;">` +

          `<label for="swal-duedate" style="font-weight: bold;">Due Date:</label>` +
          `<input id="swal-duedate" class="swal2-input" type="date" value="${currentDate}" style="margin: 0; width: 100%;">` +

          `<label for="swal-transtype" style="font-weight: bold;">Type:</label>` +
          `<select id="swal-transtype" class="swal2-select" style="margin: 0; width: 100%;">` +
          `<option value="TR">TR - Transfer</option>` +
          `<option value="CQ">CQ - Cheque</option>` +
          `</select>` +

          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const bankacc = document.getElementById("swal-bankacc")?.value?.trim();
          const bankname = document.getElementById("swal-bankname")?.value?.trim() || "";
          const transtype = document.getElementById("swal-transtype")?.value || "TR";
          const rcpno = document.getElementById("swal-rcpno")?.value?.trim();
          const duedate = document.getElementById("swal-duedate")?.value;

          if (!bankacc) {
            Swal.showValidationMessage("กรุณากรอกเลขที่บัญชี!");
            return false;
          }
          if (!duedate) {
            Swal.showValidationMessage("กรุณาระบุ Due Date");
            return false;
          }
          if (!["TR", "CQ"].includes(transtype)) {
            Swal.showValidationMessage("Invalid transtype selected");
            return false;
          }
          return { bankacc, bankname, transtype, rcpno, duedate };
        },
      });

      if (!formValues) return; // user cancelled

      const { bankacc, bankname, transtype, rcpno, duedate } = formValues;
      // persist bankName for UI reuse
      setBankName(bankname || "");

      // call PC creation with transtype
      try {
        const resp = await PCfromPI(
          AccDocNoC,
          bankacc,
          bankname,
          transtype,
          rcpno,
          duedate,
          webAddressPC,
          navigate
        );
        console.log("PCfromPI response:", resp);
        // accept several shapes returned by PCfromPI
        const pcNo =
          resp?.data?.PCNo ??
          resp?.data?.PCNoString ??
          resp?.data?.AccDocNoC ??
          resp?.PCNo ??
          resp?.data?.data?.PCNo ??
          resp?.data?.data?.AccDocNo ??
          null;

        if (!pcNo) {
          console.warn("PC created but PCNo not found in response:", resp);
          Swal.fire({
            icon: "success",
            title: "สร้าง PC สำเร็จ",
            text: "ระบบบันทึกแล้ว แต่ไม่พบหมายเลข PC ในผลตอบกลับ โปรดตรวจสอบรายการ",
            showConfirmButton: false,
            timer: 3000,
          });
          // ถ้าต้องการ ให้ fetch/รีเฟรชข้อมูลที่นี่
        } else {
          console.log("Created PC No:", pcNo);
          Swal.fire({
            icon: "success",
            title: `Created PC: ${pcNo}`,
            showConfirmButton: false,
            timer: 3000,
          });
          // navigation / refresh handled by caller ifต้องการ
        }
      } catch (err) {
        console.error("Error creating PC Header:", err);
        Swal.fire({
          icon: "error",
          title: "สร้าง Cheque/Transfer ไม่สำเร็จ",
          text: err.message || "Unknown error from PCfromPI",
        });
      }
    } catch (err) {
      console.error("handlePC error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message || "",
      });
    }
  };
  // --------------------------------------
  const handleCancel = async () => {
    await CancelPI(AccDocNoC, navigate);
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
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"
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
      navigate(`/uitestacc/DIDTList?accDocNo=${accDocNo}`, {
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
    const shortYear = new Date().getFullYear().toString().slice(-2);
    setFormData({
      accDocType: DocType,
      accDocNo: `${DocType}${shortYear}xx...`,
      accEffectiveDate: new Date().toISOString().slice(0, 10),
      partyCode: "",
      partyTaxCode: "",
      partyName: "",
      partyAddress: "",
      docRefNo: "",
      docStatus: 0,
      accBatchDate: new Date().toISOString().slice(0, 10),
      // issueBy: "admin",//แก้เมื่อทำระบบlogin`
      issueBy: localStorage.getItem("userName"),
      accPostDate: new Date().toISOString().slice(0, 10),
      fiscalYear: new Date().toISOString().slice(0, 10),
    });
  };

  // ---------------------
  const [supplierOptions, setSupplierOptions] = useState([]); // state สำหรับข้อมูลจาก API Supplier
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchSupplierOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/Supplier/GetSupplier`);
        console.log("supplierOptions:", supplierOptions);
        setSupplierOptions(response.data); // อัปเดต state Supplier
      } catch (error) {
        console.error("Error fetching Supplier options:", error);
      }
    };
    fetchSupplierOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSupplierSelect = (partyCode) => {
    const selectedSupplier = supplierOptions.find(
      (supplier) => supplier.supplierCode === partyCode
    );

    if (selectedSupplier) {
      setFormData({
        ...formData,
        partyCode: partyCode,
        partyCode: selectedSupplier.supplierCode,
        partyTaxCode:
          selectedSupplier.taxNumber + "/" + selectedSupplier.taxBranch,
        partyName: selectedSupplier.supplierName,
        partyAddress: selectedSupplier.address1,
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
    return supplierOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  const docStatus = formData.docStatus;
  const accDocNo = formData.accDocNo;
  const docRefNo = formData.docRefNo;

  // const AccDocNO = formData.accDocNo;
  const handleDI = async (accDocNo) => {
    // 1. แสดง Modal เพื่อรับค่า refno จากผู้ใช้
    const { value: refno } = await Swal.fire({
      title: "กรอกเลขที่เอกสารอ้างอิง",
      input: "text",
      inputLabel: `(Ref. No.) ${accDocNo}`,
      // inputPlaceholder: "กรุณากรอกเลขที่เอกสารอ้างอิง",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "กรุณากรอกเลขที่เอกสารอ้างอิง!";
        }
      },
    });

    // 2. ถ้าผู้ใช้กด Cancel หรือปิด Modal
    if (!refno) {
      return; // หยุดการทำงาน
    }

    // 3. ถ้าผู้ใช้กรอกค่า refno แล้ว
    // เรียกฟังก์ชัน DIfromPI พร้อมกับส่งค่า accDocNo และ refno ไปด้วย
    await DIfromPI(accDocNo, refno, navigate);
  };

  // หน้า ใบแจ้งค่าใช้จ่าย PI ปุ่ม จ่ายเงิน/จ่ายชำระเงิน
  const handlePV = async (accDocNo) => {
    const docRefNo = formData.docRefNo;
    await PVfromPI(accDocNo, docRefNo, navigate, webAddressPV);
    navigate({
      state: { accDocNo, docRefNo },
    });
  };

  // ----------------------------
  // หน้า ใบรับวางบิล PI ปุ่ม ส่งสมุดรายวันไปยัง Journal
  const handlePIToJournal = async (accDocNo) => {
    await PIToJournal(accDocNo, navigate);
    navigate({
      state: { accDocNo },
    });
  };
  // -------------------------------
  const [showModal, setShowModal] = useState(false);
  const [glData, setGLData] = useState(null);
  // ฟังก์ชันนี้จะถูกเรียกเมื่อต้องการดู GL Template
  const docConfigID = selectedDocConfigID;
  const handleGL = async (accDocNo, docConfigID) => {
    //เบื้องต้นดูได้อย่า่งเดียว ยังไม่ได้ส่งไปJNได้
    console.log("Modal", accDocNo); // ตรวจสอบค่า AccDocNoC
    console.log("Modal", docConfigID); // ตรวจสอบค่า docConfigID
    const response = await GetGLTemplate(accDocNo, docConfigID);
    if (response && response.data) {
      console.log("GL Template Data received, setting showModal to true.");
      setGLData(response.data); // set เฉพาะ array
      setShowModal(true); // เปิด Modal
    }
  };
  // -------------------------------
  const [webAddressPC, setWebAddressPC] = useState("");
  const [webAddressPV, setWebAddressPV] = useState("");
  useEffect(() => {
    const fetchWebAddress = async () => {
      try {
        // Fetch PC Web Address
        const WebAddressAPIPC = `${API_BASE}/Module/GetModuleMenu?MenuID=PC`;
        const responsePC = await authFetch(WebAddressAPIPC);
        if (responsePC.ok) {
          const data = await responsePC.json();
          if (data && data.length > 0) {
            setWebAddressPC(data[0].webAddress);
          }
        }

        // Fetch PV Web Address
        const WebAddressAPIPV = `${API_BASE}/Module/GetModuleMenu?MenuID=PV`;
        const responsePV = await authFetch(WebAddressAPIPV);
        if (responsePV.ok) {
          const data = await responsePV.json();
          if (data && data.length > 0) {
            setWebAddressPV(data[0].webAddress);
          }
        }
      } catch (error) {
        console.error("Error fetching WebAddress:", error);
      }
    };
    fetchWebAddress();
  }, []);
  // -----------------------------------
  const handlePrint = async () => {
    const accDocType = formData.accDocType;
    const accDocNo = formData.accDocNo;
    console.log("AccDocNo:", accDocNo);
    const printUrl = `${REPORT_BASE}/Form?Form=Form${accDocType}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${accDocNo}`;
    window.open(printUrl, "_blank");
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
      name: "Save Purchase Invoice",
      onClick: handleSave,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPrint} style={{ color: "blue" }} size="1x" />
      ),
      name: "Print Purchase Invoice",
      onClick: handlePrint,
    },
    ...(docStatus === "0" || docStatus === 1
      ? [
        {
          icon: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faTruckRampBox}
                size="1x"
                style={{ color: "#ff7f00" }}
              />
            </div>
          ),
          name: "DI(ทำรับของตามใบแจ้งหนี้)",
          onClick: () => handleDI(accDocNo, navigate),
        },
      ]
      : []),
    ...(docStatus === "0"
      ? [
        {
          icon: (
            <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              style={{ color: "#960202ff" }}
              size="1x"
            />
          ),
          name: "Cheque Payment(จ่ายเช็ค)",
          onClick: () => handlePC(AccDocNoC),
        },
        //    ]
        //  : []),
        {
          icon: (
            <FontAwesomeIcon
              icon={faMoneyCheck}
              style={{ color: "#f94f01" }}
              size="1x"
            />
          ),
          name: "Payment Voucher(จ่ายชำระเงิน)",
          onClick: () => handlePV(accDocNo, docRefNo, navigate),
        },
      ]
      : []),
    {
      icon: (
        <FontAwesomeIcon
          icon={faMoneyCheck}
          style={{ color: "#d01703ff" }}
          size="1x"
        />
      ),
      name: "ใบรับวางบิล (ส่งสมุดรายวันไปยัง Journal)",
      onClick: () => handlePIToJournal(accDocNo, navigate),
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faFileLines}
          style={{ color: "#bb0475ff" }}
          size="1x"
        />
      ),
      name: "สมุดรายวันทั่วไป (GL)",
      onClick: () => handleGL(accDocNo, docConfigID),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "New",
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
          name: "Update",
          onClick: handleUpdate,
        },
        //  {
        //    icon: (
        //      <FontAwesomeIcon
        //        icon={faTrash}
        //        style={{ color: "#ae0000" }}
        //        size="1x"
        //      />
        //    ),
        //    name: "Cancel",
        //    onClick: handleCancel,
        //  },
      ]
      : []),
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color: "#ae0000" }}
          size="1x"
        />
      ),
      name: "Cancel",
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

  useEffect(() => {
    if (
      apiData &&
      apiData.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < apiData.length
    ) {
      setFormData({
        accDocType: apiData[currentIndex].accDocType || "",
        accDocNo: apiData[currentIndex].accDocNo || "",
        accBatchDate: apiData[currentIndex].accBatchDate?.split("T")[0] || "",
        accEffectiveDate: apiData[currentIndex].accEffectiveDate?.split("T")[0] || "",
        partyCode: apiData[currentIndex].partyCode || "",
        partyTaxCode: apiData[currentIndex].partyTaxCode || "",
        partyName: apiData[currentIndex].partyName || "",
        partyAddress: apiData[currentIndex].partyAddress || "",
        docRefNo: apiData[currentIndex].docRefNo || "",
        docStatus: Number(apiData[currentIndex].docStatus) || "0",
        issueBy: apiData[currentIndex].issueBy || "",
        accPostDate: apiData[currentIndex].accPostDate?.split("T")[0] || "",
        fiscalYear: apiData[currentIndex].fiscalYear?.split("T")[0] || "",
      });
      setCurrentAccDocNo(apiData[currentIndex].accDocNo);
    }
  }, [currentIndex, apiData]);

  useEffect(() => {
    if (accDocNoFromUrl && !isNewMode) {
      // ดึงข้อมูลจาก API ด้วย accDocNo จาก URL
      const fetchByAccDocNo = async () => {
        try {
          const apiUrl = `${API_BASE}/AccTransaction/GetAccTransactionHD?accDocNo=${accDocNoFromUrl}`;
          const response = await authFetch(apiUrl);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setApiData(data);
            setAccDocNoFromApi(data[0].accDocNo);
            setFormData({
              accDocType: data[0].accDocType || "",
              accDocNo: data[0].accDocNo || "",
              accBatchDate: data[0].accBatchDate?.split("T")[0] || "",
              accEffectiveDate: data[0].accEffectiveDate?.split("T")[0] || "",
              partyCode: data[0].partyCode || "",
              partyTaxCode: data[0].partyTaxCode || "",
              partyName: data[0].partyName || "",
              partyAddress: data[0].partyAddress || "",
              docRefNo: data[0].docRefNo || "",
              docStatus: Number(data[0].docStatus) || 0,
              issueBy: data[0].issueBy || "",
              accPostDate: data[0].accPostDate?.split("T")[0] || "",
              fiscalYear: data[0].fiscalYear?.split("T")[0] || "",
            });
          }
        } catch (error) {
          console.error("Error fetching by accDocNo:", error);
        }
      };
      fetchByAccDocNo();
    }
  }, [accDocNoFromUrl, isNewMode]);

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
          value={formData.accDocType || doctype}
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
          <MenuItem value={DI}>Delivery In</MenuItem>
        </TextField>
      </div>
      <div>&nbsp;</div> */}

      <div className="col-md-6">
        <TextField
          id="accDocNo"
          label="AccDocNo"
          value={formData.accDocNo || AccDocNo || ""}
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
            <h4 style={{ textAlign: "center" }}>Select Supplier</h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedData().map((supplier) => (
              <ListItem key={supplier.supplierID} disablePadding>
                <ListItemButton
                  onClick={() => handleSupplierSelect(supplier.supplierCode)}
                >
                  <ListItemText primary={supplier.supplierCode} />
                  <h5>{supplier.supplierName}</h5>
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
                count={Math.ceil(supplierOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                page={currentPage} // กำหนดหน้าปัจจุบัน
                onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
              />
            </Stack>
          </div>
        </div>
      </Modal>
      {isMoreInfoModalOpen && (
        <MoreInfoHD
          open={isMoreInfoModalOpen}
          handleClose={handleCloseMoreInfoModal}
          accDocNo={formData.accDocNo}
          accDocType={formData.accDocType}
          docConfigID={selectedDocConfigID}
          fetchDataFromApi={fetchDataFromApi}
        />
      )}

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
        <DocStatusPI accDocNo={formData.accDocNo} DocType={formData.accDocType} />
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
          InputProps={{
            readOnly: true,
            style: {
              backgroundColor: "#cdcdd1",
            }
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
      <GLTemplateModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        data={glData}
      />
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none", paddingTop: "3px" }}
      />
      <div style={{ display: "grid", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
    </div>
  );
}
