// Worker to read data from chunk
onmessage = function(event)
{
  var reader = new FileReaderSync(); // Define reader 
  postMessage(reader.readAsArrayBuffer(event.data)); // Return data to main script
}