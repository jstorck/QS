function exhaustSim() {
 
  var spreadsheet = SpreadsheetApp.getActive();
  var Score_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('ScoreResults'), true);

  var minTradeSh = Score_Results.getRange('AC1:AC1').getValue(); 

  var numDataDays = SpreadsheetApp.getActiveSpreadsheet().getLastRow()-4; // Track the number of days of data

  var runLimit = []; // sets the limit on the highest weight to be used
  var userProperties = PropertiesService.getUserProperties();
  for (var i=0; i<5; i++) {
    var runProp = (0.2 + (0.2 * i)).toString();
Logger.log (runProp);
    userProperties.setProperty('runLimit[i]', runProp); 
    } 
Logger.log("runLimit[0]=" +userProperties.getProperty(runLimit[0]) +"\n" +"runLimit[1]=" +userProperties.getProperty(runLimit[1]));
  userProperties.getProperty('segment'); 

  // Display the simulation results sheet
  var Simulation_Results = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);  
  Simulation_Results.showSheet(); 

  // Store current cumulative profit/loss
  var cPL = Score_Results.getRange(Score_Results.getLastRow(),43,1,1).getValue(); 

  // Set up for iterating  
  var bestWeight =[0,0,0,0,0]; // start with bestWeight at zero
  var bestPL = cPL; // starting cumulative PL from Score_Results
  var weight = [];
  var weightIncrement = 0.25;

  // Start iterating to find best set of weights
  // Interate through all combos of weights using increments of weightIncrement up with a max of 1.0
  // Reverse for loops are supposed to be faster than forward loops
  for (weight[0]=1; weight[0]>=0; weight[0]-=weightIncrement) { 
    for (weight[1]=1; weight[1]>=0; weight[1]-=weightIncrement) { 
      for (weight[2]=1; weight[2]>=0; weight[2]-=weightIncrement) { 
        for (weight[3]=1; weight[3]>=0; weight[3]-=weightIncrement) { 
          for (weight[4]=1; weight[4]>=0; weight[4]-=weightIncrement) { 
  
// Logger.log("Weights=" +weight);
  // Replace weights in sheet
  var weightRange = Score_Results.getRange('B2:F2');
  weightRange.setValues([weight]);
  
  // Store new cumulative profit/loss
  var nPL = Score_Results.getRange(Score_Results.getLastRow(),43,1,1).getValue();  
// Logger.log ("New profit/loss " +nPL.toFixed(1)); 
    
  // If new profit/loss is greater than best profit/loss then replace and continue iterating     
  if (nPL > bestPL) {bestPL = nPL; for (k=0; k<5; k++) {bestWeight[k] = weight[k];}}
  
          } // end weight[4]
        } // end weight[3]
      } // end weight[2]
    } // end weight[1]
  } // end weight[0] loop and end iterations


  // Store results on results sheet: weights, best profit/loss, number of iterations, days of data
  var Simulation_Results= spreadsheet.setActiveSheet(spreadsheet.getSheetByName('SimulationResults'), true);

  var weightResults = Simulation_Results.getRange(Simulation_Results.getLastRow()+1,1,1,5);  
//  weightResults.setNumberFormat("##0.00").setHorizontalAlignment("center").setValues(initialWeight); // display starting weights

  var shares = Simulation_Results.getRange(Simulation_Results.getLastRow(),6,1,1);  
  shares.setNumberFormat("##0").setHorizontalAlignment("center").setValue(minTradeSh); // capture minimum shares to be traded

  var sim = Simulation_Results.getRange(Simulation_Results.getLastRow(),7,1,1);
  var simType='exhaustive';
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
  var numDays = Simulation_Results.getRange(Simulation_Results.getLastRow(),16,1,1).setHorizontalAlignment("center").setValue(numDataDays-1);
//  var iterations = Simulation_Results.getRange(Simulation_Results.getLastRow(),17,1,1).setHorizontalAlignment("center").setValue(maxN);
  var runDate = Simulation_Results.getRange(Simulation_Results.getLastRow(),18,1,1).setNumberFormat("M/dd/yyyy at hh:mm").setHorizontalAlignment("center").setValue(new Date());

} 
