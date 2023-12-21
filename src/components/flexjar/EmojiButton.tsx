import React from "react";
import { Emoji, emojiProps } from "./FeedbackEmojis";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { Label } from "@navikt/ds-react";

interface EmojiButtonProps {
  emojiType: Emoji;
  selectedEmoji: Emoji | undefined;
  setSelectedEmoji: (emoji: Emoji | undefined) => void;
}

export const EmojiButton = ({
  emojiType,
  selectedEmoji,
  setSelectedEmoji,
}: EmojiButtonProps) => {
  const emojiProp = emojiProps[emojiType];
  const isActive = selectedEmoji === emojiType;

  const handleOnClick = () => {
    if (isActive) {
      setSelectedEmoji(undefined);
    } else {
      setSelectedEmoji(emojiType);
      Amplitude.logEvent({
        type: EventType.ButtonClick,
        data: {
          tekst: `${emojiProp.score}`,
          url: window.location.href,
        },
      });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={handleOnClick}
      className="border-0 flex flex-col items-center cursor-pointer bg-inherit"
    >
      <emojiProp.figure
        width="40"
        fill={isActive ? emojiProp.color : undefined}
      />
      <Label className="text-sm">{emojiProp.label}</Label>
    </button>
  );
};
