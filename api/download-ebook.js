const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), "protected", "uturn-ebook.pdf");

  if (!fs.existsSync(filePath)) {
    res.status(404).send("الملف غير موجود");
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="uturn-ebook.pdf"');
  res.status(200).send(fileBuffer);
};
