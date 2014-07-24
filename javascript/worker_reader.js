//#####################################################
// worker_reader.js - worker to read file
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
onmessage = function(event) {
  var reader = new FileReaderSync(); // Define reader
  postMessage(reader.readAsArrayBuffer(event.data)); // Return data to main script
}