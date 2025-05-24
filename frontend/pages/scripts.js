const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Taxminiy API manzili
let accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
let crudInterface;

document.addEventListener('DOMContentLoaded', function() {
    crudInterface = document.getElementById('crud-interface');

    if (!accessToken) {
        window.location.href = 'sign-in.html';
        return; // Agar token bo'lmasa, qolgan kodni ishga tushirmaslik
    } else {
        // CRUD interfeysini ko'rsatish
        if (crudInterface) {
            crudInterface.style.display = 'block';
        } else {
            console.error("CRUD interfeysi topilmadi!");
        }
        showProjectList();
    }

    // Loyiha qo'shish formasi
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', handleAddProjectFormSubmit);
    }

    // Loyiha tahrirlash formasi
    const editProjectForm = document.getElementById('edit-project-form');
    if (editProjectForm) {
        editProjectForm.addEventListener('submit', handleEditProjectFormSubmit);
    }

    // Birlik qo'shish formasi
    const addUnitForm = document.getElementById('add-unit-form');
    if (addUnitForm) {
        addUnitForm.addEventListener('submit', handleAddUnitFormSubmit);
    }

    // Birlik tahrirlash formasi
    const editUnitForm = document.getElementById('edit-unit-form');
    if (editUnitForm) {
        editUnitForm.addEventListener('submit', handleEditUnitFormSubmit);
    }
});

// Sahifa qismlarini ko'rsatish funksiyalari
function hideAllSections() {
    document.querySelectorAll('#project-list, #unit-list, #project-form, #unit-form, #project-edit-form, #unit-edit-form').forEach(el => el.style.display = 'none');
}

function showProjectList() {
    hideAllSections();
    document.getElementById('project-list').style.display = 'block';
    fetchProjects();
}

function showUnitList() {
    hideAllSections();
    document.getElementById('unit-list').style.display = 'block';
    fetchUnits();
}

function showAddProjectForm() {
    hideAllSections();
    document.getElementById('project-form').style.display = 'block';
    const form = document.getElementById('add-project-form');
    if (form) form.reset();
}

function showAddUnitForm() {
    hideAllSections();
    document.getElementById('unit-form').style.display = 'block';
    const form = document.getElementById('add-unit-form');
    if (form) form.reset();
}

function showEditProjectForm(projectId) {
    hideAllSections();
    document.getElementById('project-edit-form').style.display = 'block';
    fetchProject(projectId);
}

function showEditUnitForm(unitId) {
    hideAllSections();
    document.getElementById('unit-edit-form').style.display = 'block';
    fetchUnit(unitId);
}

// Loyihalar bilan ishlash
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (response.ok) {
            displayProjects(data);
        } else {
            console.error('Loyihalar olishda xatolik:', data);
        }
    } catch (error) {
        console.error('Loyihalar olishda tarmoq xatoligi:', error);
    }
}

function displayProjects(projects) {
    const projectsList = document.getElementById('projects');
    projectsList.innerHTML = '';
    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${project.company_name} (Budget: ${project.budget || 'N/A'}, Completion: ${project.completion || 0}%)</span>
            <div>
                <button class="edit-button" onclick="showEditProjectForm(${project.id})">Tahrirlash</button>
                <button class="delete-button" onclick="deleteProject(${project.id})">O'chirish</button>
            </div>
        `;
        projectsList.appendChild(listItem);
    });
}

async function fetchProject(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('edit_project_id').value = data.id;
            document.getElementById('edit_company_name').value = data.company_name;
            document.getElementById('edit_budget').value = data.budget || '';
            document.getElementById('edit_completion').value = data.completion || 0;
        } else {
            console.error('Loyihani olishda xatolik:', data);
        }
    } catch (error) {
        console.error('Loyihani olishda tarmoq xatoligi:', error);
    }
}

async function handleAddProjectFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            showProjectList();
        } else {
            console.error('Loyiha qo\'shishda xatolik:', data);
        }
    } catch (error) {
        console.error('Loyiha qo\'shishda tarmoq xatoligi:', error);
    }
}

async function handleEditProjectFormSubmit(e) {
    e.preventDefault();
    const projectId = document.getElementById('edit_project_id').value;
    const formData = new FormData(this);
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            showProjectList();
        } else {
            console.error('Loyihani tahrirlashda xatolik:', data);
        }
    } catch (error) {
        console.error('Loyihani tahrirlashda tarmoq xatoligi:', error);
    }
}

async function deleteProject(projectId) {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.ok) {
                showProjectList();
            } else {
                const data = await response.json();
                console.error('Loyihani o\'chirishda xatolik:', data);
            }
        } catch (error) {
            console.error('Loyihani o\'chirishda tarmoq xatoligi:', error);
        }
    }
}

// Birliklar bilan ishlash (xuddi shu funksiyalarning birliklar uchun versiyasi)
async function fetchUnits() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/units/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (response.ok) {
            displayUnits(data);
        } else {
            console.error('Birliklar olishda xatolik:', data);
        }
    } catch (error) {
        console.error('Birliklar olishda tarmoq xatoligi:', error);
    }
}

function displayUnits(units) {
    const unitsList = document.getElementById('units');
    unitsList.innerHTML = '';
    units.forEach(unit => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${unit.nomi} (Raqami: ${unit.birlik_raqami})</span>
            <div>
                <button class="edit-button" onclick="showEditUnitForm(${unit.id})">Tahrirlash</button>
                <button class="delete-button" onclick="deleteUnit(${unit.id})">O'chirish</button>
            </div>
        `;
        unitsList.appendChild(listItem);
    });
}

async function fetchUnit(unitId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/units/${unitId}/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('edit_unit_id').value = data.id;
            document.getElementById('edit_birlik_raqami').value = data.birlik_raqami;
            document.getElementById('edit_nomi').value = data.nomi;
        } else {
            console.error('Birlikni olishda xatolik:', data);
        }
    } catch (error) {
        console.error('Birlikni olishda tarmoq xatoligi:', error);
    }
}

async function handleAddUnitFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch(`http://127.0.0.1:8000/units/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            showUnitList();
        } else {
            console.error('Birlik qo\'shishda xatolik:', data);
        }
    } catch (error) {
        console.error('Birlik qo\'shishda tarmoq xatoligi:', error);
    }
}

async function handleEditUnitFormSubmit(e) {
    e.preventDefault();
    const unitId = document.getElementById('edit_unit_id').value;
    const formData = new FormData(this);
    try {
        const response = await fetch(`${API_BASE_URL}/units/${unitId}/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            showUnitList();
        } else {
            console.error('Birlikni tahrirlashda xatolik:', data);
        }
    } catch (error) {
        console.error('Birlikni tahrirlashda tarmoq xatoligi:', error);
    }
}

async function deleteUnit(unitId) {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/units/${unitId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.ok) {
                showUnitList();
            } else {
                const data = await response.json();
                console.error('Birlikni o\'chirishda xatolik:', data);
            }
        } catch (error) {
            console.error('Birlikni o\'chirishda tarmoq xatoligi:', error);
        }
    }
}

// Cookie olish funksiyasi (oldingi koddan)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}