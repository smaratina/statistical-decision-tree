import type { Lang } from "./i18n";

export type Goal = "compare" | "association" | "predict" | "mediation" | "moderation";
export type Design = "observational" | "experimental" | "quasi";
export type Measurement = "one" | "independent" | "paired";
export type Groups = "one" | "two" | "threeplus";
export type Outcome = "continuous" | "binary" | "ordinal" | "nominal" | "count";
export type ModelExtra = "none" | "covariates" | "mediator" | "moderator";
export type Assumptions = "unknown" | "met" | "violated";
export type Planned =
  | "not_sure"
  | "ind_ttest"
  | "paired_ttest"
  | "anova"
  | "ancova"
  | "pearson"
  | "linear_reg"
  | "logistic_reg"
  | "process4"
  | "process1";

export interface Answers {
  question: string;
  goal?: Goal;
  design?: Design;
  measurement?: Measurement;
  groups?: Groups;
  outcome?: Outcome;
  extra?: ModelExtra;
  sampleSize?: number;
  assumptions?: Assumptions;
  planned?: Planned;
}

export interface Assumption {
  name: string;
  status: "must-check" | "satisfied" | "not-satisfied" | "unknown";
  note: string;
}

export interface Recommendation {
  method: string;
  fit: "Strong" | "Conditional";
  summary: string;
  reasons: string[];
  alternative: { method: string; when: string };
  audit: { warn: boolean; text: string };
  assumptions: Assumption[];
  code: { spss: string[]; jamovi: string[]; r: string };
}

// Localized method-name lookup used across recommendations.
const M = {
  ind_ttest: { en: "Independent-samples t-test", el: "t-test ανεξάρτητων δειγμάτων" },
  paired_ttest: { en: "Paired-samples t-test", el: "t-test εξαρτημένων δειγμάτων" },
  anova: { en: "One-way ANOVA", el: "Μονοπαραγοντική ανάλυση διακύμανσης (One-way ANOVA)" },
  ancova: { en: "ANCOVA (analysis of covariance)", el: "Ανάλυση συνδιακύμανσης (ANCOVA)" },
  mann_whitney: { en: "Mann–Whitney U test", el: "Έλεγχος U των Mann–Whitney" },
  wilcoxon: { en: "Wilcoxon signed-rank test", el: "Έλεγχος προσημασμένων τάξεων Wilcoxon" },
  kruskal: { en: "Kruskal–Wallis test", el: "Έλεγχος Kruskal–Wallis" },
  pearson: { en: "Pearson correlation", el: "Συσχέτιση Pearson" },
  spearman: { en: "Spearman rank correlation", el: "Συσχέτιση Spearman" },
  kendall: { en: "Kendall's tau", el: "Συντελεστής tau του Kendall" },
  chisq: { en: "Chi-square test of independence", el: "Έλεγχος χ² ανεξαρτησίας" },
  fisher: { en: "Fisher's exact test", el: "Ακριβής έλεγχος του Fisher" },
  linear_reg: { en: "Multiple linear regression", el: "Πολλαπλή γραμμική παλινδρόμηση" },
  logistic_reg: { en: "Binary logistic regression", el: "Δυαδική λογιστική παλινδρόμηση" },
  probit: { en: "Probit regression", el: "Παλινδρόμηση probit" },
  mediation: {
    en: "Bootstrap mediation analysis (PROCESS Model 4)",
    el: "Ανάλυση διαμεσολάβησης με bootstrap (PROCESS Model 4)",
  },
  sem: { en: "Structural Equation Modeling (SEM)", el: "Μοντελοποίηση Δομικών Εξισώσεων (SEM)" },
  moderation: {
    en: "Moderated regression (PROCESS Model 1)",
    el: "Ανάλυση ρύθμισης με παλινδρόμηση (PROCESS Model 1)",
  },
  two_way_anova: {
    en: "Two-way ANOVA (categorical moderator)",
    el: "Διπαραγοντική ANOVA (κατηγορικός ρυθμιστής)",
  },
  welch_anova: {
    en: "Welch's ANOVA + Games–Howell post-hoc",
    el: "ANOVA του Welch + post-hoc Games–Howell",
  },
  ridge: {
    en: "Regularized regression (ridge / lasso)",
    el: "Παλινδρόμηση με κανονικοποίηση (ridge / lasso)",
  },
  change_score: {
    en: "Change-score t-test or repeated-measures ANOVA",
    el: "t-test διαφορικής βαθμολογίας ή ANOVA επαναλαμβανόμενων μετρήσεων",
  },
  paired_boot: {
    en: "Paired t-test with bootstrap CIs",
    el: "t-test εξαρτημένων δειγμάτων με διαστήματα εμπιστοσύνης bootstrap",
  },
  welch_boot: {
    en: "Welch's t-test with bootstrap CIs",
    el: "t-test του Welch με διαστήματα εμπιστοσύνης bootstrap",
  },
  meet_statistician: { en: "Meet with a statistician", el: "Συνάντηση με στατιστικό" },
  descriptive: {
    en: "Descriptive summary and consultation",
    el: "Περιγραφική σύνοψη και διαβούλευση",
  },
} as const;

const plannedLabel: Record<Lang, Record<Planned, string>> = {
  en: {
    not_sure: "no specific plan",
    ind_ttest: "independent-samples t-test",
    paired_ttest: "paired-samples t-test",
    anova: "one-way ANOVA",
    ancova: "ANCOVA",
    pearson: "Pearson correlation",
    linear_reg: "linear regression",
    logistic_reg: "logistic regression",
    process4: "PROCESS Model 4",
    process1: "PROCESS Model 1",
  },
  el: {
    not_sure: "χωρίς συγκεκριμένο σχέδιο",
    ind_ttest: "t-test ανεξάρτητων δειγμάτων",
    paired_ttest: "t-test εξαρτημένων δειγμάτων",
    anova: "μονοπαραγοντική ANOVA",
    ancova: "ANCOVA",
    pearson: "συσχέτιση Pearson",
    linear_reg: "γραμμική παλινδρόμηση",
    logistic_reg: "λογιστική παλινδρόμηση",
    process4: "PROCESS Model 4",
    process1: "PROCESS Model 1",
  },
};

