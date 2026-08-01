// ==================================================
// CHROMABANK — INVESTIMENTOS
// Arquivo: investimentos.js
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
    const toggleValuesButton =
        document.getElementById("toggleValues");

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    // Valores sensíveis
    const sensitiveValues =
        document.querySelectorAll(".sensitive-value");

    // Gráficos
    const portfolioChartCanvas =
        document.getElementById("portfolioChart");

    const allocationChartCanvas =
        document.getElementById("allocationChart");

    const periodButtons =
        document.querySelectorAll("[data-period]");

    // Produtos
    const productFilterButtons =
        document.querySelectorAll("[data-filter]");

    const investmentProducts =
        document.querySelectorAll(".investment-product");

    const productApplyButtons =
        document.querySelectorAll(".product-apply-button");

    // Carteira
    const portfolioItems =
        document.querySelectorAll(".portfolio-item");

    const portfolioMenuButtons =
        document.querySelectorAll(".portfolio-menu-button");

    const investmentDropdown =
        document.getElementById("investmentDropdown");

    // Modais
    const modals =
        document.querySelectorAll(".modal");

    const openModalButtons =
        document.querySelectorAll("[data-open-modal]");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Aplicação
    const applyForm =
        document.getElementById("applyForm");

    const selectedProductName =
        document.getElementById("selectedProductName");

    const selectedProductYield =
        document.getElementById("selectedProductYield");

    const selectedProductCategory =
        document.getElementById("selectedProductCategory");

    const selectedProductMinimum =
        document.getElementById("selectedProductMinimum");

    const minimumApplicationLabel =
        document.getElementById("minimumApplicationLabel");

    const applicationAmount =
        document.getElementById("applicationAmount");

    const investmentTerms =
        document.getElementById("investmentTerms");

    // Resgate
    const redeemForm =
        document.getElementById("redeemForm");

    const redeemInvestmentName =
        document.getElementById("redeemInvestmentName");

    const redeemInvestmentType =
        document.getElementById("redeemInvestmentType");

    const redeemAvailableBalance =
        document.getElementById("redeemAvailableBalance");

    const redeemAmount =
        document.getElementById("redeemAmount");

    const redeemFullBalanceButton =
        document.getElementById("redeemFullBalanceButton");

    // Perfil de investidor
    const profileTestButton =
        document.getElementById("profileTestButton");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let valuesAreVisible = true;
    let profileMenu = null;
    let toastTimeout = null;
    let selectedPortfolioItem = null;
    let portfolioChart = null;
    let allocationChart = null;


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
                element.dataset.value ||
                element.textContent.trim();

            element.textContent =
                valuesAreVisible
                    ? originalValue
                    : "R$ ••••••";
        });

        if (toggleValuesButton) {
            toggleValuesButton.innerHTML =
                valuesAreVisible
                    ? '<i class="fa-regular fa-eye"></i>'
                    : '<i class="fa-regular fa-eye-slash"></i>';

            toggleValuesButton.setAttribute(
                "aria-label",
                valuesAreVisible
                    ? "Ocultar valores"
                    : "Mostrar valores"
            );
        }

        localStorage.setItem(
            "chromaBankInvestmentValuesVisible",
            String(valuesAreVisible)
        );
    }

    const savedValuesPreference =
        localStorage.getItem(
            "chromaBankInvestmentValuesVisible"
        );

    if (savedValuesPreference !== null) {
        valuesAreVisible =
            savedValuesPreference === "true";
    }

    toggleValuesButton?.addEventListener("click", () => {
        valuesAreVisible = !valuesAreVisible;
        updateSensitiveValues();
    });

    updateSensitiveValues();


    // ==================================================
    // GRÁFICOS
    // ==================================================

    const portfolioDataByPeriod = {

        "1M": {
            labels: ["01", "06", "12", "18", "24", "30"],
            values: [11920, 12010, 12140, 12310, 12490, 12650.80]
        },

        "3M": {
            labels: ["Mai", "Jun", "Jul", "Ago"],
            values: [10800, 11450, 11960, 12650.80]
        },

        "6M": {
            labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
            values: [9850, 10280, 10800, 11450, 11960, 12650.80]
        },

        "1A": {
            labels: [
                "Set",
                "Out",
                "Nov",
                "Dez",
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago"
            ],

            values: [
                8300,
                8560,
                8790,
                9040,
                9280,
                9560,
                9850,
                10280,
                10800,
                11450,
                11960,
                12650.80
            ]
        },

        "ALL": {
            labels: [
                "2024",
                "Jan/25",
                "Abr/25",
                "Jul/25",
                "Out/25",
                "Jan/26",
                "Abr/26",
                "Ago/26"
            ],

            values: [
                3200,
                4450,
                5960,
                7100,
                8420,
                9280,
                10280,
                12650.80
            ]
        }
    };

    function createPortfolioChart(period = "6M") {

        if (
            !portfolioChartCanvas ||
            typeof Chart === "undefined"
        ) {
            return;
        }

        const data =
            portfolioDataByPeriod[period] ||
            portfolioDataByPeriod["6M"];

        portfolioChart?.destroy();

        const context =
            portfolioChartCanvas.getContext("2d");

        const gradient =
            context.createLinearGradient(
                0,
                0,
                0,
                300
            );

        gradient.addColorStop(
            0,
            "rgba(124, 44, 255, 0.34)"
        );

        gradient.addColorStop(
            1,
            "rgba(124, 44, 255, 0)"
        );

        portfolioChart = new Chart(
            portfolioChartCanvas,
            {
                type: "line",

                data: {
                    labels: data.labels,

                    datasets: [
                        {
                            label:
                                "Patrimônio",

                            data:
                                data.values,

                            borderColor:
                                "#a864ff",

                            backgroundColor:
                                gradient,

                            fill:
                                true,

                            borderWidth:
                                3,

                            tension:
                                0.38,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                5,

                            pointHoverBackgroundColor:
                                "#ffffff",

                            pointHoverBorderColor:
                                "#7c2cff",

                            pointHoverBorderWidth:
                                3
                        }
                    ]
                },

                options: {
                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {
                        mode:
                            "index",

                        intersect:
                            false
                    },

                    plugins: {
                        legend: {
                            display:
                                false
                        },

                        tooltip: {
                            backgroundColor:
                                "rgba(11, 11, 17, 0.96)",

                            borderColor:
                                "rgba(168, 100, 255, 0.35)",

                            borderWidth:
                                1,

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#b9b8c5",

                            padding:
                                12,

                            callbacks: {
                                label(context) {
                                    return (
                                        " R$ " +
                                        Number(
                                            context.raw
                                        ).toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits:
                                                    2,

                                                maximumFractionDigits:
                                                    2
                                            }
                                        )
                                    );
                                }
                            }
                        }
                    },

                    scales: {
                        x: {
                            grid: {
                                display:
                                    false
                            },

                            ticks: {
                                color:
                                    "#74727f",

                                font: {
                                    family:
                                        "Poppins",

                                    size:
                                        9
                                }
                            },

                            border: {
                                display:
                                    false
                            }
                        },

                        y: {
                            beginAtZero:
                                false,

                            grid: {
                                color:
                                    "rgba(255, 255, 255, 0.05)"
                            },

                            ticks: {
                                color:
                                    "#74727f",

                                font: {
                                    family:
                                        "Poppins",

                                    size:
                                        9
                                },

                                callback(value) {
                                    return (
                                        "R$ " +
                                        Number(value)
                                            .toLocaleString(
                                                "pt-BR",
                                                {
                                                    maximumFractionDigits:
                                                        0
                                                }
                                            )
                                    );
                                }
                            },

                            border: {
                                display:
                                    false
                            }
                        }
                    }
                }
            }
        );
    }

    function createAllocationChart() {

        if (
            !allocationChartCanvas ||
            typeof Chart === "undefined"
        ) {
            return;
        }

        allocationChart?.destroy();

        allocationChart = new Chart(
            allocationChartCanvas,
            {
                type: "doughnut",

                data: {
                    labels: [
                        "Renda fixa",
                        "Fundos",
                        "Ações",
                        "Criptoativos"
                    ],

                    datasets: [
                        {
                            data: [
                                45,
                                25,
                                20,
                                10
                            ],

                            backgroundColor: [
                                "#7c2cff",
                                "#5c7cff",
                                "#29dc7d",
                                "#ffb946"
                            ],

                            borderColor:
                                "#0a0a0f",

                            borderWidth:
                                5,

                            hoverOffset:
                                8
                        }
                    ]
                },

                options: {
                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "72%",

                    plugins: {
                        legend: {
                            display:
                                false
                        },

                        tooltip: {
                            backgroundColor:
                                "rgba(11, 11, 17, 0.96)",

                            borderColor:
                                "rgba(168, 100, 255, 0.35)",

                            borderWidth:
                                1,

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#b9b8c5",

                            padding:
                                12,

                            callbacks: {
                                label(context) {
                                    return (
                                        ` ${context.label}: ${context.raw}%`
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
    }

    periodButtons.forEach((button) => {

        button.addEventListener("click", () => {

            periodButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            createPortfolioChart(
                button.dataset.period
            );
        });
    });

    createPortfolioChart("6M");
    createAllocationChart();


    // ==================================================
    // FILTRO DOS PRODUTOS
    // ==================================================

    productFilterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            productFilterButtons.forEach(
                (item) => {
                    item.classList.remove("active");
                }
            );

            button.classList.add("active");

            const selectedFilter =
                button.dataset.filter;

            investmentProducts.forEach(
                (product) => {

                    const category =
                        product.dataset
                            .productCategory;

                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;

                    product.classList.toggle(
                        "hidden",
                        !shouldShow
                    );
                }
            );
        });
    });


    // ==================================================
    // MODAIS
    // ==================================================

    function openModal(modalId) {

        const modal =
            document.getElementById(modalId);

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
                "input:not([type='hidden']), button"
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
            !document.querySelector(
                ".modal.active"
            )
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
            openModal(
                button.dataset.openModal
            );
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
    // FUNÇÕES AUXILIARES
    // ==================================================

    function onlyNumbers(value) {
        return value.replace(/\D/g, "");
    }

    function formatCurrency(value) {

        return Number(value).toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        );
    }

    function formatCurrencyInput(value) {

        const digits =
            onlyNumbers(value);

        if (!digits) return "";

        const number =
            Number(digits) / 100;

        return formatCurrency(number);
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
            errorElement.textContent =
                message;
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

    applicationAmount?.addEventListener(
        "input",
        () => {

            applicationAmount.value =
                formatCurrencyInput(
                    applicationAmount.value
                );

            clearFieldError(
                applicationAmount
            );
        }
    );

    redeemAmount?.addEventListener(
        "input",
        () => {

            redeemAmount.value =
                formatCurrencyInput(
                    redeemAmount.value
                );

            clearFieldError(
                redeemAmount
            );
        }
    );


    // ==================================================
    // SELECIONAR PRODUTO
    // ==================================================

    function selectProduct(product) {

        const name =
            product.dataset.productName ||
            "Investimento";

        const minimum =
            Number(
                product.dataset.productMinimum ||
                0
            );

        const yieldText =
            product.dataset.productYield ||
            "Rentabilidade variável";

        const category =
            product.dataset.productCategory ||
            "fixed";

        if (selectedProductName) {
            selectedProductName.textContent =
                name;
        }

        if (selectedProductYield) {
            selectedProductYield.textContent =
                `Rentabilidade: ${yieldText}`;
        }

        if (selectedProductMinimum) {
            selectedProductMinimum.value =
                String(minimum);
        }

        if (selectedProductCategory) {
            selectedProductCategory.value =
                category;
        }

        if (minimumApplicationLabel) {
            minimumApplicationLabel.textContent =
                `Mínimo: R$ ${formatCurrency(minimum)}`;
        }

        if (applicationAmount) {
            applicationAmount.value = "";
        }

        if (investmentTerms) {
            investmentTerms.checked = false;
        }

        openModal("applyModal");
    }

    productApplyButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const product =
                button.closest(
                    ".investment-product"
                );

            if (!product) return;

            selectProduct(product);
        });
    });


    // ==================================================
    // APLICAÇÃO
    // ==================================================

    applyForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const amount =
                currencyToNumber(
                    applicationAmount?.value || ""
                );

            const minimum =
                Number(
                    selectedProductMinimum?.value ||
                    0
                );

            let isValid = true;

            if (!amount || amount <= 0) {

                setFieldError(
                    applicationAmount,
                    "Digite um valor maior que zero."
                );

                isValid = false;

            } else if (amount < minimum) {

                setFieldError(
                    applicationAmount,
                    `A aplicação mínima é de R$ ${formatCurrency(minimum)}.`
                );

                isValid = false;

            } else if (amount > 4856.90) {

                setFieldError(
                    applicationAmount,
                    "Saldo insuficiente para esta aplicação."
                );

                isValid = false;

            } else {

                clearFieldError(
                    applicationAmount
                );
            }

            if (!investmentTerms?.checked) {

                showToast(
                    "Aceite os termos para continuar.",
                    "error"
                );

                isValid = false;
            }

            if (!isValid) return;

            const submitButton =
                applyForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Investindo..."
            );

            const investment = {
                name:
                    selectedProductName
                        ?.textContent
                        .trim() ||
                    "Investimento",

                category:
                    selectedProductCategory
                        ?.value ||
                    "fixed",

                amount,

                date:
                    new Date().toISOString()
            };

            setTimeout(() => {

                saveInvestment(
                    investment
                );

                showToast(
                    `Aplicação de R$ ${formatCurrency(amount)} realizada com sucesso.`
                );

                applyForm.reset();

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    document.getElementById(
                        "applyModal"
                    )
                );

            }, 1500);
        }
    );


    // ==================================================
    // MENU DA CARTEIRA
    // ==================================================

    function closeInvestmentDropdown() {

        investmentDropdown
            ?.classList
            .remove("active");

        selectedPortfolioItem = null;
    }

    function positionInvestmentDropdown(
        button
    ) {

        if (!investmentDropdown) return;

        const rect =
            button.getBoundingClientRect();

        const dropdownWidth = 220;

        investmentDropdown.style.top =
            `${rect.bottom + 8}px`;

        if (
            rect.left + dropdownWidth >
            window.innerWidth - 15
        ) {
            investmentDropdown.style.right =
                `${Math.max(
                    window.innerWidth -
                    rect.right,
                    12
                )}px`;

            investmentDropdown.style.left =
                "auto";

        } else {

            investmentDropdown.style.left =
                `${rect.left}px`;

            investmentDropdown.style.right =
                "auto";
        }
    }

    portfolioMenuButtons.forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                selectedPortfolioItem =
                    button.closest(
                        ".portfolio-item"
                    );

                positionInvestmentDropdown(
                    button
                );

                investmentDropdown
                    ?.classList
                    .toggle("active");
            }
        );
    });

    investmentDropdown
        ?.querySelectorAll(
            "[data-investment-action]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    if (!selectedPortfolioItem) {
                        return;
                    }

                    const action =
                        button.dataset
                            .investmentAction;

                    const investmentName =
                        selectedPortfolioItem
                            .dataset
                            .investmentName ||
                        "Investimento";

                    if (action === "details") {

                        showToast(
                            `Detalhes de ${investmentName}.`
                        );

                    } else if (
                        action === "apply"
                    ) {

                        const fakeProduct = {
                            dataset: {
                                productName:
                                    investmentName,

                                productMinimum:
                                    "50",

                                productYield:
                                    "Rentabilidade conforme o produto",

                                productCategory:
                                    "fixed"
                            }
                        };

                        selectProduct(
                            fakeProduct
                        );

                    } else if (
                        action === "redeem"
                    ) {

                        prepareRedeemModal(
                            selectedPortfolioItem
                        );
                    }

                    closeInvestmentDropdown();
                }
            );
        });

    document.addEventListener(
        "click",
        (event) => {

            if (
                investmentDropdown &&
                !investmentDropdown.contains(
                    event.target
                )
            ) {
                closeInvestmentDropdown();
            }
        }
    );

    window.addEventListener(
        "scroll",
        closeInvestmentDropdown,
        { passive: true }
    );


    // ==================================================
    // RESGATE
    // ==================================================

    function prepareRedeemModal(item) {

        const name =
            item.dataset.investmentName ||
            "Investimento";

        const type =
            item.dataset.investmentType ||
            "Investimento";

        const balance =
            Number(
                item.dataset.investmentBalance ||
                0
            );

        if (redeemInvestmentName) {
            redeemInvestmentName.textContent =
                name;
        }

        if (redeemInvestmentType) {
            redeemInvestmentType.textContent =
                type;
        }

        if (redeemAvailableBalance) {

            redeemAvailableBalance.textContent =
                `R$ ${formatCurrency(balance)}`;

            redeemAvailableBalance.dataset.balance =
                String(balance);
        }

        if (redeemAmount) {
            redeemAmount.value = "";
        }

        openModal("redeemModal");
    }

    redeemFullBalanceButton?.addEventListener(
        "click",
        () => {

            const balance =
                Number(
                    redeemAvailableBalance
                        ?.dataset
                        .balance ||
                    0
                );

            if (redeemAmount) {
                redeemAmount.value =
                    formatCurrency(balance);
            }

            clearFieldError(
                redeemAmount
            );
        }
    );

    redeemForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const amount =
                currencyToNumber(
                    redeemAmount?.value ||
                    ""
                );

            const availableBalance =
                Number(
                    redeemAvailableBalance
                        ?.dataset
                        .balance ||
                    0
                );

            let isValid = true;

            if (!amount || amount <= 0) {

                setFieldError(
                    redeemAmount,
                    "Digite um valor maior que zero."
                );

                isValid = false;

            } else if (
                amount > availableBalance
            ) {

                setFieldError(
                    redeemAmount,
                    "O valor é maior que o saldo disponível."
                );

                isValid = false;

            } else {

                clearFieldError(
                    redeemAmount
                );
            }

            if (!isValid) return;

            const submitButton =
                redeemForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Resgatando..."
            );

            const redemption = {
                investment:
                    redeemInvestmentName
                        ?.textContent
                        .trim() ||
                    "Investimento",

                amount,

                date:
                    new Date().toISOString()
            };

            setTimeout(() => {

                saveRedemption(
                    redemption
                );

                showToast(
                    `Resgate de R$ ${formatCurrency(amount)} solicitado com sucesso.`
                );

                redeemForm.reset();

                restoreButtonState(
                    submitButton
                );

                closeModal(
                    document.getElementById(
                        "redeemModal"
                    )
                );

            }, 1500);
        }
    );


    // ==================================================
    // SALVAR DADOS DE DEMONSTRAÇÃO
    // ==================================================

    function saveInvestment(investment) {

        const investments = JSON.parse(
            localStorage.getItem(
                "chromaBankDemoInvestments"
            ) || "[]"
        );

        investments.unshift(
            investment
        );

        localStorage.setItem(
            "chromaBankDemoInvestments",
            JSON.stringify(
                investments.slice(0, 30)
            )
        );
    }

    function saveRedemption(redemption) {

        const redemptions = JSON.parse(
            localStorage.getItem(
                "chromaBankDemoRedemptions"
            ) || "[]"
        );

        redemptions.unshift(
            redemption
        );

        localStorage.setItem(
            "chromaBankDemoRedemptions",
            JSON.stringify(
                redemptions.slice(0, 30)
            )
        );
    }


    // ==================================================
    // PERFIL DE INVESTIDOR
    // ==================================================

    profileTestButton?.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Deseja refazer o teste de perfil de investidor?"
                );

            if (!confirmed) return;

            showToast(
                "Teste de perfil iniciado. Esta etapa será criada depois."
            );
        }
    );


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

        toast.classList.add(
            "active"
        );

        clearTimeout(
            toastTimeout
        );

        toastTimeout =
            setTimeout(
                () => {
                    toast.classList.remove(
                        "active"
                    );
                },
                2800
            );
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

        document.body.appendChild(
            profileMenu
        );

        document
            .getElementById(
                "profileLogout"
            )
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
            closeAllModals();
            closeInvestmentDropdown();

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