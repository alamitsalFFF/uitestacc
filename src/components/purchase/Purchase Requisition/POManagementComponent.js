import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import ItemSelectionPR from "./ItemSelectionPR";
import { createPOHeaderAndFirstItem,addPODetailToExistingPO } from "./apiPOFromPR";

const POManagementComponent = ({ AccDocNo, onClose }) => {
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

    let createdPONo = null;

    try {
      const firstItem = selectedItemNos[0];
      createdPONo = await createPOHeaderAndFirstItem(AccDocNo, firstItem);

      if (selectedItemNos.length > 1) {
        for (let i = 1; i < selectedItemNos.length; i++) {
          const itemNo = selectedItemNos[i];
          console.log("Add PO detail: itemNo =", itemNo);
          await addPODetailToExistingPO(
            AccDocNo,
            createdPONo,
            AccDocNo,
            itemNo
          );
        }
      }

      Swal.fire({
        icon: "success",
        title: `สร้าง Purchase Order: ${createdPONo} สำเร็จ`,
        html: `สร้าง Purchase Order พร้อม ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          navigate(`/uitestacc/POList/`);
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถสร้าง Purchase Order บางส่วนได้: ${
          error.message || "โปรดลองอีกครั้ง"
        }`,
        "error"
      );
    }
  };

  return (
    <div>
      <ItemSelectionPR
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        prNo={AccDocNo}
      />
    </div>
  );
};

export default POManagementComponent;
