import {
  HuskelappResponseDTO,
  oppfolgingsgrunnToText,
} from "@/data/huskelapp/huskelappTypes";
import { useRemoveHuskelapp } from "@/data/huskelapp/useRemoveHuskelapp";
import { BodyShort, Box, Button, Heading, Tooltip } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import React from "react";

const texts = {
  title: "Trenger oppfølging",
  remove: "Fjern",
  removeTooltip: "Fjerner huskelappen og oppgaven fra oversikten",
};

interface ExistingHuskelappProps {
  huskelapp: HuskelappResponseDTO;
}

export const Huskelapp = ({ huskelapp }: ExistingHuskelappProps) => {
  const removeHuskelapp = useRemoveHuskelapp();

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid);
  };

  const existingHuskelappText = !!huskelapp?.tekst
    ? huskelapp.tekst
    : !!huskelapp?.oppfolgingsgrunn
    ? oppfolgingsgrunnToText[huskelapp.oppfolgingsgrunn]
    : null;

  return (
    <Box background={"surface-default"} padding="4" className={"flex-1"}>
      <Heading className={"mb-2"} size="xsmall">
        {texts.title}
      </Heading>
      <BodyShort className={"mb-4"}>{existingHuskelappText}</BodyShort>
      <Tooltip content={texts.removeTooltip}>
        <Button
          type="button"
          icon={<TrashIcon aria-hidden />}
          variant={"primary-neutral"}
          onClick={() => handleRemoveHuskelapp(huskelapp.uuid)}
          loading={removeHuskelapp.isPending}
          className={"ml-auto"}
          size={"small"}
        >
          {texts.remove}
        </Button>
      </Tooltip>
    </Box>
  );
};
