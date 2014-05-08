// Write data on server
self.onmessage = function (event) {
  var xhr = new XMLHttpRequest(); // New XHR2
  xhr.open ("post", "upload.php", false); // Sync open file
  xhr.setRequestHeader ("Content-Type", "application/octet-stream");
  xhr.setRequestHeader ("X-File-Name", event.data["name"]); // Custom header - file name
  xhr.setRequestHeader ("X-File-Size", event.data["size"]); // Custom header - file size
  xhr.setRequestHeader ("X-Index", event.data["index"]); // Custom header - file index
  xhr.send (event.data["content"]); // Send headers and content
  self.postMessage(xhr.responseText); // Return answer
};