class ExplainabilityEngine {
  /**
   * Generates a human-readable explanation of why the system reached its reliability and consensus conclusions.
   * @param {Object} reliability 
   * @param {Object} consensus 
   * @param {Object} diversity 
   * @param {Object} bias 
   */
  static generateExplanation(reliability, consensus, diversity, bias) {
    const factors = [];
    const weaknesses = [];
    
    // Diversity Factors
    if (diversity.publishers > 3) {
      factors.push(`Information is corroborated by ${diversity.publishers} independent publishers, significantly increasing trust.`);
    } else if (diversity.publishers === 1) {
      weaknesses.push('Information is single-sourced. Lack of diverse publishers reduces overall confidence.');
    }

    // Consensus Factors
    if (consensus.agreementPercentage >= 80) {
      factors.push(`There is strong consensus (${consensus.agreementPercentage}% agreement) among the available evidence.`);
    } else if (consensus.agreementPercentage < 50) {
      weaknesses.push(`Evidence is highly conflicting (${consensus.agreementPercentage}% agreement). Claims cannot be definitively proven.`);
    }

    // Bias Factors
    if (bias.level === 'Low' || bias.level === 'Very Low') {
      factors.push(`The writing style of the sources is mostly objective with minimal emotional or sensational language.`);
    } else {
      weaknesses.push(`The sources contain opinion-heavy or sensationalized language, reducing objective reliability.`);
    }

    let recommendation = 'The information appears reliable and can be cited with confidence.';
    if (reliability.score < 50) {
      recommendation = 'The information should be treated with skepticism. Seek additional independent verification.';
    } else if (reliability.score < 75) {
      recommendation = 'The information is moderately reliable but contains conflicting or subjective elements.';
    }

    return {
      reason: `The system assigned a reliability score of ${reliability.score}/100 based on the balance of source diversity, evidence consensus, and objective writing styles.`,
      supportingFactors: factors,
      weaknesses: weaknesses,
      missingInformation: diversity.publishers < 2 ? ['Lack of cross-referenced independent sources.'] : [],
      recommendation
    };
  }
}

module.exports = ExplainabilityEngine;
