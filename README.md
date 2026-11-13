# spendyFRD — Student Money Companion 🎓💰

A complete, production-grade, 100% browser-private Student Expense & Bank Statement Analyzer built using clean HTML5, CSS3, and modern Vanilla JavaScript (ES6+).

Designed specifically for college students to master their monthly allowance, hostel mess bills, daily canteen spends, and UPI micro-transactions without compromising financial privacy.

---

## 🌟 Key Highlights

- **🔒 100% Browser-Side Privacy**: All parsing, calculations, and data persistence happen locally using `localStorage` and PDF.js (v3.11.174). No backend server, no database, no financial data ever leaves your device.
- **📄 Dual Input Engine**:
  - **Statement Parser**: Drag-and-drop or file picker for `.pdf`, `.csv`, and `.txt` statements. Preserves multi-line spatial layout (Y-coordinate tolerance grouping) to parse PhonePe, GPay, Paytm, and traditional Indian bank statements.
  - **Cash Logger**: Instant manual logging for canteen cash, auto rides, snacks, or cash received. Auto-disables categories when recording credits.
- **🎲 Dynamic Sample Generator**: Test with 1-click realistic Indian college student transactions (Pocket Money, Campus Mess, Swiggy/Zomato, Airtel/Jio 5G, Rapido/Auto, Lab Xerox, Hackathon prize, Zudio, IRCTC Vande Bharat, Zepto/Blinkit).
- **💡 Smart Student Savings Advisor**:
  - Threshold-based overspending alerts (`Food & Mess > 35%`, `Shopping > 20%`, `Travel > 15%`, `Bills > 12%`, `Academics > 25%`, `Other > 15%`).
  - Calculates exact Potential Monthly Savings (`₹`) based on realistic cut rates.
  - Features the **80/20 Campus Rule** target card (set aside 20% of pocket allowance on Day 1).
- **📊 Visual Data Analytics (Chart.js & Lucide)**:
  - Interactive Spending Breakdown Donut Chart with center total amount display.
  - Click-to-filter category progress bars that sync with the transaction table.
  - Compact **Payment Mode Split** bar (Bank/UPI vs. Cash).
  - Visual **Savings Rate Meter** tracking health against the 20% campus savings goal.
- **⚡ Enhanced Transaction Log**:
  - Real-time search bar across descriptions, categories, and amounts.
  - Type filter pills: `All`, `Debits`, `Credits`, `Bank / UPI`, `Cash`.
  - Hover action icons with inline editing and delete with **Undo toast notification** (5-second undo grace period).
- **🌓 Fintech Theme & Design System**:
  - Deep Slate & Emerald Fintech Palette inspired by Linear, CRED, and Jupiter Money.
  - Seamless **Dark / Light Mode switcher** in the top navbar.
  - Typography: `Plus Jakarta Sans` with `tabular-nums` for crisp numeric alignment and `Inter` for UI body.
- **🌐 Multi-Language Support (i18n)**:
  - Full native localization supporting **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)** with persistent preference storage across visits.
- **📥 Session Completion & Exports**:
  - Download official student spending report as formatted **.pdf** with KPI blocks, category share table, itemized transaction logs, and student savings advice.
  - Optional backup export as UTF-8 BOM `.csv`.
  - Celebratory Animated Thank You modal with session statistics.
  - Session and transaction persistence per account (`spendyfrd_tx_<email>`) across page refreshes.

---

## 📁 File Structure

```
spendyFRD/
├── index.html         # Branded split-screen landing portal with interactive mockup & About Us modal
├── auth.css           # Styling for landing portal, instant tabs, modal, and responsive layouts
├── auth.js            # Authentication, session registry, password toggle, and guest demo logic
├── dashboard.html     # Main expense analyzer workspace with glassmorphic navbar & dual inputs
├── dashboard.css      # Design system with CSS variables (:root & [data-theme="light"]) and responsive grids
├── app.js             # Statement parser, Chart.js donut chart, cash log, savings advisor & PDF export
├── i18n.js            # Internationalization engine supporting English, Telugu, and Hindi
└── README.md          # Project documentation
```

---

## 🚀 Quick Start

1. Clone or download the repository:
   ```bash
   git clone https://github.com/badrinathsomisetti/spendyFRD.git
   cd spendyFRD
   ```

2. Open `index.html` in any modern web browser:
   - Double-click `index.html`, or
   - Serve locally with any static server:
     ```bash
     python3 -m http.server 8080
     ```
     Then navigate to `http://localhost:8080`.

3. Use **"Instant Guest Demo"** to explore the analyzer immediately, or create a student account.

---

## 👨‍💻 Developer Credit

- **Designed & Developed by**: Somisetti Nanda Kishore Gupta
- **Project**: spendyFRD (Student Money Companion)
- **License**: MIT
