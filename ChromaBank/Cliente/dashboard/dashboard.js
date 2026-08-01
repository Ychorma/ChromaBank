// ===========================================
// PROTEÇÃO DA DASHBOARD
// ===========================================

if (sessionStorage.getItem("chromaBankLoggedIn") !== "true") {

    window.location.href = "../login.html";
    function logout() {

    const confirmar = confirm(
        "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) return;

    sessionStorage.removeItem("chromaBankLoggedIn");
    sessionStorage.removeItem("chromaBankCPF");

    window.location.href = "../login.html";

}

}