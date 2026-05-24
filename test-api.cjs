const axios = require('axios');

async function test(payload) {
  try {
    const res = await axios.post('https://salto-be.aauaah.tech/api/register', payload);
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test({
  username: 'raya',
  userName: 'raya',
  fullname: 'araya',
  fullName: 'araya',
  email: 'raya@fk.id',
  password: 'password123',
  passwordConfirm: 'password123',
  password_confirmation: 'password123',
  role: 'student',
  roleId: 1,
  isStudent: true,
  nim: '421386002',
  angkatan: '2024',
  batch: '2024',
  intakeDate: '2024-09-01',
  intakeYear: '2024',
  prodi: 'D4-Bisnis Digital',
  major: 'D4-Bisnis Digital',
  field: 'D4-Bisnis Digital',
  campus: 'Telkom University',
  campusName: 'Telkom University',
  degree: 'D4'
});
