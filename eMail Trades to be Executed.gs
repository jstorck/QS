function eMailTrades (typeOfETF,tradeMin) {

//  var typeOfETF = "Preferred";  // for testing only
//  var tradeMin = 50; // for testing only

  var spreadsheet = SpreadsheetApp.getActive();
  var Allocation_History = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Allocation History'), true);

  var symbol = Allocation_History.getRange('B2:J2').getValues();

  var currentDayAlloc = Allocation_History.getRange(Allocation_History.getLastRow()-1,2,1,9);
  var current = currentDayAlloc.getValues();

  var nextDayAlloc = Allocation_History.getRange(Allocation_History.getLastRow(),2,1,9);
  var next = nextDayAlloc.getValues();

  var nextDaysDate = Allocation_History.getRange(Allocation_History.getLastRow(),1,1,1);
  var asOfEOD = nextDaysDate.getValue();

  var trade = []; // the array where the next morning's trades are stored
  
  for (var i=0; i<9; i++) { 
      if (Math.abs(next[0][i]-current[0][i]) >= tradeMin) { trade[i] = (next[0][i] - current[0][i]).toFixed(); }
      else { trade[i] = 0; next[0][i] = current[0][i]; }
      }
  
  var tableHeader="<table border='1',cellpadding='10',cellspacing ='0', width ='300'>"
     +"<tr>"
    +"<td bgcolor = '#CCCCCC', Align = 'center', style='font-weight: bold'>"+"Symbol"+"</td>"
    +"<td bgcolor = '#CCCCCC', Align = 'center', style='font-weight: bold'>"+"Current Position"+"</td>"
    +"<td bgcolor = '#CCCCCC', Align = 'center', style='font-weight: bold'>"+"Buy/Sell"+"</td>"
    +"<td bgcolor = '#CCCCCC', Align = 'center', style='font-weight: bold'>"+"New Position"+"</td>"
    +"</tr>";
  var tableRow = [];
    for (var i=0; i<9; i++) {tableRow[i] =
      "<tr>"
      +"<td bgcolor = 'white', Align = 'center'>"+symbol[0][i]+"</td>"
      +"<td bgcolor = 'white', Align = 'center'>"+Math.round(current[0][i])+"</td>"
      +"<td bgcolor = 'white', Align = 'center'>"+trade[i]+"</td>"
      +"<td bgcolor = 'white', Align = 'center'>"+Math.round(next[0][i])+"</td>"
      +"</tr>" 
      }
  var tableBody = tableRow.join(" ");   
  var message = "<strong>Trades are based on new allocations as of EOD " +asOfEOD +"<br><br></strong>" +tableHeader+tableBody+"</table>";

  MailApp.sendEmail({
      to: 'jsstorck@gmail.com',
      subject: typeOfETF +' : Trades to make before open',
      htmlBody: message
    });

}
