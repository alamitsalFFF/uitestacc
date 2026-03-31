import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import {
  faBoxOpen,
  faCircleMinus,
  faCirclePlus,
  faRectangleList,
  faPen,
  faTrash,
  faFloppyDisk,
  faPrint,
  faCircleArrowUp,
  faCircleArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
// import "./TPR.css";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { setAddProducts, setAccDocNo } from "../redux/TransactionDataaction";
import { useSelector, useDispatch } from "react-redux";
import { formatNumber, formatInteger } from "../purchase/formatNumber";
import { toNumber } from "lodash";
import axios from "../Auth/axiosConfig";
import { useAuthFetch } from "../Auth/fetchConfig";
import {
  Modal,
  List,
  // ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { API_BASE } from "../api/url";

function RVEditDetail1() {
  const location = useLocation();
  const dispatch = useDispatch();
  const authFetch = useAuthFetch();
  // const accDocNo = location.state.accDocNo;
  // const accItemNo = location.state.accItemNo;
  const selectedProducts = useSelector((state) => state.selectedProducts);

  const [searchParams] = useSearchParams();
  // const entryId = searchParams.get("entryId");
  // console.log(entryId)
  // const seq = searchParams.get("seq"); // อ่านจาก query parameter
  // console.log(seq)
  const [journalNoFromState, setJournalNoFromState] = useState(
    location.state?.journalNo
  );
  // const journalNoFromState = location.state?.journalNo;
  console.log("journalNoFromState:", journalNoFromState);
  // const journalNo = searchParams.get("journalNo"); // อ่านจาก query parameter
  // console.log('journalNo:',journalNo)
  const entryIdFromParams = searchParams.get("entryID");
  console.log(entryIdFromParams);
  const seqFromParams = searchParams.get("seq");
  console.log(seqFromParams);

  const navigate = useNavigate();

  const [rateVatValue, setRateVatValue] = useState([]);
  const [rateWhtValue, setRateWhtValue] = useState([]);
  const [vatTypeValue, setVatTypeValue] = useState([]);
  const [productSizeUnitValue, setProductSizeUnitValue] = useState([]);
  const [adddatadetail, setdAddataDetail] = useState({
    accCode: "",
    accDesc: "",
    accName: "",
    credit: 0,
    debit: 0,
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setdAddataDetail({ ...adddatadetail, [id]: value });
  };

  useEffect(() => {
    // อัปเดต state เมื่อ location.state เปลี่ยน (กรณี navigate กลับมา)
    setJournalNoFromState(location.state?.journalNo);
  }, [location.state]);
  // const seqN = toNumber(seq);
  //   console.log(typeof seqN)
  const fetchData = async (entryIdFromParams, seqFromParams) => {
    console.log("entryId:", entryIdFromParams);
    console.log("entryId:", typeof entryIdFromParams);
    console.log("seq:", seqFromParams);
    console.log("seq:", typeof seqFromParams);
    try {
      const response = await authFetch(
        `${API_BASE}/Journal/GetJournalDT?entryId=${entryIdFromParams}&seq=${seqFromParams}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(entryIdFromParams, seqFromParams); // นำข้อมูลที่ได้มาใส่ใน state ของ component
        console.log("Data from API:", data);
        setdAddataDetail({
          accCode: data[0].accCode || "",
          accDesc: data[0].accDesc || "",
          accName: data[0].accName || "",
          credit: data[0].credit.toString() || 0,
          debit: data[0].debit.toString() || 0,
          seq: data[0].seq || 1,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          text: error.message || "โปรดลองใหม่อีกครั้ง",
        });
      }
    };
    loadData();
  }, [entryIdFromParams, seqFromParams]);

  const saveDataToAPI = async (data) => {
    console.log("DATA UPDATE:", data);
    try {
      const response = await authFetch(
        `${API_BASE}/Journal/EditJournalDT`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // ถ้า response เป็น JSON
        const responseData = await response.json();
        console.log("API response (JSON):", responseData);
        return responseData;
      } else {
        // ถ้า response เป็น text
        const responseText = await response.text();
        console.log("API response (Text):", responseText);
        return { message: responseText }; // ส่ง object จำลอง
      }
    } catch (error) {
      console.error("Error saving data to API:", error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!adddatadetail.accCode || !adddatadetail.accName) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        // text: "กรุณากรอกราคาและจำนวน",
      });
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }

    const updatedProduct = {
      entryId: entryIdFromParams,
      seq: parseInt(seqFromParams),
      accCode: adddatadetail.accCode,
      accDesc: adddatadetail.accDesc,
      accName: adddatadetail.accName,
      credit: parseInt(adddatadetail.credit),
      debit: parseFloat(adddatadetail.debit),
    };

    try {
      const response = await saveDataToAPI(updatedProduct);
      if (response && response.message === "JournalDT datail updated.") {
        Swal.fire({
          icon: "success",
          title: `แก้ไข ${adddatadetail.accName} สำเร็จ`,
          text: "ข้อมูลถูกแก้ไขข้อมูลเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });

        navigate(
          `/uitestacc/RVListDT?journalNo=${journalNoFromState}`
          //   , {
          //   state: {
          //     accDocNo: accDocNo,
          //     addProducts: [updatedProduct],
          //   },
          // }
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          text: "โปรดลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await authFetch(
        `${API_BASE}/Journal/DeleteJournalDT/${entryIdFromParams}?seq=${seqFromParams}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Swal.fire({
        icon: "success",
        title: `ลบ ${adddatadetail.accName} สำเร็จ`,
        text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate(`/uitestacc/RVListDT?journalNo=${journalNoFromState}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการลบข้อมูล",
        text: error.message || "โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleGoBack = () => {
    navigate(`/uitestacc/RVListDT?journalNo=${journalNoFromState}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const calculateTotal = () => {
    return (
      parseFloat(adddatadetail.price) *
      parseFloat(adddatadetail.qty) *
      parseFloat(adddatadetail.exchangeRate)
    );
  };
  const amount = calculateTotal();
  // const formatNumber = (number) => {
  //   return number.toLocaleString("en-US", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });
  // };
  const qtyRef = useRef(null);
  const currencyRef = useRef(null);
  const exchangeRateRef = useRef(null);

  const handlePriceKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // ป้องกันการ submit form
      qtyRef.current.focus(); // โฟกัสไปที่ qty
    }
  };
  const handleQtyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      currencyRef.current.focus();
    }
  };

  const handleCurrencyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      exchangeRateRef.current.focus();
    }
  };
  const [currency, setCurrency] = React.useState("THB");

  const handleChangecurr = (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    if (selectedCurrency === "THB") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: "1",
        currency: selectedCurrency,
      });
    } else if (selectedCurrency === "USD") {
      setdAddataDetail({
        ...adddatadetail,
        exchangeRate: adddatadetail.exchangeRate,
        currency: selectedCurrency,
      });
    }
  };

  // ---------------------
  const [accCodeOptions, setAccCodeOptions] = useState([]); // state สำหรับข้อมูลจาก API Customer
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด Modal
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับหน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก API ตัวใหม่
    const fetchAccCodeOptions = async () => {
      try {
        const response = await axios.get(
          `http://103.225.168.137/apiaccbk2/api/Prototype/AccCode/GetAccCode`
        );
        setAccCodeOptions(response.data); // อัปเดต state AccCode
      } catch (error) {
        console.error("Error fetching AccCode options:", error);
      }
    };
    fetchAccCodeOptions();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAccCodeSelect = (accCode) => {
    const selectedAccCode = accCodeOptions.find(
      (acccode) => acccode.accCode === accCode
    );

    if (selectedAccCode) {
      setdAddataDetail({
        ...adddatadetail,
        accCode: selectedAccCode.accCode,
        accName: selectedAccCode.accName,
      });
    }

    handleCloseModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accCodeOptions.slice(startIndex, endIndex);
  };
  // -------------------------------

  return (
    <div className="row" style={{ padding: "5%", paddingTop: "1px" }}>
      <h1 style={{ textAlign: "center" }}>Edit RV Detail</h1>

      <div className="row">
        <div style={{ display: "flex" }}>
          <div className="col-6" style={{ cursor: "pointer", display: "grid" }}>
            {/* <FontAwesomeIcon
              icon={faPrint}
              size="2x"
              style={{ color: "#e56107" }}
              // onClick={handlePrint}
            /> */}
          </div>

          <div
            className="col-5"
            style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
            <FontAwesomeIcon
              icon={faPen}
              size="2x"
              style={{ color: "#72047b" }}
              onClick={handleUpdate}
            />
          </div>
          <div
            className="col-1"
            style={{ cursor: "pointer", display: "grid", justifyItems: "end" }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size="2x"
              style={{ color: "#ae0000" }}
              onClick={handleDelete}
            />
          </div>
        </div>
        <ListItem style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
              DocNo:&nbsp; {journalNoFromState} &nbsp;
            </h5>
          </div>{" "}
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ marginTop: "5px", marginRight: "10px" }}>
              &nbsp;refno: {adddatadetail.accDesc}
              &nbsp;
            </h5>
          </div>
        </ListItem>

        <div className="col-md-12" style={{ display: "flex" }}>
          {/* <ListItem style={{ display: "flex", alignItems: "center" }}>
            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
              <InputLabel id="currency">Currency</InputLabel>
              <Select
                labelId="currency"
                id="currency"
                value={currency}
                onChange={handleChangecurr}
                type="text"
                label="Currency"
                inputRef={currencyRef}
                onKeyDown={handleCurrencyKeyDown}
              >
                <MenuItem value={"THB"}>THB</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
              </Select>
            </FormControl>
          </ListItem> */}
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="accCode"
              label="AccCode"
              value={adddatadetail.accCode}
              // defaultValue={1}
              type="text"
              variant="standard"
              style={{ width: "100%" }}
              onChange={handleInputChange}
              inputRef={exchangeRateRef}
              onKeyDown={handleCurrencyKeyDown}
            />
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size="1x"
              onClick={handleOpenModal}
              style={{ cursor: "pointer" }}
            />
          </ListItem>
          <Modal open={openModal} onClose={handleCloseModal}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                backgroundColor: "white",
                // border: "2px solid #000",
                borderRadius: "30px",
                padding: "20px",
                boxShadow: 24,
                p: 4,
              }}
            >
              <List>
                <h4 style={{ textAlign: "center" }}>Select AccName</h4>
                {/* <i>[1]</i> ทำปุ่มค้นหา */}
                <Divider
                  variant="middle"
                  component="li"
                  style={{ listStyle: "none" }}
                />
                {getPaginatedData().map((acccode) => (
                  <ListItem key={acccode.accCode} disablePadding>
                    <ListItemButton
                      onClick={() => handleAccCodeSelect(acccode.accCode)}
                    >
                      <ListItemText primary={acccode.accCode} />
                      <h5>{acccode.accName}</h5>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider
                variant="middle"
                component="li"
                style={{ listStyle: "none" }}
              />
              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(accCodeOptions.length / itemsPerPage)} // คำนวณจำนวนหน้า
                    page={currentPage} // กำหนดหน้าปัจจุบัน
                    onChange={handlePageChange} // ใช้ onChange เพื่อจัดการการเปลี่ยนหน้า
                  />
                </Stack>
              </div>
            </div>
          </Modal>
          <div>&nbsp;</div>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="accName"
              label="AccName"
              value={adddatadetail.accName}
              // defaultValue={1}
              type="text"
              variant="standard"
              style={{ width: "100%" }}
              onChange={handleInputChange}
              inputRef={exchangeRateRef}
            />
          </ListItem>
        </div>
        <div className="col-md-12" style={{ display: "flex" }}>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="debit"
              label="Debit"
              value={adddatadetail.debit}
              // defaultValue={1}
              type="number"
              variant="standard"
              style={{ width: "100%" }}
              onChange={handleInputChange}
              onKeyDown={handlePriceKeyDown}
              slotProps={{
                input: {
                  readOnly: true, //ห้ามแก้ยกเว้นให้แก้ที่มาจากจ็อบ
                },
              }}
            />
          </ListItem>
          <div>&nbsp;</div>
          <ListItem style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="credit"
              label="Credit"
              value={adddatadetail.credit}
              // defaultValue={1}
              type="number"
              variant="standard"
              style={{ width: "100%" }}
              onChange={handleInputChange}
              // inputRef={qtyRef}
              onKeyDown={handleQtyKeyDown}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </ListItem>
        </div>
      </div>
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
  );
}

export default RVEditDetail1;
