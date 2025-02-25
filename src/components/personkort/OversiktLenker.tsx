import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import React, { ReactElement } from "react";
import { Heading, Tabs } from "@navikt/ds-react";
import LinkAsTab from "@/components/LinkAsTab";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";

const texts = {
  oversikt: "Min oversikt",
  moter: "Mine møter",
  enhetensOversikt: "Enhetens oversikt",
  sokSykmeldt: "Søk etter sykmeldt",
};

export const OversiktLenker = (): ReactElement => {
  return (
    <Tabs>
      <Tabs.List>
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}
          label={<Heading size="xsmall">{texts.oversikt}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/enhet")}
          label={<Heading size="xsmall">{texts.enhetensOversikt}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern("syfomoteoversikt")}
          label={<Heading size="xsmall">{texts.moter}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/sok")}
          label={<Heading size="xsmall">{texts.sokSykmeldt}</Heading>}
          icon={<MagnifyingGlassIcon />}
        />
      </Tabs.List>
    </Tabs>
  );
};
