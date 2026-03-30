# OTP Input With Auto-Focus

A production-grade OTP (One-Time Password) login page built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**. This project demonstrates advanced input management techniques using React hooks, with a focus on seamless auto-focus behavior across multiple input fields.

[Website Live Link](https://otp-input-page.netlify.app/)

---

## Table of Contents

- [Overview](#overview)
- [Application Flow](#application-flow)
- [Architecture & Component Design](#architecture--component-design)
- [The Thought Process: How We Decided Which Hooks to Use](#the-thought-process-how-we-decided-which-hooks-to-use)
  - [1. `useState` — Reactive UI State](#1-usestate--reactive-ui-state)
  - [2. `useRef` — Imperative DOM Access Without Re-renders](#2-useref--imperative-dom-access-without-re-renders)
  - [3. `useCallback` — Stable Function References](#3-usecallback--stable-function-references)
  - [4. `useEffect` — Side-Effect Cleanup](#4-useeffect--side-effect-cleanup)
- [Deep Dive: How Auto-Focus Actually Works](#deep-dive-how-auto-focus-actually-works)
  - [Forward Focus (Typing a Digit)](#forward-focus-typing-a-digit)
  - [Backward Focus (Backspace on Empty Box)](#backward-focus-backspace-on-empty-box)
  - [Paste Support](#paste-support)
  - [Arrow Key Navigation](#arrow-key-navigation)
- [Deep Dive: How the Countdown Timer Works](#deep-dive-how-the-countdown-timer-works)
- [Why `useRef` for Inputs and Not `document.getElementById()`?](#why-useref-for-inputs-and-not-documentgetelementbyid)
- [Why Store OTP as `string[]` Instead of a Single `string`?](#why-store-otp-as-string-instead-of-a-single-string)
- [State Management Summary Table](#state-management-summary-table)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## Overview

This project builds a complete OTP verification flow that mirrors what you see in production applications like **Razorpay**, **PhonePe**, or **Google Sign-In**. The core challenge is not just rendering 6 input boxes — it is orchestrating **focus management**, **keyboard navigation**, **paste handling**, and **timer logic** in a way that feels instant and natural to the user.

---

## Application Flow

The application transitions through **three screens**, all rendered within a single component using a `screen` state variable:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  PHONE INPUT    │       │  OTP VERIFY     │       │  SUCCESS        │
│                 │       │                 │       │                 │
│  Enter mobile   │──────▶│  Enter 6-digit  │──────▶│  ✓ Verified!   │
│  number         │ Send  │  OTP code       │Verify │                 │
│  [Send OTP]     │ OTP   │  [Verify OTP]   │ OTP   │  Phone number  │
│                 │       │  Timer + Resend │       │  confirmed     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         ▲                        │
         │    "Change number"     │
         └────────────────────────┘
```

This is managed by a simple TypeScript union type:

```typescript
type Screen = "phone" | "otp" | "success";
const [screen, setScreen] = useState<Screen>("phone");
```

When `screen` changes, React conditionally renders the corresponding JSX block. No router needed — the component handles everything internally.

---

## Architecture & Component Design

The file is organized into clear sections:

| Section            | Purpose                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Constants**      | `OTP_LENGTH = 6`, `RESEND_COOLDOWN = 30` — Single source of truth for magic numbers |
| **Utility**        | `simulateDelay()` — Wraps `setTimeout` in a `Promise` for `async/await` usage       |
| **Sub-Components** | `ShieldIcon`, `SuccessCheckmark`, `LoadingDots` — Stateless, purely visual          |
| **Main Component** | `OTP` — All state, refs, handlers, and JSX live here                                |

### Why a Single Component?

For a focused feature like OTP login, splitting into too many micro-components introduces unnecessary indirection. The state is tightly coupled — `phone`, `otp`, `timer`, `screen`, `loading`, and `error` all interact with each other. Keeping them in one place avoids complex prop drilling or context overhead.

---

## The Thought Process: How We Decided Which Hooks to Use

### 1. `useState` — Reactive UI State

**The Question:** _"What data, when changed, should cause the screen to re-render?"_

Every piece of data that directly affects what the user **sees** is a `useState` candidate:

```typescript
const [screen, setScreen] = useState<Screen>("phone"); // Which screen to show
const [phone, setPhone] = useState(""); // Phone number typed
const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Each OTP digit
const [loading, setLoading] = useState(false); // Show loading dots?
const [error, setError] = useState(""); // Show error message?
const [timer, setTimer] = useState(0); // Countdown seconds
const [shakeInputs, setShakeInputs] = useState(false); // Trigger shake animation?
```

**Why these are `useState` and not plain variables:**

A plain `let` variable resets on every render and does **not** trigger a re-render when mutated. We need React to know about these changes so it can update the DOM. That is exactly what `useState` does — it persists the value across renders **and** triggers a re-render when the setter is called.

---

### 2. `useRef` — Imperative DOM Access Without Re-renders

**The Question:** _"What do we need to access or mutate that should NOT cause a re-render?"_

We identified **two** such cases:

#### a) `inputRefs` — Storing References to All 6 OTP Input Elements

```typescript
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
```

**Why we need this:**

The core auto-focus feature requires us to **programmatically call `.focus()`** on specific input elements. In React, the only way to get a direct reference to a DOM node is through `ref`. Since we have 6 dynamic inputs rendered via `.map()`, we store all their refs in an **array**.

**How we populate it:**

```tsx
<input
  ref={(el) => {
    inputRefs.current[index] = el;
  }}
  // ...
/>
```

This **callback ref** pattern runs during rendering and stores each input's DOM node at its corresponding array index. Now we can do:

```typescript
inputRefs.current[index + 1]?.focus(); // Focus the next box
inputRefs.current[index - 1]?.focus(); // Focus the previous box
```

**Why NOT `useState` for this?**

If we stored DOM refs in `useState`, every time React renders a new input (or re-renders), calling `setInputRefs()` would trigger **another render**, causing an infinite loop. `useRef` updates its `.current` property **silently** — no re-renders.

#### b) `timerRef` — Storing the Interval ID

```typescript
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

**Why we need this:**

`setInterval` returns an ID that we need to pass to `clearInterval` later. This ID:

- Must **persist** across renders (a plain `let` would get reset)
- Must **not** trigger re-renders when stored (the user does not see the interval ID)

`useRef` is the perfect fit — it is a "mutable box" that survives re-renders without causing them.

---

### 3. `useCallback` — Stable Function References

**The Question:** _"Is this function recreated every render, and does that cause problems?"_

```typescript
const startTimer = useCallback(() => {
  setTimer(RESEND_COOLDOWN);
  if (timerRef.current) clearInterval(timerRef.current);
  timerRef.current = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}, []);
```

**Why `useCallback` here specifically:**

`startTimer` is called from **two** different places:

1. `handleSendOTP` — when the user sends the OTP
2. `handleResendOTP` — when the user resends the OTP

Without `useCallback`, a new `startTimer` function would be created on **every render**. While this does not cause a bug by itself, wrapping it in `useCallback(() => {...}, [])` tells React:

> _"This function does not depend on any changing state. Create it once and reuse the same reference."_

The empty `[]` dependency array means: "this function never needs to be recreated." This works because inside `startTimer`, we use:

- `setTimer(prev => ...)` — the **functional updater** form, which always receives the latest value without needing `timer` in the dependency array
- `timerRef.current` — accessed via ref, which is always the latest value by nature

---

### 4. `useEffect` — Side-Effect Cleanup

**The Question:** _"Is there anything that needs to be cleaned up when the component unmounts?"_

```typescript
useEffect(() => {
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

**Why this is critical:**

If the user navigates away from the OTP page while the countdown is running, the `setInterval` would **continue ticking in the background**, calling `setTimer` on an unmounted component. This causes:

- Memory leaks
- React warnings: _"Can't perform a state update on an unmounted component"_

The cleanup function (returned from `useEffect`) runs when the component unmounts, ensuring the interval is properly cleared.

**Why the empty `[]`?**

We only need this cleanup to run on **unmount**, not on every render. The empty dependency array tells React: "run the setup once on mount, and the cleanup once on unmount."

---

## Deep Dive: How Auto-Focus Actually Works

This is the heart of the project. Let us trace through each user interaction:

### Forward Focus (Typing a Digit)

```
User types "7" in box 0
         │
         ▼
handleOtpChange(0, event)
         │
         ├── Is value numeric? ✅ (regex: /^\d$/)
         ├── Update otp[0] = "7"
         ├── Clear any error message
         └── index(0) < OTP_LENGTH - 1(5)? ✅
                  │
                  └── inputRefs.current[1].focus()  ← Cursor jumps to box 1
```

**Key Code:**

```typescript
const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value && !/^\d$/.test(value)) return; // Reject non-digits

  const newOtp = [...otp]; // Clone (immutable update)
  newOtp[index] = value;
  setOtp(newOtp);
  setError("");

  if (value && index < OTP_LENGTH - 1) {
    inputRefs.current[index + 1]?.focus(); // ← Auto-focus next
  }
};
```

**Why clone with `[...otp]`?** React uses **referential equality** to detect state changes. Mutating the existing array (`otp[index] = value`) would not trigger a re-render because the array reference stays the same. Spreading into a new array creates a new reference, which React recognizes as a change.

---

### Backward Focus (Backspace on Empty Box)

```
User presses Backspace in box 3 (which is empty)
         │
         ▼
handleOtpKeyDown(3, event)
         │
         ├── key === "Backspace"? ✅
         ├── otp[3] is empty? ✅
         ├── index(3) > 0? ✅
         │         │
         │         ├── e.preventDefault()  ← Stop default backspace behavior
         │         ├── Clear otp[2] = ""
         │         └── inputRefs.current[2].focus()  ← Cursor jumps to box 2
```

**Why `onChange` cannot handle this:**

The `onChange` event only fires when the **value changes**. Pressing Backspace in an already-empty box does not change the value, so `onChange` never fires. That is why we use `onKeyDown` — it fires on **every keypress**, regardless of whether the value changes.

**Why `e.preventDefault()`?** Without it, the browser would process the Backspace key on the **current** box (doing nothing since it is empty), and then our code would focus the previous box. The browser might then also try to process Backspace on the newly focused box. Preventing default ensures clean, predictable behavior.

---

### Paste Support

```
User pastes "482916" into any box
         │
         ▼
handleOtpPaste(event)
         │
         ├── e.preventDefault()  ← Stop browser from pasting into single box
         ├── Extract text from clipboard
         ├── Strip non-digits: "482916" → "482916"
         ├── Limit to OTP_LENGTH characters
         ├── Distribute: otp = ["4", "8", "2", "9", "1", "6"]
         └── Focus next empty box (or last box if all filled)
```

**Key Code:**

```typescript
const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pasted = e.clipboardData
    .getData("text")
    .replace(/\D/g, "") // Strip non-digits
    .slice(0, OTP_LENGTH); // Limit to 6

  const newOtp = [...otp];
  pasted.split("").forEach((char, i) => {
    newOtp[i] = char;
  });
  setOtp(newOtp);

  const nextEmpty = newOtp.findIndex((v) => !v);
  const focusIdx = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
  inputRefs.current[focusIdx]?.focus();
};
```

**Why `e.preventDefault()`?** Without it, the browser would paste the entire string into the single focused input (e.g., box 0 would show "482916" instead of just "4"), violating our `maxLength={1}` constraint. We intercept the paste, distribute the digits ourselves, and manage focus.

---

### Arrow Key Navigation

```typescript
if (e.key === "ArrowLeft" && index > 0) {
  inputRefs.current[index - 1]?.focus();
}
if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
  inputRefs.current[index + 1]?.focus();
}
```

This is a simple UX enhancement — users expect arrow keys to navigate between input fields, just like navigating cells in a spreadsheet. The boundary checks (`index > 0`, `index < OTP_LENGTH - 1`) prevent out-of-bounds access.

---

## Deep Dive: How the Countdown Timer Works

The resend-OTP countdown is a common pattern, but it has a subtle implementation detail related to React's rendering model:

```typescript
const startTimer = useCallback(() => {
  setTimer(RESEND_COOLDOWN); // 1. Reset to 30
  if (timerRef.current) clearInterval(timerRef.current); // 2. Clear any existing interval
  timerRef.current = setInterval(() => {
    // 3. Start new interval
    setTimer((prev) => {
      // 4. Functional updater
      if (prev <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}, []);
```

### Why the Functional Updater `setTimer(prev => ...)`?

Inside the `setInterval` callback, if we wrote `setTimer(timer - 1)`, the `timer` variable would be captured by **closure** at the moment the interval was created. It would always be `30` (the initial value), so it would always compute `30 - 1 = 29`, and the timer would be stuck at 29.

Using `setTimer(prev => prev - 1)`, React always passes the **latest** value of `timer` as `prev`, regardless of when the interval callback runs. This is the correct pattern for any state update inside an interval or timeout.

### Why Clear Before Starting?

```typescript
if (timerRef.current) clearInterval(timerRef.current);
```

If the user clicks "Resend OTP" while a timer is already running (unlikely due to UI guards, but defensively), this prevents **multiple intervals** from stacking up and decrementing the timer at 2× or 3× speed.

---

## Why `useRef` for Inputs and Not `document.getElementById()`?

| Criteria              | `useRef`                            | `document.getElementById()`                 |
| --------------------- | ----------------------------------- | ------------------------------------------- |
| **React-aware?**      | ✅ Knows about React's render cycle | ❌ Bypasses React entirely                  |
| **Works in SSR?**     | ✅ Safe (ref is null until mount)   | ❌ `document` does not exist on server      |
| **Type-safe?**        | ✅ Full TypeScript generics         | ❌ Returns `Element \| null`, needs casting |
| **Dynamic elements?** | ✅ Callback ref with `.map()`       | ⚠️ Requires constructing IDs manually       |
| **Memory leaks?**     | ✅ React manages cleanup            | ⚠️ Manual cleanup needed                    |

In React, **always prefer `useRef`** over direct DOM queries. The framework manages the DOM — reaching around it with `getElementById` can lead to stale references, especially during re-renders.

---

## Why Store OTP as `string[]` Instead of a Single `string`?

```typescript
// ✅ What we use:
const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // ["", "", "", "", "", ""]

// ❌ Alternative (worse):
const [otp, setOtp] = useState(""); // ""
```

| Scenario                   | `string[]` Approach           | `string` Approach                             |
| -------------------------- | ----------------------------- | --------------------------------------------- |
| **Set digit at index 3**   | `newOtp[3] = "7"`             | `otp.slice(0,3) + "7" + otp.slice(4)` — messy |
| **Clear digit at index 3** | `newOtp[3] = ""`              | Complex string manipulation                   |
| **Read value of box 3**    | `otp[3]`                      | `otp[3]` (same)                               |
| **Check if all filled**    | `otp.join("").length === 6`   | `otp.length === 6`                            |
| **Handle paste**           | Iterate and assign to indices | Complex substring logic                       |

The array approach provides **direct index access**, making every operation simpler and more intuitive.

---

## State Management Summary Table

| State Variable | Type                            | Hook          | Why This Hook                                   | Triggers Re-render? |
| -------------- | ------------------------------- | ------------- | ----------------------------------------------- | ------------------- |
| `screen`       | `"phone" \| "otp" \| "success"` | `useState`    | Determines which screen to render               | ✅ Yes              |
| `phone`        | `string`                        | `useState`    | Displayed in input + shown on OTP screen        | ✅ Yes              |
| `otp`          | `string[]`                      | `useState`    | Each digit shown in its input box               | ✅ Yes              |
| `loading`      | `boolean`                       | `useState`    | Toggles button text to loading dots             | ✅ Yes              |
| `error`        | `string`                        | `useState`    | Conditionally renders error message             | ✅ Yes              |
| `timer`        | `number`                        | `useState`    | Countdown display updates every second          | ✅ Yes              |
| `shakeInputs`  | `boolean`                       | `useState`    | Adds/removes shake animation class              | ✅ Yes              |
| `inputRefs`    | `HTMLInputElement[]`            | `useRef`      | DOM access for `.focus()` — no visual change    | ❌ No               |
| `timerRef`     | `interval ID`                   | `useRef`      | Stored for `clearInterval()` — no visual change | ❌ No               |
| `startTimer`   | `function`                      | `useCallback` | Stable reference, called from multiple handlers | N/A                 |
| cleanup        | side-effect                     | `useEffect`   | Clears interval on component unmount            | N/A                 |

---

## Tech Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| React        | 19.2    | UI library with hooks           |
| TypeScript   | 5.9     | Static type safety              |
| Tailwind CSS | 4.2     | Utility-first styling           |
| Vite         | 7.3     | Development server & build tool |
| SWC          | —       | Fast TypeScript/JSX compilation |

---

## Getting Started

```bash
# Install dependencies
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`.
