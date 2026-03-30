# 📊 index.js — Execution Flow

> Clean **waterfall-style** diagrams — read top-to-bottom, just like a DSA flowchart.

---

## 1️⃣ Page Load / Refresh

```mermaid
flowchart TB
    START(("🌐 Page Load"))
    START ==> A

    A["enableDropOnColumn() — setup all 3 columns"]
    A ==> B["Register Event Listeners — delete, modal, textarea"]
    B ==> C["renderBoard() — hydrate from storage"]
    C ==> D["loadBoardState() — read localStorage"]

    D ==> E{"localStorage\nexists?"}
    E -- "❌ No" --> F["getDefaultBoardState() — empty board"]
    E -- "✅ Yes" --> G{"JSON\nvalid?"}
    G -- "❌ No" --> F
    G -- "✅ Yes" --> H["Parse & return stored tasks"]

    F ==> I{"Any tasks\nto render?"}
    H ==> I
    I -- "❌ No" --> J["Empty columns — new user"]
    I -- "✅ Yes" --> K["createTaskCard() — for each task"]
    K ==> L["enableDragOnCard() — make each card draggable"]

    J ==> M["refreshAllTaskCounts() — update badges"]
    L ==> M
    M ==> DONE(("✅ Ready"))

    style START fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style DONE fill:#2ecc71,color:#fff,stroke:#2ecc71
    style F fill:#f39c12,color:#fff
    style J fill:#f39c12,color:#fff
```

---

## 2️⃣ User Adds a New Task

```mermaid
flowchart TB
    START(("👆 Add New Task"))
    START ==> A

    A["openModal() — show overlay, focus input"]
    A ==> B["User fills title & description"]
    B ==> C{"Submit\nor Cancel?"}

    C -- "🚫 Cancel / Escape / Backdrop" --> D["closeModal() — hide + reset fields"]
    D ==> STOP(("🔴 Closed"))

    C -- "✅ Submit" --> E{"Title\nempty?"}
    E -- "❌ Yes" --> F["Show red glow error"]
    F ==> STOP2(("🔴 Blocked"))

    E -- "✅ No" --> G["loadBoardState() — get nextId"]
    G ==> H["createTaskCard() — build new card"]
    H ==> I["enableDragOnCard() — make it draggable"]
    I ==> J["Append card to To Do column"]
    J ==> K["saveBoardState() — write to localStorage"]
    K ==> L["refreshAllTaskCounts() — update badges"]
    L ==> M["closeModal() — hide + reset fields"]
    M ==> DONE(("✅ Task Added"))

    style START fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style DONE fill:#2ecc71,color:#fff,stroke:#2ecc71
    style STOP fill:#e74c5a,color:#fff,stroke:#e74c5a
    style STOP2 fill:#e74c5a,color:#fff,stroke:#e74c5a
    style F fill:#e74c5a,color:#fff
```

---

## 3️⃣ User Moves a Task (Drag & Drop)

```mermaid
flowchart TB
    START(("👆 Start Drag"))
    START ==> A

    A["dragstart — set activeCard + add CSS 'dragging'"]
    A ==> B["All columns get 'drag-shrink' class"]
    B ==> C["User drags over target column"]
    C ==> D["dragover — highlight column with 'drag-over'"]

    D ==> E{"Drops\nhere?"}
    E -- "❌ Leaves" --> F["dragleave — remove highlight"]
    F ==> C

    E -- "✅ Drops" --> G["drop — append card into column's task list"]
    G ==> H["dragend — remove all CSS classes"]
    H ==> I["saveBoardState() — persist new column"]
    I ==> J["refreshAllTaskCounts() — update badges"]
    J ==> DONE(("✅ Task Moved"))

    style START fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style DONE fill:#2ecc71,color:#fff,stroke:#2ecc71
```

---

## 4️⃣ User Deletes a Task

```mermaid
flowchart TB
    START(("🗑️ Click Delete"))
    START ==> A

    A{"Clicked on\ntrash icon?"}
    A -- "❌ No" --> IGNORE(("⚪ Ignore"))
    A -- "✅ Yes" --> B["Fade-out animation — 250ms"]
    B ==> C["card.remove() — remove from DOM"]
    C ==> D["saveBoardState() — persist remaining tasks"]
    D ==> E["refreshAllTaskCounts() — update badges"]
    E ==> DONE(("✅ Task Deleted"))

    style START fill:#e74c5a,color:#fff,stroke:#e74c5a
    style DONE fill:#2ecc71,color:#fff,stroke:#2ecc71
    style IGNORE fill:#8e8ea0,color:#fff,stroke:#8e8ea0
```

---

## 5️⃣ Modal Close (3 Triggers)

```mermaid
flowchart TB
    A(("Cancel Btn"))
    B(("Backdrop Click"))
    C(("Escape Key"))

    A ==> D["closeModal()"]
    B ==> D
    C ==> D

    D ==> E["Remove .active — fade out backdrop"]
    E ==> F["Wait 300ms for animation"]
    F ==> G["Reset title, description, height, styles"]
    G ==> DONE(("✅ Closed"))

    style A fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style B fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style C fill:#6c5ce7,color:#fff,stroke:#6c5ce7
    style D fill:#3498db,color:#fff
    style DONE fill:#2ecc71,color:#fff,stroke:#2ecc71
```

---

## 📦 Function Reference

| Function                                              | Called By                                |
| ----------------------------------------------------- | ---------------------------------------- |
| `getDefaultBoardState()` — return empty board         | `loadBoardState()`                       |
| `loadBoardState()` — read + validate localStorage     | `renderBoard()`, submit handler          |
| `saveBoardState()` — serialize DOM → localStorage     | drag-end, delete, submit                 |
| `refreshAllTaskCounts()` — update column badges       | `renderBoard()`, drag-end, delete, submit|
| `createTaskCard()` — build card DOM element           | `renderBoard()`, submit handler          |
| `enableDragOnCard()` — attach drag events to card     | `createTaskCard()`                       |
| `enableDropOnColumn()` — attach drop events to column | Initialization                           |
| `renderBoard()` — hydrate board from localStorage     | Initialization (last line)               |
| `openModal()` — show modal + focus input              | Add New Task button                      |
| `closeModal()` — hide modal + reset fields            | Cancel, backdrop, Escape, submit         |
