import React, { useState, useEffect, useMemo ,useCallback } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import axios from "axios";
import CashSale from "./AccordionCashSaleMain";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography"; 

function AccordionCashSaleData({ data }) {
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const data = JSON.parse(searchParams.get("data"));
 if (!data || !Array.isArray(data) || data.length === 0) {
    return <Typography>ไม่พบข้อมูลการขาย</Typography>;
  }

  return (
    <div>
      {/* <h1 className="h1-pr">บันทึกรายวันขาย</h1> */}
      {data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>JournalNo</TableCell>
                <TableCell align="right">AccCode</TableCell>
                <TableCell align="right">AccName</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {/* กรองค่าที่เป็น null หรือ undefined ก่อนจะ map */}
            {data
              .filter(item => item !== null && item !== undefined) // <-- เพิ่มการกรองนี้
              .map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.JournalNo}
                  </TableCell>
                  <TableCell align="right">{item.AccCode}</TableCell>
                  <TableCell align="right">{item.AccName}</TableCell>
                  <TableCell align="right">{item.Debit}</TableCell>
                  <TableCell align="right">{item.Credit}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* {renderTable()} */}
    </div>
  );
}
export default AccordionCashSaleData;
