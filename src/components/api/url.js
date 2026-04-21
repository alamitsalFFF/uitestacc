export const AccConcept = "http://103.225.168.137/AccAPITest/Api";
export const Acctest = "http://103.225.168.137/apiaccbk/api";
export const Acctest2 = "http://103.225.168.137/apiaccbk2/api";
export const AcctestMNL = "http://203.150.142.56/AccAPI/api";
export const DATA_BASE = localStorage.getItem("src"); //SRC preview report

export const Base = `Acctest2`;
export const URL = `/uitestacc/`;

// export const API_BASE = Acctest;
// export const API = Acctest2; //*******
export const API = AcctestMNL; //#######
// export const API = AccConcept ; 

export const API_BASE = API + `/Prototype`;

export const GET_VIEW_RESULT = `${API_BASE}/View/GetViewResult/`;
export const VIEW_RESULT = `/View/GetViewResult/`;
export const StoredProcedures = `/StoredProcedures/GetResult/`;

// export const REPORT_BASE = "http://203.154.140.51/AccReport";//*******
export const REPORT_BASE = "http://203.150.142.56/AccReport"; //#######
export const BASE = "AccConcept";

export const ViewResult_AccConcept = `${AccConcept}${VIEW_RESULT}`;
export const ViewResult_AccTest = `${Acctest}${VIEW_RESULT}`;
export const ViewResult_AccTest2 = `${Acctest2}${VIEW_RESULT}`;

export const API_VIEW_RESULT = `${API_BASE}${VIEW_RESULT}`;
export const StoredProcedures_Base = `${API_BASE}${StoredProcedures}`;


