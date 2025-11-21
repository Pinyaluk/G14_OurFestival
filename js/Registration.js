
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  // same validation messages / rules as original
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(msg){
    errorMessage.className = "error";
    errorMessage.textContent = msg;
  }
  function showSuccess(msg){
    errorMessage.className = "success";
    errorMessage.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // ป้องกัน double-submit (เช่น double click หรือ listener ถูกเรียกซ้ำ)
    if (submitBtn.dataset.sending === '1') return;
    submitBtn.dataset.sending = '1';
    submitBtn.disabled = true;

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.querySelector("input[name='gender']:checked");
    const terms = document.getElementById("terms").checked;

    errorMessage.textContent = "";

    
    if (!firstName) { showError("⚠️ First name cannot be empty."); resetBtn(); return; }
    if (!lastName)  { showError("⚠️ Last name cannot be empty."); resetBtn(); return; }
    if (!email)     { showError("⚠️ Email address is required."); resetBtn(); return; }
    if (!emailPattern.test(email)) { showError("⚠️ Please enter a valid email address (e.g. example@mail.com)."); resetBtn(); return; }
    if (!age)       { showError("⚠️ Please enter your age."); resetBtn(); return; }
    if (isNaN(age) || age < 1 || age > 100) { showError("⚠️ Age must be a number between 1 and 100."); resetBtn(); return; }
    if (!gender)    { showError("⚠️ Please select your gender."); resetBtn(); return; }
    if (!terms)     { showError("⚠️ You must accept the terms before registering."); resetBtn(); return; }

    const userData = {
      firstName,
      lastName,
      email,
      age,
      gender: gender.value
    };

    
    try {
      const users = JSON.parse(localStorage.getItem("registrations")) || [];
      users.push(userData);
      localStorage.setItem("registrations", JSON.stringify(users));
    } catch (err) {
      console.warn('localStorage write failed', err);
    }

   
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      gender: gender ? gender.value : ''
    };

    fetch('server/submit-registration.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(j => {
      if (!j.ok) console.warn('Server rejected registration', j);
    }).catch(e => {
      console.warn('Could not send to server', e);
    });

    
    showSuccess("✅ Registration successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "server/regis_summary.php";
    }, 1200);

    function resetBtn(){
      submitBtn.dataset.sending = '0';
      submitBtn.disabled = false;
    }
  });
});
