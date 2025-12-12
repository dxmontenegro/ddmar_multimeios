

document.addEventListener('DOMContentLoaded', () => {
    // ... (restante da lógica de login) ...
    
    // Ação para o botão de Cadastro na tela de login
    const cadastroBtn = document.getElementById('cadastroBtn');
    if (cadastroBtn) {
        cadastroBtn.addEventListener('click', () => {
            // CORRIGIDO: Redireciona para o cadastro.html
            window.location.href = 'cadastro.html'; 
        });
    }

    // ... (o restante do bloco document.addEventListener do login) ...
});


// ... (a lógica de Cadastro) ...

const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    // ... (restante da lógica de cadastro) ...

    .then(data => {
        if (data.status === 'sucesso') {
            exibirMensagem('mensagemCadastro', data.mensagem + ' Retornando ao Login...', 'green');
            setTimeout(() => {
                // CORRIGIDO: Volta para a nova página inicial index.html
                window.location.href = 'index.html'; 
            }, 2000);
        } else {
            // ...
        }
    })
    // ...
}


// ... (a lógica de Painel e Logout, no final do arquivo) ...

    // Configuração do botão de Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userName');
            localStorage.removeItem('userNivel');
            // CORRIGIDO: Redireciona para a nova página inicial index.html
            window.location.href = 'index.html'; 
        });
    }
});

