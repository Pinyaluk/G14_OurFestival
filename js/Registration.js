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
  errorMessage.textContent = ""; 

  
  if (!firstName) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ First name cannot be empty.";
    return;
  }

  if (!lastName) {
   errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Last name cannot be empty.";
    return;
  }

  if (!email) {
   errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Email address is required.";
    return;
  }

  if (!emailPattern.test(email)) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Please enter a valid email address (e.g. example@mail.com).";
    return;
  }

  if (!age) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Please enter your age.";
    return;
  }

  if (isNaN(age) || age < 1 || age > 100) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Age must be a number between 1 and 100.";
    return;
  }

  if (!gender) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ Please select your gender.";
    return;
  }

  if (!terms) {
    errorMessage.className = "error";
    errorMessage.textContent = "⚠️ You must accept the terms before registering.";
    return;
  }


  const userData = {
    firstName,
    lastName,
    email,
    age,
    gender: gender.value
  };


  const users = JSON.parse(localStorage.getItem("registrations")) || [];
  users.push(userData);

  localStorage.setItem("registrations", JSON.stringify(users));

  
  errorMessage.className = "success";
  errorMessage.textContent = "✅ Registration successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "../html/regis_summary.html";
  }, 1200);
});
