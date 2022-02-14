import React, { ReactElement } from "react";
import { FlexRow, PaddingSize } from "../../Layout";
import styled from "styled-components";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { Link } from "react-router-dom";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { TrackedKnapp } from "@/components/buttons/TrackedKnapp";

const texts = {
  save: "Lagre",
  send: "Lagre og send",
  abort: "Avbryt",
};

interface ReferatButtonsProps {
  onSaveClick: () => void;
  onSendClick: () => void;
  pageTitle: string;
  showSaveSpinner: boolean;
  showSendSpinner: boolean;
}

const HovedKnapp = styled(TrackedHovedknapp)`
  margin-right: 1em;
  transform: none;
`;
const LagreKnapp = styled(TrackedKnapp)`
  margin-right: 1em;
`;

const ReferatButtons = ({
  onSaveClick,
  onSendClick,
  pageTitle,
  showSaveSpinner,
  showSendSpinner,
}: ReferatButtonsProps): ReactElement => (
  <>
    <FlexRow topPadding={PaddingSize.LG}>
      <LagreKnapp
        context={pageTitle}
        htmlType="button"
        onClick={onSaveClick}
        autoDisableVedSpinner
        spinner={showSaveSpinner}
      >
        {texts.save}
      </LagreKnapp>
      <HovedKnapp
        context={pageTitle}
        htmlType="submit"
        onClick={onSendClick}
        autoDisableVedSpinner
        spinner={showSendSpinner}
      >
        {texts.send}
      </HovedKnapp>
      <Link to={moteoversiktRoutePath}>
        <TrackedFlatknapp context={pageTitle} htmlType="button">
          {texts.abort}
        </TrackedFlatknapp>
      </Link>
    </FlexRow>
  </>
);

export default ReferatButtons;
