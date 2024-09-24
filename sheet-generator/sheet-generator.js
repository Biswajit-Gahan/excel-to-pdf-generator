const XLSX = require('xlsx');
const path = require('path');

// EXTRACT THE SHEET TO JSON
const excelWorkBook = XLSX.readFile(path.join(__dirname, "../data/workbook.xlsx"));
const sheetName = excelWorkBook.SheetNames[0]
const sheet = excelWorkBook.Sheets[sheetName];
let jsonData = XLSX.utils.sheet_to_json(sheet);

// PARSE FROM STRING
function parseData(data) {
    try {
        return JSON.parse(data);
    } catch(err) {
        return null
    }
}

/*
* period
* daysInPeriod
* dueDate
* obligationsMetOnDate
* principalDue
* principalLoanBalanceOutstanding
* interestOriginalDue
* totalActualCostOfLoanForPeriod
* */


// FINAL FORMATED DATA
jsonData = jsonData.map((row) => {
    return {
        loanNumber: row["EPL Number"],
        accountNumber: row["Loan Account Number"],
        loanDetails: parseData(row["Loan Details"]),
    }
}).filter((row) => {
    return row.loanNumber && row.accountNumber && row.loanDetails
}).map((row) => {
    return {
        ...row,
        totalLoanAmount: row?.loanDetails[0]?.principalLoanBalanceOutstanding || null,
        loanTenure: row?.loanDetails?.length - 1 || null,
        loanStartDate: row?.loanDetails[1]?.dueDate?.reverse()?.join("/") || null,
        loanEndDate: row?.loanDetails[row?.loanDetails?.length - 1]?.dueDate?.reverse()?.join("/") || null,
        loanDetails: row?.loanDetails.map((loan) => {
            return {
                period: loan?.period || null,
                days: loan?.daysInPeriod || null,
                dueDate: loan?.dueDate?.reverse()?.join("/") || null,
                paidDate: loan?.obligationsMetOnDate?.reverse()?.join("/") || null,
                principalDue: loan?.principalDue || null,
                balanceOfLoan: loan?.principalLoanBalanceOutstanding || null,
                interest: loan?.interestOriginalDue || null,
                emi: loan?.totalActualCostOfLoanForPeriod || null,
            }
        })
    }
});

module.exports = jsonData;
