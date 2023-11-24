import React from "react";
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
import { useForm } from "react-hook-form";

const texts = {
  header: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  remove: "Fjern",
  removeTooltip: "Fjerner huskelappen og oppgaven fra oversikten",
  missingOppfolgingsgrunn: "Vennligst angi oppfolgingsgrunn.",
  oppfolgingsgrunn: {
    label: "Velg oppfølgingsgrunn",
    taKontaktSykmeldt: "Ta kontakt med den sykmeldte",
    taKontaktArbeidsgiver: "Ta kontakt med arbeidsgiver",
    taKontaktBehandler: "Ta kontakt med behandler",
    vurderDialogmoteSenere: "Vurder dialogmøte på et senere tidspunkt",
    folgOppEtterNesteSykmelding: "Følg opp etter neste sykmelding",
    vurderTiltakBehov: "Vurder behov for tiltak",
    annet:
      "Annet (Gi tilbakemelding i Pilotgruppa på Teams hvilken avhukingsvalg du savner)",
  },
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
}

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
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const removeHuskelapp = useRemoveHuskelapp();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();

  const oppfolgingsgrunnToText = (oppfolgingsgrunn?: Oppfolgingsgrunn) => {
    switch (oppfolgingsgrunn) {
      case Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT:
        return texts.oppfolgingsgrunn.taKontaktSykmeldt;
      case Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER:
        return texts.oppfolgingsgrunn.taKontaktArbeidsgiver;
      case Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER:
        return texts.oppfolgingsgrunn.taKontaktBehandler;
      case Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE:
        return texts.oppfolgingsgrunn.vurderDialogmoteSenere;
      case Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING:
        return texts.oppfolgingsgrunn.folgOppEtterNesteSykmelding;
      case Oppfolgingsgrunn.VURDER_TILTAK_BEHOV:
        return texts.oppfolgingsgrunn.vurderTiltakBehov;
      case Oppfolgingsgrunn.ANNET:
        return texts.oppfolgingsgrunn.annet;
    }
  };

  const allOppfolgingsgrunner = Object.values(
    Oppfolgingsgrunn
  ) as Oppfolgingsgrunn[];

  const submit = (values: FormValues) => {
    const huskelappDto: HuskelappRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
    };
    oppdaterHuskelapp.mutate(huskelappDto, {
      onSuccess: () => toggleOpen(false),
    });
  };

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid, {
      onSuccess: () => toggleOpen(false),
    });
  };
  const hasHuskelapp = !!huskelapp;
  const existingHuskelappText = !!huskelapp?.tekst
    ? huskelapp.tekst
    : oppfolgingsgrunnToText(huskelapp?.oppfolgingsgrunn);

  return (
    <form onSubmit={handleSubmit(submit)}>
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
          {isSuccess &&
            (hasHuskelapp ? (
              <BodyShort>{existingHuskelappText}</BodyShort>
            ) : (
              <RadioGroup
                legend={texts.oppfolgingsgrunn.label}
                name="oppfolgingsgrunn"
                size="small"
                error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
              >
                {allOppfolgingsgrunner.map((oppfolgingsgrunn, index) => (
                  <Radio
                    key={index}
                    {...register("oppfolgingsgrunn", { required: true })}
                    value={oppfolgingsgrunn}
                  >
                    {oppfolgingsgrunnToText(oppfolgingsgrunn)}
                  </Radio>
                ))}
              </RadioGroup>
            ))}
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
                type="button"
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
