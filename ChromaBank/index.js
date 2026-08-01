// ==================================================
// CHORMABANK — LANDING PAGE
// Arquivo: index.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTOS PRINCIPAIS
    // ==================================================

    const body = document.body;
    const header = document.querySelector(".header");
    const navbar = document.querySelector(".navbar");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const navLinks = document.querySelectorAll(".nav-links a");

    const bankCard = document.querySelector(".bank-card");
    const heroVisual = document.querySelector(".hero-visual");

    const watchButton = document.getElementById("watchButton");

    // ==================================================
    // MENU MOBILE
    // ==================================================

    function openMenu() {
        if (!navMenu || !menuToggle) return;

        navMenu.classList.add("active");
        body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");

        menuToggle.innerHTML = `
            <i class="fa-solid fa-xmark"></i>
        `;
    }

    function closeMenu() {
        if (!navMenu || !menuToggle) return;

        navMenu.classList.remove("active");
        body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

        menuToggle.innerHTML = `
            <i class="fa-solid fa-bars"></i>
        `;
    }

    function toggleMenu() {
        const menuIsOpen = navMenu.classList.contains("active");

        if (menuIsOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    // Fecha ao clicar em um link do menu
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (event) => {
        if (!navMenu || !menuToggle) return;

        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (
            navMenu.classList.contains("active") &&
            !clickedInsideMenu &&
            !clickedToggle
        ) {
            closeMenu();
        }
    });

    // Fecha com ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Fecha o menu ao voltar para o desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1050) {
            closeMenu();
        }
    });

    // ==================================================
    // NAVBAR AO ROLAR A PÁGINA
    // ==================================================

    function updateNavbarOnScroll() {
        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbarOnScroll, {
        passive: true
    });

    updateNavbarOnScroll();

    // ==================================================
    // SCROLL SUAVE
    // ==================================================

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight + 28
                : 100;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    // ==================================================
    // REVELAR ELEMENTOS AO ROLAR
    // ==================================================

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".solution-card, " +
        ".about-text, " +
        ".about-stats article, " +
        ".help-section, " +
        ".benefit-item"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("reveal-visible");

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    // ==================================================
    // EFEITO 3D NO CARTÃO
    // ==================================================

    const userPrefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function resetCardPosition() {
        if (!bankCard) return;

        bankCard.style.transform = "";
    }

    if (
        bankCard &&
        heroVisual &&
        !userPrefersReducedMotion &&
        window.innerWidth > 700
    ) {
        heroVisual.addEventListener("mousemove", (event) => {

            const bounds = heroVisual.getBoundingClientRect();

            const mouseX = event.clientX - bounds.left;
            const mouseY = event.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            const rotateY =
                ((mouseX - centerX) / centerX) * 8;

            const rotateX =
                ((centerY - mouseY) / centerY) * 6;

            bankCard.style.animation = "none";

            bankCard.style.transform = `
                perspective(1100px)
                rotateX(${9 + rotateX}deg)
                rotateY(${-13 + rotateY}deg)
                rotateZ(7deg)
                translateY(-8px)
            `;
        });

        heroVisual.addEventListener("mouseleave", () => {

            bankCard.style.transform = "";

            setTimeout(() => {
                bankCard.style.animation = "";
            }, 500);
        });
    }

    // ==================================================
    // BOTÃO "VER COMO FUNCIONA"
    // ==================================================

    if (watchButton) {
        watchButton.addEventListener("click", () => {

            const productsSection =
                document.getElementById("para-voce");

            if (!productsSection) return;

            const navbarHeight = navbar
                ? navbar.offsetHeight + 28
                : 100;

            const targetPosition =
                productsSection.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    }

    // ==================================================
    // BOTÃO VOLTAR AO TOPO
    // ==================================================

    const backToTopButton = document.createElement("button");

    backToTopButton.type = "button";
    backToTopButton.className = "back-to-top";
    backToTopButton.setAttribute(
        "aria-label",
        "Voltar ao topo"
    );

    backToTopButton.innerHTML = `
        <i class="fa-solid fa-arrow-up"></i>
    `;

    body.appendChild(backToTopButton);

    function updateBackToTopButton() {
        if (window.scrollY > 550) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", updateBackToTopButton, {
        passive: true
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateBackToTopButton();

    // ==================================================
    // LINK ATIVO NO MENU
    // ==================================================

    const sections = document.querySelectorAll("main section[id]");

    function updateActiveMenuLink() {

        let currentSectionId = "";

        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                    sectionTop + sectionHeight
            ) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveMenuLink, {
        passive: true
    });

    updateActiveMenuLink();

});