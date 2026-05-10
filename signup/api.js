document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const data = {
    role: document.getElementById('role').value,
    nama: document.getElementById('nama').value.trim(),
    email: document.getElementById('email').value.trim(),
    nim: document.getElementById('nim').value.trim(),
    prodi: document.getElementById('prodi').value,
    angkatan: document.getElementById('angkatan').value,
    password: document.getElementById('password').value
  };

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Mendaftarkan...';

  try {
    const res = await fetch('api/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      btn.textContent = '✓ Berhasil!';
      btn.style.background = '#16a34a';
    } else {
      alert(result.message);
      btn.disabled = false;
      btn.textContent = 'Daftar';
    }

  } catch (err) {
    console.error(err);
    alert('Server error');
    btn.disabled = false;
    btn.textContent = 'Daftar';
  }
});