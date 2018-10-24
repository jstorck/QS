function TransposeEODAllocationsToAllocationHistory() {
  var spreadsheet = SpreadsheetApp.getActive();

  // Store EOD allocations in an array
  var ETF_List = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ETF List'), true);
  var EOD_allocations = [ETF_List.getRange('R3:R11').getValues()];
  
  // Put today's date and the array in the next row of the Allocation History
  var Allocation_History = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Allocation History'), true);
  var dateCell = Allocation_History.getRange(Allocation_History.getLastRow()+1,1,1,1).setValue(new Date());  
  var targetRange = Allocation_History.getRange(Allocation_History.getLastRow(),2,1,9);
  targetRange.setValues(EOD_allocations).setNumberFormat("##,##0");
  
  var lastAllocRow = Allocation_History.getLastRow(); // Determine bottom row of Alloction History sheet

  // Record the weights used
  var weights = ETF_List.getRange('K1:O1').getValues();
  targetRange = Allocation_History.getRange(Allocation_History.getLastRow(),11,1,5)
  targetRange.setValues(weights).setNumberFormat("##0.##");
  
  // Record the minimum trade size in shares
  var Score_Results = spreadsheet.getSheetByName('ScoreResults');
  var minTrade = Score_Results.getRange('AC1:AC1').getValue();
  targetRange = Allocation_History.getRange(Allocation_History.getLastRow(),16,1,1);
  targetRange.setValue(minTrade).setNumberFormat("##0").setHorizontalAlignment("center");

  // Enter new start of next day positions adjusted for minimum trade size
  targetRange = Allocation_History.getRange(Allocation_History.getLastRow(),17,1,9);
  targetRange.setFormula("if(abs(B" +lastAllocRow +"-B" +(lastAllocRow-1) +")>=$P" +lastAllocRow +",B" +lastAllocRow +",B" +(lastAllocRow-1) +")")
    .setNumberFormat("##0");
  
  // Set formulas for totals
  totalAtOpen = Allocation_History.getRange(Allocation_History.getLastRow(),26,1,1);
  totalAtClose = Allocation_History.getRange(Allocation_History.getLastRow(),27,1,1);
  dayProfitLoss = Allocation_History.getRange(Allocation_History.getLastRow(),28,1,1);
  cumProfitLoss = Allocation_History.getRange(Allocation_History.getLastRow(),29,1,1);

    // Find next row of "Price" sheet in order to enter formula for totals on Alloc History (next row is next day's open/close)
    var Prices = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Prices'), true);
    var lastPriceRow = SpreadsheetApp.getActiveSheet().getLastRow() + 1;
  
  totalAtOpen.setFormula("sumproduct(Q" +lastAllocRow +":Y" +lastAllocRow +",Prices!B" +lastPriceRow +":J" +lastPriceRow +")")
    .setNumberFormat("###,##0"); // Amount invested at next day's opening price
  totalAtClose.setFormula("sumproduct(Q" +lastAllocRow +":Y" +lastAllocRow +",Prices!K" +lastPriceRow +":S" +lastPriceRow +")")
    .setNumberFormat("###,##0"); // Value at next day's closing price
  dayProfitLoss.setFormula("AA" +lastAllocRow +"-Z" +lastAllocRow).setNumberFormat("#,##0_);[Red](#,##0)");
  cumProfitLoss.setFormula("=AB" +lastAllocRow +"+AC" +(lastAllocRow-1)).setNumberFormat("#,##0_);[Red](#,##0)");
  }; // End function to transpose (adjusted) EOD allocations

function AddTodaysOpenClosePrices() { // Add the prices from the dailyprices sheet
  var spreadsheet = SpreadsheetApp.getActive();
  var dailyPrices = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('DailyPrices'), true);
  var dailyOpenClose = dailyPrices.getRange("A2:S2").getValues();
  var Prices = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Prices'), true);
  var addPrices = Prices.getRange(Prices.getLastRow()+1,1,1,19);
  addPrices.setValues(dailyOpenClose);
};

function setupScoreResults() { // add today's row to the ScoreResults
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var Score_Results = spreadsheet.getSheetByName('ScoreResults');
  var source = Score_Results.getRange(Score_Results.getLastRow(),1,1,43); 
  var range = Score_Results.getRange(Score_Results.getLastRow()+1,1,1,43);
  source.copyTo(range);
  var dateCell = Score_Results.getRange(Score_Results.getLastRow(),1,1,1).setValue(new Date());  
}

function updateCumulativePL() { // updates formula on top row of ScoreResults _after_ DailyUpdate is complete
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
  var lastRow = SpreadsheetApp.getActiveSheet().getLastRow();
spreadsheet.getRange('X1:X1').setFormula('=AQ'+lastRow);
}