function refreshTotalReturns() { // Ensures that most current total returns are loaded from ETFScreen.com
  var spreadsheet = SpreadsheetApp.getActive();
  var ETFScreen= spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF Screen'), true); 

  // Delete URL of ETFScreen website from cell used for the importXML function
  var importXMLCell = ETFScreen.getRange("K1:K1");
  importXMLCell.clearContent();
  
  // Copy URL to cell so that importXML function reloads current data
  var screenURL = ETFScreen.getRange("W1:W1").getValue();
  importXMLCell.setValue(screenURL);
 
}
