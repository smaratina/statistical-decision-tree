export type Lang = "en" | "el";

export const LANG_KEY = "sdt.lang";

export function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "el") return saved;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("el"))
    return "el";
  return "en";
}

type Dict = {
  // Brand / header / footer
  brandTagline: string;
  researchBeta: string;
  startNew: string;
  // Landing
  evidenceBadge: string;
  heroTitle1: string;
  heroTitleAccent: string;
  heroLede: string;
  startAssessment: string;
  viewExample: string;
  value1Title: string;
  value1Body: string;
  value2Title: string;
  value2Body: string;
  value3Title: string;
  value3Body: string;
  // Stepper labels
  steps: [string, string, string, string, string, string];
  // Nav
  back: string;
  continueLabel: string;
  generateReport: string;
  required: string;
  completeFields: string;
  stepOf: (n: number) => string;
  // Step 1
  s1Title: string;
  s1Sub: string;
  researchQuestionLabel: string;
  researchQuestionPlaceholder: string;
  qBad: string;
  primaryIntent: string;
  goalMissing: string;
  goals: Record<
    "compare" | "association" | "predict" | "mediation" | "moderation",
    { label: string; hint: string }
  >;
  // Step 2
  s2Title: string;
  s2Sub: string;
  studyDesign: string;
  measurementStructure: string;
  numberOfGroups: string;
  design: Record<"observational" | "experimental" | "quasi", string>;
  measurement: Record<"one" | "independent" | "paired", string>;
  groups: Record<"one" | "two" | "threeplus", string>;
  // Step 3
  s3Title: string;
  s3Sub: string;
  outcomeType: string;
  extraComponents: string;
  outcomes: Record<
    "continuous" | "binary" | "ordinal" | "nominal" | "count",
    { label: string; hint: string }
  >;
  extras: Record<"none" | "covariates" | "mediator" | "moderator", { label: string; hint: string }>;
  // Step 4
  s4Title: string;
  s4Sub: string;
  sampleSize: string;
  sampleSizeBad: string;
  assumptionStatus: string;
  assumps: Record<"unknown" | "met" | "violated", { label: string; hint: string }>;
  // Step 5
  s5Title: string;
  s5Sub: string;
  plannedAnalysis: string;
  plannedPlaceholder: string;
  plannedMissing: string;
  plannedOpts: Record<string, string>;
  privacyTitle: string;
  privacyBody: string;
  // Report
  decisionReport: string;
  analysisPlan: string;
  editAnswers: string;
  primaryRecommendation: string;
  fitLabel: string;
  fitStrong: string;
  fitConditional: string;
  whyItFits: string;
  alternativeAnalysis: string;
  whenToConsider: string;
  auditor: string;
  attention: string;
  noConflict: string;
  youPlanned: string;
  recommended: string;
  noPlan: string;
  assumptionsChecklist: string;
  assumptionsSub: string;
  statusMustCheck: string;
  statusSatisfied: string;
  statusNotSatisfied: string;
  statusUnknown: string;
  howToRun: string;
  copy: string;
  copied: string;
  disclaimer: string;
  // Report actions
  printPdf: string;
  copyFullReport: string;
  downloadAudit: string;
  copyReportSuccess: string;
  copyReportFail: string;
  auditDownloaded: string;
  reportHeadings: {
    question: string;
    primary: string;
    reasons: string;
    alternative: string;
    auditor: string;
    assumptions: string;
    spss: string;
    jamovi: string;
    r: string;
  };
  // Footer
  footerRight: string;
  // Language switcher
  langEn: string;
  langEl: string;
};

