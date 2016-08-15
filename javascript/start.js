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

// Detect browser
var str = "User-agent header: " + navigator.userAgent;
if (str.match (/firefox/i)) {
  browser = "firefox";
}
else if (str.match (/chrome/i)) {
  browser = "chrome";
}

function start () {
  list_files_on_server();
}