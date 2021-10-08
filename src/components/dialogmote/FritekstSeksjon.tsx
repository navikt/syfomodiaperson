import { FlexColumn, FlexRow, PaddingSize } from "../Layout";
import { Field } from "react-final-form";
import Fritekst from "../Fritekst";
import React from "react";
import styled from "styled-components";
import { TrackedKnapp } from "@/components/buttons/TrackedKnapp";

const texts = {
  forhandsvisning: "Forhåndsvisning",
};

const FritekstWrapper = styled.div`
  margin-bottom: 4em;
`;

interface FritekstSeksjonProps {
  fieldName: string;
  label: string;
  handlePreviewClick: () => void;
  maxLength: number;
}

const FritekstSeksjon = ({
  fieldName,
  label,
  handlePreviewClick,
  maxLength,
}: FritekstSeksjonProps) => (
  <FritekstWrapper>
    <FlexRow bottomPadding={PaddingSize.SM}>
      <FlexColumn flex={1}>
        <Field<string> name={fieldName}>
          {({ input, meta }) => (
            <Fritekst
              data-cy={fieldName + "TextArea"}
              size="medium"
              maxLength={maxLength}
              label={label}
              feil={meta.submitFailed && meta.error}
              id={fieldName}
              {...input}
            />
          )}
        </Field>
      </FlexColumn>
    </FlexRow>
    <FlexRow>
      <TrackedKnapp
        htmlType="button"
        data-cy={fieldName + "Knapp"}
        context={label}
        onClick={handlePreviewClick}
      >
        {texts.forhandsvisning}
      </TrackedKnapp>
    </FlexRow>
  </FritekstWrapper>
);

export default FritekstSeksjon;
