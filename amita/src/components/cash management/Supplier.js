import { useState, useEffect } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Supplier.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Divider from "@mui/material/Divider";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE } from "../api/url";

function SupplierList({ supplier }) {
  return (
    <div className="row">
      <div className="col-md-12">
        <Divider
          variant="middle"
          component="li"
          style={{ listStyle: "none" }}
        />
      </div>
      <div className="card-header" style={{ display: "flex" }}>
        <div className="col-md-3">
          <FontAwesomeIcon icon={faCheck} size="1x" />
        </div>
        <div className="col-md-9">
          <p>{supplier.supplierName}</p>
        </div>
      </div>
      <div className="card-body">{/* <p>{supplier.supplierName}</p> */}</div>
    </div>
  );
}

function QCSupplier() {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // State สำหรับเก็บรายการที่เลือก
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch(`${API_BASE}/Supplier/GetSupplier`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleItemSelect = (item) => {
    const isSelected = selectedItems.find(
      (selectedItem) => selectedItem.id === item.id
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleConfirm = () => {
    navigate("/", { state: { selectedItems } }); // ส่งรายการที่เลือกกลับ QuickCash
  };
  return (
    //   <div>c
    //   <h1>Select Item</h1>
    //   <div className="item-list">
    //     {data.map(item => (
    //       <div
    //         key={item.supplierID}
    //         className="item"
    //         onClick={() => handleItemSelect(item)} // คลิกที่รายการเพื่อเลือก
    //       >
    //         <input
    //           type="checkbox" // หรือ type="radio" ถ้าต้องการเลือกได้แค่ 1 รายการ
    //           checked={selectedItems.find(selectedItem => selectedItem.id === item.id)}
    //           onChange={() => {}} // ป้องกันการเปลี่ยนแปลง checkbox โดยตรง
    //         />
    //         <span>{item.supplierCode}</span>
    //         <span>{item.supplierEName}</span>
    //         <span>{item.taxNumber}</span>
    //       </div>
    //     ))}
    //   </div>
    //   <button onClick={handleConfirm}>Confirm</button> {/* ปุ่มยืนยันการเลือก */}
    // </div>

    <div>
      <h1 className="h1-pr">Supplier</h1>
      <div className="supplier-list">
        <div className="col-md-12">
          {data.map((supplier) => (
            <SupplierList key={supplier.supplierID} supplier={supplier} />
          ))}
        </div>
      </div>
      {/* <button onClick={handleConfirm}>Confirm</button> */}
      {/*ปุ่มยืนยันการเลือก */}
    </div>
  );
}
export default QCSupplier;
