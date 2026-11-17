
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRttFELfjUqHTrwXvmkSZehq0LHS2aWHfaSCt9eQCwN0VDJioOFGsns_6evm3d0dRq/exec";

const form = document.getElementById("visitorForm");
const message = document.getElementById("formMessage");

const phoneCode = document.getElementById("phoneCode");
const phone = document.getElementById("phone");

// Tanilgan davlatlar uchun telefon raqamining maksimal uzunligi
const phoneLengths = {
    "998": 9,
    "1": 10,
    "44": 10,
    "7": 10,
    "90": 10,
    "49": 11,
    "33": 9,
    "39": 11,
    "34": 9,
    "86": 11,
    "81": 10,
    "82": 10,
    "91": 10,
    "92": 10,
    "93": 9,
    "971": 9,
    "966": 9,
    "972": 9,
    "20": 10,
    "27": 9,
    "55": 11,
    "61": 9,
    "64": 10,
    "65": 8,
    "66": 9,
    "84": 10,
    "98": 10,
    "994": 9,
    "995": 9,
    "996": 9,
    "992": 9,
    "993": 8,
    "380": 9,
    "48": 9,
    "31": 9,
    "32": 9,
    "41": 9,
    "43": 11,
    "45": 8,
    "46": 9,
    "47": 8,
    "358": 10,
    "351": 9,
    "30": 10,
    "40": 9,
    "420": 9,
    "36": 9
};

// Davlat kodiga mos maksimal raqamlar soni
function getPhoneLimit() {
    const code = phoneCode.value.replace(/\D/g, "");

    if (!code) {
        return 15;
    }

    // Tanilgan davlat kodi
    if (phoneLengths[code]) {
        return phoneLengths[code];
    }

    // Noma'lum kod: E.164 bo‘yicha jami 15 raqam
    return Math.max(1, 15 - code.length);
}

// Telefon raqami uzunligini yangilash
function updatePhoneLimit() {
    const limit = getPhoneLimit();

    phone.maxLength = limit;

    // Ortiqcha raqamlarni avtomatik olib tashlash
    phone.value = phone.value
        .replace(/\D/g, "")
        .slice(0, limit);
}

// Davlat kodi o‘zgarganda
if (phoneCode && phone) {
    phoneCode.addEventListener("input", function () {
        // Faqat + va raqamlarga ruxsat berish
        let code = phoneCode.value.replace(/[^\d+]/g, "");

        // Faqat boshida + bo‘lishi mumkin
        code = "+" + code.replace(/\+/g, "").slice(0, 3);

        phoneCode.value = code;

        updatePhoneLimit();
    });

    // Telefon raqamiga faqat raqam kiritish
    phone.addEventListener("input", function () {
        updatePhoneLimit();
    });

    updatePhoneLimit();
}

// Anketani yuborish
if (form && message) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');

        const code = phoneCode.value.trim();
        const codeDigits = code.replace(/\D/g, "");
        const digits = phone.value.replace(/\D/g, "");
        const limit = getPhoneLimit();

        // Davlat kodini tekshirish
        if (!/^\+\d{1,3}$/.test(code)) {
            message.textContent = "Davlat kodini to‘g‘ri kiriting. Masalan: +998 yoki +44.";
            message.className = "error-message";
            message.style.display = "block";
            return;
        }

        // Telefon raqamini tekshirish
        if (digits.length === 0 || digits.length > limit) {
            message.textContent = "Telefon raqami davlat kodiga mos emas.";
            message.className = "error-message";
            message.style.display = "block";
            return;
        }

        button.disabled = true;
        button.textContent = "Yuborilmoqda...";

        try {
            const formData = new FormData(form);

            // Davlat kodi va telefon raqamini birlashtirish
            formData.set("phone", code + digits);

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            });

            message.textContent = "Ariza yuborish so‘rovi jo‘natildi.";
            message.className = "success-message";
            message.style.display = "block";

            form.reset();

            // Form resetdan keyin telefon cheklovini tiklash
            updatePhoneLimit();

        } catch (error) {
            message.textContent = "Xatolik yuz berdi. Qayta urinib ko‘ring.";
            message.className = "error-message";
            message.style.display = "block";
        }

        button.disabled = false;
        button.textContent = "Anketani yuborish →";
    });
}
