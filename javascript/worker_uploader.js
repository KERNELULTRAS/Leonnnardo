//#####################################################
// worker_uploader.js - worker to upload encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
// Write data on server
self.onmessage = function (event) {

  var xhr = new XMLHttpRequest(); // New XHR2
  var blob_name = encodeURIComponent (event.data["name"]); // Encode to URI blob name
  var bufView = new Uint8Array (event.data["content"]);  // Convert to ArrayBuffer

  xhr.open ("post", "../php/upload.php", false); // Sync open file
  xhr.responseType = 'text';
  xhr.setRequestHeader ("Content-Type", "application/octet-stream");
  xhr.setRequestHeader ("X-FILE-NAME", blob_name); // Custom header - file name
  xhr.setRequestHeader ("X-FILE-SIZE", event.data["size"]); // Custom header - file size
  xhr.setRequestHeader ("X-INDEX", event.data["index"]); // Custom header - file
  xhr.setRequestHeader ("X-CHUNKS-TOTAL", event.data["chunks_total"]); // Total chunks
  xhr.setRequestHeader ("X-PSEUDO-NAME", event.data["pseudo_name"]); // Total chunks
  xhr.send (bufView.buffer); // Send
  self.postMessage (xhr.responseText); // Return answer
};
