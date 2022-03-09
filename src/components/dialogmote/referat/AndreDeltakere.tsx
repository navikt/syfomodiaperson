import React from "react";
import { LeggTilKnapp } from "../../LeggTilKnapp";
import { FieldArray } from "react-final-form-arrays";
import { NewDialogmotedeltakerAnnenDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { Field, useFormState } from "react-final-form";
import { Input } from "nav-frontend-skjema";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import styled from "styled-components";
import { ValidationErrors } from "final-form";
import { SlettKnapp } from "../../SlettKnapp";

const texts = {
  buttonText: "Legg til en deltaker",
  funksjonLabel: "Funksjon",
  navnLabel: "Navn",
};

const FunksjonColumn = styled(FlexColumn)`
  margin-right: 1em;
`;
const NavnColumn = styled(FlexColumn)`
  margin-right: 0.25em;
`;

const SlettColumn = styled(FlexColumn)`
  margin-top: 1.85em;
`;

interface DeltakerFieldProps {
  fieldName: string;
  label: string;
  submitFailed: boolean;
  errors: ValidationErrors;
}

const initialDeltaker: NewDialogmotedeltakerAnnenDTO = {
  navn: "",
  funksjon: "",
};

const DeltakerField = ({
  fieldName,
  label,
  submitFailed,
  errors,
}: DeltakerFieldProps) => (
  <Field<string> name={fieldName}>
    {({ input }) => (
      <Input
        {...input}
        id={fieldName}
        label={label}
        feil={submitFailed && errors && errors[fieldName]}
      />
    )}
  </Field>
);

const AndreDeltakereBoks = styled.div`
  margin-top: 2em;
`;

export const AndreDeltakere = () => {
  const { submitFailed, errors } = useFormState();

  return (
    <AndreDeltakereBoks>
      <FieldArray<NewDialogmotedeltakerAnnenDTO> name={"andreDeltakere"}>
        {({ fields }) => (
          <>
            {fields.map((field, index) => (
              <FlexRow key={field} bottomPadding={PaddingSize.SM}>
                <FunksjonColumn flex={0.3}>
                  <DeltakerField
                    fieldName={`${field}.funksjon`}
                    label={texts.funksjonLabel}
                    submitFailed={submitFailed}
                    errors={errors}
                  />
                </FunksjonColumn>
                <NavnColumn flex={0.3}>
                  <DeltakerField
                    fieldName={`${field}.navn`}
                    label={texts.navnLabel}
                    submitFailed={submitFailed}
                    errors={errors}
                  />
                </NavnColumn>
                <SlettColumn>
                  <SlettKnapp onClick={() => fields.remove(index)} />
                </SlettColumn>
              </FlexRow>
            ))}
            <LeggTilKnapp onClick={() => fields.push(initialDeltaker)}>
              {texts.buttonText}
            </LeggTilKnapp>
          </>
        )}
      </FieldArray>
    </AndreDeltakereBoks>
  );
};
