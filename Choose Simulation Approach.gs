function chooseApproach() {  // 2018-11-05 NOT CURRENTLY USED ANYWHERE

/* Display alert box and choose one of two options
   -Cycle by replacing original weights with most recent best weights
   -Each cycle starts with same weights
*/

  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);  

  // Retain or change number of iterations
  var ui = SpreadsheetApp.getUi();
  var currentIterations = Score_Results.getRange('X1:X1').getValue();
  alert('Current number of iterations is ' +currentIterations);
  var result = ui.prompt('Enter number of iterations and click OK', ui.ButtonSet.OK);
  var iterations = +result.getResponseText();

  // Choose simulation method via a dialog box
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Choose simulation approach', 'Run using weights on Score Results sheet?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) { // Run using weights on spreadsheet
  var weight = Score_Results.getRange('B2:F2').getValues();
// Logger.log ("Before calling mcSimulation " +weight);
  var newWeight = mcSimulation(iterations, weight);
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
     var newWeight = mcSimulation(iterations, weight);
  } 
  
  else if (button == ui.Button.CANCEL) {    // User clicked "Cancel"
    ui.alert('Simulation run is cancelled.');
  } 
  
  else if (button == ui.Button.CLOSE) {    // User clicked X in the title bar
    ui.alert('You closed the dialog.');
  }

} // end if for response is NO
  
// Logger.log ("After calling mcSimulation " +newWeight);

  var Simulation_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);  
  Simulation_Results.showSheet();

} // end chooseApproach function 
