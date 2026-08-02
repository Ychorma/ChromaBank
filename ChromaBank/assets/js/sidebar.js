// ==================================================
// CHROMABANK — SIDEBAR GLOBAL
// Arquivo: assets/js/sidebar.js
// ==================================================
console.log("sidebar.js carregado");
document.addEventListener("DOMContentLoaded", () => {

    const sidebarContainer =
        document.getElementById("globalSidebar");

    if (!sidebarContainer) return;

    const currentPage =
        document.body.dataset.page || "";

    const pages = [
        {
            id: "dashboard",
            label: "Início",
            icon: "fa-solid fa-house",
            href: "../dashboard/dashboard.html"
        },
        {
            id: "pix",
            label: "PIX",
            icon: "fa-brands fa-pix",
            href: "../pix/pix.html"
        },
        {
            id: "transferencias",
            label: "Transferências",
            icon: "fa-solid fa-arrow-right-arrow-left",
            href: "../transferencias/transferencias.html"
        },
        {
            id: "pagamentos",
            label: "Pagamentos",
            icon: "fa-solid fa-barcode",
            href: "../pagamentos/pagamentos.html"
        },
        {
            id: "emprestimos",
            label: "Empréstimos",
            icon: "fa-solid fa-hand-holding-dollar",
            href: "../emprestimos/emprestimos.html"
        },
        {
            id: "extrato",
            label: "Extrato",
            icon: "fa-regular fa-file-lines",
            href: "../extrato/extrato.html"
        },
        {
            id: "cartoes",
            label: "Cartões",
            icon: "fa-regular fa-credit-card",
            href: "../cartoes/cartoes.html"
        },
        {
            id: "investimentos",
            label: "Investimentos",
            icon: "fa-solid fa-chart-line",
            href: "../investimentos/investimentos.html"
        },
        {
            id: "recarga",
            label: "Recarga",
            icon: "fa-solid fa-mobile-screen-button",
            href: "../recarga/recarga.html"
        },
        {
            id: "deposito",
            label: "Depósito",
            icon: "fa-solid fa-money-bill-transfer",
            href: "../deposito/deposito.html"
        },
        {
            id: "perfil",
            label: "Perfil",
            icon: "fa-regular fa-user",
            href: "../perfil/perfil.html"
        },
        {
            id: "configuracoes",
            label: "Configurações",
            icon: "fa-solid fa-gear",
            href: "../configuracoes/configuracoes.html"
        }
    ];

    const navigation = pages
        .map((page) => {

            const activeClass =
                page.id === currentPage
                    ? "active"
                    : "";

            return `
                <a
                    href="${page.href}"
                    class="nav-item ${activeClass}"
                >
                    <i class="${page.icon}"></i>
                    <span>${page.label}</span>
                </a>
            `;
        })
        .join("");

    sidebarContainer.innerHTML = `
        <aside
            class="sidebar"
            id="sidebar"
        >

            <div class="sidebar-header">

                <a
                    href="../../index.html"
                    class="brand"
                    aria-label="Página inicial do ChromaBank"
                >
                    <img
                        src="../../img/inlog.png"
                        alt="Logo ChromaBank"
                        class="brand-logo"
                    >
                </a>

                <button
                    type="button"
                    class="sidebar-close"
                    id="sidebarClose"
                    aria-label="Fechar menu"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <nav class="sidebar-nav">
                ${navigation}
            </nav>

            <div class="sidebar-security">

                <i class="fa-solid fa-shield-halved"></i>

                <div>
                    <strong>Ambiente seguro</strong>

                    <span>
                        Suas operações estão protegidas.
                    </span>
                </div>

            </div>

            <button
                type="button"
                class="logout-button"
                id="logoutButton"
            >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair da conta</span>
            </button>

        </aside>

        <div
            class="sidebar-overlay"
            id="sidebarOverlay"
        ></div>
    `;

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

    function openSidebar() {

        sidebar?.classList.add("active");
        sidebarOverlay?.classList.add("active");

        document.body.classList.add(
            "sidebar-open"
        );
    }

    function closeSidebar() {

        sidebar?.classList.remove("active");
        sidebarOverlay?.classList.remove("active");

        document.body.classList.remove(
            "sidebar-open"
        );
    }

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

    logoutButton?.addEventListener(
        "click",
        logout
    );

    window.addEventListener("resize", () => {

        if (window.innerWidth > 980) {
            closeSidebar();
        }
    });

});