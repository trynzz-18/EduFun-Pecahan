
// ================================================
// EDUFUN - PETUALANGAN PECAHAN
// HTML + CSS + JAVASCRIPT
// ================================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORE = "edufun-pecahan-v1";

const defaultState = {
    name: "Pejuang Pecahan",
    stars: 0,
    completed: [],
    quizzes: [],
    gameWins: 0
};

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORE) || "{}");

        return {
            ...defaultState,
            ...saved,
            completed: Array.isArray(saved.completed) ? saved.completed : [],
            quizzes: Array.isArray(saved.quizzes) ? saved.quizzes : []
        };
    } catch (error) {
        console.warn("Data EduFun tidak dapat dibaca.", error);
        return { ...defaultState };
    }
}

let state = loadState();

function save() {
    try {
        localStorage.setItem(STORE, JSON.stringify(state));
    } catch (error) {
        console.warn("Progres tidak dapat disimpan.", error);
    }

    updateDashboard();
}

function toast(message) {
    const el = $("#toast");
    if (!el) return;

    el.textContent = message;
    el.classList.add("show");

    setTimeout(() => el.classList.remove("show"), 2200);
}


// ================================================
// DASHBOARD DAN NAVIGASI
// ================================================

function updateDashboard() {
    if ($("#greetingName")) $("#greetingName").textContent = state.name;
    if ($("#starTotal")) $("#starTotal").textContent = state.stars;
    if ($("#progressStars")) $("#progressStars").textContent = state.stars;

    if ($("#materialTotal")) {
        $("#materialTotal").textContent = `${state.completed.length}/6`;
    }

    if ($("#progressMaterials")) {
        $("#progressMaterials").textContent = `${state.completed.length}/6`;
    }

    if ($("#quizTotal")) $("#quizTotal").textContent = state.quizzes.length;
    if ($("#progressQuizzes")) $("#progressQuizzes").textContent = state.quizzes.length;

    if ($("#gameScore")) {
        $("#gameScore").textContent = `Jawaban benar: ${state.gameWins}`;
    }

    if ($("#streakCount")) {
        $("#streakCount").textContent = state.completed.length || 1;
    }

    renderProgress();
}

const pageNames = {
    home: "Beranda",
    materials: "Materi",
    games: "Petualangan",
    quiz: "Kuis",
    progress: "Progres Belajar",
    profile: "Profil Saya"
};

function showPage(page) {
    $$(".page").forEach(section => {
        section.classList.toggle("active", section.id === `page-${page}`);
    });

    $$(".nav-link[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    if ($("#pageLabel")) {
        $("#pageLabel").textContent = pageNames[page] || "Beranda";
    }

    if ($("#sidebar")) $("#sidebar").classList.remove("open");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (page === "progress") renderProgress();
}

$$("[data-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
});

$$("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
});

if ($("#menuToggle")) {
    $("#menuToggle").addEventListener("click", () => {
        $("#sidebar").classList.toggle("open");
    });
}


// ================================================
// DATA MATERI PEMBELAJARAN
// ================================================

const lessons = [
    [
        "Mengenal Pecahan",
        "Memahami pecahan sebagai bagian dari satu benda utuh.",
        "Bayangkan satu pizza utuh dipotong menjadi dua bagian sama besar. Jika kamu mengambil satu bagian, bagian itu disebut satu per dua atau 1/2.",
        "Pecahan menunjukkan berapa bagian yang kita ambil dari keseluruhan bagian yang sama besar."
    ],
    [
        "Pembilang dan Penyebut",
        "Mengenal angka di atas dan di bawah garis pecahan.",
        "Pada pecahan 3/4, angka 3 adalah pembilang (bagian yang dipilih), sedangkan angka 4 adalah penyebut (jumlah seluruh bagian yang sama besar).",
        "Ingat: pembilang berada di atas garis, penyebut berada di bawah garis."
    ],
    [
        "Pecahan dengan Gambar",
        "Melihat pecahan melalui bentuk visual.",
        "Jika sebuah lingkaran dibagi menjadi 4 bagian sama besar dan 2 bagian diwarnai, pecahannya adalah 2/4. Dua dari empat bagian telah dipilih.",
        "Gambar membantu kita memahami pecahan tanpa hanya menghafal angka."
    ],
    [
        "Pecahan Senilai",
        "Mengenal pecahan yang nilainya sama.",
        "Pecahan 1/2 memiliki nilai yang sama dengan 2/4 dan 3/6. Bentuk angkanya berbeda, tetapi bagian dari keseluruhannya sama.",
        "Kalikan atau bagi pembilang dan penyebut dengan bilangan yang sama untuk mendapat pecahan senilai."
    ],
    [
        "Membandingkan Pecahan",
        "Menentukan pecahan yang lebih besar atau kecil.",
        "Jika penyebutnya sama, bandingkan pembilangnya. Contoh: 3/4 lebih besar daripada 1/4 karena 3 bagian lebih banyak daripada 1 bagian.",
        "Untuk penyebut berbeda, samakan penyebut terlebih dahulu agar lebih mudah dibandingkan."
    ],
    [
        "Penjumlahan Pecahan",
        "Menjumlahkan pecahan sederhana.",
        "Jika penyebut sama, jumlahkan pembilangnya. Contoh: 1/4 + 2/4 = 3/4. Penyebut tetap 4.",
        "Pastikan penyebut sama sebelum menjumlahkan pecahan."
    ]
];


