export type AnalysisGoal = 'difference' | 'association' | 'prediction' | 'mediation' | 'moderation'
export type StudyProfile = {
  researchQuestion: string
  goal: AnalysisGoal
  design: 'observational' | 'experimental' | 'quasi-experimental'
  measurement: 'single' | 'independent' | 'paired'
  groups: number
  outcomeType: 'continuous' | 'binary' | 'ordinal' | 'categorical' | 'count'
  modelComponent: 'none' | 'covariates' | 'mediator' | 'moderator'
  sampleSize: number
  assumptions: 'unknown' | 'met' | 'violated'
  plannedAnalysis: string
}

export type Recommendation = {
  primary: string; fit: 'Strong' | 'Conditional'; summary: string; reasons: string[]
  alternative: string; alternativeReason: string; audit: string; assumptions: string[]
  software: { spss: string; jamovi: string; r: string }
}

export const defaultStudyProfile: StudyProfile = {
  researchQuestion: '', goal: 'difference', design: 'quasi-experimental', measurement: 'independent', groups: 2,
  outcomeType: 'continuous', modelComponent: 'covariates', sampleSize: 100, assumptions: 'unknown', plannedAnalysis: '',
}

const normality = ['Independence of observations', 'Normality of model residuals', 'Homoscedasticity', 'Influential outliers']

export function getRecommendation(p: StudyProfile): Recommendation {
  if (p.goal === 'mediation' || p.modelComponent === 'mediator') return mediation(p)
  if (p.goal === 'moderation' || p.modelComponent === 'moderator') return moderation(p)
  if (p.goal === 'association') return association(p)
  if (p.goal === 'prediction') return prediction(p)
  return difference(p)
}

function difference(p: StudyProfile): Recommendation {
  if (p.outcomeType === 'continuous' && p.groups === 2 && p.modelComponent === 'covariates') {
    return base(p, 'ANCOVA', 'Estimates the adjusted group difference while accounting for relevant baseline or background covariates.',
      ['The outcome is continuous.', 'There are two independent comparison groups.', 'Your design includes one or more covariates.'],
      p.assumptions === 'violated' ? 'Robust linear regression with bootstrap confidence intervals' : 'Multiple linear regression with a dummy-coded group variable',
      'This expresses the same adjusted comparison in regression form.',
      [...normality, 'Linearity between each covariate and the outcome', 'Homogeneity of regression slopes'],
      'Analyze → General Linear Model → Univariate. Add group as Fixed Factor and baseline score as Covariate.',
      'Analyses → ANOVA → ANCOVA. Add the outcome, fixed factor, and covariates.',
      'model <- lm(outcome_post ~ group + outcome_pre, data = df)\nsummary(model)')
  }
  if (p.outcomeType === 'continuous' && p.groups === 2 && p.measurement === 'paired') {
    const primary = p.assumptions === 'violated' ? 'Wilcoxon signed-rank test' : 'Paired-samples t-test'
    return base(p, primary, 'Compares two related measurements from the same participants or matched pairs.',
      ['The two measurements are dependent.', 'The outcome is measured on a continuous scale.'],
      primary.startsWith('Wilcoxon') ? 'Paired-samples t-test' : 'Wilcoxon signed-rank test', 'Use this if the distributional conditions support the alternative.',
      ['Correct pairing of observations', 'Distribution and outliers of within-person difference scores'],
      'Analyze → Compare Means → Paired-Samples T Test.', 'Analyses → T-Tests → Paired Samples T-Test.', 't.test(df$pre, df$post, paired = TRUE)')
  }
  if (p.outcomeType === 'continuous' && p.groups === 2) {
    const primary = p.assumptions === 'violated' ? 'Mann–Whitney U test' : 'Independent-samples t-test'
    return base(p, primary, 'Compares a continuous outcome across two independent groups.',
      ['There are exactly two independent groups.', 'The outcome is continuous.'], 'Welch’s t-test', 'Prefer Welch’s test when group variances or sample sizes differ.',
      [...normality, 'Comparable outcome measurement across groups'], 'Analyze → Compare Means → Independent-Samples T Test.', 'Analyses → T-Tests → Independent Samples T-Test.', 't.test(outcome ~ group, data = df, var.equal = FALSE)')
  }
  if (p.outcomeType === 'continuous' && p.groups >= 3) {
    return base(p, p.assumptions === 'violated' ? 'Kruskal–Wallis test' : 'One-way ANOVA', 'Compares a continuous outcome across three or more independent groups.',
      ['The outcome is continuous.', 'There are three or more independent groups.'], 'Welch ANOVA', 'A robust parametric alternative when variances differ.',
      normality, 'Analyze → Compare Means → One-Way ANOVA.', 'Analyses → ANOVA → One-Way ANOVA.', 'oneway.test(outcome ~ group, data = df)')
  }
  return base(p, 'Chi-square test of independence', 'Tests whether two categorical variables are associated.',
    ['The outcome and grouping variable are categorical.'], 'Fisher’s exact test', 'Use when expected cell counts are small.',
    ['Independent observations', 'Adequate expected cell counts'], 'Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square.', 'Frequencies → Contingency Tables → Independent Samples.', 'chisq.test(table(df$group, df$outcome))')
}

