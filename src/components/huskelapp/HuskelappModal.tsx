import React, { FormEvent, useState } from "react";
import {
  BodyShort,
  Button,
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
import {
  HuskelappRequestDTO,
  Oppfolgingsgrunn,
} from "@/data/huskelapp/huskelappTypes";
import { PaddingSize } from "@/components/Layout";
import { useRemoveHuskelapp } from "@/data/huskelapp/useRemoveHuskelapp";

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

const ModalContent = styled(Modal.Body)`
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
  const { huskelapp, isLoading } = useGetHuskelappQuery();
  const [oppfolgingsgrunn, setOppfolgingsgrunn] = useState<Oppfolgingsgrunn>();
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const removeHuskelapp = useRemoveHuskelapp();

  const oppfolgingsgrunnToText = () => {
    switch (huskelapp?.oppfolgingsgrunn) {
      case Oppfolgingsgrunn.AVVENT_DIALOGMOTE:
        return texts.oppfolgingsgrunn.avventDialogmote;
      case Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE:
        return texts.oppfolgingsgrunn.vurderDialogmoteSenere;
      case Oppfolgingsgrunn.FOLG_OPP_FRA_LEGE:
        return texts.oppfolgingsgrunn.folgOppFraLege;
      case Oppfolgingsgrunn.FOLG_OPP_FRA_ARBEIDSGIVER:
        return texts.oppfolgingsgrunn.folgOppFraArbeidsgiver;
      case Oppfolgingsgrunn.TA_KONTAKT:
        return texts.oppfolgingsgrunn.taKontakt;
      case Oppfolgingsgrunn.VURDER_TILTAK_BEHOV:
        return texts.oppfolgingsgrunn.vurderTiltakBehov;
      case Oppfolgingsgrunn.ANNEN_OPPFOLGNING:
        return texts.oppfolgingsgrunn.annenOppfolgning;
    }
  };

  const handleOnSubmit = (e: FormEvent) => {
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

  const handleOppfolgingsgrunnChange = (oppfolgingsgrunn: Oppfolgingsgrunn) => {
    setOppfolgingsgrunn(oppfolgingsgrunn);
    setIsFormError(false);
  };

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid, {
      onSuccess: () => toggleOpen(false),
    });
  };
  const hasHuskelapp = !!huskelapp;

  return (
    <form onSubmit={handleOnSubmit}>
      <Modal
        closeOnBackdropClick
        className="px-6 py-4 w-full max-w-[50rem]"
        aria-label={"huskelapp"}
        open={isOpen}
        onClose={() => toggleOpen(false)}
        header={{ heading: texts.header }}
      >
        <ModalContent>
          {isLoading && <HuskelappSkeleton />}
          {hasHuskelapp ? (
            <BodyShort>{oppfolgingsgrunnToText()}</BodyShort>
          ) : (
            <RadioGroup
              legend={texts.oppfolgingsgrunn.label}
              onChange={handleOppfolgingsgrunnChange}
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
        </ModalContent>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => toggleOpen(false)}
          >
            {texts.close}
          </Button>
          {hasHuskelapp ? (
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
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={oppdaterHuskelapp.isLoading}
              disabled={isLoading}
            >
              {texts.save}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </form>
  );
};
