const fs = require('fs');

const files = [
  'c:/Users/OKCOMWINPRO/Desktop/uitestacc/src/components/Sales/Sales Order/AccordionSOHD.js',
  'c:/Users/OKCOMWINPRO/Desktop/uitestacc/src/components/Sales/Sale Invoice/AccordionSIHD.js',
  'c:/Users/OKCOMWINPRO/Desktop/uitestacc/src/components/Delivery/Delivery Out/AccordionDOHD.js',
  'c:/Users/OKCOMWINPRO/Desktop/uitestacc/src/components/Cheque Receive/AccordionRCHD.js'
];

const sxProp = `sx={{
            "& .MuiInputLabel-root": { color: "#00008b", fontWeight: 700 },
            "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
          }}`;

let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/<TextField(?![^>]*sx=)/g, `<TextField\n          ${sxProp}`);
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
    count++;
  }
});
console.log('Total files updated: ' + count);
