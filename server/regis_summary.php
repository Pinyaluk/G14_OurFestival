<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Summary</title>
 
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
   <link rel="stylesheet" href="../css/regis_summary.css">
</head>
<body>

   <header class="navbar">
    <div class="logo">
      <a href="../index.html"> Comnival Fair </a>
    </div>

    <nav class="nav-desktop">
      <a href="../index.html#about">ABOUT</a>
      <a href="../boothdirectory.html">BOOTH</a>
      <a href="../index.html#footer">CONTACT</a>
    </nav>

    <div class="desktop-menu-icon" id="desktopMenuIcon">&#9776;</div>

    <div class="desktop-dropdown" id="desktopDropdown">
      <a href="../feedback.html">FEEDBACK</a>
      <a href="regis_summary.php">SUMMARY</a>
    </div>


    <div class="menu-icon" id="menuIcon">&#9776;</div>

     <nav class="nav-mobile" id="navMobile">
      <a href="../index.html#about">ABOUT</a>
      <a href="../boothdirectory.html">BOOTH</a>
      <a href="../index.html#footer">CONTACT</a>
      <a href="../feedback.html">FEEDBACK</a>
      <a href="regis_summary.php">SUMMARY</a>
    </nav>

  </header>


  <div class="register-container">
    <h2>List of Registered Visitors</h2>

   
    <div class="table-responsive mt-4">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-warning">
          <tr>
            <th>No.</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>



        <?php

$dataFile = __DIR__ . '/registration.json';
$rowsHtml = '';
if (file_exists($dataFile)) {
  $json = file_get_contents($dataFile);
  $arr = json_decode($json, true);
  if (is_array($arr)) {
    foreach ($arr as $i => $item) {
      $fn = htmlspecialchars($item['firstName'] ?? '', ENT_QUOTES, 'UTF-8');
      $ln = htmlspecialchars($item['lastName'] ?? '', ENT_QUOTES, 'UTF-8');
      $email = htmlspecialchars($item['email'] ?? '', ENT_QUOTES, 'UTF-8');
      $age = htmlspecialchars($item['age'] ?? '', ENT_QUOTES, 'UTF-8');
      $gender = htmlspecialchars($item['gender'] ?? '', ENT_QUOTES, 'UTF-8');
      $ts = isset($item['ts']) ? date('Y-m-d H:i:s', $item['ts']) : '';
      $rowsHtml .= "<tr><td>".($i+1)."</td><td>{$fn}</td><td>{$ln}</td><td>{$email}</td><td>{$age}</td><td>{$gender}</td></tr>\n";
    }
  }
}
echo $rowsHtml;
?>
      </table>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-3 flex-wrap">

      <a href="../boothdirectory.html" class="btn btn-warning w-50 mt-3">GO To Fastival</a>

      
      
    </div>
  </div>


 <script>
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById('menuIcon');
  const navMobile = document.getElementById('navMobile');
  const desktopMenuIcon = document.getElementById('desktopMenuIcon');
  const desktopDropdown = document.getElementById('desktopDropdown');

  // เมนูมือถือ
  menuIcon.addEventListener('click', () => {
    navMobile.classList.toggle('active');
  });

  // เมนู feedback/summary ในคอม
  desktopMenuIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // ป้องกันการปิดเมนูทันที
    desktopDropdown.classList.toggle('show');
  });

  // คลิกที่อื่นเพื่อปิด dropdown
  document.addEventListener('click', (event) => {
    if (!desktopMenuIcon.contains(event.target) && !desktopDropdown.contains(event.target)) {
      desktopDropdown.classList.remove('show');
    }
  });
});
</script>


</body>
</html>