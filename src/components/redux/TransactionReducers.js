import {
  SET_ACC_DOC_NO,
  SET_ACC_DOC_NO_TRAN,
  SET_ACC_ITEM_NO,
  SET_DETAIL_DATA,
  SET_SELECTED_PRODUCTS,
  SET_ADD_PRODUCTS,
  SET_TOTAL_AMOUNT,
  SET_VAT_AMOUNT,
  SET_WHT_AMOUNT,
  SET_IS_VAT_ENABLED,
  SET_IS_WHT_ENABLED,
  SET_ACC_EFFECTIVE_DATE,
  SET_PARTY_CODE,
  SET_PARTY_NAME,
  SET_NAME_CATEGORY,
  SET_ACC_DOC_TYPE,
  // เพิ่ม action types อื่นๆ ตามต้องการ
} from "../redux/TransactionDataaction";

const initialState = {
  accDocNoT:null,
  accDocNo: null,
  accItemNo: [],
  detailData: null,
  selectedProducts: [],
  addProducts: [],
  totalAmount: 0,
  vatAmount: 0,
  whtAmount: 0,
  isVatEnabled: [],
  isWhtEnabled: [],
  accEffectiveDate: null,
  partyCode: null,
  partyName: null,
  nameCategory: null,
  accDocType: null,
  // เพิ่ม state อื่นๆ ตามต้องการ
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACC_DOC_NO_TRAN:
      console.log("Reducer payload AccDocNoT:", action.payload);
      console.log("Reducer payload AccDocNoT:",typeof action.payload);
      return { ...state, accDocNoT: action.payload };
    case SET_ACC_DOC_NO:
      console.log("Reducer payload AccDocNo:", action.payload);
      return { ...state, accDocNo: action.payload };
    case SET_ACC_ITEM_NO:
      return { ...state, accItemNo: action.payload };
    case SET_DETAIL_DATA:
      return { ...state, detailData: action.payload };
    case SET_SELECTED_PRODUCTS:
      console.log("Reducer payload selectedProducts:", action.payload);
      return { ...state, selectedProducts: action.payload };
    case SET_ADD_PRODUCTS:
      return { ...state, addProducts: action.payload };
    case SET_TOTAL_AMOUNT:
      return { ...state, totalAmount: action.payload };
    case SET_VAT_AMOUNT:
      return { ...state, vatAmount: action.payload };
    case SET_WHT_AMOUNT:
      return { ...state, whtAmount: action.payload };
    case SET_IS_VAT_ENABLED:
      return { ...state, isVatEnabled: action.payload };
    case SET_IS_WHT_ENABLED:
      return { ...state, isWhtEnabled: action.payload };
    case SET_ACC_EFFECTIVE_DATE:
      console.log("Reducer payload AccEffectiveDate:", action.payload);
      return { ...state, accEffectiveDate: action.payload };
    case SET_PARTY_CODE:
      return { ...state, partyCode: action.payload };
    case SET_PARTY_NAME:
      console.log("Reducer payload PartyName:", action.payload);
      return { ...state, partyName: action.payload };
    case SET_NAME_CATEGORY:
      console.log("Reducer payload nameCategory:", action.payload);
      return { ...state, nameCategory: action.payload };
    case SET_ACC_DOC_TYPE:
      return { ...state, accDocType: action.payload };
    case "CLEAR_SELECTED_PRODUCTS":
      return {
        ...state,
        selectedProducts: [],
      };
    // เพิ่ม case อื่นๆ ตามต้องการ
    default:
      return state;
  }
};

export default rootReducer;
