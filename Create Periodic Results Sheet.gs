function extractResults(n) { // Select results with an interval of n days
  
  var n = 5; // DEBUG ONLY
  
  var spreadsheet = SpreadsheetApp.getActive();
  var ScoreResults = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
  var TotRet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRetHistory'), true);

  var ScoreExtract = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Results Extract'), true);
  var TotRetExtract = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRet Extract'), true);

  var startScoreRow = 5;
  var startTotRetRow = 3;
  var numDays = ScoreResults.getLastRow();

  // Copy row startRow and every nth row after plus the last row
  var allTotRetData = TotRet.getDataRange();
  var totRetValues = allTotRetData.getValues();
  
  for (var i = startTotRetRow; i < totRetValues.length; i+=n) {
//  for (var i = startRow; i < 20; i+=n) { // DEBUG ONLY
// Logger.log('i=' +i +'\n' +totRetValues[i].length);
  var row = [];
    for (var j = 0; j < totRetValues[i].length; j++) {
      row.push(totRetValues[i][j]);
// Logger.log(row);
    } // End j loop through values in each row

  targetRange = TotRetExtract.getRange(TotRetExtract.getLastRow()+1,1,1,43);
  targetRange.setValues([row]);

// Logger.log('i=' +i +'\nrow=' +row);
  } // End i loop through rows
  

}
