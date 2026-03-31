import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE, URL } from "../api/url";

// ฟังก์ชันสำหรับจัดกลุ่มข้อมูลแบบลำดับชั้น
function groupDataByHierarchy(data) {
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.accMainCode]) {
      grouped[item.accMainCode] = {
        header: data.find((h) => h.accCode === item.accMainCode),
        children: [],
      };
    }
    if (item.accCode !== item.accMainCode) {
      grouped[item.accMainCode].children.push(item);
    }
  });

  // เพิ่มรายการหลักที่ไม่มีลูก
  data.forEach((item) => {
    if (!grouped[item.accCode]) {
      grouped[item.accCode] = {
        header: item,
        children: [],
      };
    }
  });

  return grouped;
}

// ฟังก์ชันสำหรับ Render Accordion แบบ Recursive
function renderAccordion(item, groupedData, level = 0) {
  const hasChildren = groupedData[item.accCode] && groupedData[item.accCode].children.length > 0;

  return (
    <Accordion key={item.accCode}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${item.accCode}-content`}
        id={`panel-${item.accCode}-header`}
      >
        <Typography style={{ marginLeft: level * 16 }}>
          {item.accCode} - {item.accNameEn}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {hasChildren &&
          groupedData[item.accCode].children.map((child) => (
            <React.Fragment key={child.accCode}>
              {renderAccordion(child, groupedData, level + 1)}
            </React.Fragment>
          ))}
        {!hasChildren && (
          <Typography style={{ marginLeft: (level + 1) * 16 }}>
            {/* คุณอาจต้องการแสดงข้อมูลเพิ่มเติมที่นี่ */}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function AccordionTransition() {
  const [groupedData, setGroupedData] = React.useState({});
  const navigate = useNavigate();
  const authFetch = useAuthFetch(); // ใช้ฟังก์ชัน fetch ที่มี interceptor
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(
          `${API_BASE}/AccCode/GetAccCode`
        );
        const data = await response.json();
        const hierarchicalData = groupDataByHierarchy(data);
        setGroupedData(hierarchicalData);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเรียก API:", error);
      }
    };

    fetchData();
  }, []);

  const handleGoMenu = () => {
    navigate(URL);
  };

  // กรองหารายการระดับบนสุด (accCode === accMainCode)
  const topLevelItems = Object.values(groupedData)
    .filter((group) => group.header && group.header.accCode === group.header.accMainCode)
    .map((group) => group.header)
    .sort((a, b) => a.accCode.localeCompare(b.accCode)); // เรียงตาม accCode

  return (
    <div>
      <h2 style={{ textAlign: "center" }} onClick={handleGoMenu}>
        Accounts
      </h2>
      {topLevelItems.map((item) => (
        <React.Fragment key={item.accCode}>
          {renderAccordion(item, groupedData)}
        </React.Fragment>
      ))}
    </div>
  );
}