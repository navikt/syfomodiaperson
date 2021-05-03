import React from "react";
import styled from "styled-components";

// Denne blir gjenbrukbar, og det blir opp til frontend å tolke/vise fram disse.
// Her vil man få med type, og eventuelt rekkefølge.
// Type = 'TEXT' | 'LINK' | 'IMG' // Eller noe helt annet
interface InnkallingComponent {
  data: string;
  title?: string | null;
}

// Dette blir i praksis DTOen vår.
// Navn er kanskje unødvendig, men den ble med nå, siden den alltid skal være først, og derfor kanskje ikke skal være en Component
export interface Innkalling {
  name: string;
  components: InnkallingComponent[];
}

const Title = styled.p`
  font-weight: bold;
  margin-bottom: -1em;
`;

const Paragraph = styled.p`
  margin-top: 1em;
  margin-bottom: 1em;
`;

interface ComponentProps {
  component: InnkallingComponent;
}

// Denne viser tekst, og eventuell tittel.
// Enkel styling enn så lenge.
// Hvis man har med type, må man legge til if-er, en switch, eller noe annet og f.eks. gjøre:
//  if (component.type === 'LINK') { <a href=component.data />}
//  if (component.type === 'TEXT') { <p>{component.data}</p> }
const Component = ({ component }: ComponentProps) => {
  return (
    <>
      {component.title && component.title.length > 0 && (
        <Title>{component.title}</Title>
      )}
      <Paragraph>{component.data}</Paragraph>
    </>
  );
};

interface InnkallingVisningProps {
  innkalling: Innkalling;
}

// Denne kan brukes med både nye og gamle møter
// Man må hente inn navn, det blir i versjon  2.
// Hvis vi har rekkefølge på komponentene, må man her sortere de i rekkefølge før de vises.
const InnkallingVisning = ({ innkalling }: InnkallingVisningProps) => {
  return (
    <div>
      <p>{`Hei, ${innkalling.name}`}</p>
      {innkalling.components.map((component, index) => {
        return <Component key={index} component={component} />;
      })}
    </div>
  );
};

export default InnkallingVisning;
