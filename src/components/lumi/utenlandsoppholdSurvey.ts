import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const utenlandsoppholdSurvey = {
  type: "rating",
  questions: [
    {
      id: "inntrykk",
      type: "rating",
      variant: "emoji",
      prompt:
        "Hva er ditt inntrykk av siden for å behandle søknader om sykepenger under opphold utenfor EU/EØS?",
      description: "Vi vil gjerne ha din tilbakemelding",
      required: true,
    },
    {
      id: "innspill",
      type: "text",
      prompt: "Har du noen kommentarer eller innspill?",
      maxLength: 1000,
      visibleIf: {
        field: "ANSWER",
        questionId: "inntrykk",
        operator: "EXISTS",
      },
    },
  ],
} satisfies LumiSurveyConfig;
