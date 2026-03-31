import React, { useEffect, useState } from "react";
import axios from "../Auth/axiosConfig";
import { API_BASE } from "../api/url";

// เพิ่ม onStatusSelect ใน props
const DocStatusPoint = ({ accConfigCode, onStatusSelect,selectedKey }) => { 
  const [accConfig, setAccConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  //  mapping สีตาม configKey
  const colorMap = {
    "0": "yellow",
    "1": "blue",
    "2": "green",
    "3": "pink",
    "98": "orange",
    "99": "red",
  };

  useEffect(() => {
    if (!accConfigCode) return;

    const fetchAccConfig = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/AccConfig/GetAccConfig?configcode=${accConfigCode}_status`
        );

        if (response.status === 200 && response.data.length > 0) {
          setAccConfig(response.data);
        } else {
          console.error("No accConfig data found");
        }
      } catch (error) {
        console.error("Error fetching accConfig:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccConfig();
  }, [accConfigCode]);

  if (loading) return <div>Loading...</div>;if (loading) return <div>Loading...</div>;

  const handleClick = (key) => {
    //  ตรวจสอบว่าเป็นฟังก์ชันก่อนเรียก
    if (typeof onStatusSelect === 'function') {
      onStatusSelect(key);
    }
  };
  const allItems = [
    { configKey: null, configValue: "ALL" },
    ...accConfig
  ];
 return (
    <div 
      className={`doc-status-point-container ${allItems.length > 5 ? 'is-long-list' : ''}`}
      style={{ 
        display: "flex", 
        // gap: "5px", 
        alignItems: "center",
        // flexWrap: "nowrap", 
        justifyContent: "flex-end",
    }}
  >
   {/* วนลูปแสดงรายการ ALL และสถานะทั้งหมด */}
      {allItems.map((item, index) => {
        // ใช้ item.configKey และ item.configValue แทนการแยก ALL ออกมา
        const key = item.configKey;
        const value = item.configValue;
        const color = colorMap[key] || "gray"; 
        const isSelected = String(key) === selectedKey;

        return (
          <div 
            key={key === null ? 'all' : key} // ใช้ key ที่ไม่ซ้ำกัน
            className="status-item" // เพิ่ม class สำหรับ CSS
            onClick={() => handleClick(key)} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              padding: "3px 8px", // เพิ่ม padding ให้คลิกง่าย
              marginRight: index !== allItems.length - 1 ? "5px" : "0", // ใช้ margin แทน gap ในกรณีที่จำเป็น
              borderRadius: "12px",
              backgroundColor: isSelected ? "#e0e0e0" : "transparent", // เน้นรายการที่เลือก
              opacity: isSelected ? 1 : 0.8, 
              fontWeight: isSelected ? 'bold' : 'normal',
              whiteSpace: 'nowrap', // ป้องกันข้อความยาวเกินไป
              // 💡 กำหนดความกว้างบนจอเล็กใน CSS แทน
            }}
          >
            {/* แสดงจุดสีสำหรับรายการที่ไม่ใช่ "ALL" */}
            {key !== null && (
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginRight: "6px",
                }}
              />
            )}
            <span>{value}</span>
          </div>
        );
      })}
  </div>
 );
};

export default DocStatusPoint;