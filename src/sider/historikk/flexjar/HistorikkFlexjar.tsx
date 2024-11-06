import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Label, Radio, RadioGroup } from "@navikt/ds-react";
import {
  FlexjarFeedbackDTO,
  useFlexjarFeedback,
} from "@/data/flexjar/useFlexjarFeedback";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { defaultErrorTexts } from "@/api/errors";
import AndreTilbakemeldingerTextArea from "@/components/flexjar/AndreTilbakemeldingerTextArea";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import HvaManglerTextArea from "@/sider/historikk/flexjar/HvaManglerTextArea";

const texts = {
  apneKnapp: "Vi ønsker å lære av deg",
  anonym: "Anonym tilbakemelding",
  send: "Send",
  success: "Takk for din tilbakemelding!",
  sporsmal: "Fant du historikken du lette etter?",
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
      tekst: "Radioknapp Flexjar historikk",
      url: window.location.href,
    },
  });
}

function logFeedbackSubmitted(
  radioOptionValue: RadioOption,
  hasFeedbackValue: boolean
) {
  Amplitude.logEvent({
    type: EventType.HistorikkFlexjarSubmitted,
    data: {
      url: window.location.href,
      optionSelected: radioOptionValue.toString(),
      hasFeedbackValue: hasFeedbackValue,
    },
  });
}

export default function HistorikkFlexjar() {
  const [isApen, setIsApen] = useState<boolean>(true);
  const [hvaManglerText, setHvaManglerText] = useState<string>("");
  const [andreTilbakemeldingerText, setAndreTilbakemeldingerText] =
    useState<string>("");
  const [radioValue, setRadioValue] = useState<RadioOption | null>(null);
  const sendFeedback = useFlexjarFeedback();
  const { setStoredValue: setFeedbackDate } = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_HISTORIKK_DATE
  );
  useEffect(() => {
    logPageView("Historikk");
  }, []);

  function toggleApen() {
    if (isApen) {
      setRadioValue(null);
      setHvaManglerText("");
    }
    setIsApen(!isApen);
  }

  function buildFeedbackString() {
    return radioValue === RadioOption.NEI
      ? `[Hva mangler du: ${hvaManglerText}]`
      : `[Har du noen tilbakemeldinger om denne siden: ${andreTilbakemeldingerText}]`;
  }

  function handleRadioOnChange(value: RadioOption) {
    setRadioValue(value);
    logOptionSelected(value);
  }

  function handleSubmit() {
    if (radioValue) {
      const feedbackString = buildFeedbackString();
      const body: FlexjarFeedbackDTO = {
        feedbackId: "Historikk",
        feedback: feedbackString,
        svar: radioValue,
        app: "syfomodiaperson",
      };
      sendFeedback.mutate(body, {
        onSuccess: () => {
          setFeedbackDate(new Date());
          logFeedbackSubmitted(
            radioValue,
            !!hvaManglerText || !!andreTilbakemeldingerText
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
            <Alert variant="success" size="small">
              {texts.success}
            </Alert>
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
                  {radioValue === RadioOption.NEI ? (
                    <HvaManglerTextArea
                      textValue={hvaManglerText}
                      setTextValue={setHvaManglerText}
                    />
                  ) : (
                    <AndreTilbakemeldingerTextArea
                      textValue={andreTilbakemeldingerText}
                      setTextValue={setAndreTilbakemeldingerText}
                    />
                  )}
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
