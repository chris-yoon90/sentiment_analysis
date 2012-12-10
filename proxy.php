<?php
// Set your return content type
header('Content-type: application/json');
session_start();

// Website url to open
$daurl = $_POST['url'];

// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>