import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function QuickBuy() {
  const [doctype, setDoctype] = React.useState("");

  const handleChange = (event) => {
    setDoctype(event.target.value);
  };

  const PR = "Purchase Requisition";
  const SR = "Sales Requisition";
  const PI = "Payment Invoice";
  const SI = "Sale Invoice";

  const style = {
    py: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };


  return (
    <div className="row" style={{ padding: "5%" }}>
      <h1 style={{textAlign:"center"}}>Quick Cash Buy</h1>
      <div>&nbsp;</div>

      <div className="col-md-6">
        <TextField
          id="userid"
          label="User By"
          defaultValue="ADMIN"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="docdate"
          label="Date"
          type="date"
          variant="standard"
          defaultValue={new Date().toISOString().slice(0, 10)}
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-12">
        <TextField
          id="productcode"
          label="Product"
          type="text"
          variant="standard"
          style={{ width: "100%" }}
        />
      </div>
      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="qty"
          label="Qty"
          type="number"
          variant="standard"
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="price"
          label="Price"
          type="number"
          variant="standard"
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="AccBatchDate"
          label="AccPostDate"
          type="date"
          variant="standard"
          defaultValue={new Date().toISOString().slice(0, 10)}
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="IssueBy"
          label="IssueBy"
          value={"ADMIN"}
          type="text"
          variant="standard"
          style={{ width: "100%" }}
        />
      </div>

      <div>&nbsp;</div>
      <div className="col-md-6">
        <TextField
          id="AccPostDate"
          label="AccPostDate"
          type="date"
          variant="standard"
          style={{ width: "100%" }}
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div className="col-md-1">&nbsp;</div>
      <div className="col-md-5">
        <TextField
          id="FiscalYear"
          label="FiscalYear"
          type="date"
          variant="standard"
          style={{ width: "100%" }}
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div>&nbsp;</div>

      <div className="row">
        <div className="col-md-6">
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
          >
            <Button>Save</Button>
            <Button>New</Button>
            <Button>Clear</Button>
          </ButtonGroup>
        </div>
        <div className="col-md-6" style={{display:"grid",justifyItems:"flex-end"}}>
            <FontAwesomeIcon
              icon={faCircleArrowUp}
              size="2x"
              style={{ color: "#013898", cursor: "pointer",display:"grid",justifyItems:"end" }}
            />
        </div>
      </div>

      <div>&nbsp;</div>
      <div className="row">
      <Divider variant="middle" component="li" style={{listStyle:"none"}}/>
      <ListItem>
        <ListItemText primary="List item1" />
      </ListItem>
      <Divider variant="middle" component="li" style={{listStyle:"none"}}/>
      </div>
    </div>
  );
}
export default QuickBuy;