import React, { useState } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { API_BASE } from '../api/url';
import { useAuthFetch } from '../Auth/fetchConfig';
import Swal from 'sweetalert2';

export default function CompanyProfileCheckbox({ onProfileLoaded, label = "Use Company Profile" }) {
    const [checked, setChecked] = useState(false);
    const authFetch = useAuthFetch();

    const handleChange = async (event) => {
        const isChecked = event.target.checked;
        setChecked(isChecked);

        if (isChecked) {
            try {
                const response = await authFetch(`${API_BASE}/AccConfig/GetAccConfig`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter for PROFILE_CONFIG
                    const profiles = data.filter(item => item.configCode === "PROFILE_CONFIG");

                    // Create a map for easy access
                    const configMap = {};
                    profiles.forEach(item => {
                        configMap[item.configKey] = item.configValue;
                    });

                    // Prepare object to return
                    const profileData = {
                        taxNumber: configMap["COMPANY_TAXNUMBER"] || "",
                        branch: configMap["COMPANY_TAXBRANCH"] || "",
                        name: configMap["COMPANY_NAME"] || "",
                        address: configMap["COMPANY_ADDRESS1"] || ""
                    };

                    onProfileLoaded(profileData);
                } else {
                    console.error("Failed to fetch profile config");
                    Swal.fire("Error", "Failed to load company profile.", "error");
                    setChecked(false);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                Swal.fire("Error", "An error occurred while loading profile.", "error");
                setChecked(false);
            }
        } else {
            // Un-checked: Clear the data
            onProfileLoaded(null);
        }
    };

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    color="primary"
                    size="small"
                />
            }
            label={<span style={{ fontSize: '0.9rem', color: '#555' }}>{label}</span>}
        />
    );
}
