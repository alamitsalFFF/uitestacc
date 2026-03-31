import './App.css';
import { Home } from './Home';
import { Warehouse } from './components/Warehouse';
import WarehouseList from './components/master/WarehouseList';
import Warehouses from './components/master/Warehouse';
import ProductTypeList from './components/master/ProductTypeList';
import ProductType from './components/master/ProductType';
import ProductList from './components/master/ProductList';
import Product from './components/master/Product';
import { Products } from './components/Product Group';
import { ProductTypes } from './components/ProductTypes';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProductListcard from './components/Cardproduct';
import React from 'react';
import PurchaseOrder from './components/Purchase Order';
import PurchaseRequisition from './components/transaction/Purchase Requisition';
import CashSale from './components/cash management/AccordionCashSaleMain';
import CashSaleData from './components/cash management/AccordionCashSaleData';
import MenuMain from './components/menu/MenuMain'
import MenuManagement from './components/menu/MenuManagement';
import MenuMaster from './components/menu/MenuMas';
import MenuEntries from './components/menu/MenuEntries';
import MenuAPI2 from './components/MenuAPI2';
import MenuCard from './components/menu/MenuCard_1';
import MenuCardAC from './components/menu/MenuCardAC';
import MenuCardFC from './components/menu/MenuCardFC';
import Transaction from './components/transaction/Transaction';
import TransactionDT from './components/transaction/TransactionDT';
import QuickBuy from './components/cash management/Quick Buy';
import QuickCash from './components/cash management/Quick Cash';
import QCSupplier from './components/cash management/Supplier';
import ProductSelection from './components/transaction/ProductSelection';
import EditDetail from './components/transaction/EditDetail';
import MenuCardM1 from './components/menu/MenuCardM1';
import MenuCardPC from './components/menu/MenuCardPC';
import MenuCardSC from './components/menu/MenuCardSC';
import MenuCardMA from './components/menu/MenuCardMA';
import AddDetail from './components/transaction/AddDetail';
import PurchaseRequisitionList from './components/purchase/ListPR';
import PRHeader from './components/purchase/Purchase Requisition/PRHeaderAU';
import PRListDT from './components/purchase/PRListDT';
import TransactionList from './components/transaction/TransactionList';
import FromPrint from './components/purchase/FromPR';
import PRConfirm from './components/approving/PRConfirm';
import ListPOHD from './components/purchase/Purchase Order/ListPO';
import POHeader from './components/purchase/Purchase Order/POHeader';
import PRSelection from './components/purchase/Purchase Order/SelectPR';
import POListDT from './components/purchase/Purchase Order/POListDT';
import MenuCardAP from './components/menu/MenuCardAP';
import POEditDetail from './components/purchase/Purchase Order/POEditDetail';
import POAddDetail from './components/purchase/Purchase Order/POAddDetail';
import POselectProduct from './components/purchase/Purchase Order/POselectProduct';
import POForm from './components/purchase/Purchase Order/POform';
import DIHDList from './components/Delivery/Delivery In/DIList';
import DIHeader from './components/Delivery/Delivery In/DIHeader';
import DOHDList from './components/Delivery/Delivery Out/DOList';
import CustomerList from './components/master/CustomerList';
import DIDTList from './components/Delivery/Delivery In/DIDTList';
import DIEditDetail from './components/Delivery/Delivery In/DIEditDetail';
import DIAddDetail from './components/Delivery/Delivery In/DIAddDetail';
import DOHeader from './components/Delivery/Delivery Out/DOHeader';
import DODTList from './components/Delivery/Delivery Out/DODTList';
import DOEditDetail from './components/Delivery/Delivery Out/DOEditDetail';
import DOAddDetail from './components/Delivery/Delivery Out/DOAddDetail';
import DIselectProduct from './components/Delivery/Delivery In/DIselectProduct';
import POConfirm from './components/approving/POConfirm';
import MenuCardDC from './components/menu/MenuCardDC';
import PIHDList from './components/Payment Invoice/PIList';
import SIHDList from './components/Sales/Sale Invoice/SIListOLD';
import PIHeader from './components/Payment Invoice/PIHeader';
import PIDTList from './components/Payment Invoice/PIDTList';
import PIAddDetail from './components/Payment Invoice/PIAddDetail';
import PIEditDetail from './components/Payment Invoice/PIEditDetail';
import PVHDList from './components/Payment Voucher/PVList';
import AccCode from './components/master/AccCode';
import PVDTList from './components/Payment Voucher/PVDTList';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
// import tawanImagelogo from "../../src/components/img/tawanlogo.png";
import tawanlogo from "./components/img/tawanlogo.png";
import TAWAN_logo from './components/img/TAWAN_logo.png';
import thai from './components/img/thai.png';
import en from './components/img/en.png';
import AccCodeList from './components/master/AccCode1';
import AccountCode from './components/master/AccountCode';
import PVHeader from './components/Payment Voucher/PVHeader';
import PVListDT from './components/Payment Voucher/PVListDT';
import PVEditDetail from './components/Payment Voucher/PVEditDetail';
import Customer from './components/master/Customer';
import SupplierList from './components/master/SupplierList';
import Supplier from './components/master/Supplier';
import SRList from './components/Sales/Sales Requisition/SRList';
import SRHeader from './components/Sales/Sales Requisition/SRHeader';
import SRConfirm from './components/approving/SRConfirm';
import SRListDT from './components/Sales/Sales Requisition/SRListDT';
import SREditDetail from './components/Sales/Sales Requisition/SREditDetail';
import SRProductSelection from './components/Sales/Sales Requisition/SRProductSelection';
import SRAddDetail from './components/Sales/Sales Requisition/SRAddDetail';
import SOList from './components/Sales/Sales Order/SOList';
import SOHeader from './components/Sales/Sales Order/SOHeader';
import SOListDT from './components/Sales/Sales Order/SOListDT';
import SOProductSelection from './components/Sales/Sales Order/SOProductSelection';
import SOAddDetail from './components/Sales/Sales Order/SOAddDetail';
import SOEditDetail from './components/Sales/Sales Order/SOEditDetail';
import SIHeader from './components/Sales/Sale Invoice/SIHeader';
import RVHeader from './components/Receive Voucher/RVHeader';
import RVList from './components/Receive Voucher/RVList';
import SIListDT from './components/Sales/Sale Invoice/SIListDT';
import SIProductSelection from './components/Sales/Sale Invoice/SIProductSelection';
import SIAddDetail from './components/Sales/Sale Invoice/SIAddDetail';
import SIEditDetail from './components/Sales/Sale Invoice/SIEditDetail';
import RVListDT from './components/Receive Voucher/RVListDT';
import RVEditDetail from './components/Receive Voucher/RVEditDetail1';
import RVDTList from './components/Receive Voucher/RVDTList';
import JVList from './components/Journal Voucher/JVList';
import JVDTList from './components/Journal Voucher/JVDTList';
import TBList from './components/Trial Balance/TBList';
import TrialBalance from './components/Trial Balance/TrialBalance';
import GLList from './components/Trial Balance/GLList';
import AccConfig from './components/master/AccConfig/AccConfig';
import AccConfigList from './components/master/AccConfig/AccConfigList';
import DocConfigSchema from './components/master/Optional Field/DocConfigSchema';
import DocConfigSchemaList from './components/master/Optional Field/DocConfigSchemaList';
import MoreInfoHD from './components/AdditionData/AdditionDataHD/MoreInfoHD';
import MoreInfoDT from './components/AdditionData/AdditionDataTD/MoreInfoDT';
import LoginForm from './components/Login/Login';
import RequireAuth from './components/Auth/RequireAuth';
import PlatinumMenu from './components/menu/MenuCard';
import AccountingAppGreen from './components/menu/AccountingAppGreen';
import { AuthProvider } from './components/Auth/AuthContext';
// import {useNavigate } from "react-router-dom";
import { set401Handler } from './components/Auth/axiosConfig';
import { useAuth } from './components/Auth/AuthContext';
import LoginModal from './components/Login/LoginModal';
import HeaderBar from './components/menu/HeaderBar';
import SRDropdowns from './components/Sales/Sales Requisition/SRDropdown';
import SRListAU from './components/Sales/Sales Requisition/SRListAU';
import PRList from './components/purchase/Purchase Requisition/PRList';
import PRDT from './components/purchase/Purchase Requisition/PRDT';
import PREditDetail from './components/purchase/Purchase Requisition/PREditDetail';
import ReportPage from './components/Report/Report';
import AccordionPR from './components/purchase/Purchase Requisition/AccordionPR';
import ProductSelectPR from './components/purchase/Purchase Requisition/ProductSelectionPR';
import PRAddDTAU from './components/purchase/Purchase Requisition/PRAddDTAU';
import ServiceList from './components/master/ServiceList';
import Service from './components/master/Service';
import IngredientList from './components/master/IngredientList';
import Ingredient from './components/master/Ingredient';
import TypeServiceList from './components/master/TypeServiceList';
import TypeService from './components/master/TypeService';
import TypeIngredient from './components/master/TypeIngredient';
import TypeIngredientList from './components/master/TypeIngredientList';
import AccCodefull from './components/master/AccCodeFull';
import AccordionPO from './components/purchase/Purchase Order/AccordionPO';
import AccordionDI from './components/Delivery/Delivery In/AccordionDI';
import AccordionDIHD from './components/Delivery/Delivery In/AccordionDIHD';
import AccordionCS from './components/cash management/AccordionCS';
import AccordionQB from './components/cash management/AccordionQB';
import APIMenu from './components/APIMenu';
import AccordionPI from './components/Payment Invoice/AccordionPI';
import AccordionPIHD from './components/Payment Invoice/AccordionPIHD';
import AccordionPIDT from './components/Payment Invoice/AccordionPIDT';
import PIList from './components/Payment Invoice/ListPI';
import AccordionPV from './components/Payment Voucher/AccordionPV';
import PCList from './components/Cheque Payment/PCList';
import AccordionQP from './components/cash management/AccordionQP';
import AccordionQR from './components/cash management/AccordionQR';
import AccordionPC from './components/Cheque Payment/AccordionPC';
import AccordionWHT from './components/Withholding Tax/AccordionWHT';
import AccordionSR from './components/Sales/Sales Requisition/AccordionSR';
import AccordionSO from './components/Sales/Sales Order/AccordionSO';
import AccordionDO from './components/Delivery/Delivery Out/AccordionDO';
import DraftOCRDI from './components/Delivery/Delivery In/DraftDI';
import DraftDataFromOCR from './components/Delivery/DraftData/DraftDataFromOCR';
import SIList from './components/Sales/Sale Invoice/SIList';
import AccordionSI from './components/Sales/Sale Invoice/AccordionSI';
import RCList from './components/Cheque Receive/RCList';
import AccordionRC from './components/Cheque Receive/AccordionRC';
import AccordionRV from './components/Receive Voucher/AccordionRV';
import TransList from './components/transaction/TransList';
import TransactionMain from './components/transaction/TransactionMain';
import PVHDList1 from './components/Payment Voucher/PVList1';
import RVList1 from './components/Receive Voucher/RVList1';
import ProfileConfig from './components/master/ProfileConfig/ProfileConfig';
import DraftData from './components/Delivery/DraftData/DraftData';
import DraftDataOCR from './components/Delivery/Delivery In/DraftDataOCR';
import WHTList from './components/Withholding Tax/WHTList';
import { URL } from './components/api/url';
import AccountingAppMenu from './components/menu/AccountingAppMenu';

