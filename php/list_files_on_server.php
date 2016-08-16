<?php
//#####################################################
// list_files_on_server.php - list files on server
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################

if (!file_exists ("../uploads"))  {
	@mkdir ("../uploads");
	@chmod ("../uploads");
}
if (file_exists ("../uploads"))  {
	$dir_array = @scandir ("../uploads");
	foreach ($dir_array as $child) {
		if (substr ($child, 0, 1) != ".") {
			$file_name = file_get_contents ("../uploads/" . $child . "/". "name");
			$dir_array_named[$child] = $file_name;
		}
	}
	if (@$dir_array_named) {
		echo json_encode ($dir_array_named);
	}
	else {
		echo "empty";
	}
}
else {
	echo "error_perm";
}
?>
