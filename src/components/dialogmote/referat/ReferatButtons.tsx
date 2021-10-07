import React, { ReactElement } from "react";
import { Knapp } from "nav-frontend-knapper";
import { FlexRow, PaddingSize } from "../../Layout";
import styled from "styled-components";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { Link } from "react-router-dom";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { moteoversiktRoutePath } from "@/routers/AppRouter";

const texts = {
  send: "Lagre og send",
  preview: "Se forhåndsvisning",
  abort: "Avbryt",
};

interface ReferatButtonsProps {
  onSendClick: () => void;
  onPreviewClick: () => void;
  pageTitle: string;
  showSendSpinner: boolean;
}

const HovedKnappRightMargin = styled(TrackedHovedknapp)`
  margin-right: 2em;
`;

const ReferatButtons = ({
  onSendClick,
  onPreviewClick,
  pageTitle,
  showSendSpinner,
}: ReferatButtonsProps): ReactElement => (
  <>
    <FlexRow topPadding={PaddingSize.MD}>
      <Knapp htmlType="button" onClick={onPreviewClick}>
        {texts.preview}
      </Knapp>
    </FlexRow>
    <FlexRow topPadding={PaddingSize.LG}>
      <HovedKnappRightMargin
        context={pageTitle}
        htmlType="submit"
        onClick={onSendClick}
        autoDisableVedSpinner
        spinner={showSendSpinner}
      >
        {texts.send}
      </HovedKnappRightMargin>
      <Link to={moteoversiktRoutePath}>
        <TrackedFlatknapp context={pageTitle} htmlType="button">
          {texts.abort}
        </TrackedFlatknapp>
      </Link>
    </FlexRow>
  </>
);

export default ReferatButtons;
