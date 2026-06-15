<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$target = $_GET['url'] ?? '';

if (!$target) {
    http_response_code(400);
    exit('Missing ?url= parameter');
}

if (!filter_var($target, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    exit('Invalid URL');
}

// Add download=1 if not present
$parsed = parse_url($target);
$query = [];
if (!empty($parsed['query'])) {
    parse_str($parsed['query'], $query);
}
if (!isset($query['download'])) {
    $query['download'] = '1';
}
$target = $parsed['scheme'] . '://' . $parsed['host']
    . ($parsed['path'] ?? '')
    . '?' . http_build_query($query);

$cookieFile = tempnam(sys_get_temp_dir(), 'curl_cookies_');

$ch = curl_init($target);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 10,
    CURLOPT_COOKIEFILE     => $cookieFile,
    CURLOPT_COOKIEJAR      => $cookieFile,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    CURLOPT_HTTPHEADER     => [
        'Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream,*/*',
        'Accept-Language: en-US,en;q=0.9',
    ],
    CURLOPT_HEADER         => true,
    CURLOPT_TIMEOUT        => 30,
]);

$response = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$error = curl_error($ch);
curl_close($ch);
@unlink($cookieFile);

if ($response === false) {
    http_response_code(502);
    exit('cURL error: ' . $error);
}

$body = substr($response, $headerSize);


http_response_code($httpCode);
header('Content-Type: ' . ($contentType ?: 'application/octet-stream'));
echo $body;
