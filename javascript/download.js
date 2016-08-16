//#####################################################
// download.js - download encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
// Author: Mario Chorvath - Bedna
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################

function download (file_name, file_name_dec) {
	// Extract file parameters
	var file_parameters = file_name.split (":");
	// Get total file chunks
	var chunks_total = file_parameters[2];
	// Get file size
	var file_size = file_parameters[3];
	// New Blob
	var blob = new Blob ();
	// First index of chunks
	var index = 1;

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	document.getElementById ("status").innerHTML = "Creating temporrary space";
	window.requestFileSystem (window.TEMPORARY, file_size, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec, chunks_total, index);}, errorHandler);
}

// As exists previous file
function isFileInFS (fs, file_name, file_name_dec, chunks_total, index) {

	var dirReader = fs.root.createReader();
	var entries = [];

	// Call the reader.readEntries() until no more results are returned.
	var readEntries = function () {
		dirReader.readEntries (function(results) {
			if (!results.length) {
				document.getElementById ("status").innerHTML = "Reading from server";
				readServerFile (fs, file_name, file_name_dec, chunks_total, index);
			} else {
				document.getElementById ("status").innerHTML = "Removing previous temporrary file";
				rmFileFS (fs, file_name, file_name_dec, chunks_total, index);
			}
		}, errorHandler);
	};
	readEntries (); // Start reading dirs.
}

// Remove file
function rmFileFS (fs, file_name, file_name_dec, chunks_total, index) {
	var dirReader = fs.root.createReader ();
	dirReader.readEntries (function (entries) {
	for (var i = 0, entry; entry = entries[i]; ++i) {
		if (entry.isDirectory) {
		  entry.removeRecursively (function() {}, errorHandler);
		} else {
		  entry.remove (function() {}, errorHandler);
		}
	}
	document.getElementById ("status").innerHTML = "Reading file from server " + index + "/" + chunks_total;
	readServerFile (fs, file_name, file_name_dec, chunks_total, index);
	}, errorHandler);
}



// Read file (chunk) on server
function readServerFile (fs, file_name, file_name_dec, chunks_total, index) {
	document.getElementById ("status").innerHTML = "Reading file from server " + index + "/" + chunks_total;
	var d1 = new Date ();
	var n1 = d1.getTime();
	// New XHR2
	var xhr = new XMLHttpRequest ();
	xhr.open ("POST", "php/download.php", false);
	xhr.setRequestHeader ("X-FILE-NAME", file_name);

	xhr.setRequestHeader ("X-INDEX", index);
	xhr.send ();

	content = atob (xhr.responseText);
	// Decrypt content
	document.getElementById ("status").innerHTML = "Decrypting file " + index + "/" + chunks_total;
	var decrypted = asmCrypto.AES_CBC.decrypt (content, "passwordpassword");
	// var blob = new Blob ([decrypted], {type: "'" + xhr.getResponseHeader ('content-type') + "'"});
	var blob = new Blob ([decrypted]);
	// Decrypted file_name
	// var true_name = "aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=aľščťžýáíé=.mp4";
	// var true_name = decodeURIComponent (file_name_dec);
	var d2 = new Date();
	var n2 = d2.getTime();
	var v = n2 -n1;
	console.log ("Reading: " + v.toString ());
	writeFs (fs, file_name, file_name_dec, chunks_total, index, blob);
}

// Write file on local FileSystem
function writeFs (fs, file_name, file_name_dec, chunks_total, index, blob) {
	document.getElementById ("status").innerHTML = "Writing file to temporrary space " + index + "/" + chunks_total;
	var d1 = new Date();
	var n1 = d1.getTime();
	fs.root.getFile(file_name_dec, {create: true}, function(fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function(fileWriter) {
			fileWriter.seek (fileWriter.length);
			fileWriter.onwriteend = function(e) {
			// If download all chunks make link to save file
			if (index >= chunks_total) {
				document.getElementById ("status").innerHTML = "File successfully downloaded";
				if (browser == "chrome") {
					// Link to temporrary local storage
					download_link.download = decodeURIComponent (file_name_dec);
					download_link.href = fileEntry.toURL();
					download_link.innerHTML = '<span  onclick="this.innerHTML=' + "''" + '"><img class = "icon" src="images/icons/down_arrow.gif">' + decodeURIComponent (file_name_dec) + '<span>';
				}
				else {
					download_link.download = decodeURIComponent (file_name_dec);
					download_link.href = toURL (fileEntry);
					// Download link (after click on link, link removed)
					download_link.innerHTML = '<span  onclick="this.innerHTML=' + "''" + '"><img class = "icon" src="images/icons/down_arrow.gif">' + decodeURIComponent (file_name_dec) + '<span>';
					return;
				}
			}
			// Download next chunk
			else {
				index++;
				var d2 = new Date();
				var n2 = d2.getTime();
				var v = n2 -n1;
				console.log ("Writing: " + v.toString());
				readServerFile (fs, file_name, file_name_dec, chunks_total, index);
				// PUSSY PLS WRT APPEND
			}
		};
		fileWriter.onerror = function (e) {
			console.log('Write failed: ' + e.toString());
		};
		// Create a new Blob and write it to log.txt.
		// var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
		fileWriter.write (blob);
		}, errorHandler);
	}, errorHandler);
}

// Error handler
function errorHandler(e) {
	var msg = '';
	console.log (e.name);
}

function toURL(entry) {
	// Can't polyfill opening filesystem: URLs, so create a blob: URL instead.
	// TODO(ericbidelman): cleanup URLs created using revokeObjectUR().
	if (entry.isFile && entry.file_.blob_) {
		var blob = entry.file_.blob_;
	} else {
		var blob = new Blob([]);
	}

	return window.URL.createObjectURL(blob);
}
