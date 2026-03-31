// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import { getItemsPR } from "./InsertPOFromPR";
import { getItemsFromSelectedPR, getAvailablePRs } from "./InsertPOFromPR";
import "../../Sales/Sales Requisition/ItemSelectionSR.css"; // สร้างไฟล์ CSS สำหรับ Modal
import { ListItemText } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox, FormGroup } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
// import "../../components/purchase/Purchase Order/ItemSelectionPO.css";
// import "./ItemSelectionSR.css";

const SelectItemPR = ({ show, onClose, onSelectItems }) => {
  const [availablePRs, setAvailablePRs] = useState([]); // รายการ PR Numbers ที่มี
  const [selectedPRNo, setSelectedPRNo] = useState(""); // PR Number ที่ถูกเลือก
  const [itemsFromSelectedPR, setItemsFromSelectedPR] = useState([]); // รายการ Item ของ PR ที่เลือก
  const [selectedItemNos, setSelectedItemNos] = useState([]); // ItemNo ที่เลือก
  const [loading, setLoading] = useState(false);
  const [showItemSelection, setShowItemSelection] = useState(false); // ควบคุมการแสดงผล Modal เลือก Item
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (show && !showItemSelection) {
      // โหลดรายการ PRs ที่สามารถเลือกได้เมื่อ Modal เปิดและยังไม่ได้เลือก PR
      const fetchAvailablePRs = async () => {
        setLoading(true);
        const data = await getAvailablePRs();
        // setAvailablePRs(data);
            // --- START OF MODIFICATION ---
        // Sort the PR numbers from latest to oldest
        const sortedData = [...data].sort((a, b) => {
          // Assuming PR numbers are strings that can be compared directly
          // for chronological order (e.g., "PRYYYYMMDDXXX")
          // If PR numbers are actual dates or have different formats,
          // you might need a more complex parsing logic here.
          return b.localeCompare(a); // For descending order (latest to oldest)
        });
        setAvailablePRs(sortedData);
        // --- END OF MODIFICATION ---
        setLoading(false);
      };
      fetchAvailablePRs();
    } else if (!show) {
      // รีเซ็ตสถานะเมื่อ Modal ปิด
      setAvailablePRs([]);
      setSelectedPRNo("");
      setItemsFromSelectedPR([]);
      setSelectedItemNos([]);
      setShowItemSelection(false);
      setSelectAll(false);
    }
  }, [show, showItemSelection]); // เพิ่ม showItemSelection ใน dependency array

  // ให้ตรวจสอบว่าควรจะตั้งค่า selectAll เป็น true หรือไม่
  useEffect(() => {
    if (itemsFromSelectedPR.length > 0) {
      const allItemsAreSelected = itemsFromSelectedPR.every((item) =>
        selectedItemNos.includes(item.AccItemNo)
      );
      setSelectAll(allItemsAreSelected);
    } else {
      setSelectAll(false);
    }
  }, [itemsFromSelectedPR, selectedItemNos]);

  // เมื่อผู้ใช้เลือก PR Number
  const handlePRSelection = async (prNo) => {
    setSelectedPRNo(prNo);
    setLoading(true);
    const data = await getItemsFromSelectedPR(prNo);
    setItemsFromSelectedPR(data);
    setLoading(false);
    setShowItemSelection(true); // แสดงหน้าเลือก Item หลังจากเลือก PR
    setSelectedItemNos([]); // เคลียร์รายการที่เลือกไว้ก่อนหน้าเมื่อเปลี่ยน PR
    setSelectAll(false); // รีเซ็ต Select All ด้วย
  };

  const handleCheckboxChange = (itemNo) => {
    setSelectedItemNos((prevSelected) =>
      prevSelected.includes(itemNo)
        ? prevSelected.filter((id) => id !== itemNo)
        : [...prevSelected, itemNo]
    );
  };

  // ฟังก์ชันสำหรับจัดการ 'เลือกทั้งหมด'
  const handleSelectAllChange = () => {
    if (selectAll) {
      // ถ้าเดิมเลือกทั้งหมดอยู่แล้ว ให้ยกเลิกการเลือกทั้งหมด
      setSelectedItemNos([]);
    } else {
      // ถ้ายังไม่ได้เลือกทั้งหมด ให้เลือกทุกรายการที่มีอยู่
      const allItemNos = itemsFromSelectedPR.map((item) => item.AccItemNo);
      setSelectedItemNos(allItemNos);
    }
    setSelectAll(!selectAll); // สลับสถานะของ selectAll
  };

  const handleConfirmSelection = () => {
    // ส่งทั้ง prNo ที่เลือกและรายการ itemNo ที่เลือกกลับไป
    onSelectItems(selectedPRNo, selectedItemNos);
    onClose(); // ปิด Modal ทั้งหมด
  };

  const handleBackToPRSelection = () => {
    setShowItemSelection(false);
    setSelectedItemNos([]); // เคลียร์รายการที่เลือกไว้เมื่อย้อนกลับ
  };

  if (!show) {
    return null;
  }

return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!showItemSelection ? (
          <>
            <h4>Choose PR Document</h4>
            {loading ? (
              <p>กำลังโหลดรายการ PR...</p>
            ) : (
              <div className="item-list">
                {availablePRs.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบเอกสาร PR ที่ยังสามารถใช้ได้
                  </div>
                ) : (
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {availablePRs.map((prNo, index) => (
                      <div key={index}>
                         
                          <ListItem style={{ display: "flex", alignItems: "center" }}  onClick={() => handlePRSelection(prNo)}>
                            <div >
                              <h6>
                                &nbsp; &nbsp;
                                {prNo}
                              </h6>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                              <div style={{ display: "flex" }}>
                                &nbsp; &nbsp; 
                                {/* <i style={{color:"blue"}}>Select Items</i>&nbsp;  */}
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  size="1x"
                                  style={{ color: "#0310ce"
                                    , paddingTop: "5px" 
                                  }}
                                  onClick={() => handlePRSelection(prNo)}
                                />
                              </div>
                            </div>
                          </ListItem>
                           <Divider
                            variant="middle"
                            component="li"
                            style={{ listStyle: "none" }}
                          />
                        </div>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h2>Choose Items from PR: {selectedPRNo}</h2>
            {loading ? (
              <p>กำลังโหลดรายการสินค้า...</p>
            ) : (
              <div className="item-list">
                {itemsFromSelectedPR.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบรายการสำหรับ PR นี้ หรือรายการถูกใช้หมดแล้ว
                  </div>
                ) : (
                  <div style={{ textAlign: "left", padding: "10px" }}>
                    {/* Checkbox เลือกทั้งหมด */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="custom-checkbox select-all" // ใช้ class ใหม่
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                      All PR Items (Total: {itemsFromSelectedPR.length})
                    </label>
                    <hr
                      style={{
                        borderTop: "1px solid #eee",
                        marginBottom: "15px",
                      }}
                    />
                    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                      {itemsFromSelectedPR.map((item) => (
                        <li key={item.AccItemNo} style={{ marginBottom: "8px" }}>
                          <label
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              className="custom-checkbox item-checkbox" // ใช้ class ใหม่
                              checked={selectedItemNos.includes(item.AccItemNo)}
                              onChange={() =>
                                handleCheckboxChange(item.AccItemNo)
                              }
                            />
                            {item.AccItemNo}.{item.SalesDescription} (Balance: {item.Balance})
                          </label>
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
                disabled={selectedItemNos.length === 0}
              >
                Choose Selected Items
              </button>
              <button onClick={handleBackToPRSelection}>Back</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectItemPR;
