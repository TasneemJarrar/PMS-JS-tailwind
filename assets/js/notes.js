const clock = document.querySelector("#clock");
const modebtn = document.getElementById("mode-toggle");
const modeicon = document.getElementById("mode-icon");
const html = document.documentElement;
const notesContainer = document.querySelector(".notesContainer");
const noteCount = document.querySelector(".noteCount");
const noteInput = document.querySelector("#noteInput");
const colorPicker = document.querySelector(".colorPicker");
const emptyNote = document.querySelector(".emptyNote");
const favNotesBtn = document.querySelector(".favNotes");
const addNoteForm = document.querySelector(".addNoteForm");
const CreateBtn = document.querySelector(".CreateBtn");


if (localStorage.getItem("theme") == "dark") {
  html.classList.add("dark");
  modeicon.classList.replace("fa-moon", "fa-sun");
}

modebtn.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    modeicon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    modeicon.classList.replace("fa-sun", "fa-moon");
  }
});

//clock 
const updateClock = () => {
  clock.textContent = new Date().toLocaleTimeString();
};

updateClock();

setInterval(updateClock, 1000);

let notes;
try {
  notes = JSON.parse(localStorage.getItem("notes"));
} catch {
  notes = [];
}
if (!notes) notes = [];

let nextId =
  notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;

let selectedColor = "violet";
let showFavouritesOnly = false;

const COLOR_CLASSES = {
  violet: {
    text: "text-violet-400",
    ring: "ring-violet-400",
    fill: "fill-violet-400",
    glow: "shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/50",
  },
  pink: {
    text: "text-pink-400",
    ring: "ring-pink-400",
    fill: "fill-pink-400",
    glow: "shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50",
  },
  lime: {
    text: "text-lime-300",
    ring: "ring-lime-300",
    fill: "fill-lime-300",
    glow: "shadow-lg shadow-lime-400/30 hover:shadow-xl hover:shadow-lime-400/50",
  },
  cyan: {
    text: "text-cyan-300",
    ring: "ring-cyan-300",
    fill: "fill-cyan-300",
    glow: "shadow-lg shadow-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/50",
  },
};

function updateStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

notesContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("InputEdit")) {
    updateStorage();
  }
});

function start() {
  const visible = showFavouritesOnly
    ? notes.filter((note) => note.favourite)
    : notes;
  noteCount.textContent = `${notes.length} saved`;
  if (notes.length === 0) {
    emptyNote.classList.remove("hidden");
  } else {
    emptyNote.classList.add("hidden");
  }
  notesContainer.innerHTML = "";
  visible.slice().forEach((note) => {
    const colorCheck = COLOR_CLASSES[note.color];
    const noteCard = document.createElement("div");
    noteCard.setAttribute(
      "class",
      `transition -all duration-300 ease-in-out bg-gray-800 rounded-2xl p-4 ${colorCheck.glow}`,
    );
    noteCard.dataset.id = note.id;

    noteCard.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-3">
    <button class="favBtn shrink-0 ${note.favourite ? colorCheck.text : "text-gray-600 hover:text-gray-400"} transition-all">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
	<path  d="M0 0h24v24H0z" fill="none" />
	<path class="${note.favourite ? colorCheck.fill : " text-white"}" fill="none" stroke="currentColor" stroke-width="2" d="M11.784 2.87a.25.25 0 0 1 .432 0l2.961 5.085a.25.25 0 0 0 .164.119l5.75 1.245a.25.25 0 0 1 .134.41l-3.92 4.388a.25.25 0 0 0-.063.192l.593 5.854a.25.25 0 0 1-.35.254l-5.384-2.373a.25.25 0 0 0-.202 0l-5.384 2.373a.25.25 0 0 1-.35-.254l.593-5.854a.25.25 0 0 0-.062-.192L2.776 9.73a.25.25 0 0 1 .133-.411l5.75-1.245a.25.25 0 0 0 .164-.119z" />
</svg>
    </div>

    <p class="InputEdit text-sm leading-relaxed text-gray-500 whitespace-pre-wrap mb-4">${note.text}</p>
    <div class="flex items-center gap-3 font-mono text-sm text-gray-500 justify-end">
    <button class="deleteBtn hover:text-pink-400 transition-all"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M16 16h2c.55 0 1 .45 1 1s-.45 1-1 1h-2c-.55 0-1-.45-1-1s.45-1 1-1m0-8h5c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.55 0-1-.45-1-1s.45-1 1-1m0 4h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1M3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3zM13 5h-2l-.71-.71c-.18-.18-.44-.29-.7-.29H6.41c-.26 0-.52.11-.7.29L5 5H3c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1" />
            </svg></button>
    </div>
    `;
    noteCard
      .querySelector(".favBtn")
      .addEventListener("click", () => toggleFavorite(note.id));

    noteCard
      .querySelector(".deleteBtn")
      .addEventListener("click", () => deleteNote(note.id));

    noteCard
      .querySelector(".InputEdit")
      .setAttribute("contenteditable", "true");

    notesContainer.appendChild(noteCard);
    updateStorage();
  });
}

function addNote(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  notes.push({
    id: nextId++,
    text: trimmed,
    color: selectedColor,
    favourite: false,
  });
  updateStorage();
  start();
}

function deleteNote(id) {
const noteCard = notesContainer.querySelector(`[data-id="${id}"]`);
  if (noteCard) {
    noteCard.classList.add(
      "tansition-all",
      "duration-300",
      "ease-in-out",
      "opacity-0",
      "scale-95",
    );
    setTimeout(() => {
      notes = notes.filter((note) => note.id !== id);
      updateStorage();
      strat();
    }, 180);
  } else {
    notes = notes.filter((note) => note.id !== id);
    updateStorage();
    start();
  }
}

function toggleFavorite(id) {
  notes = notes.map((note) =>
    note.id === id ? { ...note, favourite: !note.favourite } : note,
  );
  updateStorage();
  start();
}

addNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNote(noteInput.value);
  noteInput.value = "";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.classList.contains("InputEdit")) {
    document.execCommand("insertLineBreak");
    event.preventDefault();
    updateStorage();
  }
});

favNotesBtn.addEventListener("click", () => {
  showFavouritesOnly = !showFavouritesOnly;
  favNotesBtn.classList.toggle("text-lime-300", showFavouritesOnly);
  favNotesBtn.textContent = showFavouritesOnly ? "All Notes" : "Favorite Notes";
  start();
});

colorPicker.addEventListener("click", (e) => {
  const btn = e.target.closest(".colorSwitch");
  if (btn) {
    selectedColor = btn.dataset.color;
    document.querySelectorAll(".colorSwitch").forEach((el) => {
      el.classList.remove(
        "ring-2",
        "ring-offset-2",
        "ring-offset-gray-950",
        "ring-violet-400",
      );
    });
    btn.classList.add(
      "ring-2",
      "ring-offset-2",
      "ring-offset-gray-950",
      COLOR_CLASSES[selectedColor].ring,
    );
  }
});

if (!localStorage.getItem("notes")) {
  updateStorage();
}

start();