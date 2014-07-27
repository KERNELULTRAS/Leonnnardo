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

function download (file_name, file_name_dec) {
  // Extract file parameters
  var file_parameters = file_name.split(":");
  // Get total file chunks
  var chunks_total = file_parameters[2];
  // Get file size
  var file_size = file_parameters[3];
  // New Blob
  var blob = new Blob ();
  // First index of chunks
  var index = 1;

  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

  document.getElementById ("status").innerHTML = "Creating temporrary space";
  window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec, chunks_total, index);}, errorHandler);
}

// As exists previous file
function isFileInFS(fs, file_name, file_name_dec, chunks_total, index) {

  var dirReader = fs.root.createReader();
  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      if (!results.length) {
        console.log ("XXX");
        document.getElementById ("status").innerHTML = "Reading from server";
        readServerFile(fs, file_name, file_name_dec, chunks_total, index);
      } else {
        console.log ("YYY");
        document.getElementById ("status").innerHTML = "Removing previous temporrary file";
        rmFileFS(fs, file_name, file_name_dec, chunks_total, index);
      }
    }, errorHandler);
  };
  readEntries(); // Start reading dirs.
}

// Remove file
function rmFileFS (fs, file_name, file_name_dec, chunks_total, index) {
  window.requestFileSystem (window.TEMPORARY, 0, function (fs) {
    fs.root.getFile ('log.txt', {create: false}, function (fileEntry) {
      fileEntry.remove (function() {
        console.log ('File removed.');
        // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, readServerFile, errorHandler);
        // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec);}, errorHandler);
        document.getElementById ("status").innerHTML = "Reading file from server";
        readServerFile(fs, file_name, file_name_dec, chunks_total, index);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);
}

// Read file (chunk) on server
function readServerFile(fs, file_name, file_name_dec, chunks_total, index) {
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
  var blob = new Blob ([decrypted]);
  // Decrypted file_name
  // var true_name = "aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=.mp4";
  // var true_name = decodeURIComponent (file_name_dec);
  document.getElementById ("status").innerHTML = "Writing file to temporrary space";
  writeFs(fs, file_name, file_name_dec, chunks_total, index, blob);
}

// Write file on local FileSystem
function writeFs(fs, file_name, file_name_dec, chunks_total, index, blob) {

  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.seek(fileWriter.length);
      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
        if (index >= chunks_total) {
          document.getElementById ("status").innerHTML = "File successfully downloaded";
          return;
        }
        else {
          index++;
          document.getElementById ("status").innerHTML = "Reading from server";
          readServerFile(fs, file_name, file_name_dec, chunks_total, index);
          // PUSSY PLS WRT APPEND
        }
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
