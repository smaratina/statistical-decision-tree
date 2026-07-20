import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  decide,
  type Answers,
  type Assumptions,
  type Design,
  type Goal,
  type Groups,
  type Measurement,
  type ModelExtra,
  type Outcome,
  type Planned,
  type Recommendation,
} from "@/lib/decision";
import { dicts, detectInitialLang, LANG_KEY, type Lang, type Translations } from "@/lib/i18n";
import { getAiExplanation, type AiExplanation } from "@/lib/ai-explanation";

export const Route = createFileRoute("/")({
  component: App,
});

type View = "landing" | "assessment" | "report";

const EXAMPLE: Answers = {
  question:
    "Does self-regulated learning mediate the relationship between achievement goals and social-emotional learning?",
  goal: "mediation",
  design: "observational",
  measurement: "one",
  groups: "one",
  outcome: "continuous",
  extra: "mediator",
  sampleSize: 94,
  assumptions: "unknown",
  planned: "linear_reg",
};

const EXAMPLE_EL: Answers = {
  ...EXAMPLE,
  question:
    "Διαμεσολαβεί η αυτορρυθμιζόμενη μάθηση στη σχέση μεταξύ στόχων επίτευξης και κοινωνικο-συναισθηματικής μάθησης;",
};

const emptyAnswers: Answers = { question: "" };

function App() {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.title =
        lang === "el"
          ? "Statistical Decision Tree — Σχέδιο Στατιστικής Ανάλυσης"
          : "Statistical Decision Tree — Analysis Plan";
    }
  }, [lang]);

  const t = dicts[lang];
  const [view, setView] = useState<View>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const startNew = () => {
    setAnswers(emptyAnswers);
    setStep(0);
    setView("assessment");
  };
  const viewExample = () => {
    setAnswers(lang === "el" ? EXAMPLE_EL : EXAMPLE);
    setStep(5);
    setView("report");
  };
  const goHome = () => {
    setAnswers(emptyAnswers);
    setStep(0);
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        onNew={startNew}
        onLogo={goHome}
        showNew={view !== "landing"}
      />
      <main>
        {view === "landing" && <Landing t={t} onStart={startNew} onExample={viewExample} />}
        {view === "assessment" && (
          <Assessment
            t={t}
            lang={lang}
            step={step}
            setStep={setStep}
            answers={answers}
            setAnswers={setAnswers}
            onComplete={() => setView("report")}
          />
        )}
        {view === "report" && (
          <Report
            t={t}
            lang={lang}
            answers={answers}
            onRestart={startNew}
            onEdit={() => setView("assessment")}
          />
        )}
      </main>
      <Footer t={t} />
    </div>
  );
}

/* ---------- Header ---------- */

