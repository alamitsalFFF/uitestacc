import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig";
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
  faPlus,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE, URL } from "../../api/url";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import HeaderBar from "../../menu/HeaderBar";
// import { DataGrid } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';

function AccConfig() {
  const [searchParams] = useSearchParams();
  const ConfigCode = searchParams.get("configCode") || "0";
  console.log("ConfigCode from URL:", ConfigCode);
  //   const WarehouseIDN = parseInt(WarehouseID,10);
  //   console.log("WarehouseID:",WarehouseIDN,);
  console.log("ConfigCode:", typeof ConfigCode);
  const [accConfig, setAccConfig] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    configCode: "",
    configKey: "",
    configValue: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAccConfig = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig` // ดึงข้อมูลทั้งหมด
        );
        if (response.status === 200 && response.data.length > 0) {
          setAccConfig(response.data);
        } else {
          console.error("Failed to fetch accconfig data");
        }
      } catch (error) {
        console.error("Error fetching accconfig data:", error);
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };
    fetchAccConfig();
  }, []);

  useEffect(() => {
    if (accConfig.length > 0 && ConfigCode) {
      const selectedaccConfig = accConfig.find(
        (item) => item.configCode === ConfigCode
      );
      console.log("accConfig:", accConfig);
      if (selectedaccConfig) {
        setFormData(selectedaccConfig);
        console.log("selectedaccConfig:", selectedaccConfig);
      } else {
        console.error("AccConfig not found");
      }
    }
  }, [ConfigCode, accConfig]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value }); // อัปเดต formData เสมอ
  };

  const handleSave = async () => {
    // สร้างสำเนาของ formData เพื่อแก้ไข
    const formDataToSend = { ...formData };

    if (!formDataToSend.configCode || !formDataToSend.configKey) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    const dataToSend = [formDataToSend];
    console.log("formData:", dataToSend);
    console.log("DATATU:", JSON.stringify(dataToSend));
    try {
      const response = await axios.post(
        `${API_BASE}/AccConfig/SetAccConfig`,
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
          title: `บันทึกข้อมูลสำเร็จ ${formDataToSend.configValue}`,
          // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        const accConfigResponse = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig`
        );
        if (
          accConfigResponse.status === 200 &&
          accConfigResponse.data.length > 0
        ) {
          setAccConfig(accConfigResponse.data);
          // ค้นหา AccConfig ที่เพิ่งบันทึก
          const savedAccConfig = accConfigResponse.data.find(
            (accConfig) =>
              accConfig.configCode === formDataToSend.configCode &&
              accConfig.configKey === formDataToSend.configKey
          );
          if (savedAccConfig) {
            setFormData(savedAccConfig);
            // await setFormData(savedAccConfig);
            Swal.fire({
              icon: "success",
              title: `บันทึกข้อมูลสำเร็จ ${savedAccConfig.configKey}`,
              // text: "ข้อมูลสินค้า/บริการถูกบันทึกเรียบร้อยแล้ว",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          console.error("Failed to fetch updated AccConfig data");
        }
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error saving AccConfig data:", error);
      Swal.fire({
        icon: "error",
        title: `ConfigKey ห้ามช้ำกัน!!`,
        text: `กรุณาแก้ ConfigKey:${formDataToSend.configKey}`,
      });
    }
  };

  const handleUpdate = async () => {
    const editData = formData;
    console.log("editData:", editData);
    try {
      const response = await axios.put(
        `${API_BASE}/AccConfig/EditAccConfig`,
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
          title: `แก้ไข ${editData.configKey} สำเร็จ`,
        });
        // ดึงข้อมูลล่าสุดมา setAccConfig และ setFormData
        const accConfigResponse = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig`
        );
        if (
          accConfigResponse.status === 200 &&
          accConfigResponse.data.length > 0
        ) {
          setAccConfig(accConfigResponse.data);
          const updatedAccConfig = accConfigResponse.data.find(
            (accConfig) =>
              accConfig.configCode === editData.configCode &&
              accConfig.configKey === editData.configKey
          );
          if (updatedAccConfig) {
            setFormData(updatedAccConfig);
          }
        }
      } else {
        alert("แก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error updating AccConfig data:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDelete = async () => {
    if (!formData.configCode || !formData.configKey) {
      // alert("ConfigCode หรือ ConfigKey ห้ามว่าง");
      Swal.fire({
        icon: "error",
        title: `ConfigCode หรือ ConfigKey ห้ามว่าง`,
        text: `กรุณาแก้ ConfigCode:${formData.configCode} หรือ ConfigKey:${formData.configKey}`,
      });

      return;
    }
    console.log("DATA:", formData);
    console.log("DATA:", formData.configCode);
    const configCodeToDelete = formData.configCode;
    const configKeyToDelete = formData.configKey;
    console.log("configCodeToDelete:", configCodeToDelete);
    console.log("configKeyToDelete:", configKeyToDelete);
    try {
      console.log("configCodeToDelete:", configCodeToDelete);
      console.log("configKeyToDelete:", configKeyToDelete);
      const response = await axios.delete(
        `${API_BASE}/AccConfig/DeleteAccConfig/${configCodeToDelete}?configKey=${configKeyToDelete}` // ส่ง configCode และ configKey เป็นพารามิเตอร์
      );
      if (response.status === 200) {
        // alert("ลบข้อมูลสำเร็จ");
        Swal.fire({
          icon: "success",
          title: `Delete ${formData.configKey} สำเร็จ`,
        });

        // อัปเดต accConfig state
        setAccConfig(
          accConfig.filter(
            (accConfig) => accConfig.configKey !== formData.configKey
          )
        );

        const accConfigResponse = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig`
        );
        if (
          accConfigResponse.status === 200 &&
          accConfigResponse.data.length > 0
        ) {
          setAccConfig(accConfigResponse.data);
          // หา config ตัวถัดไปที่เหลืออยู่ (หรือรีเซ็ตถ้าไม่มี)
          const filtered = accConfigResponse.data.filter(
            (item) => item.configCode === configCodeToDelete
          );
          if (filtered.length > 0) {
            setFormData(filtered[0]);
          } else {
            setFormData({
              configKey: "",
              configCode: "",
              configValue: "",
            });
          }
        }
      } else {
        alert(`ลบข้อมูลไม่สำเร็จ (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting AccConfig data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleClear = () => {
    setFormData({
      configCode: ConfigCode,
      configKey: "",
      configValue: "",
    });
    console.log("Form cleared", ConfigCode);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(accConfig[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < accConfig.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(accConfig[currentIndex + 1]);
    }
  };

  const goToFirst = () => {
    setCurrentIndex(0);
    setFormData(accConfig[0]);
  };

  const goToLast = () => {
    setCurrentIndex(accConfig.length - 1);
    setFormData(accConfig[accConfig.length - 1]);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(`${URL}AccConfigList`);
  };

  // Group all accConfig items with the same configCode
  const filteredConfigs = accConfig.filter(
    (item) => item.configCode === formData.configCode
  );

  const columns = [
    { field: "configKey", headerName: "ConfigKey", width: 200 },
    { field: "configValue", headerName: "ConfigValue", width: 300 },
  ];

  // สร้าง rows สำหรับ DataGrid (ต้องมี id)
  const rows = filteredConfigs.map((item, idx) => ({
    id: idx + 1,
    ...item,
  }));
  const buttonActions = [
    {
      icon: (
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
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
    {
      icon: (
        <FontAwesomeIcon
          icon={faArrowRotateLeft}
          style={{ color: "#007bff" }}
          size="1x"
        />
      ),
      name: "Clear",
      onClick: handleClear,
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
    <div className="row" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }} onClick={handleGoBack}>
        &nbsp;AccConfig&nbsp;
      </h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="suppiler-header" >
            <h4 className="suppiler-title" onClick={handleGoBack}>
              Configs
            </h4>
            <p className="suppiler-subtitle">ตั้งค่าอื่นๆ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div className="top-action-bar">
        <CircularButtonGroup actions={buttonActions} />
      </div>
      {/* Show all configKey/configValue for the same configCode */}
      {filteredConfigs.length > 0 && (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h5 style={{ color: "#00008b", fontWeight: "bold" }}>ConfigCode:
            <span style={{ color: "#ff0000", fontWeight: "bold" }}>{formData.configCode}</span></h5> {/*ให้สามารถเลือกรายการได้*/}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ background: "#ff0000", fontWeight: "bold", color: "white" }}>ConfigKey</th>
                <th style={{ background: "#ff0000", fontWeight: "bold", color: "white" }}>ConfigValue</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((item) => (
                <tr
                  key={item.configKey}
                  style={{
                    background:
                      item.configKey === formData.configKey
                        ? "#e0e0e0"
                        : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setFormData(item)}
                >
                  <td style={{ backgroundColor: "#ffffe0" }}>{item.configKey}</td>
                  <td style={{ backgroundColor: "#ffffe0" }}>{item.configValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* <Paper sx={{ height: 400, width: "100%", marginTop: 2, marginBottom: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          checkboxSelection
          sx={{ border: 0 }}
          onRowClick={(params) => setFormData(params.row)}
        />
      </Paper> */}
      {/* --------- */}
      {/* <div style={{ display: "grid", justifyContent: "flex-end" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div> */}
      {/* --------- */}
      <div className="col-md-4">
        <TextField
          id="configCode"
          label="ConfigCode*"
          value={formData.configCode || ""}
          // type="text"
          multiline
          variant="standard"
          onChange={handleInputChange}
          // style={{ width: "100%" }}
          placeholder="ConfigCode"
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              color: "#ff0000",
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
      <div className="col-md-4">
        <TextField
          id="configKey"
          label="ConfigKey*"
          value={formData.configKey || ""}
          // type="text"
          multiline
          variant="standard"
          onChange={handleInputChange}
          // style={{ width: "100%" }}
          placeholder="ConfigKey*"
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",
            },
            "& .MuiInputLabel-root": {
              color: "#ff0000",
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
      <div className="col-md-4">
        <TextField
          id="configValue"
          label="ConfigValue*"
          // type="text"
          multiline
          variant="standard"
          value={formData.configValue || ""}
          onChange={handleInputChange}
          // style={{ width: "100%" }}
          placeholder="ConfigValue*"
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "#ffffe0",
              padding: "4px 8px",

            },
            "& .MuiInputLabel-root": {
              color: "#ff0000",
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
      <div style={{ display: "grid", justifyContent: "flex-end", padding: "10px" }}>
        <CircularButtonGroup actions={buttonActionsLNPF} />
      </div>
      <div style={{ padding: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL + "AccConfigs/"} />
    </div>
  );
}
export default AccConfig;
