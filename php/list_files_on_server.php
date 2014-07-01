<?php
//#####################################################
// list_files_on_server.php - list files on server
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
$dir_array = scandir ("../uploads");
$dir_array_named = [];
// asort ($dir_array);
// echo json_encode ($dir_array);
foreach($dir_array as $child) {
  $file_name = file_get_contents ("../uploads/" . $child . "/". "name");
  $dir_array_named[$child] = $file_name;
}
echo json_encode ($dir_array_named);
?>