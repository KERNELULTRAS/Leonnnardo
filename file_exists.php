<?php
$filename   = $_SERVER['HTTP_X_FILE_NAME'];
// If file exist on server dont upload it
if (is_file ("uploads/" . $filename)) {
  echo 'File exists';
}
else {
  echo 'Uploading ...';
}
?>