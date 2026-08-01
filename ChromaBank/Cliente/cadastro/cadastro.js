// ==================================================
// CHORMABANK — CADASTRO EM ETAPAS
// Arquivo: cadastro.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    if (!form) return;

    const formSteps = document.querySelectorAll(".form-step");
    const stepIndicators = document.querySelectorAll("[data-step-indicator]");
    const stepLines = document.querySelectorAll(".step-line");

    const nextButtons = document.querySelectorAll("[data-next-step]");
    const previousButtons = document.querySelectorAll("[data-previous-step]");

    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");

    const senhaInput = document.getElementById("senhaCadastro");
    const confirmarSenhaInput = document.getElementById("confirmarSenha");

    const passwordToggleButtons = document.querySelectorAll(
        "[data-password-toggle]"
    );

    const termosInput = document.getElementById("termos");
    const termsError = document.getElementById("termsError");

    let currentStep = 1;

    // ==================================================
    // EXIBIÇÃO DAS ETAPAS
    // ==================================================

    function showStep(stepNumber) {

        currentStep = stepNumber;

        formSteps.forEach((step) => {

            const stepValue = Number(step.dataset.step);
            const isActive = stepValue === stepNumber;

            step.hidden = !isActive;
            step.classList.toggle("active", isActive);

        });

        stepIndicators.forEach((indicator) => {

            const indicatorStep = Number(
                indicator.dataset.stepIndicator
            );

            indicator.classList.remove("active", "completed");

            if (indicatorStep === stepNumber) {
                indicator.classList.add("active");
            }

            if (indicatorStep < stepNumber) {
                indicator.classList.add("completed");
            }

        });

        stepLines.forEach((line, index) => {

            line.classList.toggle(
                "completed",
                index < stepNumber - 1
            );

        });

        const activeStep = document.querySelector(
            `.form-step[data-step="${stepNumber}"]`
        );

        const firstField = activeStep?.querySelector(
            "input:not([type='checkbox']), select"
        );

        if (firstField && window.innerWidth > 650) {
            setTimeout(() => firstField.focus(), 150);
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (stepNumber === 5) {
            updateReview();
        }
    }

    // ==================================================
    // MENSAGENS DE ERRO
    // ==================================================

    function setFieldError(field, message) {

        const inputGroup = field.closest(".input-group");

        if (!inputGroup) return;

        const errorElement = inputGroup.querySelector(
            ".error-message"
        );

        inputGroup.classList.add("invalid");
        inputGroup.classList.remove("valid");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function setFieldValid(field) {

        const inputGroup = field.closest(".input-group");

        if (!inputGroup) return;

        const errorElement = inputGroup.querySelector(
            ".error-message"
        );

        inputGroup.classList.remove("invalid");
        inputGroup.classList.add("valid");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function clearFieldState(field) {

        const inputGroup = field.closest(".input-group");

        if (!inputGroup) return;

        const errorElement = inputGroup.querySelector(
            ".error-message"
        );

        inputGroup.classList.remove("invalid", "valid");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    function validateName(field) {

        const value = field.value.trim();

        if (value.length < 5) {
            setFieldError(
                field,
                "Digite seu nome completo."
            );

            return false;
        }

        if (!value.includes(" ")) {
            setFieldError(
                field,
                "Informe nome e sobrenome."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateCPF(field) {

        const cpf = field.value.replace(/\D/g, "");

        if (cpf.length !== 11) {
            setFieldError(
                field,
                "Digite um CPF com 11 números."
            );

            return false;
        }

        if (/^(\d)\1{10}$/.test(cpf)) {
            setFieldError(
                field,
                "Digite um CPF válido."
            );

            return false;
        }

        let sum = 0;

        for (let index = 0; index < 9; index++) {
            sum += Number(cpf[index]) * (10 - index);
        }

        let firstDigit = (sum * 10) % 11;

        if (firstDigit === 10) {
            firstDigit = 0;
        }

        if (firstDigit !== Number(cpf[9])) {
            setFieldError(
                field,
                "Digite um CPF válido."
            );

            return false;
        }

        sum = 0;

        for (let index = 0; index < 10; index++) {
            sum += Number(cpf[index]) * (11 - index);
        }

        let secondDigit = (sum * 10) % 11;

        if (secondDigit === 10) {
            secondDigit = 0;
        }

        if (secondDigit !== Number(cpf[10])) {
            setFieldError(
                field,
                "Digite um CPF válido."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateBirthDate(field) {

        if (!field.value) {
            setFieldError(
                field,
                "Informe sua data de nascimento."
            );

            return false;
        }

        const birthDate = new Date(
            `${field.value}T00:00:00`
        );

        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDifference =
            today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        if (birthDate > today) {
            setFieldError(
                field,
                "A data não pode estar no futuro."
            );

            return false;
        }

        if (age < 18) {
            setFieldError(
                field,
                "Você precisa ter pelo menos 18 anos."
            );

            return false;
        }

        if (age > 120) {
            setFieldError(
                field,
                "Confira a data informada."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateEmail(field) {

        const email = field.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(email)) {
            setFieldError(
                field,
                "Digite um e-mail válido."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validatePhone(field) {

        const phone = field.value.replace(/\D/g, "");

        if (phone.length !== 11) {
            setFieldError(
                field,
                "Digite um celular com DDD."
            );

            return false;
        }

        if (phone[2] !== "9") {
            setFieldError(
                field,
                "Digite um número de celular válido."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateCEP(field) {

        const cep = field.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            setFieldError(
                field,
                "Digite um CEP com 8 números."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateRequiredText(field, message) {

        if (field.value.trim().length < 2) {
            setFieldError(field, message);
            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validateSelect(field) {

        if (!field.value) {
            setFieldError(
                field,
                "Selecione uma opção."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function getPasswordRequirements(password) {

        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    }

    function validatePassword(field) {

        const password = field.value;
        const requirements = getPasswordRequirements(password);

        const isValid = Object.values(
            requirements
        ).every(Boolean);

        if (!isValid) {
            setFieldError(
                field,
                "A senha ainda não cumpre todos os requisitos."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    function validatePasswordConfirmation(field) {

        if (!field.value) {
            setFieldError(
                field,
                "Confirme sua senha."
            );

            return false;
        }

        if (field.value !== senhaInput.value) {
            setFieldError(
                field,
                "As senhas não são iguais."
            );

            return false;
        }

        setFieldValid(field);
        return true;
    }

    // ==================================================
    // VALIDAÇÃO DE CADA ETAPA
    // ==================================================

    function validateStep(stepNumber) {

        let isValid = true;

        if (stepNumber === 1) {

            const nome = document.getElementById("nome");
            const nascimento =
                document.getElementById("nascimento");

            if (!validateName(nome)) {
                isValid = false;
            }

            if (!validateCPF(cpfInput)) {
                isValid = false;
            }

            if (!validateBirthDate(nascimento)) {
                isValid = false;
            }
        }

        if (stepNumber === 2) {

            const email = document.getElementById("email");

            if (!validateEmail(email)) {
                isValid = false;
            }

            if (!validatePhone(telefoneInput)) {
                isValid = false;
            }
        }

        if (stepNumber === 3) {

            const estado = document.getElementById("estado");
            const rua = document.getElementById("rua");
            const numero = document.getElementById("numero");
            const cidade = document.getElementById("cidade");

            if (!validateCEP(cepInput)) {
                isValid = false;
            }

            if (!validateSelect(estado)) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    rua,
                    "Informe o nome da rua."
                )
            ) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    numero,
                    "Informe o número."
                )
            ) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    cidade,
                    "Informe sua cidade."
                )
            ) {
                isValid = false;
            }
        }

        if (stepNumber === 4) {

            if (!validatePassword(senhaInput)) {
                isValid = false;
            }

            if (
                !validatePasswordConfirmation(
                    confirmarSenhaInput
                )
            ) {
                isValid = false;
            }
        }

        if (!isValid) {

            const firstInvalidField =
                document.querySelector(
                    `.form-step[data-step="${stepNumber}"] ` +
                    ".input-group.invalid input, " +
                    `.form-step[data-step="${stepNumber}"] ` +
                    ".input-group.invalid select"
                );

            firstInvalidField?.focus();
        }

        return isValid;
    }

    // ==================================================
    // BOTÕES DE NAVEGAÇÃO
    // ==================================================

    nextButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (!validateStep(currentStep)) return;

            if (currentStep < formSteps.length) {
                showStep(currentStep + 1);
            }
        });
    });

    previousButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // ==================================================
    // MÁSCARAS
    // ==================================================

    function applyCPFMask(value) {

        return value
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function applyPhoneMask(value) {

        const digits = value
            .replace(/\D/g, "")
            .slice(0, 11);

        if (digits.length <= 10) {
            return digits
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }

        return digits
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }

    function applyCEPMask(value) {

        return value
            .replace(/\D/g, "")
            .slice(0, 8)
            .replace(/(\d{5})(\d)/, "$1-$2");
    }

    cpfInput?.addEventListener("input", () => {

        cpfInput.value = applyCPFMask(
            cpfInput.value
        );

        clearFieldState(cpfInput);
    });

    telefoneInput?.addEventListener("input", () => {

        telefoneInput.value = applyPhoneMask(
            telefoneInput.value
        );

        clearFieldState(telefoneInput);
    });

    cepInput?.addEventListener("input", () => {

        cepInput.value = applyCEPMask(
            cepInput.value
        );

        clearFieldState(cepInput);
    });

    // ==================================================
    // MOSTRAR E OCULTAR SENHA
    // ==================================================

    passwordToggleButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.passwordToggle;

            const input =
                document.getElementById(targetId);

            if (!input) return;

            const isPassword =
                input.type === "password";

            input.type = isPassword
                ? "text"
                : "password";

            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
            );

            button.innerHTML = isPassword
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';
        });
    });

    // ==================================================
    // REQUISITOS DA SENHA EM TEMPO REAL
    // ==================================================

    function updatePasswordRequirements() {

        const password = senhaInput.value;
        const requirements =
            getPasswordRequirements(password);

        Object.entries(requirements).forEach(
            ([requirement, isValid]) => {

                const item = document.querySelector(
                    `[data-requirement="${requirement}"]`
                );

                if (!item) return;

                item.classList.toggle(
                    "valid",
                    isValid
                );

                item.innerHTML = `
                    <i class="${
                        isValid
                            ? "fa-solid fa-circle-check"
                            : "fa-regular fa-circle"
                    }"></i>
                    ${getRequirementText(requirement)}
                `;
            }
        );
    }

    function getRequirementText(requirement) {

        const texts = {
            length: "Pelo menos 8 caracteres",
            uppercase: "Uma letra maiúscula",
            number: "Um número",
            special: "Um caractere especial"
        };

        return texts[requirement];
    }

    senhaInput?.addEventListener(
        "input",
        () => {

            updatePasswordRequirements();
            clearFieldState(senhaInput);

            if (confirmarSenhaInput.value) {
                validatePasswordConfirmation(
                    confirmarSenhaInput
                );
            }
        }
    );

    confirmarSenhaInput?.addEventListener(
        "input",
        () => {

            clearFieldState(confirmarSenhaInput);
        }
    );

    // ==================================================
    // LIMPAR ERRO AO DIGITAR
    // ==================================================

    const fields = form.querySelectorAll(
        "input, select"
    );

    fields.forEach((field) => {

        if (
            field === cpfInput ||
            field === telefoneInput ||
            field === cepInput ||
            field === senhaInput ||
            field === confirmarSenhaInput
        ) {
            return;
        }

        field.addEventListener("input", () => {
            clearFieldState(field);
        });

        field.addEventListener("change", () => {
            clearFieldState(field);
        });
    });

    // ==================================================
    // REVISÃO DOS DADOS
    // ==================================================

    function formatBirthDate(value) {

        if (!value) return "—";

        const [year, month, day] =
            value.split("-");

        return `${day}/${month}/${year}`;
    }

    function updateReview() {

        const nome =
            document.getElementById("nome").value.trim();

        const nascimento =
            document.getElementById("nascimento").value;

        const email =
            document.getElementById("email").value.trim();

        const telefone =
            document.getElementById("telefone").value.trim();

        const rua =
            document.getElementById("rua").value.trim();

        const numero =
            document.getElementById("numero").value.trim();

        const complemento =
            document.getElementById("complemento").value.trim();

        const cidade =
            document.getElementById("cidade").value.trim();

        const estado =
            document.getElementById("estado").value;

        const cep =
            document.getElementById("cep").value.trim();

        document.getElementById(
            "reviewNome"
        ).textContent = nome || "—";

        document.getElementById(
            "reviewCpf"
        ).textContent = cpfInput.value || "—";

        document.getElementById(
            "reviewNascimento"
        ).textContent =
            nascimento
                ? `Nascimento: ${formatBirthDate(nascimento)}`
                : "—";

        document.getElementById(
            "reviewEmail"
        ).textContent = email || "—";

        document.getElementById(
            "reviewTelefone"
        ).textContent = telefone || "—";

        const addressParts = [
            rua && `${rua}, ${numero}`,
            complemento,
            cidade && estado
                ? `${cidade} - ${estado}`
                : cidade,
            cep && `CEP ${cep}`
        ].filter(Boolean);

        document.getElementById(
            "reviewEndereco"
        ).textContent =
            addressParts.join(" • ") || "—";
    }

    // ==================================================
    // ENVIO DO FORMULÁRIO
    // ==================================================

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!validateStep(4)) {
            showStep(4);
            return;
        }

        if (!termosInput.checked) {

            termsError.textContent =
                "Você precisa aceitar os termos para continuar.";

            termosInput.focus();
            return;
        }

        termsError.textContent = "";

        const submitButton =
            form.querySelector(".submit-button");

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Criando conta...
        `;

        const formData = new FormData(form);

        const userData =
            Object.fromEntries(formData.entries());

        delete userData.confirmarSenha;

        /*
         * Atenção:
         * este localStorage é apenas uma simulação front-end.
         * Em um sistema bancário real, CPF, senha e demais
         * dados devem ser enviados por HTTPS para um backend
         * seguro. Nunca armazene senhas em localStorage.
         */

        const safeDemoData = {
            nome: userData.nome,
            email: userData.email,
            telefone: userData.telefone
        };

        localStorage.setItem(
            "chormaBankDemoUser",
            JSON.stringify(safeDemoData)
        );

        setTimeout(() => {

            submitButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Conta criada com sucesso!
            `;

            setTimeout(() => {

               window.location.href = new URL("../../index.html", window.location.href).href;
                    "login.html?cadastro=sucesso";

            }, 1200);

        }, 1600);
    });

    termosInput?.addEventListener(
        "change",
        () => {

            if (termosInput.checked) {
                termsError.textContent = "";
            }
        }
    );

    // ==================================================
    // ESTADO INICIAL
    // ==================================================

    updatePasswordRequirements();
    showStep(1);

});