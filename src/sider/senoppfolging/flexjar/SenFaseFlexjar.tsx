import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Label, Radio, RadioGroup } from "@navikt/ds-react";
import {
  FlexjarFeedbackDTO,
  useFlexjarFeedback,
} from "@/data/flexjar/useFlexjarFeedback";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { defaultErrorTexts } from "@/api/errors";
import AndreTilbakemeldingerTextArea from "@/components/flexjar/AndreTilbakemeldingerTextArea";
import HvordanBrukerDuArenaTextArea from "@/sider/senoppfolging/flexjar/HvordanBrukerDuArenaTextArea";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  apneKnapp: "Vi ønsker å lære av deg",
  anonym: "Anonym tilbakemelding",
  send: "Send",
  success: "Takk for din tilbakemelding!",
  sporsmal:
    "Trenger du fortsatt Arena i oppfølgingen av sykmeldte som nærmer seg maksdato?",
};

enum RadioOption {
  JA = "Ja",
  NEI = "Nei",
}

function logPageView(side: string) {
  Amplitude.logEvent({
    type: EventType.PageView,
    data: { url: window.location.href, sidetittel: side + " - med Flexjar" },
  });
}

function logOptionSelected(value: RadioOption) {
  Amplitude.logEvent({
    type: EventType.OptionSelected,
    data: {
      option: value.toString(),
      tekst: "Radioknapp Flexjar sen fase",
      url: window.location.href,
    },
  });
}

function logFeedbackSubmitted(
  radioOptionValue: RadioOption,
  hasFirstFeedbackValue: boolean,
  hasSecondFeedbackValue: boolean
) {
  Amplitude.logEvent({
    type: EventType.SenFaseFlexjarSubmitted,
    data: {
      url: window.location.href,
      optionSelected: radioOptionValue.toString(),
      hasFirstFeedbackValue: hasFirstFeedbackValue,
      hasSecondFeedbackValue: hasSecondFeedbackValue,
    },
  });
}

export default function SenFaseFlexjar() {
  const [isApen, setIsApen] = useState<boolean>(true);
  const [arenaBrukText, setArenaBrukText] = useState<string>("");
  const [andreTilbakemeldingerText, setAndreTilbakemeldingerText] =
    useState<string>("");
  const [radioValue, setRadioValue] = useState<RadioOption | null>(null);
  const sendFeedback = useFlexjarFeedback();
  const { setStoredValue: setFeedbackDate } = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_SEN_FASE_FEEDBACK_DATE
  );
  useEffect(() => {
    logPageView("SenFase");
  }, []);

  function toggleApen() {
    if (isApen) {
      setRadioValue(null);
      setArenaBrukText("");
      setAndreTilbakemeldingerText("");
    }
    setIsApen(!isApen);
  }

  function buildFeedbackString() {
    const arenaBrukTextFeedback =
      radioValue === RadioOption.JA
        ? `[Hvordan bruker du Arena til dette: ${arenaBrukText}], `
        : "";
    return `${arenaBrukTextFeedback}[Har du noen tilbakemeldinger om denne siden: ${andreTilbakemeldingerText}]`;
  }

  function handleRadioOnChange(value: RadioOption) {
    setRadioValue(value);
    logOptionSelected(value);
  }

  function handleSubmit() {
    if (radioValue) {
      const feedbackString = buildFeedbackString();
      const body: FlexjarFeedbackDTO = {
        feedbackId: "SenFase",
        feedback: feedbackString,
        svar: radioValue,
        app: "syfomodiaperson",
      };
      sendFeedback.mutate(body, {
        onSuccess: () => {
          setFeedbackDate(new Date());
          logFeedbackSubmitted(
            radioValue,
            !!arenaBrukText,
            !!andreTilbakemeldingerText
          );
        },
      });
    }
  }

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
            <>
              <Label>{texts.sporsmal}</Label>
              <Alert variant="success" size="small">
                {texts.success}
              </Alert>
            </>
          ) : (
            <>
              <RadioGroup
                legend={<Label>{texts.sporsmal}</Label>}
                onChange={handleRadioOnChange}
                description={texts.anonym}
                size="small"
              >
                <Radio value={RadioOption.JA}>Ja</Radio>
                <Radio value={RadioOption.NEI}>Nei</Radio>
              </RadioGroup>
              {!!radioValue && (
                <>
                  {radioValue === RadioOption.JA && (
                    <HvordanBrukerDuArenaTextArea
                      textValue={arenaBrukText}
                      setTextValue={setArenaBrukText}
                    />
                  )}
                  <AndreTilbakemeldingerTextArea
                    textValue={andreTilbakemeldingerText}
                    setTextValue={setAndreTilbakemeldingerText}
                  />
                  {sendFeedback.isError && (
                    <Alert variant="error" size="small">
                      {defaultErrorTexts.generalError}
                    </Alert>
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
            </>
          )}
        </Box>
      )}
    </div>
  );
}
