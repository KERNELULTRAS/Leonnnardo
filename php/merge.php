<?php
$filename = $_REQUEST['name'];
// Name must be set 
if (!isset ($_REQUEST['name'])) {
	echo 'Name required';
}

// index must be set, and number
if (!isset ($_REQUEST['index'])) {
	echo 'Index required';
}

if (!preg_match ('/^[0-9]+$/', $_REQUEST['index'])) {
	echo 'Index error';
}


if (!is_file ("uploads/" . $filename)) {
	$target = "uploads/full_" . $_REQUEST['name'];
	$dst = fopen ($target, 'wb');

	for ($i = 1; $i <= $_REQUEST['index']; $i++) {
		$slice = 'uploads/' . $_REQUEST['name'] . '/' . $_REQUEST['name'] . '-' . $i;
		$src = fopen ($slice, 'rb');
		stream_copy_to_stream ($src, $dst);
		fclose ($src);
		unlink ($slice);
	}

	fclose ($dst);
	rmdir ("uploads/" . $_REQUEST['name']);
	rename ("uploads/full_" . $_REQUEST['name'], "uploads/" . $_REQUEST['name']);
	chmod ("uploads/" . $_REQUEST['name'], 0777);
	echo "OK";
}
?>
