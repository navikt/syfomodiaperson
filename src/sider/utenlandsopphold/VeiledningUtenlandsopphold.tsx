import { EksternLenke } from "@/components/EksternLenke";
import { VeiledningBox } from "@/components/veiledning/VeiledningBox";
import {
  NestableListItem,
  VeiledningListForItems,
} from "@/components/veiledning/VeiledningListForItems";
import { Box, Heading } from "@navikt/ds-react";
import React from "react";

const linkRutineYrkesskade =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Vurdering-av-%C3%A5rsakssammenheng-ved-yrkesskade-yrkessykdm.aspx";
const linkServiceRutine =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Utenlandsopphold.aspx";
const linkTemaside =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Sykepenger-ved-opphold-i-utlandet.aspx";
const linkNyhetssakNavet =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Vedtak-om-utenlandsopphold-i-Modia-syfo.aspx";
const linkRundskriv =
  "https://lovdata.no/pro/#document/NAV/rundskriv/r08-00/KAPITTEL_3-9-3";

const texts = {
  headingRutine: "Rutine",
  headingTilleggsopplysninger: "Tilleggsopplysninger",
  headingSeOgsaaLenker: "Se også",
  linkServiceRutine: "Servicerutinen om utenlandsopphold",
  linkTemaside: "Temaside om Sykepenger ved opphold i utlandet",
  linkNyhetssakNavet: "Nyhetssak om denne løsningen på Navet",
  linkRundskriv: "Rundskriv til folketrygdloven § 8-9 tredje ledd",
};

const rutineListItems: NestableListItem[] = [
  {
    text: (
      <>
        Sjekk om sykefraværet skyldes godkjent yrkesskade (sjekk i Gosys om Nav
        Arbeid og ytelser har fattet vedtak, se{" "}
        <EksternLenke href={linkRutineYrkesskade}>rutinen</EksternLenke>
        ).
      </>
    ),
    subItems: [
      "Vurderingen av årsakssammenheng gjøres av Nav Arbeid og ytelser etter § 8-55.",
    ],
  },
  "Vurder om § 8-4 er oppfylt hele perioden det søkes om.",
  {
    text: "Vurder om:",
    subItems: [
      "reisen ikke forlenger sykefraværet",
      "reisen ikke hindrer planlagt oppfølging, aktivitet eller behandling",
    ],
  },
  "Sjekk tidligere godkjente utenlandsopphold siste 12 måneder. Det kan innvilges opphold i inntil 4 uker (28 dager) i løpet av en periode på 12 måneder.",
];

const tilleggsopplysningerListItems: NestableListItem[] = [
  "Tredjelandsborgere må som hovedregel oppholde seg i Norge. Unntak kan følge av trygdeavtaler, for eksempel den nordiske konvensjonen.",
  {
    text: "Hvis oppholdet ikke er godkjent, enten fordi det ikke er søkt eller fordi man har fått avslag, utbetales det ikke sykepenger for perioden.",
    subItems: [
      {
        text: "Konsekvensene kan være:",
        subItems: [
          "lavere sykepengegrunnlag,",
          "ny arbeidsgiverperiode eller ventetid, eller",
          "bortfall av rett til sykepenger",
        ],
      },
    ],
  },
  "Ved søknad på opphold som varer mer enn 4 uker, skal deler av søknaden avslås på denne bakgrunn.",
];

const seOgsaLenkerListItems: NestableListItem[] = [
  <EksternLenke href={linkServiceRutine}>
    {texts.linkServiceRutine}
  </EksternLenke>,
  <EksternLenke href={linkTemaside}>{texts.linkTemaside}</EksternLenke>,
  <EksternLenke href={linkNyhetssakNavet}>
    {texts.linkNyhetssakNavet}
  </EksternLenke>,
  <EksternLenke href={linkRundskriv}>{texts.linkRundskriv}</EksternLenke>,
];

function Rutine() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        {texts.headingRutine}
      </Heading>

      <VeiledningListForItems items={rutineListItems} />
    </Box>
  );
}

function Tilleggsopplysninger() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        {texts.headingTilleggsopplysninger}
      </Heading>

      <VeiledningListForItems items={tilleggsopplysningerListItems} />
    </Box>
  );
}

function SeOgsaLenker() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        {texts.headingSeOgsaaLenker}
      </Heading>

      <VeiledningListForItems items={seOgsaLenkerListItems} />
    </Box>
  );
}

export default function VeiledningUtenlandsopphold() {
  return (
    <VeiledningBox>
      <Rutine />
      <Tilleggsopplysninger />
      <SeOgsaLenker />
    </VeiledningBox>
  );
}
