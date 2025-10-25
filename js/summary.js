window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("userTable");
  const users = JSON.parse(localStorage.getItem("registrations")) || [];

  if (users.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No registered users yet.</td></tr>`;
  } else {
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="No.">${index + 1}</td>
        <td data-label="Full Name">${user.firstName} ${user.lastName}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Age">${user.age}</td>
        <td data-label="Gender">${user.gender}</td>
      `;
      tableBody.appendChild(row);
    });
  } 
});

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


