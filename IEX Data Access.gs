function getIEXPrices() {
// IEX stock info source: https://iextrading.com/developer/docs
 
  // Get the symbols to be priced
  var spreadsheet = SpreadsheetApp.getActive();
  var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
  var symbol = [ETF_List.getRange('A3:A11').getValues()]; 

  var priceLine = [];

  for (i=0; i<symbol[0].length; i++) {
  jsonResponse = UrlFetchApp.fetch("https://api.iextrading.com/1.0/stock/" +symbol[0][i] +"/quote");
  var pricesObject = JSON.parse(jsonResponse.getContentText());
// Logger.log(symbol[0][i] +"Open=" +pricesObject['open']);  
  priceLine.push(pricesObject['open']);
// Logger.log("priceLine=" +priceLine  +"\n");
  } // End loop through each symbol for open prices
  
  // Add the closing prices to the priceLine array
  for (i=0; i<symbol[0].length; i++) {
  jsonResponse = UrlFetchApp.fetch("https://api.iextrading.com/1.0/stock/" +symbol[0][i] +"/quote");
  var pricesObject = JSON.parse(jsonResponse.getContentText());
  priceLine.push(pricesObject['close']) 
  } // End loop through each symbol for close prices
// Logger.log("priceLine=" +priceLine  +"\n");

  var dailyPrices = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('DailyPrices'), true); 

  // Clear out the sheet
  dailyPrices.clear();

  // Set up the header line
  var targetRange = dailyPrices.getRange(dailyPrices.getLastRow()+1,2,1,9);
  targetRange.setValues(symbol).setFontWeight('bold');
  var targetRange = dailyPrices.getRange(dailyPrices.getLastRow(),11,1,9);
  targetRange.setValues(symbol).setFontWeight('bold');

  // Load the date and the open/close prices onto the dailyPrice sheet
  var dateCell = dailyPrices.getRange(dailyPrices.getLastRow()+1,1,1,1).setValue(new Date());  

  var targetRange = dailyPrices.getRange(dailyPrices.getLastRow(),2,1,18);
  targetRange.setValues([priceLine]).setNumberFormat("#,##0.00");
  dailyPrices.autoResizeColumns(1, 19);

}