const en: Dict = {
  brandTagline: "Evidence-aware analysis guidance",
  researchBeta: "Research Beta",
  startNew: "Start New Assessment",
  evidenceBadge: "Evidence-aware statistical guidance",
  heroTitle1: "Turn your research question into a",
  heroTitleAccent: "defensible analysis plan.",
  heroLede:
    "Answer a short, adaptive interview. Get a primary method, alternatives, assumptions, and an audit of the analysis you planned to use.",
  startAssessment: "Start Assessment",
  viewExample: "View Example",
  value1Title: "Justified recommendations",
  value1Body:
    "Each recommended method comes with the reasoning that connects it to your design and outcome.",
  value2Title: "Assumption-aware alternatives",
  value2Body:
    "If a parametric assumption is violated, a robust alternative — and when to use it — is surfaced automatically.",
  value3Title: "Software-specific guidance",
  value3Body:
    "Menu paths for SPSS and Jamovi, runnable R code — so the plan is executable, not abstract.",
  steps: ["Research Goal", "Study Design", "Variables", "Sample", "Planned Test", "Decision"],
  back: "← Back",
  continueLabel: "Continue →",
  generateReport: "Generate Decision Report →",
  required: "Required",
  completeFields: "Please complete the required fields.",
  stepOf: (n) => `Step ${n} of 6`,
  s1Title: "What are you trying to find out?",
  s1Sub: "Describe your research question and the primary intent of your analysis.",
  researchQuestionLabel: "Research question",
  researchQuestionPlaceholder:
    "e.g. Does self-regulated learning mediate the relationship between achievement goals and social-emotional learning?",
  qBad: "Please describe your research question (at least a full sentence).",
  primaryIntent: "Primary intent",
  goalMissing: "Select the primary intent of your analysis.",
  goals: {
    compare: {
      label: "Compare groups",
      hint: "Test whether two or more groups differ on an outcome.",
    },
    association: {
      label: "Test an association",
      hint: "Assess the strength of a relationship between variables.",
    },
    predict: { label: "Predict an outcome", hint: "Model an outcome from one or more predictors." },
    mediation: {
      label: "Test mediation",
      hint: "Examine whether a variable transmits the effect of X on Y.",
    },
    moderation: {
      label: "Test moderation",
      hint: "Determine whether the X→Y effect depends on another variable.",
    },
  },
  s2Title: "How is the study designed?",
  s2Sub:
    "These structural facts drive whether parametric assumptions apply and which family of tests fits.",
  studyDesign: "Study design",
  measurementStructure: "Measurement structure",
  numberOfGroups: "Number of groups",
  design: {
    observational: "Observational / survey",
    experimental: "Experimental",
    quasi: "Quasi-experimental",
  },
  measurement: {
    one: "One measurement",
    independent: "Independent groups",
    paired: "Paired / pre–post",
  },
  groups: { one: "One", two: "Two", threeplus: "Three or more" },
  s3Title: "Describe the outcome and model.",
  s3Sub:
    "The measurement scale of your outcome is the strongest single determinant of the method family.",
  outcomeType: "Outcome variable type",
  extraComponents: "Additional model components",
  outcomes: {
    continuous: { label: "Continuous", hint: "Scores, times, scale means" },
    binary: { label: "Binary", hint: "Yes/No, success/failure" },
    ordinal: { label: "Ordinal", hint: "Ranked categories, Likert single items" },
    nominal: { label: "Nominal categorical", hint: "Unordered categories" },
    count: { label: "Count", hint: "Number of events, non-negative integers" },
  },
  extras: {
    none: { label: "None", hint: "No additional model components" },
    covariates: { label: "Covariates", hint: "Continuous variables to adjust for" },
    mediator: { label: "Mediator", hint: "Variable transmitting the X→Y effect" },
    moderator: { label: "Moderator", hint: "Variable altering the X→Y effect" },
  },
  s4Title: "What do you know about the data?",
  s4Sub:
    "An honest answer here matters more than an optimistic one. 'Unknown' is a valid response.",
  sampleSize: "Sample size (N)",
  sampleSizeBad: "Enter a positive number.",
  assumptionStatus: "Assumption status",
  assumps: {
    unknown: {
      label: "Not checked / unknown",
      hint: "Valid — the report will list what to check.",
    },
    met: { label: "Reasonably met", hint: "Diagnostics suggest assumptions hold." },
    violated: { label: "Violated", hint: "One or more parametric assumptions do not hold." },
  },
  s5Title: "What analysis were you planning to use?",
  s5Sub: "This lets the auditor compare your intended plan against the recommendation.",
  plannedAnalysis: "Planned analysis",
  plannedPlaceholder: "Select your planned analysis…",
  plannedMissing: "Select an option, or choose “Not sure”.",
  plannedOpts: {
    not_sure: "Not sure",
    ind_ttest: "Independent-samples t-test",
    paired_ttest: "Paired-samples t-test",
    anova: "ANOVA",
    ancova: "ANCOVA",
    pearson: "Pearson correlation",
    linear_reg: "Linear regression",
    logistic_reg: "Logistic regression",
    process4: "PROCESS Model 4 (mediation)",
    process1: "PROCESS Model 1 (moderation)",
  },
  privacyTitle: "Privacy by design",
  privacyBody:
    "This prototype asks about the structure of your study — not participant-level data. No raw data is uploaded, transmitted, or stored.",
  decisionReport: "Decision Report",
  analysisPlan: "Your analysis plan",
  editAnswers: "← Edit answers",
  primaryRecommendation: "Primary recommendation",
  fitLabel: "Recommendation fit",
  fitStrong: "Strong",
  fitConditional: "Conditional",
  whyItFits: "Why it fits",
  alternativeAnalysis: "Alternative analysis",
  whenToConsider: "When to consider:",
  auditor: "Statistical auditor",
  attention: "Attention",
  noConflict: "No conflict",
  youPlanned: "You planned",
  recommended: "Recommended",
  noPlan: "No specific plan",
  assumptionsChecklist: "Assumptions checklist",
  assumptionsSub: "Review each assumption before you report results.",
  statusMustCheck: "Must check",
  statusSatisfied: "Satisfied",
  statusNotSatisfied: "Not satisfied",
  statusUnknown: "Unknown",
  howToRun: "How to run it",
  copy: "Copy",
  copied: "Copied",
  disclaimer:
    "Educational decision support only. Final analytical choices should reflect disciplinary standards and expert judgment.",
  printPdf: "Print / Save as PDF",
  copyFullReport: "Copy Full Report",
  downloadAudit: "Download Audit Log",
  copyReportSuccess: "Full report copied to clipboard",
  copyReportFail: "Could not copy — please try again",
  auditDownloaded: "Audit log downloaded",
  reportHeadings: {
    question: "Research question",
    primary: "Primary recommendation",
    reasons: "Why it fits",
    alternative: "Alternative analysis",
    auditor: "Statistical auditor",
    assumptions: "Assumptions checklist",
    spss: "SPSS instructions",
    jamovi: "Jamovi instructions",
    r: "R code",
  },
  footerRight: "Educational decision support · Not a substitute for statistical expertise.",
  langEn: "EN",
  langEl: "ΕΛ",
};

