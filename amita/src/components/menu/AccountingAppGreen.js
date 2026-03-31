import React, { useState, useEffect } from "react"; // เพิ่ม useState
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  Button, // เพิ่ม Button สำหรับปุ่มย้อนกลับ
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  FaFileInvoiceDollar,
  FaCalculator,
  FaChartLine,
  FaUsers,
  FaCog,
  FaPrint,
  FaSearch,
  FaExchangeAlt,
  FaHistory,
  FaShieldAlt,
  FaArrowLeft,
  FaWarehouse,
  FaProcedures,
  FaBox,
  FaBoxOpen,
  FaMarsStroke,
  FaProjectDiagram,
  FaProductHunt,
  FaAccessibleIcon,
  FaCalendar,
  FaToolbox,
  FaUser,
  FaIdCard,
  FaChartBar,
  FaFolder,
  FaSupple,
  FaUserCircle,
  FaAddressBook,
  FaIdBadge,
  FaRegGrimace,
  FaRegGrinBeam,
  FaItunes,
  FaLayerGroup,
  FaDatabase,
  FaUserPlus,
  FaServer,
  FaUsersCog,
  FaTruck,
  FaTruckLoading,
  FaTruckPickup,
  FaTruckMoving,
  FaCheckCircle,
  FaCheckSquare,
  FaSpellCheck,
  FaCalendarCheck,
  FaFile,
  FaFileAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaJediOrder,
  FaFirstOrder,
  FaFirstOrderAlt,
  FaBookReader,
  FaBoxTissue,
  FaDollarSign,
  FaWallet,
  FaCashRegister,
  FaSalesforce,
  FaMoneyCheck,
  FaRegPlusSquare,
  FaRegFileAlt,
  FaServicestack,
  FaConciergeBell,
  FaStackpath,
  FaBoxes,
  FaFolderOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE, URL } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";

