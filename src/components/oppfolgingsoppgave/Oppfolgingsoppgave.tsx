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
import { useGetOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useGetOppfolgingsoppgave";
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
  const { oppfolgingsoppgave } = useGetOppfolgingsoppgave();
  const { data: veilederinfo } = useVeilederInfoQuery(
    oppfolgingsoppgave?.createdBy ?? ""
  );
  const isExistingOppfolgingsoppgave = !!oppfolgingsoppgave;
  const handleRemoveOppfolgingsoppgave = (uuid: string) => {
    removeOppfolgingsoppgave.mutate(uuid);
  };

  const oppfolgingsgrunn = oppfolgingsoppgave?.oppfolgingsgrunn
    ? oppfolgingsgrunnToText[oppfolgingsoppgave.oppfolgingsgrunn]
    : null;

  const beskrivelse = oppfolgingsoppgave?.tekst
    ? oppfolgingsoppgave.tekst
    : null;

  const frist = oppfolgingsoppgave?.frist
    ? tilLesbarDatoMedArUtenManedNavn(oppfolgingsoppgave?.frist)
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
            handleRemoveOppfolgingsoppgave(oppfolgingsoppgave.uuid)
          }
          loading={removeOppfolgingsoppgave.isPending}
          className={"ml-auto"}
          size={"small"}
        >
          {texts.remove}
        </Button>
      </Tooltip>
      <div className="mt-2">
        {veilederinfo && (
          <Detail
            textColor="subtle"
            className="text-xs"
          >{`Opprettet av: ${veilederinfo.fulltNavn()} (${
            veilederinfo.ident
          })`}</Detail>
        )}
        <Detail textColor="subtle" className="text-xs">
          {`Opprettet: ${tilLesbarDatoMedArUtenManedNavn(
            oppfolgingsoppgave.createdAt
          )}`}
        </Detail>
        <Detail textColor="subtle" className="text-xs">
          {`Sist oppdatert: ${tilLesbarDatoMedArUtenManedNavn(
            oppfolgingsoppgave.updatedAt
          )}`}
        </Detail>
      </div>
      {isModalOpen && (
        <OppfolgingsoppgaveModal
          isOpen={isModalOpen}
          toggleOpen={setIsModalOpen}
          existingOppfolgingsoppgave={oppfolgingsoppgave}
        />
      )}
    </Box>
  ) : (
    <OpenOppfolgingsoppgaveModalButton />
  );
};
