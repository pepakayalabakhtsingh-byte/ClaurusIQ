const mongoose = require('mongoose');
const Workflow = require('./models/Workflow');
const VerificationSession = require('./models/VerificationSession');
const CitationSession = require('./models/CitationSession');
const ReliabilitySession = require('./models/ReliabilitySession');
const ReportSession = require('./models/ReportSession');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/ClaurusIQ');

async function seed() {
  try {
    const user = await User.findOne({ email: 'testuser99@claurusiq.com' }) || await User.findOne();
    if (!user) {
      console.log('No user found to seed data for.');
      process.exit(1);
    }

    console.log(`Seeding data for user: ${user.email} (ID: ${user._id})`);

    // 1. Create Workflow
    const workflow = new Workflow({
      ownerId: user._id,
      query: 'What are the environmental impacts of microplastics in the ocean?',
      status: 'completed',
      progress: 100,
      agents: [
        { agentName: 'OrchestratorAgent', status: 'completed' },
        { agentName: 'SourceDiscoveryAgent', status: 'completed' },
        { agentName: 'EvidenceVerificationAgent', status: 'completed' },
        { agentName: 'CitationAgent', status: 'completed' },
        { agentName: 'ReliabilityAgent', status: 'completed' },
        { agentName: 'ReportGenerationAgent', status: 'completed' }
      ]
    });
    await workflow.save();
    console.log(`Workflow created: ${workflow._id}`);

    // 2. Create VerificationSession
    const verificationSession = new VerificationSession({
      workflowId: workflow._id,
      ownerId: user._id,
      status: 'completed',
      verificationTime: Date.now(),
      claims: [
        {
          text: 'Microplastics have been found in the Marianas Trench.',
          category: 'Scientific Claim',
          status: 'Verified',
          confidenceScore: 92,
          supportingEvidence: [{ text: 'Studies confirmed microplastics at depth of 10,000m.', source: 'Oceanography Journal', url: 'https://example.com' }],
          contradictingEvidence: [],
          rationale: 'Multiple peer-reviewed sources confirm the presence.'
        },
        {
          text: 'Plastics fully degrade in 5 years in saltwater.',
          category: 'Scientific Claim',
          status: 'Conflicting Evidence',
          confidenceScore: 40,
          supportingEvidence: [],
          contradictingEvidence: [{ text: 'Plastics can take hundreds of years to degrade.', source: 'Environmental Science', url: 'https://example.com' }],
          rationale: 'Scientific consensus opposes the 5-year degradation claim.'
        }
      ]
    });
    await verificationSession.save();
    console.log(`VerificationSession created: ${verificationSession._id}`);

    // 3. Create CitationSession
    const citationSession = new CitationSession({
      workflowId: workflow._id,
      ownerId: user._id,
      verificationSessionId: verificationSession._id,
      citations: [
        {
          id: '1',
          url: 'https://example.com/study1',
          title: 'Deep Ocean Microplastics',
          authors: ['Dr. Smith'],
          publicationDate: '2023-01-01',
          publisher: 'Oceanography Journal',
          sourceCategory: 'Academic Journal',
          trustScore: 95,
          credibilityLevel: 'High',
          trustRationale: 'Peer-reviewed and widely cited.',
          formats: {
            apa: 'Smith, Dr. (2023). Deep Ocean Microplastics. Oceanography Journal.',
            mla: 'Smith, Dr. "Deep Ocean Microplastics." Oceanography Journal, 2023.'
          }
        }
      ]
    });
    await citationSession.save();
    console.log(`CitationSession created: ${citationSession._id}`);

    // 4. Create ReliabilitySession
    const reliabilitySession = new ReliabilitySession({
      workflowId: workflow._id,
      ownerId: user._id,
      bias: {
        score: 15,
        level: 'Low',
        indicators: ['Objective language used', 'Multiple perspectives considered']
      },
      diversity: {
        score: 85,
        level: 'High',
        metrics: { geographic: 'Global', temporal: 'Recent (5 yrs)' }
      },
      consensus: {
        score: 90,
        level: 'Strong Agreement',
        agreementPercentage: 92,
        conflictingPoints: []
      },
      reliability: {
        score: 91,
        level: 'Highly Reliable'
      },
      explanation: 'The sources show strong consensus and high credibility.',
      trace: []
    });
    await reliabilitySession.save();
    console.log(`ReliabilitySession created: ${reliabilitySession._id}`);

    // 5. Create ReportSession
    const reportSession = new ReportSession({
      workflowId: workflow._id,
      ownerId: user._id,
      executiveSummary: 'Microplastics are pervasive throughout the global marine ecosystem, reaching even the deepest ocean trenches. The consensus among scientific literature is strong, indicating significant ecological impact.',
      keyFindings: {
        topDiscoveries: [
          { finding: 'Microplastics reach deep trenches.', implication: 'Widespread contamination.' },
          { finding: 'Degradation is extremely slow.', implication: 'Long-term ecological presence.' }
        ]
      },
      recommendations: [
        { title: 'Policy Action', description: 'Implement stricter maritime plastic disposal policies.', priority: 'High', justification: 'Urgent need based on rapid accumulation.' }
      ],
      researchGaps: [
        { area: 'Long-term biological impact on deep-sea organisms', description: 'Requires longitudinal studies.' }
      ],
      metadata: { generatedAt: Date.now(), workflowId: workflow._id, confidenceHeatmapEnabled: true }
    });
    await reportSession.save();
    console.log(`ReportSession created: ${reportSession._id}`);

    console.log('Successfully seeded data!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
