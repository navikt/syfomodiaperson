import {
  MeldingDTO,
  MeldingStatusType,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import MeldingInnholdPanel from "@/sider/behandlerdialog/meldinger/samtale/MeldingInnholdPanel";
import cx from "classnames";
import {
  NavLogoRod,
  StetoskopIkonBakgrunn,
} from "../../../../../img/ImageComponents";
import PaminnelseMelding from "@/sider/behandlerdialog/meldinger/paminnelse/PaminnelseMelding";
import { ReturLegeerklaring } from "@/sider/behandlerdialog/legeerklaring/ReturLegeerklaring";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  getAllUbehandledePersonOppgaver,
  isBehandletOppgave,
} from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { useGetTilgangQuery } from "@/data/tilgang/tilgangQueryHooks.ts";

const texts = {
  behandleOppgaveText:
    "Jeg har forstått at meldingen ikke ble levert. Oppgaven kan fjernes.",
  fjernOppgavenButtonText: "Fjern oppgaven",
};

interface ImageWrapperProps {
  innkommende?: boolean;
  children: React.ReactNode;
}

const ImageWrapper = ({ innkommende, children }: ImageWrapperProps) => (
  <div className={innkommende ? "mr-[1em]" : "ml-[1em]"}>{children}</div>
);

interface MeldingProps {
  innkommende?: boolean;
  children: React.ReactNode;
}

const Melding = ({ innkommende, children }: MeldingProps) => (
  <div
    className={cx(
      "flex flex-row",
      innkommende ? "justify-start" : "justify-end",
    )}
  >
    {children}
  </div>
);

const Innhold = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col w-4/5 [&>*:not(:last-child)]:mb-[1em]">
    {children}
  </div>
);

interface MeldingFraBehandlerProps {
  meldinger: MeldingDTO[];
  melding: MeldingDTO;
}

export function MeldingFraBehandler({
  meldinger,
  melding,
}: MeldingFraBehandlerProps) {
  const isLegeerklaring =
    melding.type === MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING;
  const sentReturForLegeerklaring = meldinger.some(
    (m) =>
      m.type === MeldingType.HENVENDELSE_RETUR_LEGEERKLARING &&
      m.parentRef === melding.uuid,
  );
  const showReturLegeerklaring = isLegeerklaring && !sentReturForLegeerklaring;

  return (
    <Melding innkommende>
      <ImageWrapper innkommende>
        <img src={StetoskopIkonBakgrunn} alt="Stetoskopikon for behandler" />
      </ImageWrapper>
      <Innhold>
        <MeldingInnholdPanel melding={melding} />
        {showReturLegeerklaring && <ReturLegeerklaring melding={melding} />}
      </Innhold>
    </Melding>
  );
}

interface MeldingInnholdProps {
  melding: MeldingDTO;
}

export function MeldingTilBehandler({ melding }: MeldingInnholdProps) {
  const { data: tilganger } = useGetTilgangQuery();

  const { data: oppgaver } = usePersonoppgaverQuery();
  const behandleOppgave = useBehandlePersonoppgave();
  const ubesvartMeldingOppgave = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART,
  ).find((oppgave) => oppgave.referanseUuid === melding.uuid);
  const avvistMelding = melding.status?.type === MeldingStatusType.AVVIST;
  const avvistOppgave = oppgaver
    .filter(
      (oppgave) =>
        oppgave.type === PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST,
    )
    .find((oppgave) => oppgave.referanseUuid === melding.uuid);

  return (
    <Melding>
      <Innhold>
        <MeldingInnholdPanel melding={melding} avvist={avvistMelding} />
        {avvistMelding && !!avvistOppgave && (
          <BehandlePersonOppgaveKnapp
            personOppgave={avvistOppgave}
            hasWriteAccess={tilganger?.fullTilgang ?? false}
            handleBehandleOppgave={() =>
              behandleOppgave.mutate(avvistOppgave.uuid)
            }
            isBehandleOppgaveLoading={behandleOppgave.isPending}
            isBehandlet={isBehandletOppgave(avvistOppgave)}
            behandleOppgaveText={texts.behandleOppgaveText}
            buttonText={texts.fjernOppgavenButtonText}
          />
        )}
        {!!ubesvartMeldingOppgave && (
          <PaminnelseMelding
            melding={melding}
            oppgave={ubesvartMeldingOppgave}
          />
        )}
      </Innhold>
      <ImageWrapper>
        <img src={NavLogoRod} alt="Rød Nav-logo" />
      </ImageWrapper>
    </Melding>
  );
}

interface MeldingerISamtaleProps {
  meldinger: MeldingDTO[];
}

export function MeldingerISamtale({ meldinger }: MeldingerISamtaleProps) {
  return (
    <div className="flex flex-col gap-4">
      {meldinger.map((melding: MeldingDTO, index: number) => {
        return melding.innkommende ? (
          <MeldingFraBehandler
            meldinger={meldinger}
            melding={melding}
            key={index}
          />
        ) : (
          <MeldingTilBehandler melding={melding} key={index} />
        );
      })}
    </div>
  );
}
