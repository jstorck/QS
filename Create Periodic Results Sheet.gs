function extractResults(n) { // Select results with an interval of n days
  
  var n = 5; // DEBUG ONLY
  
  var spreadsheet = SpreadsheetApp.getActive();
  var ScoreResults = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
  var TotRet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRetHistory'), true);

  var ScoreExtract = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Results Extract'), true);
  var TotRetExtract = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRet Extract'), true);

  var firstScoreRow = 5;
  var firstTotRetRow = 3;
  var numDays = ScoreResults.getLastRow();

  var symbols = ScoreExtract.getRange("B4:J4").getValues();
  
  // Clear data from both score extract and total return extract sheets
  ScoreExtract.getRange('A' +firstScoreRow +':AQ' +ScoreExtract.getLastRow()+1).clearContent(); // getLastRow()+1 to ensure headers are not deleted
  TotRetExtract.getRange('A' +firstTotRetRow +':AT' +TotRetExtract.getLastRow()).clearContent();

  // Copy row startRow and every nth row after plus the last row
  var allTotRetData = TotRet.getDataRange();
  var totRetValues = allTotRetData.getValues();
  
  for (var i = firstTotRetRow; i < totRetValues.length; i+=n) {
//  for (var i = startRow; i < 20; i+=n) { // DEBUG ONLY
// Logger.log('i=' +i +'\n' +totRetValues[i].length);
  var row = [];
    for (var j = 0; j < totRetValues[i].length; j++) {
      row.push(totRetValues[i][j]);
// Logger.log(row);
    } // End j loop through values in each row
  // Put the extract total return values in the row
  targetRange = TotRetExtract.getRange(TotRetExtract.getLastRow()+1,1,1,46);
  targetRange.setValues([row]);

// Logger.log('i=' +i +'\nrow=' +row);
  } // End i loop through rows
  
  // Set up the Results Extract sheet
  // =max(0,sumproduct($B$2:$F$2,TotRetHistory!B51:F51))

  var lastTotRetRow = TotRetExtract.getLastRow(); 

  var scoreRow = [];
  var symbolScore = [];
  
  // Start iterating through rows in the TotReturnExtract sheet
  for (i=0; i<lastTotRetRow; i++) {
    scoreRow[0] = TotRetExtract.getRange(firstTotRetRow,1,1,1).getValue();

      for (j=0;j<symbols.length;j++) { // Now iterate through the symbolScores for each row
      symbolScore[j] ="max(0,sumproduct(weights,'TotRet Extract'!B" +firstTotRetRow +":F" +firstTotRetRow +"))";
Logger.log(symbolScore[j]);
      scoreRow.push(symbolScore[j]);
Logger.log(scoreRow);

      } // End j loop iterating through symbols in each row

  } // End i loop iterating through rows in TotReturnExtract sheet
}

