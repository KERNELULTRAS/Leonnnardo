//#####################################################
// upload.js - save encrypted chunks into directory
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################

// Global variables
const BYTES_PER_CHUNK = 512 * 1024; // Chunk sizes.

var chunks_total; // Total chunks
var start; // Start read blob
var end; // End read blob
var index; // File index
var browser; // Browser name
var blob = new Blob ();
var pseudo_name; // Numerical name on server
var pwd; // Working directory
var user_id = "luzer"; // User ID

//#####################################################
// Start script after click on Send
// Check is file exists
//#####################################################
function upload () {
  var xhr_fe;
  var blob = document.getElementById ('fileToUpload').files[0];

  if (!blob) {
    alert ("You must select a file");
  }
  else {
    // File exist?
    xhr_fe = new XMLHttpRequest ();
    xhr_fe.open ("POST", "php/file_exists.php", false);
    var blob_name = encodeURIComponent (blob.name);
    xhr_fe.setRequestHeader ("X-FILE-NAME", blob_name);
    xhr_fe.send ();

    if (xhr_fe.responseText == "Uploading ...") {
      document.getElementById ("status").innerHTML = xhr_fe.responseText;
      upload_start ();
    }
    else {
      document.getElementById ("status").innerHTML = xhr_fe.responseText;
    }
  }
}

//####################################################
// Calculates chunks
//####################################################
function upload_start () {

  // Show progress bar
  upload_status.innerHTML = '<progress id = "progress_bar" value = "0" max = "100"></progress>';

  blob = document.getElementById ("fileToUpload").files[0];

  index = 0; // File index
  start = 0; // Start read blob

  chunks_total = Math.ceil (blob.size / BYTES_PER_CHUNK); // Calculate the number of chunks
  end = BYTES_PER_CHUNK;
  chunk = blob.slice (start, end); // Slice file to small chunk
  index++; // First index of chunk is 1
  upload_file ();
}

//####################################################
// Read files and write on server
//####################################################
function upload_file () {
// Upload chunks and adjustes progress bars

  // Define progressbar and percentage
  var percentageDiv = document.getElementById ("percent");
  var progress_bar = document.getElementById ("progress_bar");
  // Define workers
  var worker_reader = new Worker ('javascript/worker_reader.js');
  var worker_uploader = new Worker ('javascript/worker_uploader.js');

  // Event worker - after successfully read chunk
  worker_reader.onmessage = function (event) {
    document.getElementById ("status").innerHTML = "Encrypt " + index + "/" + chunks_total;
    // Encrypt content to ArrayBuffer
    var encrypted = asmCrypto.AES_CBC.encrypt (event.data, "passwordpassword");
    var blob_name = blob.name;
    // PLEASE REMOVE THIS SHIT
    // ONLY ONCE NAME ENCRYPT
    // Encrypt file name
    var file_name_enc = encodeURIComponent (ab2s (asmCrypto.AES_CBC.encrypt (encodeURIComponent (blob_name), "passwordpassword")));
    // Workaround for FireFox and Chrome
    // Firefox without worker.terminate eats memory
    // Chrome with worker.terminate freezes
    // file_name_enc = "aaa";
    // console.log (pseudo_name);
    upload_array = {"name": file_name_enc, "pseudo_name": pseudo_name, "content": encrypted, "size": blob.size, "index": index, "chunks_total": chunks_total};
    if (browser == "firefox") {
      worker_reader.terminate ();
    }
    // Display status encoding
    document.getElementById ("status").innerHTML = "Upload " + index + "/" + chunks_total;
    // Call worker to chunk upload
    return worker_uploader.postMessage (upload_array);
  }

  // Event worker - after successfully write chunk on server
  worker_uploader.onmessage = function (event) {
    if (index == 1) {
      pseudo_name = event.data;
    }
    // console.log (event.data);
    if (index < chunks_total) {
      // Set start and end of chunk
      start = end;
      end = start + BYTES_PER_CHUNK;
      index++;
      chunk = blob.slice (start, end);

      // Progress bar
      percentageDiv.innerHTML = "0%";
      progress_bar.max = chunks_total;
      progress_bar.value = index;
      percentageDiv.innerHTML = Math.round (index/chunks_total * 100) + "%";

      // Display status Reading
      document.getElementById ("status").innerHTML = "Reading " + index + "/" + chunks_total;
      // Workaround for FireFox and Chrome
      // Firefox without worker.terminate eats memory
      // Chrome with worker.terminate freezes
      console.log (index);
      if (browser == "firefox") {
        worker_uploader.terminate ();
        return upload_file ();
      }
      else {
        return worker_reader.postMessage (chunk);
      }
    }
    else {
      worker_reader.terminate ();
      worker_uploader.terminate ();
      progress_bar.value = 100;
      percentageDiv.innerHTML = 100 + "%";
      document.getElementById ("status").innerHTML = "Upload finished";
      upload_status.innerHTML = '<img class = "icon_OK" src="images/icons/download_OK.png">';
      list_files_on_server ();
    }
  }
  // Display status reading
  document.getElementById ("status").innerHTML = "Reading " + index + "/" + chunks_total;
  worker_reader.postMessage (chunk);
}

//#####################################################
// ArrayBuffer to string
//#####################################################
function ab2s (buf) {
  var view = new Uint8Array (buf);
  return Array.prototype.map.call(view, function(charcode) {
    return String.fromCharCode(charcode);
  }).join('');
}

//#####################################################
// String to ArrayBuffer
//#####################################################
function s2ab (str) {
  var buf = new ArrayBuffer (str.length);
  var bufView = new Uint8Array (buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt (i);
  }
  return buf;
}
