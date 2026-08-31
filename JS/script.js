
const loginForm = document.querySelector(".login-card form");


//Modal de suporte e login 
if (loginForm) {
  const modal = document.getElementById("supportModal");
  const btn = document.getElementById("openModal");
  const close = document.getElementById("closeModal");

  
  if (btn && modal && close) {
    btn.onclick = (e) => { e.preventDefault(); modal.style.display = "flex"; };
    close.onclick = () => { modal.style.display = "none"; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
  }

  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const userInput = document.getElementById("email").value.trim().toLowerCase();

    fetch("../dados.json")
      .then(res => res.json())
      .then(usuariosDB => {
        if (usuariosDB[userInput]) {
          localStorage.setItem("usuarioLogado", userInput);
          window.location.href = "dashboard.html";
        } else {
          alert("Usuário não encontrado na base da secretaria.");
        }
      })
      .catch(err => {
        console.error("Erro ao carregar dados:", err);
        alert("Certifique-se de estar usando o Live Server para ler o arquivo JSON.");
      });
  };
}

//Carregamento do dashboard

const studentName = document.getElementById("studentName");

if (studentName) {
  const emailLogado = localStorage.getItem("usuarioLogado");

  if (!emailLogado) {
    window.location.href = "index.html";
  } else {
    fetch("../dados.json")
      .then(res => res.json())
      .then(usuariosDB => {
        const dados = usuariosDB[emailLogado];

        if (dados) {
          document.getElementById("studentName").textContent = dados.nome;
          document.getElementById("studentBirth").textContent = dados.nascimento;
          document.getElementById("studentCpf").textContent = dados.cpf;
          document.getElementById("studentEmail").textContent = dados.email;
          document.getElementById("studentEmail").href = "mailto:" + dados.email;
          document.getElementById("studentCourse").textContent = dados.curso;
          document.getElementById("studentPeriod").textContent = dados.periodo;
          document.getElementById("docStatus").textContent = dados.docStatus;
          document.getElementById("courseStatus").textContent = dados.courseStatus;
          document.getElementById("studentHistory").textContent = dados.historico;
        }
      })
      .catch(err => console.error("Erro ao carregar dados no dashboard:", err));
  }
}


// Menu retrátil
const menuBtn = document.getElementById("menuBtn");
const sidebarMenu = document.getElementById("sidebarMenu");

if (menuBtn && sidebarMenu) {
  menuBtn.onclick = function() {
    sidebarMenu.classList.toggle("active");
  };
}
// Navegação de abas
const btnInicio = document.getElementById("btnInicio");
const btnEditar = document.getElementById("btnEditar");
const btnHistorico = document.getElementById("btnHistorico");
const btnFaltas = document.getElementById("btnFaltas");

const tabs = document.querySelectorAll(".tab-content");

function abrirAba(abaId) {
  tabs.forEach(tab => tab.classList.remove("active"));
  const abaAlvo = document.getElementById(abaId);
  if (abaAlvo) abaAlvo.classList.add("active");
}

if (btnInicio) btnInicio.onclick = () => abrirAba("tabInicio");
if (btnEditar) btnEditar.onclick = () => abrirAba("tabEditar");
if (btnHistorico) btnHistorico.onclick = () => abrirAba("tabHistorico");
if (btnFaltas) btnFaltas.onclick = () => abrirAba("tabFaltas");

//Logout

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.onclick = function() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  };
}