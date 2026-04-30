import React, { ReactNode } from "react";
import { AlertStripeFeil } from "nav-frontend-alertstriper";
import { Normaltekst } from "nav-frontend-typografi";
import styled from "styled-components";
import { ApiError, defaultErrorTexts, ErrorType } from "@/api/errors";
import { Link } from "@navikt/ds-react";

const texts = {
  meldFeil: "Meld oss gjerne om feilen her",
};

const newJiraTicketUrl =
  "https://jira.adeo.no/plugins/servlet/desk/portal/541/create/1401";

const InlineLenke = styled(Link)`
  margin-left: 0.2em;
`;

interface TextWithJiraLinkProps {
  children: string;
}

const TextWithJiraLink = ({ children }: TextWithJiraLinkProps) => {
  return (
    <>
      <span>{children}</span>
      <InlineLenke target="_blank" href={newJiraTicketUrl}>
        {texts.meldFeil}
      </InlineLenke>
    </>
  );
};

interface ErrorBoundaryProps {
  children?: ReactNode;
  apiError?: ApiError | null;
  errorMessage?: string;
}

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    //Frontend errors
    if (this.state.hasError) {
      return (
        <AlertStripeFeil>
          <TextWithJiraLink>{defaultErrorTexts.generalError}</TextWithJiraLink>
        </AlertStripeFeil>
      );
    }

    //API errors
    if (this.props.apiError) {
      return (
        <AlertStripeFeil>
          {this.props.errorMessage && (
            <Normaltekst>{this.props.errorMessage}</Normaltekst>
          )}

          {this.props.apiError.type === ErrorType.GENERAL_ERROR ? (
            <TextWithJiraLink>
              {this.props.apiError.defaultErrorMsg}
            </TextWithJiraLink>
          ) : (
            this.props.apiError.defaultErrorMsg
          )}
        </AlertStripeFeil>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
