// =============================
// Funções auxiliares
// =============================

function normalizarCpf(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function preencherTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento && valor !== undefined && valor !== null) {
    elemento.textContent = valor;
  }
}

function encerrarSessao() {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("index.html");
}


// =============================
// Login
// =============================

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

if (loginForm) {
  const modal = document.getElementById("supportModal");
  const btn = document.getElementById("openModal");
  const close = document.getElementById("closeModal");
  const identificadorCampo = document.getElementById("email");
  const senhaCampo = document.getElementById("senha");

  // Modal de suporte
  if (btn && modal && close) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
    });

    close.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (loginError) {
      loginError.textContent = "";
    }

    if (identificadorCampo) {
      identificadorCampo.removeAttribute("aria-invalid");
    }

    if (senhaCampo) {
      senhaCampo.removeAttribute("aria-invalid");
    }

    const identificadorInput = identificadorCampo.value.trim().toLowerCase();
    const senhaInput = senhaCampo.value;

    fetch("../dados.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Falha ao carregar dados: HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((usuariosDB) => {
        const cpfDigitado = normalizarCpf(identificadorInput);
        const pareceEmail = identificadorInput.includes("@");

        const usuario = Object.values(usuariosDB).find((item) => {
          const emailUsuario = String(item.email || "").trim().toLowerCase();
          const cpfUsuario = normalizarCpf(item.cpf);

          const emailConfere = emailUsuario === identificadorInput;
          const cpfConfere = !pareceEmail && cpfDigitado.length > 0 && cpfUsuario === cpfDigitado;

          return emailConfere || cpfConfere;
        });

        if (!usuario || usuario.senha !== senhaInput) {
          if (loginError) {
            loginError.textContent = "E-mail/CPF ou senha inválidos.";
          }

          identificadorCampo.setAttribute("aria-invalid", "true");
          senhaCampo.setAttribute("aria-invalid", "true");
          senhaCampo.value = "";
          senhaCampo.focus();
          return;
        }

        localStorage.setItem("usuarioLogado", usuario.email.toLowerCase());
        window.location.assign("dashboard.html");
      })
      .catch((err) => {
        console.error("Erro ao realizar login:", err);

        if (loginError) {
          loginError.textContent = "Não foi possível realizar o login. Tente novamente.";
        }
      });
  });
}


// =============================
// Dashboard / validação da sessão
// =============================

const studentName = document.getElementById("studentName");

if (studentName) {
  const emailLogado = localStorage.getItem("usuarioLogado");

  if (!emailLogado) {
    window.location.replace("index.html");
  } else {
    fetch("../dados.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Falha ao carregar dados: HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((usuariosDB) => {
        const dados = usuariosDB[emailLogado];

        // Um valor no localStorage não é suficiente: o usuário precisa existir na base.
        if (!dados) {
          encerrarSessao();
          return;
        }

        preencherTexto("studentName", dados.nome);
        preencherTexto("studentBirth", dados.nascimento);
        preencherTexto("studentCpf", dados.cpf);
        preencherTexto("studentCourse", dados.curso);
        preencherTexto("studentPeriod", dados.periodo);
        preencherTexto("docStatus", dados.docStatus);
        preencherTexto("courseStatus", dados.courseStatus);
        montarHistorico(dados.disciplinas);

        const studentEmail = document.getElementById("studentEmail");
        if (studentEmail) {
          studentEmail.textContent = dados.email;
          studentEmail.href = "mailto:" + dados.email;
        }
      })
      .catch((err) => {
        // Falha de carregamento não significa que a credencial ficou inválida.
        // Mantemos a sessão e exibimos um estado de erro, evitando loop de redirecionamento.
        console.error("Erro ao carregar dados do dashboard:", err);
        preencherTexto("studentName", "Não foi possível carregar seus dados.");
      });
  }
}

// =============================
// Montagem do Histórico Escolar
// =============================

