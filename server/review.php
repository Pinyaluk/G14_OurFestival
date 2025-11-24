<?php
header('Content-Type: text/html; charset=utf-8');

$path = __DIR__ . '/feedback.json';

if (!file_exists($path)) {
    echo '<div id="serverReviewFragment" data-avg="0" data-count="0"><p>No reviews yet.</p></div>';
    exit;
}

$json = file_get_contents($path);
$data = json_decode($json, true);

if (!is_array($data) || count($data) === 0) {
    echo '<center><div id="serverReviewFragment" data-avg="0" data-count="0"></div></center>';
    exit;
}

// คำนวณค่าเฉลี่ย
$sum = 0;
$count = 0;
foreach ($data as $item) {
    $v = isset($item['rating']) ? floatval($item['rating']) : 0;
    $sum += $v;
    $count++;
}
$avg = $count ? round($sum / $count, 1) : 0;

echo "<div id='serverReviewFragment' data-avg='{$avg}' data-count='{$count}'>";

foreach ($data as $i => $item) {
    $name = htmlspecialchars($item['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $msg  = nl2br(htmlspecialchars($item['message'] ?? '', ENT_QUOTES, 'UTF-8'));
    $rating = htmlspecialchars($item['rating'] ?? '', ENT_QUOTES, 'UTF-8');
    $ts = isset($item['ts']) ? date('Y-m-d H:i:s', (int)$item['ts']) : '';

    echo "<div class='review-card'>";
    echo "<div class='review-stars-row'><span class='stars'>".str_repeat('★', min(5,(int)$rating)).str_repeat('☆', 5-min(5,(int)$rating))."</span>";
    echo "<span> {$rating}/5</span></div>";
    echo "<p class='review-message'>{$msg}</p>";
    echo "<div class='review-name'>{$name} <small style='color:#888;margin-left:8px;font-size:.8rem'>{$ts}</small></div>";
    echo "</div>";
}

echo "</div>";
