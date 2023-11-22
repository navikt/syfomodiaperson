import React, { useState } from "react";
import {
  Button,
  Heading,
  Modal,
  Radio,
  RadioGroup,
  Skeleton,
  Tooltip,
} from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { useGetHuskelappQuery } from "@/data/huskelapp/useGetHuskelappQuery";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import { SkeletonShadowbox } from "@/components/SkeletonShadowbox";
import { HuskelappRequestDTO } from "@/data/huskelapp/huskelappTypes";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { useRemoveHuskelapp } from "@/data/huskelapp/useRemoveHuskelapp";
import { Oppfolgingsgrunn } from "@/data/huskelapp/Oppfolgingsgrunn";

const texts = {
  header: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  remove: "Fjern",
  removeTooltip: "Fjerner huskelappen og oppgaven fra oversikten",
  missingOppfolgingsgrunn: "Vennligst angi oppfolgingsgrunn.",
  oppfolgingsgrunn: {
    label: "Velg oppfølgingsgrunn",
    avventDialogmote: "Avvent dialogmøte 2",
    vurderDialogmoteSenere: "Vurder dialogmøte på et senere tidspunkt",
    folgOppFraLege: "Følge opp informasjon fra lege",
    folgOppFraArbeidsgiver: "Følge opp informasjon fra arbeidsgiver (?)",
    taKontakt: "Ta kontakt med den sykmeldte",
    vurderTiltakBehov: "Vurder behov for tiltak",
    annenOppfolgning: "Annen oppfølging",
  },
};

interface HuskelappModalProps {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

const StyledModal = styled(Modal)`
  padding: 1em 1.5em;
  max-width: 50em;
  width: 100%;
`;

const ModalContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
  > * {
    &:not(:last-child) {
      padding-bottom: ${PaddingSize.SM};
    }
  }
`;

const HuskelappSkeleton = () => {
  return (
    <SkeletonShadowbox className={"m-4 h-20"}>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="30%" />
    </SkeletonShadowbox>
  );
};

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const [oppfolgingsgrunn, setOppfolgingsgrunn] = useState<Oppfolgingsgrunn>();
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const removeHuskelapp = useRemoveHuskelapp();

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (oppfolgingsgrunn !== undefined) {
      const huskelappDto: HuskelappRequestDTO = {
        oppfolgingsgrunn: oppfolgingsgrunn,
      };
      oppdaterHuskelapp.mutate(huskelappDto, {
        onSuccess: () => toggleOpen(false),
      });
    } else {
      setIsFormError(true);
      return undefined;
    }
  };

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid, {
      onSuccess: () => toggleOpen(false),
    });
  };

  return (
    <StyledModal
      aria-label={"huskelapp"}
      open={isOpen}
      onClose={() => toggleOpen(!isOpen)}
    >
      <ModalContent>
        <Heading level="2" size="large">
          {texts.header}
        </Heading>
        <form onSubmit={handleOnSubmit}>
          {isLoading && <HuskelappSkeleton />}
          {isSuccess && (
            <RadioGroup
              legend={texts.oppfolgingsgrunn.label}
              onChange={(val: Oppfolgingsgrunn) => setOppfolgingsgrunn(val)}
              size="small"
              error={isFormError && texts.missingOppfolgingsgrunn}
            >
              <Radio value={Oppfolgingsgrunn.AVVENT_DIALOGMOTE}>
                {texts.oppfolgingsgrunn.avventDialogmote}
              </Radio>
              <Radio value={Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE}>
                {texts.oppfolgingsgrunn.vurderDialogmoteSenere}
              </Radio>
              <Radio value={Oppfolgingsgrunn.FOLG_OPP_FRA_LEGE}>
                {texts.oppfolgingsgrunn.folgOppFraLege}
              </Radio>
              <Radio value={Oppfolgingsgrunn.FOLG_OPP_FRA_ARBEIDSGIVER}>
                {texts.oppfolgingsgrunn.folgOppFraArbeidsgiver}
              </Radio>
              <Radio value={Oppfolgingsgrunn.TA_KONTAKT}>
                {texts.oppfolgingsgrunn.taKontakt}
              </Radio>
              <Radio value={Oppfolgingsgrunn.VURDER_TILTAK_BEHOV}>
                {texts.oppfolgingsgrunn.vurderTiltakBehov}
              </Radio>
              <Radio value={Oppfolgingsgrunn.ANNEN_OPPFOLGNING}>
                {texts.oppfolgingsgrunn.annenOppfolgning}
              </Radio>
            </RadioGroup>
          )}
          <ButtonRow topPadding={PaddingSize.SM}>
            <Button
              type={"submit"}
              variant="primary"
              loading={oppdaterHuskelapp.isLoading}
              disabled={isLoading}
            >
              {texts.save}
            </Button>
            <Button variant="secondary" onClick={() => toggleOpen(false)}>
              {texts.close}
            </Button>
            {huskelapp && (
              <Tooltip content={texts.removeTooltip}>
                <Button
                  icon={<TrashIcon aria-hidden />}
                  variant="danger"
                  onClick={() => handleRemoveHuskelapp(huskelapp.uuid)}
                  loading={removeHuskelapp.isLoading}
                  className={"ml-auto"}
                >
                  {texts.remove}
                </Button>
              </Tooltip>
            )}
          </ButtonRow>
        </form>
      </ModalContent>
    </StyledModal>
  );
};
