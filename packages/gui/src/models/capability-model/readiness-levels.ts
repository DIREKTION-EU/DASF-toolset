export interface ReadinessLevelConfig {
  id: string;
  labelKey: string;
  fallbackLabel: string;
  prefix: string;
  min: number;
  max: number;
  descriptionKeyPrefix: string;
  descriptions: string[];
}

export const readinessDescriptionFieldId = (readinessId: string) =>
  `${readinessId}Desc`;

const trlDescriptions = [
  "Basic principles observed",
  "Technology concept formulated",
  "Experimental proof of concept",
  "Technology validated in lab",
  "Technology validated in relevant environment",
  "Technology demonstrated in relevant environment",
  "System prototype demonstrated in operational environment",
  "System complete and qualified",
  "Actual system proven in operational environment",
];

export const trlReadinessConfig: ReadinessLevelConfig = {
  id: "trl",
  labelKey: "sol_trl",
  fallbackLabel: "Technology Readiness Level",
  prefix: "TRL",
  min: 1,
  max: 9,
  descriptionKeyPrefix: "trl",
  descriptions: trlDescriptions,
};

export const additionalSolutionReadinessConfigs: ReadinessLevelConfig[] = [
  {
    id: "integrationRl",
    labelKey: "sol_integration_rl",
    fallbackLabel: "Integration Readiness Level",
    prefix: "IRL",
    min: 1,
    max: 9,
    descriptionKeyPrefix: "integration_rl",
    descriptions: [
      "A high-level concept for integration has been identified",
      "Some specificity level of requirements for the component interaction",
      "The detailed integration design has been defined to include all interface details",
      "Validation of integrating component functions in a laboratory environment",
      "Validation of integrating components in a relevant environment",
      "Validation of integrating components in a relevant end-to-end environment",
      "Prototype integration demonstration in an operational high-fidelity environment",
      "Test and demonstration in an operational environment",
      "Proven system integration through successful mission operations capabilities",
    ],
  },
  {
    id: "societalRl",
    labelKey: "sol_societal_rl",
    fallbackLabel: "Societal Readiness Level",
    prefix: "SRL",
    min: 1,
    max: 9,
    descriptionKeyPrefix: "societal_rl",
    descriptions: [
      "Identification of the generic societal need, social good, and associated aspects",
      "Formulation of proposed solution concept and potential impacts",
      "A limited group of the society knows the solution or similar initiatives",
      "A limited group of the society tests the solution or similar initiatives",
      "Society knows the solution or similar initiatives but is not aware of their benefits",
      "Society knows the solution and awareness of their benefits increases",
      "Society is completely aware of the solution's benefits",
      "Society is ready to adopt the solution and have used similar solutions on the market",
      "Society is using the solution and it is supported by stakeholders and the public",
    ],
  },
  {
    id: "manufacturingRl",
    labelKey: "sol_manufacturing_rl",
    fallbackLabel: "Manufacturing Readiness Level",
    prefix: "MRL",
    min: 1,
    max: 9,
    descriptionKeyPrefix: "manufacturing_rl",
    descriptions: [
      "Basic manufacturing implications identified",
      "Manufacturing concepts identified",
      "Manufacturing proof of concept developed",
      "Capability to produce the technology in a laboratory environment",
      "Capability to produce the prototype components in a production relevant environment",
      "Capability to produce a prototype system or subsystem in a production relevant environment",
      "Capability to produce systems, subsystems or components in a production representative environment",
      "Pilot line capability demonstrated. Ready to begin low rate production",
      "Low rate production demonstrated. Capability in place to begin full rate production",
    ],
  },
  {
    id: "commercialisationRl",
    labelKey: "sol_commercialisation_rl",
    fallbackLabel: "Commercialisation Readiness Level",
    prefix: "CRL",
    min: 1,
    max: 9,
    descriptionKeyPrefix: "commercialisation_rl",
    descriptions: [
      "Research and basis hypothesis",
      "Market assessment",
      "Technology application and market validation",
      "Value proposition",
      "Product development and market alignment",
      "Product/solution optimisation and IP protection",
      "Technical and commercial validation",
      "Commercialisation strategy and market introduction",
      "Full launch and license revenue",
    ],
  },
  {
    id: "securityRl",
    labelKey: "sol_security_rl",
    fallbackLabel: "Security Readiness Level",
    prefix: "SeRL",
    min: 1,
    max: 10,
    descriptionKeyPrefix: "security_rl",
    descriptions: [
      "Security consideration",
      "Security concept development",
      "Security by design",
      "Security measures and features preparation",
      "Simple security validation",
      "Sequential security demonstration",
      "Complex security demonstrations",
      "Final pre-release security validation and preparation",
      "Initial operational security",
      "Well-established/reliable security",
    ],
  },
  {
    id: "legalPrivacyEthicalRl",
    labelKey: "sol_legal_privacy_ethical_rl",
    fallbackLabel: "Legal, Privacy & Ethical Readiness Level",
    prefix: "LPERL",
    min: 1,
    max: 4,
    descriptionKeyPrefix: "legal_privacy_ethical_rl",
    descriptions: [
      "Control over legal, ethical, and privacy issues: the system has implemented control mechanisms for accountability and has passed standard benchmarks and obtained certification, if applicable",
      "Ethical tensions addressed via ethics-by-design: the system's legal, ethical, and privacy considerations have been designed to be compatible with each other. Ethics tensions have been addressed so improving one aspect does not negatively impact another",
      "Characterised legal, ethical, and privacy interactions: the interactions between different ethical and privacy considerations have been characterised",
      "Identified legal, ethical, and privacy issues: ethical and privacy considerations raised by the system have been identified and anticipated",
    ],
  },
];

export const allSolutionReadinessConfigs: ReadinessLevelConfig[] = [
  trlReadinessConfig,
  ...additionalSolutionReadinessConfigs,
];
