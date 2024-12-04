import { useRemoveOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useRemoveOppfolgingsoppgave";
import {
  BodyShort,
  Box,
  Button,
  Detail,
  Heading,
  Tag,
  Tooltip,
} from "@navikt/ds-react";
import React, { useState } from "react";
import { OpenOppfolgingsoppgaveModalButton } from "@/components/oppfolgingsoppgave/OpenOppfolgingsoppgaveModalButton";
import { useAktivOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { oppfolgingsgrunnToText } from "@/data/oppfolgingsoppgave/types";
import { OppfolgingsoppgaveModal } from "@/components/oppfolgingsoppgave/OppfolgingsoppgaveModal";

const texts = {
  title: "Oppfølgingsoppgave",
  edit: "Endre",
  remove: "Fjern",
  removeTooltip: "Fjerner oppfølgingsoppgaven fra oversikten",
};

export const Oppfolgingsoppgave = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const removeOppfolgingsoppgave = useRemoveOppfolgingsoppgave();
  const { aktivOppfolgingsoppgave } = useAktivOppfolgingsoppgave();
  const aktivOppfolgingsoppgaveVersjon =
    aktivOppfolgingsoppgave?.versjoner?.[0];

  const { data: veilederinfo } = useVeilederInfoQuery(
    aktivOppfolgingsoppgave?.createdBy ?? ""
  );
  const isExistingOppfolgingsoppgave = !!aktivOppfolgingsoppgave;
  const handleRemoveOppfolgingsoppgave = (uuid: string) => {
    removeOppfolgingsoppgave.mutate(uuid);
  };

  const oppfolgingsgrunn = aktivOppfolgingsoppgaveVersjon?.oppfolgingsgrunn
    ? oppfolgingsgrunnToText[aktivOppfolgingsoppgaveVersjon.oppfolgingsgrunn]
    : null;

  const beskrivelse = aktivOppfolgingsoppgaveVersjon?.tekst ?? null;

  const frist = aktivOppfolgingsoppgaveVersjon?.frist
    ? tilLesbarDatoMedArUtenManedNavn(aktivOppfolgingsoppgaveVersjon?.frist)
    : undefined;

  return isExistingOppfolgingsoppgave ? (
    <Box background={"surface-default"} padding="4" className="flex-1 mb-2">
      {frist && (
        <Tag
          variant="warning"
          size="small"
          className="mb-4"
        >{`Frist: ${frist}`}</Tag>
      )}
      <Heading className="mb-2" size="xsmall">
        {texts.title}
      </Heading>
      {oppfolgingsgrunn && (
        <BodyShort className="mb-4">{oppfolgingsgrunn}</BodyShort>
      )}
      {beskrivelse && (
        <>
          <Heading className="mb-2" size="xsmall">
            {"Beskrivelse"}
          </Heading>
          <BodyShort className="mb-4">{beskrivelse}</BodyShort>
        </>
      )}
      <Button
        type="button"
        variant={"primary-neutral"}
        onClick={() => setIsModalOpen(true)}
        className={"ml-auto mr-4"}
        size={"small"}
      >
        {texts.edit}
      </Button>
      <Tooltip content={texts.removeTooltip}>
        <Button
          type="button"
          variant={"secondary-neutral"}
          onClick={() =>
            handleRemoveOppfolgingsoppgave(aktivOppfolgingsoppgave.uuid)
          }
          loading={removeOppfolgingsoppgave.isPending}
          className={"ml-auto"}
          size={"small"}
        >
          {texts.remove}
        </Button>
      </Tooltip>
      <div className="mt-2">
        <Detail textColor="subtle" className="text-xs">
          {`Opprettet: ${tilLesbarDatoMedArUtenManedNavn(
            aktivOppfolgingsoppgave.createdAt
          )}`}
        </Detail>
        <Detail textColor="subtle" className="text-xs">
          {`Sist oppdatert: ${tilLesbarDatoMedArUtenManedNavn(
            aktivOppfolgingsoppgave.updatedAt
          )}`}
        </Detail>
        {veilederinfo && (
          <Detail
            textColor="subtle"
            className="text-xs"
          >{`Sist oppdatert av: ${veilederinfo.fulltNavn()} (${
            veilederinfo.ident
          })`}</Detail>
        )}
      </div>
      {isModalOpen && (
        <OppfolgingsoppgaveModal
          isOpen={isModalOpen}
          toggleOpen={setIsModalOpen}
          existingOppfolgingsoppgave={aktivOppfolgingsoppgave}
        />
      )}
    </Box>
  ) : (
    <OpenOppfolgingsoppgaveModalButton />
  );
};
