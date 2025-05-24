// static/js/api.js
document.addEventListener('DOMContentLoaded', function () {
  fetch('http://127.0.0.1:8000/units/')  // API endpointingiz shu bo‘lishi kerak
    .then(response => response.json())
    .then(data => {
      const total = data.length;

      // Demo uchun ratingni random yoki siz belgilagan tartibda o‘ylab topish mumkin
      let positive = 0;
      let neutral = 0;
      let negative = 0;

      // Keling, shunchaki birlik raqamiga qarab taqsimlaymiz (demo sifatida)
      data.forEach(unit => {
        if (unit.birlik_raqami.endsWith('1') || unit.birlik_raqami.endsWith('2')) {
          positive++;
        } else if (unit.birlik_raqami.endsWith('3') || unit.birlik_raqami.endsWith('4')) {
          neutral++;
        } else {
          negative++;
        }
      });

      const posPercent = Math.round((positive / total) * 100);
      const neuPercent = Math.round((neutral / total) * 100);
      const negPercent = Math.round((negative / total) * 100);

      document.getElementById('pos-percent').innerText = `${posPercent}%`;
      document.getElementById('neu-percent').innerText = `${neuPercent}%`;
      document.getElementById('neg-percent').innerText = `${negPercent}%`;

      document.getElementById('pos-bar').style.width = `${posPercent}%`;
      document.getElementById('neu-bar').style.width = `${neuPercent}%`;
      document.getElementById('neg-bar').style.width = `${negPercent}%`;
    })
    .catch(error => console.error('API error:', error));
});

let chartLines = null;

function renderChart(data) {
  const ctx = document.getElementById('chart-lines').getContext('2d');

  // Agar avvalgi chart mavjud bo'lsa, uni yo'q qilamiz
  if (chartLines) {
    chartLines.destroy();
  }

  chartLines = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function fetchAndRenderUnits() {
  fetch('http://localhost:8000/units/')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Ma'lumotni chart uchun formatlaymiz
      const chartData = {
        labels: data.map(unit => unit.nomi),
        datasets: [{
          label: 'Birlik raqami uzunligi',
          data: data.map(unit => unit.birlik_raqami.length),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }]
      };
      renderChart(chartData);
    })
    .catch(err => {
      console.error('API dan ma\'lumot olishda xatolik:', err);
    });
}

// Sahifa to‘liq yuklanganda ishga tushadi
document.addEventListener('DOMContentLoaded', fetchAndRenderUnits);

// lannn
document.addEventListener("DOMContentLoaded", function () {
  fetchProjects();
  fetchOrders();
});

function fetchProjects() {
  fetch('http://127.0.0.1:8000/api/projects')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Projects data is not an array:", data);
        return;
      }

      const tbody = document.querySelector('#projects-table tbody');
      const summary = document.getElementById('projects-summary');
      tbody.innerHTML = '';
      let completedCount = 0;

      const baseUrl = "http://127.0.0.1:8000";

      data.forEach(project => {
        const imageUrl = project.image ? `${project.image}` : 'default-logo.png';

        const members = (project.members || []).map(member => `
          <a href="javascript:;" class="avatar avatar-xs rounded-circle" title="${member.name}">
            <img src="${imageUrl}" alt="${member.name}">
          </a>`).join('');

        if (project.completion === 100) completedCount++;

        tbody.innerHTML += `
          <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div><img src="${imageUrl}" class="avatar avatar-sm me-3" alt="${project.company_name}"></div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">${project.company_name}</h6>
                </div>
              </div>
            </td>
            <td><div class="avatar-group mt-2">${members}</div></td>
            <td class="text-center"><span class="text-xs font-weight-bold">$${project.budget}</span></td>
            <td>
              <div class="progress-wrapper w-75 mx-auto">
                <div class="progress-info">
                  <div class="progress-percentage">
                    <span class="text-xs font-weight-bold">${project.completion}%</span>
                  </div>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-gradient-${project.completion == 100 ? 'success' : 'info'}" role="progressbar" style="width: ${project.completion}%;" aria-valuenow="${project.completion}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </td>
          </tr>`;
      });

      summary.innerHTML = `<i class="fa fa-check text-info" aria-hidden="true"></i> <span class="font-weight-bold ms-1">${completedCount} done</span> this month`;
    })
    .catch(error => console.error("Error fetching projects:", error));
}

