//#####################################################
// download.js - download encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
function download (file_name, file_name_dec) {
  // Extract file parameters
  var file_parameters = file_name.split(":");
  // Get total file chunks
  var total_chunks = file_parameters[2];
  // Get file size
  var total_chunks = file_parameters[2];
  // XHR2
  var xhr = new XMLHttpRequest ();

  index = 1;

  // for (var index = 1; index <= 1; index++) {
    document.getElementById ("status").innerHTML = index;
    xhr.open ("POST", "php/download.php", false);
    xhr.setRequestHeader ("X-File-Name", file_name);
    xhr.setRequestHeader ("X-INDEX", index);
    xhr.send ();

    content = atob (xhr.responseText);
    // console.log (">>>" + xhr.responseText);
    var decrypted = asmCrypto.AES_CBC.decrypt (content, "passwordpassword");

    // var blob = new Blob ([decrypted], {type: "'" + xhr.getResponseHeader ('content-type') + "'"});
    blob = new Blob ([decrypted]);

    // Decrypted file_name
    // var true_name = "aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=.mp4";
    var true_name = decodeURIComponent (file_name_dec);

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, onInitFs, errorHandler);
    // window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, function (filesystem) {fs = filesystem; onInitFs (fs);}, errorHandler);
    // window.requestFileSystem (window.TEMPORARY, 0, listFs, errorHandler);
    // window.requestFileSystem (window.TEMPORARY, 0, removeFs, errorHandler);
    // rmFile();
}

function rmFile() {
  window.requestFileSystem(window.TEMPORARY, 0, function(fs) {
    fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

      fileEntry.remove(function() {
        console.log('File removed.');
      }, errorHandler);

    }, errorHandler);
  }, errorHandler);
}

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function listResults(entries) {
  // Document fragments can improve performance since they're only appended
  // to the DOM once. Only one browser reflow occurs.
  var fragment = document.createDocumentFragment();

  entries.forEach(function(entry, i) {
    var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
                                  '<img src="images/icons/file.png" height="16px">';
    var li = document.createElement('li');
    li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
    fragment.appendChild(li);
  });

  document.querySelector('#filelist').appendChild(fragment);
}

function listFs(fs) {

  var dirReader = fs.root.createReader();
  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      if (!results.length) {
        listResults(entries.sort());
      } else {
        entries = entries.concat(toArray(results));
        readEntries();
      }
    }, errorHandler);
  };

  readEntries(); // Start reading dirs.

}

function onInitFs(fs) {

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

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}
