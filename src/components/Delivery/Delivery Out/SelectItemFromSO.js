// components/ItemSelectionSR.jsx
import React, { useState, useEffect } from "react";
import { getItemsPR } from "../../purchase/Purchase Order/InsertPOFromPR";
import { getItemsFromSelectedPR, getAvailablePRs } from "../../purchase/Purchase Order/InsertPOFromPR";
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
import { getAvailableSOs, getItemsFromSelectedSO } from "./InsertDOFromSO";

const SelectItemSO = ({ show, onClose, onSelectItems }) => {
  const [availableSOs, setAvailableSOs] = useState([]); // รายการ SO Numbers ที่มี
  const [selectedSONo, setSelectedSONo] = useState(""); // SO Number ที่ถูกเลือก
  const [itemsFromSelectedSO, setItemsFromSelectedSO] = useState([]); // รายการ Item ของ SO ที่เลือก
  const [selectedItemNos, setSelectedItemNos] = useState([]); // ItemNo ที่เลือก
  const [loading, setLoading] = useState(false);
  const [showItemSelection, setShowItemSelection] = useState(false); // ควบคุมการแสดงผล Modal เลือก Item
  const [selectAll, setSelectAll] = useState(false);
  // const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (show && !showItemSelection) {
      // โหลดรายการ SOs ที่สามารถเลือกได้เมื่อ Modal เปิดและยังไม่ได้เลือก SO
      const fetchAvailableSOs = async () => {
        setLoading(true);
        const data = await getAvailableSOs();
        const sortedData = [...data].sort((a, b) => {                             
          return b.localeCompare(a); 
        });
        setAvailableSOs(sortedData);
        // --- END OF MODIFICATION ---
        setLoading(false);
      };
      fetchAvailableSOs();
    } else if (!show) {
      // รีเซ็ตสถานะเมื่อ Modal ปิด
      setAvailableSOs([]);
      setSelectedSONo("");
      setItemsFromSelectedSO([]);
      setSelectedItemNos([]);
      setShowItemSelection(false);
      setSelectAll(false);
    }
  }, [show, showItemSelection]); // เพิ่ม showItemSelection ใน dependency array

  // ให้ตรวจสอบว่าควรจะตั้งค่า selectAll เป็น true หรือไม่
  // useEffect(() => {
  //   if (itemsFromSelectedSO.length > 0) {
  //     const allItemsAreSelected = itemsFromSelectedSO.every((item) =>
  //       selectedItemNos.includes(item.AccItemNo)
  //     );
  //     setSelectAll(allItemsAreSelected);
  //   } else {
  //     setSelectAll(false);
  //   }
  // }, [itemsFromSelectedSO, selectedItemNos]);
  // ใน SelectItemSO
