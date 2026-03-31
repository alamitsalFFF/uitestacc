// GLTemplateModal.js
import React from "react";
import Dialog from "@mui/material/Dialog";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function GLTemplateModal({ show, handleClose, data }) {
  console.log("GLTemplateModal RENDERED. Show state:", show);
  console.log("Data passed to modal:", data);

  const items = Array.isArray(data) ? data : data?.data;

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" //fullWidth
    //style={{width: '80%',justifyContent: 'center', alignItems: 'center',justifyItems: 'center'}}
    >
      <div style={{ padding: "24px" }}>
        <Typography variant="h6" gutterBottom>
          สมุดรายวันทั่วไป (GL)
        </Typography>
        {items && items.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <Typography variant="body1">
              <b>JournalNo:</b> {items[0].JournalNo} <b>Date:</b> {items[0].JournalDate?.split("T")[0]}
            </Typography>
            <Typography variant="body1">
              <b>PartyTax:</b> {items[0].PartyTaxCode} <b>{items[0].PartyName}</b> 
            </Typography>
            {/* <Typography variant="body1">
              <b>PartyName:</b> {items[0].PartyName}
            </Typography> */}
            {/* <Typography variant="body1">
              <b>JournalDate:</b> {items[0].JournalDate?.split("T")[0]}
            </Typography> */}
          </div>
        )}
        {!items || items.length === 0 ? (
          <Typography>ไม่พบข้อมูลการขาย</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="GL table">
              <TableHead>
                <TableRow>
                  {/* <TableCell>JournalNo</TableCell> */}
                  <TableCell align="right"><b>AccCode</b></TableCell>
                  <TableCell align="right"><b>AccName</b></TableCell>
                  <TableCell align="right"><b>Debit</b></TableCell>
                  <TableCell align="right"><b>Credit</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .filter((item) => item !== null && item !== undefined)
                  .map((item, index) => (
                    <TableRow key={index}>
                      {/* <TableCell component="th" scope="row">
                        {item.JournalNo}
                      </TableCell> */}
                      <TableCell align="right">{item.AccCode}</TableCell>
                      <TableCell align="right">{item.AccName}</TableCell>
                      <TableCell align="right">{item.Dr}</TableCell>
                      <TableCell align="right">{item.Cr}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Dialog>
  );
}

export default GLTemplateModal;
