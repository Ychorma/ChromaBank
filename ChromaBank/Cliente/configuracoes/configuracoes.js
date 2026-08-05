// ==================================================
// CHROMABANK — CONFIGURAÇÕES
// Arquivo: configuracoes.js
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


    // ==================================================
    // CABEÇALHO E PERFIL
    // ==================================================

    const profileButton =
        document.getElementById("profileButton");

    const profileAvatar =
        profileButton?.querySelector(".profile-avatar");

    const notificationsButton =
        document.getElementById("notificationsButton");

    const logoutButton =
        document.getElementById("logoutButton");


    // ==================================================
    // ABAS
    // ==================================================

    const settingsTabs =
        document.querySelectorAll("[data-settings-tab]");

    const settingsSections =
        document.querySelectorAll("[data-settings-section]");


    // ==================================================
    // MODAIS
    // ==================================================

    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    const changePasswordModal =
        document.getElementById("changePasswordModal");

    const twoFactorModal =
        document.getElementById("twoFactorModal");

    const closeAccountModal =
        document.getElementById("closeAccountModal");


    // ==================================================
    // SEGURANÇA
    // ==================================================

    const biometricsToggle =
        document.getElementById("biometricsToggle");

    const twoFactorToggle =
        document.getElementById("twoFactorToggle");

    const transactionConfirmationToggle =
        document.getElementById(
            "transactionConfirmationToggle"
        );

    const disconnectAllDevicesButton =
        document.getElementById(
            "disconnectAllDevicesButton"
        );

    const deviceDisconnectButtons =
        document.querySelectorAll(
            '[data-device-action="disconnect"]'
        );


    // ==================================================
    // SENHA
    // ==================================================

    const changePasswordForm =
        document.getElementById("changePasswordForm");

    const currentPassword =
        document.getElementById("currentPassword");

    const newPassword =
        document.getElementById("newPassword");

    const confirmNewPassword =
        document.getElementById("confirmNewPassword");

    const togglePasswordButtons =
        document.querySelectorAll("[data-toggle-password]");

    const passwordRules =
        document.querySelectorAll("[data-password-rule]");


    // ==================================================
    // AUTENTICAÇÃO EM DUAS ETAPAS
    // ==================================================

    const twoFactorOptions =
        document.querySelectorAll(".two-factor-option");

    const twoFactorMethodInputs =
        document.querySelectorAll(
            'input[name="twoFactorMethod"]'
        );

    const confirmTwoFactorButton =
        document.getElementById(
            "confirmTwoFactorButton"
        );


    // ==================================================
    // NOTIFICAÇÕES
    // ==================================================

    const channelCards =
        document.querySelectorAll(".channel-card");


    // ==================================================
    // LIMITES
    // ==================================================

    const limitsForm =
        document.getElementById("limitsForm");

    const dailyPixLimit =
        document.getElementById("dailyPixLimit");

    const transferLimit =
        document.getElementById("transferLimit");

    const onlinePurchaseLimit =
        document.getElementById(
            "onlinePurchaseLimit"
        );

    const withdrawalLimit =
        document.getElementById("withdrawalLimit");

    const resetLimitsButton =
        document.getElementById("resetLimitsButton");


    // ==================================================
    // PREFERÊNCIAS
    // ==================================================

    const themeOptions =
        document.querySelectorAll(".theme-option");

    const themeInputs =
        document.querySelectorAll(
            'input[name="theme"]'
        );

    const languageSelect =
        document.getElementById("languageSelect");

    const currencySelect =
        document.getElementById("currencySelect");

    const hideBalanceOnStartToggle =
        document.getElementById(
            "hideBalanceOnStartToggle"
        );

    const savePreferencesButton =
        document.getElementById(
            "savePreferencesButton"
        );


    // ==================================================
    // PRIVACIDADE
    // ==================================================

    const downloadDataButton =
        document.getElementById("downloadDataButton");

    const accessHistoryButton =
        document.getElementById("accessHistoryButton");

    const closeAccountConfirmation =
        document.getElementById(
            "closeAccountConfirmation"
        );

    const confirmCloseAccountButton =
        document.getElementById(
            "confirmCloseAccountButton"
        );


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

    let profileMenu = null;
    let notificationsMenu = null;
    let toastTimeout = null;

    const defaultLimits = {
        dailyPixLimit: 5000,
        transferLimit: 10000,
        onlinePurchaseLimit: 3000,
        withdrawalLimit: 1000
    };


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
    // TOAST
    // ==================================================

    function showToast(
        message,
        type = "success"
    ) {

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

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

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

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

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !document.querySelector(".modal.active")
        ) {
            body.classList.remove("modal-open");
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

            closeModal(
                button.closest(".modal")
            );
        });
    });


    // ==================================================
    // ABAS
    // ==================================================

    function activateSettingsTab(tabName) {

        settingsTabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab.dataset.settingsTab === tabName
            );
        });

        settingsSections.forEach((section) => {

            const isActive =
                section.dataset.settingsSection ===
                tabName;

            section.classList.toggle(
                "active",
                isActive
            );

            section.hidden = !isActive;
        });

        localStorage.setItem(
            "chromaBankSettingsActiveTab",
            tabName
        );
    }

    settingsTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            activateSettingsTab(
                tab.dataset.settingsTab
            );
        });
    });

    const savedActiveTab =
        localStorage.getItem(
            "chromaBankSettingsActiveTab"
        ) || "security";

    activateSettingsTab(savedActiveTab);


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

        const digits =
            onlyNumbers(value);

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
            ?.closest(".input-group, .limit-control")
            ?.querySelector(".field-error");
    }

    function setFieldError(field, message) {

        if (!field) return;

        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = message;
        }

        field
            .closest(".input-box")
            ?.classList.add("invalid");
    }

    function clearFieldError(field) {

        if (!field) return;

        const errorElement =
            getFieldErrorElement(field);

        if (errorElement) {
            errorElement.textContent = "";
        }

        field
            .closest(".input-box")
            ?.classList.remove("invalid");
    }

    function setLoadingState(button, text) {

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
            "Salvar";
    }

    function getInitials(name) {

        const parts = name
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


    // ==================================================
    // TEMA CLARO, ESCURO E SISTEMA
    // ==================================================

    function applyTheme(theme) {

        body.classList.remove(
            "theme-dark",
            "theme-light"
        );

        if (theme === "light") {

            body.classList.add(
                "theme-light"
            );

            return;
        }

        if (theme === "dark") {

            body.classList.add(
                "theme-dark"
            );

            return;
        }

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        body.classList.add(
            prefersDark
                ? "theme-dark"
                : "theme-light"
        );
    }

    function getSelectedTheme() {

        return document.querySelector(
            'input[name="theme"]:checked'
        )?.value || "dark";
    }

    function updateSelectableCards() {

        channelCards.forEach((card) => {

            const input =
                card.querySelector(
                    'input[type="checkbox"]'
                );

            card.classList.toggle(
                "active",
                Boolean(input?.checked)
            );
        });

        themeOptions.forEach((option) => {

            const input =
                option.querySelector(
                    'input[name="theme"]'
                );

            option.classList.toggle(
                "active",
                Boolean(input?.checked)
            );
        });
    }

    themeInputs.forEach((input) => {

        input.addEventListener("change", () => {

            updateSelectableCards();

            applyTheme(input.value);
        });
    });

    const systemThemeMedia =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

    systemThemeMedia.addEventListener?.(
        "change",
        () => {

            if (
                getSelectedTheme() === "system"
            ) {
                applyTheme("system");
            }
        }
    );


    // ==================================================
    // CARREGAR PREFERÊNCIAS
    // ==================================================

    function loadSavedPreferences() {

        const savedPreferences =
            localStorage.getItem(
                "chromaBankPreferences"
            );

        if (!savedPreferences) {

            applyTheme("dark");
            updateSelectableCards();

            return;
        }

        try {

            const preferences =
                JSON.parse(savedPreferences);

            const selectedTheme =
                preferences.theme || "dark";

            const themeInput =
                document.querySelector(
                    `input[name="theme"][value="${selectedTheme}"]`
                );

            if (themeInput) {
                themeInput.checked = true;
            }

            if (
                languageSelect &&
                preferences.language
            ) {
                languageSelect.value =
                    preferences.language;
            }

            if (
                currencySelect &&
                preferences.currency
            ) {
                currencySelect.value =
                    preferences.currency;
            }

            if (hideBalanceOnStartToggle) {

                hideBalanceOnStartToggle.checked =
                    Boolean(
                        preferences.hideBalanceOnStart
                    );
            }

            applyTheme(selectedTheme);
            updateSelectableCards();

        } catch {

            localStorage.removeItem(
                "chromaBankPreferences"
            );

            applyTheme("dark");
            updateSelectableCards();
        }
    }

    loadSavedPreferences();


    // ==================================================
    // SALVAR PREFERÊNCIAS
    // ==================================================

    savePreferencesButton?.addEventListener(
        "click",
        () => {

            const selectedTheme =
                getSelectedTheme();

            const preferences = {

                theme:
                    selectedTheme,

                language:
                    languageSelect?.value ||
                    "pt-BR",

                currency:
                    currencySelect?.value ||
                    "BRL",

                hideBalanceOnStart:
                    Boolean(
                        hideBalanceOnStartToggle
                            ?.checked
                    )
            };

            setLoadingState(
                savePreferencesButton,
                "Salvando..."
            );

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankPreferences",
                    JSON.stringify(preferences)
                );

                localStorage.setItem(
                    "chromaBankBalanceVisible",
                    String(
                        !preferences.hideBalanceOnStart
                    )
                );

                applyTheme(selectedTheme);

                restoreButtonState(
                    savePreferencesButton
                );

                showToast(
                    "Preferências salvas."
                );

            }, 800);
        }
    );


    // ==================================================
    // FOTO DO PERFIL
    // ==================================================

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

            <a href="configuracoes.html">
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

        if (!profileMenu || !profileButton) {
            return;
        }

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

            closeNotificationsMenu();

            if (!profileMenu) {
                createProfileMenu();
            }

            positionProfileMenu();

            profileMenu.classList.toggle(
                "active"
            );
        }
    );


    // ==================================================
    // MENU DE NOTIFICAÇÕES
    // ==================================================

    function createNotificationsMenu() {

        notificationsMenu =
            document.createElement("div");

        notificationsMenu.className =
            "profile-dropdown notifications-dropdown";

        notificationsMenu.innerHTML = `
            <div
                style="
                    padding: 12px 13px;
                    border-bottom:
                        1px solid rgba(255,255,255,.08);
                    margin-bottom: 5px;
                "
            >
                <strong
                    style="
                        display: block;
                        font-size: 12px;
                        margin-bottom: 4px;
                    "
                >
                    Notificações
                </strong>

                <span
                    style="
                        color: #74727f;
                        font-size: 9px;
                    "
                >
                    Você não possui novos avisos.
                </span>
            </div>

            <button
                type="button"
                id="openNotificationSettings"
            >
                <i class="fa-regular fa-bell"></i>
                Configurar notificações
            </button>
        `;

        document.body.appendChild(
            notificationsMenu
        );

        document
            .getElementById(
                "openNotificationSettings"
            )
            ?.addEventListener(
                "click",
                () => {

                    activateSettingsTab(
                        "notifications"
                    );

                    closeNotificationsMenu();
                }
            );
    }

    function positionNotificationsMenu() {

        if (
            !notificationsMenu ||
            !notificationsButton
        ) {
            return;
        }

        const rect =
            notificationsButton
                .getBoundingClientRect();

        notificationsMenu.style.top =
            `${rect.bottom + 10}px`;

        notificationsMenu.style.right =
            `${window.innerWidth - rect.right}px`;
    }

    function closeNotificationsMenu() {

        notificationsMenu
            ?.classList
            .remove("active");
    }

    notificationsButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileMenu
                ?.classList
                .remove("active");

            if (!notificationsMenu) {
                createNotificationsMenu();
            }

            positionNotificationsMenu();

            notificationsMenu.classList.toggle(
                "active"
            );
        }
    );


    // ==================================================
    // CLICAR FORA DOS MENUS
    // ==================================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                profileMenu &&
                !profileMenu.contains(event.target) &&
                !profileButton?.contains(event.target)
            ) {
                profileMenu.classList.remove(
                    "active"
                );
            }

            if (
                notificationsMenu &&
                !notificationsMenu.contains(
                    event.target
                ) &&
                !notificationsButton?.contains(
                    event.target
                )
            ) {
                closeNotificationsMenu();
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

            if (
                notificationsMenu
                    ?.classList
                    .contains("active")
            ) {
                positionNotificationsMenu();
            }
        }
    );


    // ==================================================
    // SALVAR INTERRUPTORES
    // ==================================================

    function saveTogglePreference(toggle) {

        if (!toggle?.id) return;

        localStorage.setItem(
            `chromaBankSetting_${toggle.id}`,
            String(toggle.checked)
        );
    }

    function loadTogglePreference(toggle) {

        if (!toggle?.id) return;

        const savedValue =
            localStorage.getItem(
                `chromaBankSetting_${toggle.id}`
            );

        if (savedValue !== null) {

            toggle.checked =
                savedValue === "true";
        }
    }

    document
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach((toggle) => {

            loadTogglePreference(toggle);

            toggle.addEventListener(
                "change",
                () => {

                    if (
                        toggle === twoFactorToggle
                    ) {
                        return;
                    }

                    saveTogglePreference(toggle);

                    updateSelectableCards();
                }
            );
        });


    // ==================================================
    // BIOMETRIA
    // ==================================================

    biometricsToggle?.addEventListener(
        "change",
        () => {

            showToast(
                biometricsToggle.checked
                    ? "Biometria ativada."
                    : "Biometria desativada."
            );
        }
    );


    // ==================================================
    // CONFIRMAÇÃO DE TRANSAÇÕES
    // ==================================================

    transactionConfirmationToggle
        ?.addEventListener(
            "change",
            () => {

                showToast(
                    transactionConfirmationToggle
                        .checked
                        ? "Confirmação ativada."
                        : "Confirmação desativada."
                );
            }
        );


    // ==================================================
    // AUTENTICAÇÃO EM DUAS ETAPAS
    // ==================================================

    twoFactorToggle?.addEventListener(
        "change",
        () => {

            if (twoFactorToggle.checked) {

                twoFactorToggle.checked = false;

                openModal(twoFactorModal);

            } else {

                localStorage.setItem(
                    "chromaBankSetting_twoFactorToggle",
                    "false"
                );

                showToast(
                    "Autenticação em duas etapas desativada."
                );
            }
        }
    );

    function updateTwoFactorOptions() {

        twoFactorOptions.forEach((option) => {

            const input =
                option.querySelector(
                    'input[name="twoFactorMethod"]'
                );

            option.classList.toggle(
                "active",
                Boolean(input?.checked)
            );
        });
    }

    twoFactorMethodInputs.forEach((input) => {

        input.addEventListener(
            "change",
            updateTwoFactorOptions
        );
    });

    updateTwoFactorOptions();

    confirmTwoFactorButton?.addEventListener(
        "click",
        () => {

            const selectedMethod =
                document.querySelector(
                    'input[name="twoFactorMethod"]:checked'
                )?.value || "email";

            setLoadingState(
                confirmTwoFactorButton,
                "Ativando..."
            );

            setTimeout(() => {

                if (twoFactorToggle) {

                    twoFactorToggle.checked =
                        true;
                }

                localStorage.setItem(
                    "chromaBankSetting_twoFactorToggle",
                    "true"
                );

                localStorage.setItem(
                    "chromaBankTwoFactorMethod",
                    selectedMethod
                );

                restoreButtonState(
                    confirmTwoFactorButton
                );

                closeModal(twoFactorModal);

                showToast(
                    "Autenticação em duas etapas ativada."
                );

            }, 1000);
        }
    );


    // ==================================================
    // MOSTRAR E OCULTAR SENHA
    // ==================================================

    togglePasswordButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const field =
                    document.getElementById(
                        button.dataset.togglePassword
                    );

                if (!field) return;

                const isPassword =
                    field.type === "password";

                field.type =
                    isPassword
                        ? "text"
                        : "password";

                button.innerHTML =
                    isPassword
                        ? '<i class="fa-regular fa-eye-slash"></i>'
                        : '<i class="fa-regular fa-eye"></i>';
            }
        );
    });


    // ==================================================
    // REGRAS DA SENHA
    // ==================================================

    function getPasswordValidation(password) {

        return {

            length:
                password.length >= 8,

            uppercase:
                /[A-Z]/.test(password),

            number:
                /\d/.test(password),

            special:
                /[^A-Za-z0-9]/.test(password)
        };
    }

    function updatePasswordRules() {

        const validation =
            getPasswordValidation(
                newPassword?.value || ""
            );

        passwordRules.forEach((rule) => {

            const ruleName =
                rule.dataset.passwordRule;

            const isValid =
                Boolean(
                    validation[ruleName]
                );

            rule.classList.toggle(
                "valid",
                isValid
            );

            const icon =
                rule.querySelector("i");

            if (icon) {

                icon.className =
                    isValid
                        ? "fa-solid fa-circle-check"
                        : "fa-regular fa-circle";
            }
        });

        return Object
            .values(validation)
            .every(Boolean);
    }

    newPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(newPassword);

            updatePasswordRules();
        }
    );

    currentPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(
                currentPassword
            );
        }
    );

    confirmNewPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(
                confirmNewPassword
            );
        }
    );


    // ==================================================
    // ALTERAR SENHA
    // ==================================================

    changePasswordForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !currentPassword?.value ||
                currentPassword.value.length < 4
            ) {

                setFieldError(
                    currentPassword,
                    "Digite sua senha atual."
                );

                isValid = false;
            }

            if (!updatePasswordRules()) {

                setFieldError(
                    newPassword,
                    "A senha não atende aos requisitos."
                );

                isValid = false;
            }

            if (
                !confirmNewPassword?.value
            ) {

                setFieldError(
                    confirmNewPassword,
                    "Confirme a nova senha."
                );

                isValid = false;

            } else if (
                newPassword?.value !==
                confirmNewPassword.value
            ) {

                setFieldError(
                    confirmNewPassword,
                    "As senhas não são iguais."
                );

                isValid = false;
            }

            if (
                currentPassword?.value ===
                newPassword?.value
            ) {

                setFieldError(
                    newPassword,
                    "Use uma senha diferente da atual."
                );

                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                changePasswordForm
                    .querySelector(
                        ".primary-button"
                    );

            setLoadingState(
                submitButton,
                "Atualizando..."
            );

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankPasswordLastChanged",
                    new Date().toISOString()
                );

                changePasswordForm.reset();

                updatePasswordRules();

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    changePasswordModal
                );

                showToast(
                    "Senha atualizada com sucesso."
                );

            }, 1000);
        }
    );


    // ==================================================
    // DISPOSITIVOS
    // ==================================================

    deviceDisconnectButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "Deseja desconectar este dispositivo?"
                        );

                    if (!confirmed) return;

                    button
                        .closest(".device-item")
                        ?.remove();

                    showToast(
                        "Dispositivo desconectado."
                    );
                }
            );
        }
    );

    disconnectAllDevicesButton
        ?.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Deseja desconectar todos os outros dispositivos?"
                    );

                if (!confirmed) return;

                document
                    .querySelectorAll(
                        ".device-item:not(.current)"
                    )
                    .forEach((device) => {

                        device.remove();
                    });

                showToast(
                    "Outros dispositivos desconectados."
                );
            }
        );


    // ==================================================
    // LIMITES
    // ==================================================

    const limitFields = [
        dailyPixLimit,
        transferLimit,
        onlinePurchaseLimit,
        withdrawalLimit
    ].filter(Boolean);

    limitFields.forEach((field) => {

        field.addEventListener(
            "input",
            () => {

                field.value =
                    formatCurrencyInput(
                        field.value
                    );

                clearFieldError(field);
            }
        );
    });

    function validateLimitField(
        field,
        minimum,
        maximum
    ) {

        const value =
            currencyToNumber(
                field?.value || ""
            );

        if (!value || value <= 0) {

            setFieldError(
                field,
                "Digite um valor válido."
            );

            return false;
        }

        if (value < minimum) {

            setFieldError(
                field,
                `O mínimo é R$ ${formatCurrency(minimum)}.`
            );

            return false;
        }

        if (value > maximum) {

            setFieldError(
                field,
                `O máximo é R$ ${formatCurrency(maximum)}.`
            );

            return false;
        }

        clearFieldError(field);

        return true;
    }

    limitsForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const validations = [

                validateLimitField(
                    dailyPixLimit,
                    100,
                    50000
                ),

                validateLimitField(
                    transferLimit,
                    100,
                    100000
                ),

                validateLimitField(
                    onlinePurchaseLimit,
                    100,
                    50000
                ),

                validateLimitField(
                    withdrawalLimit,
                    100,
                    10000
                )
            ];

            if (
                validations.includes(false)
            ) {
                return;
            }

            const limits = {

                dailyPixLimit:
                    currencyToNumber(
                        dailyPixLimit.value
                    ),

                transferLimit:
                    currencyToNumber(
                        transferLimit.value
                    ),

                onlinePurchaseLimit:
                    currencyToNumber(
                        onlinePurchaseLimit.value
                    ),

                withdrawalLimit:
                    currencyToNumber(
                        withdrawalLimit.value
                    )
            };

            const submitButton =
                limitsForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Salvando..."
            );

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankTransactionLimits",
                    JSON.stringify(limits)
                );

                restoreButtonState(
                    submitButton
                );

                showToast(
                    "Limites atualizados."
                );

            }, 800);
        }
    );

    function applyLimits(limits) {

        if (dailyPixLimit) {

            dailyPixLimit.value =
                formatCurrency(
                    limits.dailyPixLimit
                );
        }

        if (transferLimit) {

            transferLimit.value =
                formatCurrency(
                    limits.transferLimit
                );
        }

        if (onlinePurchaseLimit) {

            onlinePurchaseLimit.value =
                formatCurrency(
                    limits.onlinePurchaseLimit
                );
        }

        if (withdrawalLimit) {

            withdrawalLimit.value =
                formatCurrency(
                    limits.withdrawalLimit
                );
        }
    }

    function loadSavedLimits() {

        const savedLimits =
            localStorage.getItem(
                "chromaBankTransactionLimits"
            );

        if (!savedLimits) {

            applyLimits(defaultLimits);

            return;
        }

        try {

            applyLimits(
                JSON.parse(savedLimits)
            );

        } catch {

            localStorage.removeItem(
                "chromaBankTransactionLimits"
            );

            applyLimits(defaultLimits);
        }
    }

    loadSavedLimits();

    resetLimitsButton?.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Deseja restaurar os limites padrão?"
                );

            if (!confirmed) return;

            applyLimits(defaultLimits);

            localStorage.removeItem(
                "chromaBankTransactionLimits"
            );

            limitFields.forEach(
                clearFieldError
            );

            showToast(
                "Limites padrão restaurados."
            );
        }
    );


    // ==================================================
    // BAIXAR DADOS
    // ==================================================

    downloadDataButton?.addEventListener(
        "click",
        () => {

            const exportData = {

                exportedAt:
                    new Date().toISOString(),

                profile:
                    JSON.parse(
                        localStorage.getItem(
                            "chromaBankProfileData"
                        ) || "null"
                    ),

                address:
                    JSON.parse(
                        localStorage.getItem(
                            "chromaBankAddressData"
                        ) || "null"
                    ),

                preferences:
                    JSON.parse(
                        localStorage.getItem(
                            "chromaBankPreferences"
                        ) || "null"
                    ),

                limits:
                    JSON.parse(
                        localStorage.getItem(
                            "chromaBankTransactionLimits"
                        ) || "null"
                    )
            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            exportData,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "chromabank-dados.json";

            document.body.appendChild(link);

            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            showToast(
                "Arquivo de dados gerado."
            );
        }
    );


    // ==================================================
    // HISTÓRICO DE ACESSOS
    // ==================================================

    accessHistoryButton?.addEventListener(
        "click",
        () => {

            window.alert(
                [
                    "Histórico de acessos:",
                    "",
                    "• Chrome no Windows — Agora",
                    "• ChromaBank Mobile — Há 2 dias",
                    "• Chrome no Windows — Há 5 dias"
                ].join("\n")
            );
        }
    );


    // ==================================================
    // ENCERRAMENTO DA CONTA
    // ==================================================

    closeAccountConfirmation
        ?.addEventListener(
            "input",
            () => {

                const isConfirmed =
                    closeAccountConfirmation
                        .value
                        .trim()
                        .toUpperCase() ===
                    "ENCERRAR";

                if (
                    confirmCloseAccountButton
                ) {
                    confirmCloseAccountButton.disabled =
                        !isConfirmed;
                }

                clearFieldError(
                    closeAccountConfirmation
                );
            }
        );

    confirmCloseAccountButton
        ?.addEventListener(
            "click",
            () => {

                const confirmation =
                    closeAccountConfirmation
                        ?.value
                        .trim()
                        .toUpperCase();

                if (
                    confirmation !== "ENCERRAR"
                ) {

                    setFieldError(
                        closeAccountConfirmation,
                        "Digite ENCERRAR para confirmar."
                    );

                    return;
                }

                const confirmed =
                    window.confirm(
                        "Tem certeza que deseja solicitar o encerramento?"
                    );

                if (!confirmed) return;

                setLoadingState(
                    confirmCloseAccountButton,
                    "Enviando..."
                );

                setTimeout(() => {

                    localStorage.setItem(
                        "chromaBankAccountClosureRequest",
                        JSON.stringify({
                            status: "requested",
                            requestedAt:
                                new Date().toISOString()
                        })
                    );

                    restoreButtonState(
                        confirmCloseAccountButton
                    );

                    confirmCloseAccountButton.disabled =
                        true;

                    closeAccountConfirmation.value =
                        "";

                    closeModal(closeAccountModal);

                    showToast(
                        "Solicitação enviada."
                    );

                }, 1000);
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
            closeNotificationsMenu();

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


    // ==================================================
    // VISUAL INICIAL
    // ==================================================

    updateSelectableCards();

});