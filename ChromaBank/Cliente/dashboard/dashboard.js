// ==================================================
// CHROMABANK — DASHBOARD
// Arquivo: dashboard.js
// ==================================================


// ==================================================
// PROTEÇÃO DA PÁGINA
// ==================================================

if (
    sessionStorage.getItem("chromaBankLoggedIn") !== "true"
) {
    window.location.href = "../login.html";
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

    // Saldo
    const toggleBalanceButton =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    // Perfil
    const profileButton =
        document.getElementById("profileButton");

    const profileAvatar =
        profileButton?.querySelector(".profile-avatar");

    // Logout
    const logoutButton =
        document.getElementById("logoutButton");

    let profileMenu = null;

    let balanceIsVisible =
        localStorage.getItem(
            "chromaBankBalanceVisible"
        ) !== "false";


    // ==================================================
    // SIDEBAR RESPONSIVA
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

    window.addEventListener("resize", () => {

        if (window.innerWidth > 980) {
            closeSidebar();
        }
    });


    // ==================================================
    // MOSTRAR E OCULTAR SALDO
    // ==================================================

    function updateBalanceVisibility() {

        if (
            !balanceValue ||
            !toggleBalanceButton
        ) {
            return;
        }

        balanceValue.textContent =
            balanceIsVisible
                ? "R$ 4.856,90"
                : "R$ ••••••";

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

        localStorage.setItem(
            "chromaBankBalanceVisible",
            String(balanceIsVisible)
        );
    }

    toggleBalanceButton?.addEventListener(
        "click",
        () => {

            balanceIsVisible =
                !balanceIsVisible;

            updateBalanceVisibility();
        }
    );

    updateBalanceVisibility();


    // ==================================================
    // FOTO E INICIAIS DO PERFIL
    // ==================================================

    function getInitials(name) {

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!parts.length) {
            return "CB";
        }

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

    window.addEventListener(
        "resize",
        () => {

            if (
                profileMenu
                    ?.classList
                    .contains("active")
            ) {
                positionProfileMenu();
            }
        }
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

            profileMenu
                ?.classList
                .remove("active");
        }
    );


    // ==================================================
    // LOGOUT
    // ==================================================

    function logout() {

        const confirmar =
            window.confirm(
                "Deseja realmente sair da sua conta?"
            );

        if (!confirmar) return;

        sessionStorage.removeItem(
            "chromaBankLoggedIn"
        );

        sessionStorage.removeItem(
            "chromaBankCPF"
        );

        window.location.href =
            "../login.html";
    }

    logoutButton?.addEventListener(
        "click",
        logout
    );

});