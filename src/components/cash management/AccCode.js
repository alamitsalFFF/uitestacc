import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useAuthFetch } from "../Auth/fetchConfig";
import { API_BASE } from "../api/url";

export default function AccCodeModal({
  isOpen,
  onClose,
  onSelect,
  categoryFilter = null,
}) {
  const authFetch = useAuthFetch();

  const [accCodes, setAccCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const resp = await authFetch(`${API_BASE}/AccCode/GetAccCode`);
        const data = await resp.json();
        if (!mounted) return;
        let list = Array.isArray(data) ? data : [];
        // If caller requested a category filter (e.g. 5) — keep only matching accounts.
        if (categoryFilter != null) {
          const prefix = String(categoryFilter);
          list = list.filter((acc) => {
            // try common fields for category / code
            const cat = acc.category ?? acc.cat ?? acc.grp ?? acc.group ?? acc.type ?? null;
            const code = String(acc.code ?? acc.accCode ?? acc.accountNo ?? acc.no ?? "");
            if (cat != null) return String(cat).startsWith(prefix);
            // fallback: allow account codes that start with prefix (e.g. '5')
            return code.startsWith(prefix);
          });
        }
        setAccCodes(list);
      } catch (err) {
        console.error("AccCode modal load error", err);
        if (mounted) setAccCodes([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isOpen, categoryFilter]);

  // กรองข้อมูลตามคำค้นหา
  const filteredCodes = accCodes.filter(
    (item) =>
      item.accCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAccCode = (codeData) => {
    onSelect({ code: codeData.accCode, name: codeData.accName });
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>เลือก AccCode (ผังบัญชี) 📚</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="ค้นหา AccCode หรือ ชื่อบัญชี..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        {isLoading && accCodes.length === 0 ? (
          // ปรับเงื่อนไขการแสดง Loading
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>AccCode</th>
                  <th>ชื่อบัญชี</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.length > 0 ? (
                  filteredCodes.map((item) => (
                    <tr key={item.accCode}>
                      <td>{item.accCode}</td>
                      <td>{item.accName}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSelectAccCode(item)}
                        >
                          เลือก
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      ไม่พบข้อมูล AccCode
                    </td>
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