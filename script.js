
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRttFELfjUqHTrwXvmkSZehq0LHS2aWHfaSCt9eQCwN0VDJioOFGsns_6evm3d0dRq/exec";

const form = document.getElementById("visitorForm");
const message = document.getElementById("formMessage");

if (form && message) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');

        if (button) {
            button.disabled = true;
            button.textContent = "Yuborilmoqda...";
        }

        const formData = new FormData(form);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            });

            message.textContent =
                "Yuborish so‘rovi jo‘natildi. Natijani tekshiring.";

            message.className = "success-message";
            message.style.display = "block";

            form.reset();

        } catch (error) {
            console.error(error);

            message.textContent =
                "Xatolik yuz berdi. Qayta urinib ko‘ring.";

            message.className = "error-message";
            message.style.display = "block";
        }

        if (button) {
            button.disabled = false;
            button.textContent = "Arizani yuborish";
        }
    });
}
