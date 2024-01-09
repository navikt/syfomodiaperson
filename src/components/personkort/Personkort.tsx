import React, { ReactElement } from "react";
import PersonkortHeader from "./PersonkortHeader/PersonkortHeader";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { Tabs } from "@navikt/ds-react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import PersonkortLedere from "@/components/personkort/ledere/PersonkortLedere";
import PersonkortLege from "@/components/personkort/PersonkortLege";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";

enum TabType {
  SYKMELDT = "SYKMELDT",
  LEDER = "LEDER",
  LEGE = "LEGE",
  ENHET = "ENHET",
}

interface Tab {
  label: string;
}

const tabs: Record<TabType, Tab> = {
  SYKMELDT: {
    label: "Kontaktinformasjon",
  },
  LEDER: {
    label: "Nærmeste leder",
  },
  LEGE: {
    label: "Fastlege",
  },
  ENHET: {
    label: "Behandlende enhet",
  },
};

interface PersonkortVisningProps {
  tab: TabType;
}

const PersonkortVisning = ({ tab }: PersonkortVisningProps): ReactElement => {
  switch (tab) {
    case TabType.SYKMELDT:
      return <PersonkortSykmeldt />;
    case TabType.ENHET:
      return <PersonkortEnhet />;
    case TabType.LEDER:
      return <PersonkortLedere />;
    case TabType.LEGE:
      return <PersonkortLege />;
  }
};

const Personkort = () => {
  return (
    <Ekspanderbartpanel tittel={<PersonkortHeader />} className="mb-2">
      <Tabs size="small" defaultValue={TabType.SYKMELDT}>
        <Tabs.List className="mt-4">
          {Object.entries(tabs).map(([tab, { label }], index) => (
            <Tabs.Tab value={tab} label={label} key={index} />
          ))}
        </Tabs.List>
        {Object.keys(tabs).map((value, index) => (
          <Tabs.Panel key={index} value={value} className="mt-8">
            <PersonkortVisning tab={value as TabType} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Ekspanderbartpanel>
  );
};

export default Personkort;
