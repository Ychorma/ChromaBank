// ==================================================
// CHROMABANK — CARTÕES
// Arquivo: cartoes.js
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

    // Cabeçalho
    const toggleValuesButton =
        document.getElementById("toggleValues");

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    // Cartão
    const physicalCard =
        document.getElementById("physicalCard");

    const cardLastDigits =
        document.getElementById("cardLastDigits");

    const selectorButtons =
        document.querySelectorAll("[data-card-type]");

    const sensitiveValues =
        document.querySelectorAll(".sensitive-value");

    // Controles
    const blockCardButton =
        document.getElementById("blockCardButton");

    const blockCardText =
        document.getElementById("blockCardText");

    const contactlessButton =
        document.getElementById("contactlessButton");

    const contactlessStatus =
        document.getElementById("contactlessStatus");

    const requestNewCardButton =
        document.getElementById("requestNewCardButton");

    const payInvoiceButton =
        document.getElementById("payInvoiceButton");

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Limite
    const limitForm =
        document.getElementById("limitForm");

    const limitRange =
        document.getElementById("limitRange");

    const limitInput =
        document.getElementById("limitInput");

    const selectedLimit =
        document.getElementById("selectedLimit");

    // Senha
    const passwordForm =
        document.getElementById("passwordForm");

    const currentCardPassword =
        document.getElementById("currentCardPassword");

    const newCardPassword =
        document.getElementById("newCardPassword");

    const confirmCardPassword =
        document.getElementById("confirmCardPassword");

    // Cartão virtual
    const copyVirtualCardButton =
        document.getElementById("copyVirtualCardButton");

    // Aviso de viagem
    const travelNoticeForm =
        document.getElementById("travelNoticeForm");

    const travelCountry =
        document.getElementById("travelCountry");

    const travelStart =
        document.getElementById("travelStart");

    const travelEnd =
        document.getElementById("travelEnd");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let valuesAreVisible = true;
    let cardIsBlocked = false;
    let contactlessIsActive = true;
    let currentCardType = "physical";
    let profileMenu = null;
    let toastTimeout = null;


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
    // MOSTRAR E OCULTAR VALORES
    // ==================================================

    function updateSensitiveValues() {

        sensitiveValues.forEach((element) => {

            const originalValue =
                element.dataset.value || element.textContent;

            element.textContent = valuesAreVisible
                ? originalValue
                : "R$ ••••••";
        });

        if (toggleValuesButton) {
            toggleValuesButton.innerHTML = valuesAreVisible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';

            toggleValuesButton.setAttribute(
                "aria-label",
                valuesAreVisible
                    ? "Ocultar valores"
                    : "Mostrar valores"
            );
        }

        localStorage.setItem(
            "chromaBankCardValuesVisible",
            String(valuesAreVisible)
        );
    }

    const savedValuesPreference =
        localStorage.getItem(
            "chromaBankCardValuesVisible"
        );

    if (savedValuesPreference !== null) {
        valuesAreVisible =
            savedValuesPreference === "true";
    }

    toggleValuesButton?.addEventListener("click", () => {
        valuesAreVisible = !valuesAreVisible;
        updateSensitiveValues();
    });

    updateSensitiveValues();


    // ==================================================
    // ALTERNAR CARTÃO FÍSICO E VIRTUAL
    // ==================================================

    function updateCardType(type) {

        currentCardType = type;

        selectorButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.cardType === type
            );
        });

        if (!physicalCard || !cardLastDigits) return;

        const cardBrand =
            physicalCard.querySelector(".card-brand span");

        const cardHolder =
            physicalCard.querySelector(
                ".card-bottom > div:first-child strong"
            );

        const validity =
            physicalCard.querySelector(
                ".card-bottom > div:nth-child(2) strong"
            );

        if (type === "virtual") {

            physicalCard.classList.add("virtual");

            cardLastDigits.textContent = "9012";

            if (cardBrand) {
                cardBrand.textContent =
                    "chromaBank Virtual";
            }

            if (cardHolder) {
                cardHolder.textContent =
                    "VINICIUS FERNANDES";
            }

            if (validity) {
                validity.textContent = "12/28";
            }

            showToast("Cartão virtual selecionado.");

        } else {

            physicalCard.classList.remove("virtual");

            cardLastDigits.textContent = "1234";

            if (cardBrand) {
                cardBrand.textContent =
                    "chromaBank";
            }

            if (cardHolder) {
                cardHolder.textContent =
                    "VINICIUS FERNANDES";
            }

            if (validity) {
                validity.textContent = "12/31";
            }

            showToast("Cartão físico selecionado.");
        }

        localStorage.setItem(
            "chromaBankSelectedCardType",
            type
        );
    }

    selectorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            updateCardType(
                button.dataset.cardType
            );
        });
    });

    const savedCardType =
        localStorage.getItem(
            "chromaBankSelectedCardType"
        );

    if (
        savedCardType === "physical" ||
        savedCardType === "virtual"
    ) {
        updateCardType(savedCardType);
    }


    // ==================================================
    // BLOQUEAR E DESBLOQUEAR CARTÃO
    // ==================================================

    function updateCardBlockedState() {

        physicalCard?.classList.toggle(
            "blocked",
            cardIsBlocked
        );

        if (blockCardText) {
            blockCardText.textContent =
                cardIsBlocked
                    ? "Desbloquear cartão"
                    : "Bloquear cartão";
        }

        const icon =
            blockCardButton?.querySelector(
                ".card-action-icon i"
            );

        if (icon) {
            icon.className = cardIsBlocked
                ? "fa-solid fa-lock-open"
                : "fa-solid fa-lock";
        }

        localStorage.setItem(
            "chromaBankCardBlocked",
            String(cardIsBlocked)
        );
    }

    const savedCardBlocked =
        localStorage.getItem(
            "chromaBankCardBlocked"
        );

    if (savedCardBlocked !== null) {
        cardIsBlocked =
            savedCardBlocked === "true";
    }

    blockCardButton?.addEventListener("click", () => {

        const actionText = cardIsBlocked
            ? "desbloquear"
            : "bloquear";

        const confirmed = window.confirm(
            `Deseja realmente ${actionText} o cartão?`
        );

        if (!confirmed) return;

        cardIsBlocked = !cardIsBlocked;

        updateCardBlockedState();

        showToast(
            cardIsBlocked
                ? "Cartão bloqueado temporariamente."
                : "Cartão desbloqueado com sucesso."
        );
    });

    updateCardBlockedState();


    // ==================================================
    // ATIVAR E DESATIVAR APROXIMAÇÃO
    // ==================================================

    function updateContactlessState() {

        if (contactlessStatus) {
            contactlessStatus.textContent =
                contactlessIsActive
                    ? "Ativada"
                    : "Desativada";
        }

        const iconContainer =
            contactlessButton?.querySelector(
                ".card-action-icon"
            );

        iconContainer?.classList.toggle(
            "green",
            contactlessIsActive
        );

        iconContainer?.classList.toggle(
            "danger",
            !contactlessIsActive
        );

        localStorage.setItem(
            "chromaBankContactlessActive",
            String(contactlessIsActive)
        );
    }

    const savedContactless =
        localStorage.getItem(
            "chromaBankContactlessActive"
        );

    if (savedContactless !== null) {
        contactlessIsActive =
            savedContactless === "true";
    }

    contactlessButton?.addEventListener("click", () => {

        contactlessIsActive =
            !contactlessIsActive;

        updateContactlessState();

        showToast(
            contactlessIsActive
                ? "Pagamento por aproximação ativado."
                : "Pagamento por aproximação desativado."
        );
    });

    updateContactlessState();


    // ==================================================
    // MODAIS
    // ==================================================

    function openModal(modalId) {

        const modal =
            document.getElementById(modalId);

        if (!modal) return;

        closeAllModals();

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        body.classList.add("modal-open");

        const firstFocusable =
            modal.querySelector(
                "input, button"
            );

        setTimeout(() => {
            firstFocusable?.focus();
        }, 150);
    }

    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        if (
            !document.querySelector(".modal.active")
        ) {
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
            openModal(
                button.dataset.openModal
            );
        });
    });

    closeModalButtons.forEach((button) => {

        button.addEventListener("click", () => {

            closeModal(
                button.closest(".modal")
            );
        });
    });


    // ==================================================
    // FUNÇÕES DE VALIDAÇÃO
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

        field
            ?.closest(".input-box")
            ?.classList.add("invalid");
    }

    function clearFieldError(field) {

        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = "";
        }

        field
            ?.closest(".input-box")
            ?.classList.remove("invalid");
    }

    function onlyNumbers(value) {
        return value.replace(/\D/g, "");
    }


    // ==================================================
    // AJUSTAR LIMITE
    // ==================================================

    function formatCurrency(value) {

        return Number(value).toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }

    function formatCurrencyInput(value) {

        const digits =
            value.replace(/\D/g, "");

        if (!digits) return "";

        return (
            Number(digits) / 100
        ).toLocaleString(
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

    function updateLimitFields(value) {

        const numericValue = Number(value);

        if (limitRange) {
            limitRange.value =
                String(numericValue);
        }

        if (limitInput) {
            limitInput.value =
                formatCurrency(numericValue);
        }

        if (selectedLimit) {
            selectedLimit.textContent =
                `R$ ${formatCurrency(numericValue)}`;
        }
    }

    limitRange?.addEventListener("input", () => {

        updateLimitFields(
            limitRange.value
        );

        clearFieldError(limitInput);
    });

    limitInput?.addEventListener("input", () => {

        limitInput.value =
            formatCurrencyInput(
                limitInput.value
            );

        const numericValue =
            currencyToNumber(
                limitInput.value
            );

        if (
            Number.isFinite(numericValue) &&
            numericValue >= 500 &&
            numericValue <= 5000
        ) {
            limitRange.value =
                String(numericValue);

            selectedLimit.textContent =
                `R$ ${formatCurrency(numericValue)}`;
        }

        clearFieldError(limitInput);
    });

    limitForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        const numericValue =
            currencyToNumber(
                limitInput.value
            );

        if (
            !Number.isFinite(numericValue) ||
            numericValue < 500 ||
            numericValue > 5000
        ) {
            setFieldError(
                limitInput,
                "Informe um limite entre R$ 500,00 e R$ 5.000,00."
            );

            return;
        }

        clearFieldError(limitInput);

        const button =
            limitForm.querySelector(
                ".primary-button"
            );

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Salvando...
        `;

        setTimeout(() => {

            localStorage.setItem(
                "chromaBankCardLimit",
                String(numericValue)
            );

            showToast(
                `Limite ajustado para R$ ${formatCurrency(numericValue)}.`
            );

            button.disabled = false;

            button.innerHTML = `
                Confirmar limite
                <i class="fa-solid fa-check"></i>
            `;

            closeModal(
                document.getElementById(
                    "limitModal"
                )
            );

        }, 1200);
    });

    const savedLimit =
        localStorage.getItem(
            "chromaBankCardLimit"
        );

    if (savedLimit) {
        updateLimitFields(savedLimit);
    }


    // ==================================================
    // ALTERAR SENHA
    // ==================================================

    [
        currentCardPassword,
        newCardPassword,
        confirmCardPassword
    ].forEach((field) => {

        field?.addEventListener("input", () => {

            field.value =
                onlyNumbers(field.value)
                    .slice(0, 4);

            clearFieldError(field);
        });
    });

    passwordForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        let isValid = true;

        if (
            onlyNumbers(
                currentCardPassword.value
            ).length !== 4
        ) {
            setFieldError(
                currentCardPassword,
                "Digite a senha atual com 4 números."
            );

            isValid = false;
        }

        if (
            onlyNumbers(
                newCardPassword.value
            ).length !== 4
        ) {
            setFieldError(
                newCardPassword,
                "A nova senha deve ter 4 números."
            );

            isValid = false;
        }

        if (
            confirmCardPassword.value !==
            newCardPassword.value
        ) {
            setFieldError(
                confirmCardPassword,
                "As senhas não são iguais."
            );

            isValid = false;
        }

        if (!isValid) return;

        const button =
            passwordForm.querySelector(
                ".primary-button"
            );

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Alterando...
        `;

        setTimeout(() => {

            passwordForm.reset();

            button.disabled = false;

            button.innerHTML = `
                Alterar senha
                <i class="fa-solid fa-check"></i>
            `;

            showToast(
                "Senha do cartão alterada com sucesso."
            );

            closeModal(
                document.getElementById(
                    "passwordModal"
                )
            );

        }, 1300);
    });


    // ==================================================
    // COPIAR CARTÃO VIRTUAL
    // ==================================================

    async function copyText(value) {

        try {
            await navigator.clipboard.writeText(value);
        } catch {

            const temporaryInput =
                document.createElement("textarea");

            temporaryInput.value = value;
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(
                temporaryInput
            );

            temporaryInput.select();
            document.execCommand("copy");

            temporaryInput.remove();
        }
    }

    copyVirtualCardButton?.addEventListener(
        "click",
        async () => {

            const virtualCardData = [
                "Número: 5500 1234 5678 9012",
                "Validade: 12/28",
                "CVV: 482"
            ].join("\n");

            await copyText(virtualCardData);

            showToast(
                "Dados do cartão virtual copiados."
            );
        }
    );


    // ==================================================
    // AVISO DE VIAGEM
    // ==================================================

    [
        travelCountry,
        travelStart,
        travelEnd
    ].forEach((field) => {

        field?.addEventListener("input", () => {
            clearFieldError(field);
        });

        field?.addEventListener("change", () => {
            clearFieldError(field);
        });
    });

    travelNoticeForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                travelCountry.value.trim().length < 2
            ) {
                setFieldError(
                    travelCountry,
                    "Informe o país de destino."
                );

                isValid = false;
            }

            if (!travelStart.value) {
                setFieldError(
                    travelStart,
                    "Informe a data de início."
                );

                isValid = false;
            }

            if (!travelEnd.value) {
                setFieldError(
                    travelEnd,
                    "Informe a data de retorno."
                );

                isValid = false;
            }

            if (
                travelStart.value &&
                travelEnd.value &&
                travelEnd.value < travelStart.value
            ) {
                setFieldError(
                    travelEnd,
                    "A data de retorno deve ser posterior à data de início."
                );

                isValid = false;
            }

            if (!isValid) return;

            const button =
                travelNoticeForm.querySelector(
                    ".primary-button"
                );

            button.disabled = true;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Ativando...
            `;

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankTravelNotice",
                    JSON.stringify({
                        country:
                            travelCountry.value.trim(),

                        start:
                            travelStart.value,

                        end:
                            travelEnd.value
                    })
                );

                showToast(
                    "Aviso de viagem ativado com sucesso."
                );

                travelNoticeForm.reset();

                button.disabled = false;

                button.innerHTML = `
                    Ativar aviso
                    <i class="fa-solid fa-check"></i>
                `;

                closeModal(
                    document.getElementById(
                        "travelNoticeModal"
                    )
                );

            }, 1300);
        }
    );


    // ==================================================
    // PAGAR FATURA
    // ==================================================

    payInvoiceButton?.addEventListener("click", () => {

        const confirmed = window.confirm(
            "Deseja pagar a fatura atual de R$ 1.459,90?"
        );

        if (!confirmed) return;

        payInvoiceButton.disabled = true;

        payInvoiceButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Processando pagamento...
        `;

        setTimeout(() => {

            payInvoiceButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Fatura paga
            `;

            showToast(
                "Fatura paga com sucesso."
            );

        }, 1500);
    });


    // ==================================================
    // PEDIR NOVO CARTÃO
    // ==================================================

    requestNewCardButton?.addEventListener("click", () => {

        const confirmed = window.confirm(
            "Deseja iniciar a solicitação de um novo cartão?"
        );

        if (!confirmed) return;

        showToast(
            "Solicitação de novo cartão iniciada."
        );
    });


    // ==================================================
    // TOAST
    // ==================================================

    function showToast(message) {

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        toast.classList.add("active");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("active");
        }, 2800);
    }


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
            ?.addEventListener(
                "click",
                logout
            );
    }

    function positionProfileMenu() {

        if (!profileMenu || !profileButton) return;

        const rect =
            profileButton.getBoundingClientRect();

        profileMenu.style.top =
            `${rect.bottom + 10}px`;

        profileMenu.style.right =
            `${window.innerWidth - rect.right}px`;
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

    window.addEventListener("resize", () => {

        if (
            profileMenu?.classList.contains(
                "active"
            )
        ) {
            positionProfileMenu();
        }
    });


    // ==================================================
    // TECLA ESC
    // ==================================================

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        closeSidebar();
        closeAllModals();

        profileMenu?.classList.remove("active");
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