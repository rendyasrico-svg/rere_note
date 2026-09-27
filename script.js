/* =========================================
   RERE NOTE
========================================= */

const STORAGE_KEY = "rere_note_data";
const THEME_KEY = "rere_note_theme";


/* =========================================
   ELEMENTS
========================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebarClose =
    document.getElementById("sidebarClose");

const allNotesBtn =
    document.getElementById("allNotesBtn");

const themeBtn =
    document.getElementById("themeBtn");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const sidebarNoteCount =
    document.getElementById("sidebarNoteCount");

const newNoteBtn =
    document.getElementById("newNoteBtn");

const emptyNewNoteBtn =
    document.getElementById("emptyNewNoteBtn");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const notesList =
    document.getElementById("notesList");

const emptyState =
    document.getElementById("emptyState");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyDescription =
    document.getElementById("emptyDescription");


/* EDITOR */

const editorModal =
    document.getElementById("editorModal");

const editorBack =
    document.getElementById("editorBack");

const editorStatus =
    document.getElementById("editorStatus");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const checklistBtn =
    document.getElementById("checklistBtn");

const saveNoteBtn =
    document.getElementById("saveNoteBtn");

const deleteNoteBtn =
    document.getElementById("deleteNoteBtn");

const colorOptions =
    document.querySelectorAll(".color-option");

const toolButtons =
    document.querySelectorAll(".tool-btn");


/* DELETE */

const confirmOverlay =
    document.getElementById("confirmOverlay");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");


/* TOAST */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* TOOLTIP */

const pinTooltip =
    document.getElementById("pinTooltip");


/* =========================================
   STATE
========================================= */

let notes = [];

let currentNoteId = null;

let currentColor = "default";

let currentPinned = false;

let deleteTargetId = null;

let toastTimer = null;


/* =========================================
   LOAD
========================================= */

function loadNotes() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        notes = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(notes)) {

            notes = [];

        }

    } catch (error) {

        console.error(
            "Gagal membaca catatan:",
            error
        );

        notes = [];

    }

}


/* =========================================
   SAVE
========================================= */

function saveNotes() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );

}


/* =========================================
   ID
========================================= */

function generateId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


/* =========================================
   DATE
========================================= */

function formatDate(timestamp) {

    const date =
        new Date(timestamp);

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* =========================================
   STRIP HTML
========================================= */

function stripHTML(html) {

    const div =
        document.createElement("div");

    div.innerHTML =
        html || "";

    return div.textContent || "";

}


/* =========================================
   SIDEBAR
========================================= */

function openSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add("show");

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");

}


mobileMenu.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        if (
            sidebar.classList.contains("open")
        ) {

            closeSidebar();

        } else {

            openSidebar();

        }

    }
);


sidebarClose.addEventListener(
    "click",
    closeSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


allNotesBtn.addEventListener(
    "click",
    function () {

        closeSidebar();

        searchInput.value = "";

        renderNotes();

    }
);


/* Klik di luar sidebar */

document.addEventListener(
    "click",
    function (event) {

        if (
            !sidebar.classList.contains("open")
        ) {

            return;

        }

        const inside =
            sidebar.contains(event.target);

        const hamburger =
            mobileMenu.contains(event.target);

        if (
            !inside &&
            !hamburger
        ) {

            closeSidebar();

        }

    }
);


/* =========================================
   THEME
========================================= */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeIcon.className =
            "fa-solid fa-sun";

        themeText.textContent =
            "Mode Terang";

    } else {

        document.body.classList.remove("dark");

        themeIcon.className =
            "fa-solid fa-moon";

        themeText.textContent =
            "Mode Gelap";

    }

}


function toggleTheme() {

    const dark =
        document.body.classList.contains(
            "dark"
        );

    const theme =
        dark
            ? "light"
            : "dark";

    localStorage.setItem(
        THEME_KEY,
        theme
    );

    applyTheme(theme);

    closeSidebar();

}


const savedTheme =
    localStorage.getItem(
        THEME_KEY
    );


applyTheme(
    savedTheme === "dark"
        ? "dark"
        : "light"
);


themeBtn.addEventListener(
    "click",
    toggleTheme
);


/* =========================================
   SORT
========================================= */

function sortNotes(list) {

    const sort =
        sortSelect.value;

    const sorted =
        [...list];


    sorted.sort(
        (a, b) => {

            if (
                a.pinned &&
                !b.pinned
            ) {

                return -1;

            }


            if (
                !a.pinned &&
                b.pinned
            ) {

                return 1;

            }


            if (
                sort === "newest"
            ) {

                return (
                    b.updatedAt -
                    a.updatedAt
                );

            }


            if (
                sort === "oldest"
            ) {

                return (
                    a.updatedAt -
                    b.updatedAt
                );

            }


            if (
                sort === "title"
            ) {

                return (
                    (a.title || "")
                        .localeCompare(
                            b.title || "",
                            "id"
                        )
                );

            }


            return 0;

        }
    );


    return sorted;

}