function fetchProjects() {
  fetch('http://127.0.0.1:8000/api/projects')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Projects data is not an array:", data);
        return;
      }

      const tbody = document.querySelector('#projects-table tbody');
      const summary = document.getElementById('projects-summary');
      const ordersTimeline = document.getElementById('orders-timeline');
      const ordersSummary = document.getElementById('orders-summary');

      tbody.innerHTML = '';
      ordersTimeline.innerHTML = '';

      let completedCount = 0;
      let totalOrders = 0;

      data.forEach(project => {
        const imageUrl = project.image ? `${project.image}` : 'default-logo.png';
        const members = (project.members || []).map(member => `
          <a href="javascript:;" class="avatar avatar-xs rounded-circle" title="${member.name}">
            <img src="${imageUrl}" alt="${member.name}">
          </a>`).join('');

        if (project.completion === 100) completedCount++;
        totalOrders++;

        // Projects jadvali
        tbody.innerHTML += `
          <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div><img src="${imageUrl}" class="avatar avatar-sm me-3" alt="${project.company_name}"></div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">${project.company_name}</h6>
                </div>
              </div>
            </td>
            <td><div class="avatar-group mt-2">${members}</div></td>
            <td class="text-center"><span class="text-xs font-weight-bold">$${project.budget}</span></td>
            <td>
              <div class="progress-wrapper w-75 mx-auto">
                <div class="progress-info">
                  <div class="progress-percentage">
                    <span class="text-xs font-weight-bold">${project.completion}%</span>
                  </div>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-gradient-${project.completion == 100 ? 'success' : 'info'}" role="progressbar" style="width: ${project.completion}%;" aria-valuenow="${project.completion}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </td>
          </tr>`;

        // Orders overviewga yozish
        ordersTimeline.innerHTML += `
          <div class="timeline-block mb-3">
            <span class="timeline-step">
              <i class="ni ni-bag-17 text-${project.completion == 100 ? 'success' : 'info'}"></i>
            </span>
            <div class="timeline-content">
              <h6 class="text-dark text-sm font-weight-bold mb-0">${project.company_name}</h6>
              <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">Budget: $${project.budget} — ${project.completion}% done</p>
            </div>
          </div>`;
      });

      summary.innerHTML = `<i class="fa fa-check text-info" aria-hidden="true"></i> <span class="font-weight-bold ms-1">${completedCount} done</span> this month`;
      ordersSummary.innerHTML = `${totalOrders} projects overviewed`;
    })
    .catch(error => console.error("Error fetching projects:", error));
}

document.addEventListener('DOMContentLoaded', function() {
  // Token borligini tekshirish
  const accessToken = localStorage.getItem('access') || sessionStorage.getItem('access');
  const signInLink = document.querySelector('a[href="../pages/sign-in.html"]');
  const signUpLink = document.querySelector('a[href="../pages/sign-up.html"]');
  const profileLink = document.getElementById('hello');

  if (accessToken) {
    // Agar token bor bo'lsa
    if (signInLink) signInLink.parentElement.style.display = 'none';
    if (signUpLink) signUpLink.parentElement.style.display = 'none';
    
    // User ma'lumotlarini olish
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
      // Profil linkini yangilash
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
    // Agar token yo'q bo'lsa
    if (profileLink) profileLink.parentElement.style.display = 'none';
  }
});

// Chiqish funksiyasi (agar logout tugmasi bo'lsa)
document.addEventListener('click', function(e) {
  if (e.target.closest('#logout-btn')) {
    e.preventDefault();
    localStorage.removeItem('access');
    sessionStorage.removeItem('access');
    window.location.href = '../pages/sign-in.html';
  }
});