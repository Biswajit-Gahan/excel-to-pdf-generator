const XLSX = require('xlsx');
const path = require('path');

// EXTRACT THE SHEET TO JSON
const excelWorkBook = XLSX.readFile(path.join(__dirname, "../data/workbook.xlsx"));
const sheetName = excelWorkBook.SheetNames[0]
const sheet = excelWorkBook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(sheet);

// PARSE FROM STRING
function parseData(data) {
    try {
        return JSON.parse(data);
    } catch(err) {
        return null
    }
}

// FINAL FORMATED DATA
const formatedData = jsonData.map((row) => {
    return {
        loanNumber: row["EPL Number"],
        accountNumber: row["Loan Account Number"],
        loanDetails: parseData(row["Loan Details"]),
    }
}).filter((row) => {
    return row.loanNumber && row.accountNumber && row.loanDetails
});

module.exports = formatedData;
