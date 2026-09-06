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

function buscarDadosUsuario() {
  const emailLogado = localStorage.getItem("usuarioLogado");
  if (!emailLogado) return Promise.reject("Usuário não logado");

  return fetch("../dados.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => data[emailLogado]);
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

  if (btn && modal && close) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
    });

    close.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") modal.style.display = "none";
    });
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (loginError) loginError.textContent = "";
    if (identificadorCampo) identificadorCampo.removeAttribute("aria-invalid");
    if (senhaCampo) senhaCampo.removeAttribute("aria-invalid");

    const identificadorInput = identificadorCampo.value.trim().toLowerCase();
    const senhaInput = senhaCampo.value;

    fetch("../dados.json")
      .then((res) => res.json())
      .then((usuariosDB) => {
        const cpfDigitado = normalizarCpf(identificadorInput);
        const pareceEmail = identificadorInput.includes("@");

        const usuario = Object.values(usuariosDB).find((item) => {
          const emailUsuario = String(item.email || "").trim().toLowerCase();
          const cpfUsuario = normalizarCpf(item.cpf);
          return emailUsuario === identificadorInput || (!pareceEmail && cpfDigitado.length > 0 && cpfUsuario === cpfDigitado);
        });

        if (!usuario || usuario.senha !== senhaInput) {
          if (loginError) loginError.textContent = "E-mail/CPF ou senha inválidos.";
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
        if (loginError) loginError.textContent = "Não foi possível realizar o login. Tente novamente.";
      });
  });
}

// =============================
// Dashboard / Validação da Sessão
// =============================

const studentName = document.getElementById("studentName");

