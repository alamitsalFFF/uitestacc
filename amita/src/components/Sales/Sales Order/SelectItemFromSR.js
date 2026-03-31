import React, { useState, useEffect } from "react";
import "../../Sales/Sales Requisition/ItemSelectionSR.css"; 
import { ListItemText } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox, FormGroup } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAvailableSRs, getItemsFromSelectedSR } from "./InsertSOFromSR";

const SelectItemSR = ({ show, onClose, onSelectItems }) => {
  const [availableSRs, setAvailableSRs] = useState([]); // รายการ SR Numbers ที่มี
  const [selectedSRNo, setSelectedSRNo] = useState(""); // SR Number ที่ถูกเลือก
  const [itemsFromSelectedSR, setItemsFromSelectedSR] = useState([]); // รายการ Item ของ SR ที่เลือก
  const [selectedItemNos, setSelectedItemNos] = useState([]); // ItemNo ที่เลือก
  const [loading, setLoading] = useState(false);
  const [showItemSelection, setShowItemSelection] = useState(false); // ควบคุมการแสดงผล Modal เลือก Item
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (show && !showItemSelection) {
      // โหลดรายการ SRs ที่สามารถเลือกได้เมื่อ Modal เปิดและยังไม่ได้เลือก SR
      const fetchAvailableSRs = async () => {
        setLoading(true);
        const data = await getAvailableSRs();
            // --- START OF MODIFICATION ---
        // Sort the SR numbers from latest to oldest
        const sortedData = [...data].sort((a, b) => {
          // Assuming SR numbers are strings that can be compared directly
          // for chronological order (e.g., "SRYYYYMMDDXXX")
          // If SR numbers are actual dates or have different formats,
          // you might need a more complex parsing logic here.
          return b.localeCompare(a); // For descending order (latest to oldest)
        });
        setAvailableSRs(sortedData);
        // --- END OF MODIFICATION ---
        setLoading(false);
      };
      fetchAvailableSRs();
    } else if (!show) {
      // รีเซ็ตสถานะเมื่อ Modal ปิด
      setAvailableSRs([]);
      setSelectedSRNo("");
      setItemsFromSelectedSR([]);
      setSelectedItemNos([]);
      setShowItemSelection(false);
      setSelectAll(false);
    }
  }, [show, showItemSelection]); // เพิ่ม showItemSelection ใน dependency array

  // ให้ตรวจสอบว่าควรจะตั้งค่า selectAll เป็น true หรือไม่
  useEffect(() => {
    if (itemsFromSelectedSR.length > 0) {
      const allItemsAreSelected = itemsFromSelectedSR.every((item) =>
        selectedItemNos.includes(item.AccItemNo)
      );
      setSelectAll(allItemsAreSelected);
    } else {
      setSelectAll(false);
    }
  }, [itemsFromSelectedSR, selectedItemNos]);

  // เมื่อผู้ใช้เลือก SR Number
  const handleSRSelection = async (srNo) => {
    setSelectedSRNo(srNo);
    setLoading(true);
    const data = await getItemsFromSelectedSR(srNo);
    setItemsFromSelectedSR(data);
    setLoading(false);
    setShowItemSelection(true); // แสดงหน้าเลือก Item หลังจากเลือก SR
    setSelectedItemNos([]); // เคลียร์รายการที่เลือกไว้ก่อนหน้าเมื่อเปลี่ยน SR
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
      const allItemNos = itemsFromSelectedSR.map((item) => item.AccItemNo);
      setSelectedItemNos(allItemNos);
    }
    setSelectAll(!selectAll); // สลับสถานะของ selectAll
  };

  const handleConfirmSelection = () => {
    // ส่งทั้ง srNo ที่เลือกและรายการ itemNo ที่เลือกกลับไป
    onSelectItems(selectedSRNo, selectedItemNos);
    onClose(); // ปิด Modal ทั้งหมด
  };

  const handleBackToSRSelection = () => {
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
            <h4>Choose SR Document</h4>
            {loading ? (
              <p>กำลังโหลดรายการ SR...</p>
            ) : (
              <div className="item-list">
                {availableSRs.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบเอกสาร SR ที่ยังสามารถใช้ได้
                  </div>
                ) : (
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {availableSRs.map((srNo, index) => (
                      <div key={index}>
                         
                          <ListItem style={{ display: "flex", alignItems: "center" }}  onClick={() => handleSRSelection(srNo)}>
                            <div >
                              <h6>
                                &nbsp; &nbsp;
                                {srNo}
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
                                  onClick={() => handleSRSelection(srNo)}
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
            <h2>Choose Items from SR: {selectedSRNo}</h2>
            {loading ? (
              <p>กำลังโหลดรายการสินค้า...</p>
            ) : (
              <div className="item-list">
                {itemsFromSelectedSR.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบรายการสำหรับ SR นี้ หรือรายการถูกใช้หมดแล้ว
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
                      All SR Items (Total: {itemsFromSelectedSR.length})
                    </label>
                    <hr
                      style={{
                        borderTop: "1px solid #eee",
                        marginBottom: "15px",
                      }}
                    />
                    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                      {itemsFromSelectedSR.map((item) => (
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
              <button onClick={handleBackToSRSelection}>Back</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectItemSR;