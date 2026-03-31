import React, { useState, useEffect } from "react";
import axios from "../Auth/axiosConfig";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faMagnifyingGlass,
  faCircleArrowLeft,
  faCircleArrowUp,
  faCaretDown,
  faCaretRight,
  faRefresh,
  faFolder,
  faFolderOpen,
  faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "../purchase/SearchComponen";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
// import Button from "@mui/material/Button";
import { Box, Button } from "@mui/material";
import { FaArrowLeft, FaArrowUp } from "react-icons/fa";

// Component สำหรับแสดงแต่ละโหนดใน tree
function TreeNode({ node, level = 0, onEditClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  // กำหนดไอคอนตามสถานะของโหนด
  const getFolderIcon = () => {
    if (!hasChildren) {
      return faFileInvoice; // โหนดสุดท้ายไม่มี children
    } else if (isOpen) {
      return faFolderOpen; // โหนดที่เปิดแล้ว
    } else {
      return faFolder; // โหนดที่ยังไม่เปิด
    }
  };

  return (
    <div>
      <ListItem 
        style={{ 
          display: "flex", 
          alignItems: "center",
          paddingLeft: `${level * 24 + 8}px`,
          minHeight: "48px"
        }}
      >
        {hasChildren && (
          <span onClick={handleToggle} style={{ cursor: "pointer", marginRight: "8px" }}>
            <FontAwesomeIcon
              icon={isOpen ? faCaretDown : faCaretRight}
              size="lg"
            />
          </span>
        )}
        {!hasChildren && <span style={{ width: "24px", marginRight: "8px" }}></span>}
        
        {/* ไอคอนแสดงสถานะโหนด */}
        <FontAwesomeIcon
          icon={getFolderIcon()}
          size="lg"
          style={{ 
            color: hasChildren ? (isOpen ? "#ff9800" : "#2196f3") : "#4caf50",
            marginRight: "12px",
            cursor: hasChildren ? "pointer" : "default"
          }}
          onClick={handleToggle}
        />
        
        {/* ไอคอนแก้ไข */}
        {/* <FontAwesomeIcon
          icon={faPenToSquare}
          size="lg"
          style={{ color: "#2d01bd", cursor: "pointer", marginRight: "12px" }}
          onClick={() => onEditClick(node.AccCode)}
        /> */}
        
        <div onClick={handleToggle} style={{ cursor: hasChildren ? "pointer" : "default", flexGrow: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", marginRight: "8px" }} onClick={() => onEditClick(node.AccCode)} >{node.AccCode}</span>
            <span>{node.AccName}</span>
            {hasChildren && (
              <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "8px" }}>
                ({node.children.length})
              </span>
            )}
          </div>
        </div>
      </ListItem>

      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.AccCode}
              node={childNode}
              level={level + 1}
              onEditClick={onEditClick}
            />
          ))}
        </Collapse>
      )}
    </div>
  );
}

