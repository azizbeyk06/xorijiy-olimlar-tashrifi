
// =====================================
// 1. ELEMENTLARNI TANLASH
// =====================================

const form = document.getElementById("visitorForm");
const message = document.getElementById("formMessage");

const arrivalDate = document.getElementById("arrivalDate");
const departureDate = document.getElementById("departureDate");

// Bugungi sanani olish
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// =====================================
// 2. SANALARNI NAZORAT QILISH
// =====================================

function updateDateLimits() {
    const today = getToday();

    arrivalDate.min = today;

    if (arrivalDate.value) {
        const nextDay = new Date(arrivalDate.value + "T00:00:00");
        nextDay.setDate(nextDay.getDate() + 1);

        const year = nextDay.getFullYear();
        const month = String(nextDay.getMonth() + 1).padStart(2, "0");
        const day = String(nextDay.getDate()).padStart(2, "0");

        departureDate.min = `${year}-${month}-${day}`;
    } else {
        departureDate.min = today;
    }
}

arrivalDate.addEventListener("change", updateDateLimits);

updateDateLimits();

// =====================================
// 3. MA'LUMOTLARNI SAQLASH
// =====================================

function getVisitors() {
    try {
        return JSON.parse(
            localStorage.getItem("foreignVisitors")
        ) || [];
    } catch (error) {
        return [];
    }
}

// =====================================
// 4. ANKETANI YUBORISH
// =====================================

form.addEventListener("submit", function(event) {
    event.preventDefault();

    message.textContent = "";
    message.style.color = "#dc2626";

    // Majburiy maydonlarni tekshirish
    if (!form.reportValidity()) {
        return;
    }

    const today = getToday();

    // Kelish sanasini tekshirish
    if (arrivalDate.value < today) {
        message.textContent =
            "Kelish sanasi bugungi kundan oldin bo‘lishi mumkin emas!";
        return;
    }

    // Ketish sanasini tekshirish
    if (departureDate.value <= arrivalDate.value) {
        message.textContent =
            "Ketish sanasi kelish sanasidan keyin bo‘lishi kerak!";
        return;
    }

    // Mehmonlar sonini tekshirish
    const guests = Number(
        document.getElementById("guests").value
    );

    if (!Number.isInteger(guests) || guests < 1 || guests > 100) {
        message.textContent =
            "Mehmonlar soni 1 dan 100 gacha bo‘lishi kerak!";
        return;
    }

    // Anketa ma'lumotlarini yig'ish
    const visitor = {
        id: Date.now(),

        fullName: document.getElementById("fullName").value.trim(),
        country: document.getElementById("country").value.trim(),
        organization: document.getElementById("organization").value.trim(),
        position: document.getElementById("position").value.trim(),

        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),

        arrivalDate: arrivalDate.value,
        arrivalTime: document.getElementById("arrivalTime").value,
        arrivalPlace: document.getElementById("arrivalPlace").value,
        transport: document.getElementById("transport").value,

        guests: guests,
        flightNumber: document.getElementById("flightNumber").value.trim(),

        food: document.getElementById("food").value,
        foodNotes: document.getElementById("foodNotes").value.trim(),

        departureDate: departureDate.value,
        departureTime: document.getElementById("departureTime").value,

        hotel: document.getElementById("hotel").value,
        roomType: document.getElementById("roomType").value,

        notes: document.getElementById("notes").value.trim(),

        submittedAt: new Date().toLocaleString("uz-UZ")
    };

    // Oldingi ma'lumotlarni olish
    const visitors = getVisitors();

    // Yangi mehmonni qo'shish
    visitors.push(visitor);

    // Brauzer xotirasiga saqlash
    try {
        localStorage.setItem(
            "foreignVisitors",
            JSON.stringify(visitors)
        );
    } catch (error) {
        message.textContent =
            "Ma'lumotni saqlashda xatolik yuz berdi!";
        return;
    }

    // Muvaffaqiyatli xabar
    message.style.color = "#15803d";
    message.textContent =
        "✓ Anketa muvaffaqiyatli saqlandi! Rahmat.";

    // Formani tozalash
    form.reset();

    // Sanalarni qayta sozlash
    updateDateLimits();

    console.log("Saqlangan mehmonlar:", getVisitors());
});

// =====================================
// 5. SAQLANGAN MEHMONLAR SONI
// =====================================

console.log(
    "Jami saqlangan anketalar:",
    getVisitors().length
);
