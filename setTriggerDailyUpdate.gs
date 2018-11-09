function triggerDailyUpdate() {
   var days = [ScriptApp.WeekDay.MONDAY, ScriptApp.WeekDay.TUESDAY,
               ScriptApp.WeekDay.WEDNESDAY, ScriptApp.WeekDay.THURSDAY,                                            
               ScriptApp.WeekDay.FRIDAY];
   for (var i=0; i<days.length; i++) {
      ScriptApp.newTrigger("dailyUpdate")
               .timeBased().onWeekDay(days[i])
               .atHour(15).create();
   }
}