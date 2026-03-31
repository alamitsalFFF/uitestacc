import React, { useState, useEffect } from "react";
import { Modal, List, ListItem, ListItemButton, ListItemText, Divider, Stack, Pagination, Box, Typography } from "@mui/material";
import { API_BASE } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";

export default function CustomerModal({ open, onClose, onSelect }) {
    const [customerOptions, setCustomerOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const authFetch = useAuthFetch();

    useEffect(() => {
        if (open) {
            fetchCustomerOptions();
        }
    }, [open]);

    const fetchCustomerOptions = async () => {
        try {
            const response = await authFetch(`${API_BASE}/Customer/GetCustomer`);
            if (response.ok) {
                const data = await response.json();
                console.log('Customer Options:', data);
                setCustomerOptions(data);
            }
        } catch (error) {
            console.error("Error fetching Customer options:", error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return customerOptions.slice(startIndex, endIndex);
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
                {/* <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
                    Select Customer
                </Typography> */}
                <h4 style={{ textAlign: "center" }}>Select Customer</h4>
                <Divider variant="middle" />
                <List>
                    {getPaginatedData().map((customer) => (
                        <ListItem key={customer.customerID} disablePadding>
                            <ListItemButton onClick={() => onSelect(customer)}>
                                {/* <ListItemText
                                    primary={customer.customerCode}
                                    secondary={customer.customerName}
                                /> */}
                                <ListItemText primary={customer.customerCode} />
                                <h5>{customer.customerName}</h5>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider variant="middle" />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(customerOptions.length / itemsPerPage)}
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
