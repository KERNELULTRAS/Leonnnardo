//#####################################################
// list_files_on_server.js - list files on server
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
function list_files_on_server () {

  var xhr = new XMLHttpRequest ();

  // Call php script
  xhr.open ("POST", "php/list_files_on_server.php", false);
  xhr.send ();
  var json_data_files = (xhr.responseText);
  // Parse to diles to array
  var obj_files = JSON.parse (json_data_files);
  console.log (obj_files);
  var files = "";
  files = '<table>';
  files += '<tr><td>File name</td><td>File size</td><td>Time created</td><td></td></tr>';
  // Print files
  for (var index in obj_files) {
    if (index.substring(0, 1) != ".") {
      // Extract file parameters
      var file_parameters = index.split(":");
      // Get file type (directory or file)
      var file_type = file_parameters[0];
      // If list file
      if (file_type == "file") {
        // Get file size
        var file_size = file_parameters[3];
        // Convert to GB, MB, kB
        if (file_size > 1000000000) {
          file_size = (file_size / 1000000000).toFixed(2) + "GB";
        }
        else if (file_size > 1000000) {
          file_size = (file_size / 1000000).toFixed(2) + "MB";
        }
        else if (file_size > 1000) {
          file_size = (file_size / 1000).toFixed(2) + "kB";
        }
        // Get unix timestamp
        var date = new Date(file_parameters[4]*1000);
        var file_time = date.toLocaleString();
        // Decrypt file name
        var file_name_dec = decodeURIComponent (ab2s (asmCrypto.AES_CBC.decrypt (decodeURIComponent (obj_files[index]), "passwordpassword")));
        // If file name is longer than 50chars, shorten to 50chars
        if (file_name_dec.length > 54) {
          file_name_short = file_name_dec.substr (0, 47) + " ... " + file_name_dec.substr (-7);
        }
        else {
          file_name_short = file_name_dec;
        }
        files += '<tr class = "files"><td title = "' + file_name_dec + '" onclick = download("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")>' + file_name_short + '</td><td onclick = download("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")>' + file_size + '</td><td onclick = download("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")>' + file_time + '</td><td onclick = remove_file("' + index + '")><img class="icon" title = "Delete file" src = "images/icons/delete.png"></td></tr>';
      }
      // If list directory
      else {
        // Get unix timestamp
        var date = new Date (file_parameters[2]*1000);
        var file_time = date.toLocaleString();
        // Decrypt directory name
        var file_name_dec = decodeURIComponent (ab2s (asmCrypto.AES_CBC.decrypt (decodeURIComponent (obj_files[index]), "passwordpassword")));
        if (file_name_dec.length > 54) {
          file_name_short = file_name_dec.substr (0, 47) + " ... " + file_name_dec.substr (-7);
        }
        else {
          file_name_short = file_name_dec;
        }
        files += '<tr class = "files"><td title = "' + file_name_dec + '" onclick = cd("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")><img class="icon" src = "images/icons/dir.png">' + file_name_short + '</td><td onclick = download("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")></td><td onclick = download("' + index + '"' + ',' + '"' + encodeURIComponent (file_name_dec) + '")>' + file_time + '</td><td onclick = remove_file("' + index + '")><img class="icon" title = "Delete file" src = "images/icons/delete.png"></td></tr>';
      }
    }
  }
  files += '</table>';
  // Write files to element "files"
  document.getElementById ("files").innerHTML = files;
  // document.getElementById ("status").innerHTML = "File list successfully";
}
