export const lowRiskOptionIdByRadioFieldId = {
  hvorSannsynligTilbakeTilJobben: "1a",
  tilbakeTilJobbenHvorSannsynligFlervalg: "1a",
  mulighetForTilbakeTilJobbenFlervalg: "kommer_tilbake",
  arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
  arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
  naarTilbakeTilJobbenFlervalg: "3a",
} as const;

export const knownRadioFieldIds = Object.keys(
  lowRiskOptionIdByRadioFieldId,
) as KnownRadioFieldId[];

type KnownRadioFieldId = keyof typeof lowRiskOptionIdByRadioFieldId;

function isKnownRadioFieldId(fieldId: string): fieldId is KnownRadioFieldId {
  return fieldId in lowRiskOptionIdByRadioFieldId;
}
