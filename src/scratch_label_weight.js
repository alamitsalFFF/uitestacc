const fs = require('fs');

const filePath = "c:\\Users\\tawan\\Desktop\\uitestacc\\src\\components\\cash management\\AccordionQuickBuyAssetMain.js";

let content = fs.readFileSync(filePath, 'utf-8');

// Replace standard color label styling
content = content.replace(/style=\{\{ color: "#00008b" \}\}/g, 'style={{ color: "#00008b", fontWeight: 700 }}');

// Replace standard flex styling
content = content.replace(/style=\{\{ display: "flex", color: "#00008b" \}\}/g, 'style={{ display: "flex", color: "#00008b", fontWeight: 700 }}');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Labels updated with font-weight: 700.");
