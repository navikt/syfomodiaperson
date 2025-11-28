import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import {
  Alert,
  Box,
  Button,
  Label,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";
import { useFlexjarFeedback } from "@/data/flexjar/useFlexjarFeedback";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";

const texts = {
  apneKnapp: "Vi ønsker din tilbakemelding",
  sporsmal:
    "Hjelper svarene på kartleggingsspørsmål deg å forstå situasjonen til den sykmeldte?",
  ja: "Ja",
  nei: "Nei",
  fortellMer: "Fortell oss gjerne mer",
  hvorforIkke: "Hva skal til for å gjøre kartleggingsspørsmål nyttige?",
  textareaDescription:
    "Ikke skriv inn navn eller noen andre former for personopplysninger i tilbakemeldingen",
  send: "Send tilbakemelding",
  success: "Takk for din tilbakemelding!",
};

export default function KartleggingssporsmalFlexjar() {
  const sendFeedback = useFlexjarFeedback();
  const [isApen, setIsApen] = useState(true);
  const [radioValue, setRadioValue] = useState<string | undefined>(undefined);
  const [textValue, setTextValue] = useState<string>("");
  const [isFormError, setIsFormError] = useState(false);
  const [, setFeedbackDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_KARTLEGGGINSSPORSMAL_FEEDBACK_DATE
  );

  function toggleApen() {
    setIsApen(!isApen);
  }

  function handleSubmit() {
    if (!radioValue) {
      setIsFormError(true);
      return;
    }
    sendFeedback.mutate(
      {
        feedbackId: "kartleggingssporsmal",
        svar: radioValue,
        feedback: textValue || undefined,
        app: "syfomodiaperson",
      },
      { onSuccess: () => setFeedbackDate(new Date()) }
    );
  }

  const textAreaLabel =
    radioValue === "ja"
      ? texts.fortellMer
      : radioValue === "nei"
      ? texts.hvorforIkke
      : null;

  const isRadioChosen = radioValue !== undefined;

  return (
    <div className="flex flex-col sticky bottom-0 self-end items-end z-[100]">
      <Button
        variant="primary"
        iconPosition="right"
        icon={isApen ? <ChevronDownIcon /> : <ChevronUpIcon />}
        onClick={toggleApen}
        className="w-max"
      >
        {texts.apneKnapp}
      </Button>
      {isApen && (
        <Box
          background={"surface-default"}
          borderColor="border-default"
          borderWidth="2"
          shadow="large"
          borderRadius="medium"
          padding="4"
          className="flex flex-col gap-4 w-[25rem]"
        >
          {sendFeedback.isSuccess ? (
            <Alert variant="success" size="small">
              {texts.success}
            </Alert>
          ) : (
            <>
              <RadioGroup
                legend={<Label>{texts.sporsmal}</Label>}
                onChange={(e) => {
                  setRadioValue(e);
                  setTextValue("");
                  setIsFormError(false);
                }}
                size="small"
                error={isFormError && "Du må velge et svar"}
              >
                <Radio value="ja">{texts.ja}</Radio>
                <Radio value="nei">{texts.nei}</Radio>
              </RadioGroup>
              {isRadioChosen && (
                <Textarea
                  label={textAreaLabel}
                  value={textValue}
                  description={texts.textareaDescription}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              )}
              <Button
                variant="primary"
                className="w-max"
                onClick={handleSubmit}
                loading={sendFeedback.isPending}
              >
                {texts.send}
              </Button>
            </>
          )}
        </Box>
      )}
    </div>
  );
}
