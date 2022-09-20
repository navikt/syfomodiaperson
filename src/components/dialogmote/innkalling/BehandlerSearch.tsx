import React, { ReactElement, useRef, useState } from "react";
import "@navikt/ds-css";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/dialogmote/innkalling/BehandlerSearchResult";

const BehandlerSearch = (): ReactElement => {
  const searchRef = useRef(null);
  const [searchvalue, setSearchvalue] = useState("");
  const setSearchText = (text) => {
    if (text.length > 3) {
      setSearchvalue(text);
    } else if (searchvalue.length > 3 && text.length <= 3) {
      setSearchvalue("");
    }
  };
  return (
    <form className="relative">
      <Search
        label="Legg til en behandler"
        ref={searchRef}
        size="medium"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
      />
      <BehandlerSearchResult searchRef={searchRef} searchText={searchvalue} />
    </form>
  );
};

export default BehandlerSearch;
