export const SET_ACC_DOC_NO = 'SET_ACC_DOC_NO';
export const SET_ACC_ITEM_NO = 'SET_ACC_ITEM_NO';
export const SET_DETAIL_DATA = 'SET_DETAIL_DATA';
export const SET_SELECTED_PRODUCTS = 'SET_SELECTED_PRODUCTS';
export const SET_ADD_PRODUCTS = 'SET_ADD_PRODUCTS';
export const SET_TOTAL_AMOUNT = 'SET_TOTAL_AMOUNT';
export const SET_VAT_AMOUNT = 'SET_VAT_AMOUNT';
export const SET_WHT_AMOUNT = 'SET_WHT_AMOUNT';
export const SET_IS_VAT_ENABLED = 'SET_IS_VAT_ENABLED';
export const SET_IS_WHT_ENABLED = 'SET_IS_WHT_ENABLED';
export const SET_ACC_EFFECTIVE_DATE = 'SET_ACC_EFFECTIVE_DATE';
export const SET_PARTY_CODE = 'SET_PARTY_CODE';
export const SET_PARTY_NAME = 'SET_PARTY_NAME';
export const SET_NAME_CATEGORY = 'SET_NAME_CATEGORY';
export const SET_ACC_DOC_TYPE = 'SET_ACC_DOC_TYPE';
// เพิ่ม action types อื่นๆ ตามต้องการ
export const SET_ACC_DOC_NO_TRAN = 'SET_ACC_DOC_NO_TRAN';
export const SET_STATUS_NAME = 'SET_STATUS_NAME';
export const CLEAR_SELECTED_PRODUCTS = 'CLEAR_SELECTED_PRODUCTS';

export const setAccDocNo = (accDocNo) => ({
  type: SET_ACC_DOC_NO,
  payload: accDocNo,
});

export const setAccItemNo = (accItemNo) => ({
  type: SET_ACC_ITEM_NO,
  payload: accItemNo,
});

export const setDetailData = (detailData) => ({
  type: SET_DETAIL_DATA,
  payload: detailData,
});

export const setSelectedProducts = (selectedProducts) => ({
  type: SET_SELECTED_PRODUCTS,
  payload: selectedProducts,
});

export const setAddProducts = (addProducts) => ({
  type: SET_ADD_PRODUCTS,
  payload: addProducts,
});

export const setTotalAmount = (totalAmount) => ({
  type: SET_TOTAL_AMOUNT,
  payload: totalAmount,
});

export const setVatAmount = (vatAmount) => ({
  type: SET_VAT_AMOUNT,
  payload: vatAmount,
});

export const setWhtAmount = (whtAmount) => ({
  type: SET_WHT_AMOUNT,
  payload: whtAmount,
});

export const setIsVatEnabled = (isVatEnabled) => ({
  type: SET_IS_VAT_ENABLED,
  payload: isVatEnabled,
});

export const setIsWhtEnabled = (isWhtEnabled) => ({
  type: SET_IS_WHT_ENABLED,
  payload: isWhtEnabled,
});

export const setAccEffectiveDate = (accEffectiveDate) => ({
  type: SET_ACC_EFFECTIVE_DATE,
  payload: accEffectiveDate,
});

export const setPartyCode = (partyCode) => ({
  type: SET_PARTY_CODE,
  payload: partyCode,
});

export const setPartyName = (partyName) => ({
  type: SET_PARTY_NAME,
  payload: partyName,
});

export const setNameCategory = (nameCategory) => ({
  type: SET_NAME_CATEGORY,
  payload: nameCategory,
});
export const setAccDocType = (accDocType) => ({
  type: SET_ACC_DOC_TYPE,
  payload: accDocType,
});
export const setStatusName = (statusName) => ({
  type: SET_STATUS_NAME,
  payload: statusName,
});

// เพิ่ม action creators อื่นๆ ตามต้องการ
export const setAccDocNotran = (accDocNoT) => ({
  type: SET_ACC_DOC_NO_TRAN,
  payload: accDocNoT,
});

export const clearSelectedProducts = () => ({
  type: "CLEAR_SELECTED_PRODUCTS",
});