import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ยังคงใช้ useSelector บางตัวที่จำเป็น
import axios from "../../Auth/axiosConfig.js";
import { API_VIEW_RESULT } from "../../api/url";
import { ListItem } from "@mui/material";
import { formatNumber } from "../../purchase/formatNumber.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Abbreviation from "../../purchase/Abbreviation.js";
import OCRDraftDIEditDT from "./DraftDIEditDT.js";

function DraftOCRDIDT({ accDocNo, initialOcrDetails, onSaveSuccess }) {
  const location = useLocation("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dih, setDIH] = useState([]); // Header Data (ใช้เพื่อแสดงวันที่/ชื่อ และ DocStatus)
  const [did, setDID] = useState([]); // Detail Data (ใช้เพื่อแสดงรายการสินค้า)
  const [itemCounter, setItemCounter] = useState(1);
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [ocrTotals, setOcrTotals] = useState({
    amount: 0,
    vatAmount: 0,
    grandTotal: 0, // ใน OCR จะใช้ grandTotal
  });
  const { mappedOCR, fromOCRData } = location.state || {};

  // States สำหรับ Modal (อาจจะย้ายไป Parent/Header ถ้าใช้ Save Detail ร่วม)
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddDTModal, setOpenAddDTModal] = useState(false);
  const [showDIManagement, setShowDIManagement] = useState(false);

  const VMasProduct = {
      viewName: "vMas_Product",
      parameters: [],
      results: [
        { sourceField: "productName" },
        { sourceField: "productTypeCode" },
        { sourceField: "productID" },
        { sourceField: "IsMaterial" },
        { sourceField: "IsService" },
        { sourceField: "ProductBrand" },
        { sourceField: "productCode" },
        { sourceField: "ProductColor" },
        { sourceField: "ProductID" },
        { sourceField: "ProductName" },
        { sourceField: "ProductSize" },
        { sourceField: "ProductSizeUnit" },
        { sourceField: "ProductTypeCode" },
        { sourceField: "ProductTypeID" },
        { sourceField: "ProductTypeName" },
        { sourceField: "ProductVolume" },
        { sourceField: "ProductVolumeUnit" },
        { sourceField: "rateVat" },
        { sourceField: "rateWht" },
        { sourceField: "unitStock" },
        { sourceField: "vatType" },
        { sourceField: "WarehouseAddress" },
        { sourceField: "WarehouseCode" },
        { sourceField: "WarehouseID" },
        { sourceField: "WarehouseLocation" },
        { sourceField: "WarehouseName" },
      ],
    };
  const [productMaster, setProductMaster] = useState([]);
  useEffect(() => {
          let isMounted = true;
          (async () => {
            try {
              // setLoading(true); // ไม่แน่ใจว่าคุณมี setLoading ใน Component นี้หรือไม่
              const response = await axios.post(`${API_VIEW_RESULT}`, VMasProduct, { // 💡 ใช้ API_VIEW_RESULT ที่ถูกต้อง
                headers: { "Content-Type": "application/json" },
              });
              if (isMounted && response.status === 200 && Array.isArray(response.data)) {
                  setProductMaster(response.data);
                  console.log("Loaded Master Products:", response.data.length);
              }
            } catch (error) {
               console.error("Error fetching Master Products:", error);
            }
          })();
          return () => { isMounted = false; };
      }, []);

  const fetchDataDIDetails = useCallback(async (docNo) => {
    if (!docNo) return;

    const vDI_H = {
      viewName: "vDI_H",
      parameters: [{ field: "AccDocNo", value: docNo }],
    };
    const vDI_D = {
      viewName: "vDI_D",
      parameters: [{ field: "AccDocNo", value: docNo }],
    };

    try {
      setLoading(true);
      const [responseH, responseD] = await Promise.all([
        axios.post(`${API_VIEW_RESULT}`, vDI_H, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post(`${API_VIEW_RESULT}`, vDI_D, {
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (responseH.status === 200 && responseD.status === 200) {
        setLoading(false);
        const sortedData = responseD.data.sort(
          (a, b) => a.AccItemNo - b.AccItemNo
        );
        setDIH(responseH.data);
        setDID(sortedData);
      } else {
        setLoading(false);
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }, []); // Dependency List ว่างเปล่าเพราะใช้ docNo จาก Argument

const findProductDetails = useCallback((description) => {
    if (!description || !productMaster || productMaster.length === 0) return null;

    const cleanDescription = description.trim().toLowerCase();

    // 💡 NEW LOGIC: ใช้วิธีค้นหาแบบ Includes (Partial Match)
    // ค้นหาสินค้าที่ชื่อ (productName) มีคำบรรยาย (description) อยู่ภายใน
    const matchedProduct = productMaster.find(product => {
        const cleanProductName = product.productName?.trim().toLowerCase();
        return cleanProductName && cleanProductName.includes(cleanDescription);
    });
    
    if (matchedProduct) {
      console.log("SUCCESS: Matched Product for Description:", description, "Code:", matchedProduct.productCode); // 💡 เพิ่ม LOG SUCCESS
        return {
            SaleProductCode: matchedProduct.productCode,
            RateVat: parseFloat(matchedProduct.rateVat) || 0,
            RateWht: parseFloat(matchedProduct.rateWht) || 0,
            VatType: parseInt(matchedProduct.vatType, 10) || 0,
        };
    }
    
    console.log("FAIL: No Match found for Description:", description); // 💡 เพิ่ม LOG FAIL
    return null;
}, [productMaster]);

useEffect(() => {
    // 1. ถ้ามี AccDocNo (เอกสารถูก Save Header แล้ว)
    if (accDocNo) {
      // โหลดข้อมูล Detail จาก API vDI_D
      fetchDataDIDetails(accDocNo);
    }
    // 2. ถ้าเป็น Draft ใหม่ (ไม่มี AccDocNo) และมีข้อมูล OCR Detail มา
    else if (initialOcrDetails && initialOcrDetails.length > 0) {
      console.log("Loading details from OCR data:", initialOcrDetails);

      // แปลงข้อมูล OCR Details ให้อยู่ในรูปแบบที่ Detail Component คาดหวัง (vDI_D format)
      const formattedOcrDetails = initialOcrDetails.map((item, index) => {
        // 💡 NEW: เรียกใช้ findProductDetails ภายใน map เพื่อให้ได้ matchedDetails สำหรับ Item นั้นๆ
        const matchedDetails = findProductDetails(item.partNameAndDescription); // <-- แก้ไขบรรทัดนี้

        return ({ // 💡 ต้องมี return เพื่อส่ง Object กลับไปใน Array
            AccItemNo: index + 1,
            AccDocNo: null, // ไม่มีเลขเอกสารขณะนี้

            // ---  ใช้ Field จาก OCR  ---
            SalesDescription: item.partNameAndDescription || "N/A", // ใช้ Field นี้เป็นหลัก
            ProductCode: item.productCode || null, // ProductCode ที่มาจาก OCR (ถ้ามี)
            Qty: parseFloat(item.quantity) || 0,
            Price: parseFloat(item.unitPrice) || 0,
            Amount: parseFloat(item.lineTotal) || 0,

            // --- 💡 กำหนดค่าเริ่มต้นสำหรับ Field ที่ขาดหายไป ---
            UnitMea: "PCS", // ไม่มีใน OCR, กำหนดค่าเริ่มต้น
            Currency: "THB", // ไม่มีใน OCR, กำหนดค่าเริ่มต้น
            AccSourceDocNo: "", // ไม่มีใน OCR, กำหนดค่าเริ่มต้น
            AccSourceDocItem: 0, // ไม่มีใน OCR, กำหนดค่าเริ่มต้น
            StockTransNo: 0, // ไม่มีใน OCR, กำหนดค่าเริ่มต้น
            
            // 💡 ใช้ค่าที่ Match ได้ ถ้า Match ไม่ได้ ให้ใช้ค่าเริ่มต้น/OCR
            SaleProductCode: matchedDetails?.SaleProductCode || "DEF", 
            RateVat: matchedDetails?.RateVat || 0,
            RateWht: matchedDetails?.RateWht || 0, 
            VatType: matchedDetails?.VatType || 0,
        }); // <-- จบ return
    }); // <-- จบ .map()

      setDID(formattedOcrDetails);
      setItemCounter(formattedOcrDetails.length + 1);

    if (mappedOCR) {
        setOcrTotals({
          amount: mappedOCR.amount || 0, // Total Amount ก่อน VAT
          vatAmount: mappedOCR.vatAmount || 0, // VAT Amount
          grandTotal: mappedOCR.grandTotal || 0, // Grand Total
        });
      }
    
  } else {
      setDID([]);
      setItemCounter(1);
    }
    // เนื่องจาก fetchDataDIDetails เป็น useCallback ที่ไม่มี dependency จึงปลอดภัย
  }, [accDocNo, initialOcrDetails, fetchDataDIDetails,mappedOCR,productMaster, findProductDetails]);
  useEffect(() => {
    if (did && did.length > 0) {
      const itemNo = did.map((item) => item.AccItemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setItemCounter(1);
    }
  }, [did]);

const handleUpdateDraftDetail = (updatedItem) => {
    if (!accDocNo) { // ทำเฉพาะในโหมด Draft
        setDID(prevDid => {
            return prevDid.map(item => {
                // หา Item ที่ถูกแก้ไขด้วย AccItemNo
                if (item.AccItemNo === updatedItem.AccItemNo) { 
                    // อัปเดตข้อมูล Item ที่แก้ไขแล้ว
                    return {
                        ...item,
                        Price: updatedItem.Price,
                        Qty: updatedItem.Qty,
                        Amount: updatedItem.Amount,
                        UnitMea: updatedItem.UnitMea,
                        Currency: updatedItem.Currency,
                        SalesDescription: updatedItem.SalesDescription,
                        SaleProductCode: updatedItem.SaleProductCode,
                        RateVat: updatedItem.RateVat, 
                        RateWht: updatedItem.RateWht,
                        VatType: updatedItem.VatType,
                    };
                }
                return item;
            });
        });
    }
};

  const handleAddDetail = (item) => {
    // 💡 เปลี่ยนเป็นรับ item object โดยตรง
    // ตรวจสอบ DocStatus (ถ้ามี)
    const docStatus = dih[0]?.DocStatus || 0;
    const accDocType = dih[0]?.AccDocType || "DI";

    // 💡 เตรียมข้อมูลที่จะส่งไปให้ Modal Edit
    setItemToEdit({
      // ข้อมูลหลักสำหรับ API (ถ้ามี accDocNo)
      accDocNo: accDocNo || null, // ส่ง accDocNo ที่อาจจะเป็น null (สำหรับ Draft)
      accItemNo: item.AccItemNo,
      docStatus: docStatus,
      accDocType: accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
      SaleProductCode: item.SaleProductCode || null,

      // ข้อมูลรายการที่ได้จาก OCR/API เพื่อให้ Modal นำไปแสดงผล
      itemData: item, // ส่ง object item ทั้งหมดไป
    });
    setShowAddDetailModal(true);
  };

  const handleCloseAddDetailModal = useCallback(() => {
    setShowAddDetailModal(false);
    setItemToEdit(null);
  }, []);

  const handleDetailUpdatedOrDeleted = useCallback(() => {
    if (accDocNo) {
      fetchDataDIDetails(accDocNo);
    } else {
    }
    handleCloseAddDetailModal();
  }, [accDocNo, fetchDataDIDetails, handleCloseAddDetailModal]);
  
  return (
    <div>
      {did.map((product, index) => (
        <div key={index}>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h5>
                &nbsp; {index + 1}.&nbsp;
                {product.SaleProductCode}/
                <Abbreviation textName={product.SalesDescription} />
                &nbsp;
                {product.AccSourceDocNo && product.AccSourceDocItem ? (
                  <i style={{ fontSize: "13px" }}>
                    {product.AccSourceDocNo}#{product.AccSourceDocItem}
                  </i>
                ) : null}
              </h5>
              <h>
                &nbsp; &nbsp; {formatNumber(product.Price)}
                {product.Currency} x {formatNumber(product.Qty)}
                {product.UnitMea}
              </h>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(product.Amount)}</h2>
                &nbsp; &nbsp; &nbsp;
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size="1x"
                  style={{ color: "#0310ce", paddingTop: "10px" }}
                  // อนุญาตให้แก้ไข Item ใน Draft Mode (ถ้าไม่มี accDocNo)
                  // ถ้าต้องการแก้ไข Item Draft ต้องแน่ใจว่า Modal Edit ถูกตั้งค่าให้รับ Item Object โดยตรง
                  onClick={() => handleAddDetail(product)}
                />
              </div>
            </div>
          </ListItem>
        </div>
      ))}
      {showAddDetailModal && itemToEdit && (
        <OCRDraftDIEditDT
          open={showAddDetailModal}
          onClose={handleCloseAddDetailModal}
          onBackdropClick={handleCloseAddDetailModal}
          accDocNo={itemToEdit.accDocNo}
          accItemNo={itemToEdit.accItemNo}
          docStatus={itemToEdit.docStatus}
          accDocType={itemToEdit.accDocType}
          selectedDocConfigID={itemToEdit.selectedDocConfigID}
          selectedProductCode={itemToEdit.itemData?.productCode}
          // Props ใหม่: ข้อมูล Item ที่โหลดจาก OCR/API
          initialItemData={itemToEdit.itemData}
          // ฟังก์ชันสำหรับจัดการเมื่อมีการบันทึก/ลบ
          onSave={() => {
            // ถ้ามี accDocNo (บันทึก Header แล้ว) ให้โหลด API ใหม่
            if (accDocNo) {
              fetchDataDIDetails(accDocNo);
            } else {
              // 💡 ถ้าเป็น Draft (accDocNo เป็น null) ต้องจัดการอัปเดต State did โดยตรง
              handleUpdateDraftDetail(itemToEdit.itemData, itemToEdit.itemData); // จำลองการอัปเดต
            }
            handleCloseAddDetailModal();
          }}
          onDelete={handleDetailUpdatedOrDeleted}
        />
      )}

      {(() => {
        let totalData = null;
        if (accDocNo && dih.length > 0) {
          totalData = {
            TotalAmount: dih[0].TotalAmount,
            TotalVat: dih[0].TotalVat,
            TotalWht: dih[0].TotalWht,
            TotalNet: dih[0].TotalNet,
          };
        } else if (!accDocNo && initialOcrDetails.length > 0) {
          // โหมด Draft: ใช้ค่าที่ดึงมาจาก OCR Header
          totalData = {
            TotalAmount: ocrTotals.amount,
            TotalVat: ocrTotals.vatAmount,
            // ใน OCR ไม่มี TotalWht ชัดเจน อาจใช้ 0 หรือคำนวณใหม่
            TotalWht: 0, 
            // Grand Total คือ TotalNet ในโครงสร้าง API
            TotalNet: ocrTotals.grandTotal, 
          };
        }

        if (!totalData) return null; // ไม่แสดงผลถ้าไม่มีข้อมูล

        return (
          <div className="row">
            <div className="financial-form">
              <div className="col-7" style={{ justifyItems: "end" }}>
                {/* ... (หัวข้อ Total/VAT/WHT/Net เดิม) ... */}
                <h5 style={{ marginTop: "5px", marginLeft: "10px", padding: "3px" }}>
                  &nbsp; TotalAmount &nbsp;
                </h5>
                <h5 style={{ marginTop: "5px", marginLeft: "10px", padding: "7px" }}>
                  &nbsp; TotalVat VAT 7% &nbsp;
                </h5>
                <h5 style={{ marginTop: "5px", marginLeft: "10px", padding: "4px" }}>
                  &nbsp; TotalWht &nbsp;
                </h5>
                <h5 style={{ marginTop: "5px", marginLeft: "10px", padding: "6px" }}>
                  &nbsp; TotalNet &nbsp;
                </h5>
              </div>
              <div style={{ marginLeft: "auto", justifyItems: "end" }}>
                <div style={{ display: "flex" }}>
                  <h2>{formatNumber(totalData.TotalAmount)}</h2>
                  &nbsp; &nbsp; &nbsp;
                </div>
                <div style={{ display: "flex" }}>
                  <h2>{formatNumber(totalData.TotalVat)}</h2>
                  &nbsp; &nbsp; &nbsp;
                </div>
                <div style={{ display: "flex" }}>
                  <h2>{formatNumber(totalData.TotalWht)}</h2>
                  &nbsp; &nbsp; &nbsp;
                </div>
                <div style={{ display: "flex" }}>
                  <h2
                    style={{
                      borderBottom: "2px solid black",
                      boxShadow: "0 4px 0 black",
                    }}
                  >
                    {formatNumber(totalData.TotalNet)}
                  </h2>
                  &nbsp; &nbsp; &nbsp;
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
          </div>
        );
      })()}
      
    </div>
  );
}
 
export default DraftOCRDIDT;
