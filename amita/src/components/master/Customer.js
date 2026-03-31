import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig"; // ใช้ axiosConfig ที่มี interceptor
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
import "./Customer.css";

function Customer() {
  const [searchParams] = useSearchParams();
  const CustomerID = searchParams.get("customerID");
  const CustomerIDN = parseInt(CustomerID, 10);
  // console.log("CustomerID:", CustomerIDN);
  // console.log("CustomerIDN:", typeof CustomerIDN);
  const [allCustomer, setAllCustomer] = useState([]); // เก็บข้อมูล Customer ทั้งหมด
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    customerID: "",
    customerCode: "",
    taxNumber: "",
    taxBranch: "",
    customerName: "",
    customerEName: "",
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
    const fetchAllCustomer = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/Customer/GetCustomer` // ดึงข้อมูลทั้งหมด
        );
        if (response.status === 200 && response.data.length > 0) {
          setAllCustomer(response.data);
        } else {
          console.error("Failed to fetch Customer data");
        }
      } catch (error) {
        console.error("Error fetching Customer data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAllCustomer();
  }, []);

  useEffect(() => {
    if (allCustomer.length > 0 && CustomerIDN) {
      const selectedCustomer = allCustomer.find(
        (customer) => parseInt(customer.customerID, 10) === CustomerIDN // แปลง CustomerIDN เป็น number
      );
      console.log("allCustomer:", allCustomer);
      if (selectedCustomer) {
        setFormData(selectedCustomer);
        console.log("selectedCustomer:", selectedCustomer);
      } else {
        console.error("Customer not found");
      }
    }
  }, [CustomerIDN, allCustomer]);

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
    formDataToSend.customerID = 0;
    const requiredFields = [
      { id: "customerCode", label: "CustomerCode" },
      { id: "taxNumber", label: "TaxNumber" },
      { id: "taxBranch", label: "TaxBranch" },
      { id: "customerName", label: "CustomerName" },
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
        `${API_BASE}/Customer/SetCustomer`,
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
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.customerName}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        const allCustomerResponse = await axios.get(
          `${API_BASE}/Customer/GetCustomer`
        );
        if (
          allCustomerResponse.status === 200 &&
          allCustomerResponse.data.length > 0
        ) {
          setAllCustomer(allCustomerResponse.data);
          // ค้นหา Customer ที่เพิ่งบันทึก
          const savedCustomer = allCustomerResponse.data.find(
            (customer) => customer.customerID === formDataToSend.customerID
          );
          if (savedCustomer) {
            setFormData(savedCustomer);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedCustomer.customerName}`,
              // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          console.error("Failed to fetch updated customer data");
        }
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving customer data:", error);
      Swal.fire({
        icon: "error",
        title: `CustomerCode ห้ามช้ำ!!`,
        text: `กรุณาแก้ CustomerCode:${formDataToSend.customerCode}`,
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
        `${API_BASE}/Customer/EditCustomer`,
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
          title: `แก้ไข ${editData.customerName} สำเร็จ`,
        });
      } else {
        alert("แก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error updating customerName data:", error);
      // alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      Swal.fire({
        icon: "error",
        title: `เกิดข้อผิดพลาดในการแก้ไขข้อมูล`,
        // text: `กรุณาแก้ CustomerCode:${formDataToSend.customerCode}`,
      });
    }
  };

  const handleDelete = async () => {
    if (!formData.customerID || isNaN(formData.customerID)) {
      alert("customerID ไม่ถูกต้อง");
      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.customerID);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    const customerIDToDelete = Number(formData.customerID);
    try {
      const response = await axios.delete(
        `${API_BASE}/Customer/DeleteCustomer/${customerIDToDelete}`
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Dalete Customer:${formData.customerName}`,
        });

        // อัปเดต allcustomer state
        setAllCustomer(
          allCustomer.filter(
            (customer) => customer.customerID !== formData.customerID
          )
        );

        // อัปเดต formData state
        const currentIndexToDelete = allCustomer.findIndex(
          (customer) => customer.customerID === formData.customerID
        );
        if (allCustomer.length === 1) {
          setFormData({
            customerID: "",
            customerCode: "",
            taxNumber: "",
            taxBranch: "",
            customerName: "",
            customerEName: "",
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
        } else if (currentIndexToDelete === allCustomer.length - 1) {
          setFormData(allCustomer[currentIndexToDelete - 1]);
        } else {
          setFormData(allCustomer[currentIndexToDelete + 1]);
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting Customer data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleClear = () => {
    setFormData({
      customerID: "",
      customerCode: "",
      taxNumber: "",
      taxBranch: "",
      customerName: "",
      customerEName: "",
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
      setFormData(allCustomer[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allCustomer.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(allCustomer[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(allCustomer[0]);
  };

  const goToLast = () => {
    setCurrentIndex(allCustomer.length - 1);
    setFormData(allCustomer[allCustomer.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(`${URL}CustomerList/`);
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
    // {
    //     icon: (
    //       <FontAwesomeIcon icon={faFileArrowDown} style={{ color: "#0000ff" }} size="x" />
    //     ),
    //     name: "Preview Document(OCR)",
    //     onClick: handleRVDraftOCR,
    //   },
    {
      icon: (
        <FontAwesomeIcon
          icon={faPen}
          style={{ color: "#72047b" }}
          size="1x"
        />
      ),
      name: "Update Date",
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
      name: "Delete Data",
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
    <div className="customer-container">
      {/* <h2 style={{ textAlign: "center" , textDecorationLine: "underline" }} onClick={handleGoBack}>&nbsp;Customer&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="customer-header">
            <h4 className="customer-title" onClick={handleGoBack}>
              Customers
            </h4>
            <p className="customer-subtitle">ผู้รับบริการ/ลูกค้า</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />
      </div>

      <div className="customer-content">
        {/* General Information & Location Card */}
        <div className="customer-card general full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <h3 className="card-title">General Information & Location</h3>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="customer-form-label required">TaxBranch*</label>
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
                <label className="customer-form-label required">CustomerCode*</label>
                <input
                  required
                  id="customerCode"
                  className="form-control-custom"
                  value={formData.customerCode || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="customer-form-label required">TaxNumber*</label>
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
                <label className="customer-form-label required">CustomerName*</label>
                <input
                  required
                  id="customerName"
                  className="form-control-custom"
                  value={formData.customerName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
                {brandError && <span style={{ color: "red", fontSize: "0.8rem" }}>{brandHelperText}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="customer-form-label">CustomerEName</label>
                <input
                  id="customerEName"
                  className="form-control-custom"
                  value={formData.customerEName || ""}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="customer-form-label required">Address1*</label>
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
                <label className="customer-form-label">Address2</label>
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
                <label className="customer-form-label">EAddress1</label>
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
                <label className="customer-form-label">EAddress2</label>
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
                <label className="customer-form-label">Phone</label>
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
                <label className="customer-form-label">FaxNumber</label>
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
                <label className="customer-form-label">Email</label>
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
                <label className="customer-form-label">Contact</label>
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
                <label className="customer-form-label">WebLink</label>
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
                <label className="customer-form-label">CountryCode</label>
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
                <label className="customer-form-label">ZIPCode</label>
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
        <div className="customer-card account full-width">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <h3 className="card-title">Account Configuration</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="customer-form-label">GLAccountCode</label>
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
      <FloatingActionBar backPath={URL + "Customers/"} />
    </div>
  );
}

export default Customer;
