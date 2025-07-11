import React, { useState } from "react";
import { Button, Tag } from "@navikt/ds-react";
import { useGetVeilederBrukerKnytning } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import EndreTildeltVeilederModal from "@/components/side/tildeltveileder/EndreTildeltVeilederModal";
import { VeilederIdent } from "@/data/veilederbrukerknytning/useTildelVeileder";

const texts = {
  tildeltVeileder: "Tildelt veileder: ",
  ufordelt: "Ufordelt bruker",
  button: "Endre",
};

interface VeilederNavnProps {
  tildeltVeilederident: VeilederIdent;
}

function VeilederNavn({ tildeltVeilederident }: VeilederNavnProps) {
  const { isLoading, data: veilederInfo } =
    useVeilederInfoQuery(tildeltVeilederident);

  return !isLoading ? (
    <span>
      {veilederInfo
        ? `${veilederInfo?.fulltNavn()} (${tildeltVeilederident})`
        : tildeltVeilederident}
    </span>
  ) : (
    <Tag variant="info" size="small">
      {texts.ufordelt}
    </Tag>
  );
}

export default function TildeltVeileder() {
  const [modalOpen, setModalOpen] = useState(false);
  const veilederBrukerKnytningQuery = useGetVeilederBrukerKnytning();
  const veilederIdent = veilederBrukerKnytningQuery.data?.tildeltVeilederident;

  return veilederBrukerKnytningQuery.isSuccess ? (
    <div className="ml-auto my-auto mr-5">
      <b>{texts.tildeltVeileder}</b>
      {veilederIdent ? (
        <VeilederNavn tildeltVeilederident={veilederIdent} />
      ) : (
        <Tag variant="info" size="small">
          {texts.ufordelt}
        </Tag>
      )}
      <Button className="ml-4" size="small" onClick={() => setModalOpen(true)}>
        {texts.button}
      </Button>
      {modalOpen && (
        <EndreTildeltVeilederModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      )}
    </div>
  ) : (
    <span />
  );
}
