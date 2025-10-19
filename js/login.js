document.addEventListener("DOMContentLoaded", function() {
  console.log("✅ JS Loaded & DOM Ready");

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    
    if (email === "" || password === "") {
      alert("Please fill in fields");
      return;
    }

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailPattern)) {
      alert("Please enter a valid email address.");
      return;
    }

    
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.match(passwordPattern)) {
      alert("Password must be at least 8 characters long and include both letters and numbers.");
      return;
    }

    alert("Login successful!");
  });
});