// Common shared strings
const S = {
  independence: {
    name: { en: "Independence of observations", el: "Ανεξαρτησία παρατηρήσεων" },
    note: {
      en: "Each observation should be independent of the others.",
      el: "Κάθε παρατήρηση πρέπει να είναι ανεξάρτητη από τις υπόλοιπες.",
    },
  },
  linearity: {
    name: { en: "Linearity", el: "Γραμμικότητα" },
    note: {
      en: "Relationship between predictors and outcome is linear.",
      el: "Η σχέση μεταξύ προβλεπτών και έκβασης είναι γραμμική.",
    },
  },
  normResid: {
    name: { en: "Normality of residuals", el: "Κανονικότητα καταλοίπων" },
    note: {
      en: "Residuals approximately normally distributed.",
      el: "Τα κατάλοιπα ακολουθούν κατά προσέγγιση κανονική κατανομή.",
    },
  },
  homosced: {
    name: { en: "Homoscedasticity", el: "Ομοσκεδαστικότητα" },
    note: {
      en: "Constant variance of residuals across predictor levels.",
      el: "Σταθερή διακύμανση καταλοίπων στα επίπεδα των προβλεπτών.",
    },
  },
  multi: {
    name: { en: "Multicollinearity", el: "Πολυσυγγραμμικότητα" },
    note: { en: "VIF below 5 for each predictor.", el: "VIF < 5 για κάθε προβλέπτη." },
  },
  outliers: {
    name: { en: "Influential outliers", el: "Επιδραστικές ακραίες τιμές" },
    note: { en: "Check Cook's distance and leverage.", el: "Έλεγχος απόστασης Cook και μοχλού." },
  },
  slopes: {
    name: { en: "Homogeneity of regression slopes", el: "Ομοιογένεια κλίσεων παλινδρόμησης" },
    note: {
      en: "Covariate × group interaction should be non-significant.",
      el: "Η αλληλεπίδραση συμμεταβλητής × ομάδας πρέπει να είναι μη σημαντική.",
    },
  },
  normWithin: {
    name: { en: "Normality of residuals", el: "Κανονικότητα καταλοίπων" },
    note: { en: "Within-group normality.", el: "Κανονικότητα εντός ομάδων." },
  },
  equalVar: {
    name: { en: "Homoscedasticity", el: "Ομοσκεδαστικότητα" },
    note: {
      en: "Equal variances across groups (Levene's test).",
      el: "Ίσες διακυμάνσεις μεταξύ ομάδων (έλεγχος Levene).",
    },
  },
  outliersBox: {
    name: { en: "Influential outliers", el: "Επιδραστικές ακραίες τιμές" },
    note: { en: "Inspect boxplots per group.", el: "Έλεγχος θηκογραμμάτων ανά ομάδα." },
  },
  normTT: {
    name: { en: "Normality of residuals", el: "Κανονικότητα καταλοίπων" },
    note: {
      en: "Approximate normality within each group.",
      el: "Κατά προσέγγιση κανονικότητα εντός κάθε ομάδας.",
    },
  },
  homoTT: {
    name: { en: "Homoscedasticity", el: "Ομοσκεδαστικότητα" },
    note: {
      en: "Use Welch correction if violated.",
      el: "Χρήση διόρθωσης Welch εάν παραβιάζεται.",
    },
  },
  corrLin: {
    name: { en: "Linearity", el: "Γραμμικότητα" },
    note: {
      en: "Scatterplot suggests linear association.",
      el: "Το διάγραμμα διασποράς υποδεικνύει γραμμική σχέση.",
    },
  },
  corrOut: {
    name: { en: "Influential outliers", el: "Επιδραστικές ακραίες τιμές" },
    note: {
      en: "Outliers can strongly distort r.",
      el: "Οι ακραίες τιμές μπορούν να στρεβλώσουν έντονα τον r.",
    },
  },
  medLin: {
    name: { en: "Linearity", el: "Γραμμικότητα" },
    note: { en: "Linear paths between X, M, Y.", el: "Γραμμικές διαδρομές μεταξύ X, M, Y." },
  },
  medNorm: {
    name: { en: "Normality of residuals", el: "Κανονικότητα καταλοίπων" },
    note: {
      en: "Bootstrap CIs relax this assumption.",
      el: "Τα διαστήματα bootstrap χαλαρώνουν αυτή την προϋπόθεση.",
    },
  },
  medHomo: {
    name: { en: "Homoscedasticity", el: "Ομοσκεδαστικότητα" },
    note: { en: "Constant residual variance.", el: "Σταθερή διακύμανση καταλοίπων." },
  },
  chiExp: {
    name: { en: "Expected cell counts", el: "Αναμενόμενες συχνότητες κελιών" },
    note: { en: "≥ 5 in at least 80% of cells.", el: "≥ 5 σε τουλάχιστον 80% των κελιών." },
  },
  chiInd: {
    name: { en: "Independence of observations", el: "Ανεξαρτησία παρατηρήσεων" },
    note: {
      en: "Each participant contributes to one cell only.",
      el: "Κάθε συμμετέχων συνεισφέρει σε ένα μόνο κελί.",
    },
  },
  logitLin: {
    name: { en: "Linearity of the logit", el: "Γραμμικότητα του logit" },
    note: {
      en: "Continuous predictors are linearly related to log-odds.",
      el: "Οι συνεχείς προβλέπτες σχετίζονται γραμμικά με τα log-odds.",
    },
  },
  logitInd: {
    name: { en: "Independence of observations", el: "Ανεξαρτησία παρατηρήσεων" },
    note: { en: "One row per participant.", el: "Μία γραμμή ανά συμμετέχοντα." },
  },
  logitOut: {
    name: { en: "Influential outliers", el: "Επιδραστικές ακραίες τιμές" },
    note: {
      en: "Check standardized residuals and Cook's distance.",
      el: "Έλεγχος τυποποιημένων καταλοίπων και απόστασης Cook.",
    },
  },
  pairInd: {
    name: { en: "Independence of pairs", el: "Ανεξαρτησία ζευγών" },
    note: {
      en: "Each pair independent of the others.",
      el: "Κάθε ζεύγος ανεξάρτητο από τα υπόλοιπα.",
    },
  },
  symmDiff: {
    name: { en: "Symmetry of differences", el: "Συμμετρία διαφορών" },
    note: {
      en: "Distribution of differences approximately symmetric.",
      el: "Η κατανομή των διαφορών κατά προσέγγιση συμμετρική.",
    },
  },
  groupsInd: {
    name: { en: "Independence of observations", el: "Ανεξαρτησία παρατηρήσεων" },
    note: { en: "Groups are independent.", el: "Οι ομάδες είναι ανεξάρτητες." },
  },
} as const;

function statusFor(
  status: Assumptions | undefined,
  base: Assumption["status"],
): Assumption["status"] {
  if (status === "met") return "satisfied";
  if (status === "violated") return "not-satisfied";
  if (status === "unknown") return "unknown";
  return base;
}

type L = { en: string; el: string };
const t = (l: Lang, s: L) => s[l];

function pick(lang: Lang, x: { en: string; el: string }) {
  return x[lang];
}

function A(lang: Lang, key: keyof typeof S, status: Assumption["status"]): Assumption {
  const s = S[key];
  return { name: pick(lang, s.name), status, note: pick(lang, s.note) };
}

