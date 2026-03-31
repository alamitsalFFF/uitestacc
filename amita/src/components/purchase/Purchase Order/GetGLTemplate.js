import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { StoredProcedures_Base } from "../../api/url";
// const navigate = useNavigate();

export const GetGLTemplate = async (AccDocNoC, docConfigID) => {
    console.log("AccDocNo:", AccDocNoC);
    console.log("docConfigID:", docConfigID);
        try {
          const formData = {
            name: "GetGLTemplate",
            parameters: [
              { param: "configid", value: docConfigID },
            //   { param: "accdocno", value: AccDocNoC },
            // { param: "configid", value: 20 }, // ค่าตัวอย่างตามExpress
            { param: "accdocno", value: AccDocNoC },
              
            ],
          };
          console.log("formData:", formData);
    
          const response = await axios.post(
            `${StoredProcedures_Base}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.status === 200) {
            console.log("response", response.data);
            return response;
          } else {
            console.error("Error creating GL Template:", response.status, response.statusText);
            alert(`GL Template ไม่สำเร็จ กรุณาลองใหม่ (Status: ${response.status})`);
          }
        } catch (error) {
          console.error("Error creating GL Template:", error);
          alert("เกิดข้อผิดพลาดในการสร้าง GL Template: " + error.message);
        }
      
    return "" ;
};