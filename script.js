const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRttFELfjUqHTrwXvmkSZehq0LHS2aWHfaSCt9eQCwN0VDJioOFGsns_6evm3d0dRq/exec";

const form = document.getElementById("visitorForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Yuborilmoqda...";

    const formData = new FormData(form);

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        });

        message.textContent =
            "Arizangiz muvaffaqiyatli yuborildi!";

        message.className = "success-message";
        message.style.display = "block";

        form.reset();

    } catch (error) {
        console.error(error);

        message.textContent =
            "Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.";

        message.className = "error-message";
        message.style.display = "block";
    }

    submitButton.disabled = false;
    submitButton.textContent = "Arizani yuborish";
});
