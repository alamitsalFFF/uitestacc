import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setAccDocNo,
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
  setNameCategory, } from "../redux/TransactionDataaction";

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
} from "@fortawesome/free-solid-svg-icons";
import "../purchase/TPR.css";
import {
  Switch,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import _ from 'lodash';

function TransactionDT() {
  const location = useLocation();
  const dispatch = useDispatch();
  const accDocNo = useSelector((state) => state.accDocNo);
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


  //ส่งค่าไปด้วยตอนไปเลือกรายการ
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
        } 
    }); 
};


//   useEffect(() => {
//     if (location.state?.selectedProducts && Array.isArray(location.state.selectedProducts)) {
//         setSelectedProducts(location.state.selectedProducts); // รับ selectedProducts มาโดยตรง
//     }
//     console.log("selectedProducts:",selectedProducts)
// }, [location.state?.selectedProducts]);
useEffect(() => {
  if (location.state?.selectedProducts && Array.isArray(location.state.selectedProducts)) {
      const combinedProducts = [...selectedProducts, ...location.state.selectedProducts];
      dispatch(setSelectedProducts(combinedProducts));
  }
}, [location.state?.selectedProducts]);

  // useEffect(() => {
  //   if (detailData) {
  //     // Calculate total amount when detailData changes
  //     const sum = detailData.reduce((accumulator, dataDetail) => {
  //       return accumulator + parseFloat(dataDetail.amount); // Parse amount as float
  //     }, 0);
  //     setTotalAmount(parseFloat(sum.toFixed(4)));

  //     const vatRate =detailData.length > 0 ? detailData[0].rateVat / 100 : 0.07;
  //     const whtRate = detailData.length > 0 ? detailData[0].rateWht / 100 : 0;

  //     const vat = isVatEnabled ? sum * vatRate : 0;
  //     setVatAmount(parseFloat(vat.toFixed(4)));

  //     let wht = 0; // Initialize wht to 0
  //     if (whtRate > 0 && isWhtEnabled) { // Check both whtRate and isWhtEnabled
  //         wht = sum * whtRate;
  //     }
  //     setWhtAmount(parseFloat(wht.toFixed(4)));

  //   } else {
  //     setTotalAmount(0); // Reset total if detailData is null or undefined
  //     setVatAmount(0); // Reset VAT as well
  //     setWhtAmount(0); // Reset WHT
  //   }
  // }, [detailData, isVatEnabled, isWhtEnabled]);

  useEffect(() => {
    // รวมข้อมูล detailData และ addProducts
    const combinedData = [...(detailData || []), ...(addProducts || [])];

    if (combinedData.length > 0) {
        // คำนวณยอดรวมจากข้อมูลที่รวมแล้ว
        const sum = combinedData.reduce((accumulator, product) => {
            return accumulator + parseFloat(product.amount);
        }, 0);

        // คำนวณ VAT และ WHT
        const vatRate = combinedData[0].rateVat / 100;
        const whtRate = combinedData[0].rateWht / 100;
        const vat = isVatEnabled ? sum * vatRate : 0;
        const wht = isWhtEnabled ? sum * whtRate : 0;

        // อัปเดต state
        dispatch(setTotalAmount(parseFloat(sum.toFixed(4))));
        dispatch(setVatAmount(parseFloat(vat.toFixed(4))));
        dispatch(setWhtAmount(parseFloat(wht.toFixed(4))));
    } else {
        // รีเซ็ตค่าหากไม่มีข้อมูล
        dispatch(setTotalAmount(0));
        dispatch(setVatAmount(0));
        dispatch(setWhtAmount(0));
    }
}, [detailData, addProducts, isVatEnabled, isWhtEnabled, dispatch]);

  useEffect(() => {
    // ตรวจสอบว่ามี accDocNo ใน location.state หรือไม่
    const receivedAccDocNo = location.state?.accDocNo;
    if (receivedAccDocNo) {
      dispatch(setAccDocNo(receivedAccDocNo));
    }

    if (location.state) {
      const { accEffectiveDate, partyCode, partyName, nameCategory } = location.state;
      dispatch(setAccEffectiveDate(accEffectiveDate));
      dispatch(setPartyCode(partyCode));
      dispatch(setPartyName(partyName));
      dispatch(setNameCategory(nameCategory));
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    if (location.state) {
      const { accDocNo, accEffectiveDate, partyCode, partyName, nameCategory } = location.state;
      dispatch(setAccDocNo(accDocNo));
      dispatch(setAccEffectiveDate(accEffectiveDate));
      dispatch(setPartyCode(partyCode));
      dispatch(setPartyName(partyName));
      dispatch(setNameCategory(nameCategory));
    }
    if (accDocNo) {
      // console.log("accDocNo:", accDocNo);
      // console.log("accEffectiveDate:", accEffectiveDate);
      // console.log("partyCode:", partyCode);
      // console.log("partyName:", partyName);
      // console.log("accItemNo:", accItemNo);
      // console.log("nameCategory:", nameCategory);

      const fetchDetailData = async () => {
        try {
          const response = await fetch(
            `http://103.225.168.137/apiaccbk2/api/Prototype/AccTransaction/GetAccTransactionDT?accDocNo=${accDocNo}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          dispatch(setDetailData(data));
          console.log("dataDetail:",data)

        } catch (error) {
          console.error("Error fetching other API data:", error);
        }
      };

      fetchDetailData();
    }
  // }, [accDocNo, accEffectiveDate, partyCode, partyName,nameCategory, accDocNoPD,accItemNo,isproductName,price,qty]);
}, [location.state, accDocNo, dispatch]);

useEffect(() => {
  if (detailData && detailData.length > 0) { // ตรวจสอบ detailData ด้วย
      const itemNo = detailData.map(item => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
      const productName = detailData.map(item => item.salesDescription);
      setProductName(productName);
      const prices = detailData.map(item => item.price);
      setPrice(prices);
      const qtys = detailData.map(item => item.qty);
      setQty(qtys);

      setIsVatEnabled(detailData[0].rateVat > 0); // Enable if rateVat > 0
      setIsWhtEnabled(detailData[0].rateWht > 0); // Enable if rateWht > 0

  }
}, [detailData]);



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

  // const vatOptions = [{ value: 0.07, label: "7%" }];

  // const withholdingTaxOptions = [
  //   { value: 0, label: "0%" },
  //   { value: 0.03, label: "3%" },
  //   { value: 0.05, label: "5%" },
  // ];

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

const handleEditDetail = () => {
  navigate(`/uitestacc/TransactionDTEdit?accDocNo=${accDocNo}&Item=${accItemNo}`, { //Form 3 Add/Edit Detail ?DocNo=AAA&Item=n
      state: { 
          editDetail,
          accDocNo: accDocNo, // ส่ง accDocNo ไปด้วย
          accItemNo: accItemNo,
          isproductName:isproductName,
          price:price,
          qty:qty
      } 
  }); 
};
useEffect(() => {
  if (location.state?.editDetail && Array.isArray(location.state.editDetail)) {
      setEditDetail(prevEditDetail => [
          ...prevEditDetail,
          ...location.state.editDetail
      ]);
  }
}, [location.state?.editDetail]);


const [addDetail, setAddDetail] = useState([]);

useEffect(() => {
  if (detailData && detailData.length > 0) {
      const itemNo = detailData.map(item => item.accItemNo);
      setAccItemNo(itemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
  } else {
      setAccItemNo([]);
      setItemCounter(1);
  }
}, [detailData]);

// const handleAddDetail = () => {
//   const productNames = selectedProducts.map(product => product.productName);
//   const productTypeCode = selectedProducts.map(product => product.productTypeCode);
//   const rateVats = selectedProducts.map(product => product.rateVat);
//   const rateWhts = selectedProducts.map(product => product.rateWht);
//   const unitStocks = selectedProducts.map(product => product.unitStock);
//   let newItemNo = itemCounter;
//   while (accItemNo.includes(newItemNo)) {
//       newItemNo++;
//   }
//   const newItem = {
//       ...selectedProducts,
//       itemNo: newItemNo
//   };
//   dispatch(setSelectedProducts([...selectedProducts, newItem]));
//   setAccItemNo([...accItemNo, newItemNo]);
//   setItemCounter(newItemNo + 1);
  
//     navigate(`/uitestacc/TransactionDTAdd?accDocNo=${accDocNo}&Item=${itemCounter}`, { //Form 3 Add/Edit Detail ?DocNo=AAA&Item=n
//     state: {
//       // addDetail: addDetail,
//       accDocNo: accDocNo,
//       productNames: productNames,
//       productTypeCode:productTypeCode,
//       rateVats:rateVats,
//       rateWhts:rateWhts,
//       unitStocks:unitStocks,
//       selectedProducts: selectedProducts,
//       accEffectiveDate: accEffectiveDate,
//       partyCode: partyCode,
//       partyName: partyName,
//       nameCategory: nameCategory,
//       // selectedProduct: product,
//   }
//   }); 
// };

// const currentAddProducts = useSelector((state) => state.addProducts);
// useEffect(() => {
//   if (location.state?.addProducts && Array.isArray(location.state.addProducts)) {
//       const newAddProducts = location.state.addProducts;

//       // ตรวจสอบว่า newAddProducts ไม่ซ้ำกับ currentAddProducts
//       const isDifferent = JSON.stringify(newAddProducts) !== JSON.stringify(currentAddProducts);

//       if (isDifferent) {
//           dispatch(setAddProducts([...currentAddProducts, ...newAddProducts]));
//           console.log("addProducts:", newAddProducts);
//       }
//   }
// }, [location.state?.addProducts, dispatch, currentAddProducts]);

    const currentAddProducts = useSelector((state) => state.addProducts);

    const filterDuplicateProducts = (products) => {
        return products.filter((product, index, self) =>
            index === self.findIndex((p) => (
                p.saleProductCode === product.saleProductCode &&
                p.price === product.price &&
                p.qty === product.qty
            ))
        );
    };

    useEffect(() => {
        if (location.state?.addProducts && Array.isArray(location.state.addProducts)) {
            const newAddProducts = location.state.addProducts;
            const uniqueNewProducts = filterDuplicateProducts(newAddProducts);
            const uniqueCurrentProducts = filterDuplicateProducts(currentAddProducts);
            const combinedProducts = filterDuplicateProducts([...uniqueCurrentProducts, ...uniqueNewProducts]);
            const isDifferent = !_.isEqual(combinedProducts, currentAddProducts); // ใช้ lodash.isEqual

            if (isDifferent) {
                dispatch(setAddProducts(combinedProducts));
                console.log("addProducts:", combinedProducts);
            }
        }
    }, [location.state?.addProducts, dispatch, currentAddProducts]);

    // รวมข้อมูลและกรองซ้ำก่อนแสดงผล
    const combinedData = filterDuplicateProducts([...(detailData || []), ...(addProducts || [])]);


 
return (
    <div className="row" style={{ padding: "5%" }}>
      <h1 style={{ textAlign: "center" }}>{nameCategory}</h1> 
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div className="row">
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <h2 style={{ marginTop: "5px", marginLeft: "10px" }}>{accDocNo}</h2>
        </ListItem>
        <ListItem
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <p style={{ marginTop: "5px", marginLeft: "10px" }}>
            Date: &nbsp; {accEffectiveDate}
          </p>
        </ListItem>
      </div>
      <div>&nbsp;</div>
      <div className="row">
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faUserGroup}
            size="2x"
            style={{ color: "#2d01bd" }}
          />
          <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
            &nbsp; {partyName}
          </h5>
          {/* <div style={{ marginLeft: "auto" }} onClick={handlePlusClick}>
            <FontAwesomeIcon
              icon={faPlus}
              size="1x"
              style={{ color: "#0310ce" }}
            />
          </div> */}
        </ListItem>
      </div>
      
      {/* {detailData &&
        detailData.map((dataDetail, accItemNo) => (
          <div className="row" key={accItemNo}>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faBoxOpen}
                size="2x"
                style={{ color: "#2d01bd" }}
              />
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                  &nbsp; {dataDetail.salesDescription}
                </h5>
                <p>
                  &nbsp; &nbsp; {dataDetail.price}
                  {dataDetail.currency} x {dataDetail.qty}
                  {dataDetail.unitMea}
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ display: "flex" }}>
                  <h1>{dataDetail.amount}</h1>
                  &nbsp; &nbsp; &nbsp;
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="1x"
                    style={{ color: "#0310ce" }}
                    onClick={handleEditDetail}
                  />
                  
                </div>
              </div>
            </ListItem>
          </div>
        ))} */}

{/* {[...(detailData || []), ...(addProducts || [])].map((product, index) => ( */}
{combinedData.map((product, index) => (
  <div key={index}>
    <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
    <ListItem style={{ display: "flex", alignItems: "center" }}>
      <FontAwesomeIcon icon={faBoxOpen} size="2x" style={{ color: "#2d01bd" }} />
      <div>
        <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
          &nbsp; {product.salesDescription || product.productName} ({product.saleProductCode || product.productTypeCode}) x {product.unitMea || product.unitStock}
          &nbsp; &nbsp;
        </h5>
        <p>
          &nbsp; &nbsp; {product.price} {product.currency} x {product.qty} {product.unitMea || product.unitStock}
        </p>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <div style={{ display: "flex" }}>
          <h1>{product.amount}</h1>
          &nbsp; &nbsp; &nbsp;
          <FontAwesomeIcon icon={faPlus} size="1x" style={{ color: "#0310ce" }}  
          // onClick={() => handleAddDetail(product)} 
          />
        </div>
      </div>
    </ListItem>
  </div>
))}

        {/* {[...(detailData || []), ...(selectedProducts || [])].map((product,index) => (
          // <div key={product.productID}>
          <div key={index}>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faBoxOpen}
                size="2x"
                style={{ color: "#2d01bd" }}
              />
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                  &nbsp; {product.productName} ({product.productTypeCode})x{product.unitStock}
                  &nbsp; &nbsp;
                </h5>
                <p>
                  &nbsp; &nbsp; {product.price}
                  {product.currency} x {product.qty}
                  {product.unitMea}
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ display: "flex" }}>
                  <h1>{product.amount}</h1>
                  &nbsp; &nbsp; &nbsp;
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="1x"
                    style={{ color: "#0310ce" }}
                    onClick={handleAddDetail}
                    // onClick={() => handleEditProduct(product.itemNo)}
                  />
                </div>
              </div>
            </ListItem>
          </div>
        ))} */}
        
        {addProducts.map((product,index) => (
          // <div key={product.productID}>
          <div key={index}>
            <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            />
            <ListItem style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faBoxOpen}
                size="2x"
                style={{ color: "#2d01bd" }}
              />
              <div>
                <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                  &nbsp; {product.productName} ({product.productTypeCode})x{product.unitStock}
                  &nbsp; &nbsp;
                </h5>
                <p>
                  &nbsp; &nbsp; {product.price}
                  {product.currency} x {product.qty}
                  {product.unitMea}
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ display: "flex" }}>
                  <h1>{product.amount}</h1>
                  &nbsp; &nbsp; &nbsp;
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="1x"
                    style={{ color: "#0310ce" }}
                    onClick={handleEditDetail}
                  />
                </div>
              </div>
            </ListItem>
          </div>
        ))}

        {/* </ul>
        </div> */}
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faSquarePlus}
            size="2x"
            style={{ color: "#2d01bd" }}
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
          </h5>
        </ListItem>
      {/* </div> */}
      <div className="row">
        <div className="financial-form">
          <div className="label-section">
            <label>Total &nbsp; &nbsp;</label>
            <FormControlLabel
              control={<VATSwitch defaultChecked />}
              label="VAT 7%"
              checked={isVatEnabled}
              onChange={handleVatChange}
            />
            <FormControlLabel
              control={<WHTSwitch defaultChecked />}
              label="WithholdingTax"
              checked={isWhtEnabled}
              onChange={handleWhtChange}
            />
          </div>
          <div className="input-section">
            <input
              type="number"
              id="total"
              name="total"
              value={totalAmount}
              readOnly
              className="total-amount"
            />
            <input
              type="number"
              id="vat"
              name="vat"
              value={vatAmount}
              // value={isVatEnabled}
              readOnly
            />

            <input
              type="number"
              id="withholdingTax"
              name="withholdingTax"
              value={whtAmount}
              // value={isWhtEnabled}
              // onChange={handleChange}
              readOnly
            />
          </div>
        </div>
        <div>&nbsp;</div>

        <div className="row">
          <div className="col-md-6">
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled button group"
            >
              {/* <Button>Save</Button>
              <Button>New</Button> */}
            </ButtonGroup>
          </div>
          <div
            className="col-md-6"
            style={{ display: "grid", justifyItems: "flex-end" }}
          >
            {/* {showButton && ( */}
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
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDT;
