import { describe, expect, it } from 'vitest'
import { defaultStudyProfile, getRecommendation, type StudyProfile } from './engine'

const profile = (overrides: Partial<StudyProfile>): StudyProfile => ({ ...defaultStudyProfile, ...overrides })

describe('statistical decision engine', () => {
  it('recommends ANCOVA for two groups with a continuous outcome and covariates', () => {
    expect(getRecommendation(profile({ goal: 'difference', groups: 2, outcomeType: 'continuous', modelComponent: 'covariates' })).primary).toBe('ANCOVA')
  })

  it('recommends a paired t-test for paired continuous measurements', () => {
    expect(getRecommendation(profile({ measurement: 'paired', modelComponent: 'none', assumptions: 'met' })).primary).toBe('Paired-samples t-test')
  })

  it('switches to Wilcoxon when paired parametric assumptions are violated', () => {
    expect(getRecommendation(profile({ measurement: 'paired', modelComponent: 'none', assumptions: 'violated' })).primary).toBe('Wilcoxon signed-rank test')
  })

  it('uses logistic regression for prediction of a binary outcome', () => {
    expect(getRecommendation(profile({ goal: 'prediction', outcomeType: 'binary', modelComponent: 'none' })).primary).toBe('Binary logistic regression')
  })

  it('uses PROCESS Model 4 for mediation', () => {
    expect(getRecommendation(profile({ goal: 'mediation', modelComponent: 'mediator' })).primary).toContain('PROCESS Model 4')
  })

  it('flags a planned analysis that does not align', () => {
    const result = getRecommendation(profile({ goal: 'mediation', modelComponent: 'mediator', plannedAnalysis: 'ANOVA' }))
    expect(result.audit).toContain('does not align')
  })
})
