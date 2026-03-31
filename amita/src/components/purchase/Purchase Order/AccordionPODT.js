import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig.js";
import { API_VIEW_RESULT } from "../../api/url.js";
import { API_BASE } from "../../api/url.js";
import { ButtonGroup } from "@mui/material";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setAccDocNo,
  setAccItemNo,
  setDetailData,
  setSelectedProducts,
  setAddProducts,
  setTotalAmount,
  setVatAmount,
  setWhtAmount,
  setIsVatEnabled,
  setIsWhtEnabled,
  setAccEffectiveDate,
  setPartyCode,
  setPartyName,
  setNameCategory,
  clearSelectedProducts,
} from "../../redux/TransactionDataaction.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faUserGroup,
  faSquarePlus,
  faChevronRight,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import {
  Switch,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { formatNumber } from "../formatNumber.js";
import { FormatDate } from "../FormatData.js";
import POManagementComponentFromPR from "./POManagementComponentFromPR.js";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AccordionSelectProductPO from "./AccordionSelectProductPO.js";
import AccordiionPOAddDT from "./AccordiionPOAddDT.js";
import AccordionPOEditDT from "./AccordionPOEditDT.js";

function AccordionPODT({ accDocNo, onSaveSuccess, refreshPOData }) {
  const location = useLocation();
  const dispatch = useDispatch();
  // const accDocNo = useSelector((state) => state.accDocNo);
  const accItemNo = useSelector((state) => state.accItemNo);
  const detailData = useSelector((state) => state.detailData);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const addProducts = useSelector((state) => state.addProducts);
  const totalAmount = useSelector((state) => state.totalAmount);
  const vatAmount = useSelector((state) => state.vatAmount);
  const whtAmount = useSelector((state) => state.whtAmount);
  const isVatEnabled = useSelector((state) => state.isVatEnabled);
  const isWhtEnabled = useSelector((state) => state.isWhtEnabled);
  const accEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const partyCode = useSelector((state) => state.partyCode);
  const partyName = useSelector((state) => state.partyName);
  const nameCategory = useSelector((state) => state.nameCategory);

  const [isproductName, setProductName] = useState([]);
  const [price, setPrice] = useState([]);
  const [qty, setQty] = useState([]);
  const [productName, setproductName] = useState(false);
  const [itemCounter, setItemCounter] = useState(1);

  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddDTModal, setOpenAddDTModal] = useState(false);

  console.log("accDocNo from props:", accDocNo);
  // useEffect(() => {
  //   if (
  //     location.state?.addProducts &&
  //     Array.isArray(location.state.addProducts)
  //   ) {
  //     setAddProducts(location.state.addProducts);
  //     console.log("addProducts:", location.state.addProducts);
  //     // console.log("addProductsACCDOCNO:", location.state.addProducts[0].accDocNo);
  //   }
  // }, [location.state?.addProducts]);

  const [loading, setLoading] = useState(false);
  const [poh, setPOH] = useState([]);
  const [pod, setPOD] = useState([]);
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(
    () => {
      console.log("accDocNo :", accDocNo);
      if (accDocNo) {
        // ดึงข้อมูล PO_H และ PO_D ด้วย accDocNo จาก props
        const vPO_H = {
          viewName: "vPO_H",
          parameters: [
            // { field: "AccDocType", value: "PO" },
            // { field: "DocStatus", value: "0" },
            { field: "AccDocNo", value: accDocNo }, // ใช้ accDocNo จาก Redux store
          ],
          results: [
            { sourceField: "AccDocNo" },
            { sourceField: "AccBatchDate" },
            { sourceField: "AccEffectiveDate" },
            { sourceField: "PartyCode" },
            { sourceField: "PartyTaxCode" },
            { sourceField: "PartyName" },
            { sourceField: "PartyAddress" },
            { sourceField: "IssueBy" },
            { sourceField: "AccDocType" },
            { sourceField: "AccPostDate" },
            { sourceField: "FiscalYear" },
            { sourceField: "DocStatus" },
            { sourceField: "DocRefNo" },
            { sourceField: "TotalAmount" },
            { sourceField: "TotalVat" },
            { sourceField: "TotalWht" },
            { sourceField: "TotalNet" },
            { sourceField: "StatusName" },
          ],
        };

        const vPO_D = {
          viewName: "vPO_D",
          parameters: [
            { field: "AccDocType", value: "PO" },
            // { field: "DocStatus", value: "0" },
            { field: "AccDocNo", value: accDocNo }, // ใช้ accDocNo จาก Redux store
          ],
          results: [
            { sourceField: "DocRefNo" },
            { sourceField: "DocStatus" },
            { sourceField: "FiscalYear" },
            { sourceField: "AccPostDate" },
            { sourceField: "AccDocType" },
            { sourceField: "IssueBy" },
            { sourceField: "PartyAddress" },
            { sourceField: "PartyName" },
            { sourceField: "PartyTaxCode" },
            { sourceField: "PartyCode" },
            { sourceField: "AccEffectiveDate" },
            { sourceField: "AccBatchDate" },
            { sourceField: "AccDocNo" },
            { sourceField: "AccItemNo" },
            { sourceField: "AccSourceDocNo" },
            { sourceField: "AccSourceDocItem" },
            { sourceField: "StockTransNo" },
            { sourceField: "Qty" },
            { sourceField: "Price" },
            { sourceField: "UnitMea" },
            { sourceField: "Currency" },
            { sourceField: "ExchangeRate" },
            { sourceField: "Amount" },
            { sourceField: "SaleProductCode" },
            { sourceField: "SalesDescription" },
            { sourceField: "ProductID" },
            { sourceField: "ProductCode" },
            { sourceField: "ProductName" },
            { sourceField: "ProductBrand" },
            { sourceField: "ProductColor" },
            { sourceField: "ProductSize" },
            { sourceField: "ProductSizeUnit" },
            { sourceField: "ProductVolume" },
            { sourceField: "ProductVolumeUnit" },
            { sourceField: "UnitStock" },
            { sourceField: "ProductTypeCode" },
            { sourceField: "ProductTypeID" },
            { sourceField: "ProductTypeName" },
            { sourceField: "WarehouseID" },
            { sourceField: "WarehouseCode" },
            { sourceField: "WarehouseName" },
            { sourceField: "WarehouseLocation" },
            { sourceField: "WarehouseAddress" },
            { sourceField: "AssetAccCode" },
            { sourceField: "AssetAccName" },
            { sourceField: "AssetAccNameEN" },
            { sourceField: "AssetAccType" },
            { sourceField: "AssetAccTypeName" },
            { sourceField: "AssetAccTypeNameEN" },
            { sourceField: "AssetAccSide" },
            { sourceField: "AssetAccMainCode" },
            { sourceField: "AssetAccMainName" },
            { sourceField: "AssetAccMainNameEN" },
            { sourceField: "IncomeAccCode" },
            { sourceField: "IncomeAccName" },
            { sourceField: "IncomeAccNameEN" },
            { sourceField: "IncomeAccType" },
            { sourceField: "IncomeAccTypeName" },
            { sourceField: "IncomeAccTypeNameEN" },
            { sourceField: "IncomeAccSide" },
            { sourceField: "IncomeAccMainCode" },
            { sourceField: "IncomeAccMainName" },
            { sourceField: "IncomeAccMainNameEN" },
            { sourceField: "ExpenseAccCode" },
            { sourceField: "ExpenseAccName" },
            { sourceField: "ExpenseAccNameEN" },
            { sourceField: "ExpenseAccType" },
            { sourceField: "ExpenseAccTypeName" },
            { sourceField: "ExpenseAccTypeNameEN" },
            { sourceField: "ExpenseAccSide" },
            { sourceField: "ExpenseAccMainCode" },
            { sourceField: "ExpenseAccMainName" },
            { sourceField: "ExpenseAccMainNameEN" },
            { sourceField: "IsMaterial" },
            { sourceField: "IsService" },
            { sourceField: "RateVat" },
            { sourceField: "RateWht" },
            { sourceField: "VatType" },
            { sourceField: "TotalAmount" },
            { sourceField: "VatAmount" },
            { sourceField: "WhtAmount" },
          ],
        };

        (async () => {
          try {
            setLoading(true);
            const responseH = await axios.post(`${API_VIEW_RESULT}`, vPO_H, {
              headers: { "Content-Type": "application/json" },
            });

            const responseD = await axios.post(`${API_VIEW_RESULT}`, vPO_D, {
              headers: { "Content-Type": "application/json" },
            });

            if (responseH.status === 200 && responseD.status === 200) {
              setLoading(false);
              console.log("vPO_H:", responseH.data);
              console.log("vPO_D:", responseD.data);

              const sortedData = responseD.data.sort(
                (a, b) => a.AccItemNo - b.AccItemNo
              );
              setPOH(responseH.data);
              setPOD(sortedData);
            } else {
              setLoading(false);
              console.error("Error fetching data");
            }
          } catch (error) {
            console.error("Error:", error);
            setLoading(false);
          }
        })();
      }
    },
    //  [location.state?.addProducts]
    [accDocNo] // ใช้ accDocNo เป็น dependency
  );
  //ส่งค่าไปด้วยตอนไปเลือกรายการ
  // const handleProductSelect = () => {
  //   navigate("/uitestacc/POselectProduct/", {
  //     state: {
  //       // selectedProducts,
  //       accDocNo: accDocNo,
  //       accEffectiveDate: accEffectiveDate,
  //       partyCode: partyCode,
  //       partyName: partyName,
  //       isnameCategory: nameCategory,
  //       selectedProducts: selectedProducts,
  //       docStatus: poh[0]?.DocStatus,
  //     },
  //   });
  // };

  // Product select handler
  const handleProductSelect = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับเปิด Modal เลือกสินค้า
  const handleOpenProductModal = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับปิด Modal เลือกสินค้า
  const handleCloseProductModal = () => {
    setOpenProductModal(false);
  };

  const handleConfirmProductSelection = () => {
    handleCloseProductModal(); // Close the product selection modal
    setOpenAddDTModal(true); // Open the detail modal
  };
  // ฟังก์ชันสำหรับปิด Modal เพิ่มรายละเอียด
  const handleCloseAddDTModal = () => {
    setOpenAddDTModal(false);
    dispatch(clearSelectedProducts()); // เคลียร์ค่าที่เลือกเมื่อปิด Modal
  };

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Save" ที่ Modal เพิ่มรายละเอียด
  const handleSaveDetail = () => {
    handleCloseAddDTModal();
    fetchDataPRDetails();
    const numberOfSavedItems = selectedProducts.length;
    setItemCounter((prevCounter) => prevCounter + numberOfSavedItems);
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  useEffect(() => {
    if (
      location.state?.selectedProducts &&
      Array.isArray(location.state.selectedProducts)
    ) {
      const combinedProducts = [
        ...selectedProducts,
        ...location.state.selectedProducts,
      ];
      dispatch(setSelectedProducts(combinedProducts));
    }
  }, [location.state?.selectedProducts]);

  useEffect(() => {
    if (detailData) {
      // Calculate total amount when detailData changes
      const sum = detailData.reduce((accumulator, dataDetail) => {
        return accumulator + parseFloat(dataDetail.amount); // Parse amount as float
      }, 0);
      setTotalAmount(parseFloat(sum.toFixed(4)));

      const vatRate =
        detailData.length > 0 ? detailData[0].rateVat / 100 : 0.07;
      const whtRate = detailData.length > 0 ? detailData[0].rateWht / 100 : 0;

      const vat = isVatEnabled ? sum * vatRate : 0;
      setVatAmount(parseFloat(vat.toFixed(4)));

      let wht = 0; // Initialize wht to 0
      if (whtRate > 0 && isWhtEnabled) {
        // Check both whtRate and isWhtEnabled
        wht = sum * whtRate;
      }
      setWhtAmount(parseFloat(wht.toFixed(4)));
    } else {
      setTotalAmount(0); // Reset total if detailData is null or undefined
      setVatAmount(0); // Reset VAT as well
      setWhtAmount(0); // Reset WHT
    }
  }, [detailData, isVatEnabled, isWhtEnabled]);

  useEffect(() => {
    if (detailData && detailData.length > 0) {
      // ตรวจสอบ detailData ด้วย
      const itemNo = detailData.map((item) => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
      const productName = detailData.map((item) => item.salesDescription);
      setProductName(productName);
      const prices = detailData.map((item) => item.price);
      setPrice(prices);
      const qtys = detailData.map((item) => item.qty);
      setQty(qtys);

      setIsVatEnabled(detailData[0].rateVat > 0); // Enable if rateVat > 0
      setIsWhtEnabled(detailData[0].rateWht > 0); // Enable if rateWht > 0
    }
  }, [detailData]);

  const navigate = useNavigate();

  const style = {
    p: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };
  const [formDataDT, setformDataDT] = useState({
    total: 0,
    // discount: 0,
    // totalAfterDiscount: 0,
    vat: 0,
    grandTotal: 0,
    withholdingTax: 0,
    vatRate: 0.07, // อัตรา VAT
    isVatExempt: false, // สถานะยกเว้น VAT
    withholdingTaxRate: 0, // อัตราภาษีหัก ณ ที่จ่าย
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setformDataDT({
      ...formDataDT,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleVatChange = (event) => {
    setIsVatEnabled(event.target.checked);
  };

  const handleWhtChange = (event) => {
    setIsWhtEnabled(event.target.checked);
  };

  const calculateVat = (totalAmount) => {
    const vat = totalAmount * 0.07;
    return parseFloat(vat.toFixed(4));
  };
  const calculateWht = (totalAmount) => {
    const wht = totalAmount * 0.03;
    return parseFloat(wht.toFixed(4));
  };
  useEffect(() => {
    if (detailData) {
      const sum = detailData.reduce((accumulator, dataDetail) => {
        return accumulator + parseFloat(dataDetail.amount);
      }, 0);
      setTotalAmount(parseFloat(sum.toFixed(4)));

      const vat = calculateVat(sum); // คำนวณ VAT
      setVatAmount(vat); // Update vatAmount state
      const wht = calculateWht(sum); // คำนวณ WHT
      setWhtAmount(wht);
    } else {
      setTotalAmount(0);
      setVatAmount(0); // Reset VAT ด้วย
      setWhtAmount(0);
    }
  }, [detailData]);

  const selectedItem = location.state?.selectedItem;
  useEffect(() => {
    if (selectedItem) {
      console.log("Selected item:", selectedItem);
    }
  }, [selectedItem]);

  const [editDetail, setEditDetail] = useState([]);

  const handleEditDetail1 = (AccItemNo) => {
    console.log("DocStatus:", poh[0].DocStatus);
    const docStatus = poh[0].DocStatus;
    const accDocType = poh[0].AccDocType;
    console.log("accDocType:", accDocType);
    console.log("docStatus:", docStatus);
    navigate(
      `/uitestacc/POEditDetail?accDocNo=${accDocNo}&accItemNo=${AccItemNo}`,
      {
        //Form 3 Add/Edit Detail ?DocNo=AAA&Item=n
        state: {
          editDetail,
          accDocNo: accDocNo, // ส่ง accDocNo ไปด้วย
          accItemNo: AccItemNo,
          isproductName: isproductName,
          price: price,
          qty: qty,
          docStatus: docStatus,
          accDocType: accDocType,
          selectedDocConfigID: location.state?.selectedDocConfigID || null,
        },
      }
    );
  };
  useEffect(() => {
    if (
      location.state?.editDetail &&
      Array.isArray(location.state.editDetail)
    ) {
      setEditDetail((prevEditDetail) => [
        ...prevEditDetail,
        ...location.state.editDetail,
      ]);
    }
  }, [location.state?.editDetail]);

  const [addDetail, setAddDetail] = useState([]);

  useEffect(() => {
    if (detailData && detailData.length > 0) {
      const itemNo = detailData.map((item) => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setAccItemNo([]);
      setItemCounter(1);
    }
  }, [detailData]);

  const handleAddDetail = () => {
    const productNames = selectedProducts.map((product) => product.productName);
    const rateVats = selectedProducts.map((product) => product.rateVat);
    const rateWhts = selectedProducts.map((product) => product.rateWht);
    const unitStocks = selectedProducts.map((product) => product.unitStock);
    let newItemNo = itemCounter;
    while (accItemNo.includes(newItemNo)) {
      newItemNo++;
    }
    const newItem = {
      ...selectedProducts,
      itemNo: newItemNo,
    };
    dispatch(setSelectedProducts([...selectedProducts, newItem]));
    setAccItemNo([...accItemNo, newItemNo]);
    setItemCounter(newItemNo + 1);

    navigate(
      `/uitestacc/TransactionDTAdd?accDocNo=${accDocNo}&Item=${accItemNo}`,
      {
        //Form 3 Add/Edit Detail ?DocNo=AAA&Item=n
        state: {
          // addDetail: addDetail,
          accDocNo: accDocNo,
          productNames: productNames,
          rateVats: rateVats,
          rateWhts: rateWhts,
          unitStocks: unitStocks,

          accEffectiveDate: accEffectiveDate,
          partyCode: partyCode,
          partyName: partyName,
          nameCategory: nameCategory,
        },
      }
    );
  };

  const [showPOManagement, setShowPOManagement] = useState(false);
  const handleChoosePR = () => {
    console.log("AccDocNo:", accDocNo);
    // console.log("Current PO AccDocNo (poNo):", poh[0].AccDocNo);

    setShowPOManagement(true); // ตั้งค่าให้แสดง POManagementComponentFromPR
  };
  const handleClosePOManagement = () => {
    setShowPOManagement(false);
  };

  const fetchDataPRDetails = () => {
    if (accDocNo) {
      // ดึงข้อมูล PO_H และ PO_D ด้วย accDocNo จาก props
      const vPO_H = {
        viewName: "vPO_H",
        parameters: [
          // { field: "AccDocType", value: "PO" },
          // { field: "DocStatus", value: "0" },
          { field: "AccDocNo", value: accDocNo }, // ใช้ accDocNo จาก Redux store
        ],
        results: [
          { sourceField: "AccDocNo" },
          { sourceField: "AccBatchDate" },
          { sourceField: "AccEffectiveDate" },
          { sourceField: "PartyCode" },
          { sourceField: "PartyTaxCode" },
          { sourceField: "PartyName" },
          { sourceField: "PartyAddress" },
          { sourceField: "IssueBy" },
          { sourceField: "AccDocType" },
          { sourceField: "AccPostDate" },
          { sourceField: "FiscalYear" },
          { sourceField: "DocStatus" },
          { sourceField: "DocRefNo" },
          { sourceField: "TotalAmount" },
          { sourceField: "TotalVat" },
          { sourceField: "TotalWht" },
          { sourceField: "TotalNet" },
          { sourceField: "StatusName" },
        ],
      };

      const vPO_D = {
        viewName: "vPO_D",
        parameters: [
          { field: "AccDocType", value: "PO" },
          // { field: "DocStatus", value: "0" },
          { field: "AccDocNo", value: accDocNo }, // ใช้ accDocNo จาก Redux store
        ],
        results: [
          { sourceField: "DocRefNo" },
          { sourceField: "DocStatus" },
          { sourceField: "FiscalYear" },
          { sourceField: "AccPostDate" },
          { sourceField: "AccDocType" },
          { sourceField: "IssueBy" },
          { sourceField: "PartyAddress" },
          { sourceField: "PartyName" },
          { sourceField: "PartyTaxCode" },
          { sourceField: "PartyCode" },
          { sourceField: "AccEffectiveDate" },
          { sourceField: "AccBatchDate" },
          { sourceField: "AccDocNo" },
          { sourceField: "AccItemNo" },
          { sourceField: "AccSourceDocNo" },
          { sourceField: "AccSourceDocItem" },
          { sourceField: "StockTransNo" },
          { sourceField: "Qty" },
          { sourceField: "Price" },
          { sourceField: "UnitMea" },
          { sourceField: "Currency" },
          { sourceField: "ExchangeRate" },
          { sourceField: "Amount" },
          { sourceField: "SaleProductCode" },
          { sourceField: "SalesDescription" },
          { sourceField: "ProductID" },
          { sourceField: "ProductCode" },
          { sourceField: "ProductName" },
          { sourceField: "ProductBrand" },
          { sourceField: "ProductColor" },
          { sourceField: "ProductSize" },
          { sourceField: "ProductSizeUnit" },
          { sourceField: "ProductVolume" },
          { sourceField: "ProductVolumeUnit" },
          { sourceField: "UnitStock" },
          { sourceField: "ProductTypeCode" },
          { sourceField: "ProductTypeID" },
          { sourceField: "ProductTypeName" },
          { sourceField: "WarehouseID" },
          { sourceField: "WarehouseCode" },
          { sourceField: "WarehouseName" },
          { sourceField: "WarehouseLocation" },
          { sourceField: "WarehouseAddress" },
          { sourceField: "AssetAccCode" },
          { sourceField: "AssetAccName" },
          { sourceField: "AssetAccNameEN" },
          { sourceField: "AssetAccType" },
          { sourceField: "AssetAccTypeName" },
          { sourceField: "AssetAccTypeNameEN" },
          { sourceField: "AssetAccSide" },
          { sourceField: "AssetAccMainCode" },
          { sourceField: "AssetAccMainName" },
          { sourceField: "AssetAccMainNameEN" },
          { sourceField: "IncomeAccCode" },
          { sourceField: "IncomeAccName" },
          { sourceField: "IncomeAccNameEN" },
          { sourceField: "IncomeAccType" },
          { sourceField: "IncomeAccTypeName" },
          { sourceField: "IncomeAccTypeNameEN" },
          { sourceField: "IncomeAccSide" },
          { sourceField: "IncomeAccMainCode" },
          { sourceField: "IncomeAccMainName" },
          { sourceField: "IncomeAccMainNameEN" },
          { sourceField: "ExpenseAccCode" },
          { sourceField: "ExpenseAccName" },
          { sourceField: "ExpenseAccNameEN" },
          { sourceField: "ExpenseAccType" },
          { sourceField: "ExpenseAccTypeName" },
          { sourceField: "ExpenseAccTypeNameEN" },
          { sourceField: "ExpenseAccSide" },
          { sourceField: "ExpenseAccMainCode" },
          { sourceField: "ExpenseAccMainName" },
          { sourceField: "ExpenseAccMainNameEN" },
          { sourceField: "IsMaterial" },
          { sourceField: "IsService" },
          { sourceField: "RateVat" },
          { sourceField: "RateWht" },
          { sourceField: "VatType" },
          { sourceField: "TotalAmount" },
          { sourceField: "VatAmount" },
          { sourceField: "WhtAmount" },
        ],
      };

      (async () => {
        try {
          setLoading(true);
          const responseH = await axios.post(`${API_VIEW_RESULT}`, vPO_H, {
            headers: { "Content-Type": "application/json" },
          });

          const responseD = await axios.post(`${API_VIEW_RESULT}`, vPO_D, {
            headers: { "Content-Type": "application/json" },
          });

          if (responseH.status === 200 && responseD.status === 200) {
            setLoading(false);
            setPOH(responseH.data);
            setPOD(responseD.data.sort((a, b) => a.AccItemNo - b.AccItemNo));
          } else {
            setLoading(false);
            console.error("Error fetching data");
          }
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      })();
    }
  };

  // Edit detail modal handlers
  const handleEditDetail = (AccItemNo) => {
    const docStatus = poh[0]?.DocStatus;
    const accDocType = poh[0]?.AccDocType;
    setItemToEdit({
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    setShowEditDetailModal(true);
  };

  const handleCloseEditDetailModal = useCallback(() => {
    setShowEditDetailModal(false);
    setItemToEdit(null);
  }, []);

  const handleDetailUpdatedOrDeleted = useCallback(() => {
    fetchDataPRDetails();
    handleCloseEditDetailModal();
  }, [fetchDataPRDetails, handleCloseEditDetailModal]);

  // คำนวณ itemCounter
  useEffect(() => {
    if (pod && pod.length > 0) {
      const itemNo = pod.map((item) => item.AccItemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setItemCounter(1);
    }
  }, [pod]);

  return (
    // <div className="row" style={{ padding: "5%" }}>
    <div>
      {/* <h1 style={{ textAlign: "center" }}>{nameCategory}</h1> */}
      {/* <h2 style={{ textAlign: "center" ,textDecorationLine:"underline"}} onClick={handleGoBack}>Purchase Order</h2> */}
      {/* <div>&nbsp;</div>
      <div>&nbsp;</div> */}
      <div className="row">
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <h2 style={{ marginTop: "5px", marginLeft: "10px" }}>{accDocNo}</h2>
          <br />
        </ListItem>
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <p>
            Date:
            {poh && poh.length > 0 && (
              <FormatDate dateString={poh[0].AccEffectiveDate} />
            )}
          </p>
        </ListItem>
      </div>
      {/* <div>&nbsp;</div> */}
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          {/* <FontAwesomeIcon
            icon={faUserGroup}
            size="2x"
            style={{ color: "#2d01bd" }}
          /> */}
          <h5 style={{ color: "blue" }}>
            {/* &nbsp; <Abbreviation textName={partyName}/> */}
            {/* &nbsp;{partyName} */}
            &nbsp;{poh && poh.length > 0 && poh[0].PartyName}
          </h5>
        </ListItem>
      </div>
      {pod.map((product, index) => (
        // <div key={product.productID}>
        <div key={index}>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            {/* <FontAwesomeIcon
              icon={faBoxOpen}
              size="2x"
              style={{ color: "#2d01bd" }}
            /> */}
            <div>
              <h5>
                &nbsp; {index + 1}.&nbsp;
                {/* <Abbreviation textName={product.ProductName} /> */}
                {/* {product.ProductName} */}
                {product.SalesDescription}
                &nbsp;{" "}
                {product.AccSourceDocNo && product.AccSourceDocItem ? (
                  <i style={{ fontSize: "13px", color: "gray" }}>
                    {product.AccSourceDocNo}#{product.AccSourceDocItem}
                  </i>
                ) : null}
              </h5>
              <h6>
                &nbsp; &nbsp;&nbsp; {formatNumber(product.Price)}
                {product.Currency} x {formatNumber(product.Qty)}
                {product.UnitMea}
              </h6>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ display: "flex" }}>
                {/* <h2>{formatNumber(product.TotalAmount)}</h2> */}
                <h2>{formatNumber(product.Amount)}</h2>
                &nbsp; &nbsp; &nbsp;
                {/* <FontAwesomeIcon icon={faPlus} /> */}
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size="1x"
                  style={{ color: "#0310ce", paddingTop: "10px" }}
                  // onClick={handleAddDetail}
                  onClick={() => handleEditDetail(product.AccItemNo)}
                />
              </div>
            </div>
          </ListItem>
        </div>
      ))}
      {showEditDetailModal && itemToEdit && (
        <>
          <AccordionPOEditDT
            open={showEditDetailModal}
            onClose={handleCloseEditDetailModal}
            onBackdropClick={handleCloseEditDetailModal}
            onSave={handleDetailUpdatedOrDeleted}
            onDelete={handleDetailUpdatedOrDeleted}
            accDocNo={itemToEdit.accDocNo}
            accItemNo={itemToEdit.accItemNo}
            docStatus={itemToEdit.docStatus}
            accDocType={itemToEdit.accDocType}
            selectedDocConfigID={itemToEdit.selectedDocConfigID}
            isproductName={itemToEdit.isproductName}
            price={itemToEdit.price}
            qty={itemToEdit.qty}
          />
        </>
      )}
      {(!poh || poh.length === 0 || poh[0]?.DocStatus === 0) && !showEditDetailModal && (
        <>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <Stack direction="row" spacing={1}>
              <Button //variant="outlined"
                variant="contained"
                color="warning"
                style={{ width: "183px", height: "33px", borderRadius: "20px" }}
                onClick={handleProductSelect}
              >
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  size="2x"
                  style={{ color: "#fff", justifyItems: "end" }}
                />
                &nbsp;Product/Service
              </Button>
            </Stack>
            <AccordionSelectProductPO
              isOpen={openProductModal}
              onClose={handleCloseProductModal}
              onSave={handleConfirmProductSelection}
              accDocNo={accDocNo}
              nextItemNo={itemCounter}
            />
            <AccordiionPOAddDT
              open={openAddDTModal}
              onClose={handleCloseAddDTModal}
              onSave={handleSaveDetail}
            />
            {/* {showEditDetailModal && itemToEdit && (
              <>
                <AccordionPOEditDT
                  open={showEditDetailModal}
                  onClose={handleCloseEditDetailModal}
                  onBackdropClick={handleCloseEditDetailModal}
                  onSave={handleDetailUpdatedOrDeleted}
                  onDelete={handleDetailUpdatedOrDeleted}
                  accDocNo={itemToEdit.accDocNo}
                  accItemNo={itemToEdit.accItemNo}
                  docStatus={itemToEdit.docStatus}
                  accDocType={itemToEdit.accDocType}
                  selectedDocConfigID={itemToEdit.selectedDocConfigID}
                  isproductName={itemToEdit.isproductName}
                  price={itemToEdit.price}
                  qty={itemToEdit.qty}
                />
              </>
            )} */}
            <h2>&nbsp;|&nbsp;</h2>
            {!showEditDetailModal && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    width: "150px",
                    height: "33px",
                    borderRadius: "20px",
                  }}
                  onClick={handleChoosePR}
                >
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    size="2x"
                    style={{ color: "#fff", justifyItems: "end" }}
                  />
                  &nbsp; Choose PR
                </Button>
              </Stack>
            )}
            {showPOManagement && (
              <POManagementComponentFromPR
                // currentPONo={poh[0].AccDocNo}
                currentPONo={accDocNo}
                // docRefNo={poh.docRefNo}//เช็คอีกครั้งควรเอาไปแท็กไหม
                onClose={handleClosePOManagement}
                onSave={fetchDataPRDetails} // ฟังก์ชันรีเฟรชข้อมูล
              />
            )}
            {/* </ListItem> */}
          </div>
        </>
      )}
      <div className="row">
        {/* <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            /> */}
        {poh.map((productH, index) => (
          <div className="financial-form" key={index}>
            {/* <ListItem style={{ display: "flex", alignItems: "center" }}> */}
            <div className="col-7" style={{ justifyItems: "end" }}>
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "3px" }}
              >
                &nbsp; TotalAmount &nbsp;
              </h5>
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "7px" }}
              >
                &nbsp; TotalVat VAT 7% &nbsp;
              </h5>
              {/* <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "4px" }}
              >
                &nbsp; TotalWht &nbsp;
              </h5> */}
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "6px" }}
              >
                &nbsp; TotalNet &nbsp;
              </h5>
            </div>
            <div style={{ marginLeft: "auto", justifyItems: "end" }}>
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(productH.TotalAmount)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div>
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(productH.TotalVat)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div>
              {/* <div style={{ display: "flex" }}>
                <h2>{formatNumber(productH.TotalWht)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div> */}
              <div style={{ display: "flex" }}>
                <h2
                  // style={{ textDecoration: 'underline' }}
                  style={{
                    borderBottom: "2px solid black",
                    boxShadow: "0 4px 0 black",
                  }}
                >
                  {formatNumber(productH.TotalNet)}
                </h2>
                &nbsp; &nbsp; &nbsp;
              </div>
            </div>
            {/* </ListItem> */}
          </div>
        ))}
        <div>&nbsp;</div>
      </div>
    </div>
  );
}

export default AccordionPODT;
