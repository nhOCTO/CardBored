<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

include_once("phpcrypt/phpCrypt.php");
use PHP_Crypt\PHP_Crypt as PHP_Crypt;
//
$key = "canv{$_SERVER['DOCUMENT_ROOT']}lhc70000";
$crypt = new PHP_Crypt($key, PHP_Crypt::CIPHER_AES_128, PHP_Crypt::MODE_CBC);
//
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

echo '||';

function getNeko ($warui_neko) {
    $key = "canv{$_SERVER['DOCUMENT_ROOT']}lhc70000";
    $crypt = new PHP_Crypt($key, PHP_Crypt::CIPHER_AES_128, PHP_Crypt::MODE_CBC);  
    $all = $warui_neko;
    $len = strlen($all);
    $iv2 = pack('H*', substr($all, -32));
    $neko_a = pack('H*', substr($all, 0, $len-32));
    $crypt->IV($iv2);
    $decrypt = $crypt->decrypt($neko_a);
    return $decrypt;
}

echo getNeko($warui_neko[1]);
?>