function assumptionsFor(method: string, status: Assumptions | undefined, lang: Lang): Assumption[] {
  const common: Assumption[] = [A(lang, "independence", "must-check")];
  if (/regression|ANCOVA|παλινδρόμηση|συνδιακύμανση/i.test(method)) {
    const arr: Assumption[] = [
      ...common,
      A(lang, "linearity", statusFor(status, "must-check")),
      A(lang, "normResid", statusFor(status, "must-check")),
      A(lang, "homosced", statusFor(status, "must-check")),
      A(lang, "multi", statusFor(status, "must-check")),
      A(lang, "outliers", statusFor(status, "must-check")),
    ];
    if (/ANCOVA|συνδιακύμανση/i.test(method))
      arr.push(A(lang, "slopes", statusFor(status, "must-check")));
    return arr;
  }
  if (/ANOVA/i.test(method)) {
    return [
      ...common,
      A(lang, "normWithin", statusFor(status, "must-check")),
      A(lang, "equalVar", statusFor(status, "must-check")),
      A(lang, "outliersBox", statusFor(status, "must-check")),
    ];
  }
  if (/t-test/i.test(method)) {
    return [
      ...common,
      A(lang, "normTT", statusFor(status, "must-check")),
      A(lang, "homoTT", statusFor(status, "must-check")),
    ];
  }
  if (/correlation|Συσχέτιση/i.test(method)) {
    return [
      ...common,
      A(lang, "corrLin", statusFor(status, "must-check")),
      A(lang, "corrOut", statusFor(status, "must-check")),
    ];
  }
  if (/mediation|PROCESS|διαμεσολάβηση/i.test(method)) {
    return [
      ...common,
      A(lang, "medLin", statusFor(status, "must-check")),
      A(lang, "medNorm", statusFor(status, "must-check")),
      A(lang, "medHomo", statusFor(status, "must-check")),
    ];
  }
  return common;
}

// R code snippets (identifiers kept in English; notes localized)
const R_MEDIATION = `library(lavaan)

model <- '
  # mediator model
  M ~ a*X
  # outcome model
  Y ~ cprime*X + b*M
  # indirect effect
  indirect := a*b
  # total effect
  total := cprime + (a*b)
'

fit <- sem(
  model,
  data = df,
  se = "bootstrap",
  bootstrap = 5000
)

summary(
  fit,
  standardized = TRUE,
  fit.measures = TRUE,
  ci = TRUE
)`;

const R_MED_NOTE: L = {
  en: "# Replace X, M, Y, and df with the variable and dataset names used in your study.",
  el: "# Αντικαταστήστε τα X, M, Y και df με τα ονόματα των μεταβλητών και του συνόλου δεδομένων της έρευνάς σας.",
};

// SPSS/Jamovi steps localized
const SPSS = {
  medHeader: {
    en: "Analyze → Regression → PROCESS (PROCESS macro by Hayes)",
    el: "Analyze → Regression → PROCESS (Μακροεντολή PROCESS του Hayes)",
  },
  medModel4: { en: "Model number: 4", el: "Αριθμός μοντέλου: 4" },
  medVars: {
    en: "Y = outcome, X = predictor, M = mediator",
    el: "Y = έκβαση, X = προβλέπτης, M = διαμεσολαβητής",
  },
  medBoot: {
    en: "Bootstrap samples: 5000, Confidence: 95%",
    el: "Δείγματα bootstrap: 5000, Εμπιστοσύνη: 95%",
  },
  medSave: {
    en: "Select standardized indirect effects, if available in the installed PROCESS version.",
    el: "Επιλέξτε την εμφάνιση τυποποιημένων έμμεσων επιδράσεων, εφόσον είναι διαθέσιμη στην εγκατεστημένη έκδοση του PROCESS.",
  },
  modHeader: {
    en: "Analyze → Regression → PROCESS (PROCESS macro by Hayes)",
    el: "Analyze → Regression → PROCESS (Μακροεντολή PROCESS του Hayes)",
  },
  modModel1: { en: "Model number: 1", el: "Αριθμός μοντέλου: 1" },
  modVars: {
    en: "Y = outcome, X = predictor, W = moderator",
    el: "Y = έκβαση, X = προβλέπτης, W = ρυθμιστής",
  },
  modCenter: {
    en: "Mean center: Only continuous variables that define products",
    el: "Κεντράρισμα μέσου: Μόνο συνεχείς μεταβλητές που ορίζουν γινόμενα",
  },
  chi1: {
    en: "Analyze → Descriptive Statistics → Crosstabs",
    el: "Analyze → Descriptive Statistics → Crosstabs",
  },
  chi2: {
    en: "Statistics → Chi-square, Phi/Cramer's V",
    el: "Statistics → Chi-square, Phi/Cramer's V",
  },
  corr1: { en: "Analyze → Correlate → Bivariate", el: "Analyze → Correlate → Bivariate" },
  corr2p: { en: "Coefficient: Pearson", el: "Συντελεστής: Pearson" },
  corr2s: { en: "Coefficient: Spearman", el: "Συντελεστής: Spearman" },
  log1: {
    en: "Analyze → Regression → Binary Logistic",
    el: "Analyze → Regression → Binary Logistic",
  },
  log2: {
    en: "Move outcome to Dependent, predictors to Covariates",
    el: "Μεταφορά έκβασης στο Dependent, προβλεπτών στα Covariates",
  },
  lin1: { en: "Analyze → Regression → Linear", el: "Analyze → Regression → Linear" },
  lin2: {
    en: "Statistics → Collinearity diagnostics, Durbin-Watson",
    el: "Statistics → Collinearity diagnostics, Durbin-Watson",
  },
  anc1: {
    en: "Analyze → General Linear Model → Univariate",
    el: "Analyze → General Linear Model → Univariate",
  },
  anc2: {
    en: "Fixed Factor = group, Covariate(s) = covariate",
    el: "Fixed Factor = ομάδα, Covariate(s) = συμμεταβλητή",
  },
  anc3: {
    en: "Options → Estimated marginal means, Effect size",
    el: "Options → Estimated marginal means, Effect size",
  },
  pWil1: {
    en: "Analyze → Nonparametric Tests → Legacy Dialogs → 2 Related Samples",
    el: "Analyze → Nonparametric Tests → Legacy Dialogs → 2 Related Samples",
  },
  pWil2: { en: "Test type: Wilcoxon", el: "Τύπος ελέγχου: Wilcoxon" },
  pt1: {
    en: "Analyze → Compare Means → Paired-Samples T Test",
    el: "Analyze → Compare Means → Paired-Samples T Test",
  },
  it1: {
    en: "Analyze → Compare Means → Independent-Samples T Test",
    el: "Analyze → Compare Means → Independent-Samples T Test",
  },
  mw1: {
    en: "Analyze → Nonparametric Tests → Independent Samples",
    el: "Analyze → Nonparametric Tests → Independent Samples",
  },
  aov1: {
    en: "Analyze → Compare Means → One-Way ANOVA",
    el: "Analyze → Compare Means → One-Way ANOVA",
  },
  aov2: {
    en: "Post Hoc: Tukey HSD, Options: Descriptive, Homogeneity",
    el: "Post Hoc: Tukey HSD, Options: Descriptive, Homogeneity",
  },
  kw1: {
    en: "Analyze → Nonparametric Tests → Independent Samples",
    el: "Analyze → Nonparametric Tests → Independent Samples",
  },
  kw2: { en: "K samples: Kruskal-Wallis", el: "K samples: Kruskal-Wallis" },
  desc: {
    en: "Analyze → Descriptive Statistics → Explore",
    el: "Analyze → Descriptive Statistics → Explore",
  },
} as const;

