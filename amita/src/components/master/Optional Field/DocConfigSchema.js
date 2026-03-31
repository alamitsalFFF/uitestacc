import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faAngleRight,  // สำหรับปุ่มถัดไป
  faAnglesRight, // สำหรับปุ่มท้ายสุด
  faHouseMedicalCircleCheck,
  faTrash,
  faPen,
  faCircleArrowLeft,
  faXmarkCircle,
  faAngleLeft,   // สำหรับปุ่มย้อนกลับ
  faAnglesLeft,  // สำหรับปุ่มหน้าสุด
  faCircleMinus,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Swal from "sweetalert2";
import { API_BASE, URL } from "../../api/url";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import HeaderBar from "../../menu/HeaderBar";
import Divider from "@mui/material/Divider";

function DocConfigSchema() {
  const [searchParams] = useSearchParams();
  const DocConfigIDFromURL = searchParams.get("docConfigID") || "0";
  const DocConfigIDN = parseInt(DocConfigIDFromURL, 10);

  const [docConfigSchema, setDocConfigSchemaData] = useState([]);
  const [docConfigIDOptions, setDocConfigIDOptions] = useState([]);
  const [selectedDocConfigID, setSelectedDocConfigID] = useState(DocConfigIDFromURL);
  const [selectedConfigType, setSelectedConfigType] = useState("0");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    docConfigID: "",
    configType: "",
    seq: null,
    type: "",
    FieldName: "",
    // rawValue: "", // ไม่เก็บ rawValue ใน state แล้ว
    no: null,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const parseField = (value) => {
    if (!value) return null;
    const parts = value.split("=");
    if (parts.length < 2) return null;
    const typeWithNum = parts[0];
    const name = parts.slice(1).join("=");

    const match = typeWithNum.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : null;

    const type = typeWithNum.replace(/[0-9]/g, "");

    return { type, name, number };
  };

  useEffect(() => {
    const fetchDocConfigIDs = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/DocConfig/GetDocConfig`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          // Sort options by category and then eName for consistent navigation
          const sortedOptions = response.data.sort((a, b) => {
            const categoryComparison = (a.category || "").localeCompare(b.category || "");
            if (categoryComparison !== 0) return categoryComparison;
            return (a.eName || "").localeCompare(b.eName || "");
          });
          setDocConfigIDOptions(sortedOptions);

          // Set initial selected DocConfigID
          if (DocConfigIDFromURL !== "0" && sortedOptions.some(option => option.docConfigID.toString() === DocConfigIDFromURL)) {
            setSelectedDocConfigID(DocConfigIDFromURL);
          } else if (sortedOptions.length > 0) {
            setSelectedDocConfigID(sortedOptions[0].docConfigID.toString());
          }
        } else {
          console.error("Failed to fetch DocConfigIDs or data is not array");
        }
      } catch (error) {
        console.error("Error fetching DocConfigIDs:", error);
      }
    };
    fetchDocConfigIDs();
  }, []);

  useEffect(() => {
    const fetchDocConfigSchema = async () => {
      setLoading(true);
      try {
        if (!selectedDocConfigID || !selectedConfigType) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE}/DocConfig/GetDocConfigSchema?docConfigID=${selectedDocConfigID}&configType=${selectedConfigType}`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          console.log("Fetched docConfigSchema:", response.data);
          setDocConfigSchemaData(response.data);

          if (response.data.length > 0) {
            const currentSchema = response.data.find(
              (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
                item.configType.toString() === selectedConfigType.toString()
            );

            if (currentSchema) {
              setFormData({
                docConfigID: currentSchema.docConfigID,
                configType: currentSchema.configType,
                seq: null,
                type: "",
                FieldName: "",
                // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
                no: null,
              });
            } else {
              setFormData({
                docConfigID: selectedDocConfigID,
                configType: selectedConfigType,
                seq: null,
                type: "",
                FieldName: "",
                // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
                no: null,
              });
            }
          } else {
            setFormData({
              docConfigID: selectedDocConfigID,
              configType: selectedConfigType,
              seq: null,
              type: "",
              FieldName: "",
              // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
              no: null,
            });
          }

        } else {
          console.warn("Failed to fetch DocConfigSchema data or data is not array.");
          setDocConfigSchemaData([]);
          setFormData({
            docConfigID: selectedDocConfigID,
            configType: selectedConfigType,
            seq: null,
            type: "",
            FieldName: "",
            // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
            no: null,
          });
        }
      } catch (error) {
        console.error("Error fetching DocConfigSchema data:", error);
        setDocConfigSchemaData([]);
        setFormData({
          docConfigID: selectedDocConfigID,
          configType: selectedConfigType,
          seq: null,
          type: "",
          FieldName: "",
          // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
          no: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocConfigSchema();
  }, [selectedDocConfigID, selectedConfigType]);

  const displayedTableData = docConfigSchema.find(
    (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
      item.configType.toString() === selectedConfigType.toString()
  );

  const handleDocConfigIDChange = (event) => {
    const newDocConfigID = event.target.value;
    setSelectedDocConfigID(newDocConfigID);
    setFormData({
      docConfigID: newDocConfigID,
      configType: selectedConfigType,
      seq: null,
      type: "",
      FieldName: "",
      // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
      no: null,
    });
  };

  const handleConfigTypeChange = (event) => {
    const newConfigType = event.target.value;
    setSelectedConfigType(newConfigType);
    setFormData({
      docConfigID: selectedDocConfigID,
      configType: newConfigType,
      seq: null,
      type: "",
      FieldName: "",
      // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
      no: null,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "seq" || name === "no") {
      const numValue = value === "" ? null : parseInt(value, 10);
      if (isNaN(numValue) && value !== "") {
        return;
      }
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Helper function to validate form data
  const validateFormData = () => {
    if (formData.seq === null || formData.seq < 1 || formData.seq > 20) {
      Swal.fire("Validation Error", "Seq must be a number between 1 and 20.", "warning");
      return false;
    }
    if (!formData.type) {
      Swal.fire("Validation Error", "Type cannot be empty.", "warning");
      return false;
    }
    if (formData.no === null) {
      Swal.fire("Validation Error", "No cannot be empty.", "warning");
      return false;
    }
    if (!formData.FieldName) {
      Swal.fire("Validation Error", "Field Name cannot be empty.", "warning");
      return false;
    }
    return true;
  };

  // Helper function to refresh data after save/update/delete
  const refreshTableData = async (currentDocConfigID, currentConfigType, currentSeq) => {
    setLoading(true);
    console.log("Refreshing data for DocConfigID:", currentDocConfigID, "ConfigType:", currentConfigType, "Seq:", currentSeq);
    try {
      const res = await axios.get(
        `${API_BASE}/DocConfig/GetDocConfigSchema?docConfigID=${currentDocConfigID}&configType=${currentConfigType}`
      );
      if (res.status === 200 && Array.isArray(res.data)) {
        setDocConfigSchemaData(res.data);
        const updatedItem = res.data.find(
          (item) => item.docConfigID.toString() === currentDocConfigID.toString() &&
            item.configType.toString() === selectedConfigType.toString()
        );
        if (updatedItem) {
          // ถ้ามีการเลือก Field (currentSeq ไม่ใช่ null) ให้พยายามโหลดข้อมูล Field นั้นๆ
          if (currentSeq !== null && currentSeq >= 1 && currentSeq <= 20) {
            const savedFieldString = updatedItem[`field${currentSeq}`];
            const parsedSaved = parseField(savedFieldString);
            setFormData({
              docConfigID: updatedItem.docConfigID,
              configType: updatedItem.configType,
              seq: currentSeq,
              type: parsedSaved ? parsedSaved.type : "",
              FieldName: parsedSaved ? parsedSaved.name : "",
              // rawValue: savedFieldString || "", // ไม่ต้องตั้งค่า rawValue แล้ว
              no: parsedSaved ? parsedSaved.number : null,
            });
          } else { // ไม่มี Field ที่เลือก หรือ Field ที่เลือกถูกลบไปแล้ว ให้ clear form
            setFormData({
              docConfigID: updatedItem.docConfigID, // ยังคง DocConfigID/ConfigType
              configType: updatedItem.configType,
              seq: null,
              type: "",
              FieldName: "",
              // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
              no: null,
            });
          }
        } else {
          // กรณีลบ record ทั้งหมด หรือ record หายไปหลังจาก refresh
          setDocConfigSchemaData([]); // Clear table
          setFormData({
            docConfigID: currentDocConfigID,
            configType: currentConfigType,
            seq: null,
            type: "",
            FieldName: "",
            // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
            no: null,
          });
        }
      } else { // กรณีไม่มีข้อมูลสำหรับ DocConfigID และ ConfigType นั้นๆ แล้ว
        setDocConfigSchemaData([]); // Clear table
        setFormData({
          docConfigID: currentDocConfigID,
          configType: currentConfigType,
          seq: null,
          type: "",
          FieldName: "",
          // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
          no: null,
        });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setDocConfigSchemaData([]); // Clear table on error
      setFormData({
        docConfigID: currentDocConfigID,
        configType: currentConfigType,
        seq: null,
        type: "",
        FieldName: "",
        // rawValue: "", // ไม่ต้องตั้งค่า rawValue แล้ว
        no: null,
      });
    } finally {
      setLoading(false);
    }
  };


  // *** handleSaveNew for creating a new record ***
  const handleSaveNew = async () => {
    if (!validateFormData()) return;

    const fieldString = `${formData.type}${formData.no}=${formData.FieldName}`;
    const fieldNameKey = `field${formData.seq}`;

    // ค้นหาว่ามี record ที่มี DocConfigID และ ConfigType นี้อยู่แล้วหรือไม่
    const existingRecord = docConfigSchema.find(
      (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
        item.configType.toString() === selectedConfigType.toString()
    );

    if (existingRecord) {
      Swal.fire("Error!", "A record for this DocConfig and Config Type already exists. Please use 'Update Field' or 'Delete DocConfig' instead.", "error");
      return;
    }


    // สร้าง object ใหม่ที่มี field1-field20 เป็น null เริ่มต้น
    const dataToSave = {
      docConfigID: parseInt(selectedDocConfigID, 10),
      configType: parseInt(selectedConfigType, 10),
      field1: null, field2: null, field3: null, field4: null, field5: null,
      field6: null, field7: null, field8: null, field9: null, field10: null,
      field11: null, field12: null, field13: null, field14: null, field15: null,
      field16: null, field17: null, field18: null, field19: null, field20: null,
    };
    dataToSave[fieldNameKey] = fieldString;

    const payload = [dataToSave]; // Backend expects an array
    console.log("Payload for New Save (POST):", payload);

    try {
      const apiUrl = `${API_BASE}/DocConfig/SetDocConfigSchema`; // Use Set for new
      const response = await axios.post(apiUrl, payload);

      if (response.status === 200) {
        Swal.fire("Success!", "New data saved successfully.", "success");
        refreshTableData(selectedDocConfigID, selectedConfigType, formData.seq);
      } else {
        Swal.fire("Error!", `Failed to save new data. Status: ${response.status}`, "error");
      }
    } catch (error) {
      console.error("Error saving new data:", error);
      Swal.fire("Error!", `An error occurred while saving new data: ${error.message}`, "error");
    }
  };

  // *** handleUpdate for modifying an existing record ***
  const handleUpdate = async () => {
    if (!validateFormData()) return;

    const fieldString = `${formData.type}${formData.no}=${formData.FieldName}`;
    const fieldNameKey = `field${formData.seq}`;

    // ค้นหา record ปัจจุบันที่ตรงกับ DocConfigID และ ConfigType ที่เลือก
    const existingRecord = docConfigSchema.find(
      (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
        item.configType.toString() === selectedConfigType.toString()
    );

    if (!existingRecord) {
      Swal.fire("Error!", "No existing record found to update. Please use 'Save New' button for new entries.", "error");
      return;
    }

    // สร้าง object สำหรับการแก้ไข โดยใช้ข้อมูลเดิม แล้วอัปเดตเฉพาะ Field ที่เกี่ยวข้อง
    const dataToUpdate = { ...existingRecord };
    dataToUpdate[fieldNameKey] = fieldString;

    const payload = dataToUpdate; // Backend expects an array
    console.log("Payload for Update (PUT):", payload);

    try {
      const apiUrl = `${API_BASE}/DocConfig/EditDocConfigSchema`; // Use Edit for update
      const response = await axios.put(apiUrl, payload);

      if (response.status === 200) {
        Swal.fire("Success!", "Data updated successfully.", "success");
        refreshTableData(selectedDocConfigID, selectedConfigType, formData.seq);
      } else {
        Swal.fire("Error!", `Failed to update data. Status: ${response.status}`, "error");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire("Error!", `An error occurred while updating data: ${error.message}`, "error");
    }
  };

  // *** handleDelete for deleting an entire record (DocConfigID + ConfigType) ***
  const handleDelete = async () => {
    // ตรวจสอบว่ามีการเลือก DocConfigID และ ConfigType ที่จะลบหรือไม่
    if (!selectedDocConfigID || !selectedConfigType) {
      Swal.fire("Validation Error", "Please select DocConfigID and ConfigType to delete.", "warning");
      return;
    }

    // ค้นหา record ที่มีอยู่จริงก่อนจะลบ
    const existingRecord = docConfigSchema.find(
      (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
        item.configType.toString() === selectedConfigType.toString()
    );

    if (!existingRecord) {
      Swal.fire("Information", "No record found for the selected DocConfig and Config Type to delete.", "info");
      return;
    }

    // ยืนยันการลบ
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the entire record for DocConfigID: ${selectedDocConfigID} and ConfigType: ${selectedConfigType}. This action will remove all fields (1-20) and cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const apiUrl = `${API_BASE}/DocConfig/DeleteDocConfigSchema/${selectedDocConfigID}?configType=${selectedConfigType}`;
          // ส่ง DocConfigID และ ConfigType เป็น query parameters
          const response = await axios.delete(apiUrl, {
            params: {
              docConfigID: parseInt(selectedDocConfigID, 10),
              configType: parseInt(selectedConfigType, 10),
            },
          });

          if (response.status === 200) {
            Swal.fire("Deleted!", "The entire record has been deleted.", "success");
            // หลังจากลบ ให้รีเฟรชข้อมูลในตารางและ clear form
            refreshTableData(selectedDocConfigID, selectedConfigType, null);
          } else {
            Swal.fire("Error!", `Failed to delete record. Status: ${response.status}`, "error");
          }
        } catch (error) {
          console.error("Error deleting record:", error);
          Swal.fire("Error!", `An error occurred while deleting record: ${error.message}`, "error");
        }
      }
    });
  };

  // *** handleDeleteField for deleting a specific field (setting it to null) ***
  const handleDeleteField = async (seqToDelete) => {
    if (!selectedDocConfigID || !selectedConfigType) {
      Swal.fire("Validation Error", "Please select DocConfigID and ConfigType first.", "warning");
      return;
    }

    const existingRecord = docConfigSchema.find(
      (item) => item.docConfigID.toString() === selectedDocConfigID.toString() &&
        item.configType.toString() === selectedConfigType.toString()
    );

    if (!existingRecord) {
      Swal.fire("Information", "No record found to clear this field.", "info");
      return;
    }

    const fieldNameKey = `field${seqToDelete}`;
    const fieldValue = existingRecord[fieldNameKey];

    if (!fieldValue || fieldValue.trim() === "") {
      Swal.fire("Information", `Field ${seqToDelete} is already empty.`, "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to clear Field ${seqToDelete} for DocConfigID: ${selectedDocConfigID} and ConfigType: ${selectedConfigType}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear this field!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // สร้าง object สำหรับการแก้ไข โดยตั้งค่า Field นั้นๆ เป็น null
          const dataToUpdate = { ...existingRecord };
          dataToUpdate[fieldNameKey] = null; // หรือใช้ "" ถ้า Backend คาดหวัง string ว่างเปล่า

          const payload = dataToUpdate;
          console.log(`Payload for clearing Field ${seqToDelete} (PUT):`, payload);

          const apiUrl = `${API_BASE}/DocConfig/EditDocConfigSchema`;
          const response = await axios.put(apiUrl, payload);

          if (response.status === 200) {
            Swal.fire("Cleared!", `Field ${seqToDelete} has been cleared.`, "success");
            // รีเฟรชข้อมูลในตาราง
            refreshTableData(selectedDocConfigID, selectedConfigType, null); // ตั้ง seq เป็น null เพื่อไม่ให้เลือก Field ใดๆ ใน form
          } else {
            Swal.fire("Error!", `Failed to clear field. Status: ${response.status}`, "error");
          }
        } catch (error) {
          console.error(`Error clearing field ${seqToDelete}:`, error);
          Swal.fire("Error!", `An error occurred while clearing field: ${error.message}`, "error");
        }
      }
    });
  };

  // NEW: Navigation functions for DocConfigIDs

  const goToFirst = () => { //docConfigSchema
    if (docConfigIDOptions.length > 0) {
      setSelectedDocConfigID(docConfigIDOptions[0].docConfigID.toString());
    }
  };

  const goToPrevious = () => {
    const currentIndex = docConfigIDOptions.findIndex(
      (option) => option.docConfigID.toString() === selectedDocConfigID.toString()
    );
    if (currentIndex > 0) {
      setSelectedDocConfigID(docConfigIDOptions[currentIndex - 1].docConfigID.toString());
    }
  };

  const goToNext = () => {
    const currentIndex = docConfigIDOptions.findIndex(
      (option) => option.docConfigID.toString() === selectedDocConfigID.toString()
    );
    if (currentIndex < docConfigIDOptions.length - 1) {
      setSelectedDocConfigID(docConfigIDOptions[currentIndex + 1].docConfigID.toString());
      console.log("Selected DocConfigID GoNext: " + selectedDocConfigID);
    }
  };

  const goToLast = () => { //docConfigSchema
    if (docConfigIDOptions.length > 0) {
      setSelectedDocConfigID(docConfigIDOptions[docConfigIDOptions.length - 1].docConfigID.toString());
      console.log("Selected DocConfigID GoLast: " + selectedDocConfigID);
    }
  };
  const goToLast1 = () => { //docConfigSchema
    if (docConfigIDOptions.length > 0) {
      setSelectedDocConfigID(docConfigIDOptions[docConfigIDOptions.length - 1].docConfigID.toString());
      console.log("Selected DocConfigID GoLast: " + selectedDocConfigID);
    }
  };

  const handleGoBack = () => {
    navigate(`${URL}DocConfigSchemaList`);
  };

  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
      onClick: handleSaveNew, // เรียก handleAddNew โดยตรง
    },
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
    <div className="row" style={{ padding: "5%" }}>
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoBack}>
        &nbsp;Optional Field Schema&nbsp;
      </h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-md-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Optional Field
            </h4>
            <p className="docconfig-subtitle">ฟิลด์เพิ่มเติม</p>
          </div>
        </div>
        <div className="col-md-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActions} />
      </div>
      <div>&nbsp;</div>
      {/* <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none" }}
      /> */}
      <div style={{ marginBottom: 20 }}>
        <FormControl fullWidth>
          <InputLabel id="doc-config-id-label">DocConfig</InputLabel>
          <Select
            labelId="doc-config-id-label"
            id="docConfigID"
            value={selectedDocConfigID}
            label="DocConfigID"
            onChange={handleDocConfigIDChange}
          >
            {docConfigIDOptions.map((option) => (
              <MenuItem
                style={{ justifyContent: "center" }}
                key={option.docConfigID}
                value={option.docConfigID.toString()}
              >
                {option.category}/{option.eName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="config-type"
          name="config-type"
          value={selectedConfigType}
          onChange={handleConfigTypeChange}
          style={{ justifyContent: "center", marginBottom: 20 }}
        >
          <FormControlLabel value="0" control={<Radio />} label="Header (0)" />
          <FormControlLabel value="1" control={<Radio />} label="Detail (1)" />
        </RadioGroup>
      </FormControl>

      <div style={{ marginBottom: 20 }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th colSpan="3" style={{
                textAlign: "center", backgroundColor: "#ff0000",
                color: "#fff", fontWeight: "bold"
              }}>
                {selectedConfigType === "0" ? "Header" : "Detail"}
              </th>
            </tr>
            <tr>
              <th style={{
                textAlign: "center", backgroundColor: "#ff0000",
                color: "#fff"//, fontWeight: "bold"
              }}>Field</th>
              <th style={{
                textAlign: "center", backgroundColor: "#ff0000",
                color: "#fff"//, fontWeight: "bold"
              }}>Type</th>
              <th style={{
                textAlign: "center", backgroundColor: "#ff0000",
                color: "#fff"//, fontWeight: "bold"
              }}>Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#aaa", backgroundColor: "#ffffe0" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              <>
                {!displayedTableData ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#aaa", backgroundColor: "#ffffe0" }}>
                      No data found for selected DocConfigID and ConfigType.
                    </td>
                  </tr>
                ) : (
                  Array.from({ length: 20 }, (_, i) => {
                    const fieldName = `field${i + 1}`;
                    const fieldValue = displayedTableData[fieldName];
                    if (!fieldValue || fieldValue.trim() === "") {
                      return null;
                    }
                    const parsed = parseField(fieldValue);

                    if (!parsed) return null;

                    return (
                      <tr
                        key={`${displayedTableData.docConfigID}_${fieldName}`}
                        style={{
                          background:
                            (formData.seq === (i + 1) &&
                              formData.docConfigID.toString() === displayedTableData.docConfigID.toString() &&
                              formData.configType.toString() === displayedTableData.configType.toString())
                              ? "#e0e0e0"
                              : "white",
                        }}
                      >
                        <td
                          style={{ textAlign: "center", cursor: "pointer", backgroundColor: "#ffffe0" }}
                          onClick={() => {
                            setFormData({
                              docConfigID: displayedTableData.docConfigID,
                              configType: displayedTableData.configType,
                              seq: i + 1,
                              type: parsed.type,
                              FieldName: parsed.name,
                              // rawValue: fieldValue, // ไม่ต้องตั้งค่า rawValue แล้ว
                              no: parsed.number,
                            });
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{ textAlign: "center", cursor: "pointer", backgroundColor: "#ffffe0" }}
                          onClick={() => {
                            setFormData({
                              docConfigID: displayedTableData.docConfigID,
                              configType: displayedTableData.configType,
                              seq: i + 1,
                              type: parsed.type,
                              FieldName: parsed.name,
                              // rawValue: fieldValue, // ไม่ต้องตั้งค่า rawValue แล้ว
                              no: parsed.number,
                            });
                          }}
                        >
                          {parsed.type}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingRight: '10px',
                            backgroundColor: "#ffffe0"
                          }}
                          onClick={() => {
                            setFormData({
                              docConfigID: displayedTableData.docConfigID,
                              configType: displayedTableData.configType,
                              seq: i + 1,
                              type: parsed.type,
                              FieldName: parsed.name,
                              no: parsed.number,
                            });
                          }}
                        >
                          <span style={{ flexGrow: 1 }}>{parsed.name}</span>
                          <FontAwesomeIcon
                            icon={faCircleMinus}
                            size="lg"
                            style={{ color: "#d33", cursor: "pointer", marginLeft: '10px' }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from firing
                              handleDeleteField(i + 1);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  }).filter(Boolean)
                )}
                {displayedTableData && Array.from({ length: 20 }, (_, i) => {
                  const fieldName = `field${i + 1}`;
                  return displayedTableData[fieldName];
                }).every(val => !val || val.trim() === "") && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", color: "#aaa", backgroundColor: "#ffffe0" }}> {/* ปรับ colSpan เป็น 3 */}
                        No active fields found for this configuration.
                      </td>
                    </tr>
                  )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-2">
          <TextField
            id="seq"
            name="seq"
            label="Seq"
            value={formData.seq !== null ? formData.seq : 0}
            type="number"
            variant="standard"
            onChange={handleInputChange}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                backgroundColor: "#ffffe0",
                padding: "4px 8px",
              },
              "& .MuiInputLabel-root": {
                color: "#ff0000",
                fontWeight: "bold",
                fontSize: "18px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00008b",
              },
            }}
          />
        </div>
        <div className="col-12 col-md-2">
          <TextField
            id="type"
            name="type"
            label="Type"
            select
            variant="standard"
            value={formData.type || "Date"}
            onChange={handleInputChange}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                backgroundColor: "#ffffe0",
                padding: "4px 8px",
              },
              "& .MuiInputLabel-root": {
                color: "#ff0000",
                fontWeight: "bold",
                fontSize: "18px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00008b",
              },
            }}
          >
            <MenuItem value={"Date"}>Date</MenuItem>
            <MenuItem value={"Text"}>Text</MenuItem>
            <MenuItem value={"Num"}>Num</MenuItem>
          </TextField>
        </div>
        <div className="col-12 col-md-2">
          <TextField
            id="no"
            name="no"
            label="No"
            type="number"
            variant="standard"
            value={formData.no !== null ? formData.no : 0}
            onChange={handleInputChange}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                backgroundColor: "#ffffe0",
                padding: "4px 8px",
              },
              "& .MuiInputLabel-root": {
                color: "#ff0000",
                fontWeight: "bold",
                fontSize: "18px"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00008b",
              },
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextField
            id="FieldName"
            name="FieldName"
            label="Field Name"
            type="text"
            variant="standard"
            value={formData.FieldName || ""}
            placeholder="กรุณากรอกชื่อไฟล์"
            InputLabelProps={{ shrink: true }}
            onChange={handleInputChange}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                backgroundColor: "#ffffe0",
                padding: "4px 8px",
              },
              "& .MuiInputLabel-root": {
                color: "#ff0000",
                fontWeight: "bold",
                fontSize: "18px"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00008b",
              },
            }}
          />
        </div>
      </div>
      {/* เพิ่มช่อง Raw Value เพื่อดูค่าเต็มตอนแก้ไข */}
      {/* <div className="col-md-12" style={{ display: "flex" }}>
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="rawValue"
            name="rawValue" // ใช้ name แทน id เพื่อให้ handleInputChange ทำงานได้
            label="Raw Value (Read Only)"
            type="text"
            variant="standard"
            value={formData.rawValue || ""}
            style={{ width: "100%" }}
            InputProps={{ readOnly: true }}
          />
        </ListItem>
      </div> */}
      {/* <div>&nbsp;</div> */}
      <div style={{ display: "grid", justifyContent: "flex-end", padding: "10px" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      <div style={{ paddingTop: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL + "DocConfigSchemaList"} />
    </div>
  );
}

export default DocConfigSchema;