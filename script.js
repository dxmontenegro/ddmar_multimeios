

// ******** INSERIR SEU URL DE APPS SCRIPT AQUI *********
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

            const formData = new FormData(cadastroAcervoForm);
            formData.append('acao', 'cadastroAcervo'); 

            const dadosParaEnviar = new URLSearchParams(formData);

            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dadosParaEnviar
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemAcervo', data.mensagem, 'green');
                    cadastroAcervoForm.reset(); 
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
    // 4. LÓGICA DE CONSULTA DE ACERVO (consulta_acervo.html)
    // -----------------------------------------------------------
    const consultaAcervoPage = document.getElementById('tabelaAcervo');
    if (consultaAcervoPage) {
        
        const URL_APPS_SCRIPT_CONSULTA = `${URL_DO_APPS_SCRIPT}?acao=consultaAcervo`; // Usando GET
        const tabela = document.getElementById('tabelaAcervo');
        const tbody = tabela.querySelector('tbody');
        const theadRow = tabela.querySelector('thead tr');
        const mensagemConsulta = document.getElementById('mensagemConsulta');
        const campoBusca = document.getElementById('campoBusca');
        const contadorRegistros = document.getElementById('contadorRegistros');

        let dadosAcervo = []; // Armazena todos os dados para a busca

        function carregarAcervo() {
            mensagemConsulta.textContent = 'Carregando dados...';
            mensagemConsulta.style.display = 'block';
            
            fetch(URL_APPS_SCRIPT_CONSULTA)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso' && data.dados) {
                    dadosAcervo = data.dados;
                    renderizarTabela(dadosAcervo);
                    mensagemConsulta.style.display = 'none';
                } else {
                    mensagemConsulta.textContent = data.mensagem || 'Erro ao carregar dados do Acervo.';
                    mensagemConsulta.style.display = 'block';
                    tbody.innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Erro de rede na consulta:', error);
                mensagemConsulta.textContent = 'Erro de conexão ou URL Apps Script inválido.';
                mensagemConsulta.style.display = 'block';
                tbody.innerHTML = '';
            });
        }

        function renderizarTabela(dados) {
            tbody.innerHTML = '';
            theadRow.innerHTML = '';

            if (dados.length === 0) {
                mensagemConsulta.textContent = 'Nenhum registro encontrado no Acervo.';
                mensagemConsulta.style.display = 'block';
                contadorRegistros.textContent = 'Total: 0';
                return;
            }

            // 1. Criar Cabeçalhos
            const cabecalhos = Object.keys(dados[0]);
            cabecalhos.forEach(chave => {
                const th = document.createElement('th');
                th.textContent = chave;
                theadRow.appendChild(th);
            });

            // 2. Popular o Corpo da Tabela
            dados.forEach(item => {
                const tr = document.createElement('tr');
                cabecalhos.forEach(chave => {
                    const td = document.createElement('td');
                    
                    // Formatação para datas
                    let valor = item[chave];
                    if (valor && typeof valor === 'string' && !isNaN(Date.parse(valor))) {
                       // Tenta formatar string de data
                       td.textContent = new Date(valor).toLocaleDateString('pt-BR');
                    } else if (item[chave] instanceof Date) {
                        td.textContent = item[chave].toLocaleDateString('pt-BR');
                    } else {
                        td.textContent = valor;
                    }

                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            
            contadorRegistros.textContent = `Total: ${dados.length}`;
            mensagemConsulta.style.display = 'none';
        }

        // 3. Lógica de Busca (Filtro)
        campoBusca.addEventListener('keyup', () => {
            const termo = campoBusca.value.toUpperCase();
            
            const resultadosFiltrados = dadosAcervo.filter(item => {
                return Object.values(item).some(valor => {
                    return String(valor).toUpperCase().includes(termo);
                });
            });
            
            renderizarTabela(resultadosFiltrados);
        });

        // Carrega os dados quando a página for carregada
        carregarAcervo();
    }


    // -----------------------------------------------------------
    // 5. LÓGICA DE PAINEL E LOGOUT (painel_principal.html)
    // -----------------------------------------------------------

    if (document.body.classList.contains('painel-grid')) {
        const userName = localStorage.getItem('userName');
        const userNivel = localStorage.getItem('userNivel');

        if (!userName) {
            window.location.href = 'index.html'; 
            return;
        }

        // Verifica se os elementos existem antes de tentar definir o textContent
        const nameDisplay = document.getElementById('userNameDisplay');
        const nivelDisplay = document.getElementById('userNivelDisplay');
        
        if (nameDisplay) nameDisplay.textContent = userName;
        if (nivelDisplay) nivelDisplay.textContent = userNivel;
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




