import m from "mithril";
import { render } from "mithril-ui-form";
import { CapabilityModel, Pages, UserType } from "../models";
import { actions, MeiosisComponent, i18n, t } from "../services";
import tnoLogo from "../assets/tno_txt.svg";
import { Select } from "mithril-materialized";

const mdEn = `#### DIREKTION Assessment & Screening Framework (DASF)

The DASF toolset supports the systematic assessment and screening process for disaster management. It provides a structured 4-step approach:

1. **Initiation & Preparation (I&P)**: Identify relevant hazard types and define the assessment scope.
2. **Needs & Gaps Assessment (NGA)**: Assess capabilities across the disaster management cycle, identify gaps and improvement needs.
3. **Solution Assessment (SA)**: Evaluate potential solutions for identified capability gaps, including compliance, user needs, and impact assessment.
4. **Roadmapping (RM)**: Plan implementation timelines and commitments for selected solutions.

##### Getting Started

- Create or open an assessment session from the landing page
- Navigate through the 4 steps using the toolbar icons
- Switch between User and Editor roles using the selector below

##### Roles

- **Regular User**: Can fill out assessments and view results
- **Moderator**: Can edit framework configuration (hazard types, capabilities, stakeholders)
- **Administrator**: Can modify assessment scales and settings

##### Background

This project has received funding from the European Union's Horizon 2020 research and innovation programme. Developed by TNO as part of the [DIREKTION](https://www.direktion-network.org) project.`;

const mdNl = `#### DIREKTION Assessment & Screening Framework (DASF)

De DASF-toolset ondersteunt het systematische beoordelings- en screeningproces voor rampenbestrijding. Het biedt een gestructureerde aanpak in 4 stappen:

1. **Initiatie & Voorbereiding (I&P)**: Identificeer relevante typen gevaren en definieer de scope van de beoordeling.
2. **Behoeften & Lacunes Beoordeling (NGA)**: Beoordeel capaciteiten in de rampenbestrijdingscyclus, identificeer lacunes en verbeterbehoeften.
3. **Oplossingsbeoordeling (SA)**: Evalueer potentiële oplossingen voor geïdentificeerde lacunes, inclusief compliance, gebruikersbehoeften en impactbeoordeling.
4. **Routekaart (RM)**: Plan implementatietijdlijnen en toezeggingen voor geselecteerde oplossingen.

##### Aan de slag

- Maak een nieuwe of open een bestaande beoordelingssessie vanaf de startpagina
- Navigeer door de 4 stappen met de werkbalkpictogrammen
- Schakel tussen Gebruiker- en Redacteurrol met de selector hieronder

##### Rollen

- **Gewone gebruiker**: Kan beoordelingen invullen en resultaten bekijken
- **Moderator**: Kan de frameworkconfiguratie bewerken (gevarentypen, capaciteiten, stakeholders)
- **Beheerder**: Kan beoordelingsschalen en instellingen wijzigen

##### Achtergrond

Dit project heeft financiering ontvangen van het Horizon 2020-programma voor onderzoek en innovatie van de Europese Unie. Ontwikkeld door TNO als onderdeel van het [DIREKTION](https://www.direktion-network.org)-project.`;

export const Attribution: MeiosisComponent = () => {
  return {
    view: ({
      attrs: {
        state: { catModel = {} as CapabilityModel },
      },
    }) => {
      const { attributionLogo, attributionText, logo } = catModel.data || {};

      return (
        (attributionLogo || attributionText) &&
        m(
          ".footer.flex-container",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
            },
          },
          [
            m(
              ".logo",
              { style: "max-width: 100%" },
              attributionLogo &&
                m("img[height=50][title=Attribution logo]", {
                  src: attributionLogo,
                }),
            ),
            m(
              ".flex-item",
              { style: { flex: "1", margin: "0 20px", fontSize: "10pt" } },
              attributionText &&
                m("span", m.trust(render(attributionText, true))),
            ),
            m(
              ".logo.right-align",
              { style: "max-width: 100%" },
              m("img[height=50][title=Owner]", { src: logo || tnoLogo }),
            ),
          ],
        )
      );
    },
  };
};

export const AboutPage: MeiosisComponent = () => ({
  oninit: ({ attrs }) => actions.setPage(attrs, Pages.ABOUT),
  view: ({ attrs }) => {
    const { curUser } = attrs.state;
    return [
      m(".row", [
        m(Select<UserType>, {
          label: t("select_user"),
          initialValue: curUser,
          options: [
            { id: "user", label: t("user") },
            { id: "moderator", label: t("moderator") },
            { id: "admin", label: t("admin") },
          ],
          onchange: (v) => v && actions.saveCurUser(attrs, v[0]),
          className: "col offset-s6 s6 offset-m9 m3",
        }),
        m(
          ".col.s12.markdown",
          m.trust(render(i18n.currentLocale === "nl" ? mdNl : mdEn)),
        ),
      ]),
      m(Attribution, { ...attrs }),
    ];
  },
});
