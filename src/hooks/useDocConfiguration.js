import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, URL } from "../components/api/url";
import { useAuthFetch } from "../components/Auth/fetchConfig";

const useDocConfiguration = (DocType) => {
    const navigate = useNavigate();
    const authFetch = useAuthFetch();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categoryOptionsThai, setCategoryOptionsThai] = useState([]);
    const [webAddress, setWebAddress] = useState("");
    const [moduleMenu, setModuleMenu] = useState([]);

    useEffect(() => {
        if (!DocType) return;

        const fetchCategoryOptions = async () => {
            try {
                const categoryApiUrl = `${API_BASE}/DocConfig/GetDocConfig?category=${DocType}`;
                const response = await authFetch(categoryApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setCategoryOptions(data[0].eName);
                    setCategoryOptionsThai(data[0].tName);
                } else {
                    console.error("Category API did not return an array or empty.");
                }
            } catch (error) {
                console.error("Error fetching category options:", error);
            }
        };

        fetchCategoryOptions();
    }, [DocType, authFetch]);

    useEffect(() => {
        if (!DocType) return;

        const fetchWebAddress = async () => {
            try {
                const webAddressAPI = `${API_BASE}/Module/GetModuleMenu?MenuID=${DocType}`;
                const response = await authFetch(webAddressAPI);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setModuleMenu(data);
                    setWebAddress(data[0].webAddress);
                } else {
                    console.error("Module Menu API did not return an array or empty.");
                }
            } catch (error) {
                console.error("Error fetching web address:", error);
            }
        };

        fetchWebAddress();
    }, [DocType, authFetch]);

    const handleGoMenu = () => {
        if (webAddress) {
            navigate(`${URL}${webAddress}`);
        } else {
            navigate(URL);
        }
    };

    return {
        categoryOptions,
        categoryOptionsThai,
        webAddress,
        moduleMenu,
        handleGoMenu,
    };
};

export default useDocConfiguration;
