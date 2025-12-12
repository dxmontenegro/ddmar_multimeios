// -----------------------------------------------------------
// 3. LÓGICA DE PAINEL PRINCIPAL E LOGOUT
// -----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página do painel principal
    if (document.body.classList.contains('painel-grid')) {
        const userName = localStorage.getItem('userName');
        const userNivel = localStorage.getItem('userNivel');

        // Se não houver nome de usuário, redireciona para o login por segurança
        if (!userName) {
            window.location.href = 'login.html';
            return;
        }

        // Exibe as informações do usuário
        document.getElementById('userNameDisplay').textContent = userName;
        document.getElementById('userNivelDisplay').textContent = userNivel;
    }
    
    // Configuração do botão de Logout (presente no painel_principal.html)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpa as credenciais salvas
            localStorage.removeItem('userName');
            localStorage.removeItem('userNivel');
            // Redireciona para a página de login
            window.location.href = 'login.html';
        });
    }
});