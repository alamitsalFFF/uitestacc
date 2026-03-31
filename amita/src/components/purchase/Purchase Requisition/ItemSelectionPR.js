// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import { getSRItems } from "../../Sales/Sales Requisition/api";
import { getPRItems } from "./apiPOFromPR";
import "../../Sales/Sales Requisition/ItemSelectionSR.css"; // สร้างไฟล์ CSS สำหรับ Modal
import { ListItemText } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox, FormGroup } from "@mui/material";
import ListItem from "@mui/material/ListItem";

const ItemSelectionPR = ({ show, onClose, onSelectItems, prNo }) => {
  const [items, setItems] = useState([]);
  const [selectedItemNos, setSelectedItemNos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && prNo) {
      const fetchItems = async () => {
        setLoading(true);
        console.log("prNo ที่ส่งไป getPRItems:", prNo);
        const data = await getPRItems(prNo);
        console.log("API result:", data);
        setItems(data);
        setLoading(false);
      };
      fetchItems();
    } else {
      setItems([]);
      setSelectedItemNos([]);
    }
  }, [show, prNo]);

  const handleCheckboxChange = (itemNo) => {
    setSelectedItemNos((prevSelected) =>
      prevSelected.includes(itemNo)
        ? prevSelected.filter((id) => id !== itemNo)
        : [...prevSelected, itemNo]
    );
  };

  const handleConfirmSelection = () => {
    onSelectItems(selectedItemNos);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>เลือกรายการที่ต้องการ (Partial Selection)</h4>
        {loading ? (
          <p>กำลังโหลดรายการ...</p>
        ) : (
         <div className="item-list">
            {items.length === 0 ? (
              <div style={{ color: "red", textAlign: "center" }}>
                ไม่พบรายการสำหรับ PR นี้
              </div>
            ) : (
              // ตรวจสอบว่ามีรายการที่ Balance ไม่เท่ากับ 0 เหลืออยู่หรือไม่
              items.filter(item => Number(item.Balance) !== 0).length === 0 ? (
                <div style={{ color: "red", textAlign: "center" , padding: "10px" }}>
                  รายการถูกใช้ครบหมดแล้ว!!
                </div>
              ) : (
                <div style={{ textAlign: "left", padding: "10px" }}>
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {items
                      .filter(item => Number(item.Balance) !== 0) // กรองเฉพาะรายการที่ Balance ไม่เป็น 0 เพื่อแสดงผล
                      .map((item) => (
                        <li key={item.AccItemNo} style={{ marginBottom: "8px" }}>
                          <label style={{ display: "flex", alignItems: "center" }}>
                            <input
                              type="checkbox"
                              className="custom-checkbox item-checkbox"
                              checked={selectedItemNos.includes(item.AccItemNo)}
                              onChange={() => handleCheckboxChange(item.AccItemNo)}
                              // style={{
                              //   marginRight: "10px",
                              //   width: "18px",
                              //   height: "18px",
                              //   borderRadius: "50%",
                              //   appearance: "none",
                              //   border: "3px solid #4CAF50", // สีเขียว
                              //   backgroundColor: selectedItemNos.includes(item.AccItemNo) ? "#4CAF50" : "white", // ถ้าเลือกให้เป็นสีเขียว
                              //   transition: "0.2s",
                              //   outline: "none",
                              //   cursor: "pointer",
                              //   position: "relative",
                              // }}
                            />
                            {item.SalesDescription}
                          </label>
                        </li>
                      ))}
                  </ul>
                </div>
              )
            )}
          </div>
        )}
        <div className="modal-actions">
          <button
            onClick={handleConfirmSelection}
            disabled={selectedItemNos.length === 0}
          >
            PO Created
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionPR;
