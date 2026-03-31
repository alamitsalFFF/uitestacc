// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import "../../Sales/Sales Requisition/ItemSelectionSR.css"; // สร้างไฟล์ CSS สำหรับ Modal
import { getSOItems } from "./PartialDOfromSO";

const ItemSelectionSO = ({ show, onClose, onSelectItems, soNo }) => {
  const [items, setItems] = useState([]);
  // const [selectedItemNos, setSelectedItemNos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState(soNo || ""); // กำหนดค่าเริ่มต้นเป็น soNo

  useEffect(() => {
    if (show && soNo) {
      const fetchItems = async () => {
        setLoading(true);
        console.log("soNo ที่ส่งไป getSOItems:", soNo);
        const data = await getSOItems(soNo);
        console.log("API result:", data);
        setItems(data);
        setLoading(false);
      };
      fetchItems();
    } else {
      setItems([]);
      setSelectedItems([]);
    }
  }, [show, soNo]);

  const handleCheckboxChange = (item) => {
    // 1. ดึงค่า AccItemNo และ Balance (Qty) ออกมา
    const { AccItemNo, Balance } = item;

    // 2. ***เพิ่มโค้ดป้องกัน Balance เป็น null/empty***
    // ถ้า Balance มีค่า (ไม่เป็น null, undefined, หรือ 0) ให้แปลงเป็น Number
    // ถ้าไม่มีค่า ให้ตั้งเป็น 0
    const defaultQty = Balance ? Number(Balance) : 0;

    const isSelected = selectedItems.some(
      (selected) => selected.AccItemNo === AccItemNo
    );
    const qtyForLog = isSelected ? 0 : defaultQty;
    console.log(
      `Checkbox changed for ItemNo: ${AccItemNo}, isSelected: ${isSelected}, Qty: ${qtyForLog}`
    );

    setSelectedItems((prevSelected) =>
      isSelected
        ? prevSelected.filter((selected) => selected.AccItemNo !== AccItemNo)
        : // เมื่อเลือก (Select) ให้เพิ่ม item พร้อม Qty เริ่มต้นเท่ากับ Balance
          [...prevSelected, { AccItemNo, Qty: defaultQty }]
    );
  };

  const handleQtyInputChange = (item, event) => {
    const maxQty = Number(item.Balance);
    // แปลงค่าที่กรอกเป็นตัวเลข
    let newQty = Number(event.target.value);

    // 1. ควบคุมค่าต่ำสุด (ไม่ติดลบ) และค่าที่ว่างเปล่า
    if (newQty < 0 || isNaN(newQty) || event.target.value === "") {
      newQty = 0;
    }

    // 2. ควบคุมค่าสูงสุด (ไม่เกิน Balance)
    if (newQty > maxQty) {
      newQty = maxQty; // ตั้งค่าเป็นค่าสูงสุด
    }

    // อัปเดต selectedItems ด้วยค่า Qty ใหม่
    setSelectedItems((prevSelected) => {
      return prevSelected.map((selected) => {
        if (selected.AccItemNo === item.AccItemNo) {
          // อัปเดต Qty ด้วยค่าที่ผ่านการตรวจสอบแล้ว
          return { ...selected, Qty: newQty };
        }
        return selected;
      });
    });
  };

const handleRefNoChange = (event) => {
    setRefNo(event.target.value);
  };

  const handleConfirmSelection = () => {
    const dataToSend = { 
        selectedItems: selectedItems || [], // ถ้า selectedItems เป็น null ให้เป็น array ว่าง
        refNo: refNo || '', // ถ้า refNo เป็น null ให้เป็น string ว่าง
    };
    onSelectItems(dataToSend);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>เลือกรายการที่ต้องการ (Partial Selection)</h4>
        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <label htmlFor="refNoInput" style={{ fontWeight: 'bold', marginRight: '10px' }}>เลขที่อ้างอิง (Ref. No.):</label>
          <input
            id="refNoInput"
            type="text"
            value={refNo}
            onChange={handleRefNoChange}
            placeholder="กรอกเลขที่อ้างอิง"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #aaa', width: '200px' }}
          />
        </div>
        {loading ? (
          <p>กำลังโหลดรายการ...</p>
        ) : (
          <div className="item-list">
            {items.length === 0 ? (
              <div style={{ color: "red", textAlign: "center" }}>
                ไม่พบรายการสำหรับ Created DO
              </div>
            ) : // ตรวจสอบว่ามีรายการที่ Balance ไม่เท่ากับ 0 เหลืออยู่หรือไม่
            items.filter((item) => Number(item.Balance) !== 0).length === 0 ? (
              <div
                style={{ color: "red", textAlign: "center", padding: "10px" }}
              >
                รายการถูกใช้ครบหมดแล้ว!!
              </div>
            ) : (
              <div style={{ textAlign: "left", padding: "10px" }}>
                <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                  {items
                    .filter((item) => Number(item.Balance) !== 0) // กรองเฉพาะรายการที่ Balance ไม่เป็น 0 เพื่อแสดงผล
                    .map((item) => (
                      <li key={item.AccItemNo} style={{ marginBottom: "8px" }}>
                        <label
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            className="custom-checkbox item-checkbox"
                            // ตรวจสอบว่า AccItemNo อยู่ใน selectedItems หรือไม่
                            checked={selectedItems.some(
                              (selected) =>
                                selected.AccItemNo === item.AccItemNo
                            )}
                            // ส่ง 'item' Object ทั้งหมด
                            onChange={() => handleCheckboxChange(item)}
                          />
                          {item.AccItemNo}.{item.SalesDescription}
                          <br />
                          Amount: {item.Amount} {item.Currency} | Balance:{" "}
                          {item.Balance}
                        </label>

                        {/* ✅ แสดงช่อง Input เมื่อรายการนี้ถูกเลือก (Checked) เท่านั้น */}
                        {selectedItems.some(
                          (selected) => selected.AccItemNo === item.AccItemNo
                        ) && (
                          <div
                            style={{
                              marginLeft: "20px",
                              display: "flex",
                              alignItems: "center",
                              marginTop: "5px",
                            }}
                          >
                            <span
                              style={{
                                marginRight: "10px",
                                fontWeight: "bold",
                              }}
                            >
                              จำนวน DO:
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={Number(item.Balance)} // ใช้ max เพื่อจำกัดการกรอกใน HTML
                              // ดึงค่า Qty จาก selectedItems มาแสดงผล
                              value={
                                selectedItems.find(
                                  (selected) =>
                                    selected.AccItemNo === item.AccItemNo
                                )?.Qty || Number(item.Balance)
                              }
                              onChange={(e) => handleQtyInputChange(item, e)}
                              style={{
                                width: "80px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                              }}
                            />
                            {/* <span style={{ marginLeft: "5px" }}>
                              / {item.Balance}
                            </span> */}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="modal-actions">
          <button
            onClick={handleConfirmSelection}
            disabled={selectedItems.length === 0}
          >
            DO Created
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionSO;
