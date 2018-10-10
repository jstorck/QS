function mcSimulation(iterations, weight, type) { // type=1 for uniform random weights; type=2 for normalized random weights

  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);

  var currentIterations = Score_Results.getRange('U1:U1').getValue();
  var minTradeSh = Score_Results.getRange('AC1:AC1').getValue(); 

  var numRows = SpreadsheetApp.getActiveSpreadsheet().getLastRow()-4; // Track the number of days of data

  var iterations;

// .............................................................................................
// Run the simulation nRuns times

  // get the current loop counter
  var userProperties = PropertiesService.getUserProperties();
  var loopCounter = Number(userProperties.getProperty('loopCounter'));
  var nRuns = Number(userProperties.getProperty('nTimes'));

Logger.log("loopCounter at start of sim run=" +loopCounter +" / nRuns=" +nRuns);

// put some limit on the number of loops
  // could be based on a calculation or user input
  // using a static number in this example
  var limit = nRuns;
  
  // if loop counter < limit number, run the repeatable action
  if (loopCounter < limit) {
    
    // see what the counter value is at the start of the loop
Logger.log("loopCounter at start of 'if' statement=" +loopCounter +" /limit= " +limit);

// Begin actual simulation code ..........................................................................
  // Store current weights in an array
  var weight = Score_Results.getRange('B2:F2').getValues();  // [0]5D [1]1M [2]3M [3]6M [4]1Y
  var initialWeight = Score_Results.getRange('B2:F2').getValues();

  // Store current cumulative profit/loss
  var cPL = Score_Results.getRange(Score_Results.getLastRow(),43,1,1).getValue(); 

  // Set up for iterating  
  var bestWeight =[]; // creates the empty array to store optimum weights
//  var bestWeight = [0,0,0,0,0]; creates the empty array to store optimum weights or var bestWeight = new Array(5);
  for (k=0; k<5; k++) {bestWeight[k] = weight[0][k]} // set SimulationResults to initial weights
  var bestPL = cPL; // starting PL from most recent set of weights
  var maxN = iterations; // set number of iterations

// Start iterating maxN times to find best set of weights
  for (var trial=0; trial<maxN; trial++) { 
// var trialNumber = Score_Results.getRange('J1:J1').setValue(trial); // make iteration number visible on sheet

  if (type == 1) 
    {for (var i = 0; i<5; i++) {weight[0][i] = Math.random()};} // unstandardized weights can range from 0 to 1 uniformly distributed

    else if (type == 2) {
      for (var i = 0; i<5; i++) {
      var min = bestWeight[i] - 0.50 * bestWeight[i];
      var max = bestWeight[i] + 0.50 * bestWeight[i];
      weight[0][i] = randn_bm(min, max, 1); // unstandardized weights can range from min to max normally distributed, unskewed
        // Alternative randomization: weight[0][i] = gaussianRand();
      } // end for loop
    } // if type=2  

  // Modify weights and replace in sheet
  var weightRange = Score_Results.getRange('B2:F2');
  weightRange.setValues(weight);
  
  // Store new cumulative profit/loss
  var nPL = Score_Results.getRange(Score_Results.getLastRow(),43,1,1).getValue();  
// Logger.log ("New profit/loss " +nPL.toFixed(1)); 
    
  // If new profit/loss is greater than best profit/loss then replace and continue iterating     
  if (nPL > bestPL) {bestPL = nPL; for (k=0; k<5; k++) {bestWeight[k] = weight[0][k];}}

} // end iterations
  
  // Store results on results sheet: weights, best profit/loss, number of iterations, days of data
  var Simulation_Results= spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);

  var weightResults = Simulation_Results.getRange(Simulation_Results.getLastRow()+1,1,1,5);  
  weightResults.setNumberFormat("##0.00").setHorizontalAlignment("center").setValues(initialWeight); // display starting weights

  var shares = Simulation_Results.getRange(Simulation_Results.getLastRow(),6,1,1);  
  shares.setNumberFormat("##0").setHorizontalAlignment("center").setValue(minTradeSh); // capture minimum shares to be traded

  var sim = Simulation_Results.getRange(Simulation_Results.getLastRow(),7,1,1);
  if (type == 1) simType='uniform'; else simType = 'normal';
  sim.setValue(simType); // record simulation approach used

  var weightResults = Simulation_Results.getRange(Simulation_Results.getLastRow(),8,1,5);  
  var sumWeights = 0;
  for(var i in bestWeight) { sumWeights += bestWeight[i]; }
  for(var i in bestWeight) { bestWeight[i] = (100 * bestWeight[i])/sumWeights; } // rescale weights to base of 100
  weightResults.setNumberFormat("##0.0").setHorizontalAlignment("center").setValues([bestWeight]);

  var originalPLCell = Simulation_Results.getRange(Simulation_Results.getLastRow(),13,1,1).setNumberFormat("##0.0").setHorizontalAlignment("center").setValue(cPL);
  var bestPLCell = Simulation_Results.getRange(Simulation_Results.getLastRow(),14,1,1).setNumberFormat("##0.0").setHorizontalAlignment("center").setValue(bestPL);
  var percentChange = Simulation_Results.getRange(Simulation_Results.getLastRow(),15,1,1)
    .setNumberFormat("#0.0%").setHorizontalAlignment("center")
    .setValue(Math.abs(bestPL-cPL)/Math.abs(cPL));
  var numDays = Simulation_Results.getRange(Simulation_Results.getLastRow(),16,1,1).setHorizontalAlignment("center").setValue(numRows-1);
  var iterations = Simulation_Results.getRange(Simulation_Results.getLastRow(),17,1,1).setHorizontalAlignment("center").setValue(maxN);
  var runDate = Simulation_Results.getRange(Simulation_Results.getLastRow(),18,1,1).setNumberFormat("M/dd/yyyy at hh:mm").setHorizontalAlignment("center").setValue(new Date());
  
  // Restore original weights before iteration
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);
  var weightRange = Score_Results.getRange('B2:F2');
  weightRange.setValues(initialWeight);   

// return iterations, bestWeight, type; IS THIS IN THE RIGHT PLACE??????

// increment the properties service counter for the loop
    loopCounter +=1;
    userProperties.setProperty('loopCounter', loopCounter);
    
    // Log what the counter value is at the end of the loop
    Logger.log("loopCounter after incrementing by 1=" +loopCounter);
    
} // this is the close of the IF that starts the simulation run
  
  // if the loop counter is no longer smaller than the limit number
  // run this finishing code instead of the repeatable action block
  else {
    // delete trigger because we've reached the end of the loop
    // this will end the program
    stopSimRunTrigger();
    Logger.log("stopSimRunTrigger has run (trigger for simRunUniformDist has been deleted");

    refreshUserProps(); // to clear out loopCounter and nTimes
  } // end of the ELSE

return iterations, bestWeight, type;

} // end mcSimulation function 

function gaussianRand() {  // Source: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
  var rand = 0;
  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
}

function randn_bm(min, max, skew) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    var num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}