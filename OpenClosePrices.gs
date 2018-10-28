function getOpenClosePrices() { 

// Source of quotes is alphavantage.co
var apiKey = "8GNYN0X8JQAJC1ON";

// Get the symbols to be priced
var spreadsheet = SpreadsheetApp.getActive();
var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
var symbol = [ETF_List.getRange('A3:A11').getValues()]; 
Logger.log("symbol array is " +symbol +" Length of symbol array=" +symbol.length);

var dailyPrices = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('DailyPrices'), true); 
// Clear out the sheet
dailyPrices.clear();

// Set up the header line
var targetRange = dailyPrices.getRange(dailyPrices.getLastRow()+1,2,1,9);
targetRange.setValues(symbol).setFontWeight('bold');
var targetRange = dailyPrices.getRange(dailyPrices.getLastRow(),11,1,9);
targetRange.setValues(symbol).setFontWeight('bold');

var priceData = []; // Will become 2-dimensional array: first dimension is security #; second is pricing data (symbol, date, open, close)

var maxSymbols = 9;

for (i = 0; i <= (maxSymbols-1); i++) {

var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +symbol[0][i] +"&apikey=" +apiKey;

// May need part of this to make sure that there are prices in the JSON and not a message regarding premium service
  // var response = UrlFetchApp.fetch(url);
  // var json = response.getContentText();
  // Logger.log("json length=" +json.length);
  // var datastr = JSON.stringify(json);
  // Logger.log(datastr);

priceData[i] = []; // need to make each symbol in priceData an array to hold the parameters

var symbolCol = dailyPrices.getRange(dailyPrices.getLastRow()+1,1);
symbolCol.setFormula('index(importdata("' +url +'"),4,1)');
priceData[i][0] = symbolCol.getDisplayValue().match(/"([^']+)"/)[1];

var dateCol = dailyPrices.getRange(dailyPrices.getLastRow(),2);
dateCol.setFormula('index(importdata("' +url +'"),10,1)');
priceData[i][1] = dateCol.getDisplayValue().substring(0, 10);

var openCol = dailyPrices.getRange(dailyPrices.getLastRow(),3);
openCol.setFormula('index(importdata("' +url +'"),11,1)');
priceData[i][2] = openCol.getDisplayValue().match(/"([^']+)"/)[1];

var closeCol = dailyPrices.getRange(dailyPrices.getLastRow(),4);
closeCol.setFormula('index(importdata("' +url +'"),14,1)');
priceData[i][3] = closeCol.getDisplayValue().match(/"([^']+)"/)[1];

Logger.log("i=" +i +"/" +priceData[i][0]+'/' +priceData[i][1] +'/' +priceData[i][2]+'/' +priceData[i][3]);

} // end major loop through symbols

// Create horizontal array of open and close prices
var priceArray = [];
priceArray[0] = priceData[0][1];
Logger.log(priceArray[0]);

for (i=0; i<= (maxSymbols-1); i++) { priceArray[i+1] = priceData[i][2]; Logger.log("i=" +i +"/" +priceArray[i]); }

for (i=0; i<= (maxSymbols-1); i++) { priceArray[i+10] = priceData[i][3];  Logger.log("i=" +i +"/" +priceArray[i+10]); }
var targetRange = dailyPrices.getRange(dailyPrices.getLastRow(),1,1,19);
targetRange.setValues([priceArray]);
// targetRange.setValues(priceArray).setNumberFormat("##,##0.00");

// Delete rows above today's open and close prices
dailyPrices.deleteRows(2, 8);

// Do some formatting
dailyPrices.autoResizeColumns(1, 19);
var dateCell = dailyPrices.getRange("A2:A2");
dateCell.setNumberFormat("m/d/yyyy");

} // end function
