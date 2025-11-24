<?php
header('Content-Type: application/json; charset=utf-8');

// รับข้อมูลจาก FormData (หรือ JSON ถ้ามาแบบนั้น)
$raw = file_get_contents('php://input');
$data = [];

// กรณี JSON เช่นจาก Android
$decoded = json_decode($raw, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded) > 0) {
    $data = $decoded;
} else {
    // กรณี FormData (iPhone ใช้อันนี้)
    $data['name'] = $_POST['name'] ?? '';
    $data['message'] = $_POST['message'] ?? '';
    $data['rating'] = $_POST['rating'] ?? '';
    $data['ts'] = time();
}

// ตรวจสอบข้อมูล
if (empty($data['name']) || empty($data['message']) || empty($data['rating'])) {
    http_response_code(400);
    echo json_encode(['ok'=>false, 'error'=>'Missing required fields']);
    exit;
}

// ตำแหน่งไฟล์ feedback.json (อยู่ใน server/ เดียวกับไฟล์นี้)
$path = __DIR__ . '/feedback.json';

// ถ้ายังไม่มีไฟล์ ให้สร้างไฟล์ว่าง
if (!file_exists($path)) {
    file_put_contents($path, json_encode([]));
}

// เปิดไฟล์แบบอ่านและเขียน
$fp = fopen($path, 'c+');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['ok'=>false, 'error'=>'Failed to open file']);
    exit;
}

if (flock($fp, LOCK_EX)) {

    rewind($fp);
    $contents = stream_get_contents($fp);
    $arr = json_decode($contents, true);

    if (!is_array($arr)) $arr = [];

    // แทรกข้อมูลใหม่ไว้บนสุด
    array_unshift($arr, [
        'name' => $data['name'],
        'message' => $data['message'],
        'rating' => $data['rating'],
        'ts' => $data['ts']
    ]);

    // เขียนใหม่ทั้งไฟล์
    ftruncate($fp, 0);
    rewind($fp);

    fwrite($fp, json_encode($arr, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(['ok'=>true, 'data'=>$data]);
    exit;

} else {
    fclose($fp);
    http_response_code(500);
    echo json_encode(['ok'=>false, 'error'=>'Could not lock file']);
}
?>
