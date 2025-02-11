import * as React from "react";
import {
  Arbeidsgiver,
  SykepengestoppArsakType,
  validSykepengestoppArsakTekster,
} from "@/data/pengestopp/types/FlaggPerson";
import { useFlaggPerson } from "@/data/pengestopp/useFlaggPerson";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  ErrorMessage,
  Heading,
  Modal,
} from "@navikt/ds-react";
import { useForm } from "react-hook-form";

const texts = {
  notStoppedTittel:
    "Send beskjed til Nav Arbeid og ytelser om mulig stans av sykepenger",
  stoppedTittel: "Beskjeden din er sendt",
  stoppedInfo:
    "Nå har du sendt beskjed til Nav Arbeid og ytelser. Du må også lage et notat i Gosys hvor du begrunner hvorfor du mener sykepengene bør stanses.",
  seServicerutinen: "Se servicerutinen hvis du er i tvil.",
  arbeidsgiver: "Velg arbeidsgiver",
  stansSykepenger: "Stans sykepenger",
  send: "Send",
  avbryt: "Avbryt",
  submitError: "Du må velge minst én arbeidsgiver",
  serverError:
    "Det er ikke mulig å stoppe automatisk utbetaling av sykepenger akkurat nå. Prøv igjen senere.",
  arsak: {
    title: "Du må velge minst en årsak",
    submitError: "Du må velge minst en årsak",
  },
};

interface Props {
  isOpen: boolean;
  arbeidsgivere: Arbeidsgiver[];

  onModalClose(): void;
}

export interface PengestoppFormValues {
  arsaker: SykepengestoppArsakType[];
  orgnummer: string[];
}

const PengestoppModal = ({ isOpen, arbeidsgivere, onModalClose }: Props) => {
  const { isPending, isError, isSuccess, mutate } = useFlaggPerson();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PengestoppFormValues>();

  const submit = (values: PengestoppFormValues) => {
    mutate(values);
  };
  const handleCloseModal = () => {
    onModalClose();
    reset();
  };

  const tittel = isSuccess ? texts.stoppedTittel : texts.notStoppedTittel;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Modal
        closeOnBackdropClick
        className="p-8 max-w-4xl w-full"
        aria-label={texts.stansSykepenger}
        open={isOpen}
        onClose={handleCloseModal}
      >
        <Modal.Header>
          <Heading size="medium">{tittel}</Heading>
        </Modal.Header>
        <Modal.Body>
          {!isSuccess ? (
            <>
              <CheckboxGroup
                className="my-4"
                legend={texts.arbeidsgiver}
                error={errors.orgnummer?.message}
              >
                {arbeidsgivere.map(
                  ({ navn, orgnummer }: Arbeidsgiver, index: number) => (
                    <Checkbox
                      key={index}
                      value={orgnummer}
                      {...register("orgnummer", {
                        required: texts.submitError,
                      })}
                    >
                      {navn}
                    </Checkbox>
                  )
                )}
              </CheckboxGroup>
              <CheckboxGroup
                className="my-4"
                legend={texts.arsak.title}
                error={errors.arsaker?.message}
              >
                {Object.entries(validSykepengestoppArsakTekster).map(
                  ([type, text], index: number) => (
                    <Checkbox
                      key={index}
                      value={type}
                      {...register("arsaker", {
                        required: texts.arsak.submitError,
                      })}
                    >
                      {text}
                    </Checkbox>
                  )
                )}
              </CheckboxGroup>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={handleCloseModal}>
                  {texts.avbryt}
                </Button>
                <Button type="submit" variant="primary" loading={isPending}>
                  {texts.send}
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="info" className="my-4">
              <p>{texts.stoppedInfo}</p>
              <p>{texts.seServicerutinen}</p>
            </Alert>
          )}
          {isError && (
            <ErrorMessage className="mt-4">{texts.serverError}</ErrorMessage>
          )}
        </Modal.Body>
      </Modal>
    </form>
  );
};

export default PengestoppModal;
