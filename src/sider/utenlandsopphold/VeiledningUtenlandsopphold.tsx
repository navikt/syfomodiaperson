import { EksternLenke } from "@/components/EksternLenke";
import { VeiledningBox } from "@/components/veiledning/VeiledningBox";
import { VeiledningList } from "@/components/veiledning/VeiledningList";
import { Box, Heading, List } from "@navikt/ds-react";
import React from "react";

const linkRutineYrkesskade =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Vurdering-av-%C3%A5rsakssammenheng-ved-yrkesskade-yrkessykdm.aspx";

function Rutine() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        Rutine
      </Heading>

      <VeiledningList as="ul">
        <List.Item>
          Sjekk om sykefraværet skyldes godkjent yrkesskade (sjekk i Gosys om
          Nav Arbeid og ytelser har fattet vedtak, se{" "}
          <EksternLenke href={linkRutineYrkesskade}>rutinen</EksternLenke>
          ).
          <List as="ul" size="small">
            <List.Item>
              Vurderingen av årsakssammenheng gjøres av Nav Arbeid og ytelser
              etter § 8-55.
            </List.Item>
          </List>
        </List.Item>

        <List.Item>
          Vurder om § 8-4 er oppfylt hele perioden det søkes om.
        </List.Item>

        <List.Item>
          Vurder om:
          <List as="ul" size="small" className="mt-0">
            <List.Item>reisen ikke forlenger sykefraværet</List.Item>
            <List.Item>
              reisen ikke hindrer planlagt oppfølging, aktivitet eller
              behandling
            </List.Item>
          </List>
        </List.Item>

        <List.Item>
          Sjekk tidligere godkjente utenlandsopphold siste 12 måneder. Det kan
          innvilges opphold i inntil 4 uker (28 dager) i løpet av en periode på
          12 måneder.
        </List.Item>
      </VeiledningList>
    </Box>
  );
}

function Tilleggsopplysninger() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        Tilleggsopplysninger
      </Heading>

      <VeiledningList as="ul">
        <List.Item>
          Tredjelandsborgere må som hovedregel oppholde seg i Norge. Unntak kan
          følge av trygdeavtaler, for eksempel den nordiske konvensjonen. 
        </List.Item>

        <List.Item>
          Hvis oppholdet ikke er godkjent, enten fordi det ikke er søkt eller
          fordi man har fått avslag, utbetales det ikke sykepenger for perioden.
          <List as="ul" size="small">
            <List.Item>
              Konsekvensene kan være:
              <List as="ul" size="small">
                <List.Item>lavere sykepengegrunnlag,</List.Item>
                <List.Item>
                  ny arbeidsgiverperiode eller ventetid, eller
                </List.Item>
                <List.Item>bortfall av rett til sykepenger</List.Item>
              </List>
            </List.Item>
          </List>
        </List.Item>

        <List.Item>
          Ved søknad på opphold som varer mer enn 4 uker, skal deler av søknaden
          avslås på denne bakgrunn.
        </List.Item>
      </VeiledningList>
    </Box>
  );
}

export default function VeiledningUtenlandsopphold() {
  return (
    <VeiledningBox>
      <Rutine />
      <Tilleggsopplysninger />
    </VeiledningBox>
  );
}
