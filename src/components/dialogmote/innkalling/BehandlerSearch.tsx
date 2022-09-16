import React, { ReactElement, useRef, useState } from "react";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/dialogmote/innkalling/BehandlerSearchResult";

const BehandlerSearch = (): ReactElement => {
  const searchRef = useRef(null);
  const [searchTextFancyName, setSearchTextFancyName] = useState("");
  const setSearchText = (text) => {
    if (text.length > 3) {
      setSearchTextFancyName(text); // TODO: Oppdater state når under 3 tegn også, men ikke søk
    } else {
      setSearchTextFancyName("");
    }
  };
  console.log(searchTextFancyName);
  return (
    <>
      <Search
        label="Legg til en behandler"
        ref={searchRef}
        size="medium"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
      />
      <BehandlerSearchResult
        searchRef={searchRef}
        searchText={searchTextFancyName}
      />
    </>
  );
};

export default BehandlerSearch;
