import { BodyLong, Box, Button, Heading } from "@navikt/ds-react";
import React from "react";
import {
  NewOppfolgingsplanForesporselDTO,
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporselQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Veileder } from "@/data/veilederinfo/types/Veileder";

const texts = {
  header: "Be om oppfølgingsplan fra arbeidsgiver",
  description:
    "Her kan du be om oppfølgingsplan fra arbeidsgiver eller purre om det mangler",
  button: "Be om oppfølgingsplan",
};

interface Props {
  aktivVeileder: Veileder;
}

export default function OppfolgingsplanForesporsel({ aktivVeileder }: Props) {
  const personident = useValgtPersonident();
  const getOppfolgingsplanForesporsel = useGetOppfolgingsplanForesporselQuery();

  const postOppfolgingsplanForesporselQuery =
    usePostOppfolgingsplanForesporselQuery();

  //TODO: Hva om personen ikke har en aktiv veileder?
  //TODO: Hvordan finner vi ut om personen bare har én arbeidsgiver?
  function onClick() {
    const foresporsel: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: personident,
      veilederident: aktivVeileder.ident,
      virksomhetsnummer: "",
      narmestelederPersonident: "",
    };
    postOppfolgingsplanForesporselQuery.mutate(foresporsel);
  }

  return (
    <Box
      background="surface-default"
      className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8"
    >
      <Heading size="medium">{texts.header}</Heading>
      <BodyLong>{texts.description}</BodyLong>
      <Button className="w-fit" size="small" onClick={onClick}>
        {texts.button}
      </Button>
    </Box>
  );
}