/* =========================================
   RENDER
========================================= */

function renderNotes() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    let filtered =
        notes.filter(
            note => {

                const title =
                    note.title || "";

                const content =
                    stripHTML(
                        note.content || ""
                    );


                return (
                    title
                        .toLowerCase()
                        .includes(query) ||

                    content
                        .toLowerCase()
                        .includes(query)
                );

            }
        );


    filtered =
        sortNotes(filtered);


    notesList.innerHTML = "";


    sidebarNoteCount.textContent =
        notes.length;


    if (
        filtered.length === 0
    ) {

        emptyState.style.display =
            "flex";


        if (
            query &&
            notes.length > 0
        ) {

            emptyTitle.textContent =
                "Catatan tidak ditemukan";

            emptyDescription.textContent =
                "Coba gunakan kata pencarian yang berbeda.";

            emptyNewNoteBtn.style.display =
                "none";

        } else {

            emptyTitle.textContent =
                "Belum ada catatan";

            emptyDescription.textContent =
                "Buat catatan pertamamu untuk mulai menulis.";

            emptyNewNoteBtn.style.display =
                "inline-flex";

        }


        return;

    }


    emptyState.style.display =
        "none";


    filtered.forEach(
        note => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "note-card";


            if (note.pinned) {

                card.classList.add(
                    "pinned"
                );

            }


            if (
                note.color &&
                note.color !== "default"
            ) {

                card.classList.add(
                    `color-${note.color}`
                );

            }


            const title =
                note.title &&
                note.title.trim()
                    ? note.title.trim()
                    : "Tanpa Judul";


            const content =
                stripHTML(
                    note.content || ""
                ).trim();


            const preview =
                content ||
                "Tidak ada isi catatan.";


            card.innerHTML = `

                <button
                    class="card-pin ${note.pinned ? "pinned" : ""}"
                    title="${
                        note.pinned
                            ? "Lepas sematan"
                            : "Sematkan catatan"
                    }"
                    type="button"
                >

                    <i class="fa-solid fa-thumbtack"></i>

                </button>


                <div class="note-card-title">

                    ${escapeHTML(title)}

                </div>


                <div class="note-card-preview">

                    ${escapeHTML(preview)}

                </div>


                <div class="note-card-date">

                    ${formatDate(note.updatedAt)}

                </div>

            `;


            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            ".card-pin"
                        )
                    ) {

                        return;

                    }


                    openEditor(note.id);

                }
            );


            const pin =
                card.querySelector(
                    ".card-pin"
                );


            pin.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    togglePin(note.id);

                }
            );


            let pressTimer;


            pin.addEventListener(
                "pointerdown",
                function () {

                    pressTimer =
                        setTimeout(
                            function () {

                                showPinTooltip(
                                    pin,
                                    note.pinned
                                );

                            },
                            550
                        );

                }
            );


            pin.addEventListener(
                "pointerup",
                function () {

                    clearTimeout(
                        pressTimer
                    );

                }
            );


            pin.addEventListener(
                "pointerleave",
                function () {

                    clearTimeout(
                        pressTimer
                    );

                }
            );


            notesList.appendChild(card);

        }
    );

}


/* =========================================
   PIN (dari daftar catatan)
========================================= */

function togglePin(id) {

    const note =
        notes.find(
            item => item.id === id
        );


    if (!note) {

        return;

    }


    note.pinned =
        !note.pinned;


    note.updatedAt =
        Date.now();


    saveNotes();

    renderNotes();


    showToast(
        note.pinned
            ? "Catatan disematkan"
            : "Sematan dilepas"
    );

}


/* =========================================
   TOOLTIP
========================================= */

function showPinTooltip(
    element,
    isPinned
) {

    const rect =
        element.getBoundingClientRect();


    pinTooltip.textContent =
        isPinned
            ? "Lepas sematan"
            : "Sematkan catatan";


    pinTooltip.style.display =
        "block";


    const width =
        pinTooltip.offsetWidth;


    let left =
        rect.left +
        rect.width / 2 -
        width / 2;


    left =
        Math.max(
            8,
            Math.min(
                left,
                window.innerWidth -
                width -
                8
            )
        );


    pinTooltip.style.left =
        `${left}px`;


    pinTooltip.style.top =
        `${rect.bottom + 8}px`;


    setTimeout(
        function () {

            pinTooltip.style.display =
                "none";

        },
        1400
    );

}


/* =========================================
   NEW NOTE
========================================= */

