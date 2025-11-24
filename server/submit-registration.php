<?php
header('Content-Type: application/json; charset=utf-8');


$input = file_get_contents('php://input');
$data = array();


$decoded = json_decode($input, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded)>0) {
    $data = $decoded;
} else {
   
    $data['firstName'] = $_POST['firstName'] ?? '';
    $data['lastName'] = $_POST['lastName'] ?? '';
    $data['email'] = $_POST['email'] ?? '';
    $data['age'] = $_POST['age'] ?? '';
    $data['gender'] = $_POST['gender'] ?? '';
    $data['ts'] = time();
}


if (empty($data['firstName']) || empty($data['lastName']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['ok'=>false, 'error'=>'Missing required fields']);
    exit;
}

$path = __DIR__ . '/registration.json';
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





(function(){

let s = document.getElementById('stars'),
    f = document.getElementById('starsFill'),
    sc = document.getElementById('score'),
    r = document.getElementById('rating'),
    err = document.getElementById('feedbackError');

let v = 0;

// ให้ผู้ใช้กดดาว
function rate(x){
  const rect = s.getBoundingClientRect();
  let p = x - rect.left;
  if (p < 0) p = 0;
  if (p > rect.width) p = rect.width;

  v = Math.round((p / rect.width * 5) * 2) / 2;

  f.style.width = (v / 5 * 100) + '%';
  sc.textContent = v ? v : '0';
  r.value = v;
}

s.addEventListener('click', e => { rate(e.clientX); });

// ปุ่มเคลียร์
document.getElementById('btnClean').onclick = () => {
  document.getElementById('name').value = '';
  document.getElementById('message').value = '';
  err.style.display = 'none';
  rate(0);
};

// ส่งฟอร์ม
document.getElementById('feedbackForm').onsubmit = async function(e){
  e.preventDefault();

  let n = document.getElementById('name').value.trim();
  let m = document.getElementById('message').value.trim();
  let ratingValue = r.value;

  // Validation
  err.style.display = 'none';

  if (!n){
    err.textContent = '⚠️ Please enter your name.';
    err.style.display = 'block';
    return;
  }

  if (!m){
    err.textContent = '⚠️ Please enter your message.';
    err.style.display = 'block';
    return;
  }

  if (!ratingValue || Number(ratingValue) <= 0){
    err.textContent = '⚠️ Please give us a star rating.';
    err.style.display = 'block';
    return;
  }

  // เก็บใน localStorage ด้วย (เหมือนของเดิม)
  let k = 'ourFestival.reviews.v1';
  let a = JSON.parse(localStorage.getItem(k) || '[]');
  a.unshift({ name: n, message: m, rating: ratingValue, ts: Date.now() });
  localStorage.setItem(k, JSON.stringify(a));

  // กำหนด FormData (รองรับ iPhone)
  let fd = new FormData();
  fd.append('name', n);
  fd.append('message', m);
  fd.append('rating', ratingValue);

  try {
    // ส่งข้อมูลไป PHP
    const res = await fetch('server/submit-feedback.php', {
      method: 'POST',
      body: fd,
      credentials: 'same-origin'
    });

    const txt = await res.text();
    console.log("server response:", txt);

    // รอ fetch เสร็จแล้วค่อย redirect (สำคัญมากสำหรับ iPhone)
    window.location.href = 'index.html#reviewsSection';
  } 
  catch (error){
    console.error("Fetch error:", error);
    err.textContent = "⚠️ Network error. Try again.";
    err.style.display = "block";
  }
};

})();

?>

