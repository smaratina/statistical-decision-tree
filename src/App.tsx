import { useMemo, useState } from 'react'
import './App.css'
import {
  defaultStudyProfile,
  getRecommendation,
  type AnalysisGoal,
  type StudyProfile,
} from './decision/engine'

const goalOptions: { value: AnalysisGoal; label: string; hint: string }[] = [
  { value: 'difference', label: 'Compare groups', hint: 'Do groups or measurements differ?' },
  { value: 'association', label: 'Test an association', hint: 'Are two variables related?' },
  { value: 'prediction', label: 'Predict an outcome', hint: 'Which variables explain an outcome?' },
  { value: 'mediation', label: 'Test mediation', hint: 'Does a mediator explain how X affects Y?' },
  { value: 'moderation', label: 'Test moderation', hint: 'Does an effect depend on another variable?' },
]

const steps = ['Research goal', 'Study design', 'Variables', 'Sample', 'Planned test', 'Decision']

function App() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<StudyProfile>(defaultStudyProfile)
  const recommendation = useMemo(() => getRecommendation(profile), [profile])

  const update = <K extends keyof StudyProfile>(key: K, value: StudyProfile[K]) =>
    setProfile((current) => ({ ...current, [key]: value }))

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1))
  const back = () => setStep((current) => Math.max(current - 1, 0))
  const restart = () => {
    setProfile(defaultStudyProfile)
    setStep(0)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={restart} aria-label="Statistical Decision Tree home">
          <span className="brand-mark">Σ</span>
          <span><strong>Statistical</strong> Decision Tree</span>
        </button>
        <span className="beta-pill">Research beta</span>
      </header>

      <main>
        <section className="intro">
          <p className="eyebrow">Evidence-aware statistical guidance</p>
          <h1>Turn your research question into a defensible analysis plan.</h1>
          <p>Answer a short, adaptive interview. Get a primary method, alternatives, assumptions, and an audit of the analysis you planned to use.</p>
        </section>

        <nav className="progress" aria-label="Assessment progress">
          {steps.map((label, index) => (
            <div className={`progress-step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`} key={label}>
              <span>{index < step ? '✓' : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </nav>

        <section className="workspace-card">
          {step === 0 && (
            <Step title="What are you trying to find out?" subtitle="Start with your question, then select its primary analytical goal.">
              <label className="field-label" htmlFor="question">Research question</label>
              <textarea id="question" value={profile.researchQuestion} onChange={(e) => update('researchQuestion', e.target.value)} placeholder="e.g. Does self-regulated learning mediate the relationship between achievement goals and social-emotional learning?" />
              <div className="option-grid">
                {goalOptions.map((option) => (
                  <button key={option.value} className={`choice-card ${profile.goal === option.value ? 'selected' : ''}`} onClick={() => update('goal', option.value)}>
                    <strong>{option.label}</strong><span>{option.hint}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="How is the study designed?" subtitle="The same research question can require a different method under a different design.">
              <Choice label="Study design" value={profile.design} onChange={(value) => update('design', value as StudyProfile['design'])} options={[
                ['observational', 'Observational / survey'], ['experimental', 'Experimental'], ['quasi-experimental', 'Quasi-experimental'],
              ]} />
              <Choice label="Measurement structure" value={profile.measurement} onChange={(value) => update('measurement', value as StudyProfile['measurement'])} options={[
                ['single', 'One measurement'], ['independent', 'Independent groups'], ['paired', 'Paired / pre–post'],
              ]} />
              <Choice label="Number of groups" value={String(profile.groups)} onChange={(value) => update('groups', Number(value))} options={[
                ['1', 'One'], ['2', 'Two'], ['3', 'Three or more'],
              ]} />
            </Step>
          )}

          {step === 2 && (
            <Step title="Describe the outcome and model" subtitle="Focus on the scale of the dependent variable and the roles in your model.">
              <Choice label="Outcome variable type" value={profile.outcomeType} onChange={(value) => update('outcomeType', value as StudyProfile['outcomeType'])} options={[
                ['continuous', 'Continuous'], ['binary', 'Binary'], ['ordinal', 'Ordinal'], ['categorical', 'Nominal categorical'], ['count', 'Count'],
              ]} />
              <Choice label="Additional model components" value={profile.modelComponent} onChange={(value) => update('modelComponent', value as StudyProfile['modelComponent'])} options={[
                ['none', 'None'], ['covariates', 'Covariates'], ['mediator', 'Mediator'], ['moderator', 'Moderator'],
              ]} />
            </Step>
          )}

          {step === 3 && (
            <Step title="What do you know about the data?" subtitle="Unknown is a valid answer. The report will tell you what must be checked.">
              <label className="field-label" htmlFor="sample">Sample size (N)</label>
              <input id="sample" type="number" min="2" value={profile.sampleSize} onChange={(e) => update('sampleSize', Number(e.target.value))} />
              <Choice label="Parametric assumptions" value={profile.assumptions} onChange={(value) => update('assumptions', value as StudyProfile['assumptions'])} options={[
                ['unknown', 'Not checked / unknown'], ['met', 'Reasonably met'], ['violated', 'Violated'],
              ]} />
            </Step>
          )}

          {step === 4 && (
            <Step title="What analysis were you planning to use?" subtitle="This powers the Statistical Auditor. Choosing “Not sure” is completely fine.">
              <label className="field-label" htmlFor="planned">Planned analysis</label>
              <select id="planned" value={profile.plannedAnalysis} onChange={(e) => update('plannedAnalysis', e.target.value)}>
                <option value="">Not sure</option>
                <option>Independent-samples t-test</option><option>Paired-samples t-test</option><option>ANOVA</option>
                <option>ANCOVA</option><option>Pearson correlation</option><option>Linear regression</option>
                <option>Logistic regression</option><option>PROCESS Model 4</option><option>PROCESS Model 1</option>
              </select>
              <div className="privacy-note"><strong>Privacy by design</strong><span>This MVP asks about the structure of your study—not participant-level data.</span></div>
            </Step>
          )}

          {step === 5 && <DecisionReport profile={profile} recommendation={recommendation} />}

          <footer className="card-actions">
            {step > 0 && step < 5 && <button className="secondary" onClick={back}>Back</button>}
            {step < 5 && <button className="primary" onClick={next} disabled={step === 0 && !profile.researchQuestion.trim()}>Continue <span>→</span></button>}
            {step === 5 && <button className="secondary" onClick={restart}>Start a new assessment</button>}
          </footer>
        </section>
        <p className="disclaimer">Educational decision support only. Final analytical choices should reflect disciplinary standards and expert judgment.</p>
      </main>
    </div>
  )
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="step-content"><div className="step-heading"><h2>{title}</h2><p>{subtitle}</p></div>{children}</div>
}

function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <fieldset><legend>{label}</legend><div className="segmented">{options.map(([key, text]) => <button type="button" key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(key)}>{text}</button>)}</div></fieldset>
}

function DecisionReport({ profile, recommendation }: { profile: StudyProfile; recommendation: ReturnType<typeof getRecommendation> }) {
  const [tab, setTab] = useState<'overview' | 'assumptions' | 'software'>('overview')
  return <div className="report">
    <div className="report-header"><div><p className="eyebrow">Your statistical decision</p><h2>{recommendation.primary}</h2><p>{recommendation.summary}</p></div><div className="fit-score"><strong>{recommendation.fit}</strong><span>Recommendation fit</span></div></div>
    <div className="report-tabs">{(['overview', 'assumptions', 'software'] as const).map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item === 'software' ? 'How to run it' : item[0].toUpperCase() + item.slice(1)}</button>)}</div>
    {tab === 'overview' && <div className="report-grid">
      <article><span className="card-kicker good">Why it fits</span><ul>{recommendation.reasons.map((x) => <li key={x}>{x}</li>)}</ul></article>
      <article><span className="card-kicker">Alternative</span><h3>{recommendation.alternative}</h3><p>{recommendation.alternativeReason}</p></article>
      <article className="wide"><span className="card-kicker audit">Statistical Auditor</span><h3>{profile.plannedAnalysis || 'No analysis selected'}</h3><p>{recommendation.audit}</p></article>
    </div>}
    {tab === 'assumptions' && <div className="assumption-list">{recommendation.assumptions.map((x) => <div key={x}><span>Must check</span><p>{x}</p></div>)}</div>}
    {tab === 'software' && <div className="software-grid">
      <article><strong>SPSS</strong><p>{recommendation.software.spss}</p></article>
      <article><strong>Jamovi</strong><p>{recommendation.software.jamovi}</p></article>
      <article><strong>R</strong><pre><code>{recommendation.software.r}</code></pre></article>
    </div>}
  </div>
}

export default App
