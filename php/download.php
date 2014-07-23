<?php
//#####################################################
// download.php - download encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
$file_name   = $_SERVER['HTTP_X_FILE_NAME'];
$index   = $_SERVER['HTTP_X_INDEX'];

$file_name = rawurldecode ($file_name);

// Name must be set
if (!isset ($_SERVER['HTTP_X_FILE_NAME'])) {
  echo 'Name required';
}

// Index must be set
if (!isset ($_SERVER['HTTP_X_INDEX'])) {
  echo 'Index required';
}
// Index must be number
if (!preg_match ('/^[0-9]+$/', $_SERVER['HTTP_X_INDEX'])) {
  echo 'Index error';
}

// If file exist on server dont upload it
if (file_exists ("../uploads/" . $file_name)) {

  $file_name = "../uploads/" . $file_name . '/' . $index;
  $mime = exec ("file -bi " . escapeshellarg ($file_name));
  $handle = fopen ($file_name, "r");
  $atachment = base64_encode (fread($handle, filesize($file_name)));
  fclose ($handle);
  $file_size = strlen ($atachment);

file_put_contents ("log", $file_name);

  // Send header
  header ('Content-Description: File Transfer');
  header ('Pragma: public'); 	// required
  header ('Expires: 0');		// no cache
  header ('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  header ('Last-Modified: '.gmdate ('D, d M Y H:i:s', filemtime ($file_name)).' GMT');
  header ('Cache-Control: private',false);
  header ('Content-Type: '.$mime);
  header ('Content-Disposition: attachment; filename="'.basename ($file_name).'"');
  header ('Content-Transfer-Encoding: binary');
  header ('Content-Length: '. $file_size);	// provide file size
  header ('Connection: close');

  ob_clean ();
  flush ();

  // Send file
  echo $atachment;
}
?>
