/* ═══════════════════════════════════════════════════════════════════════
   Dev's Kanban Board — Application Logic
   ─────────────────────────────────────────────────────────────────────
   Handles:
     1. Data Layer    — localStorage read / write with edge-case guards
     2. Rendering     — build task cards from stored data on page load
     3. Drag & Drop   — move tasks between columns with visual feedback
     4. Modal         — open / close / reset the "Add New Task" dialog
     5. Task CRUD     — create new task cards, delete existing ones
     6. Column State  — live task-count badges
   ═══════════════════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────────────────
   1. CONSTANTS & CONFIGURATION
   ───────────────────────────────────────────────────────────────────── */

/** localStorage key under which the entire board state is persisted */
const STORAGE_KEY = "kanban_board_tasks";

/**
 * Mapping of column status keys to their DOM element IDs.
 * Used by both the renderer and the persistence layer.
 */
const COLUMN_CONFIG = {
  todo: { listId: "tasks-todo", badgeId: "count-todo" },
  inprogress: { listId: "tasks-inprogress", badgeId: "count-inprogress" },
  done: { listId: "tasks-done", badgeId: "count-done" },
};

/** SVG markup for the trash icon — reused by every delete button (DRY) */
const TRASH_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
  </svg>`;

/* ─────────────────────────────────────────────────────────────────────
   2. DOM REFERENCES
   ───────────────────────────────────────────────────────────────────── */

const columns = document.querySelectorAll(".column");
const taskContainers = document.querySelectorAll(".column__tasks");

/* Modal elements */
const modalOverlay = document.getElementById("modal-overlay");
const modalTitleIn = document.getElementById("modal-title");
const modalDescIn = document.getElementById("modal-desc");
const btnOpenModal = document.getElementById("btn-add-task");
const btnCancel = document.getElementById("modal-cancel");
const btnSubmit = document.getElementById("modal-submit");

/** Reference to the card currently being dragged */
let activelyDraggedCard = null;

/* ─────────────────────────────────────────────────────────────────────
   3. DATA LAYER — localStorage Persistence
   ─────────────────────────────────────────────────────────────────────
   Data format stored in localStorage (JSON string):
   {
     "nextId": 8,
     "tasks": [
       { "id": "task-1", "title": "...", "description": "...", "status": "todo" },
       ...
     ]
   }

   Edge cases handled:
     • New user (no data)         → returns default empty board state
     • Corrupted / invalid JSON   → returns default empty board state
     • Missing keys in object     → returns default empty board state
   ───────────────────────────────────────────────────────────────────── */

/**
 * Create and return a blank board state.
 * Used for first-time users or when stored data is corrupted.
 * @returns {{ nextId: number, tasks: Array }}
 */
function getDefaultBoardState() {
  return { nextId: 1, tasks: [] };
}

/**
 * Safely read the board state from localStorage.
 * Returns the default empty state if data is missing or invalid.
 * @returns {{ nextId: number, tasks: Array }}
 */
function loadBoardState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    /* Edge case: new user — no data exists yet */
    if (!raw) return getDefaultBoardState();

    const parsed = JSON.parse(raw);

    /* Edge case: stored value is not an object or missing required keys */
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray(parsed.tasks) ||
      typeof parsed.nextId !== "number"
    ) {
      return getDefaultBoardState();
    }

    return parsed;
  } catch {
    /* Edge case: corrupted JSON that cannot be parsed */
    return getDefaultBoardState();
  }
}

/**
 * Serialize the current DOM state into localStorage.
 * Reads task cards from each column and builds the tasks array.
 * Called after every mutation: create, delete, drag-drop.
 */
function saveBoardState() {
  const tasks = [];
  let maxId = 0;

  Object.entries(COLUMN_CONFIG).forEach(([status, { listId }]) => {
    const container = document.getElementById(listId);
    if (!container) return;

    container.querySelectorAll(".task-card").forEach((card) => {
      const id = card.dataset.taskId || "";
      const title = card.querySelector(".task-card__title")?.textContent || "";
      const description =
        card.querySelector(".task-card__desc")?.textContent || "";

      tasks.push({ id, title, description, status });

      /* Track the highest numeric ID to keep nextId accurate */
      const numericId = parseInt(id.replace("task-", ""), 10);
      if (!isNaN(numericId) && numericId > maxId) {
        maxId = numericId;
      }
    });
  });

  const state = { nextId: maxId + 1, tasks };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    /* Storage full or unavailable — log and continue gracefully */
    console.warn("Kanban: Failed to save to localStorage.", error);
  }
}

/* ─────────────────────────────────────────────────────────────────────
   4. UTILITY HELPERS
   ───────────────────────────────────────────────────────────────────── */

/**
 * Recalculate and update every column's task-count badge.
 */
function refreshAllTaskCounts() {
  Object.values(COLUMN_CONFIG).forEach(({ listId, badgeId }) => {
    const list = document.getElementById(listId);
    const badge = document.getElementById(badgeId);
    if (list && badge) {
      badge.textContent = list.querySelectorAll(".task-card").length;
    }
  });
}

/**
 * Create a complete task-card DOM element.
 * @param {string} id          — unique task ID (e.g. "task-5")
 * @param {string} title       — task heading text
 * @param {string} description — task body text
 * @returns {HTMLElement}      — the <article.task-card> element
 */
function createTaskCard(id, title, description) {
  const article = document.createElement("article");
  article.className = "task-card";
  article.draggable = true;
  article.dataset.taskId = id;

  /* Info section — title + description */
  const infoDiv = document.createElement("div");
  infoDiv.className = "task-card__info";

  const h3 = document.createElement("h3");
  h3.className = "task-card__title";
  h3.textContent = title;

  const p = document.createElement("p");
  p.className = "task-card__desc";
  p.textContent = description;

  infoDiv.append(h3, p);

  /* Delete button with trash icon */
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-card__delete";
  deleteBtn.setAttribute("aria-label", `Delete task: ${title}`);
  deleteBtn.innerHTML = TRASH_ICON_SVG;

  /* Assemble */
  article.append(infoDiv, deleteBtn);

  /* Make it draggable */
  enableDragOnCard(article);

  return article;
}

/* ─────────────────────────────────────────────────────────────────────
   5. RENDERING — Hydrate the board from localStorage on page load
   ───────────────────────────────────────────────────────────────────── */

/**
 * Clear all columns and re-render task cards from the persisted state.
 */
function renderBoard() {
  const { tasks } = loadBoardState();

  /* Clear existing cards (safety measure) */
  Object.values(COLUMN_CONFIG).forEach(({ listId }) => {
    const container = document.getElementById(listId);
    if (container) container.innerHTML = "";
  });

  /* Render each task into its column */
  tasks.forEach(({ id, title, description, status }) => {
    const config = COLUMN_CONFIG[status];
    if (!config) return; // Skip tasks with unknown status

    const container = document.getElementById(config.listId);
    if (!container) return;

    const card = createTaskCard(id, title, description);
    container.appendChild(card);
  });

  refreshAllTaskCounts();
}

/* ─────────────────────────────────────────────────────────────────────
   6. DRAG & DROP
   ─────────────────────────────────────────────────────────────────────
   Events are attached to `.column__tasks` containers (the actual drop
   zones), NOT the outer <section.column>, ensuring cards always land
   inside the scrollable list and the column hierarchy is preserved.
   ───────────────────────────────────────────────────────────────────── */

/**
 * Attach dragstart / dragend listeners to a single task card.
 * Extracted as a reusable function for both initial and dynamic cards.
 * @param {HTMLElement} card — an article.task-card element
 */
function enableDragOnCard(card) {
  card.addEventListener("dragstart", () => {
    activelyDraggedCard = card;
    card.classList.add("dragging");

    /* Shrink all columns for visual spatial feedback */
    columns.forEach((col) => col.classList.add("drag-shrink"));
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");

    /* Clean up all visual drag states */
    columns.forEach((col) => {
      col.classList.remove("drag-shrink");
      col.classList.remove("drag-over");
    });

    activelyDraggedCard = null;

    /* Persist the new column assignment to localStorage */
    saveBoardState();
    refreshAllTaskCounts();
  });
}

/**
 * Register dragover / dragleave / drop listeners on a column.
 * @param {HTMLElement} column — a <section.column> element
 */
function enableDropOnColumn(column) {
  const taskList = column.querySelector(".column__tasks");
  if (!taskList) return;

  /* Allow drop & highlight the column wrapper */
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  /* Remove highlight only when the pointer truly leaves the column */
  column.addEventListener("dragleave", (e) => {
    if (!column.contains(e.relatedTarget)) {
      column.classList.remove("drag-over");
    }
  });

  /* Handle the actual drop — append card into `.column__tasks` */
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    if (activelyDraggedCard) {
      taskList.appendChild(activelyDraggedCard);
    }
    column.classList.remove("drag-over");
  });
}

/* Initialize drop zones on every column */
columns.forEach(enableDropOnColumn);

/* ─────────────────────────────────────────────────────────────────────
   7. TASK DELETION — Event Delegation
   ─────────────────────────────────────────────────────────────────────
   A single click handler on each `.column__tasks` covers both initial
   and dynamically created cards — no per-card binding needed.
   ───────────────────────────────────────────────────────────────────── */

taskContainers.forEach((container) => {
  container.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".task-card__delete");
    if (!deleteBtn) return;

    const card = deleteBtn.closest(".task-card");
    if (!card) return;

    /* Fade-out animation before removal */
    card.style.opacity = "0";
    card.style.transform = "translateX(20px)";
    card.style.transition = "opacity 250ms ease, transform 250ms ease";

    card.addEventListener(
      "transitionend",
      () => {
        card.remove();
        saveBoardState();
        refreshAllTaskCounts();
      },
      { once: true },
    );
  });
});

/* ─────────────────────────────────────────────────────────────────────
   8. MODAL — Open / Close / Reset
   ───────────────────────────────────────────────────────────────────── */

/** Open the modal and auto-focus the title input */
function openModal() {
  modalOverlay.classList.add("active");
  setTimeout(() => modalTitleIn.focus(), 120);
}

/** Close the modal and reset all form fields */
function closeModal() {
  modalOverlay.classList.remove("active");

  /* Delay reset until the close animation completes */
  setTimeout(() => {
    modalTitleIn.value = "";
    modalDescIn.value = "";
    modalDescIn.style.height = "";
    modalTitleIn.style.borderColor = "";
    modalTitleIn.style.boxShadow = "";
  }, 300);
}

/* Open — navbar button */
btnOpenModal.addEventListener("click", openModal);

/* Close — Cancel button */
btnCancel.addEventListener("click", closeModal);

/* Close — click on the backdrop (outside the dialog card) */
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

/* Close — Escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
    closeModal();
  }
});

/* ─────────────────────────────────────────────────────────────────────
   9. TEXTAREA AUTO-EXPAND
   ───────────────────────────────────────────────────────────────────── */

modalDescIn.addEventListener("input", () => {
  modalDescIn.style.height = "auto";
  modalDescIn.style.height = `${modalDescIn.scrollHeight}px`;
});

/* ─────────────────────────────────────────────────────────────────────
   10. TASK CREATION — Validate, build, persist, and render
   ───────────────────────────────────────────────────────────────────── */

btnSubmit.addEventListener("click", () => {
  const titleValue = modalTitleIn.value.trim();
  const descValue = modalDescIn.value.trim();

  /* Validation: title is required */
  if (!titleValue) {
    modalTitleIn.focus();
    modalTitleIn.style.borderColor = "var(--danger)";
    modalTitleIn.style.boxShadow = "0 0 0 3px var(--danger-glow)";

    setTimeout(() => {
      modalTitleIn.style.borderColor = "";
      modalTitleIn.style.boxShadow = "";
    }, 800);

    return;
  }

  /* Generate the next unique task ID from the persisted counter */
  const { nextId } = loadBoardState();
  const newTaskId = `task-${nextId}`;

  /* Build and append the card into the "To Do" column */
  const todoList = document.getElementById(COLUMN_CONFIG.todo.listId);
  const newCard = createTaskCard(newTaskId, titleValue, descValue);
  todoList.appendChild(newCard);

  /* Persist the updated state and refresh UI */
  saveBoardState();
  refreshAllTaskCounts();
  closeModal();
});

/* Submit - When press Enter */
modalOverlay.addEventListener("keydown", (e) => {
  if (modalTitleIn.value && e.key === "Enter" && !e.shiftKey) {
    btnSubmit.click();
  }
});

/* ─────────────────────────────────────────────────────────────────────
   11. INITIALIZATION — Hydrate board from localStorage on page load
   ───────────────────────────────────────────────────────────────────── */

renderBoard();
