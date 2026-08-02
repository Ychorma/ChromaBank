// ==================================================
// CHROMABANK — DEPÓSITO
// Arquivo: deposito.js
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
    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("menuButton");

    const sidebarClose =
        document.getElementById("sidebarClose");

    // Cabeçalho
    const toggleBalanceButton =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    const profileButton =
        document.getElementById("profileButton");

    const profileAvatar =
        profileButton?.querySelector(".profile-avatar");

    const logoutButton =
        document.getElementById("logoutButton");

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    const pixDepositModal =
        document.getElementById("pixDepositModal");

    const boletoDepositModal =
        document.getElementById("boletoDepositModal");

    const bankDataModal =
        document.getElementById("bankDataModal");

    const shareModal =
        document.getElementById("shareModal");

    // PIX
    const pixDepositForm =
        document.getElementById("pixDepositForm");

    const pixDepositAmount =
        document.getElementById("pixDepositAmount");

    const pixDepositDescription =
        document.getElementById("pixDepositDescription");

    const generatedPixArea =
        document.getElementById("generatedPixArea");

    const generatedPixAmount =
        document.getElementById("generatedPixAmount");

    // Boleto
    const boletoDepositForm =
        document.getElementById("boletoDepositForm");

    const boletoAmount =
        document.getElementById("boletoAmount");

    const boletoDueDate =
        document.getElementById("boletoDueDate");

    const generatedBoletoArea =
        document.getElementById("generatedBoletoArea");

    const generatedBoletoCode =
        document.getElementById("generatedBoletoCode");

    const copyBoletoCodeButton =
        document.getElementById("copyBoletoCodeButton");

    // Dados da conta
    const copyButtons =
        document.querySelectorAll("[data-copy-value]");

    const copyPixKeyButton =
        document.getElementById("copyPixKeyButton");

    const copyAllAccountDataButton =
        document.getElementById("copyAllAccountDataButton");

    const copyModalBankDataButton =
        document.getElementById("copyModalBankDataButton");

    const shareAccountDataButton =
        document.getElementById("shareAccountDataButton");

    const shareOptions =
        document.querySelectorAll("[data-share-type]");

    // Outros
    const securityHelpButton =
        document.getElementById("securityHelpButton");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let balanceIsVisible = true;
    let profileMenu = null;
    let toastTimeout = null;


    // ==================================================
    // DADOS DA CONTA
    // ==================================================

    const accountData = {
        bank: "ChromaBank",
        agency: "0001",
        account: "987654-3",
        accountType: "Conta corrente",
        holder: "Vinícius Fernandes",
        cpf: "529.982.247-25",
        pixKey: "vinicius@email.com"
    };

    function getAccountDataText() {
        return [
            "Dados bancários ChromaBank",
            `Banco: ${accountData.bank}`,
            `Agência: ${accountData.agency}`,
            `Conta: ${accountData.account}`,
            `Tipo: ${accountData.accountType}`,
            `Titular: ${accountData.holder}`,
            `CPF: ${accountData.cpf}`,
            `Chave PIX: ${accountData.pixKey}`
        ].join("\n");
    }


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

        balanceValue.textContent =
            balanceIsVisible
                ? "R$ 4.856,90"
                : "R$ ••••••";

        if (toggleBalanceButton) {
            toggleBalanceButton.innerHTML =
                balanceIsVisible
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
            "chromaBankDepositBalanceVisible",
            String(balanceIsVisible)
        );
    }

    const savedBalancePreference =
        localStorage.getItem(
            "chromaBankDepositBalanceVisible"
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
    // MODAIS
    // ==================================================

    function openModal(modal) {
        if (!modal) return;

        closeAllModals();

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        body.classList.add("modal-open");

        const firstFocusable =
            modal.querySelector(
                "input, button:not(.modal-close)"
            );

        setTimeout(() => {
            firstFocusable?.focus();
        }, 150);
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".modal.active")) {
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
            const modal =
                document.getElementById(
                    button.dataset.openModal
                );

            openModal(modal);
        });
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal"));
        });
    });


    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function onlyNumbers(value) {
        return value.replace(/\D/g, "");
    }

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
        const digits = onlyNumbers(value);

        if (!digits) return "";

        return formatCurrency(
            Number(digits) / 100
        );
    }

    function currencyToNumber(value) {
        if (!value) return 0;

        return Number(
            value
                .replace(/\./g, "")
                .replace(",", ".")
        );
    }

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

    function validateAmount(
        field,
        minimum = 10,
        maximum = 50000
    ) {
        const amount =
            currencyToNumber(field?.value || "");

        if (!amount || amount <= 0) {
            setFieldError(
                field,
                "Digite um valor maior que zero."
            );

            return false;
        }

        if (amount < minimum) {
            setFieldError(
                field,
                `O valor mínimo é R$ ${formatCurrency(minimum)}.`
            );

            return false;
        }

        if (amount > maximum) {
            setFieldError(
                field,
                `O valor máximo é R$ ${formatCurrency(maximum)}.`
            );

            return false;
        }

        clearFieldError(field);

        return true;
    }

    function setLoadingState(button, message) {
        if (!button) return;

        button.disabled = true;

        button.dataset.originalContent =
            button.innerHTML;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${message}
        `;
    }

    function restoreButtonState(button) {
        if (!button) return;

        button.disabled = false;

        button.innerHTML =
            button.dataset.originalContent ||
            "Continuar";
    }

    function getTodayISO() {
        const today = new Date();

        const offset =
            today.getTimezoneOffset() * 60000;

        return new Date(
            today.getTime() - offset
        )
            .toISOString()
            .split("T")[0];
    }

    function getFutureDateISO(days) {
        const date = new Date();

        date.setDate(
            date.getDate() + days
        );

        const offset =
            date.getTimezoneOffset() * 60000;

        return new Date(
            date.getTime() - offset
        )
            .toISOString()
            .split("T")[0];
    }

    function generateBoletoCode(amount) {
        const amountDigits =
            Math.round(amount * 100)
                .toString()
                .padStart(10, "0");

        const randomBlock = () =>
            Math.floor(
                10000 + Math.random() * 90000
            );

        return (
            `34191.${randomBlock()} ` +
            `${randomBlock()}.${randomBlock()} ` +
            `${randomBlock()}.${randomBlock()} ` +
            `1 ${amountDigits}`
        );
    }


    // ==================================================
    // COPIAR TEXTO
    // ==================================================

    async function copyText(text, successMessage) {
        try {
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    text
                );
            } else {
                const temporaryTextArea =
                    document.createElement("textarea");

                temporaryTextArea.value = text;
                temporaryTextArea.style.position = "fixed";
                temporaryTextArea.style.opacity = "0";

                document.body.appendChild(
                    temporaryTextArea
                );

                temporaryTextArea.select();

                document.execCommand("copy");

                temporaryTextArea.remove();
            }

            showToast(successMessage);

        } catch {
            showToast(
                "Não foi possível copiar os dados.",
                "error"
            );
        }
    }

    copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            copyText(
                button.dataset.copyValue || "",
                "Informação copiada."
            );
        });
    });

    copyPixKeyButton?.addEventListener("click", () => {
        copyText(
            accountData.pixKey,
            "Chave PIX copiada."
        );
    });

    copyAllAccountDataButton?.addEventListener(
        "click",
        () => {
            copyText(
                getAccountDataText(),
                "Dados da conta copiados."
            );
        }
    );

    copyModalBankDataButton?.addEventListener(
        "click",
        () => {
            copyText(
                getAccountDataText(),
                "Dados bancários copiados."
            );
        }
    );


    // ==================================================
    // MÁSCARAS
    // ==================================================

    [
        pixDepositAmount,
        boletoAmount
    ].forEach((field) => {
        field?.addEventListener("input", () => {
            field.value =
                formatCurrencyInput(field.value);

            clearFieldError(field);
        });
    });

    pixDepositDescription?.addEventListener(
        "input",
        () => {
            clearFieldError(
                pixDepositDescription
            );
        }
    );


    // ==================================================
    // DATAS DO BOLETO
    // ==================================================

    if (boletoDueDate) {
        boletoDueDate.min = getTodayISO();
        boletoDueDate.value =
            getFutureDateISO(3);
    }


    // ==================================================
    // GERAR PIX
    // ==================================================

    pixDepositForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (
                !validateAmount(
                    pixDepositAmount,
                    1,
                    50000
                )
            ) {
                return;
            }

            const amount =
                currencyToNumber(
                    pixDepositAmount.value
                );

            const submitButton =
                pixDepositForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Gerando..."
            );

            setTimeout(() => {

                if (generatedPixAmount) {
                    generatedPixAmount.textContent =
                        `R$ ${formatCurrency(amount)}`;
                }

                if (generatedPixArea) {
                    generatedPixArea.hidden = false;
                }

                saveDepositRequest({
                    type: "pix",
                    amount,
                    description:
                        pixDepositDescription
                            ?.value
                            .trim() || "",
                    status: "pending",
                    createdAt:
                        new Date().toISOString()
                });

                restoreButtonState(
                    submitButton
                );

                showToast(
                    "QR Code PIX gerado com sucesso."
                );

            }, 1100);
        }
    );


    // ==================================================
    // GERAR BOLETO
    // ==================================================

    boletoDepositForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !validateAmount(
                    boletoAmount,
                    20,
                    50000
                )
            ) {
                isValid = false;
            }

            if (!boletoDueDate?.value) {
                setFieldError(
                    boletoDueDate,
                    "Escolha a data de vencimento."
                );

                isValid = false;
            } else {
                const selectedDate =
                    new Date(
                        `${boletoDueDate.value}T00:00:00`
                    );

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    setFieldError(
                        boletoDueDate,
                        "Escolha hoje ou uma data futura."
                    );

                    isValid = false;
                } else {
                    clearFieldError(
                        boletoDueDate
                    );
                }
            }

            if (!isValid) return;

            const amount =
                currencyToNumber(
                    boletoAmount.value
                );

            const submitButton =
                boletoDepositForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Gerando..."
            );

            setTimeout(() => {

                const boletoCode =
                    generateBoletoCode(amount);

                if (generatedBoletoCode) {
                    generatedBoletoCode.textContent =
                        boletoCode;

                    generatedBoletoCode.dataset.code =
                        boletoCode;
                }

                if (generatedBoletoArea) {
                    generatedBoletoArea.hidden = false;
                }

                saveDepositRequest({
                    type: "boleto",
                    amount,
                    dueDate:
                        boletoDueDate.value,
                    code:
                        boletoCode,
                    status: "pending",
                    createdAt:
                        new Date().toISOString()
                });

                restoreButtonState(
                    submitButton
                );

                showToast(
                    "Boleto gerado com sucesso."
                );

            }, 1200);
        }
    );

    copyBoletoCodeButton?.addEventListener(
        "click",
        () => {

            const code =
                generatedBoletoCode
                    ?.dataset
                    .code ||
                generatedBoletoCode
                    ?.textContent
                    .trim() ||
                "";

            copyText(
                code,
                "Código do boleto copiado."
            );
        }
    );


    // ==================================================
    // COMPARTILHAR DADOS
    // ==================================================

    shareAccountDataButton?.addEventListener(
        "click",
        () => {
            openModal(shareModal);
        }
    );

    shareOptions.forEach((button) => {
        button.addEventListener(
            "click",
            async () => {

                const shareType =
                    button.dataset.shareType;

                const text =
                    getAccountDataText();

                if (shareType === "copy") {
                    await copyText(
                        text,
                        "Dados copiados."
                    );

                    closeModal(shareModal);

                    return;
                }

                if (
                    shareType === "whatsapp"
                ) {
                    const url =
                        "https://wa.me/?text=" +
                        encodeURIComponent(text);

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                    closeModal(shareModal);

                    return;
                }

                if (shareType === "email") {
                    const subject =
                        encodeURIComponent(
                            "Dados bancários ChromaBank"
                        );

                    const bodyText =
                        encodeURIComponent(text);

                    window.location.href =
                        `mailto:?subject=${subject}&body=${bodyText}`;

                    closeModal(shareModal);
                }
            }
        );
    });


    // ==================================================
    // ARMAZENAMENTO LOCAL
    // ==================================================

    function saveDepositRequest(deposit) {
        const deposits = JSON.parse(
            localStorage.getItem(
                "chromaBankDepositRequests"
            ) || "[]"
        );

        deposits.unshift(deposit);

        localStorage.setItem(
            "chromaBankDepositRequests",
            JSON.stringify(
                deposits.slice(0, 30)
            )
        );
    }


    // ==================================================
    // FOTO E NOME DO PERFIL
    // ==================================================

    function getInitials(name) {
        const parts =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (!parts.length) return "CB";

        if (parts.length === 1) {
            return parts[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    }

    function loadProfileAvatar() {
        if (!profileAvatar) return;

        const savedPhoto =
            localStorage.getItem(
                "chromaBankProfilePhoto"
            );

        const savedProfile =
            localStorage.getItem(
                "chromaBankProfileData"
            );

        let fullName =
            "Vinícius Fernandes";

        if (savedProfile) {
            try {
                const profileData =
                    JSON.parse(savedProfile);

                fullName =
                    profileData.fullName ||
                    fullName;
            } catch {
                localStorage.removeItem(
                    "chromaBankProfileData"
                );
            }
        }

        if (savedPhoto) {
            profileAvatar.innerHTML = `
                <img
                    src="${savedPhoto}"
                    alt="Foto do perfil"
                >
            `;
        } else {
            profileAvatar.textContent =
                getInitials(fullName);
        }
    }

    loadProfileAvatar();


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

            <button
                type="button"
                id="profileLogout"
            >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                Sair da conta
            </button>
        `;

        document.body.appendChild(
            profileMenu
        );

        document
            .getElementById("profileLogout")
            ?.addEventListener(
                "click",
                logout
            );
    }

    function positionProfileMenu() {
        if (
            !profileMenu ||
            !profileButton
        ) {
            return;
        }

        const rect =
            profileButton
                .getBoundingClientRect();

        profileMenu.style.top =
            `${rect.bottom + 10}px`;

        profileMenu.style.right =
            `${
                window.innerWidth -
                rect.right
            }px`;
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

    document.addEventListener(
        "click",
        (event) => {

            if (
                profileMenu &&
                !profileMenu.contains(
                    event.target
                ) &&
                !profileButton?.contains(
                    event.target
                )
            ) {
                profileMenu.classList.remove(
                    "active"
                );
            }
        }
    );

    window.addEventListener("resize", () => {
        if (
            profileMenu
                ?.classList
                .contains("active")
        ) {
            positionProfileMenu();
        }
    });


    // ==================================================
    // DICAS DE SEGURANÇA
    // ==================================================

    securityHelpButton?.addEventListener(
        "click",
        () => {

            window.alert(
                [
                    "Dicas de segurança:",
                    "",
                    "• Confira sempre agência e conta.",
                    "• Não compartilhe senhas ou códigos.",
                    "• Desconfie de cobranças para liberar depósitos.",
                    "• Utilize somente os canais oficiais."
                ].join("\n")
            );
        }
    );


    // ==================================================
    // TECLA ESC
    // ==================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") return;

            closeSidebar();
            closeAllModals();

            profileMenu
                ?.classList
                .remove("active");
        }
    );


    // ==================================================
    // LOGOUT
    // ==================================================

    function logout() {
        const confirmed =
            window.confirm(
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