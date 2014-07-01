//#####################################################
// download.js - download encrypted chunks
//
// Part of projekt SLUT https://github.com/bedna-KU/Slut
//
// Licence GNU General Public License
// Version 3
// http://www.gnu.org/copyleft/gpl.html
//#####################################################
function download (file, file_name_dec) {

  var file_name = file; // Encode to URI blob name
  var index = 1; // File index

  xhr = new XMLHttpRequest ();

  xhr.open ("POST", "php/download.php", false);
  xhr.setRequestHeader ("X-File-Name", file_name);
  xhr.setRequestHeader ("X-INDEX", index);
  xhr.send ();

  content = atob (xhr.responseText);
  // console.log (content);
  var decrypted = asmCrypto.AES_CBC.decrypt (content, "passwordpassword");

  // var blob = new Blob ([decrypted], {type: "'" + xhr.getResponseHeader ('content-type') + "'"});
  var blob = new Blob ([decrypted]);
  saveAs (blob, decodeURIComponent (file_name_dec));
}

function toType (val){
    return Object.prototype.toString.call (val).replace (/^\[object (.+)\]$/,"$1").toLowerCase();
}
