import { Alert, BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  header:
    "Har du sendt ut forhåndsvarsel om aktivitetskrav i perioden 27. februar - 12. mars?",
  info: "Grunnet teknisk feil har ikke forhåndsvarsel i denne perioden blitt varslet på riktig måte. I saker der brev ble sendt før 10. mars har bruker fått ny frist for tilbakemelding 9. april. Bruker er informert om dette på innloggede sider, og frist i Modia syfo er oppdatert. Brev sendt etter 10. mars har ikke fått forlenget frist. Brukere som ber om utsatt frist skal få det. Les mer ",
  url: "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Teknisk-feil-med-varslinger-i-perioden-27.02.2025-til-13.03.2025.aspx",
  linkText: "her",
};

export default function ForhandsvarselIkkeSendtUtAlert() {
  const { data } = useAktivitetskravQuery();
  const start = new Date("2025-02-27T12:00:00Z");
  const end = new Date("2025-03-10T00:00:00Z");

  const isForhandsvarsel = (vurdering: AktivitetskravVurderingDTO) =>
    vurdering.status === AktivitetskravStatus.FORHANDSVARSEL;
  const isBetweenDates = (vurdering: AktivitetskravVurderingDTO) =>
    start <= new Date(vurdering.createdAt) &&
    new Date(vurdering.createdAt) <= end;

  const showVarsel = data
    .flatMap((aktivitetskrav) =>
      aktivitetskrav.vurderinger.filter(isForhandsvarsel)
    )
    .some(isBetweenDates);

  return (
    showVarsel && (
      <Alert
        variant={"error"}
        size={"medium"}
        className={"mb-2"}
        contentMaxWidth={false}
      >
        <Label>{texts.header}</Label>
        <BodyShort>
          {texts.info}
          <EksternLenke href={texts.url}>{texts.linkText}</EksternLenke>
        </BodyShort>
      </Alert>
    )
  );
}
