// src/components/SOManagementComponent.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import ItemSelectionSR from "./ItemSelectionSR"; // นำเข้า ItemSelectionSR
import {
  createSOHeaderAndFirstItem,
  addSODetailToExistingSO,
} from "../Sales Requisition/api"; // นำเข้าฟังก์ชัน API

const SOManagementComponent = ({ AccDocNo, onClose }) => {
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedItemNos) => {
    if (selectedItemNos.length === 0) {
      Swal.fire(
        "ข้อผิดพลาด",
        "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการ",
        "error"
      );
      return;
    }

    let createdSONo = null;

    try {
      const firstItem = selectedItemNos[0];
        console.log("First item selected for SO:", firstItem);
      console.log("AccDocNo for SO:", AccDocNo);
      createdSONo = await createSOHeaderAndFirstItem(AccDocNo, firstItem);

      if (selectedItemNos.length > 1) {
        for (let i = 1; i < selectedItemNos.length; i++) {
          const itemNo = selectedItemNos[i];
          console.log("Add SO detail: itemNo =", itemNo);
          await addSODetailToExistingSO(
            AccDocNo,
            createdSONo,
            AccDocNo,
            itemNo
          );
        }
      }

      Swal.fire({
        icon: "success",
        title: `สร้าง Sales Order: ${createdSONo} สำเร็จ`,
        html: `สร้าง Sales Order พร้อม ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          navigate(`/uitestacc/SOList/`);
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถสร้าง Sales Order บางส่วนได้: ${
          error.message || "โปรดลองอีกครั้ง"
        }`,
        "error"
      );
    }
  };

  return (
    <div>
      {/* <h1>หน้าจอสำหรับสร้าง Sales Order</h1> */}
      {/* <p>เลขที่ SR ที่เลือก: <b>{AccDocNo}</b></p> */}
      {/* แสดงรายการ Item ให้เลือกได้เลย */}
      <ItemSelectionSR
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        srNo={AccDocNo}
      />
    </div>
  );
};

export default SOManagementComponent;
