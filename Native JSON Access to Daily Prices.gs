// function acquireDailyPrices() {
function pullJSON() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  var sheet = spreadsheet.getActiveSheet();

var apiKey = "8GNYN0X8JQAJC1ON";
var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
var symbol = [ETF_List.getRange('A3:A11').getValues()];

var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +symbol[0][i] +"&apikey=" +apiKey;
//   var url="http://example.com/feeds?type=json"; // Paste your JSON URL here
  
   var response = UrlFetchApp.fetch(url); // get feed
  var dataAll = JSON.parse(response.getContentText()); //
  var dataSet = dataAll;
  
  var rows = [],
      data;

  for (i = 0; i < dataSet.length; i++) {
    data = dataSet[i];
    rows.push([data.id, data.name,data.email]); //your JSON entities here
  }

  dataRange = sheet.getRange(1, 1, rows.length, 3); // 3 Denotes total number of entites
  dataRange.setValues(rows);

}

