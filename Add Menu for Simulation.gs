function onOpen() {
  var ui = SpreadsheetApp.getUi()
    .createMenu('Simulation')
    .addItem('Use same number of iterations or change', 'menuItem1')
    .addItem('Use same minimum trade or change', 'menuItem2')
    .addItem('Retain current weights or change', 'menuItem3')
    .addItem('Simulate - uniform distribution around starting weights', 'simRunUniformDist')
    .addItem('Simulate - normal distribution around starting weights', 'sumRunNormalDist')
    .addItem('Simulate - recalculate next days allocations using latest weights', 'recalcAlloc')
    .addItem('Daily update', 'menuItem7')
    .addToUi();
    
    // Add this to make sure that any properties that have been set by another spreadsheet are cleared
    refreshUserProps();
}

function menuItem1() {  // Retain or change number of iterations
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  

  var currentIterations = Score_Results.getRange('U1:U1').getValue();
  var result = Browser.msgBox('Current number of iterations is ' +currentIterations +'. Click OK to use or click CANCEL to enter new number of iterations.',
    Browser.Buttons.OK_CANCEL);
  if (result == 'ok') // do not change iterations 
    {Browser.msgBox('Running simulation for ' +currentIterations +' iterations. Choose new minimum trade using drop MC menu if desired.');}
  else {
    newIterations = Browser.inputBox('Enter new number of iterations ');
    SpreadsheetApp.getActiveSheet().getRange('U1:U1').setValue(newIterations);
    } 
} // end menuItem1

function menuItem2(){ // Retain or change minimum number of shares to trade
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  

  var currentMinTrade = Score_Results.getRange('AC1:AC1').getValue();
  var result = Browser.msgBox('Current minimum trade size is ' +currentMinTrade +'. Click OK to use or click CANCEL to enter new minimum trade size.',
    Browser.Buttons.OK_CANCEL);
  if (result == 'ok') // do not change minimum trade
    {Browser.msgBox('Running simulation for ' +currentMinTrade +' shares. Choose new weights using drop MC menu if desired.');}
  else {
    newMinTrade = Browser.inputBox('Enter new number minimum trade size ');
    SpreadsheetApp.getActiveSheet().getRange('AC1:AC1').setValue(newMinTrade);
    } 
} // end menuItem2

function menuItem3() { // Use weights on Score Results sheet or enter new weights
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  

  var ui = SpreadsheetApp.getUi(); 
  var response = ui.alert('Choose simulation approach', 'Run using weights on Score Results sheet?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) { // Run using weights on Score Results sheet
  var weight = Score_Results.getRange('B2:F2').getValues();
  Browser.msgBox('Current weights are ' +weight);
  }

  else if (response == ui.Button.NO) { // Run using weights to be entered
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
  'Enter weights to be used below', 'Separate weights by a comma', ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {    // User clicked "OK"
     var enteredWeight = [{}];
     enteredWeight = text.split(",");
     ui.alert('Weight array is ' +enteredWeight);
     var weightRange = Score_Results.getRange('B2:F2');
     weightRange.setValues([enteredWeight]);
  }
  }
} // end menuItem3

function simRunUniformDist() { // Run the simulation with uniform distribution of random weights
// Need to deal with aborted runs - need to refresh user props????

  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  
  var iterations = SpreadsheetApp.getActiveSheet().getRange('U1:U1').getValue();
  var minTradeSh = SpreadsheetApp.getActiveSheet().getRange('AC1:AC1').getValue();
  var weight = Score_Results.getRange('B2:F2').getValues();

  // get the current loop counter
  var userProperties = PropertiesService.getUserProperties();
  var runNumber = Number(userProperties.getProperty('loopCounter'));
Logger.log("Current loopCounter from properties is=" +runNumber);
  var maxTimes = Number(userProperties.getProperty('nTimes'));
Logger.log("Current nTimes from properties is=" +maxTimes);

  // On first run, loopCounter in properties should be undefined or zero, so get user input re number of runs and set trigger
  if (runNumber === undefined || runNumber == 0) { 
    refreshUserProps(); // sets loopCounter and nTimes to zero 
    Logger.log("loupCounter was undefined or zero but is now set to=" +runNumber); 

    // First time only: Enter number of times to run the simulation
    var nRuns = Browser.inputBox('Current number of iterations is ' +iterations 
      +' with a minimum trade of ' +minTradeSh +'. Enter number of times to run the simulation (default is once):');
    if (nRuns === undefined || nRuns == 0) {nRuns = 1} // set default value of nRuns if user bypasses inputBox

    userProperties.setProperty('nTimes', nRuns); 
    userProperties.setProperty('loopCounter', 0); // This is first time around; loopCounter sh be zero but just to make sure 
    
    // Set the trigger to run the simulation every [adjust this in triggerMultipleSimRuns function] minutes
    // Note that this trigger is deleted at the end of the last simulation run (near the end of the simulation script)
    triggerMultipleSimRuns();

  } else { // for second and subsequent runs
Logger.log("Called simRunUniformDist() two or more times and loupCounter is=" +runNumber);
    var nRuns = Number(userProperties.getProperty('nTimes')); // otherwise nRuns would be undefined bc script has not been executed
  }; // end else
  
  var newWeight = mcSimulation(iterations, weight, 1); // Type=1 is uniform distribution of random weights

  var Simulation_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);  
  Simulation_Results.showSheet();

} // end simRunUniformDist (menuItem4)

function sumRunNormalDist() { // Run the simulation with normal distribution of random weights
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  
  var iterations = SpreadsheetApp.getActiveSheet().getRange('U1:U1').getValue();
  var minTradeSh = SpreadsheetApp.getActiveSheet().getRange('AC1:AC1').getValue();
  var weight = Score_Results.getRange('B2:F2').getValues();

//  Browser.msgBox('Run simulation for ' +iterations +' iterations, trading a minimum of ' +minTradeSh +' shares, and with weights = ' +weight);

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('nTimes', 4); 
  userProperties.setProperty('loopCounter', 0);

  var newWeight = mcSimulation(iterations, weight, 2);

  var Simulation_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);  
  Simulation_Results.showSheet();
} // end simRunNormalDist (menuItem5)

function recalcAlloc() { // Run simulation automatically up to nn times, recursively replacing the starting weights with the best weights
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  
  var iterations = SpreadsheetApp.getActiveSheet().getRange('U1:U1').getValue();
  var minTradeSh = SpreadsheetApp.getActiveSheet().getRange('AC1:AC1').getValue();
  var weight = Score_Results.getRange('B2:F2').getValues();
  // recursiveSimulation(iterations,weight,3);
} // end menuItem6

function menuItem7() {
 dailyUpdate();
}
