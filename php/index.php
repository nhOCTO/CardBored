<?php

include_once("phpcrypt/phpCrypt.php");
use PHP_Crypt\PHP_Crypt as PHP_Crypt;

$q = $_GET["type"];
$token;
$token_e;
$url_for_url_type;

foreach (getallheaders() as $name => $value) {
    if ($name == "Access-token")
        $token_e = $value;
    if ($name == "Url-for-url-type")
        $url = $value;
}

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

$token = getNeko($token_e);

$curl = curl_init();
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_VERBOSE, 1);
curl_setopt($curl, CURLOPT_HEADER, 1);
 

if (!function_exists('http_parse_headers'))
{
    function http_parse_headers($raw_headers)
    {
        $headers = array();
        $key = ''; // [+]

        foreach(explode("\n", $raw_headers) as $i => $h)
        {
            $h = explode(':', $h, 2);

            if (isset($h[1]))
            {
                if (!isset($headers[$h[0]]))
                    $headers[$h[0]] = trim($h[1]);
                elseif (is_array($headers[$h[0]]))
                {
                    $headers[$h[0]] = array_merge($headers[$h[0]], array(trim($h[1])));
                }
                else
                {
                    $headers[$h[0]] = array_merge(array($headers[$h[0]]), array(trim($h[1])));
                }

                $key = $h[0];
            }
            else
            {
                if (substr($h[0], 0, 1) == "\t")
                    $headers[$key] .= "\r\n\t".trim($h[0]);
                elseif (!$key)
                    $headers[0] = trim($h[0]);trim($h[0]);
            }
        }

        return $headers;
    }
}

if ($q == "self") {
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/users/self");
} else if ($q == "login") {
    $uid = $_GET["uid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/users/" . $uid . "logins");
} else if ($q == "activity") {
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/users/self/activity_stream");
} else if ($q == "courses") {
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses?include[]=syllabus_body");
} else if ($q == "notification") {
    $acc_id = $_GET["acc_id"];
    $uid = $_GET["uid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/accounts/" . $acc_id . "/users/" . $uid . "/account_notifications");
} else if ($q == "url") {
    curl_setopt($curl, CURLOPT_URL, $url);
} else if ($q == "frontpage") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/front_page");
} else if ($q == "tabs") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/tabs");
} else if ($q == "announcement") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/discussion_topics?only_announcements=true");
} else if ($q == "discussion") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/discussion_topics");
} else if ($q == "entry") {
    $cid = $_GET["cid"];
    $discuss_id = $_GET["discuss_id"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/discussion_topics/" . $discuss_id . "/entries");
} else if ($q == "reply") {
    $cid = $_GET["cid"];
    $discuss_id = $_GET["discuss_id"];
    $entry_id = $_GET["entry_id"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/discussion_topics/" . $discuss_id . "/entries/" . $entry_id . "/replies" );
} else if ($q == "assignment") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/assignments");
}  else if ($q == "submission") {
    $cid = $_GET["cid"];
    $uid = $_GET["uid"];
    $ass_id = $_GET["ass_id"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/assignments/" . $ass_id . "/submissions/" . $uid);
}  else if ($q == "page") {
    $cid = $_GET["cid"];
    $single_page = $_GET["single_page"];
    if ($single_page == "true") {
        $page_url = $_GET["page_url"];
        curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/pages/" . $page_url);
    } else {
        curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/pages");
    }
} else if ($q == "folders") {
    $cid = $_GET["cid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/folders?per_page=100");
} else if ($q == "files") {
    $folder_id = $_GET["folder_id"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/folders/" . $folder_id . "/files?per_page=100");
} else if ($q == "quizsubmit") {
    $cid = $_GET["cid"];
    $qzid = $_GET["qzid"];
    curl_setopt($curl, CURLOPT_URL, "https://canvas.cityu.edu.hk/api/v1/courses/" . $cid . "/quizzes/" . $qzid . "/submissions");
}

// send request
$response = curl_exec($curl);

// get head
$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
//$header = substr($response, 0, $header_size);
list($header, $body) = explode("\r\n\r\n", $response, 2);
$parsed_header = http_parse_headers($header);

header($parsed_header[0]);

header("content-type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Access-token, Url-for-url-type");

if ($q == "announcement" || $q == "discussion" || $q == "url") {
    foreach ($parsed_header as $name => $value) {
        if ($name === "Link" || $name === "link")
            header("Link: " . $value);
    }
}

echo $body;;

?>