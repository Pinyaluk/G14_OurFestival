<?php
header('Content-Type: application/json; charset=utf-8');

$input = file_get_contents('php://input');
$data = array();

// กรณี JSON เช่นจาก Android
$decoded = json_decode($input, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded)>0) {
    $data = $decoded;
} else {
    
    $data['name'] = $_POST['name'] ?? '';
    $data['message'] = $_POST['message'] ?? '';
    $data['rating'] = $_POST['rating'] ?? '';
    $data['ts'] = time();
}


if (empty($data['name']) || empty($data['message']) || empty($data['rating'])) {
    http_response_code(400);
    echo json_encode(['ok'=>false, 'error'=>'Missing required fields']);
    exit;
}


$path = __DIR__ . '/feedback.json';

if (!file_exists($path)) {
    file_put_contents($path, json_encode([]));
}


$fp = fopen($path, 'c+');
if (flock($fp, LOCK_EX)) {
    $contents = stream_get_contents($fp);
    $arr = json_decode($contents, true);
    if (!is_array($arr)) $arr = [];
    
    array_unshift($arr, $data);
    
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($arr, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    echo json_encode(['ok'=>true, 'data'=>$data]);
} else {
    fclose($fp);
    http_response_code(500);
    echo json_encode(['ok'=>false, 'error'=>'Could not lock file']);
}
?>
