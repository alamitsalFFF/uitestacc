import React, { useState, useEffect } from "react";
// import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./Quick Cash.css";
import {
  Switch,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate,useLocation } from 'react-router-dom';

function QuickCash() {
  const navigate = useNavigate();

  const handlePlusClick = () => {
    navigate('/uitestacc/QCSupplier');
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
  const [formData, setFormData] = useState({
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

  const vatOptions = [
    { value: 0.07, label: "7%" },
  ];

  const withholdingTaxOptions = [
    { value: 0, label: "0%" },
    { value: 0.03, label: "3%" },
    { value: 0.05, label: "5%" },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleVatChange = (event) => {
    setFormData({ ...formData, isVatExempt: event.target.checked });
  };

  const calculateTotal = () => {
    const { total, discount } = formData;
    const totalAfterDiscount = total - discount;
    const vat = formData.isVatExempt
      ? 0
      : totalAfterDiscount * formData.vatRate;
    const grandTotal = totalAfterDiscount + vat;

    setFormData({
      ...formData,
      totalAfterDiscount,
      vat,
      grandTotal,

    });
  };

  const location = useLocation();
  const selectedItem = location.state?.selectedItem;

  useEffect(() => {
    if (selectedItem) {
      console.log('Selected item:', selectedItem);
    }
  }, [selectedItem]);

  return (
    <div className="row" style={{ padding: "5%" }}>
      <h1 style={{ textAlign: "center" }}>Quick Cash Buy</h1>
      <div>&nbsp;</div>
      <div>&nbsp;</div>

      <div className="col-md-7">
        <TextField
          id="docno"
          label="DocNo"
          defaultValue="DocNO"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{ width: "100%" }}
        />
      </div>
      {/* <div className="col-md-1">&nbsp;</div> */}
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
      <div className="row">
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
          <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
            &nbsp; Supplier
          </h5>
          <div style={{ marginLeft: "auto" }} onClick={handlePlusClick} >
            <FontAwesomeIcon
              icon={faPlus}
              size="1x"
              style={{ color: "#0310ce" }}
            />
          </div>
        </ListItem>
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
      </div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faUserGroup}
            size="2x"
            style={{ color: "#2d01bd" }}
          />
          <h5 style={{ marginTop: "5px", marginLeft: "10px" }}>
            &nbsp; Product
          </h5>
          <div style={{ marginLeft: "auto" }}>
            <FontAwesomeIcon
              icon={faPlus}
              size="1x"
              style={{ color: "#0310ce" }}
            />
          </div>
        </ListItem>
        {/* <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        /> */}
      </div>

      {/* <div>&nbsp;</div> */}
      <div className="row">
        <div className="financial-form">
          <div className="label-section">
            <label htmlFor="total">Total</label>
            {/* <label htmlFor="discount">Total discount</label> */}
            {/* <label htmlFor="totalAfterDiscount">Total after discount</label> */}

            <FormControlLabel 
            label="VAT 7%"
            className="vat-label-left"
              control={
                <Switch
                  checked={!formData.isVatExempt}
                  onChange={handleVatChange}
                />
              }
              
            />

            <label htmlFor="grandTotal">Grand Total</label>
            <label htmlFor="withholdingTax">WithholdingTax</label>

          </div>

          <div className="input-section">
            <input
              type="number"
              id="total"
              name="total"
              value={formData.total}
              onChange={handleChange}
              onBlur={calculateTotal}
            />
            <input
              type="number"
              id="vat"
              name="vat"
              value={formData.vat}
              readOnly
            />
            <input
              type="number"
              id="grandTotal"
              name="grandTotal"
              value={formData.grandTotal}
              readOnly
            />
            <input
              type="number"
              id="withholdingTax"
              name="withholdingTax"
              value={formData.withholdingTax}
              onChange={handleChange}
            />
            {/* <Autocomplete
              options={withholdingTaxOptions}
              getOptionLabel={(option) => option.label}
              value={
                withholdingTaxOptions.find(
                  (option) => option.value === formData.withholdingTaxRate
                ) || null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  withholdingTaxRate: newValue?.value || 0,
                });
              }}
              renderInput={(params) => <TextField {...params} />}
            /> */}
          </div>
        </div>
        {/* <Divider variant="middle" component="li" style={{ listStyle: "none" }} /> */}
      </div>
    </div>
  );
}
export default QuickCash;