function App() {
  const { showLoginModal } = useAuth();

  React.useEffect(() => {
    set401Handler(showLoginModal);
  }, [showLoginModal]);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <TbBaselineDensitySmall /> */}
        <div className="dashboard">
          {/* <HeaderBar /> */}
          <Routes>
            <Route path="uitestacc/Login" element={<LoginForm />} />
            <Route path="..." element={<RequireAuth>...</RequireAuth>} />          {/* <Route path="/"element={<RequireAuth><Navigate to="uitestacc/CashSale" replace /></RequireAuth>} /> Redirect to Home by default */}
            <Route path="/" element={<RequireAuth><Navigate to="uitestacc/Login" replace /></RequireAuth>} /> Redirect to Home by default
            <Route path="Home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="uitestacc/MenuCard" element={<RequireAuth><MenuCard /></RequireAuth>} />
            <Route path="uitestacc/MenuCardAC" element={<RequireAuth><MenuCardAC /></RequireAuth>} />
            <Route path="uitestacc/MenuCardFC" element={<RequireAuth><MenuCardFC /></RequireAuth>} />
            <Route path="uitestacc/MenuCardM1" element={<RequireAuth><MenuCardM1 /></RequireAuth>} />
            <Route path="uitestacc/MenuCardMA" element={<RequireAuth><MenuCardMA /></RequireAuth>} />
            <Route path="uitestacc/MenuCardPC" element={<RequireAuth><MenuCardPC /></RequireAuth>} />
            <Route path="uitestacc/MenuCardSC" element={<RequireAuth><MenuCardSC /></RequireAuth>} />
            <Route path="uitestacc/MenuCardAP" element={<RequireAuth><MenuCardAP /></RequireAuth>} />
            <Route path="uitestacc/MenuCardDC" element={<RequireAuth><MenuCardDC /></RequireAuth>} />

            <Route path="uitestacc/ProductListcard" element={<RequireAuth><ProductListcard /></RequireAuth>} />
            <Route path="uitestacc/ProductsBK" element={<RequireAuth><Products /></RequireAuth>} />  {/* testformDLO */}
            <Route path="uitestacc/ProductTypeBK" element={<RequireAuth><ProductTypes /></RequireAuth>} />
            {/*<Route path="uitestacc/Warehouse"element={<RequireAuth><Warehouse /></RequireAuth>} /> */} {/* testformDLO */}
            <Route path="uitestacc/WarehouseList" element={<RequireAuth><WarehouseList /></RequireAuth>} />
            <Route path="uitestacc/Warehouses" element={<RequireAuth><WarehouseList /></RequireAuth>} />
            <Route path="uitestacc/Warehouse" element={<RequireAuth><Warehouses /></RequireAuth>} />
            <Route path="uitestacc/ProductTypeList" element={<RequireAuth><ProductTypeList /></RequireAuth>} />
            <Route path="uitestacc/ProductTypes" element={<RequireAuth><ProductTypeList /></RequireAuth>} />
            <Route path="uitestacc/ProductType" element={<RequireAuth><ProductType /></RequireAuth>} />
            <Route path="uitestacc/ProductList" element={<RequireAuth><ProductList /></RequireAuth>} />
            <Route path="uitestacc/Products" element={<RequireAuth><ProductList /></RequireAuth>} />
            <Route path="uitestacc/Product" element={<RequireAuth><Product /></RequireAuth>} />

            <Route path="uitestacc/ServiceList" element={<RequireAuth><ServiceList /></RequireAuth>} />
            <Route path="uitestacc/Services" element={<RequireAuth><ServiceList /></RequireAuth>} />
            <Route path="uitestacc/Service" element={<RequireAuth><Service /></RequireAuth>} />

            <Route path="uitestacc/IngredientList" element={<RequireAuth><IngredientList /></RequireAuth>} />
            <Route path="uitestacc/FixedAssets" element={<RequireAuth><IngredientList /></RequireAuth>} />
            <Route path="uitestacc/FixedAsset" element={<RequireAuth><Ingredient /></RequireAuth>} />

            <Route path="uitestacc/PR" element={<RequireAuth><PurchaseRequisition /></RequireAuth>} />
            <Route path="uitestacc/PurchaseOrder" element={<RequireAuth><PurchaseOrder /></RequireAuth>} />
            {/* <Route path="JournalEntries"element={<RequireAuth><JournalEntries /></RequireAuth>} />  */}
            {/* <Route path="uitestacc/Transaction"element={<RequireAuth><FromTransaction /></RequireAuth>} /> */}
            <Route path="uitestacc/Transaction2" element={<RequireAuth><Transaction /></RequireAuth>} />
            <Route path="uitestacc/TransactionDT" element={<RequireAuth><TransactionDT /></RequireAuth>} />
            <Route path="uitestacc/PRListDT" element={<RequireAuth><PRListDT /></RequireAuth>} />
            <Route path="uitestacc/PRDT" element={<RequireAuth><PRDT /></RequireAuth>} />
            <Route path="uitestacc/PREditDetail" element={<RequireAuth><PREditDetail /></RequireAuth>} />

            <Route path="/uitestacc/TransactionList" element={<RequireAuth><TransactionList /></RequireAuth>} />
            <Route path="/uitestacc/TransactionPrint" element={<RequireAuth><FromPrint /></RequireAuth>} />
            <Route path="/uitestacc/Report" element={<RequireAuth><ReportPage /></RequireAuth>} />

            <Route path="/uitestacc/TransactionDTEdit" element={<RequireAuth><EditDetail /></RequireAuth>} />
            <Route path="/uitestacc/TransactionDTAdd" element={<RequireAuth><AddDetail /></RequireAuth>} />

            <Route path="uitestacc/MeuMain" element={<RequireAuth><MenuMain /></RequireAuth>} />
            <Route path="uitestacc/Cash" element={<RequireAuth><MenuManagement /></RequireAuth>} />
            <Route path="uitestacc/Master" element={<RequireAuth><MenuMaster /></RequireAuth>} />
            <Route path="uitestacc/Entries" element={<RequireAuth><MenuEntries /></RequireAuth>} />
            <Route path="uitestacc/MenuAPI2" element={<RequireAuth><MenuAPI2 /></RequireAuth>} />
            <Route path="uitestacc/APIMenu" element={<RequireAuth><APIMenu /></RequireAuth>} />

            <Route path="uitestacc/CashSale" element={<RequireAuth><CashSale /></RequireAuth>} />
            <Route path="uitestacc/CashSaleData" element={<RequireAuth><CashSaleData /></RequireAuth>} />

            <Route path="uitestacc/QuickBuyBK" element={<RequireAuth><QuickBuy /></RequireAuth>} />
            <Route path="uitestacc/QuickCash" element={<RequireAuth><QuickCash /></RequireAuth>} />
            <Route path="uitestacc/QCSupplier" element={<RequireAuth><QCSupplier /></RequireAuth>} />
            <Route path="uitestacc/ProductSelct" element={<RequireAuth><ProductSelection /></RequireAuth>} />
            <Route path="uitestacc/ProductSelectPR" element={<RequireAuth><ProductSelectPR /></RequireAuth>} />

            {/* PC */}
            <Route path="uitestacc/PRList" element={<RequireAuth><PurchaseRequisitionList /></RequireAuth>} />
            <Route path="uitestacc/PurchaseRequisition" element={<RequireAuth><PRList /></RequireAuth>} /> {/*ซื้อเชื่อ*/}
            <Route path="uitestacc/PRHeader" element={<RequireAuth><PRHeader /></RequireAuth>} />

            <Route path="uitestacc/PRConfirm" element={<RequireAuth><PRConfirm /></RequireAuth>} />
            <Route path="uitestacc/POConfirm" element={<RequireAuth><POConfirm /></RequireAuth>} />
            <Route path="uitestacc/SRConfirm" element={<RequireAuth><SRConfirm /></RequireAuth>} />

            <Route path="uitestacc/POList" element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path="uitestacc/CreditPurchaseOrder" element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path="uitestacc/CashPurchaseOrder" element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path="uitestacc/POHeader" element={<RequireAuth><POHeader /></RequireAuth>} />
            <Route path="uitestacc/PRSelection" element={<RequireAuth><PRSelection /></RequireAuth>} />
            <Route path="uitestacc/POListDT" element={<RequireAuth><POListDT /></RequireAuth>} />
            <Route path="uitestacc/POAddDetail" element={<RequireAuth><POAddDetail /></RequireAuth>} />
            <Route path="uitestacc/POEditDetail" element={<RequireAuth><POEditDetail /></RequireAuth>} />
            <Route path="uitestacc/POselectProduct" element={<RequireAuth><POselectProduct /></RequireAuth>} />
            <Route path="uitestacc/POForm" element={<RequireAuth><POForm /></RequireAuth>} />

            <Route path="uitestacc/DIList" element={<RequireAuth><DIHDList /></RequireAuth>} />
            <Route path="uitestacc/DeliveryIn" element={<RequireAuth><DIHDList /></RequireAuth>} />
            <Route path="uitestacc/DIHeader" element={<RequireAuth><DIHeader /></RequireAuth>} />
            <Route path="uitestacc/DIDTList" element={<RequireAuth><DIDTList /></RequireAuth>} />
            <Route path="uitestacc/DIAddDetail" element={<RequireAuth><DIAddDetail /></RequireAuth>} />
            <Route path="uitestacc/DIEditDetail" element={<RequireAuth><DIEditDetail /></RequireAuth>} />
            <Route path="uitestacc/DIselectProduct" element={<RequireAuth><DIselectProduct /></RequireAuth>} />

            <Route path="uitestacc/DOList" element={<RequireAuth><DOHDList /></RequireAuth>} />
            <Route path="uitestacc/DeliveryOut" element={<RequireAuth><DOHDList /></RequireAuth>} />
            <Route path="uitestacc/DOHeader" element={<RequireAuth><DOHeader /></RequireAuth>} />
            <Route path="uitestacc/DODTList" element={<RequireAuth><DODTList /></RequireAuth>} />
            <Route path="uitestacc/DOAddDetail" element={<RequireAuth><DOAddDetail /></RequireAuth>} />
            <Route path="uitestacc/DOEditDetail" element={<RequireAuth><DOEditDetail /></RequireAuth>} />

            <Route path="uitestacc/CustomerList" element={<RequireAuth><CustomerList /></RequireAuth>} />
            <Route path="uitestacc/Customers" element={<RequireAuth><CustomerList /></RequireAuth>} />
            <Route path="uitestacc/Customer" element={<RequireAuth><Customer /></RequireAuth>} />
            <Route path="uitestacc/Suppliers" element={<RequireAuth><SupplierList /></RequireAuth>} />
            <Route path="uitestacc/Supplier" element={<RequireAuth><Supplier /></RequireAuth>} />

            <Route path="uitestacc/PIList" element={<RequireAuth><PIList /></RequireAuth>} />
            <Route path="uitestacc/PaymentInputNote" element={<RequireAuth><PIList /></RequireAuth>} />
            {/* <Route path="uitestacc/PaymentInputNote" element={<RequireAuth><PIHDList /></RequireAuth>} /> */}
            <Route path="uitestacc/PIHeader" element={<RequireAuth><PIHeader /></RequireAuth>} />
            <Route path="uitestacc/PIDTList" element={<RequireAuth><PIDTList /></RequireAuth>} />
            <Route path="uitestacc/PIAddDetail" element={<RequireAuth><PIAddDetail /></RequireAuth>} />
            <Route path="uitestacc/PIEditDetail" element={<RequireAuth><PIEditDetail /></RequireAuth>} />
            <Route path="uitestacc/AccordionPI" element={<RequireAuth><AccordionPI /></RequireAuth>} />
            <Route path="uitestacc/AccordionPIHD" element={<RequireAuth><AccordionPIHD /></RequireAuth>} />
            <Route path="uitestacc/AccordionPIDT" element={<RequireAuth><AccordionPIDT /></RequireAuth>} />
            <Route path="uitestacc/AccordionPV" element={<RequireAuth><AccordionPV /></RequireAuth>} />

            <Route path="uitestacc/PVList" element={<RequireAuth><PVHDList /></RequireAuth>} />
            <Route path="uitestacc/PaymentVoucher" element={<RequireAuth><PVHDList /></RequireAuth>} />
            <Route path="uitestacc/PVList1" element={<RequireAuth><PVHDList1 /></RequireAuth>} />
            <Route path="uitestacc/PVDTList" element={<RequireAuth><PVDTList /></RequireAuth>} />
            <Route path="uitestacc/PVHeader" element={<RequireAuth><PVHeader /></RequireAuth>} />
            <Route path="uitestacc/PVListDT" element={<RequireAuth><PVListDT /></RequireAuth>} />
            <Route path="uitestacc/PVEditDetail" element={<RequireAuth><PVEditDetail /></RequireAuth>} />

            {/* <Route path="uitestacc/SIList"element={<RequireAuth><SIHDList /></RequireAuth>} /> */}
            <Route path="uitestacc/SIList" element={<RequireAuth><SIList /></RequireAuth>} />
            <Route path="uitestacc/SalesInvoice" element={<RequireAuth><SIList /></RequireAuth>} />
            <Route path="uitestacc/SIHeader" element={<RequireAuth><SIHeader /></RequireAuth>} />
            <Route path="uitestacc/SIListDT" element={<RequireAuth><SIListDT /></RequireAuth>} />
            <Route path="uitestacc/SIAddDetail" element={<RequireAuth><SIAddDetail /></RequireAuth>} />
            <Route path="uitestacc/SIEditDetail" element={<RequireAuth><SIEditDetail /></RequireAuth>} />
            <Route path="uitestacc/SIProductSelect" element={<RequireAuth><SIProductSelection /></RequireAuth>} />
            <Route path="uitestacc/AccordionSI" element={<RequireAuth><AccordionSI /></RequireAuth>} />

            <Route path="uitestacc/SRList" element={<RequireAuth><SRList /></RequireAuth>} />
            <Route path="uitestacc/SalesRequisition" element={<RequireAuth><SRList /></RequireAuth>} />
            <Route path="uitestacc/SRHeader" element={<RequireAuth><SRHeader /></RequireAuth>} />
            <Route path="uitestacc/SRListDT" element={<RequireAuth><SRListDT /></RequireAuth>} />
            <Route path="uitestacc/SREditDetail" element={<RequireAuth><SREditDetail /></RequireAuth>} />
            <Route path="uitestacc/SRAddDetail" element={<RequireAuth><SRAddDetail /></RequireAuth>} />
            <Route path="uitestacc/SRProductSelect" element={<RequireAuth><SRProductSelection /></RequireAuth>} />

            <Route path="uitestacc/SOList" element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path="uitestacc/CashSalesOrder" element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path="uitestacc/CreditSalesOrder" element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path="uitestacc/SOHeader" element={<RequireAuth><SOHeader /></RequireAuth>} />
            <Route path="uitestacc/SOListDT" element={<RequireAuth><SOListDT /></RequireAuth>} />
            <Route path="uitestacc/SOProductSelect" element={<RequireAuth><SOProductSelection /></RequireAuth>} />
            <Route path="uitestacc/SOAddDetail" element={<RequireAuth><SOAddDetail /></RequireAuth>} />
            <Route path="uitestacc/SOEditDetail" element={<RequireAuth><SOEditDetail /></RequireAuth>} />

            <Route path="uitestacc/AccCode" element={<RequireAuth><AccCode /></RequireAuth>} />
            <Route path="uitestacc/AccCodeList" element={<RequireAuth><AccCodeList /></RequireAuth>} />
            <Route path="uitestacc/AccountCode" element={<RequireAuth><AccountCode /></RequireAuth>} />
            <Route path="uitestacc/AccCodefull" element={<RequireAuth><AccCodefull /></RequireAuth>} />
            <Route path="uitestacc/AccCodes" element={<RequireAuth><AccCodefull /></RequireAuth>} />

            <Route path="uitestacc/RVHeader" element={<RequireAuth><RVHeader /></RequireAuth>} />
            <Route path="uitestacc/RVList" element={<RequireAuth><RVList /></RequireAuth>} />
            <Route path="uitestacc/ReceiveVoucher" element={<RequireAuth><RVList /></RequireAuth>} />
            <Route path="uitestacc/RVList1" element={<RequireAuth><RVList1 /></RequireAuth>} />
            <Route path="uitestacc/RVListDT" element={<RequireAuth><RVListDT /></RequireAuth>} />
            <Route path="uitestacc/RVEditDetail" element={<RequireAuth><RVEditDetail /></RequireAuth>} />
            <Route path="uitestacc/RVDTList" element={<RequireAuth><RVDTList /></RequireAuth>} />

            <Route path="uitestacc/JVList" element={<RequireAuth><JVList /></RequireAuth>} />
            <Route path="uitestacc/JournalEntries" element={<RequireAuth><JVList /></RequireAuth>} />
            <Route path="uitestacc/JVDTList" element={<RequireAuth><JVDTList /></RequireAuth>} />

            <Route path="uitestacc/TrialBalance" element={<RequireAuth><TrialBalance /></RequireAuth>} />
            <Route path="uitestacc/GLList" element={<RequireAuth><GLList /></RequireAuth>} />
            <Route path="uitestacc/TBList" element={<RequireAuth><TBList /></RequireAuth>} />

            <Route path="uitestacc/AccConfigList" element={<RequireAuth><AccConfigList /></RequireAuth>} />
            <Route path="uitestacc/AccConfigs" element={<RequireAuth><AccConfigList /></RequireAuth>} />
            <Route path="uitestacc/AccConfig" element={<RequireAuth><AccConfig /></RequireAuth>} />

            <Route path="uitestacc/DocConfigSchema" element={<RequireAuth><DocConfigSchema /></RequireAuth>} />
            <Route path="uitestacc/DocConfigSchemaList" element={<RequireAuth><DocConfigSchemaList /></RequireAuth>} />
            <Route path="uitestacc/OptionalFieldSchemas" element={<RequireAuth><DocConfigSchemaList /></RequireAuth>} />

            <Route path="uitestacc/MoreInfoHD" element={<RequireAuth><MoreInfoHD /></RequireAuth>} />
            <Route path="uitestacc/MoreInfoDT" element={<RequireAuth><MoreInfoDT /></RequireAuth>} />

            {/* <Route path="uitestacc/Login"element={<LoginForm /> }/> */}

            <Route path="uitestacc/PlatinumMenu" element={<RequireAuth><PlatinumMenu /></RequireAuth>} />
            <Route path={`${URL}index`} element={<RequireAuth><AccountingAppGreen /></RequireAuth>} /> {/*MENU*/}
            <Route path={`${URL}`} element={<RequireAuth><AccountingAppMenu /></RequireAuth>} /> {/*MENU*/}
            {/* <Route path="uitestacc/LoginModal"element={<RequireAuth><LoginModal/></RequireAuth>} /> */}

            {/* <Route path="uitestacc/UF"element={<RequireAuth><UserForm /></RequireAuth>} />
          <Route path="uitestacc/FUD"element={<RequireAuth><FormUserDetails /></RequireAuth>} /> */}

            <Route path="uitestacc/SRDD" element={<RequireAuth><SRDropdowns /></RequireAuth>} />
            <Route path="uitestacc/AccordionSR" element={<RequireAuth><AccordionSR /></RequireAuth>} />
            <Route path="uitestacc/SRListAU" element={<RequireAuth><SRListAU /></RequireAuth>} />
            <Route path="uitestacc/AccordionPR" element={<RequireAuth><AccordionPR /></RequireAuth>} />
            <Route path="uitestacc/PRAddDTAU" element={<RequireAuth><PRAddDTAU /></RequireAuth>} />

            <Route path="uitestacc/AccordionCS" element={<RequireAuth><AccordionCS /></RequireAuth>} />
            <Route path="uitestacc/QuickCashSale" element={<RequireAuth><AccordionCS /></RequireAuth>} />
            {/* <Route path="uitestacc/CashSalesOrder" element={<RequireAuth><AccordionCS /></RequireAuth>} /> */}
            <Route path="uitestacc/AccordionQB" element={<RequireAuth><AccordionQB /></RequireAuth>} />
            <Route path="uitestacc/QuickBuy" element={<RequireAuth><AccordionQB /></RequireAuth>} />
            <Route path="uitestacc/AccordionQP" element={<RequireAuth><AccordionQP /></RequireAuth>} />
            <Route path="uitestacc/QuickPayment" element={<RequireAuth><AccordionQP /></RequireAuth>} />
            <Route path="uitestacc/AccordionQR" element={<RequireAuth><AccordionQR /></RequireAuth>} />
            <Route path="uitestacc/QuickReceive" element={<RequireAuth><AccordionQR /></RequireAuth>} />

            <Route path="uitestacc/AccordionWHT" element={<RequireAuth><AccordionWHT /></RequireAuth>} />
            {/* <Route path="uitestacc/WithholdingTax" element={<RequireAuth><WHTList /></RequireAuth>} /> */}
            <Route path="uitestacc/WithholdingTax" element={<RequireAuth><AccordionWHT /></RequireAuth>} />

            <Route path="uitestacc/AccordionPO" element={<RequireAuth><AccordionPO /></RequireAuth>} />
            <Route path="uitestacc/AccordionDI" element={<RequireAuth><AccordionDI /></RequireAuth>} />
            <Route path="uitestacc/DraftDI" element={<RequireAuth><DraftDataFromOCR /></RequireAuth>} />
            <Route path="uitestacc/DraftOCRDI" element={<RequireAuth><DraftOCRDI /></RequireAuth>} />

            <Route path="uitestacc/DraftData" element={<RequireAuth><DraftData /></RequireAuth>} />
            <Route path="uitestacc/DraftDataEntry" element={<RequireAuth><DraftDataOCR /></RequireAuth>} />

            <Route path="uitestacc/AccordionSO" element={<RequireAuth><AccordionSO /></RequireAuth>} />
            <Route path="uitestacc/AccordionDO" element={<RequireAuth><AccordionDO /></RequireAuth>} />

            <Route path="uitestacc/TypeServiceList" element={<RequireAuth><TypeServiceList /></RequireAuth>} />
            <Route path="uitestacc/TypeService" element={<RequireAuth><TypeService /></RequireAuth>} />
            <Route path="uitestacc/TypeIngredientList" element={<RequireAuth><TypeIngredientList /></RequireAuth>} />
            <Route path="uitestacc/FixedAssetsType" element={<RequireAuth><TypeIngredientList /></RequireAuth>} />
            <Route path="uitestacc/TypeIngredient" element={<RequireAuth><TypeIngredient /></RequireAuth>} />

            <Route path="uitestacc/PCList" element={<RequireAuth><PCList /></RequireAuth>} />
            <Route path="uitestacc/PaymentConfirm" element={<RequireAuth><PCList /></RequireAuth>} />
            <Route path="uitestacc/AccordionPC" element={<RequireAuth><AccordionPC /></RequireAuth>} />

            <Route path="uitestacc/RCList" element={<RequireAuth><RCList /></RequireAuth>} />
            <Route path="uitestacc/ReceiveConfirm" element={<RequireAuth><RCList /></RequireAuth>} />
            <Route path="uitestacc/AccordionRC" element={<RequireAuth><AccordionRC /></RequireAuth>} />

            <Route path="uitestacc/AccordionRV" element={<RequireAuth><AccordionRV /></RequireAuth>} />

            <Route path="uitestacc/TransList" element={<RequireAuth><TransList /></RequireAuth>} />
            <Route path="uitestacc/Transaction" element={<RequireAuth><TransactionMain /></RequireAuth>} />

            <Route path="uitestacc/CompanyProfile" element={<RequireAuth><ProfileConfig /></RequireAuth>} />
          </Routes>
          {/* </div> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;