import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig"; // ใช้ axiosConfig ที่มี interceptor
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

function AccountCode() {
  const [searchParams] = useSearchParams();
  const AccCode = searchParams.get("accCode");
  console.log("AccCode:", AccCode);
  console.log("typeofAccCode:", typeof AccCode);
  // const AccCodeN = parseInt(AccCode, 10);
  // console.log("AccCodeN:", AccCodeN);
  // console.log("typeofAccCodeN:", typeof AccCodeN);
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
  useEffect(() => {
    const fetchAllAccCode = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccCode/GetAccCode` // ดึงข้อมูลทั้งหมด
        );
        if (response.status === 200 && response.data.length > 0) {
          setAllAccCode(response.data);
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
  }, []);

  useEffect(() => {
    if (allAccCode.length > 0 && AccCode) {
      const selectedAccCode = allAccCode.find(
        // (acccode) => parseInt(acccode.accCode, 10) === AccCodeN // แปลง AccCode เป็น number
        (acccode) => acccode.accCode === AccCode
      );
      console.log("AllAccCode:", selectedAccCode);
      if (selectedAccCode) {
        setFormData(selectedAccCode);
        console.log("selectedAccCode:", selectedAccCode);
      } else {
        console.error("Acccode not found");
      }
    }
  }, [AccCode, allAccCode]);

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
              // อาจจะ Set formData เป็นรายการที่เพิ่งสร้างใหม่ (ถ้า API คืนค่ามา)
              // if (response.data && response.data.newAccCode) {
              //   const newAccCode = accCodeResponse.data.find(item => item.accCode === response.data.newAccCode);
              //   if (newAccCode) {
              //     setFormData(newAccCode);
              //   }
              // }

              // } else {
              //   console.error("Failed to fetch updated accName data");
              // }
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
        // alert("แก้ไขข้อมูลสำเร็จ");
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
    // if (!formData.accCode || isNaN(formData.accCode)) {
    //   alert("accCode ไม่ถูกต้อง");
    //   return;
    // }
    console.log("DATA ที่จะส่งไปลบ:", formData.accCode);
    console.log("DATA ที่จะส่งไปลบ:", typeof formData.accCode);
    // console.log("DATA:", formData);
    // console.log("DATA:", formData.accCode);
    // const accCodeToDelete = Number(formData.accCode);
    try {
      const response = await axios.delete(
        `${API_BASE}/AccCode/DeleteAccCode/${formData.accCode}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Dalete AccCode:${formData.accCode}`,
          text:` ${formData.accName}`,
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
  // ---------------------
  const [accTypeIDOptions, setAccTypeIDOptions] = useState([]); // state สำหรับข้อมูลจาก API ตัวใหม่
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchAccTypeIDOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccType/GetAccType`
        );
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

  return (
    <div className="row" style={{ padding: "5%" }}>
      <h2 style={{ textAlign: "center" }}>Accounts</h2>
      <div style={{ display: "flex" }}>
        <div className="col-4">
          <FontAwesomeIcon
            icon={faHouseMedicalCircleCheck}
            size="2x"
            style={{ color: "green" }}
            onClick={handleSave}
          />
        </div>
        <div
          className="col-7"
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
            onClick={handleDelete}
          />
        </div>
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        {" "}
        {/* Thai */}
        <TextField
          required
          id="accName"
          label="AccName"
          value={formData.accName || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          // error={accCodeError}
          // helperText={accCodeHelperText}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-6">
        {" "}
        {/* EN */}
        <TextField
          required
          id="accNameEn"
          label="AccNameEn"
          value={formData.accNameEn || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-4">
        {" "}
        {/* AccCode */}
        <TextField
          required
          // error
          id="accCode"
          label="AccCode"
          value={formData.accCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          error={accCodeError}
          helperText={accCodeHelperText}
          //  helperText="กรุณาระบุมากกว่า 3 ตัวอักษร"
          style={{ width: "100%" }}
        />
      </div>

      <div className="col-md-4" style={{ display: "flex" }}>
        {" "}
        {/* AccType */}
        <TextField
          required
          id="accTypeID"
          label="AccTypeID"
          type="number"
          variant="standard"
          value={formData.accTypeID || ""}
          onChange={handleInputChange}
          style={{ width: "100%" }}
          slotProps={{
            input: {
              readOnly: true,
            },
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
            <h4 style={{ textAlign: "center" }}>Select AccTypeID</h4>
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
              // justifyContent: "space-between",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(accTypeIDOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                page={currentPage} // กำหนดหน้าปัจจุบัน
                onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
              />
            </Stack>
          </div>
        </div>
      </Modal>

      <div className="col-md-4">
        {" "}
        {/* AccMainCode */}
        <TextField
          required
          // error
          id="accMainCode"
          label="AccMainCode"
          value={formData.accMainCode || ""}
          type="text"
          variant="standard"
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div style={{ display: "flex" }}>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAnglesRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToLast}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3">
          <FontAwesomeIcon
            icon={faAngleRight}
            rotation={180}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToNext}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAngleRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToPrevious}
            //   disabled={isNavigationDisabled()}
          />
        </div>
        <div className="col-3" style={{ textAlign: "right" }}>
          <FontAwesomeIcon
            icon={faAnglesRight}
            size="2x"
            style={{ color: "#2d01bd" }}
            onClick={goToFirst}
            //   disabled={isNavigationDisabled()}
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
  );
}
export default AccountCode;
