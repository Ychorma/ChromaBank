// ==============================
// CAMPOS
// ==============================

const cpfInput = document.querySelector('input[type="text"]');
const senhaInput = document.getElementById("senha");
const mostrarSenha = document.getElementById("mostrarSenha");
const btnLogin = document.querySelector(".btn-login");

// ==============================
// MOSTRAR / OCULTAR SENHA
// ==============================

mostrarSenha.addEventListener("click", () => {

    if (senhaInput.type === "password") {

        senhaInput.type = "text";

        mostrarSenha.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';

    } else {

        senhaInput.type = "password";

        mostrarSenha.innerHTML =
            '<i class="fa-regular fa-eye"></i>';
    }

});

// ==============================
// MÁSCARA CPF
// ==============================

cpfInput.addEventListener("input", () => {

    let cpf = cpfInput.value.replace(/\D/g, "");

    cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    cpf = cpf.replace(/\.(\d{3})(\d)/, ".$1-$2");

    cpfInput.value = cpf;

});

// ==============================
// VALIDAÇÃO SIMPLES
// ==============================

btnLogin.addEventListener("click", (e) => {

    e.preventDefault();

    const cpf = cpfInput.value.replace(/\D/g, "");
    const senha = senhaInput.value.trim();

    if (cpf === "") {

        alert("Digite seu CPF.");

        cpfInput.focus();

        return;
    }

    if (cpf.length !== 11) {

        alert("CPF inválido.");

        cpfInput.focus();

        return;
    }

    if (senha === "") {

        alert("Digite sua senha.");

        senhaInput.focus();

        return;
    }

    // Animação do botão

    btnLogin.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Entrando...
    `;

    btnLogin.disabled = true;

 setTimeout(() => {

    sessionStorage.setItem(
        "chromaBankLoggedIn",
        "true"
    );

    sessionStorage.setItem(
        "chromaBankCPF",
        cpfInput.value
    );

    window.location.href =
        "../dashboard/dashboard.html";

}, 1800);

});

// ==============================
// ENTER PARA ENTRAR
// ==============================

document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        btnLogin.click();

    }

});

// ==============================
// ANIMAÇÃO DOS INPUTS
// ==============================

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {

    input.addEventListener("focus", () => {

        input.parentElement.style.transform = "scale(1.02)";

    });

    input.addEventListener("blur", () => {

        input.parentElement.style.transform = "scale(1)";

    });
// ==================================================
// CHROMABANK - LOGIN
// Arquivo: login.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    const cpf = document.getElementById("cpf");
    const senha = document.getElementById("senha");

    const mostrarSenha = document.getElementById("mostrarSenha");

    // ===============================================
    // MOSTRAR / OCULTAR SENHA
    // ===============================================

    if (mostrarSenha) {

        mostrarSenha.addEventListener("click", () => {

            if (senha.type === "password") {

                senha.type = "text";
                mostrarSenha.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

            } else {

                senha.type = "password";
                mostrarSenha.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

            }

        });

    }

    // ===============================================
    // LOGIN
    // ===============================================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const cpfDigitado = cpf.value.trim();
        const senhaDigitada = senha.value.trim();

        if (cpfDigitado === "") {

            alert("Digite seu CPF.");
            cpf.focus();
            return;

        }

        if (senhaDigitada === "") {

            alert("Digite sua senha.");
            senha.focus();
            return;

        }

        // ===========================================
        // SIMULAÇÃO DE LOGIN
        // ===========================================

        sessionStorage.setItem("chromaBankLoggedIn", "true");

        sessionStorage.setItem("chromaBankCPF", cpfDigitado);

        // Redireciona para a Dashboard

        window.location.href = "./dashboard/dashboard.html";

    });

});
});