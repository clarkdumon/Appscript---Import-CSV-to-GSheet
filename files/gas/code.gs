"use strict";



function onOpen() {
  let ui = SpreadsheetApp.getUi()

  ui.createMenu('CSV Import').addItem('Add File', "showModal").addToUi()

}

function showModal() {
  const sideModal = HtmlService.createHtmlOutputFromFile('sideModal')
    .setWidth(400)
    .setHeight(300)

  SpreadsheetApp.getUi()
    .showModalDialog(sideModal, "Add File");
}

function uploadFile(formVar) {

    const driveFolder = DriveApp.getFolderById(DRIVEID);
    const fileUpload = Utilities.newBlob(Utilities.base64Decode(formVar.data), formVar.mimeType, formVar.fileName);
    const fileInDrive = driveFolder.createFile(fileUpload);
    return "Success"
}

function clearData(){
  const sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')
  sh.getRange("A2:M").clearContent()
  
}

function test(){
 // Logs the name of every file in the user's Drive.
let files = DriveApp.getFolderById(DRIVEID).getFiles();
while (files.hasNext()) {
  var file = files.next();
  console.log(file.getName());
}
}

function importCSV(){
  clearData()
let files = DriveApp.getFolderById(DRIVEID).getFiles();
  let data = [];

while (files.hasNext()) {
  let file = files.next();
  let fileType = file.getMimeType();
  if(fileType=="text/csv"){
    let csvData = Utilities.parseCsv(file.getBlob().getDataAsString());
    csvData.splice(0,1)
    csvData.filter(x=>x[0]!='');
    csvData.forEach(x=>data.push(x));
    file.setTrashed(true);
  }
}

let sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')
sh.getRange(2,1,data.length,data[0].length).setValues(data)


  // const sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')

  // sh.getRange(2,1,data.length, data[0].length).setValues(data)



  
}