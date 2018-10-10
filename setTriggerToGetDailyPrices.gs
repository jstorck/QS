function triggerGetDailyOpenClosePrices() {
   var days = [ScriptApp.WeekDay.MONDAY, ScriptApp.WeekDay.TUESDAY,
               ScriptApp.WeekDay.WEDNESDAY, ScriptApp.WeekDay.THURSDAY,                                            
               ScriptApp.WeekDay.FRIDAY];
   for (var i=0; i<days.length; i++) {
      ScriptApp.newTrigger("getOpenClosePrices")
               .timeBased().onWeekDay(days[i])
               .atHour(14).create();
   }
}