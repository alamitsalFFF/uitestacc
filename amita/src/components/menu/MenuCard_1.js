import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
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

const cards = [
  {
    id: "AC",
    title: "Account Control",
    description: "ระบบบัญชี",
    address:"/uitestacc/MenuCardAC",
  },

  {
    id: "FC",
    title: "Financial Control",
    description: "ระบบการเงิน",
    address:"/uitestacc/MenuCardFC",

  },

  {
    id: "M1",
    title: "Module1",
    description: "Module 1.",
    address:"/uitestacc/MenuCardM1",
  },

  {
    id: "MA",
    title: "Master Files",
    description: "ข้อมูลมาตรฐาน",
    address:"/uitestacc/MenuCardMA",
  },

  {
    id: "PC",
    title: "Purchase Control",
    description: "ระบบจัดซื้อ",
    address:"/uitestacc/MenuCardPC",
  },

  {
    id: "SC",
    title: "Sales Control",
    description: "ระบบขาย",
    address:"/uitestacc/MenuCardSC",
  },
  {
    id: "DC",
    title: "Delivery",
    description: "Delivery",
    address:"/uitestacc/MenuCardDC",
  },
  {
    id: "AP",
    title: "Appove Control",
    description: "การอนุมัติ",
    address:"/uitestacc/MenuCardAP",
  },
  {
    id: "FP",
    title: "Form Print",
    description: "เอกสาร",
    address:"/uitestacc/TransactionList",
  },
  
];

function MenuCard() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
        gap: 2,
      }}
    >
      {cards.map((card, index) => (
        <Card key={card.id}>
           <Link to={card.address} style={{ textDecoration: 'none',color:"black" }}>
          <CardActionArea
            style={{ textAlign: "center" }}
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? "" : undefined}
            sx={{
              height: "100%", "&[data-active]": {
              backgroundColor: "action.selected","&:hover": {
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
  );
}

export default MenuCard;
