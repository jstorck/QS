function scrapeTotRet() {
  
  var urlPfdETFs = "https://www.etfscreen.com/performance.php?wl=0&s=Rtn-1d%7Cdesc&t=6&d=i&ftS=no&ftL=no&vFf=dolVol21&vFl=gt&vFv=100000&udc=default&d=i";
  
// Source: https://sites.google.com/site/scriptsexamples/learn-by-example/parsing-html  

  doGet();

  function doGet() {
  var html = UrlFetchApp.fetch(urlPfdETFs).getContentText();
Logger.log(html);
console.log({message: 'html', initialData: html});


  var doc = XmlService.parse(html);
  var html = doc.getRootElement();
  var menu = getElementsByClassName(html, 'vertical-navbox nowraplinks')[0];
  var output = XmlService.getRawFormat().format(menu);
  return HtmlService.createHtmlOutput(output);
}  
  
}
