import React from "react";
import { finnMiljoStreng } from "@/utils/miljoUtil";
import styled from "styled-components";
import { UtdragOppfolgingsplaner } from "./UtdragOppfolgingsplaner";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Box, Heading, Link } from "@navikt/ds-react";
import Sykmeldinger from "./Sykmeldinger";

const texts = {
  header: "Utdrag fra sykefraværet",
  samtalereferat: {
    header: "Samtalereferat",
    lenkeTekst: "Samtalereferat",
  },
  vedtak: {
    header: "Vedtak",
  },
};

const SamtalereferatWrapper = styled.div`
  margin-bottom: 2em;
`;

export const Samtalereferat = () => {
  const fnr = useValgtPersonident();
  return (
    <SamtalereferatWrapper>
      <Heading size="small" level="3">
        {texts.samtalereferat.header}
      </Heading>
      <Link
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {texts.samtalereferat.lenkeTekst}
      </Link>
    </SamtalereferatWrapper>
  );
};

const UtdragFraSykefravaeret = () => {
  return (
    <Box padding="4" background="surface-default" className="mb-4 h-min">
      <Heading level="2" size="medium" className="mb-4">
        {texts.header}
      </Heading>
      <UtdragOppfolgingsplaner />
      <Sykmeldinger />
      <Samtalereferat />
      <Heading size="small" level="3">
        {texts.vedtak.header}
      </Heading>
      <SpinnsynLenke />
    </Box>
  );
};

export default UtdragFraSykefravaeret;
