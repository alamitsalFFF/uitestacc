import React, { useState, useEffect } from "react";
import { Modal, List, ListItem, ListItemButton, ListItemText, Divider, Stack, Pagination, Box, Typography } from "@mui/material";
import { API_BASE } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";

export default function SupplierModal({ open, onClose, onSelect }) {
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const authFetch = useAuthFetch();

    useEffect(() => {
        if (open) {
            fetchSupplierOptions();
        }
    }, [open]);

    const fetchSupplierOptions = async () => {
        try {
            const response = await authFetch(`${API_BASE}/Supplier/GetSupplier`);
            if (response.ok) {
                const data = await response.json();
                console.log('Supplier Options:', data);
                setSupplierOptions(data);
            }
        } catch (error) {
            console.error("Error fetching Supplier options:", error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return supplierOptions.slice(startIndex, endIndex);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: "30px",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                {/* <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                    Select Supplier
                </Typography> */}
                <h4 style={{ textAlign: "center" }}>Select Supplier</h4>
                <Divider variant="middle" />
                <List>
                    {getPaginatedData().map((supplier) => (
                        <ListItem key={supplier.supplierID} disablePadding>
                            <ListItemButton onClick={() => onSelect(supplier)}>
                                {/* <ListItemText
                                    primary={supplier.supplierCode}
                                    secondary={supplier.supplierName}
                                /> */}
                                <ListItemText primary={supplier.supplierCode} />
                                <h5>{supplier.supplierName}</h5>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider variant="middle" />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(supplierOptions.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
}
