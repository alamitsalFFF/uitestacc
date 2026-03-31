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
import Abbreviation from "../Abbreviation.js";
import { FormatDate } from "../FormatData.js";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PREditDetail from "./PREditDetail.js";
import { API_VIEW_RESULT } from "../../api/url.js";

function PRDT() {
  const location = useLocation();
  const dispatch = useDispatch();
  const accDocNo = useSelector((state) => state.accDocNo);
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

  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    if (
      location.state?.addProducts &&
      Array.isArray(location.state.addProducts)
    ) {
      setAddProducts(location.state.addProducts);
      console.log("addProducts:", location.state.addProducts);
      // console.log("addProductsACCDOCNO:", location.state.addProducts[0].accDocNo);
    }
  }, [location.state?.addProducts]);

  useEffect(() => {
    if (location.state && location.state.accDocNo) {
      const accDocNoFromState = location.state.accDocNo;
      const accEffectiveDateFromState = location.state.accEffectiveDate; // ดึงค่า accEffectiveDate จาก state ที่ส่งมา
      dispatch(setAccDocNo(accDocNoFromState));
      dispatch(setAccEffectiveDate(accEffectiveDateFromState)); // Dispatch ค่าที่รับมาจาก state
      console.log("accEffectiveDate from state:", accEffectiveDateFromState); // ลอง console ค่านี้ดู
      console.log("accDocNoFromState:", accDocNoFromState);
      console.log("accDocNoFromState:", typeof accDocNoFromState);
    }
  }, [location.state, dispatch]);

  const [loading, setLoading] = useState(false);
  const [prh, setPRH] = useState([]);
  const [prd, setPRD] = useState([]);

  useEffect(() => {
    if (accDocNo) {
      // ตรวจสอบว่า accDocNo มีค่าหรือไม่
      console.log("accDocNo from PRHeader:", accDocNo);
      console.log("accDocNo from PRHeader:", typeof accDocNo);

      const vPR_H = {
        viewName: "vPR_H",
        parameters: [
          { field: "AccDocType", value: "PR" },
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

      const vPR_D = {
        viewName: "vPR_D",
        parameters: [
          { field: "AccDocType", value: "PR" },
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

      // (async () => {
      //   try {
      //     setLoading(true);
      //     const responseH = await axios.post(
      //       "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
      //       vPR_H,
      //       { headers: { "Content-Type": "application/json" } }
      //     );
      //     if (responseH.status === 200) {
      //       console.log("vPR_H:", responseH.data);
      //       setPRH(responseH.data);
      //     } else {
      //       console.error("Error fetching vPR_H data");
      //     }
      //   } catch (error) {
      //     console.error("Error fetching vPR_H:", error);
      //   }

      //   try {
      //     const responseD = await axios.post(
      //       "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
      //       vPR_D,
      //       { headers: { "Content-Type": "application/json" } }
      //     );

      //     if (responseD.status === 200) {
      //       console.log("vPR_D:", responseD.data);
      //       const sortedData = responseD.data.sort(
      //         (a, b) => a.AccItemNo - b.AccItemNo
      //       );
      //       setPRD(sortedData);
      //     } else {
      //       console.log("vPR_D: No data found or error");
      //       setPRD([]); // ตั้งค่า PRD เป็น array ว่างเปล่าเมื่อไม่มีข้อมูล
      //     }
      //   } catch (error) {
      //     console.error("Error fetching vPR_D:", error);
      //     setPRD([]); // ตั้งค่า PRD เป็น array ว่างเปล่าเมื่อเกิด error
      //   } finally {
      //     setLoading(false);
      //   }
      // })();
      (async () => {
        try {
          setLoading(true);
          const responseH = await axios.post(
            API_VIEW_RESULT,
            vPR_H,
            { headers: { "Content-Type": "application/json" } }
          );

          const responseD = await axios.post(
            API_VIEW_RESULT,
            vPR_D,
            { headers: { "Content-Type": "application/json" } }
          );

          if (responseH.status === 200 && responseD.status === 200) {
            setLoading(false);
            console.log("vPR_H:", responseH.data);
            console.log("vPR_D:", responseD.data);

            const sortedData = responseD.data.sort(
              (a, b) => a.AccItemNo - b.AccItemNo
            );
            setPRH(responseH.data);
            setPRD(sortedData);
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

  const handleProductSelect = () => {
    navigate("/uitestacc/ProductSelct", {
      state: {
        // selectedProducts,
        accDocNo: accDocNo,
        accEffectiveDate: accEffectiveDate,
        partyCode: partyCode,
        partyName: partyName,
        isnameCategory: nameCategory,
        selectedProducts: selectedProducts,
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
    navigate(`/uitestacc/PRHeader?accDocNo=${accDocNo}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();

  const handlePlusClick = () => {
    navigate("/uitestacc/QCSupplier");
  };

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
  //   console.log("DocStatus:", prh[0].DocStatus);
  //   const docStatus = prh[0].DocStatus;
  //   console.log("docStatus:", docStatus);
  //   const accDocType = prh[0].AccDocType
  //   console.log('accdoctype',accDocType);
  //   navigate(
  //     `/uitestacc/PREditDetail?accDocNo=${accDocNo}&accItemNo=${AccItemNo}`,
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
  //         accDocType:accDocType,
  //         selectedDocConfigID: location.state?.selectedDocConfigID || null, // ส่ง selectedDocConfigID ถ้ามี
  //       },
  //     }
  //   );
  // };

  const handleEditDetail = (AccItemNo) => {
    console.log("DocStatus:", prh[0].DocStatus);
    const docStatus = prh[0].DocStatus;
    console.log("docStatus:", docStatus);
    const accDocType = prh[0].AccDocType;
    console.log('accdoctype', accDocType);

    // เก็บข้อมูลที่จำเป็นใน state เพื่อส่งไปยัง Modal
    setItemToEdit({
      accDocNo: accDocNo, 
      accItemNo: AccItemNo,
      isproductName: isproductName,
      price: price,
      qty:qty,
      docStatus: docStatus,
      accDocType: accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null, 
    });

    // เปิด Modal
    setShowEditDetailModal(true);
  };

  // const handleCloseEditDetailModal = () => {
  //   setShowEditDetailModal(false);
  //   setItemToEdit(null); // เคลียร์ข้อมูลเมื่อปิด Modal
  //   // อาจจะมีการ refresh ข้อมูลในหน้ารายการตรงนี้หลังจากปิด modal
  //   // เช่น fetchDataPRDetails();
  // };

  // ทำให้ handleCloseEditDetailModal มีความเสถียรด้วย useCallback
  const handleCloseEditDetailModal = useCallback(() => {
    setShowEditDetailModal(false);
    setItemToEdit(null);
    // fetchDataPRDetails(); // หากมีฟังก์ชันนี้
  }, []); // Dependency array ว่างเปล่า เพราะไม่ได้พึ่งพาค่าจาก scope ภายนอกที่เปลี่ยนบ่อยๆ


  // ในกรณีที่คุณมีการอัปเดตหรือลบข้อมูลใน Modal และต้องการให้ Parent Component ทราบ
  // const handleDetailUpdatedOrDeleted = () => {
  //   // โค้ดสำหรับ refresh ข้อมูลใน Parent Component
  //   // เช่น fetchDataPRDetails();
  //   handleCloseEditDetailModal(); // ปิด Modal หลังจากดำเนินการเสร็จสิ้น
  // };
  const handleDetailUpdatedOrDeleted = useCallback(() => {
    // โค้ดสำหรับ refresh ข้อมูลใน Parent Component
    // เช่น fetchDataPRDetails(); // หากมีฟังก์ชันนี้
    handleCloseEditDetailModal(); // ปิด Modal หลังจากดำเนินการเสร็จสิ้น
  }, [handleCloseEditDetailModal]); // พึ่งพา handleCloseEditDetailModal ที่เป็น stable แล้ว

  
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
  const handleGoMenu = () => {
    navigate(`/uitestacc/PRHeader?accDocNo=${accDocNo}`);
  };
  return (
    // <div className="row" style={{ padding: "5%" }}>
    <div>
      {/* <h1 style={{ textAlign: "center" }}>{nameCategory}</h1> */}
      <h2 style={{ textAlign: "center",textDecorationLine:"underline" }} onClick={handleGoMenu}>
        Purchase Requisition
      </h2>
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
          {/* <p>
            Date:
            {prh && prh.length > 0 && (
              <FormatDate dateString={prh[0].AccEffectiveDate} />
            )}
          </p> */}
          <p>
            Date:
            {prh && prh.length > 0 && prh[0]?.AccEffectiveDate ? (
              <FormatDate dateString={prh[0].AccEffectiveDate} />
            ) : (
              <FormatDate dateString={accEffectiveDate} />
            )}
          </p>
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
          <h5>
            &nbsp;
            {prh && prh.length > 0 && prh[0].PartyName
              ? prh[0].PartyName
              : partyName}
          </h5>
        </ListItem>
      </div>
      {prd.map((product, index) => (
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
                &nbsp; {product.AccItemNo}.&nbsp;
                {/* <Abbreviation textName={product.ProductName} /> */}
                {product.SalesDescription}
                &nbsp; &nbsp;
              </h5>
              <h6>
                &nbsp; &nbsp; {formatNumber(product.Price)}
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

      {/* <div>
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
      </div> */}
      {(!prh || prh.length === 0 || prh[0]?.DocStatus === 0) && (
        <>
          <Divider
            variant="middle"
            component="li"
            style={{ listStyle: "none" }}
          />

          <ListItem style={{ justifyContent: "center" }}>
            {/* <FontAwesomeIcon
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
              &nbsp; Add Product/Service
            </h5> */}
              <Stack direction="row" spacing={1}>
                  <Button 
                        variant="contained" 
                        color="warning"
                        style={{ width: "200px", height: "40px" ,borderRadius: "20px" }}
                        onClick={handleProductSelect}> 
                    <FontAwesomeIcon
                            icon={faSquarePlus}
                            size="2x"
                            style={{ color: "#fff", justifyItems: "end" }}
                    />
                    &nbsp;Product/Service</Button>
              </Stack>
          </ListItem>
        </>
      )}

      {showEditDetailModal && itemToEdit && (
        <PREditDetail
          open={showEditDetailModal}
          onClose={handleCloseEditDetailModal}
          onSave={handleDetailUpdatedOrDeleted} // เพิ่ม prop สำหรับเหตุการณ์บันทึก/ลบ
          onDelete={handleDetailUpdatedOrDeleted} // เพิ่ม prop สำหรับเหตุการณ์ลบ
          // ส่งข้อมูลที่เตรียมไว้ไปให้ Modal ผ่าน props
          accDocNo={itemToEdit.accDocNo}
          accItemNo={itemToEdit.accItemNo}
          docStatus={itemToEdit.docStatus}
          accDocType={itemToEdit.accDocType}
          selectedDocConfigID={itemToEdit.selectedDocConfigID}
          // ส่งข้อมูลอื่นๆ ที่ PREditDetail เคยได้รับผ่าน location.state
          isproductName={itemToEdit.isproductName}
          price={itemToEdit.price}
          qty={itemToEdit.qty}
          // ... (ส่ง props ที่เหลือทั้งหมดที่ PREditDetail ต้องการจาก location.state)
        />
      )}
      <div className="row">
        {/* <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            /> */}
        {prh.map((productH, index) => (
          <div className="financial-form" key={index} style={{ width: "94%" }}>
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
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "4px" }}
              >
                &nbsp; TotalWht &nbsp;
              </h5>
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
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(productH.TotalWht)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div>
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
        <div className="row" style={{ display: "flex" }}>
          <div className="col-6" style={{ display: "grid" }}>
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              size="2x"
              style={{
                color: "#013898",
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
              onClick={handleGoBack}
            />
          </div>
          <div
            className="col-6"
            style={{ display: "grid", justifyItems: "flex-end" }}
          >
            <FontAwesomeIcon
              icon={faCircleArrowUp}
              size="2x"
              style={{
                color: "#013898",
                cursor: "pointer",
                display: "grid",
                justifyItems: "end",
              }}
              onClick={scrollToTop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PRDT;
