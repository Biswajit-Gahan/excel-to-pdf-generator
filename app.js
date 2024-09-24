const express = require('express');
const formatedData = require("./sheet-generator/sheet-generator");

const app = express();
const port = 5000;

app.listen(port, () => {console.log(`App listening on port ${port}`)})
