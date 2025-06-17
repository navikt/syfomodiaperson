import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import * as avvisningsregelnavn from "../../../../utils/sykmeldinger/avvisningsregelnavn";
import { Alert, BodyShort, Box, Heading, List } from "@navikt/ds-react";

const avvistSykmeldingFilter = (sykmelding: SykmeldingOldFormat) => {
  return sykmelding.behandlingsutfall.ruleHits.filter((rule) => {
    return rule.ruleStatus === null || rule.ruleStatus === "INVALID";
  });
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvvistSykmeldingAlert({
  sykmelding,
}: Props): ReactElement {
  const reglerUtenBegrunnelse = [
    avvisningsregelnavn.PASIENT_ELDRE_ENN_70,
    avvisningsregelnavn.UGYLDIG_REGELSETTVERSJON,
    avvisningsregelnavn.BEHANDLER_IKKE_GYLDIG_I_HPR,
    avvisningsregelnavn.BEHANDLER_MANGLER_AUTORISASJON_I_HPR,
    avvisningsregelnavn.BEHANDLER_IKKE_LE_KI_MT_TL_FT_I_HPR,
    avvisningsregelnavn.BEHANDLER_SUSPENDERT,
  ];
  const visBegrunnelse =
    sykmelding.behandlingsutfall.ruleHits.length > 0 &&
    !sykmelding.behandlingsutfall.ruleHits.reduce((acc, ruleHit) => {
      return acc || reglerUtenBegrunnelse.includes(ruleHit.ruleName);
    }, false);

  const description = "Grunnen til at sykmeldingen er avvist:";

  return (
    <Box background="surface-default" className="mb-4">
      <Alert variant="warning" size="small">
        <Heading level="3" size="small">
          Sykmeldingen er avvist
        </Heading>
        {visBegrunnelse && (
          <div>
            <BodyShort size="small">{description}</BodyShort>
            {sykmelding.behandlingsutfall.ruleHits.length === 1 ? (
              <BodyShort size="small">
                {sykmelding.behandlingsutfall.ruleHits[0].messageForUser}
              </BodyShort>
            ) : (
              <List as="ul" size="small">
                {avvistSykmeldingFilter(sykmelding).map((ruleHit) => {
                  return (
                    <List.Item key={ruleHit.ruleName}>
                      {ruleHit.messageForUser}
                    </List.Item>
                  );
                })}
              </List>
            )}
          </div>
        )}
      </Alert>
    </Box>
  );
}
