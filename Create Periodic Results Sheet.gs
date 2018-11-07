function extractResults(n) { // Select results with an interval of n days
  
  var n = 5; // DEBUG ONLY
  
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
 
  var Extract = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Results Extract'), true);

  var startRow = 5;
  var numDays = Score_Results.getLastRow();

  // Copy row startRow and every nth row after plus the last row
  var allData = Score_Results.getDataRange();
  var values = allData.getValues();
  
  for (var i = startRow; i < values.length; i+=n) {
//  for (var i = startRow; i < 20; i+=n) { // DEBUG ONLY
// Logger.log('i=' +i +'\n' +values[i].length);
  var row = [];
    for (var j = 0; j < values[i].length; j++) {
      row.push(values[i][j]);
// Logger.log(row);
    } // End j loop through values in each row

  targetRange = Extract.getRange(Extract.getLastRow()+1,1,1,43);
  targetRange.setValues([row]);

// Logger.log('i=' +i +'\nrow=' +row);
  } // End i loop through rows
  

}
