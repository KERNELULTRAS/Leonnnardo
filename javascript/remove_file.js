//#####################################################
// remove_file.js - remove file or directory
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
function remove_file (file_name) {

	if (confirm ("Delete?") == true) {

		xhr = new XMLHttpRequest ();

		xhr.open ("POST", "php/remove_file.php", false);
		xhr.setRequestHeader ("X-File-Name", file_name);
		xhr.send ();

		document.getElementById ("status").innerHTML = "Deleted";

		list_files_on_server ();
		// content = atob (xhr.responseText);
	}
}
