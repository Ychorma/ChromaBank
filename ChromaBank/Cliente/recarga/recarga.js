// ==================================================
// CHROMABANK — RECARGA
// Arquivo: recarga.js
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

    const headerProfileAvatar =
        profileButton?.querySelector(".profile-avatar");

    const logoutButton =
        document.getElementById("logoutButton");

    // Formulário
    const rechargeForm =
        document.getElementById("rechargeForm");

    const phoneNumber =
        document.getElementById("phoneNumber");

    const selectedOperator =
        document.getElementById("selectedOperator");

    const operatorCards =
        document.querySelectorAll(".operator-card");

    const operatorError =
        document.getElementById("operatorError");

    const amountButtons =
        document.querySelectorAll(".amount-button");

    const amountError =
        document.getElementById("amountError");

    const customAmount =
        document.getElementById("customAmount");

    const paymentMethods =
        document.querySelectorAll(".payment-method");

    const paymentMethodInputs =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    const saveFavoriteNumber =
        document.getElementById("saveFavoriteNumber");

    // Favoritos e contatos
    const favoriteNumbers =
        document.querySelectorAll(".favorite-number");

    const contactItems =
        document.querySelectorAll(".contact-item");

    const openContactsButton =
        document.getElementById("openContactsButton");

    // Modais
    const confirmationModal =
        document.getElementById("confirmationModal");

    const contactsModal =
        document.getElementById("contactsModal");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Confirmação
    const confirmationPhone =
        document.getElementById("confirmationPhone");

    const confirmationOperator =
        document.getElementById("confirmationOperator");

    const confirmationAmount =
        document.getElementById("confirmationAmount");

    const confirmationPaymentMethod =
        document.getElementById("confirmationPaymentMethod");

    const confirmRechargeButton =
        document.getElementById("confirmRechargeButton");

    // Outros botões
    const promotionButton =
        document.getElementById("promotionButton");

    const manageFavoritesButton =
        document.getElementById("manageFavoritesButton");

    const helpButton =
        document.getElementById("helpButton");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let profileMenu = null;
    let toastTimeout = null;
    let balanceIsVisible = true;
    let selectedAmount = 0;
    let pendingRecharge = null;


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
            "chromaBankRechargeBalanceVisible",
            String(balanceIsVisible)
        );
    }

    const savedBalancePreference =
        localStorage.getItem(
            "chromaBankRechargeBalanceVisible"
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

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        body.classList.add("modal-open");
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
        document
            .querySelectorAll(".modal")
            .forEach((modal) => {
                modal.classList.remove("active");
                modal.setAttribute("aria-hidden", "true");
            });

        body.classList.remove("modal-open");
    }

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

    function formatPhone(value) {
        const digits =
            onlyNumbers(value).slice(0, 11);

        if (digits.length <= 10) {
            return digits
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }

        return digits
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
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

        const amount = Number(digits) / 100;

        return formatCurrency(amount);
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
            "Continuar";
    }

    function getSelectedPaymentMethod() {
        return document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value || "balance";
    }

    function getPaymentMethodLabel(method) {
        return method === "credit"
            ? "Cartão de crédito"
            : "Saldo da conta";
    }


    // ==================================================
    // TELEFONE
    // ==================================================

    phoneNumber?.addEventListener("input", () => {
        phoneNumber.value =
            formatPhone(phoneNumber.value);

        clearFieldError(phoneNumber);
    });


    // ==================================================
    // OPERADORAS
    // ==================================================

    function selectOperator(operatorName) {
        if (selectedOperator) {
            selectedOperator.value = operatorName;
        }

        operatorCards.forEach((card) => {
            card.classList.toggle(
                "active",
                card.dataset.operator === operatorName
            );
        });

        if (operatorError) {
            operatorError.textContent = "";
        }
    }

    operatorCards.forEach((card) => {
        card.addEventListener("click", () => {
            selectOperator(
                card.dataset.operator || ""
            );
        });
    });


    // ==================================================
    // VALORES
    // ==================================================

    function selectAmount(amount) {
        selectedAmount = Number(amount);

        amountButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                Number(button.dataset.amount) === selectedAmount
            );
        });

        if (customAmount) {
            customAmount.value = "";
        }

        if (amountError) {
            amountError.textContent = "";
        }

        clearFieldError(customAmount);
    }

    amountButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectAmount(
                button.dataset.amount
            );
        });
    });

    customAmount?.addEventListener("input", () => {
        customAmount.value =
            formatCurrencyInput(customAmount.value);

        selectedAmount =
            currencyToNumber(customAmount.value);

        amountButtons.forEach((button) => {
            button.classList.remove("active");
        });

        if (amountError) {
            amountError.textContent = "";
        }

        clearFieldError(customAmount);
    });


    // ==================================================
    // FORMA DE PAGAMENTO
    // ==================================================

    function updatePaymentMethodCards() {
        paymentMethods.forEach((method) => {
            const input =
                method.querySelector(
                    'input[name="paymentMethod"]'
                );

            method.classList.toggle(
                "active",
                Boolean(input?.checked)
            );
        });
    }

    paymentMethodInputs.forEach((input) => {
        input.addEventListener(
            "change",
            updatePaymentMethodCards
        );
    });

    updatePaymentMethodCards();


    // ==================================================
    // FAVORITOS E CONTATOS
    // ==================================================

    function fillRechargeData(phone, operator) {
        if (phoneNumber) {
            phoneNumber.value =
                formatPhone(phone);
        }

        selectOperator(operator);

        clearFieldError(phoneNumber);
    }

    favoriteNumbers.forEach((button) => {
        button.addEventListener("click", () => {
            fillRechargeData(
                button.dataset.phone || "",
                button.dataset.operator || ""
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            showToast(
                `${button.dataset.name || "Número"} selecionado.`
            );
        });
    });

    openContactsButton?.addEventListener("click", () => {
        openModal(contactsModal);
    });

    contactItems.forEach((button) => {
        button.addEventListener("click", () => {
            fillRechargeData(
                button.dataset.phone || "",
                button.dataset.operator || ""
            );

            closeModal(contactsModal);

            showToast(
                "Contato selecionado."
            );
        });
    });


    // ==================================================
    // VALIDAR FORMULÁRIO
    // ==================================================

    function validateRechargeForm() {
        let isValid = true;

        const phoneDigits =
            onlyNumbers(phoneNumber?.value || "");

        if (phoneDigits.length !== 11) {
            setFieldError(
                phoneNumber,
                "Digite um número de celular válido."
            );

            isValid = false;
        } else {
            clearFieldError(phoneNumber);
        }

        if (!selectedOperator?.value) {
            if (operatorError) {
                operatorError.textContent =
                    "Selecione uma operadora.";
            }

            isValid = false;
        } else if (operatorError) {
            operatorError.textContent = "";
        }

        const amount =
            selectedAmount ||
            currencyToNumber(
                customAmount?.value || ""
            );

        if (!amount || amount <= 0) {
            if (amountError) {
                amountError.textContent =
                    "Selecione ou informe o valor da recarga.";
            }

            isValid = false;
        } else if (amount < 10) {
            if (amountError) {
                amountError.textContent =
                    "O valor mínimo da recarga é R$ 10,00.";
            }

            isValid = false;
        } else if (amount > 200) {
            if (amountError) {
                amountError.textContent =
                    "O valor máximo da recarga é R$ 200,00.";
            }

            isValid = false;
        } else if (amountError) {
            amountError.textContent = "";
        }

        const paymentMethod =
            getSelectedPaymentMethod();

        if (
            paymentMethod === "balance" &&
            amount > 4856.90
        ) {
            if (amountError) {
                amountError.textContent =
                    "Saldo insuficiente para esta recarga.";
            }

            isValid = false;
        }

        return {
            isValid,
            amount,
            phoneDigits,
            paymentMethod
        };
    }


    // ==================================================
    // ABRIR CONFIRMAÇÃO
    // ==================================================

    rechargeForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const validation =
                validateRechargeForm();

            if (!validation.isValid) return;

            pendingRecharge = {
                phone:
                    validation.phoneDigits,

                formattedPhone:
                    formatPhone(
                        validation.phoneDigits
                    ),

                operator:
                    selectedOperator.value,

                amount:
                    validation.amount,

                paymentMethod:
                    validation.paymentMethod,

                favorite:
                    Boolean(
                        saveFavoriteNumber?.checked
                    ),

                createdAt:
                    new Date().toISOString()
            };

            if (confirmationPhone) {
                confirmationPhone.textContent =
                    pendingRecharge.formattedPhone;
            }

            if (confirmationOperator) {
                confirmationOperator.textContent =
                    pendingRecharge.operator;
            }

            if (confirmationAmount) {
                confirmationAmount.textContent =
                    `R$ ${formatCurrency(
                        pendingRecharge.amount
                    )}`;
            }

            if (confirmationPaymentMethod) {
                confirmationPaymentMethod.textContent =
                    getPaymentMethodLabel(
                        pendingRecharge.paymentMethod
                    );
            }

            openModal(confirmationModal);
        }
    );


    // ==================================================
    // CONFIRMAR RECARGA
    // ==================================================

    confirmRechargeButton?.addEventListener(
        "click",
        () => {

            if (!pendingRecharge) return;

            setLoadingState(
                confirmRechargeButton,
                "Processando..."
            );

            setTimeout(() => {

                saveRecharge(
                    pendingRecharge
                );

                if (pendingRecharge.favorite) {
                    saveFavorite(
                        pendingRecharge
                    );
                }

                showToast(
                    `Recarga de R$ ${formatCurrency(
                        pendingRecharge.amount
                    )} realizada com sucesso.`
                );

                rechargeForm?.reset();

                selectedAmount = 0;

                amountButtons.forEach((button) => {
                    button.classList.remove("active");
                });

                operatorCards.forEach((card) => {
                    card.classList.remove("active");
                });

                if (selectedOperator) {
                    selectedOperator.value = "";
                }

                updatePaymentMethodCards();

                restoreButtonState(
                    confirmRechargeButton
                );

                closeModal(
                    confirmationModal
                );

                pendingRecharge = null;

            }, 1500);
        }
    );


    // ==================================================
    // SALVAR DADOS DE DEMONSTRAÇÃO
    // ==================================================

    function saveRecharge(recharge) {
        const recharges = JSON.parse(
            localStorage.getItem(
                "chromaBankDemoRecharges"
            ) || "[]"
        );

        recharges.unshift(recharge);

        localStorage.setItem(
            "chromaBankDemoRecharges",
            JSON.stringify(
                recharges.slice(0, 30)
            )
        );
    }

    function saveFavorite(recharge) {
        const favorites = JSON.parse(
            localStorage.getItem(
                "chromaBankRechargeFavorites"
            ) || "[]"
        );

        const alreadyExists =
            favorites.some(
                (favorite) =>
                    favorite.phone ===
                    recharge.phone
            );

        if (alreadyExists) return;

        favorites.unshift({
            name:
                "Número salvo",

            phone:
                recharge.phone,

            operator:
                recharge.operator
        });

        localStorage.setItem(
            "chromaBankRechargeFavorites",
            JSON.stringify(
                favorites.slice(0, 15)
            )
        );
    }


    // ==================================================
    // FOTO DO PERFIL NO CABEÇALHO
    // ==================================================

    function loadHeaderProfile() {
        const savedPhoto =
            localStorage.getItem(
                "chromaBankProfilePhoto"
            );

        const savedProfile =
            localStorage.getItem(
                "chromaBankProfileData"
            );

        let initials = "VF";

        if (savedProfile) {
            try {
                const profile =
                    JSON.parse(savedProfile);

                const name =
                    profile.fullName || "";

                const parts =
                    name.trim().split(/\s+/);

                if (parts.length === 1) {
                    initials =
                        parts[0]
                            .slice(0, 2)
                            .toUpperCase();
                } else if (parts.length > 1) {
                    initials =
                        (
                            parts[0][0] +
                            parts[
                                parts.length - 1
                            ][0]
                        ).toUpperCase();
                }
            } catch {
                localStorage.removeItem(
                    "chromaBankProfileData"
                );
            }
        }

        if (!headerProfileAvatar) return;

        if (savedPhoto) {
            headerProfileAvatar.innerHTML = `
                <img
                    src="${savedPhoto}"
                    alt="Foto do perfil"
                >
            `;
        } else {
            headerProfileAvatar.textContent =
                initials;
        }
    }

    loadHeaderProfile();


    // ==================================================
    // AÇÕES SECUNDÁRIAS
    // ==================================================

    promotionButton?.addEventListener("click", () => {
        showToast(
            "Cashback válido para recargas a partir de R$ 30,00."
        );
    });

    manageFavoritesButton?.addEventListener("click", () => {
        showToast(
            "Gerenciamento de favoritos será adicionado depois."
        );
    });

    helpButton?.addEventListener("click", () => {
        showToast(
            "Confira o telefone, operadora e valor antes de confirmar."
        );
    });


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