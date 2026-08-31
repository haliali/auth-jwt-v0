const TOKEN_KEY = 'authToken';
const USER_ID_KEY = 'userId';
const API_URL = `${window.location.protocol}//${window.location.host}`;

document.addEventListener('DOMContentLoaded', () => {
    checkUserStatus();
    loadActivities();
    setupActivityListeners();
});

function setupActivityListeners() {
    const backBtn = document.getElementById('backBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function checkUserStatus() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (token && userId) {
        const userInfo = document.getElementById('userInfo');
        userInfo.classList.remove('hidden');
        
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        document.querySelector('#userName strong').textContent = userName || 'Usuário';
        document.querySelector('#userEmail strong').textContent = userEmail || '-';
    } else {
        window.location.href = 'index.html';
    }
}

async function loadActivities() {
    const activityList = document.getElementById('activityList');
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
        activityList.innerHTML = '<p class="error">Erro: Token não encontrado</p>';
        return;
    }

    try {
        // Simular dados de atividade (você pode integrar com uma API real)
        const activities = [
            { date: new Date().toLocaleString('pt-BR'), action: 'Login realizado' },
            { date: new Date(Date.now() - 3600000).toLocaleString('pt-BR'), action: 'Perfil visualizado' }
        ];

        if (activities.length === 0) {
            activityList.innerHTML = '<p class="info-text">Nenhuma atividade registrada</p>';
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-date">${activity.date}</div>
                <div class="activity-action">${activity.action}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        activityList.innerHTML = '<p class="error">Erro ao carregar atividades</p>';
    }
}

function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
}