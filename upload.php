<?php 
$filename   = $_SERVER['HTTP_X_FILE_NAME'];
$filesize   = $_SERVER['HTTP_X_FILE_SIZE'];
$index      = $_SERVER['HTTP_X_INDEX'];

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
if (is_file ("uploads/" . $filename)) {
  echo 'File exists';
}
else {
  // we store chunks in directory named after filename
  if (!file_exists ("uploads/" . $filename .'/')){
    mkdir ("uploads/" . $filename .'/');
  }
  
  $target = "uploads/" . $filename . '/' . $filename . '-' . $index;
  
  $input = fopen ("php://input", "r");
  file_put_contents ($target, $input);
}