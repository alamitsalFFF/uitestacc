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
import tawanImagelogo  from '../img/tawanlogo.png';
import { Link } from "react-router-dom";

const cardssub = [
  {
    id: "PI",
    title: "Payment Invoice",
    description: "บันทึกรับวางบิล",
    address:"/uitestacc/MenuCard",
  },
  {
    id: "SI",
    title: "Sale Invoice",
    description: "ใบแจ้งหนี้",
    address:"/uitestacc/MenuCard",

  },
];
function MenuCardM1() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  // const tawanImage = "./img/tawan.jpg";

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Module 1</h1>
    
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
        gap: 2,
      }}
    >
      {cardssub.map((card, index) => (
        <Card key={card.id}>
        <Link to={card.address} style={{ textDecoration: 'none',color:"black" }}>
        <CardActionArea
        style={{textAlign:'center'}}
          onClick={() => setSelectedCard(index)}
          data-active={selectedCard === index ? "" : undefined}
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
            sx={{ height: "100%"     ,
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              textAlign: "center",
             }}
          >
            {/* <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" style={{color:"#990000",textAlign:"center"}}/> */}
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
      {/* <div><h1>เมนูยังไม่ถูก</h1></div> */}
    </Box>
    </div>
  );
}
export default MenuCardM1;