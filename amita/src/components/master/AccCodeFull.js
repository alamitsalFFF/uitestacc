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
import Button from "@mui/material/Button";
import AccountCodeDT from "./AccountCodeDT";
import { API_BASE, URL } from "../api/url";
import Abbreviations from "../DataFilters/Abbreviations";
import FloatingActionBar from "../DataFilters/FloatingActionBar";
import HeaderBar from "../menu/HeaderBar";
import { IconButton, Tooltip, Typography } from "@mui/material";

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
          onClick={() => onEditClick(node)}
        /> */}

        <div onClick={handleToggle} style={{ cursor: hasChildren ? "pointer" : "default", flexGrow: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", marginRight: "8px" }} onClick={() => onEditClick(node)}>{node.accCode}</span>
            <span onClick={() => onEditClick(node)}>{node.accName}</span>
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
              key={childNode.accCode}
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

function AccCodefull() {
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
  const [selectedAccount, setSelectedAccount] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูล
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [accCodeResponse, accTypeResponse] = await Promise.all([
        axios.get(`${API_BASE}/AccCode/GetAccCode`),
        axios.get(`${API_BASE}/AccType/GetAccType`)
      ]);

      console.log("API Response - AccCode:", accCodeResponse);
      console.log("API Response - AccType:", accTypeResponse);

      if (accCodeResponse.status === 200 && accTypeResponse.status === 200) {
        // ใช้ข้อมูลโดยตรงจาก response
        const accCodeData = accCodeResponse.data || [];
        setAcccodeData(accCodeData);
        setAccTypes(accTypeResponse.data || []);

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (accCodeData.length === 0) {
          setError("ไม่พบข้อมูลบัญชีในระบบ");
        } else {
          console.log("จำนวนข้อมูลบัญชี:", accCodeData.length);
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

    // สร้าง mapping ของทุกโหนดโดยใช้ accCode เป็น key
    data.forEach(item => {
      if (item && item.accCode) {
        map[item.accCode] = { ...item, children: [] };
      }
    });

    // สร้างโครงสร้างต้นไม้
    data.forEach(item => {
      if (!item) return;

      // ตรวจสอบว่าเป็นบัญชีย่อย (มี accMainCode) และมี parent อยู่ใน map
      if (item.accMainCode && map[item.accMainCode] && item.accMainCode !== item.accCode) {
        // เพิ่มเป็นบัญชีย่อยของบัญชีหลัก
        map[item.accMainCode].children.push(map[item.accCode]);
      } else if (map[item.accCode]) {
        // เพิ่มเป็นบัญชีหลัก (root node) - ไม่มี accMainCode หรือ accMainCode ชี้ไปที่ตัวเอง
        tree.push(map[item.accCode]);
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
      const counts = {};
      const uniqueTypes = [];

      // สร้าง Map ของ AccTypeName กับ AccTypeID ที่เกี่ยวข้อง
      const accTypeMap = new Map();
      accTypes.forEach(type => accTypeMap.set(type.accTypeName, type.accTypeID));

      // เพิ่ม "บัญชีเพิ่มเติม" เข้าไปใน Map
      accTypeMap.set("บัญชีเพิ่มเติม", ["6", "9"]);

      // นับจำนวนข้อมูลสำหรับแต่ละประเภท
      accTypeMap.forEach((ids, typeName) => {
        counts[typeName] = acccodedata.filter(acc => {
          if (Array.isArray(ids)) {
            return ids.includes(acc.accTypeID?.toString());
          }
          return acc.accTypeID?.toString() === ids.toString();
        }).length;
        uniqueTypes.push({ accTypeID: ids, accTypeName: typeName });
      });

      setUniqueAccTypes(uniqueTypes);
      setAccTypeCounts(counts);
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
        (node.accName && node.accName.toLowerCase().includes(searchLower)) ||
        (node.accCode && node.accCode.toString().toLowerCase().includes(searchLower));

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

  const filteredTreeData = filterTree(
    treeData.filter(node => {
      // ถ้า filterType เป็น Array (กรณีบัญชีเพิ่มเติม)
      if (Array.isArray(filterType)) {
        return filterType.includes(node.accTypeID?.toString()); // แปลงเป็น String เพื่อเปรียบเทียบ
      }
      // ถ้า filterType เป็นค่าเดี่ยว (กรณีปกติ)
      return filterType ? (node?.accTypeID?.toString() === filterType?.toString()) : true;
    }),
    searchTerm
  );

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  // ฟังก์ชันเมื่อคลิกแก้ไขบัญชี
  const handleEditClick = (account) => {
    console.log("Account clicked:", account);
    setSelectedAccount(account);
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

  const handleFilterByType = (accTypeID, accTypeName) => {
    if (accTypeName === "บัญชีเพิ่มเติม") {
      // ใช้ Array ของ ID สำหรับการ filter บัญชีเพิ่มเติม
      setFilterType(["6", "9"]);
    } else {
      // ใช้ ID ปกติ
      setFilterType(accTypeID);
    }
    setSelectedButton(accTypeName);
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* <h2 style={{ textAlign: "center", marginBottom: "20px", textDecorationLine: "underline" }} onClick={handleGoBack}>&nbsp;ผังบัญชี&nbsp;</h2> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="docconfig-header">
            <h4 className="docconfig-title" onClick={handleGoBack}>
              Account Code
            </h4>
            <p className="docconfig-subtitle">ผังบัญชี</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>
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
                          (accType.accTypeName === "บัญชีเพิ่มเติม" && "info") ||
                          "default"
                        }
                        sx={{ '& .MuiBadge-badge': { border: '1px solid white' } }}
                        style={{ margin: "4px" }}
                      >
                        <Chip
                          label={`${accType.accTypeName}`}
                          // label={<Abbreviations textName={accType.accTypeName} />} //ใช้ตัวอักษรย่อ
                          color={selectedButton === accType.accTypeName ? "primary" : "primary"}
                          variant={selectedButton === accType.accTypeName ? "filled" : "outlined"}
                          onClick={() => handleFilterByType(accType.accTypeID, accType.accTypeName)}
                          style={{ cursor: 'pointer' }}
                        />
                        {/* <Chip
                            label={<Abbreviations textName={accType.accTypeName} />}
                            onClick={() => handleFilterByType(accType.accTypeID, accType.accTypeName)}
                            color={selectedButton === accType.accTypeName ? "primary" : "primary"}
                            variant={selectedButton === accType.accTypeName ? "filled" : "outlined"}
                            style={{ cursor: 'pointer' }}
                        /> */}
                      </Badge>
                    )
                  ))}
                </Stack>
              </Stack>
            </div>

            {/* <div style={{ marginLeft: "auto" }}>
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
            </div> */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              {showSearch ? (
                <SearchComponent onSearch={handleSearch} />
              ) : (
                <Tooltip
                  title={<Typography variant="caption" sx={{ fontSize: '0.9rem' }}>Search Data</Typography>}
                  arrow
                  placement="top"
                >
                  <IconButton
                    aria-label="Search Data"
                    onClick={toggleSearch}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      boxShadow: 2,
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      flexShrink: 0,
                      p: 0.5,
                    }}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4301b3" }} size="1x" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>

          <Divider style={{ margin: "16px 0" }} />
          {/* <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          /> */}
          {/* ส่วนแสดงผลแบบต้นไม้ */}
          <div style={{ //border: "1px solid #e0e0e0", borderRadius: "4px",
            paddingLeft: "16px", paddingRight: "16px", maxHeight: "600px", overflowY: "auto"
          }}>
            {filteredTreeData.length > 0 ? (
              filteredTreeData.map((node) => (
                <TreeNode
                  key={node.accCode}
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
                    ไม่สามารถข้อมูลได้
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
        </Alert>
      )}

      <Divider style={{ margin: "16px 0" }} />

      {/* Component สำหรับแก้ไขข้อมูลบัญชี */}
      <AccountCodeDT selectedAccount={selectedAccount} />

      {/* <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <FontAwesomeIcon
          icon={faCircleArrowLeft}
          size="2x"
          style={{
            color: "#013898",
            cursor: "pointer",
          }}
          onClick={handleGoBack}
        />
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          size="2x"
          style={{
            color: "#013898",
            cursor: "pointer",
          }}
          onClick={scrollToTop}
        />
      </div> */}
      <div style={{ padding: "40px" }}>
        <FloatingActionBar backPath={URL} />
      </div>

    </div>
  );
}

export default AccCodefull;