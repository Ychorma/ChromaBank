// ==================================================
// CHROMABANK — SEGUROS
// Arquivo: seguros.js
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
    // HERO
    // ==================================================

    const viewInsuranceOptionsButton =
        document.getElementById(
            "viewInsuranceOptionsButton"
        );

    const insuranceOptions =
        document.getElementById(
            "insuranceOptions"
        );


    // ==================================================
    // CARDS E COTAÇÃO
    // ==================================================

    const quoteButtons =
        document.querySelectorAll(
            "[data-open-quote]"
        );

    const coverageAmount =
        document.getElementById(
            "coverageAmount"
        );

    const insurancePlan =
        document.getElementById(
            "insurancePlan"
        );

    const insuranceQuoteForm =
        document.getElementById(
            "insuranceQuoteForm"
        );

    const quoteModalIcon =
        document.getElementById(
            "quoteModalIcon"
        );

    const insuranceQuoteTitle =
        document.getElementById(
            "insuranceQuoteTitle"
        );

    const insuranceQuoteDescription =
        document.getElementById(
            "insuranceQuoteDescription"
        );

    const quoteInsuranceName =
        document.getElementById(
            "quoteInsuranceName"
        );

    const quoteCoverageValue =
        document.getElementById(
            "quoteCoverageValue"
        );

    const quoteMonthlyPrice =
        document.getElementById(
            "quoteMonthlyPrice"
        );


    // ==================================================
    // MODAIS
    // ==================================================

    const modals =
        document.querySelectorAll(".modal");

    const closeModalButtons =
        document.querySelectorAll(
            "[data-close-modal]"
        );

    const insuranceQuoteModal =
        document.getElementById(
            "insuranceQuoteModal"
        );

    const insuranceConfirmationModal =
        document.getElementById(
            "insuranceConfirmationModal"
        );

    const insuranceSuccessModal =
        document.getElementById(
            "insuranceSuccessModal"
        );

    const insuranceDetailsModal =
        document.getElementById(
            "insuranceDetailsModal"
        );


    // ==================================================
    // CONFIRMAÇÃO
    // ==================================================

    const confirmationInsuranceName =
        document.getElementById(
            "confirmationInsuranceName"
        );

    const confirmationPlanName =
        document.getElementById(
            "confirmationPlanName"
        );

    const confirmationCoverageValue =
        document.getElementById(
            "confirmationCoverageValue"
        );

    const confirmationMonthlyPrice =
        document.getElementById(
            "confirmationMonthlyPrice"
        );

    const confirmationFirstCharge =
        document.getElementById(
            "confirmationFirstCharge"
        );

    const insuranceTermsCheckbox =
        document.getElementById(
            "insuranceTermsCheckbox"
        );

    const confirmInsuranceButton =
        document.getElementById(
            "confirmInsuranceButton"
        );

    const insurancePolicyCode =
        document.getElementById(
            "insurancePolicyCode"
        );


    // ==================================================
    // SEGUROS ATIVOS
    // ==================================================

    const activeInsurancesList =
        document.getElementById(
            "activeInsurancesList"
        );

    const viewInsuranceHistoryButton =
        document.getElementById(
            "viewInsuranceHistoryButton"
        );

    const insuranceDetailsList =
        document.getElementById(
            "insuranceDetailsList"
        );

    const requestAssistanceButton =
        document.getElementById(
            "requestAssistanceButton"
        );

    const cancelInsuranceButton =
        document.getElementById(
            "cancelInsuranceButton"
        );


    // ==================================================
    // FAQ
    // ==================================================

    const faqQuestions =
        document.querySelectorAll(
            ".faq-question"
        );


    // ==================================================
    // TOAST
    // ==================================================

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    // ==================================================
    // ESTADO
    // ==================================================

    let toastTimeout = null;
    let selectedInsuranceType = "auto";
    let selectedInsuranceId = null;

    let currentQuote = {
        type: "auto",
        name: "Seguro Auto",
        plan: "basic",
        planName: "Plano Essencial",
        coverage: 50000,
        monthlyPrice: 89.90,
        firstCharge: ""
    };


    // ==================================================
    // CONFIGURAÇÕES
    // ==================================================

    const insuranceTypes = {

        auto: {
            name: "Seguro Auto",
            description:
                "Proteção para colisões, roubo, furto e assistência 24 horas.",

            icon:
                "fa-solid fa-car-side",

            basePrice:
                89.90,

            coverageMultiplier:
                1
        },

        home: {
            name: "Seguro Residencial",
            description:
                "Proteção para sua casa contra imprevistos e emergências.",

            icon:
                "fa-solid fa-house-chimney",

            basePrice:
                24.90,

            coverageMultiplier:
                0.45
        },

        life: {
            name: "Seguro de Vida",
            description:
                "Segurança financeira para você e para sua família.",

            icon:
                "fa-solid fa-heart-pulse",

            basePrice:
                39.90,

            coverageMultiplier:
                0.70
        },

        phone: {
            name: "Seguro Celular",
            description:
                "Cobertura para roubo, furto e danos no aparelho.",

            icon:
                "fa-solid fa-mobile-screen",

            basePrice:
                19.90,

            coverageMultiplier:
                0.30
        }
    };

    const plans = {

        basic: {
            name: "Plano Essencial",
            multiplier: 1
        },

        complete: {
            name: "Plano Completo",
            multiplier: 1.35
        },

        premium: {
            name: "Plano Premium",
            multiplier: 1.75
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

    function formatDate(date) {

        return date.toLocaleDateString(
            "pt-BR"
        );
    }

    function calculateFirstCharge() {

        const date = new Date();

        date.setDate(
            date.getDate() + 30
        );

        return formatDate(date);
    }

    function generatePolicyCode() {

        const randomNumber =
            Math.floor(
                100000 + Math.random() * 900000
            );

        return `#SEG-${randomNumber}`;
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
    // SIDEBAR
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

        body.classList.remove(
            "modal-open"
        );
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
    // SCROLL PARA OPÇÕES
    // ==================================================

    viewInsuranceOptionsButton
        ?.addEventListener(
            "click",
            () => {

                insuranceOptions
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        );


    // ==================================================
    // CÁLCULO DA COTAÇÃO
    // ==================================================

    function calculateMonthlyPrice() {

        const typeData =
            insuranceTypes[
                selectedInsuranceType
            ];

        const planData =
            plans[
                insurancePlan?.value ||
                "basic"
            ];

        const coverage =
            Number(
                coverageAmount?.value ||
                50000
            );

        const coverageFactor =
            Math.max(
                coverage / 50000,
                1
            );

        return (
            typeData.basePrice *
            typeData.coverageMultiplier *
            planData.multiplier *
            Math.sqrt(coverageFactor)
        );
    }

    function updateQuote() {

        const typeData =
            insuranceTypes[
                selectedInsuranceType
            ];

        const selectedPlan =
            insurancePlan?.value ||
            "basic";

        const planData =
            plans[selectedPlan];

        const coverage =
            Number(
                coverageAmount?.value ||
                50000
            );

        const monthlyPrice =
            calculateMonthlyPrice();

        const firstCharge =
            calculateFirstCharge();

        currentQuote = {
            type:
                selectedInsuranceType,

            name:
                typeData.name,

            plan:
                selectedPlan,

            planName:
                planData.name,

            coverage,

            monthlyPrice,

            firstCharge
        };

        if (quoteInsuranceName) {

            quoteInsuranceName.textContent =
                typeData.name;
        }

        if (quoteCoverageValue) {

            quoteCoverageValue.textContent =
                formatCurrency(coverage);
        }

        if (quoteMonthlyPrice) {

            quoteMonthlyPrice.textContent =
                formatCurrency(monthlyPrice);
        }
    }


    // ==================================================
    // ABRIR COTAÇÃO
    // ==================================================

    function openQuote(type) {

        const typeData =
            insuranceTypes[type];

        if (!typeData) return;

        selectedInsuranceType = type;

        if (insuranceQuoteTitle) {
            insuranceQuoteTitle.textContent =
                typeData.name;
        }

        if (insuranceQuoteDescription) {
            insuranceQuoteDescription.textContent =
                typeData.description;
        }

        if (quoteModalIcon) {

            quoteModalIcon.innerHTML = `
                <i class="${typeData.icon}"></i>
            `;
        }

        if (coverageAmount) {
            coverageAmount.value = "50000";
        }

        if (insurancePlan) {
            insurancePlan.value = "basic";
        }

        updateQuote();

        openModal(
            insuranceQuoteModal
        );
    }

    quoteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openQuote(
                    button.dataset.openQuote
                );
            }
        );
    });

    coverageAmount?.addEventListener(
        "change",
        updateQuote
    );

    insurancePlan?.addEventListener(
        "change",
        updateQuote
    );


    // ==================================================
    // COTAÇÃO -> CONFIRMAÇÃO
    // ==================================================

    insuranceQuoteForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            updateQuote();

            if (confirmationInsuranceName) {

                confirmationInsuranceName
                    .textContent =
                    currentQuote.name;
            }

            if (confirmationPlanName) {

                confirmationPlanName
                    .textContent =
                    currentQuote.planName;
            }

            if (confirmationCoverageValue) {

                confirmationCoverageValue
                    .textContent =
                    formatCurrency(
                        currentQuote.coverage
                    );
            }

            if (confirmationMonthlyPrice) {

                confirmationMonthlyPrice
                    .textContent =
                    formatCurrency(
                        currentQuote.monthlyPrice
                    );
            }

            if (confirmationFirstCharge) {

                confirmationFirstCharge
                    .textContent =
                    currentQuote.firstCharge;
            }

            if (insuranceTermsCheckbox) {

                insuranceTermsCheckbox
                    .checked = false;
            }

            if (confirmInsuranceButton) {

                confirmInsuranceButton
                    .disabled = true;
            }

            openModal(
                insuranceConfirmationModal
            );
        }
    );


    // ==================================================
    // TERMOS
    // ==================================================

    insuranceTermsCheckbox
        ?.addEventListener(
            "change",
            () => {

                if (
                    confirmInsuranceButton
                ) {
                    confirmInsuranceButton
                        .disabled =
                        !insuranceTermsCheckbox
                            .checked;
                }
            }
        );


    // ==================================================
    // STORAGE
    // ==================================================

    function loadActiveInsurances() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "chromaBankActiveInsurances"
                )
            ) || [];

        } catch {

            return [];
        }
    }

    function saveActiveInsurances(
        insurances
    ) {

        localStorage.setItem(
            "chromaBankActiveInsurances",
            JSON.stringify(insurances)
        );
    }

    function addNotification({
        title,
        message,
        type = "insurance"
    }) {

        let notifications = [];

        try {

            notifications =
                JSON.parse(
                    localStorage.getItem(
                        "chromaBankNotifications"
                    )
                ) || [];

        } catch {

            notifications = [];
        }

        notifications.unshift({
            id: Date.now(),
            type,
            title,
            message,
            time: "Agora",
            read: false
        });

        localStorage.setItem(
            "chromaBankNotifications",
            JSON.stringify(notifications)
        );
    }


    // ==================================================
    // RENDER DOS SEGUROS ATIVOS
    // ==================================================

    function getInsuranceIcon(type) {

        return (
            insuranceTypes[type]?.icon ||
            "fa-solid fa-shield"
        );
    }

    function renderActiveInsurances() {

        if (!activeInsurancesList) {
            return;
        }

        const insurances =
            loadActiveInsurances();

        if (!insurances.length) {

            activeInsurancesList.innerHTML = `
                <div class="empty-insurances">
                    <span>
                        <i class="fa-solid fa-shield"></i>
                    </span>

                    <strong>
                        Nenhum seguro contratado
                    </strong>

                    <p>
                        Quando você contratar uma proteção,
                        ela aparecerá aqui.
                    </p>
                </div>
            `;

            return;
        }

        activeInsurancesList.innerHTML =
            insurances
                .map((insurance) => `
                    <article
                        class="active-insurance-item"
                        data-insurance-id="${insurance.id}"
                    >

                        <span class="active-insurance-icon">
                            <i class="${
                                getInsuranceIcon(
                                    insurance.type
                                )
                            }"></i>
                        </span>

                        <div class="active-insurance-info">

                            <strong>
                                ${insurance.name}
                            </strong>

                            <span>
                                ${insurance.planName}
                            </span>

                            <small>
                                Apólice:
                                ${insurance.policyCode}
                            </small>

                        </div>

                        <div class="active-insurance-price">

                            <span>
                                Mensalidade
                            </span>

                            <strong>
                                ${
                                    formatCurrency(
                                        insurance.monthlyPrice
                                    )
                                }
                            </strong>

                            <small>
                                Status: ${insurance.status}
                            </small>

                        </div>

                        <button
                            type="button"
                            class="insurance-details-button"
                            data-insurance-details="${
                                insurance.id
                            }"
                        >
                            Ver detalhes
                        </button>

                    </article>
                `)
                .join("");

        bindInsuranceDetailsButtons();
    }


    // ==================================================
    // CONTRATAR SEGURO
    // ==================================================

    confirmInsuranceButton
        ?.addEventListener(
            "click",
            () => {

                if (
                    !insuranceTermsCheckbox
                        ?.checked
                ) {
                    return;
                }

                setLoadingState(
                    confirmInsuranceButton,
                    "Contratando..."
                );

                const policyCode =
                    generatePolicyCode();

                const newInsurance = {
                    id:
                        Date.now(),

                    type:
                        currentQuote.type,

                    name:
                        currentQuote.name,

                    plan:
                        currentQuote.plan,

                    planName:
                        currentQuote.planName,

                    coverage:
                        currentQuote.coverage,

                    monthlyPrice:
                        currentQuote.monthlyPrice,

                    firstCharge:
                        currentQuote.firstCharge,

                    policyCode,

                    status:
                        "Ativo",

                    contractedAt:
                        new Date().toISOString()
                };

                setTimeout(() => {

                    const insurances =
                        loadActiveInsurances();

                    insurances.unshift(
                        newInsurance
                    );

                    saveActiveInsurances(
                        insurances
                    );

                    addNotification({
                        type: "insurance",

                        title:
                            "Seguro contratado",

                        message:
                            `${
                                currentQuote.name
                            } contratado por ${
                                formatCurrency(
                                    currentQuote.monthlyPrice
                                )
                            } ao mês.`
                    });

                    if (insurancePolicyCode) {

                        insurancePolicyCode
                            .textContent =
                            policyCode;
                    }

                    restoreButtonState(
                        confirmInsuranceButton
                    );

                    confirmInsuranceButton
                        .disabled = true;

                    renderActiveInsurances();

                    closeModal(
                        insuranceConfirmationModal
                    );

                    openModal(
                        insuranceSuccessModal
                    );

                }, 1200);
            }
        );


    // ==================================================
    // DETALHES
    // ==================================================

    function bindInsuranceDetailsButtons() {

        document
            .querySelectorAll(
                "[data-insurance-details]"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset
                                    .insuranceDetails
                            );

                        openInsuranceDetails(id);
                    }
                );
            });
    }

    function openInsuranceDetails(id) {

        const insurance =
            loadActiveInsurances()
                .find(
                    item => item.id === id
                );

        if (!insurance) return;

        selectedInsuranceId = id;

        if (insuranceDetailsList) {

            insuranceDetailsList.innerHTML = `
                <div>
                    <span>Seguro</span>
                    <strong>
                        ${insurance.name}
                    </strong>
                </div>

                <div>
                    <span>Plano</span>
                    <strong>
                        ${insurance.planName}
                    </strong>
                </div>

                <div>
                    <span>Cobertura</span>
                    <strong>
                        ${
                            formatCurrency(
                                insurance.coverage
                            )
                        }
                    </strong>
                </div>

                <div>
                    <span>Mensalidade</span>
                    <strong>
                        ${
                            formatCurrency(
                                insurance.monthlyPrice
                            )
                        }
                    </strong>
                </div>

                <div>
                    <span>Apólice</span>
                    <strong>
                        ${insurance.policyCode}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>
                        ${insurance.status}
                    </strong>
                </div>
            `;
        }

        openModal(
            insuranceDetailsModal
        );
    }


    // ==================================================
    // ASSISTÊNCIA
    // ==================================================

    requestAssistanceButton
        ?.addEventListener(
            "click",
            () => {

                if (!selectedInsuranceId) {
                    return;
                }

                closeModal(
                    insuranceDetailsModal
                );

                addNotification({
                    type: "insurance",

                    title:
                        "Assistência solicitada",

                    message:
                        "Sua solicitação de assistência foi registrada."
                });

                showToast(
                    "Solicitação de assistência registrada."
                );
            }
        );


    // ==================================================
    // CANCELAMENTO
    // ==================================================

    cancelInsuranceButton
        ?.addEventListener(
            "click",
            () => {

                if (!selectedInsuranceId) {
                    return;
                }

                const confirmed =
                    window.confirm(
                        "Deseja realmente cancelar este seguro?"
                    );

                if (!confirmed) {
                    return;
                }

                const insurances =
                    loadActiveInsurances();

                const cancelledInsurance =
                    insurances.find(
                        item =>
                            item.id ===
                            selectedInsuranceId
                    );

                const updatedInsurances =
                    insurances.filter(
                        item =>
                            item.id !==
                            selectedInsuranceId
                    );

                saveActiveInsurances(
                    updatedInsurances
                );

                if (cancelledInsurance) {

                    addNotification({
                        type: "insurance",

                        title:
                            "Seguro cancelado",

                        message:
                            `${
                                cancelledInsurance.name
                            } foi cancelado.`
                    });
                }

                selectedInsuranceId = null;

                closeModal(
                    insuranceDetailsModal
                );

                renderActiveInsurances();

                showToast(
                    "Seguro cancelado com sucesso."
                );
            }
        );


    // ==================================================
    // HISTÓRICO
    // ==================================================

    viewInsuranceHistoryButton
        ?.addEventListener(
            "click",
            () => {

                const insurances =
                    loadActiveInsurances();

                if (!insurances.length) {

                    window.alert(
                        "Nenhum seguro encontrado no histórico."
                    );

                    return;
                }

                const history =
                    insurances
                        .slice(0, 5)
                        .map((insurance) => {

                            const date =
                                new Date(
                                    insurance.contractedAt
                                )
                                    .toLocaleDateString(
                                        "pt-BR"
                                    );

                            return [
                                insurance.policyCode,
                                insurance.name,
                                insurance.planName,
                                formatCurrency(
                                    insurance.monthlyPrice
                                ),
                                date
                            ].join(" — ");
                        })
                        .join("\n");

                window.alert(
                    [
                        "Histórico de seguros",
                        "",
                        history
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

                            activeItem
                                .classList
                                .remove(
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
    // ESC
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

    updateQuote();
    renderActiveInsurances();

});