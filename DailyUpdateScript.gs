// Note that there is a trigger associated with the dailyUpdate function.
// NEED TO FIX WEEKEND DATE ISSUES
function dailyUpdate() {

  if (isTradingDay(todaysDate())) {

  AddTodaysOpenClosePrices()
  refreshTotalReturns();

  TransposeEODAllocationsToAllocationHistory();

  var spreadsheet = SpreadsheetApp.getActive();
  var assetType = SpreadsheetApp.getActiveSpreadsheet().getName();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
  var minTradeSh = Score_Results.getRange('AC1:AC1').getValue(); 
  eMailTrades(assetType, minTradeSh);
  
  captureDailyTotRet();
 
  setupScoreResults();  // get the sheet ready for simulation
  updateCumulativePL();

  }  // end if
}  

function isTradingDay() {
  var now = new Date();
  var day = now.getDay();
  
  switch (day) {
        case 6:
        case 0:
            return false;
        }
        return true;
}

function todaysDate() { // Get today's date in MM/DD/YYYY format
 var today = new Date();
 var dd = today.getDate();
 var mm = today.getMonth()+1; //January is 0!
 var yyyy = today.getFullYear();

 if(dd<10) {dd='0'+dd}
 if(mm<10) {mm='0'+mm} 

 return today = mm+'/'+dd+'/'+yyyy;  
}