function montarHistorico(disciplinas) {
  const container = document.getElementById("studentHistory");
  if (!container) return;

  container.innerHTML = "";

  if (!disciplinas || disciplinas.length === 0) {
    container.innerHTML = "<p>Nenhuma disciplina cursada até o momento.</p>";
    return;
  }

  disciplinas.forEach((disciplina) => {
    const av1 = disciplina.notas?.av1 ?? 0;
    const av2 = disciplina.notas?.av2 ?? 0;
    const media = (av1 + av2) / 2;
    const situacao = media >= 7 ? "Aprovado" : "Reprovado";
    const classeSituacao = situacao === "Aprovado" ? "situacao-aprovado" : "situacao-reprovado";

    const card = document.createElement("div");
    card.className = "historico-card";
    card.innerHTML = `
      <h3>${disciplina.nome}</h3>
      <div class="historico-detalhe"><span>Carga horária</span><span>${disciplina.cargaHoraria}h</span></div>
      <div class="historico-detalhe"><span>Média final</span><span>${media.toFixed(2)}</span></div>
      <div class="historico-detalhe"><span>Situação</span><span class="${classeSituacao}">${situacao}</span></div>
    `;
    container.appendChild(card);
  });
}

// =============================
// Menu retrátil
// =============================

const menuBtn = document.getElementById("menuBtn");
const sidebarMenu = document.getElementById("sidebarMenu");

if (menuBtn && sidebarMenu) {
  menuBtn.addEventListener("click", () => {
    sidebarMenu.classList.toggle("active");
  });
}


// =============================
// Navegação de abas
// =============================

const btnInicio = document.getElementById("btnInicio");
const btnEditar = document.getElementById("btnEditar");
const btnHistorico = document.getElementById("btnHistorico");
const btnNotas = document.getElementById("btnNotas");
const btnFaltas = document.getElementById("btnFaltas");
const tabs = document.querySelectorAll(".tab-content");

function abrirAba(abaId) {
  tabs.forEach((tab) => tab.classList.remove("active"));

  const abaAlvo = document.getElementById(abaId);
  if (abaAlvo) {
    abaAlvo.classList.add("active");
  }
}

if (btnInicio) btnInicio.addEventListener("click", () => abrirAba("tabInicio"));
if (btnEditar) btnEditar.addEventListener("click", () => abrirAba("tabEditar"));
if (btnHistorico) btnHistorico.addEventListener("click", () => abrirAba("tabHistorico"));
if (btnNotas) btnNotas.addEventListener("click", () => abrirAba("tabNotas"));
if (btnFaltas) btnFaltas.addEventListener("click", () => abrirAba("tabFaltas"));

// =============================
// Carregamento de Notas na Aba
// =============================

let notasCarregadas = false;
const notasContainer = document.getElementById("notasContainer");

if (btnNotas && notasContainer) {
  btnNotas.addEventListener("click", () => {
    abrirAba("tabNotas");
    if (!notasCarregadas) {
      carregarNotas();
      notasCarregadas = true;
    }
  });
}

function carregarNotas() {
  const emailLogado = localStorage.getItem("usuarioLogado");
  if (!emailLogado) return;

  fetch("../dados.json")
    .then((res) => {
      if (!res.ok) throw new Error(`Falha ao carregar dados: HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const usuario = data[emailLogado];
      if (!usuario || !usuario.disciplinas || usuario.disciplinas.length === 0) {
        notasContainer.innerHTML = "<p>Nenhuma disciplina encontrada.</p>";
        return;
      }

      let html = "";
      usuario.disciplinas.forEach((disciplina) => {
        const av1 = disciplina.notas?.av1 ?? 0;
        const av2 = disciplina.notas?.av2 ?? 0;
        const media = (av1 + av2) / 2;

        let situacao = "Aprovado";
        let classeSituacao = "situacao-aprovado";
        if (media < 4) {
          situacao = "Reprovado";
          classeSituacao = "situacao-reprovado";
        } else if (media < 7) {
          situacao = "Recuperação";
          classeSituacao = "situacao-recuperacao";
        }

        html += `
          <div class="nota-card">
            <h3>${disciplina.nome}</h3>
            <div class="nota-detalhe"><span>AV1</span><span>${av1.toFixed(1)}</span></div>
            <div class="nota-detalhe"><span>AV2</span><span>${av2.toFixed(1)}</span></div>
            <div class="nota-detalhe"><span>Média</span><span>${media.toFixed(2)}</span></div>
            <div class="nota-detalhe"><span>Situação</span><span class="${classeSituacao}">${situacao}</span></div>
          </div>
        `;
      });

      notasContainer.innerHTML = html;
    })
    .catch((err) => {
      console.error("Erro ao carregar notas:", err);
      notasContainer.innerHTML = "<p>Erro ao carregar as notas. Tente novamente mais tarde.</p>";
    });
}

// =============================
// Logout
// =============================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    encerrarSessao();
  });
}
