//#####################################################
// download.js - download encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################

// Global variables
var chunks_total; // Total chunks
var start; // Start read blob
var end; // End read blob
var index; // File index
var browser; // Browser name
var blob = new Blob ();
var pseudo_name; // Numerical name on server

function download (file_name, file_name_dec) {
  // Extract file parameters
  var file_parameters = file_name.split(":");
  // Get total file chunks
  var total_chunks = file_parameters[2];
  // Get file size
  var file_size = file_parameters[2];

  index = 1;

  // for (var index = 1; index <= 1; index++) {

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, onInitFs, errorHandler);
    // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {fs = filesystem; onInitFs (fs);}, errorHandler);
    // window.requestFileSystem (window.TEMPORARY, 0, listFs, errorHandler);
    // window.requestFileSystem (window.TEMPORARY, 0, removeFs, errorHandler);
    // window.requestFileSystem(window.TEMPORARY, 1024*1024, isFileInFS(fs, file_name, file_name_dec), errorHandler);
    window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec);}, errorHandler);
}

// Tests whether there is a previous file
function isFileInFS(fs, file_name, file_name_dec) {

  var dirReader = fs.root.createReader();
  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      if (!results.length) {
        console.log ("XXX");
        readServerFile(fs, file_name, file_name_dec);
      } else {
        console.log ("YYY");
        rmFileFS(fs, file_name, file_name_dec);
      }
    }, errorHandler);
  };
  readEntries(); // Start reading dirs.
}

// Remove file
function rmFileFS (fs, file_name, file_name_dec) {
  window.requestFileSystem (window.TEMPORARY, 0, function (fs) {
    fs.root.getFile ('log.txt', {create: false}, function (fileEntry) {

      fileEntry.remove (function() {
        console.log ('File removed.');
        // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, readServerFile, errorHandler);
        // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec);}, errorHandler);
        readServerFile(fs, file_name, file_name_dec);
      }, errorHandler);

    }, errorHandler);
  }, errorHandler);
}

// Read file (chunk) on server
function readServerFile(fs, file_name, file_name_dec) {
  console.log ("FILE NAME: " + file_name);
  document.getElementById ("status").innerHTML = index;
  // New XHR2
  var xhr = new XMLHttpRequest ();
  xhr.open ("POST", "php/download.php", false);
  xhr.setRequestHeader ("X-File-Name", file_name);
  xhr.setRequestHeader ("X-INDEX", index);
  xhr.send ();

  content = atob (xhr.responseText);
  console.log (">>>");
  var decrypted = asmCrypto.AES_CBC.decrypt (content, "passwordpassword");
  // var blob = new Blob ([decrypted], {type: "'" + xhr.getResponseHeader ('content-type') + "'"});
  blob = new Blob ([decrypted]);
  // Decrypted file_name
  // var true_name = "aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=.mp4";
  // var true_name = decodeURIComponent (file_name_dec);
  writeFs(fs);
}

// Write file on local FileSystem
function writeFs(fs, file_name, file_name_dec) {

  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      // var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

}

// Error handler
function errorHandler(e) {
  var msg = '';
  console.log (e.name);
}
