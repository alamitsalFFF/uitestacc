import { URL } from '../../api/url';
import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig.js";
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
import { formatNumber } from "../../purchase/formatNumber.js";
import Abbreviation from "../../purchase/Abbreviation.js";
import { FormatDate } from "../../purchase/FormatData.js";
import { API_VIEW_RESULT } from "../../api/url.js";
import SREditDetailAU from "./SREditDTAU.js";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AccordionSelectProductSR from "./AccordionSelectProductSR.js";
import AccordiionSRAddDT from "./AccordiionSRAddDT.js";

function SRListDTAU({ accDocNo, onSaveSuccess }) {
  const location = useLocation();
  const dispatch = useDispatch();
  // const accDocNo = useSelector((state) => state.accDocNo);
  console.log("accDocNoNew:", accDocNo);
  console.log("accDocNoNew:", typeof accDocNo);
  const accEffectiveDate = useSelector((state) => state.accEffectiveDate);
  console.log("accEffectiveDate:", accEffectiveDate);
  const accItemNo = useSelector((state) => state.accItemNo);
  const detailData = useSelector((state) => state.detailData);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const addProducts = useSelector((state) => state.addProducts);
  const totalAmount = useSelector((state) => state.totalAmount);
  const vatAmount = useSelector((state) => state.vatAmount);
  const whtAmount = useSelector((state) => state.whtAmount);
  const isVatEnabled = useSelector((state) => state.isVatEnabled);
  const isWhtEnabled = useSelector((state) => state.isWhtEnabled);

  const partyCode = useSelector((state) => state.partyCode);
  const partyName = useSelector((state) => state.partyName);
  const nameCategory = useSelector((state) => state.nameCategory);

  const [isproductName, setProductName] = useState([]);
  const [price, setPrice] = useState([]);
  const [qty, setQty] = useState([]);
  const [productName, setproductName] = useState(false);
  const [itemCounter, setItemCounter] = useState(1);

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

  // useEffect(() => {
  //   if (location.state && location.state.accDocNo) {
  //     const accDocNoFromState = location.state.accDocNo;
  //     const accEffectiveDateFromState = location.state.accEffectiveDate; // ดึงค่า accEffectiveDate จาก state ที่ส่งมา
  //     dispatch(setAccDocNo(accDocNoFromState));
  //     dispatch(setAccEffectiveDate(accEffectiveDateFromState)); // Dispatch ค่าที่รับมาจาก state
  //     console.log("accEffectiveDate from state:", accEffectiveDateFromState); // ลอง console ค่านี้ดู
  //     console.log("accDocNoFromState:", accDocNoFromState);
  //     console.log("accDocNoFromState:", typeof accDocNoFromState);
  //   }
  // }, [location.state, dispatch]);

  const [loading, setLoading] = useState(false);
  const [srh, setSRH] = useState([]);
  const [srd, setSRD] = useState([]);
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  // const [itemCounter, setItemCounter] = useState(1);

  // ****** States สำหรับควบคุม Modal
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddDTModal, setOpenAddDTModal] = useState(false);

  // Fetch PR Header & Detail
  const fetchDataSRDetails = useCallback(() => {
    if (accDocNo) {
      // ตรวจสอบว่า accDocNo มีค่าหรือไม่
      console.log("accDocNo from SRHeader:", accDocNo);
      console.log("accDocNo from SRHeader:", typeof accDocNo);

      const vSR_H = {
        viewName: "vSR_H",
        parameters: [
          { field: "AccDocType", value: "SR" },
          // { field: "DocStatus", value: "0" },
          { field: "AccDocNo", value: accDocNo },
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

      const vSR_D = {
        viewName: "vSR_D",
        parameters: [
          { field: "AccDocType", value: "SR" },
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
          // { sourceField: "AssetAccCode" },
          // { sourceField: "AssetAccName" },
          // { sourceField: "AssetAccNameEN" },
          // { sourceField: "AssetAccType" },
          // { sourceField: "AssetAccTypeName" },
          // { sourceField: "AssetAccTypeNameEN" },
          // { sourceField: "AssetAccSide" },
          // { sourceField: "AssetAccMainCode" },
          // { sourceField: "AssetAccMainName" },
          // { sourceField: "AssetAccMainNameEN" },
          // { sourceField: "IncomeAccCode" },
          // { sourceField: "IncomeAccName" },
          // { sourceField: "IncomeAccNameEN" },
          // { sourceField: "IncomeAccType" },
          // { sourceField: "IncomeAccTypeName" },
          // { sourceField: "IncomeAccTypeNameEN" },
          // { sourceField: "IncomeAccSide" },
          // { sourceField: "IncomeAccMainCode" },
          // { sourceField: "IncomeAccMainName" },
          // { sourceField: "IncomeAccMainNameEN" },
          // { sourceField: "ExpenseAccCode" },
          // { sourceField: "ExpenseAccName" },
          // { sourceField: "ExpenseAccNameEN" },
          // { sourceField: "ExpenseAccType" },
          // { sourceField: "ExpenseAccTypeName" },
          // { sourceField: "ExpenseAccTypeNameEN" },
          // { sourceField: "ExpenseAccSide" },
          // { sourceField: "ExpenseAccMainCode" },
          // { sourceField: "ExpenseAccMainName" },
          // { sourceField: "ExpenseAccMainNameEN" },
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
          const responseH = await axios.post(
            API_VIEW_RESULT,
            vSR_H,
            { headers: { "Content-Type": "application/json" } }
          );

          const responseD = await axios.post(
            API_VIEW_RESULT,
            vSR_D,
            { headers: { "Content-Type": "application/json" } }
          );

          if (responseH.status === 200 && responseD.status === 200) {
            setLoading(false);
            console.log("vSR_H:", responseH.data);
            console.log("vSR_D:", responseD.data);

            const sortedData = responseD.data.sort(
              (a, b) => a.AccItemNo - b.AccItemNo
            );
            setSRH(responseH.data);
            setSRD(sortedData);
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
  }, [accDocNo]); //ส่งค่าไปด้วยตอนไปเลือกรายการ

  useEffect(() => {
    if (accDocNo) {
      fetchDataSRDetails(accDocNo);
    }
  }, [accDocNo]);

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

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Confirm" ที่ Modal เลือกสินค้า
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
    // 1. Close the modal
    handleCloseAddDTModal();

    // 2. Fetch the latest data from the server
    fetchDataSRDetails();

    // 3. Increment the item counter for the next batch
    //    We need to get the number of items that were successfully saved. 
    //    We can get this from the Redux state.
    const numberOfSavedItems = selectedProducts.length;
    setItemCounter(prevCounter => prevCounter + numberOfSavedItems);

    // 4. (Optional) Call a function from the parent component
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };


  const handleProductSelect1 = () => {
    // console.log('srh[0].DocStatus:',srh[0].DocStatus)
    navigate(`${URL}SRProductSelect`, {
      state: {
        // selectedProducts,
        accDocNo: accDocNo,
        accEffectiveDate: accEffectiveDate,
        partyCode: partyCode,
        partyName: partyName,
        isnameCategory: nameCategory,
        selectedProducts: selectedProducts,
        docStatus: srh[0]?.DocStatus,
      },
    });
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

  const handleGoBack = () => {
    navigate(`${URL}SRHeader?accDocNo=${accDocNo}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();

  const handlePlusClick = () => {
    navigate(`${URL}QCSupplier`);
  };

  // const style = {
  //   p: 0,
  //   width: "100%",
  //   maxWidth: 360,
  //   borderRadius: 2,
  //   border: "1px solid",
  //   borderColor: "divider",
  //   backgroundColor: "background.paper",
  // };
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

  const VATSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&::before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&::after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));
  const WHTSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&::before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&::after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  const [editDetail, setEditDetail] = useState([]);

  // const handleEditDetail = (AccItemNo) => {
  //   console.log("DocStatus:", srh[0].DocStatus);
  //   const docStatus = srh[0].DocStatus;
  //   console.log("docStatus:", docStatus);
  //   navigate(
  //     `${URL}SREditDetail?accDocNo=${accDocNo}&accItemNo=${AccItemNo}`,
  //     {
  //       //Form 3 Add/Edit Detail ?DocNo=AAA&Item=n
  //       state: {
  //         editDetail,
  //         accDocNo: accDocNo, // ส่ง accDocNo ไปด้วย
  //         accItemNo: AccItemNo,
  //         isproductName: isproductName,
  //         price: price,
  //         qty: qty,
  //         docStatus: docStatus,
  //         selectedDocConfigID: location.state?.selectedDocConfigID || null, // ส่ง selectedDocConfigID ถ้ามี
  //       },
  //     }
  //   );
  // };

  // Edit detail modal handlers
  const handleEditDetail = (AccItemNo) => {
    const docStatus = srh[0]?.DocStatus;
    const accDocType = srh[0]?.AccDocType;
    setItemToEdit({
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    console.log("itemToEdit:", {
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
    fetchDataSRDetails();
    handleCloseEditDetailModal();
  }, [fetchDataSRDetails, handleCloseEditDetailModal]);

  // คำนวณ itemCounter
  useEffect(() => {
    if (srd && srd.length > 0) {
      const itemNo = srd.map((item) => item.AccItemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setItemCounter(1);
    }
  }, [srd]);

  // useEffect(() => {
  //   if (
  //     location.state?.editDetail &&
  //     Array.isArray(location.state.editDetail)
  //   ) {
  //     setEditDetail((prevEditDetail) => [
  //       ...prevEditDetail,
  //       ...location.state.editDetail,
  //     ]);
  //   }
  // }, [location.state?.editDetail]);

  const [addDetail, setAddDetail] = useState([]);

  // useEffect(() => {
  //   if (detailData && detailData.length > 0) {
  //     const itemNo = detailData.map((item) => item.accItemNo);
  //     setAccItemNo(itemNo);
  //     const maxItemNo = Math.max(...itemNo);
  //     setItemCounter(maxItemNo + 1);
  //   } else {
  //     setAccItemNo([]);
  //     setItemCounter(1);
  //   }
  // }, [detailData]);
  const handleGoMenu = () => {
    navigate(`${URL}`);
  };
  // const docStatus = srh[0].DocStatus;
  return (
    <div>
      <div className="row">
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              background: "linear-gradient(135deg, #1a237e, #1565c0)",
              borderRadius: "20px",
              padding: "8px 20px",
              boxShadow: "0 2px 8px rgba(21, 101, 192, 0.4)",
              marginTop: "5px",
              marginLeft: "10px",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
              }}
            >
              {accDocNo}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 1)",
                letterSpacing: "0.05em",
                marginTop: "3px",
                width: "100%",
                textAlign: "right",
              }}
            >
              Due Date:&nbsp;
              {srh[0]?.AccEffectiveDate ? (
                <FormatDate dateString={srh[0].AccEffectiveDate} />
              ) : (
                <FormatDate dateString={accEffectiveDate} />
              )}
            </span>
          </div>
        </ListItem>
      </div>
      <div className="row">
        <ListItem
          style={{ display: "flex", alignItems: "center", paddingLeft: "30px" }}
        >
          {/* <FontAwesomeIcon
            icon={faUserGroup}
            size="2x"
            style={{ color: "#2d01bd" }}
          /> */}
          <h5 style={{ color: "blue" }}>
            &nbsp;
            {srh && srh.length > 0 && srh[0].PartyName
              ? srh[0].PartyName
              : partyName}
          </h5>
        </ListItem>
      </div>
      {srd.map((product, index) => (
        <div
          key={index}
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            margin: "6px 4px",
            padding: "10px 12px",
            boxShadow: "0 1px 4px rgba(26,35,126,0.08)",
            border: "1px solid #e8eaf6",
            borderLeft: "4px solid #1565c0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Item info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
              {/* Item number badge */}
              <span
                style={{
                  background: "#1565c0",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {product.AccItemNo}
              </span>
              {/* Description */}
              <span
                style={{
                  color: "#1a237e",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.SalesDescription}
              </span>
            </div>
            {/* Price × Qty */}
            <div
              style={{
                marginTop: "4px",
                color: "#607d8b",
                fontSize: "0.8rem",
                paddingLeft: "28px",
              }}
            >
              {formatNumber(product.Price)}&nbsp;{product.Currency}&nbsp;
              <span style={{ color: "#90a4ae" }}>x</span>&nbsp;
              {formatNumber(product.Qty)}&nbsp;{product.UnitMea}
            </div>
          </div>

          {/* Right: Amount + Edit */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", flexShrink: 0 }}>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1a237e",
              }}
            >
              {formatNumber(product.Amount)}
            </span>
            <FontAwesomeIcon
              icon={faChevronRight}
              size="sm"
              style={{
                color: "#1565c0",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                background: "#e3f2fd",
              }}
              onClick={() => handleEditDetail(product.AccItemNo)}
            />
          </div>
        </div>
      ))}

      {/* <div>
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
      </div> */}
      {(!srh || srh.length === 0 || srh[0]?.DocStatus === 0) && (
        <>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />
          {/* <ListItem style={{ justifyContent: "center" }}>
            <FontAwesomeIcon
              icon={faSquarePlus}
              size="2x"
              style={{ color: "green", justifyItems: "end" }}
              onClick={handleProductSelect}
            />
            <h5
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                textAlign: "center",
              }}
            >
              Add Product/Service
            </h5>
          </ListItem> */}
          <ListItem style={{ justifyContent: "center" }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="warning"
                style={{ width: "183px", height: "33px", borderRadius: "20px" }}
                onClick={handleProductSelect}
              >
                <FontAwesomeIcon icon={faSquarePlus} size="2x" style={{ color: "#fff", justifyItems: "end" }} />
                &nbsp;Product/Service
              </Button>
            </Stack>
          </ListItem>
        </>
      )}
      <AccordionSelectProductSR
        isOpen={openProductModal}
        onClose={handleCloseProductModal}
        onSave={handleConfirmProductSelection}
        accDocNo={accDocNo}
        nextItemNo={itemCounter}
      />

      <AccordiionSRAddDT
        open={openAddDTModal}
        onClose={handleCloseAddDTModal}
        onSave={handleSaveDetail}
      />

      {showEditDetailModal && itemToEdit && (
        <>
          <SREditDetailAU
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

      <div className="row">
        {srh.map((productH, index) => (
          <div
            key={index}
            style={{
              background: "linear-gradient(135deg, #e8eaf6, #e3f2fd)",
              borderRadius: "12px",
              margin: "8px 4px 4px 4px",
              padding: "10px 8px",
              boxShadow: "0 2px 8px rgba(26,35,126,0.10)",
              border: "1px solid #c5cae9",
            }}
          >
            {/* Row: TotalAmount (subtotal before tax) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
              <h5 style={{ color: "#1565c0", fontWeight: 500, margin: 0 }}>Total Amount</h5>
              <h2 style={{ margin: 0, color: "#1565c0" }}>{formatNumber(productH.TotalAmount)}</h2>
            </div>

            {/* Row: TotalVat */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
              <h5 style={{ color: "#1565c0", fontWeight: 500, margin: 0 }}>TotalVat VAT 7%</h5>
              <h2 style={{ margin: 0, color: "#1565c0" }}>{formatNumber(productH.TotalVat)}</h2>
            </div>

            {/* Row: TotalWht */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
              <h5 style={{ color: "#1565c0", fontWeight: 500, margin: 0 }}>TotalWht</h5>
              <h2 style={{ margin: 0, color: "#1565c0" }}>{formatNumber(productH.TotalWht)}</h2>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1.5px solid #9fa8da", margin: "6px 8px" }} />

            {/* Row: TotalNet — highlighted */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                background: "linear-gradient(135deg, #1a237e, #1565c0)",
                borderRadius: "8px",
              }}
            >
              <h5 style={{ color: "#ffffff", fontWeight: 700, margin: 0, letterSpacing: "0.04em" }}>TotalNet</h5>
              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                }}
              >
                {formatNumber(productH.TotalNet)}
              </h2>
            </div>
          </div>
        ))}
        <div>&nbsp;</div>
      </div>
    </div>
  );
}

export default SRListDTAU;
