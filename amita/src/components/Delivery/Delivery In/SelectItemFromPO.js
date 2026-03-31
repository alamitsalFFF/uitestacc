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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAvailablePOs, getItemsFromSelectedPO } from "./InsertDIFromPO";
import Swal from "sweetalert2";

const SelectItemPO = ({ show, onClose, onSelectItems }) => {
  const [availablePOs, setAvailablePOs] = useState([]); // รายการ PO Numbers ที่มี
  const [selectedPONo, setSelectedPONo] = useState(""); // PO Number ที่ถูกเลือก
  const [itemsFromSelectedPO, setItemsFromSelectedPO] = useState([]); // รายการ Item ของ PO ที่เลือก
  const [selectedItemNos, setSelectedItemNos] = useState([]); // ItemNo ที่เลือก
  const [loading, setLoading] = useState(false);
  const [showItemSelection, setShowItemSelection] = useState(false); // ควบคุมการแสดงผล Modal เลือก Item
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (show && !showItemSelection) {
      // โหลดรายการ POs ที่สามารถเลือกได้เมื่อ Modal เปิดและยังไม่ได้เลือก PO
      const fetchAvailablePOs = async () => {
        setLoading(true);
        const data = await getAvailablePOs();
        // setAvailablePOs(data);
        // --- START OF MODIFICATION ---
        // Sort the PO numbers from latest to oldest
        const sortedData = [...data].sort((a, b) => {
          // Assuming PO numbers are strings that can be compared directly
          // for chronological order (e.g., "POYYYYMMDDXXX")
          // If PO numbers are actual dates or have different formats,
          // you might need a more complex parsing logic here.
          return b.localeCompare(a); // For descending order (latest to oldest)
        });
        setAvailablePOs(sortedData);
        // --- END OF MODIFICATION ---
        setLoading(false);
      };
      fetchAvailablePOs();
    } else if (!show) {
      // รีเซ็ตสถานะเมื่อ Modal ปิด
      setAvailablePOs([]);
      setSelectedPONo("");
      setItemsFromSelectedPO([]);
      setSelectedItemNos([]);
      setShowItemSelection(false);
      setSelectAll(false);
    }
  }, [show, showItemSelection]); // เพิ่ม showItemSelection ใน dependency array

  // ให้ตรวจสอบว่าควรจะตั้งค่า selectAll เป็น true หรือไม่
  useEffect(() => {
    if (itemsFromSelectedPO.length > 0) {
      const allItemsAreSelected = itemsFromSelectedPO.every((item) =>
        selectedItemNos.includes(item.AccItemNo)
      );
      setSelectAll(allItemsAreSelected);
    } else {
      setSelectAll(false);
    }
  }, [itemsFromSelectedPO, selectedItemNos]);

  // เมื่อผู้ใช้เลือก PO Number
  const handlePOSelection = async (poNo) => {
    setSelectedPONo(poNo);
    setLoading(true);
    const data = await getItemsFromSelectedPO(poNo);
    setItemsFromSelectedPO(data);
    setLoading(false);
    setShowItemSelection(true); // แสดงหน้าเลือก Item หลังจากเลือก PO
    setSelectedItemNos([]); // เคลียร์รายการที่เลือกไว้ก่อนหน้าเมื่อเปลี่ยน PO
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
      const allItemNos = itemsFromSelectedPO.map((item) => item.AccItemNo);
      setSelectedItemNos(allItemNos);
    }
    setSelectAll(!selectAll); // สลับสถานะของ selectAll
  };

  // Added import

  const handleConfirmSelection = async () => {
    // ส่งทั้ง poNo ที่เลือกและรายการ itemNo ที่เลือกกลับไป

    const currentDate = new Date().toISOString().split('T')[0];
    const { value: formValues } = await Swal.fire({
      title: "Verify DI Created Data", // Or "Choose Items"
      html:
        '<div style="text-align: left;">' +
        '<label for="swal-input1" style="display: block; margin-bottom: 5px;">Reference No:</label>' +
        `<input id="swal-input1" class="swal2-input" placeholder="(Ref. No.) ${selectedPONo}" style="margin-bottom: 15px;">` +
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

    onSelectItems(selectedPONo, selectedItemNos, formValues.refno, formValues.duedate);
    onClose(); // ปิด Modal ทั้งหมด
  };

  const handleBackToPOSelection = () => {
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
            <h4>Choose PO Document</h4>
            {loading ? (
              <p>กำลังโหลดรายการ PO...</p>
            ) : (
              <div className="item-list">
                {availablePOs.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบเอกสาร PO ที่ยังสามารถใช้ได้
                  </div>
                ) : (
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {availablePOs.map((poNo, index) => (
                      <div key={index}>

                        <ListItem style={{ display: "flex", alignItems: "center" }} onClick={() => handlePOSelection(poNo)}>
                          <div >
                            <h6>
                              &nbsp; &nbsp;
                              {poNo}
                            </h6>
                          </div>
                          <div style={{ marginLeft: "auto" }}>
                            <div style={{ display: "flex" }}>
                              &nbsp; &nbsp;
                              {/* <i style={{color:"blue"}}>Select Items</i>&nbsp;  */}
                              <FontAwesomeIcon
                                icon={faChevronRight}
                                size="1x"
                                style={{
                                  color: "#0310ce"
                                  , paddingTop: "5px"
                                }}
                                onClick={() => handlePOSelection(poNo)}
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
            <h2>Choose Items from PO: {selectedPONo}</h2>
            {loading ? (
              <p>กำลังโหลดรายการสินค้า...</p>
            ) : (
              <div className="item-list">
                {itemsFromSelectedPO.length === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    ไม่พบรายการสำหรับ PO นี้ หรือรายการถูกใช้หมดแล้ว
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
                      All PO Items (Total: {itemsFromSelectedPO.length})
                    </label>
                    <hr
                      style={{
                        borderTop: "1px solid #eee",
                        marginBottom: "15px",
                      }}
                    />
                    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                      {itemsFromSelectedPO.map((item) => (
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
              <button onClick={handleBackToPOSelection}>Back</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectItemPO;
