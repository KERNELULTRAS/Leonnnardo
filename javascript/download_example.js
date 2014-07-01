var chunkSize = 256 * 1024;
var totalChunks = 400;
var currentChunk = 0;
var mime = 'application/octet-binary';
var waitBetweenChunks = 0;

var finalBlob = null;
var chunkBlobs = [];

function addChunk () {
    var typedArray = new Int8Array (chunkSize);
    chunkBlobs [currentChunk] = new Blob ([typedArray], {type: mime});
    console.log ('added chunk', currentChunk);
    currentChunk++;
    if (currentChunk == totalChunks) {
        console.log ('all chunks completed');
        finalBlob = new Blob (chunkBlobs, {type: mime});
        document.getElementById ('completedFileLink').href = URL.createObjectURL (finalBlob);
        console.log (URL.createObjectURL (finalBlob));
    } else {
        window.setTimeout (addChunk, waitBetweenChunks);
    }
}

addChunk ();