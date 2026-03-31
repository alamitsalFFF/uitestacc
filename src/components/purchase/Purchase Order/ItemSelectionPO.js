// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import "../../Sales/Sales Requisition/ItemSelectionSR.css"; // สร้างไฟล์ CSS สำหรับ Modal
import { getPOItems } from "./PartialDIfromPO";
import Swal from "sweetalert2";

const ItemSelectionPO = ({ show, onClose, onSelectItems, poNo }) => {
  const [items, setItems] = useState([]);
  const [selectedItemNos, setSelectedItemNos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && poNo) {
      const fetchItems = async () => {
        setLoading(true);
        console.log("poNo ที่ส่งไป getPOItems:", poNo);
        const data = await getPOItems(poNo);
        console.log("API result:", data);
        setItems(data);
        setLoading(false);
      };
      fetchItems();
    } else {
      setItems([]);
      setSelectedItemNos([]);
    }
  }, [show, poNo]);

  const handleCheckboxChange = (itemNo) => {
    setSelectedItemNos((prevSelected) =>
      prevSelected.includes(itemNo)
        ? prevSelected.filter((id) => id !== itemNo)
        : [...prevSelected, itemNo]
    );
  };

  const handleConfirmSelection = async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const { value: formValues } = await Swal.fire({
      title: "Verify DI Created Data",
      html:
        '<div style="text-align: left;">' +
        '<label for="swal-input1" style="display: block; margin-bottom: 5px;">Reference No:</label>' +
        `<input id="swal-input1" class="swal2-input" placeholder="(Ref. No.) ${poNo}" style="margin-bottom: 15px;">` +
        '<label for="swal-input2" style="display: block; margin-bottom: 5px;">Due Date:</label>' +
        `<input id="swal-input2" class="swal2-input" type="date" value="${currentDate}">` +
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const refno = document.getElementById('swal-input1').value;
        const duedate = document.getElementById('swal-input2').value;

        if (!refno) {
          Swal.showValidationMessage('กรุณากรอกเลขที่เอกสารอ้างอิง!');
          return false;
        }
        if (!duedate) {
          Swal.showValidationMessage('กรุณาเลือกวันที่ครบกำหนด (Due Date)!');
          return false;
        }
        return { refno, duedate };
      }
    });

    if (!formValues) {
      return;
    }

    onSelectItems(selectedItemNos, formValues.refno, formValues.duedate);
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
                ไม่พบรายการสำหรับ Created DI
              </div>
            ) : (
              // ตรวจสอบว่ามีรายการที่ Balance ไม่เท่ากับ 0 เหลืออยู่หรือไม่
              items.filter(item => Number(item.Balance) !== 0).length === 0 ? (
                <div style={{ color: "red", textAlign: "center", padding: "10px" }}>
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
                            />
                            {item.AccItemNo}.{item.SalesDescription}
                            <br />Amount: {item.Amount} {item.Currency} | Qty/Balance: {item.Balance} {/* เพื่อเลือกแบบQty*/}
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
            DI Created
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionPO;
