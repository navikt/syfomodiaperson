import type { LumiSurveyConfig } from "@navikt/lumi-survey";

/** Lumi-survey for tilbakemelding paa den nye oppfolgingsplanen (V2). */
export const oppfolgingsplanSurvey = {
  type: "rating",
  questions: [
    {
      id: "rating",
      type: "rating",
      variant: "emoji",
      prompt: "Hva er ditt inntrykk av den nye oppfølgingsplanen?",
      description:
        "Du har mottatt den nye oppfølgingsplanen som prøves ut i Vestland, og vi vil gjerne ha din tilbakemelding",
      required: true,
    },
    {
      id: "kommentar",
      type: "text",
      prompt: "Har du noen kommentarer eller innspill?",
      maxLength: 1000,
      visibleIf: {
        field: "ANSWER",
        questionId: "rating",
        operator: "EXISTS",
      },
    },
  ],
} satisfies LumiSurveyConfig;
