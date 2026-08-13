import { type Messages } from ".";

export const messagesSV: Messages = {
  HOME: {
    TITLE: "Instrumentpanel",
    ROUTE: "/dashboard",
    PAGE: "Välkommen till DASF",
    INTRO: "Ett kraftfullt ramverk för utvärdering av katastrofhantering",
    SECTION1_TITLE: "Funktioner",
    SECTION1:
      "Denna applikation stöder utvärdering av förmågor inom katastrofhantering.",
    SECTION2_TITLE: "Teknik",
    SECTION2: "Byggd med TypeScript och moderna webbteknologier.",
    SECTION3_TITLE: "Användning",
    SECTION3: "Navigera genom avsnitten med navigeringsfältet.",
  },
  ABOUT: {
    TITLE: "Om appen",
    ROUTE: "/about",
    PAGE: "Om DASF",
    INTRO: "Läs mer om DIREKTION Assessment & Screening Framework",
    SECTION1_TITLE: "Vad är DASF",
    SECTION1:
      "DIREKTION Assessment & Screening Framework hjälper organisationer med katastrofhantering.",
    SECTION2_TITLE: "Huvudfunktioner",
    SECTION2:
      "Förmågebedömning, identifiering av brister, lösningsutvärdering och färdplan.",
    SECTION3_TITLE: "Utvecklingsmål",
    SECTION3:
      "Tillhandahålla ett tydligt och underhållbart ramverk för katastrofhantering.",
  },
  SETTINGS: {
    TITLE: "Inställningar",
    ROUTE: "/settings",
    PAGE: "Programinställningar",
    INTRO: "Konfigurera dina programinställningar",
    SECTION1_TITLE: "Språkinställningar",
    SECTION1: "Byt mellan tillgängliga språk.",
    SECTION2_TITLE: "Utseendeinställningar",
    SECTION2: "Anpassa programmets visuella utseende.",
    SECTION3_TITLE: "Inställningar",
    SECTION3: "Hantera programmets beteende.",
  },
  LANDING: { TITLE: "Introduktion", ROUTE: "/" },
  HAZARDS: { TITLE: "Faror", ROUTE: "/hazards" },
  SOLUTIONS: { TITLE: "Lösningar", ROUTE: "/solutions" },
  ROADMAP: { TITLE: "Färdplan", ROUTE: "/roadmap" },
  USER: "Användare",
  EDITOR: "Redigerare",
  ADMIN: "Administratör",
  CANCEL: "Avbryt",
  DELETE: "Ta bort",
  YES: "Ja",
  NO: "Nej",
  OK: "OK",
  NAME: "Namn",
  DESCRIPTION: "Beskrivning",
  DELETE_ITEM: {
    TITLE: "Ta bort {item}",
    DESCRIPTION:
      "Är du säker på att du vill ta bort denna {item}? Det går inte att ångra.",
  },
  SAVE_BUTTON: {
    LABEL: "Spara",
    TOOLTIP: "Spara osparade ändringar",
  },
  SEARCH: "Sök...",
  SEARCH_TOOLTIP: "Skriv / för att söka",
  LANGUAGE: "Språk",
  CLEAR: "Rensa modell",
  UPLOAD: "Ladda upp modell som JSON",
  DOWNLOAD: "Ladda ner modell som JSON",
  PERMALINK: "Skapa permanent länk",
  ROLE: "Roll",
  LINK: "Länk",
  MODEL: "Modell",
  TITLE: "Titel",
  AUTHORS: "Författare",
  TYPE: "Typ",
  HITS: {
    n: "{n} träffar",
  },
  NO_RESULTS: "Inga resultat hittades",
  CLEAR_SEARCH: "Rensa sökning",
  PAGE_NOT_FOUND: "Sidan hittades inte",

  about_route: "/about",
  about: "Om oss",
  acronym: "Akronym",
  add_term: "Lägg till en ny term",
  addr_how: "Hur hanteras det?",
  addressed: "Hanterat",
  ass_instr: "_Bedöm en förmågas bidrag till dina mål._",
  ass_label: "Problemorsaken är välkänd",
  ass_overall: "Förbättringsbehov",
  ass_scale: "Skala för bedömningspoäng",
  ass_setting: "Bedömningsmatris",
  ass: "Bedömning",
  assess_content: "Bestäm för varje förmåga dess vikt och nuvarande prestanda.",
  assess: "Bedöm",
  assessment_route: "/assessment/:id",
  assessment: "Bedömning",
  avg_perf: "Övergripande bedömning",
  cap_cat: "Förmågekategori",
  cap: "Förmåga",
  caps: "Förmågor",
  cat: "Kategori",
  clear_all: "Rensa alla filter",
  clear: "Rensa",
  color: "Färg",
  create_cap: "Skapa förmåga",
  defs: "Definitioner",
  del_model: "Vill du verkligen ta bort allt?",
  del_model_desc: "Är du säker på att du vill ta bort din modell?",
  del_proj: "Ta bort projekt",
  desc_cap_instr: "Beskriv förmågan i detalj.",
  desc: "Beskrivning",
  develop_content: "Börja utveckla dina förmågor.",
  develop: "Utveckla",
  development: "Utveckling",
  development_route: "/development/:id",
  dev_cap:
    "_Föreslå nya projekt för att utveckla din förmåga. Börja med att välja en förmåga._",
  doc_id: "Dokument-ID",
  doc: "Dokumentation",
  download: "Ladda ner",
  duration: "Varaktighet",
  edit: "Redigera",
  view: "Visa",
  evaluation_route: "/evaluation/:id",
  evaluation: "Utvärdering",
  exp_perf: "Förväntad prestanda",
  expl: "Förklaring",
  expl2: "Prestanda",
  filter_cap: "Filtrera förmågor",
  filter_caps: "Filtrera förmågor",
  filter_ph: "Titel eller beskrivning",
  filter_text_ph: "Term eller beskrivning",
  filter_text: "Filtertext",
  filters: "Filter",
  relevance: "Relevans",
  gap_scale: "Skala för bristen",
  gap_settings: "##### Bristinställningar",
  gap: "Brist",
  gaps_common: "Vanliga brister eller problemorsaker",
  gaps: "Brister",
  gng: "###### GÅ / GÅ EJ-beslut<br>",
  go: "GÅ",
  goal_scale: "Skala för bedömningsteman",
  goals_instr: "Specificera långsiktiga och kortsiktiga mål",
  goal: "Mål",
  goals: "Mål",
  group_goals_instr:
    "1. **Ange gruppens mål som du vill uppnå.**\n2. Specificera dina intressenter och deras organisatoriska mål.\n3. Specificera förmågekategorier för att organisera förmågorna.\n4. Specificera de förmågor du behöver för att uppnå gruppens mål.",
  group_goals: "Specificera gruppmål",
  home_route: "/",
  home: "HEM",
  id: "ID",
  importance: "Vikt",
  in_months: "I månader",
  loc: "Rum/plats",
  main_goals: "Mål",
  assess_capability_importance_for_capability:
    'Bedöm betydelsen av "{capability}" för den valda omfattningen.',
  max_imp: "Maximalt bidrag",
  name: "Namn",
  no_go: "GÅ EJ",
  no: "Nej",
  org_dept: "Organisation / Avdelning",
  overview_route: "/overview",
  overview: "Översikt",
  level: "Nivå",
  perf_asp: "Prestandaaspekt",
  perf_asps: "Prestandaaspekter",
  assess_performance_aspects_for_capability:
    "Bedöm prestandaaspekterna för {capability}.",
  perf_effectiveness_tooltip: "Hur effektiv är {capability}?",
  perf_safety_professionals_tooltip:
    "Vilken nivå av fysisk och mental säkerhet har operativ personal som arbetar med {capability}?",
  perf_efficiency_tooltip: "Hur resurseffektiv är {capability}?",
  perf_scale: "Skala för prestandapoäng",
  perf_settings: "##### Bedömningsinställningar",
  perf: "Prestanda",
  period: "ÅÅÅÅ K1 eller ÅÅÅÅ M1",
  permalink: "Permanent länk",
  pers_inv: "Involverade personer",
  pick_more: "Välj ett eller flera",
  pick_one: "Välj ett",
  prep_content:
    "_Definiera din organisations mål och dina viktigaste förmågor._",
  preparation_route: "/formagor",
  preparation: "Förmågor",
  prepare_content: "Skapa eller välj de viktiga förmågorna.",
  prepare: "Förbered",
  prob_areas: "Problemområden",
  gap_problem_categories_intro:
    "Analysera detta kapabilitetsgap inom följande problemkategorier.",
  gap_likert_severity: "Allvarlighetsgrad",
  gap_likert_severity_start_label: "Mycket låg",
  gap_likert_severity_middle_label: "Medel",
  gap_likert_severity_end_label: "Mycket högt",
  gap_likert_probability: "Sannolikhet",
  gap_likert_probability_start_label: "Ingen förändring",
  gap_likert_probability_middle_label: "—",
  gap_likert_probability_end_label: "Stor minskning",
  gap_likert_impact: "Påverkan",
  gap_likert_impact_start_label: "Ingen förändring",
  gap_likert_impact_middle_label: "—",
  gap_likert_impact_end_label: "Stor minskning",
  gap_likert_severity_tooltip:
    "Hur bedömer du allvarlighetsgraden för detta kapabilitetsgap?",
  gap_likert_probability_tooltip:
    "Anta att gapet är löst: vad skulle det innebära för sannolikheten att gapet uppstår?",
  gap_likert_impact_tooltip:
    "Anta att gapet är löst. Vad skulle det innebära för minskningen av påverkan från det ursprungliga gapet?",
  prob: "Problem",
  proj_app: "###### PROJEKT GODKÄNT<br>",
  proj_name: "Projektnamn",
  proj_prop: "Nytt projekt eller förslag",
  proj_sum: "Projektsammanfattning",
  prop_name: "Förslagsnamn",
  prop_new: "Nytt förslag",
  ref: "Referens",
  ref_url: "Referens-URL",
  select_cap: "Välj förmåga",
  select_cat: "Välj kategori",
  select_m_ph: "Välj ett eller flera",
  select_subcat: "Välj underkategori",
  settings_route: "/settings",
  settings: "Inställningar",
  sh_filter: "Filtrera involverade organisationer",
  sh_org: "Intressentorganisationer",
  sh_settings: "##### Intressent-/intressentinställningar",
  sh_type: "Typ av intressent",
  sh_types: "Intressenttyper",
  sh: "Intressent",
  shs: "Intressenter",
  other_stakeholder: "Beskriv den övriga intressenten",
  spec_cap_instr:
    "1. Ange gruppens mål som du vill uppnå.\n2. Specificera dina intressenter och deras organisatoriska mål.\n3. Specificera förmågekategorier för att organisera förmågorna.\n4. **Specificera de förmågor du behöver för att uppnå gruppens mål.**",
  spec_cap: "Specificera förmågor",
  spec_cat_instr:
    "1. Ange gruppens mål som du vill uppnå.\n2. Specificera dina intressenter och deras organisatoriska mål.\n3. **Specificera förmågekategorier för att organisera förmågorna.**\n4. Specificera de förmågor du behöver för att uppnå gruppens mål.",
  spec_cat: "Specificera kategorier",
  spec_sh_instr:
    "1. Ange gruppens mål som du vill uppnå.\n2. **Specificera dina intressenter och deras organisatoriska mål.**\n3. Specificera förmågekategorier för att organisera förmågorna.\n4. Specificera de förmågor du behöver för att uppnå gruppens mål.",
  spec_sh: "Specificera intressenter",
  start_time: "Starttid",
  subcat: "Underkategori",
  task_settings: "##### Uppgiftsinställningar",
  task: "Uppgift",
  task2perf: "##### Uppgift till prestanda-tabellsökning",
  tasks: "Uppgifter",
  ass_task_scale: "Uppgiftsskala",
  ass_perf_scale: "Prestanda",
  taxonomy_route: "/taxonomy",
  taxonomy: "Taxonomi",
  tax_def:
    "#### Taxonomi\n\nDefinitioner och förkortningar av vanligt använda ord.",
  TAXONOMY: {
    HAZARD: "Fara",
    HAZARD_DEF:
      "En process, ett fenomen eller mänsklig aktivitet som kan orsaka förlust av liv, skador, störningar eller miljöskador.",
    HAZARD_TYPE: "Farotyp",
    HAZARD_TYPE_DEF:
      "En klass av faror med liknande ursprung eller egenskaper, t.ex. naturliga, teknologiska eller mänskligt orsakade faror.",
    DISASTER: "Katastrof",
    DISASTER_DEF:
      "En allvarlig störning av ett samhälle eller en gemenskap som överstiger dess förmåga att hantera situationen med egna resurser.",
    EMERGENCY: "Nödsituation",
    EMERGENCY_DEF:
      "En situation som kräver omedelbar samordnad åtgärd för att skydda liv, hälsa, egendom eller miljö.",
    DISASTER_RISK: "Katastrofrisk",
    DISASTER_RISK_DEF:
      "Potentialen för förluster från farliga händelser, formad av fara, exponering, sårbarhet och kapacitet.",
    EXPOSURE: "Exponering",
    EXPOSURE_DEF:
      "Närvaro av människor, tillgångar, infrastruktur och tjänster på platser där faror kan uppstå.",
    VULNERABILITY: "Sårbarhet",
    VULNERABILITY_DEF:
      "Förhållanden som ökar känsligheten hos människor, tillgångar eller system för farors påverkan.",
    CAPACITY: "Kapacitet",
    CAPACITY_DEF:
      "De styrkor och resurser som finns tillgängliga för att förutse, hantera, motstå och återhämta sig från farors påverkan.",
    CAPABILITY: "Förmåga",
    CAPABILITY_DEF:
      "En specifik, demonstrerbar förmåga hos en organisation att utföra uppgifter och uppnå resultat under definierade förhållanden.",
    RESILIENCE: "Resiliens",
    RESILIENCE_DEF:
      "Förmågan hos system och samhällen att motstå, absorbera, anpassa sig och återhämta sig med bibehållande av väsentliga funktioner.",
    PREVENTION: "Förebyggande",
    PREVENTION_DEF:
      "Åtgärder för att undvika skapandet av nya risker och förhindra att faror orsakar skadliga konsekvenser.",
    MITIGATION: "Riskreducering",
    MITIGATION_DEF:
      "Åtgärder som minskar svårighetsgraden eller sannolikheten för negativa konsekvenser av farliga händelser.",
    PREPAREDNESS: "Beredskap",
    PREPAREDNESS_DEF:
      "Kunskap, planer och kapaciteter som utvecklas i förväg för att möjliggöra effektiv förväntan, respons och återhämtning.",
    EARLY_WARNING_SYSTEM: "Tidigt varningssystem",
    EARLY_WARNING_SYSTEM_DEF:
      "Ett integrerat system för övervakning av faror, riskbedömning, kommunikation av varningar och möjliggörande av snabba åtgärder.",
    RESPONSE: "Insats",
    RESPONSE_DEF:
      "Åtgärder som vidtas direkt före, under eller omedelbart efter en händelse för att rädda liv och tillgodose brådskande behov.",
    RECOVERY: "Återhämtning",
    RECOVERY_DEF:
      "Processen att återställa och förbättra försörjning, tjänster, infrastruktur och system efter en katastrof.",
    BUILD_BACK_BETTER: "Bygg tillbaka bättre",
    BUILD_BACK_BETTER_DEF:
      "Att använda återhämtning och återuppbyggnad för att minska framtida risker och förbättra resiliens utöver förhållandena före katastrofen.",
    CONTINGENCY_PLANNING: "Beredskapsplanering",
    CONTINGENCY_PLANNING_DEF:
      "Förberedelse av specifika operativa planer och samordningsarrangemang för troliga nödscenarier.",
    RISK_ASSESSMENT: "Riskbedömning",
    RISK_ASSESSMENT_DEF:
      "En strukturerad process för att identifiera faror, analysera konsekvenser och uppskatta risk för att stödja beslut.",
    RISK_COMMUNICATION: "Riskkommunikation",
    RISK_COMMUNICATION_DEF:
      "Tvåvägsutbyte av riskinformation mellan myndigheter, insatspersonal, intressenter och allmänheten.",
    SITUATION_AWARENESS: "Lägesmedvetenhet",
    SITUATION_AWARENESS_DEF:
      "En aktuell och delad förståelse av incidentförhållanden, konsekvenser, resurser och troliga utvecklingar.",
    INCIDENT_COMMAND: "Incidentledning",
    INCIDENT_COMMAND_DEF:
      "En lednings- och samordningsstruktur för hantering av roller, beslut och resurser under incidenter.",
    STAKEHOLDER: "Intressent",
    STAKEHOLDER_DEF:
      "Varje organisation, grupp eller individ med en roll, ett ansvar eller ett intresse i beredskap, insats eller återhämtning.",
    INTEROPERABILITY: "Interoperabilitet",
    INTEROPERABILITY_DEF:
      "Förmågan hos organisationer, team och system att arbeta effektivt tillsammans över procedurer, data och teknik.",
    CAPABILITY_GAP: "Förmågebrist",
    CAPABILITY_GAP_DEF:
      "Skillnaden mellan erforderliga och nuvarande förmågenivåer som behövs för att uppnå målresultat.",
    CAPABILITY_ASSESSMENT: "Förmågebedömning",
    CAPABILITY_ASSESSMENT_DEF:
      "En strukturerad utvärdering av förmågevikt och prestanda för att identifiera prioriteringar för förbättring.",
    SOLUTION: "Lösning",
    SOLUTION_DEF:
      "En åtgärd, praxis, teknik eller insats som föreslås för att hantera en eller flera förmågebrister.",
    SOLUTION_ASSESSMENT: "Lösningsbedömning",
    SOLUTION_ASSESSMENT_DEF:
      "En systematisk utvärdering av kandidatlösningar mot användarbehov, operativ passform, påverkan och efterlevnad.",
    ROADMAP: "Färdplan",
    ROADMAP_DEF:
      "En fasindelad implementeringsplan som visar vad som ska levereras, av vem och när.",
    IMPLEMENTATION_TIMELINE: "Implementeringstidslinje",
    IMPLEMENTATION_TIMELINE_DEF:
      "Den planerade sekvensen och tidpunkten för aktiviteter, milstolpar och leveranser för implementering.",
    PRIORITIZATION: "Prioritering",
    PRIORITIZATION_DEF:
      "Rangordning av åtgärder eller investeringar baserat på brådska, förväntad påverkan, genomförbarhet och tillgängliga resurser.",
    MONITORING_EVALUATION: "Uppföljning och utvärdering",
    MONITORING_EVALUATION_DEF:
      "Löpande spårning och periodisk granskning av framsteg, resultat och effektivitet för att stödja lärande och anpassning.",
    LESSONS_LEARNED: "Erfarenheter",
    LESSONS_LEARNED_DEF:
      "Dokumenterade insikter från operationer och övningar som används för att förbättra framtida planering och prestanda.",
    SESSION: "Bedömningssession",
    SESSION_DEF:
      "Ett sparat arbetskontext innehållande valda faror, bedömningar, lösningar och färdplansdata.",
    COMPLIANCE_CHECK: "Efterlevnadskontroll",
    COMPLIANCE_CHECK_DEF:
      "En verifiering att föreslagna lösningar och åtgärder uppfyller juridiska, policymässiga, etiska och sektorkrav.",
    TECHNOLOGY_READINESS_LEVEL: "Teknologisk beredskapsgrad",
    TECHNOLOGY_READINESS_LEVEL_DEF:
      "En skala från 1 till 9 som indikerar mognaden av en teknik från koncept till operativ driftsättning.",
  },
  term: "Term",
  title: "Titel",
  upload: "Ladda upp",
  url: "URL",
  value: "Värde",
  yes: "Ja",
  TBD: "Okänd",
  general_settings: "Allmänt",
  enable_sol_ass_support: "Lösningsutvärdering aktiverad",
  logo: "Användarlogotyp",
  attribution_logo: "Attributionslogotyp",
  attribution_text: "Attributionstext",
  order: "Ordning",
  hide: "Dölj i översikt",
  select_user: "Välj användare",
  user: "Vanlig användare",
  moderator: "Moderator",
  admin: "Administratör",
  doc_title: "Förmågebedömningsrapport",
  export_to_word: "Exportera till Word",
  export_all_to_word: "Exportera fullständig rapport till Word",
  add_gap: "Lägg till förmågebrist",
  ignore: "Inte tillämpligt",
  continue: "Fortsätt",
  hazards: "Faror",
  hazards_route: "/hazards",
  hazard_step_title: "Steg 0: Initiering och Förberedelse",
  hazard_step_desc:
    "Välj de farotyper som är relevanta för den omfattning du vill adressera i detta bedömningsworkshop.",
  workshop_scope: "Workshop-omfattning",
  hazard_category_all: "Alla",
  hazard_category_natural: "Naturlig",
  hazard_category_technical: "Teknisk",
  hazard_category_attack: "Attack",
  hazard_edit: "Redigera farotyper",
  hazard_done: "Avsluta redigering",
  hazard_add: "Lägg till ny farotyp",
  hazard_name: "Farotypens namn",
  hazard_description: "Beskrivning / sammanhang",
  hazard_selected_count: "{n} farotyp(er) vald(a).",
  solutions: "Lösningar",
  solution_count: {
    1: "1 lösning",
    n: "{n} lösningar",
  },
  solutions_route: "/solutions",
  solutions_step_title: "Steg 2: Lösningsbedömning",
  solutions_step_desc:
    "Lägg till och utvärdera lösningar för identifierade förmågebrister.",
  solution_add: "Lägg till lösning",
  solution_new: "Ny lösning",
  solution_gaps_found: {
    1: "1 förmågebrist identifierad",
    n: "{n} förmågebrister identifierade",
  },
  solution_empty:
    "Inga lösningar har lagts till än. Klicka på 'Lägg till lösning' för att komma igång.",
  roadmap: "Färdplan",
  roadmap_count: {
    1: "1 färdplansobjekt",
    n: "{n} färdplansobjekt",
  },
  roadmap_route: "/roadmap",
  roadmap_step_title: "Steg 3: Färdplan",
  roadmap_step_desc:
    "Planera implementeringstidslinjer och åtaganden för dina valda lösningar.",
  roadmap_add_solutions: "Lägg till {n} lösning/lösningar i färdplanen",
  roadmap_empty_solutions:
    "Slutför steg 2 (Lösningsbedömning) först för att lägga till lösningar i färdplanen.",
  roadmap_empty: "Inga färdplansobjekt ännu.",
  roadmap_timeline: "Tidslinje",
  session_create: "Skapa",
  session_new_name: "Namn på ny session",
  session_sessions: "Bedömningssessioner",
  session_name: "Namn",
  session_updated: "Senast uppdaterad",
  session_actions: "Åtgärder",
  session_clone: "Klona session",
  session_download: "Ladda ner som JSON",
  session_delete: "Ta bort session",
  session_import: "Importera JSON",
  session_delete_confirm: "Ta bort session: {name}?",
  session_delete_warning: "Detta kan inte ångras. Är du säker?",
  dashboard_subtitle:
    "Följ stegen nedan för att slutföra din katastrofhanteringsbedömning.",
  back_to_sessions: "Tillbaka till sessioner",
  step0_title: "Initiering och Förberedelse",
  step1_title: "Behovs- och Bristbedömning",
  step2_title: "Lösningsbedömning",
  step3_title: "Färdplan",
  summary: "Sammanfattning",
  selected_hazards: "Valda faror",
  capability_gaps: "Förmågebrister",
  more: "mer",
  partially: "Delvis",
  not_assessed: "Ej bedömd",
  enabled_steps: "Aktiverade steg",
  priority_low: "Låg",
  priority_medium: "Medel",
  priority_high: "Hög",
  sol_trl: "Teknologisk beredskapsgrad",
  trl1: "Grundläggande principer observerade",
  trl2: "Teknologikoncept formulerat",
  trl3: "Experimentellt konceptbevis",
  trl4: "Teknik validerad i laboratorium",
  trl5: "Teknik validerad i relevant miljö",
  trl6: "Teknik demonstrerad i relevant miljö",
  trl7: "Systemprototyp demonstrerad i operativ miljö",
  trl8: "System komplett och kvalificerat",
  trl9: "Faktiskt system bevisat i operativ miljö",
  sol_integration_rl: "Integrationsberedskapsnivå",
  sol_societal_rl: "Samhällelig beredskapsnivå",
  sol_manufacturing_rl: "Tillverkningsberedskapsnivå",
  sol_commercialisation_rl: "Kommersialiseringsberedskapsnivå",
  sol_security_rl: "Säkerhetsberedskapsnivå",
  sol_legal_privacy_ethical_rl:
    "Juridisk, integritets- och etisk beredskapsnivå",
  integration_rl1: "Ett övergripande koncept för integration har identifierats",
  integration_rl2:
    "Det finns en viss grad av specificerade krav för komponenternas interaktion",
  integration_rl3:
    "Den detaljerade integrationsdesignen har definierats för att omfatta alla gränssnittsdetaljer",
  integration_rl4:
    "Validering av integrerande komponentfunktioner i en laboratoriemiljö",
  integration_rl5: "Validering av integrerade komponenter i en relevant miljö",
  integration_rl6:
    "Validering av integrerade komponenter i en relevant end-to-end-miljö",
  integration_rl7:
    "Demonstration av prototypintegration i en operativ högfidelitetsmiljö",
  integration_rl8: "Test och demonstration i en operativ miljö",
  integration_rl9:
    "Bevisad systemintegration genom framgångsrik operativ missionsförmåga",
  societal_rl1:
    "Identifiering av det generella samhälleliga behovet, samhällsnyttan och tillhörande aspekter",
  societal_rl2:
    "Formulering av föreslaget lösningskoncept och potentiella effekter",
  societal_rl3:
    "En begränsad grupp i samhället känner till lösningen eller liknande initiativ",
  societal_rl4:
    "En begränsad grupp i samhället testar lösningen eller liknande initiativ",
  societal_rl5:
    "Samhället känner till lösningen eller liknande initiativ men är inte medvetet om deras fördelar",
  societal_rl6:
    "Samhället känner till lösningen och medvetenheten om dess fördelar ökar",
  societal_rl7: "Samhället är helt medvetet om lösningens fördelar",
  societal_rl8:
    "Samhället är redo att anta lösningen och har använt liknande lösningar på marknaden",
  societal_rl9:
    "Samhället använder lösningen och den stöds av intressenter och allmänheten",
  manufacturing_rl1: "Grundläggande tillverkningsimplikationer identifierade",
  manufacturing_rl2: "Tillverkningskoncept identifierade",
  manufacturing_rl3: "Tillverkningsmässigt konceptbevis utvecklat",
  manufacturing_rl4: "Förmåga att producera tekniken i en laboratoriemiljö",
  manufacturing_rl5:
    "Förmåga att producera prototypkomponenter i en produktionsrelevant miljö",
  manufacturing_rl6:
    "Förmåga att producera ett prototypsystem eller delsystem i en produktionsrelevant miljö",
  manufacturing_rl7:
    "Förmåga att producera system, delsystem eller komponenter i en produktionsrepresentativ miljö",
  manufacturing_rl8:
    "Pilotlinjeförmåga demonstrerad. Redo att påbörja lågvolymsproduktion",
  manufacturing_rl9:
    "Lågvolymsproduktion demonstrerad. Förmåga finns att påbörja fullskalig produktion",
  commercialisation_rl1: "Forskning och grundhypotes",
  commercialisation_rl2: "Marknadsbedömning",
  commercialisation_rl3: "Validering av tekniktillämpning och marknad",
  commercialisation_rl4: "Värdeerbjudande",
  commercialisation_rl5: "Produktutveckling och marknadsanpassning",
  commercialisation_rl6:
    "Optimering av produkt/lösning och skydd av immateriella rättigheter",
  commercialisation_rl7: "Teknisk och kommersiell validering",
  commercialisation_rl8: "Kommersialiseringsstrategi och marknadsintroduktion",
  commercialisation_rl9: "Full lansering och licensintäkter",
  security_rl1: "Säkerhetsövervägande",
  security_rl2: "Utveckling av säkerhetskoncept",
  security_rl3: "Säkerhet genom design",
  security_rl4: "Förberedelse av säkerhetsåtgärder och funktioner",
  security_rl5: "Enkel säkerhetsvalidering",
  security_rl6: "Sekventiell säkerhetsdemonstration",
  security_rl7: "Komplexa säkerhetsdemonstrationer",
  security_rl8: "Slutlig säkerhetsvalidering och förberedelse före lansering",
  security_rl9: "Inledande operativ säkerhet",
  security_rl10: "Väl etablerad/tillförlitlig säkerhet",
  legal_privacy_ethical_rl1:
    "Kontroll över juridiska, etiska och integritetsrelaterade frågor: systemet har implementerat kontrollmekanismer för ansvarsskyldighet och har klarat standardiserade riktmärken och erhållit certifiering där så är tillämpligt",
  legal_privacy_ethical_rl2:
    "Etiska spänningar hanterade genom ethics-by-design: systemets juridiska, etiska och integritetsrelaterade överväganden har utformats så att de är förenliga med varandra. Etiska spänningar har hanterats så att förbättring av en aspekt inte påverkar en annan negativt",
  legal_privacy_ethical_rl3:
    "Karakteriserade juridiska, etiska och integritetsrelaterade interaktioner: interaktionerna mellan olika etiska och integritetsrelaterade överväganden har karakteriserats",
  legal_privacy_ethical_rl4:
    "Identifierade juridiska, etiska och integritetsrelaterade frågor: de etiska och integritetsrelaterade överväganden som systemet ger upphov till har identifierats och förutsetts",
  sol_linked_caps: "Länkade förmågor (med brister)",
  sol_addressed_gaps: "Hanterade förmågebrister",
  sol_no_gaps:
    "Inga förmågebrister har identifierats ännu. Gå till Steg 1 för att bedöma förmågor.",
  sol_compliance_title: "Efterlevnadskontroller",
  sol_status: "Status",
  sol_pass: "Godkänd",
  sol_partial: "Delvis",
  sol_fail: "Underkänd",
  sol_na: "N/T",
  sol_not_applicable: "Ej tillämpligt",
  sol_user_needs_title: "Bedömning av användarbehov",
  sol_operational_needs_title: "Bedömning av operativa behov",
  sol_organisational_needs_title: "Bedömning av organisatoriska behov",
  sol_expected_impact_title: "Bedömning av förväntad påverkan",
  sol_question: "Fråga",
  sol_response: "Svar",
  // User Needs questions
  UN01: "Är lösningen lätt att använda?",
  UN02: "Kommer lösningen troligen att prestera tillfredsställande under stress? Inklusive robusthet och tillförlitlighet.",
  UN03: "Kommer lösningen troligen att accepteras av användarna?",
  UN04: "Kommer lösningen troligen att stödja användarnas förståelse?",
  UN05: "Kommer lösningen troligen att stödja användarnas förklaringsförmåga?",
  UN06: "Kommer lösningen troligen att förbättra användarnas effektivitet?",
  UN07: "Kommer lösningen troligen att förbättra användarnas ändamålsenlighet?",
  UN08: "Kommer lösningen troligen att ge ökad kunskap?",
  UN09: "Kommer lösningen troligen att konsekvent producera positiva interventioner och/eller resultat?",
  // Operational Needs questions
  ON01: "Kommer lösningen troligen att kräva omfattande (om-)utbildning?",
  ON02: "Kommer lösningen troligen att kräva överdrivet underhåll och support?",
  ON03: "Kommer lösningen troligen att vara kompatibel med dina arbetsmetoder/SOP?",
  ON04: "Är lösningen interoperabel?",
  ON05: "Kommer lösningen troligen att vara anpassningsbar och överförbar i dina operativa scenarier?",
  ON06: "Kommer lösningen troligen att stödja insatspersonalens hälsa och säkerhet?",
  ON07: "Kommer lösningen troligen att nå den avsedda målgruppen?",
  ON08: "Kommer lösningen troligen att erbjuda förbättrad operativ effektivitet?",
  ON09: "Kommer lösningen troligen att erbjuda förbättrad operativ ändamålsenlighet?",
  // Organisational Needs questions
  OG01: "Kommer lösningen troligen att ha en positiv kostnads-nyttobalans?",
  OG02: "Verkar lösningen genomförbar? Inklusive teknologiskt, ekonomiskt, juridiskt, operativt och tidsmässigt.",
  OG03: "Kommer lösningen troligen att vara kompatibel med din organisationskultur?",
  OG04: "Kommer lösningen troligen att vara kompatibel med ditt organisatoriska mandat?",
  OG05: "Kommer lösningen troligen att vara kompatibel med prioriteringarna inom krishanteringens styrning?",
  OG06: "Skulle användning av lösningen stärka ditt rykte bland allmänheten?",
  OG07: "Skulle användning av lösningen hjälpa till att förbättra gemenskapsrelationerna?",
  // Expected Impact questions
  EI01: "Kommer lösningen att tillämpas inom mänsklig hälsovård?",
  EI02: "Involverar lösningen behandling av personuppgifter?",
  EI03: "Kommer lösningen troligen att ha en negativ inverkan på individers och gruppers rättigheter och friheter? T.ex. integritet, värdighet, autonomi, solidaritet.",
  EI04: "Kommer lösningen troligen att ha en negativ inverkan vad gäller social rättvisa och jämlikhet?",
  EI05: "Kommer lösningen troligen att ha en negativ inverkan på individers eller gruppers välbefinnande?",
  EI06: "Kommer lösningen troligen att öka sårbarheten hos individer eller grupper?",
  EI07: "Kommer lösningen troligen att utgöra potentiella säkerhetsrisker?",
  EI08: "Kommer lösningen troligen att ha en negativ inverkan på miljön?",
  EI09: "Finns det BETYDANDE osäkerhet kring de juridiska, etiska och samhälleliga konsekvenserna av lösningens användning?",
  // Compliance checks
  CC01: "(Cyber)säkerhet",
  CC02: "Interoperabilitet",
  CC03: "AI-lagen",
  CC04: "Samhällsengagemang",
  CC05: "GDPR",
  CC06: "Grundläggande rättigheter",
  CC07: "Mål för hållbar utveckling",
  CC08: "Nationella prioriteringar för krishantering",
  CC09: "Sektorsspecifika standarder",
  CC10: "Sektorsspecifika lagar och förordningar",
  cap_add_from_ref: "Lägg till förmågor från referens",
  cap_all_selected: "Alla referensförmågor har lagts till i din session.",
  cap_add_selected: "Lägg till valda förmågor",
  cap_ref_panel_title: "Tillgängliga förmågor (DASF-referensmodell)",
  collapse: "Dölj",
  step0_abbr: "Steg 0: I&F",
  step0_desc: "Identifiera relevanta farotyper för ditt bedömningssammanhang.",
  step1_abbr: "Steg 1: BBB",
  step1_desc: "Bedöm förmågor, identifiera brister och förbättringsbehov.",
  step2_abbr: "Steg 2: LB",
  step2_desc: "Utvärdera lösningar för identifierade förmågebrister.",
  step3_abbr: "Steg 3: FP",
  step3_desc: "Planera implementeringsfärdplan och åtaganden.",
  landing_attribution:
    "DIREKTION har mottagit finansiering från Europeiska unionens forsknings- och innovationsprogram Horisont Europa under bidragsavtal nr 101121249.",
  landing_developed_by: "Utvecklad av",
  landing_as_part_of: "som en del av",
  landing_project: "projektet.",
  dasf_purpose_title: "Syfte med DASF",
  dasf_purpose_p1:
    "DIREKTION Assessment and Screening Framework (DASF) är en kärnmetod som utvecklats inom DIREKTION-projektet för att stödja en transparent och opartisk screenings- och bedömningsprocess.",
  dasf_purpose_offers:
    "DASF-ramverket erbjuder en steg-för-steg-metod för att:",
  dasf_purpose_item1: "Identifiera och åtgärda kapacitetsluckor",
  dasf_purpose_item2:
    "Implementera systematisk screening av teknologier och lösningar",
  dasf_purpose_item3: "Upprätta en färdplan",
  dasf_purpose_p2:
    "DASF utgör grunden för en hållbar process för forskningsprogrammering, vilket säkerställer att insatspersoner och intressenter har tillgång till de mest effektiva och aktuella verktygen för katastrofberedskap och -hantering. Den fullständiga uppsättningen är avsedd att genomföras regelbundet — till exempel en gång om året eller en gång vart fjärde år — för att få en uppdaterad insikt i de mest aktuella kapacitetsbehoven, kapacitetsluckorna, potentiella lösningar och för att regelbundet uppdatera färdplanen för EU:s eller nationella forskningsmöjligheter.",
  landing_assessment_process: "Bedömningsprocess",
  landing_funded_by: "Finansierat av Europeiska unionen",
  landing_trilateral_attribution:
    "För skapandet av detta verktyg användes viktiga bidrag från Trilateral Research, utvecklade inom ramen för DIREKTION D1.2.",
  delete_session_confirm: "Ta bort session: {name}?",
  delete_session_warning: "Detta kan inte ångras. Är du säker?",
  // Hazard types
  N01: "Jordbävning",
  N02: "Tsunami",
  N03: "Vulkanutbrott",
  N04: "Jordskred / Lavin",
  N05: "Översvämning",
  N06: "Blixtöversvämning",
  N07: "Storm / Orkan / Tornado",
  N08: "Skogsbrand / Naturmarksbrand",
  N09: "Extremtemperatur (värme/kyla)",
  N10: "Torka",
  N11: "Epidemi / Pandemi",
  N12: "Djursjukdomsutbrott",
  N13: "Insektsangrepp",
  T01: "Industriolycka (CBRN)",
  T02: "Kärn-/radiologisk incident",
  T03: "Transportolycka (luft)",
  T04: "Transportolycka (järnväg)",
  T05: "Transportolycka (väg)",
  T06: "Transportolycka (sjöfart)",
  T07: "Pipeline-/gasexplosion",
  T08: "Byggnads-/konstruktionskollaps",
  T09: "Damm-/invallningsbrott",
  T10: "Strömavbrott / Nätavbrott",
  T11: "Telekommunikationsfel",
  T12: "Förorenat vattenförsörjning",
  T13: "Farligt materialspill",
  A01: "Terroristattack (sprängämne)",
  A02: "Terroristattack (CBRN)",
  A03: "Cyberattack",
  A04: "Aktiv skytt / Väpnat angrepp",
  A05: "Sabotage av kritisk infrastruktur",
  A06: "Gisslan-/kidnappningssituation",
  A07: "Civila oroligheter / Kravaller",
  A08: "Maritim piratverksamhet / Kapning",
  A09: "Drönareattack",
  A10: "Hybridhot",
  A11: "Desinformationskampanj",
  A12: "Störning av leveranskedjan (avsiktlig)",
  A13: "Mordbrand",
  // Capability categories
  "Cat-01": "Riskreducering / Förebyggande",
  "Cat-02": "Beredskap",
  "Cat-03": "Insats",
  "Cat-04": "Återhämtning",
  // Capability subcategories
  "Mit-01": "Riskbedömning",
  "Mit-02": "Exponeringsskydd",
  "Mit-03": "Stöd till riskreducering",
  "Prep-01": "Kapacitetsutveckling",
  "Prep-02": "Övervakning",
  "Prep-03": "Beredskapsstöd",
  "Rsp-01": "Begränsa incident",
  "Rsp-02": "Räddningsoperationer",
  "Rsp-03": "Säkerhet / Brottsbekämpning",
  "Rsp-04": "Akut hälsovård",
  "Rsp-05": "Kommunikation till samhället",
  "Rsp-06": "Skydda befolkning / djur",
  "Rsp-07": "Röjning av katastrofområde",
  "Rsp-08": "Försörjning av grundläggande behov",
  "Rsp-09": "Insatsstöd",
  "Rec-01": "Humanitär återhämtning",
  "Rec-02": "Miljöåterställning",
  "Rec-03": "Ekonomisk återhämtning",
  "Rec-04": "Återupprättande av infrastruktur",
  "Rec-05": "Återhämtningsstöd",
  // Capabilities
  "Mit-RA-01": "Riskidentifiering",
  "Mit-RA-02": "Riskanalys",
  "Mit-RA-03": "Riskvärdering",
  "Mit-ER-01": "Egendomsskydd",
  "Mit-ER-02": "Skydd av naturresurser",
  "Mit-ER-03": "Medvetandehöjning",
  "Mit-MS-01": "Trendanalys",
  "Mit-MS-02": "Övervakning och granskning",
  "Prep-CD-01": "Planering för insats och återhämtning",
  "Prep-CD-02": "Utbildning",
  "Prep-CD-03": "Riskkommunikation",
  "Prep-MO-01": "Detektion",
  "Prep-MO-02": "Larm",
  "Prep-PS-01": "Personalhantering",
  "Prep-PS-02": "Tillgångshantering",
  "Prep-PS-03": "Samarbetsetablering",
  "Prep-EH-04": "Psykologisk vård",
  "Resp-SI-01": "Brandsläckning - Infrastrukturer",
  "Resp-SI-02": "Brandsläckning - Natur",
  "Resp-SI-03": "Översvämningskontroll",
  "Resp-SI04": "Farlig ämne-kontroll (CBRN-E)",
  "Resp-RO-01": "Sök och räddning (SAR)",
  "Resp-RO-02": "Behandling av skadade på plats",
  "Resp-RO-03": "Transport av offer",
  "Resp-SL-01": "Säkring av platser/personer",
  "Resp-SL-02": "Identifiering av personer",
  "Resp-SL-03": "Kriminalteknik",
  "Resp-SL-04": "Upprätthålla allmän ordning",
  "Resp-SL-05": "Trafikledning",
  "Resp-EH-01": "Akutvård - Sjukhus",
  "Resp-EH-02": "Karantän",
  "Resp-EH-03": "Masshälsovård",
  "Resp-CS-01": "Varning",
  "Resp-CS-02": "Kriskommunikation",
  "Resp-SF-01": "Evakuering",
  "Resp-SF-02": "Tillfälligt boende",
  "Resp-SF-03": "Återförening",
  "Resp-DA-01": "Skräpröjning",
  "Resp-DA-02": "Dekontaminering av objekt",
  "Resp-DA-03": "Dränering",
  "Resp-DA-04": "Djurförstöring",
  "Resp-BN-01": "Dricksvattenförsörjning",
  "Resp-BN-02": "Livsmedelsförsörjning",
  "Resp-BN-03": "Energiförsörjning",
  "Resp-BN-04": "Tillhandahållande av IKT/Telekommunikation",
  "Resp-BN-05": "Sanitetslösningar",
  "Resp-RS-01": "Ledning, kontroll och samordning",
  "Resp-RS-02": "Lägesbedömning",
  "Resp-RS-03": "Informationshantering",
  "Resp-RS-04": "Övervakning / Datainsamling",
  "Resp-RS-05": "Operativt stöd på plats",
  "Resp-RS-06": "Logistik",
  "Rec-HR-01": "Tillhandahålla folkhälsa och säkerhet",
  "Rec-HR-02": "Tillhandahålla mat och boende",
  "Rec-ER-01": "Avfallshantering",
  "Rec-ER-02": "Återställning av livsmiljöer",
  "Rec-EC-01": "Affärsåterställning",
  "Rec-EC-02": "Finansiell återhämtning",
  "Rec-RI-01": "Återupprättande av transport",
  "Rec-RI-02": "Återupprättande av el och vatten",
  "Rec-RS-01": "Etablering av återhämtningsorganisation",
  "Rec-RS-02": "Återhämtningsprogrammering",
  // Goals
  "Goal-01": "Förhindra incidenter",
  "Goal-01_desc": "Förhindra katastrofer / krissituationer.",
  "Goal-02": "Minimera förluster från faror",
  "Goal-02_desc": "Minska / undvika förluster från faror.",
  "Goal-03": "Hjälpa offer",
  "Goal-03_desc": "Säkerställa snabb och effektiv hjälp till offer.",
  "Goal-04": "Adekvat återhämtning",
  "Goal-04_desc": "Uppnå snabb och effektiv återhämtning.",
  // Stakeholder types
  "TO-01": "Brandkår / Civilskydd",
  "TO-02": "Polis",
  "TO-03": "Akut hälsovård",
  "TO-04": "Försvar",
  "TO-05": "Ledningscentral",
  "TO-06": "Myndigheter",
  "TO-07": "Kritisk infrastruktur",
  "TO-08": "NGO",
  "TO-09": "Övriga",
  // Stakeholders
  "SH-01": "Brandkår/Civilskydd",
  "SH-02": "Polis",
  "SH-03": "Akut hälsovård",
  "SH-04": "SAR",
  "SH-05": "Lednings- eller larmcentral (112)",
  "SH-06": "Myndigheter (ministerier, kommuner)",
  "SH-07": "Försvar",
  "SH-08": "Offentliga tjänster",
  "SH-09": "Kustbevakning eller gränssäkerhet",
  "SH-10": "Operatör av kritisk infrastruktur",
  "SH-11": "NGO",
  "SH-12": "Övriga (ska beskrivas)",
  // Importance scale
  "Imp-1": "Ingen/Mycket låg",
  "Imp-2": "Låg",
  "Imp-3": "Medel",
  "Imp-4": "Ganska hög",
  "Imp-5": "Mycket hög",
  // Performance aspects
  "PA-1": "Ändamålsenlighet",
  "PA-1_desc": "Kvalitet på resultaten, tidsenlighet, uthållighet.",
  "PA-2": "Säkerhet för yrkesverksamma",
  "PA-2_desc": "Fysisk och mental säkerhet för involverad personal.",
  "PA-3": "Effektivitet",
  "PA-3_desc": "Förhållandet mellan kostnader och resultat.",
  // Performance scale
  "PSc-1": "Dålig",
  "PSc-2": "Otillfredsställande",
  "PSc-3": "Måttlig",
  "PSc-4": "Tillfredsställande",
  "PSc-5": "Bra",
  // Gap natures
  "Nat-01": "Teknologisk",
  "Nat-01_desc":
    "T.ex. Sensorteknik, Ledning och kontroll, kommunikationer och samordning, IKT.",
  "Nat-02": "Mänsklig",
  "Nat-02_desc":
    "T.ex. Mängd personal, Personalens kompetens, Utbildning och träning.",
  "Nat-03": "Organisatorisk",
  "Nat-03_desc":
    "T.ex. Procedurer, Organisationsstruktur, Ekonomiska aspekter, Avtal.",
  "Nat-04": "Regulatorisk",
  "Nat-04_desc": "T.ex. Juridiska aspekter, Formella standardiseringsaspekter.",
  // Gap scale
  "Kn-01": "Okänd",
  "Kn-02": "Nej",
  "Kn-03": "Ja",
  // Assessment scale
  "ASc-01": "Mycket låg",
  "ASc-02": "Låg",
  "ASc-03": "Måttlig",
  "ASc-04": "Hög",
  "ASc-05": "Mycket hög",
  // Category descriptions
  "Cat-01_desc":
    "Mål: Att vidta åtgärder för att begränsa sannolikheten och minska konsekvenserna av en incident, katastrof eller kris.",
  "Cat-02_desc":
    "Mål: Att utveckla och upprätthålla organisationsstrukturen och förmågorna för att genomföra insats- och återhämtningsaktiviteter.",
  "Cat-03_desc": "Mål: Att rädda liv och begränsa negativa effekter.",
  "Cat-04_desc":
    "Mål: Att rekonstruera och återställa normalt liv på ett effektivt sätt.",
  // Subcategory descriptions
  "Mit-01_desc": "Identifiering, analys och utvärdering av risker.",
  "Mit-02_desc":
    "Skydd av egendom, naturresurser och samhället i allmänhet mot faror.",
  "Mit-03_desc": "Förmågor till stöd för riskreducering / Förebyggande.",
  "Prep-01_desc":
    "Process för att utveckla och upprätthålla erforderliga kapaciteter för krishantering.",
  "Prep-02_desc":
    "Bestämma statusen för en miljö eller situation för att möjliggöra detektering av incidenter.",
  "Prep-03_desc": "Förmågor till stöd för kapacitetsutveckling.",
  "Rsp-01_desc":
    "Aktiviteter på plats för att stoppa eller begränsa orsaken till katastrofen.",
  "Rsp-02_desc": "Aktiviteter på plats för att rädda liv.",
  "Rsp-03_desc":
    "Säkring av områden/personer, Identifiering av personer, Kriminalteknik.",
  "Rsp-04_desc": "Aktiviteter utanför platsen för att rädda liv.",
  "Rsp-05_desc": "Varning och kriskommunikation.",
  "Rsp-06_desc": "Kontrollerad evakuering av personer och/eller djur.",
  "Rsp-07_desc":
    "Ordna tillgänglighet till och säkerhet i det drabbade området.",
  "Rsp-08_desc":
    "Försörjning och/eller återställning av grundläggande produkter och tjänster av vital betydelse.",
  "Rsp-09_desc": "Förmågor som möjliggör en eller flera andra insatsförmågor.",
  "Rec-01_desc":
    "Tillhandahållande av folkhälso- och säkerhetstjänster samt boende.",
  "Rec-02_desc": "Rensning av föroreningar och dekontaminering.",
  "Rec-03_desc": "Ekonomisk och affärsmässig återhämtning.",
  "Rec-04_desc": "Återupprättande av transportleder och viktiga tjänster.",
  "Rec-05_desc":
    "Förmågor som krävs för att återhämta sig på ett välsamordnat sätt.",
  // Capability descriptions
  "Mit-RA-01_desc": "Process för att hitta, känna igen och beskriva risk.",
  "Mit-RA-02_desc":
    "Process för att förstå riskens natur och fastställa risknivån.",
  "Mit-RA-03_desc":
    "Process för att jämföra resultaten av riskanalys med riskkriterier för att avgöra om risken och/eller dess omfattning är acceptabel eller tolerabel.",
  "Mit-ER-01_desc": "Egendomsskydd (inkl. kritiska infrastrukturer).",
  "Mit-ER-02_desc":
    "Åtgärder som minimerar skador från faror och bevarar eller återställer naturliga systems funktioner.",
  "Mit-ER-03_desc":
    "Allmän utbildning och medvetandehöjning om faror och potentiella sätt att reducera dem.",
  "Mit-MS-01_desc": "Undersökning av riskernas utveckling.",
  "Mit-MS-02_desc":
    "Säkerställa att kontroller är effektiva och ändamålsenliga, inhämta ytterligare information för att förbättra riskbedömningen.",
  "Prep-CD-01_desc":
    "Utveckla, sammanställa och underhålla procedurer och information i beredskap för användning vid en incident.",
  "Prep-CD-02_desc":
    "Aktiviteter för att underlätta lärande och utveckling av kunskap, färdigheter och förmågor för katastrofinsats.",
  "Prep-CD-03_desc":
    "Kommunicera och instruera allmänheten om hur man är väl förberedd för en kris och hur man ska bete sig när den inträffar.",
  "Prep-MO-01_desc": "Detektion av förhållanden som avviker från det normala.",
  "Prep-MO-02_desc":
    "Larma personal om förekomsten av en incident och möjliggöra att kontrollåtgärder initieras.",
  "Prep-PS-01_desc":
    "Aktiviteter för att tillhandahålla tillräcklig och skicklig personal som krävs för att utföra insats- och återhämtningsuppgifter.",
  "Prep-PS-02_desc":
    "Aktiviteter för att tillhandahålla utrustning, verktyg, IKT och andra tillgångar som krävs för att möjliggöra insats och återhämtning.",
  "Prep-PS-03_desc":
    "Internationellt samarbetsetablering mellan räddningstjänst och tredje parter.",
  "Prep-EH-04_desc":
    "Psykologisk hälsovård till offer, anhöriga och andra personer som drabbats av incidenten.",
  "Resp-SI-01_desc":
    "Bekämpning av bränder i byggnader, bebyggda områden eller vid infrastrukturer.",
  "Resp-SI-02_desc": "Bekämpning av bränder i naturmiljöer.",
  "Resp-SI-03_desc":
    "Vattenhantering vid översvämning på grund av dammbrott eller kraftigt regn.",
  "Resp-SI04_desc":
    "Stoppa spill av farliga material, inklusive inneslutning (CBRN-E-incidenter).",
  "Resp-RO-01_desc": "Sök- och räddningsoperationer.",
  "Resp-RO-02_desc": "Triage, dekontaminering och stabilisering av offer.",
  "Resp-RO-03_desc": "Ambulanstransport till säkra områden eller sjukhus.",
  "Resp-SL-01_desc":
    "Skydda områden, infrastrukturer och personer från obehöriga.",
  "Resp-SL-02_desc": "Identifiering av offer.",
  "Resp-SL-03_desc":
    "Kriminaltekniska aktiviteter för att undersöka orsaken till incidenten och säkra bevis.",
  "Resp-SL-04_desc": "Kravallkontroll, etc.",
  "Resp-SL-05_desc":
    "Trafikledning både in till och ut från det drabbade området.",
  "Resp-EH-01_desc": "Hälsovård i ordinarie och/eller fältsjukhus.",
  "Resp-EH-02_desc": "Isolering av potentiellt smittade personer/offer.",
  "Resp-EH-03_desc":
    "Massprofylax eller vaccination vid en kärn-incident eller pandemi.",
  "Resp-CS-01_desc":
    "Varna samhället i det hotade området genom att ge snabb och tillräcklig information om hotet.",
  "Resp-CS-02_desc":
    "Tillhandahålla information om katastrofen till samhället, inklusive volontärhantering och upprop.",
  "Resp-SF-01_desc":
    "Kontrollerad evakuering av personer och djur från ett visst område eller en byggnad.",
  "Resp-SF-02_desc":
    "Tillhandahållande av boende till evakuerade, inklusive näring och sanitet.",
  "Resp-SF-03_desc": "Återförening av evakuerade med deras anhöriga.",
  "Resp-DA-01_desc": "Borttagning av skräp och/eller kontaminerat material.",
  "Resp-DA-02_desc":
    "Dekontaminering av kontaminerade områden, infrastrukturer och/eller fordon.",
  "Resp-DA-03_desc":
    "Dränering och pumpning av översvämmade områden eller infrastrukturer.",
  "Resp-DA-04_desc": "Destruering av potentiellt infekterade djur.",
  "Resp-BN-01_desc":
    "Återställning eller tillfällig tillhandahållande av dricksvatten.",
  "Resp-BN-02_desc": "Tillfällig tillhandahållande av mat.",
  "Resp-BN-03_desc":
    "Återställning av el-/gasleverans eller tillhandahållande av tillfällig alternativ energi.",
  "Resp-BN-04_desc":
    "Återställning eller tillfällig leverans av IKT och telekommunikation.",
  "Resp-BN-05_desc":
    "Återställa sanitet eller tillhandahålla tillfälliga lösningar.",
  "Resp-RS-01_desc":
    "Beslutsfattande, planering och uppgiftstilldelning på samordnings- och ledningsnivå vid hantering av katastrofhändelse.",
  "Resp-RS-02_desc":
    "Utveckling av operativ information genom berikning av insamlade data, inklusive gemensam operativ bild.",
  "Resp-RS-03_desc":
    "Lagring och delning av information som insamlade data, bedömningar och fattade beslut.",
  "Resp-RS-04_desc":
    "Insamling av data genom fysisk övervakning (surveillance) och datautvinning.",
  "Resp-RS-05_desc":
    "Leverans av grundläggande tjänster till insatspersonal på plats för att möjliggöra insatsaktiviteter.",
  "Resp-RS-06_desc":
    "Transport av personal och materiel för att stödja uthålliga katastrofinsatsoperationer.",
  "Rec-HR-01_desc":
    "Tillhandahållande av folkhälso- och säkerhetstjänster för de som blivit hemlösa.",
  "Rec-HR-02_desc":
    "Tillhandahållande av mat och boende för de som blivit hemlösa.",
  "Rec-ER-01_desc":
    "Rensning av storskalig förorening och dekontaminering, samt hantering av avfall.",
  "Rec-ER-02_desc": "Återställning av naturresurser och livsmiljöer.",
  "Rec-EC-01_desc":
    "Affärsmässig återhämtning för butiker och industri som drabbats av katastrofen.",
  "Rec-EC-02_desc":
    "Återhämtning från finansiella konsekvenser för myndigheter.",
  "Rec-RI-01_desc":
    "Återupprättande av transportleder (väg, järnväg, vatten, luft, pipelines).",
  "Rec-RI-02_desc":
    "Återställning av avbrutna tjänster och andra viktiga tjänster.",
  "Rec-RS-01_desc":
    "Etablering av återhämtningsorganisationsstruktur för både kortsiktig och långsiktig återhämtning.",
  "Rec-RS-02_desc":
    "Fastställande och implementering av återhämtningsprogram baserat på konsekvensbedömning.",
  // Overview UI
  manage_capabilities: "Välj förmågor",
  select_capabilities_instr: "Välj de förmågor du vill bedöma för brister.",
  // Context drawer
  drawer_hazards: "Faror",
  drawer_gaps: "Brister",
  drawer_solutions: "Lösningar",
  drawer_roadmap: "Färdplan",
  drawer_capabilities: "Förmågor",
  drawer_solution: "Lösning",
  drawer_with_gaps: "med brister",
  drawer_no_linked_caps: "Inga länkade förmågor",
  drawer_add_to_roadmap: "Lägg till i färdplan →",
  drawer_go_to_solutions: "Gå till lösningar →",
  drawer_go_to_roadmap: "Gå till färdplan →",
  drawer_none: "Ingen",
  drawer_relevant_hazards: "Relevanta faror",
  // Assessment action priority
  action_priority: "Åtgärdsprioritet",
  action_priority_instr:
    "Betygsätt din vilja att agera för att förbättra denna förmåga (1 = låg, 5 = brådskande)",
  action_priority_label_1: "Inte nu",
  action_priority_label_3: "Kanske",
  action_priority_label_5: "Brådskande",
  // Assessment navigation
  prev_cap: "Föregående",
  next_cap: "Nästa",
  about_markdown: `#### DIREKTION Assessment & Screening Framework (DASF)

Verktygssamlingen DASF stödjer den systematiska bedömnings- och screeningprocessen för katastrofhantering. Den ger ett strukturerat fyra-stegsapproach:

1. **Initiering och Beredskap (I&B)**: Identifiera relevanta farotyper och definiera omfånget för bedömningen.
2. **Bedömning av Behov och Luckor (BBL)**: Bedöm kapaciteter inom katastrofhanteringscykeln, identifiera luckor och förbättringsbehov.
3. **Lösningsbedömning (LB)**: Utvärdera potentiella lösningar för identifierade kapacitetsluckor, inklusive efterlevnad, användarnas behov och effektbedömning.
4. **Vägkarta (VK)**: Planera implementeringstidsplaner och åtaganden för valda lösningar.

##### Komma Igång

- Skapa eller öppna en bedömningssession från startsidan
- Navigera genom de 4 stegen med hjälp av verktygsfältets ikoner
- Växla mellan Användare och Redaktör roller med hjälp av väljaren nedan

##### Roller

- **Vanlig Användare**: Kan fylla i bedömningar och se resultat
- **Moderator**: Kan redigera ramverkskonfigurationen (farotyper, kapaciteter, intressenter)
- **Administrator**: Kan ändra bedömningsskalor och inställningar

##### Bakgrund

Detta projekt har mottagit finansiering från Europeiska unionens Horizon 2020-program för forskning och innovation. Utvecklat av TNO som en del av projektet [DIREKTION](https://www.direktion-network.org).`,

  // ── Collaboration (EN fallback) ────────────────────────────────────────────
  COLLABORATE: {
    TITLE: "Collaborate",
    ROUTE: "/collaborate",
    PAGE: "Collaboration",
  },
  FACILITATOR: "Facilitator",
  collab_page_title: "Collaboration",
  collab_send_invite: "Send Invite",
  collab_load_patch: "Load Patch",
  collab_mode_ca: "Capability Assessment",
  collab_mode_sc: "Solution Creation",
  collab_mode_sa: "Solution Assessment",
  collab_select_modes: "Select collaboration modes",
  collab_your_name: "Your name",
  collab_your_email: "Your email",
  collab_facilitator_name: "Facilitator name",
  collab_facilitator_email: "Facilitator email",
  collab_custom_message: "Optional message",
  collab_generate_link: "Send Invite by Email",
  collab_done: "Klar - Skicka resultat",
  collab_patch_loaded: "Patch loaded",
  collab_patches_count: {
    1: "1 patch received",
    n: "{n} patches received",
  },
  collab_hash_mismatch:
    "Warning: This patch was created from a different version of the model.",
  collab_session_mismatch:
    "This patch belongs to a different session and cannot be loaded.",
  collab_duplicate_ignored: "Duplicate patch ignored (already loaded).",
  collab_aggregated_results: "Aggregated Results",
  collab_apply_results: "Apply to model",
  collab_no_patches: "No patches received yet.",
  collab_invited_by: "You have been invited by {name} ({email}) to contribute.",
  collab_paste_patch: "Paste a patch link here",
  collab_load_patch_btn: "Load",
  collab_remove_patch: "Remove",
  collab_contributor: "Contributor",
  collab_received_at: "Received at",
  collab_avg_action_priority: "Avg. action priority",
  collab_task_items: "Task importance answers",
  collab_perf_items: "Performance answers",
  collab_gap_items: "Gap answers",
  collab_all_values: "All values",
  collab_avg_value: "Average",
  collab_invite_subject: "Invitation to collaborate on capability assessment",
  collab_invite_body:
    "Dear colleague,\n\nYou are invited to contribute to a capability assessment for {facilitatorName}.\n\nPlease click the link below to open the assessment tool and fill in your responses. When you are done, click the 'Done' button to send your results back.\n\nThis link is valid for one-time use — please do not share it.\n\nKind regards,\n{facilitatorName}",
  collab_patch_subject: "Capability assessment completed",
  collab_patch_body:
    "Dear {facilitatorName},\n\nI have completed the capability assessment you sent me.\n\nPlease click the link below to load my responses into the tool.\n\nKind regards,\n{userName}",
  // ── End Collaboration ───────────────────────────────────────────────────────
};
