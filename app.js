/**
 * spendyFRD — Dashboard Analyzer Workspace Controller (app.js)
 * Production-grade ES6+ client-side statement parser, cash tracker,
 * Chart.js visualizer, and smart student savings advisor.
 */

// Configure PDF.js worker
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. SESSION & AUTH GUARD
  // --------------------------------------------------------------------------
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("spendyfrd_current_user"));
  } catch (err) {
    currentUser = null;
  }

  if (!currentUser || !currentUser.email) {
    window.location.replace("index.html");
    return;
  }

  // Update greeting and avatar
  const welcomeUserEl = document.getElementById("welcomeUser");
  const userAvatarEl = document.getElementById("userAvatar");
  const celebrateUserNameEl = document.getElementById("celebrateUserName");

  function updateGreeting() {
    const greeting = window.i18n ? window.i18n.get("hiGreeting") : "Hi";
    if (welcomeUserEl) welcomeUserEl.textContent = `${greeting}, ${currentUser.name}`;
    if (celebrateUserNameEl) celebrateUserNameEl.textContent = currentUser.name;
  }
  updateGreeting();

  if (userAvatarEl && currentUser.name) {
    const initials = currentUser.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    userAvatarEl.textContent = initials || "U";
  }

  // Category localization helper
  function getLocalizedCategory(category) {
    if (!window.i18n) return category;
    const map = {
      "Food & Mess": "catFood",
      "Travel & Commute": "catTravel",
      "Academics & Books": "catAcademics",
      "Bills & Recharge": "catBills",
      "Shopping & Lifestyle": "catShopping",
      "Income / Gain": "catIncome",
      "Other": "catOther"
    };
    const key = map[category];
    return key ? window.i18n.get(key) : category;
  }

  // Re-render when language changes
  window.addEventListener("spendyfrd:langchange", () => {
    updateGreeting();
    recalculateAndRender();
  });

  // Logout handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("spendyfrd_current_user");
      window.location.href = "index.html";
    });
  }

  // --------------------------------------------------------------------------
  // 2. THEME CONTROLLER (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("spendyfrd_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("spendyfrd_theme", nextTheme);
      if (donutChartInstance) {
        updateChartTheme();
      }
      showToast(`Switched to ${nextTheme === "light" ? "Light" : "Dark"} Mode`, "info");
    });
  }

  // --------------------------------------------------------------------------
  // 3. PERSISTENT STORAGE & CORE STATE
  // --------------------------------------------------------------------------
  const STORAGE_KEY = `spendyfrd_tx_${currentUser.email.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  
  // Load existing transactions (Persisted across refreshes!)
  let allTransactions = [];
  try {
    allTransactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (err) {
    allTransactions = [];
  }

  // Active filters and undo stack
  let activeSearchQuery = "";
  let activeTypeFilter = "all";
  let activeCategoryFilter = null;
  let recentlyDeleted = null;
  let donutChartInstance = null;

  // Keyword rules for automatic categorization
  const CATEGORY_RULES = {
    "Food & Mess": [
      "zomato", "swiggy", "mess", "canteen", "cafe", "tea", "coffee", "food",
      "restaurant", "bakery", "domino", "pizza", "burger", "biryani", "snack",
      "dhaba", "chutney", "maggi", "juice", "shawarma", "kfc", "mcdonald", "eats"
    ],
    "Travel & Commute": [
      "uber", "ola", "rapido", "irctc", "train", "bus", "auto", "metro",
      "flight", "indigo", "petrol", "fuel", "shuttle", "ticket", "redbus", "toll", "chalo"
    ],
    "Academics & Books": [
      "book", "stationery", "print", "xerox", "course", "udemy", "exam", "fee",
      "library", "notebook", "record", "lab", "college", "tuition", "coursera",
      "nptel", "pen", "paper", "binder", "university"
    ],
    "Bills & Recharge": [
      "jio", "airtel", "vi", "recharge", "wifi", "electricity", "bill",
      "netflix", "spotify", "subscription", "prime", "hotstar", "broadband",
      "dth", "water", "rent", "cylinder"
    ],
    "Shopping & Lifestyle": [
      "amazon", "flipkart", "myntra", "zudio", "store", "mall", "clothes",
      "mart", "blinkit", "zepto", "instamart", "decathlon", "ajio", "nykaa",
      "lenskart", "shoes", "fashion", "trends", "h&m", "reliancedigital"
    ]
  };

  const CATEGORY_COLORS = {
    "Food & Mess": "#f97316",         // Warm Orange
    "Travel & Commute": "#3b82f6",     // Electric Blue
    "Academics & Books": "#8b5cf6",    // Violet
    "Bills & Recharge": "#06b6d4",     // Cyan
    "Shopping & Lifestyle": "#ec4899", // Pink
    "Income / Gain": "#10b981",        // Emerald
    "Other": "#94a3b8"                 // Slate Gray
  };

  // --------------------------------------------------------------------------
  // 4. UI ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileName");
  const loadSampleBtn = document.getElementById("loadSampleBtn");
  const dropZone = document.getElementById("dropZone");

  const cashForm = document.getElementById("cashForm");
  const cashTypeSelect = document.getElementById("cashType");
  const cashCategorySelect = document.getElementById("cashCategory");

  const summarySection = document.getElementById("summarySection");
  const advisorSection = document.getElementById("advisorSection");
  const detailsSection = document.getElementById("detailsSection");
  const transactionsSection = document.getElementById("transactionsSection");
  const bottomActions = document.getElementById("bottomActions");

  const totalCreditEl = document.getElementById("totalCredit");
  const totalDebitEl = document.getElementById("totalDebit");
  const netBalanceEl = document.getElementById("netBalance");
  const balanceCard = document.getElementById("balanceCard");
  const balanceStatusEl = document.getElementById("balanceStatus");

  const savingsMeterFill = document.getElementById("savingsMeterFill");
  const savingsMeterBadge = document.getElementById("savingsMeterBadge");
  const savingsMeterCaption = document.getElementById("savingsMeterCaption");

  const splitBankFill = document.getElementById("splitBankFill");
  const splitCashFill = document.getElementById("splitCashFill");
  const bankSplitText = document.getElementById("bankSplitText");
  const cashSplitText = document.getElementById("cashSplitText");
  const splitBadge = document.getElementById("splitBadge");

  const chartCenterAmount = document.getElementById("chartCenterAmount");
  const categoryListEl = document.getElementById("categoryList");

  const txTableBody = document.getElementById("transactionTable");
  const txCountBadge = document.getElementById("txCountBadge");
  const txSearchInput = document.getElementById("txSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const emptyTxState = document.getElementById("emptyTxState");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const activeFilterBar = document.getElementById("activeFilterBar");
  const activeFilterName = document.getElementById("activeFilterName");
  const removeCategoryFilterBtn = document.getElementById("removeCategoryFilterBtn");

  const clearAllBtn = document.getElementById("clearAllBtn");
  const reuseBtn = document.getElementById("reuseBtn");
  const finishBtn = document.getElementById("finishBtn");
  const downloadCategoryBtn = document.getElementById("downloadCategoryBtn");
  const downloadCategoryBtnBottom = document.getElementById("downloadCategoryBtnBottom");

  // Celebrate Modal Elements
  const celebrateModal = document.getElementById("celebrateModal");
  const celebrateCloseBtn = document.getElementById("celebrateCloseBtn");
  const celebrateLogoutBtn = document.getElementById("celebrateLogoutBtn");
  const celebrateDownloadBtn = document.getElementById("celebrateDownloadBtn");
  const cStatCredit = document.getElementById("cStatCredit");
  const cStatDebit = document.getElementById("cStatDebit");
  const cStatBalance = document.getElementById("cStatBalance");

  // Edit Modal Elements
  const editTxModal = document.getElementById("editTxModal");
  const editTxForm = document.getElementById("editTxForm");
  const closeEditModalBtn = document.getElementById("closeEditModalBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const editTxIndex = document.getElementById("editTxIndex");
  const editDesc = document.getElementById("editDesc");
  const editAmount = document.getElementById("editAmount");
  const editType = document.getElementById("editType");
  const editCategory = document.getElementById("editCategory");

  // --------------------------------------------------------------------------
  // 5. DRAG & DROP AND FILE SELECTION
  // --------------------------------------------------------------------------
  if (dropZone && fileInput) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleIncomingFile(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleIncomingFile(e.target.files[0]);
      }
    });
  }

  async function handleIncomingFile(file) {
    if (!file) return;

    if (fileNameDisplay) {
      fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    showToast(`Parsing "${file.name}"...`, "info");

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const text = await extractTextFromPDF(file);
        if (!text || text.trim().length === 0) {
          showToast("PDF contains no selectable text or is image-only.", "warning");
          return;
        }
        processStatementText(text, file.name);
      } else {
        const text = await file.text();
        processStatementText(text, file.name);
      }
    } catch (err) {
      console.error("Statement parse failure:", err);
      showToast("Unable to read statement file. Ensure it is a valid PDF/CSV/TXT.", "error");
    }
  }

  // Multi-line spatial PDF layout extraction via PDF.js
  async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const rows = [];
      content.items.forEach((item) => {
        const text = item.str.trim();
        if (!text) return;
        const y = Math.round(item.transform[5]);
        const x = item.transform[4];

        let row = rows.find((r) => Math.abs(r.y - y) <= 4);
        if (!row) {
          row = { y, items: [] };
          rows.push(row);
        }
        row.items.push({ x, text });
      });

      rows.sort((a, b) => b.y - a.y);
      rows.forEach((row) => {
        row.items.sort((a, b) => a.x - b.x);
        fullText += row.items.map((it) => it.text).join("  ") + "\n";
      });
    }
    return fullText;
  }

  // Parse lines from uploaded file (PhonePe, Paytm, GPay & Indian Bank statements)
  function processStatementText(rawText, sourceFileName = "Statement") {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedBatch = [];

    for (let i = 0; i < lines.length; i++) {
      const cleanLine = lines[i];

      // Skip headers, footers, page numbers, and pure ID lines
      if (
        /^(date|txn|particulars|description|narration|opening balance|closing balance|total|statement|page \d+|transaction id|utr no|paid by|credited to|debited from)/i.test(
          cleanLine
        )
      ) {
        continue;
      }

      // Look ahead/behind 1 line to capture PhonePe context blocks
      const prevLine = i > 0 ? lines[i - 1] : "";
      const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
      const contextBlock = `${prevLine} ${cleanLine} ${nextLine}`;

      // Strip dates, timestamps, and 7+ digit transaction IDs before regex matching amounts
      const stripped = cleanLine
        .replace(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, " ")
        .replace(
          /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4}\b/gi,
          " "
        )
        .replace(
          /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{2,4}\b/gi,
          " "
        )
        .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?\b/gi, " ")
        .replace(/\b[A-Z0-9]*\d{7,}[A-Z0-9]*\b/gi, " ");

      // Match currency amounts (supports ₹340, ₹ 1,250.00, INR 500, plain 340.00)
      const currencyMatches = stripped.match(
        /(?:₹|rs\.?|inr)\s*\d[\d,]*(?:\.\d{1,2})?|\b\d{1,3}(?:,\d{2,3})+(?:\.\d{1,2})?\b|\b\d+(?:\.\d{1,2})\b|\b\d{2,6}\b/gi
      );
      if (!currencyMatches) continue;

      const parsedNums = currencyMatches
        .map((m) => parseFloat(m.replace(/[^\d.]/g, "")))
        .filter((n) => !isNaN(n) && n > 0 && n < 5000000);

      if (parsedNums.length === 0) continue;

      // PhonePe/UPI lines have 1 amount; traditional bank rows with trailing balance have 2+
      const hasRupeeSymbol = /(?:₹|rs\.?|inr)/i.test(stripped);
      const amount =
        !hasRupeeSymbol && parsedNums.length >= 2
          ? parsedNums[parsedNums.length - 2]
          : parsedNums[parsedNums.length - 1];

      if (!amount || amount <= 0) continue;

      // Check Debit vs Credit across the context block
      const isCredit =
        /\b(cr|credit|credited|received from|deposit|deposited|refund|salary|pocket money|prize|cashback|interest|upi\/cr)\b/i.test(
          contextBlock
        ) &&
        !/\b(dr|debit|debited|paid to|sent to|withdrawal|purchase)\b/i.test(
          cleanLine
        );

      const type = isCredit ? "Credit" : "Debit";

      // Build clean description
      let descText = cleanLine;
      if (/^(debit|credit|dr|cr|₹|rs\.?|inr|\d|\s|\.)+$/i.test(cleanLine)) {
        descText =
          prevLine && !/^(oct|nov|dec|jan|feb|mar|apr|may|jun|jul|aug|sep|\d{2}[\/\-])/i.test(prevLine)
            ? `${prevLine} (${cleanLine})`
            : `${nextLine} (${cleanLine})`;
      }

      const category = type === "Credit" ? "Income / Gain" : detectCategory(contextBlock);

      parsedBatch.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        description: descText.slice(0, 90),
        category,
        type,
        mode: "Statement",
        amount
      });
    }

    if (parsedBatch.length === 0) {
      showToast("No monetary transactions detected in statement.", "warning");
      return;
    }

    // Merge or replace
    allTransactions = parsedBatch;
    saveAndRender();
    showToast(`Successfully extracted ${parsedBatch.length} transactions from ${sourceFileName}!`, "success");
  }

  // Match text against keyword categories
  function detectCategory(text) {
    const lower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
      if (keywords.some((word) => lower.includes(word))) {
        return category;
      }
    }
    return "Other";
  }

  // --------------------------------------------------------------------------
  // 6. MANUAL CASH ENTRY
  // --------------------------------------------------------------------------
  if (cashTypeSelect && cashCategorySelect) {
    cashTypeSelect.addEventListener("change", () => {
      const isCredit = cashTypeSelect.value === "Credit";
      cashCategorySelect.disabled = isCredit;
      if (isCredit) {
        cashCategorySelect.value = "Income / Gain";
      } else if (cashCategorySelect.value === "Income / Gain") {
        cashCategorySelect.value = "Food & Mess";
      }
    });
  }

  if (cashForm) {
    cashForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const descInput = document.getElementById("cashDesc");
      const amountInput = document.getElementById("cashAmount");

      const description = descInput ? descInput.value.trim() : "";
      const amount = amountInput ? parseFloat(amountInput.value) : NaN;
      const type = cashTypeSelect ? cashTypeSelect.value : "Debit";
      const category = type === "Credit" ? "Income / Gain" : cashCategorySelect.value;

      if (!description || isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid description and amount.", "warning");
        return;
      }

      const newTx = {
        id: `cash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        description,
        category,
        type,
        mode: "Cash",
        amount
      };

      allTransactions.unshift(newTx);
      saveAndRender();

      cashForm.reset();
      if (cashCategorySelect) {
        cashCategorySelect.disabled = false;
        cashCategorySelect.value = "Food & Mess";
      }

      showToast(`Logged Cash: "${description}" (₹${amount.toFixed(2)})`, "success");
    });
  }

  // --------------------------------------------------------------------------
  // 7. DYNAMIC RANDOM SAMPLE GENERATOR
  // --------------------------------------------------------------------------
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener("click", () => {
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const sampleBatch = [
        {
          id: `sample_${Date.now()}_1`,
          description: `01/11/2026 ${pick(["Pocket Money from Parents", "Monthly College Allowance", "Scholarship Stipend Transfer"])}`,
          category: "Income / Gain",
          type: "Credit",
          mode: "Statement",
          amount: rand(7000, 13000)
        },
        {
          id: `sample_${Date.now()}_2`,
          description: `02/11/2026 ${pick(["Campus Mess & Canteen Meal", "Hostel Dining Food Card", "Monthly Mess Coupon Pass"])}`,
          category: "Food & Mess",
          type: "Debit",
          mode: "Statement",
          amount: rand(1100, 2100)
        },
        {
          id: `sample_${Date.now()}_3`,
          description: `04/11/2026 ${pick(["Swiggy Late Night Biryani", "Zomato Weekend Pizza Party", "Hostel Cafe Cold Coffee & Burger"])}`,
          category: "Food & Mess",
          type: "Debit",
          mode: "Statement",
          amount: rand(280, 780)
        },
        {
          id: `sample_${Date.now()}_4`,
          description: `06/11/2026 ${pick(["Airtel 5G 84-Day Student Pack", "Jio True 5G Unlimited Recharge", "Campus Wi-Fi Fiber Share"])}`,
          category: "Bills & Recharge",
          type: "Debit",
          mode: "Statement",
          amount: rand(239, 666)
        },
        {
          id: `sample_${Date.now()}_5`,
          description: `08/11/2026 ${pick(["Auto & Campus Shuttle", "Uber Ride to Railway Station", "Rapido Bike Taxi to College"])}`,
          category: "Travel & Commute",
          type: "Debit",
          mode: "Statement",
          amount: rand(90, 420)
        },
        {
          id: `sample_${Date.now()}_6`,
          description: `10/11/2026 ${pick(["Lab Record & Xerox Printout", "Engineering Mathematics Guide", "End-Sem Exam Registration Fee"])}`,
          category: "Academics & Books",
          type: "Debit",
          mode: "Statement",
          amount: rand(160, 650)
        },
        {
          id: `sample_${Date.now()}_7`,
          description: `12/11/2026 ${pick(["National Hackathon Cash Prize", "Freelance Web Coding Gig", "College Technical Quiz Reward"])}`,
          category: "Income / Gain",
          type: "Credit",
          mode: "Statement",
          amount: rand(800, 3500)
        },
        {
          id: `sample_${Date.now()}_8`,
          description: `14/11/2026 ${pick(["Zudio Campus Casuals", "Amazon Tech Accessories & Cable", "Myntra Sneakers Discount Sale"])}`,
          category: "Shopping & Lifestyle",
          type: "Debit",
          mode: "Statement",
          amount: rand(799, 2499)
        },
        {
          id: `sample_${Date.now()}_9`,
          description: `16/11/2026 ${pick(["IRCTC Vande Bharat Train Ticket", "Weekend Home KSRTC Bus Ticket", "City Metro Smart Card Recharge"])}`,
          category: "Travel & Commute",
          type: "Debit",
          mode: "Statement",
          amount: rand(320, 1450)
        },
        {
          id: `sample_${Date.now()}_10`,
          description: `18/11/2026 ${pick(["Zepto Midnight Study Snacks", "Blinkit Hosteler Groceries", "Campus Mart Milk & Biscuits"])}`,
          category: "Shopping & Lifestyle",
          type: "Debit",
          mode: "Statement",
          amount: rand(180, 620)
        },
        {
          id: `sample_${Date.now()}_11`,
          description: `20/11/2026 ${pick(["Canteen Tea & Chai Samosa", "Evening Maggi Point", "Fresh Fruit Juice Stall"])}`,
          category: "Food & Mess",
          type: "Debit",
          mode: "Cash",
          amount: rand(40, 160)
        }
      ];

      allTransactions = sampleBatch;
      if (fileNameDisplay) {
        fileNameDisplay.textContent = `Loaded: Sample_Student_Statement_${rand(10, 99)}.txt`;
      }

      saveAndRender();
      showToast("🎲 Generated dynamic realistic student statement!", "success");
    });
  }

  // --------------------------------------------------------------------------
  // 8. DATA COMPUTATION & RENDERING ENGINE
  // --------------------------------------------------------------------------
  function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTransactions));
    recalculateAndRender();
  }

  function recalculateAndRender() {
    if (allTransactions.length === 0) {
      if (summarySection) summarySection.classList.add("hidden");
      if (advisorSection) advisorSection.classList.add("hidden");
      if (detailsSection) detailsSection.classList.add("hidden");
      if (transactionsSection) transactionsSection.classList.add("hidden");
      if (bottomActions) bottomActions.classList.add("hidden");
      return;
    }

    if (summarySection) summarySection.classList.remove("hidden");
    if (advisorSection) advisorSection.classList.remove("hidden");
    if (detailsSection) detailsSection.classList.remove("hidden");
    if (transactionsSection) transactionsSection.classList.remove("hidden");
    if (bottomActions) bottomActions.classList.remove("hidden");

    let totalCredit = 0;
    let totalDebit = 0;
    let bankDebit = 0;
    let cashDebit = 0;
    const categoryTotals = {};

    allTransactions.forEach((tx) => {
      if (tx.type === "Credit") {
        totalCredit += tx.amount;
      } else {
        totalDebit += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;

        if (tx.mode === "Cash") {
          cashDebit += tx.amount;
        } else {
          bankDebit += tx.amount;
        }
      }
    });

    const net = totalCredit - totalDebit;

    // Animated Count-Up Numbers
    animateNumber(totalCreditEl, totalCredit, "₹");
    animateNumber(totalDebitEl, totalDebit, "₹");

    // Net Financial Status Card
    if (netBalanceEl && balanceCard && balanceStatusEl) {
      balanceCard.classList.remove("profit", "loss");
      balanceStatusEl.classList.remove("profit", "loss");

      if (net > 0) {
        animateNumber(netBalanceEl, net, "+₹");
        balanceCard.classList.add("profit");
        balanceStatusEl.classList.add("profit");
        const inProfit = window.i18n ? window.i18n.get("inProfitBy") : "In Profit by";
        balanceStatusEl.textContent = `${inProfit} ₹${net.toFixed(2)}`;
      } else if (net < 0) {
        animateNumber(netBalanceEl, Math.abs(net), "-₹");
        balanceCard.classList.add("loss");
        balanceStatusEl.classList.add("loss");
        const inLoss = window.i18n ? window.i18n.get("inLossBy") : "In Loss by";
        balanceStatusEl.textContent = `${inLoss} ₹${Math.abs(net).toFixed(2)}`;
      } else {
        netBalanceEl.textContent = "₹0.00";
        balanceStatusEl.textContent = window.i18n ? window.i18n.get("breakEven") : "Break-even (Balanced)";
      }
    }

    // Savings Rate Meter
    const savingsRate = totalCredit > 0 ? ((net / totalCredit) * 100) : 0;
    const clampedRate = Math.max(0, Math.min(100, savingsRate));

    if (savingsMeterFill) {
      savingsMeterFill.style.width = `${clampedRate}%`;
    }
    if (savingsMeterBadge) {
      savingsMeterBadge.textContent = `${savingsRate.toFixed(1)}% Saved`;
      savingsMeterBadge.className = `meter-badge ${savingsRate >= 20 ? "good" : "warn"}`;
    }
    if (savingsMeterCaption) {
      if (totalCredit === 0) {
        savingsMeterCaption.textContent = "No income recorded. Add pocket allowance to track savings.";
      } else if (savingsRate >= 20) {
        savingsMeterCaption.textContent = "Awesome! You are exceeding the 20% campus savings target.";
      } else if (savingsRate >= 0) {
        savingsMeterCaption.textContent = "Below target. Aim to set aside 20% on Day 1.";
      } else {
        savingsMeterCaption.textContent = `Overspent by ₹${Math.abs(net).toFixed(0)} beyond your allowance!`;
      }
    }

    // Payment Mode Distribution Split
    if (splitBankFill && splitCashFill && bankSplitText && cashSplitText) {
      const totalOut = bankDebit + cashDebit;
      const bankPct = totalOut > 0 ? (bankDebit / totalOut) * 100 : 80;
      const cashPct = totalOut > 0 ? (cashDebit / totalOut) * 100 : 20;

      splitBankFill.style.width = `${bankPct}%`;
      splitCashFill.style.width = `${cashPct}%`;

      bankSplitText.textContent = `Bank/UPI: ${bankPct.toFixed(0)}% (₹${bankDebit.toFixed(0)})`;
      cashSplitText.textContent = `Cash: ${cashPct.toFixed(0)}% (₹${cashDebit.toFixed(0)})`;
      if (splitBadge) {
        splitBadge.textContent = `${bankPct.toFixed(0)}% UPI · ${cashPct.toFixed(0)}% Cash`;
      }
    }

    // Update Visual Chart & Category Bars
    renderDonutChart(categoryTotals, totalDebit);
    renderCategoryBars(categoryTotals, totalDebit);

    // Update Smart Student Savings Advisor
    renderStudentAdvice(totalCredit, totalDebit, categoryTotals);

    // Update Filtered Table
    renderTransactionsTable();

    // Re-initialize Lucide Icons for freshly rendered HTML
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Smooth number easing animation
  function animateNumber(el, targetVal, prefix = "") {
    if (!el) return;
    const startVal = parseFloat(el.getAttribute("data-val") || "0");
    el.setAttribute("data-val", targetVal.toString());

    const duration = 650;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (targetVal - startVal) * ease;
      el.textContent = `${prefix}${current.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 9. VISUAL DATA ANALYTICS (CHART.JS DONUT + PROGRESS BARS)
  // --------------------------------------------------------------------------
  function renderDonutChart(categoryTotals, totalDebit) {
    const canvas = document.getElementById("categoryDonutChart");
    if (!canvas || !window.Chart) return;

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const localizedCategories = categories.map((c) => getLocalizedCategory(c));

    if (chartCenterAmount) {
      chartCenterAmount.textContent = `₹${totalDebit.toFixed(0)}`;
    }

    const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] || "#94a3b8");

    if (donutChartInstance) {
      donutChartInstance.destroy();
    }

    if (categories.length === 0 || totalDebit === 0) {
      // Empty placeholder
      donutChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["No Expenses"],
          datasets: [{ data: [1], backgroundColor: ["#334155"], borderWidth: 0 }]
        },
        options: {
          cutout: "75%",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { tooltip: { enabled: false } }
        }
      });
      return;
    }

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const borderColor = isLight ? "#ffffff" : "#111827";

    donutChartInstance = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: localizedCategories,
        datasets: [
          {
            data: amounts,
            backgroundColor: backgroundColors,
            borderColor: borderColor,
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      options: {
        cutout: "72%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isLight ? "#ffffff" : "#0f172a",
            titleColor: isLight ? "#0f172a" : "#f8fafc",
            bodyColor: isLight ? "#334155" : "#cbd5e1",
            borderColor: isLight ? "#e2e8f0" : "#334155",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const val = context.raw || 0;
                const pct = totalDebit > 0 ? ((val / totalDebit) * 100).toFixed(1) : "0";
                return ` ₹${val.toFixed(2)} (${pct}%)`;
              }
            }
          }
        },
        onClick: (evt, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const clickedCategory = categories[index];
            toggleCategoryFilter(clickedCategory);
          }
        }
      }
    });
  }

  function updateChartTheme() {
    if (!donutChartInstance) return;
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    donutChartInstance.data.datasets.forEach((dataset) => {
      dataset.borderColor = isLight ? "#ffffff" : "#111827";
    });
    donutChartInstance.update();
  }

  function renderCategoryBars(categoryTotals, totalDebit) {
    if (!categoryListEl) return;
    categoryListEl.innerHTML = "";

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      categoryListEl.innerHTML = `<p class="empty-desc">No debit expenses recorded yet.</p>`;
      return;
    }

    sorted.forEach(([category, amt]) => {
      const pct = totalDebit > 0 ? ((amt / totalDebit) * 100).toFixed(1) : 0;
      const color = CATEGORY_COLORS[category] || "#94a3b8";
      const isActive = activeCategoryFilter === category;
      const localizedName = getLocalizedCategory(category);

      const item = document.createElement("div");
      item.className = `category-item ${isActive ? "active-filter" : ""}`;
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.innerHTML = `
        <div class="cat-header">
          <div class="cat-title-wrap">
            <span class="cat-color-dot" style="background-color: ${color}"></span>
            <span>${localizedName}</span>
          </div>
          <div class="cat-amount-wrap">
            <span>₹${amt.toFixed(2)}</span>
            <span class="cat-pct">(${pct}%)</span>
          </div>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width: ${pct}%; background-color: ${color}"></div>
        </div>
      `;

      item.addEventListener("click", () => toggleCategoryFilter(category));
      categoryListEl.appendChild(item);
    });
  }

  function toggleCategoryFilter(category) {
    if (activeCategoryFilter === category) {
      activeCategoryFilter = null;
    } else {
      activeCategoryFilter = category;
    }
    updateActiveFilterUI();
    renderTransactionsTable();
    // Highlight category bar
    const bars = document.querySelectorAll(".category-item");
    bars.forEach((bar) => {
      const name = bar.querySelector(".cat-title-wrap span:last-child")?.textContent;
      if (name === activeCategoryFilter) {
        bar.classList.add("active-filter");
      } else {
        bar.classList.remove("active-filter");
      }
    });
  }

  function updateActiveFilterUI() {
    if (!activeFilterBar || !activeFilterName) return;
    if (activeCategoryFilter) {
      activeFilterBar.classList.remove("hidden");
      activeFilterName.textContent = activeCategoryFilter;
    } else {
      activeFilterBar.classList.add("hidden");
    }
  }

  if (removeCategoryFilterBtn) {
    removeCategoryFilterBtn.addEventListener("click", () => {
      activeCategoryFilter = null;
      updateActiveFilterUI();
      renderTransactionsTable();
      document.querySelectorAll(".category-item").forEach((b) => b.classList.remove("active-filter"));
    });
  }

  // --------------------------------------------------------------------------
  // 10. SMART STUDENT SAVINGS ADVISOR
  // --------------------------------------------------------------------------
  const STUDENT_RULES_I18N = {
    en: {
      "Food & Mess": {
        title: "Reduce Outside Food & Late-Night Delivery",
        tip: "Food delivery apps (Swiggy/Zomato) pile on delivery fees and surge packaging charges. Rely more on your campus mess or carry quick snacks to cut costs."
      },
      "Shopping & Lifestyle": {
        title: "Pause Impulse & Quick-Commerce Shopping",
        tip: "Frequent small orders on Zepto/Blinkit or fast-fashion splurges drain cash quickly. Use a strict 48-hour cool-off rule before buying non-essentials."
      },
      "Travel & Commute": {
        title: "Switch to Student Passes or Shared Rides",
        tip: "Solo autos and cabs drain student monthly budgets. Use campus shuttles, student bus/metro passes, or split cab fares with friends."
      },
      "Bills & Recharge": {
        title: "Audit Subscriptions & Recharge Plans",
        tip: "Cancel unneeded OTT/music subscriptions or switch to long-term 84-day student mobile data packs to lower recurring expenses."
      },
      "Academics & Books": {
        title: "Use College Library & Digital Copies First",
        tip: "Before buying brand-new textbooks or printing full PDFs, check your college library, borrow from seniors, or print double-sided."
      },
      "Other": {
        title: "Track Uncategorized Cash & UPI Transfers",
        tip: "A noticeable chunk of your money went into uncategorized payments. Add short descriptions to small daily UPI spends to spot hidden leaks."
      }
    },
    te: {
      "Food & Mess": {
        title: "బయటి ఆహారం & లేట్-నైట్ ఆర్డర్లను తగ్గించండి",
        tip: "Swiggy/Zomato వంటి ఫుడ్ యాప్‌లు డెలివరీ మరియు ప్యాకేజింగ్ ఛార్జీలను అదనంగా వసూలు చేస్తాయి. క్యాంపస్ మెస్‌ని ఎక్కువగా ఉపయోగించండి."
      },
      "Shopping & Lifestyle": {
        title: "ఆన్‌లైన్ షాపింగ్ & తక్షణ కొనుగోళ్లు ఆపండి",
        tip: "Zepto/Blinkit లో తరచుగా చిన్న ఆర్డర్లు మీ జేబును ఖాళీ చేస్తాయి. ఏదైనా కొనేముందు 48 గంటలు ఆలోచించండి."
      },
      "Travel & Commute": {
        title: "విద్యార్థి బస్ పాస్‌లు లేదా షేర్డ్ ప్రయాణాలు ఎంచుకోండి",
        tip: "ఒంటరిగా ఆటోలు, క్యాబ్‌లు తీసుకోవడం వల్ల బడ్జెట్ తరిగిపోతుంది. క్యాంపస్ బస్సులు లేదా స్నేహితులతో షేర్ చేసుకోండి."
      },
      "Bills & Recharge": {
        title: "అనవసర సబ్‌స్క్రిప్షన్‌లు & ప్లాన్‌లు సమీక్షించండి",
        tip: "ఉపయోగించని OTT/మ్యూజిక్ సబ్‌స్క్రిప్షన్‌లను రద్దు చేయండి మరియు 84-రోజుల విద్యార్థి మొబైల్ ప్లాన్‌లను ఎంచుకోండి."
      },
      "Academics & Books": {
        title: "లైబ్రరీ & డిజిటల్ పుస్తకాలను ఉపయోగించండి",
        tip: "కొత్త పుస్తకాలు లేదా ప్రింట్లు తీసుకునే ముందు కాలేజీ లైబ్రరీ లేదా సీనియర్ల దగ్గర తీసుకోవడానికి ప్రయత్నించండి."
      },
      "Other": {
        title: "చిన్న నగదు & UPI ఖర్చులను నమోదు చేయండి",
        tip: "లెక్కలేని చిన్న చిన్న ఖర్చులు బడ్జెట్‌ను దెబ్బతీస్తాయి. ప్రతి చెల్లింపుకూ చిన్న వివరణ రాసుకోండి."
      }
    },
    hi: {
      "Food & Mess": {
        title: "बाहर का खाना और देर रात डिलीवरी कम करें",
        tip: "Swiggy/Zomato जैसे ऐप्स पर डिलीवरी शुल्क बढ़ जाता है। कॉलेज मेस का अधिक उपयोग करें और स्नैक्स साथ रखें।"
      },
      "Shopping & Lifestyle": {
        title: "अनावश्यक ऑनलाइन खरीदारी पर रोक लगाएं",
        tip: "Zepto/Blinkit पर बार-बार ऑर्डर या कपड़ों पर खर्च तेजी से बजट बिगाड़ता है। गैर-जरूरी चीजों के लिए 48 घंटे का नियम अपनाएं।"
      },
      "Travel & Commute": {
        title: "छात्र पास या साझा सवारी का उपयोग करें",
        tip: "अकेले ऑटो या कैब लेना महंगा पड़ता है। कॉलेज बस, मेट्रो पास या दोस्तों के साथ राइड शेयर करें।"
      },
      "Bills & Recharge": {
        title: "सब्सक्रिप्शन और मोबाइल प्लान की समीक्षा करें",
        tip: "अप्रयुक्त OTT ऐप्स बंद करें और 84 दिनों वाले किफायती छात्र मोबाइल प्लान चुनें।"
      },
      "Academics & Books": {
        title: "लाइब्रेरी और डिजिटल पुस्तकों का उपयोग करें",
        tip: "नई किताबें खरीदने या भारी प्रिंटआउट लेने से पहले कॉलेज लाइब्रेरी या सीनियर्स से संपर्क करें।"
      },
      "Other": {
        title: "छोटे नकद और UPI खर्चों पर नजर रखें",
        tip: "अवर्गीकृत छोटे-छोटे खर्च जेब खाली कर देते हैं। हर भुगतान का संक्षिप्त विवरण दर्ज करें।"
      }
    }
  };

  const CUT_RATES = {
    "Food & Mess": { maxPercent: 35, cutRate: 0.25 },
    "Shopping & Lifestyle": { maxPercent: 20, cutRate: 0.30 },
    "Travel & Commute": { maxPercent: 15, cutRate: 0.20 },
    "Bills & Recharge": { maxPercent: 12, cutRate: 0.20 },
    "Academics & Books": { maxPercent: 25, cutRate: 0.15 },
    "Other": { maxPercent: 15, cutRate: 0.20 }
  };

  function renderStudentAdvice(credit, debit, categoryTotals) {
    const advisorTips = document.getElementById("advisorTips");
    const savingsBadge = document.getElementById("savingsBadge");
    if (!advisorTips || !savingsBadge) return;

    advisorTips.innerHTML = "";

    const currentLang = window.i18n ? window.i18n.currentLang : "en";
    const rulesForLang = STUDENT_RULES_I18N[currentLang] || STUDENT_RULES_I18N.en;

    // Overall savings evaluation
    const netSaved = credit - debit;
    const savingsRate = credit > 0 ? ((netSaved / credit) * 100) : 0;

    if (credit === 0) {
      savingsBadge.textContent = window.i18n ? window.i18n.get("badgeBalanced") : "Balanced";
      savingsBadge.className = "savings-badge good";
    } else if (netSaved < 0) {
      const overspentText = window.i18n ? window.i18n.get("badgeOverspent") : "Overspent by";
      savingsBadge.textContent = `${overspentText} ₹${Math.abs(netSaved).toFixed(0)}`;
      savingsBadge.className = "savings-badge warn";
    } else if (savingsRate >= 20) {
      const greatJob = window.i18n ? window.i18n.get("badgeGreatJob") : "Great Job! Saving";
      savingsBadge.textContent = `${greatJob} ${savingsRate.toFixed(1)}%`;
      savingsBadge.className = "savings-badge good";
    } else {
      const lowSavings = window.i18n ? window.i18n.get("badgeLowSavings") : "Low Savings";
      savingsBadge.textContent = `${lowSavings} (${savingsRate.toFixed(1)}%)`;
      savingsBadge.className = "savings-badge warn";
    }

    const tipCards = [];
    const overspendingTag = window.i18n ? window.i18n.get("tagOverspending") : "Overspending Alert";
    const potentialSaveTxt = window.i18n ? window.i18n.get("potentialSavingsLabel") : "Potential Monthly Savings";

    // Analyze each category for threshold breaches
    for (const [category, spent] of Object.entries(categoryTotals)) {
      if (debit <= 0) continue;
      const sharePercent = (spent / debit) * 100;
      const thresholdConfig = CUT_RATES[category];
      const localizedRule = rulesForLang[category] || STUDENT_RULES_I18N.en[category];

      if (thresholdConfig && sharePercent > thresholdConfig.maxPercent && localizedRule) {
        const potentialSavings = spent * thresholdConfig.cutRate;
        const localizedCatName = getLocalizedCategory(category);
        tipCards.push(`
          <div class="tip-card high-spend">
            <span class="tip-tag"><i data-lucide="alert-triangle"></i> ${overspendingTag}: ${localizedCatName} (${sharePercent.toFixed(0)}%)</span>
            <h4>${localizedRule.title}</h4>
            <p>${localizedRule.tip}</p>
            <div class="potential-save">
              <i data-lucide="piggy-bank"></i>
              <span>${potentialSaveTxt}: ~₹${potentialSavings.toFixed(0)}</span>
            </div>
          </div>
        `);
      }
    }

    // If budget is well-distributed, show celebration
    if (tipCards.length === 0 && debit > 0) {
      const topEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const topCat = topEntry ? topEntry[0] : "General";
      const topAmt = topEntry ? topEntry[1] : 0;
      const localizedTopCat = getLocalizedCategory(topCat);
      const balancedTag = window.i18n ? window.i18n.get("tagBalanced") : "Balanced Campus Budget";

      tipCards.push(`
        <div class="tip-card healthy">
          <span class="tip-tag"><i data-lucide="check-circle-2"></i> ${balancedTag}</span>
          <h4>${currentLang === "te" ? "మీ ఖర్చులు సమతుల్యంగా ఉన్నాయి!" : currentLang === "hi" ? "आपका बजट बहुत अच्छी तरह संतुलित है!" : "Your spending is well-distributed!"}</h4>
          <p>${currentLang === "te" ? `మీ అత్యధిక వ్యయం: <strong>${localizedTopCat}</strong> (₹${topAmt.toFixed(0)}). ఇదే క్రమశిక్షణను కొనసాగించండి.` : currentLang === "hi" ? `आपका सबसे अधिक खर्च: <strong>${localizedTopCat}</strong> (₹${topAmt.toFixed(0)}) है। यह अनुशासन बनाए रखें।` : `Your highest single category is <strong>${localizedTopCat}</strong> (₹${topAmt.toFixed(0)}). Continue this discipline.`}</p>
        </div>
      `);
    }

    // Always include the 80/20 Campus Rule target card
    if (credit > 0) {
      const targetSave = credit * 0.20;
      const targetTag = window.i18n ? window.i18n.get("tagTarget") : "Student Savings Target";
      const ruleTitle = window.i18n ? window.i18n.get("rule8020Title") : "Follow the 80/20 Campus Rule";
      const targetReserve = window.i18n ? window.i18n.get("targetReserveLabel") : "Target Monthly Reserve";

      tipCards.push(`
        <div class="tip-card target-card">
          <span class="tip-tag"><i data-lucide="target"></i> ${targetTag}</span>
          <h4>${ruleTitle}</h4>
          <p>${currentLang === "te" ? `మీ ₹${credit.toFixed(0)} నెలవారీ రాబడిలో, కనీసం <strong>₹${targetSave.toFixed(0)} (20%)</strong> ను ఖర్చు పెట్టకముందే వేరుగా దాచిపెట్టుకోండి.` : currentLang === "hi" ? `अपनी ₹${credit.toFixed(0)} की मासिक पॉकेट मनी में से तुरंत <strong>₹${targetSave.toFixed(0)} (20%)</strong> अलग बचत खाते में रखें।` : `Out of your ₹${credit.toFixed(0)} monthly allowance, immediately move <strong>₹${targetSave.toFixed(0)} (20%)</strong> into a separate savings account on Day 1 before spending.`}</p>
          <div class="potential-save">
            <i data-lucide="sparkles"></i>
            <span>${targetReserve}: ₹${targetSave.toFixed(0)}</span>
          </div>
        </div>
      `);
    }

    advisorTips.innerHTML = tipCards.join("");
  }

  // --------------------------------------------------------------------------
  // 11. TRANSACTIONS TABLE, LIVE SEARCH & ROW ACTIONS
  // --------------------------------------------------------------------------
  function renderTransactionsTable() {
    if (!txTableBody) return;
    txTableBody.innerHTML = "";

    // Filter transactions by search query, type, and category
    const filtered = allTransactions.filter((tx) => {
      // Type/Mode filter
      if (activeTypeFilter === "Debit" && tx.type !== "Debit") return false;
      if (activeTypeFilter === "Credit" && tx.type !== "Credit") return false;
      if (activeTypeFilter === "Cash" && tx.mode !== "Cash") return false;
      if (activeTypeFilter === "Statement" && tx.mode !== "Statement") return false;

      // Category filter
      if (activeCategoryFilter && tx.category !== activeCategoryFilter) return false;

      // Search query
      if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        const descMatch = tx.description.toLowerCase().includes(query);
        const catMatch = tx.category.toLowerCase().includes(query);
        const amtMatch = tx.amount.toString().includes(query);
        const modeMatch = tx.mode.toLowerCase().includes(query);
        if (!descMatch && !catMatch && !amtMatch && !modeMatch) return false;
      }

      return true;
    });

    if (txCountBadge) {
      txCountBadge.textContent = `${filtered.length} of ${allTransactions.length} entries`;
    }

    if (filtered.length === 0) {
      if (emptyTxState) emptyTxState.classList.remove("hidden");
      return;
    } else {
      if (emptyTxState) emptyTxState.classList.add("hidden");
    }

    filtered.forEach((tx) => {
      const tr = document.createElement("tr");
      const isCredit = tx.type === "Credit";
      const amountClass = isCredit ? "amount-credit" : "amount-debit";
      const sign = isCredit ? "+" : "-";
      const modeClass = tx.mode === "Cash" ? "mode-cash" : "mode-bank";
      const catColor = CATEGORY_COLORS[tx.category] || "#94a3b8";

      tr.innerHTML = `
        <td class="tx-desc-cell">${escapeHtml(tx.description)}</td>
        <td>
          <span class="cat-pill" style="border-left: 3px solid ${catColor}">
            ${escapeHtml(getLocalizedCategory(tx.category))}
          </span>
        </td>
        <td>
          <span class="mode-pill ${modeClass}">
            ${tx.mode === "Cash" ? "💵 Cash" : "🏦 Statement"}
          </span>
        </td>
        <td class="text-right ${amountClass}">
          ${sign}₹${tx.amount.toFixed(2)}
        </td>
        <td class="text-center">
          <div class="row-actions">
            <button type="button" class="row-action-btn edit-btn" title="Edit entry" aria-label="Edit transaction">
              <i data-lucide="edit-3"></i>
            </button>
            <button type="button" class="row-action-btn delete-btn" title="Delete entry" aria-label="Delete transaction">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      `;

      // Double-click row to delete with undo
      tr.addEventListener("dblclick", () => deleteTransaction(tx.id));

      // Action buttons
      const deleteBtn = tr.querySelector(".delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteTransaction(tx.id);
        });
      }

      const editBtn = tr.querySelector(".edit-btn");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditModal(tx.id);
        });
      }

      txTableBody.appendChild(tr);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function deleteTransaction(id) {
    const index = allTransactions.findIndex((t) => t.id === id);
    if (index === -1) return;

    recentlyDeleted = {
      tx: allTransactions[index],
      index: index
    };

    const removedDesc = allTransactions[index].description.slice(0, 24);
    allTransactions.splice(index, 1);
    saveAndRender();

    showToast(`Removed "${removedDesc}..."`, "warning", () => {
      // Undo callback
      if (recentlyDeleted) {
        allTransactions.splice(recentlyDeleted.index, 0, recentlyDeleted.tx);
        recentlyDeleted = null;
        saveAndRender();
        showToast("Restored transaction!", "success");
      }
    });
  }

  // Edit Modal Actions
  function openEditModal(id) {
    const tx = allTransactions.find((t) => t.id === id);
    if (!tx || !editTxModal) return;

    editTxIndex.value = id;
    editDesc.value = tx.description;
    editAmount.value = tx.amount;
    editType.value = tx.type;
    editCategory.value = tx.category;

    editTxModal.classList.add("active");
    editTxModal.setAttribute("aria-hidden", "false");
  }

  function closeEditModal() {
    if (!editTxModal) return;
    editTxModal.classList.remove("active");
    editTxModal.setAttribute("aria-hidden", "true");
  }

  if (closeEditModalBtn) closeEditModalBtn.addEventListener("click", closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModal);
  if (editTxModal) {
    editTxModal.addEventListener("click", (e) => {
      if (e.target === editTxModal) closeEditModal();
    });
  }

  if (editTxForm) {
    editTxForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = editTxIndex.value;
      const tx = allTransactions.find((t) => t.id === id);
      if (!tx) return;

      const newDesc = editDesc.value.trim();
      const newAmt = parseFloat(editAmount.value);
      const newType = editType.value;
      const newCat = editCategory.value;

      if (!newDesc || isNaN(newAmt) || newAmt <= 0) {
        showToast("Please provide valid transaction details.", "warning");
        return;
      }

      tx.description = newDesc;
      tx.amount = newAmt;
      tx.type = newType;
      tx.category = newCat;

      saveAndRender();
      closeEditModal();
      showToast("Updated transaction successfully!", "success");
    });
  }

  // Search input handler
  if (txSearchInput) {
    txSearchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.trim();
      if (clearSearchBtn) {
        if (activeSearchQuery) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
      renderTransactionsTable();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      txSearchInput.value = "";
      activeSearchQuery = "";
      clearSearchBtn.classList.add("hidden");
      renderTransactionsTable();
    });
  }

  // Type filter pills
  const filterPills = document.querySelectorAll(".filter-pill");
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeTypeFilter = pill.getAttribute("data-filter") || "all";
      renderTransactionsTable();
    });
  });

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      activeSearchQuery = "";
      activeTypeFilter = "all";
      activeCategoryFilter = null;
      if (txSearchInput) txSearchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
      filterPills.forEach((p) => {
        p.classList.toggle("active", p.getAttribute("data-filter") === "all");
      });
      updateActiveFilterUI();
      renderTransactionsTable();
    });
  }

  // --------------------------------------------------------------------------
  // 12. EXPORT AS COMPREHENSIVE PDF STATEMENT REPORT
  // --------------------------------------------------------------------------
  async function downloadPDFReport() {
    if (allTransactions.length === 0) {
      showToast("No transaction data available to export.", "warning");
      return;
    }

    showToast("📄 Generating your spendyFRD PDF Report...", "info");

    try {
      let totalCredit = 0;
      let totalDebit = 0;
      let bankDebit = 0;
      let cashDebit = 0;
      const categoryTotals = {};

      allTransactions.forEach((tx) => {
        if (tx.type === "Credit") {
          totalCredit += tx.amount;
        } else {
          totalDebit += tx.amount;
          categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
          if (tx.mode === "Cash") cashDebit += tx.amount;
          else bankDebit += tx.amount;
        }
      });

      const net = totalCredit - totalDebit;
      const savingsRate = totalCredit > 0 ? ((net / totalCredit) * 100).toFixed(1) : "0.0";
      const studentName = currentUser?.name || "Student";
      const studentEmail = currentUser?.email || "student@gmail.com";
      const dateStamp = new Date().toISOString().slice(0, 10);
      const generatedAt = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });

      // Check if jsPDF is available
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        console.warn("jsPDF not loaded, falling back to CSV export");
        downloadCategoryCSV();
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top Banner Header (Dark Navy)
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, pageWidth, 28, "F");

      // App Title & Rupee Icon
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("spendyFRD", 14, 13);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(52, 211, 153); // Emerald
      doc.text("Student Money Companion · Official Expense Report", 14, 20);

      // Date / Confidential Tag on Right
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate
      doc.text(`Generated: ${generatedAt}`, pageWidth - 14, 13, { align: "right" });
      doc.text("100% Browser-Private Analysis", pageWidth - 14, 20, { align: "right" });

      // Student Meta Info Block
      doc.setFillColor(248, 250, 252); // #F8FAFC
      doc.setDrawColor(226, 232, 240); // #E2E8F0
      doc.roundedRect(14, 33, pageWidth - 28, 22, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Student: ${studentName}`, 18, 41);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`Email: ${studentEmail}`, 18, 48);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`Total Transactions: ${allTransactions.length} entries`, pageWidth - 18, 41, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`Report Date: ${dateStamp}`, pageWidth - 18, 48, { align: "right" });

      // Financial Overview KPI Block (3 Boxes)
      const kpiY = 60;
      const kpiWidth = (pageWidth - 28 - 8) / 3;

      // Inflow Box
      doc.setFillColor(236, 253, 245); // Emerald-50
      doc.setDrawColor(167, 243, 208); // Emerald-200
      doc.roundedRect(14, kpiY, kpiWidth, 20, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text("TOTAL INFLOW (CREDIT)", 18, kpiY + 6);
      doc.setFontSize(12);
      doc.text(`Rs. ${totalCredit.toFixed(2)}`, 18, kpiY + 14);

      // Outflow Box
      doc.setFillColor(255, 241, 242); // Rose-50
      doc.setDrawColor(254, 205, 211); // Rose-200
      doc.roundedRect(14 + kpiWidth + 4, kpiY, kpiWidth, 20, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(225, 29, 72);
      doc.text("TOTAL OUTFLOW (DEBIT)", 18 + kpiWidth + 4, kpiY + 6);
      doc.setFontSize(12);
      doc.text(`Rs. ${totalDebit.toFixed(2)}`, 18 + kpiWidth + 4, kpiY + 14);

      // Net Balance Box
      const isProfit = net >= 0;
      doc.setFillColor(isProfit ? 236 : 255, isProfit ? 253 : 241, isProfit ? 245 : 242);
      doc.setDrawColor(isProfit ? 167 : 254, isProfit ? 243 : 205, isProfit ? 208 : 211);
      doc.roundedRect(14 + (kpiWidth + 4) * 2, kpiY, kpiWidth, 20, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(isProfit ? 5 : 225, isProfit ? 150 : 29, isProfit ? 105 : 72);
      doc.text(isProfit ? "NET PROFIT (SAVINGS)" : "NET LOSS (OVERSPENT)", 18 + (kpiWidth + 4) * 2, kpiY + 6);
      doc.setFontSize(12);
      doc.text(`${isProfit ? "+" : "-"}Rs. ${Math.abs(net).toFixed(2)}`, 18 + (kpiWidth + 4) * 2, kpiY + 14);

      // Secondary summary stats (Savings Rate & Mode split)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const totalOut = bankDebit + cashDebit;
      const bankPct = totalOut > 0 ? ((bankDebit / totalOut) * 100).toFixed(0) : "0";
      const cashPct = totalOut > 0 ? ((cashDebit / totalOut) * 100).toFixed(0) : "0";
      doc.text(
        `Campus Savings Rate: ${savingsRate}%  |  Payment Split: ${bankPct}% Bank/UPI  ·  ${cashPct}% Cash  |  80/20 Target Reserve: Rs. ${(totalCredit * 0.2).toFixed(2)}`,
        14,
        kpiY + 26
      );

      // Section 1: Spending by Category Table
      let currentY = kpiY + 32;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("1. Spending Breakdown by Category", 14, currentY);

      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const categoryRows = sortedCategories.map(([cat, amt]) => {
        const pct = totalDebit > 0 ? ((amt / totalDebit) * 100).toFixed(1) : "0.0";
        return [cat, `Rs. ${amt.toFixed(2)}`, `${pct}%`];
      });

      categoryRows.push(["Total Outflows (Debited)", `Rs. ${totalDebit.toFixed(2)}`, "100.0%"]);

      doc.autoTable({
        startY: currentY + 3,
        head: [["Category", "Amount Spent (INR)", "Share of Outflow"]],
        body: categoryRows,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235], // #2563EB
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5
        },
        styles: {
          fontSize: 8,
          cellPadding: 2.2,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 50, halign: "right" },
          2: { cellWidth: 42, halign: "right" }
        },
        margin: { left: 14, right: 14 },
        didParseCell: (data) => {
          if (data.row.index === categoryRows.length - 1) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [241, 245, 249];
          }
        }
      });

      // Section 2: Detailed Transactions Log
      currentY = doc.lastAutoTable.finalY + 8;
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("2. Itemized Transactions Log", 14, currentY);

      const txRows = allTransactions.map((tx) => {
        const sign = tx.type === "Credit" ? "+" : "-";
        return [
          tx.description.slice(0, 48),
          tx.category,
          tx.mode === "Cash" ? "Cash" : "Statement (UPI/Bank)",
          tx.type,
          `${sign}Rs. ${tx.amount.toFixed(2)}`
        ];
      });

      doc.autoTable({
        startY: currentY + 3,
        head: [["Description / Narration", "Category", "Mode", "Type", "Amount"]],
        body: txRows,
        theme: "striped",
        headStyles: {
          fillColor: [15, 23, 42], // #0F172A
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 38 },
          2: { cellWidth: 32 },
          3: { cellWidth: 18, halign: "center" },
          4: { cellWidth: 24, halign: "right" }
        },
        margin: { left: 14, right: 14 },
        didParseCell: (data) => {
          if (data.column.index === 4) {
            const val = data.cell.text[0] || "";
            if (val.startsWith("+")) {
              data.cell.styles.textColor = [5, 150, 105];
              data.cell.styles.fontStyle = "bold";
            } else {
              data.cell.styles.textColor = [225, 29, 72];
              data.cell.styles.fontStyle = "bold";
            }
          }
        }
      });

      // Page numbering & Footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // #94A3B8

        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

        doc.text(
          "spendyFRD · Designed & Developed by Somisetti Nanda Kishore Gupta · 100% Client-Side Privacy",
          14,
          pageHeight - 7
        );
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: "right" });
      }

      // Download PDF
      doc.save(`spendyFRD_Spending_Report_${dateStamp}.pdf`);
      showToast("✅ Downloaded spendyFRD Spending Report (.pdf)!", "success");
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Failed to generate PDF. Falling back to CSV export...", "error");
      downloadCategoryCSV();
    }
  }

  // Backup CSV Export
  function downloadCategoryCSV() {
    let totalCredit = 0;
    let totalDebit = 0;
    const categoryTotals = {};

    allTransactions.forEach((tx) => {
      if (tx.type === "Credit") {
        totalCredit += tx.amount;
      } else {
        totalDebit += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length === 0 && totalCredit === 0) {
      showToast("No data to export.", "warning");
      return;
    }

    const headers = ["Category", "Amount Spent (INR)", "Share (%)"];
    const rows = sortedCategories.map(([cat, amt]) => {
      const percent = totalDebit > 0 ? ((amt / totalDebit) * 100).toFixed(1) : "0.0";
      return [`"${cat.replace(/"/g, '""')}"`, amt.toFixed(2), `${percent}%`].join(",");
    });

    rows.push("");
    rows.push(["Total Credited (Gains)", totalCredit.toFixed(2), ""].join(","));
    rows.push(["Total Debited (Spent)", totalDebit.toFixed(2), ""].join(","));
    rows.push(["Net Balance", (totalCredit - totalDebit).toFixed(2), ""].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `spendyFRD_Spending_By_Category_${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("⬇️ Downloaded Spending by Category CSV!", "success");
  }

  // Bind Export Buttons to PDF Generator
  if (downloadCategoryBtn) downloadCategoryBtn.addEventListener("click", downloadPDFReport);
  if (downloadCategoryBtnBottom) downloadCategoryBtnBottom.addEventListener("click", downloadPDFReport);
  if (celebrateDownloadBtn) celebrateDownloadBtn.addEventListener("click", downloadPDFReport);

  // --------------------------------------------------------------------------
  // 13. SESSION ACTIONS: CLEAR ALL, USE ME AGAIN, & FINISHED MODAL
  // --------------------------------------------------------------------------
  function resetDashboardWorkspace() {
    allTransactions = [];
    localStorage.removeItem(STORAGE_KEY);
    activeSearchQuery = "";
    activeTypeFilter = "all";
    activeCategoryFilter = null;

    if (fileNameDisplay) fileNameDisplay.textContent = "No file selected";
    if (fileInput) fileInput.value = "";
    if (cashForm) cashForm.reset();

    recalculateAndRender();
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (allTransactions.length === 0) return;
      if (confirm("Are you sure you want to clear all loaded transactions?")) {
        resetDashboardWorkspace();
        showToast("Cleared all transactions.", "info");
      }
    });
  }

  if (reuseBtn) {
    reuseBtn.addEventListener("click", () => {
      resetDashboardWorkspace();
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Workspace refreshed for next statement!", "info");
    });
  }

  // Celebratory Finished Modal Flow
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      let credit = 0;
      let debit = 0;
      allTransactions.forEach((tx) => {
        if (tx.type === "Credit") credit += tx.amount;
        else debit += tx.amount;
      });

      const net = credit - debit;

      if (cStatCredit) cStatCredit.textContent = `₹${credit.toFixed(2)}`;
      if (cStatDebit) cStatDebit.textContent = `₹${debit.toFixed(2)}`;
      if (cStatBalance) {
        cStatBalance.textContent = `${net >= 0 ? "+" : "-"}₹${Math.abs(net).toFixed(2)}`;
        cStatBalance.className = `c-stat-val ${net >= 0 ? "profit" : "debit"}`;
      }

      if (celebrateModal) {
        celebrateModal.classList.add("active");
        celebrateModal.setAttribute("aria-hidden", "false");
      }
    });
  }

  if (celebrateCloseBtn) {
    celebrateCloseBtn.addEventListener("click", () => {
      if (celebrateModal) {
        celebrateModal.classList.remove("active");
        celebrateModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (celebrateLogoutBtn) {
    celebrateLogoutBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem("spendyfrd_current_user");
      } catch (err) {}
      window.location.href = "index.html";
    });
  }

  // --------------------------------------------------------------------------
  // 14. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  function showToast(message, type = "info", undoCallback = null) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconName = "info";
    if (type === "success") iconName = "check-circle-2";
    if (type === "error" || type === "warning") iconName = "alert-circle";

    toast.innerHTML = `
      <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    `;

    if (undoCallback) {
      const undoBtn = document.createElement("button");
      undoBtn.className = "toast-undo-btn";
      undoBtn.textContent = "Undo";
      undoBtn.addEventListener("click", () => {
        undoCallback();
        toast.remove();
      });
      toast.appendChild(undoBtn);
    }

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.add("toast-closing");
      setTimeout(() => toast.remove(), 250);
    }, undoCallback ? 5000 : 3200);
  }

  // HTML entity escaper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial calculation and render on page load
  recalculateAndRender();
});
