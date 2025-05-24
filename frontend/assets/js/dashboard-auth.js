document.addEventListener('DOMContentLoaded', function() {
  const accessToken = localStorage.getItem('access') || sessionStorage.getItem('access');
  const signInLink = document.querySelector('a[href="../pages/sign-in.html"]');
  const signUpLink = document.querySelector('a[href="../pages/sign-up.html"]');
  const profileLink = document.getElementById('hello');

  if (accessToken) {
    if (signInLink) signInLink.parentElement.style.display = 'none';
    if (signUpLink) signUpLink.parentElement.style.display = 'none';

    fetch('http://127.0.0.1:8000/api/user/blok/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Xatolik');
      return response.json();
    })
    .then(userData => {
      if (profileLink) {
        profileLink.querySelector('.nav-link-text').textContent = userData.username;
        const iconDiv = profileLink.querySelector('.icon');
        if (iconDiv) {
          iconDiv.innerHTML = `
            <img src="${userData.avatar || '../assets/img/default-avatar.png'}" 
                 style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">
          `;
        }
      }
    })
    .catch(error => {
      console.error('API xatosi:', error);
      localStorage.removeItem('access');
      sessionStorage.removeItem('access');
      window.location.href = '../pages/sign-in.html';
    });

  } else {
    if (profileLink) profileLink.parentElement.style.display = 'none';
  }
});

document.addEventListener('click', function(e) {
  if (e.target.closest('#logout-btn')) {
    e.preventDefault();
    localStorage.removeItem('access');
    sessionStorage.removeItem('access');
    window.location.href = '../pages/sign-in.html';
  }
});
