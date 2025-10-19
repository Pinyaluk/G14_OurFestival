window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("userTable");
  const users = JSON.parse(localStorage.getItem("registrations")) || [];

  if (users.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No registered users yet.</td></tr>`;
    return;
  }

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.age}</td>
      <td>${user.gender}</td>
    `;
    tableBody.appendChild(row);
  });
});