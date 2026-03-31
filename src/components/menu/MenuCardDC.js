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

const cardssub = [
  {
    id: "DI",
    title: "Delivery In",
    description: "Delivery In",
    address: "/uitestacc/DIList",
  },
  {
    id: "DI",
    title: "Delivery Out",
    description: "Delivery Out",
    address: "/uitestacc/DOList",
  },
];
function MenuCardDC() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  // const tawanImage = "./img/tawan.jpg";
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
      <h2 style={{ textAlign: "center" }}>Delivery</h2>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: 2,
        }}
      >
        {cardssub.map((card, index) => (
          <Card key={card.id}>
            <Link
              to={card.address}
              style={{ textDecoration: "none", color: "black" }}
            >
              <CardActionArea
                style={{ textAlign: "center" }}
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
                  sx={{
                    height: "100%",
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

export default MenuCardDC;
