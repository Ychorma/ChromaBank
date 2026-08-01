// ==================================================
// CHROMABANK — PÁGINA PIX
// Arquivo: pix.js
// ==================================================


// ==================================================
// PROTEÇÃO DA PÁGINA
// ==================================================

if (
    sessionStorage.getItem("chromaBankLoggedIn") !== "true"
) {
    window.location.href = "../login/login.html";
}


// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    // Sidebar
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const menuButton = document.getElementById("menuButton");
    const sidebarClose = document.getElementById("sidebarClose");

    // Saldo
    const toggleBalanceButton =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    // Perfil e logout
    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Cópia
    const copyButtons =
        document.querySelectorAll("[data-copy-value]");

    // Contatos
    const contactButtons =
        document.querySelectorAll(".contact-item");

    // Formulários
    const sendPixForm =
        document.getElementById("sendPixForm");

    const copyPasteForm =
        document.getElementById("copyPasteForm");

    const addPixKeyButton =
        document.getElementById("addPixKeyButton");

    // Campos
    const pixKey =
        document.getElementById("pixKey");

    const pixAmount =
        document.getElementById("pixAmount");

    const pixDescription =
        document.getElementById("pixDescription");

    const pixCopyPaste =
        document.getElementById("pixCopyPaste");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let balanceIsVisible = true;
    let toastTimeout = null;
    let profileMenu = null;


    // ==================================================
    // SIDEBAR MOBILE
    // ==================================================

    function openSidebar() {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.add("active");
        sidebarOverlay.classList.add("active");
        body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        body.classList.remove("sidebar-open");
    }

    menuButton?.addEventListener("click", openSidebar);
    sidebarClose?.addEventListener("click", closeSidebar);
    sidebarOverlay?.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            closeSidebar();
        }
    });


    // ==================================================
    // MOSTRAR E OCULTAR SALDO
    // ==================================================

    function updateBalanceVisibility() {
        if (!balanceValue) return;

        balanceValue.textContent = balanceIsVisible
            ? "R$ 4.856,90"
            : "R$ ••••••";

        if (toggleBalanceButton) {
            toggleBalanceButton.innerHTML = balanceIsVisible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';

            toggleBalanceButton.setAttribute(
                "aria-label",
                balanceIsVisible
                    ? "Ocultar saldo"
                    : "Mostrar saldo"
            );
        }

        localStorage.setItem(
            "chromaBankPixBalanceVisible",
            String(balanceIsVisible)
        );
    }

    const savedBalancePreference =
        localStorage.getItem(
            "chromaBankPixBalanceVisible"
        );

    if (savedBalancePreference !== null) {
        balanceIsVisible =
            savedBalancePreference === "true";
    }

    toggleBalanceButton?.addEventListener("click", () => {
        balanceIsVisible = !balanceIsVisible;
        updateBalanceVisibility();
    });

    updateBalanceVisibility();


    // ==================================================
    // MODAIS
    // ==================================================

    function openModal(modalId) {
        const modal = document.getElementById(modalId);

        if (!modal) return;

        closeAllModals();

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        body.classList.add("modal-open");

        const firstInput =
            modal.querySelector("input, textarea, button");

        setTimeout(() => {
            firstInput?.focus();
        }, 150);
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const anyModalOpen =
            document.querySelector(".modal.active");

        if (!anyModalOpen) {
            body.classList.remove("modal-open");
        }
    }

    function closeAllModals() {
        modals.forEach((modal) => {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
        });

        body.classList.remove("modal-open");
    }

    openModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalId =
                button.dataset.openModal;

            openModal(modalId);
        });
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal =
                button.closest(".modal");

            closeModal(modal);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllModals();
            closeSidebar();

            profileMenu?.classList.remove("active");
        }
    });


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
    // COPIAR CHAVES
    // ==================================================

    async function copyValue(value) {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            showToast("Chave copiada com sucesso!");
        } catch {
            const temporaryInput =
                document.createElement("textarea");

            temporaryInput.value = value;
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);

            temporaryInput.select();
            document.execCommand("copy");

            temporaryInput.remove();

            showToast("Chave copiada com sucesso!");
        }
    }

    copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            copyValue(button.dataset.copyValue);
        });
    });


    // ==================================================
    // CONTATOS RECENTES
    // ==================================================

    contactButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const contactName =
                button.dataset.contactName;

            const contactKey =
                button.dataset.contactKey;

            if (pixKey) {
                pixKey.value = contactKey || "";
            }

            openModal("sendPixModal");

            showToast(
                `${contactName} selecionado para o PIX.`
            );
        });
    });


    // ==================================================
    // FORMATAÇÃO DO VALOR
    // ==================================================

    function formatCurrencyInput(value) {
        const digits =
            value.replace(/\D/g, "");

        if (!digits) return "";

        const number =
            Number(digits) / 100;

        return number.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }

    function currencyToNumber(value) {
        return Number(
            value
                .replace(/\./g, "")
                .replace(",", ".")
        );
    }

    pixAmount?.addEventListener("input", () => {
        pixAmount.value =
            formatCurrencyInput(
                pixAmount.value
            );

        clearFieldError(pixAmount);
    });


    // ==================================================
    // VALIDAÇÃO DOS CAMPOS
    // ==================================================

    function getFieldErrorElement(field) {
        return field
            ?.closest(".input-group")
            ?.querySelector(".field-error");
    }

    function setFieldError(field, message) {
        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = message;
        }

        field?.closest(".input-box")
            ?.classList.add("invalid");

        if (field?.tagName === "TEXTAREA") {
            field.classList.add("invalid");
        }
    }

    function clearFieldError(field) {
        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = "";
        }

        field?.closest(".input-box")
            ?.classList.remove("invalid");

        field?.classList.remove("invalid");
    }

    function validatePixKey() {
        if (!pixKey) return false;

        const value = pixKey.value.trim();

        if (value.length < 5) {
            setFieldError(
                pixKey,
                "Digite uma chave PIX válida."
            );

            return false;
        }

        clearFieldError(pixKey);
        return true;
    }

    function validatePixAmount() {
        if (!pixAmount) return false;

        const amount =
            currencyToNumber(
                pixAmount.value
            );

        if (!pixAmount.value || amount <= 0) {
            setFieldError(
                pixAmount,
                "Digite um valor maior que zero."
            );

            return false;
        }

        if (amount > 4856.90) {
            setFieldError(
                pixAmount,
                "Saldo insuficiente para esta operação."
            );

            return false;
        }

        clearFieldError(pixAmount);
        return true;
    }

    pixKey?.addEventListener("input", () => {
        clearFieldError(pixKey);
    });

    pixCopyPaste?.addEventListener("input", () => {
        clearFieldError(pixCopyPaste);
    });


    // ==================================================
    // ENVIAR PIX
    // ==================================================

    sendPixForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const keyIsValid =
            validatePixKey();

        const amountIsValid =
            validatePixAmount();

        if (!keyIsValid || !amountIsValid) {
            return;
        }

        const submitButton =
            sendPixForm.querySelector(
                ".primary-button"
            );

        const amount =
            pixAmount.value;

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Processando...
        `;

        setTimeout(() => {

            submitButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                PIX enviado!
            `;

            showToast(
                `PIX de R$ ${amount} enviado com sucesso!`
            );

            setTimeout(() => {
                closeModal(
                    document.getElementById(
                        "sendPixModal"
                    )
                );

                sendPixForm.reset();

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    Continuar
                    <i class="fa-solid fa-arrow-right"></i>
                `;
            }, 1100);

        }, 1500);
    });


    // ==================================================
    // PIX COPIA E COLA
    // ==================================================

    copyPasteForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const code =
                pixCopyPaste.value.trim();

            if (code.length < 15) {
                setFieldError(
                    pixCopyPaste,
                    "Cole um código PIX válido."
                );

                return;
            }

            clearFieldError(pixCopyPaste);

            const submitButton =
                copyPasteForm.querySelector(
                    ".primary-button"
                );

            submitButton.disabled = true;

            submitButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Validando código...
            `;

            setTimeout(() => {
                showToast(
                    "Código PIX validado com sucesso!"
                );

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    Continuar
                    <i class="fa-solid fa-arrow-right"></i>
                `;

                closeModal(
                    document.getElementById(
                        "copyPasteModal"
                    )
                );

                copyPasteForm.reset();

            }, 1400);
        }
    );


    // ==================================================
    // CADASTRAR NOVA CHAVE
    // ==================================================

    addPixKeyButton?.addEventListener("click", () => {
        showToast(
            "Funcionalidade de cadastrar chave em desenvolvimento."
        );
    });


    // ==================================================
    // MENU DO PERFIL
    // ==================================================

    function createProfileMenu() {
        profileMenu =
            document.createElement("div");

        profileMenu.className =
            "profile-dropdown";

        profileMenu.innerHTML = `
            <a href="../perfil/perfil.html">
                <i class="fa-regular fa-user"></i>
                Meu perfil
            </a>

            <a href="../configuracoes/configuracoes.html">
                <i class="fa-solid fa-gear"></i>
                Configurações
            </a>

            <button type="button" id="profileLogout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                Sair da conta
            </button>
        `;

        document.body.appendChild(profileMenu);

        document
            .getElementById("profileLogout")
            ?.addEventListener("click", logout);
    }

    function positionProfileMenu() {
        if (!profileMenu || !profileButton) return;

        const buttonRect =
            profileButton.getBoundingClientRect();

        profileMenu.style.top =
            `${buttonRect.bottom + 10}px`;

        profileMenu.style.right =
            `${window.innerWidth - buttonRect.right}px`;
    }

    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (!profileMenu) {
                createProfileMenu();
            }

            positionProfileMenu();

            profileMenu.classList.toggle(
                "active"
            );
        }
    );

    document.addEventListener("click", (event) => {
        if (
            profileMenu &&
            !profileMenu.contains(event.target) &&
            !profileButton?.contains(event.target)
        ) {
            profileMenu.classList.remove("active");
        }
    });


    // ==================================================
    // LOGOUT
    // ==================================================

    function logout() {
        const confirmed = window.confirm(
            "Deseja realmente sair da sua conta?"
        );

        if (!confirmed) return;

        sessionStorage.removeItem(
            "chromaBankLoggedIn"
        );

        sessionStorage.removeItem(
            "chromaBankCPF"
        );

        window.location.href =
            "../login/login.html";
    }

    logoutButton?.addEventListener(
        "click",
        logout
    );

});