import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";
import { VedtakHistorikk } from "@/sider/frisktilarbeid/VedtakHistorikk";
import { Box, Link } from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

const texts = {
  title: "Friskmelding til arbeidsformidling",
  link: "Servicerutinen på Navet",
};

const serviceRutineLink =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Sykefrav%C3%A6rsomr%C3%A5det-Virkemidler.aspx";

export const FriskmeldingTilArbeidsformidlingSide = (): ReactElement => {
  const { isLoading, isError } = useVedtakQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.FRISKTILARBEID}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <FriskmeldingTilArbeidsformidling />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <div className="flex flex-col gap-4">
              <VedtakHistorikk />
              <Box background="surface-default" padding="2">
                <Link
                  href={serviceRutineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {texts.link}
                  <ExternalLinkIcon title="Ekstern lenke" fontSize="1.5em" />
                </Link>
              </Box>
            </div>
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
