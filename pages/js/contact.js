// AksaraLoka - contact.js

function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('successMsg').classList.remove('hidden');
  document.getElementById('contactForm').reset();
  setTimeout(() => document.getElementById('successMsg').classList.add('hidden'), 5000);
}
