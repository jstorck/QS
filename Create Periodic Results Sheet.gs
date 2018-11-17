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

  // Clear data from both score extract and total return extract sheets
  ScoreExtract.getRange('A' +startScoreRow +':AQ' +ScoreExtract.getLastRow()+1).clearContent(); // getLastRow()+1 to ensure headers are not deleted
  TotRetExtract.getRange('A' +startTotRetRow +':AT' +TotRetExtract.getLastRow()).clearContent();

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
  // Put the extract total return values in the row
  targetRange = TotRetExtract.getRange(TotRetExtract.getLastRow()+1,1,1,46);
  targetRange.setValues([row]);

// Logger.log('i=' +i +'\nrow=' +row);
  } // End i loop through rows
  
  // Set up the Results Extract sheet
  // =max(0,sumproduct($B$2:$F$2,TotRetHistory!B51:F51))
var items = getNamedRange("weights");
var weights = items.getValues();
Logger.log(weights);

  var scoresRow = ScoreExtract.getRange(ScoreExtract.getLastRow()+1,9,1,2);
  scoresRow.setFormula("sumproduct(Q" +lastAllocRow +":Y" +lastAllocRow +",Prices!B" +lastPriceRow +":J" +lastPriceRow +")")
    .setNumberFormat("###,##0"); // Amount invested at next day's opening price

}

function getNamedRange(n) {
   var result = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(n);
  return result
}
