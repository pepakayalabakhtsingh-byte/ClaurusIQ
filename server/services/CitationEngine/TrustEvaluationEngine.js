class TrustEvaluationEngine {
  /**
   * Calculates a Trust Score and Credibility Level for a source.
   * @param {Object} metadata 
   * @param {string} category 
   * @returns {Object} { score: number, level: string, rationale: string }
   */
  static evaluate(metadata, category) {
    let score = 50; // Base score
    const rationale = [];

    // 1. Evaluate Category
    switch(category) {
      case 'Government':
      case 'Peer-reviewed Journal':
        score += 35;
        rationale.push('+35: Highly authoritative source category (' + category + ')');
        break;
      case 'University':
      case 'Official Organization':
      case 'Research Paper':
        score += 25;
        rationale.push('+25: Trusted organizational/academic source (' + category + ')');
        break;
      case 'News':
        score += 10;
        rationale.push('+10: Mainstream news outlet. Reliability varies by publication.');
        break;
      case 'Wikipedia':
        score -= 10;
        rationale.push('-10: Wikipedia is a tertiary source and freely editable.');
        break;
      case 'Blog':
        score -= 20;
        rationale.push('-20: Blog posts lack peer review and editorial standards.');
        break;
      default:
        rationale.push('+0: Unknown source category. Treat with caution.');
    }

    // 2. Evaluate Completeness
    let completeness = 0;
    if (metadata.author !== 'Unknown Author') completeness++;
    if (metadata.publisher !== 'Unknown Publisher') completeness++;
    if (metadata.year !== 'Unknown Year') completeness++;

    if (completeness === 3) {
      score += 15;
      rationale.push('+15: Complete metadata (Author, Publisher, Year present). Indicates transparency.');
    } else if (completeness === 2) {
      score += 5;
      rationale.push('+5: Partially complete metadata.');
    } else if (completeness === 0) {
      score -= 15;
      rationale.push('-15: Missing significant metadata. Poor transparency.');
    }

    // 3. Evaluate Identifier (DOI)
    if (metadata.doi) {
      score += 15;
      rationale.push('+15: Digital Object Identifier (DOI) present. Strong indicator of academic rigor.');
    }

    // Ensure within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine Credibility Level
    let level = 'Unknown';
    if (score >= 90) level = 'Excellent';
    else if (score >= 80) level = 'Very High';
    else if (score >= 70) level = 'High';
    else if (score >= 50) level = 'Medium';
    else if (score >= 30) level = 'Low';
    else level = 'Very Low';

    return {
      score,
      level,
      rationale: rationale.join('\n')
    };
  }
}

module.exports = TrustEvaluationEngine;
