const ORDEM_DIAS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

function encerrarSessao() {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("index.html");
}

function mostrarErro(mensagem) {
  const erro = document.getElementById("mensagemErro");
  if (!erro) return;
  erro.hidden = false;
  erro.textContent = mensagem;
}

function agruparPorDia(horarios) {
  const grupos = {};

  horarios.forEach((aula) => {
    const dia = aula.dia || "Sem dia";
    if (!grupos[dia]) grupos[dia] = [];
    grupos[dia].push(aula);
  });

  Object.keys(grupos).forEach((dia) => {
    grupos[dia].sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
  });

  return grupos;
}

function montarGrade(horarios) {
  const container = document.getElementById("gradeHorarios");
  if (!container) return;

  if (!horarios || horarios.length === 0) {
    container.innerHTML = "<p>Nenhum horário cadastrado para este aluno.</p>";
    return;
  }

  const grupos = agruparPorDia(horarios);
  const diasOrdenados = Object.keys(grupos).sort((a, b) => {
    const ia = ORDEM_DIAS.indexOf(a);
    const ib = ORDEM_DIAS.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  container.innerHTML = "";

  diasOrdenados.forEach((dia) => {
    const bloco = document.createElement("section");
    bloco.className = "dia-bloco";

    const titulo = document.createElement("h2");
    titulo.textContent = dia;
    bloco.appendChild(titulo);

    grupos[dia].forEach((aula) => {
      const card = document.createElement("article");
      card.className = "aula-card";
      card.innerHTML = `
        <p class="aula-horario">${aula.inicio} – ${aula.fim}</p>
        <p class="aula-disciplina">${aula.disciplina}</p>
        <p class="aula-meta">Professor: ${aula.professor}</p>
        <p class="aula-meta">${aula.sala}</p>
      `;
      bloco.appendChild(card);
    });

    container.appendChild(bloco);
  });
}

function carregarHorarios() {
  const emailLogado = localStorage.getItem("usuarioLogado");

  if (!emailLogado) {
    window.location.replace("index.html");
    return;
  }

  fetch("../dados.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((usuariosDB) => {
      const dados = usuariosDB[emailLogado];

      if (!dados) {
        encerrarSessao();
        return;
      }

      const nomeAluno = document.getElementById("nomeAluno");
      if (nomeAluno) {
        nomeAluno.textContent = dados.nome;
      }

      montarGrade(dados.horarios || []);
    })
    .catch((err) => {
      console.error("Erro ao carregar horários:", err);
      mostrarErro("Não foi possível carregar a grade de horários.");
      const container = document.getElementById("gradeHorarios");
      if (container) container.innerHTML = "";
    });
}

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", encerrarSessao);
}

carregarHorarios();
