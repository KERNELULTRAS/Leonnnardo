//#####################################################
// mkdir_on_server.js - create directory on server side
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
function mkdir_on_server (dir_name) {
	// console.log ($dir_name);
	// Encode
	if (!dir_name) {
		alert ("You must enter name of directory");
	}
	else {
		dir_name_enc = encodeURIComponent (ab2s (asmCrypto.AES_CBC.encrypt (encodeURIComponent (dir_name), "passwordpassword")));
		// New XHR2
		var xhr = new XMLHttpRequest ();
		xhr.open ("POST", "php/mkdir_on_server.php", false);
		xhr.setRequestHeader ("X-Dir-Name", dir_name_enc);
		xhr.send ();

		if (xhr.responseText == "OK") {
			document.getElementById ("status").innerHTML = "Directory <strong>" + dir_name + " </strong>successfully created";
		}
		else {
			document.getElementById ("status").innerHTML = "Error create directory";
		}
		list_files_on_server ();
		document.getElementById ("dir_name").value = "";
	}
}
