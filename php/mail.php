<?php

header("content-type: text/text");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Access-token, Url-for-url-type");

$content = $_POST["message"];
$subject = "Better Canvas - response";

echo mail("hechenli2-c@my.cityu.edu.hk", $subject, $content);

?>