const menuItems = [
  {
    title: "Account",
    icon: <FaFileInvoiceDollar size={24} />,
    color: "#ffffff",
    // ไม่ต้องมี address ที่นี่แล้ว เพราะจะจัดการใน state
    subItems: [
      {
        title: "Account Payables",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/",
        MenuName: "เจ้าหนี้",
        action: () => alert("ไปหน้าตั้งเจ้าหนี้"),
      },
      {
        title: "Account Receiables",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/",
        action: () => alert("ไปหน้าตั้งลูกหนี้"),
      },
      {
        title: "Payment Voucher",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/PVList/",
        action: () => alert("ไปหน้าบันทึกจ่ายเงิน"),
      },
      {
        title: "Receive Voucher",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/RVList/",
        action: () => alert("ไปหน้าบันทึกรับเงิน"),
      },
      {
        title: "Journal Entries",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/JVList/",
        action: () => alert("ไปหน้าสมุดรายวันทั่วไป"),
      },
      {
        title: "Closing Entries",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/",
        action: () => alert("ไปหน้าปิดบัญชี"),
      },
      {
        title: "Quick Payment (รายวันจ่าย)",
        icon: <FaCashRegister size={20} />,
        address: "/uitestacc/AccordionQP/",
        action: () => alert("ไปหน้ารายวันจ่าย"),
      },
      {
        title: "Quick Receive (รายวันรับ)",
        icon: <FaCashRegister size={20} />,
        address: "/uitestacc/AccordionQR/",
        action: () => alert("ไปหน้ารายวันรับ"),
      },
    ],
  },
  {
    title: "Financial",
    icon: <FaCalculator size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Payment Invoice",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/PIList/",
        action: () => alert("ไปหน้าบันทึกรับวางบิล"),
      },
      {
        title: "Sale Invoice",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/SIList/",
        action: () => alert("ไปหน้าบันทึกการขาย"),
      },
      {
        title: "Cheque Payment",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/PCList/",
        action: () => alert("ไปหน้าจ่ายเช็ค"),
      },
      {
        title: "Cheque Receive",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/RCList/",
        action: () => alert("ไปหน้ารับเช็ค"),
      },
    ],
  },
  {
    title: "Module1",
    icon: <FaChartLine size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Module1",
        icon: <FaChartLine size={20} />,
        address: "/uitestacc/AccountCode/",
        action: () => alert("Module1"),
      },
    ],
  },
  {
    title: "Master",
    icon: <FaUsers size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Account Master Files",
        icon: <FaCalendar size={20} />,
        subItems: [
          {
            title: "Suppliers",
            icon: <FaUsersCog size={20} />,
            address: "/uitestacc/SupplierList/",
            action: () => alert("ไปหน้าบันทึกรับเงิน"),
          },
          {
            title: "Customers",
            icon: <FaUsers size={20} />,
            address: "/uitestacc/CustomerList/",
            action: () => alert("ไปหน้าสมุดรายวันทั่วไป"),
          },
          {
            title: "ACC1",
            icon: <FaLayerGroup size={20} />,
            address: "/uitestacc/AccCode/",
            action: () => alert("ไปหน้าAccCodeList"),
          },
          {
            title: "ผังบัญชี",
            icon: <FaFolderOpen size={20} />,
            address: "/uitestacc/AccCodeList/",
            action: () => alert("ไปหน้าAccList"),
          },
          {
            title: "ผังบัญชีรวม",
            icon: <FaFolderOpen size={20} />,
            address: "/uitestacc/AccCodefull/",
            action: () => alert("ไปหน้าAccList"),
          },
        ], //<FontAwesomeIcon icon={faRectangleList} />
      },
      {
        title: "Products Master",
        icon: <FaProductHunt size={20} />,
        subItems: [
          {
            title: "Warehouse GL",
            icon: <FaWarehouse size={20} />,
            address: "/uitestacc/WarehouseList/",
            action: () => alert("ไปหน้าคลังสินค้า"),
          },
          // { title: "Product Type", icon: <FaBox size={20} />, address: "/uitestacc/ProductTypeList/", action: () => alert("ไปหน้าประเภทสินค้า") },
          {
            title: "Product Type",
            icon: <FaBox size={20} />,
            // address: "/uitestacc/ProductTypeList/", action: () => alert("ไปหน้าประเภทสินค้า")
            subItems: [
              {
                title: "TypeProduct",
                icon: <FaBoxOpen size={20} />,
                address: "/uitestacc/ProductTypeList/",
                action: () => alert("ไปหน้าประเภทสินค้า"),
              },
              {
                title: "TypeService",
                icon: <FaConciergeBell size={20} />,
                address: "/uitestacc/TypeServiceList/",
                action: () => alert("ไปหน้าประเภทบริการ"),
              },
              {
                title: "TypeIngredient",
                icon: <FaBoxes size={20} />,
                address: "/uitestacc/TypeIngredientList/",
                action: () => alert("ไปหน้าประเภทวัตถุดิบ"),
              },
            ],
          },
          // { title: "Product And Services", icon: <FaBoxOpen size={20} />, address: "/uitestacc/ProductList/", action: () => alert("ไปหน้ารหัสสินค้า/บริการ") },
          {
            title: "Product And Services",
            icon: <FaBoxOpen size={20} />,
            //  address: "/uitestacc/ProductList/", action: () => alert("ไปหน้ารหัสสินค้า/บริการ") },
            subItems: [
              {
                title: "Product",
                icon: <FaBoxOpen size={20} />,
                address: "/uitestacc/ProductList/",
                action: () => alert("ไปหน้ารหัสสินค้า"),
              },
              {
                title: "Service",
                icon: <FaConciergeBell size={20} />,
                address: "/uitestacc/ServiceList/",
                action: () => alert("ไปหน้ารหัสบริการ"),
              },
              {
                title: "Ingredient",
                icon: <FaBoxes size={20} />,
                address: "/uitestacc/IngredientList/",
                action: () => alert("ไปหน้ารหัสวัตถุดิบ"),
              },
            ],
          },
          // { title: "Warehouse", icon: <FaWarehouse size={20} />, address: "/uitestacc/WarehouseList/", action: () => alert("ไปหน้าคลังสินค้า") },
        ],
      },
      {
        title: "System Master Files",
        // icon: <FaToolbox size={20} />,
        icon: <FaToolbox size={20} />,
        subItems: [
          {
            title: "Users",
            icon: <FaUser size={20} />,
            address: "/uitestacc/",
            action: () => alert("ไปหน้าข้อมูลผู้ใช้งาน"),
          },
          {
            title: "Company Profiles",
            icon: <FaIdCard size={20} />,
            address: "/uitestacc/",
            action: () => alert("ไปหน้าข้อมูลกิจการ"),
          },
          {
            title: "AccConfig",
            icon: <FaCog size={20} />,
            address: "/uitestacc/AccConfigList/",
            action: () => alert("ไปหน้าการตั้งค่าระบบบัญชี"),
          },
          {
            title: "DocConfigSchema",
            icon: <FaServer size={20} />,
            address: "/uitestacc/DocConfigSchemaList/",
            action: () => alert("ไปหน้าDocConfigSchema"),
          },
        ],
      },
    ],
  },
  {
    title: "Purchase",
    icon: <FaShoppingBag size={24} />,
    color: "#ffffff",
    subItems: [
      // { title: "Purchase Requisition", icon: <FaShoppingCart size={20} />, address: "/uitestacc/PurchaseRequisition/", action: () => alert("ไปหน้าใบขอซื้อ") },
      {
        title: "Purchase Requisition",
        icon: <FaShoppingCart size={20} />,
        address: "/uitestacc/PRList/",
        action: () => alert("ไปหน้าใบขอซื้อ"),
      },
      {
        title: "Purchase Order",
        icon: <FaWallet size={20} />,
        address: "/uitestacc/POList/",
        action: () => alert("ไปหน้าใบสั่งซื้อ"),
      },
      {
        title: "Cash Purchase",
        icon: <FaCashRegister size={20} />,
        address: "/uitestacc/AccordionQB/",
        action: () => alert("ไปหน้าใบซื้อสด"),
      },
    ],
  },
  {
    title: "Sales",
    icon: <FaMoneyCheck size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Sales Requisition",
        icon: <FaCog size={20} />,
        address: "/uitestacc/SRList/",
        action: () => alert("ไปหน้าใบจองสินค้า"),
      },
      {
        title: "Sales Order",
        icon: <FaCog size={20} />,
        address: "/uitestacc/SOList/",
        action: () => alert("ไปหน้าใบสั่งขาย"),
      },
      {
        title: "Cash Sale",
        icon: <FaCog size={20} />,
        address: "/uitestacc/AccordionCS/",
        action: () => alert("ไปหน้าใบขายสด"),
      },
    ],
  },
  {
    title: "Stock Control",
    icon: <FaTruck size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Delivery In",
        icon: <FaTruckLoading size={20} />,
        address: "/uitestacc/DIList/",
        action: () => alert("ไปหน้าDelivery In"),
      },
      {
        title: "Delivery Out",
        icon: <FaTruckMoving size={20} />,
        address: "/uitestacc/DOList/",
        action: () => alert("ไปหน้าDelivery Out"),
      },
      {
        title: "Stock Transaction",
        icon: <FaTruckMoving size={20} />,
        address: "/uitestacc/StockTransaction/",
        action: () => alert("ไปหน้าStockTransaction"),
      },
    ],
  },
  {
    title: "Appove",
    icon: <FaCheckCircle size={24} />,
    color: "#ffffff",
    subItems: [
      {
        title: "Sales Requisition",
        icon: <FaCheckSquare size={20} />,
        address: "/uitestacc/PRConfirm/",
        action: () => alert("ไปหน้าอนุมัติใบขอซื้อ"),
      },
      {
        title: "Sales Order",
        icon: <FaFileAlt size={20} />,
        address: "/uitestacc/SRConfirm/",
        action: () => alert("ไปหน้าอนุมัติใบสั่งขาย"),
      },
    ],
  },
  {
    title: "Report",
    icon: <FaRegFileAlt size={24} />,
    color: "#ffffff",
    //  subItems: [
    //     { title: "รายงานชื้อขาย", icon: <FaRegFileAlt size={20} />, address: `${REPORT_BASE}?From=Report&DB=${DATA_BASE}&SRC=${Base}`, action: () => alert("รายงานชื้อขาย")
    //         //  const reportUrl = `${REPORT_BASE}?From=Report&DB=${DATA_BASE}&SRC=${Base}`;
    //         //  window.open(reportUrl, "_blank");
    //   },
    // ]
    subItems: [
      // {
      //   title: "รายงานชื้อขาย",
      //   icon: <FaRegFileAlt size={20} />,
      //   action: () => {
      //     const reportUrl = `${REPORT_BASE}?From=Report&DB=${DATA_BASE}&SRC=${Base}`;
      //     window.open(reportUrl, "_blank");`
      //   }
      // },
      {
        title: "รายงานชื้อขาย",
        icon: <FaRegFileAlt size={20} />,
        address: `/uitestacc/Report/`,
        action: () => alert("รายงานชื้อขาย"),
      },
      {
        title: "Report All",
        icon: <FaFileAlt size={20} />,
        address: "/uitestacc/TransactionList/",
        action: () => alert("report"),
      },
    ],
  },
];

