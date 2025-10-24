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