if (studentName) {
  buscarDadosUsuario()
    .then((dados) => {
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
      montarAvisos(dados.avisos || []);

      const studentEmail = document.getElementById("studentEmail");
      if (studentEmail) {
        studentEmail.textContent = dados.email;
        studentEmail.href = "mailto:" + dados.email;
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar dados do dashboard:", err);
      preencherTexto("studentName", "Não foi possível carregar seus dados.");
    });
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

    let situacao = "Aprovado";
    let classeSituacao = "situacao-aprovado";

    if (media < 4) {
      situacao = "Reprovado";
      classeSituacao = "situacao-reprovado";
    } else if (media < 7) {
      situacao = "Recuperação";
      classeSituacao = "situacao-recuperacao";
    }

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
// Menu Retrátil
// =============================

const menuBtn = document.getElementById("menuBtn");
const sidebarMenu = document.getElementById("sidebarMenu");

if (menuBtn && sidebarMenu) {
  menuBtn.addEventListener("click", () => {
    sidebarMenu.classList.toggle("active");
  });
}

// =============================
// Navegação por Abas
// =============================

let notasCarregadas = false;
let faltasCarregadas = false;

function abrirAba(abaId) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".sidebar-buttons .btn-action").forEach((btn) => btn.classList.remove("active"));

  const abaAlvo = document.getElementById(abaId);
  if (abaAlvo) {
    abaAlvo.classList.add("active");
  } else {
    console.error(`Aba com ID "${abaId}" não encontrada.`);
    return;
  }

  const mapaBotoes = {
    "tabInicio": "btnInicio",
    "tabEditar": "btnEditar",
    "tabHistorico": "btnHistorico",
    "tabNotas": "btnNotas",
    "tabFaltas": "btnFaltas"
  };

  const idBotao = mapaBotoes[abaId];
  if (idBotao) {
    const btnAtivo = document.getElementById(idBotao);
    if (btnAtivo) btnAtivo.classList.add("active");
  }

  if (abaId === "tabNotas" && !notasCarregadas) {
    carregarNotas();
    notasCarregadas = true;
  } else if (abaId === "tabFaltas" && !faltasCarregadas) {
    carregarFaltas();
    faltasCarregadas = true;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.abrirAba = abrirAba;

// =============================
// Carregamento de Notas
// =============================

function carregarNotas() {
  const container = document.getElementById("notasContainer");
  if (!container) return;

  buscarDadosUsuario()
    .then((usuario) => {
      if (!usuario || !usuario.disciplinas || usuario.disciplinas.length === 0) {
        container.innerHTML = "<p>Nenhuma disciplina encontrada.</p>";
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

      container.innerHTML = html;
    })
    .catch((err) => {
      console.error("Erro ao carregar notas:", err);
      container.innerHTML = "<p>Erro ao carregar as notas. Tente novamente mais tarde.</p>";
    });
}

// =============================
// Carregamento de Faltas
// =============================

function carregarFaltas() {
  const container = document.getElementById("faltasContainer");
  if (!container) return;

  buscarDadosUsuario()
    .then((usuario) => {
      if (!usuario || !usuario.disciplinas || usuario.disciplinas.length === 0) {
        container.innerHTML = "<p>Nenhuma disciplina encontrada.</p>";
        return;
      }

      let html = "";
      usuario.disciplinas.forEach((disciplina) => {
        const cargaHoraria = disciplina.cargaHoraria || 0;
        const faltasHoras = disciplina.faltasHoras || 0;
        const presencaPercentual = cargaHoraria > 0 ? ((cargaHoraria - faltasHoras) / cargaHoraria) * 100 : 0;

        let situacao = "Aprovado";
        let classeSituacao = "situacao-aprovado";
        if (presencaPercentual < 75) {
          situacao = "Reprovado por faltas";
          classeSituacao = "situacao-reprovado";
        }

        html += `
          <div class="falta-card">
            <h3>${disciplina.nome}</h3>
            <div class="falta-detalhe"><span>Carga horária</span><span>${cargaHoraria}h</span></div>
            <div class="falta-detalhe"><span>Faltas</span><span>${faltasHoras}h</span></div>
            <div class="falta-detalhe"><span>Presença</span><span>${presencaPercentual.toFixed(1)}%</span></div>
            <div class="falta-detalhe"><span>Situação</span><span class="${classeSituacao}">${situacao}</span></div>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch((err) => {
      console.error("Erro ao carregar faltas:", err);
      container.innerHTML = "<p>Erro ao carregar as informações de frequência. Tente novamente mais tarde.</p>";
    });
}

// =============================
// Logout
// =============================

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", encerrarSessao);
}

// =============================
// Seção de Avisos
// =============================

function montarAvisos(avisos) {
  const container = document.getElementById("avisosContainer");
  const badge = document.getElementById("badgeAvisos");

  if (!container) return;

  container.innerHTML = "";

  if (!avisos || avisos.length === 0) {
    container.innerHTML = "<p class='sub-text'>Nenhum aviso disponível no momento.</p>";
    if (badge) badge.style.display = "none";
    return;
  }

  const naoLidosCount = avisos.filter((a) => !a.lido).length;
  atualizarBadgeAvisos(naoLidosCount);

  avisos.forEach((aviso, index) => {
    const card = document.createElement("div");
    card.className = `aviso-card ${aviso.lido ? "lido" : "nao-lido"}`;

    card.innerHTML = `
      <div class="aviso-header-info">
        <h4>${aviso.titulo}</h4>
        <span class="aviso-data">${aviso.data}</span>
      </div>
      <p>${aviso.conteudo}</p>
      ${
        !aviso.lido
          ? `<button class="btn-marcar-lido" onclick="alternarLido(this, ${index})">Marcar como lido</button>`
          : `<span class="sub-text" style="font-size: 11px;">✓ Lido</span>`
      }
    `;

    container.appendChild(card);
  });
}

function alternarLido(btnElement) {
  const card = btnElement.closest(".aviso-card");
  if (card) {
    card.classList.remove("nao-lido");
    card.classList.add("lido");
  }

  btnElement.outerHTML = `<span class="sub-text" style="font-size: 11px;">✓ Lido</span>`;

  const badge = document.getElementById("badgeAvisos");
  if (badge) {
    let countAtual = parseInt(badge.textContent) || 0;
    if (countAtual > 0) {
      atualizarBadgeAvisos(countAtual - 1);
    }
  }
}

window.alternarLido = alternarLido;

function atualizarBadgeAvisos(count) {
  const badge = document.getElementById("badgeAvisos");
  if (!badge) return;

  if (count > 0) {
    badge.textContent = `${count} não lido${count > 1 ? "s" : ""}`;
    badge.style.display = "inline-block";
  } else {
    badge.textContent = "0 não lidos";
    badge.style.display = "none";
  }
}