const moduleIconMap = {
  AC: <FaFileInvoiceDollar size={24} />, // Account
  FC: <FaCalculator size={24} />,         // Financial
  // M1: <FaProjectDiagram size={24} />,     // Module 1
  MA: <FaUsers size={24} />,              // Master
  PC: <FaShoppingBag size={24} />,        // Purchase
  RP: <FaRegFileAlt size={24} />,         // Report
  SC: <FaMoneyCheck size={24} />,         // Sales
  ST: <FaTruck size={24} />,              // Stock
  default: <FaFolder size={24} />
};
// const buildMenuTree = (modules, moduleMenus) => {
//   const tree = modules.map(mod => ({
//     title: mod.moduleNameEN,
//     thaiName: mod.moduleName,
//     moduleID: mod.moduleID,
//     icon: moduleIconMap[mod.moduleID] || moduleIconMap.default,
//     subItems: []
//   }));

//   const menuMap = {};
//   moduleMenus.forEach(menu => {
//     menuMap[menu.menuID] = {
//       ...menu,
//       title: menu.menuNameEN,
//       thaiName: menu.menuName,
//       address: menu.webAddress?.startsWith("#") ? "/uitestacc/" : menu.webAddress,
//       icon: <FaChartLine size={20} />,
//       subItems: []
//     };
//   });