function createNewNote() {

    currentNoteId = null;

    currentColor = "default";

    currentPinned = false;


    editorStatus.textContent =
        "Catatan baru";


    noteTitle.value = "";

    noteContent.innerHTML = "";


    deleteNoteBtn.style.display =
        "none";


    updateColorButtons();


    editorModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        function () {

            noteTitle.focus();

        },
        100
    );

}


/* =========================================
   OPEN NOTE
========================================= */

function openEditor(id) {

    const note =
        notes.find(
            item => item.id === id
        );


    if (!note) {

        return;

    }


    currentNoteId =
        note.id;


    currentColor =
        note.color || "default";


    currentPinned =
        Boolean(note.pinned);


    editorStatus.textContent =
        "Mengedit catatan";


    noteTitle.value =
        note.title || "";


    noteContent.innerHTML =
        note.content || "";


    deleteNoteBtn.style.display =
        "inline-flex";


    updateColorButtons();


    editorModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE EDITOR
========================================= */

function closeEditor() {

    editorModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

    currentNoteId = null;

}


/* =========================================
   SAVE NOTE
========================================= */

function saveCurrentNote() {

    const title =
        noteTitle.value.trim();


    const content =
        noteContent.innerHTML.trim();


    if (
        !title &&
        !stripHTML(content).trim()
    ) {

        showToast(
            "Catatan masih kosong"
        );

        return;

    }


    const now =
        Date.now();


    if (currentNoteId) {

        const note =
            notes.find(
                item =>
                    item.id ===
                    currentNoteId
            );


        if (note) {

            note.title =
                title;

            note.content =
                content;

            note.color =
                currentColor;

            note.pinned =
                currentPinned;

            note.updatedAt =
                now;

        }

    } else {

        notes.push({

            id:
                generateId(),

            title:
                title,

            content:
                content,

            color:
                currentColor,

            pinned:
                currentPinned,

            createdAt:
                now,

            updatedAt:
                now

        });

    }


    saveNotes();

    renderNotes();

    closeEditor();


    showToast(
        "Catatan berhasil disimpan"
    );

}


/* =========================================
   COLOR
========================================= */

function updateColorButtons() {

    colorOptions.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.color ===
                currentColor
            );

        }
    );

}


colorOptions.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                currentColor =
                    this.dataset.color;


                updateColorButtons();

            }
        );

    }
);


/* =========================================
   TOOLBAR
========================================= */

toolButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const command =
                    this.dataset.command;


                if (!command) {

                    return;

                }


                noteContent.focus();


                document.execCommand(
                    command,
                    false,
                    null
                );

            }
        );

    }
);


/* =========================================
   CHECKLIST
========================================= */

checklistBtn.addEventListener(
    "click",
    function () {

        noteContent.focus();


        document.execCommand(
            "insertUnorderedList",
            false,
            null
        );

    }
);


/* =========================================
   EVENTS
========================================= */

newNoteBtn.addEventListener(
    "click",
    createNewNote
);


emptyNewNoteBtn.addEventListener(
    "click",
    createNewNote
);


editorBack.addEventListener(
    "click",
    closeEditor
);


saveNoteBtn.addEventListener(
    "click",
    saveCurrentNote
);


searchInput.addEventListener(
    "input",
    renderNotes
);


sortSelect.addEventListener(
    "change",
    renderNotes
);


/* =========================================
   DELETE
========================================= */

deleteNoteBtn.addEventListener(
    "click",
    function () {

        if (!currentNoteId) {

            return;

        }


        deleteTargetId =
            currentNoteId;


        confirmOverlay.classList.add(
            "show"
        );

    }
);


cancelDeleteBtn.addEventListener(
    "click",
    function () {

        deleteTargetId =
            null;


        confirmOverlay.classList.remove(
            "show"
        );

    }
);


confirmDeleteBtn.addEventListener(
    "click",
    function () {

        if (!deleteTargetId) {

            return;

        }


        notes =
            notes.filter(
                note =>
                    note.id !==
                    deleteTargetId
            );


        saveNotes();

        renderNotes();


        confirmOverlay.classList.remove(
            "show"
        );


        deleteTargetId =
            null;


        closeEditor();


        showToast(
            "Catatan dihapus"
        );

    }
);


/* =========================================
   CTRL + K
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);


/* =========================================
   ESC
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            confirmOverlay.classList.contains(
                "show"
            )
        ) {

            confirmOverlay.classList.remove(
                "show"
            );

            deleteTargetId =
                null;

            return;

        }


        if (
            editorModal.classList.contains(
                "show"
            )
        ) {

            closeEditor();

            return;

        }


        if (
            sidebar.classList.contains(
                "open"
            )
        ) {

            closeSidebar();

        }

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================================
   INITIALIZE
========================================= */

loadNotes();

renderNotes();
