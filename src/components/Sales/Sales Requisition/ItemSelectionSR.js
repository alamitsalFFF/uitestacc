// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import { getSRItems } from "../../Sales/Sales Requisition/api";
import "./ItemSelectionSR.css"; // สร้างไฟล์ CSS สำหรับ Modal
import { ListItemText } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox, FormGroup } from "@mui/material";
import ListItem from "@mui/material/ListItem";

const ItemSelectionSR = ({ show, onClose, onSelectItems, srNo }) => {
  const [items, setItems] = useState([]);
  const [selectedItemNos, setSelectedItemNos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && srNo) {
      const fetchItems = async () => {
        setLoading(true);
        console.log("srNo ที่ส่งไป getSRItems:", srNo);
        const data = await getSRItems(srNo);
        console.log("API result SR:", data);
        setItems(data);
        setLoading(false);
      };
      fetchItems();
    } else {
      setItems([]);
      setSelectedItemNos([]);
    }
  }, [show, srNo]);

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
        <h2>เลือกรายการสินค้า (Partial Selection)</h2>
        {loading ? (
          <p>กำลังโหลดรายการสินค้า...</p>
        ) : (
         <div className="item-list">
            {items.length === 0 ? (
              <div style={{ color: "red", textAlign: "center" }}>
                ไม่พบรายการสินค้าสำหรับ SR นี้
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
                            {item.AccItemNo}.{item.SalesDescription} &nbsp; <i>Qty: {item.Qty}</i> {/*Qty: {item.Qty}/Balance: {item.Balance}*/}
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
            SO Created
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionSR;
