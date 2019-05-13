var mysql = require('mysql');
var express = require('express');
var json2xls = require('json2xls');
var app = express();
const path = require('path');
const fs = require('fs-extra');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
const initialized = ()  =>  {
    const connection = mysql.createConnection({
        host: '10.10.2.241',
        user: 'sa',
        password: 'Radwag99',
        database: 'pue71'
    });
    connection.connect();
        connection.query('SELECT id_comparator FROM weighting LIMIT 5', (error, results, fields) => {
        if (error) throw error;
            let results_json = JSON.stringify(results);
            let resultjson = JSON.parse(results_json);
                workbook.xlsx.readFile('ds.xlsx')
                    .then(function() {
                       let correctArray =  new Set([JSON.stringify(results)]);
                       console.log(correctArray);
                    })
    });
    connection.end();
}
app.listen(5000, initialized);