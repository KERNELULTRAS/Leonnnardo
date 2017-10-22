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
	window.localStorage.clear();
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
	// Define progressbar
	var progress_bar_download = document.getElementById ("progress_bar_download");

	// Show progress bar
	download_status.innerHTML = '<progress id = "progress_bar_download" value = "0" max = "100"></progress>';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	document.getElementById ("status").innerHTML = "Creating temporrary space";
	window.requestFileSystem (TEMPORARY, file_size, function (filesystem) {var fs = filesystem; isFileInFS (fs, file_name, file_name_dec, chunks_total, index);}, errorHandler);
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
	fs.root.createReader().readEntries(function(results) {
    [].forEach.call(results, function(entry) {
		console.log (entry);
		if (entry.isDirectory) {
		  entry.removeRecursively (function() {}, errorHandler);
		} else {
		  entry.remove (function() {}, errorHandler);
		}
	});
    //~ getAllEntries(fs.root);
	document.getElementById ("status").innerHTML = "Reading file from server " + index + "/" + chunks_total;
	readServerFile (fs, file_name, file_name_dec, chunks_total, index);
	}, errorHandler);
}

// Read file (chunk) on server
function readServerFile (fs, file_name, file_name_dec, chunks_total, index) {
	document.getElementById ("status").innerHTML = "Reading file from server " + index + "/" + chunks_total;
	progress_bar_download.max = chunks_total;
    progress_bar_download.value = index;
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
				progress_bar_download.value = 0;
				download_status.innerHTML = '';
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

function getAllEntries(dirEntry) {
  dirEntry.createReader().readEntries(function(results) {
    html = [];
    // var paths = results.map(function(el) { return el.fullPath.substring(1); });
    // renderFromPathObj(buildFromPathList(paths));
    // document.querySelector('#entries2').innerHTML = html.join('');

    var frag = document.createDocumentFragment();
    // Native readEntries() returns an EntryArray, which doesn't have forEach.
    [].forEach.call(results, function(entry) {
      var li = document.createElement('li');
      li.dataset.type = entry.isFile ? 'file' : 'folder';

      var deleteLink = document.createElement('a');
      deleteLink.href = '';
      deleteLink.innerHTML = '<img src="images/icons/delete.svg" alt="Delete this" title="Delete this">';
      deleteLink.classList.add('delete');
      deleteLink.onclick = function(e) {
        e.preventDefault();

        if (entry.isDirectory) {
          entry.removeRecursively(function() {
          logger.log('<p>Removed ' + entry.name + '</p>');
          getAllEntries(window.cwd);
        });
        } else {
          entry.remove(function() {
          logger.log('<p>Removed ' + entry.name + '</p>');
          getAllEntries(window.cwd);
        });
        }
        return false;
      };

      var span = document.createElement('span');
      span.appendChild(deleteLink);

      if (entry.isFile) {

        entry.file(function(f) {

          var size = Math.round(f.size * 100 / (1024 * 1024)) / 100;
          span.title = size + 'MB';

          if (size < 1) {
            size = Math.round(f.size * 100 / 1024) / 100;
            span.title = size + 'KB';
          }

          span.title += ', last modified: ' +
                        f.lastModifiedDate.toLocaleDateString();

          if (f.type.match('audio/') || f.type.match('video/ogg')) {

            var audio = new Audio();

            if (audio.canPlayType(f.type)) {
              audio.src = window.URL.createObjectURL(f);
              //audio.type = f.type;
              //audio.controls = true;
              audio.onended = function(e) {
                window.URL.revokeObjectURL(this.src);
              };

              var a = document.createElement('a');
              a.href = '';
              a.dataset.fullPath = entry.fullPath;
              a.textContent = entry.fullPath;
              a.appendChild(audio);
              a.onclick = playPauseAudio;

              span.appendChild(a);
            } else {
              span.appendChild(document.createTextNode(entry.fullPath + " (can't play)"));
            }
          } else {
            var a = document.createElement('a');
            a.href = '';
            a.textContent = entry.fullPath;

            a.onclick = function(e) {
              e.preventDefault();

              var iframe = preview.querySelector('iframe');
              if (!iframe) {
                iframe = document.createElement('iframe');
              } else {
                window.URL.revokeObjectURL(iframe.src);
              }

              preview.innerHTML = '';

              if (this.classList.contains('active')) {
                this.classList.remove('active');
                return;
              } else {
                this.classList.add('active');
              }

              iframe.src = window.URL.createObjectURL(f);
              preview.innerHTML = '';
              preview.appendChild(iframe);

              return false;
            };

            span.appendChild(a)
          }

          /*var img = document.createElement('img');
          img.src = 'images/icons/file.png';
          img.title = 'This item is a file';
          img.alt = img.title;
          span.appendChild(img);*/

          li.appendChild(span);
        }, errorHandler);
      } else {
        var span2 = document.createElement('span');

        var folderLink = document.createElement('a');
        folderLink.textContent = entry.fullPath;
        folderLink.href = '';
        folderLink.onclick = function(e) {
          e.preventDefault();
          cwd.getDirectory(this.textContent, {}, function(dirEntry) {
            window.cwd = dirEntry; // TODO: not sure why we need to use window.cwd here.
            getAllEntries(dirEntry);
          }, errorHandler);
          return false;
        };

        span2.appendChild(folderLink);
        span.appendChild(span2);
        span.classList.add('bold');
        var img = document.createElement('img');
        img.src = 'images/icons/folder.png';
        img.alt = 'This item is a folder';
        img.title = img.alt;
        span.title = img.alt;
        span.appendChild(img);

        li.appendChild(span);
      }
      frag.appendChild(li);
    });

    var entries = document.querySelector('#entries');
    entries.innerHTML = '<ul></ul>';
    entries.appendChild(frag);

  }, errorHandler);
}
