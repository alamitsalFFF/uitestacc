import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import tawanImagelogo from "../img/tawanlogo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const cardsmain = [
  {
    id: "AC",
    menuid: "AC",
    title: "Account Master Files",
    description: "ข้อมูลระบบบัญชี",
  },
  {
    id: "PD",
    menuid: "PD",
    title: "Products Master",
    description: "ข้อมูลมาตรฐานสินค้า",
  },
  {
    id: "SYS",
    menuid: "SYS",
    title: "System Master Files",
    description: "ข้อมูลมาตรฐานระบบ",
  },
];

const cardssub = {
  AC: [
    {
      id: "AC",
      menuid: "SP",
      title: "Suppliers",
      description: "ผู้ให้บริการ",
      address: "/uitestacc/SupplierList",
    },
    {
      id: "AC",
      menuid: "CU",
      title: "Customers",
      description: "ผู้รับบริการ/ลูกค้า",
      address: "/uitestacc/CustomerList",
    },
    {
      id: "AC",
      menuid: "ACC1",
      title: "Accounts1",
      description: "Accounts1",
      address: "/uitestacc/AccCode/",
    },
    {
      id: "AC",
      menuid: "ACC2",
      title: "Accounts2",
      description: "Accounts2",
      address: "/uitestacc/AccCodeList/",
    },
  ],
  PD: [
    {
      id: "PD",
      menuid: "PT",
      title: "Product Type",
      description: "ประเภทสินค้า",
      address: "/uitestacc/ProductTypeList",
    },
    // {
    //   id: "PD",
    //   menuid: "PG",
    //   title: "Product Group",
    //   description: "กลุ่มสินค้า",
    //   address: "/uitestacc/MenuCard",
    // },
    {
      id: "PD",
      menuid: "PS",
      title: "Product And Services",
      description: "รหัสสินค้า/บริการ",
      address: "/uitestacc/ProductList",
    },
    {
      id: "PD",
      menuid: "WA",
      title: "Warehouse",
      description: "คลังสินค้า",
      address: "/uitestacc/WarehouseList",
    },
  ],
  SYS: [
    {
      id: "SYS",
      menuid: "US",
      title: "Users",
      description: "ข้อมูลผู้ใช้งาน",
      address: "/uitestacc/",
    },
    {
      id: "SYS",
      menuid: "COM",
      title: "Company Profiles",
      description: "ข้อมูลกิจการ",
      address: "/uitestacc/",
    },
    {
      id: "SYS",
      menuid: "AC",
      title: "AccConfig",
      description: "การตั้งค่าระบบบัญชี",
      address: "/uitestacc/AccConfigList/",
    },
    {
      id: "SYS",
      menuid: "DS",
      title: "DocConfigSchema",
      description: "DocConfigSchema",
      address: "/uitestacc/DocConfigSchemaList/",
    },
  ],
};

function MenuCardMA() {
  // const [selectedCard, setSelectedCard] = React.useState(0);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [showSubMenu, setShowSubMenu] = React.useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card.id);
    setShowSubMenu(true); // แสดงเมนูย่อยเมื่อคลิกเมนูหลัก
  };
  // const handleBackToMainMenu = () => {
  //   setShowSubMenu(false); // ซ่อนเมนูย่อย
  //   setSelectedCard(null); // ยกเลิกการเลือกเมนูหลัก
  // };
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/uitestacc/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Master Files</h2>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
        }}
      >
        {/* <div><h5>Master Files</h5></div> */}
        {!showSubMenu &&
          cardsmain.map((card) => (
            <Card key={card.id}>
              <Link
                to={card.address}
                style={{ textDecoration: "none", color: "black" }}
              >
                <CardActionArea
                  style={{ textAlign: "center" }}
                  onClick={() => handleCardClick(card)}
                  sx={{
                    height: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        alt="Tawan"
                        src={tawanImagelogo}
                        sx={{ width: "50px", height: "50px" }}
                      />
                    </Stack>
                    <Typography variant="h5" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          ))}

        {showSubMenu && selectedCard && cardssub[selectedCard] && (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {/* <button onClick={handleBackToMainMenu}>กลับสู่เมนูหลัก</button>{" "} */}
            {cardssub[selectedCard].map((card) => (
              <Card key={card.menuid}>
                <Link
                  to={card.address}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <CardActionArea
                    style={{ textAlign: "center" }}
                    sx={{
                      height: "100%",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar
                          alt="Tawan"
                          src={tawanImagelogo}
                          sx={{ width: "50px", height: "50px" }}
                        />
                      </Stack>
                      <Typography variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            ))}
          </Box>
        )}

        {/* {showSubMenu ? null : !selectedCard ? ( // ไม่ต้องแสดงข้อความเมื่อมีเมนูย่อยแสดงอยู่
        <div>
          <h1>กรุณาเลือกเมนูหลัก</h1>
        </div>
      ) : null // แสดงเมื่อยังไม่ได้เลือกเมนูหลัก
      } */}
      </Box>
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

export default MenuCardMA;
