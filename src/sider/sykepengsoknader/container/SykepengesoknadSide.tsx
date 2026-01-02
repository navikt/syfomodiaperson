import React from "react";
import Feilmelding from "../../../components/Feilmelding";
import SykepengesoknadSelvstendig from "../soknad-selvstendig/SykepengesoknadSelvstendig";
import SykepengesoknadUtland from "../soknad-utland/SykepengesoknadUtland";
import SendtSoknadArbeidstakerNy from "../soknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import AvbruttSoknadArbeidtakerNy from "../soknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy";
import { useParams } from "react-router-dom";
import SideLaster from "../../../components/side/SideLaster";
import {
  Soknadstatus,
  Soknadstype,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SykepengesoknadReisetilskudd from "@/sider/sykepengsoknader/soknad-reisetilskudd/SykepengesoknadReisetilskudd";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Side from "@/components/side/Side";
import { Box, Heading } from "@navikt/ds-react";
import Oppsummeringsvisning from "@/sider/sykepengsoknader/soknad-felles-oppsummering/Oppsummeringsvisning";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";
import { StatuspanelBehandlingsdager } from "@/sider/sykepengsoknader/soknad-behandlingsdager/StatuspanelBehandlingsdager";

const texts = {
  tittel: "Sykepengesøknader",
  behandlingsdager: {
    sideTittel: "Søknad om sykepenger for enkeltstående behandlingsdager",
    oppsummering: "Oppsummering av søknaden",
  },
};

export default function SykepengesoknadSide() {
  const { sykepengesoknadId } = useParams<{
    sykepengesoknadId: string;
  }>();

  const {
    data: sykepengesoknader,
    isError: hentingFeiletSoknader,
    isLoading: henterSoknader,
  } = useSykepengesoknaderQuery();
  const {
    sykmeldinger,
    isError: hentingSykmeldingerFeilet,
    isLoading: henterSykmeldinger,
  } = useGetSykmeldingerQuery();

  const henter = henterSykmeldinger || henterSoknader;
  const hentingFeilet = hentingFeiletSoknader || hentingSykmeldingerFeilet;
  const soknad = sykepengesoknader.find((s) => s.id === sykepengesoknadId);
  const sykmelding = sykmeldinger.find((sykmld) =>
    soknad ? sykmld.id === soknad.sykmeldingId : false
  );

  return (
    <Side tittel={texts.tittel} aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}>
      <SideLaster isLoading={henter} isError={hentingFeilet}>
        {(() => {
          switch (soknad?.soknadstype) {
            case Soknadstype.SELVSTENDIGE_OG_FRILANSERE:
            case Soknadstype.ARBEIDSLEDIG:
            case Soknadstype.FRISKMELDT_TIL_ARBEIDSFORMIDLING:
            case Soknadstype.ANNET_ARBEIDSFORHOLD: {
              return (
                <SykepengesoknadSelvstendig
                  sykmelding={sykmelding}
                  soknad={soknad}
                />
              );
            }
            case Soknadstype.OPPHOLD_UTLAND: {
              return <SykepengesoknadUtland soknad={soknad} />;
            }
            case Soknadstype.ARBEIDSTAKERE: {
              switch (soknad.status) {
                case Soknadstatus.SENDT:
                case Soknadstatus.KORRIGERT: {
                  return <SendtSoknadArbeidstakerNy soknad={soknad} />;
                }
                case Soknadstatus.AVBRUTT: {
                  return <AvbruttSoknadArbeidtakerNy soknad={soknad} />;
                }
                default: {
                  return <IkkeInnsendtSoknad />;
                }
              }
            }
            case Soknadstype.BEHANDLINGSDAGER: {
              return (
                <div>
                  <Heading level="1" size="large">
                    {texts.behandlingsdager.sideTittel}
                  </Heading>
                  <StatuspanelBehandlingsdager soknad={soknad} />
                  <Box
                    background="surface-default"
                    padding={"4"}
                    className={"mb-4"}
                  >
                    <Heading spacing size="small">
                      {texts.behandlingsdager.oppsummering}
                    </Heading>
                    <Oppsummeringsvisning soknad={soknad} />
                  </Box>
                  <TilbakeTilSoknader />
                </div>
              );
            }
            case Soknadstype.REISETILSKUDD: {
              return <SykepengesoknadReisetilskudd soknad={soknad} />;
            }
            case Soknadstype.GRADERT_REISETILSKUDD: {
              switch (soknad.status) {
                case Soknadstatus.SENDT:
                case Soknadstatus.KORRIGERT: {
                  return <SykepengesoknadReisetilskudd soknad={soknad} />;
                }
                default: {
                  return <IkkeInnsendtSoknad />;
                }
              }
            }
          }

          return <Feilmelding />;
        })()}
      </SideLaster>
    </Side>
  );
}
