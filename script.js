// ------------------------------------------------------------------
// ARQUIVO: script.js
// SALVAR COMO: script.js
// ------------------------------------------------------------------

// ******** IMPORTANTE: SUBSTITUA ESTE URL PELO SEU URL REAL *********
const URL_DO_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbwQunEQ4RLfKsCaG4ZVkYVtj57NPCs8nZ2mKAJxIgNlMSwp8JlBHB2xJRHgIbjs8g6Q/exec'; 
// Use o URL do seu deploy!
// ******************************************************************

// Função genérica para exibir mensagens na tela
function exibirMensagem(elementoId, mensagem, cor) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.style.color = cor;
        elemento.textContent = mensagem;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------------
    // 1. LÓGICA DE LOGIN (Usado no index.html)
    // -----------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            
            exibirMensagem('mensagemErro', 'Verificando credenciais...', '#007bff'); 

            const dadosParaEnviar = new URLSearchParams();
            dadosParaEnviar.append('acao', 'login'); // Define a ação para o Apps Script
            dadosParaEnviar.append('usuario', usuario);
            dadosParaEnviar.append('senha', senha);

            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dadosParaEnviar
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemErro', `Bem-vindo(a), ${data.nome} (${data.nivel}). Redirecionando...`, 'green');
                    
                    localStorage.setItem('userNivel', data.nivel);
                    localStorage.setItem('userName', data.nome);
                    
                    setTimeout(() => {
                        window.location.href = 'painel_principal.html'; // REDIRECIONA APÓS SUCESSO
                    }, 1500);
                    
                } else {
                    exibirMensagem('mensagemErro', data.mensagem, 'red');
                }
            })
            .catch(error => {
                console.error('Erro de rede:', error);
                exibirMensagem('mensagemErro', 'Erro de conexão. Verifique sua rede.', 'red');
            });
        });

        // Ação para o botão de Cadastro na tela de login
        const cadastroBtn = document.getElementById('cadastroBtn');
        if (cadastroBtn) {
            cadastroBtn.addEventListener('click', () => {
                // CORRIGIDO: Redireciona para o arquivo de cadastro
                window.location.href = 'cadastro.html'; 
            });
        }
    }


    // -----------------------------------------------------------
    // 2. LÓGICA DE CADASTRO (Usado no cadastro.html)
    // -----------------------------------------------------------
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const usuario = document.getElementById('novoUsuario').value;
            const senha = document.getElementById('novaSenha').value;
            const senhaConfirmacao = document.getElementById('confirmarSenha').value;

            if (senha !== senhaConfirmacao) {
                exibirMensagem('mensagemCadastro', 'As senhas não coincidem!', 'red');
                return;
            }

            exibirMensagem('mensagemCadastro', 'Tentando cadastrar novo usuário...', '#007bff');

            const dadosParaEnviar = new URLSearchParams();
            dadosParaEnviar.append('acao', 'cadastro'); 
            dadosParaEnviar.append('usuario', usuario);
            dadosParaEnviar.append('senha', senha);
            dadosParaEnviar.append('senhaConfirmacao', senhaConfirmacao);

            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dadosParaEnviar
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemCadastro', data.mensagem + ' Retornando ao Login...', 'green');
                    setTimeout(() => {
                        // CORRIGIDO: Volta para a nova página inicial index.html
                        window.location.href = 'index.html'; 
                    }, 2000);
                } else {
                    exibirMensagem('mensagemCadastro', data.mensagem, 'red');
                }
            })
            .catch(error => {
                console.error('Erro de rede:', error);
                exibirMensagem('mensagemCadastro', 'Erro de conexão. Tente novamente.', 'red');
            });
        });
    }


    // -----------------------------------------------------------
    // 3. LÓGICA DE PAINEL PRINCIPAL E LOGOUT (Para futura página painel_principal.html)
    // -----------------------------------------------------------

    // Verifica se estamos na página do painel principal
    if (document.body.classList.contains('painel-grid')) {
        const userName = localStorage.getItem('userName');
        const userNivel = localStorage.getItem('userNivel');

        if (!userName) {
            window.location.href = 'index.html'; // Redireciona se não estiver logado
            return;
        }

        document.getElementById('userNameDisplay').textContent = userName;
        document.getElementById('userNivelDisplay').textContent = userNivel;
    }
    
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
