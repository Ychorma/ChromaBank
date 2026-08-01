// ==================================================
// CHROMABANK — PERFIL
// Arquivo: perfil.js
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
    const profileButton = document.getElementById("profileButton");
    const headerProfileAvatar =
        profileButton?.querySelector(".profile-avatar");

    const logoutButton = document.getElementById("logoutButton");

    // Perfil principal
    const editProfileButton =
        document.getElementById("editProfileButton");

    const profileDisplayName =
        document.getElementById("profileDisplayName");

    const profileInitials =
        document.getElementById("profileInitials");

    const profilePhoto =
        document.getElementById("profilePhoto");

    const profilePhotoImage =
        document.getElementById("profilePhotoImage");

    const profilePhotoInput =
        document.getElementById("profilePhotoInput");

    // Dados pessoais
    const personalDataForm =
        document.getElementById("personalDataForm");

    const editPersonalDataButton =
        document.getElementById("editPersonalDataButton");

    const cancelPersonalDataButton =
        document.getElementById("cancelPersonalDataButton");

    const personalDataActions =
        document.getElementById("personalDataActions");

    const fullName =
        document.getElementById("fullName");

    const cpf =
        document.getElementById("cpf");

    const birthDate =
        document.getElementById("birthDate");

    const gender =
        document.getElementById("gender");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    // Endereço
    const addressForm =
        document.getElementById("addressForm");

    const editAddressButton =
        document.getElementById("editAddressButton");

    const cancelAddressButton =
        document.getElementById("cancelAddressButton");

    const addressActions =
        document.getElementById("addressActions");

    const zipCode =
        document.getElementById("zipCode");

    const street =
        document.getElementById("street");

    const addressNumber =
        document.getElementById("addressNumber");

    const addressComplement =
        document.getElementById("addressComplement");

    const neighborhood =
        document.getElementById("neighborhood");

    const city =
        document.getElementById("city");

    const state =
        document.getElementById("state");

    const country =
        document.getElementById("country");

    // Modal de foto
    const photoModal =
        document.getElementById("photoModal");

    const photoPreviewImage =
        document.getElementById("photoPreviewImage");

    const photoPreviewInitials =
        document.getElementById("photoPreviewInitials");

    const photoModalInput =
        document.getElementById("photoModalInput");

    const removePhotoButton =
        document.getElementById("removePhotoButton");

    const savePhotoButton =
        document.getElementById("savePhotoButton");

    const closeModalButtons =
        document.querySelectorAll("[data-close-modal]");

    // Outros botões
    const updateDocumentsButton =
        document.getElementById("updateDocumentsButton");

    const privacyButton =
        document.getElementById("privacyButton");

    // Toast
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let profileMenu = null;
    let toastTimeout = null;

    let temporaryPhoto = null;
    let removePhotoRequested = false;

    let personalDataSnapshot = {};
    let addressSnapshot = {};


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
    // MODAL
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

        body.classList.remove("modal-open");
    }

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

    function formatZipCode(value) {

        const digits =
            onlyNumbers(value).slice(0, 8);

        return digits.replace(
            /(\d{5})(\d)/,
            "$1-$2"
        );
    }

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);
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
            "Salvar";
    }

    function readImageFile(file, callback) {

        if (!file) return;

        const validTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];

        if (!validTypes.includes(file.type)) {

            showToast(
                "Escolha uma imagem PNG, JPG ou WEBP.",
                "error"
            );

            return;
        }

        const maxSize = 3 * 1024 * 1024;

        if (file.size > maxSize) {

            showToast(
                "A imagem deve ter no máximo 3 MB.",
                "error"
            );

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            callback(reader.result);
        };

        reader.onerror = () => {

            showToast(
                "Não foi possível carregar a imagem.",
                "error"
            );
        };

        reader.readAsDataURL(file);
    }


    // ==================================================
    // FOTO DO PERFIL
    // ==================================================

    function updateProfilePhoto(photoData) {

        const hasPhoto =
            Boolean(photoData);

        if (profilePhotoImage) {

            profilePhotoImage.src =
                hasPhoto ? photoData : "";

            profilePhotoImage.hidden =
                !hasPhoto;
        }

        if (profileInitials) {
            profileInitials.style.display =
                hasPhoto ? "none" : "flex";
        }

        if (headerProfileAvatar) {

            if (hasPhoto) {

                headerProfileAvatar.innerHTML = `
                    <img
                        src="${photoData}"
                        alt="Foto do perfil"
                    >
                `;

            } else {

                headerProfileAvatar.textContent =
                    getInitials(
                        fullName?.value ||
                        "Vinícius Fernandes"
                    );
            }
        }
    }

    function updatePhotoPreview(photoData) {

        const hasPhoto =
            Boolean(photoData);

        if (photoPreviewImage) {

            photoPreviewImage.src =
                hasPhoto ? photoData : "";

            photoPreviewImage.hidden =
                !hasPhoto;
        }

        if (photoPreviewInitials) {

            photoPreviewInitials.style.display =
                hasPhoto ? "none" : "flex";

            photoPreviewInitials.textContent =
                getInitials(
                    fullName?.value ||
                    "Vinícius Fernandes"
                );
        }
    }

    function openPhotoModal() {

        const savedPhoto =
            localStorage.getItem(
                "chromaBankProfilePhoto"
            );

        temporaryPhoto = savedPhoto;
        removePhotoRequested = false;

        updatePhotoPreview(savedPhoto);
        openModal(photoModal);
    }

    profilePhotoInput?.addEventListener(
        "change",
        () => {

            const file =
                profilePhotoInput.files?.[0];

            if (!file) return;

            readImageFile(file, (photoData) => {

                temporaryPhoto = photoData;
                removePhotoRequested = false;

                updatePhotoPreview(photoData);
                openModal(photoModal);
            });

            profilePhotoInput.value = "";
        }
    );

    photoModalInput?.addEventListener(
        "change",
        () => {

            const file =
                photoModalInput.files?.[0];

            if (!file) return;

            readImageFile(file, (photoData) => {

                temporaryPhoto = photoData;
                removePhotoRequested = false;

                updatePhotoPreview(photoData);
            });

            photoModalInput.value = "";
        }
    );

    editProfileButton?.addEventListener(
        "click",
        openPhotoModal
    );

    profilePhoto?.addEventListener(
        "dblclick",
        openPhotoModal
    );

    removePhotoButton?.addEventListener(
        "click",
        () => {

            temporaryPhoto = null;
            removePhotoRequested = true;

            updatePhotoPreview(null);
        }
    );

    savePhotoButton?.addEventListener(
        "click",
        () => {

            if (removePhotoRequested) {

                localStorage.removeItem(
                    "chromaBankProfilePhoto"
                );

                updateProfilePhoto(null);

                showToast(
                    "Foto removida com sucesso."
                );

            } else if (temporaryPhoto) {

                try {

                    localStorage.setItem(
                        "chromaBankProfilePhoto",
                        temporaryPhoto
                    );

                    updateProfilePhoto(
                        temporaryPhoto
                    );

                    showToast(
                        "Foto atualizada com sucesso."
                    );

                } catch {

                    showToast(
                        "A imagem é muito grande para ser salva.",
                        "error"
                    );

                    return;
                }
            }

            closeModal(photoModal);
        }
    );


    // ==================================================
    // DADOS PESSOAIS
    // ==================================================

    const personalEditableFields = [
        fullName,
        birthDate,
        gender,
        email,
        phone
    ].filter(Boolean);

    function takePersonalDataSnapshot() {

        personalDataSnapshot = {
            fullName:
                fullName?.value || "",
            birthDate:
                birthDate?.value || "",
            gender:
                gender?.value || "",
            email:
                email?.value || "",
            phone:
                phone?.value || ""
        };
    }

    function restorePersonalDataSnapshot() {

        if (fullName) {
            fullName.value =
                personalDataSnapshot.fullName || "";
        }

        if (birthDate) {
            birthDate.value =
                personalDataSnapshot.birthDate || "";
        }

        if (gender) {
            gender.value =
                personalDataSnapshot.gender || "";
        }

        if (email) {
            email.value =
                personalDataSnapshot.email || "";
        }

        if (phone) {
            phone.value =
                personalDataSnapshot.phone || "";
        }
    }

    function setPersonalDataEditing(editing) {

        personalEditableFields.forEach((field) => {
            field.disabled = !editing;
        });

        if (cpf) {
            cpf.disabled = true;
        }

        if (personalDataActions) {
            personalDataActions.hidden =
                !editing;
        }

        if (editPersonalDataButton) {
            editPersonalDataButton.hidden =
                editing;
        }

        if (editing) {
            fullName?.focus();
        }
    }

    editPersonalDataButton
        ?.addEventListener(
            "click",
            () => {

                takePersonalDataSnapshot();
                setPersonalDataEditing(true);
            }
        );

    cancelPersonalDataButton
        ?.addEventListener(
            "click",
            () => {

                restorePersonalDataSnapshot();

                personalEditableFields
                    .forEach(clearFieldError);

                setPersonalDataEditing(false);
            }
        );

    phone?.addEventListener(
        "input",
        () => {

            phone.value =
                formatPhone(phone.value);

            clearFieldError(phone);
        }
    );

    [
        fullName,
        birthDate,
        email
    ].forEach((field) => {

        field?.addEventListener(
            "input",
            () => clearFieldError(field)
        );

        field?.addEventListener(
            "change",
            () => clearFieldError(field)
        );
    });

    personalDataForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            if (
                !fullName ||
                fullName.value.trim().length < 5
            ) {

                setFieldError(
                    fullName,
                    "Informe seu nome completo."
                );

                isValid = false;

            } else {

                clearFieldError(fullName);
            }

            if (!birthDate?.value) {

                setFieldError(
                    birthDate,
                    "Informe sua data de nascimento."
                );

                isValid = false;

            } else {

                const selectedDate =
                    new Date(
                        `${birthDate.value}T00:00:00`
                    );

                const today =
                    new Date();

                if (selectedDate >= today) {

                    setFieldError(
                        birthDate,
                        "Informe uma data válida."
                    );

                    isValid = false;

                } else {

                    clearFieldError(birthDate);
                }
            }

            if (
                !email ||
                !isValidEmail(
                    email.value.trim()
                )
            ) {

                setFieldError(
                    email,
                    "Digite um e-mail válido."
                );

                isValid = false;

            } else {

                clearFieldError(email);
            }

            const phoneDigits =
                onlyNumbers(
                    phone?.value || ""
                );

            if (
                phoneDigits.length < 10 ||
                phoneDigits.length > 11
            ) {

                setFieldError(
                    phone,
                    "Digite um telefone válido."
                );

                isValid = false;

            } else {

                clearFieldError(phone);
            }

            if (!isValid) return;

            const submitButton =
                personalDataForm
                    .querySelector(
                        ".primary-button"
                    );

            setLoadingState(
                submitButton,
                "Salvando..."
            );

            const profileData = {
                fullName:
                    fullName.value.trim(),
                cpf:
                    cpf?.value || "",
                birthDate:
                    birthDate.value,
                gender:
                    gender?.value || "",
                email:
                    email.value.trim(),
                phone:
                    phone.value
            };

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankProfileData",
                    JSON.stringify(profileData)
                );

                if (profileDisplayName) {

                    profileDisplayName.textContent =
                        profileData.fullName;
                }

                const initials =
                    getInitials(
                        profileData.fullName
                    );

                if (profileInitials) {
                    profileInitials.textContent =
                        initials;
                }

                if (
                    headerProfileAvatar &&
                    !localStorage.getItem(
                        "chromaBankProfilePhoto"
                    )
                ) {
                    headerProfileAvatar.textContent =
                        initials;
                }

                restoreButtonState(
                    submitButton
                );

                setPersonalDataEditing(false);

                showToast(
                    "Dados pessoais atualizados."
                );

            }, 1000);
        }
    );


    // ==================================================
    // ENDEREÇO
    // ==================================================

    const addressEditableFields = [
        zipCode,
        street,
        addressNumber,
        addressComplement,
        neighborhood,
        city,
        state,
        country
    ].filter(Boolean);

    function takeAddressSnapshot() {

        addressSnapshot = {
            zipCode:
                zipCode?.value || "",
            street:
                street?.value || "",
            addressNumber:
                addressNumber?.value || "",
            addressComplement:
                addressComplement?.value || "",
            neighborhood:
                neighborhood?.value || "",
            city:
                city?.value || "",
            state:
                state?.value || "",
            country:
                country?.value || ""
        };
    }

    function restoreAddressSnapshot() {

        Object.entries(
            addressSnapshot
        ).forEach(([key, value]) => {

            const field =
                document.getElementById(key);

            if (field) {
                field.value = value;
            }
        });
    }

    function setAddressEditing(editing) {

        addressEditableFields.forEach(
            (field) => {
                field.disabled = !editing;
            }
        );

        if (addressActions) {
            addressActions.hidden =
                !editing;
        }

        if (editAddressButton) {
            editAddressButton.hidden =
                editing;
        }

        if (editing) {
            zipCode?.focus();
        }
    }

    editAddressButton?.addEventListener(
        "click",
        () => {

            takeAddressSnapshot();
            setAddressEditing(true);
        }
    );

    cancelAddressButton?.addEventListener(
        "click",
        () => {

            restoreAddressSnapshot();

            addressEditableFields
                .forEach(clearFieldError);

            setAddressEditing(false);
        }
    );

    zipCode?.addEventListener(
        "input",
        () => {

            zipCode.value =
                formatZipCode(
                    zipCode.value
                );

            clearFieldError(zipCode);
        }
    );

    addressNumber?.addEventListener(
        "input",
        () => {

            addressNumber.value =
                onlyNumbers(
                    addressNumber.value
                ).slice(0, 8);

            clearFieldError(
                addressNumber
            );
        }
    );

    [
        street,
        addressComplement,
        neighborhood,
        city,
        country,
        state
    ].forEach((field) => {

        field?.addEventListener(
            "input",
            () => clearFieldError(field)
        );

        field?.addEventListener(
            "change",
            () => clearFieldError(field)
        );
    });

    addressForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            let isValid = true;

            const zipDigits =
                onlyNumbers(
                    zipCode?.value || ""
                );

            if (zipDigits.length !== 8) {

                setFieldError(
                    zipCode,
                    "Digite um CEP válido."
                );

                isValid = false;

            } else {

                clearFieldError(zipCode);
            }

            const requiredTextFields = [
                {
                    field: street,
                    message:
                        "Informe a rua."
                },
                {
                    field: addressNumber,
                    message:
                        "Informe o número."
                },
                {
                    field: neighborhood,
                    message:
                        "Informe o bairro."
                },
                {
                    field: city,
                    message:
                        "Informe a cidade."
                },
                {
                    field: country,
                    message:
                        "Informe o país."
                }
            ];

            requiredTextFields.forEach(
                ({ field, message }) => {

                    if (
                        !field ||
                        field.value.trim().length < 2
                    ) {

                        setFieldError(
                            field,
                            message
                        );

                        isValid = false;

                    } else {

                        clearFieldError(
                            field
                        );
                    }
                }
            );

            if (!state?.value) {

                setFieldError(
                    state,
                    "Selecione o estado."
                );

                isValid = false;

            } else {

                clearFieldError(state);
            }

            if (!isValid) return;

            const submitButton =
                addressForm.querySelector(
                    ".primary-button"
                );

            setLoadingState(
                submitButton,
                "Salvando..."
            );

            const addressData = {
                zipCode:
                    zipCode.value,
                street:
                    street.value.trim(),
                addressNumber:
                    addressNumber.value.trim(),
                addressComplement:
                    addressComplement
                        ?.value
                        .trim() || "",
                neighborhood:
                    neighborhood.value.trim(),
                city:
                    city.value.trim(),
                state:
                    state.value,
                country:
                    country.value.trim()
            };

            setTimeout(() => {

                localStorage.setItem(
                    "chromaBankAddressData",
                    JSON.stringify(addressData)
                );

                restoreButtonState(
                    submitButton
                );

                setAddressEditing(false);

                showToast(
                    "Endereço atualizado com sucesso."
                );

            }, 1000);
        }
    );


    // ==================================================
    // CARREGAR DADOS SALVOS
    // ==================================================

    function loadSavedProfileData() {

        const savedData =
            localStorage.getItem(
                "chromaBankProfileData"
            );

        if (!savedData) return;

        try {

            const data =
                JSON.parse(savedData);

            if (fullName && data.fullName) {
                fullName.value =
                    data.fullName;
            }

            if (cpf && data.cpf) {
                cpf.value =
                    data.cpf;
            }

            if (
                birthDate &&
                data.birthDate
            ) {
                birthDate.value =
                    data.birthDate;
            }

            if (gender) {
                gender.value =
                    data.gender || "";
            }

            if (email && data.email) {
                email.value =
                    data.email;
            }

            if (phone && data.phone) {
                phone.value =
                    data.phone;
            }

            if (
                profileDisplayName &&
                data.fullName
            ) {
                profileDisplayName.textContent =
                    data.fullName;
            }

            const initials =
                getInitials(
                    data.fullName ||
                    "Vinícius Fernandes"
                );

            if (profileInitials) {
                profileInitials.textContent =
                    initials;
            }

            if (
                headerProfileAvatar &&
                !localStorage.getItem(
                    "chromaBankProfilePhoto"
                )
            ) {
                headerProfileAvatar.textContent =
                    initials;
            }

        } catch {

            localStorage.removeItem(
                "chromaBankProfileData"
            );
        }
    }

    function loadSavedAddressData() {

        const savedData =
            localStorage.getItem(
                "chromaBankAddressData"
            );

        if (!savedData) return;

        try {

            const data =
                JSON.parse(savedData);

            Object.entries(data).forEach(
                ([key, value]) => {

                    const field =
                        document.getElementById(key);

                    if (field) {
                        field.value = value;
                    }
                }
            );

        } catch {

            localStorage.removeItem(
                "chromaBankAddressData"
            );
        }
    }

    function loadSavedPhoto() {

        const savedPhoto =
            localStorage.getItem(
                "chromaBankProfilePhoto"
            );

        updateProfilePhoto(
            savedPhoto
        );
    }

    loadSavedProfileData();
    loadSavedAddressData();
    loadSavedPhoto();


    // ==================================================
    // OUTRAS AÇÕES
    // ==================================================

    updateDocumentsButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Área de atualização de documentos será criada depois."
            );
        }
    );

    privacyButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Política de privacidade do ChromaBank."
            );
        }
    );


    // ==================================================
    // MENU DO PERFIL
    // ==================================================

    function createProfileMenu() {

        profileMenu =
            document.createElement("div");

        profileMenu.className =
            "profile-dropdown";

        profileMenu.innerHTML = `
            <a href="perfil.html">
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

            if (event.key !== "Escape") return;

            closeSidebar();
            closeModal(photoModal);

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