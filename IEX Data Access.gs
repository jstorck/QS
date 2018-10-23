function getIEXPrices() {
// IEX access https://iextrading.com/developer/docs
 
  // Get the symbols to be priced
  var spreadsheet = SpreadsheetApp.getActive();
  var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
  var symbol = ETF_List.getRange('A3:A11').getValues(); 
// Logger.log("symbol array is " +symbol +" Length of symbol array=" +symbol.length);

  for (i=0; i<symbol.length; i++) {
  jsonResponse = UrlFetchApp.fetch("https://api.iextrading.com/1.0/stock/" +symbol[i] +"/quote");
// Logger.log(jsonResponse);
// var keys = Object.keys(jsonResponse);
// Logger.log("jsonResponse keys=" +keys +"\n");

  var pricesObject = JSON.parse(jsonResponse.getContentText());
// var keys = Object.keys(pricesObject);
// Logger.log("pricesObject keys=" +keys +"\n");

Logger.log(symbol[i] +"Open=" +pricesObject['open']);  
Logger.log(symbol[i] +" Close=" +pricesObject['close'] +"\n");  

  }// End loop through each symbol
  
}
