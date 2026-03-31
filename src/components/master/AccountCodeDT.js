import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faAngleRight,
  faAnglesRight,
  faCheck,
  faHouseMedicalCircleCheck,
  faTrash,
  faPen,
  faCircleArrowLeft,
  faEllipsisVertical,
  faFloppyDisk,
  faArrowRotateLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { API_BASE } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";

function AccountCodeDT({ selectedAccount }) {
  const [searchParams] = useSearchParams();
  const AccCodeFromURL = searchParams.get("accCode");
  //console.log("AccCode from URL:", AccCodeFromURL);

  const [allAccCode, setAllAccCode] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    accCode: "",
    accName: "",
    accNameEn: "",
    accTypeID: "",
    accMainCode: "",
  });
  const [loading, setLoading] = useState(true);

  // ใช้ useEffect เพื่ออัปเดต formData เมื่อ selectedAccount เปลี่ยน
  useEffect(() => {
    if (selectedAccount) {
      // แปลงข้อมูลจากรูปแบบของ AccCodeList เป็นรูปแบบที่ AccountCodeDT ต้องการ
      const mappedData = {
        accCode: selectedAccount.accCode || "",
        accName: selectedAccount.accName || "",
        accNameEn: selectedAccount.accNameEn || "",
        accTypeID: selectedAccount.accTypeID || "",
        accMainCode: selectedAccount.accMainCode || "",
      };
      setFormData(mappedData);
      console.log("Form data updated from selected account:", mappedData);
    }
  }, [selectedAccount]);

  useEffect(() => {
    const fetchAllAccCode = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccCode/GetAccCode` // ดึงข้อมูลทั้งหมด
        );
        if (response.status === 200 && response.data.length > 0) {
          setAllAccCode(response.data);

          // ถ้ามี AccCode จาก URL ให้ตั้งค่า formData
          if (AccCodeFromURL && !selectedAccount) {
            const selectedAccCode = response.data.find(
              (acccode) => acccode.accCode === AccCodeFromURL
            );
            if (selectedAccCode) {
              setFormData(selectedAccCode);
            }
          }
        } else {
          console.error("Failed to fetch acccode data");
        }
      } catch (error) {
        console.error("Error fetching acccode data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAllAccCode();
  }, [AccCodeFromURL, selectedAccount]);

  const [accCodeError, setaAccCodeError] = useState(false);
  const [accCodeHelperText, setAccCodeHelperText] = useState("");

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
    if (id === "brand") {
      if (value.length < 5) {
        setaAccCodeError(true);
        setAccCodeHelperText("กรุณากรอก AccCode อย่างน้อย 5 ตัวอักษร");
      } else {
        setaAccCodeError(false);
        setAccCodeHelperText("");
      }
    }
  };

  const handleSave = async () => {
    // สร้างสำเนาของ formData เพื่อแก้ไข
    const formDataToSend = { ...formData };
    // formDataToSend.accCode = 0;

    // ตรวจสอบว่าทุกช่อง (ยกเว้น acccode) ไม่ว่าง
    if (
      !formDataToSend.accName ||
      // formDataToSend.brand.length < 5 ||
      !formDataToSend.accNameEn ||
      formDataToSend.accCode.length < 3 ||
      !formDataToSend.accTypeID ||
      !formDataToSend.accMainCode //||
    ) {
      let errorMessage = "กรุณากรอกข้อมูลให้ครบทุกช่อง\n";
      if (!formDataToSend.accCode || formDataToSend.accCode.length < 3) {
        errorMessage += "- กรุณากรอก accCode อย่างน้อย 3 ตัวอักษร\n";
      }
      alert("errorMessage");
      return;
    }
    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    try {
      const response = await axios.post(
        `${API_BASE}/AccCode/SetAccCode`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // alert(`บันทึกข้อมูลสำเร็จ ${formDataToSend.name}`);
        Swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.accName}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });

        const fetchAllAccCode = async () => {
          try {
            const accCodeResponse = await axios.get(
              `${API_BASE}/AccCode/GetAccCode`
            );
            if (
              accCodeResponse.status === 200 &&
              accCodeResponse.data.length > 0
            ) {
              setAllAccCode(accCodeResponse.data);
            } else {
              console.error("Failed to fetch updated acccode data");
            }
          } catch (error) {
            console.error("Error fetching updated acccode data:", error);
          }
        };
        fetchAllAccCode();
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving acc data:", error);
      Swal.fire({
        icon: "error",
        title: `AccName ห้ามช้ำกัน!!`,
        text: `กรุณาแก้ accCode:${formDataToSend.accCode}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);
    try {
      const response = await axios.put(
        `${API_BASE}/AccCode/EditAccCode`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `แก้ไข ${editData.accName} สำเร็จ`,
        });
      } else {
        alert("แก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error updating accName data:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDelete = async () => {
    console.log("formData.accCode:", formData.accCode);
    console.log("formData.accCode:", typeof formData.accCode);

    console.log("DATA ที่จะส่งไปลบ:", formData.accCode);
    console.log("DATA ที่จะส่งไปลบ:", typeof formData.accCode);

    try {
      const response = await axios.delete(
        `${API_BASE}/AccCode/DeleteAccCode/${formData.accCode}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `Dalete AccCode:${formData.accCode}`,
          text: ` ${formData.accName}`,
        });

        // อัปเดต setAllAccCode state
        setAllAccCode(
          allAccCode.filter((acccode) => acccode.accCode !== formData.accCode)
        );

        // อัปเดต formData state
        const currentIndexToDelete = allAccCode.findIndex(
          (acccode) => acccode.accCode !== formData.accCode
        );
        if (allAccCode.length === 1) {
          setFormData({
            accCode: "",
            accName: "",
            accNameEN: "",
            accTypeID: "",
            accMainCode: "",
          });
        } else if (currentIndexToDelete === allAccCode.length - 1) {
          setFormData(allAccCode[currentIndexToDelete - 1]);
        } else {
          setFormData(allAccCode[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting product data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleClear = () => {
    setFormData({
      accCode: "",
      accName: "",
      accNameEn: "",
      accTypeID: "",
      accMainCode: "",
    });
    setaAccCodeError(false);
    setAccCodeHelperText("");
    console.log("Form cleared");
  };
  // ---------------------
  const [accTypeIDOptions, setAccTypeIDOptions] = useState([]); // state สำหรับข้อมูลจาก API ตัวใหม่
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchAccTypeIDOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/AccType/GetAccType`);
        setAccTypeIDOptions(response.data); // อัปเดต state accTypeIDOptions
      } catch (error) {
        console.error("Error fetching accTypeID options:", error);
      }
    };
    fetchAccTypeIDOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAccTypeSelect = (accTypeID) => {
    setFormData({ ...formData, accTypeID: accTypeID });
    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accTypeIDOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  // เพิ่มในส่วนบนของ component, ใต้ `useState` เดิม
  const [openMainCodeModal, setOpenMainCodeModal] = useState(false);
  const [accMainCodeOptions, setAccMainCodeOptions] = useState([]);
  const [currentPageMain, setCurrentPageMain] = useState(1);

  const handleOpenMainCodeModal = async () => {
    const isAccTypeSelected = !!formData.accTypeID;

    const mainCodes = allAccCode.filter((code) => {
      // First, check if the code exists and ends with "-00"
      if (!code.accCode || !code.accCode.endsWith("-00")) {
        return false;
      }

      // Get the first digit of the accCode
      const firstDigit = code.accCode.toString().charAt(0);

      // Define the valid starting digits (1 through 5)
      const validStartingDigits = ["1", "2", "3", "4", "5"];

      // If AccTypeID is selected, filter based on both the first digit
      // and the AccTypeID value.
      if (isAccTypeSelected) {
        return firstDigit === formData.accTypeID.toString();
      }

      // If AccTypeID is not selected, only allow codes starting with 1-5
      return validStartingDigits.includes(firstDigit);
    });

    setAccMainCodeOptions(mainCodes);
    setOpenMainCodeModal(true);
  };

  const handleCloseMainCodeModal = () => {
    setOpenMainCodeModal(false);
  };

  const handleMainCodeSelect = (accCode) => {
    setFormData({ ...formData, accMainCode: accCode });
    handleCloseMainCodeModal();
  };

  const handlePageChangeMain = (event, newPage) => {
    setCurrentPageMain(newPage);
  };

  const getPaginatedMainCodeData = () => {
    const startIndex = (currentPageMain - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accMainCodeOptions.slice(startIndex, endIndex);
  };
  // ---------------
  const getPaginatedDataAccCode = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allAccCode.slice(startIndex, endIndex);
  };
  // ------
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(allAccCode[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allAccCode.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allAccCode[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allAccCode[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allAccCode.length - 1);
    setFormData(allAccCode[allAccCode.length - 1]);
  };
  //  const isNavigationDisabled = () => {
  //   const disabled = !doctype || !apiData || apiData.length === 0;
  //   console.log("Navigation disabled:", disabled); // ตรวจสอบค่า disabled
  //   return disabled;
  // };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/uitestacc/AccCodeList/");
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
          icon={faPlus}
          style={{ color: "green" }}
          size="1x"
        />
      ),
      name: "Add New",
      onClick: handleClear,
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faFloppyDisk}
          style={{ color: "green" }}
          size="1x"
        />
      ),
      name: "Save New",
      onClick: handleSave,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faPen} style={{ color: "#72047b" }} size="1x" />
      ),
      name: "Update",
      onClick: handleUpdate,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faTrash} style={{ color: "#ae0000" }} size="1x" />
      ),
      name: "Delete",
      onClick: handleDelete,
    },

  ];
  const buttonActionsLNPF = [
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToLast",
      onClick: goToLast,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" rotation={180} />
      ),
      name: "ToNext",
      onClick: goToNext,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAngleRight} style={{ color: "#2d01bd" }} size="1x" />
      ),
      name: "ToPrevious",
      onClick: goToPrevious,
      // disabled: isNavigationDisabled(),
    },
    {
      icon: (
        <FontAwesomeIcon icon={faAnglesRight} style={{ color: "#2d01bd" }} size="1x" />
      ),
      name: "ToFirst",
      onClick: goToFirst,
      // disabled: isNavigationDisabled(),
    },
  ];

  return (
    <div className="row g-3" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
      <CircularButtonGroup actions={buttonActions} />
      <div className="col-md-6">
        <TextField
          required
          id="accName"
          label="AccName"
          value={formData.accName || ""}
          placeholder="กรุณากรอกชื่อไทย"
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              // color: "#ff0000",
              color: "#00008b",
              fontWeight: "bold",
              fontSize: "18px !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00008b",
              fontSize: "18px !important",
            },
          }}
        />
      </div>
      <div className="col-md-6">
        <TextField
          required
          id="accNameEn"
          label="AccNameEn"
          value={formData.accNameEn || ""}
          placeholder="Please enter English Name"
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              // color: "#ff0000",
              color: "#00008b",
              fontWeight: "bold",
              fontSize: "18px !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00008b",
              fontSize: "18px !important",
            },
          }}
        />
      </div>

      <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          required
          id="accCode"
          label="AccCode (รหัสบัญชี)"
          value={formData.accCode || ""}
          placeholder="เช่น 1111-01"
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={accCodeError}
          helperText={accCodeHelperText}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              color: "#00008b",
              fontWeight: "bold",
              fontSize: "18px !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00008b",
              fontSize: "18px !important",
            },
          }}
          onKeyPress={(event) => {
            const regex = /^[0-9-]*$/;
            const isValid = regex.test(event.key);
            if (!isValid) {
              event.preventDefault();
            }
          }}
        />
      </div>

      <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          required
          id="accTypeID"
          label="AccTypeID (หมวดบัญชี)"
          type="number"
          variant="standard"
          value={formData.accTypeID || ""}
          placeholder="เลือกหมวด"
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              color: "#00008b",
              fontWeight: "bold",
              fontSize: "18px !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00008b",
              fontSize: "18px !important",
            },
          }}
          onKeyPress={(event) => {
            const regex = /^[0-9-]*$/;
            const isValid = regex.test(event.key);
            if (!isValid) {
              event.preventDefault();
            }
          }}
        />
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="1x"
          onClick={handleOpenModal}
          style={{ cursor: "pointer", marginBottom: "8px", marginLeft: "4px" }}
        />
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            // position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            // width: 400,
            // backgroundColor: "white",
            // borderRadius: "30px",
            // padding: "20px",
            // boxShadow: 24,
            // p: 4,
            position: "absolute",
            boxShadow: 24,
            p: 4,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            position: "relative",
            width: "90%",
            maxWidth: "600px",
            borderRadius: "30px",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        >
          <List>
            <h4 style={{ textAlign: "center" }}>
              Select AccTypeID (เลือกหมวดบัญชี){" "}
            </h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedData().map((acctypeid) => (
              <ListItem key={acctypeid.accTypeID} disablePadding>
                <ListItemButton
                  onClick={() => handleAccTypeSelect(acctypeid.accTypeID)}
                >
                  <ListItemText primary={acctypeid.accTypeID} />
                  <h5>{acctypeid.accTypeName}</h5>
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
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(accTypeIDOptions.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          required
          id="accMainCode"
          label="AccMainCode (บัญชีคุม)"
          value={formData.accMainCode || ""}
          placeholder="เลือกบัญชีคุม"
          type="text"
          variant="standard"
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              color: "#00008b",
              // color: "#ff0000",
              fontWeight: "bold",
              fontSize: "18px !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00008b",
              fontSize: "18px !important",
            },
          }}
          onKeyPress={(event) => {
            const regex = /^[0-9-]*$/;
            const isValid = regex.test(event.key);
            if (!isValid) {
              event.preventDefault();
            }
          }}
        />
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="1x"
          onClick={handleOpenMainCodeModal}
          style={{ cursor: "pointer", marginBottom: "8px", marginLeft: "4px" }}
        />
      </div>
      <Modal open={openMainCodeModal} onClose={handleCloseMainCodeModal}>
        <div
          style={{
            position: "absolute",
            boxShadow: 24,
            p: 4,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            position: "relative",
            width: "90%",
            maxWidth: "600px",
            borderRadius: "30px",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        >
          <List>
            <h4 style={{ textAlign: "center" }}>
              Select AccMainCode (เลือกบัญชีคุม)
            </h4>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            {getPaginatedMainCodeData().map((accMainCode) => (
              <ListItem key={accMainCode.accCode} disablePadding>
                <ListItemButton
                  onClick={() => handleMainCodeSelect(accMainCode.accCode)}
                >
                  <ListItemText primary={accMainCode.accCode} />
                  <h5>{accMainCode.accName}</h5>
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
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(accMainCodeOptions.length / itemsPerPage)}
                page={currentPageMain}
                onChange={handlePageChangeMain}
              />
            </Stack>
          </div>
        </div>
      </Modal>

      <div>&nbsp;</div>
      <div style={{ display: "grid", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      {/* <div style={{ display: "flex" }}>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAnglesRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToLast}
          />
        </div>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAngleRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToNext}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAngleRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToPrevious}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAnglesRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToFirst}
          />
        </div>
      </div> */}
    </div>
  );
}
export default AccountCodeDT;
