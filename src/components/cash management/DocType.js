import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap'; 
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE } from '../api/url';


function DocTypeModal({ isOpen, onClose, onSelect }) {
    const authFetch = useAuthFetch(); 
    const [docTypes, setDocTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    // ฟังก์ชันสำหรับเรียก API DocType
    const fetchDocTypes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authFetch(`${API_BASE}/DocConfig/GetDocConfig`);
            
            // ตรวจสอบสถานะการตอบกลับ
            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            // 💡 สมมติว่าข้อมูล DocType มีฟิลด์เป็น docType และ docName 
            //    ถ้าฟิลด์ชื่ออื่น (เช่น docCode, name) ต้องปรับแก้ตรงนี้
            console.log("Fetched DocTypes:", data); // ตรวจสอบข้อมูลที่ได้รับ
            setDocTypes(data); 

        } catch (err) {
            console.error("Error fetching DocTypes:", err);
            setError("ไม่สามารถโหลดข้อมูล DocType ได้");
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]); 

    // ดึงข้อมูลเมื่อ Modal เปิด
    useEffect(() => {
        // โหลดข้อมูลเมื่อ Modal เปิด และข้อมูลยังไม่มี
        if (isOpen && docTypes.length === 0) {
            fetchDocTypes();
        }
    }, [isOpen, docTypes.length, fetchDocTypes]); 

    // กรองข้อมูลตามคำค้นหา
    const filteredDocTypes = docTypes.filter(item =>
        // item.docConfigID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectDocType = (docTypeData) => {
        // ส่ง Object ที่มี docType และ docName กลับไป
        onSelect({ code: docTypeData.category, name: docTypeData.eName }); 
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>เลือก DocType</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="ค้นหา DocType หรือ ชื่อเอกสาร..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                />
                {error && <p className="text-danger">Error: {error}</p>}
                {isLoading && docTypes.length === 0 ? ( 
                    <p>กำลังโหลดข้อมูล...</p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>DocType</th>
                                    <th>ชื่อเอกสาร</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocTypes.length > 0 ? (
                                    filteredDocTypes.map((item) => (
                                        <tr key={item.docconfigID}>
                                            <td>{item.category}</td>
                                            <td>{item.eName}</td>
                                            <td>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={() => handleSelectDocType(item)}
                                                >
                                                    เลือก
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">ไม่พบข้อมูล DocType</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    ยกเลิก
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DocTypeModal;