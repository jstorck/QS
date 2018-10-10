function captureDailyTotRet() {
  var spreadsheet = SpreadsheetApp.getActive();
  var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
  var totRet = ETF_List.getRange('K3:O11').getValues();

  var TotRetHistory = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('TotRetHistory'), true);
  var dateCell = TotRetHistory.getRange(TotRetHistory.getLastRow()+1,1,1,1).setValue(new Date());  

  var symbolTotRet = [];
  for (var i=0; i<9; i++) {  // iterate through symbols
  for (var j=0; j<5; j++) {  // iterate within symbols through time periods
  symbolTotRet.push(totRet[i][j]);
  }
  }  
  var targetRange = TotRetHistory.getRange(TotRetHistory.getLastRow(),2,1,45);
  targetRange.setValues([symbolTotRet]);  
  
} // end function