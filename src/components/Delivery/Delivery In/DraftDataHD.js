import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig";
import { useAuthFetch } from "../../Auth/fetchConfig";
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
  faAngleRight,
  faAnglesRight,
  faPen,
  faTrash,
  faFloppyDisk,
  faEllipsisVertical,
  faPlus,
  faPrint,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
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
import { API_BASE, API_VIEW_RESULT, DATA_BASE, REPORT_BASE, URL } from "../../api/url";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import MoreInfoHD from "../../AdditionData/AdditionDataHD/MoreInfoHD";
import { CancelDI } from "./CancelDI";
import DocStatusDI from "./DocStatusDI";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function DraftDataHD({ apiData, setApiData, currentIndex,
  setCurrentIndex, setCurrentAccDocNo, setOcrDetailItems, ocrDetailItems,
  productMaster, accDocType: accDocTypeProp }) {
  // const AccDocNo = useSelector((state) => state.accDocNo); // ดึงข้อมูล transaction จาก Store
  const PartyName = useSelector((state) => state.partyName);
  const location = useLocation();
  const { mappedOCR, fromOCRData } = location.state || {};
  const authFetch = useAuthFetch();
  const isNewMode = location.state && location.state.isNew;
  const [doctype, setDoctype] = React.useState("");
  const shortYear = new Date().getFullYear().toString().slice(-2);
  const [loading, setLoading] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf('month'));
  const [filterEndDate, setFilterEndDate] = useState(dayjs().endOf('month'));
  const [transactionall, setTransactionAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    docStatus: 0,
    accBatchDate: new Date().toISOString().slice(0, 10),
    issueBy: localStorage.getItem("userName") || "",
    accPostDate: new Date().toISOString().slice(0, 10),
    fiscalYear: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    // ตรวจสอบว่ามีการส่ง mappedOCR มาทาง state หรือไม่
    if (location.state && location.state.mappedOCR) {
      const ocrData = location.state.mappedOCR;
      const taxCodeFromOCR = ocrData.taxNumber;
      console.log("Received OCR Data in Header:", ocrData);
      // 💡 2. ใช้ ocrData อัปเดต formData
      setFormData(prevFormData => ({
        ...prevFormData,
        partyName: ocrData.partyName || prevFormData.partyName,
        // partyTaxCode: ocrData.taxNumber || prevFormData.partyTaxCode,
        partyTaxCode: taxCodeFromOCR || prevFormData.partyTaxCode,
        partyAddress: ocrData.address || prevFormData.partyAddress,
        docRefNo: ocrData.invoiceNo || prevFormData.docRefNo, // หรือใช้ ocrData.docRefNo ถ้ามีการ Map

        // 💡 3. จัดการ Date Format: ต้องแปลง 'YYYY-MM-DD' ให้ตรงกับ TextField type="date"
        accBatchDate: ocrData.invoiceDate
          ? formatDateToInput(ocrData.invoiceDate)
          : prevFormData.accBatchDate,
      }));

      // 📝 เพิ่ม Logic เพื่อส่ง detailItems ไปยัง Detail Component ด้วย
      if (ocrData.detailItems && ocrData.detailItems.length > 0) {
        setOcrDetailItems(ocrData.detailItems);
      } else {
        setOcrDetailItems([]);
      }

      console.log("Header received OCR Data:", ocrData);
      if (taxCodeFromOCR) {
        findAndAutoSelectSupplier(taxCodeFromOCR);
      }
    }
  }, [location.state, setFormData, setOcrDetailItems]); // ให้ทำงานเมื่อ location.state เปลี่ยน

  const findAndAutoSelectSupplier = async (taxCode) => {
    if (!taxCode) return;

    try {
      // 1. เรียก API เพื่อค้นหา Supplier ที่ตรงกับ TaxCode ทันที
      const apiUrl = `${API_BASE}/Supplier/GetSupplier?taxNumber=${taxCode}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        const supplier = response.data[0]; // ใช้ Supplier ตัวแรกที่พบ

        // 2. อัปเดต formData โดยตรงด้วยข้อมูล Supplier ที่ค้นพบ
        setFormData(prevFormData => ({
          ...prevFormData,
          partyCode: supplier.supplierCode,
          partyTaxCode: supplier.taxNumber + (supplier.taxBranch ? "/" + supplier.taxBranch : ""),
          partyName: supplier.supplierName,
          partyAddress: supplier.address1 + " " + supplier.address2
        }));
        console.log("Auto-selected Supplier based on OCR Tax Code.");
      }
    } catch (error) {
      console.error("Error during auto-select supplier:", error);
    }
  };

  // ... ฟังก์ชัน formatDateToInput
  const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    // ตรวจสอบว่าเป็นรูปแบบที่ถูกต้องหรือไม่ และแปลงให้เป็น "YYYY-MM-DD"
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

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
      setSelectedDocConfigID(selectedOption.docConfigID);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    // fetchDataFromApi(selectedCategory);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const DocType = accDocTypeProp; // ใช้ค่าที่ส่งมาจาก parent หรือ fallback เป็น 'DI'

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedEName, setSelectedEName] = useState("");

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${DocType}`;
        const response = await authFetch(categoryApiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (Array.isArray(data)) {
          setCategoryOptions(
            data.map((item) => ({ value: item.category, label: item.eName, docConfigID: item.docConfigID, }))
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
    if (formData.accDocType) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === formData.accDocType
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
        console.log("Selected Document Config ID:", matchedOption.docConfigID);
        setSelectedDocConfigID(matchedOption.docConfigID);
      } else {
        setSelectedEName("");
      }
    }
  }, [formData.accDocType, categoryOptions]);

  const [showButton, setShowButton] = useState(false);
  const [accDocNoFromApi, setAccDocNoFromApi] = useState(null);
  const params = new URLSearchParams(location.search);

  const navigate = useNavigate();

  const findProductCodeByDescription = useCallback((description) => {
    if (!description || productMaster.length === 0) return null;

    const cleanDescription = description.trim().toLowerCase();

    // 💡 NEW LOGIC: ใช้ Includes Match (Partial Match)
    const matchedProduct = productMaster.find(product => {
      const cleanProductName = product.productName?.trim().toLowerCase();

      // ตรวจสอบว่าชื่อสินค้าใน Master มีคำบรรยายจาก OCR อยู่ภายในหรือไม่
      return cleanProductName && cleanProductName.includes(cleanDescription);
    });

    if (matchedProduct) {
      console.log("Match Success:", cleanDescription, "->", matchedProduct.productCode); // 💡 LOG SUCCESS
      return {
        productCode: matchedProduct.productCode,
        rateVat: parseFloat(matchedProduct.rateVat) || 0,
        rateWht: parseFloat(matchedProduct.rateWht) || 0,
        vatType: parseInt(matchedProduct.vatType, 10) || 0,
        unitMea: matchedProduct.productSizeUnit || matchedProduct.unitStock,
      };
    }

    console.log("Match Fail:", cleanDescription);
    return null;
  }, [productMaster]);
  const saveDetailItems = async (AccDocNo, detailItems) => {
    console.log("Starting Single Save Detail Items (Looping) for AccDocNo:", AccDocNo);
    if (!detailItems || detailItems.length === 0) {
      console.log("No detail items to save.");
      return;
    }

    try {
      // 💡 วนลูปและเรียก API ทีละรายการ
      for (const [index, item] of detailItems.entries()) {

        const qtyValue = parseFloat(item.quantity) || 0;
        const priceValue = parseFloat(item.unitPrice) || 0;
        const amountValue = parseFloat(item.lineTotal) || (qtyValue * priceValue) || 0;
        const matchedProduct = findProductCodeByDescription(item.partNameAndDescription);
        // 1. เตรียม Payload สำหรับรายการเดี่ยว
        const dataToSendDT = {
          accDocNo: AccDocNo,
          accItemNo: index + 1, // กำหนด ItemNo ตามลำดับ
          accSourceDocNo: "",
          accSourceDocItem: 0,
          stockTransNo: 0,

          qty: qtyValue,
          price: priceValue,
          unitMea: item.unitMea || "PCS",
          currency: item.currency || "THB",
          exchangeRate: parseFloat(item.exchangeRate) || 1,
          amount: amountValue,

          // 💡 A. ใช้ SaleProductCode ที่ Match ได้
          saleProductCode: matchedProduct?.productCode || "DEF",
          salesDescription: item.partNameAndDescription || "N/A",

          // 💡 B. ใช้ค่าภาษีที่ Match ได้ ถ้า Match ไม่ได้ ให้ใช้ค่าจาก OCR (item)
          rateVat: matchedProduct?.rateVat || parseFloat(item.rateVat) || 0,
          rateWht: matchedProduct?.rateWht || parseFloat(item.rateWht) || 0,
          vatType: matchedProduct?.vatType || parseInt(item.vatType, 10) || 0,
        };

        console.log(`Detail Item ${index + 1} Payload (Single Array):`, JSON.stringify([dataToSendDT]));

        // 2. เรียก API ทีละรายการ (Single Insert)
        //    **สำคัญ:** ส่งเป็น Array ที่มี Object เดียว ตามรูปแบบที่พิสูจน์แล้วว่าสำเร็จ
        const responseDT = await axios.post(
          `${API_BASE}/AccTransaction/SetAccTransactionDT`,
          [dataToSendDT], // ส่ง [ { Item Data } ]
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (responseDT.status !== 200 && responseDT.status !== 201) {
          // Axios ควรโยน error สำหรับ 4xx/5xx แต่เราเช็คเพื่อความชัวร์
          throw new Error(`API Status: ${responseDT.status}`);
        }
        console.log(`Detail Item ${index + 1} saved successfully. ${responseDT.data}`);
      }

      // 3. แจ้งเตือนความสำเร็จรวมเมื่อจบ Loop
      Swal.fire({
        icon: "success",
        title: `บันทึกรายการ Detail ${detailItems.length} รายการสำเร็จ`,
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (error) {
      // 4. ดักจับ Error รวม
      console.error("Critical Error in saveDetailItems:", error);

      // แสดงข้อความ error จาก response ถ้ามี
      const responseData = error.response?.data;
      const status = error.response?.status;

      throw new Error(`บันทึก Detail Item ล้มเหลว: HTTP error during Detail Save! status: ${status || 'N/A'}, message: ${JSON.stringify(responseData?.errors || responseData || error.message)}`);
    }
  };
  const handleSave = async () => {
    try {
      const dataToSendHD = { ...formData };
      // กำหนด accDocNo = DocType + invoiceNo (DocRefNo จาก OCR)
      const invoiceNo = formData.docRefNo;
      dataToSendHD.accDocNo = `${invoiceNo}`;
      console.log("accDocNo to send:", dataToSendHD.accDocNo);
      // ถ้า partyCode ว่าง ให้ใช้ 'DEF' เป็นค่าเริ่มต้น
      if (!dataToSendHD.partyCode) {
        dataToSendHD.partyCode = "DEF";
      }
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
      if (!dataToSendHD.accDocType) {
        dataToSendHD.accDocType = DocType;
      }

      console.log(
        "Data to send for SetAccTransactionHD:",
        JSON.stringify(dataToSendHD)
      );

      const responseHD = await authFetch(
        // `${API_BASE}/AccTransaction/SetAccTransactionHD`,
        `${API_BASE}/AccTransaction/SetAccTransactionHDOnlyPrefix`,
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
      const partyCode = formData.partyCode || "DEF"; // fallback เป็น DEF ถ้าไม่ได้เลือก Supplier
      const partyTaxCode = formData.partyTaxCode;
      const partyName = formData.partyName;
      const partyAddress = formData.partyAddress;
      const nameCategory = selectedEName;

      // ฟังก์ชันสำหรับเรียก API SetSupplier
      const setSupplier = async (supplierData) => {
        const response = await authFetch(
          `${API_BASE}/Supplier/SetSupplier`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
            body: JSON.stringify(supplierData),
          }
        );
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

      if (ocrDetailItems && ocrDetailItems.length > 0) {
        await saveDetailItems(AccDocNo, ocrDetailItems); // 💡 เรียกฟังก์ชันบันทึก Detail
      }
      // แจ้งเตือนบันทึกข้อมูลสำเร็จของ Header เสมอ
      Swal.fire({
        icon: "success",
        title: `บันทึกข้อมูลสำเร็จ ${AccDocNo}`,
        showConfirmButton: false,
        timer: 2000,
      });

      // await fetchDataFromApi(doctype);

      console.log("nameEDoc:", selectedEName);
      console.log("accDocNo:", AccDocNo);

      navigate(`${URL}Accordion${DocType}?accDocNo=${AccDocNo}`);

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
        title: `แก้ไขข้อมูล DI:${accDocNo}สำเร็จ`,
        showConfirmButton: false,
        timer: 2000,
      });
      // await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const AccDocNoC = formData.accDocNo;

  const handleCancel = async () => {
    await CancelDI(AccDocNoC, navigate);
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
      // await fetchDataFromApi(doctype);
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  useEffect(() => {
    if (location.state && location.state.isNew) {
      handleNew(); // เรียกใช้ handleNew ถ้า isNew เป็น true
    }
  }, [location.state]);
  const handleNew = () => {
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
  // --------------------------------
  const fetchTransactionHD = useCallback(async () => {
    setLoading(true);
    let CurrentMonth = new Date().toISOString().split("T")[0];
    console.log("CurrentMonth:", CurrentMonth);
    const dateFrom = dayjs(filterStartDate).format("YYYY-MM-DD");
    const dateTo = dayjs(filterEndDate).format("YYYY-MM-DD");
    console.log("Fetching data from date:", dateFrom);
    console.log("filterEndDate:", dateTo);
    const vPO_H = {
      viewName: "vPO_H",
      parameters: [
        { field: "AccBatchDate", UseOperator: "BETWEEN", From: dateFrom, To: dateTo },
      ],
      results: [
        { sourceField: "AccDocNo" },
        { sourceField: "PartyName" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "AccBatchDate" },
        { sourceField: "DocStatus" },
        { sourceField: "TotalNet" },
        { sourceField: "AccDocType" },
        { sourceField: "StatusName" },
        { sourceField: "DocRefNo" },
      ],
    };

    try {
      console.log("vPO_H:", vPO_H);
      const response = await axios.post(API_VIEW_RESULT, vPO_H, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("data_vPO_H", response.data);
        // console.log("localStorage:", localStorage.getItem("userToken"));
        setTransactionAll(
          response.data.sort((a, b) => b.AccDocNo.localeCompare(a.AccDocNo))
        );
        setSearchTerm("");
      } else {
        setLoading(false);
        console.error("Error:", response.statusText);
        setTransactionAll([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("userToken");
        if (window.loginModal && typeof window.loginModal === "function") {
          window.loginModal();
        }
      }
    }
  }, [filterStartDate, filterEndDate]); // เพิ่ม filterStartDate, filterEndDate ใน dependency array

  // ---------------------
  const [supplierOptions, setSupplierOptions] = useState([]); // state สำหรับข้อมูลจาก API Supplier
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  const ocrTaxCode = formData.partyTaxCode; //เพื่อกรอก taxcode จาก ocr
  useEffect(() => {
    const fetchSupplierOptions = async () => {
      // console.log("Fetching Supplier options with OCR Tax Code:", ocrTaxCode);
      try {
        let apiUrl = `${API_BASE}/Supplier/GetSupplier`;

        // if (ocrTaxCode) {
        //     apiUrl = `${API_BASE}/Supplier/GetSupplier?taxNumber=${ocrTaxCode}`;
        // }
        const response = await axios.get(apiUrl);
        console.log("supplierOptions:", response.data);
        setSupplierOptions(response.data); // อัปเดต state Supplier
      } catch (error) {
        console.error("Error fetching Supplier options:", error);
      }
    };

    fetchSupplierOptions();
  }, [ocrTaxCode]); // ใส่ ocrTaxCode เป็น dependency

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
        // partyCode: partyCode,
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


  const handlePrint = async () => {
    // const PR = "PR"; // กำหนดค่า PR ให้ถูกต้อง
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
          size="x"
        />
      ),
      name: "Save DI Draft",
      onClick: handleSave,
    },
  ];

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <CircularButtonGroup actions={buttonActions} />
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="accDocNo"
          label="AccDocNo (Auto)"
          // value={formData.accDocNo || "Auto-generated..."}
          value={formData.accDocNo}
          placeholder={`Auto-generated...`}
          type="text"
          slotProps={{
            input: {
              readOnly: true,
              style: {
                backgroundColor: "#cdcdd1",
              }
            },
          }}
          style={{
            width: "100%"
            // ,backgroundColor: "#cdcdd1"
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6" style={{ display: "flex" }}>
        <TextField
          id="partyCode"
          label="PartyCode"
          value={formData.partyCode || `DEF`}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
        // fetchDataFromApi={fetchDataFromApi}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <DocStatusDI accDocNo={formData.accDocNo} />
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            readOnly: true,
            style: {
              backgroundColor: "#cdcdd1",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
        />
      </div>
      <div>&nbsp;</div>

    </div>

  );
}
