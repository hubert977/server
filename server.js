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
            connection.query('SELECT id_comparator FROM weighting LIMIT 1', (error, results, fields) => {
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
                workbook.xlsx.readFile('XtraReport1.xlsx').then(()=> {
                    for(let j=0;j<resultjson.length; j++)
                    {   
                    let worksheet = workbook.getWorksheet(1);
                    let row_0 = worksheet.getRow(53);
                    console.log(resultjson);
                    row_0.getCell(20).value = resultjson[0].mass_in_unit;
                    row_0.commit();
                    }
                    return workbook.xlsx.writeFile('files/data.xlsx');
                })
            });
        }
    }
}
const excel_object = new excel();
app.listen(5000, excel_object.initialized());