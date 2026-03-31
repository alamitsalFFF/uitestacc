import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import ItemSelectionSO from "./ItemSelectionSO";
import { addDODetailToExistingDO, createDOHeaderAndFirstItem } from "./PartialDOfromSO";

const DOManagementComponent = ({ AccDocNo, onClose }) => {
  console.log("DIManagementComponent AccDocNo:", AccDocNo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (data) => {
    const safeData = data || {};
    const { selectedItems, refNo } = safeData;
   if (!selectedItems || selectedItems.length === 0) { 
   Swal.fire(
    "ข้อผิดพลาด",
    "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการ",
    "error"
   );
   return;
  }

    let createdDONo = null;

    try {
      const firstItem = selectedItems[0];
      console.log("First item selected for DO:", firstItem);
      console.log("AccDocNo for DO:", AccDocNo);
      const firstItemNo = firstItem.AccItemNo;
      const firstQty = firstItem.Qty; 
      console.log("First item selected for DO:", { AccItemNo: firstItemNo, Qty: firstQty,refNo: refNo });
      console.log("AccDocNo for DO:", AccDocNo);
      // createdDONo = await createDOHeaderAndFirstItem(AccDocNo, firstItem);

      // ส่ง ItemNo และ Qty ของรายการแรก
      createdDONo = await createDOHeaderAndFirstItem(
        AccDocNo,
        firstItemNo,
        firstQty ,
        refNo
      );

    if (selectedItems.length > 1) {
      for (let i = 1; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        // ดึง ItemNo และ Qty จาก object
        const itemNo = item.AccItemNo;
        const qty = item.Qty; 

        console.log("Add DO detail: itemNo =", itemNo, "Qty =", qty);
        
        // ส่ง itemNo และ qty ไปด้วย
        await addDODetailToExistingDO(
          AccDocNo,
          createdDONo,
          AccDocNo, // soNo (AccDocNo)
          itemNo,
          qty // <-- ส่ง Qty เข้าไปด้วย
        );
      }
    }

      Swal.fire({
        icon: "success",
        title: `สร้าง Delivery Out: ${createdDONo} สำเร็จ`,
        html: `สร้าง Delivery Out พร้อม ${selectedItems.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          navigate(`/uitestacc/DOList/`);
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถสร้าง Delivery Out บางส่วนได้: ${
          error.message || "โปรดลองอีกครั้ง"
        }`,
        "error"
      );
    }
  };

  return (
    <div>
      <ItemSelectionSO
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        soNo={AccDocNo}
      />
    </div>
  );
};

export default DOManagementComponent;
