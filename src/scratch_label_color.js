const fs = require('fs');

const filePath = "c:\\Users\\tawan\\Desktop\\uitestacc\\src\\components\\cash management\\AccordionQuickBuyAssetMain.js";

let content = fs.readFileSync(filePath, 'utf-8');

// Replace all instances of <Form.Label> with <Form.Label style={{ color: "#00008b" }}>
content = content.replace(/<Form\.Label>/g, '<Form.Label style={{ color: "#00008b" }}>');

// Replace specific variants like <Form.Label style={{ display: "flex" }}>
content = content.replace(/<Form\.Label style=\{\{ display: "flex" \}\}>/g, '<Form.Label style={{ display: "flex", color: "#00008b" }}>');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Labels updated with color #00008b.");
