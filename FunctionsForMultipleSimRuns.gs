function triggerMultipleSimRuns() {
  ScriptApp.newTrigger('simRunUniformDist')
    .timeBased()
    .everyMinutes(10) // Change this to 1,5,10,15, or 20 mins to avoid exceeding execution limit
    .create();
}

function triggerExhaustiveSimulation() {
  ScriptApp.newTrigger('exhaustSim')
    .timeBased()
    .everyMinutes(10) // Change this to 1,5,10,15, or 20 mins to avoid exceeding execution limit
    .create();
}

function testUserPropsAsArray() {
  var loopCounter = [];
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('loopCounter[0]', 0); // counts each time the sim is run
  userProperties.setProperty('loopCounter[1]', 1); // counts each time the sim is run
 
  var counter1 = Number(userProperties.getProperty('loopCounter[0]'));
  var counter2 = Number(userProperties.getProperty('loopCounter[1]'));

Logger.log("loopCounter[0]=" +counter1 +"\n" +"loopCounter[1]=" +counter2);

}

function resetUserProps() { // need to run this once at start and at end
Logger.log("Before resetUserProps, loopCounter=" +runs +" and nTimes=" +times);

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('loopCounter', 0); // counts each time the sim is run
  userProperties.setProperty('nTimes', 0); // tracks maximum number of times the sim is run
  var runs = Number(userProperties.getProperty('loopCounter'));
  var times = Number(userProperties.getProperty('nTimes'));

Logger.log("After resetUserProps, loopCounter=" +runs +" and nTimes=" +times);
}

function stopSimRunTrigger(){
    // do some stuff here then stop the trigger(s) by name
    var triggers = getProjectTriggersByName('simRunUniformDist');
    for (var i in triggers)
        ScriptApp.deleteTrigger(triggers[i]);
}

function getProjectTriggersByName(name) { // This is used to list in the logger all project triggers (next function)
    return ScriptApp.getProjectTriggers().filter(
        function(s) {return s.getHandlerFunction() === name;}
    );
}

function logAllProjectTriggers() { 
  // Loop over all triggers and list them
  var allTriggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < allTriggers.length; i++) {
  var funcName = allTriggers[i].getHandlerFunction();
  Logger.log(i +'/' +funcName);
  }
}

function logAllUserProperties() {
  var userProperties = PropertiesService.getUserProperties();
  var runs = Number(userProperties.getProperty('loopCounter'));
  var times = Number(userProperties.getProperty('nTimes'));
  var runLimit = Number(userProperties.getProperty('runLimit[]'));

Logger.log("User Properties, loopCounter=" +runs +" and nTimes=" +times +"\nrunLimit=" +runLimit);
}