function AccCodeList() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const [acccodedata, setAcccodeData] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [accTypes, setAccTypes] = useState([]);
  const [uniqueAccTypes, setUniqueAccTypes] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [accTypeCounts, setAccTypeCounts] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [error, setError] = useState(null);

  const vMas_AccCode = {
    viewName: "vMas_AccCode",
    parameters: [],
    results: [
      { sourceField: "AccCode" },
      { sourceField: "AccName" },
      { sourceField: "AccNameEN" },
      { sourceField: "AccTypeID" },
      { sourceField: "AccType" },
      { sourceField: "AccTypeName" },
      { sourceField: "AccTypeNameEN" },
      { sourceField: "AccSide" },
      { sourceField: "AccMainCode" },
      { sourceField: "AccMainName" },
    ],
  };

  // ฟังก์ชันสำหรับดึงข้อมูล
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [accCodeResponse, accTypeResponse] = await Promise.all([
        axios.post(
          "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
          vMas_AccCode,
          { headers: { "Content-Type": "application/json" } }
        ),
        axios.get(
          `http://103.225.168.137/apiaccbk2/api/Prototype/AccType/GetAccType`
        )
      ]);

      console.log("API Response - AccCode:", accCodeResponse);
      console.log("API Response - AccType:", accTypeResponse);

      if (accCodeResponse.status === 200 && accTypeResponse.status === 200) {
        // ใช้ข้อมูลโดยตรงจาก response ไม่需要通过 property data
        setAcccodeData(accCodeResponse.data || []);
        setAccTypes(accTypeResponse.data || []);
        
        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!accCodeResponse.data || accCodeResponse.data.length === 0) {
          setError("ไม่พบข้อมูลบัญชีในระบบ");
        } else {
          console.log("จำนวนข้อมูลบัญชี:", accCodeResponse.data.length);
        }
      } else {
        setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: Status Code ${accCodeResponse.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันสำหรับสร้างโครงสร้างต้นไม้จากข้อมูลบัญชี
  const buildTree = (data) => {
    // ตรวจสอบว่ามีข้อมูลและเป็น array หรือไม่
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No data or not an array in buildTree");
      return [];
    }
    
    const tree = [];
    const map = {};
    
    // สร้าง mapping ของทุกโหนดโดยใช้ AccCode เป็น key
    data.forEach(item => {
      if (item && item.AccCode) {
        map[item.AccCode] = { ...item, children: [] };
      }
    });
    
    // สร้างโครงสร้างต้นไม้
    data.forEach(item => {
      if (!item) return;
      
      // ตรวจสอบว่าเป็นบัญชีย่อย (มี AccMainCode) และมี parent อยู่ใน map
      if (item.AccMainCode && map[item.AccMainCode] && item.AccMainCode !== item.AccCode) {
        // เพิ่มเป็นบัญชีย่อยของบัญชีหลัก
        map[item.AccMainCode].children.push(map[item.AccCode]);
      } else if (map[item.AccCode]) {
        // เพิ่มเป็นบัญชีหลัก (root node) - ไม่มี AccMainCode หรือ AccMainCode ชี้ไปที่ตัวเอง
        tree.push(map[item.AccCode]);
      }
    });
    
    console.log("Built tree structure:", tree);
    return tree;
  };

  useEffect(() => {
    if (acccodedata && acccodedata.length > 0) {
      console.log("Building tree with acccodedata:", acccodedata);
      const tree = buildTree(acccodedata);
      setTreeData(tree);
    } else {
      console.log("No acccodedata available for building tree");
      setTreeData([]);
    }
  }, [acccodedata]);

  useEffect(() => {
    if (accTypes && accTypes.length > 0 && acccodedata && acccodedata.length > 0) {
      console.log("Processing accTypes and acccodedata for counts");
      
      const uniqueTypes = [];
      const seenTypeNames = new Set();

      accTypes.forEach(type => {
        if (type && type.accTypeName && !seenTypeNames.has(type.accTypeName)) {
          seenTypeNames.add(type.accTypeName);
          uniqueTypes.push(type);
        }
      });
      setUniqueAccTypes(uniqueTypes);

      const counts = {};
      uniqueTypes.forEach(type => {
        if (type && type.accTypeID) {
          counts[type.accTypeName] = acccodedata.filter(acc => 
            acc && acc.AccTypeID == type.accTypeID // ใช้ == แทน === เพราะ AccTypeID อาจเป็น string หรือ number
          ).length;
        }
      });
      setAccTypeCounts(counts);
      
      console.log("Unique types:", uniqueTypes);
      console.log("Type counts:", counts);
    }
  }, [accTypes, acccodedata]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setShowSearch(false);
    }
  };

  // ฟังก์ชันสำหรับกรองข้อมูลต้นไม้ตามคำค้นหา
  const filterTree = (tree, searchTerm) => {
    if (!tree || tree.length === 0) return [];
    if (!searchTerm) return tree;
    
    const filteredTree = [];
    const searchLower = searchTerm.toLowerCase();
    
    tree.forEach(node => {
      if (!node) return;
      
      // ตรวจสอบว่าโหนดตรงกับคำค้นหาหรือมี children ที่ตรงกับคำค้นหา
      const isMatch = 
        (node.AccName && node.AccName.toLowerCase().includes(searchLower)) ||
        (node.AccCode && node.AccCode.toString().toLowerCase().includes(searchLower));
      
      // กรอง children ของโหนดนี้
      const filteredChildren = filterTree(node.children, searchTerm);
      
      // ถ้าโหนดตรงกับคำค้นหาหรือมี children ที่ตรงกับคำค้นหา
      if (isMatch || filteredChildren.length > 0) {
        // สร้างโหนดใหม่พร้อม children ที่กรองแล้ว
        const newNode = { ...node, children: filteredChildren };
        filteredTree.push(newNode);
      }
    });
    
    return filteredTree;
  };

  // กรองข้อมูลต้นไม้ตามคำค้นหาและประเภท
  const filteredTreeData = filterTree(
    treeData.filter(node => 
      filterType ? (node && node.AccTypeID == filterType) : true // ใช้ == แทน ===
    ), 
    searchTerm
  );

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleEditClick = (AccCode) => {
    navigate(`/uitestacc/AccountCode?accCode=${AccCode}`);
  };

  const handleGoBack = () => {
    navigate("/uitestacc/");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFilterByType = (accTypeID, accTypeName) => {
    setFilterType(accTypeID);
    setSelectedButton(accTypeName);
  };

  const handleRetry = () => {
    fetchData();
  };

  // ฟังก์ชันสำหรับแสดงข้อมูลดิบเพื่อ debug
  const showRawData = () => {
    console.log("Raw acccodedata:", acccodedata);
    console.log("Raw accTypes:", accTypes);
    console.log("Tree data:", treeData);
    alert(`ตรวจสอบข้อมูลใน Console (F12)\n\nAccCode Data: ${acccodedata.length} items\nAccTypes: ${accTypes.length} items\nTree Data: ${treeData.length} items`);
  };

  return (
    // <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>ผังบัญชี</h2>
      
      {/* แสดงสถานะ loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress />
          <span style={{ marginLeft: "10px" }}>กำลังโหลดข้อมูล...</span>
        </div>
      )}
      
      {/* แสดง error ถ้ามี */}
      {error && !loading && (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              <FontAwesomeIcon icon={faRefresh} style={{ marginRight: "5px" }} />
              โหลดใหม่
            </Button>
          }
          style={{ margin: "16px 0" }}
        >
          {error}
        </Alert>
      )}
      
      {!loading && !error && acccodedata && acccodedata.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {uniqueAccTypes.map((accType) => (
                    accType && (
                      <Badge
                        key={accType.accTypeID}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        badgeContent={accTypeCounts[accType.accTypeName] || 0}
                        max={999}
                        color={
                          (accType.accTypeName === "สินทรัพย์" && "primary") ||
                          (accType.accTypeName === "หนี้สิน" && "error") ||
                          (accType.accTypeName === "ทุนและส่วนของผู้ถือหุ้น" && "secondary") ||
                          (accType.accTypeName === "รายได้" && "success") ||
                          (accType.accTypeName === "ค่าใช้จ่าย" && "warning") ||
                          "default"
                        }
                        sx={{ '& .MuiBadge-badge': { border: '1px solid white' } }}
                        style={{ margin: "4px" }}
                      >
                        <Chip
                          label={`${accType.accTypeName}`}
                          color={selectedButton === accType.accTypeName ? "primary" : "primary"}
                          variant={selectedButton === accType.accTypeName ? "filled" : "outlined"}
                          onClick={() => handleFilterByType(accType.accTypeID, accType.accTypeName)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Badge>
                    )
                  ))}
                </Stack>
              </Stack>
            </div>

            <div style={{ marginLeft: "auto" }}>
              {showSearch ? (
                <SearchComponent onSearch={handleSearch} />
              ) : (
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  size="2x"
                  style={{ color: "#2f9901", cursor: "pointer" }}
                  onClick={toggleSearch}
                />
              )}
            </div>
          </div>

          {/* <Divider style={{ margin: "16px 0" }} /> */}

          {/* ส่วนแสดงผลแบบต้นไม้ */}
          <div style={{ //border: "1px solid #e0e0e0", 
            borderRadius: "4px", padding: "16px" }}>
            {filteredTreeData.length > 0 ? (
              filteredTreeData.map((node) => (
                <TreeNode
                  key={node.AccCode}
                  node={node}
                  onEditClick={handleEditClick}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                {searchTerm || filterType ? (
                  <Alert severity="info">
                    ไม่พบผลลัพธ์ที่ตรงกับการค้นหา
                    {(searchTerm && filterType) && ` สำหรับ "${searchTerm}" และประเภทที่เลือก`}
                    {searchTerm && !filterType && ` สำหรับ "${searchTerm}"`}
                    {!searchTerm && filterType && ` สำหรับประเภทที่เลือก`}
                  </Alert>
                ) : (
                  <Alert severity="warning">
                    ไม่สามารถสร้างโครงสร้างต้นไม้จากข้อมูลได้
                    <Button size="small" onClick={showRawData} style={{ marginLeft: "10px" }}>
                      ดูข้อมูลดิบ
                    </Button>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && (!acccodedata || acccodedata.length === 0) && (
        <Alert severity="warning" style={{ margin: "16px 0" }}>
          ได้รับ response จาก API แต่ไม่มีข้อมูลบัญชี
          <Button size="small" onClick={showRawData} style={{ marginLeft: "10px" }}>
            ดูข้อมูลจาก API
          </Button>
        </Alert>
      )}
      <div style={{paddingTop:"30px"}}>&nbsp;</div>
      <div style={{
        position: "fixed",
        bottom: "20px",
        width: "93%", // กำหนดความกว้างเท่ากับ dashboard
        //maxWidth: "960px", // กำหนดความกว้างสูงสุดเท่ากับ dashboard
        left: "50%", // เลื่อนไปกึ่งกลาง
        transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจริงๆ
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px" // ลด padding ลงเล็กน้อยเพื่อให้พอดี
      }}>
         <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 ,paddingTop: 2 ,borderRadius:"25px !important"}}>
            <Button 
                variant="outlined" 
                startIcon={<FaArrowLeft />} 
                onClick={handleGoBack}
                 sx={{ 
                    color: "green", 
                    borderColor: "green", 
                    borderRadius: "25px", 
                    '&:hover': { 
                    borderColor: "darkgreen", 
                    backgroundColor: 'rgba(0, 128, 0, 0.04)'
                    }
                }}
            >
                Back
            </Button>
        </Box>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 ,paddingTop: 2 ,borderRadius:"25px !important"}}>
            <Button 
                variant="outlined" 
                endIcon ={<FaArrowUp />} 
                onClick={scrollToTop}
                 sx={{ 
                    color: "green", 
                    borderColor: "green", 
                    borderRadius: "25px", 
                    '&:hover': { 
                    borderColor: "darkgreen", 
                    backgroundColor: 'rgba(0, 128, 0, 0.04)'
                    }
                }}
            >
               Top
            </Button>
        </Box>
      </div>
    </div>
  );
}

export default AccCodeList;