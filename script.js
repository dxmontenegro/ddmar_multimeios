// ------------------------------------------------------------------
// ARQUIVO: script.js (COMPLETO, ORGANIZADO E ATUALIZADO)
// ------------------------------------------------------------------

// ******** INSERIR SEU URL DE APPS SCRIPT AQUI *********
const URL_DO_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyYC8PqHDtU7NkzUztIB9SptBCbA0lgbWnyscp4C2r1F4CW5Ny6MB35SZCTuhCblI4bgg/exec';
// ******************************************************************

// Variável global — armazena o acervo em cache para buscas rápidas
let acervoDataParaBusca = [];

// Função padrão para exibir mensagens na tela
function exibirMensagem(elementoId, mensagem, cor = 'black') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.style.color = cor;
        elemento.textContent = mensagem;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. LOGIN (index.html)
    // ============================================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;

            exibirMensagem('mensagemErro', 'Verificando credenciais...', '#007bff');

            const dados = new URLSearchParams();
            dados.append('acao', 'login');
            dados.append('usuario', usuario);
            dados.append('senha', senha);

            fetch(URL_DO_APPS_SCRIPT, {
                method: 'POST',
                body: dados
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    exibirMensagem('mensagemErro', 'Acesso permitido! Redirecionando...', 'green');

                    localStorage.setItem('userName', data.nome);
                    localStorage.setItem('userNivel', data.nivel);

                    setTimeout(() => {
                        window.location.href = 'painel_principal.html';
                    }, 1500);
                } else {
                    exibirMensagem('mensagemErro', data.mensagem, 'red');
                }
            })
            .catch(err => {
                console.error(err);
                exibirMensagem('mensagemErro', 'Erro de conexão com o servidor.', 'red');
            });
        });

        const cadastroBtn = document.getElementById('cadastroBtn');
        if (cadastroBtn) cadastroBtn.onclick = () => window.location.href = 'cadastro.html';
    }


    // ============================================================
    // 2. CADASTRO DE USUÁRIO (cadastro.html)
    // ============================================================
    const cadastroForm = document.getElementById('cadastroForm');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const usuario = document.getElementById('novoUsuario').value;
            const senha = document.getElementById('novaSenha').value;
            const confirmar = document.getElementById('confirmarSenha').value;

            if (senha !== confirmar) {
                exibirMensagem('mensagemCadastro', 'As senhas não coincidem.', 'red');
                return;
            }

            exibirMensagem('mensagemCadastro', 'Cadastrando usuário...', '#007bff');

            const dados = new URLSearchParams();
            dados.append('acao', 'cadastro');
            dados.append('usuario', usuario);
            dados.append('senha', senha);

            fetch(URL_DO_APPS_SCRIPT, { method: 'POST', body: dados })
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        exibirMensagem('mensagemCadastro', data.mensagem, 'green');
                        setTimeout(() => window.location.href = "index.html", 2000);
                    } else {
                        exibirMensagem('mensagemCadastro', data.mensagem, 'red');
                    }
                })
                .catch(err => {
                    console.error(err);
                    exibirMensagem('mensagemCadastro', 'Erro ao conectar.', 'red');
                });
        });
    }


    // ============================================================
    // 3. CADASTRO DE ACERVO (cadastro_acervo.html)
    // ============================================================
    const cadastroAcervoForm = document.getElementById('cadastroAcervoForm');

    if (cadastroAcervoForm) {
        cadastroAcervoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            exibirMensagem('mensagemAcervo', 'Enviando dados...', '#007bff');

            const form = new FormData(cadastroAcervoForm);
            form.append('acao', 'cadastroAcervo');

            const dados = new URLSearchParams(form);

            fetch(URL_DO_APPS_SCRIPT, { method: 'POST', body: dados })
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        exibirMensagem('mensagemAcervo', data.mensagem, 'green');
                        cadastroAcervoForm.reset();
                    } else {
                        exibirMensagem('mensagemAcervo', data.mensagem, 'red');
                    }
                })
                .catch(err => {
                    console.error(err);
                    exibirMensagem('mensagemAcervo', 'Erro ao enviar.', 'red');
                });
        });
    }


    // ============================================================
    // FUNÇÃO REUTILIZADA: Buscar Acervo
    // ============================================================
    async function carregarAcervoAPI() {
        try {
            const r = await fetch(`${URL_DO_APPS_SCRIPT}?acao=consultaAcervo`);
            const json = await r.json();
            if (json.status === 'sucesso') return json.dados;
        } catch (err) {
            console.error("Erro carregando acervo:", err);
        }
        return [];
    }


    // ============================================================
    // 4. CONSULTA DE ACERVO (consulta_acervo.html)
    // ============================================================
    const tabelaAcervo = document.getElementById('tabelaAcervo');

    if (tabelaAcervo) {
        const tbody = tabelaAcervo.querySelector('tbody');
        const theadRow = tabelaAcervo.querySelector('thead tr');
        const campoBusca = document.getElementById('campoBusca');
        const mensagemConsulta = document.getElementById('mensagemConsulta');
        const contadorRegistros = document.getElementById('contadorRegistros');

        async function carregar() {
            mensagemConsulta.textContent = "Carregando acervo...";
            acervoDataParaBusca = await carregarAcervoAPI();

            if (acervoDataParaBusca.length === 0) {
                mensagemConsulta.textContent = "Nenhum registro encontrado.";
                return;
            }

            renderizarTabela(acervoDataParaBusca);
        }

        function renderizarTabela(lista) {
            tbody.innerHTML = "";
            theadRow.innerHTML = "";

            const headers = Object.keys(lista[0]);

            headers.forEach(h => {
                const th = document.createElement('th');
                th.textContent = h;
                theadRow.appendChild(th);
            });

            lista.forEach(item => {
                const tr = document.createElement('tr');
                headers.forEach(h => {
                    const td = document.createElement('td');
                    td.textContent = item[h];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            mensagemConsulta.textContent = "";
            contadorRegistros.textContent = "Total: " + lista.length;
        }

        campoBusca.addEventListener('keyup', () => {
            const termo = campoBusca.value.toUpperCase();
            const filtrados = acervoDataParaBusca.filter(item =>
                Object.values(item).some(v => String(v).toUpperCase().includes(termo))
            );
            renderizarTabela(filtrados);
        });

        carregar();
    }


    // ============================================================
    // 5. REGISTRO DE EMPRÉSTIMO (registro_emprestimo.html)
    // ============================================================
    const registroEmprestimoForm = document.getElementById('registroEmprestimoForm');

    if (registroEmprestimoForm) {

        const idField = document.getElementById('idObra');
        const tituloField = document.getElementById('tituloObra');

        carregarAcervoAPI().then(data => acervoDataParaBusca = data);

        idField.addEventListener('input', () => {
            tituloField.value = "";
            const id = idField.value.trim();
            const obra = acervoDataParaBusca.find(o => o.ID == id);

            if (!obra) {
                exibirMensagem('mensagemEmprestimo', 'ID não encontrado.', 'red');
                return;
            }

            tituloField.value = obra.Título;

            if (obra.Status === 'DISPONÍVEL') {
                exibirMensagem('mensagemEmprestimo', 'Obra disponível!', 'green');
            } else {
                exibirMensagem('mensagemEmprestimo', 'Obra indisponível!', 'red');
            }
        });

        registroEmprestimoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const id = idField.value.trim();
            const obra = acervoDataParaBusca.find(o => o.ID == id);

            if (!obra || obra.Status !== 'DISPONÍVEL') {
                exibirMensagem('mensagemEmprestimo', 'ID inválido ou obra indisponível.', 'red');
                return;
            }

            const form = new FormData(registroEmprestimoForm);
            form.append('acao', 'registrarEmprestimo');
            form.append('tituloObra', tituloField.value);

            const dados = new URLSearchParams(form);

            exibirMensagem('mensagemEmprestimo', 'Registrando...', '#007bff');

            fetch(URL_DO_APPS_SCRIPT, { method: 'POST', body: dados })
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        exibirMensagem('mensagemEmprestimo', data.mensagem, 'green');
                        registroEmprestimoForm.reset();
                        carregarAcervoAPI().then(d => acervoDataParaBusca = d);
                    } else {
                        exibirMensagem('mensagemEmprestimo', data.mensagem, 'red');
                    }
                });
        });
    }


    // ============================================================
    // 6. PAINEL PRINCIPAL + LOGOUT
    // ============================================================
    if (document.body.classList.contains('painel-grid')) {
        const user = localStorage.getItem('userName');
        const nivel = localStorage.getItem('userNivel');

        if (!user) {
            window.location.href = "index.html";
            return;
        }

        document.getElementById('userNameDisplay').textContent = user;
        document.getElementById('userNivelDisplay').textContent = nivel;
    }

    const logout = document.getElementById('logoutBtn');
    if (logout) {
        logout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }

}); // FIM DO DOMContentLoaded

