import React, { useState } from "react";
import { Button, Modal, Skeleton, Textarea } from "@navikt/ds-react";
import styled from "styled-components";
import { Systemtittel } from "nav-frontend-typografi";
import { useGetHuskelappQuery } from "@/data/huskelapp/useGetHuskelappQuery";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import { HuskelappDTO } from "@/data/huskelapp/huskelappTypes";

const texts = {
  header: "Huskelapp",
  textAreaLabel: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
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
`;

const RightAlignedButtons = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: 1em;
  gap: 1em;
`;

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const [tekst, setTekst] = useState<string>("");
  const oppdaterHuskelappQuery = useOppdaterHuskelapp();

  const oppdaterTekst = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTekst(e.target.value);
  };

  const oppdaterHuskelapp = () => {
    const huskelappDto: HuskelappDTO = { tekst: tekst };
    oppdaterHuskelappQuery.mutate(huskelappDto, {
      onSuccess: () => toggleOpen(false),
    });
  };

  return (
    <StyledModal
      aria-label={"huskelapp"}
      open={isOpen}
      onClose={() => toggleOpen(!isOpen)}
    >
      <Systemtittel>{texts.header}</Systemtittel>
      {isLoading && <Skeleton height={140} variant="rounded" />}
      {isSuccess && (
        <ModalContent>
          <Textarea
            label={texts.textAreaLabel}
            hideLabel
            defaultValue={huskelapp?.tekst}
            onChange={oppdaterTekst}
          />
          <RightAlignedButtons>
            <Button variant="secondary" onClick={() => toggleOpen(false)}>
              {texts.close}
            </Button>
            <Button
              variant="primary"
              onClick={oppdaterHuskelapp}
              loading={oppdaterHuskelappQuery.isLoading}
            >
              {texts.save}
            </Button>
          </RightAlignedButtons>
        </ModalContent>
      )}
    </StyledModal>
  );
};
