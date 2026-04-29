/**
 * OCRFieldMapper.js
 * Utility for parsing raw OCR text from Thai/English PO documents
 */

export function parseOCRTextForPO(rawText) {
  const text = rawText || '';
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const result = {
    accDocNo: '',
    accEffectiveDate: '',
    dueDate: '',
    issueBy: '',
    jobName: '',
    partyName: '',
    partyAddress: '',
    partyTaxCode: '',
    totalAmount: '',
    vatAmount: '',
    netAmount: '',
    whtAmount: '',
    payAmount: '',
    lineItems: [],
  };

  // 1. PO Document Number — รองรับทั้ง "PO" และ "P0" (OCR มักอ่าน O เป็น 0)
  const poMatch = text.match(/P[O0]\s*\d{6,}/i);
  if (poMatch) result.accDocNo = poMatch[0].replace(/\s+/g, '').toUpperCase().replace(/^P0/i, 'PO');

  // 2. Dates DD/MM/YYYY or YYYY-MM-DD
  const dateMatches = [...text.matchAll(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/g)].map((m) => m[1]);
  if (dateMatches.length >= 1) result.accEffectiveDate = dateMatches[0];
  if (dateMatches.length >= 2) result.dueDate = dateMatches[1];

  // 3. หา 13-digit Tax Numbers ทั้งหมด
  const taxMatches = [...text.matchAll(/\b(\d{13})\b/g)];
  // tax[0] = buyer, tax[1] = vendor (ถ้ามี 2 ตัว)
  if (taxMatches.length >= 2) {
    result.partyTaxCode = taxMatches[1][1];
  } else if (taxMatches.length === 1) {
    result.partyTaxCode = taxMatches[0][1];
  }

  // 4. ผู้สั่งซื้อ
  const issuedByMatch = text.match(/ผู้สั่งซื้อ\s*[:\s]*([^\n]+)/i);
  // if (issuedByMatch) result.issueBy = issuedByMatch[1].trim();
  // ถ้า OCR อ่านได้ใช้ค่านั้น ถ้าไม่ได้ใช้ชื่อผู้ใช้ที่ล็อคอินอยู่
  // result.issueBy = issuedByMatch
  //   ? issuedByMatch[1].trim()
  //   : (localStorage.getItem('userName') || '');
  result.issueBy = (localStorage.getItem('userName'));

  // 5. ชื่องาน / ชื่อสินค้า / อ้างอิง
  const jobMatch = text.match(/ชื่องาน\s*[:\s]*([^\n]+)/i);
  if (jobMatch) result.jobName = jobMatch[1].trim();

  // 6. ========================
  //    Vendor Name + Address
  //    Strategy: หาชื่อ vendor จาก block ก่อน tax ID ที่สอง
  // ========================
  if (taxMatches.length >= 2) {
    // หาตำแหน่งของ tax ID ที่สองในข้อความ
    const vendorTaxId = taxMatches[1][1];
    const vendorTaxPos = text.indexOf(vendorTaxId, taxMatches[0].index + taxMatches[0][1].length);

    if (vendorTaxPos > 0) {
      // ตัดข้อความส่วนหน้า tax ID ที่สอง
      const textBeforeVendorTax = text.substring(0, vendorTaxPos);
      const linesBeforeVendorTax = textBeforeVendorTax
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 3 && !/^\d+$/.test(l)); // กรองบรรทัดสั้นและตัวเลขล้วน

      // บรรทัดสุดท้ายก่อน tax ID = ที่อยู่ vendor
      // บรรทัดก่อนหน้า = ชื่อ vendor
      const n = linesBeforeVendorTax.length;
      if (n >= 2) {
        // ชื่อ vendor คือบรรทัดที่มีคำว่า นาย/นาง/บริษัท/ห้างหุ้นส่วน ก่อน tax
        let vendorNameLine = '';
        let vendorAddressLine = '';
        for (let i = n - 1; i >= 0; i--) {
          const l = linesBeforeVendorTax[i];
          // บรรทัดที่มีตัวเลขปนกับคำ = ที่อยู่
          if (/\d/.test(l) && /[ก-๙]/.test(l) && !vendorAddressLine) {
            vendorAddressLine = l;
          }
          // บรรทัดที่เป็นชื่อคน/บริษัท
          else if ((/(นาย|นาง|น\.ส\.|บริษัท|ห้างหุ้นส่วน)/i.test(l) || /^[A-Z]/.test(l)) && !vendorNameLine) {
            vendorNameLine = l;
          }
          if (vendorNameLine && vendorAddressLine) break;
        }
        // ถ้าหา name ไม่ได้ ให้ใช้บรรทัดที่ n-2 (สองบรรทัดก่อน tax)
        if (!vendorNameLine && n >= 2) vendorNameLine = linesBeforeVendorTax[n - 2];
        if (!vendorAddressLine && n >= 1) vendorAddressLine = linesBeforeVendorTax[n - 1];

        result.partyName = vendorNameLine;
        result.partyAddress = vendorAddressLine;
      } else if (n === 1) {
        result.partyName = linesBeforeVendorTax[0];
      }
    }
  } else {
    // Fallback: ใช้ "บริษัท" ที่สองถ้ามี
    const companyNames = [...text.matchAll(/บริษัท[^\n\((]+/g)].map((m) => m[0].trim());
    if (companyNames.length >= 2) result.partyName = companyNames[1];
    else if (companyNames.length === 1) result.partyName = companyNames[0];
  }

  // 7. Amounts
  const extractAmt = (patterns) => {
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return m[1].replace(/,/g, '');
    }
    return '';
  };

  result.totalAmount = extractAmt([
    /รวมเป็นเงิน\s*[^\d]*([\d,]+\.?\d*)/,
    /รวมเงิน\s*[^\d]*([\d,]+\.?\d*)/,
    /TotalAmount\s*[^\d]*([\d,]+\.?\d*)/i,
    /Subtotal\s*[^\d]*([\d,]+\.?\d*)/i,
    /รวมเป็นเงินทั้งสิ้น\s*[^\d]*([\d,]+\.?\d*)/,
  ]);
  result.vatAmount = extractAmt([
    /ภาษีมูลค่าเพิ่ม[^\d]*([\d,]+\.?\d*)/,
    /TotalVat\s*VAT\s*7%\s*[^\d]*([\d,]+\.?\d*)/i,
    /VAT\s*7%\s*[^\d]*([\d,]+\.?\d*)/i,
    /VAT[^\d]*([\d,]+\.?\d*)/i,
    /ภาษ[ีิ]\s*7%[^\d]*([\d,]+\.?\d*)/,
    /ภาษีมูลค่า\s*เพิ่ม\s*[^\d]*([\d,]+\.?\d*)/,
  ]);
  result.netAmount = extractAmt([
    /TotalNet\s*[^\d]*([\d,]+\.?\d*)/i,
    /จำนวนเงินรวมทั้งสิ้น[^\d]*([\d,]+\.?\d*)/,
    /จำนวนเงินรวม[^\d]*([\d,]+\.?\d*)/,
    /จำนวนเงินรวมทั้งสิน[^\d]*([\d,]+\.?\d*)/,
  ]);
  result.whtAmount = extractAmt([
    /หัก ณ ที่จ่าย[^\d]*([\d,]+\.?\d*)/,
    /WHT[^\d]*([\d,]+\.?\d*)/i,
  ]);
  result.payAmount = extractAmt([
    /ยอดจ่าย[^\d]*([\d,]+\.?\d*)/,
    /ยอดชำระ[^\d]*([\d,]+\.?\d*)/,
    /ยอดจ่ายสุทธิ[^\d]*([\d,]+\.?\d*)/,
  ]);

  // 8. Line items — multi-strategy
  result.lineItems = extractLineItems(lines);

  return result;
}

