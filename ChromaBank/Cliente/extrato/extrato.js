// ==================================================
// CHROMABANK — EXTRATO
// Arquivo: extrato.js
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

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    // Filtros
    const searchInput =
        document.getElementById("searchInput");

    const clearSearchButton =
        document.getElementById("clearSearchButton");

    const periodFilter =
        document.getElementById("periodFilter");

    const typeFilter =
        document.getElementById("typeFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const resetFiltersButton =
        document.getElementById("resetFiltersButton");

    const exportButton =
        document.getElementById("exportButton");

    // Extrato
    const statementList =
        document.getElementById("statementList");

    const transactionItems =
        document.querySelectorAll(".transaction-item");

    const dateGroups =
        document.querySelectorAll(".date-group");

    const resultCount =
        document.getElementById("resultCount");

    const emptyState =
        document.getElementById("emptyState");

    const viewButtons =
        document.querySelectorAll("[data-view]");

    // Valores sensíveis
    const sensitiveValues =
        document.querySelectorAll(".sensitive-value");

    // Menu da transação
    const transactionDropdown =
        document.getElementById("transactionDropdown");

    const transactionMenuButtons =
        document.querySelectorAll(".transaction-menu-button");

    // Paginação
    const paginationNumbers =
        document.querySelectorAll(".pagination-number");

    const paginationArrows =
        document.querySelectorAll(".pagination-arrow");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let valuesAreVisible = true;
    let profileMenu = null;
    let toastTimeout = null;
    let selectedTransaction = null;


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

        if (toggleBalanceButton) {
            toggleBalanceButton.innerHTML = valuesAreVisible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';

            toggleBalanceButton.setAttribute(
                "aria-label",
                valuesAreVisible
                    ? "Ocultar valores"
                    : "Mostrar valores"
            );
        }

        localStorage.setItem(
            "chromaBankStatementValuesVisible",
            String(valuesAreVisible)
        );
    }

    const savedValuePreference =
        localStorage.getItem(
            "chromaBankStatementValuesVisible"
        );

    if (savedValuePreference !== null) {
        valuesAreVisible =
            savedValuePreference === "true";
    }

    toggleBalanceButton?.addEventListener("click", () => {
        valuesAreVisible = !valuesAreVisible;
        updateSensitiveValues();
    });

    updateSensitiveValues();


    // ==================================================
    // FILTROS
    // ==================================================

    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function applyFilters() {

        const searchTerm = normalizeText(
            searchInput?.value || ""
        );

        const selectedPeriod =
            periodFilter?.value || "all";

        const selectedType =
            typeFilter?.value || "all";

        const selectedCategory =
            categoryFilter?.value || "all";

        let visibleCount = 0;

        transactionItems.forEach((item) => {

            const description =
                normalizeText(
                    item.dataset.description || ""
                );

            const type =
                item.dataset.type || "";

            const category =
                item.dataset.category || "";

            const days =
                Number(item.dataset.days || 0);

            const matchesSearch =
                !searchTerm ||
                description.includes(searchTerm);

            const matchesType =
                selectedType === "all" ||
                type === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesPeriod =
                selectedPeriod === "all" ||
                days <= Number(selectedPeriod);

            const shouldShow =
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesPeriod;

            item.classList.toggle(
                "hidden",
                !shouldShow
            );

            if (shouldShow) {
                visibleCount++;
            }
        });

        dateGroups.forEach((group) => {

            const visibleTransactions =
                group.querySelectorAll(
                    ".transaction-item:not(.hidden)"
                );

            group.style.display =
                visibleTransactions.length > 0
                    ? ""
                    : "none";
        });

        if (resultCount) {
            resultCount.textContent = visibleCount;
        }

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }

        if (statementList) {
            statementList.style.display =
                visibleCount > 0
                    ? ""
                    : "none";
        }
    }

    searchInput?.addEventListener(
        "input",
        applyFilters
    );

    periodFilter?.addEventListener(
        "change",
        applyFilters
    );

    typeFilter?.addEventListener(
        "change",
        applyFilters
    );

    categoryFilter?.addEventListener(
        "change",
        applyFilters
    );

    clearSearchButton?.addEventListener("click", () => {

        if (!searchInput) return;

        searchInput.value = "";
        searchInput.focus();

        applyFilters();
    });

    resetFiltersButton?.addEventListener("click", () => {

        if (searchInput) {
            searchInput.value = "";
        }

        if (periodFilter) {
            periodFilter.value = "30";
        }

        if (typeFilter) {
            typeFilter.value = "all";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        applyFilters();
    });

    applyFilters();


    // ==================================================
    // VISUALIZAÇÃO LISTA / COMPACTA
    // ==================================================

    viewButtons.forEach((button) => {

        button.addEventListener("click", () => {

            viewButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const selectedView =
                button.dataset.view;

            statementList?.classList.toggle(
                "compact",
                selectedView === "compact"
            );

            localStorage.setItem(
                "chromaBankStatementView",
                selectedView
            );
        });
    });

    const savedView =
        localStorage.getItem(
            "chromaBankStatementView"
        );

    if (savedView === "compact") {

        statementList?.classList.add("compact");

        viewButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.view === "compact"
            );
        });
    }


    // ==================================================
    // MENU DAS TRANSAÇÕES
    // ==================================================

    function closeTransactionDropdown() {
        transactionDropdown?.classList.remove("active");
        selectedTransaction = null;
    }

    function positionTransactionDropdown(button) {

        if (!transactionDropdown) return;

        const rect =
            button.getBoundingClientRect();

        const dropdownWidth = 210;

        const rightPosition =
            window.innerWidth - rect.right;

        transactionDropdown.style.top =
            `${rect.bottom + 8}px`;

        if (
            rect.left + dropdownWidth >
            window.innerWidth - 15
        ) {
            transactionDropdown.style.right =
                `${Math.max(rightPosition, 12)}px`;

            transactionDropdown.style.left =
                "auto";
        } else {
            transactionDropdown.style.left =
                `${rect.left}px`;

            transactionDropdown.style.right =
                "auto";
        }
    }

    transactionMenuButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.stopPropagation();

            selectedTransaction =
                button.closest(".transaction-item");

            positionTransactionDropdown(button);

            transactionDropdown?.classList.toggle(
                "active"
            );
        });
    });

    transactionDropdown
        ?.querySelectorAll("button")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const action =
                    button.textContent.trim();

                const description =
                    selectedTransaction
                        ?.querySelector(
                            ".transaction-description strong"
                        )
                        ?.textContent.trim() ||
                    "Movimentação";

                showToast(
                    `${action}: ${description}`
                );

                closeTransactionDropdown();
            });
        });

    document.addEventListener("click", (event) => {

        if (
            transactionDropdown &&
            !transactionDropdown.contains(event.target)
        ) {
            closeTransactionDropdown();
        }
    });

    window.addEventListener(
        "scroll",
        closeTransactionDropdown,
        { passive: true }
    );


    // ==================================================
    // PAGINAÇÃO SIMULADA
    // ==================================================

    function setActivePage(pageButton) {

        paginationNumbers.forEach((button) => {
            button.classList.remove("active");
        });

        pageButton.classList.add("active");

        const pageNumber =
            pageButton.textContent.trim();

        showToast(
            `Página ${pageNumber} selecionada.`
        );

        window.scrollTo({
            top:
                document.querySelector(
                    ".statement-panel"
                )?.offsetTop - 20 || 0,

            behavior: "smooth"
        });

        updatePaginationArrows();
    }

    function updatePaginationArrows() {

        const activePage =
            document.querySelector(
                ".pagination-number.active"
            );

        const activeIndex =
            Array.from(paginationNumbers)
                .indexOf(activePage);

        if (paginationArrows[0]) {
            paginationArrows[0].disabled =
                activeIndex <= 0;
        }

        if (paginationArrows[1]) {
            paginationArrows[1].disabled =
                activeIndex >=
                paginationNumbers.length - 1;
        }
    }

    paginationNumbers.forEach((button) => {
        button.addEventListener("click", () => {
            setActivePage(button);
        });
    });

    paginationArrows[0]?.addEventListener(
        "click",
        () => {

            const activePage =
                document.querySelector(
                    ".pagination-number.active"
                );

            const activeIndex =
                Array.from(paginationNumbers)
                    .indexOf(activePage);

            if (activeIndex > 0) {
                setActivePage(
                    paginationNumbers[
                        activeIndex - 1
                    ]
                );
            }
        }
    );

    paginationArrows[1]?.addEventListener(
        "click",
        () => {

            const activePage =
                document.querySelector(
                    ".pagination-number.active"
                );

            const activeIndex =
                Array.from(paginationNumbers)
                    .indexOf(activePage);

            if (
                activeIndex <
                paginationNumbers.length - 1
            ) {
                setActivePage(
                    paginationNumbers[
                        activeIndex + 1
                    ]
                );
            }
        }
    );

    updatePaginationArrows();


    // ==================================================
    // EXPORTAÇÃO CSV
    // ==================================================

    function getVisibleTransactions() {
        return Array.from(transactionItems)
            .filter(
                (item) =>
                    !item.classList.contains("hidden")
            );
    }

    function exportStatementToCSV() {

        const visibleTransactions =
            getVisibleTransactions();

        if (visibleTransactions.length === 0) {
            showToast(
                "Não há movimentações para exportar."
            );

            return;
        }

        const rows = [
            [
                "Descrição",
                "Detalhes",
                "Tipo",
                "Categoria",
                "Horário",
                "Valor"
            ]
        ];

        visibleTransactions.forEach((item) => {

            const description =
                item.querySelector(
                    ".transaction-description strong"
                )?.textContent.trim() || "";

            const details =
                item.querySelector(
                    ".transaction-description span"
                )?.textContent.trim() || "";

            const type =
                item.dataset.type === "income"
                    ? "Entrada"
                    : "Saída";

            const category =
                item.dataset.category || "";

            const time =
                item.querySelector(
                    ".transaction-time span"
                )?.textContent.trim() || "";

            const value =
                item.querySelector(
                    ".transaction-value"
                )?.dataset.value ||
                item.querySelector(
                    ".transaction-value"
                )?.textContent.trim() ||
                "";

            rows.push([
                description,
                details,
                type,
                category,
                time,
                value
            ]);
        });

        const csvContent = rows
            .map((row) =>
                row
                    .map((cell) =>
                        `"${String(cell).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(";")
            )
            .join("\n");

        const blob = new Blob(
            [
                "\uFEFF",
                csvContent
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

        const downloadUrl =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = downloadUrl;
        link.download =
            "extrato-chromabank.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(downloadUrl);

        showToast(
            "Extrato exportado com sucesso!"
        );
    }

    exportButton?.addEventListener(
        "click",
        exportStatementToCSV
    );


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
        closeTransactionDropdown();

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