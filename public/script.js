/* ============ CONFIGURAÇÕES ============ */
const API_URL = `${window.location.protocol}//${window.location.host}`;
const TOKEN_KEY = 'authToken';
const USER_ID_KEY = 'userId';

/* ============ CACHE DE ELEMENTOS DO DOM ============ */
const DOM = {
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    userInfo: document.getElementById('userInfo'),
    profileContent: document.getElementById('profileContent'),
    logoutBtn: document.getElementById('logoutBtn'),
    activityBtn: document.getElementById('activityBtn'),
    loginMessage: document.getElementById('loginMessage'),
    registerMessage: document.getElementById('registerMessage')
};

/* ============ INICIALIZAÇÃO ============ */
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkUserStatus();
});

/* ============ EVENT LISTENERS ============ */
function setupEventListeners() {
    DOM.loginForm?.addEventListener('submit', handleLogin);
    DOM.registerForm?.addEventListener('submit', handleRegister);
    
    DOM.tabButtons.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    DOM.logoutBtn?.addEventListener('click', handleLogout);
    DOM.activityBtn?.addEventListener('click', goToActivity);
}

/* ============ TAB SWITCHING ============ */
function switchTab(e) {
    const target = e.target.closest('.tab-btn');
    if (!target) return;
    
    const tabName = target.dataset.tab;
    if (!tabName) {
        console.error('Tab name not found');
        return;
    }

    // Remove active de todos os tabs
    DOM.tabButtons.forEach(btn => btn.classList.remove('active'));
    DOM.tabContents.forEach(content => content.classList.remove('active'));

    // Adiciona active ao tab clicado
    target.classList.add('active');
    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Carregar perfil se logado
    if (tabName === 'profile' && isUserLoggedIn()) {
        loadUserProfile();
    }
}

/* ============ LOGIN ============ */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageDiv = DOM.loginMessage;

    // Validação básica
    if (!email || !password) {
        showMessage(messageDiv, 'Por favor, preencha todos os campos', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageDiv, 'Email inválido', 'warning');
        return;
    }

    try {
        const button = DOM.loginForm.querySelector('button');
        setButtonLoading(button, true);
        showMessage(messageDiv, '', '');

        const response = await fetch(`${API_URL}/auth/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('🔍 Login Response:', data);

        if (response.ok && data.token) {
            // Armazenar dados
            const userId = data._id || data.id || email;
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_ID_KEY, userId);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', data.name || email.split('@')[0]);

            showMessage(messageDiv, '✓ ' + (data.msg || 'Login realizado com sucesso!'), 'success');
            DOM.loginForm.reset();

            // Atualizar UI
            setTimeout(() => {
                checkUserStatus();
            }, 800);
        } else {
            showMessage(messageDiv, '✗ ' + (data.msg || 'Erro ao fazer login'), 'error');
        }

    } catch (err) {
        console.error('Login Error:', err);
        showMessage(messageDiv, '✗ Erro ao conectar com o servidor', 'error');
    } finally {
        setButtonLoading(DOM.loginForm.querySelector('button'), false);
    }
}

/* ============ REGISTRAR ============ */
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const messageDiv = DOM.registerMessage;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
        showMessage(messageDiv, 'Por favor, preencha todos os campos', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageDiv, 'Email inválido', 'warning');
        return;
    }

    if (password.length < 6) {
        showMessage(messageDiv, 'A senha deve ter no mínimo 6 caracteres', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(messageDiv, 'As senhas não coincidem', 'warning');
        return;
    }

    try {
        const button = DOM.registerForm.querySelector('button');
        setButtonLoading(button, true);
        showMessage(messageDiv, '', '');

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, '✓ ' + data.msg + '! Faça login agora', 'success');
            DOM.registerForm.reset();

            setTimeout(() => {
                switchToLoginTab();
            }, 1500);
        } else {
            showMessage(messageDiv, '✗ ' + (data.msg || 'Erro ao registrar'), 'error');
        }

    } catch (err) {
        console.error('Register Error:', err);
        showMessage(messageDiv, '✗ Erro ao conectar com o servidor', 'error');
    } finally {
        setButtonLoading(DOM.registerForm.querySelector('button'), false);
    }
}

/* ============ LOGOUT ============ */
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        clearUserData();
        checkUserStatus();
        switchToLoginTab();
    }
}

/* ============ CARREGAR PERFIL ============ */
function loadUserProfile() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || !userName || !userEmail) {
        displayProfileError('⚠️ Você precisa estar logado para acessar seu perfil.');
        return;
    }

    displayUserProfile({
        name: userName,
        email: userEmail
    });
}

/* ============ EXIBIR PERFIL ============ */
function displayUserProfile(user = {}) {
    const userName = (user && user.name) || localStorage.getItem('userName') || 'Usuário';
    const userEmail = (user && user.email) || localStorage.getItem('userEmail') || '-';
    
    DOM.profileContent.innerHTML = `
        <div class="profile-card">
            <h2>Bem-vindo!</h2>
            <p id="profileUserName">Usuário: <strong>${escapeHtml(userName)}</strong></p>
            <p id="profileUserEmail">Email: <strong>${escapeHtml(userEmail)}</strong></p>
        </div>
    `;
}

function displayProfileError(message) {
    DOM.profileContent.innerHTML = `
        <div class="message warning show">
            ${message}
        </div>
    `;
}

/* ============ VERIFICAR STATUS DO USUÁRIO ============ */
function checkUserStatus() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (token && userId) {
        DOM.userInfo?.classList.remove('hidden');
        
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        const userNameEl = document.querySelector('#userName strong');
        const userEmailEl = document.querySelector('#userEmail strong');
        
        if (userNameEl) userNameEl.textContent = escapeHtml(userName || 'Usuário');
        if (userEmailEl) userEmailEl.textContent = escapeHtml(userEmail || '-');
    } else {
        DOM.userInfo?.classList.add('hidden');
        if (DOM.profileContent) {
            DOM.profileContent.innerHTML = '';
        }
    }
}

/* ============ REDIRECIONAR PARA ATIVIDADES ============ */
function goToActivity() {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
        alert('Você precisa estar logado para acessar as atividades');
        return;
    }
    
    window.location.href = 'activity.html';
}

/* ============ FUNÇÕES AUXILIARES ============ */

function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type}`;
    
    if (message) {
        element.classList.add('show');
    } else {
        element.classList.remove('show');
    }
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Aguarde...' : (button.dataset.text || 'Entrar');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isUserLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
}

function switchToLoginTab() {
    const loginTab = document.querySelector('[data-tab="login"]');
    if (loginTab) {
        loginTab.click();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function clearUserData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
}