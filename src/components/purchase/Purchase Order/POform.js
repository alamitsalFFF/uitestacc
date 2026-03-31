import React, { useState, useEffect } from "react";
import axios from "axios";
import { Page,Text,View,Document,PDFViewer,PDFDownloadLink, } from "@react-pdf/renderer";

export default function POForm(){
      const [headerData, setHeaderData] = useState(null);
      const [detailData, setDetailData] = useState(null);
      const [customerData, setCustomerData] = useState(null);
      const [docConfigResponse, setDocConfigResponse] = useState(null);

      const vPO_H = {
        viewName: "vPO_H",
        parameters: [
        //   { field: "AccDocNo", value: `${AccDocNo}` }, // การกรองข้อมูล
          // { field: "DocStatus", value: "0" },
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
        //   { field: "DocNo", value: `${AccDocNo}` }, // การกรองข้อมูล
          // { field: "DocStatus", value: "0" },
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
      useEffect(() => {
        const fetchData = async () => {
        //   console.log("Accdocno:", AccDocNo);
          try {
            // ดึงข้อมูลจาก API ตัวที่ 1 (ข้อมูลส่วนหัว)
            const headerResponse = await axios.post(
              `http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/`,
              vPO_H,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            setHeaderData(headerResponse.data);
    
            // ดึงข้อมูลจาก API ตัวที่ 2 (ข้อมูลรายละเอียด)
            const detailResponse = await axios.post(
              `http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/`,
              vPO_D,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            setDetailData(detailResponse.data);
    
            const CustomerResponse = await axios.get(
              `http://103.225.168.137/apiaccbk2/api/Prototype/Customer/GetCustomer` // ดึงข้อมูลทั้งหมด
            );
            setCustomerData(CustomerResponse.data);
    
            const DocConfigResponse = await axios.get(
              `http://103.225.168.137/apiaccbk2/api/Prototype/DocConfig/GetDocConfig` // ดึงข้อมูลทั้งหมด
            );
            setDocConfigResponse(DocConfigResponse.data);
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
          }
        };
    
        fetchData();
      }, []);

    return(
        <div>PO</div>
    );
}