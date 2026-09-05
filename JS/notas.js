// Verifica se há usuário logado; se não, redireciona para o login
const emailLogado = localStorage.getItem("usuarioLogado");
if (!emailLogado) {
  window.location.href = "index.html";
}

// Elementos do DOM
const studentName = document.getElementById("studentName");
const notasList = document.getElementById("notasList");

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
      notasList.innerHTML = "<p>Usuário não encontrado na base.</p>";
      return;
    }

    // Exibe o nome do aluno
    studentName.textContent = usuario.nome;

    // Verifica se o aluno possui disciplinas cadastradas
    if (!usuario.disciplinas || usuario.disciplinas.length === 0) {
      notasList.innerHTML = "<p>Nenhuma disciplina encontrada para este aluno.</p>";
      return;
    }

    // Para cada disciplina, calcula média e situação e cria um card
    usuario.disciplinas.forEach(disciplina => {
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
      card.className = "nota-card";
      card.innerHTML = `
        <h3>${disciplina.nome}</h3>
        <div class="nota-detalhe"><span>AV1</span><span>${av1.toFixed(1)}</span></div>
        <div class="nota-detalhe"><span>AV2</span><span>${av2.toFixed(1)}</span></div>
        <div class="nota-detalhe"><span>Média</span><span>${media.toFixed(2)}</span></div>
        <div class="nota-detalhe"><span>Situação</span><span class="${classeSituacao}">${situacao}</span></div>
      `;
      notasList.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar dados:", err);
    notasList.innerHTML = "<p>Erro ao carregar as notas. Tente novamente mais tarde.</p>";
  });