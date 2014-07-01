<?php
//#####################################################
// remove_file.php - remove file or directory
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
$file_name   = "../uploads/" . $_SERVER['HTTP_X_FILE_NAME'];

file_put_contents ('log', $file_name);

remove_file ($file_name);

function remove_file ($file_name) {
  foreach (glob ($file_name . '/*') as $file) {
    if (is_dir ($file)) remove_file ($file); else unlink ($file);
  } rmdir ($file_name);
}
?>
