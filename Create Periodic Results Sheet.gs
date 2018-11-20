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
// Logger.log(symbols[0]);
  
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
  var targetRange = TotRetExtract.getRange(TotRetExtract.getLastRow()+1,1,1,46);
  targetRange.setValues([row]);

// Logger.log('i=' +i +'\nrow=' +row);
  } // End i loop through rows. Total Return extract is complete.
  
  // Set up the Results Extract sheet
  var lastTotRetRow = TotRetExtract.getLastRow(); 
Logger.log("lastTotRetRow=" +lastTotRetRow);

  var symbolScore = [];
  
  // Start iterating through rows in the TotReturnExtract sheet
  for (i=0; i<lastTotRetRow-2; i++) {
    var scoreRow = []; // Clear out the array before populating each row
    scoreRow[0] = TotRetExtract.getRange(firstTotRetRow+i,1,1,1).getValue(); // Gets the date

      // Now iterate through the symbolScores for each row
      for (j=0;j<symbols[0].length;j++) { 
      var startCol = 1 + 5 * j;
      var endCol = 5 + 5 * j;

      if (startCol < 26) { 
        var startLetter = String.fromCharCode(65+startCol);
        var endLetter = String.fromCharCode(65+endCol);
        }
        else {
        var startLetter = "A" +String.fromCharCode(65+startCol - 26);
        var endLetter = "A" +String.fromCharCode(65+endCol - 26);
        }
// Logger.log("i=" +i +" j=" +j +" startLetter=" +startLetter +" endLetter=" +endLetter);

      var rowNumber = firstTotRetRow + i;
      symbolScore[j] = "=max(0,sumproduct(weights,'TotRet Extract'!" +startLetter +rowNumber +":" +endLetter +rowNumber +"))";
// Logger.log("j=" +j +" " +symbolScore[j]);
      scoreRow.push(symbolScore[j]);

      symbolScore[j+10] = "=TotalAssetAmount*B38/$K38";
      scoreRow.push(symbolScore[j+10]);

// Logger.log(scoreRow);
      } // End j loop iterating through symbols in each row
      scoreRow[10] = "=sum(B" +(rowNumber+2) +":J" +(rowNumber+2) +")"; // This totals the weights


  // Write scoreRow to Results Extract sheet
Logger.log("i=" +i +" scoreRow.length= " +scoreRow.length);  
  var targetRange = ScoreExtract.getRange(ScoreExtract.getLastRow()+1,1,1,19);
  targetRange.setValues([scoreRow]);


  } // End i loop iterating through rows in TotReturnExtract sheet
}