// ================================================
// ILUSTRASI VISUAL UNTUK 6 MATERI
// Dibuat dengan SVG, tidak memerlukan gambar eksternal.
// ================================================

function getLessonIllustration(index) {

    const illustrations = [

        // 1. MENGENAL PECAHAN
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Satu dari dua bagian pizza">

            <circle cx="115" cy="95" r="72" fill="#D18A4B"/>
            <circle cx="115" cy="95" r="65" fill="#FFE4AA"/>

            <path d="M115 30 A65 65 0 0 1 115 160 L115 95 Z"
                  fill="#FF984B"/>

            <path d="M115 30 V160"
                  stroke="#FFFDF7" stroke-width="4"/>

            <circle cx="153" cy="76" r="6" fill="#E85B72"/>
            <circle cx="151" cy="116" r="6" fill="#E85B72"/>
            <circle cx="80" cy="84" r="6" fill="#E85B72"/>

            <text x="230" y="83" font-size="36"
                  font-weight="900" fill="#7056D9">1/2</text>

            <text x="230" y="112" font-size="15"
                  fill="#85839B">Satu dari dua bagian</text>
        </svg>
        `,

        // 2. PEMBILANG DAN PENYEBUT
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Pembilang dan penyebut pada pecahan tiga per lima">

            <rect x="105" y="15" width="170" height="160"
                  rx="20" fill="#F0EDFF"/>

            <text x="190" y="78" text-anchor="middle"
                  font-size="48" font-weight="900" fill="#7056D9">3</text>

            <path d="M145 94 H235"
                  stroke="#292744" stroke-width="5"
                  stroke-linecap="round"/>

            <text x="190" y="146" text-anchor="middle"
                  font-size="48" font-weight="900" fill="#FF9748">5</text>

            <path d="M280 57 H310" stroke="#7056D9" stroke-width="2"/>
            <text x="316" y="62" font-size="13"
                  font-weight="700" fill="#7056D9">Pembilang</text>

            <path d="M280 130 H310" stroke="#FF9748" stroke-width="2"/>
            <text x="316" y="135" font-size="13"
                  font-weight="700" fill="#D98430">Penyebut</text>
        </svg>
        `,

        // 3. PECAHAN DENGAN GAMBAR
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Dua dari empat bagian persegi diwarnai">

            <rect x="55" y="25" width="130" height="130"
                  rx="8" fill="#FFE4AA"/>

            <path d="M120 25 V155 M55 90 H185"
                  stroke="#FFFDF7" stroke-width="5"/>

            <path d="M55 25 H120 V90 H55 Z" fill="#FF984B"/>
            <path d="M120 90 H185 V155 H120 Z" fill="#FF984B"/>

            <text x="225" y="83" font-size="36"
                  font-weight="900" fill="#7056D9">2/4</text>

            <text x="225" y="112" font-size="15"
                  fill="#85839B">Dua dari empat bagian</text>
        </svg>
        `,

        // 4. PECAHAN SENILAI
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Pecahan satu per dua, dua per empat, dan tiga per enam bernilai sama">

            <g transform="translate(22 38)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#7056D9">1/2</text>

                <rect x="0" y="15" width="84" height="27"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="15" width="42" height="27"
                      rx="5" fill="#7056D9"/>
            </g>

            <text x="125" y="83" font-size="24"
                  font-weight="900" fill="#85839B">=</text>

            <g transform="translate(155 38)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#7056D9">2/4</text>

                <rect x="0" y="15" width="84" height="27"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="15" width="42" height="27"
                      rx="5" fill="#7056D9"/>
            </g>

            <text x="258" y="83" font-size="24"
                  font-weight="900" fill="#85839B">=</text>

            <g transform="translate(290 38)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#7056D9">3/6</text>

                <rect x="0" y="15" width="84" height="27"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="15" width="42" height="27"
                      rx="5" fill="#7056D9"/>
            </g>

            <text x="210" y="130" text-anchor="middle"
                  font-size="15" fill="#85839B">
                Nilainya sama besar!
            </text>
        </svg>
        `,

        // 5. MEMBANDINGKAN PECAHAN
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Tiga per empat lebih besar daripada satu per empat">

            <g transform="translate(35 40)">
                <text x="55" y="0" text-anchor="middle"
                      font-size="19" font-weight="900"
                      fill="#7056D9">3/4</text>

                <rect x="0" y="18" width="110" height="34"
                      rx="6" fill="#FFE4AA"/>

                <path d="M0 18 H82.5 V52 H0 Z"
                      fill="#53BD91"/>

                <path d="M27.5 18 V52 M55 18 V52 M82.5 18 V52"
                      stroke="#FFFDF7" stroke-width="2"/>
            </g>

            <text x="210" y="88" text-anchor="middle"
                  font-size="38" font-weight="900"
                  fill="#7056D9">&gt;</text>

            <g transform="translate(260 40)">
                <text x="55" y="0" text-anchor="middle"
                      font-size="19" font-weight="900"
                      fill="#FF9748">1/4</text>

                <rect x="0" y="18" width="110" height="34"
                      rx="6" fill="#FFE4AA"/>

                <path d="M0 18 H27.5 V52 H0 Z"
                      fill="#FF984B"/>

                <path d="M27.5 18 V52 M55 18 V52 M82.5 18 V52"
                      stroke="#FFFDF7" stroke-width="2"/>
            </g>

            <text x="210" y="135" text-anchor="middle"
                  font-size="15" fill="#85839B">
                Tiga per empat lebih besar
            </text>
        </svg>
        `,

        // 6. PENJUMLAHAN PECAHAN
        `
        <svg viewBox="0 0 420 190" role="img"
             aria-label="Satu per empat ditambah dua per empat sama dengan tiga per empat">

            <g transform="translate(18 40)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#7056D9">1/4</text>

                <rect x="0" y="18" width="84" height="30"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="18" width="21" height="30"
                      rx="5" fill="#7056D9"/>
            </g>

            <text x="118" y="83" font-size="26"
                  font-weight="900" fill="#85839B">+</text>

            <g transform="translate(150 40)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#FF9748">2/4</text>

                <rect x="0" y="18" width="84" height="30"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="18" width="42" height="30"
                      rx="5" fill="#FF984B"/>
            </g>

            <text x="252" y="83" font-size="26"
                  font-weight="900" fill="#85839B">=</text>

            <g transform="translate(290 40)">
                <text x="42" y="0" text-anchor="middle"
                      font-size="18" font-weight="900"
                      fill="#53BD91">3/4</text>

                <rect x="0" y="18" width="84" height="30"
                      rx="5" fill="#FFE4AA"/>

                <rect x="0" y="18" width="63" height="30"
                      rx="5" fill="#53BD91"/>
            </g>

            <text x="210" y="130" text-anchor="middle"
                  font-size="15" fill="#85839B">
                Satu per empat + dua per empat
            </text>
        </svg>
        `
    ];

    const captions = [
        "Satu bagian dari dua bagian yang sama besar.",
        "Pembilang berada di atas garis, sedangkan penyebut berada di bawah garis.",
        "Warna menunjukkan bagian yang dipilih dari keseluruhan bagian.",
        "Bentuk pecahannya berbeda, tetapi nilainya sama.",
        "Bandingkan bagian yang diwarnai untuk mengetahui pecahan yang lebih besar.",
        "Jika penyebut sama, jumlahkan pembilangnya dan pertahankan penyebut."
    ];

    return `
        <div class="lesson-illustration">
            <div class="lesson-visual-art">
                ${illustrations[index]}
            </div>

            <div class="lesson-visual-caption">
                <span>VISUALISASI MATERI</span>
                <p>${captions[index]}</p>
            </div>
        </div>
    `;
}


// ================================================
// MENAMPILKAN DAFTAR MATERI
// ================================================

function renderLessons() {
    const list = $("#lessonList");
    if (!list) return;

    list.innerHTML = lessons.map((lesson, index) => `
        <button class="lesson-item ${index === 0 ? "active" : ""}"
                data-lesson="${index}">

            <span class="lesson-number">${index + 1}</span>

            <span>
                <b>${lesson[0]}</b>
                <small>
                    ${state.completed.includes(index)
                        ? "✓ Selesai"
                        : `Materi ${index + 1}`}
                </small>
            </span>

        </button>
    `).join("");

    $$(".lesson-item").forEach(button => {
        button.addEventListener("click", () => {
            openLesson(Number(button.dataset.lesson));
        });
    });

    openLesson(0);
}


// ================================================
// MENAMPILKAN DETAIL MATERI
// ================================================

function openLesson(index) {
    const lesson = lessons[index];
    const view = $("#lessonView");

    if (!lesson || !view) return;

    $$(".lesson-item").forEach(button => {
        button.classList.toggle(
            "active",
            Number(button.dataset.lesson) === index
        );
    });

    const done = state.completed.includes(index);

    view.innerHTML = `
        <p class="eyebrow">
            MATERI ${String(index + 1).padStart(2, "0")}
        </p>

        <h2>${lesson[0]}</h2>

        <p>${lesson[1]}</p>

        ${getLessonIllustration(index)}

        <div class="lesson-example">
            <strong>Contoh sederhana</strong>
            <p>${lesson[2]}</p>
            <b>${lesson[3]}</b>
        </div>

        <button class="btn ${done ? "btn-light" : "btn-primary"} lesson-complete"
                id="completeLesson">

            ${done ? "✓ Sudah dipelajari" : "Tandai sudah dipelajari"}

        </button>
    `;

    $("#completeLesson").addEventListener("click", () => {
        if (!state.completed.includes(index)) {
            state.completed.push(index);
            state.stars += 5;

            save();
            renderLessons();

            toast("Hebat! Kamu mendapat 5 bintang ⭐");
        } else {
            toast("Materi ini sudah kamu selesaikan.");
        }
    });
}


// ================================================
// STUDIO VISUAL PECAHAN
// ================================================

const wholeParts = $("#wholeParts");
const coloredParts = $("#coloredParts");

if (wholeParts) {
    wholeParts.addEventListener("change", updateFraction);
}

if (coloredParts) {
    coloredParts.addEventListener("input", updateFraction);
}

function updateFraction() {
    if (!wholeParts || !coloredParts) return;

    const total = Number(wholeParts.value);

    coloredParts.max = total;

    if (Number(coloredParts.value) > total) {
        coloredParts.value = total;
    }

    const colored = Number(coloredParts.value);
    const shape = $("#fractionShape");

    if (shape) {
        shape.innerHTML = Array.from(
            { length: total },
            (_, index) => `
                <span class="${index < colored ? "filled" : ""}"></span>
            `
        ).join("");

        shape.style.gridTemplateColumns =
            `repeat(${Math.min(total, 5)}, 25px)`;
    }

    if ($("#fractionText")) {
        $("#fractionText").textContent = `${colored}/${total}`;
    }

    if ($("#fractionExplain")) {
        $("#fractionExplain").textContent =
            `${colored} dari ${total} bagian diwarnai.`;
    }
}


// ================================================
// GAME PETUALANGAN PECAHAN - 5 SOAL
// ================================================

const gameQuestions = [
    {
        total: 4,
        shaded: 2,
        options: ["1/4", "2/4", "3/4", "4/4"],
        explanation: "Ada 2 bagian diarsir dari 4 bagian seluruhnya."
    },
    {
        total: 3,
        shaded: 1,
        options: ["1/3", "2/3", "1/2", "3/3"],
        explanation: "Ada 1 bagian diarsir dari 3 bagian seluruhnya."
    },
    {
        total: 6,
        shaded: 3,
        options: ["2/6", "3/6", "4/6", "5/6"],
        explanation: "Ada 3 bagian diarsir dari 6 bagian seluruhnya."
    },
    {
        total: 8,
        shaded: 4,
        options: ["2/8", "3/8", "4/8", "5/8"],
        explanation: "Ada 4 bagian diarsir dari 8 bagian seluruhnya."
    },
    {
        total: 8,
        shaded: 5,
        options: ["3/8", "4/8", "5/8", "6/8"],
        explanation: "Ada 5 bagian diarsir dari 8 bagian seluruhnya."
    }
];

let gameIndex = 0;
let gameAnswered = false;
let gameSessionScore = 0;
let gameCompleted = false;


// Membuat ilustrasi pizza dengan SVG.
function createPizzaSVG(total, shaded) {
    const center = 110;
    const radius = 79;

    let slices = "";

    for (let index = 0; index < total; index++) {
        const startAngle = -90 + (index * 360 / total);
        const endAngle = -90 + ((index + 1) * 360 / total);

        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);

        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const largeArc = (360 / total) > 180 ? 1 : 0;
        const fill = index < shaded ? "#FF984B" : "#FFE5AE";

        slices += `
            <path
                d="M ${center} ${center}
                   L ${x1.toFixed(2)} ${y1.toFixed(2)}
                   A ${radius} ${radius} 0 ${largeArc} 1
                   ${x2.toFixed(2)} ${y2.toFixed(2)}
                   Z"
                fill="${fill}"
                stroke="#FFFDF7"
                stroke-width="3.5"
                stroke-linejoin="round"
            />
        `;
    }

    return `
        <svg class="pizza-svg"
             viewBox="0 0 220 220"
             xmlns="http://www.w3.org/2000/svg"
             role="img"
             aria-label="Pizza terbagi menjadi ${total} bagian, ${shaded} bagian diarsir">

            <title>Pizza ${shaded} dari ${total} bagian diarsir</title>

            <circle cx="110" cy="110" r="91" fill="#C98243"/>
            <circle cx="110" cy="110" r="85" fill="#F8C66C"/>

            ${slices}

            <circle cx="110" cy="110" r="3.5" fill="#D98B49"/>

        </svg>
    `;
}


// Menyiapkan tampilan game.
function prepareGameMarkup() {
    const gameContent = $(".game-content");
    if (!gameContent) return;

    gameContent.innerHTML = `
        <div class="game-illustration" id="pizzaIllustration"></div>

        <div class="game-question">

            <h2 id="gameQuestionTitle">
                Berapa bagian pizza yang diarsir?
            </h2>

            <p class="muted" id="gameQuestionDescription"></p>

            <div class="answer-options" id="gameOptions"></div>

            <p id="gameFeedback"
               class="feedback"
               aria-live="polite"></p>

            <button class="btn btn-primary"
                    id="nextGame"
                    hidden>
                Soal berikutnya →
            </button>

        </div>
    `;

    const badge = $(".game-badge");
    if (badge) badge.id = "gameBadge";

    $("#nextGame").addEventListener("click", nextGameQuestion);
    $("#gameOptions").addEventListener("click", handleGameAnswer);
}


// Menampilkan soal game.
function renderGame() {
    const question = gameQuestions[gameIndex];
    if (!question) return;

    gameAnswered = false;
    gameCompleted = false;

    $("#gameBadge").textContent =
        `TANTANGAN ${String(gameIndex + 1).padStart(2, "0")}/05`;

    $("#gameQuestionTitle").textContent =
        "Berapa bagian pizza yang diarsir?";

    $("#gameQuestionDescription").textContent =
        `Pizza dibagi menjadi ${question.total} bagian sama besar. ` +
        `${question.shaded} bagian diarsir.`;

    $("#pizzaIllustration").style.display = "grid";
    $("#pizzaIllustration").innerHTML =
        createPizzaSVG(question.total, question.shaded);

    $("#gameOptions").style.display = "grid";

    $("#gameOptions").innerHTML =
        question.options.map(answer => `
            <button type="button" data-answer="${answer}">
                ${answer}
            </button>
        `).join("");

    $("#gameFeedback").textContent = "";
    $("#gameFeedback").className = "feedback";

    $("#nextGame").hidden = true;

    $("#nextGame").textContent =
        gameIndex === gameQuestions.length - 1
            ? "Lihat hasil →"
            : "Soal berikutnya →";
}


// Memeriksa jawaban game.
function handleGameAnswer(event) {
    const button = event.target.closest("button[data-answer]");

    if (!button || gameAnswered || gameCompleted) return;

    gameAnswered = true;

    const question = gameQuestions[gameIndex];
    const correctAnswer = `${question.shaded}/${question.total}`;
    const selectedAnswer = button.dataset.answer;
    const isCorrect = selectedAnswer === correctAnswer;

    $$("#gameOptions button").forEach(option => {
        option.disabled = true;
        option.classList.remove("selected");

        if (option.dataset.answer === correctAnswer) {
            option.classList.add("game-correct");
        }
    });

    button.classList.add("selected");

    const feedback = $("#gameFeedback");

    if (isCorrect) {
        gameSessionScore++;

        state.stars += 5;
        state.gameWins++;

        save();

        feedback.textContent =
            "Benar sekali! Kamu mendapat 5 bintang ⭐";

        feedback.className = "feedback";

    } else {
        feedback.textContent =
            `Belum tepat. Jawaban yang benar adalah ${correctAnswer}. ` +
            question.explanation;

        feedback.className = "feedback error";
    }

    $("#nextGame").hidden = false;
}


// Tombol untuk lanjut atau mengulang permainan.
function nextGameQuestion() {
    if (gameCompleted) {
        gameIndex = 0;
        gameSessionScore = 0;

        renderGame();
        return;
    }

    if (gameIndex < gameQuestions.length - 1) {
        gameIndex++;
        renderGame();
    } else {
        showGameResult();
    }
}


// Menampilkan hasil akhir game.
function showGameResult() {
    gameCompleted = true;

    $("#gameBadge").textContent = "PETUALANGAN SELESAI";
    $("#gameQuestionTitle").textContent = "Petualanganmu selesai!";

    $("#gameQuestionDescription").textContent =
        `Kamu menjawab ${gameSessionScore} dari 5 soal dengan benar.`;

    $("#pizzaIllustration").style.display = "none";
    $("#gameOptions").style.display = "none";

    $("#gameFeedback").textContent =
        `Kamu memperoleh ${gameSessionScore * 5} bintang dari tantangan ini! ⭐`;

    $("#gameFeedback").className = "feedback";

    $("#nextGame").hidden = false;
    $("#nextGame").textContent = "Ulangi 5 soal ↻";
}


// ================================================
// KUIS UTAMA
// ================================================

const questions = [
    {
        q: "Berapa hasil dari 1/2 + 1/2?",
        a: ["1/2", "2/4", "1", "2"],
        correct: "1",
        why: "Setengah ditambah setengah menjadi satu utuh."
    },
    {
        q: "Pada pecahan 3/5, angka 5 disebut apa?",
        a: ["Pembilang", "Penyebut", "Hasil", "Bilangan bulat"],
        correct: "Penyebut",
        why: "Penyebut menunjukkan jumlah seluruh bagian yang sama besar."
    },
    {
        q: "Manakah pecahan yang senilai dengan 1/2?",
        a: ["1/3", "2/4", "3/4", "2/3"],
        correct: "2/4",
        why: "1/2 dan 2/4 menunjukkan bagian yang sama besar."
    },
    {
        q: "Mana yang lebih besar?",
        a: ["1/4", "3/4", "Sama besar", "Tidak bisa dibandingkan"],
        correct: "3/4",
        why: "Dengan penyebut sama, pembilang 3 lebih besar daripada 1."
    },
    {
        q: "Sebuah kue dibagi 8 bagian. Kamu mengambil 3 bagian. Pecahannya adalah...",
        a: ["8/3", "3/8", "3/5", "5/8"],
        correct: "3/8",
        why: "Tiga bagian diambil dari delapan bagian seluruhnya."
    }
];

let qIndex = 0;
let selected = null;
let points = 0;
let answered = false;

function startQuiz() {
    qIndex = 0;
    selected = null;
    points = 0;
    answered = false;

    $("#quizArea").hidden = false;
    $("#quizResult").hidden = true;

    renderQuestion();
}

function renderQuestion() {
    const question = questions[qIndex];

    selected = null;
    answered = false;

    $("#questionNumber").textContent =
        `PERTANYAAN ${qIndex + 1} DARI ${questions.length}`;

    $("#quizPoints").textContent = `⭐ ${points} poin`;

    $("#quizProgress").style.width =
        `${(qIndex + 1) / questions.length * 100}%`;

    $("#questionText").textContent = question.q;

    $("#quizFeedback").textContent = "";
    $("#quizFeedback").className = "feedback";

    $("#quizChoices").innerHTML =
        question.a.map((answer, index) => `
            <button class="quiz-choice" data-choice="${answer}">
                ${String.fromCharCode(65 + index)}. ${answer}
            </button>
        `).join("");

    $$(".quiz-choice").forEach(button => {
        button.addEventListener("click", () => {
            if (answered) return;

            selected = button.dataset.choice;

            $$(".quiz-choice").forEach(choice => {
                choice.classList.toggle("selected", choice === button);
            });

            $("#submitAnswer").disabled = false;
        });
    });

    $("#submitAnswer").hidden = false;
    $("#submitAnswer").disabled = true;
    $("#nextQuestion").hidden = true;
}

$("#submitAnswer").addEventListener("click", () => {
    if (!selected || answered) return;

    answered = true;

    const question = questions[qIndex];
    const correct = selected === question.correct;

    if (correct) points += 10;

    $("#quizFeedback").textContent =
        (correct ? "Benar! Hebat! ⭐ " : "Belum tepat. ") +
        question.why;

    $("#quizFeedback").className =
        correct ? "feedback" : "feedback error";

    $$(".quiz-choice").forEach(button => {
        if (button.dataset.choice === question.correct) {
            button.style.borderColor = "#53bd91";
        }

        if (button.dataset.choice === selected && !correct) {
            button.style.borderColor = "#ff8d83";
        }
    });

    $("#quizPoints").textContent = `⭐ ${points} poin`;

    $("#submitAnswer").hidden = true;
    $("#nextQuestion").hidden = false;
});

$("#nextQuestion").addEventListener("click", () => {
    qIndex++;

    if (qIndex < questions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    state.quizzes.unshift({
        date: new Date().toLocaleDateString("id-ID"),
        score: points
    });

    state.stars += points / 2;

    save();

    $("#quizArea").hidden = true;
    $("#quizResult").hidden = false;

    $("#quizResult").innerHTML = `
        <div class="trophy">🏆</div>
        <h2>Kuis selesai!</h2>
        <p class="muted">Kamu sudah berusaha dengan hebat.</p>
        <strong>${points}/50</strong>
        <p>poin terkumpul</p>
        <button class="btn btn-primary" id="retryQuiz">
            Ulangi kuis
        </button>
    `;

    $("#retryQuiz").addEventListener("click", startQuiz);
}


// ================================================
// PROGRES BELAJAR
// ================================================

function renderProgress() {
    const lessonList = $("#progressLessonList");
    const history = $("#quizHistory");

    if (!lessonList || !history) return;

    lessonList.innerHTML = lessons.map((lesson, index) => `
        <div class="progress-line">
            <span>${index + 1}. ${lesson[0]}</span>

            <span class="${state.completed.includes(index) ? "done-label" : ""}">
                ${state.completed.includes(index)
                    ? "✓ Selesai"
                    : "Belum dipelajari"}
            </span>
        </div>
    `).join("");

    history.innerHTML = state.quizzes.length
        ? state.quizzes.map(quiz => `
            <div class="history-item">
                <span>📝 Kuis pecahan · ${quiz.date}</span>
                <b>${quiz.score}/50 poin</b>
            </div>
        `).join("")
        : `
            <p class="muted">
                Belum ada kuis yang diselesaikan.
                Yuk coba kuis pertamamu!
            </p>
        `;
}


// ================================================
// PROFIL SISWA
// ================================================

$("#saveProfile").addEventListener("click", () => {
    const nameInput = $("#studentName");
    const feedback = $("#profileFeedback");

    const name = nameInput.value.trim();

    if (!name) {
        feedback.textContent = "Nama tidak boleh kosong.";
        feedback.className = "feedback error";
        return;
    }

    state.name = name;

    save();

    feedback.textContent = "Profil berhasil disimpan!";
    feedback.className = "feedback";

    toast(`Halo, ${name}! 👋`);
});

$("#studentName").value = state.name;


// ================================================
// INISIALISASI WEBSITE
// ================================================

prepareGameMarkup();
renderLessons();
updateFraction();
updateDashboard();
renderGame();
startQuiz();
