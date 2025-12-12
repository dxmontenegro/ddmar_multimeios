
// Por favor, use o URL gerado na sua ÚLTIMA NOVA IMPLANTAÇÃO (DEPLOY)
const URL_DO_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyYC8PqHDtU7NkzUztIB9SptBCbA0lgbWnyscp4C2r1F4CW5Ny6MB35SZCTuhCblI4bgg/exec'; 
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
    // 1. LÓGICA DE LOGIN (index.html)
    // -----------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            
            exibirMensagem('mensagemErro', 'Verificando credenciais...', '#007bff'); 

            const dadosParaEnviar = new URLSearchParams();
            dadosParaEnviar.append('acao', 'login'); 
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
                        window.location.href = 'painel_principal.html'; 
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

        const cadastroBtn = document.getElementById('cadastroBtn');
        if (cadastroBtn) {
            cadastroBtn.addEventListener('click', () => {
                window.location.href = 'cadastro.html'; 
            });
        }
    }


    // -----------------------------------------------------------
    // 2. LÓGICA DE CADASTRO DE USUÁRIO (cadastro.html)
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
            
            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dadosParaEnviar
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemCadastro', data.mensagem + ' Retornando ao Login...', 'green');
                    setTimeout(() => {
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
    // 3. LÓGICA DE CADASTRO DE ACERVO (cadastro_acervo.html)
    // -----------------------------------------------------------
    const cadastroAcervoForm = document.getElementById('cadastroAcervoForm');
    if (cadastroAcervoForm) {
        cadastroAcervoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            exibirMensagem('mensagemAcervo', 'Enviando dados da obra...', '#007bff');

            // Cria o objeto de dados usando FormData
            const formData = new FormData(cadastroAcervoForm);
            
            // Adiciona a ação específica para o Apps Script
            formData.append('acao', 'cadastroAcervo'); 

            // Converte FormData para URLSearchParams para o Apps Script
            const dadosParaEnviar = new URLSearchParams(formData);

            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dadosParaEnviar
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemAcervo', data.mensagem, 'green');
                    cadastroAcervoForm.reset(); // Limpa o formulário após o sucesso
                } else {
                    exibirMensagem('mensagemAcervo', data.mensagem, 'red');
                }
            })
            .catch(error => {
                console.error('Erro de rede no Acervo:', error);
                exibirMensagem('mensagemAcervo', 'Erro de conexão. Verifique sua rede.', 'red');
            });
        });
    }


    // -----------------------------------------------------------
    // 4. LÓGICA DE PAINEL E LOGOUT (painel_principal.html)
    // -----------------------------------------------------------

    // Lógica para o painel_principal.html 
    if (document.body.classList.contains('painel-grid')) {
        const userName = localStorage.getItem('userName');
        const userNivel = localStorage.getItem('userNivel');

        // Proteção de rota: Redireciona se não estiver logado
        if (!userName) {
            window.location.href = 'index.html'; 
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
            window.location.href = 'index.html'; 
        });
    }
});