const JAM = {
  medInstall: {
    en: "Install the 'jAMM' or 'medmod' module",
    el: "Εγκατάσταση της ενότητας 'jAMM' ή 'medmod'",
  },
  medOpen: { en: "Analyses → medmod → Mediation", el: "Analyses → medmod → Mediation" },
  medFields: {
    en: "Set Dependent, Mediator, Predictor",
    el: "Ορισμός Dependent, Mediator, Predictor",
  },
  medBoot: { en: "Estimation method: Bootstrap (5000)", el: "Μέθοδος εκτίμησης: Bootstrap (5000)" },
  modLR: {
    en: "Analyses → Regression → Linear Regression",
    el: "Analyses → Regression → Linear Regression",
  },
  modInter: {
    en: "Add X, W, and X×W interaction term",
    el: "Προσθήκη X, W, και όρου αλληλεπίδρασης X×W",
  },
  modSlopes: {
    en: "Request simple slopes via 'jAMM' module",
    el: "Ζητήστε simple slopes μέσω της ενότητας 'jAMM'",
  },
  chi1: {
    en: "Analyses → Frequencies → Contingency Tables",
    el: "Analyses → Frequencies → Contingency Tables",
  },
  chi2: { en: "Enable χ² and effect size", el: "Ενεργοποίηση χ² και μεγέθους επίδρασης" },
  corr1: {
    en: "Analyses → Regression → Correlation Matrix",
    el: "Analyses → Regression → Correlation Matrix",
  },
  corrP: { en: "Select Pearson", el: "Επιλογή Pearson" },
  corrS: { en: "Select Spearman", el: "Επιλογή Spearman" },
  log1: {
    en: "Analyses → Regression → Logistic Regression → 2 Outcomes",
    el: "Analyses → Regression → Logistic Regression → 2 Outcomes",
  },
  lin1: {
    en: "Analyses → Regression → Linear Regression",
    el: "Analyses → Regression → Linear Regression",
  },
  lin2: { en: "Assumption Checks → all", el: "Assumption Checks → όλα" },
  anc1: { en: "Analyses → ANOVA → ANCOVA", el: "Analyses → ANOVA → ANCOVA" },
  anc2: {
    en: "Add group as factor, covariate under Covariates",
    el: "Ομάδα ως παράγοντας, συμμεταβλητή στα Covariates",
  },
  pWil1: {
    en: "Analyses → T-Tests → Paired Samples T-Test",
    el: "Analyses → T-Tests → Paired Samples T-Test",
  },
  pWil2: { en: "Enable Wilcoxon rank", el: "Ενεργοποίηση Wilcoxon rank" },
  pt1: {
    en: "Analyses → T-Tests → Paired Samples T-Test",
    el: "Analyses → T-Tests → Paired Samples T-Test",
  },
  it1: {
    en: "Analyses → T-Tests → Independent Samples T-Test",
    el: "Analyses → T-Tests → Independent Samples T-Test",
  },
  it2: {
    en: "Enable Welch's, Descriptives, Effect size",
    el: "Ενεργοποίηση Welch's, Descriptives, μεγέθους επίδρασης",
  },
  mw1: {
    en: "Analyses → T-Tests → Independent Samples T-Test → Mann-Whitney U",
    el: "Analyses → T-Tests → Independent Samples T-Test → Mann-Whitney U",
  },
  aov1: { en: "Analyses → ANOVA → One-Way ANOVA", el: "Analyses → ANOVA → One-Way ANOVA" },
  aov2: { en: "Assumption Checks + Tukey", el: "Assumption Checks + Tukey" },
  kw1: {
    en: "Analyses → ANOVA → One-Way ANOVA → Non-parametric (Kruskal-Wallis)",
    el: "Analyses → ANOVA → One-Way ANOVA → Μη παραμετρική (Kruskal-Wallis)",
  },
  desc: {
    en: "Analyses → Exploration → Descriptives",
    el: "Analyses → Exploration → Descriptives",
  },
} as const;

function L(lang: Lang, arr: L[]): string[] {
  return arr.map((x) => x[lang]);
}

