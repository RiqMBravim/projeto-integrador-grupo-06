// Verifica se há usuário logado; se não, redireciona para o login
const emailLogado = localStorage.getItem("usuarioLogado");
if (!emailLogado) {
  window.location.href = "index.html";
}

// Elementos do DOM
const studentName = document.getElementById("studentName");
const faltasList = document.getElementById("faltasList");

// Carrega os dados do arquivo JSON
fetch("../dados.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("Não foi possível carregar os dados.");
    }
    return res.json();
  })
  .then(data => {
    const usuario = data[emailLogado];
    if (!usuario) {
      faltasList.innerHTML = "<p>Usuário não encontrado na base.</p>";
      return;
    }

    // Exibe o nome do aluno
    studentName.textContent = usuario.nome;

    // Verifica se o aluno possui disciplinas cadastradas
    if (!usuario.disciplinas || usuario.disciplinas.length === 0) {
      faltasList.innerHTML = "<p>Nenhuma disciplina encontrada para este aluno.</p>";
      return;
    }

    // Para cada disciplina, calcula percentual de presença e situação
    usuario.disciplinas.forEach(disciplina => {
      const cargaHoraria = disciplina.cargaHoraria || 0;
      const faltasHoras = disciplina.faltasHoras || 0;
      const presencaPercentual = cargaHoraria > 0 
        ? ((cargaHoraria - faltasHoras) / cargaHoraria) * 100 
        : 0;

      let situacao = "Aprovado";
      let classeSituacao = "situacao-aprovado";
      if (presencaPercentual < 75) {
        situacao = "Reprovado por faltas";
        classeSituacao = "situacao-reprovado";
      }

      const card = document.createElement("div");
      card.className = "falta-card";
      card.innerHTML = `
        <h3>${disciplina.nome}</h3>
        <div class="falta-detalhe"><span>Carga horária</span><span>${cargaHoraria}h</span></div>
        <div class="falta-detalhe"><span>Faltas</span><span>${faltasHoras}h</span></div>
        <div class="falta-detalhe"><span>Presença</span><span>${presencaPercentual.toFixed(1)}%</span></div>
        <div class="falta-detalhe"><span>Situação</span><span class="${classeSituacao}">${situacao}</span></div>
      `;
      faltasList.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar dados:", err);
    faltasList.innerHTML = "<p>Erro ao carregar as informações de frequência. Tente novamente mais tarde.</p>";
  });