import React, { useState } from "react";
import { ButtonRow, FlexRow } from "@/components/Layout";
import { AktivitetskravDTO, AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { VurderAktivitetskravTabs } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { BodyShort, Button, Heading, Panel } from "@navikt/ds-react";
import { HourglassTopFilledIcon, XMarkIcon } from "@navikt/aksel-icons";
import { ModalType, VurderAktivitetskravModal } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";

export const texts = {
  header: "Vurdere aktivitetskravet",
  avvent: "Avvent",
  ikkeAktuell: "Ikke aktuell",
  helptext:
    "Vurderingen (Avvent, sett unntak, er i aktivitet, ikke oppfylt, ikke aktuell) gjøres i to trinn. Ved klikk legger du inn informasjon rundt vurderingen.",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
  oppfolgingstilfelle,
}: VurderAktivitetskravProps) => {
  const [visVurderAktivitetskravModal, setVisVurderAktivitetskravModal] =
    useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const visVurderingAktivitetskravModalForType = (modalType: ModalType) => {
    setModalType(modalType);
    setVisVurderAktivitetskravModal(true);
  };
  return (
    <Panel className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8">
      <ButtonRow className="ml-auto">
        {aktivitetskrav?.status !== AktivitetskravStatus.FORHANDSVARSEL && (
          <Button
            icon={<HourglassTopFilledIcon aria-hidden />}
            variant="secondary"
            size="small"
            onClick={() => visVurderingAktivitetskravModalForType("AVVENT")}
          >
            {texts.avvent}
          </Button>
        )}
        <Button
          icon={<XMarkIcon aria-hidden />}
          variant="secondary"
          size="small"
          onClick={() => visVurderingAktivitetskravModalForType("IKKE_AKTUELL")}
        >
          {texts.ikkeAktuell}
        </Button>
      </ButtonRow>
      <FlexRow>
        <Heading level="2" size="large">
          {texts.header}
        </Heading>
      </FlexRow>
      {oppfolgingstilfelle && (
        <FlexRow>
          <BodyShort size="small">{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
            oppfolgingstilfelle.start,
            oppfolgingstilfelle.end
          )}`}</BodyShort>
        </FlexRow>
      )}
      <VurderAktivitetskravTabs aktivitetskrav={aktivitetskrav} />
      <VurderAktivitetskravModal
        isOpen={visVurderAktivitetskravModal}
        setModalOpen={setVisVurderAktivitetskravModal}
        modalType={modalType}
        aktivitetskravUuid={aktivitetskrav?.uuid}
      />
    </Panel>
  );
};
