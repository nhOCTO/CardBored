<?php

include_once("phpcrypt/phpCrypt.php");
use PHP_Crypt\PHP_Crypt as PHP_Crypt;

$key = "canv{$_SERVER['DOCUMENT_ROOT']}lhc70000";
$crypt = new PHP_Crypt($key, PHP_Crypt::CIPHER_AES_128, PHP_Crypt::MODE_CBC);

$neko = $_GET["neko"];

if ($neko) {
    $iv = $crypt->createIV();
    $encrypt = $crypt->encrypt($neko);
    $all = $encrypt . $iv;
    $warui_neko = unpack("H*",$all);
    echo $warui_neko[1];
} else {
    echo 'nyan~~';
}

?>