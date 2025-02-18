import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import React, { ReactElement } from "react";
import { Link } from "@navikt/ds-react";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";

const texts = {
  oversikt: "Min oversikt",
  moter: "Mine møter",
  enhetensOversikt: "Enhetens oversikt",
  sokSykmeldt: "Søk etter sykmeldt",
};

export const OversiktLenker = (): ReactElement => (
  <div className="flex gap-8">
    <Link href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}>
      {texts.oversikt}
    </Link>
    <Link href={fullNaisUrlIntern("syfooversikt", "/enhet")}>
      {texts.enhetensOversikt}
    </Link>
    <Link href={fullNaisUrlIntern("syfooversikt", "/sok")}>
      <MagnifyingGlassIcon />
      {texts.sokSykmeldt}
    </Link>
    <Link href={fullNaisUrlIntern("syfomoteoversikt")}>{texts.moter}</Link>
  </div>
);
