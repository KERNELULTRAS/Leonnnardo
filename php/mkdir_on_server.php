<?php
//#####################################################
// mkdir_on_server.php - create directory on server side
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
// Get pseudo name (as number)
file_put_contents ("log", "aaa");
function get_name () {
	$time = time();
	$currently_name = 1;
	while (file_exists ("../uploads/dir:" . $currently_name . ":" . $time)) {
		$currently_name++;
	}
	return "../uploads/dir:" . $currently_name . ":" . $time;
}

$dir_name = urldecode ($_SERVER['HTTP_X_DIR_NAME']); // File name
$dir_pseudo_name = get_name ();
mkdir ($dir_pseudo_name);
chmod ($dir_pseudo_name, 0777);
// Encrypted directory name save into directory into file "name"
file_put_contents ($dir_pseudo_name . "/name", $dir_name);
chmod ($dir_pseudo_name . "/name", 0777);
echo "OK";
?>
