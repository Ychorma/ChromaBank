// ==================================================
// CHROMABANK — TRANSFERÊNCIAS
// Arquivo: transferencias.js
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
    const toggleBalanceButton =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    // Acesso ao PIX
    const openPixButton =
        document.getElementById("openPixButton");

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Favoritos
    const favoriteItems =
        document.querySelectorAll(".favorite-item");

    // Formulário para outro banco
    const bankTransferForm =
        document.getElementById("bankTransferForm");

    const recipientName =
        document.getElementById("recipientName");

    const recipientDocument =
        document.getElementById("recipientDocument");

    const recipientBank =
        document.getElementById("recipientBank");

    const recipientAgency =
        document.getElementById("recipientAgency");

    const recipientAccount =
        document.getElementById("recipientAccount");

    const accountType =
        document.getElementById("accountType");

    const transferAmount =
        document.getElementById("transferAmount");

    const transferDescription =
        document.getElementById("transferDescription");

    const saveRecipient =
        document.getElementById("saveRecipient");

    // Entre contas ChromaBank
    const chromaTransferForm =
        document.getElementById("chromaTransferForm");

    const chromaAgency =
        document.getElementById("chromaAgency");

    const chromaAccount =
        document.getElementById("chromaAccount");

    const chromaAmount =
        document.getElementById("chromaAmount");

    const chromaDescription =
        document.getElementById("chromaDescription");

    // Agendamento
    const scheduledTransferForm =
        document.getElementById("scheduledTransferForm");

    const scheduledRecipient =
        document.getElementById("scheduledRecipient");

    const scheduledBank =
        document.getElementById("scheduledBank");

    const scheduledDate =
        document.getElementById("scheduledDate");

    const scheduledAmount =
        document.getElementById("scheduledAmount");

    const recurringTransfer =
        document.getElementById("recurringTransfer");

    // Menu dos agendamentos
    const scheduleDropdown =
        document.getElementById("scheduleDropdown");

    const scheduleMenuButtons =
        document.querySelectorAll(".schedule-menu-button");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let balanceIsVisible = true;
    let toastTimeout = null;
    let profileMenu = null;
    let selectedSchedule = null;


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
            "chromaBankTransferBalanceVisible",
            String(balanceIsVisible)
        );
    }

    const savedBalancePreference =
        localStorage.getItem(
            "chromaBankTransferBalanceVisible"
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
    // IR PARA A PÁGINA PIX
    // ==================================================

    openPixButton?.addEventListener("click", () => {
        window.location.href = "../pix/pix.html";
    });


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

        const firstField =
            modal.querySelector(
                "input:not([type='checkbox']), select"
            );

        setTimeout(() => {
            firstField?.focus();
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
            openModal(button.dataset.openModal);
        });
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal"));
        });
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
    // FUNÇÕES AUXILIARES
    // ==================================================

    function onlyNumbers(value) {
        return value.replace(/\D/g, "");
    }

    function formatCurrencyInput(value) {
        const digits = onlyNumbers(value);

        if (!digits) return "";

        const number = Number(digits) / 100;

        return number.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function currencyToNumber(value) {
        if (!value) return 0;

        return Number(
            value
                .replace(/\./g, "")
                .replace(",", ".")
        );
    }

    function formatDocument(value) {
        const digits = onlyNumbers(value).slice(0, 14);

        if (digits.length <= 11) {
            return digits
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }

        return digits
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
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

    function validateRequiredText(
        field,
        message,
        minimumLength = 2
    ) {
        if (
            !field ||
            field.value.trim().length < minimumLength
        ) {
            setFieldError(field, message);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateSelect(field, message) {
        if (!field || !field.value) {
            setFieldError(field, message);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateAmount(field) {
        const amount =
            currencyToNumber(field?.value || "");

        if (!amount || amount <= 0) {
            setFieldError(
                field,
                "Digite um valor maior que zero."
            );

            return false;
        }

        if (amount > 4856.90) {
            setFieldError(
                field,
                "Saldo insuficiente para esta transferência."
            );

            return false;
        }

        clearFieldError(field);
        return true;
    }

    function setLoadingState(
        button,
        loadingText
    ) {
        button.disabled = true;

        button.dataset.originalContent =
            button.innerHTML;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${loadingText}
        `;
    }

    function restoreButtonState(button) {
        button.disabled = false;

        button.innerHTML =
            button.dataset.originalContent ||
            "Continuar";
    }


    // ==================================================
    // MÁSCARAS
    // ==================================================

    recipientDocument?.addEventListener("input", () => {
        recipientDocument.value =
            formatDocument(
                recipientDocument.value
            );

        clearFieldError(recipientDocument);
    });

    recipientAgency?.addEventListener("input", () => {
        recipientAgency.value =
            onlyNumbers(
                recipientAgency.value
            ).slice(0, 6);

        clearFieldError(recipientAgency);
    });

    recipientAccount?.addEventListener("input", () => {
        recipientAccount.value =
            recipientAccount.value
                .replace(/[^0-9-]/g, "")
                .slice(0, 12);

        clearFieldError(recipientAccount);
    });

    chromaAgency?.addEventListener("input", () => {
        chromaAgency.value =
            onlyNumbers(
                chromaAgency.value
            ).slice(0, 4);

        clearFieldError(chromaAgency);
    });

    chromaAccount?.addEventListener("input", () => {
        chromaAccount.value =
            chromaAccount.value
                .replace(/[^0-9-]/g, "")
                .slice(0, 10);

        clearFieldError(chromaAccount);
    });

    [
        transferAmount,
        chromaAmount,
        scheduledAmount
    ].forEach((field) => {
        field?.addEventListener("input", () => {
            field.value =
                formatCurrencyInput(field.value);

            clearFieldError(field);
        });
    });

    const allFields =
        document.querySelectorAll(
            ".modal input, .modal select"
        );

    allFields.forEach((field) => {
        field.addEventListener("change", () => {
            clearFieldError(field);
        });

        if (
            field !== recipientDocument &&
            field !== recipientAgency &&
            field !== recipientAccount &&
            field !== chromaAgency &&
            field !== chromaAccount &&
            field !== transferAmount &&
            field !== chromaAmount &&
            field !== scheduledAmount
        ) {
            field.addEventListener("input", () => {
                clearFieldError(field);
            });
        }
    });


    // ==================================================
    // FAVORITOS
    // ==================================================

    const bankNameToCode = {
        "Banco do Brasil": "001",
        "Santander": "033",
        "Caixa Econômica Federal": "104",
        "Bradesco": "237",
        "Itaú": "341",
        "Nubank": "260",
        "Banco Inter": "077"
    };

    favoriteItems.forEach((item) => {
        item.addEventListener("click", () => {
            if (recipientName) {
                recipientName.value =
                    item.dataset.recipientName || "";
            }

            if (recipientDocument) {
                recipientDocument.value =
                    formatDocument(
                        item.dataset.recipientDocument || ""
                    );
            }

            if (recipientBank) {
                const bankName =
                    item.dataset.recipientBank || "";

                recipientBank.value =
                    bankNameToCode[bankName] || "";
            }

            if (recipientAgency) {
                recipientAgency.value =
                    item.dataset.recipientAgency || "";
            }

            if (recipientAccount) {
                recipientAccount.value =
                    item.dataset.recipientAccount || "";
            }

            if (accountType) {
                accountType.value = "checking";
            }

            openModal("bankTransferModal");

            showToast(
                `${item.dataset.recipientName} selecionado.`
            );
        });
    });


    // ==================================================
    // TRANSFERÊNCIA PARA OUTRO BANCO
    // ==================================================

    bankTransferForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !validateRequiredText(
                    recipientName,
                    "Informe o nome completo do destinatário.",
                    5
                )
            ) {
                isValid = false;
            }

            const documentDigits =
                onlyNumbers(
                    recipientDocument?.value || ""
                );

            if (
                documentDigits.length !== 11 &&
                documentDigits.length !== 14
            ) {
                setFieldError(
                    recipientDocument,
                    "Digite um CPF ou CNPJ válido."
                );

                isValid = false;
            } else {
                clearFieldError(recipientDocument);
            }

            if (
                !validateSelect(
                    recipientBank,
                    "Selecione o banco."
                )
            ) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    recipientAgency,
                    "Informe a agência."
                )
            ) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    recipientAccount,
                    "Informe a conta."
                )
            ) {
                isValid = false;
            }

            if (
                !validateSelect(
                    accountType,
                    "Selecione o tipo de conta."
                )
            ) {
                isValid = false;
            }

            if (!validateAmount(transferAmount)) {
                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                bankTransferForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Processando..."
            );

            const amount = transferAmount.value;
            const recipient = recipientName.value.trim();

            setTimeout(() => {

                const transaction = {
                    type: "bank",
                    recipient,
                    document:
                        recipientDocument.value,
                    bank:
                        recipientBank.value,
                    agency:
                        recipientAgency.value,
                    account:
                        recipientAccount.value,
                    accountType:
                        accountType.value,
                    amount,
                    description:
                        transferDescription.value.trim(),
                    date:
                        new Date().toISOString()
                };

                saveDemoTransfer(transaction);

                if (saveRecipient?.checked) {
                    showToast(
                        `Transferência de R$ ${amount} realizada e destinatário salvo.`
                    );
                } else {
                    showToast(
                        `Transferência de R$ ${amount} realizada com sucesso.`
                    );
                }

                bankTransferForm.reset();

                restoreButtonState(submitButton);

                closeModal(
                    document.getElementById(
                        "bankTransferModal"
                    )
                );

            }, 1500);
        }
    );


    // ==================================================
    // TRANSFERÊNCIA ENTRE CONTAS CHROMABANK
    // ==================================================

    chromaTransferForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                onlyNumbers(
                    chromaAgency?.value || ""
                ).length !== 4
            ) {
                setFieldError(
                    chromaAgency,
                    "Digite uma agência com 4 números."
                );

                isValid = false;
            } else {
                clearFieldError(chromaAgency);
            }

            if (
                onlyNumbers(
                    chromaAccount?.value || ""
                ).length < 6
            ) {
                setFieldError(
                    chromaAccount,
                    "Digite uma conta válida."
                );

                isValid = false;
            } else {
                clearFieldError(chromaAccount);
            }

            if (!validateAmount(chromaAmount)) {
                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                chromaTransferForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Transferindo..."
            );

            const amount = chromaAmount.value;

            setTimeout(() => {

                saveDemoTransfer({
                    type: "chroma",
                    agency:
                        chromaAgency.value,
                    account:
                        chromaAccount.value,
                    amount,
                    description:
                        chromaDescription.value.trim(),
                    date:
                        new Date().toISOString()
                });

                showToast(
                    `Transferência de R$ ${amount} realizada com sucesso.`
                );

                chromaTransferForm.reset();

                restoreButtonState(submitButton);

                closeModal(
                    document.getElementById(
                        "chromaTransferModal"
                    )
                );

            }, 1400);
        }
    );


    // ==================================================
    // TRANSFERÊNCIA AGENDADA
    // ==================================================

    function setMinimumScheduleDate() {
        if (!scheduledDate) return;

        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const minimumDate =
            tomorrow.toISOString().split("T")[0];

        scheduledDate.min = minimumDate;
    }

    setMinimumScheduleDate();

    scheduledTransferForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !validateRequiredText(
                    scheduledRecipient,
                    "Informe o destinatário.",
                    3
                )
            ) {
                isValid = false;
            }

            if (
                !validateSelect(
                    scheduledBank,
                    "Selecione o banco."
                )
            ) {
                isValid = false;
            }

            if (!scheduledDate.value) {
                setFieldError(
                    scheduledDate,
                    "Selecione a data da transferência."
                );

                isValid = false;
            } else {
                const selectedDate =
                    new Date(
                        `${scheduledDate.value}T00:00:00`
                    );

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                if (selectedDate <= today) {
                    setFieldError(
                        scheduledDate,
                        "Escolha uma data futura."
                    );

                    isValid = false;
                } else {
                    clearFieldError(scheduledDate);
                }
            }

            if (!validateAmount(scheduledAmount)) {
                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                scheduledTransferForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Agendando..."
            );

            const scheduledData = {
                recipient:
                    scheduledRecipient.value.trim(),
                bank:
                    scheduledBank.value,
                date:
                    scheduledDate.value,
                amount:
                    scheduledAmount.value,
                recurring:
                    Boolean(recurringTransfer?.checked),
                createdAt:
                    new Date().toISOString()
            };

            setTimeout(() => {

                saveScheduledTransfer(
                    scheduledData
                );

                showToast(
                    recurringTransfer?.checked
                        ? "Transferência recorrente agendada."
                        : "Transferência agendada com sucesso."
                );

                scheduledTransferForm.reset();

                setMinimumScheduleDate();

                restoreButtonState(submitButton);

                closeModal(
                    document.getElementById(
                        "scheduledTransferModal"
                    )
                );

            }, 1400);
        }
    );


    // ==================================================
    // SALVAR DADOS DE DEMONSTRAÇÃO
    // ==================================================

    function saveDemoTransfer(transaction) {
        const transfers = JSON.parse(
            localStorage.getItem(
                "chromaBankDemoTransfers"
            ) || "[]"
        );

        transfers.unshift(transaction);

        localStorage.setItem(
            "chromaBankDemoTransfers",
            JSON.stringify(
                transfers.slice(0, 30)
            )
        );
    }

    function saveScheduledTransfer(schedule) {
        const schedules = JSON.parse(
            localStorage.getItem(
                "chromaBankScheduledTransfers"
            ) || "[]"
        );

        schedules.unshift(schedule);

        localStorage.setItem(
            "chromaBankScheduledTransfers",
            JSON.stringify(
                schedules.slice(0, 20)
            )
        );
    }


    // ==================================================
    // MENU DOS AGENDAMENTOS
    // ==================================================

    function closeScheduleDropdown() {
        scheduleDropdown?.classList.remove(
            "active"
        );

        selectedSchedule = null;
    }

    function positionScheduleDropdown(button) {
        if (!scheduleDropdown) return;

        const rect =
            button.getBoundingClientRect();

        const dropdownWidth = 220;

        scheduleDropdown.style.top =
            `${rect.bottom + 8}px`;

        if (
            rect.left + dropdownWidth >
            window.innerWidth - 15
        ) {
            scheduleDropdown.style.right =
                `${Math.max(
                    window.innerWidth - rect.right,
                    12
                )}px`;

            scheduleDropdown.style.left = "auto";
        } else {
            scheduleDropdown.style.left =
                `${rect.left}px`;

            scheduleDropdown.style.right = "auto";
        }
    }

    scheduleMenuButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            selectedSchedule =
                button.closest(".schedule-item");

            positionScheduleDropdown(button);

            scheduleDropdown?.classList.toggle(
                "active"
            );
        });
    });

    scheduleDropdown
        ?.querySelectorAll("button")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const action =
                    button.textContent.trim();

                const recipient =
                    selectedSchedule
                        ?.querySelector(
                            ".schedule-info strong"
                        )
                        ?.textContent.trim() ||
                    "Agendamento";

                if (
                    button.classList.contains(
                        "danger-action"
                    )
                ) {
                    const confirmed =
                        window.confirm(
                            `Deseja cancelar o agendamento para ${recipient}?`
                        );

                    if (!confirmed) return;

                    selectedSchedule?.remove();

                    showToast(
                        "Agendamento cancelado."
                    );
                } else {
                    showToast(
                        `${action}: ${recipient}`
                    );
                }

                closeScheduleDropdown();
            });
        });

    document.addEventListener("click", (event) => {
        if (
            scheduleDropdown &&
            !scheduleDropdown.contains(event.target)
        ) {
            closeScheduleDropdown();
        }
    });

    window.addEventListener(
        "scroll",
        closeScheduleDropdown,
        { passive: true }
    );


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
        closeScheduleDropdown();

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