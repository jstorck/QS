function calculateVolatility() {
  var spreadsheet = SpreadsheetApp.getActive();
  var TotRet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRetHistory'), true);
  var VolAdj = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('VolatilityAdjustment'), true);
  
  var adjPower = 10;
  var adjDays = 10; // Number of days used for recent volatility

  var firstTotRetRow = 3;
  var lastTotRetRow = TotRet.getLastRow(); 

  // Clear prior data from VolatilityAdjustment sheet
  VolAdj.getRange('B2:Z' +VolAdj.getLastRow()+1).clearContent();

  // Iterate through symbols
  for (j=0; j<9; j++) { 
  var stdevCol = String.fromCharCode(75+j);
  var targetCol = String.fromCharCode(66+j);

//  var stdDevToDate = VolAdj.getRange("K2")
Logger.log("'" +stdevCol +"2:" +stdevCol +"2'");
  var targetRange = "'" +stdevCol +"2:" +stdevCol +"2'";
Logger.log(targetRange);
  var stdDevToDate = VolAdj.getRange(targetRange)
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("stdev(TotRetHistory!B3:B" +lastTotRetRow +")"); 
  }


  VolAdj.getRange('B2').setValue(VolAdj.getRange('K2:K2').getValue());
  VolAdj.getRange('K2:K2').clear();

}