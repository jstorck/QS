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

  // Iterate through symbols to calculate std dev for all tot ret data
  for (j=0; j<9; j++) { 
  var stdevCol = String.fromCharCode(75+j);
  var targetCol = String.fromCharCode(66+j);

  var targetRange = stdevCol +"2";

  // Pick the 5D tot ret columns
  var startCol = 1 + 5 * j;
  if (startCol < 26) { var startLetter = String.fromCharCode(65+startCol) }
    else { var startLetter = "A" +String.fromCharCode(65+startCol - 26);  }

  var stdDevToDate = VolAdj.getRange(targetRange)
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("stdev(TotRetHistory!" +startLetter +firstTotRetRow +":" +startLetter +lastTotRetRow +")"); 

  VolAdj.getRange(targetCol +'2')
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setValue(VolAdj.getRange(stdevCol +'2:' +stdevCol +'2').getValue());
  
  }
  // VolAdj.getRange('K2:K2').clear();

}