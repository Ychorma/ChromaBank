// ==================================================
// CHROMABANK — EMPRÉSTIMOS
// Arquivo: emprestimos.js
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


    // ==================================================
    // SIDEBAR
    // ==================================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("menuButton");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const logoutButton =
        document.getElementById("logoutButton");


    // ==================================================
    // SIMULADOR
    // ==================================================

    const loanSimulationForm =
        document.getElementById("loanSimulationForm");

    const loanAmount =
        document.getElementById("loanAmount");

    const loanInstallments =
        document.getElementById("loanInstallments");

    const firstPaymentDate =
        document.getElementById("firstPaymentDate");

    const loanAmountDisplay =
        document.getElementById("loanAmountDisplay");

    const installmentsDisplay =
        document.getElementById("installmentsDisplay");

    const monthlyRate =
        document.getElementById("monthlyRate");

    const installmentValue =
        document.getElementById("installmentValue");

    const totalLoanValue =
        document.getElementById("totalLoanValue");

    const firstDueDate =
        document.getElementById("firstDueDate");


    // ==================================================
    // MODAIS
    // ==================================================

    const modals =
        document.querySelectorAll(".modal");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    const loanConfirmationModal =
        document.getElementById("loanConfirmationModal");

    const loanSuccessModal =
        document.getElementById("loanSuccessModal");

    const loanDetailsModal =
        document.getElementById("loanDetailsModal");


    // ==================================================
    // RESUMO DO MODAL
    // ==================================================

    const modalLoanAmount =
        document.getElementById("modalLoanAmount");

    const modalInstallments =
        document.getElementById("modalInstallments");

    const modalMonthlyRate =
        document.getElementById("modalMonthlyRate");

    const modalTotalValue =
        document.getElementById("modalTotalValue");

    const modalFirstDueDate =
        document.getElementById("modalFirstDueDate");

    const loanTermsCheckbox =
        document.getElementById("loanTermsCheckbox");

    const confirmLoanButton =
        document.getElementById("confirmLoanButton");

    const loanRequestCode =
        document.getElementById("loanRequestCode");


    // ==================================================
    // OFERTAS
    // ==================================================

    const offerButtons =
        document.querySelectorAll("[data-select-offer]");

    const loanOfferCards =
        document.querySelectorAll(".loan-offer-card");


    // ==================================================
    // EMPRÉSTIMOS ATIVOS
    // ==================================================

    const loanDetailsButtons =
        document.querySelectorAll("[data-loan-details]");

    const anticipateInstallmentsButton =
        document.getElementById(
            "anticipateInstallmentsButton"
        );

    const viewLoanHistoryButton =
        document.getElementById(
            "viewLoanHistoryButton"
        );


    // ==================================================
    // FAQ
    // ==================================================

    const faqQuestions =
        document.querySelectorAll(".faq-question");


    // ==================================================
    // TOAST
    // ==================================================

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    // ==================================================
    // ESTADO
    // ==================================================

    let toastTimeout = null;

    let selectedLoanType = "personal";

    let simulation = {
        amount: 10000,
        installments: 12,
        monthlyRate: 1.79,
        installmentValue: 0,
        totalValue: 0,
        firstPaymentDays: 30,
        firstDueDate: ""
    };


    // ==================================================
    // CONFIGURAÇÕES DOS EMPRÉSTIMOS
    // ==================================================

    const loanTypes = {
        personal: {
            name: "Empréstimo pessoal",
            rate: 1.79,
            maximum: 25000,
            minimum: 1000,
            maximumInstallments: 48
        },

        salary: {
            name: "Antecipação de salário",
            rate: 1.29,
            maximum: 6000,
            minimum: 500,
            maximumInstallments: 3
        },

        secured: {
            name: "Crédito com garantia",
            rate: 0.99,
            maximum: 100000,
            minimum: 5000,
            maximumInstallments: 60
        }
    };


    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function formatCurrency(value) {

        return Number(value).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function formatPercentage(value) {

        return Number(value)
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
    }

    function formatDate(date) {

        return date.toLocaleDateString(
            "pt-BR"
        );
    }

    function calculateFirstDueDate(days) {

        const date = new Date();

        date.setDate(
            date.getDate() + Number(days)
        );

        return date;
    }

    function generateRequestCode() {

        const randomNumber =
            Math.floor(
                100000 + Math.random() * 900000
            );

        return `#CB-${randomNumber}`;
    }

    function setLoadingState(
        button,
        text
    ) {

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


    // ==================================================
    // TOAST
    // ==================================================

    function showToast(
        message,
        type = "success"
    ) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent =
            message;

        const icon =
            toast.querySelector("i");

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

        toastTimeout =
            setTimeout(() => {

                toast.classList.remove(
                    "active"
                );

            }, 2800);
    }


    // ==================================================
    // SIDEBAR RESPONSIVA
    // ==================================================

    function openSidebar() {

        sidebar?.classList.add("active");

        sidebarOverlay?.classList.add(
            "active"
        );

        body.classList.add(
            "sidebar-open"
        );
    }

    function closeSidebar() {

        sidebar?.classList.remove("active");

        sidebarOverlay?.classList.remove(
            "active"
        );

        body.classList.remove(
            "sidebar-open"
        );
    }

    menuButton?.addEventListener(
        "click",
        openSidebar
    );

    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 980) {
                closeSidebar();
            }
        }
    );


    // ==================================================
    // MODAIS
    // ==================================================

    function openModal(modal) {

        if (!modal) return;

        closeAllModals();

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("modal-open");
    }

    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !document.querySelector(
                ".modal.active"
            )
        ) {
            body.classList.remove(
                "modal-open"
            );
        }
    }

    function closeAllModals() {

        modals.forEach((modal) => {

            modal.classList.remove("active");

            modal.setAttribute(
                "aria-hidden",
                "true"
            );
        });

        body.classList.remove("modal-open");
    }

    closeModalButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.closest(".modal")
                );
            }
        );
    });


    // ==================================================
    // CÁLCULO DO EMPRÉSTIMO
    // Sistema Price
    // ==================================================

    function calculateInstallment(
        amount,
        installments,
        monthlyRateValue
    ) {

        const rate =
            monthlyRateValue / 100;

        if (rate === 0) {
            return amount / installments;
        }

        const power =
            Math.pow(
                1 + rate,
                installments
            );

        return amount *
            (
                rate * power
            ) /
            (
                power - 1
            );
    }

    function updateRangeBackground(
        rangeInput
    ) {

        if (!rangeInput) return;

        const minimum =
            Number(rangeInput.min);

        const maximum =
            Number(rangeInput.max);

        const value =
            Number(rangeInput.value);

        const percentage =
            (
                (value - minimum) /
                (maximum - minimum)
            ) * 100;

        rangeInput.style.background = `
            linear-gradient(
                90deg,
                var(--primary-light) 0%,
                var(--primary) ${percentage}%,
                rgba(255,255,255,.08) ${percentage}%,
                rgba(255,255,255,.08) 100%
            )
        `;
    }

    function updateSimulation() {

        if (
            !loanAmount ||
            !loanInstallments
        ) {
            return;
        }

        const amount =
            Number(loanAmount.value);

        const installments =
            Number(loanInstallments.value);

        const loanType =
            loanTypes[selectedLoanType];

        const rate =
            loanType?.rate || 1.79;

        const paymentValue =
            calculateInstallment(
                amount,
                installments,
                rate
            );

        const totalValue =
            paymentValue * installments;

        const paymentDays =
            Number(
                firstPaymentDate?.value || 30
            );

        const dueDate =
            calculateFirstDueDate(
                paymentDays
            );

        simulation = {
            amount,
            installments,
            monthlyRate: rate,
            installmentValue: paymentValue,
            totalValue,
            firstPaymentDays: paymentDays,
            firstDueDate: formatDate(dueDate)
        };

        if (loanAmountDisplay) {
            loanAmountDisplay.textContent =
                formatCurrency(amount);
        }

        if (installmentsDisplay) {
            installmentsDisplay.textContent =
                `${installments}x`;
        }

        if (monthlyRate) {
            monthlyRate.textContent =
                `${formatPercentage(rate)}% a.m.`;
        }

        if (installmentValue) {
            installmentValue.textContent =
                formatCurrency(paymentValue);
        }

        if (totalLoanValue) {
            totalLoanValue.textContent =
                formatCurrency(totalValue);
        }

        if (firstDueDate) {
            firstDueDate.textContent =
                formatDate(dueDate);
        }

        updateRangeBackground(loanAmount);
        updateRangeBackground(
            loanInstallments
        );
    }


    // ==================================================
    // EVENTOS DO SIMULADOR
    // ==================================================

    loanAmount?.addEventListener(
        "input",
        updateSimulation
    );

    loanInstallments?.addEventListener(
        "input",
        updateSimulation
    );

    firstPaymentDate?.addEventListener(
        "change",
        updateSimulation
    );


    // ==================================================
    // ABRIR CONFIRMAÇÃO
    // ==================================================

    loanSimulationForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            updateSimulation();

            if (modalLoanAmount) {

                modalLoanAmount.textContent =
                    formatCurrency(
                        simulation.amount
                    );
            }

            if (modalInstallments) {

                modalInstallments.textContent =
                    `${simulation.installments}x de ${
                        formatCurrency(
                            simulation.installmentValue
                        )
                    }`;
            }

            if (modalMonthlyRate) {

                modalMonthlyRate.textContent =
                    `${formatPercentage(
                        simulation.monthlyRate
                    )}% a.m.`;
            }

            if (modalTotalValue) {

                modalTotalValue.textContent =
                    formatCurrency(
                        simulation.totalValue
                    );
            }

            if (modalFirstDueDate) {

                modalFirstDueDate.textContent =
                    simulation.firstDueDate;
            }

            if (loanTermsCheckbox) {
                loanTermsCheckbox.checked =
                    false;
            }

            if (confirmLoanButton) {
                confirmLoanButton.disabled =
                    true;
            }

            openModal(
                loanConfirmationModal
            );
        }
    );


    // ==================================================
    // ACEITE DOS TERMOS
    // ==================================================

    loanTermsCheckbox?.addEventListener(
        "change",
        () => {

            if (confirmLoanButton) {

                confirmLoanButton.disabled =
                    !loanTermsCheckbox.checked;
            }
        }
    );


    // ==================================================
    // NOTIFICAÇÃO GLOBAL
    // ==================================================

    function addLoanNotification({
        title,
        message,
        type = "loan"
    }) {

        const storageKey =
            "chromaBankNotifications";

        let notifications = [];

        try {

            notifications =
                JSON.parse(
                    localStorage.getItem(
                        storageKey
                    )
                ) || [];

        } catch {

            notifications = [];
        }

        const notification = {
            id: Date.now(),
            type,
            title,
            message,
            time: "Agora",
            read: false
        };

        notifications.unshift(
            notification
        );

        localStorage.setItem(
            storageKey,
            JSON.stringify(notifications)
        );
    }


    // ==================================================
    // CONFIRMAR EMPRÉSTIMO
    // ==================================================

    confirmLoanButton?.addEventListener(
        "click",
        () => {

            if (
                !loanTermsCheckbox?.checked
            ) {
                return;
            }

            setLoadingState(
                confirmLoanButton,
                "Enviando solicitação..."
            );

            const requestCode =
                generateRequestCode();

            const loanRequest = {
                id: Date.now(),
                requestCode,
                loanType:
                    selectedLoanType,

                loanName:
                    loanTypes[selectedLoanType]
                        ?.name ||
                    "Empréstimo pessoal",

                amount:
                    simulation.amount,

                installments:
                    simulation.installments,

                monthlyRate:
                    simulation.monthlyRate,

                installmentValue:
                    simulation.installmentValue,

                totalValue:
                    simulation.totalValue,

                firstDueDate:
                    simulation.firstDueDate,

                status:
                    "Em análise",

                requestedAt:
                    new Date().toISOString()
            };

            setTimeout(() => {

                let requests = [];

                try {

                    requests =
                        JSON.parse(
                            localStorage.getItem(
                                "chromaBankLoanRequests"
                            )
                        ) || [];

                } catch {

                    requests = [];
                }

                requests.unshift(
                    loanRequest
                );

                localStorage.setItem(
                    "chromaBankLoanRequests",
                    JSON.stringify(requests)
                );

                addLoanNotification({
                    type: "loan",
                    title:
                        "Empréstimo solicitado",

                    message:
                        `Sua solicitação de ${
                            formatCurrency(
                                simulation.amount
                            )
                        } está em análise.`
                });

                if (loanRequestCode) {
                    loanRequestCode.textContent =
                        requestCode;
                }

                restoreButtonState(
                    confirmLoanButton
                );

                if (confirmLoanButton) {
                    confirmLoanButton.disabled =
                        true;
                }

                closeModal(
                    loanConfirmationModal
                );

                openModal(
                    loanSuccessModal
                );

            }, 1300);
        }
    );


    // ==================================================
    // SELEÇÃO DE OFERTAS
    // ==================================================

    function selectLoanType(type) {

        const loanType =
            loanTypes[type];

        if (!loanType) return;

        selectedLoanType = type;

        loanOfferCards.forEach((card) => {

            card.classList.toggle(
                "featured",
                card.dataset.loanType === type
            );
        });

        if (loanAmount) {

            loanAmount.min =
                loanType.minimum;

            loanAmount.max =
                loanType.maximum;

            if (
                Number(loanAmount.value) >
                loanType.maximum
            ) {
                loanAmount.value =
                    loanType.maximum;
            }

            if (
                Number(loanAmount.value) <
                loanType.minimum
            ) {
                loanAmount.value =
                    loanType.minimum;
            }
        }

        if (loanInstallments) {

            loanInstallments.max =
                loanType
                    .maximumInstallments;

            if (
                Number(
                    loanInstallments.value
                ) >
                loanType
                    .maximumInstallments
            ) {
                loanInstallments.value =
                    loanType
                        .maximumInstallments;
            }
        }

        updateSimulation();

        document
            .querySelector(".loan-simulator")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        showToast(
            `${loanType.name} selecionado.`
        );
    }

    offerButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                selectLoanType(
                    button.dataset.selectOffer
                );
            }
        );
    });


    // ==================================================
    // DETALHES DO EMPRÉSTIMO ATIVO
    // ==================================================

    loanDetailsButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openModal(
                    loanDetailsModal
                );
            }
        );
    });

    anticipateInstallmentsButton
        ?.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Deseja simular a antecipação das parcelas restantes?"
                    );

                if (!confirmed) return;

                closeModal(
                    loanDetailsModal
                );

                showToast(
                    "Simulação de antecipação iniciada."
                );
            }
        );


    // ==================================================
    // HISTÓRICO
    // ==================================================

    viewLoanHistoryButton
        ?.addEventListener(
            "click",
            () => {

                const savedRequests =
                    localStorage.getItem(
                        "chromaBankLoanRequests"
                    );

                let requests = [];

                try {

                    requests =
                        JSON.parse(
                            savedRequests
                        ) || [];

                } catch {

                    requests = [];
                }

                if (!requests.length) {

                    window.alert(
                        [
                            "Histórico de empréstimos",
                            "",
                            "Nenhuma solicitação recente encontrada."
                        ].join("\n")
                    );

                    return;
                }

                const historyText =
                    requests
                        .slice(0, 5)
                        .map((request) => {

                            const date =
                                new Date(
                                    request.requestedAt
                                )
                                    .toLocaleDateString(
                                        "pt-BR"
                                    );

                            return [
                                request.requestCode,
                                request.loanName,
                                formatCurrency(
                                    request.amount
                                ),
                                request.status,
                                date
                            ].join(" — ");
                        })
                        .join("\n");

                window.alert(
                    [
                        "Histórico de empréstimos",
                        "",
                        historyText
                    ].join("\n")
                );
            }
        );


    // ==================================================
    // FAQ
    // ==================================================

    faqQuestions.forEach((question) => {

        question.addEventListener(
            "click",
            () => {

                const item =
                    question.closest(
                        ".faq-item"
                    );

                const wasActive =
                    item?.classList.contains(
                        "active"
                    );

                document
                    .querySelectorAll(
                        ".faq-item.active"
                    )
                    .forEach(
                        activeItem => {

                            activeItem.classList.remove(
                                "active"
                            );
                        }
                    );

                if (!wasActive) {
                    item?.classList.add(
                        "active"
                    );
                }
            }
        );
    });


    // ==================================================
    // TECLA ESC
    // ==================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closeSidebar();
            closeAllModals();
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


    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    updateSimulation();

});