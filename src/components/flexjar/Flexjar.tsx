import React, { useEffect, useState } from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  ErrorMessage,
  Label,
  Textarea,
} from "@navikt/ds-react";
import {
  FlexjarFeedbackDTO,
  useFlexjarFeedback,
} from "@/data/flexjar/useFlexjarFeedback";
import { Emoji, emojiProps } from "@/components/flexjar/FeedbackEmojis";
import { EmojiButton } from "@/components/flexjar/EmojiButton";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { defaultErrorTexts } from "@/api/errors";

const texts = {
  apneKnapp: "Gi oss tilbakemelding",
  anonym: "Anonym tilbakemelding",
  sporsmal: "Hvordan opplever du denne siden?",
  alert:
    "Ikke skriv inn navn eller andre personopplysninger. Tilbakemeldingen blir brukt til å forbedre tjenesten. Ønsker du å melde feil må det meldes inn i Porten.",
  feedbackLabel: "Fortell oss om din opplevelse (valgfritt)",
  send: "Send tilbakemelding",
  validation: "Vennligst velg en tilbakemelding",
  success: "Takk for din tilbakemelding!",
};

interface FlexjarProps {
  side: string;
}

export const Flexjar = ({ side }: FlexjarProps) => {
  const [apen, setApen] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [feedback, setFeedback] = useState<string>();
  const [emoji, setEmoji] = useState<Emoji>();
  const sendFeedback = useFlexjarFeedback();

  useEffect(() => {
    if (!!emoji) {
      setIsValid(true);
    }
  }, [emoji]);

  const handleSubmit = () => {
    const svar = emoji && `${emojiProps[emoji].score}`;
    if (svar) {
      const body: FlexjarFeedbackDTO = {
        feedbackId: side,
        feedback: feedback,
        svar: svar,
        app: "syfomodiaperson",
      };
      sendFeedback.mutate(body);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="flex flex-col sticky bottom-0 items-end z-[100]">
      <Button
        variant="primary-neutral"
        size="small"
        iconPosition="right"
        icon={apen ? <ChevronDownIcon /> : <ChevronUpIcon />}
        onClick={() => setApen(!apen)}
        className="w-max"
      >
        {texts.apneKnapp}
      </Button>
      {apen && (
        <Box
          background={"surface-default"}
          borderColor="default"
          borderWidth="2"
          shadow="large"
          borderRadius="medium"
          padding="4"
          className="flex flex-col gap-4 w-[25rem]"
        >
          <Box className="flex flex-col">
            <Label>{texts.sporsmal}</Label>
            <BodyShort size="small">{texts.anonym}</BodyShort>
          </Box>
          {sendFeedback.isSuccess ? (
            <Alert variant="success" size="small">
              {texts.success}
            </Alert>
          ) : (
            <>
              <Box
                background={"surface-default"}
                className="flex flex-row gap-2"
              >
                {Object.keys(emojiProps).map((emojiKey, index) => (
                  <EmojiButton
                    emojiType={emojiKey as Emoji}
                    selectedEmoji={emoji}
                    setSelectedEmoji={setEmoji}
                    key={index}
                  />
                ))}
              </Box>
              {emoji && (
                <Textarea
                  maxLength={500}
                  minRows={3}
                  size="small"
                  label={
                    <div className="flex flex-col gap-4 mb-2">
                      <Label size="small">{texts.feedbackLabel}</Label>
                      <Alert variant="warning" size="small">
                        {texts.alert}
                      </Alert>
                    </div>
                  }
                  value={feedback ?? ""}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              )}
              {isValid === false && (
                <ErrorMessage size="small">{texts.validation}</ErrorMessage>
              )}
              {sendFeedback.isError && (
                <Alert variant="error" size="small">
                  {defaultErrorTexts.generalError}
                </Alert>
              )}
              <Button
                variant="secondary-neutral"
                size="small"
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
};
