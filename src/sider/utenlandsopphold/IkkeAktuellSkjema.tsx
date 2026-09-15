import React from "react";
import { useForm } from "react-hook-form";
import { BodyShort, Button, Radio, RadioGroup } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useIkkeAktuellMutation } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { IkkeAktuellArsakDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { useNotification } from "@/context/notification/NotificationContext.tsx";
import { useNavigate } from "react-router-dom";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import { ikkeAktuellArsakTexts } from "./ikkeAktuellTexts";

const texts = {
  body: "Søknaden skal ikke behandles i Modia. Denne handlingen sender ikke noe brev til den sykmeldte, og journalfører ikke noe i Gosys.",
  arsak: {
    label: "Velg årsak",
    missing: "Vennligst angi årsak",
  },
  lagre: "Bekreft ikke aktuell",
  avbryt: "Avbryt",
  notification: "Søknaden er registrert som ikke aktuell.",
};

interface SkjemaValues {
  arsak: IkkeAktuellArsakDTO;
}

interface Props {
  soknadId: string;
  setModalOpen: (isOpen: boolean) => void;
}

export function IkkeAktuellSkjema({ soknadId, setModalOpen }: Props) {
  const ikkeAktuellMutation = useIkkeAktuellMutation();
  const { setNotification } = useNotification();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SkjemaValues>();

  const onSubmit = (values: SkjemaValues) => {
    ikkeAktuellMutation.mutate(
      { soknadIdPathParam: soknadId, ikkeAktuell: { arsak: values.arsak } },
      {
        onSuccess: () => {
          setModalOpen(false);
          setNotification({ message: texts.notification });
          navigate(`${utenlandsoppholdPath}`);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BodyShort className="mb-8" size="small">
        {texts.body}
      </BodyShort>
      <RadioGroup
        name="arsak"
        size="small"
        legend={texts.arsak.label}
        error={errors.arsak && texts.arsak.missing}
        className="mb-8"
      >
        {Object.values(IkkeAktuellArsakDTO).map((arsak) => (
          <Radio
            key={arsak}
            value={arsak}
            {...register("arsak", { required: true })}
          >
            {ikkeAktuellArsakTexts[arsak]}
          </Radio>
        ))}
      </RadioGroup>
      {ikkeAktuellMutation.isError && (
        <SkjemaInnsendingFeil error={ikkeAktuellMutation.error} />
      )}
      <ButtonRow>
        <Button loading={ikkeAktuellMutation.isPending} type="submit">
          {texts.lagre}
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={() => setModalOpen(false)}
        >
          {texts.avbryt}
        </Button>
      </ButtonRow>
    </form>
  );
}