function association(p: StudyProfile): Recommendation {
  const nonparametric = p.assumptions === 'violated' || p.outcomeType === 'ordinal'
  return base(p, nonparametric ? 'Spearman rank correlation' : 'Pearson correlation', 'Quantifies the direction and strength of association between two variables.',
    ['The goal is association rather than group comparison or causal prediction.', nonparametric ? 'Ordinal data or violated assumptions favor a rank-based method.' : 'The variables are treated as continuous.'],
    nonparametric ? 'Kendall’s tau' : 'Spearman rank correlation', 'Use as a rank-based sensitivity analysis.',
    nonparametric ? ['Independent paired observations', 'Monotonic relationship'] : ['Independent paired observations', 'Linear relationship', 'Bivariate outliers', 'Approximate bivariate normality'],
    `Analyze → Correlate → Bivariate → ${nonparametric ? 'Spearman' : 'Pearson'}.`, `Regression → Correlation Matrix → ${nonparametric ? 'Spearman' : 'Pearson'}.`, `cor.test(df$x, df$y, method = "${nonparametric ? 'spearman' : 'pearson'}")`)
}

function prediction(p: StudyProfile): Recommendation {
  const primary = p.outcomeType === 'binary' ? 'Binary logistic regression' : p.outcomeType === 'count' ? 'Poisson regression' : 'Multiple linear regression'
  return base(p, primary, 'Models an outcome from one or more predictors while estimating their adjusted contributions.',
    [`The analytical goal is prediction or explanation.`, `The outcome is ${p.outcomeType}.`],
    p.outcomeType === 'count' ? 'Negative binomial regression' : 'Bootstrap regression', 'Use when dispersion or model assumptions make the primary model unreliable.',
    ['Appropriate outcome distribution and link function', 'Linearity on the model scale', 'Multicollinearity', 'Influential observations', 'Adequate events or observations per parameter'],
    p.outcomeType === 'binary' ? 'Analyze → Regression → Binary Logistic.' : 'Analyze → Regression → Linear.',
    p.outcomeType === 'binary' ? 'Regression → Logistic Regression.' : 'Regression → Linear Regression.',
    p.outcomeType === 'binary' ? 'model <- glm(outcome ~ x1 + x2, family = binomial, data = df)' : 'model <- lm(outcome ~ x1 + x2, data = df)')
}

function mediation(p: StudyProfile): Recommendation {
  return base(p, 'Bootstrap mediation analysis (PROCESS Model 4)', 'Estimates whether the association between X and Y is transmitted through a proposed mediator.',
    ['The research question explicitly proposes an indirect pathway.', 'The model contains a predictor, mediator, and outcome.'],
    'Path analysis / SEM', 'Useful for latent variables or multiple simultaneous pathways when sample size and measurement quality are adequate.',
    ['Correct temporal and theoretical ordering', 'Linearity and independence', 'No severe multicollinearity', 'Reliable measurement', 'Bootstrap confidence interval for the indirect effect'],
    'Analyze → Regression → PROCESS → Model 4. Assign X, M, and Y; request bootstrap confidence intervals.',
    'Install the medmod module → Mediation → Simple Mediation; request bootstrap intervals.',
    'library(lavaan)\nmodel <- "M ~ a*X; Y ~ b*M + c*X; indirect := a*b"\nfit <- sem(model, data=df, se="bootstrap")')
}

function moderation(p: StudyProfile): Recommendation {
  return base(p, 'Moderation analysis (PROCESS Model 1)', 'Tests whether the association between X and Y changes across values of a moderator.',
    ['The research question proposes a conditional effect.', 'The model contains a predictor, moderator, and interaction term.'],
    'Multiple regression with an interaction term', 'Equivalent regression formulation that makes the interaction explicit.',
    ['Correctly specified interaction', 'Linearity', 'Independent errors', 'Homoscedasticity', 'Influential observations', 'Meaningful probing of conditional effects'],
    'Analyze → Regression → PROCESS → Model 1. Assign X, W, and Y; request Johnson–Neyman output.',
    'Regression → Linear Regression; include X, W, and their interaction.',
    'model <- lm(Y ~ X * W, data = df)\nsummary(model)')
}

function base(p: StudyProfile, primary: string, summary: string, reasons: string[], alternative: string, alternativeReason: string, assumptions: string[], spss: string, jamovi: string, r: string): Recommendation {
  const planned = p.plannedAnalysis.trim()
  const matches = planned && normalize(primary).includes(normalize(planned)) || planned && normalize(planned).includes(normalize(primary))
  const audit = !planned ? `No planned analysis was supplied. The recommendation follows from the study structure you described.`
    : matches ? `Your planned ${planned} is consistent with this recommendation. Confirm every listed assumption before interpreting the result.`
    : `Your planned ${planned} does not align with the primary recommendation. Re-check whether it accounts for the outcome scale, measurement structure, groups, and model components described above.`
  return { primary, fit: p.assumptions === 'unknown' ? 'Conditional' : 'Strong', summary, reasons, alternative, alternativeReason, assumptions, software: { spss, jamovi, r }, audit }
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
