function calculateVolatility() { // Excluding cash (MINT)
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
  var stdevCol = String.fromCharCode(75+j); // 75 is ASCII code for the letter K
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

  // Iterate through symbols to calculate std dev for last adjDays of tot ret data
  for (j=0; j<9; j++) { 
  var stdevCol = String.fromCharCode(75+j);
  var targetCol = String.fromCharCode(66+j);

  var targetRange = stdevCol +"3";

  // Pick the 5D tot ret columns
  var startCol = 1 + 5 * j;
  if (startCol < 26) { var startLetter = String.fromCharCode(65+startCol) }
    else { var startLetter = "A" +String.fromCharCode(65+startCol - 26);  }

  var stdDevToDate = VolAdj.getRange(targetRange)
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("stdev(TotRetHistory!" +startLetter +(lastTotRetRow-adjDays+1) +":" +startLetter +lastTotRetRow +")"); 

  VolAdj.getRange(targetCol +'3')
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setValue(VolAdj.getRange(stdevCol +'3:' +stdevCol +'3').getValue());
  
  }

  // Iterate through symbols to calculate pseudo beta for each issue except cash
  for (j=0; j<8; j++) { // NB - cash (MINT) is excluded 
  var stdevCol = String.fromCharCode(75+j); // 75 is ASCII code for the letter K
  var targetCol = String.fromCharCode(66+j); // 66 is ASCII code for B

  var targetRange = stdevCol +"4"; // pseudo betas go in the 4th row

  var pseudoBeta = VolAdj.getRange(targetRange)
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("=" +stdevCol +"3/" +stdevCol +"2"); 

  VolAdj.getRange(targetCol +'4')
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setValue(VolAdj.getRange(stdevCol +'4:' +stdevCol +'4').getValue());  

   }

  // Calculate average pseudo beta
  VolAdj.getRange("B5")
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("=average(B4:I4)");
    
  // Calculate volatility factor
  VolAdj.getRange("B6").setValue(adjPower).setNumberFormat("#0").setHorizontalAlignment("center");
  VolAdj.getRange("B7")
    .setNumberFormat("#0.00").setHorizontalAlignment("center")
    .setFormula("=B5^B6");

  VolAdj.getRange('K2:S4').clear(); // Clean out most of the calculated entries

}