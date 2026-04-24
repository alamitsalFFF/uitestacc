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
import AccordionJV from './components/Journal Voucher/AccordionJV';
import JVList1 from './components/Journal Voucher/JVList_BK';

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
            <Route path={`${URL}Login`} element={<LoginForm />} />
            <Route path="..." element={<RequireAuth>...</RequireAuth>} />          {/* <Route path="/"element={<RequireAuth><Navigate to="uitestacc/CashSale" replace /></RequireAuth>} /> Redirect to Home by default */}
            <Route path="/" element={<RequireAuth><Navigate to={`${URL}Login`} replace /></RequireAuth>} /> Redirect to Home by default
            <Route path="Home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path={`${URL}MenuCard`} element={<RequireAuth><MenuCard /></RequireAuth>} />
            <Route path={`${URL}MenuCardAC`} element={<RequireAuth><MenuCardAC /></RequireAuth>} />
            <Route path={`${URL}MenuCardFC`} element={<RequireAuth><MenuCardFC /></RequireAuth>} />
            <Route path={`${URL}MenuCardM1`} element={<RequireAuth><MenuCardM1 /></RequireAuth>} />
            <Route path={`${URL}MenuCardMA`} element={<RequireAuth><MenuCardMA /></RequireAuth>} />
            <Route path={`${URL}MenuCardPC`} element={<RequireAuth><MenuCardPC /></RequireAuth>} />
            <Route path={`${URL}MenuCardSC`} element={<RequireAuth><MenuCardSC /></RequireAuth>} />
            <Route path={`${URL}MenuCardAP`} element={<RequireAuth><MenuCardAP /></RequireAuth>} />
            <Route path={`${URL}MenuCardDC`} element={<RequireAuth><MenuCardDC /></RequireAuth>} />

            <Route path={`${URL}ProductListcard`} element={<RequireAuth><ProductListcard /></RequireAuth>} />
            <Route path={`${URL}ProductsBK`} element={<RequireAuth><Products /></RequireAuth>} />  {/* testformDLO */}
            <Route path={`${URL}ProductTypeBK`} element={<RequireAuth><ProductTypes /></RequireAuth>} />
            {/*<Route path="uitestacc/Warehouse"element={<RequireAuth><Warehouse /></RequireAuth>} /> */} {/* testformDLO */}
            <Route path={`${URL}WarehouseList`} element={<RequireAuth><WarehouseList /></RequireAuth>} />
            <Route path={`${URL}Warehouses`} element={<RequireAuth><WarehouseList /></RequireAuth>} />
            <Route path={`${URL}Warehouse`} element={<RequireAuth><Warehouses /></RequireAuth>} />
            <Route path={`${URL}ProductTypeList`} element={<RequireAuth><ProductTypeList /></RequireAuth>} />
            <Route path={`${URL}ProductTypes`} element={<RequireAuth><ProductTypeList /></RequireAuth>} />
            <Route path={`${URL}ProductType`} element={<RequireAuth><ProductType /></RequireAuth>} />
            <Route path={`${URL}ProductList`} element={<RequireAuth><ProductList /></RequireAuth>} />
            <Route path={`${URL}Products`} element={<RequireAuth><ProductList /></RequireAuth>} />
            <Route path={`${URL}Product`} element={<RequireAuth><Product /></RequireAuth>} />

            <Route path={`${URL}ServiceList`} element={<RequireAuth><ServiceList /></RequireAuth>} />
            <Route path={`${URL}Services`} element={<RequireAuth><ServiceList /></RequireAuth>} />
            <Route path={`${URL}Service`} element={<RequireAuth><Service /></RequireAuth>} />

            <Route path={`${URL}IngredientList`} element={<RequireAuth><IngredientList /></RequireAuth>} />
            <Route path={`${URL}FixedAssets`} element={<RequireAuth><IngredientList /></RequireAuth>} />
            <Route path={`${URL}FixedAsset`} element={<RequireAuth><Ingredient /></RequireAuth>} />

            <Route path={`${URL}PR`} element={<RequireAuth><PurchaseRequisition /></RequireAuth>} />
            <Route path={`${URL}PurchaseOrder`} element={<RequireAuth><PurchaseOrder /></RequireAuth>} />
            {/* <Route path="JournalEntries"element={<RequireAuth><JournalEntries /></RequireAuth>} />  */}
            {/* <Route path={`${URL}Transaction`}element={<RequireAuth><FromTransaction /></RequireAuth>} /> */}
            <Route path={`${URL}Transaction2`} element={<RequireAuth><Transaction /></RequireAuth>} />
            <Route path={`${URL}TransactionDT`} element={<RequireAuth><TransactionDT /></RequireAuth>} />
            <Route path={`${URL}PRListDT`} element={<RequireAuth><PRListDT /></RequireAuth>} />
            <Route path={`${URL}PRDT`} element={<RequireAuth><PRDT /></RequireAuth>} />
            <Route path={`${URL}PREditDetail`} element={<RequireAuth><PREditDetail /></RequireAuth>} />

            <Route path={`${URL}TransactionList`} element={<RequireAuth><TransactionList /></RequireAuth>} />
            <Route path={`${URL}TransactionPrint`} element={<RequireAuth><FromPrint /></RequireAuth>} />
            <Route path={`${URL}Report`} element={<RequireAuth><ReportPage /></RequireAuth>} />

            <Route path={`${URL}TransactionDTEdit`} element={<RequireAuth><EditDetail /></RequireAuth>} />
            <Route path={`${URL}TransactionDTAdd`} element={<RequireAuth><AddDetail /></RequireAuth>} />

            <Route path={`${URL}MeuMain`} element={<RequireAuth><MenuMain /></RequireAuth>} />
            <Route path={`${URL}Cash`} element={<RequireAuth><MenuManagement /></RequireAuth>} />
            <Route path={`${URL}Master`} element={<RequireAuth><MenuMaster /></RequireAuth>} />
            <Route path={`${URL}Entries`} element={<RequireAuth><MenuEntries /></RequireAuth>} />
            <Route path={`${URL}MenuAPI2`} element={<RequireAuth><MenuAPI2 /></RequireAuth>} />
            <Route path={`${URL}APIMenu`} element={<RequireAuth><APIMenu /></RequireAuth>} />

            <Route path={`${URL}CashSale`} element={<RequireAuth><CashSale /></RequireAuth>} />
            <Route path={`${URL}CashSaleData`} element={<RequireAuth><CashSaleData /></RequireAuth>} />

            <Route path={`${URL}QuickBuyBK`} element={<RequireAuth><QuickBuy /></RequireAuth>} />
            <Route path={`${URL}QuickCash`} element={<RequireAuth><QuickCash /></RequireAuth>} />
            <Route path={`${URL}QCSupplier`} element={<RequireAuth><QCSupplier /></RequireAuth>} />
            <Route path={`${URL}ProductSelct`} element={<RequireAuth><ProductSelection /></RequireAuth>} />
            <Route path={`${URL}ProductSelectPR`} element={<RequireAuth><ProductSelectPR /></RequireAuth>} />

            {/* PC */}
            <Route path={`${URL}PRList`} element={<RequireAuth><PurchaseRequisitionList /></RequireAuth>} />
            <Route path={`${URL}PurchaseRequisition`} element={<RequireAuth><PRList /></RequireAuth>} /> {/*ซื้อเชื่อ*/}
            <Route path={`${URL}PRHeader`} element={<RequireAuth><PRHeader /></RequireAuth>} />

            <Route path={`${URL}PRConfirm`} element={<RequireAuth><PRConfirm /></RequireAuth>} />
            <Route path={`${URL}POConfirm`} element={<RequireAuth><POConfirm /></RequireAuth>} />
            <Route path={`${URL}SRConfirm`} element={<RequireAuth><SRConfirm /></RequireAuth>} />

            <Route path={`${URL}POList`} element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path={`${URL}CreditPurchaseOrder`} element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path={`${URL}CashPurchaseOrder`} element={<RequireAuth><ListPOHD /></RequireAuth>} />
            <Route path={`${URL}POHeader`} element={<RequireAuth><POHeader /></RequireAuth>} />
            <Route path={`${URL}PRSelection`} element={<RequireAuth><PRSelection /></RequireAuth>} />
            <Route path={`${URL}POListDT`} element={<RequireAuth><POListDT /></RequireAuth>} />
            <Route path={`${URL}POAddDetail`} element={<RequireAuth><POAddDetail /></RequireAuth>} />
            <Route path={`${URL}POEditDetail`} element={<RequireAuth><POEditDetail /></RequireAuth>} />
            <Route path={`${URL}POselectProduct`} element={<RequireAuth><POselectProduct /></RequireAuth>} />
            <Route path={`${URL}POForm`} element={<RequireAuth><POForm /></RequireAuth>} />

            <Route path={`${URL}DIList`} element={<RequireAuth><DIHDList /></RequireAuth>} />
            <Route path={`${URL}DeliveryIn`} element={<RequireAuth><DIHDList /></RequireAuth>} />
            <Route path={`${URL}DIHeader`} element={<RequireAuth><DIHeader /></RequireAuth>} />
            <Route path={`${URL}DIDTList`} element={<RequireAuth><DIDTList /></RequireAuth>} />
            <Route path={`${URL}DIAddDetail`} element={<RequireAuth><DIAddDetail /></RequireAuth>} />
            <Route path={`${URL}DIEditDetail`} element={<RequireAuth><DIEditDetail /></RequireAuth>} />
            <Route path={`${URL}DIselectProduct`} element={<RequireAuth><DIselectProduct /></RequireAuth>} />

            <Route path={`${URL}DOList`} element={<RequireAuth><DOHDList /></RequireAuth>} />
            <Route path={`${URL}DeliveryOut`} element={<RequireAuth><DOHDList /></RequireAuth>} />
            <Route path={`${URL}DOHeader`} element={<RequireAuth><DOHeader /></RequireAuth>} />
            <Route path={`${URL}DODTList`} element={<RequireAuth><DODTList /></RequireAuth>} />
            <Route path={`${URL}DOAddDetail`} element={<RequireAuth><DOAddDetail /></RequireAuth>} />
            <Route path={`${URL}DOEditDetail`} element={<RequireAuth><DOEditDetail /></RequireAuth>} />

            <Route path={`${URL}CustomerList`} element={<RequireAuth><CustomerList /></RequireAuth>} />
            <Route path={`${URL}Customers`} element={<RequireAuth><CustomerList /></RequireAuth>} />
            <Route path={`${URL}Customer`} element={<RequireAuth><Customer /></RequireAuth>} />
            <Route path={`${URL}Suppliers`} element={<RequireAuth><SupplierList /></RequireAuth>} />
            <Route path={`${URL}Supplier`} element={<RequireAuth><Supplier /></RequireAuth>} />

            <Route path={`${URL}PIList`} element={<RequireAuth><PIList /></RequireAuth>} />
            <Route path={`${URL}PaymentInputNote`} element={<RequireAuth><PIList /></RequireAuth>} />
            {/* <Route path="uitestacc/PaymentInputNote" element={<RequireAuth><PIHDList /></RequireAuth>} /> */}
            <Route path={`${URL}PIHeader`} element={<RequireAuth><PIHeader /></RequireAuth>} />
            <Route path={`${URL}PIDTList`} element={<RequireAuth><PIDTList /></RequireAuth>} />
            <Route path={`${URL}PIAddDetail`} element={<RequireAuth><PIAddDetail /></RequireAuth>} />
            <Route path={`${URL}PIEditDetail`} element={<RequireAuth><PIEditDetail /></RequireAuth>} />
            <Route path={`${URL}AccordionPI`} element={<RequireAuth><AccordionPI /></RequireAuth>} />
            <Route path={`${URL}AccordionPIHD`} element={<RequireAuth><AccordionPIHD /></RequireAuth>} />
            <Route path={`${URL}AccordionPIDT`} element={<RequireAuth><AccordionPIDT /></RequireAuth>} />
            <Route path={`${URL}AccordionPV`} element={<RequireAuth><AccordionPV /></RequireAuth>} />

            <Route path={`${URL}PVList`} element={<RequireAuth><PVHDList /></RequireAuth>} />
            <Route path={`${URL}PaymentVoucher`} element={<RequireAuth><PVHDList /></RequireAuth>} />
            <Route path={`${URL}PVList1`} element={<RequireAuth><PVHDList1 /></RequireAuth>} />
            <Route path={`${URL}PVDTList`} element={<RequireAuth><PVDTList /></RequireAuth>} />
            <Route path={`${URL}PVHeader`} element={<RequireAuth><PVHeader /></RequireAuth>} />
            <Route path={`${URL}PVListDT`} element={<RequireAuth><PVListDT /></RequireAuth>} />
            <Route path={`${URL}PVEditDetail`} element={<RequireAuth><PVEditDetail /></RequireAuth>} />

            {/* <Route path="uitestacc/SIList"element={<RequireAuth><SIHDList /></RequireAuth>} /> */}
            <Route path={`${URL}SIList`} element={<RequireAuth><SIList /></RequireAuth>} />
            <Route path={`${URL}SalesInvoice`} element={<RequireAuth><SIList /></RequireAuth>} />
            <Route path={`${URL}SIHeader`} element={<RequireAuth><SIHeader /></RequireAuth>} />
            <Route path={`${URL}SIListDT`} element={<RequireAuth><SIListDT /></RequireAuth>} />
            <Route path={`${URL}SIAddDetail`} element={<RequireAuth><SIAddDetail /></RequireAuth>} />
            <Route path={`${URL}SIEditDetail`} element={<RequireAuth><SIEditDetail /></RequireAuth>} />
            <Route path={`${URL}SIProductSelect`} element={<RequireAuth><SIProductSelection /></RequireAuth>} />
            <Route path={`${URL}AccordionSI`} element={<RequireAuth><AccordionSI /></RequireAuth>} />

            <Route path={`${URL}SRList`} element={<RequireAuth><SRList /></RequireAuth>} />
            <Route path={`${URL}SalesRequisition`} element={<RequireAuth><SRList /></RequireAuth>} />
            <Route path={`${URL}SRHeader`} element={<RequireAuth><SRHeader /></RequireAuth>} />
            <Route path={`${URL}SRListDT`} element={<RequireAuth><SRListDT /></RequireAuth>} />
            <Route path={`${URL}SREditDetail`} element={<RequireAuth><SREditDetail /></RequireAuth>} />
            <Route path={`${URL}SRAddDetail`} element={<RequireAuth><SRAddDetail /></RequireAuth>} />
            <Route path={`${URL}SRProductSelect`} element={<RequireAuth><SRProductSelection /></RequireAuth>} />

            <Route path={`${URL}SOList`} element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path={`${URL}CashSalesOrder`} element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path={`${URL}CreditSalesOrder`} element={<RequireAuth><SOList /></RequireAuth>} />
            <Route path={`${URL}SOHeader`} element={<RequireAuth><SOHeader /></RequireAuth>} />
            <Route path={`${URL}SOListDT`} element={<RequireAuth><SOListDT /></RequireAuth>} />
            <Route path={`${URL}SOProductSelect`} element={<RequireAuth><SOProductSelection /></RequireAuth>} />
            <Route path={`${URL}SOAddDetail`} element={<RequireAuth><SOAddDetail /></RequireAuth>} />
            <Route path={`${URL}SOEditDetail`} element={<RequireAuth><SOEditDetail /></RequireAuth>} />

            <Route path={`${URL}AccCode`} element={<RequireAuth><AccCode /></RequireAuth>} />
            <Route path={`${URL}AccCodeList`} element={<RequireAuth><AccCodeList /></RequireAuth>} />
            <Route path={`${URL}AccountCode`} element={<RequireAuth><AccountCode /></RequireAuth>} />
            <Route path={`${URL}AccCodefull`} element={<RequireAuth><AccCodefull /></RequireAuth>} />
            <Route path={`${URL}AccCodes`} element={<RequireAuth><AccCodefull /></RequireAuth>} />

            <Route path={`${URL}RVHeader`} element={<RequireAuth><RVHeader /></RequireAuth>} />
            <Route path={`${URL}RVList`} element={<RequireAuth><RVList /></RequireAuth>} />
            <Route path={`${URL}ReceiveVoucher`} element={<RequireAuth><RVList /></RequireAuth>} />
            <Route path={`${URL}RVList1`} element={<RequireAuth><RVList1 /></RequireAuth>} />
            <Route path={`${URL}RVListDT`} element={<RequireAuth><RVListDT /></RequireAuth>} />
            <Route path={`${URL}RVEditDetail`} element={<RequireAuth><RVEditDetail /></RequireAuth>} />
            <Route path={`${URL}RVDTList`} element={<RequireAuth><RVDTList /></RequireAuth>} />

            <Route path={`${URL}JournalEntries`} element={<RequireAuth><JVList /></RequireAuth>} />
            <Route path={`${URL}JVList`} element={<RequireAuth><JVList1 /></RequireAuth>} />
            <Route path={`${URL}AccordionJV`} element={<RequireAuth><AccordionJV /></RequireAuth>} />

            <Route path={`${URL}TrialBalance`} element={<RequireAuth><TrialBalance /></RequireAuth>} />
            <Route path={`${URL}GLList`} element={<RequireAuth><GLList /></RequireAuth>} />
            <Route path={`${URL}TBList`} element={<RequireAuth><TBList /></RequireAuth>} />

            <Route path={`${URL}AccConfigList`} element={<RequireAuth><AccConfigList /></RequireAuth>} />
            <Route path={`${URL}AccConfigs`} element={<RequireAuth><AccConfigList /></RequireAuth>} />
            <Route path={`${URL}AccConfig`} element={<RequireAuth><AccConfig /></RequireAuth>} />

            <Route path={`${URL}DocConfigSchema`} element={<RequireAuth><DocConfigSchema /></RequireAuth>} />
            <Route path={`${URL}DocConfigSchemaList`} element={<RequireAuth><DocConfigSchemaList /></RequireAuth>} />
            <Route path={`${URL}OptionalFieldSchemas`} element={<RequireAuth><DocConfigSchemaList /></RequireAuth>} />

            <Route path={`${URL}MoreInfoHD`} element={<RequireAuth><MoreInfoHD /></RequireAuth>} />
            <Route path={`${URL}MoreInfoDT`} element={<RequireAuth><MoreInfoDT /></RequireAuth>} />

            {/* <Route path="uitestacc/Login"element={<LoginForm /> }/> */}

            <Route path={`${URL}PlatinumMenu`} element={<RequireAuth><PlatinumMenu /></RequireAuth>} />
            <Route path={`${URL}index`} element={<RequireAuth><AccountingAppGreen /></RequireAuth>} /> {/*MENU*/}
            <Route path={`${URL}`} element={<RequireAuth><AccountingAppMenu /></RequireAuth>} /> {/*MENU*/}
            {/* <Route path="uitestacc/LoginModal"element={<RequireAuth><LoginModal/></RequireAuth>} /> */}

            {/* <Route path="uitestacc/UF"element={<RequireAuth><UserForm /></RequireAuth>} />
          <Route path="uitestacc/FUD"element={<RequireAuth><FormUserDetails /></RequireAuth>} /> */}

            <Route path={`${URL}SRDD`} element={<RequireAuth><SRDropdowns /></RequireAuth>} />
            <Route path={`${URL}AccordionSR`} element={<RequireAuth><AccordionSR /></RequireAuth>} />
            <Route path={`${URL}SRListAU`} element={<RequireAuth><SRListAU /></RequireAuth>} />
            <Route path={`${URL}AccordionPR`} element={<RequireAuth><AccordionPR /></RequireAuth>} />
            <Route path={`${URL}PRAddDTAU`} element={<RequireAuth><PRAddDTAU /></RequireAuth>} />

            <Route path={`${URL}AccordionCS`} element={<RequireAuth><AccordionCS /></RequireAuth>} />
            <Route path={`${URL}QuickCashSale`} element={<RequireAuth><AccordionCS /></RequireAuth>} />
            {/* <Route path="uitestacc/CashSalesOrder" element={<RequireAuth><AccordionCS /></RequireAuth>} /> */}
            <Route path={`${URL}AccordionQB`} element={<RequireAuth><AccordionQB /></RequireAuth>} />
            <Route path={`${URL}QuickBuy`} element={<RequireAuth><AccordionQB /></RequireAuth>} />
            <Route path={`${URL}AccordionQP`} element={<RequireAuth><AccordionQP /></RequireAuth>} />
            <Route path={`${URL}QuickPayment`} element={<RequireAuth><AccordionQP /></RequireAuth>} />
            <Route path={`${URL}AccordionQR`} element={<RequireAuth><AccordionQR /></RequireAuth>} />
            <Route path={`${URL}QuickReceive`} element={<RequireAuth><AccordionQR /></RequireAuth>} />

            {/* <Route path="uitestacc/AccordionWHT" element={<RequireAuth><AccordionWHT /></RequireAuth>} /> */}
            <Route path={`${URL}WithholdingTax`} element={<RequireAuth><WHTList /></RequireAuth>} />
            <Route path={`${URL}WHT3`} element={<RequireAuth><AccordionWHT /></RequireAuth>} />

            <Route path={`${URL}AccordionPO`} element={<RequireAuth><AccordionPO /></RequireAuth>} />
            <Route path={`${URL}AccordionDI`} element={<RequireAuth><AccordionDI /></RequireAuth>} />
            <Route path={`${URL}DraftDI`} element={<RequireAuth><DraftDataFromOCR /></RequireAuth>} />
            <Route path={`${URL}DraftOCRDI`} element={<RequireAuth><DraftOCRDI /></RequireAuth>} />

            <Route path={`${URL}DraftData`} element={<RequireAuth><DraftData /></RequireAuth>} />
            <Route path={`${URL}DraftDataEntry`} element={<RequireAuth><DraftDataOCR /></RequireAuth>} />

            <Route path={`${URL}AccordionSO`} element={<RequireAuth><AccordionSO /></RequireAuth>} />
            <Route path={`${URL}AccordionDO`} element={<RequireAuth><AccordionDO /></RequireAuth>} />

            <Route path={`${URL}TypeServiceList`} element={<RequireAuth><TypeServiceList /></RequireAuth>} />
            <Route path={`${URL}TypeService`} element={<RequireAuth><TypeService /></RequireAuth>} />
            <Route path={`${URL}TypeIngredientList`} element={<RequireAuth><TypeIngredientList /></RequireAuth>} />
            <Route path={`${URL}FixedAssetsType`} element={<RequireAuth><TypeIngredientList /></RequireAuth>} />
            <Route path={`${URL}TypeIngredient`} element={<RequireAuth><TypeIngredient /></RequireAuth>} />

            <Route path={`${URL}PCList`} element={<RequireAuth><PCList /></RequireAuth>} />
            <Route path={`${URL}PaymentConfirm`} element={<RequireAuth><PCList /></RequireAuth>} />
            <Route path={`${URL}AccordionPC`} element={<RequireAuth><AccordionPC /></RequireAuth>} />

            <Route path={`${URL}RCList`} element={<RequireAuth><RCList /></RequireAuth>} />
            <Route path={`${URL}ReceiveConfirm`} element={<RequireAuth><RCList /></RequireAuth>} />
            <Route path={`${URL}AccordionRC`} element={<RequireAuth><AccordionRC /></RequireAuth>} />

            <Route path={`${URL}AccordionRV`} element={<RequireAuth><AccordionRV /></RequireAuth>} />

            <Route path={`${URL}TransList`} element={<RequireAuth><TransList /></RequireAuth>} />
            <Route path={`${URL}Transaction`} element={<RequireAuth><TransactionMain /></RequireAuth>} />

            <Route path={`${URL}CompanyProfile`} element={<RequireAuth><ProfileConfig /></RequireAuth>} />
          </Routes>
          {/* </div> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;