useEffect(() => {
  if (itemsFromSelectedSO.length > 0) {
    // ต้องตรวจสอบว่า AccItemNo ของทุกรายการใน itemsFromSelectedSO อยู่ใน selectedItems หรือไม่
    const allItemsAreSelected = itemsFromSelectedSO.every((item) =>
      selectedItemNos.some((sItem) => sItem.AccItemNo === item.AccItemNo)
    );
    setSelectAll(allItemsAreSelected);
  } else {
    setSelectAll(false);
  }
}, [itemsFromSelectedSO, selectedItemNos]); // เปลี่ยน dependency เป็น selectedItems

  // เมื่อผู้ใช้เลือก sO Number
  const handleSOSelection = async (soNo) => {
    setSelectedSONo(soNo);
    setLoading(true);
    const data = await getItemsFromSelectedSO(soNo);
    setItemsFromSelectedSO(data);
    setLoading(false);
    setShowItemSelection(true); // แสดงหน้าเลือก Item หลังจากเลือก SO
    setSelectedItemNos([]); // เคลียร์รายการที่เลือกไว้ก่อนหน้าเมื่อเปลี่ยน SO
    setSelectAll(false); // รีเซ็ต Select All ด้วย
  };

  // const handleCheckboxChange = (itemNo) => {
  //   setSelectedItemNos((prevSelected) =>
  //     prevSelected.includes(itemNo)
  //       ? prevSelected.filter((id) => id !== itemNo)
  //       : [...prevSelected, itemNo]
  //   );
  // };
  // เปลี่ยนจากรับ itemNo เป็นรับ object item
  const handleCheckboxChange = (item) => {
    // ตรวจสอบว่า item นี้ถูกเลือกอยู่แล้วหรือไม่ โดยดูจาก AccItemNo
    const isSelected = selectedItemNos.some(
      (sItem) => sItem.AccItemNo === item.AccItemNo
    );

    setSelectedItemNos((prevSelected) => {
      if (isSelected) {
        // ถ้าถูกเลือกอยู่แล้ว ให้นำออกจากรายการ
        return prevSelected.filter((sItem) => sItem.AccItemNo !== item.AccItemNo);
      } else {
        // ถ้ายังไม่ถูกเลือก ให้เพิ่มเข้าในรายการ (เพิ่ม object { AccItemNo, Balance })
        // **หมายเหตุ: Balance คือ Qty ที่เหลือจาก SO ที่เราจะใช้เป็น Qty ใน DO**
        return [...prevSelected, { AccItemNo: item.AccItemNo, Qty: item.Balance }];
      }
    });
  };

  // ฟังก์ชันสำหรับจัดการ 'เลือกทั้งหมด'
  // const handleSelectAllChange = () => {
  //   if (selectAll) {
  //     // ถ้าเดิมเลือกทั้งหมดอยู่แล้ว ให้ยกเลิกการเลือกทั้งหมด
  //     setSelectedItemNos([]);
  //   } else {
  //     // ถ้ายังไม่ได้เลือกทั้งหมด ให้เลือกทุกรายการที่มีอยู่
  //     const allItemNos = itemsFromSelectedSO.map((item) => item.AccItemNo);
  //     setSelectedItemNos(allItemNos);
  //   }
  //   setSelectAll(!selectAll); // สลับสถานะของ selectAll
  // };
  // ใน SelectItemSO
  const handleSelectAllChange = () => {
    if (selectAll) {
      // ถ้าเดิมเลือกทั้งหมดอยู่แล้ว ให้ยกเลิกการเลือกทั้งหมด
      setSelectedItemNos([]);
    } else {
      // ถ้ายังไม่ได้เลือกทั้งหมด ให้เลือกทุกรายการที่มีอยู่
      // สร้าง array ของ object { AccItemNo, Qty: Balance }
      const allItems = itemsFromSelectedSO.map((item) => ({
        AccItemNo: item.AccItemNo,
        Qty: item.Balance, // ใช้ Balance เป็น Qty ที่จะส่ง
      }));
      setSelectedItemNos(allItems);
    }
    setSelectAll(!selectAll); // สลับสถานะของ selectAll
  };

  const handleConfirmSelection = () => {
    // ส่งทั้ง soNo ที่เลือกและรายการ itemNo ที่เลือกกลับไป
    onSelectItems(selectedSONo, selectedItemNos);
    onClose(); // ปิด Modal ทั้งหมด
  };

  const handleBackToSOSelection = () => {
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
            <h4>Choose SO Document</h4>
            {loading ? (
              <p>กำลังโหลดรายการ SO...</p>
            ) : (
              <div className="item-list">
                {availableSOs.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบเอกสาร SO ที่ยังสามารถใช้ได้
                  </div>
                ) : (
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {availableSOs.map((soNo, index) => (
                      <div key={index}>
                         
                          <ListItem style={{ display: "flex", alignItems: "center" }}  onClick={() => handleSOSelection(soNo)}>
                            <div >
                              <h6>
                                &nbsp; &nbsp;
                                {soNo}
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
                                  onClick={() => handleSOSelection(soNo)}
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
            <h2>Choose Items from SO: {selectedSONo}</h2>
            {loading ? (
              <p>กำลังโหลดรายการสินค้า...</p>
            ) : (
              <div className="item-list">
                {itemsFromSelectedSO.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบรายการสำหรับ SO นี้ หรือรายการถูกใช้หมดแล้ว
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
                      All SO Items (Total: {itemsFromSelectedSO.length})
                    </label>
                    <hr
                      style={{
                        borderTop: "1px solid #eee",
                        marginBottom: "15px",
                      }}
                    />
                    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                      {itemsFromSelectedSO.map((item) => (
                        // <li key={item.AccItemNo} style={{ marginBottom: "8px" }}>
                        //   <label
                        //     style={{ display: "flex", alignItems: "center" }}
                        //   >
                        //     <input
                        //       type="checkbox"
                        //       className="custom-checkbox item-checkbox" // ใช้ class ใหม่
                        //       checked={selectedItemNos.includes(item.AccItemNo)}
                        //       onChange={() =>
                        //         handleCheckboxChange(item.AccItemNo)
                        //       }
                        //     />
                        //     {item.AccItemNo}.{item.SalesDescription} (Balance: {item.Balance})
                        //   </label>
                        // </li>
                        <li key={item.AccItemNo} style={{ marginBottom: "8px" }}>
                          <label style={{ display: "flex", alignItems: "center" }}>
                            <input type="checkbox"
                            className="custom-checkbox item-checkbox" // ใช้ class ใหม่
                            // ตรวจสอบว่า AccItemNo ของรายการนี้อยู่ใน selectedItems หรือไม่
                            checked={selectedItemNos.some(sItem => sItem.AccItemNo === item.AccItemNo)}
                            onChange={() =>
                              handleCheckboxChange(item) // *** ส่ง object item เข้าไป
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
              <button onClick={handleBackToSOSelection}>Back</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectItemSO;