function LangSwitcher({
  t,
  lang,
  setLang,
}: {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="no-print inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs font-semibold">
      <button
        type="button"
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={[
          "rounded-md px-2.5 py-1 transition",
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        {t.langEn}
      </button>
      <span className="px-1 text-muted-foreground/50" aria-hidden>
        |
      </span>
      <button
        type="button"
        aria-label="Εναλλαγή στα Ελληνικά"
        aria-pressed={lang === "el"}
        onClick={() => setLang("el")}
        className={[
          "rounded-md px-2.5 py-1 transition",
          lang === "el"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        {t.langEl}
      </button>
    </div>
  );
}

function Header({
  t,
  lang,
  setLang,
  onNew,
  onLogo,
  showNew,
}: {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
  onNew: () => void;
  onLogo: () => void;
  showNew: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur no-print">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <button onClick={onLogo} className="flex min-w-0 items-center gap-3 text-left">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground shadow-card">
            Σ
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-[15px] font-bold text-foreground">
              Statistical Decision Tree
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {t.brandTagline}
            </span>
          </span>
          <span className="ml-1 hidden shrink-0 rounded-full border border-accent/25 bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent sm:inline">
            {t.researchBeta}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <LangSwitcher t={t} lang={lang} setLang={setLang} />
          {showNew && (
            <button
              onClick={onNew}
              className="hidden sm:inline-flex shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-accent hover:text-accent"
            >
              {t.startNew}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------- Landing ---------- */

function Landing({
  t,
  onStart,
  onExample,
}: {
  t: Translations;
  onStart: () => void;
  onExample: () => void;
}) {
  return (
    <section className="container-page pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-secondary px-3 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t.evidenceBadge}
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl md:text-6xl">
          {t.heroTitle1} <span className="text-accent">{t.heroTitleAccent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.heroLede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onStart}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:bg-primary/90"
          >
            {t.startAssessment}
          </button>
          <button
            onClick={onExample}
            className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            {t.viewExample}
          </button>
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        <ValueCard n="01" title={t.value1Title} body={t.value1Body} />
        <ValueCard n="02" title={t.value2Title} body={t.value2Body} />
        <ValueCard n="03" title={t.value3Title} body={t.value3Body} />
      </div>
    </section>
  );
}

function ValueCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="font-mono text-xs text-accent">{n}</div>
      <h3 className="mt-3 font-display text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/* ---------- Assessment ---------- */

function Assessment({
  t,
  lang,
  step,
  setStep,
  answers,
  setAnswers,
  onComplete,
}: {
  t: Translations;
  lang: Lang;
  step: number;
  setStep: (n: number) => void;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onComplete: () => void;
}) {
  const update = (patch: Partial<Answers>) => setAnswers({ ...answers, ...patch });

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return answers.question.trim().length >= 8 && !!answers.goal;
      case 1:
        return !!answers.design && !!answers.measurement && !!answers.groups;
      case 2:
        return !!answers.outcome && !!answers.extra;
      case 3:
        return !!answers.sampleSize && answers.sampleSize > 0 && !!answers.assumptions;
      case 4:
        return !!answers.planned;
      default:
        return true;
    }
  }, [step, answers]);

  const [showError, setShowError] = useState(false);
  useEffect(() => setShowError(false), [step]);

  const next = () => {
    if (!canContinue) {
      setShowError(true);
      return;
    }
    if (step === 4) onComplete();
    else setStep(step + 1);
  };

  return (
    <section className="container-page pt-8 pb-24">
      <Stepper t={t} current={step} onJump={(i) => i < step && setStep(i)} />

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10">
        {step === 0 && <Step1 t={t} answers={answers} update={update} showError={showError} />}
        {step === 1 && <Step2 t={t} answers={answers} update={update} showError={showError} />}
        {step === 2 && <Step3 t={t} answers={answers} update={update} showError={showError} />}
        {step === 3 && <Step4 t={t} answers={answers} update={update} showError={showError} />}
        {step === 4 && (
          <Step5 t={t} lang={lang} answers={answers} update={update} showError={showError} />
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
          >
            {t.back}
          </button>
          <div className="flex items-center gap-3">
            {showError && !canContinue && (
              <span className="text-sm text-destructive">{t.completeFields}</span>
            )}
            <button
              onClick={next}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:bg-primary/90"
            >
              {step === 4 ? t.generateReport : t.continueLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stepper({
  t,
  current,
  onJump,
}: {
  t: Translations;
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
      {t.steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        return (
          <li key={i}>
            <button
              onClick={() => onJump(i)}
              disabled={i >= current}
              className={[
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition",
                state === "current" && "border-accent bg-secondary text-accent",
                state === "done" &&
                  "border-border bg-card text-foreground hover:border-accent hover:text-accent",
                state === "upcoming" &&
                  "border-dashed border-border bg-transparent text-muted-foreground",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span
                className={[
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold",
                  state === "current" && "bg-accent text-accent-foreground",
                  state === "done" && "bg-primary text-primary-foreground",
                  state === "upcoming" &&
                    "border border-border bg-transparent text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span className="truncate text-[12px] font-medium">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Individual steps ---------- */

function StepHead({
  t,
  n,
  title,
  subtitle,
}: {
  t: Translations;
  n: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="font-mono text-xs uppercase tracking-widest text-accent">
        {t.stepOf(n)} · {t.steps[n - 1]}
      </div>
      <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}

function Step1({
  t,
  answers,
  update,
  showError,
}: {
  t: Translations;
  answers: Answers;
  update: (p: Partial<Answers>) => void;
  showError: boolean;
}) {
  const qBad = showError && answers.question.trim().length < 8;
  const goalIds: Goal[] = ["compare", "association", "predict", "mediation", "moderation"];
  return (
    <>
      <StepHead t={t} n={1} title={t.s1Title} subtitle={t.s1Sub} />
      <label className="mb-2 block text-sm font-medium text-foreground">
        {t.researchQuestionLabel}
      </label>
      <textarea
        value={answers.question}
        onChange={(e) => update({ question: e.target.value })}
        rows={4}
        placeholder={t.researchQuestionPlaceholder}
        className={[
          "w-full resize-none rounded-xl border bg-background px-4 py-3 font-sans text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2",
          qBad
            ? "border-destructive focus:ring-destructive/30"
            : "border-border focus:border-accent focus:ring-accent/25",
        ].join(" ")}
      />
      {qBad && <p className="mt-1.5 text-xs text-destructive">{t.qBad}</p>}

      <div className="mt-8">
        <div className="mb-3 text-sm font-medium text-foreground">{t.primaryIntent}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goalIds.map((id) => (
            <SelectCard
              key={id}
              selected={answers.goal === id}
              onClick={() => update({ goal: id })}
              title={t.goals[id].label}
              body={t.goals[id].hint}
            />
          ))}
        </div>
        {showError && !answers.goal && (
          <p className="mt-2 text-xs text-destructive">{t.goalMissing}</p>
        )}
      </div>
    </>
  );
}

function Step2({
  t,
  answers,
  update,
  showError,
}: {
  t: Translations;
  answers: Answers;
  update: (p: Partial<Answers>) => void;
  showError: boolean;
}) {
  return (
    <>
      <StepHead t={t} n={2} title={t.s2Title} subtitle={t.s2Sub} />
      <FieldGroup t={t} label={t.studyDesign} error={showError && !answers.design}>
        {(["observational", "experimental", "quasi"] as Design[]).map((v) => (
          <ChipButton key={v} selected={answers.design === v} onClick={() => update({ design: v })}>
            {t.design[v]}
          </ChipButton>
        ))}
      </FieldGroup>

      <FieldGroup t={t} label={t.measurementStructure} error={showError && !answers.measurement}>
        {(["one", "independent", "paired"] as Measurement[]).map((v) => (
          <ChipButton
            key={v}
            selected={answers.measurement === v}
            onClick={() => update({ measurement: v })}
          >
            {t.measurement[v]}
          </ChipButton>
        ))}
      </FieldGroup>

      <FieldGroup t={t} label={t.numberOfGroups} error={showError && !answers.groups}>
        {(["one", "two", "threeplus"] as Groups[]).map((v) => (
          <ChipButton key={v} selected={answers.groups === v} onClick={() => update({ groups: v })}>
            {t.groups[v]}
          </ChipButton>
        ))}
      </FieldGroup>
    </>
  );
}

function Step3({
  t,
  answers,
  update,
  showError,
}: {
  t: Translations;
  answers: Answers;
  update: (p: Partial<Answers>) => void;
  showError: boolean;
}) {
  const outcomeIds: Outcome[] = ["continuous", "binary", "ordinal", "nominal", "count"];
  const extraIds: ModelExtra[] = ["none", "covariates", "mediator", "moderator"];
  return (
    <>
      <StepHead t={t} n={3} title={t.s3Title} subtitle={t.s3Sub} />
      <FieldGroup t={t} label={t.outcomeType} error={showError && !answers.outcome}>
        {outcomeIds.map((id) => (
          <SelectCard
            key={id}
            selected={answers.outcome === id}
            onClick={() => update({ outcome: id })}
            title={t.outcomes[id].label}
            body={t.outcomes[id].hint}
            compact
          />
        ))}
      </FieldGroup>
      <FieldGroup t={t} label={t.extraComponents} error={showError && !answers.extra}>
        {extraIds.map((id) => (
          <SelectCard
            key={id}
            selected={answers.extra === id}
            onClick={() => update({ extra: id })}
            title={t.extras[id].label}
            body={t.extras[id].hint}
            compact
          />
        ))}
      </FieldGroup>
    </>
  );
}

function Step4({
  t,
  answers,
  update,
  showError,
}: {
  t: Translations;
  answers: Answers;
  update: (p: Partial<Answers>) => void;
  showError: boolean;
}) {
  const assumpIds: Assumptions[] = ["unknown", "met", "violated"];
  const sizeBad = showError && (!answers.sampleSize || answers.sampleSize <= 0);
  return (
    <>
      <StepHead t={t} n={4} title={t.s4Title} subtitle={t.s4Sub} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{t.sampleSize}</label>
          <input
            type="number"
            min={1}
            value={answers.sampleSize ?? ""}
            onChange={(e) =>
              update({ sampleSize: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="94"
            className={[
              "w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground focus:outline-none focus:ring-2",
              sizeBad
                ? "border-destructive focus:ring-destructive/30"
                : "border-border focus:border-accent focus:ring-accent/25",
            ].join(" ")}
          />
          {sizeBad && <p className="mt-1.5 text-xs text-destructive">{t.sampleSizeBad}</p>}
        </div>
      </div>
      <FieldGroup t={t} label={t.assumptionStatus} error={showError && !answers.assumptions}>
        {assumpIds.map((id) => (
          <SelectCard
            key={id}
            selected={answers.assumptions === id}
            onClick={() => update({ assumptions: id })}
            title={t.assumps[id].label}
            body={t.assumps[id].hint}
            compact
          />
        ))}
      </FieldGroup>
    </>
  );
}

function Step5({
  t,
  answers,
  update,
  showError,
}: {
  t: Translations;
  lang: Lang;
  answers: Answers;
  update: (p: Partial<Answers>) => void;
  showError: boolean;
}) {
  const opts: Planned[] = [
    "not_sure",
    "ind_ttest",
    "paired_ttest",
    "anova",
    "ancova",
    "pearson",
    "linear_reg",
    "logistic_reg",
    "process4",
    "process1",
  ];
  return (
    <>
      <StepHead t={t} n={5} title={t.s5Title} subtitle={t.s5Sub} />
      <label className="mb-2 block text-sm font-medium text-foreground">{t.plannedAnalysis}</label>
      <select
        value={answers.planned ?? ""}
        onChange={(e) => update({ planned: e.target.value as Planned })}
        className={[
          "w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground focus:outline-none focus:ring-2",
          showError && !answers.planned
            ? "border-destructive focus:ring-destructive/30"
            : "border-border focus:border-accent focus:ring-accent/25",
        ].join(" ")}
      >
        <option value="" disabled>
          {t.plannedPlaceholder}
        </option>
        {opts.map((id) => (
          <option key={id} value={id}>
            {t.plannedOpts[id]}
          </option>
        ))}
      </select>
      {showError && !answers.planned && (
        <p className="mt-1.5 text-xs text-destructive">{t.plannedMissing}</p>
      )}

      <div className="mt-8 rounded-2xl border border-accent/25 bg-secondary p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            🔒
          </span>
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold text-primary">{t.privacyTitle}</div>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">{t.privacyBody}</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Shared UI ---------- */

function FieldGroup({
  t,
  label,
  error,
  children,
}: {
  t: Translations;
  label: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 first:mt-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {error && <span className="text-xs text-destructive">{t.required}</span>}
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        selected
          ? "border-accent bg-secondary text-accent shadow-sm"
          : "border-border bg-card text-foreground hover:border-accent/60 hover:text-accent",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SelectCard({
  selected,
  onClick,
  title,
  body,
  compact,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  body: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex flex-col items-start rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        compact ? "min-w-[220px] flex-1" : "",
        selected
          ? "border-accent bg-secondary shadow-sm"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span
          className={[
            "font-display text-[15px] font-semibold",
            selected ? "text-accent" : "text-primary",
          ].join(" ")}
        >
          {title}
        </span>
        <span
          className={[
            "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
            selected
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-transparent",
          ].join(" ")}
        >
          {selected && <span className="text-[10px]">✓</span>}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </button>
  );
}

/* ---------- Report ---------- */

function fitLabel(t: Translations, fit: Recommendation["fit"]) {
  return fit === "Strong" ? t.fitStrong : t.fitConditional;
}

function statusText(t: Translations, s: Recommendation["assumptions"][number]["status"]) {
  return s === "must-check"
    ? t.statusMustCheck
    : s === "satisfied"
      ? t.statusSatisfied
      : s === "not-satisfied"
        ? t.statusNotSatisfied
        : t.statusUnknown;
}

function buildReportText(t: Translations, answers: Answers, rec: Recommendation): string {
  const h = t.reportHeadings;
  const lines: string[] = [];
  lines.push(`# ${t.analysisPlan}`);
  lines.push("");
  if (answers.question) {
    lines.push(`## ${h.question}`);
    lines.push(answers.question);
    lines.push("");
  }
  lines.push(`## ${h.primary}`);
  lines.push(`${rec.method}  —  ${t.fitLabel}: ${fitLabel(t, rec.fit)}`);
  lines.push("");
  lines.push(rec.summary);
  lines.push("");
  lines.push(`## ${h.reasons}`);
  rec.reasons.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
  lines.push("");
  lines.push(`## ${h.alternative}`);
  lines.push(`${rec.alternative.method}`);
  lines.push(`${t.whenToConsider} ${rec.alternative.when}`);
  lines.push("");
  lines.push(`## ${h.auditor}${rec.audit.warn ? " — " + t.attention : ""}`);
  lines.push(rec.audit.text);
  lines.push("");
  lines.push(`## ${h.assumptions}`);
  rec.assumptions.forEach((a) =>
    lines.push(`- [${statusText(t, a.status)}] ${a.name} — ${a.note}`),
  );
  lines.push("");
  lines.push(`## ${h.spss}`);
  rec.code.spss.forEach((s, i) => lines.push(`${String(i + 1).padStart(2, "0")}. ${s}`));
  lines.push("");
  lines.push(`## ${h.jamovi}`);
  rec.code.jamovi.forEach((s, i) => lines.push(`${String(i + 1).padStart(2, "0")}. ${s}`));
  lines.push("");
  lines.push(`## ${h.r}`);
  lines.push(rec.code.r);
  lines.push("");
  lines.push(`---`);
  lines.push(t.disclaimer);
  return lines.join("\n");
}

function buildAuditLog(answers: Answers, rec: Recommendation, lang: Lang) {
  return {
    generatedAt: new Date().toISOString(),
    language: lang,
    tool: "Statistical Decision Tree",
    answers: {
      question: answers.question,
      goal: answers.goal ?? null,
      design: answers.design ?? null,
      measurement: answers.measurement ?? null,
      groups: answers.groups ?? null,
      outcome: answers.outcome ?? null,
      extra: answers.extra ?? null,
      sampleSize: answers.sampleSize ?? null,
      assumptions: answers.assumptions ?? null,
      planned: answers.planned ?? null,
    },
    recommendation: {
      method: rec.method,
      fit: rec.fit,
      summary: rec.summary,
      reasons: rec.reasons,
    },
    alternative: rec.alternative,
    auditor: rec.audit,
    plannedVsRecommended: {
      planned: answers.planned ?? null,
      recommended: rec.method,
      warn: rec.audit.warn,
    },
    assumptions: rec.assumptions.map((a) => ({ name: a.name, status: a.status, note: a.note })),
  };
}

function Report({
  t,
  lang,
  answers,
  onRestart,
  onEdit,
}: {
  t: Translations;
  lang: Lang;
  answers: Answers;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const rec = useMemo(() => decide(answers, lang), [answers, lang]);
  const [aiExplanation, setAiExplanation] = useState<AiExplanation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setAiExplanation(null);
    setAiError(null);
  }, [answers, lang]);

  const explainWithAi = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await getAiExplanation({
        data: {
          answers,
          recommendation: {
            method: rec.method,
            fit: rec.fit,
            reasons: rec.reasons,
            assumptions: rec.assumptions,
          },
          lang,
        },
      });
      setAiExplanation(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI_REQUEST_FAILED";
      setAiError(message.includes("AI_NOT_CONFIGURED") ? "not-configured" : "failed");
    } finally {
      setAiLoading(false);
    }
  };

  const copyReport = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildReportText(t, answers, rec));
      toast.success(t.copyReportSuccess);
    } catch {
      toast.error(t.copyReportFail);
    }
  }, [t, answers, rec]);

  const downloadAudit = useCallback(() => {
    const payload = buildAuditLog(answers, rec, lang);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statistical-decision-tree-audit-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t.auditDownloaded);
  }, [answers, rec, lang, t]);

  const doPrint = () => {
    if (typeof window === "undefined") return;
    if (typeof document !== "undefined") {
      document.title =
        lang === "el"
          ? "Statistical Decision Tree — Σχέδιο Στατιστικής Ανάλυσης"
          : "Statistical Decision Tree — Analysis Plan";
    }
    window.print();
  };

  return (
    <section className="container-page pt-8 pb-24">
      {/* Print-only report title */}
      <h1
        className="print-only font-display text-xl font-bold text-primary"
        style={{ marginBottom: "8px" }}
      >
        {lang === "el"
          ? "Statistical Decision Tree — Σχέδιο Στατιστικής Ανάλυσης"
          : "Statistical Decision Tree — Analysis Plan"}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent no-print">
            {t.stepOf(6)} · {t.decisionReport}
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary sm:text-4xl no-print">
            {t.analysisPlan}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button
            onClick={onEdit}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            {t.editAnswers}
          </button>
          <button
            onClick={onRestart}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elevated hover:bg-primary/90"
          >
            {t.startNew}
          </button>
        </div>
      </div>

      <ReportActions t={t} onPrint={doPrint} onCopy={copyReport} onDownload={downloadAudit} />

      <div className="print-block">
        <PrimaryRecommendation t={t} rec={rec} answers={answers} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 print-block">
        <ReasonsCard t={t} reasons={rec.reasons} />
        <AlternativeCard t={t} alt={rec.alternative} />
      </div>

      <div className="print-block">
        <AuditorCard t={t} lang={lang} rec={rec} answers={answers} />
      </div>
      <AiExplanationCard
        lang={lang}
        explanation={aiExplanation}
        loading={aiLoading}
        error={aiError}
        onGenerate={explainWithAi}
      />
      <div className="print-block">
        <AssumptionsCard t={t} items={rec.assumptions} />
      </div>
      <div className="print-block">
        <RunItCard t={t} rec={rec} />
        <p className="print-only print-disclaimer print-block mt-4 rounded-xl border border-dashed border-border bg-card/60 p-3 text-center text-[10pt] text-muted-foreground">
          {t.disclaimer}
        </p>
      </div>

      <ReportActions
        t={t}
        onPrint={doPrint}
        onCopy={copyReport}
        onDownload={downloadAudit}
        className="mt-8"
      />

      <p className="no-print mt-10 rounded-xl border border-dashed border-border bg-card/60 p-4 text-center text-xs text-muted-foreground">
        {t.disclaimer}
      </p>
    </section>
  );
}

function AiExplanationCard({
  lang,
  explanation,
  loading,
  error,
  onGenerate,
}: {
  lang: Lang;
  explanation: AiExplanation | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}) {
  const el = lang === "el";
  return (
    <section className="no-print mt-6 rounded-2xl border border-accent/25 bg-secondary/55 p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-lg font-semibold text-primary">
              {el ? "Επεξήγηση με Τεχνητή Νοημοσύνη" : "AI-powered explanation"}
            </h4>
            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground">
              GPT-5.6
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {el
              ? "Το GPT‑5.6 εξηγεί την πρόταση του ελεγχόμενου δέντρου αποφάσεων· δεν επιλέγει ούτε αντικαθιστά τη στατιστική μέθοδο."
              : "GPT‑5.6 explains the controlled decision tree output; it does not select or replace the statistical method."}
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {loading
            ? el
              ? "Δημιουργία…"
              : "Generating…"
            : el
              ? "Εξήγηση με GPT‑5.6"
              : "Explain with GPT‑5.6"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-warning/50 bg-warning/15 p-3 text-sm text-foreground"
        >
          {error === "not-configured"
            ? el
              ? "Η λειτουργία AI χρειάζεται το ασφαλές server secret OPENAI_API_KEY."
              : "The AI feature requires the secure OPENAI_API_KEY server secret."
            : el
              ? "Η επεξήγηση δεν ήταν διαθέσιμη. Δοκιμάστε ξανά."
              : "The explanation was unavailable. Please try again."}
        </p>
      )}

      {explanation && (
        <div className="mt-5 space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-foreground">{explanation.summary}</p>
          <AiList
            title={el ? "Πληροφορίες που χρειάζονται ακόμη" : "Information still needed"}
            items={explanation.missingInformation}
            empty={el ? "Δεν εντοπίστηκαν κρίσιμα κενά." : "No critical gaps were identified."}
          />
          <AiList
            title={el ? "Σημεία προσοχής" : "Cautions"}
            items={explanation.cautions}
            empty={
              el
                ? "Δεν προστέθηκαν επιπλέον προειδοποιήσεις."
                : "No additional cautions were added."
            }
          />
          <div>
            <h5 className="font-display text-sm font-semibold text-primary">
              {el ? "Επόμενο βήμα" : "Next step"}
            </h5>
            <p className="mt-1 text-sm text-foreground">{explanation.nextStep}</p>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {el
              ? "Παράχθηκε από GPT‑5.6 · Εκπαιδευτική υποστήριξη, όχι υποκατάστατο στατιστικού."
              : "Generated by GPT‑5.6 · Educational support, not a substitute for a statistician."}
          </p>
        </div>
      )}
    </section>
  );
}

function AiList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <h5 className="font-display text-sm font-semibold text-primary">{title}</h5>
      {items.length ? (
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}

function ReportActions({
  t,
  onPrint,
  onCopy,
  onDownload,
  className,
}: {
  t: Translations;
  onPrint: () => void;
  onCopy: () => void;
  onDownload: () => void;
  className?: string;
}) {
  return (
    <div
      className={[
        "no-print flex flex-wrap gap-2 rounded-2xl border border-border bg-card/60 p-3 mt-6",
        className ?? "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onPrint}
        aria-label={t.printPdf}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        🖨️ {t.printPdf}
      </button>
      <button
        type="button"
        onClick={onCopy}
        aria-label={t.copyFullReport}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        📋 {t.copyFullReport}
      </button>
      <button
        type="button"
        onClick={onDownload}
        aria-label={t.downloadAudit}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        ⬇️ {t.downloadAudit}
      </button>
    </div>
  );
}

function PrimaryRecommendation({
  t,
  rec,
  answers,
}: {
  t: Translations;
  rec: Recommendation;
  answers: Answers;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-primary/15 bg-primary text-primary-foreground shadow-elevated">
      <div className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0">
          <div className="font-mono text-xs uppercase tracking-widest text-mint/80">
            {t.primaryRecommendation}
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
            {rec.method}
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/85">
            {rec.summary}
          </p>
          {answers.question && (
            <p className="mt-4 border-l-2 border-accent/60 pl-3 text-sm italic text-primary-foreground/70">
              “{answers.question}”
            </p>
          )}
        </div>
        <div className="shrink-0 rounded-2xl border border-accent/40 bg-accent/15 p-4 text-center backdrop-blur">
          <div className="font-mono text-[10px] uppercase tracking-widest text-mint/80">
            {t.fitLabel}
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-mint">
            {fitLabel(t, rec.fit)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasonsCard({ t, reasons }: { t: Translations; reasons: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h4 className="font-display text-lg font-semibold text-primary">{t.whyItFits}</h4>
      <ul className="mt-4 space-y-3">
        {reasons.map((r, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary font-mono text-[10px] font-bold text-accent">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-foreground">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AlternativeCard({ t, alt }: { t: Translations; alt: Recommendation["alternative"] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h4 className="font-display text-lg font-semibold text-primary">{t.alternativeAnalysis}</h4>
      <div className="mt-3 rounded-xl border border-accent/20 bg-secondary px-4 py-3">
        <div className="font-display text-[15px] font-semibold text-accent">{alt.method}</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">{t.whenToConsider} </span>
        {alt.when}
      </p>
    </div>
  );
}

function AuditorCard({
  t,
  lang,
  rec,
  answers,
}: {
  t: Translations;
  lang: Lang;
  rec: Recommendation;
  answers: Answers;
}) {
  const warn = rec.audit.warn;
  return (
    <div
      className={[
        "mt-6 overflow-hidden rounded-2xl border shadow-card",
        warn ? "border-warning/60 bg-warning/10" : "border-border bg-card",
      ].join(" ")}
    >
      <div className="flex items-start gap-4 p-6">
        <div
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-xl font-bold",
            warn ? "bg-warning text-warning-foreground" : "bg-secondary text-accent",
          ].join(" ")}
        >
          {warn ? "!" : "✓"}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-lg font-semibold text-primary">{t.auditor}</h4>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                warn ? "bg-warning/30 text-warning-foreground" : "bg-secondary text-accent",
              ].join(" ")}
            >
              {warn ? t.attention : t.noConflict}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{rec.audit.text}</p>
          {answers.planned && (
            <div className="mt-4 grid gap-3 rounded-xl bg-card/60 p-4 sm:grid-cols-2">
              <MiniStat label={t.youPlanned} value={t.plannedOpts[answers.planned] ?? t.noPlan} />
              <MiniStat label={t.recommended} value={rec.method} strong />
            </div>
          )}
        </div>
      </div>
      {/* keep lang referenced for future extensibility */}
      <span className="sr-only" aria-hidden data-lang={lang} />
    </div>
  );
}

function MiniStat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={[
          "mt-1 text-sm leading-snug",
          strong ? "font-display font-semibold text-primary" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function AssumptionsCard({ t, items }: { t: Translations; items: Recommendation["assumptions"] }) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h4 className="font-display text-lg font-semibold text-primary">{t.assumptionsChecklist}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{t.assumptionsSub}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((a, i) => (
          <div key={i} className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-display text-[14px] font-semibold text-primary">{a.name}</div>
              <StatusBadge t={t} status={a.status} />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  t,
  status,
}: {
  t: Translations;
  status: Recommendation["assumptions"][number]["status"];
}) {
  const map = {
    "must-check": { text: t.statusMustCheck, cls: "bg-secondary text-accent" },
    satisfied: { text: t.statusSatisfied, cls: "bg-mint text-primary" },
    "not-satisfied": { text: t.statusNotSatisfied, cls: "bg-warning/25 text-warning-foreground" },
    unknown: { text: t.statusUnknown, cls: "bg-muted text-muted-foreground" },
  }[status];
  return (
    <span
      className={[
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map.cls,
      ].join(" ")}
    >
      {map.text}
    </span>
  );
}

function RunItCard({ t, rec }: { t: Translations; rec: Recommendation }) {
  const [tab, setTab] = useState<"spss" | "jamovi" | "r">("spss");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(rec.code.r);
      setCopied(true);
      toast.success(t.copied);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t.copyReportFail);
    }
  };
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-6 pb-4">
        <h4 className="font-display text-lg font-semibold text-primary">{t.howToRun}</h4>
        <div className="mt-4 flex gap-1 rounded-lg bg-muted p-1 no-print">
          {(["spss", "jamovi", "r"] as const).map((tid) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={[
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition",
                tab === tid
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tid === "r" ? "R" : tid === "spss" ? "SPSS" : "Jamovi"}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 pt-4">
        {tab === "r" ? (
          <div className="relative">
            <button
              onClick={copy}
              type="button"
              aria-label={t.copy}
              className="no-print absolute right-3 top-3 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {copied ? `${t.copied} ✓` : t.copy}
            </button>
            <pre className="overflow-x-auto rounded-xl border border-border bg-primary p-5 pr-20 font-mono text-[12.5px] leading-relaxed text-primary-foreground">
              <code>{rec.code.r}</code>
            </pre>
          </div>
        ) : (
          <ol className="space-y-2">
            {(tab === "spss" ? rec.code.spss : rec.code.jamovi).map((line, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-border bg-background/60 px-4 py-2.5"
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-foreground">{line}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer({ t }: { t: Translations }) {
  return (
    <footer className="border-t border-border bg-card/40 no-print">
      <div className="container-page flex flex-col items-start justify-between gap-2 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-primary font-display text-[11px] font-bold text-primary-foreground">
            Σ
          </span>
          <span>Statistical Decision Tree — {t.researchBeta}</span>
        </div>
        <div>{t.footerRight}</div>
      </div>
    </footer>
  );
}
