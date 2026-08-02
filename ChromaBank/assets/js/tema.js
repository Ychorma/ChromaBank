(function () {

    const savedPreferences =
        localStorage.getItem(
            "chromaBankPreferences"
        );

    let theme = "dark";

    if (savedPreferences) {

        try {

            const preferences =
                JSON.parse(savedPreferences);

            theme =
                preferences.theme || "dark";

        } catch {

            theme = "dark";
        }
    }

    function applyTheme(selectedTheme) {

        document.body.classList.remove(
            "theme-dark",
            "theme-light"
        );

        if (selectedTheme === "light") {
            document.body.classList.add(
                "theme-light"
            );

            return;
        }

        if (selectedTheme === "dark") {
            document.body.classList.add(
                "theme-dark"
            );

            return;
        }

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        document.body.classList.add(
            prefersDark
                ? "theme-dark"
                : "theme-light"
        );
    }

    applyTheme(theme);

})();