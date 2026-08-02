// ==================================================
// CHROMABANK — NOTIFICAÇÕES GLOBAIS
// Arquivo: assets/js/notifications.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const notificationsButton =
        document.getElementById("notificationsButton");

    if (!notificationsButton) return;

    let panel = null;

    const defaultNotifications = [
        {
            id: 1,
            type: "pix",
            title: "PIX recebido",
            message: "Você recebeu R$ 250,00.",
            time: "Agora",
            read: false
        },
        {
            id: 2,
            type: "card",
            title: "Compra aprovada",
            message: "Compra de R$ 89,90 aprovada no cartão.",
            time: "Há 18 min",
            read: false
        },
        {
            id: 3,
            type: "security",
            title: "Novo acesso",
            message: "Sua conta foi acessada pelo Chrome no Windows.",
            time: "Hoje",
            read: true
        }
    ];

    function loadNotifications() {

        const saved =
            localStorage.getItem(
                "chromaBankNotifications"
            );

        if (!saved) {

            localStorage.setItem(
                "chromaBankNotifications",
                JSON.stringify(defaultNotifications)
            );

            return [...defaultNotifications];
        }

        try {
            return JSON.parse(saved);
        } catch {
            return [...defaultNotifications];
        }
    }

    function saveNotifications(notifications) {

        localStorage.setItem(
            "chromaBankNotifications",
            JSON.stringify(notifications)
        );
    }

    function getIcon(type) {

        const icons = {
            pix: "fa-brands fa-pix",
            card: "fa-regular fa-credit-card",
            security: "fa-solid fa-shield-halved",
            transfer: "fa-solid fa-arrow-right-arrow-left",
            investment: "fa-solid fa-chart-line"
        };

        return icons[type] || "fa-regular fa-bell";
    }

    function updateBadge() {

        const notifications =
            loadNotifications();

        const unreadCount =
            notifications.filter(
                notification => !notification.read
            ).length;

        let badge =
            notificationsButton.querySelector(
                ".notification-badge"
            );

        if (!badge) {

            badge =
                document.createElement("span");

            badge.className =
                "notification-badge";

            notificationsButton.appendChild(
                badge
            );
        }

        badge.textContent =
            unreadCount > 9
                ? "9+"
                : unreadCount;

        badge.hidden =
            unreadCount === 0;
    }

    function createPanel() {

        panel =
            document.createElement("aside");

        panel.className =
            "notifications-panel";

        document.body.appendChild(panel);

        renderPanel();
    }

    function renderPanel() {

        if (!panel) return;

        const notifications =
            loadNotifications();

        const unreadCount =
            notifications.filter(
                item => !item.read
            ).length;

        const items =
            notifications.length
                ? notifications.map(item => `
                    <article
                        class="notification-item ${
                            item.read ? "" : "unread"
                        }"
                        data-notification-id="${item.id}"
                    >
                        <span class="notification-icon">
                            <i class="${getIcon(item.type)}"></i>
                        </span>

                        <div class="notification-content">
                            <strong>${item.title}</strong>
                            <p>${item.message}</p>
                            <small>${item.time}</small>
                        </div>

                        <button
                            type="button"
                            class="notification-read-button"
                            aria-label="Marcar como lida"
                        >
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </article>
                `).join("")
                : `
                    <div class="notifications-empty">
                        <i class="fa-regular fa-bell-slash"></i>
                        <strong>Nenhuma notificação</strong>
                        <span>Os novos avisos aparecerão aqui.</span>
                    </div>
                `;

        panel.innerHTML = `
            <div class="notifications-header">
                <div>
                    <span>Central</span>
                    <h2>Notificações</h2>
                    <p>
                        ${unreadCount}
                        ${unreadCount === 1
                            ? "não lida"
                            : "não lidas"}
                    </p>
                </div>

                <button
                    type="button"
                    class="notifications-close"
                    aria-label="Fechar notificações"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="notifications-actions">
                <button
                    type="button"
                    id="markAllNotifications"
                >
                    Marcar todas como lidas
                </button>

                <button
                    type="button"
                    id="clearNotifications"
                >
                    Limpar
                </button>
            </div>

            <div class="notifications-list">
                ${items}
            </div>
        `;

        bindPanelEvents();
    }

    function bindPanelEvents() {

        panel
            ?.querySelector(".notifications-close")
            ?.addEventListener(
                "click",
                closePanel
            );

        panel
            ?.querySelector("#markAllNotifications")
            ?.addEventListener(
                "click",
                () => {

                    const notifications =
                        loadNotifications()
                            .map(item => ({
                                ...item,
                                read: true
                            }));

                    saveNotifications(notifications);
                    renderPanel();
                    updateBadge();
                }
            );

        panel
            ?.querySelector("#clearNotifications")
            ?.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "Deseja limpar todas as notificações?"
                        );

                    if (!confirmed) return;

                    saveNotifications([]);
                    renderPanel();
                    updateBadge();
                }
            );

        panel
            ?.querySelectorAll(
                ".notification-item"
            )
            .forEach(item => {

                const id =
                    Number(
                        item.dataset.notificationId
                    );

                item
                    .querySelector(
                        ".notification-read-button"
                    )
                    ?.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            const notifications =
                                loadNotifications()
                                    .map(notification => {

                                        if (
                                            notification.id === id
                                        ) {
                                            return {
                                                ...notification,
                                                read: true
                                            };
                                        }

                                        return notification;
                                    });

                            saveNotifications(
                                notifications
                            );

                            renderPanel();
                            updateBadge();
                        }
                    );

                item.addEventListener(
                    "click",
                    () => {

                        const notifications =
                            loadNotifications()
                                .map(notification => {

                                    if (
                                        notification.id === id
                                    ) {
                                        return {
                                            ...notification,
                                            read: true
                                        };
                                    }

                                    return notification;
                                });

                        saveNotifications(
                            notifications
                        );

                        renderPanel();
                        updateBadge();
                    }
                );
            });
    }

    function positionPanel() {

        if (!panel) return;

        const rect =
            notificationsButton
                .getBoundingClientRect();

        panel.style.top =
            `${rect.bottom + 12}px`;

        panel.style.right =
            `${window.innerWidth - rect.right}px`;
    }

    function openPanel() {

        if (!panel) {
            createPanel();
        }

        positionPanel();

        panel.classList.add("active");

        document.body.classList.add(
            "notifications-open"
        );
    }

    function closePanel() {

        panel?.classList.remove("active");

        document.body.classList.remove(
            "notifications-open"
        );
    }

    notificationsButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (!panel) {
                createPanel();
            }

            if (
                panel.classList.contains("active")
            ) {
                closePanel();
            } else {
                openPanel();
            }
        }
    );

    document.addEventListener(
        "click",
        event => {

            if (
                panel &&
                !panel.contains(event.target) &&
                !notificationsButton.contains(
                    event.target
                )
            ) {
                closePanel();
            }
        }
    );

    window.addEventListener(
        "resize",
        () => {

            if (
                panel
                    ?.classList
                    .contains("active")
            ) {
                positionPanel();
            }
        }
    );

    updateBadge();

});