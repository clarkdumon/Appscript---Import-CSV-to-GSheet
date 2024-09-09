"use strict";
let DRIVEID = PropertiesService.getUserProperties().getProperty('DRIVEID')
const SHEETID = PropertiesService.getUserProperties().getProperty('SHEETID')

function onOpen() {
  
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('CSV Import').addItem('Add File', "showModal").addToUi()
  PropertiesService.getUserProperties().setProperty("SHEETID",SpreadsheetApp.getActive().getId())

}

function showModal() {
  const sideModal = HtmlService.createHtmlOutputFromFile('sideModal')
    .setWidth(400)
    .setHeight(300)

  SpreadsheetApp.getUi()
    .showModalDialog(sideModal, "Import CSV");
}

function fetchFolderID() {
  try {
    let dFolder = DriveApp.getFoldersByName('StaffingOutlookUpload')
    let folder = dFolder.next()
    PropertiesService.getUserProperties().setProperty('DRIVEID',folder.getId())

  } catch {
    let dFolder = DriveApp.createFolder('StaffingOutlookUpload')
    PropertiesService.getUserProperties().setProperty('DRIVEID',dFolder.getId())
  }
  console.log(PropertiesService.getUserProperties().getProperty('DRIVEID'))
}

function uploadFile(formVar) {
    fetchFolderID()
    const driveFolder = DriveApp.getFolderById(DRIVEID);
    const fileUpload = Utilities.newBlob(Utilities.base64Decode(formVar.data), formVar.mimeType, formVar.fileName);
    const fileInDrive = driveFolder.createFile(fileUpload);
    return "Success"
}

function clearData(){
  

  const sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')
  SpreadsheetApp.getActiveSpreadsheet().toast('Cleaning Previously Uploaded Data','Status',2)
  sh.getRange("A2:M").clearContent()
  
}


function test(){


Logger.log(PropertiesService.getUserProperties().getProperties())

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

  SpreadsheetApp.getActiveSpreadsheet().toast('Pasting Uploaded CSV to Sheets','Status',2)

let sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')
sh.getRange(2,1,data.length,data[0].length).setValues(data)


  // const sh = SpreadsheetApp.openById(SHEETID).getSheetByName('RAW')

  // sh.getRange(2,1,data.length, data[0].length).setValues(data)
  SpreadsheetApp.getActiveSpreadsheet().toast('Import Complete','Status',5)


  
}
