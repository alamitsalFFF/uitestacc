import re

file_path = r"c:\Users\tawan\Desktop\uitestacc\src\components\cash management\AccordionQuickBuyAssetMain.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the start of the return statement
start_index = content.find("  return (\n    <div>\n      <Form")

if start_index == -1:
    print("Could not find start index")
    exit(1)

new_return_block = """  const SectionHeader = ({ icon, title, color }) => (
    <Typography variant="h6" style={{ color: color || "#333", display: "flex", alignItems: "center", marginBottom: "15px", fontWeight: "bold" }}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: "10px" }} /> {title}
    </Typography>
  );

  return (
    <div style={{ padding: "20px 5%" }}>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="form-pr"
      >
        <Grid container spacing={3}>
          {/* 1. Product Information */}
          <Grid item xs={12}>
            <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #1976d2" }}>
              <CardContent>
                <SectionHeader icon={faCube} title="Product Information" color="#1976d2" />
                <Row className="mb-4">
                  <Form.Group as={Col} md="4" controlId="productcode">
                    <Form.Label style={{ display: "flex" }}>
                      Product &nbsp;
                      {!showEditDetailModal && (
                        <Stack direction="row" spacing={1}>
                          <FontAwesomeIcon
                            icon={faSquarePlus}
                            size="xl"
                            style={{ color: "#0300b6ff", justifyItems: "end", cursor: "pointer" }}
                            onClick={handleProductSelect}
                          />
                        </Stack>
                      )}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="กรุณากรอกชื่อสินค้า/เลือกสินค้า"
                        value={productName}
                        style={{ backgroundColor: "#ffffe0" }}
                      />
                    </InputGroup>
                  </Form.Group>
                  <AccordionSelectProductCS
                    isOpen={openProductModal}
                    onClose={handleCloseProductModal}
                    onSave={handleConfirmProductSelection}
                  />

                  <Form.Group as={Col} md="4" controlId="currency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select required defaultValue="THB" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกสกุลเงิน...
                      </option>
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกสกุลเงิน
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="rate">
                    <Form.Label>Rate</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="อัตราแลกเปลี่ยน"
                      value={excrate}
                      onChange={(e) => setExcrate(e.target.value)}
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกอัตราแลกเปลี่ยน
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="qty">
                    <Form.Label>Qty</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="จำนวน"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกจำนวน
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="ราคาต่อหน่วย"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอราคาต่อหน่วย
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="ref">
                    <Form.Label>Ref Doc</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="เลขประจำตัวทรัพย์สิน/เลขใบสั่งซื้อ/ใบส่งของ"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกเลขประจำตัวทรัพย์สิน/เลขใบสั่งซื้อ/ใบส่งของ
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="docdate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Party Information */}
          <Grid item xs={12} md={7}>
            <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #2e7d32" }}>
              <CardContent>
                <SectionHeader icon={faUserTie} title="Party Information" color="#2e7d32" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="partycode">
                    <Form.Label>PartyCode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="รหัสผู้จำหน่าย"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกรหัสผู้จำหน่าย
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="8" controlId="partytaxcode">
                    <Form.Label>PartyTax</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="เลขประจำตัวผู้เสียภาษี/ลำดับสาขา"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกเลขประจำตัวผู้เสียภาษี/ลำดับสาขา
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="partyname">
                    <Form.Label>PartyName</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชื่อผู้จำหน่าย"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกชื่อผู้จำหน่าย
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="partyaddr">
                    <Form.Label>PartyAddr</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ที่อยู่ผู้จำหน่าย"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกที่อยู่ผู้จำหน่าย
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Notes & Support */}
          <Grid item xs={12} md={5}>
            <Card elevation={3} style={{ borderRadius: "15px", height: "100%", borderLeft: "5px solid #6a1b9a" }}>
              <CardContent>
                <SectionHeader icon={faNoteSticky} title="Notes & Support" color="#6a1b9a" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="userid">
                    <Form.Label>Support By</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      defaultValue={localStorage.getItem("userName")}
                      readOnly
                      style={{ backgroundColor: "#cdcdd1" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกผู้บันทึก
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="note">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="หมายเหตุ/สัญญาเลขที่ 1505/2566/5555"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกหมายเหตุ.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>

          {/* 4. Financials & Tax */}
          <Grid item xs={12}>
            <Card elevation={3} style={{ borderRadius: "15px", borderLeft: "5px solid #f9a825" }}>
              <CardContent>
                <SectionHeader icon={faMoneyCheckDollar} title="Financials & Tax" color="#f9a825" />
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="vatrate">
                    <Form.Label>VatRate</Form.Label>
                    <Form.Select required defaultValue="7" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกอัตราภาษี...
                      </option>
                      {vatrates.map((vatrate) => (
                        <option key={vatrate.value} value={vatrate.value}>
                          {vatrate.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกอัตราภาษี
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="whtrate">
                    <Form.Label>WhtRate</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกอัตราภาษีหัก ณ ที่จ่าย...
                      </option>
                      {whtrates.map((whtrate) => (
                        <option key={whtrate.value} value={whtrate.value}>
                          {whtrate.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกอัตราภาษีหัก ณ ที่จ่าย
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="vattype">
                    <Form.Label>VatType</Form.Label>
                    <Form.Select required defaultValue="1" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกประเภทการคิด...
                      </option>
                      {vattypes.map((vattype) => (
                        <option key={vattype.value} value={vattype.value}>
                          {vattype.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      กรุณาเลือกประเภทการคิด
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="doctype">
                    <Form.Label style={{ display: "flex" }}>
                      DocType &nbsp;
                      <Stack direction="row" spacing={1}>
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          size="xl"
                          style={{
                            color: "#0300b6ff",
                            justifyItems: "end",
                            cursor: "pointer",
                          }}
                          onClick={handleOpenDocTypeModal}
                        />
                      </Stack>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาเลือกDocType+"
                        value={
                          selectedDocType.code
                            ? `${selectedDocType.code} / ${selectedDocType.name}`
                            : ""
                        }
                        required
                        style={{ backgroundColor: "#ffffe0" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณาเลือก DocType
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <DocTypeModal
                    isOpen={openDocTypeModal}
                    onClose={handleCloseDocTypeModal}
                    onSelect={handleConfirmDocTypeSelection}
                  />

                  <Form.Group as={Col} md="4" controlId="acctype">
                    <Form.Label>Acctype</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกประเภทการชำระเงิน...
                      </option>
                      {acctypes.map((acctype) => (
                        <option key={acctype.value} value={acctype.value}>
                          {acctype.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      กรุณาเลือกประเภทการชำระเงิน
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="acccode">
                    <Form.Label style={{ display: "flex" }}>
                      Acccode  &nbsp;
                      <Stack direction="row" spacing={1}>
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          size="xl"
                          style={{
                            color: "#0300b6ff",
                            justifyItems: "end",
                            cursor: "pointer",
                          }}
                          onClick={handleOpenAccCodeModal} 
                        />
                      </Stack>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="กรุณาเลือกAccCode+"
                        value={
                          selectedAccCode.code
                            ? `${selectedAccCode.code} / ${selectedAccCode.name}`
                            : ""
                        }
                        required
                        style={{ backgroundColor: "#ffffe0" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณาเลือก AccCode
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <AccCodeModal
                    isOpen={openAccCodeModal}
                    onClose={handleCloseAccCodeModal}
                    onSelect={handleConfirmAccCodeSelection}
                  />
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="rcpno">
                    <Form.Label>RCPNO</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="เลขใบเสร็จ/ใบกำกับที่ได้มา"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอกเลขใบเสร็จ/ใบกำกับที่ได้มา
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="trantype">
                    <Form.Label>Trantype</Form.Label>
                    <Form.Select required defaultValue="0" style={{ backgroundColor: "#ffffe0" }}>
                      <option value="" disabled>
                        เลือกประเภทTR/CQ...
                      </option>
                      {transtype.map((trantype) => (
                        <option key={trantype.value} value={trantype.value}>
                          {trantype.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="bankcode">
                    <Form.Label>Bankcode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชื่อธนาคาร(กรณีเงินโอน)"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="bankname">
                    <Form.Label>Bankname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชื่อสาขา/สมุดบัญชี/เลข Ref (กรณีเงินโอน)"
                      required
                      style={{ backgroundColor: "#ffffe0" }}
                    />
                  </Form.Group>
                </Row>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </Form>
    </div>
  );
}

export default AccordionQuickBuyAssetMain;
"""

new_content = content[:start_index] + new_return_block

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement successful")
