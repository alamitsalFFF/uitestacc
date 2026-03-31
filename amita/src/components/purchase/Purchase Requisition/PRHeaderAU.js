import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
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
  faInfo,
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
import PRListDT from "../PRListDT";
import PRDT from "./PRDT";
import { POfromPR } from "../POFromPR";
// import ButtonPR from "../ButtonPR";
import { API_BASE, DATA_BASE, REPORT_BASE, URL } from "../../api/url";
import { useAuthFetch } from "../../Auth/fetchConfig";
import DocStatusPR from "./DocStatusPR";
import ButtonAction from "../../DataFilters/ButtonAction";
// import { useNavigate } from 'react-router-dom';
import POManagementComponent from "./POManagementComponent";
// import { POfromPRPartial } from "./POFromPRPartial";
import MoreInfoHD from "../../AdditionData/AdditionDataHD/MoreInfoHD";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import { CancelPR } from "../CancelPR";

export default function PRHeaderAU({ apiData, setApiData, currentIndex, setCurrentIndex, setCurrentAccDocNo }) {
  const AccDocNo = useSelector((state) => state.accDocNo); // ดึงข้อมูล transaction จาก Store
  const PartyName = useSelector((state) => state.partyName);
  const AccEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const DocStatus = useSelector((state) => state.docStatus);
  const amount = useSelector((state) => state.amount);
  const AccDocType = useSelector((state) => state.accDocType);
  const statusName = useSelector((state) => state.statusName);
  // const useAuth = useAuthFetch();
  const authFetch = useAuthFetch();
  const location = useLocation();
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
    // issueBy: "admin",
    issueBy: localStorage.getItem("userName") || "",
    accPostDate: new Date().toISOString().slice(0, 10),
    fiscalYear: new Date().toISOString().slice(0, 10),
  });
  const docStatusState = formData.docStatus; //ไว้ล็อคสถานะของปุ่ม

  const [displayedStatusName, setDisplayedStatusName] = useState(""); // สร้าง state ใหม่เพื่อเก็บค่า displayedStatusName
  const handleStatusNameChange = (statusName) => {
    setDisplayedStatusName(statusName); // ฟังก์ชันสำหรับอัปเดต displayedStatusName
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
      setSelectedDocConfigID(selectedOption.DocConfigID);
    } else {
      setSelectedEName(""); // ถ้าไม่พบ eName ให้ตั้งค่าว่าง
    }
    fetchDataFromApi(selectedCategory);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const PR = "PR";
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

  // useEffect(() => {
  //   if (AccDocType && categoryOptions.length > 0) {
  //     const matchedOption = categoryOptions.find(
  //       (option) => option.value === AccDocType
  //     );
  //     if (matchedOption) {
  //       setSelectedEName(matchedOption.label);
  //       setSelectedDocConfigID(matchedOption.docConfigID);
  //     } else {
  //       setSelectedEName("");
  //     }
  //   } else {
  //     setSelectedEName("");
  //   }
  // }, [AccDocType, categoryOptions]);

  useEffect(() => {
    if (formData.accDocType) {
      const matchedOption = categoryOptions.find(
        (option) => option.value === formData.accDocType
      );
      if (matchedOption) {
        setSelectedEName(matchedOption.label);
        console.log("docConfigID:", matchedOption.docConfigID);
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
    if (AccDocType && !isNewMode) {
      // เพิ่มเงื่อนไข !isNewMode
      fetchDataFromApi(AccDocType, accDocNoFromUrl);
    }
  }, [AccDocType, accDocNoFromUrl, isNewMode]);

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

  // const goToNext = () => {
  //   setCurrentIndex((prev) => {
  //     const next = Math.min(prev + 1, apiData.length - 1);
  //     setCurrentAccDocNo(apiData[next].accDocNo); // อัปเดต accDocNo ที่ใช้ใน PRDTAU
  //     return next;
  //   });
  // };
  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, apiData.length - 1));
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
    console.log("Navigation disabled:", disabled); // ตรวจสอบค่า disabled
    return disabled;
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการบันทึก",
      text: "คุณต้องการสร้างPRใหม่ใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
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

        const responseHD = await authFetch(
          `${API_BASE}/AccTransaction/SetAccTransactionHD`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
        const AccDocNo = responseDataHD.accDocNo;
        const partyCode = formData.partyCode;
        const partyTaxCode = formData.partyTaxCode;
        const partyName = formData.partyName;
        const partyAddress = formData.partyAddress;

        // แจ้งเตือนบันทึกข้อมูลสำเร็จของ Header เสมอ
        Swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ PR:${AccDocNo}`,
          showConfirmButton: false,
          timer: 2000,
        });

        // ตรวจสอบค่า partyCode และดำเนินการเรียก API SetSupplier ถ้าไม่ใช่ 'DEF'
        if (partyCode !== "DEF") {
          const supplierResult = await Swal.fire({
            title: "ยืนยันการบันทึก Supplier",
            text: "คุณต้องการบันทึกข้อมูล Supplier ใหม่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          });

          if (supplierResult.isConfirmed) {
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

            try {
              const response = await authFetch(`${API_BASE}/Supplier/SetSupplier`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierPayload),
              });

              if (!response.ok) {
                const errorText = await response.text();
                if (errorText.includes("is already exsist.")) {
                  Swal.fire({
                    icon: "warning",
                    title: "มี SupplierCode นี้อยู่แล้ว",
                    text: `รหัส ${partyCode} มีอยู่ในระบบแล้ว`,
                  });
                }
              } else {
                console.log("Supplier created successfully");
              }
            } catch (error) {
              console.error("Error during SetSupplier:", error);
              if (error.message && error.message.includes("is already exsist.")) {
                Swal.fire({
                  icon: "warning",
                  title: "มี SupplierCode นี้อยู่แล้ว",
                  text: `รหัส ${partyCode} มีอยู่ในระบบแล้ว`,
                });
              }
            }
          }
        }

        await fetchDataFromApi(doctype);
        navigate(`${URL}AccordionPR?accDocNo=${AccDocNo}`);
      } catch (error) {
        console.error("Error saving data (Header):", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการบันทึก Header",
          text: error.message || "กรุณาลองใหม่อีกครั้ง",
        });
      }
    }
  };

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการบันทึก",
      text: "คุณต้องการบันทึกการแก้ไขข้อมูลใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const dataToSend = { ...formData };
        const accDocNo = formData.accDocNo;

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
        Swal.fire({
          icon: "success",
          title: `แก้ไขข้อมูล ${accDocNo} เรียบร้อย`,
          showConfirmButton: false,
          timer: 2000,
        });
        await fetchDataFromApi(doctype);
      } catch (error) {
        console.error("Error updating data:", error);
        alert("แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่");
      }
    }
  };
  const docStatus = formData.docStatus;
  const AccDocNoC = formData.accDocNo;

  // ------------
  const handlePO = async (AccDocNoC) => {
    console.log("AccDocNoC in handlePO:", AccDocNoC);
    // 1. แสดง Modal เพื่อรับค่า refno จากผู้ใช้
    const { value: refno } = await Swal.fire({
      title: "กรอกเลขที่เอกสารอ้างอิง",
      input: "text",
      inputLabel: `(Ref. No. ${AccDocNoC})`,
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
    await POfromPR(AccDocNoC, refno, navigate);
    // navigate("/uitestacc/POList", {
    //   state: {
    //     AccDocNo,
    //   },
    // });
  };
  // ------------
  // const handleCancel = async () => {
  //   const accDocNo = formData.accDocNo;

  //   Swal.fire({
  //     title: `Are you sure? ${accDocNo}`,
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, cancel it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const dataCancel = { ...formData, docStatus: 99 };

  //         const response = await authFetch(
  //           `${API_BASE}/AccTransaction/EditAccTransactionHD`,
  //           {
  //             method: "PUT",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(dataCancel),
  //           }
  //         );

  //         if (!response.ok) {
  //           const errorData = await response.json();
  //           throw new Error(
  //             `HTTP error! status: ${response.status}, message: ${
  //               errorData.message || "Unknown error"
  //             }`
  //           );
  //         }

  //         console.log("Data Cancel successfully");

  //         Swal.fire({
  //           title: `Deleted! ${accDocNo}`,
  //           text: "Your file has been cancel.",
  //           icon: "success",
  //         });

  //         await fetchDataFromApi(doctype);
  //       } catch (error) {
  //         console.error("Error updating data:", error);
  //         alert("ยกเลิกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
  //       }
  //     }
  //   });
  // };

  const handleCancel = async (AccDocNoC) => {
    await CancelPR(AccDocNoC, navigate);
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
      // alert("ลบข้อมูลสำเร็จ");
      Swal.fire({
        icon: "success",
        title: `ลบข้อมูลสำเร็จ PR:${response.accDocNo}`,
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
      // navigate(`/uitestacc/PRListDT?accDocNo=${accDocNo}`, {
      navigate(`/uitestacc/PRDT?accDocNo=${accDocNo}`, {
        state: {
          accDocNo: accDocNo,
          accEffectiveDate: accEffectiveDate,
          partyCode: partyCode,
          partyName: partyName,
          nameCategory: nameCategory,
          selectedDocConfigID: selectedDocConfigID,
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
    //  else if (AccDocType) {
    //   fetchDataFromApi(AccDocType); // ถ้าไม่ใช่การสร้างใหม่ ให้ดึงข้อมูลตาม AccDocType
    // }
  }, [location.state//, AccDocType
  ]); // เพิ่ม location.state ใน dependency array

  const handleNew = () => {
    const loginUser = localStorage.getItem("userName") || "";
    const shortYear = new Date().getFullYear().toString().slice(-2);
    console.log("loginUser:", loginUser);
    setFormData({
      accDocType: PR,
      accDocNo: `${PR}${shortYear}xx...`,
      accEffectiveDate: new Date().toISOString().slice(0, 10),
      partyCode: "DEF", //สำหรับ Supplier ที่ไม่ต้องการลง Mas_Supplier
      partyTaxCode: " ",
      partyName: " ",
      partyAddress: " ",
      docRefNo: " ",
      docStatus: 0,
      accBatchDate: new Date().toISOString().slice(0, 10),
      // issueBy: "admin", //แก้เมื่อทำระบบlogin
      issueBy: loginUser,
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

  const handlePrint = async () => {
    // const PR = "PR"; // กำหนดค่า PR ให้ถูกต้อง
    const accDocType = formData.accDocType;
    const accDocNo = formData.accDocNo;
    console.log("AccDocNo:", accDocNo);
    const printUrl = `${REPORT_BASE}/form?Form=Form${accDocType}&SRC=${DATA_BASE}&DB=${DATA_BASE}&Code=${accDocNo}`;
    window.open(printUrl, "_blank"); // เปิด URL ในแท็บใหม่
  };

  const [showPOManagement, setShowPOManagement] = useState(false);
  const handlePartialPOClick = () => {
    setShowPOManagement(true); // ตั้งค่าให้แสดง POManagementComponent
  };
  const handleClosePOManagement = () => {
    setShowPOManagement(false);
  };

  const buttonActions = [
    // {
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faRectangleList}
    //       style={{ color: "#e56107" }}
    //       size="1x"
    //     />
    //   ),
    //   name: "Detail",
    //   onClick: handleDetail,
    // },
    {
      icon: (
        <FontAwesomeIcon
          icon={faFloppyDisk}
          style={{ color: "green" }}
          size="1x"
        />
      ),
      name: "Save",
      onClick: handleSave, //เชฟข้อมูลเก่าได้เลขเอกสารใหม่
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPrint} style={{ color: "#0aa3ad" }} size="1x" />
      ),
      name: "Print",
      onClick: handlePrint,
    },
    // ...(docStatusState === 1
    ...(displayedStatusName === "OPEN"
      ? [
        {
          icon: (
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <FontAwesomeIcon icon={faP} style={{ color: "#f94f01" }} size="2xs" />
                <FontAwesomeIcon icon={faO} style={{ color: "#f94f01" }} size="2xs" /> */}
              <FontAwesomeIcon
                icon={faFileInvoice}
                style={{ color: "#f94f01" }}
                size="1x"
              />
            </div>
          ),
          name: "All PO",
          onClick: () => handlePO(AccDocNoC, navigate),
        },
      ]
      : []),
    ...(displayedStatusName !== "CANCEL"
      ? [
        {
          icon: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faFileInvoice}
                style={{ color: "#f94f01" }}
                size="1x"
              />
            </div>
          ),
          name: "Partial PO",
          onClick: handlePartialPOClick,
        },
      ]
      : []),
    // {
    //   icon: (
    //     <div style={{ display: "flex", alignItems: "center" }}>
    //       <FontAwesomeIcon
    //         icon={faFileInvoice}
    //         style={{ color: "#f94f01" }}
    //         size="1x"
    //       />
    //     </div>
    //   ),
    //   name: "Partial PO",
    //   onClick: handlePartialPOClick,
    // },
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "New",
      onClick: handleNew, //ล้างเริ่มเป็นค่าเริ่มต้น
    },
    // ...(docStatusState === "0"
    ...(displayedStatusName === "OPEN"
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
        {
          icon: (
            <FontAwesomeIcon
              icon={faTrash}
              style={{ color: "#ae0000" }}
              size="1x"
            />
          ),
          name: "Cancel",
          // onClick: handleCancel,
          onClick: () => handleCancel(AccDocNoC, navigate),
        },
      ]
      : []),
    {
      icon: (
        <FontAwesomeIcon icon={faInfo} style={{ color: "#6c757d" }} size="1x" />
      ),
      name: "More Info",
      onClick: handleOpenMoreInfoModal, // <--- Call the function to open the modal
    },
  ];
  const buttonActionsLNPF = [
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToLast",
      onClick: goToLast,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToNext",
      onClick: goToNext,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" />
      ),
      name: "ToPrevious",
      onClick: goToPrevious,
      disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" />
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

  // const [accDocNoForDetail, setAccDocNoForDetail] = useState(formData.accDocNo);

  // useEffect(() => {
  //   setAccDocNoForDetail(formData.accDocNo);
  // }, [formData.accDocNo]);

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      {/* <h2
        style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoMenu}
      >
        &nbsp;{selectedEName}&nbsp;
      </h2> */}
      {/* ปิดไว้เพราะใช้กับAccordionPR */}

      <div style={{ //display: "flex",
        justifyContent: "flex-end"
      }}>
        {/* <ButtonAction actions={buttonActions} /> */}
        <CircularButtonGroup actions={buttonActions} />
        {/* <CircularButtonGroup actions={buttonActionsLNPF} /> */}
        {showPOManagement && (
          <POManagementComponent
            AccDocNo={formData.accDocNo || AccDocNo}
            docRefNo={formData.docRefNo}
            onClose={handleClosePOManagement}
          />
        )}
      </div>
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none", paddingTop: "3px" }}
      />
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="accDocNo"
          label="AccDocNo"
          value={formData.accDocNo || AccDocNo || ""}
          // value={AccDocNo || ""}
          type="text"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{ width: "100%", backgroundColor: "#cdcdd1" }}
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
          // label="PartyCode"
          label="Supplier Code"
          value={formData.partyCode}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
      {isMoreInfoModalOpen && ( // <-- เพิ่มเงื่อนไขนี้
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
          label="Tax ID"
          value={formData.partyTaxCode}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-12">
        <TextField
          id="partyName"
          label="Supplier Name"
          value={formData.partyName}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-12">
        <TextField
          id="partyAddress"
          label="Address"
          value={formData.partyAddress}
          // type="text"
          multiline
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="docRefNo"
          // label="DocRefNo"
          label="DocNo Inv."
          value={formData.docRefNo || ` `}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        {/* <TextField
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
        /> */}
        <DocStatusPR
          accDocNo={formData.accDocNo}
          onStatusNameFetched={handleStatusNameChange}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
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
          InputProps={{
            // readOnly: true,
            style: {
              backgroundColor: "#ffffe0",
            }
          }}
          style={{ width: "100%" }}
        // defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div>&nbsp;</div>
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
