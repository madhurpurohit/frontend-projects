# Introduction to Regular Expressions

Regular expressions are sequences of characters that define a search pattern. these patterns are widely used for string searching and manipulation. in validation, regex helps ensure that strings such as email addresses and passwords conform to expected formats.

## Basic Syntax

- **literals**: ordinary characters like 'a', '1', or '%'.

- **metacharacters**: characters with special meanings, like `.` (any character), `^ (caret)` (start of string), `$` (end of string), etc.

- **character classes**: sets of characters, like `[a-z]` for any lowercase letter.
- **character classes & shorthand**: In addition to specific character sets, regex includes several shorthand character classes that help match common character types:

### digit characters

- `\d`: matches any digit (0-9).
- `\D`: matches any non-digit.

### whitespace characters

- `\s`: matches any whitespace character (including spaces, tabs, and line breaks).
- `\S`: matches any non-whitespace character.

- `\w`: matches any word [ A-Z a-Z 0-9 _ ].
- `\W`: matches any non-word.

- **quantifiers**: specify how many times a character can occur, like `+` (one or more) or `*` (Zero or more times) or `{1,3}` (between one and three times).

- **escape characters**: use a backslash (`\`) to escape special characters and treat them like ordinary characters.
  **examples**:
- `\.`: matches a literal dot.
- `\$`: matches a dollar sign `$`.
- `\^`: matches a caret `^`.

---

### **1\. Non-Capturing Group `(?:...)`**

#### ✅ **Definition**:

A **non-capturing group** groups part of a regex pattern **without saving (capturing)** the matched text for backreferencing.

#### 📍 **When & Where Used**:

Use when you want to apply quantifiers or grouping **without capturing** the content — helps optimize regex and avoid unnecessary memory usage.

#### 🧪 **Examples**:

1.  Regex: `(?:cat|dog)s` matches `"cats"` or `"dogs"` (but doesn't capture "cat" or "dog").
2.  Regex: `\d{2}(?:-|\/)\d{2}` matches dates like `12-34` or `12/34` without capturing the dash or slash.

---

### **2\. Lookahead `(?=...)` (Positive Lookahead)**

#### ✅ **Definition**:

A **lookahead** checks if a pattern is followed by something, **without including** it in the match.

#### 📍 **When & Where Used**:

Use when you want to **assert a condition ahead**, but not consume it — useful in validations.

#### 🧪 **Examples**:

1.  Regex: `\d(?=px)` matches the digit **before** `"px"` in `"10px"`, but not `"10pt"`.
2.  Regex: `\w+(?=\s@\w+)` matches a word **before** `" @username"` like in `"Hello @john"` → matches `"Hello"`.

---

### **3\. Lookbehind `(?<=...)` (Positive Lookbehind)**

#### ✅ **Definition**:

A **lookbehind** checks if a pattern is **preceded by** something, **without including** it in the match.

#### 📍 **When & Where Used**:

Use when you want to match something **only if it's preceded** by a specific pattern — great for validation or conditional matches based on what comes before.

#### 🧪 **Examples**:

1.  Regex: `(?<=\$)\d+` matches digits **only if preceded by `$`**, like in `"Price is $100"` → matches `"100"`.
2.  Regex: `(?<=\bfrom\s)\w+` matches a word that comes **after "from "**, like in `"import x from module"` → matches `"module"`.

---

### **4\. Negative Lookahead `(?!...)`**

#### ✅ **Definition**:

Matches a pattern **only if it's **_not_** followed by** a certain pattern.

#### 📍 **When & Where Used**:

Use when you want to **exclude** matches that have specific content **after** them.

#### 🧪 **Examples**:

1.  Regex: `foo(?!bar)` matches `"foo"` **only if it's not followed by `"bar"`**, e.g., matches `"foobar123"` ❌, `"foobaz"` ✅.
2.  Regex: `\d{2}(?!px)` matches 2 digits **not followed by `"px"`**, so in `"12px"` → ❌, in `"12pt"` → ✅.

---

### **5\. Negative Lookbehind `(?<!...)`**

#### ✅ **Definition**:

Matches a pattern **only if it's **_not_** preceded by** a certain pattern.

#### 📍 **When & Where Used**:

Use when you want to **exclude** matches that have specific content **before** them.

#### 🧪 **Examples**:

1.  Regex: `(?<!\$)\d+` matches digits **not preceded by `$`**, so in `"Price is $100"` → ❌, `"Cost is 100"` → ✅.
2.  Regex: `(?<!abc)def` matches `"def"` **only if not preceded by `"abc"`**, so `"abcdef"` → ❌, `"xyzdef"` → ✅.

---
