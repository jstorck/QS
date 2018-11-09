function scrapesymbolLineInput() {
  
  // URL used for Preferred ETFs
  var urlPfdETFs = "https://www.etfscreen.com/performance.php?wl=0&s=Rtn-1d%7Cdesc&t=6&d=i&ftS=no&ftL=no&vFf=dolVol21&vFl=gt&vFv=100000&udc=default&d=i";
  // URL that should work for all ETFs of interest
  var urlETFScreen = "https://www.etfscreen.com/performance.php?wl=0&s=Rtn-1d%7Cdesc&t=6&d=i&ftS=yes&ftL=no&vFf=dolVol21&vFl=gt&vFv=100000&udc=default&d=i"

  var symbol = 'VOX';

  var html = UrlFetchApp.fetch(urlPfdETFs).getContentText();

  var symbolLine = html.substr(html.indexOf('<td>' +symbol +'</td>'),270);
// Logger.log("symbolLine=" +symbolLine);
// Logger.log("Length of symbolLine=" +symbolLine.length);
// Logger.log("Index of first <td>=" +symbolLine.indexOf('<td>'));
// Logger.log("Index of first </td>=" +symbolLine.indexOf('</td>'));

  var symbolLineInput = symbolLine.split('>');
Logger.log(symbolLineInput);
  var symbolLineInputLength = symbolLineInput.length;
// Logger.log("# of elements of array symbolLineInput=" +symbolLineInput.length);

  var totRet = [];

// for (i=0; i<symbolLineInputLength; i++) {Logger.log("i=" +i +" symbolLineInput[i]=" +symbolLineInput[i])};
  for (i=7; i<16; i+=2) {
Logger.log("i=" +i +" symbolLineInput[i]=" +symbolLineInput[i]);
  var j = (i-7)/2;
  totRet[j] = symbolLineInput[i].substr(0,symbolLineInput[i].indexOf('<')); // extract all characters up to the < sign
Logger.log("j=" +j +" totRet[j]=" +totRet[j])
  };

}
