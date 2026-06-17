import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const kartleggingssporsmalSurvey = {
  type: "custom",
  questions: [
    {
      id: "identifisering",
      type: "singleChoice",
      prompt:
        "Hjelper kartleggingsspørsmålene deg med å tidlig kunne identifisere de som står i fare for et langvarig sykefravær?",
      options: [
        {
          value: "ja",
          label: "Ja",
        },
        {
          value: "nei",
          label: "Nei",
        },
      ],
      required: true,
    },
    {
      id: "prioritering",
      type: "singleChoice",
      prompt:
        "Opplever du at det er enklere for deg å prioritere tiden din på de riktige brukerne etter innføring av kartleggingsspørsmålene?",
      options: [
        {
          value: "ja",
          label: "Ja",
        },
        {
          value: "nei",
          label: "Nei",
        },
      ],
      required: true,
    },
    {
      id: "innspill",
      type: "text",
      prompt: "Hva skal til for å gjøre kartleggingsspørsmålene bedre?",
      maxLength: 300,
    },
  ],
} satisfies LumiSurveyConfig;
