import { Component, ReactNode } from "react";
import { ApiError, defaultErrorTexts, ErrorType } from "@/api/errors";
import { Link, LocalAlert } from "@navikt/ds-react";

const texts = {
  problemetVedvarer: "Dersom problemet vedvarer,",
  meldFeil: "meld oss gjerne om feilen her",
};

const newJiraTicketUrl =
  "https://jira.adeo.no/plugins/servlet/desk/portal/541/create/1401";

function MeldFeil() {
  return (
    <>
      {texts.problemetVedvarer}{" "}
      <Link target="_blank" href={newJiraTicketUrl}>
        {texts.meldFeil}
      </Link>
      .
    </>
  );
}

interface Props {
  children?: ReactNode;
  apiError?: ApiError | null;
  errorMessage?: string;
}

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <LocalAlert status="error">
          <LocalAlert.Header>
            <LocalAlert.Title>
              {defaultErrorTexts.generalError}
            </LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            <MeldFeil />
          </LocalAlert.Content>
        </LocalAlert>
      );
    }

    const { apiError, errorMessage } = this.props;
    if (apiError) {
      const isGeneralError = apiError.type === ErrorType.GENERAL_ERROR;
      const hasContent = !!errorMessage || isGeneralError;

      return (
        <LocalAlert status="error">
          <LocalAlert.Header>
            <LocalAlert.Title>
              {errorMessage ?? apiError.defaultErrorMsg}
            </LocalAlert.Title>
          </LocalAlert.Header>
          {hasContent && (
            <LocalAlert.Content>
              {errorMessage && apiError.defaultErrorMsg}
              {errorMessage && isGeneralError && " "}
              {isGeneralError && <MeldFeil />}
            </LocalAlert.Content>
          )}
        </LocalAlert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
