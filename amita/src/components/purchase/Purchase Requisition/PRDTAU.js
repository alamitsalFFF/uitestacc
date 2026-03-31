import React, { useState, useEffect, useCallback } from "react";
import axios from "../../Auth/axiosConfig.js";
import { useSelector, useDispatch } from "react-redux";
import {
  setAccDocNo,
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
  setNameCategory,
  clearSelectedProducts,
} from "../../redux/TransactionDataaction.js";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import PREditDetailAU from "./PREditDTAU.js";
import { formatNumber } from "../formatNumber.js";
import { FormatDate } from "../FormatData.js";
import { API_VIEW_RESULT } from "../../api/url.js";
import AccordionSelectProductPR from "./AccordionSelectProductPR.js";
import AccordiionPRAddDT from "./AccordiionPRAddDT.js";
import { Box, Modal } from "@mui/material";

function PRDTAU({ accDocNo, onSaveSuccess }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Redux states
  const accEffectiveDate = useSelector((state) => state.accEffectiveDate);
  const detailData = useSelector((state) => state.detailData);
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const partyCode = useSelector((state) => state.partyCode);
  const partyName = useSelector((state) => state.partyName);
  const nameCategory = useSelector((state) => state.nameCategory);

  // Local states
  const [loading, setLoading] = useState(false);
  const [prh, setPRH] = useState([]);
  const [prd, setPRD] = useState([]);
  const [showEditDetailModal, setShowEditDetailModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemCounter, setItemCounter] = useState(1);

  // ****** States สำหรับควบคุม Modal
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddDTModal, setOpenAddDTModal] = useState(false);

  // Fetch PR Header & Detail
  const fetchDataPRDetails = useCallback(() => {
    if (accDocNo) {
      const vPR_H = {
        viewName: "vPR_H",
        parameters: [
          { field: "AccDocType", value: "PR" },
          { field: "AccDocNo", value: accDocNo },
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

      const vPR_D = {
        viewName: "vPR_D",
        parameters: [
          { field: "AccDocType", value: "PR" },
          { field: "AccDocNo", value: accDocNo },
        ],
        results: [
          { sourceField: "AccDocNo" },
          { sourceField: "AccItemNo" },
          { sourceField: "SalesDescription" },
          { sourceField: "Price" },
          { sourceField: "Qty" },
          { sourceField: "Amount" },
          { sourceField: "Currency" },
          { sourceField: "UnitMea" },
          { sourceField: "RateVat" },
          { sourceField: "RateWht" },
        ],
      };

      (async () => {
        try {
          setLoading(true);
          const responseH = await axios.post(
            API_VIEW_RESULT,
            vPR_H,
            { headers: { "Content-Type": "application/json" } }
          );
          const responseD = await axios.post(
            API_VIEW_RESULT,
            vPR_D,
            { headers: { "Content-Type": "application/json" } }
          );
          if (responseH.status === 200 && responseD.status === 200) {
            setLoading(false);
            setPRH(responseH.data);
            setPRD(responseD.data.sort((a, b) => a.AccItemNo - b.AccItemNo));
          } else {
            setLoading(false);
            console.error("Error fetching data");
          }
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      })();
    }
  }, [accDocNo]);

  useEffect(() => {
    if (accDocNo) {
      fetchDataPRDetails(accDocNo);
    }
  }, [accDocNo]);

  // Product select handler
  const handleProductSelect = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับเปิด Modal เลือกสินค้า
  const handleOpenProductModal = () => {
    setOpenProductModal(true);
  };

  // ฟังก์ชันสำหรับปิด Modal เลือกสินค้า
  const handleCloseProductModal = () => {
    setOpenProductModal(false);
  };

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Confirm" ที่ Modal เลือกสินค้า
  const handleConfirmProductSelection = () => {
    handleCloseProductModal(); // Close the product selection modal
    setOpenAddDTModal(true); // Open the detail modal
  };

  // ฟังก์ชันสำหรับปิด Modal เพิ่มรายละเอียด
  const handleCloseAddDTModal = () => {
    setOpenAddDTModal(false);
    dispatch(clearSelectedProducts()); // เคลียร์ค่าที่เลือกเมื่อปิด Modal
  };

  // ฟังก์ชันที่ถูกเรียกเมื่อกด "Save" ที่ Modal เพิ่มรายละเอียด
  const handleSaveDetail = () => {
    // 1. Close the modal
    handleCloseAddDTModal();

    // 2. Fetch the latest data from the server
    fetchDataPRDetails();

    // 3. Increment the item counter for the next batch
    //    We need to get the number of items that were successfully saved. 
    //    We can get this from the Redux state.
    const numberOfSavedItems = selectedProducts.length;
    setItemCounter(prevCounter => prevCounter + numberOfSavedItems);

    // 4. (Optional) Call a function from the parent component
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  // Edit detail modal handlers
  const handleEditDetail = (AccItemNo) => {
    const docStatus = prh[0]?.DocStatus;
    const accDocType = prh[0]?.AccDocType;
    setItemToEdit({
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    console.log("itemToEdit:", {
      accDocNo,
      accItemNo: AccItemNo,
      docStatus,
      accDocType,
      selectedDocConfigID: location.state?.selectedDocConfigID || null,
    });
    setShowEditDetailModal(true);
  };

  const handleCloseEditDetailModal = useCallback(() => {
    setShowEditDetailModal(false);
    setItemToEdit(null);
  }, []);

  const handleDetailUpdatedOrDeleted = useCallback(() => {
    fetchDataPRDetails();
    handleCloseEditDetailModal();
  }, [fetchDataPRDetails, handleCloseEditDetailModal]);

  // คำนวณ itemCounter
  useEffect(() => {
    if (prd && prd.length > 0) {
      const itemNo = prd.map((item) => item.AccItemNo);
      const maxItemNo = Math.max(...itemNo);
      setItemCounter(maxItemNo + 1);
    } else {
      setItemCounter(1);
    }
  }, [prd]);

  // Render
  return (
    <div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <h2 style={{ marginTop: "5px", marginLeft: "10px" }}>{accDocNo}</h2>
        </ListItem>
        <ListItem style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <p>
            Date: {prh[0]?.AccEffectiveDate ? <FormatDate dateString={prh[0].AccEffectiveDate} /> : <FormatDate dateString={accEffectiveDate} />}
          </p>
        </ListItem>
      </div>
      <div className="row">
        <ListItem style={{ display: "flex", alignItems: "center", paddingLeft: "30px" }}>
          <h5 style={{ color: "blue" }}>&nbsp;{prh[0]?.PartyName || partyName}</h5>
        </ListItem>
      </div>
      {prd.map((product, index) => (
        <div key={index}>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h5>
                &nbsp; {product.AccItemNo}.&nbsp;{product.SalesDescription}&nbsp;&nbsp;
              </h5>
              <h6>
                &nbsp;&nbsp;{formatNumber(product.Price)}{product.Currency} x {formatNumber(product.Qty)}{product.UnitMea}
              </h6>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(product.Amount)}</h2>
                &nbsp;&nbsp;&nbsp;
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size="1x"
                  style={{ color: "#0310ce", paddingTop: "10px" }}
                  onClick={() => handleEditDetail(product.AccItemNo)}
                />
              </div>
            </div>
          </ListItem>
        </div>
      ))}
      {(!prh.length || prh[0]?.DocStatus === 0) && (
        <>
          <Divider variant="middle" component="li" style={{ listStyle: "none" }} />
          <ListItem style={{ justifyContent: "center" }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="warning"
                style={{ width: "183px", height: "33px", borderRadius: "20px" }}
                onClick={handleProductSelect}
              >
                <FontAwesomeIcon icon={faSquarePlus} size="2x" style={{ color: "#fff", justifyItems: "end" }} />
                &nbsp;Product/Service
              </Button>
            </Stack>
          </ListItem>
        </>
      )}
      {/* เพิ่มส่วนของ Modal  */}
      <AccordionSelectProductPR
        isOpen={openProductModal}
        onClose={handleCloseProductModal}
        onSave={handleConfirmProductSelection}
        accDocNo={accDocNo}
        nextItemNo={itemCounter}
      />

      <AccordiionPRAddDT
        open={openAddDTModal}
        onClose={handleCloseAddDTModal}
        onSave={handleSaveDetail}
      />

      {showEditDetailModal && itemToEdit && (
        <>
          <PREditDetailAU
            open={showEditDetailModal}
            onClose={handleCloseEditDetailModal}
            onBackdropClick={handleCloseEditDetailModal}
            onSave={handleDetailUpdatedOrDeleted}
            onDelete={handleDetailUpdatedOrDeleted}
            accDocNo={itemToEdit.accDocNo}
            accItemNo={itemToEdit.accItemNo}
            docStatus={itemToEdit.docStatus}
            accDocType={itemToEdit.accDocType}
            selectedDocConfigID={itemToEdit.selectedDocConfigID}
            isproductName={itemToEdit.isproductName}
            price={itemToEdit.price}
            qty={itemToEdit.qty}
          />
        </>
      )}
      <div className="row">
        {prh.map((productH, index) => (
          <div className="financial-form" key={index} style={{ width: "94%" }}>
            <div className="col-7" style={{ justifyItems: "end" }}>
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "3px" }}
              >
                &nbsp; TotalAmount &nbsp;
              </h5>
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "7px" }}
              >
                &nbsp; TotalVat VAT 7% &nbsp;
              </h5>
              <h5
                style={{ marginTop: "5px", marginLeft: "10px", padding: "4px" }}
              >
                &nbsp; TotalWht &nbsp;
              </h5>
            </div>
            <div style={{ marginLeft: "auto", justifyItems: "end" }}>
              <div style={{ display: "flex" }}>
                <h2 style={{
                  borderBottom: "2px solid black",
                  boxShadow: "0 4px 0 black",
                }}>{formatNumber(productH.TotalAmount)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div>
              <div style={{ display: "flex" }}>
                <h2>{formatNumber(productH.TotalVat)}</h2>
                &nbsp; &nbsp; &nbsp;
              </div>
              <div style={{ display: "flex" }}>
                <h2
                // style={{
                //   borderBottom: "2px solid black",
                //   boxShadow: "0 4px 0 black",
                // }}
                >
                  {formatNumber(productH.TotalWht)}
                </h2>
                &nbsp; &nbsp; &nbsp;
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PRDTAU;