import React, { ReactElement, useEffect, useRef, useState } from "react";
import "@navikt/ds-css";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/behandler/BehandlerSearchResult";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

interface BehandlerSearchProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;

  /**
   * Optional pre-selected behandler to hydrate the search input (e.g. from draft).
   */
  selectedBehandler?: BehandlerDTO;

  label?: string;
}

function getBehandlerSearchDisplayValue(behandler: BehandlerDTO): string {
  return `${behandler.etternavn}, ${behandler.fornavn}: ${behandler.kontor}`;
}

const BehandlerSearch = ({
  setSelectedBehandler,
  selectedBehandler,
  label,
}: BehandlerSearchProps): ReactElement => {
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSearchResult, setselectedSearchResult] = useState(""); //TODO: Finn bedre namn/oppsett
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false);
  const isHydratingRef = useRef(false);

  useEffect(() => {
    if (!selectedBehandler) {
      return;
    }

    // Hydrate the input with the already selected behandler (e.g. from draft).
    // Avoid triggering the search popover.
    isHydratingRef.current = true;
    setselectedSearchResult(getBehandlerSearchDisplayValue(selectedBehandler));
    setSearchValue("");
    setPopoverIsOpen(false);

    const id = window.setTimeout(() => {
      isHydratingRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(id);
    };
  }, [selectedBehandler]);

  const setSearchText = (text: string) => {
    // Ignore onChange events triggered by hydration.
    if (isHydratingRef.current) {
      return;
    }

    // When user starts typing a new query, clear previously selected behandler.
    if (text !== selectedSearchResult) {
      setSelectedBehandler(undefined);
    }

    if (text.length > 3) {
      setSearchValue(text);
    } else if (searchValue.length > 3) {
      setSearchValue("");
    }
    setselectedSearchResult(text);
    setPopoverIsOpen(true);
  };
  return (
    <div className="w-[30rem]">
      <Search
        label={label}
        ref={searchRef}
        size="small"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
        hideLabel={label === undefined}
        value={selectedSearchResult}
      />
      {popoverIsOpen && (
        <BehandlerSearchResult
          searchRef={searchRef}
          searchText={searchValue}
          setPopoverIsOpen={setPopoverIsOpen}
          setSelectedBehandler={setSelectedBehandler}
          setSelectedSearchResult={setselectedSearchResult}
        />
      )}
    </div>
  );
};

export default BehandlerSearch;
