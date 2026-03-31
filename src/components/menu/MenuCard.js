import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Card, CardContent, Typography, CardActionArea, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { 
  FaBiking, 
  FaPiggyBank, 
  FaBullseye, 
  FaUsers, 
  FaRocket, 
  FaCode,
  FaCube,
  FaCoins,
  FaPaperPlane,
  FaPlus
} from "react-icons/fa";

const menuItems = [
  { 
    title: "S-Bike", 
    subtitle: "Monthly Investment +342.30€", 
    icon: <FaBiking size={24} />,
    color: "linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)"
  },
  { 
    title: "Account", 
    icon: <FaBullseye size={24} />,
    color: "linear-gradient(135deg, #ef9a9a 0%, #e57373 100%)"
  },
  { 
    title: "Financial", 
    icon: <FaCode size={24} />,
    color: "linear-gradient(135deg, #e57373 0%, #ef5350 100%)"
  },
  { 
    title: "Module1", 
    icon: <FaCube size={24} />,
    color: "linear-gradient(135deg, #ef5350 0%, #f44336 100%)"
  },
  { 
    title: "Master", 
    icon: <FaUsers size={24} />,
    color: "linear-gradient(135deg, #f44336 0%, #e53935 100%)"
  },
  { 
    title: "Purchase", 
    icon: <FaCoins size={24} />,
    color: "linear-gradient(135deg, #e53935 0%, #d32f2f 100%)"
  },
  { 
    title: "Sales", 
    icon: <FaPiggyBank size={24} />,
    color: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)"
  },
  { 
    title: "Delivery", 
    icon: <FaRocket size={24} />,
    color: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)"
  },
  { 
    title: "Approve", 
    icon: <FaPlus size={24} />,
    color: "linear-gradient(135deg, #b71c1c 0%, #8e0000 100%)"
  },
  { 
    title: "Form Print", 
    icon: <FaPaperPlane size={24} />,
    color: "linear-gradient(135deg, #8e0000 0%, #5a0000 100%)"
  }
];

const RedGradientMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3,
      background: "linear-gradient(180deg,hsl(0, 0.00%, 99.20%) 0%,rgb(255, 255, 255) 100%)",
      minHeight: "100vh"
    }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4,
        p: 2,
        background: "linear-gradient(90deg, #ffcdd2 0%, #ef9a9a 100%)",
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#d32f2f" }}>Elisabeth Taylor</Typography>
        <Typography variant="subtitle1" sx={{ color: "#b71c1c" }}>Platinum Account</Typography>
      </Box>

      {/* S-Bike Card (Special Card) */}
      <Card sx={{ 
        mb: 3,
        background: "linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)",
        borderRadius: 3,
        boxShadow: 3
      }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <FaBiking size={28} style={{ marginRight: 12, color: "#d32f2f" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#b71c1c" }}>S-Bike</Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#c62828" }}>Monthly Investment +342.30€</Typography>
        </CardContent>
      </Card>

      {/* Menu Grid */}
      <Grid container spacing={2}>
        {menuItems.slice(1).map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card sx={{ 
              height: "100%",
              background: item.color,
              borderRadius: 3,
              boxShadow: 2,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)"
              }
            }}>
              <CardActionArea sx={{ 
                height: "100%", 
                p: 2,
                "&:hover": {
                  "& svg": {
                    transform: "scale(1.2)"
                  }
                }
              }}>
                <Box sx={{ 
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}>
                  <Box sx={{ 
                    mb: 1,
                    "& svg": {
                      transition: "transform 0.3s",
                      color: "#fff"
                    }
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#fff" }}>
                    {item.title}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RedGradientMenu;