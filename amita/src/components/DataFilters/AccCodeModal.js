import { useState } from "react";

const AccCodeModal = (allAccCode, filterTypes) => {
  const [openModal, setOpenModal] = useState(false);
  const [accCodeOptions, setAccCodeOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenModal = () => {
    // const isFilterTypeSelected = !!filterType;
    const isFilterTypeSelected = Array.isArray(filterTypes) && filterTypes.length > 0;
     const mainCodes = allAccCode.filter((code) => {
      // ตรวจสอบว่า code.accCode มีค่าและ AccTypeID มีค่า
      if (!code.accCode || !code.accTypeID) {
        return false;
      }
      
      const firstDigit = code.accCode.toString().charAt(0);

      if (isFilterTypeSelected) {
        // ใช้ .includes() เพื่อตรวจสอบว่า firstDigit มีอยู่ใน array filterTypes หรือไม่
        return filterTypes.includes(firstDigit);
      }

      // ถ้าไม่มีการกำหนด filterTypes ก็ใช้เงื่อนไขเดิม
      const validStartingDigits = ["1", "2", "3", "4", "5"];
      return validStartingDigits.includes(firstDigit);
    });

    setAccCodeOptions(mainCodes);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accCodeOptions.slice(startIndex, endIndex);
  };

  return {
    openModal,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    getPaginatedData,
    accCodeOptions,
    currentPage,
    itemsPerPage,
  };
};

export default AccCodeModal;
