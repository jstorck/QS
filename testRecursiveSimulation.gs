function recursiveSimulation(iterations, weight, type) {

// Source: https://www.benlcollins.com/spreadsheets/time-triggers/

// -----------------------------------------------------------------------------
// main function to control workflow - runs once
// -----------------------------------------------------------------------------
function runAuto() {
  
  // resets the loop counter if it's not 0
  refreshUserProps();
  
  // clear out the sheet WHY???????????????
  // clearData();
  
  // create trigger to run program automatically
  createTrigger();
}


// -----------------------------------------------------------------------------
// function to add new number to sheet
// called by trigger once per each iteration of loop
// -----------------------------------------------------------------------------
function addNumber() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data');
  
  // get the current loop counter
  var userProperties = PropertiesService.getUserProperties();
  var loopCounter = Number(userProperties.getProperty('loopCounter'));
  
  // put some limit on the number of loops
  // could be based on a calculation or user input
  // using a static number in this example
  var limit = 10;
  
  // if loop counter < limit number, run the repeatable action
  if (loopCounter < limit) {
    
    // see what the counter value is at the start of the loop
    Logger.log(loopCounter);
    

// do stuff
    var num = Math.cil(Math.random()*100);
    sheet.getRange(sheet.getLastRow()+1,1).setValue(num);
    
    // increment the properties service counter for the loop
    loopCounter +=1;
    userProperties.setProperty('loopCounter', loopCounter);
    
    // see what the counter value is at the end of the loop
    Logger.log(loopCounter);
  }
  
  // if the loop counter is no longer smaller than the limit number
  // run this finishing code instead of the repeatable action block
  else {
    // Log message to confirm loop is finished
    sheet.getRange(sheet.getLastRow()+1,1).setValue("Finished");
    Logger.log("Finished");
    
    // delete trigger because we've reached the end of the loop
    // this will end the program
    deleteTrigger();
    
  }
}


// -----------------------------------------------------------------------------
// create trigger to run addNumber every minute
// -----------------------------------------------------------------------------
function createTrigger() {
  
  // Trigger every 1 minute
  ScriptApp.newTrigger('addNumber')
      .timeBased()
      .everyMinutes(1)
      .create();
}


// -----------------------------------------------------------------------------
// function to delete triggers
// -----------------------------------------------------------------------------
function deleteTrigger() {
  
  // Loop over all triggers and delete them
  var allTriggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
  
}


// -----------------------------------------------------------------------------
// function to clear data - I don't need this
// -----------------------------------------------------------------------------
/* 
  function clearData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data');
  
  // clear out the matches and output sheets
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2,1,lastRow-1,1).clearContent();
  }
}
*/

// -----------------------------------------------------------------------------
// reset loop counter to 0 in properties
// -----------------------------------------------------------------------------
function refreshUserProps() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('loopCounter', 0);
}

} // End recursiveSimulation function