function extractLineItems(lines) {
  const items = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Strategy 1: "1. Description ... 25,408.00 >"
    const headerMatch = line.match(
      /^(\d+)[.)]\s+(.+?)\s+([\d,]+\.\d{2,4})\s*[>›»→]?\s*$/
    );
    if (headerMatch) {
      const seq = headerMatch[1];
      const description = headerMatch[2].trim();
      const amount = headerMatch[3].replace(/,/g, '');
      let qty = '1', unit = 'Unit', unitPrice = amount;

      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const detailMatch = nextLine.match(
          /([\d,]+\.?\d*)\s*(?:THB|USD|EUR|GBP)?\s*[xX×]\s*([\d,]+\.?\d*)\s*(.+)/i
        );
        if (detailMatch) {
          unitPrice = detailMatch[1].replace(/,/g, '');
          qty = detailMatch[2].replace(/,/g, '');
          unit = detailMatch[3].trim().split(/\s/)[0];
          i++;
        }
      }
      items.push({ seq, description, qty, unit, unitPrice, amount });
      continue;
    }

    // Strategy 2: all-in-one line with 2+ spaces
    const strictMatch = line.match(
      /^(\d+)\s+(.+?)\s{2,}(\d+(?:\.\d+)?)\s+([A-Za-zก-๙./]+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)$/
    );
    if (strictMatch) {
      items.push({
        seq: strictMatch[1],
        description: strictMatch[2].trim(),
        qty: strictMatch[3],
        unit: strictMatch[4],
        unitPrice: strictMatch[5].replace(/,/g, ''),
        amount: strictMatch[6].replace(/,/g, ''),
      });
      continue;
    }

    // Strategy 3: "N. description    amount" (right-aligned)
    const rightAmtMatch = line.match(
      /^(\d+)[.)]\s+(.+?)\s{3,}([\d,]+\.\d{2,4})\s*$/
    );
    if (rightAmtMatch) {
      items.push({
        seq: rightAmtMatch[1],
        description: rightAmtMatch[2].trim(),
        qty: '1',
        unit: 'Unit',
        unitPrice: rightAmtMatch[3].replace(/,/g, ''),
        amount: rightAmtMatch[3].replace(/,/g, ''),
      });
      continue;
    }

    // Strategy 4: Description-only line + data line (2-line format)
    // Line 1: "1 ค่าขนส่ง"  (number + Thai/English text, NO amounts)
    // Line 2: "1    3,000.00    3,000.00"  (qty + price + amount)
    const descOnlyMatch = line.match(/^(\d+)[.)\s]\s*([ก-๙A-Za-z][^\d\n]{2,})$/);
    if (descOnlyMatch && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      // qty  price  amount (numbers only, separated by spaces)
      const dataMatch = nextLine.match(
        /^(\d+(?:\.\d+)?)\s+([\d,]+\.\d{2,4})\s+([\d,]+\.\d{2,4})\s*([A-Za-zก-๙]*)\s*$/
      );
      if (dataMatch) {
        items.push({
          seq: descOnlyMatch[1],
          description: descOnlyMatch[2].trim(),
          qty: dataMatch[1],
          unit: dataMatch[4] || 'Unit',
          unitPrice: dataMatch[2].replace(/,/g, ''),
          amount: dataMatch[3].replace(/,/g, ''),
        });
        i++; // skip data line
        continue;
      }
    }
  }

  return items;
}

export function formatDateForForm(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length !== 3) return dateStr;
  if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
