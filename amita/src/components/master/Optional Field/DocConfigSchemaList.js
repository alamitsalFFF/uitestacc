import React, { useState, useEffect } from "react";
import axios from "../../Auth/axiosConfig"; // ใช้ axiosConfig ที่มี interceptor
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DocConfigSchema from "./DocConfigSchema";
import { GET_VIEW_RESULT, URL } from "../../api/url";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import CircularButtonGroup from "../../DataFilters/CircularButtonGroup";
import HeaderBar from "../../menu/HeaderBar";

function DocConfigSchemaList() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [docConfigSchemaData, setDocConfigSchemaData] = useState([]);

  const vMas_DocConfigSchema = {
    viewName: "vMas_DocConfigSchema",
    parameters: [
      // { field: "AccDocType", value: "PR" }, // การกรองข้อมูล
    ],
    results: [
      { sourceField: "TName" },
      { sourceField: "EName" },
      { sourceField: "DocConfigID" },
      { sourceField: "ConfigType" },
      { sourceField: "Field1" },
      { sourceField: "Field2" },
      { sourceField: "Field3" },
      { sourceField: "Field4" },
      { sourceField: "Field5" },
      { sourceField: "Field6" },
      { sourceField: "Field7" },
      { sourceField: "Field8" },
      { sourceField: "Field9" },
      { sourceField: "Field10" },
      { sourceField: "Field11" },
      { sourceField: "Field12" },
      { sourceField: "Field13" },
      { sourceField: "Field14" },
      { sourceField: "Field15" },
      { sourceField: "Field16" },
      { sourceField: "Field17" },
      { sourceField: "Field18" },
      { sourceField: "Field19" },
      { sourceField: "Field20" },
    ],
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("vMas_DocConfigSchema:", vMas_DocConfigSchema);
        setLoading(true);

        const response = await axios.post(
          GET_VIEW_RESULT,
          vMas_DocConfigSchema,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          console.log("data", response.data);
          setDocConfigSchemaData(response.data);
        } else {
          setLoading(false);
          console.error("Error:", response.statusText);
          // setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error("Error:", error);
        // setError(error.message);
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };

  const filteredDocConfigSchema = docConfigSchemaData
    .filter((docConfig) => {
      // กรองข้อมูลตาม searchTerm
      const searchLower = searchTerm.toLowerCase();
      return (
        docConfig.TName.toLowerCase().includes(searchLower) ||
        docConfig.EName.toString().toLowerCase().includes(searchLower)
      );
    })
    .filter((docConfig, index, self) =>
      index === self.findIndex((item) => item.TName === docConfig.TName)
    );

  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };
  const handleEditClick = (DocConfigID) => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า DocConfigSchema พร้อมส่ง DocConfigID เป็นพารามิเตอร์
    navigate(`${URL}DocConfigSchema?docConfigID=${DocConfigID}`);
  };
  const handleAddNew = () => {
    // ฟังก์ชันสำหรับนำทางไปยังหน้า Warehouse พร้อมล้าง query parameter
    navigate(`${URL}DocConfigSchema`);
  };

  const handleGoBack = () => {
    navigate(URL);
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
        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} size="1x" />
      ),
      name: "Add New",
      onClick: handleAddNew,
    },
    // {
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faMagnifyingGlass}
    //       style={{ color: "#4301b3" }}
    //       size="1x"
    //     />
    //   ),
    //   name: "Search Data",
    //   onClick: handleSearch, // เรียกฟังก์ชันเปิด Modal ค้นหา
    // },
  ];
  return (
    <div>
      {/* <h2 style={{ textAlign: "center", textDecorationLine: "underline" }}
        onClick={handleGoBack}>&nbsp;DocConfigSchema&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Optional Field
            </h4>
            <p className="docconfig-subtitle">ฟิลด์เพิ่มเติม</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          {/* <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            style={{ color: "#2f9901" }}
            onClick={handleAddNew}
          /> */}
          <CircularButtonGroup actions={buttonActions} />
        </div>
        <div style={{ marginLeft: "auto" }}>
          {showSearch ? (
            <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="2x"
              style={{ color: "#4301b3" }}
              onClick={toggleSearch} // แสดงไอคอนค้นหาเมื่อ showSearch เป็น false
            />
          )}
        </div>
      </div>
      <Divider
        variant="middle"
        component="li"
        style={{ listStyle: "none" }}
      />
      {filteredDocConfigSchema.map((docConfig, docConfigID) => (
        <div key={docConfigID} onClick={() => handleEditClick(docConfig.DocConfigID)}>
          <ListItem style={{ display: "flex", alignItems: "center", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <FontAwesomeIcon
                icon={faPenToSquare}
                size="2x"
                style={{ color: "#2d01bd" }}
                onClick={() => handleEditClick(docConfig.DocConfigID)}
              /> */}
              <h5 style={{ marginTop: "10px", marginLeft: "10px" }}>{docConfig.EName}
                {/* <h6 style={{ marginLeft: "10px", color: "GrayText" }}>{docConfig.TName}</h6> */}
                <i style={{ marginLeft: "10px", color: "GrayText" }}>&nbsp;({docConfig.TName})</i>
              </h5>
            </div>
          </ListItem>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
        </div>
      ))}
      <div style={{ marginTop: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default DocConfigSchemaList;
