import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import React, { ReactElement } from "react";
import { Heading, Tabs } from "@navikt/ds-react";
import LinkAsTab from "@/components/LinkAsTab";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";

const texts = {
  minOversikt: "Min oversikt",
  enhetensOversikt: "Enhetens oversikt",
  mineMoter: "Mine møter",
  enhetensMoter: "Enhetens møter",
  sokSykmeldt: "Søk etter sykmeldt",
};

export default function OversiktLenker(): ReactElement {
  return (
    <Tabs>
      <Tabs.List>
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}
          label={<Heading size="xsmall">{texts.minOversikt}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/enhet")}
          label={<Heading size="xsmall">{texts.enhetensOversikt}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern(
            "syfomoteoversikt",
            "/syfomoteoversikt/minemoter"
          )}
          label={<Heading size="xsmall">{texts.mineMoter}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern(
            "syfomoteoversikt",
            "/syfomoteoversikt/enhetensmoter"
          )}
          label={<Heading size="xsmall">{texts.enhetensMoter}</Heading>}
        />
        <LinkAsTab
          href={fullNaisUrlIntern("syfooversikt", "/sok")}
          label={<Heading size="xsmall">{texts.sokSykmeldt}</Heading>}
          icon={<MagnifyingGlassIcon />}
        />
      </Tabs.List>
    </Tabs>
  );
}
