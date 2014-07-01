<?php
//#####################################################
// upload.php - save encrypted chunks into directory
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################

$file_name    = $_SERVER['HTTP_X_FILE_NAME']; // File name
if (isset ($_SERVER['HTTP_X_PSEUDO_NAME'])) {
  $cur_name   = $_SERVER['HTTP_X_PSEUDO_NAME']; // File name as number
}
$filesize     = $_SERVER['HTTP_X_FILE_SIZE']; // Size in bytes
$index        = $_SERVER['HTTP_X_INDEX']; // Index of chunk
$chunks_total = $_SERVER['HTTP_X_CHUNKS_TOTAL']; // Total of chunks

// file_put_contents ("log" . $index, $cur_name);

//#####################################################
// Make directory for file
// Than is number as pseudo name
// Real file name is encrypt in this directery stored
// in file ".name"
//#####################################################
function get_name () {
  global $chunks_total;
  $currently_name = 1;
  while (file_exists ("../uploads/file:" . $currently_name . ":" . $chunks_total)) {
    $currently_name++;
  }
  return $currently_name;
}

$file_name = rawurldecode ($file_name);

// Name must be set
if (!isset ($file_name)) {
  echo 'ERROR: Name required';
}

// Index must be set
if (!isset ($index)) {
  echo 'ERROR: Index required';
}

// Index must be number
if (!preg_match ('/^[0-9]+$/', $index)) {
  echo 'ERROR: Index must be number';
}

// Chunks_total must be set
if (!isset ($chunks_total)) {
  echo 'ERROR: Index required';
}

// Index must be number
if (!preg_match ('/^[0-9]+$/', $chunks_total)) {
  echo 'ERROR: Chunks total must be number';
}

// If file exist on server dont upload it
if ($index == "1") {
  $cur_name = get_name(); // Get fist free number as file name
  if (!file_exists ("../uploads/file:" . $cur_name . ":" . $chunks_total)) {
    mkdir ("../uploads/file:" . $cur_name . ":" . $chunks_total);
    chmod ("../uploads/file:" . $cur_name . ":" . $chunks_total, 0777);
    file_put_contents ('../uploads/file:' . $cur_name . ':' . $chunks_total . '/' . '.name', $file_name);
    chmod ("../uploads/file:" . $cur_name . ":" . $chunks_total ."/".".name", 0777);
  }

  $target = "../uploads/file:" . $cur_name . ":" . $chunks_total. "/" . $index;

  $input = fopen ("php://input", "r");
  file_put_contents ($target, $input);

  chmod ("../uploads/file:" . $cur_name . ":" . $chunks_total . "/" . $index, 0777);
  echo $cur_name;
}
else {
  $target = "../uploads/file:" . $cur_name . ":" . $chunks_total. "/" . $index;

  $input = fopen ("php://input", "r");
  file_put_contents ($target, $input);

  chmod ("../uploads/file:" . $cur_name . ":" . $chunks_total . "/" . $index, 0777);
  echo $cur_name;
}
?>
