import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Auth/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faMapMarkerAlt,
  faPhone,
  faSave,
  faCogs,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { API_BASE, URL } from "../../api/url";
import FloatingActionBar from "../../DataFilters/FloatingActionBar";
import "./ProfileConfig.css";
import HeaderBar from "../../menu/HeaderBar";

// Key Mapping for the specific fields we want to show nicely
const FIELD_GROUPS = {
  identity: {
    title: "Company Identity",
    icon: faBuilding,
    class: "identity",
    fields: [
      { key: "COMPANY_NAME", label: "Company Name (Thai)", type: "text" },
      { key: "COMPANY_NAME_EN", label: "Company Name (Eng)", type: "text" },
      { key: "COMPANY_TAXNUMBER", label: "Tax ID", type: "text" },
      { key: "COMPANY_TAXBRANCH", label: "Branch Code", type: "text" },
      { key: "COMPANY_LOGO", label: "Logo Filename", type: "text" },
    ],
  },
  contact: {
    title: "Contact Details",
    icon: faPhone,
    class: "contact",
    fields: [
      { key: "COMPANY_EMAIL", label: "Email Address", type: "email" },
      { key: "COMPANY_TEL", label: "Telephone", type: "tel" },
      { key: "COMPANY_FAX", label: "Fax", type: "tel" },
      { key: "COMPANY_WEBSITE", label: "Website", type: "url" },
    ],
  },
  address: {
    title: "Location",
    icon: faMapMarkerAlt,
    class: "address",
    fields: [
      { key: "COMPANY_ADDRESS1", label: "Address (Thai)", type: "text", multiline: true },
      { key: "COMPANY_ADDRESS1_EN", label: "Address (Eng)", type: "text", multiline: true },
      { key: "COMPANY_ADDRESS2", label: "Address 2 (Thai)", type: "text", multiline: true },
      { key: "COMPANY_ADDRESS2_EN", label: "Address 2 (Eng)", type: "text", multiline: true },
    ],
  },
};

const KNOWN_KEYS = [
  ...FIELD_GROUPS.identity.fields.map((f) => f.key),
  ...FIELD_GROUPS.contact.fields.map((f) => f.key),
  ...FIELD_GROUPS.address.fields.map((f) => f.key),
];

