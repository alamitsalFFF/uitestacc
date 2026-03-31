import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig"; // ใช้ axios ที่กำหนดเอง
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
  faPlus,
  faBuilding,
  faMapMarkerAlt,
  faFileInvoiceDollar,
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
import { API_BASE, URL } from "../api/url";
import CircularButtonGroup from "../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import HeaderBar from "../menu/HeaderBar";
import "./Supplier.css";

function Supplier() {
  const [searchParams] = useSearchParams();
  const SupplierID = searchParams.get("supplierID");
  const SupplierIDN = parseInt(SupplierID, 10);
  const [allSupplier, setAllSupplier] = useState([]); // เก็บข้อมูล Supplier ทั้งหมด
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    supplierID: "",
    supplierCode: "",
    taxNumber: "",
    taxBranch: "",
    supplierName: "",
    supplierEName: "",
    address1: "",
    address2: "",
    eAddress1: "",
    eAddress2: "",
    phone: "",
    faxNumber: "",
    email: "",
    contact: "",
    webLink: "",
    countryCode: "",
    zipCode: "",
    glAccountCode: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllSupplier = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/Supplier/GetSupplier`
        );
        if (response.status === 200 && response.data.length > 0) {
          setAllSupplier(response.data);
        } else {
          console.error("Failed to fetch Supplier data");
        }
      } catch (error) {
        console.error("Error fetching Supplier data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAllSupplier();
  }, []);

  useEffect(() => {
    if (allSupplier.length > 0 && SupplierIDN) {
      const selectedSupplier = allSupplier.find(
        (supplier) => parseInt(supplier.supplierID, 10) === SupplierIDN // แปลง SupplierIDN เป็น number
      );
      console.log("allSupplier:", allSupplier);
      if (selectedSupplier) {
        setFormData(selectedSupplier);
        console.log("selectedSupplier:", selectedSupplier);
      } else {
        console.error("Supplier not found");
      }
    }
  }, [SupplierIDN, allSupplier]);

  const [brandError, setBrandError] = useState(false);
  const [brandHelperText, setBrandHelperText] = useState("");

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
    if (id === "brand") {
      if (value.length < 5) {
        setBrandError(true);
        setBrandHelperText("กรุณากรอก Brand อย่างน้อย 5 ตัวอักษร");
      } else {
        setBrandError(false);
        setBrandHelperText("");
      }
    }
  };

  const handleSave = async () => {
    // สร้างสำเนาของ formData เพื่อแก้ไข
    const formDataToSend = { ...formData };
    formDataToSend.supplierID = 0;
    const requiredFields = [
      { id: "supplierCode", label: "SupplierCode" },
      { id: "taxNumber", label: "TaxNumber" },
      { id: "taxBranch", label: "TaxBranch" },
      { id: "supplierName", label: "SupplierName" },
      { id: "address1", label: "Address1" },
    ];

    const emptyFields = [];
    for (const field of requiredFields) {
      if (!formDataToSend[field.id]) {
        emptyFields.push(field.label);
      }
    }

    if (emptyFields.length > 0) {
      // alert(`กรุณากรอกข้อมูลในช่องต่อไปนี้: ${emptyFields.join(", ")}`);
      Swal.fire({
        icon: "error",
        title: `กรุณากรอกข้อมูลที่สำคัญให้ครบถ้วน!!`,
        text: `กรุณากรอกข้อมูลในช่อง: ${emptyFields.join(", ")}`,
      }); return; // หยุดการทำงานของฟังก์ชัน ถ้ามีช่องที่ไม่ได้กรอก
    }

    const regex = /^[0-9]{13}$/;

    if (!regex.test(formDataToSend.taxNumber)) {
      alert("TaxNumber ต้องเป็นตัวเลข (0-9) 13หลักเท่านั้น");
      return; // หยุดการทำงานของฟังก์ชัน ถ้าข้อมูลไม่ถูกต้อง
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    // }
    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    try {
      const response = await axios.post(
        `${API_BASE}/Supplier/SetSupplier`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.supplierName}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        const allSupplierResponse = await axios.get(
          `${API_BASE}/Supplier/GetSupplier`
        );
        if (
          allSupplierResponse.status === 200 &&
          allSupplierResponse.data.length > 0
        ) {
          setAllSupplier(allSupplierResponse.data);
          // ค้นหา Supplier ที่เพิ่งบันทึก
          const savedSupplier = allSupplierResponse.data.find(
            (supplier) => supplier.supplierID === formDataToSend.supplierID
          );
          if (savedSupplier) {
            setFormData(savedSupplier);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedSupplier.supplierName}`,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          console.error("Failed to fetch updated supplier data");
        }
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving supplier data:", error);
      Swal.fire({
        icon: "error",
        title: `SupplierCode ห้ามช้ำ!!`,
        text: `กรุณาแก้ SupplierCode:${formDataToSend.supplierCode}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(
        `${API_BASE}/Supplier/EditSupplier`,
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
          title: `แก้ไข ${editData.supplierName} สำเร็จ`,
        });
      } else {
        alert("แก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error updating supplierName data:", error);
      // alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      Swal.fire({
        icon: "error",
        title: `เกิดข้อผิดพลาดในการแก้ไขข้อมูล`,
        // text: `กรุณาแก้ SupplierCode:${formDataToSend.supplierCode}`,
      });
    }
  };

  const handleDelete = async () => {
    if (!formData.supplierID || isNaN(formData.supplierID)) {
      alert("supplierID ไม่ถูกต้อง");
      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.supplierID);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    const supplierIDToDelete = Number(formData.supplierID);
    try {
      const response = await axios.delete(
        `${API_BASE}/Supplier/DeleteSupplier/${supplierIDToDelete}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Delete Supplier:${formData.supplierName}`,
        });

        // อัปเดต allSupplier state
        setAllSupplier(
          allSupplier.filter(
            (supplier) => supplier.supplierID !== formData.supplierID
          )
        );

        // อัปเดต formData state
        const currentIndexToDelete = allSupplier.findIndex(
          (supplier) => supplier.supplierID === formData.supplierID
        );
        if (allSupplier.length === 1) {
          setFormData({
            supplierID: "",
            supplierCode: "",
            taxNumber: "",
            taxBranch: "",
            supplierName: "",
            supplierEName: "",
            address1: "",
            address2: "",
            eAddress1: "",
            eAddress2: "",
            phone: "",
            faxNumber: "",
            email: "",
            contact: "",
            webLink: "",
            countryCode: "",
            zipCode: "",
            glAccountCode: "",
          });
        } else if (currentIndexToDelete === allSupplier.length - 1) {
          setFormData(allSupplier[currentIndexToDelete - 1]);
        } else {
          setFormData(allSupplier[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting Supplier data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleClear = () => {
    setFormData({
      supplierID: "",
      supplierCode: "",
      taxNumber: "",
      taxBranch: "",
      supplierName: "",
      supplierEName: "",
      address1: "",
      address2: "",
      eAddress1: "",
      eAddress2: "",
      phone: "",
      faxNumber: "",
      email: "",
      contact: "",
      webLink: "",
      countryCode: "",
      zipCode: "",
      glAccountCode: "",
    });
  };

  // ---------------------
  const [productTypeOptions, setProductTypeOptions] = useState([]); // state สำหรับข้อมูลจาก API ตัวใหม่
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleProductTypeSelect = (productTypeCode) => {
    setFormData({ ...formData, productTypeCode: productTypeCode });
    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productTypeOptions.slice(startIndex, endIndex);
  };
  // -------------------------------
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(allSupplier[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allSupplier.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allSupplier[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allSupplier[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allSupplier.length - 1);
    setFormData(allSupplier[allSupplier.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(`${URL}Suppliers/`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const buttonActions = [
    // {
    //   icon: (
    //     <FontAwesomeIcon icon={faCircleArrowLeft} style={{ color: "grey" }} size="1x" />
    //   ),
    //   name: "List",
    //   onClick: handleGoBack,
    // },
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "blue" }} size="1x" />
      ),
      name: "New",
      onClick: handleClear,
    },
    {
      icon: (
        <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} size="1x" />
      ),
      name: "Save",
      onClick: handleSave, // เรียก handleAddNew โดยตรง
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faPen}
          style={{ color: "#72047b" }}
          size="1x"
        />
      ),
      name: "Update",
      onClick: handleUpdate, // เรียกฟังก์ชันเปิด Modal วันที่
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color: "#ae0000" }}
          size="1x"
        />
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
    <div className="suppiler-container">
      {/* <h2 style={{ textAlign: "center" , textDecorationLine: "underline" }} onClick={handleGoBack}>&nbsp;Suppliers&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="suppiler-header" >
            <h4 className="suppiler-title" onClick={handleGoBack}>
              Suppliers
            </h4>
            <p className="suppiler-subtitle">ผู้ให้บริการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />
      </div>

      <div className="suppiler-content">
        {/* General Information & Location Card */}
        <div className="suppiler-card general full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <h3 className="card-title">General Information & Location</h3>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label required">TaxBranch*</label>
                <input
                  required
                  id="taxBranch"
                  className="form-control-custom"
                  value={formData.taxBranch || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label required">SupplierCode*</label>
                <input
                  required
                  id="supplierCode"
                  className="form-control-custom"
                  value={formData.supplierCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label required">TaxNumber*</label>
                <input
                  required
                  id="taxNumber"
                  className="form-control-custom"
                  value={formData.taxNumber || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* -------------------------- */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label required">SupplierName*</label>
                <input
                  required
                  id="supplierName"
                  className="form-control-custom"
                  value={formData.supplierName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
                {brandError && <span style={{ color: "red", fontSize: "0.8rem" }}>{brandHelperText}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label">SupplierEName</label>
                <input
                  id="supplierEName"
                  className="form-control-custom"
                  value={formData.supplierEName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label required">Address1*</label>
                <textarea
                  required
                  id="address1"
                  className="form-control-custom"
                  value={formData.address1 || ""}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label">Address2</label>
                <textarea
                  id="address2"
                  className="form-control-custom"
                  value={formData.address2 || ""}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label">EAddress1</label>
                <textarea
                  id="eAddress1"
                  className="form-control-custom"
                  value={formData.eAddress1 || ""}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label">EAddress2</label>
                <textarea
                  id="eAddress2"
                  className="form-control-custom"
                  value={formData.eAddress2 || ""}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            {/* -------------------------- */}
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">Phone</label>
                <input
                  id="phone"
                  className="form-control-custom"
                  value={formData.phone || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">FaxNumber</label>
                <input
                  id="faxNumber"
                  className="form-control-custom"
                  value={formData.faxNumber || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">Email</label>
                <input
                  id="email"
                  className="form-control-custom"
                  type="text"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">Contact</label>
                <input
                  id="contact"
                  className="form-control-custom"
                  value={formData.contact || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">WebLink</label>
                <input
                  id="webLink"
                  className="form-control-custom"
                  value={formData.webLink || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="supplier-form-label">CountryCode</label>
                <input
                  id="countryCode"
                  className="form-control-custom"
                  type="text"
                  value={formData.countryCode || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="supplier-form-label">ZIPCode</label>
                <input
                  id="zipCode"
                  className="form-control-custom"
                  value={formData.zipCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Config Card */}
        <div className="suppiler-card account full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <h3 className="card-title">Account Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="supplier-form-label">GLAccountCode</label>
                <input
                  id="glAccountCode"
                  className="form-control-custom"
                  value={formData.glAccountCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="action-bar" style={{ justifyContent: "center" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
    </div> */}
      <div>&nbsp;</div>
      <div style={{ display: "grid", justifyContent: "flex-end", padding: "10px" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      <div style={{ marginTop: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL + "Suppliers/"} />
    </div>
  );
}

export default Supplier;
