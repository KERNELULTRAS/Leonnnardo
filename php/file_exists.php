<?php
//#####################################################
// file_exists.php - check whether a file exists
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
$filename = $_SERVER['HTTP_X_FILE_NAME'];
// If file exist on server dont upload it
if (is_file ("../uploads/" . $filename)) {
  echo 'File exists';
}
else {
  echo 'Uploading ...';
}
?>
