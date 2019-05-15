var mysql = require('mysql');
var express = require('express');
var json2xls = require('json2xls');
var app = express();
const path = require('path');
const fs = require('fs-extra');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
class excel {
    constructor()
    {

    }
    initialized()  {
        let correctArray = [];
        const connection = mysql.createConnection({
            host: '10.10.2.241',
            user: 'sa',
            password: 'Radwag99',
            database: 'pue71'
        });
        connection.connect();
            connection.query('SELECT id_comparator FROM weighting', (error, results, fields) => {
            if (error) throw error;
                let results_json = JSON.stringify(results);
                let resultjson = JSON.parse(results_json);
                const that = this;
                new Promise(function(resolve, reject) {
                    let arrayvalue = [];
                    for(let i=0; i<resultjson.length; i++)
                    {
                         arrayvalue.push(resultjson[i].id_comparator);
                         correctArray = [...new Set(arrayvalue)];                                
                    }
                    that.cyclesiterable(correctArray)
                  })
        });
    }
    cyclesiterable(correctArray)
    {
        const connection = mysql.createConnection({
            host: '10.10.2.241',
            user: 'sa',
            password: 'Radwag99',
            database: 'pue71'
        });
        connection.connect();
        for(let i=0; i<correctArray.length; i++)
        {
            connection.query(`SELECT ID,guid,ARCHIVAL,date,mass_in_g,tare_in_g,mass_in_unit,unit,UNIT_CAL,precision_act,precision_Cal,mass_is_stab,Mass_Air_Density_Correction,id_comparator,Cycle,AirDensity from weighting where id_comparator=${correctArray[i]}`, (error, results, fields)=>{
                if (error) throw error;
                let results_json = JSON.stringify(results);
                let resultjson = JSON.parse(results_json);
                workbook.xlsx.readFile('XtraReport1.xlsx').then(()  => {
                    let worksheet = workbook.getWorksheet(1);
                    let CountRow = 53
                    const Cell = 20;
                    for(let j=0;j<resultjson.length; j++)
                    {
                    let row_53 = worksheet.getRow(CountRow);
                    row_53.getCell(Cell).value = resultjson[j].mass_in_unit;
                    console.log(CountRow);
                    row_53.commit();
                    if(j>0)
                    {
                        CountRow = CountRow+2;
                    }
                    }
                    workbook.xlsx.writeFile(`files/data${i}.xlsx`);
                }).catch((err)=>{
                        console.log(err);
                })
            });
        }
    }
}
const excel_object = new excel();
app.listen(5000, excel_object.initialized());