export function decide(a: Answers, lang: Lang = "en"): Recommendation {
  const violated = a.assumptions === "violated";
  const unknown = a.assumptions === "unknown";
  const planned = a.planned ? plannedLabel[lang][a.planned] : "";

  // ---- Mediation
  if (a.goal === "mediation" || a.extra === "mediator") {
    const method = pick(lang, M.mediation);
    const auditText =
      a.planned && a.planned !== "process4"
        ? lang === "el"
          ? `Μια συμβατική ανάλυση παλινδρόμησης μπορεί να εκτιμήσει τη συνολική ή την άμεση επίδραση, αλλά δεν εκτιμά και δεν ελέγχει από μόνη της με bootstrap την έμμεση επίδραση a×b που απαιτεί η υπόθεση διαμεσολάβησης. Το PROCESS Model 4, ή ένα ισοδύναμο μοντέλο διαμεσολάβησης με bootstrap, ελέγχει άμεσα αυτή την έμμεση διαδρομή.`
          : `A conventional regression may estimate the total or direct effect, but it does not by itself estimate and bootstrap the indirect effect a×b required by the mediation hypothesis. PROCESS Model 4, or an equivalent bootstrap mediation model, directly tests this indirect pathway.`
        : lang === "el"
          ? "Το σχέδιό σας συνάδει με την πρόταση."
          : "Your planned analysis aligns with the recommendation.";
    return {
      method,
      fit: "Strong",
      summary:
        lang === "el"
          ? "Ο σχεδιασμός σας ελέγχει μια έμμεση διαδρομή μέσω ενός διαμεσολαβητή. Η ανάλυση διαμεσολάβησης με bootstrap εκτιμά την έμμεση επίδραση και το διάστημα εμπιστοσύνης της χωρίς να υποθέτει κανονική κατανομή δειγματοληψίας του a·b."
          : "Your design tests an indirect pathway through a mediator. Bootstrap mediation estimates the indirect effect and its confidence interval without assuming a normal sampling distribution of a·b.",
      reasons:
        lang === "el"
          ? [
              "Δηλώσατε ρητά διαμεσολαβητή στο μοντέλο σας.",
              "Μια απλή γραμμική παλινδρόμηση δεν μπορεί να αποσυνθέσει άμεσες και έμμεσες επιδράσεις.",
              "Τα διαστήματα εμπιστοσύνης bootstrap προτιμώνται για την έμμεση επίδραση, επειδή η δειγματοληπτική κατανομή του a×b συχνά δεν είναι κανονική.",
            ]
          : [
              "You explicitly identified a mediator in your model.",
              "A single linear regression cannot decompose direct and indirect effects.",
              "Bootstrap confidence intervals are preferred for the indirect effect because the sampling distribution of a×b is often non-normal.",
            ],
      alternative: {
        method: pick(lang, M.sem),
        when:
          lang === "el"
            ? "Χρησιμοποιήστε SEM όταν έχετε πολλαπλούς δείκτες ανά κατασκευή ή πιο σύνθετο μοντέλο διαδρομών με λανθάνουσες μεταβλητές."
            : "Use SEM when you have multiple indicators per construct or a more complex path model with latent variables.",
      },
      audit: { warn: a.planned === "linear_reg" || a.planned === "pearson", text: auditText },
      assumptions: assumptionsFor(method, a.assumptions, lang),
      code: {
        spss: L(lang, [SPSS.medHeader, SPSS.medModel4, SPSS.medVars, SPSS.medBoot, SPSS.medSave]),
        jamovi: L(lang, [JAM.medInstall, JAM.medOpen, JAM.medFields, JAM.medBoot]),
        r: `${R_MEDIATION}\n\n${pick(lang, R_MED_NOTE)}`,
      },
    };
  }

  // ---- Moderation
  if (a.goal === "moderation" || a.extra === "moderator") {
    const method = pick(lang, M.moderation);
    return {
      method,
      fit: "Strong",
      summary:
        lang === "el"
          ? "Η ρύθμιση ελέγχεται με προσθήκη του γινομένου προβλέπτη × ρυθμιστή σε μοντέλο παλινδρόμησης και διερεύνηση της αλληλεπίδρασης με απλές κλίσεις."
          : "Moderation is tested by including the product of the predictor and moderator in a regression model, probing the interaction with simple slopes.",
      reasons:
        lang === "el"
          ? [
              "Δηλώσατε μια ρυθμιστική μεταβλητή.",
              "Σημαντική αλληλεπίδραση X × W σημαίνει ότι η επίδραση του X στο Y εξαρτάται από το W.",
              "Το PROCESS Model 1 αυτοματοποιεί το κεντράρισμα, τη διερεύνηση αλληλεπίδρασης και τις περιοχές Johnson–Neyman.",
            ]
          : [
              "You identified a moderator variable.",
              "A significant X × W interaction indicates the effect of X on Y depends on W.",
              "PROCESS Model 1 automates mean-centering, interaction probing and Johnson-Neyman regions.",
            ],
      alternative: {
        method: pick(lang, M.two_way_anova),
        when:
          lang === "el"
            ? "Αν και ο προβλέπτης και ο ρυθμιστής είναι κατηγορικοί παράγοντες και η έκβαση συνεχής."
            : "If both predictor and moderator are categorical factors and the outcome is continuous.",
      },
      audit: {
        warn: a.planned !== "process1",
        text:
          a.planned && a.planned !== "process1"
            ? lang === "el"
              ? `Η επιλεγμένη ανάλυση (${planned}) δεν περιλαμβάνει όρο αλληλεπίδρασης. Για να ελεγχθεί η ρύθμιση πρέπει να μοντελοποιηθεί το γινόμενο X × W και να διερευνηθούν οι απλές κλίσεις.`
              : `Your planned ${planned} does not include an interaction term. To test moderation you must model the X × W product and probe simple slopes.`
            : lang === "el"
              ? "Το σχέδιό σας συνάδει με την πρόταση."
              : "Your plan matches the recommendation.",
      },
      assumptions: assumptionsFor("regression", a.assumptions, lang),
      code: {
        spss: L(lang, [SPSS.modHeader, SPSS.modModel1, SPSS.modVars, SPSS.modCenter]),
        jamovi: L(lang, [JAM.modLR, JAM.modInter, JAM.modSlopes]),
        r: `library(interactions)\nmod <- lm(Y ~ X * W, data = df)\nsummary(mod)\nsim_slopes(mod, pred = X, modx = W, johnson_neyman = TRUE)`,
      },
    };
  }

  // ---- Association
  if (a.goal === "association") {
    if (a.outcome === "nominal" || a.outcome === "binary") {
      const method = pick(lang, M.chisq);
      return {
        method,
        fit: "Strong",
        summary:
          lang === "el"
            ? "Δύο κατηγορικές μεταβλητές — ο έλεγχος χ² αξιολογεί αν η κοινή τους κατανομή αποκλίνει από την ανεξαρτησία."
            : "Two categorical variables — a chi-square test evaluates whether their joint distribution deviates from independence.",
        reasons:
          lang === "el"
            ? [
                "Και οι δύο μεταβλητές είναι κατηγορικές.",
                "Ελέγχετε συσχέτιση, όχι πρόβλεψη.",
                "Αναμενόμενες συχνότητες κελιών ≥ 5 υποστηρίζουν την προσέγγιση χ².",
              ]
            : [
                "Both variables are categorical.",
                "You are testing association, not prediction.",
                "Expected cell counts ≥ 5 support the χ² approximation.",
              ],
        alternative: {
          method: pick(lang, M.fisher),
          when:
            lang === "el"
              ? "Όταν αναμενόμενες συχνότητες κελιών είναι < 5 ή το δείγμα είναι μικρό."
              : "When expected cell counts are below 5 or the sample is small.",
        },
        audit: {
          warn: false,
          text:
            lang === "el"
              ? "Δεν εντοπίστηκε σύγκρουση με το σχέδιό σας."
              : "No conflict detected with your planned analysis.",
        },
        assumptions: [A(lang, "chiInd", "must-check"), A(lang, "chiExp", "must-check")],
        code: {
          spss: L(lang, [SPSS.chi1, SPSS.chi2]),
          jamovi: L(lang, [JAM.chi1, JAM.chi2]),
          r: `tab <- table(df$X, df$Y)\nchisq.test(tab)\nlibrary(vcd); assocstats(tab)`,
        },
      };
    }
    const useSpearman = violated || a.outcome === "ordinal";
    const method = useSpearman ? pick(lang, M.spearman) : pick(lang, M.pearson);
    return {
      method,
      fit: useSpearman ? "Strong" : unknown ? "Conditional" : "Strong",
      summary: useSpearman
        ? lang === "el"
          ? "Μη παραμετρική συσχέτιση με βάση τάξεις· εύρωστη σε μη κανονικότητα και κατάλληλη για διατακτικά δεδομένα."
          : "Non-parametric rank-based correlation; robust to non-normality and appropriate for ordinal data."
        : lang === "el"
          ? "Τυποποιημένο μέτρο γραμμικής συσχέτισης μεταξύ δύο συνεχών μεταβλητών."
          : "Standardized measure of linear association between two continuous variables.",
      reasons:
        lang === "el"
          ? [
              "Ελέγχετε συσχέτιση παρά αιτιακό ή προβλεπτικό μοντέλο.",
              useSpearman
                ? "Οι προϋποθέσεις του Pearson r δεν ικανοποιούνται ή η έκβαση είναι διατακτική."
                : "Συνεχείς μεταβλητές με (υποτιθέμενη) γραμμική σχέση.",
              "Το μέγεθος επίδρασης (r) ερμηνεύεται άμεσα.",
            ]
          : [
              "You are testing association rather than a causal or predictive model.",
              useSpearman
                ? "Assumptions of Pearson r are not met, or the outcome is ordinal."
                : "Continuous variables with (assumed) linear association.",
              "Effect size (r) is directly interpretable.",
            ],
      alternative: {
        method: useSpearman ? pick(lang, M.kendall) : pick(lang, M.spearman),
        when: useSpearman
          ? lang === "el"
            ? "Με πολλές ισοβαθμίες τάξεων ή πολύ μικρά δείγματα."
            : "With many tied ranks or very small samples."
          : lang === "el"
            ? "Αν παραβιάζονται προϋποθέσεις γραμμικότητας ή κανονικότητας."
            : "If linearity or normality assumptions are violated.",
      },
      audit: {
        warn: false,
        text:
          lang === "el"
            ? "Το σχέδιό σας είναι συμβατό με την πρόταση."
            : "Your plan is compatible with the recommendation.",
      },
      assumptions: assumptionsFor("correlation", a.assumptions, lang),
      code: {
        spss: L(lang, [SPSS.corr1, useSpearman ? SPSS.corr2s : SPSS.corr2p]),
        jamovi: L(lang, [JAM.corr1, useSpearman ? JAM.corrS : JAM.corrP]),
        r: useSpearman
          ? `cor.test(df$X, df$Y, method = "spearman")`
          : `cor.test(df$X, df$Y, method = "pearson")`,
      },
    };
  }

  // ---- Prediction
  if (a.goal === "predict") {
    if (a.outcome === "binary") {
      const method = pick(lang, M.logistic_reg);
      return {
        method,
        fit: "Strong",
        summary:
          lang === "el"
            ? "Μοντελοποιεί το log-odds μιας δυαδικής έκβασης ως γραμμική συνάρτηση προβλεπτών· αποδίδει ερμηνεύσιμους λόγους πιθανοτήτων (odds ratios)."
            : "Models the log-odds of a binary outcome as a linear function of predictors; yields interpretable odds ratios.",
        reasons:
          lang === "el"
            ? [
                "Η έκβαση είναι δυαδική.",
                "Θέλετε να προβλέψετε / μοντελοποιήσετε την έκβαση από έναν ή περισσότερους προβλέπτες.",
                "Οι λόγοι πιθανοτήτων απαντούν άμεσα το ερευνητικό ερώτημα.",
              ]
            : [
                "Outcome is binary.",
                "You want to predict / model an outcome from one or more predictors.",
                "Odds ratios directly answer the research question.",
              ],
        alternative: {
          method: pick(lang, M.probit),
          when:
            lang === "el"
              ? "Όταν έχει σημασία η ερμηνεία λανθάνουσας μεταβλητής (σπάνιο στις κοινωνικές επιστήμες)."
              : "When the latent variable interpretation matters (rare in social sciences).",
        },
        audit: {
          warn: a.planned === "linear_reg",
          text:
            a.planned === "linear_reg"
              ? lang === "el"
                ? "Η γραμμική παλινδρόμηση σε δυαδική έκβαση παραβιάζει τις βασικές προϋποθέσεις της (κανονικότητα, ομοσκεδαστικότητα) και μπορεί να παράγει αδύνατες προβλεπόμενες πιθανότητες."
                : "Linear regression on a binary outcome violates its core assumptions (normality, homoscedasticity) and can produce impossible predicted probabilities."
              : lang === "el"
                ? "Το σχέδιό σας συνάδει με την πρόταση."
                : "Your plan aligns with the recommendation.",
        },
        assumptions: [
          A(lang, "logitInd", "must-check"),
          A(lang, "logitLin", "must-check"),
          A(lang, "multi", "must-check"),
          A(lang, "logitOut", "must-check"),
        ],
        code: {
          spss: L(lang, [SPSS.log1, SPSS.log2]),
          jamovi: L(lang, [JAM.log1]),
          r: `mod <- glm(Y ~ X1 + X2, data = df, family = binomial)\nsummary(mod); exp(cbind(OR = coef(mod), confint(mod)))`,
        },
      };
    }
    const method = pick(lang, M.linear_reg);
    return {
      method,
      fit: unknown ? "Conditional" : "Strong",
      summary:
        lang === "el"
          ? "Εκτιμά τη γραμμική σχέση μεταξύ ενός ή περισσότερων προβλεπτών και μιας συνεχούς έκβασης, ελέγχοντας για συμμεταβλητές."
          : "Estimates the linear relationship between one or more predictors and a continuous outcome, controlling for covariates.",
      reasons:
        lang === "el"
          ? [
              "Συνεχής έκβαση με προβλεπτικό σκοπό.",
              "Μπορούν να μοντελοποιηθούν ταυτόχρονα πολλαπλοί προβλέπτες.",
              "Οι τυποποιημένοι συντελεστές (β) υποστηρίζουν συγκρίσεις.",
            ]
          : [
              "Continuous outcome with predictive intent.",
              "Multiple predictors can be modelled simultaneously.",
              "Standardized coefficients (β) support comparison.",
            ],
      alternative: {
        method: pick(lang, M.ridge),
        when:
          lang === "el"
            ? "Με πολλούς συσχετισμένους προβλέπτες ή έμφαση στην ακρίβεια πρόβλεψης έναντι της συναγωγής."
            : "With many correlated predictors or a focus on prediction accuracy over inference.",
      },
      audit: {
        warn: false,
        text:
          lang === "el"
            ? "Το σχέδιό σας συνάδει με την πρόταση."
            : "Your plan is consistent with the recommendation.",
      },
      assumptions: assumptionsFor("regression", a.assumptions, lang),
      code: {
        spss: L(lang, [SPSS.lin1, SPSS.lin2]),
        jamovi: L(lang, [JAM.lin1, JAM.lin2]),
        r: `mod <- lm(Y ~ X1 + X2 + X3, data = df)\nsummary(mod)\nlibrary(car); vif(mod)`,
      },
    };
  }

  // ---- Compare groups
  if (a.goal === "compare") {
    if (a.extra === "covariates" && a.outcome === "continuous" && a.groups !== "one") {
      const method = pick(lang, M.ancova);
      return {
        method,
        fit: "Strong",
        summary:
          lang === "el"
            ? "Συγκρίνει μέσους ομάδων στην έκβαση προσαρμόζοντας για μία ή περισσότερες συνεχείς συμμεταβλητές, αυξάνοντας την ισχύ και ελέγχοντας για συγχυτικές μεταβλητές."
            : "Compares group means on the outcome while adjusting for one or more continuous covariates, increasing statistical power and controlling confounding.",
        reasons:
          lang === "el"
            ? [
                "Συγκρίνετε ομάδες σε συνεχή έκβαση.",
                "Δηλώσατε συμμεταβλητές που πρέπει να ελεγχθούν στατιστικά.",
                "Η ANCOVA παράγει προσαρμοσμένους μέσους και μεγέθη μερικής επίδρασης.",
              ]
            : [
                "You are comparing groups on a continuous outcome.",
                "You specified covariates that should be statistically controlled.",
                "ANCOVA yields adjusted means and partial effect sizes.",
              ],
        alternative: {
          method: pick(lang, M.change_score),
          when:
            lang === "el"
              ? "Όταν η συμμεταβλητή είναι pre-test και παραβιάζεται η ομοιογένεια κλίσεων παλινδρόμησης."
              : "When the covariate is a pre-test and homogeneity of regression slopes is violated.",
        },
        audit: {
          warn: a.planned === "ind_ttest",
          text:
            a.planned === "ind_ttest"
              ? lang === "el"
                ? "Το προγραμματισμένο t-test ανεξάρτητων δειγμάτων δεν λαμβάνει υπόψη τη συμμεταβλητή. Η ANCOVA μπορεί να προσφέρει καταλληλότερη προσαρμοσμένη σύγκριση, εφόσον ικανοποιείται η ομοιογένεια κλίσεων παλινδρόμησης."
                : "Your planned independent-samples t-test does not account for the covariate. ANCOVA may provide a more appropriate adjusted comparison, provided that the homogeneity-of-regression-slopes assumption is satisfied."
              : lang === "el"
                ? "Το σχέδιό σας συνάδει με την πρόταση."
                : "Your plan aligns with the recommendation.",
        },
        assumptions: assumptionsFor("ANCOVA", a.assumptions, lang),
        code: {
          spss: L(lang, [SPSS.anc1, SPSS.anc2, SPSS.anc3]),
          jamovi: L(lang, [JAM.anc1, JAM.anc2]),
          r: `library(car)\nmod <- lm(Y ~ covariate + group, data = df)\nAnova(mod, type = 3)\nemmeans::emmeans(mod, ~ group)`,
        },
      };
    }
    if (a.measurement === "paired" && a.outcome === "continuous") {
      if (violated) {
        const method = pick(lang, M.wilcoxon);
        return {
          method,
          fit: "Strong",
          summary:
            lang === "el"
              ? "Μη παραμετρική εναλλακτική του εξαρτημένων δειγμάτων t-test· συγκρίνει τις τάξεις των εντός-ατόμου διαφορών."
              : "Non-parametric alternative to the paired t-test; compares the ranks of within-subject differences.",
          reasons:
            lang === "el"
              ? [
                  "Εξαρτημένος / πριν–μετά σχεδιασμός.",
                  "Δεν ικανοποιούνται οι παραμετρικές προϋποθέσεις του t-test.",
                  "Εύρωστος σε μη κανονικές διαφορικές βαθμολογίες.",
                ]
              : [
                  "Paired / pre-post design.",
                  "Parametric assumptions of the paired t-test are not met.",
                  "Robust to non-normal difference scores.",
                ],
          alternative: {
            method: pick(lang, M.paired_boot),
            when:
              lang === "el"
                ? "Όταν θέλετε να διατηρήσετε ερμηνεία μέσης διαφοράς αλλά να χαλαρώσετε την κανονικότητα."
                : "When you want to retain a mean difference interpretation but relax normality.",
          },
          audit: {
            warn: a.planned === "paired_ttest",
            text:
              a.planned === "paired_ttest"
                ? lang === "el"
                  ? "Το προγραμματισμένο t-test εξαρτημένων δειγμάτων υποθέτει κανονικά κατανεμημένες διαφορικές βαθμολογίες, οι οποίες αναφέρονται ως παραβιαζόμενες."
                  : "Your planned paired t-test assumes normally distributed difference scores, which are reported as violated."
                : lang === "el"
                  ? "Το σχέδιό σας είναι συνεπές."
                  : "Your plan is consistent.",
          },
          assumptions: [A(lang, "pairInd", "must-check"), A(lang, "symmDiff", "must-check")],
          code: {
            spss: L(lang, [SPSS.pWil1, SPSS.pWil2]),
            jamovi: L(lang, [JAM.pWil1, JAM.pWil2]),
            r: `wilcox.test(df$pre, df$post, paired = TRUE)`,
          },
        };
      }
      const method = pick(lang, M.paired_ttest);
      return {
        method,
        fit: unknown ? "Conditional" : "Strong",
        summary:
          lang === "el"
            ? "Ελέγχει αν η μέση διαφορά μεταξύ εξαρτημένων παρατηρήσεων διαφέρει από το μηδέν."
            : "Tests whether the mean difference between paired observations differs from zero.",
        reasons:
          lang === "el"
            ? [
                "Δύο εξαρτημένες μετρήσεις ανά συμμετέχοντα.",
                "Συνεχής έκβαση.",
                "Απαντά άμεσα σε εντός-ατόμου σύγκριση.",
              ]
            : [
                "Two paired measurements per participant.",
                "Continuous outcome.",
                "Directly answers a within-subject comparison.",
              ],
        alternative: {
          method: pick(lang, M.wilcoxon),
          when:
            lang === "el"
              ? "Αν η κατανομή των διαφορικών βαθμολογιών είναι μη κανονική ή περιέχει ακραίες τιμές."
              : "If the distribution of difference scores is non-normal or contains outliers.",
        },
        audit: {
          warn: false,
          text:
            lang === "el"
              ? "Το σχέδιό σας συνάδει με την πρόταση."
              : "Your plan aligns with the recommendation.",
        },
        assumptions: assumptionsFor("t-test", a.assumptions, lang),
        code: {
          spss: L(lang, [SPSS.pt1]),
          jamovi: L(lang, [JAM.pt1]),
          r: `t.test(df$post, df$pre, paired = TRUE)\nlibrary(effectsize); cohens_d(df$post, df$pre, paired = TRUE)`,
        },
      };
    }
    if (a.groups === "two" && a.outcome === "continuous") {
      if (violated) {
        const method = pick(lang, M.mann_whitney);
        return {
          method,
          fit: "Strong",
          summary:
            lang === "el"
              ? "Μη παραμετρική εναλλακτική του t-test ανεξάρτητων δειγμάτων· συγκρίνει κατανομές τάξεων."
              : "Non-parametric alternative to the independent-samples t-test comparing rank distributions.",
          reasons:
            lang === "el"
              ? [
                  "Δύο ανεξάρτητες ομάδες.",
                  "Δεν ικανοποιούνται οι προϋποθέσεις του παραμετρικού t-test.",
                  "Εύρωστος σε μη κανονικότητα και ακραίες τιμές.",
                ]
              : [
                  "Two independent groups.",
                  "Assumptions of the parametric t-test are not met.",
                  "Robust to non-normality and outliers.",
                ],
          alternative: {
            method: pick(lang, M.welch_boot),
            when:
              lang === "el"
                ? "Όταν προτιμάτε ερμηνεία μέσης διαφοράς."
                : "When you prefer a mean-difference interpretation.",
          },
          audit: {
            warn: a.planned === "ind_ttest",
            text:
              lang === "el"
                ? "Το επιλεγμένο t-test υποθέτει κανονικότητα· ένας έλεγχος βασισμένος σε τάξεις είναι πιο τεκμηριωμένος εδώ."
                : "Your planned t-test assumes normality; a rank-based test is more defensible here.",
          },
          assumptions: [A(lang, "groupsInd", "must-check")],
          code: {
            spss: L(lang, [SPSS.mw1]),
            jamovi: L(lang, [JAM.mw1]),
            r: `wilcox.test(Y ~ group, data = df)`,
          },
        };
      }
      const method = pick(lang, M.ind_ttest);
      return {
        method,
        fit: unknown ? "Conditional" : "Strong",
        summary:
          lang === "el"
            ? "Συγκρίνει τους μέσους μιας συνεχούς έκβασης μεταξύ δύο ανεξάρτητων ομάδων."
            : "Compares the means of a continuous outcome between two independent groups.",
        reasons:
          lang === "el"
            ? [
                "Δύο ανεξάρτητες ομάδες.",
                "Συνεχής έκβαση.",
                "Άμεση ερμηνεία μέσω μέσης διαφοράς και d του Cohen.",
              ]
            : [
                "Two independent groups.",
                "Continuous outcome.",
                "Straightforward interpretation via mean difference and Cohen's d.",
              ],
        alternative: {
          method: pick(lang, M.mann_whitney),
          when:
            lang === "el"
              ? "Αν παραβιάζεται η κανονικότητα ή υπάρχουν ακραίες τιμές."
              : "If normality is violated or the outcome contains extreme values.",
        },
        audit: {
          warn: false,
          text:
            lang === "el"
              ? "Το σχέδιό σας συνάδει με την πρόταση."
              : "Your plan aligns with the recommendation.",
        },
        assumptions: assumptionsFor("t-test", a.assumptions, lang),
        code: {
          spss: L(lang, [SPSS.it1]),
          jamovi: L(lang, [JAM.it1, JAM.it2]),
          r: `t.test(Y ~ group, data = df, var.equal = FALSE)\nlibrary(effectsize); cohens_d(Y ~ group, data = df)`,
        },
      };
    }
    if (a.groups === "threeplus" && a.outcome === "continuous") {
      if (violated) {
        const method = pick(lang, M.kruskal);
        return {
          method,
          fit: "Strong",
          summary:
            lang === "el"
              ? "Μη παραμετρική εναλλακτική της μονοπαραγοντικής ANOVA· συγκρίνει κατανομές τάξεων σε ≥ 3 ομάδες."
              : "Non-parametric alternative to one-way ANOVA comparing rank distributions across ≥ 3 groups.",
          reasons:
            lang === "el"
              ? [
                  "Τρεις ή περισσότερες ανεξάρτητες ομάδες.",
                  "Δεν ικανοποιούνται οι παραμετρικές προϋποθέσεις.",
                  "Εύρωστος σε λοξότητα και ακραίες τιμές.",
                ]
              : [
                  "Three or more independent groups.",
                  "Parametric assumptions of ANOVA are not met.",
                  "Robust to skew and outliers.",
                ],
          alternative: {
            method: pick(lang, M.welch_anova),
            when:
              lang === "el"
                ? "Όταν παραβιάζεται μόνο η ομοιογένεια διακύμανσης αλλά οι κατανομές είναι κατά προσέγγιση κανονικές."
                : "When only homogeneity of variance is violated but distributions are approximately normal.",
          },
          audit: {
            warn: a.planned === "anova",
            text:
              lang === "el"
                ? "Η μονοπαραγοντική ANOVA υποθέτει κανονικότητα εντός ομάδων, η οποία αναφέρεται ως παραβιαζόμενη."
                : "One-way ANOVA assumes normality within groups, which is reported as violated.",
          },
          assumptions: [A(lang, "groupsInd", "must-check")],
          code: {
            spss: L(lang, [SPSS.kw1, SPSS.kw2]),
            jamovi: L(lang, [JAM.kw1]),
            r: `kruskal.test(Y ~ group, data = df)\nFSA::dunnTest(Y ~ group, data = df, method = "bh")`,
          },
        };
      }
      const method = pick(lang, M.anova);
      return {
        method,
        fit: unknown ? "Conditional" : "Strong",
        summary:
          lang === "el"
            ? "Συγκρίνει τους μέσους μιας συνεχούς έκβασης σε τρεις ή περισσότερες ανεξάρτητες ομάδες."
            : "Compares means of a continuous outcome across three or more independent groups.",
        reasons:
          lang === "el"
            ? [
                "Τρεις ή περισσότερες ανεξάρτητες ομάδες.",
                "Συνεχής έκβαση.",
                "Οι post-hoc συγκρίσεις εντοπίζουν ποιες ομάδες διαφέρουν.",
              ]
            : [
                "Three or more independent groups.",
                "Continuous outcome.",
                "Post-hoc comparisons identify which groups differ.",
              ],
        alternative: {
          method: pick(lang, M.welch_anova),
          when:
            lang === "el"
              ? "Αν οι διακυμάνσεις διαφέρουν μεταξύ ομάδων."
              : "If variances are unequal across groups.",
        },
        audit: {
          warn: false,
          text:
            lang === "el"
              ? "Το σχέδιό σας συνάδει με την πρόταση."
              : "Your plan aligns with the recommendation.",
        },
        assumptions: assumptionsFor("ANOVA", a.assumptions, lang),
        code: {
          spss: L(lang, [SPSS.aov1, SPSS.aov2]),
          jamovi: L(lang, [JAM.aov1, JAM.aov2]),
          r: `mod <- aov(Y ~ group, data = df)\nsummary(mod)\nTukeyHSD(mod)`,
        },
      };
    }
  }

  // ---- Fallback
  return {
    method: pick(lang, M.descriptive),
    fit: "Conditional",
    summary:
      lang === "el"
        ? "Οι απαντήσεις σας δεν αντιστοιχούν σε ενιαία κανονική ανάλυση σε αυτό το πρωτότυπο. Παρέχετε περισσότερες πληροφορίες για τον τύπο έκβασης, τον σχεδιασμό και τη δομή ομάδων για συγκεκριμένη πρόταση."
        : "Your inputs did not match a single canonical test in this prototype. Provide additional information about outcome type, design, and group structure to obtain a specific recommendation.",
    reasons:
      lang === "el"
        ? ["Ανεπαρκής εξειδίκευση στον συνδυασμό απαντήσεων."]
        : ["Insufficient specificity in the combination of answers."],
    alternative: {
      method: pick(lang, M.meet_statistician),
      when:
        lang === "el"
          ? "Για μη τυπικούς σχεδιασμούς, πολυεπίπεδα δεδομένα ή έντονη έλλειψη τιμών."
          : "For non-standard designs, multilevel data, or missing-data-heavy studies.",
    },
    audit: {
      warn: false,
      text: lang === "el" ? "Δεν εντοπίστηκε σύγκρουση." : "No conflict identified.",
    },
    assumptions: [A(lang, "independence", "must-check")],
    code: {
      spss: L(lang, [SPSS.desc]),
      jamovi: L(lang, [JAM.desc]),
      r: `summary(df); psych::describe(df)`,
    },
  };
}

// Suppress unused-var warning for helper t
void t;
