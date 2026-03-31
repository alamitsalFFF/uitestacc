//หน้านี้สำหรับเลือก product มาจาก VMas_Product
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faUserGroup,
  faSquarePlus,
  faCircleCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import axios from "../../components/Auth/axiosConfig";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import {
  faCircleArrowUp,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  setSelectedProducts,
  setAccDocNo,
} from "../redux/TransactionDataaction";
import { useDispatch, useSelector } from "react-redux";
import SearchComponent from "../purchase/SearchComponen";
import { API_VIEW_RESULT } from "../api/url";

const ItemNoContext = createContext({
  itemNo: 1,
  setItemNo: () => {},
});

const useItemNo = () => {
  const { itemNo, setItemNo } = useContext(ItemNoContext);
  return { itemNo, setItemNo };
};

function ProductSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemNo, setItemNo } = useItemNo();
  const [products, setProducts] = useState([]);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const dispatch = useDispatch();
  const { accDocNo, accEffectiveDate, partyCode, partyName, nameCategory } =
    location.state || {}; // ดึงค่าที่ส่งมา
  const [loading, setLoading] = useState(false);
  const [nextItemNo, setNextItemNo] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [materialCount, setMaterialCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [rawMaterialCount, setRawMaterialCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const VMasProduct = {
    viewName: "vMas_Product",
    parameters: [
      // { field: "productName", value: "ค่าบริการตรวจปล่อยสินค้าขาเข้า" } // การกรองข้อมูล
    ],
    results: [
      { sourceField: "productName" },
      { sourceField: "productTypeCode" },
      { sourceField: "productID" },
      // { sourceField: "AssetAccCode" },
      // { sourceField: "AssetAccMainCode" },
      // { sourceField: "AssetAccMainName" },
      // { sourceField: "AssetAccMainNameEN" },
      // { sourceField: "AssetAccName" },
      // { sourceField: "AssetAccNameEN" },
      // { sourceField: "AssetAccSide" },
      // { sourceField: "AssetAccType" },
      // { sourceField: "AssetAccTypeName" },
      // { sourceField: "AssetAccTypeNameEN" },
      // { sourceField: "ExpenseAccCode" },
      // { sourceField: "ExpenseAccMainCode" },
      // { sourceField: "ExpenseAccMainName" },
      // { sourceField: "ExpenseAccMainNameEN" },
      // { sourceField: "ExpenseAccName" },
      // { sourceField: "ExpenseAccNameEN" },
      // { sourceField: "ExpenseAccSide" },
      // { sourceField: "ExpenseAccType" },
      // { sourceField: "ExpenseAccTypeName" },
      // { sourceField: "ExpenseAccTypeNameEN" },
      // { sourceField: "IncomeAccCode" },
      // { sourceField: "IncomeAccMainCode" },
      // { sourceField: "IncomeAccMainName" },
      // { sourceField: "IncomeAccMainNameEN" },
      // { sourceField: "IncomeAccName" },
      // { sourceField: "IncomeAccNameEN" },
      // { sourceField: "IncomeAccSide" },
      // { sourceField: "IncomeAccType" },
      // { sourceField: "IncomeAccTypeName" },
      // { sourceField: "IncomeAccTypeNameEN" },
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
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       console.log("VMas_Product:", VMasProduct);
  //       setLoading(true);

  //       const response = await axios.post(
  //         "http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/",
  //         VMasProduct,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         setLoading(false);
  //         //   alert("AddProduct/service");
  //         console.log("data", response.data);
  //         setProducts(response.data);
  //         if (response.data && response.data.length > 0) {
  //           setNextItemNo(1); // เริ่มต้น itemNo ใหม่ทุกครั้งที่ข้อมูล products เปลี่ยน
  //           // นับจำนวนข้อมูลสำหรับแต่ละประเภท
  //           const materials = response.data.filter(
  //             (product) =>
  //               product.IsMaterial === true && product.IsService === false
  //           );
  //           const services = response.data.filter(
  //             (product) =>
  //               product.IsService === true && product.IsMaterial === false
  //           );
  //           const rawMaterials = response.data.filter(
  //             (product) =>
  //               product.IsMaterial === false && product.IsService === false
  //           );

  //           setMaterialCount(materials.length);
  //           setServiceCount(services.length);
  //           setRawMaterialCount(rawMaterials.length);
  //         }
  //       } else {
  //         setLoading(false);
  //         console.error("Error:", response.statusText);
  //         // setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       // setError(error.message);
  //       setLoading(false);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    let isMounted = true; // ตัวแปรเพื่อตรวจสอบว่า Component ยัง Mount อยู่หรือไม่

    (async () => {
      try {
        console.log("VMas_Product:", VMasProduct);
        setLoading(true);

        const response = await axios.post(
          `${API_VIEW_RESULT}`,
          VMasProduct,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (isMounted && response.status === 200) {
          setLoading(false);
          console.log("data", response.data);
          setProducts(response.data);
          setNextItemNo(1); // รีเซ็ต itemNo เมื่อโหลดข้อมูลใหม่
          setSelectedType(null); // รีเซ็ตประเภทที่เลือก
          setSelectedButton(null); // รีเซ็ตปุ่มที่เลือก
          setSearchTerm(""); // รีเซ็ตคำค้นหา
          setShowSearch(false); // ซ่อนช่องค้นหา
          dispatch(setSelectedProducts([]));
          // นับจำนวนข้อมูลสำหรับแต่ละประเภท (เหมือนเดิม)
          const materials = response.data.filter(
            (product) =>
              product.IsMaterial === true && product.IsService === false
          );
          const services = response.data.filter(
            (product) =>
              product.IsService === true && product.IsMaterial === false
          );
          const rawMaterials = response.data.filter(
            (product) =>
              product.IsMaterial === false && product.IsService === false
          );

          setMaterialCount(materials.length);
          setServiceCount(services.length);
          setRawMaterialCount(rawMaterials.length);
        } else if (isMounted) {
          setLoading(false);
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error:", error);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false; // Cleanup function เพื่อป้องกันการ Update State บน Unmounted Component
    };
  }, [dispatch]); // Empty dependency array หมายความว่าจะทำงานเพียงครั้งเดียวเมื่อ Component Mount

  const handleProductSelect = (product, index) => {
    const isSelected = selectedProducts.find(
      (p) => p.productID === product.productID
    );
    if (isSelected) {
      dispatch(
        setSelectedProducts(
          selectedProducts.filter((p) => p.productID !== product.productID)
        )
      ); // อัปเดต Redux Store
    } else {
      dispatch(
        setSelectedProducts([
          ...selectedProducts,
          {
            ...product,
            accDocNo: accDocNo,
            index: index,
            itemNo: selectedProducts.length,
            productID: product.productID,
            productName: product.productName, // เพิ่ม productName
            // productTypeCode: product.productTypeCode, // เพิ่ม productTypeCode
            productCode: product.productCode, // เพิ่ม productCode
            itemNo: nextItemNo,
            rateVat: product.rateVat,
            rateWht: product.rateWht,
            unitStock: product.unitStock,
            checked: false,
          },
        ])
      );
      setNextItemNo(nextItemNo + 1);
    }
    navigate(`/uitestacc/TransactionDTAdd?accDocNo=${accDocNo}`);
    // window.location.reload();
  };

  const handleMaterialSelect = () => {
    setSelectedType("material");
    setSelectedButton("material");
  };

  const handleServiceSelect = () => {
    setSelectedType("service");
    setSelectedButton("service");
  };

  const handleRewMaterialSelect = () => {
    setSelectedType("rewmaterial");
    setSelectedButton("rewmaterial");
  };

  // const handleConfirm = () => {
  //   if (selectedType) {
  //     const filteredProducts = products.filter((product) => {
  //       if (selectedType === "material") {
  //         return product.IsMaterial === true && product.IsService === false;
  //       }
  //       if (selectedType === "service") {
  //         return product.IsService === true && product.IsMaterial === false;
  //       } else if (selectedType === "rewmaterial") {
  //         return product.IsMaterial === false && product.IsService === false;
  //       }
  //       return false;
  //     });

  //     const selectedItems = selectedProducts.filter((selectedProduct) =>
  //       filteredProducts.some(
  //         (product) => product.productID === selectedProduct.productID
  //       )
  //     );

  //     navigate(`/uitestacc/AddDetail/`);
  //   } else {
  //     alert("กรุณาเลือกประเภทสินค้า/บริการ");
  //   }
  // };

  const handleSearch = (term) => {
    // ฟังก์ชันรับค่าค้นหาจาก SearchComponent
    setSearchTerm(term);
    if (!term) {
      // ถ้าช่องค้นหาว่าง ให้ซ่อนช่องค้นหา
      setShowSearch(false);
    }
  };
  const filteredMS = products.filter((product) => {
    // กรองข้อมูล
    const searchLower = searchTerm.toLowerCase();
    // const searchNumber = parseFloat(searchTerm);
    return (
      product.ProductName.toLowerCase().includes(searchLower) ||
      product.ProductID.toString().toLowerCase().includes(searchLower)
    );
  });
  const toggleSearch = () => {
    // ฟังก์ชันสำหรับสลับการแสดงผลช่องค้นหา
    setShowSearch(!showSearch);
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/PRListDT?accDocNo=${accDocNo}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ItemNoContext.Provider value={{ itemNo, setItemNo }}>
      <div>
        <h1 style={{ textAlign: "center" }}>SelectProduct/Service</h1>
        <div>&nbsp;</div>
        <div style={{ display: "flex" }}>
          <div className="col-9">
            <Stack spacing={1} sx={{ alignItems: "center" }}>
              <Stack direction="row" spacing={1}>
                <Badge
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  badgeContent={materialCount}
                  max={999}
                  color="primary"
                  sx={{ "& .MuiBadge-badge": { border: "1px solid white" } }}
                >
                  <Chip
                    label="MATERIAL"
                    color={
                      selectedButton === "material" ? "primary" : "primary"
                    }
                    variant={
                      selectedButton === "material" ? "primary" : "outlined"
                    }
                    onClick={handleMaterialSelect}
                  />
                </Badge>
                <Badge
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  badgeContent={serviceCount}
                  max={999}
                  color="success"
                  sx={{ "& .MuiBadge-badge": { border: "1px solid white" } }}
                  style={{ marginLeft: "15px" }}
                >
                  <Chip
                    label="SERVICE"
                    color={selectedButton === "service" ? "success" : "success"}
                    variant={
                      selectedButton === "service" ? "success" : "outlined"
                    }
                    onClick={handleServiceSelect}
                  />
                </Badge>
                <Badge
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  badgeContent={rawMaterialCount}
                  max={999}
                  color="secondary"
                  sx={{ "& .MuiBadge-badge": { border: "1px solid white" } }}
                  style={{ marginLeft: "15px" }}
                >
                  <Chip
                    label="RAW MATERIAL"
                    color={
                      selectedButton === "rewmaterial"
                        ? "secondary"
                        : "secondary"
                    }
                    variant={
                      selectedButton === "rewmaterial"
                        ? "secondary"
                        : "outlined"
                    }
                    onClick={handleRewMaterialSelect}
                  />
                </Badge>
              </Stack>
            </Stack>
          </div>
          <div
            // className="col-3"
            style={{ marginLeft: "auto" }}
          >
            {showSearch ? (
              <SearchComponent onSearch={handleSearch} /> // แสดง SearchComponent เมื่อ showSearch เป็น true
            ) : (
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="2x"
                style={{ color: "#2f9901" }}
                onClick={toggleSearch} // แสดงไอคอนค้นหาเมื่อ showSearch เป็น false
              />
            )}
          </div>
        </div>
        <ul>
          {products &&
            Array.isArray(products) &&
            products
              .filter((product) => {
                if (selectedType === "material") {
                  return (
                    product.IsMaterial === true && product.IsService === false
                  );
                }
                if (selectedType === "service") {
                  return (
                    product.IsService === true && product.IsMaterial === false
                  );
                } else if (selectedType === "rewmaterial") {
                  return (
                    product.IsService === false && product.IsMaterial === false
                  );
                }
                return true;
              })
              .filter((product) => {
                // เพิ่มการกรองตาม searchTerm
                if (!searchTerm) return true; // ถ้า searchTerm ว่าง แสดงทุกรายการ
                const searchLower = searchTerm.toLowerCase();
                return (
                  product.ProductName.toLowerCase().includes(searchLower) ||
                  product.ProductID.toString()
                    .toLowerCase()
                    .includes(searchLower)
                );
              })
              .map((product, index) => (
                <div
                  className="row"
                  key={product.productID}
                  onClick={() => handleProductSelect(product, index)}
                  style={{paddingLeft:"20px",paddingRight:"20px"}}
                >
                  {/* <Divider
              variant="middle"
              component="li"
              style={{ listStyle: "none" }}
            /> */}
                  <ListItem style={{ display: "flex", alignItems: "center" }}>
                    {/* <FontAwesomeIcon
                      icon={faBoxOpen}
                      size="2x"
                      style={{ color: "#2d01bd" }}
                    /> */}
                    <div>
                      <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
                        &nbsp; {product.productCode}/{product.productName} &nbsp;&nbsp;
                        {selectedProducts.find(
                          (p) => p.productID === product.productID
                        ) && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="1x"
                            style={{ color: "#a10000" }}
                          />
                        )}
                      </h5>
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
    </ItemNoContext.Provider>
  );
}
export default ProductSelection;
