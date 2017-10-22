<!DOCTYPE html>
<!--
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
//-->
<?php session_start(); ?>
<html>
  <head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="javascript/start.js"></script>
    <script type="text/javascript" src="javascript/upload.js"></script>
    <script type="text/javascript" src="javascript/download.js"></script>
    <script type="text/javascript" src="javascript/remove_file.js"></script>
    <script type="text/javascript" src="javascript/list_files_on_server.js"></script>
    <script type="text/javascript" src="javascript/asmcrypto.js"></script>
    <script type="text/javascript" src="javascript/mkdir_on_server.js"></script>
    <script type="text/javascript" src="javascript/cd.js"></script>
    <script type="text/javascript" src="javascript/idb.filesystem.js"></script>
    <script type="text/javascript" src="javascript/filesaver.js"></script>
    <link rel="stylesheet" type="text/css" href="css/classic.css">
  </head>
  <body onload = "start()">
    <div class = "head">
      <span class="name">Leonnnardo</span>
      <span class="slogan">encrypted upload and download huge files</span>
    </div>
    <div class = "status_bar">
      <div id="status">Status:</div>
    </div>
    <div class = "upload_container">
      <div class="upload_header">
        <h1>Upload file</h1>
      </div>
      <div class="upload_files">
        <h1>Upload</h1>
        <input type = "file" name = "file" id = "fileToUpload"> <button onclick = "upload()">Send</button>
        <span id = "upload_status"><progress id = "progress_bar" value = "0" max = "100"></progress></span><span id = "percent"></span>
      </div>
    </div>
    <div class="download_container">
      <div class="download_header">
        <h1>Files on server</h1>
      </div>
      <div class="download_files">
        <button onclick="list_files_on_server()">Refresh</button>
        <input type = "text" id = "dir_name">
        <button onclick = "mkdir_on_server(getElementById('dir_name').value)">Make directory</button>
        <p class = "download_table"><a id = "download_link" download></a></p>
        <p id = "files"></p>
        <span id = "download_status"></span>
      </div>
    </div>
  </body>
<html>
