/**
 * spendyFRD — Multi-Language Localization System (i18n.js)
 * High-performance, 100% browser-private internationalization supporting:
 * - English (en)
 * - Telugu (te - తెలుగు)
 * - Hindi (hi - हिन्दी)
 */

(function (window) {
  const TRANSLATIONS = {
    en: {
      appName: "spendyFRD",
      appTagline: "Student Money Companion",
      privacyBadge: "100% Client-Side Privacy · No Server Upload",
      aboutUs: "About Us",
      aboutTitle: "About spendyFRD",
      aboutLead: "spendyFRD is engineered specifically to help college students conquer their monthly allowance, hostel mess bills, UPI micro-transactions, and cash spends with complete clarity.",
      aboutPoint1Title: "Instant Statement & Cash Clarity",
      aboutPoint1Desc: "Drag and drop PhonePe, GPay, Paytm, or bank statements (PDF, CSV, TXT) and log pocket cash to compute real net profit or loss instantly.",
      aboutPoint2Title: "Smart Student Savings Advisor",
      aboutPoint2Desc: "Analyzes overspending on food delivery, late-night snacks, or quick-commerce and recommends achievable monthly savings using the 80/20 campus rule.",
      aboutPoint3Title: "100% Private & Browser-Native",
      aboutPoint3Desc: "All parsing, calculations, and data persistence happen strictly in your browser via local storage. Your financial data never touches an external server.",
      developerCreditLabel: "Developer",
      developerCreditText: "Designed & Developed by",

      // Landing / Auth strings
      headline: "Master your pocket money before the month ends.",
      subheadline: "Drop your bank PDF, UPI exports, or canteen cash spends. Get instant profit/loss clarity, categorized analytics, and smart advice on where to save.",
      mockupTitle: "Campus Allowance Tracker",
      mockupInflow: "Allowance Inflow",
      mockupOutflow: "Total Outflow",
      mockupSaved: "Net Saved",
      mockupTarget: "80/20 Campus Savings Target",
      mockupTargetSafe: "38% Saved (Safe)",
      pillPdf: "PDF, CSV & TXT Parser",
      pillDual: "Cash + UPI Dual Tracker",
      pillPrivacy: "100% Client-Side Privacy",

      tabSignIn: "Sign In",
      tabSignUp: "Create Account",
      welcomeBackTitle: "Welcome back, Friend 👋",
      welcomeBackSub: "Log in to check your profit, losses, and spending categories.",
      createAccountTitle: "Create your spendyFRD account",
      createAccountSub: "Track your monthly allowance, mess bills, and savings.",
      labelFullName: "Full Name",
      labelEmail: "College or Personal Email",
      labelPassword: "Password",
      btnShow: "Show",
      btnHide: "Hide",
      btnSignIn: "Sign In to spendyFRD",
      btnCreateAccount: "Create Free Account",
      testingPrompt: "Testing the app?",
      btnGuestDemo: "Instant Guest Demo",

      // Dashboard Strings
      hiGreeting: "Hi",
      logout: "Logout",
      dashTitle: "Student Expense & Statement Analyzer",
      dashSubtitle: "Upload your bank statement or log daily cash expenses to track spending and get savings tips.",
      step1Title: "Upload Bank / UPI Statement",
      step1Caption: "PhonePe, GPay, Paytm, SBI, HDFC, ICICI, etc.",
      dragDropPrimary: "Drag & drop your statement here",
      dragDropSecondary: "or browse files from your computer or phone",
      btnChooseFile: "Choose Statement File",
      noFileSelected: "No file selected",
      orTestInstantly: "or test instantly",
      btnSampleStatement: "Test with Sample Student Statement",

      step2Title: "Add Cash / Pocket Expense",
      step2Caption: "Canteen tea, auto fares, snacks, or gifts",
      cashBadge: "Cash Log",
      labelWhatFor: "What was this for?",
      phWhatFor: "e.g. Canteen Tea & Samosa, Auto, Xerox",
      labelAmount: "Amount (₹)",
      labelTxType: "Transaction Type",
      optDebit: "Cash Spent (-)",
      optCredit: "Cash Received (+)",
      labelCategory: "Category",
      btnAddCash: "Add Cash",

      // KPIs & Health
      kpiCreditTitle: "Total Credited (Gains)",
      kpiCreditSub: "Pocket money & prizes",
      kpiDebitTitle: "Total Debited (Spent)",
      kpiDebitSub: "Mess, bills & shopping",
      kpiBalanceTitle: "Net Financial Status",
      inProfitBy: "In Profit by",
      inLossBy: "In Loss by",
      breakEven: "Break-even (Balanced)",
      savingsRateTitle: "Student Savings Rate",
      savingsRateTarget: "Target: Save at least 20% of pocket allowance.",
      paymentSplitTitle: "Payment Mode Distribution",

      // Advisor
      advisorHeaderTitle: "Smart Student Savings Advisor",
      advisorHeaderSub: "Algorithmic spending tips to protect your month-end wallet",
      badgeBalanced: "Balanced",
      badgeGreatJob: "Great Job! Saving",
      badgeLowSavings: "Low Savings",
      badgeOverspent: "Overspent by",
      tagOverspending: "Overspending Alert",
      tagBalanced: "Balanced Campus Budget",
      tagTarget: "Student Savings Target",
      rule8020Title: "Follow the 80/20 Campus Rule",
      potentialSavingsLabel: "Potential Monthly Savings",
      targetReserveLabel: "Target Monthly Reserve",

      // Analytics
      spendingBreakdownTitle: "Spending Breakdown",
      spendingBreakdownCaption: "Click a category segment to filter transactions below",
      totalSpentCenter: "Total Spent",
      spendingByCategoryTitle: "Spending by Category",
      spendingByCategoryCaption: "Sorted from highest to lowest expenditure",
      btnExportPdf: "Export PDF",
      tipFilterHint: "Tip: Click any category to isolate transactions",

      // Transactions
      detectedTxTitle: "Detected & Logged Transactions",
      btnClearAll: "Clear All",
      phSearchTx: "Search narration, amount, category...",
      filterAll: "All",
      filterDebits: "Debits (-)",
      filterCredits: "Credits (+)",
      filterStatement: "Statement (UPI/Bank)",
      filterCash: "Cash Log",
      activeFilterLabel: "Active Filter:",
      thDescription: "Description / Narration",
      thCategory: "Category",
      thMode: "Payment Mode",
      thAmount: "Amount",
      thAction: "Action",
      emptyFilterTitle: "No transactions match your filter",
      emptyFilterDesc: "Try clearing your search query or selecting 'All'.",
      btnResetFilters: "Reset All Filters",

      // Bottom Bar & Modals
      workspaceReady: "Workspace Ready",
      btnDownloadReport: "Download Report (.pdf)",
      btnUseMeAgain: "Use Me Again",
      btnFinished: "Finished",
      celebrateTitle: "Session Complete!",
      celebrateLead: "Great job! Every rupee tracked today brings you closer to stress-free student finances.",
      cStatInflow: "Total Inflow",
      cStatSpent: "Total Spent",
      cStatNet: "Net Balance",
      btnDownloadPdfReport: "Download PDF Report",
      btnBackToPortal: "Back to Portal / Sign Out",
      btnContinueTracking: "Continue Tracking In Workspace",

      // Categories
      catFood: "Food & Mess",
      catTravel: "Travel & Commute",
      catAcademics: "Academics & Books",
      catBills: "Bills & Recharge",
      catShopping: "Shopping & Lifestyle",
      catIncome: "Income / Gain",
      catOther: "Other"
    },

    te: {
      appName: "spendyFRD",
      appTagline: "విద్యార్థుల ఖర్చుల సహచరుడు",
      privacyBadge: "100% బ్రౌజర్ ప్రైవసీ · సర్వర్ అప్‌లోడ్ లేదు",
      aboutUs: "మా గురించి",
      aboutTitle: "spendyFRD గురించి",
      aboutLead: "కళాశాల విద్యార్థులు తమ నెలవారీ పాకెట్ మనీ, హాస్టల్ మెస్ బిల్లులు, UPI మరియు నగదు ఖర్చులను స్పష్టంగా అర్థం చేసుకోవడానికి spendyFRD రూపొందించబడింది.",
      aboutPoint1Title: "స్టేట్‌మెంట్ & నగదు స్పష్టత",
      aboutPoint1Desc: "PhonePe, GPay, Paytm లేదా బ్యాంక్ స్టేట్‌మెంట్‌లను (PDF, CSV, TXT) అప్‌లోడ్ చేయండి మరియు లాభనష్టాలను తక్షణమే లెక్కించండి.",
      aboutPoint2Title: "స్మార్ట్ విద్యార్థి పొదుపు సలహాదారు",
      aboutPoint2Desc: "ఫుడ్ డెలివరీలు, అర్ధరాత్రి స్నాక్స్ ఖర్చులను విశ్లేషించి, 80/20 క్యాంపస్ నియమంతో నెలవారీ పొదుపులను సూచిస్తుంది.",
      aboutPoint3Title: "100% సురక్షితం & ప్రైవేట్",
      aboutPoint3Desc: "అన్ని విశ్లేషణలు నేరుగా మీ బ్రౌజర్‌లోనే జరుగుతాయి. మీ ఆర్థిక సమాచారం ఎప్పుడూ సర్వర్‌కు చేరదు.",
      developerCreditLabel: "డెవలపర్",
      developerCreditText: "రూపకల్పన & అభివృద్ధి చేసినవారు",

      // Landing / Auth strings
      headline: "నెల ముగిసేలోపే మీ పాకెట్ మనీపై పట్టు సాధించండి.",
      subheadline: "బ్యాంక్ PDF లేదా రోజువారీ క్యాంటీన్ ఖర్చులను నమోదు చేయండి. లాభనష్టాల లెక్కలు మరియు పొదుపు సూచనలను వెంటనే పొందండి.",
      mockupTitle: "క్యాంపస్ పాకెట్ మనీ ట్రాకర్",
      mockupInflow: "రాబడి (అలవెన్స్)",
      mockupOutflow: "మొత్తం ఖర్చు",
      mockupSaved: "నికర పొదుపు",
      mockupTarget: "80/20 క్యాంపస్ పొదుపు లక్ష్యం",
      mockupTargetSafe: "38% పొదుపు (సురక్షితం)",
      pillPdf: "PDF, CSV & TXT పార్సర్",
      pillDual: "నగదు + UPI డ్యూయల్ ట్రాకర్",
      pillPrivacy: "100% బ్రౌజర్ ప్రైవసీ",

      tabSignIn: "సైన్ ఇన్",
      tabSignUp: "ఖాతా తెరవండి",
      welcomeBackTitle: "మళ్ళీ స్వాగతం, మిత్రమా 👋",
      welcomeBackSub: "మీ లాభనష్టాలు మరియు ఖర్చులను చూసేందుకు లాగిన్ అవ్వండి.",
      createAccountTitle: "మీ spendyFRD ఖాతాను సృష్టించండి",
      createAccountSub: "మీ నెలవారీ అలవెన్స్, మెస్ బిల్లులు మరియు పొదుపులను ట్రాక్ చేయండి.",
      labelFullName: "పూర్తి పేరు",
      labelEmail: "కళాశాల లేదా వ్యక్తిగత ఈమెయిల్",
      labelPassword: "పాస్‌వర్డ్",
      btnShow: "చూపించు",
      btnHide: "దాచు",
      btnSignIn: "spendyFRD లోకి సైన్ ఇన్ అవ్వండి",
      btnCreateAccount: "ఉచిత ఖాతా తెరవండి",
      testingPrompt: "యాప్‌ని తనిఖీ చేస్తున్నారా?",
      btnGuestDemo: "తక్షణ గెస్ట్ డెమో",

      // Dashboard Strings
      hiGreeting: "నమస్కారం",
      logout: "లాగౌట్",
      dashTitle: "విద్యార్థుల ఖర్చులు & బ్యాంక్ స్టేట్‌మెంట్ ఎనలైజర్",
      dashSubtitle: "మీ బ్యాంక్ స్టేట్‌మెంట్‌ను అప్‌లోడ్ చేయండి లేదా రోజువారీ నగదు ఖర్చులను నమోదు చేయండి. మొత్తం విశ్లేషణ మీ బ్రౌజర్‌లోనే జరుగుతుంది.",
      step1Title: "బ్యాంక్ / UPI స్టేట్‌మెంట్ అప్‌లోడ్ చేయండి",
      step1Caption: "PhonePe, GPay, Paytm, SBI, HDFC మొదలైనవి",
      dragDropPrimary: "మీ స్టేట్‌మెంట్‌ను ఇక్కడ డ్రాగ్ & డ్రాప్ చేయండి",
      dragDropSecondary: "లేదా మీ ఫోన్ లేదా కంప్యూటర్ నుండి ఎంచుకోండి",
      btnChooseFile: "స్టేట్‌మెంట్ ఫైల్‌ను ఎంచుకోండి",
      noFileSelected: "ఎలాంటి ఫైల్ ఎంచుకోలేదు",
      orTestInstantly: "లేదా వెంటనే పరీక్షించండి",
      btnSampleStatement: "శాంపిల్ విద్యార్థి స్టేట్‌మెంట్‌తో పరీక్షించండి",

      step2Title: "నగదు / పాకెట్ ఖర్చు నమోదు చేయండి",
      step2Caption: "క్యాంటీన్ టీ, ఆటో చార్జీలు, స్నాక్స్ లేదా ప్రింట్లు",
      cashBadge: "నగదు లాగ్",
      labelWhatFor: "దేని కోసం ఖర్చు చేశారు?",
      phWhatFor: "ఉదా: క్యాంటీన్ టీ & సమోసా, ఆటో, జిరాక్స్",
      labelAmount: "మొత్తం (₹)",
      labelTxType: "లావాదేవీ రకం",
      optDebit: "నగదు ఖర్చు (-)",
      optCredit: "నగదు రాబడి (+)",
      labelCategory: "కేటగిరీ",
      btnAddCash: "నగదు జోడించండి",

      // KPIs & Health
      kpiCreditTitle: "మొత్తం జమ (రాబడి)",
      kpiCreditSub: "పాకెట్ మనీ & బహుమతులు",
      kpiDebitTitle: "మొత్తం ఖర్చు (వ్యయం)",
      kpiDebitSub: "మెస్, బిల్లులు & షాపింగ్",
      kpiBalanceTitle: "నికర ఆర్థిక స్థితి",
      inProfitBy: "లాభంలో ఉన్నారు",
      inLossBy: "నష్టంలో ఉన్నారు",
      breakEven: "సమతుల్యం (లాభం/నష్టం లేదు)",
      savingsRateTitle: "విద్యార్థి పొదుపు రేటు",
      savingsRateTarget: "లక్ష్యం: పాకెట్ మనీలో కనీసం 20% పొదుపు చేయండి.",
      paymentSplitTitle: "చెల్లింపు విధానం (UPI vs నగదు)",

      // Advisor
      advisorHeaderTitle: "స్మార్ట్ విద్యార్థి పొదుపు సలహాదారు",
      advisorHeaderSub: "నెల చివర్లో జేబు ఖాళీ కాకుండా ఆదా చేసే చిట్కాలు",
      badgeBalanced: "సమతుల్య బడ్జెట్",
      badgeGreatJob: "చాలా బాగుంది! పొదుపు",
      badgeLowSavings: "తక్కువ పొదుపు",
      badgeOverspent: "అధిక ఖర్చు",
      tagOverspending: "అధిక ఖర్చు హెచ్చరిక",
      tagBalanced: "సమతుల్య క్యాంపస్ బడ్జెట్",
      tagTarget: "విద్యార్థి పొదుపు లక్ష్యం",
      rule8020Title: "80/20 క్యాంపస్ నియమాన్ని పాటించండి",
      potentialSavingsLabel: "సంభావ్య నెలవారీ పొదుపు",
      targetReserveLabel: "లక్ష్య నెలవారీ రిజర్వ్",

      // Analytics
      spendingBreakdownTitle: "ఖర్చుల విభజన (విశ్లేషణ)",
      spendingBreakdownCaption: "లావాదేవీలను ఫిల్టర్ చేయడానికి కేటగిరీపై క్లిక్ చేయండి",
      totalSpentCenter: "మొత్తం ఖర్చు",
      spendingByCategoryTitle: "వర్గాల వారీగా ఖర్చులు",
      spendingByCategoryCaption: "అత్యధిక ఖర్చు నుండి అత్యల్ప ఖర్చు వరకు",
      btnExportPdf: "PDF ఎగుమతి చేయండి",
      tipFilterHint: "చిట్కా: లావాదేవీలను వేరు చేయడానికి కేటగిరీపై క్లిక్ చేయండి",

      // Transactions
      detectedTxTitle: "గుర్తించిన & నమోదు చేసిన లావాదేవీలు",
      btnClearAll: "అన్నీ తొలగించు",
      phSearchTx: "వివరణ, మొత్తం లేదా కేటగిరీని శోధించండి...",
      filterAll: "అన్నీ",
      filterDebits: "ఖర్చులు (-)",
      filterCredits: "జమలు (+)",
      filterStatement: "స్టేట్‌మెంట్ (UPI/బ్యాంక్)",
      filterCash: "నగదు లాగ్",
      activeFilterLabel: "సక్రియ ఫిల్టర్:",
      thDescription: "వివరణ / లావాదేవీ",
      thCategory: "కేటగిరీ",
      thMode: "చెల్లింపు విధానం",
      thAmount: "మొత్తం",
      thAction: "చర్య",
      emptyFilterTitle: "ఫిల్టర్‌కు సరిపోయే లావాదేవీలు లేవు",
      emptyFilterDesc: "శోధనను క్లియర్ చేయండి లేదా 'అన్నీ' ఎంచుకోండి.",
      btnResetFilters: "అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి",

      // Bottom Bar & Modals
      workspaceReady: "వర్క్‌స్పేస్ సిద్ధంగా ఉంది",
      btnDownloadReport: "రిపోర్ట్ డౌన్‌లోడ్ (.pdf)",
      btnUseMeAgain: "మళ్ళీ ప్రారంభించండి",
      btnFinished: "పూర్తయింది",
      celebrateTitle: "సెషన్ పూర్తయింది!",
      celebrateLead: "అభినందనలు! ప్రతి రూపాయి ట్రాక్ చేయడం ద్వారా మీరు ఒత్తిడి లేని ఆర్థిక క్రమశిక్షణను సాధిస్తున్నారు.",
      cStatInflow: "మొత్తం రాబడి",
      cStatSpent: "మొత్తం ఖర్చు",
      cStatNet: "నికర నిల్వ",
      btnDownloadPdfReport: "PDF రిపోర్ట్ డౌన్‌లోడ్",
      btnBackToPortal: "లాగిన్ పోర్టల్‌కు తిరిగి వెళ్ళండి",
      btnContinueTracking: "వర్క్‌స్పేస్‌లో కొనసాగండి",

      // Categories
      catFood: "ఆహారం & మెస్",
      catTravel: "ప్రయాణం & రాకపోకలు",
      catAcademics: "చదువు & పుస్తకాలు",
      catBills: "బిల్లులు & రీఛార్జ్",
      catShopping: "షాపింగ్ & జీవనశైలి",
      catIncome: "ఆదాయం / రాబడి",
      catOther: "ఇతర ఖర్చులు"
    },

    hi: {
      appName: "spendyFRD",
      appTagline: "छात्रों का वित्तीय साथी",
      privacyBadge: "100% ब्राउज़र गोपनीयता · कोई सर्वर अपलोड नहीं",
      aboutUs: "हमारे बारे में",
      aboutTitle: "spendyFRD के बारे में",
      aboutLead: "spendyFRD विशेष रूप से कॉलेज छात्रों के लिए मासिक पॉकेट मनी, मेस बिल, UPI और नकद खर्चों को स्पष्ट रूप से प्रबंधित करने के लिए बनाया गया है।",
      aboutPoint1Title: "स्टेटमेंट और नकद स्पष्टता",
      aboutPoint1Desc: "PhonePe, GPay, Paytm या बैंक स्टेटमेंट (PDF, CSV, TXT) अपलोड करें और तुरंत वास्तविक लाभ या हानि की गणना करें।",
      aboutPoint2Title: "स्मार्ट छात्र बचत सलाहकार",
      aboutPoint2Desc: "बाहर के खाने और ऑनलाइन खरीदारी के खर्चों का विश्लेषण करके 80/20 नियम से आसान बचत के उपाय सुझाता है।",
      aboutPoint3Title: "100% सुरक्षित और निजी",
      aboutPoint3Desc: "सभी गणनाएं सीधे आपके ब्राउज़र में होती हैं। आपका वित्तीय डेटा कभी भी किसी बाहरी सर्वर पर नहीं जाता।",
      developerCreditLabel: "डेवलपर",
      developerCreditText: "डिज़ाइन और विकसित किया गया",

      // Landing / Auth strings
      headline: "महीना खत्म होने से पहले अपने पॉकेट मनी को संभालें।",
      subheadline: "बैंक PDF या दैनिक कैंटीन खर्च दर्ज करें। तुरंत लाभ/हानि, श्रेणीबद्ध विश्लेषण और बचत के उपयोगी सुझाव पाएं।",
      mockupTitle: "कैंपस पॉकेट मनी ट्रैकर",
      mockupInflow: "कुल आय (पॉकेट मनी)",
      mockupOutflow: "कुल खर्च",
      mockupSaved: "शुद्ध बचत",
      mockupTarget: "80/20 कैंपस बचत लक्ष्य",
      mockupTargetSafe: "38% बचत (सुरक्षित)",
      pillPdf: "PDF, CSV और TXT पार्सर",
      pillDual: "कैश + UPI दोहरा ट्रैकर",
      pillPrivacy: "100% क्लाइंट-साइड गोपनीयता",

      tabSignIn: "साइन इन करें",
      tabSignUp: "खाता बनाएं",
      welcomeBackTitle: "वापसी पर स्वागत है, दोस्त 👋",
      welcomeBackSub: "अपने लाभ, हानि और खर्चों को देखने के लिए लॉगिन करें।",
      createAccountTitle: "अपना spendyFRD खाता बनाएं",
      createAccountSub: "अपनी मासिक पॉकेट मनी, मेस बिल और बचत को ट्रैक करें।",
      labelFullName: "पूरा नाम",
      labelEmail: "कॉलेज या व्यक्तिगत ईमेल",
      labelPassword: "पासवर्ड",
      btnShow: "दिखाएं",
      btnHide: "छुपाएं",
      btnSignIn: "spendyFRD में साइन इन करें",
      btnCreateAccount: "निःशुल्क खाता बनाएं",
      testingPrompt: "ऐप का परीक्षण कर रहे हैं?",
      btnGuestDemo: "त्वरित गेस्ट डेमो",

      // Dashboard Strings
      hiGreeting: "नमस्ते",
      logout: "लॉग आउट",
      dashTitle: "छात्र व्यय और बैंक स्टेटमेंट विश्लेषक",
      dashSubtitle: "अपना बैंक स्टेटमेंट अपलोड करें या दैनिक नकद खर्च दर्ज करें। संपूर्ण विश्लेषण आपके ब्राउज़र में निजी तौर पर होता है।",
      step1Title: "बैंक / UPI स्टेटमेंट अपलोड करें",
      step1Caption: "PhonePe, GPay, Paytm, SBI, HDFC, ICICI आदि",
      dragDropPrimary: "अपना स्टेटमेंट यहाँ खींचें और छोड़ें",
      dragDropSecondary: "या अपने कंप्यूटर/फ़ोन से फ़ाइल चुनें",
      btnChooseFile: "स्टेटमेंट फ़ाइल चुनें",
      noFileSelected: "कोई फ़ाइल नहीं चुनी गई",
      orTestInstantly: "या तुरंत परीक्षण करें",
      btnSampleStatement: "नमूना छात्र स्टेटमेंट से परीक्षण करें",

      step2Title: "नकद / दैनिक खर्च जोड़ें",
      step2Caption: "कैंटीन चाय, ऑटो किराया, स्नैक्स या ज़ेरॉक्स",
      cashBadge: "नकद लॉग",
      labelWhatFor: "यह किस काम के लिए था?",
      phWhatFor: "जैसे: कैंटीन चाय-समोसा, ऑटो, फोटोकॉपी",
      labelAmount: "राशि (₹)",
      labelTxType: "लेनदेन का प्रकार",
      optDebit: "नकद खर्च (-)",
      optCredit: "नकद प्राप्ति (+)",
      labelCategory: "श्रेणी",
      btnAddCash: "नकद जोड़ें",

      // KPIs & Health
      kpiCreditTitle: "कुल जमा (आमदनी)",
      kpiCreditSub: "पॉकेट मनी और पुरस्कार",
      kpiDebitTitle: "कुल खर्च (व्यय)",
      kpiDebitSub: "मेस, बिल और खरीदारी",
      kpiBalanceTitle: "शुद्ध वित्तीय स्थिति",
      inProfitBy: "मुनाफे में हैं",
      inLossBy: "घाटे में हैं",
      breakEven: "संतुलित (कोई लाभ/हानि नहीं)",
      savingsRateTitle: "छात्र बचत दर",
      savingsRateTarget: "लक्ष्य: पॉकेट मनी का कम से कम 20% बचाएं।",
      paymentSplitTitle: "भुगतान माध्यम (UPI बनाम नकद)",

      // Advisor
      advisorHeaderTitle: "स्मार्ट छात्र बचत सलाहकार",
      advisorHeaderSub: "महीने के अंत में बजट संतुलित रखने के व्यावहारिक टिप्स",
      badgeBalanced: "संतुलित बजट",
      badgeGreatJob: "शानदार! बचत",
      badgeLowSavings: "कम बचत",
      badgeOverspent: "अधिक खर्च",
      tagOverspending: "अधिक खर्च चेतावनी",
      tagBalanced: "संतुलित बजट",
      tagTarget: "छात्र बचत लक्ष्य",
      rule8020Title: "80/20 कैंपस नियम का पालन करें",
      potentialSavingsLabel: "संभावित मासिक बचत",
      targetReserveLabel: "लक्ष्य मासिक बचत राशि",

      // Analytics
      spendingBreakdownTitle: "खर्चों का विभाजन (विश्लेषण)",
      spendingBreakdownCaption: "लेनदेन फ़िल्टर करने के लिए श्रेणी पर क्लिक करें",
      totalSpentCenter: "कुल खर्च",
      spendingByCategoryTitle: "श्रेणी अनुसार खर्च",
      spendingByCategoryCaption: "अधिकतम से न्यूनतम खर्च के क्रम में",
      btnExportPdf: "PDF डाउनलोड करें",
      tipFilterHint: "टिप: किसी भी श्रेणी के लेनदेन देखने के लिए उस पर क्लिक करें",

      // Transactions
      detectedTxTitle: "पहचाने गए और दर्ज लेनदेन",
      btnClearAll: "सभी हटाएं",
      phSearchTx: "विवरण, राशि या श्रेणी खोजें...",
      filterAll: "सभी",
      filterDebits: "खर्च (-)",
      filterCredits: "जमा (+)",
      filterStatement: "स्टेटमेंट (UPI/बैंक)",
      filterCash: "नकद लॉग",
      activeFilterLabel: "सक्रिय फ़िल्टर:",
      thDescription: "विवरण / लेनदेन",
      thCategory: "श्रेणी",
      thMode: "भुगतान माध्यम",
      thAmount: "राशि",
      thAction: "कार्रवाई",
      emptyFilterTitle: "फ़िल्टर से मेल खाता कोई लेनदेन नहीं",
      emptyFilterDesc: "अपनी खोज साफ़ करें या 'सभी' चुनें।",
      btnResetFilters: "सभी फ़िल्टर रीसेट करें",

      // Bottom Bar & Modals
      workspaceReady: "वर्कस्पेस तैयार है",
      btnDownloadReport: "रिपोर्ट डाउनलोड करें (.pdf)",
      btnUseMeAgain: "दोबारा शुरू करें",
      btnFinished: "समाप्त",
      celebrateTitle: "सत्र पूरा हुआ!",
      celebrateLead: "बधाई! हर रुपये का हिसाब रखकर आप तनावमुक्त छात्र बचत की ओर बढ़ रहे हैं।",
      cStatInflow: "कुल आय",
      cStatSpent: "कुल खर्च",
      cStatNet: "शुद्ध शेष",
      btnDownloadPdfReport: "PDF रिपोर्ट डाउनलोड करें",
      btnBackToPortal: "लॉगिन पोर्टल पर वापस जाएं",
      btnContinueTracking: "वर्कस्पेस में जारी रखें",

      // Categories
      catFood: "भोजन और मेस",
      catTravel: "यात्रा और आवागमन",
      catAcademics: "शिक्षा और पुस्तकें",
      catBills: "बिल और रिचार्ज",
      catShopping: "खरीदारी और लाइफस्टाइल",
      catIncome: "आय / आमदनी",
      catOther: "अन्य खर्च"
    }
  };

  const STORAGE_LANG_KEY = "spendyfrd_lang";

  const i18n = {
    currentLang: localStorage.getItem(STORAGE_LANG_KEY) || "en",

    get(key, fallback = "") {
      const langMap = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      if (langMap && langMap[key] !== undefined) {
        return langMap[key];
      }
      return TRANSLATIONS.en[key] || fallback || key;
    },

    setLanguage(newLang) {
      if (!TRANSLATIONS[newLang]) newLang = "en";
      this.currentLang = newLang;
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
      document.documentElement.setAttribute("lang", newLang);
      this.applyToDOM();

      // Dispatch custom event so app.js can re-render dynamic charts/tables
      window.dispatchEvent(
        new CustomEvent("spendyfrd:langchange", { detail: { lang: newLang } })
      );
    },

    applyToDOM() {
      // 1. Text elements with data-i18n
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = this.get(key);
        if (val) {
          el.textContent = val;
        }
      });

      // 2. Input placeholders with data-i18n-placeholder
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const val = this.get(key);
        if (val) {
          el.setAttribute("placeholder", val);
        }
      });

      // 3. Elements with data-i18n-title
      document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        const val = this.get(key);
        if (val) {
          el.setAttribute("title", val);
        }
      });

      // Synchronize language dropdown selects
      document.querySelectorAll(".lang-select").forEach((select) => {
        if (select.value !== this.currentLang) {
          select.value = this.currentLang;
        }
      });
    },

    init() {
      document.documentElement.setAttribute("lang", this.currentLang);
      this.applyToDOM();

      // Bind all language select elements
      document.querySelectorAll(".lang-select").forEach((select) => {
        select.value = this.currentLang;
        select.addEventListener("change", (e) => {
          this.setLanguage(e.target.value);
        });
      });
    }
  };

  // Expose globally
  window.i18n = i18n;

  // Auto-init on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => i18n.init());
  } else {
    i18n.init();
  }
})(window);