function ProfileConfig() {
  const [configMap, setConfigMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const CONFIG_CODE = "PROFILE_CONFIG";

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/AccConfig/GetAccConfig`);
      if (response.status === 200 && response.data) {
        // Filter only PROFILE_CONFIG items
        const profiles = response.data.filter(
          (item) => item.configCode === CONFIG_CODE
        );

        // Convert array to object map for easy access: { KEY: { ...item } }
        const newMap = {};
        profiles.forEach((item) => {
          newMap[item.configKey] = item;
        });

        // Initialize known keys if they don't exist
        KNOWN_KEYS.forEach((key) => {
          if (!newMap[key]) {
            newMap[key] = {
              configCode: CONFIG_CODE,
              configKey: key,
              configValue: "",
            };
          }
        });
        console.log(newMap);
        setConfigMap(newMap);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load configuration data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setConfigMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key] || {}, // handle if keys were dynamically added
        configKey: key,
        configCode: CONFIG_CODE,
        configValue: value,
      },
    }));
  };

  const handleSave = async () => {
    const dataToSend = Object.values(configMap).filter(
      (item) => item.configValue !== undefined && item.configValue !== null
    );

    if (dataToSend.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Saving...',
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // The API EditAccConfig likely expects a single object, not an array.
      // We will send requests in parallel for each item.
      const updatePromises = dataToSend.map((item) =>
        axios.put(`${API_BASE}/AccConfig/EditAccConfig`, item, {
          headers: { "Content-Type": "application/json" },
        })
      );

      await Promise.all(updatePromises);

      Swal.fire({
        icon: "success",
        title: "Saved Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchConfig(); // Refresh data
    } catch (error) {
      console.error("Error saving config:", error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Could not save configuration settings. Please check your input.",
      });
    }
  };

  // Helper to render a field
  const renderField = (fieldConfig) => {
    const item = configMap[fieldConfig.key] || { configValue: "" };
    return (
      <div className="form-group" key={fieldConfig.key}>
        <label className="profile-form-label">{fieldConfig.label}</label>
        {fieldConfig.multiline ? (
          <textarea
            className="form-control-custom"
            rows="3"
            value={item.configValue || ""}
            onChange={(e) => handleInputChange(fieldConfig.key, e.target.value)}
          />
        ) : (
          <input
            type={fieldConfig.type || "text"}
            className="form-control-custom"
            value={item.configValue || ""}
            onChange={(e) => handleInputChange(fieldConfig.key, e.target.value)}
          />
        )}
      </div>
    );
  };

  // Identify unknown keys to show in "Additional Settings"
  const unknownKeys = Object.keys(configMap).filter(
    (key) => !KNOWN_KEYS.includes(key)
  );

  const handleGoMenu = () => {
    navigate(URL);
  };

  return (
    <div className="profile-container" >
      {/* <div className="profile-header">
        <h1 className="profile-title" onClick={handleGoMenu}>Company Profile</h1>
        <p className="profile-subtitle">Manage your organization's identity and settings</p>
      </div> */}
      <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="col-8">
          <div className="profile-header">
            <h4 className="profile-title" onClick={handleGoMenu}>Company Profile</h4>
            {/* <p className="profile-subtitle">Manage your organization's identity and settings</p> */}
            <p className="profile-subtitle">ข้อมูลกิจการ</p>
          </div>
        </div>
        <div className="col-4">
          <HeaderBar />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="profile-content">
          {/* Identity Card */}
          <div className={`profile-card ${FIELD_GROUPS.identity.class}`}>
            <div className="card-header">
              <div className="card-icon">
                <FontAwesomeIcon icon={FIELD_GROUPS.identity.icon} />
              </div>
              <h3 className="card-title">{FIELD_GROUPS.identity.title}</h3>
            </div>
            {FIELD_GROUPS.identity.fields.map(renderField)}
          </div>

          {/* Contact Card */}
          <div className={`profile-card ${FIELD_GROUPS.contact.class}`}>
            <div className="card-header">
              <div className="card-icon">
                <FontAwesomeIcon icon={FIELD_GROUPS.contact.icon} />
              </div>
              <h3 className="card-title">{FIELD_GROUPS.contact.title}</h3>
            </div>
            {FIELD_GROUPS.contact.fields.map(renderField)}
          </div>

          {/* Address Card (Full Width) */}
          <div className={`profile-card ${FIELD_GROUPS.address.class} full-width`}>
            <div className="card-header">
              <div className="card-icon">
                <FontAwesomeIcon icon={FIELD_GROUPS.address.icon} />
              </div>
              <h3 className="card-title">{FIELD_GROUPS.address.title}</h3>
            </div>
            <div className="row">
              {FIELD_GROUPS.address.fields.map((field) => (
                <div className="col-md-6" key={field.key}>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings (if any) */}
          {unknownKeys.length > 0 && (
            <div className="profile-card extra full-width">
              <div className="card-header">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faCogs} />
                </div>
                <h3 className="card-title">Additional Settings</h3>
              </div>
              <div className="row">
                {unknownKeys.map((key) => (
                  <div className="col-md-4" key={key}>
                    <div className="form-group">
                      <label className="profile-form-label">{key}</label>
                      <input
                        type="text"
                        className="form-control-custom"
                        value={configMap[key].configValue || ""}
                        onChange={(e) =>
                          handleInputChange(key, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="action-bar">
        <button className="btn-save" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} />
          Save Changes
        </button>
      </div>

      <div style={{ padding: "40px" }}>&nbsp;</div>
      <FloatingActionBar backPath={URL} />
    </div>
  );
}

export default ProfileConfig;
