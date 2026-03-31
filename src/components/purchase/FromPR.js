import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../Auth/axiosConfig";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { setAccDocNotran } from "../redux/TransactionDataaction";
import { useSearchParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import tawanImagelogo from "../img/tawanlogo.png";

function FromPrint() {
  const AccDocNo = useSelector((state) => state.accDocNoT);
  //   const { AccDocNo } = useParams();
  //   const [searchParams] = useSearchParams();
  //   const AccDocNo = searchParams.get("filteredTransactions.AccDocNo");
  //   const AccDocNoN = String(AccDocNo,10);
  const [customerData, setCustomerData] = useState(null);
  const [docConfigResponse, setDocConfigResponse] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const vTransaction_H = {
    viewName: "vTransaction_H",
    parameters: [
      { field: "AccDocNo", value: `${AccDocNo}` }, // การกรองข้อมูล
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
      { sourceField: "Text1" },
      { sourceField: "Date1" },
      { sourceField: "Num1" },
      { sourceField: "Text2" },
      { sourceField: "Date2" },
      { sourceField: "Num2" },
      { sourceField: "Text3" },
      { sourceField: "Date3" },
      { sourceField: "Num3" },
      { sourceField: "Text4" },
      { sourceField: "Date4" },
      { sourceField: "Num4" },
      { sourceField: "Text5" },
      { sourceField: "Date5" },
      { sourceField: "Num5" },
      { sourceField: "Text6" },
      { sourceField: "Date6" },
      { sourceField: "Num6" },
      { sourceField: "Text7" },
      { sourceField: "Date7" },
      { sourceField: "Num7" },
      { sourceField: "Text8" },
      { sourceField: "Date8" },
      { sourceField: "Num8" },
      { sourceField: "Text9" },
      { sourceField: "Date9" },
      { sourceField: "Num9" },
      { sourceField: "Text10" },
      { sourceField: "Date10" },
      { sourceField: "Num10" },
    ],
  };
  const vTransaction_D = {
    viewName: "vTransaction_D",
    parameters: [
      { field: "DocNo", value: `${AccDocNo}` }, // การกรองข้อมูล
      // { field: "DocStatus", value: "0" },
    ],
    results: [
      { sourceField: "DocNo" },
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
      { sourceField: "DText1" },
      { sourceField: "DDate1" },
      { sourceField: "DNum1" },
      { sourceField: "DText2" },
      { sourceField: "DDate2" },
      { sourceField: "DNum2" },
      { sourceField: "DText3" },
      { sourceField: "DDate3" },
      { sourceField: "DNum3" },
      { sourceField: "DText4" },
      { sourceField: "DDate4" },
      { sourceField: "DNum4" },
      { sourceField: "DText5" },
      { sourceField: "DDate5" },
      { sourceField: "DNum5" },
      { sourceField: "DText6" },
      { sourceField: "DDate6" },
      { sourceField: "DNum6" },
      { sourceField: "DText7" },
      { sourceField: "DDate7" },
      { sourceField: "DNum7" },
      { sourceField: "DText8" },
      { sourceField: "DDate8" },
      { sourceField: "DNum8" },
      { sourceField: "DText9" },
      { sourceField: "DDate9" },
      { sourceField: "DNum9" },
      { sourceField: "DText10" },
      { sourceField: "DDate10" },
      { sourceField: "DNum10" },
      { sourceField: "DRateVat" },
      { sourceField: "DRateWht" },
      { sourceField: "DVatType" },
    ],
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log("Accdocno:", AccDocNo);
      try {
        // ดึงข้อมูลจาก API ตัวที่ 1 (ข้อมูลส่วนหัว)
        const headerResponse = await axios.post(
          `http://103.225.168.137/apiaccbk2/api/Prototype/View/GetViewResult/`,
          vTransaction_H,
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
          vTransaction_D,
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

  const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     const fetchCustomer = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://103.225.168.137/apiaccbk2/api/Prototype/Customer/GetCustomer` // ดึงข้อมูลทั้งหมด
  //         );
  //         if (response.status === 200 && response.data.length > 0) {
  //           setCustomerData(response.data);
  //         } else {
  //           console.error("Failed to fetch warehouse data");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching warehouse data:", error);
  //       } finally {
  //         setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ
  //       }
  //     };
  //     fetchCustomer();
  //   }, []);

  // สไตล์และส่วนแสดงผล PDF (เหมือนเดิม)
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      textAlign:"center",
    },
    logo: {
      width: 100,
      height: 50,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    // table: {
    //   display: 'table',
    //   width: 'auto',
    //   borderStyle: 'solid',
    //   borderWidth: 1,
    //   borderRightWidth: 0,
    //   borderBottomWidth: 0,
    // },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    // tableCell: {
    //   margin: 'auto',
    //   marginTop: 5,
    //   fontSize: 10,
    // },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
    },
    tableCell: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
    },
    roundedBox: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 0,
        padding: 10,
        marginBottom: 10,
    },
  });

  const MyDocument = ({ headerData, detailData }) => {
    const docConfig =
      docConfigResponse && headerData && headerData.length > 0
        ? docConfigResponse.find(
            (item) => item.category === headerData[0].AccDocType
          )
        : null;
    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            {/* <Image style={styles.logo} src={tawanImagelogo} /> */}
            <Stack direction="row" spacing={2}>
              <Avatar
                alt="Tawan"
                src={tawanImagelogo}
                sx={{ width: "100px", height: "100px" }}
              />
              <div>
                <h3 style={{ textAlign: "center" }}>Tawantechnology Co.,ltd</h3>
                <br />
                <p style={{ textAlign: "center" }}>
                  507 บางนา-ตราด 56 บางนาใต้ บางนา กรุงเทพมหานคร 10260 <br />
                  TEL 02-7377223-6 FAX 02-7378440 เลขประจำตัวผู้เสียภาษี
                  0105544112818 สาขา: สำนักงานใหญ่
                </p>
              </div>
            </Stack>

            {/* {customerData && customerData.map((item) => ( */}
            {/* <View>
            <h3 style={{textAlign:"center"}}>Tawantechnology Co.,ltd</h3><br />
            <p style={{textAlign:"center"}}>507 บางนา-ตราด 56 บางนาใต้ บางนา กรุงเทพมหานคร 10260 <br /> 
            TEL 02-7377223-6 FAX 02-7378440 เลขประจำตัวผู้เสียภาษี 0105544112818 สาขา: สำนักงานใหญ่</p>
          </View> */}
            {/* ))} */}
          </View>
          {/* <Text style={styles.title}>{docConfig.eName}</Text><br />*/}
          {docConfig && (
            <h4 style={{ textAlign: "center" }}>{docConfig.eName}</h4>
          )}
          {headerData &&
            headerData.map((item) => (
              <View key={item.AccDocNo}>
                <View style={styles.roundedBox}>
                {/* <h4 style={{textAlign:"center"}}>{item.AccDocType}</h4> */}
                <Text>{item.PartyName}</Text>
                <Text>รหัสลูกค้า: {item.PartyCode}</Text>
                <Text>ชื่อลูกค้า: {item.PartyName}</Text>
                <Text>เลขที่: {item.PartyTaxCode}</Text>
                <Text>วันที่: {item.AccBatchDate}</Text>
                <br />
                </View>
              </View>
            ))}
          <View style={styles.table}>
            <div>&nbsp;</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>รหัสสินค้า</th>
                  <th style={styles.tableHeader}>รายการ</th>
                  <th style={styles.tableHeader}>จำนวน</th>
                  <th style={styles.tableHeader}>หน่วยนับ</th>
                  <th style={styles.tableHeader}>ราคา/หน่วย</th>
                  <th style={styles.tableHeader}>ExchangeRate</th>
                  <th style={styles.tableHeader}>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {detailData &&
                  detailData.map((item) => (
                    <tr key={item.AccItemNo}>
                      <td style={styles.tableCell}>{item.SaleProductCode}</td>
                      <td style={styles.tableCell}>{item.SalesDescription}</td>
                      <td style={styles.tableCell}>{item.Qty}</td>
                      <td style={styles.tableCell}>{item.UnitMea}</td>
                      <td style={styles.tableCell}>{item.Price}</td>
                      <td style={styles.tableCell}>{item.ExchangeRate}</td>
                      <td style={styles.tableCell}>{item.Amount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </View>
          {/* ส่วนอื่นๆ ของเอกสาร */}
        </Page>
      </Document>
    );
  };

  return <MyDocument headerData={headerData} detailData={detailData} />;
  //  return (<h1>TEST</h1>);
}

export default FromPrint;
