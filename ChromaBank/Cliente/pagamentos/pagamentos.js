// ==================================================
// CHROMABANK — PAGAMENTOS
// Arquivo: pagamentos.js
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

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Favoritos
    const favoritePayments =
        document.querySelectorAll(".favorite-payment");

    // Boleto
    const barcodeForm =
        document.getElementById("barcodeForm");

    const barcodeInput =
        document.getElementById("barcodeInput");

    const barcodePaymentDate =
        document.getElementById("barcodePaymentDate");

    const billPreview =
        document.getElementById("billPreview");

    const billCompany =
        document.getElementById("billCompany");

    const billCategory =
        document.getElementById("billCategory");

    const billAmount =
        document.getElementById("billAmount");

    const billDueDate =
        document.getElementById("billDueDate");

    // Scanner
    const simulateScanButton =
        document.getElementById("simulateScanButton");

    // Conta
    const utilityBillForm =
        document.getElementById("utilityBillForm");

    const utilityCategory =
        document.getElementById("utilityCategory");

    const utilityCompany =
        document.getElementById("utilityCompany");

    const utilityCode =
        document.getElementById("utilityCode");

    const utilityAmount =
        document.getElementById("utilityAmount");

    const utilityDueDate =
        document.getElementById("utilityDueDate");

    const saveUtilityFavorite =
        document.getElementById("saveUtilityFavorite");

    // Agendamento
    const schedulePaymentForm =
        document.getElementById("schedulePaymentForm");

    const scheduledPaymentCompany =
        document.getElementById("scheduledPaymentCompany");

    const scheduledPaymentCode =
        document.getElementById("scheduledPaymentCode");

    const scheduledPaymentAmount =
        document.getElementById("scheduledPaymentAmount");

    const scheduledPaymentDate =
        document.getElementById("scheduledPaymentDate");

    const recurringPayment =
        document.getElementById("recurringPayment");

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
    let profileMenu = null;
    let toastTimeout = null;
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
            "chromaBankPaymentBalanceVisible",
            String(balanceIsVisible)
        );
    }

    const savedBalancePreference =
        localStorage.getItem(
            "chromaBankPaymentBalanceVisible"
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

        const firstField =
            modal.querySelector(
                "input:not([type='checkbox']), select, button"
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
            closeModal(
                button.closest(".modal")
            );
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

    function formatDateToBR(dateValue) {
        if (!dateValue) return "";

        const [year, month, day] =
            dateValue.split("-");

        return `${day}/${month}/${year}`;
    }

    function getTodayISO() {
        const today = new Date();

        const timezoneOffset =
            today.getTimezoneOffset() * 60000;

        return new Date(
            today.getTime() - timezoneOffset
        )
            .toISOString()
            .split("T")[0];
    }

    function getTomorrowISO() {
        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const timezoneOffset =
            tomorrow.getTimezoneOffset() * 60000;

        return new Date(
            tomorrow.getTime() - timezoneOffset
        )
            .toISOString()
            .split("T")[0];
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

    function validateCode(field) {
        const code =
            onlyNumbers(field?.value || "");

        if (code.length < 44) {
            setFieldError(
                field,
                "Digite um código com pelo menos 44 números."
            );

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
                "Saldo insuficiente para este pagamento."
            );

            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateDate(
        field,
        message,
        allowToday = true
    ) {
        if (!field?.value) {
            setFieldError(field, message);
            return false;
        }

        const selectedDate =
            new Date(`${field.value}T00:00:00`);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (
            allowToday
                ? selectedDate < today
                : selectedDate <= today
        ) {
            setFieldError(
                field,
                allowToday
                    ? "Escolha hoje ou uma data futura."
                    : "Escolha uma data futura."
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


    // ==================================================
    // DATAS PADRÃO
    // ==================================================

    if (barcodePaymentDate) {
        barcodePaymentDate.min = getTodayISO();
        barcodePaymentDate.value = getTodayISO();
    }

    if (utilityDueDate) {
        utilityDueDate.min = getTodayISO();
    }

    if (scheduledPaymentDate) {
        scheduledPaymentDate.min = getTomorrowISO();
    }


    // ==================================================
    // MÁSCARAS
    // ==================================================

    [
        barcodeInput,
        utilityCode,
        scheduledPaymentCode
    ].forEach((field) => {
        field?.addEventListener("input", () => {
            field.value =
                onlyNumbers(field.value)
                    .slice(0, 60);

            clearFieldError(field);
        });
    });

    [
        utilityAmount,
        scheduledPaymentAmount
    ].forEach((field) => {
        field?.addEventListener("input", () => {
            field.value =
                formatCurrencyInput(
                    field.value
                );

            clearFieldError(field);
        });
    });

    document
        .querySelectorAll(".modal input, .modal select")
        .forEach((field) => {

            field.addEventListener("change", () => {
                clearFieldError(field);
            });

            if (
                field !== barcodeInput &&
                field !== utilityCode &&
                field !== scheduledPaymentCode &&
                field !== utilityAmount &&
                field !== scheduledPaymentAmount
            ) {
                field.addEventListener("input", () => {
                    clearFieldError(field);
                });
            }
        });


    // ==================================================
    // PRÉVIA DO BOLETO
    // ==================================================

    const demoBills = [
        {
            company: "Energia Paulista",
            category: "Conta de energia",
            amount: "R$ 186,40",
            dueDate: "05/08/2026"
        },
        {
            company: "Águas do Município",
            category: "Conta de água",
            amount: "R$ 92,70",
            dueDate: "08/08/2026"
        },
        {
            company: "Chroma Telecom",
            category: "Internet residencial",
            amount: "R$ 129,90",
            dueDate: "10/08/2026"
        },
        {
            company: "Faculdade Digital",
            category: "Mensalidade",
            amount: "R$ 450,00",
            dueDate: "12/08/2026"
        }
    ];

    function showBillPreview(data) {
        if (
            !billPreview ||
            !billCompany ||
            !billCategory ||
            !billAmount ||
            !billDueDate
        ) {
            return;
        }

        billCompany.textContent =
            data.company;

        billCategory.textContent =
            data.category;

        billAmount.textContent =
            data.amount;

        billDueDate.textContent =
            data.dueDate;

        billPreview.hidden = false;
    }

    barcodeInput?.addEventListener("input", () => {
        const code =
            onlyNumbers(barcodeInput.value);

        if (code.length >= 44) {
            const index =
                Number(code.slice(-1)) %
                demoBills.length;

            showBillPreview(
                demoBills[index]
            );
        } else if (billPreview) {
            billPreview.hidden = true;
        }
    });


    // ==================================================
    // CONTAS FAVORITAS
    // ==================================================

    favoritePayments.forEach((button) => {
        button.addEventListener("click", () => {

            if (barcodeInput) {
                barcodeInput.value =
                    button.dataset.code || "";
            }

            const data = {
                company:
                    button.dataset.company ||
                    "Empresa beneficiária",

                category:
                    button.dataset.category ||
                    "Conta",

                amount:
                    `R$ ${button.dataset.amount || "0,00"}`,

                dueDate:
                    "10/08/2026"
            };

            showBillPreview(data);

            openModal("barcodeModal");

            showToast(
                `${data.company} selecionada.`
            );
        });
    });


    // ==================================================
    // PAGAR BOLETO
    // ==================================================

    barcodeForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const codeIsValid =
                validateCode(barcodeInput);

            const dateIsValid =
                validateDate(
                    barcodePaymentDate,
                    "Escolha a data do pagamento."
                );

            if (!codeIsValid || !dateIsValid) {
                return;
            }

            const submitButton =
                barcodeForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Processando..."
            );

            setTimeout(() => {

                const payment = {
                    type: "barcode",
                    code:
                        barcodeInput.value,
                    company:
                        billCompany?.textContent ||
                        "Boleto bancário",
                    amount:
                        billAmount?.textContent ||
                        "R$ 0,00",
                    date:
                        barcodePaymentDate.value,
                    createdAt:
                        new Date().toISOString()
                };

                savePayment(payment);

                showToast(
                    `Pagamento de ${payment.amount} realizado com sucesso.`
                );

                barcodeForm.reset();

                if (barcodePaymentDate) {
                    barcodePaymentDate.value =
                        getTodayISO();
                }

                if (billPreview) {
                    billPreview.hidden = true;
                }

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    document.getElementById(
                        "barcodeModal"
                    )
                );

            }, 1500);
        }
    );


    // ==================================================
    // ESCANEAR BOLETO
    // ==================================================

    simulateScanButton?.addEventListener(
        "click",
        () => {

            setLoadingState(
                simulateScanButton,
                "Lendo código..."
            );

            setTimeout(() => {

                const scannedCode =
                    "836600000015843201382026608120081237459321080019";

                if (barcodeInput) {
                    barcodeInput.value =
                        scannedCode;
                }

                showBillPreview({
                    company:
                        "Energia Paulista",
                    category:
                        "Conta de energia",
                    amount:
                        "R$ 186,40",
                    dueDate:
                        "05/08/2026"
                });

                restoreButtonState(
                    simulateScanButton
                );

                closeModal(
                    document.getElementById(
                        "scanModal"
                    )
                );

                openModal("barcodeModal");

                showToast(
                    "Código de barras lido com sucesso."
                );

            }, 1600);
        }
    );


    // ==================================================
    // PAGAR CONTA
    // ==================================================

    utilityBillForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !validateSelect(
                    utilityCategory,
                    "Selecione a categoria."
                )
            ) {
                isValid = false;
            }

            if (
                !validateRequiredText(
                    utilityCompany,
                    "Informe o nome da empresa.",
                    3
                )
            ) {
                isValid = false;
            }

            if (!validateCode(utilityCode)) {
                isValid = false;
            }

            if (!validateAmount(utilityAmount)) {
                isValid = false;
            }

            if (
                !validateDate(
                    utilityDueDate,
                    "Escolha o vencimento."
                )
            ) {
                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                utilityBillForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Pagando..."
            );

            const amount =
                utilityAmount.value;

            const company =
                utilityCompany.value.trim();

            setTimeout(() => {

                const payment = {
                    type: "utility",
                    category:
                        utilityCategory.value,
                    company,
                    code:
                        utilityCode.value,
                    amount,
                    dueDate:
                        utilityDueDate.value,
                    favorite:
                        Boolean(
                            saveUtilityFavorite?.checked
                        ),
                    createdAt:
                        new Date().toISOString()
                };

                savePayment(payment);

                if (payment.favorite) {
                    saveFavoritePayment(payment);
                }

                showToast(
                    payment.favorite
                        ? `Conta de R$ ${amount} paga e salva nos favoritos.`
                        : `Conta de R$ ${amount} paga com sucesso.`
                );

                utilityBillForm.reset();

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    document.getElementById(
                        "utilityBillModal"
                    )
                );

            }, 1500);
        }
    );


    // ==================================================
    // AGENDAR PAGAMENTO
    // ==================================================

    schedulePaymentForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !validateRequiredText(
                    scheduledPaymentCompany,
                    "Informe o beneficiário.",
                    3
                )
            ) {
                isValid = false;
            }

            if (
                !validateCode(
                    scheduledPaymentCode
                )
            ) {
                isValid = false;
            }

            if (
                !validateAmount(
                    scheduledPaymentAmount
                )
            ) {
                isValid = false;
            }

            if (
                !validateDate(
                    scheduledPaymentDate,
                    "Escolha a data do pagamento.",
                    false
                )
            ) {
                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                schedulePaymentForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Agendando..."
            );

            const schedule = {
                company:
                    scheduledPaymentCompany
                        .value
                        .trim(),

                code:
                    scheduledPaymentCode.value,

                amount:
                    scheduledPaymentAmount.value,

                date:
                    scheduledPaymentDate.value,

                recurring:
                    Boolean(
                        recurringPayment?.checked
                    ),

                createdAt:
                    new Date().toISOString()
            };

            setTimeout(() => {

                saveScheduledPayment(
                    schedule
                );

                showToast(
                    schedule.recurring
                        ? "Pagamento recorrente agendado."
                        : "Pagamento agendado com sucesso."
                );

                schedulePaymentForm.reset();

                if (scheduledPaymentDate) {
                    scheduledPaymentDate.min =
                        getTomorrowISO();
                }

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    document.getElementById(
                        "schedulePaymentModal"
                    )
                );

            }, 1400);
        }
    );


    // ==================================================
    // SALVAR DADOS DE DEMONSTRAÇÃO
    // ==================================================

    function savePayment(payment) {
        const payments = JSON.parse(
            localStorage.getItem(
                "chromaBankDemoPayments"
            ) || "[]"
        );

        payments.unshift(payment);

        localStorage.setItem(
            "chromaBankDemoPayments",
            JSON.stringify(
                payments.slice(0, 30)
            )
        );
    }

    function saveScheduledPayment(schedule) {
        const schedules = JSON.parse(
            localStorage.getItem(
                "chromaBankScheduledPayments"
            ) || "[]"
        );

        schedules.unshift(schedule);

        localStorage.setItem(
            "chromaBankScheduledPayments",
            JSON.stringify(
                schedules.slice(0, 20)
            )
        );
    }

    function saveFavoritePayment(payment) {
        const favorites = JSON.parse(
            localStorage.getItem(
                "chromaBankFavoritePayments"
            ) || "[]"
        );

        favorites.unshift({
            company:
                payment.company,
            category:
                payment.category,
            code:
                payment.code,
            amount:
                payment.amount
        });

        localStorage.setItem(
            "chromaBankFavoritePayments",
            JSON.stringify(
                favorites.slice(0, 20)
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

            scheduleDropdown.style.left =
                "auto";
        } else {
            scheduleDropdown.style.left =
                `${rect.left}px`;

            scheduleDropdown.style.right =
                "auto";
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

                const company =
                    selectedSchedule
                        ?.querySelector(
                            ".schedule-info strong"
                        )
                        ?.textContent.trim() ||
                    "Pagamento";

                if (
                    button.classList.contains(
                        "danger-action"
                    )
                ) {
                    const confirmed =
                        window.confirm(
                            `Deseja cancelar o pagamento de ${company}?`
                        );

                    if (!confirmed) return;

                    selectedSchedule?.remove();

                    showToast(
                        "Pagamento agendado cancelado."
                    );
                } else {
                    showToast(
                        `${action}: ${company}`
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