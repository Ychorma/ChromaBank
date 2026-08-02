// ===============================================
// CHROMABANK — PERFIL GLOBAL
// Arquivo: assets/js/profile.js
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

    const profileAvatars =
        document.querySelectorAll(".profile-avatar");

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

    function loadProfileAvatars() {

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

            } catch (error) {

                console.error(
                    "Erro ao carregar o perfil:",
                    error
                );
            }
        }

        profileAvatars.forEach((avatar) => {

            if (savedPhoto) {

                avatar.innerHTML = `
                    <img
                        src="${savedPhoto}"
                        alt="Foto do perfil"
                    >
                `;

            } else {

                avatar.textContent =
                    getInitials(fullName);
            }
        });
    }

    loadProfileAvatars();

});