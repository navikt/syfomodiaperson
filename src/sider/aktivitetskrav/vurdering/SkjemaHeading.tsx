import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import { BodyShort, Heading } from "@navikt/ds-react";
import React from "react";

interface VurderAktivitetskravSkjemaHeadingProps {
  title: string;
  subtitles?: string[];
}

export function SkjemaHeading({
  title,
  subtitles,
}: VurderAktivitetskravSkjemaHeadingProps) {
  return (
    <>
      <div className={"mt-4 mb-4"}>
        <Heading level="2" size="small">
          {title}
        </Heading>
      </div>
      {subtitles && (
        <FlexRow bottomPadding={PaddingSize.MD}>
          <FlexColumn>
            {subtitles.map((subtitle, index) => (
              <BodyShort key={index} size="small">
                {subtitle}
              </BodyShort>
            ))}
          </FlexColumn>
        </FlexRow>
      )}
    </>
  );
}