const el: Dict = {
  brandTagline: "Στατιστική καθοδήγηση με τεκμηριωμένες αποφάσεις",
  researchBeta: "ΕΡΕΥΝΗΤΙΚΗ ΕΚΔΟΣΗ BETA",
  startNew: "Νέα αξιολόγηση",
  evidenceBadge: "Στατιστική καθοδήγηση με τεκμηριωμένες αποφάσεις",
  heroTitle1: "Μετατρέψτε το ερευνητικό σας ερώτημα σε ένα",
  heroTitleAccent: "τεκμηριωμένο σχέδιο στατιστικής ανάλυσης.",
  heroLede:
    "Απαντήστε σε μια σύντομη, προσαρμοστική συνέντευξη. Λάβετε μια κύρια μέθοδο, εναλλακτικές, προϋποθέσεις, και έλεγχο της ανάλυσης που σχεδιάζατε.",
  startAssessment: "Έναρξη αξιολόγησης",
  viewExample: "Προβολή παραδείγματος",
  value1Title: "Τεκμηριωμένες προτάσεις",
  value1Body:
    "Κάθε προτεινόμενη μέθοδος συνοδεύεται από τη συλλογιστική που τη συνδέει με τον σχεδιασμό και την έκβασή σας.",
  value2Title: "Εναλλακτικές με επίγνωση προϋποθέσεων",
  value2Body:
    "Όταν παραβιάζεται μια παραμετρική προϋπόθεση, αναδεικνύεται αυτόματα μια εύρωστη εναλλακτική — και πότε να τη χρησιμοποιήσετε.",
  value3Title: "Οδηγίες ανά λογισμικό",
  value3Body:
    "Διαδρομές μενού για SPSS και Jamovi, εκτελέσιμος κώδικας R — ώστε το σχέδιο να είναι εφαρμόσιμο, όχι αφηρημένο.",
  steps: [
    "Ερευνητικός στόχος",
    "Ερευνητικός σχεδιασμός",
    "Μεταβλητές",
    "Δείγμα",
    "Προγραμματισμένη ανάλυση",
    "Απόφαση",
  ],
  back: "← Πίσω",
  continueLabel: "Συνέχεια →",
  generateReport: "Δημιουργία αναφοράς απόφασης →",
  required: "Υποχρεωτικό",
  completeFields: "Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία.",
  stepOf: (n) => `Βήμα ${n} από 6`,
  s1Title: "Τι προσπαθείτε να διερευνήσετε;",
  s1Sub: "Περιγράψτε το ερευνητικό σας ερώτημα και τον κύριο σκοπό της ανάλυσής σας.",
  researchQuestionLabel: "Ερευνητικό ερώτημα",
  researchQuestionPlaceholder:
    "π.χ. Διαμεσολαβεί η αυτορρυθμιζόμενη μάθηση στη σχέση μεταξύ στόχων επίτευξης και κοινωνικο-συναισθηματικής μάθησης;",
  qBad: "Παρακαλώ περιγράψτε το ερευνητικό ερώτημα (τουλάχιστον μια πλήρη πρόταση).",
  primaryIntent: "Κύριος σκοπός",
  goalMissing: "Επιλέξτε τον κύριο σκοπό της ανάλυσής σας.",
  goals: {
    compare: {
      label: "Σύγκριση ομάδων",
      hint: "Έλεγχος αν δύο ή περισσότερες ομάδες διαφέρουν ως προς μια έκβαση.",
    },
    association: {
      label: "Έλεγχος συσχέτισης",
      hint: "Εκτίμηση της ισχύος της σχέσης μεταξύ μεταβλητών.",
    },
    predict: {
      label: "Πρόβλεψη έκβασης",
      hint: "Μοντελοποίηση μιας έκβασης από έναν ή περισσότερους προβλεπτικούς παράγοντες.",
    },
    mediation: {
      label: "Έλεγχος διαμεσολάβησης",
      hint: "Εξέταση αν μια μεταβλητή μεταφέρει την επίδραση του X στο Y.",
    },
    moderation: {
      label: "Έλεγχος ρύθμισης",
      hint: "Προσδιορισμός αν η επίδραση X→Y εξαρτάται από άλλη μεταβλητή.",
    },
  },
  s2Title: "Πώς σχεδιάζεται η μελέτη;",
  s2Sub:
    "Αυτά τα δομικά στοιχεία καθορίζουν αν ισχύουν παραμετρικές προϋποθέσεις και ποια οικογένεια ελέγχων ταιριάζει.",
  studyDesign: "Ερευνητικός σχεδιασμός",
  measurementStructure: "Δομή μετρήσεων",
  numberOfGroups: "Αριθμός ομάδων",
  design: {
    observational: "Παρατηρησιακή / έρευνα ερωτηματολογίου",
    experimental: "Πειραματική",
    quasi: "Ημι-πειραματική",
  },
  measurement: {
    one: "Μία μέτρηση",
    independent: "Ανεξάρτητες ομάδες",
    paired: "Εξαρτημένες / πριν–μετά",
  },
  groups: { one: "Μία", two: "Δύο", threeplus: "Τρεις ή περισσότερες" },
  s3Title: "Περιγράψτε την έκβαση και το μοντέλο.",
  s3Sub:
    "Η κλίμακα μέτρησης της έκβασης είναι ο ισχυρότερος μεμονωμένος καθοριστικός παράγοντας της οικογένειας μεθόδων.",
  outcomeType: "Τύπος μεταβλητής έκβασης",
  extraComponents: "Πρόσθετα στοιχεία μοντέλου",
  outcomes: {
    continuous: { label: "Συνεχής", hint: "Βαθμολογίες, χρόνοι, μέσοι όροι κλίμακας" },
    binary: { label: "Δυαδική", hint: "Ναι/Όχι, επιτυχία/αποτυχία" },
    ordinal: { label: "Διατακτική", hint: "Διαταγμένες κατηγορίες, μεμονωμένα στοιχεία Likert" },
    nominal: { label: "Ονομαστική κατηγορική", hint: "Μη διατεταγμένες κατηγορίες" },
    count: { label: "Καταμετρήσεις", hint: "Αριθμός συμβάντων, μη αρνητικοί ακέραιοι" },
  },
  extras: {
    none: { label: "Κανένα", hint: "Χωρίς πρόσθετα στοιχεία μοντέλου" },
    covariates: { label: "Συμμεταβλητές", hint: "Συνεχείς μεταβλητές προς έλεγχο" },
    mediator: { label: "Διαμεσολαβητής", hint: "Μεταβλητή που μεταφέρει την επίδραση X→Y" },
    moderator: { label: "Ρυθμιστής", hint: "Μεταβλητή που μεταβάλλει την επίδραση X→Y" },
  },
  s4Title: "Τι γνωρίζετε για τα δεδομένα;",
  s4Sub:
    "Μια ειλικρινής απάντηση εδώ μετράει περισσότερο από μια αισιόδοξη. Το «άγνωστο» είναι έγκυρη απάντηση.",
  sampleSize: "Μέγεθος δείγματος (N)",
  sampleSizeBad: "Εισαγάγετε θετικό αριθμό.",
  assumptionStatus: "Κατάσταση προϋποθέσεων",
  assumps: {
    unknown: {
      label: "Μη ελεγμένες / άγνωστες",
      hint: "Έγκυρο — η αναφορά θα καταγράψει τι πρέπει να ελεγχθεί.",
    },
    met: {
      label: "Ικανοποιητικά ικανοποιούνται",
      hint: "Τα διαγνωστικά υποδεικνύουν ότι οι προϋποθέσεις ισχύουν.",
    },
    violated: {
      label: "Παραβιάζονται",
      hint: "Μία ή περισσότερες παραμετρικές προϋποθέσεις δεν ισχύουν.",
    },
  },
  s5Title: "Ποια ανάλυση σχεδιάζατε να χρησιμοποιήσετε;",
  s5Sub: "Αυτό επιτρέπει στον στατιστικό έλεγχο να συγκρίνει το σχέδιό σας με την πρόταση.",
  plannedAnalysis: "Προγραμματισμένη ανάλυση",
  plannedPlaceholder: "Επιλέξτε την προγραμματισμένη ανάλυσή σας…",
  plannedMissing: "Επιλέξτε μια επιλογή ή διαλέξτε «Δεν είμαι σίγουρος/η».",
  plannedOpts: {
    not_sure: "Δεν είμαι σίγουρος/η",
    ind_ttest: "t-test ανεξάρτητων δειγμάτων",
    paired_ttest: "t-test εξαρτημένων δειγμάτων",
    anova: "Μονοπαραγοντική ANOVA",
    ancova: "Ανάλυση συνδιακύμανσης (ANCOVA)",
    pearson: "Συσχέτιση Pearson",
    linear_reg: "Γραμμική παλινδρόμηση",
    logistic_reg: "Λογιστική παλινδρόμηση",
    process4: "PROCESS Model 4 (διαμεσολάβηση)",
    process1: "PROCESS Model 1 (ρύθμιση)",
  },
  privacyTitle: "Ιδιωτικότητα εξ ορισμού",
  privacyBody:
    "Το πρωτότυπο ρωτά για τη δομή της μελέτης σας — όχι για δεδομένα σε επίπεδο συμμετέχοντα. Δεν μεταφορτώνονται, μεταδίδονται ή αποθηκεύονται πρωτογενή δεδομένα.",
  decisionReport: "Αναφορά απόφασης",
  analysisPlan: "Το σχέδιο ανάλυσής σας",
  editAnswers: "← Επεξεργασία απαντήσεων",
  primaryRecommendation: "Κύρια πρόταση",
  fitLabel: "Καταλληλότητα πρότασης",
  fitStrong: "Υψηλή",
  fitConditional: "Υπό προϋποθέσεις",
  whyItFits: "Γιατί είναι κατάλληλη",
  alternativeAnalysis: "Εναλλακτική ανάλυση",
  whenToConsider: "Πότε να τη σκεφτείτε:",
  auditor: "Στατιστικός έλεγχος",
  attention: "ΠΡΟΣΟΧΗ",
  noConflict: "Χωρίς σύγκρουση",
  youPlanned: "Επιλέξατε",
  recommended: "Προτείνεται",
  noPlan: "Χωρίς συγκεκριμένο σχέδιο",
  assumptionsChecklist: "Λίστα ελέγχου προϋποθέσεων",
  assumptionsSub: "Ελέγξτε κάθε προϋπόθεση πριν αναφέρετε αποτελέσματα.",
  statusMustCheck: "ΑΠΑΙΤΕΙΤΑΙ ΕΛΕΓΧΟΣ",
  statusSatisfied: "ΙΚΑΝΟΠΟΙΕΙΤΑΙ",
  statusNotSatisfied: "ΔΕΝ ΙΚΑΝΟΠΟΙΕΙΤΑΙ",
  statusUnknown: "ΑΓΝΩΣΤΟ",
  howToRun: "Πώς θα την εκτελέσετε",
  copy: "Αντιγραφή",
  copied: "Αντιγράφηκε",
  disclaimer:
    "Το εργαλείο παρέχει εκπαιδευτική υποστήριξη στη λήψη στατιστικών αποφάσεων. Οι τελικές αναλυτικές επιλογές πρέπει να λαμβάνουν υπόψη τα επιστημονικά πρότυπα κάθε γνωστικού πεδίου και την κρίση ειδικού.",
  printPdf: "Εκτύπωση / Αποθήκευση ως PDF",
  copyFullReport: "Αντιγραφή πλήρους αναφοράς",
  downloadAudit: "Λήψη αρχείου ελέγχου",
  copyReportSuccess: "Η πλήρης αναφορά αντιγράφηκε στο πρόχειρο",
  copyReportFail: "Δεν ήταν δυνατή η αντιγραφή — δοκιμάστε ξανά",
  auditDownloaded: "Το αρχείο ελέγχου κατέβηκε",
  reportHeadings: {
    question: "Ερευνητικό ερώτημα",
    primary: "Κύρια πρόταση",
    reasons: "Γιατί είναι κατάλληλη",
    alternative: "Εναλλακτική ανάλυση",
    auditor: "Στατιστικός έλεγχος",
    assumptions: "Λίστα ελέγχου προϋποθέσεων",
    spss: "Οδηγίες SPSS",
    jamovi: "Οδηγίες Jamovi",
    r: "Κώδικας R",
  },
  footerRight: "Εκπαιδευτική υποστήριξη αποφάσεων · Δεν υποκαθιστά τη στατιστική εμπειρογνωμοσύνη.",
  langEn: "EN",
  langEl: "ΕΛ",
};

export const dicts: Record<Lang, Dict> = { en, el };
export type Translations = Dict;
