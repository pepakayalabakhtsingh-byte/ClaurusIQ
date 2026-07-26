class ContradictionDetector {
  /**
   * Detects if the provided evidence contradicts the original claim.
   * @param {string} claimText 
   * @param {Array<Object>} evidenceList 
   * @returns {Object} { supporting: [], contradicting: [] }
   */
  static evaluate(claimText, evidenceList) {
    const supporting = [];
    const contradicting = [];

    // Very basic rule-based contradiction detection.
    // In a production system, this would use semantic similarity or a fine-tuned NLI model.
    // For this rule-based implementation, we check for explicit negation words in the evidence 
    // that are NOT in the claim, or numerical mismatches.

    const claimLower = claimText.toLowerCase();
    const claimHasNegation = claimLower.includes(' not ') || claimLower.includes(' never ');

    // Extract numbers from claim
    const claimNumbers = claimText.match(/\d+(\.\d+)?/g) || [];

    evidenceList.forEach(evidence => {
      const evidenceLower = evidence.text.toLowerCase();
      const evidenceHasNegation = evidenceLower.includes(' not ') || evidenceLower.includes(' never ') || evidenceLower.includes(' false ');
      
      const evidenceNumbers = evidence.text.match(/\d+(\.\d+)?/g) || [];

      let isContradicting = false;

      // Rule 1: Negation mismatch (basic)
      if (claimHasNegation !== evidenceHasNegation && evidenceLower.includes('however')) {
        isContradicting = true;
      }

      // Rule 2: Numerical mismatch (If the claim states a number, and the evidence states a different number in the same context)
      if (claimNumbers.length > 0 && evidenceNumbers.length > 0) {
        // If the evidence contains numbers but none of them match the claim numbers
        const hasMatchingNumber = claimNumbers.some(num => evidenceNumbers.includes(num));
        if (!hasMatchingNumber) {
          isContradicting = true;
        }
      }

      if (isContradicting) {
        contradicting.push(evidence);
      } else {
        supporting.push(evidence);
      }
    });

    return { supporting, contradicting };
  }
}

module.exports = ContradictionDetector;
