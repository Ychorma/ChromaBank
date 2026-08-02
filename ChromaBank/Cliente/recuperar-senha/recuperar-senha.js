// ==================================================
// CHROMABANK — RECUPERAR SENHA
// Arquivo: recuperar-senha.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTOS
    // ==================================================

    const recoverySteps =
        document.querySelectorAll("[data-recovery-step]");

    const progressSteps =
        document.querySelectorAll("[data-progress-step]");

    const progressLines =
        document.querySelectorAll(".progress-line");

    const identificationForm =
        document.getElementById("identificationForm");

    const recoveryIdentifier =
        document.getElementById("recoveryIdentifier");

    const verificationForm =
        document.getElementById("verificationForm");

    const codeInputs =
        [...document.querySelectorAll(".code-input")];

    const codeError =
        document.getElementById("codeError");

    const recoveryDestination =
        document.getElementById("recoveryDestination");

    const resendCodeButton =
        document.getElementById("resendCodeButton");

    const resendCountdown =
        document.getElementById("resendCountdown");

    const backToIdentificationButton =
        document.getElementById("backToIdentificationButton");

    const newPasswordForm =
        document.getElementById("newPasswordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmNewPassword =
        document.getElementById("confirmNewPassword");

    const passwordRules =
        document.querySelectorAll("[data-password-rule]");

    const togglePasswordButtons =
        document.querySelectorAll("[data-toggle-password]");

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    // ==================================================
    // ESTADO
    // ==================================================

    let currentStep = 1;
    let generatedCode = "";
    let resendTimer = null;
    let resendSeconds = 30;
    let toastTimeout = null;

    const recoveryData = {
        identifier: "",
        destination: ""
    };


    // ==================================================
    // TOAST
    // ==================================================

    function showToast(message, type = "success") {

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        const icon = toast.querySelector("i");

        if (icon) {
            icon.className =
                type === "error"
                    ? "fa-solid fa-circle-exclamation"
                    : "fa-solid fa-circle-check";
        }

        toast.classList.toggle(
            "error",
            type === "error"
        );

        toast.classList.add("active");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("active");
        }, 2800);
    }


    // ==================================================
    // ETAPAS
    // ==================================================

    function showStep(stepNumber) {

        currentStep = stepNumber;

        recoverySteps.forEach((step) => {

            const stepValue =
                Number(step.dataset.recoveryStep);

            const isActive =
                stepValue === stepNumber;

            step.hidden = !isActive;
            step.classList.toggle("active", isActive);
        });

        progressSteps.forEach((step) => {

            const stepValue =
                Number(step.dataset.progressStep);

            step.classList.toggle(
                "active",
                stepValue === stepNumber
            );

            step.classList.toggle(
                "completed",
                stepValue < stepNumber
            );
        });

        progressLines.forEach((line, index) => {

            line.classList.toggle(
                "active",
                index + 1 < stepNumber
            );
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function onlyNumbers(value) {
        return value.replace(/\D/g, "");
    }

    function isValidCPF(value) {

        const cpf = onlyNumbers(value);

        if (cpf.length !== 11) return false;

        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += Number(cpf[i]) * (10 - i);
        }

        let firstDigit = (sum * 10) % 11;

        if (firstDigit === 10) {
            firstDigit = 0;
        }

        if (firstDigit !== Number(cpf[9])) {
            return false;
        }

        sum = 0;

        for (let i = 0; i < 10; i++) {
            sum += Number(cpf[i]) * (11 - i);
        }

        let secondDigit = (sum * 10) % 11;

        if (secondDigit === 10) {
            secondDigit = 0;
        }

        return secondDigit === Number(cpf[10]);
    }

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value.trim()
        );
    }

    function maskCPF(value) {

        const cpf = onlyNumbers(value);

        if (cpf.length !== 11) {
            return value;
        }

        return `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;
    }

    function maskEmail(value) {

        const [user, domain] =
            value.split("@");

        if (!user || !domain) {
            return value;
        }

        const visibleUser =
            user.length <= 2
                ? user[0]
                : user.slice(0, 2);

        return `${visibleUser}${"•".repeat(
            Math.max(user.length - visibleUser.length, 4)
        )}@${domain}`;
    }

    function getFieldErrorElement(field) {

        return field
            ?.closest(".input-group")
            ?.querySelector(".field-error");
    }

    function setFieldError(field, message) {

        if (!field) return;

        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = message;
        }

        field
            .closest(".input-box")
            ?.classList.add("invalid");
    }

    function clearFieldError(field) {

        if (!field) return;

        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = "";
        }

        field
            .closest(".input-box")
            ?.classList.remove("invalid");
    }

    function setLoadingState(button, text) {

        if (!button) return;

        button.disabled = true;

        button.dataset.originalContent =
            button.innerHTML;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${text}
        `;
    }

    function restoreButtonState(button) {

        if (!button) return;

        button.disabled = false;

        button.innerHTML =
            button.dataset.originalContent ||
            "Continuar";
    }

    function generateRecoveryCode() {

        return String(
            Math.floor(
                100000 + Math.random() * 900000
            )
        );
    }


    // ==================================================
    // ETAPA 1 — IDENTIFICAÇÃO
    // ==================================================

    recoveryIdentifier?.addEventListener(
        "input",
        () => {
            clearFieldError(recoveryIdentifier);
        }
    );

    identificationForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const identifier =
                recoveryIdentifier
                    ?.value
                    .trim() || "";

            const isEmail =
                identifier.includes("@");

            const isValid =
                isEmail
                    ? isValidEmail(identifier)
                    : isValidCPF(identifier);

            if (!identifier) {

                setFieldError(
                    recoveryIdentifier,
                    "Digite seu CPF ou e-mail."
                );

                return;
            }

            if (!isValid) {

                setFieldError(
                    recoveryIdentifier,
                    isEmail
                        ? "Digite um e-mail válido."
                        : "Digite um CPF válido."
                );

                return;
            }

            clearFieldError(recoveryIdentifier);

            recoveryData.identifier =
                identifier;

            recoveryData.destination =
                isEmail
                    ? maskEmail(identifier)
                    : maskCPF(identifier);

            if (recoveryDestination) {
                recoveryDestination.textContent =
                    recoveryData.destination;
            }

            generatedCode =
                generateRecoveryCode();

            sessionStorage.setItem(
                "chromaBankRecoveryCode",
                generatedCode
            );

            sessionStorage.setItem(
                "chromaBankRecoveryIdentifier",
                identifier
            );

            const submitButton =
                identificationForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Enviando código..."
            );

            setTimeout(() => {

                restoreButtonState(
                    submitButton
                );

                clearCodeInputs();
                startResendCountdown();
                showStep(2);

                console.log(
                    "Código de recuperação:",
                    generatedCode
                );

                showToast(
                    "Código de verificação enviado."
                );

            }, 1000);
        }
    );


    // ==================================================
    // ETAPA 2 — CÓDIGO
    // ==================================================

    function clearCodeInputs() {

        codeInputs.forEach((input) => {
            input.value = "";
            input.classList.remove("invalid");
        });

        if (codeError) {
            codeError.textContent = "";
        }

        codeInputs[0]?.focus();
    }

    function getTypedCode() {

        return codeInputs
            .map((input) => input.value)
            .join("");
    }

    function setCodeError(message) {

        if (codeError) {
            codeError.textContent = message;
        }

        codeInputs.forEach((input) => {
            input.classList.add("invalid");
        });
    }

    function clearCodeError() {

        if (codeError) {
            codeError.textContent = "";
        }

        codeInputs.forEach((input) => {
            input.classList.remove("invalid");
        });
    }

    codeInputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            input.value =
                onlyNumbers(input.value)
                    .slice(0, 1);

            clearCodeError();

            if (
                input.value &&
                index < codeInputs.length - 1
            ) {
                codeInputs[index + 1].focus();
            }
        });

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {
                    codeInputs[index - 1].focus();
                }

                if (event.key === "ArrowLeft") {
                    codeInputs[index - 1]?.focus();
                }

                if (event.key === "ArrowRight") {
                    codeInputs[index + 1]?.focus();
                }
            }
        );

        input.addEventListener("paste", (event) => {

            event.preventDefault();

            const pastedCode =
                onlyNumbers(
                    event.clipboardData.getData("text")
                )
                    .slice(0, 6);

            pastedCode
                .split("")
                .forEach((digit, digitIndex) => {

                    if (codeInputs[digitIndex]) {
                        codeInputs[digitIndex].value =
                            digit;
                    }
                });

            codeInputs[
                Math.min(
                    pastedCode.length,
                    codeInputs.length
                ) - 1
            ]?.focus();

            clearCodeError();
        });
    });

    verificationForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const typedCode =
                getTypedCode();

            const savedCode =
                sessionStorage.getItem(
                    "chromaBankRecoveryCode"
                );

            if (typedCode.length !== 6) {

                setCodeError(
                    "Digite os seis números do código."
                );

                return;
            }

            if (
                typedCode !== savedCode
            ) {

                setCodeError(
                    "Código inválido. Tente novamente."
                );

                showToast(
                    "Código de verificação incorreto.",
                    "error"
                );

                return;
            }

            clearCodeError();

            const submitButton =
                verificationForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Verificando..."
            );

            setTimeout(() => {

                restoreButtonState(
                    submitButton
                );

                clearInterval(resendTimer);

                sessionStorage.setItem(
                    "chromaBankRecoveryVerified",
                    "true"
                );

                showStep(3);

                showToast(
                    "Identidade confirmada."
                );

            }, 850);
        }
    );


    // ==================================================
    // REENVIO DO CÓDIGO
    // ==================================================

    function startResendCountdown() {

        clearInterval(resendTimer);

        resendSeconds = 30;

        if (resendCodeButton) {
            resendCodeButton.disabled = true;
        }

        if (resendCountdown) {
            resendCountdown.textContent =
                `${resendSeconds}s`;
        }

        resendTimer = setInterval(() => {

            resendSeconds -= 1;

            if (resendCountdown) {
                resendCountdown.textContent =
                    `${resendSeconds}s`;
            }

            if (resendSeconds <= 0) {

                clearInterval(resendTimer);

                if (resendCodeButton) {
                    resendCodeButton.disabled = false;
                    resendCodeButton.innerHTML =
                        "Reenviar código";
                }
            }

        }, 1000);
    }

    resendCodeButton?.addEventListener(
        "click",
        () => {

            generatedCode =
                generateRecoveryCode();

            sessionStorage.setItem(
                "chromaBankRecoveryCode",
                generatedCode
            );

            clearCodeInputs();
            startResendCountdown();

            console.log(
                "Novo código de recuperação:",
                generatedCode
            );

            showToast(
                "Um novo código foi enviado."
            );
        }
    );

    backToIdentificationButton
        ?.addEventListener(
            "click",
            () => {

                clearInterval(resendTimer);

                sessionStorage.removeItem(
                    "chromaBankRecoveryCode"
                );

                sessionStorage.removeItem(
                    "chromaBankRecoveryVerified"
                );

                showStep(1);

                setTimeout(() => {
                    recoveryIdentifier?.focus();
                }, 150);
            }
        );


    // ==================================================
    // MOSTRAR E OCULTAR SENHAS
    // ==================================================

    togglePasswordButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const field =
                    document.getElementById(
                        button.dataset.togglePassword
                    );

                if (!field) return;

                const isPassword =
                    field.type === "password";

                field.type =
                    isPassword
                        ? "text"
                        : "password";

                button.innerHTML =
                    isPassword
                        ? '<i class="fa-regular fa-eye-slash"></i>'
                        : '<i class="fa-regular fa-eye"></i>';

                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Ocultar senha"
                        : "Mostrar senha"
                );
            }
        );
    });


    // ==================================================
    // REGRAS DA SENHA
    // ==================================================

    function validatePassword(password) {

        return {
            length:
                password.length >= 8,

            uppercase:
                /[A-Z]/.test(password),

            number:
                /\d/.test(password),

            special:
                /[^A-Za-z0-9]/.test(password)
        };
    }

    function updatePasswordRules() {

        const validation =
            validatePassword(
                newPassword?.value || ""
            );

        passwordRules.forEach((rule) => {

            const ruleName =
                rule.dataset.passwordRule;

            const isValid =
                Boolean(validation[ruleName]);

            rule.classList.toggle(
                "valid",
                isValid
            );

            const icon =
                rule.querySelector("i");

            if (icon) {
                icon.className =
                    isValid
                        ? "fa-solid fa-circle-check"
                        : "fa-regular fa-circle";
            }
        });

        return Object
            .values(validation)
            .every(Boolean);
    }

    newPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(newPassword);
            updatePasswordRules();
        }
    );

    confirmNewPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(
                confirmNewPassword
            );
        }
    );


    // ==================================================
    // ETAPA 3 — NOVA SENHA
    // ==================================================

    newPasswordForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const isVerified =
                sessionStorage.getItem(
                    "chromaBankRecoveryVerified"
                ) === "true";

            if (!isVerified) {

                showToast(
                    "Confirme sua identidade novamente.",
                    "error"
                );

                showStep(1);

                return;
            }

            let isValid = true;

            if (!updatePasswordRules()) {

                setFieldError(
                    newPassword,
                    "A senha não atende aos requisitos."
                );

                isValid = false;
            }

            if (!confirmNewPassword?.value) {

                setFieldError(
                    confirmNewPassword,
                    "Confirme a nova senha."
                );

                isValid = false;

            } else if (
                newPassword?.value !==
                confirmNewPassword.value
            ) {

                setFieldError(
                    confirmNewPassword,
                    "As senhas não são iguais."
                );

                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                newPasswordForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Atualizando..."
            );

            setTimeout(() => {

                const recoveryRecord = {
                    identifier:
                        recoveryData.identifier ||
                        sessionStorage.getItem(
                            "chromaBankRecoveryIdentifier"
                        ),

                    passwordUpdatedAt:
                        new Date().toISOString()
                };

                localStorage.setItem(
                    "chromaBankLastPasswordRecovery",
                    JSON.stringify(recoveryRecord)
                );

                /*
                    Simulação front-end:
                    não salvamos a senha real no localStorage.
                    Quando houver backend, a alteração será enviada
                    por uma requisição segura para o servidor.
                */

                newPasswordForm.reset();
                updatePasswordRules();

                sessionStorage.removeItem(
                    "chromaBankRecoveryCode"
                );

                sessionStorage.removeItem(
                    "chromaBankRecoveryVerified"
                );

                sessionStorage.removeItem(
                    "chromaBankRecoveryIdentifier"
                );

                restoreButtonState(
                    submitButton
                );

                showStep(4);

                showToast(
                    "Senha atualizada com sucesso."
                );

            }, 1100);
        }
    );


    // ==================================================
    // ESTADO INICIAL
    // ==================================================

    showStep(1);

});