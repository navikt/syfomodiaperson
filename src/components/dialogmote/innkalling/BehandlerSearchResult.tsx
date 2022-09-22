import React, { ReactElement } from "react";
import { Button, Popover } from "@navikt/ds-react";
import { useSokBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: start;
  color: #262626;
`;

interface BehandlerSearchResultProps {
  searchRef: React.MutableRefObject<any>;
  searchText: string;
  setPopoverIsOpen: (value: boolean) => void;
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  setSelectedSearchResult: (selectedResult: string) => void;
}

const BehandlerSearchResult = ({
  searchRef,
  searchText,
  setPopoverIsOpen,
  setSelectedBehandler,
  setSelectedSearchResult,
}: BehandlerSearchResultProps): ReactElement => {
  const { data: behandlere, isLoading } = useSokBehandlereQuery(searchText);

  const updateSearch = (behandler: BehandlerDTO, selectedResult: string) => {
    setSelectedSearchResult(selectedResult);
    setSelectedBehandler(behandler);
    setPopoverIsOpen(false);
  };

  return (
    <>
      <Popover
        anchorEl={searchRef.current}
        placement="bottom-start"
        open={behandlere.length > 0 && searchText !== ""}
        onClose={() => null}
        arrow={false}
        className="w-full"
        offset={8}
        tabIndex={0}
      >
        <div>
          {behandlere.map((behandler, index) => {
            const behandlerInfo = `${behandler.etternavn}, ${behandler.fornavn}: ${behandler.kontor}`;
            return (
              <Popover.Content key={index} style={{ padding: 0 }}>
                <StyledButton
                  variant={"tertiary"}
                  onClick={() => updateSearch(behandler, behandlerInfo)}
                >
                  {behandlerInfo}
                </StyledButton>
              </Popover.Content>
            );
          })}
        </div>
      </Popover>
    </>
  );
};

export default BehandlerSearchResult;
