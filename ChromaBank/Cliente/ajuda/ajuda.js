// ==================================================
// CHROMABANK — CENTRAL DE AJUDA
// Arquivo: ajuda.js
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
    // PERFIL
    // ==================================================

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const profileLogoutButton =
        document.getElementById("profileLogoutButton");


    // ==================================================
    // ATENDIMENTO
    // ==================================================

    const startChatButton =
        document.getElementById("startChatButton");

    const contactCards =
        document.querySelectorAll(".contact-card");

    const supportTopicButtons =
        document.querySelectorAll("[data-support-topic]");

    const confirmSupportStartButton =
        document.getElementById(
            "confirmSupportStartButton"
        );

    const supportProtocol =
        document.getElementById("supportProtocol");


    // ==================================================
    // FORMULÁRIO DE CHAMADO
    // ==================================================

    const ticketForm =
        document.getElementById("ticketForm");

    const ticketCategory =
        document.getElementById("ticketCategory");

    const ticketSubject =
        document.getElementById("ticketSubject");

    const ticketMessage =
        document.getElementById("ticketMessage");

    const messageCounter =
        document.getElementById("messageCounter");

    const ticketProtocol =
        document.getElementById("ticketProtocol");

    const ticketHistory =
        document.getElementById("ticketHistory");

    const clearTicketHistoryButton =
        document.getElementById(
            "clearTicketHistoryButton"
        );


    // ==================================================
    // FAQ
    // ==================================================

    const faqQuestions =
        document.querySelectorAll(".faq-question");

    const faqSearch =
        document.getElementById("faqSearch");

    const faqItems =
        document.querySelectorAll(".faq-item");

    const faqEmpty =
        document.getElementById("faqEmpty");


    // ==================================================
    // EMERGÊNCIA
    // ==================================================

    const emergencyButtons =
        document.querySelectorAll(
            "[data-emergency-action]"
        );

    const emergencyModalTitle =
        document.getElementById(
            "emergencyModalTitle"
        );

    const emergencyModalDescription =
        document.getElementById(
            "emergencyModalDescription"
        );

    const confirmEmergencyButton =
        document.getElementById(
            "confirmEmergencyButton"
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

    const supportModal =
        document.getElementById("supportModal");

    const supportStartedModal =
        document.getElementById(
            "supportStartedModal"
        );

    const ticketSuccessModal =
        document.getElementById(
            "ticketSuccessModal"
        );

    const emergencyModal =
        document.getElementById(
            "emergencyModal"
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

    let selectedSupportTopic = "";
    let selectedEmergencyAction = "";
    let toastTimeout = null;


    // ==================================================
    // FUNÇÕES AUXILIARES
    // ==================================================

    function generateProtocol() {

        const randomNumber =
            Math.floor(
                100000 + Math.random() * 900000
            );

        return `CHR-${randomNumber}`;
    }

    function formatDate(date) {

        return date.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    }

    function formatTime(date) {

        return date.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
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
    // MENU DE PERFIL
    // ==================================================

    function closeProfileDropdown() {

        profileDropdown?.classList.remove(
            "active"
        );
    }

    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileDropdown?.classList.toggle(
                "active"
            );
        }
    );

    profileDropdown?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();
        }
    );

    document.addEventListener(
        "click",
        closeProfileDropdown
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
    // STORAGE
    // ==================================================

    function loadTickets() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "chromaBankSupportTickets"
                )
            ) || [];

        } catch {

            return [];
        }
    }

    function saveTickets(tickets) {

        localStorage.setItem(
            "chromaBankSupportTickets",
            JSON.stringify(tickets)
        );
    }

    function addNotification({
        title,
        message,
        type = "support"
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
    // HISTÓRICO DE CHAMADOS
    // ==================================================

    function getTicketIcon(category) {

        const icons = {
            PIX: "fa-brands fa-pix",
            Cartões: "fa-regular fa-credit-card",
            Empréstimos:
                "fa-solid fa-hand-holding-dollar",
            Seguros:
                "fa-solid fa-shield-heart",
            Investimentos:
                "fa-solid fa-chart-line",
            Conta:
                "fa-regular fa-user",
            Fraude:
                "fa-solid fa-shield-virus",
            Outro:
                "fa-solid fa-headset"
        };

        return (
            icons[category] ||
            "fa-solid fa-headset"
        );
    }

    function renderTickets() {

        if (!ticketHistory) {
            return;
        }

        const tickets =
            loadTickets();

        if (!tickets.length) {

            ticketHistory.innerHTML = `
                <div class="empty-history">

                    <span>
                        <i class="fa-regular fa-folder-open"></i>
                    </span>

                    <strong>
                        Nenhum chamado registrado
                    </strong>

                    <p>
                        Os chamados enviados aparecerão aqui.
                    </p>

                </div>
            `;

            if (clearTicketHistoryButton) {
                clearTicketHistoryButton.disabled =
                    true;
            }

            return;
        }

        if (clearTicketHistoryButton) {
            clearTicketHistoryButton.disabled =
                false;
        }

        ticketHistory.innerHTML =
            tickets
                .map((ticket) => `
                    <article class="ticket-item">

                        <span class="ticket-item-icon">
                            <i class="${
                                getTicketIcon(
                                    ticket.category
                                )
                            }"></i>
                        </span>

                        <div class="ticket-item-info">

                            <strong>
                                ${escapeHTML(
                                    ticket.protocol
                                )}
                                —
                                ${escapeHTML(
                                    ticket.subject
                                )}
                            </strong>

                            <span>
                                Categoria:
                                ${escapeHTML(
                                    ticket.category
                                )}
                            </span>

                            <small>
                                Criado em
                                ${escapeHTML(
                                    ticket.date
                                )}
                                às
                                ${escapeHTML(
                                    ticket.time
                                )}
                            </small>

                        </div>

                        <span class="ticket-status">
                            ${escapeHTML(
                                ticket.status
                            )}
                        </span>

                    </article>
                `)
                .join("");
    }


    // ==================================================
    // ERROS DO FORMULÁRIO
    // ==================================================

    function getInputBox(field) {

        return field
            ?.closest(".input-group")
            ?.querySelector(".input-box");
    }

    function getFieldError(field) {

        return field
            ?.closest(".input-group")
            ?.querySelector(".field-error");
    }

    function setFieldError(
        field,
        message
    ) {

        getInputBox(field)
            ?.classList.add("invalid");

        const error =
            getFieldError(field);

        if (error) {
            error.textContent = message;
        }
    }

    function clearFieldError(field) {

        getInputBox(field)
            ?.classList.remove("invalid");

        const error =
            getFieldError(field);

        if (error) {
            error.textContent = "";
        }
    }

    [
        ticketCategory,
        ticketSubject,
        ticketMessage
    ].forEach((field) => {

        field?.addEventListener(
            "input",
            () => {

                clearFieldError(field);
            }
        );

        field?.addEventListener(
            "change",
            () => {

                clearFieldError(field);
            }
        );
    });


    // ==================================================
    // CONTADOR DA MENSAGEM
    // ==================================================

    function updateMessageCounter() {

        if (
            !ticketMessage ||
            !messageCounter
        ) {
            return;
        }

        messageCounter.textContent =
            `${ticketMessage.value.length}/600`;
    }

    ticketMessage?.addEventListener(
        "input",
        updateMessageCounter
    );


    // ==================================================
    // CRIAR CHAMADO
    // ==================================================

    ticketForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const category =
                ticketCategory?.value || "";

            const subject =
                ticketSubject
                    ?.value
                    .trim() || "";

            const message =
                ticketMessage
                    ?.value
                    .trim() || "";

            let isValid = true;

            if (!category) {

                setFieldError(
                    ticketCategory,
                    "Selecione uma categoria."
                );

                isValid = false;
            }

            if (subject.length < 4) {

                setFieldError(
                    ticketSubject,
                    "Digite um assunto com pelo menos 4 caracteres."
                );

                isValid = false;
            }

            if (message.length < 10) {

                setFieldError(
                    ticketMessage,
                    "Descreva a situação com pelo menos 10 caracteres."
                );

                isValid = false;
            }

            if (!isValid) {

                showToast(
                    "Revise os campos do chamado.",
                    "error"
                );

                return;
            }

            const submitButton =
                ticketForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Enviando chamado..."
            );

            const now =
                new Date();

            const protocol =
                generateProtocol();

            const ticket = {
                id: Date.now(),
                protocol,
                category,
                subject,
                message,
                status: "Em análise",
                date: formatDate(now),
                time: formatTime(now),
                createdAt:
                    now.toISOString()
            };

            setTimeout(() => {

                const tickets =
                    loadTickets();

                tickets.unshift(ticket);

                saveTickets(tickets);

                addNotification({
                    type: "support",

                    title:
                        "Chamado criado",

                    message:
                        `Seu chamado ${protocol} foi registrado.`
                });

                ticketForm.reset();

                updateMessageCounter();

                restoreButtonState(
                    submitButton
                );

                renderTickets();

                if (ticketProtocol) {
                    ticketProtocol.textContent =
                        protocol;
                }

                openModal(
                    ticketSuccessModal
                );

            }, 900);
        }
    );


    // ==================================================
    // LIMPAR HISTÓRICO
    // ==================================================

    clearTicketHistoryButton
        ?.addEventListener(
            "click",
            () => {

                saveTickets([]);

                renderTickets();

                showToast(
                    "Histórico de chamados limpo."
                );
            }
        );


    // ==================================================
    // ATENDIMENTO
    // ==================================================

    function resetSupportModal() {

        selectedSupportTopic = "";

        supportTopicButtons.forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );
            }
        );

        if (confirmSupportStartButton) {
            confirmSupportStartButton.disabled =
                true;
        }
    }

    function openSupportModal(
        initialTopic = ""
    ) {

        resetSupportModal();

        if (initialTopic) {

            const matchedButton =
                [...supportTopicButtons]
                    .find(
                        button =>
                            button.dataset
                                .supportTopic ===
                            initialTopic
                    );

            matchedButton?.classList.add(
                "active"
            );

            selectedSupportTopic =
                initialTopic;

            if (confirmSupportStartButton) {
                confirmSupportStartButton.disabled =
                    false;
            }
        }

        openModal(supportModal);
    }

    startChatButton?.addEventListener(
        "click",
        () => {

            openSupportModal();
        }
    );

    contactCards.forEach((card) => {

        card.addEventListener(
            "click",
            () => {

                const channel =
                    card.dataset
                        .supportChannel;

                if (channel === "E-mail") {

                    window.location.href =
                        "mailto:suporte@chromabank.com";

                    return;
                }

                if (channel === "Telefone") {

                    showToast(
                        "Central disponível no número 0800 000 0000."
                    );

                    return;
                }

                openSupportModal();
            }
        );
    });

    supportTopicButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    supportTopicButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    selectedSupportTopic =
                        button.dataset
                            .supportTopic || "";

                    if (
                        confirmSupportStartButton
                    ) {
                        confirmSupportStartButton
                            .disabled = false;
                    }
                }
            );
        }
    );

    confirmSupportStartButton
        ?.addEventListener(
            "click",
            () => {

                if (!selectedSupportTopic) {
                    return;
                }

                setLoadingState(
                    confirmSupportStartButton,
                    "Iniciando..."
                );

                const protocol =
                    generateProtocol();

                setTimeout(() => {

                    restoreButtonState(
                        confirmSupportStartButton
                    );

                    if (supportProtocol) {
                        supportProtocol.textContent =
                            protocol;
                    }

                    addNotification({
                        type: "support",

                        title:
                            "Atendimento iniciado",

                        message:
                            `Atendimento sobre ${selectedSupportTopic} iniciado. Protocolo ${protocol}.`
                    });

                    openModal(
                        supportStartedModal
                    );

                }, 700);
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

                faqItems.forEach(
                    faqItem => {

                        faqItem.classList.remove(
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

    faqSearch?.addEventListener(
        "input",
        () => {

            const searchTerm =
                faqSearch.value
                    .trim()
                    .toLocaleLowerCase(
                        "pt-BR"
                    );

            let visibleItems = 0;

            faqItems.forEach((item) => {

                const question =
                    item.querySelector(
                        ".faq-question span"
                    )
                        ?.textContent
                        .toLocaleLowerCase(
                            "pt-BR"
                        ) || "";

                const answer =
                    item.querySelector(
                        ".faq-answer"
                    )
                        ?.textContent
                        .toLocaleLowerCase(
                            "pt-BR"
                        ) || "";

                const keywords =
                    item.dataset
                        .faqKeywords
                        ?.toLocaleLowerCase(
                            "pt-BR"
                        ) || "";

                const matches =
                    !searchTerm ||
                    question.includes(
                        searchTerm
                    ) ||
                    answer.includes(
                        searchTerm
                    ) ||
                    keywords.includes(
                        searchTerm
                    );

                item.classList.toggle(
                    "filtered-out",
                    !matches
                );

                if (matches) {
                    visibleItems += 1;
                }
            });

            if (faqEmpty) {
                faqEmpty.hidden =
                    visibleItems !== 0;
            }
        }
    );


    // ==================================================
    // EMERGÊNCIA
    // ==================================================

    function getEmergencyDescription(
        action
    ) {

        const descriptions = {
            "Bloquear cartão":
                "O bloqueio impediria novas compras com o cartão selecionado.",

            "Bloquear conta":
                "O acesso à conta seria temporariamente interrompido por segurança.",

            "Reportar fraude":
                "A movimentação suspeita seria enviada para análise da equipe de segurança."
        };

        return (
            descriptions[action] ||
            "Esta ação será registrada como uma solicitação urgente."
        );
    }

    emergencyButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                selectedEmergencyAction =
                    button.dataset
                        .emergencyAction || "";

                if (emergencyModalTitle) {

                    emergencyModalTitle
                        .textContent =
                        selectedEmergencyAction;
                }

                if (
                    emergencyModalDescription
                ) {

                    emergencyModalDescription
                        .textContent =
                        getEmergencyDescription(
                            selectedEmergencyAction
                        );
                }

                openModal(emergencyModal);
            }
        );
    });

    confirmEmergencyButton
        ?.addEventListener(
            "click",
            () => {

                if (
                    !selectedEmergencyAction
                ) {
                    return;
                }

                setLoadingState(
                    confirmEmergencyButton,
                    "Registrando..."
                );

                const protocol =
                    generateProtocol();

                setTimeout(() => {

                    restoreButtonState(
                        confirmEmergencyButton
                    );

                    addNotification({
                        type: "security",

                        title:
                            selectedEmergencyAction,

                        message:
                            `Solicitação urgente registrada. Protocolo ${protocol}.`
                    });

                    closeModal(
                        emergencyModal
                    );

                    showToast(
                        `Solicitação registrada. Protocolo ${protocol}.`
                    );

                    selectedEmergencyAction =
                        "";

                }, 750);
            }
        );


    // ==================================================
    // LOGOUT
    // ==================================================

    function logout() {

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

    profileLogoutButton
        ?.addEventListener(
            "click",
            logout
        );


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
            closeProfileDropdown();
            closeAllModals();
        }
    );


    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    updateMessageCounter();
    renderTickets();

});