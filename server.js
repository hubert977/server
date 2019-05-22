var mysql = require('mysql');
var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs-extra');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
var formidable = require('formidable');
const cors = require('cors');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
class excel {
    constructor()
    {
       this.configure = {
            host: '10.10.2.241',
            user: 'sa',
            password: 'Radwag99',
            database: 'pue71'
        }
    }
    initialized()  {
        let correctArray = [];
        const connection = mysql.createConnection(this.configure);
        connection.connect();
            connection.query('SELECT id_comparator from weighting ORDER BY id_comparator DESC LIMIT 1', (error, results, fields) => {
            if (error) throw error;
                let results_json = JSON.stringify(results);
                let resultjson = JSON.parse(results_json);
                const that = this;
                new Promise(function(resolve, reject) {
                    let arrayvalue = [];
                    let arrayData = [];
                    for(let i=0; i<resultjson.length; i++)
                    {
                         arrayvalue.push(resultjson[i].id_comparator);
                         arrayData.push(resultjson[i]);
                         correctArray = [...new Set(arrayvalue)];
                    }
                    connection.end();
                    that.cyclesiterable(correctArray,arrayData);
                  })
        });
    }
    cyclesiterable(correctArray,arrayData)
    {
        const connection = mysql.createConnection(this.configure);
        connection.connect();
        for(let i=0; i<correctArray.length; i++)
        {
            connection.query(`SELECT comparatorreport.st_deviation , comparatorreport.average_diff,weighting.ID,weighting.guid,weighting.ARCHIVAL,weighting.date,weighting.mass_in_g,weighting.tare_in_g,weighting.mass_in_unit,weighting.unit,weighting.UNIT_CAL,weighting.precision_act,weighting.precision_Cal,weighting.mass_is_stab,weighting.Mass_Air_Density_Correction,weighting.id_comparator,weighting.Cycle,weighting.AirDensity from weighting,comparatorreport where id_comparator=${correctArray[i]} AND weighting.id_comparator=comparatorreport.ID`, (error, results, fields)=>{
                    if (error) throw error;
                    let results_json = JSON.stringify(results);
                    let resultjson = JSON.parse(results_json);
                    workbook.xlsx.readFile('template.xlsx').then(()  => {
                    let worksheet = workbook.getWorksheet(1);
                    let RowAverageDiff = 48;
                    let RowStDev = 49;
                    let UniversalCell = 5;
                    let CountRow = 71;
                    let RowAirDensity = 16;
                    let CellAirDensity = 12;
                    const Cell = 6;
                    let next_row = 3;
                    let row_16 = worksheet.getRow(RowAirDensity);
                    row_16.getCell(CellAirDensity).value = resultjson[0].AirDensity;
                    row_16.commit();
                    let row_49 = worksheet.getRow(RowStDev);
                    row_49.getCell(UniversalCell).value = resultjson[0].st_deviation;
                    row_49.commit();
                    let row_48 = worksheet.getRow(RowAverageDiff);
                    row_48.getCell(UniversalCell).value = resultjson[0].average_diff;
                    row_48.commit(); 
                        for(let j=0;j<resultjson.length; j++)
                        {
                        let row_53 = worksheet.getRow(CountRow);
                        row_53.getCell(Cell).value = resultjson[j].mass_in_unit + ' ' +  '[g]';
                        row_53.commit();
                        CountRow = CountRow+1;
                        if(j==next_row) {
                            CountRow = CountRow + 3;
                            next_row = next_row + 4;
                        }
                    }
                    workbook.xlsx.writeFile(`files/data.xlsx`);
                    connection.end();
                }).catch((err)=>{
                        console.log(err);
                })
            });
        }
    }
}
app.get('/download', (req,res)=>{
    res.download(__dirname + '/files/data.xlsx'); 
})
app.post('/file', (req, res) => {
    console.log(req.file);
})
app.get('/',(req,res)=>{
    res.sendFile( path.resolve(__dirname) + '/dist/index.html');
})
app.use(fileUpload());
app.use(cors());
const excel_object = new excel();
app.listen(5000, setInterval(()=>{
    excel_object.initialized();
},20000));