//   moduleMenus.forEach(menu => {
//     const currentItem = menuMap[menu.menuID];
//     if (menu.headMenuID && menuMap[menu.headMenuID]) {
//       menuMap[menu.headMenuID].subItems.push(currentItem);
//     } else {
//       const targetModule = tree.find(m => m.moduleID === menu.moduleID);
//       if (targetModule) targetModule.subItems.push(currentItem);
//     }
//   });
//   return tree;
// };
const buildMenuTree = (modules, moduleMenus) => {
  // 1. เรียงลำดับ Modules ตาม seq ก่อน (ถ้า API Module มี seq มาด้วย)
  // ในกรณี GetModule ไม่มี seq ให้เรียงตามชื่อ หรือตามที่ API ส่งมา
  const sortedModules = [...modules].sort((a, b) => (a.seq || 0) - (b.seq || 0));

  const tree = sortedModules.map(mod => ({
    title: mod.moduleNameEN,
    thaiName: mod.moduleName,
    moduleID: mod.moduleID,
    icon: moduleIconMap[mod.moduleID] || moduleIconMap.default,
    subItems: []
  }));

  const menuMap = {};
  moduleMenus.forEach(menu => {
    menuMap[menu.menuID] = {
      ...menu,
      title: menu.menuNameEN,
      thaiName: menu.menuName,
      menuID: menu.menuID,
      address: menu.webAddress?.startsWith("#") ? `${URL}` : menu.webAddress,
      icon: <FaChartLine size={20} />,
      subItems: []
    };
  });

  // 2. นำเมนูไปใส่ในระดับที่ถูกต้อง
  moduleMenus.forEach(menu => {
    const currentItem = menuMap[menu.menuID];
    if (menu.headMenuID && menuMap[menu.headMenuID]) {
      menuMap[menu.headMenuID].subItems.push(currentItem);
    } else {
      const targetModule = tree.find(m => m.moduleID === menu.moduleID);
      if (targetModule) targetModule.subItems.push(currentItem);
    }
  });

  // 3. ฟังก์ชัน Recursive สำหรับเรียงลำดับ subItems ทุกชั้นตาม seq
  const sortSubItems = (items) => {
    items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.sort((a, b) => (a.seq || 0) - (b.seq || 0));
        sortSubItems(item.subItems); // เรียงชั้นลูกลงไปเรื่อยๆ
      }
    });
  };

  // เรียงลำดับเมนูชั้นแรกที่อยู่ในแต่ละ Module
  tree.forEach(mod => {
    mod.subItems.sort((a, b) => (a.seq || 0) - (b.seq || 0));
    sortSubItems(mod.subItems);
  });

  return tree;
};
const AccountingAppGreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [menuData, setMenuData] = useState([]); // ข้อมูล Tree ที่แปลงแล้ว
  const [menuStack, setMenuStack] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // ดึงข้อมูลพร้อมกันทั้ง 2 API
    Promise.all([
      authFetch(`${API_BASE}/Module/GetModule`).then(res => res.json()),
      authFetch(`${API_BASE}/Module/GetModuleMenu`).then(res => res.json())
    ]).then(([modules, moduleMenus]) => {
      const formatted = buildMenuTree(modules, moduleMenus);
      setMenuData(formatted);
    }).catch(err => console.error("Fetch Error:", err));
  }, []);
  // ฟังก์ชันช่วยแผ่เมนู (Flatten) ไว้ข้างในเพื่อให้เรียกใช้ได้ง่าย
  const flattenMenus = (items, result = []) => {
    items.forEach(item => {
      result.push(item);
      if (item.subItems && item.subItems.length > 0) {
        flattenMenus(item.subItems, result);
      }
    });
    return result;
  };

  const Base = localStorage.getItem("src") || "AccConcept";
  const handleMenuClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      setMenuStack([...menuStack, item]);
    } else if (item.address && item.address !== "") {
      if (item.address.startsWith("http")) {
        window.open(item.address + Base, "_blank");
      } else {
        navigate(item.address);
      }
    } else {
      alert(`เมนู ${item.thaiName} ยังไม่เปิดใช้งาน`);
    }
  };

  const handleSearchNavigation = (word) => {
    if (!word) return;
    const allFlatMenus = flattenMenus(menuData);
    const lowSearch = word.toLowerCase();

    const target = allFlatMenus.find(item =>
      item.title?.toLowerCase().includes(lowSearch) ||
      item.thaiName?.toLowerCase().includes(lowSearch) ||
      item.menuID?.toLowerCase().includes(lowSearch)
    );

    if (target) {
      handleMenuClick(target);
      setSearchTerm("");
    } else {
      alert("ไม่พบเมนู: " + word);
    }
  };

  const itemsToDisplay = menuStack.length === 0
    ? menuData
    : menuStack[menuStack.length - 1].subItems;
  // ------

  // ฟังก์ชันค้นหาแบบ Recursive (รองรับไทย/อังกฤษ)
  const findMenuItem = (items, searchWord) => {
    const lowSearch = searchWord.toLowerCase();
    for (const item of items) {
      const isMatch =
        item.title?.toLowerCase().includes(lowSearch) ||
        item.thaiName?.toLowerCase().includes(lowSearch) ||
        item.menuID?.toLowerCase().includes(lowSearch);

      if (isMatch) return item;

      if (item.subItems?.length > 0) {
        const found = findMenuItem(item.subItems, searchWord);
        if (found) return found;
      }
    }
    return null;
  };

  // ปุ่มย้อนกลับ
  const handleBack = () => {
    setMenuStack(menuStack.slice(0, -1));
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, background: "#ffffff", minHeight: "100vh" }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="ค้นหาเมนู (เช่น ใบแจ้งหนี้,Sale Invoice...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchNavigation(searchTerm)}
          sx={{ maxWidth: 500, '& .MuiOutlinedInput-root': { borderRadius: '25px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><FaSearch color="green" /></InputAdornment>
            ),
            endAdornment: (
              <Button onClick={() => handleSearchNavigation(searchTerm)} sx={{ color: "green", fontWeight: "bold" }}>Go</Button>
            )
          }}
        />
      </Box>

      {/* Breadcrumb Title */}
      {menuStack.length > 0 && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "green", textAlign: "center" }}>
          {menuStack[menuStack.length - 1].thaiName} ({menuStack[menuStack.length - 1].title})
        </Typography>
      )}

      {/* Menu Grid */}
      <Grid container spacing={2}>
        {itemsToDisplay.map((item, index) => {
          const isModuleLevel = menuStack.length === 0;
          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 2,
                background: isModuleLevel ? "linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)" : "#fff",
                transition: "transform 0.3s",
                border: "1px solid #e8f5e9",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 4 }
              }}>
                <CardActionArea sx={{ height: "100%", p: 2 }} onClick={() => handleMenuClick(item)}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: 'center' }}>
                    <Box sx={{ mb: 1, color: "green", "& svg": { transition: "transform 0.3s" } }}>
                      {item.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "green", lineHeight: 1.2 }}>
                      {/* {item.thaiName} */}
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      {/* {item.title} */}
                      {item.thaiName}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Back Button */}
      {menuStack.length > 0 && (
        <Button
          startIcon={<FaArrowLeft />}
          onClick={() => setMenuStack(menuStack.slice(0, -1))}
          sx={{ mt: 3, color: "green", borderColor: "green", borderRadius: "25px" }}
          variant="outlined"
        >
          BACK
        </Button>
      )}
    </Box>
  );
};

export default AccountingAppGreen;
