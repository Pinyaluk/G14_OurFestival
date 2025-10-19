document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.querySelector("input[name='gender']:checked");
  const terms = document.getElementById("terms").checked;
  const errorMessage = document.getElementById("errorMessage");

 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!firstName || !lastName || !email || !age || !gender || !terms) {
    errorMessage.textContent = "⚠️ Please fill in all fields and accept the terms.";
    return;
  }

  if (!emailPattern.test(email)) {
    errorMessage.textContent = "⚠️ Please enter a valid email address.";
    return;
  }

  if (age < 1 || age > 100) {
    errorMessage.textContent = "⚠️ Please enter a valid age between 1 and 100.";
    return;
  }

  // สร้าง object สำหรับเก็บข้อมูล
  const userData = {
    firstName,
    lastName,
    email,
    age,
    gender: gender.value
  };

  // ดึงข้อมูลเดิมจาก localStorage ถ้ามี
  const users = JSON.parse(localStorage.getItem("registrations")) || [];
  users.push(userData);

  // เก็บกลับลง localStorage
  localStorage.setItem("registrations", JSON.stringify(users));

  errorMessage.textContent = "";


  const notice = document.createElement("div");
notice.textContent = "Registration successful! ";
notice.style.position = "fixed";
notice.style.top = "20px";
notice.style.left = "50%";
notice.style.transform = "translateX(-50%)";
notice.style.background = "#4caf50";
notice.style.color = "white";
notice.style.padding = "10px 20px";
notice.style.borderRadius = "8px";
notice.style.fontWeight = "600";
notice.style.zIndex = "9999";
document.body.appendChild(notice);


setTimeout(() => {
  notice.remove();
  window.location.href = "../html/regis_summary.html";
}, 1000);
  
});