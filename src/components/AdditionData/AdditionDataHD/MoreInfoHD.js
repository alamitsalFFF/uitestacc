import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Stack,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuthFetch } from "../../Auth/fetchConfig";
import { API_BASE, URL } from "../../api/url";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   // width: 450,
//   width: "66%",
//   maxWidth: "800px",
//   backgroundColor: "white",
//   borderRadius: "30px",
//   boxShadow: 24,
//   p: 4,
// };

const style = {
  position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // // width: 450,
  // width: "66%",
  // backgroundColor: "white",
  // borderRadius: "30px",
  boxShadow: 24,
  p: 4,
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "8px",
  maxWidth: "90%",
  maxHeight: "90%",
  overflowY: "auto",
  position: "relative",
  width: "90%",
  maxWidth: "600px",
  borderRadius: "30px",
  transform: "translate(-50%, -50%)",
  top: "50%",
  left: "50%",
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split(".")[0];
};

const MoreInfoHD = ({
  open,
  handleClose,
  accDocNo,
  accDocType,
  docConfigID,
  fetchDataFromApi,
}) => {
  const [moreInfoData, setMoreInfoData] = useState({});
  const [parsedDocSchema, setParsedDocSchema] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode

  console.log("MoreInfoHD props:", { open, accDocNo, accDocType, docConfigID });
  const authFetch = useAuthFetch();
  const fetchSchemaAndData = useCallback(async () => {
    console.log("docConfigID in fetchSchemaAndData:", docConfigID);
    if (
      !accDocNo ||
      !accDocType ||
      docConfigID === undefined ||
      docConfigID === null
    ) {
      console.warn(
        "Skipping fetch: Missing accDocNo, accDocType, or docConfigID is undefined/null."
      );
      return;
    }

    try {
      //console.log(localStorage.getItem("userToken"));
      // 1. Fetch Schema
      const schemaResponse = await authFetch(
        `${API_BASE}/DocConfig/GetDocConfigSchema?docConfigID=${docConfigID}&configType=0`,
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (!schemaResponse.ok) {
        throw new Error(
          `Failed to fetch form schema: ${schemaResponse.status}`
        );
      }
      const rawSchemaData = await schemaResponse.json();
      console.log("Raw schema data from API (DocConfigSchema):", rawSchemaData);

      const tempParsedSchema = [];
      if (Array.isArray(rawSchemaData) && rawSchemaData.length > 0) {
        const schemaObject = rawSchemaData[0];
        for (const key in schemaObject) {
          if (key.startsWith("field") && schemaObject[key]) {
            const valueString = schemaObject[key];
            const parts = valueString.split("=");
            if (parts.length === 2) {
              const originalTypeAndId = parts[0];
              const labelName = parts[1];

              let dataType = "text";
              let fieldName =
                labelName.charAt(0).toLowerCase() +
                labelName.slice(1).replace(/\s/g, "");

              if (originalTypeAndId.startsWith("Date")) {
                dataType = "date";
              } else if (originalTypeAndId.startsWith("Num")) {
                dataType = "number";
              }

              tempParsedSchema.push({
                fieldName: fieldName,
                labelName: labelName,
                dataType: dataType,
                originalTypeAndId: originalTypeAndId,
                readOnly: false, // Default to not readOnly from schema (controlled by isEditMode)
              });
            }
          }
        }
      }
      setParsedDocSchema(tempParsedSchema);
      console.log("Parsed schema for rendering and saving:", tempParsedSchema);

      // Initialize form data with basic info and empty fields based on schema
      let initialFormData = {
        AccDocNo: accDocNo,
        AccDocType: accDocType,
        docConfigID: docConfigID,
      };
      // Set all dynamic fields to empty string initially
      tempParsedSchema.forEach((field) => {
        initialFormData[field.fieldName] = "";
      });

      // 2. Fetch existing data from GetAdditionData
      const dataResponse = await authFetch(
        `${API_BASE}/AdditionData/GetAdditionData?DocNo=${accDocNo}&seq=0`, // Assuming accDocType is used as seq here
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (dataResponse.ok) {
        const existingMoreInfo = await dataResponse.json();
        console.log("Existing More Info data:", existingMoreInfo); //

        // *** IMPORTANT: Check if the returned DocNo matches the current accDocNo ***
        if (existingMoreInfo && existingMoreInfo.length > 0) {
          const fetchedValues = existingMoreInfo[0]; // Assuming data is in the first object
          const fetchedDocNo = fetchedValues.docNo || fetchedValues.DocNo; // Check both cases

          if (fetchedDocNo && fetchedDocNo === accDocNo) {
            //
            console.log("Fetched DocNo matches accDocNo. Populating form.");
            // Data matches current accDocNo, populate the form
            tempParsedSchema.forEach((schemaField) => {
              // Note: API returns keys in lowercase (e.g., date1, text1) based on image_2ffca0.jpg
              const apiFieldName = schemaField.originalTypeAndId.toLowerCase(); // Convert to lowercase for matching API response

              const uiFieldName = schemaField.fieldName;

              if (fetchedValues.hasOwnProperty(apiFieldName)) {
                const valueFromAPI = fetchedValues[apiFieldName];
                if (schemaField.dataType === "date") {
                  initialFormData[uiFieldName] =
                    formatDateForInput(valueFromAPI);
                } else if (schemaField.dataType === "number") {
                  initialFormData[uiFieldName] = parseFloat(valueFromAPI) || "";
                } else {
                  initialFormData[uiFieldName] = String(valueFromAPI || "");
                }
              }
            });
          } else {
            // Data fetched does NOT match the current accDocNo, or docNo is missing
            console.warn(
              `Fetched data's DocNo (${fetchedDocNo}) does not match current AccDocNo (${accDocNo}). Form fields will remain empty/default.`
            );
            // No need to explicitly clear here, as initialFormData is already cleared/defaulted.
          }
        } else {
          console.warn(
            "No existing more info data found for this accDocNo, or empty array."
          );
          // Form fields will remain empty/default as initialFormData is already prepared.
        }
      } else {
        console.warn(
          `Could not fetch existing more info data: ${dataResponse.status}`
        );
      }

      setMoreInfoData(initialFormData);
      setCurrentPage(1);
      setIsEditMode(false); // Always start in view mode
    } catch (error) {
      console.error("Error fetching schema or existing data:", error);
      setParsedDocSchema([]);
      setMoreInfoData({ AccDocNo: accDocNo, AccDocType: accDocType }); // Reset with basic info
      Swal.fire({
        icon: "error",
        title: //Failed to load form configuration or data 
          `กรุณาเพิ่มข้อมูลของ Doctype:${accDocType} ที่ Masterfile/Optional Field Schema `,
        // text: error.message || "Please try again.",
      });
    }
  }, [
    accDocNo,
    accDocType,
    docConfigID,
    setParsedDocSchema,
    setMoreInfoData,
    setCurrentPage,
    setIsEditMode,
  ]);

  useEffect(() => {
    if (open && docConfigID) {
      fetchSchemaAndData();
    } else if (!open) {
      setMoreInfoData({});
      setParsedDocSchema([]);
      setCurrentPage(1);
      setIsEditMode(false); // Reset to view mode when modal closes
    }
  }, [open, docConfigID, fetchSchemaAndData]);

  const getApiValue = (value, dataType) => {
    if (value === "" || value === null || value === undefined) {
      return null; // For all types, if empty or null, send as null
    }

    if (dataType === "date") {
      return formatDateForAPI(value); // Already handles null/empty string
    } else if (dataType === "number") {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? null : numValue; // Send null if not a valid number
    } else {
      return String(value); // For text, ensure it's a string, or null if empty
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMoreInfoData({
      ...moreInfoData,
      [name]:
        e.target.type === "number"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    });
  };

  const handleSaveMoreInfo = async () => {
    console.log("Saving NEW More Info. Current moreInfoData:", moreInfoData);
    try {
      const payloadToSend = {
        AccDocNo: accDocNo,
        // AccDocType: accDocType,
        Seq: 0,
        // docConfigID: docConfigID,
      };

      payloadToSend.DocNo = accDocNo; // Ensure DocNo from prop is always included in payload

      parsedDocSchema.forEach((field) => {
        const value = moreInfoData[field.fieldName];

        if (field.dataType === "date") {
          payloadToSend[field.originalTypeAndId] = formatDateForAPI(value);
        } else if (field.dataType === "number") {
          payloadToSend[field.originalTypeAndId] = parseFloat(value) || 0;
        } else {
          payloadToSend[field.originalTypeAndId] = String(value || "");
        }
      });

      // parsedDocSchema.forEach((field) => {
      //   const value = moreInfoData[field.fieldName];
      //   payloadToSend[field.originalTypeAndId] = getApiValue(value, field.dataType);
      // });

      const finalPayload = [payloadToSend]; // SetAdditionData expects an array of objects
      console.log(
        "Final Payload being sent to SetAdditionData (POST):",
        JSON.stringify(finalPayload)
      );
      const response = await authFetch(
        `${API_BASE}/AdditionData/SetAdditionData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(finalPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response Body:", errorText);
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += `, message: ${errorData.title ||
            errorData.message ||
            (errorData.errors && JSON.stringify(errorData.errors)) ||
            "Unknown error"
            }`;
        } catch (e) {
          errorMessage += `, raw response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      handleClose();
      Swal.fire({
        icon: "success",
        title: "More Info saved successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      setIsEditMode(false);
      if (fetchDataFromApi) {
        fetchDataFromApi(accDocType);
      }
    } catch (error) {
      console.error("Error saving more info:", error);
      // handleClose();
      Swal.fire({
        icon: "error",
        title: "Failed to save More Info",
        // text: error.message || "Please try again.",
        text: "Duplicate data" || "Please try again.",
      });
    }
  };

  const handleEditMoreInfo = async () => {
    console.log(
      "Editing Existing More Info. Current moreInfoData:",
      moreInfoData
    );
    try {
      const payloadToSend = {
        AccDocNo: accDocNo,
        AccDocType: accDocType,
        Seg: 0,
        docConfigID: docConfigID,
      };

      payloadToSend.DocNo = accDocNo; // Ensure DocNo from prop is always included in payload

      // parsedDocSchema.forEach((field) => {
      //   const value = moreInfoData[field.fieldName];
      //   payloadToSend[field.originalTypeAndId] = getApiValue(value, field.dataType);
      // });
      parsedDocSchema.forEach((field) => {
        const value = moreInfoData[field.fieldName];
        if (field.dataType === "date") {
          payloadToSend[field.originalTypeAndId] = formatDateForAPI(value);
        } else if (field.dataType === "number") {
          payloadToSend[field.originalTypeAndId] = parseFloat(value) || 0;
        } else {
          payloadToSend[field.originalTypeAndId] = String(value || "");
        }
      });

      const finalPayload = payloadToSend; // EditAdditionData (PUT) expects a single object
      console.log(
        "Final Payload being sent to EditAdditionData (PUT):",
        JSON.stringify(finalPayload)
      );

      const response = await authFetch(
        `${API_BASE}/AdditionData/EditAdditionData`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(finalPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response Body:", errorText);
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += `, message: ${errorData.title ||
            errorData.message ||
            (errorData.errors && JSON.stringify(errorData.errors)) ||
            "Unknown error"
            }`;
        } catch (e) {
          errorMessage += `, raw response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      Swal.fire({
        icon: "success",
        title: "More Info Edited Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditMode(false);
      handleClose();
      if (fetchDataFromApi) {
        fetchDataFromApi(accDocType);
      }
    } catch (error) {
      console.error("Error editing more info:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Edit More Info",
        text: error.message || "Please try again.",
      });
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedSchema = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return parsedDocSchema.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(parsedDocSchema.length / itemsPerPage);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDocConfigSchema = () => {
    window.location.href = `${URL}DocConfigSchema?docConfigID=${docConfigID}`;
  };

  const handleCancelEdit = () => {
    fetchSchemaAndData(); // Re-fetch data to revert changes and reset mode
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="more-info-modal-title"
      aria-describedby="more-info-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="more-info-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
        >
          Header More Info for {accDocNo}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {getPaginatedSchema().map((field) => (
            <TextField
              key={field.originalTypeAndId}
              fullWidth
              margin="normal"
              label={field.labelName}
              name={field.fieldName}
              value={
                field.dataType === "number" &&
                  moreInfoData[field.fieldName] === 0
                  ? ""
                  : moreInfoData[field.fieldName] || ""
              }
              onChange={handleInputChange}
              type={
                field.dataType === "date"
                  ? "date"
                  : field.dataType === "number"
                    ? "number"
                    : "text"
              }
              InputProps={{
                readOnly: !isEditMode || field.readOnly,
                style: {
                  backgroundColor: "#ffffe0",
                },
                placeholder: field.fieldName,
              }}
              InputLabelProps={{
                shrink:
                  field.dataType === "date" ||
                  field.dataType === "number" ||
                  (moreInfoData[field.fieldName] &&
                    moreInfoData[field.fieldName].length > 0),
              }}
              variant="standard"
            />
          ))}
        </Box>

        {totalPages > 1 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>
            </Box>
          </>
        )}

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          {parsedDocSchema.length === 0 && (
            <Button
              variant="contained"
              onClick={handleDocConfigSchema}
              style={{ backgroundColor: "#53038c", color: "white" }}
            >
              More Info {/* to DocConfigSchema */}
            </Button>
          )}
          {!isEditMode && parsedDocSchema.length > 0 && (
            <Button variant="contained" onClick={handleToggleEditMode}>
              Edit More Info
            </Button>
          )}

          {isEditMode && (
            <>
              <Button variant="contained" onClick={handleEditMoreInfo}>
                Save Edit
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "green", color: "white" }}
                onClick={handleSaveMoreInfo}
              >
                Save New
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default MoreInfoHD;
