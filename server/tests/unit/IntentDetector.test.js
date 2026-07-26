const IntentDetector = require('../../services/ChatEngine/IntentDetector');

describe('IntentDetector', () => {
  test('should detect "summarize" intent', () => {
    const result = IntentDetector.detect('Summarize my latest research');
    expect(result.intent).toBe('summarize_research');
    expect(result.confidence).toBeGreaterThan(0.4);
  });

  test('should detect "explain" intent', () => {
    const result = IntentDetector.detect('Explain the finding about market growth');
    expect(result.intent).toBe('explain_finding');
  });

  test('should detect "show sources" intent', () => {
    const result = IntentDetector.detect('What are the sources and references?');
    expect(result.intent).toBe('show_sources');
  });

  test('should detect "reliability" intent', () => {
    const result = IntentDetector.detect('What is the reliability score and trust level?');
    expect(result.intent).toBe('explain_reliability');
  });

  test('should detect "consensus" intent', () => {
    const result = IntentDetector.detect('Are there any contradictions?');
    expect(result.intent).toBe('explain_consensus');
  });

  test('should detect "compare" intent', () => {
    const result = IntentDetector.detect('Compare these two claims');
    expect(result.intent).toBe('compare_claims');
  });

  test('should detect "export" intent', () => {
    const result = IntentDetector.detect('Export this as PDF');
    expect(result.intent).toBe('export_request');
  });

  test('should detect follow-up for short messages with active context', () => {
    const result = IntentDetector.detect('more', { activeTopic: 'quantum computing' });
    expect(result.intent).toBe('follow_up');
  });

  test('should return general_research for unrecognized messages', () => {
    const result = IntentDetector.detect('What is the current state of blockchain?');
    expect(result.intent).toBe('general_research');
  });

  test('should return unknown for empty input', () => {
    const result = IntentDetector.detect('');
    expect(result.intent).toBe('unknown');
  });

  test('should be deterministic', () => {
    const r1 = IntentDetector.detect('Summarize the report for me');
    const r2 = IntentDetector.detect('Summarize the report for me');
    expect(r1).toEqual(r2);
  });
});
