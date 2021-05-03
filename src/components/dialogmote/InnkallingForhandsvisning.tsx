import React, { useState, useEffect } from "react";
import { useFormState } from "react-final-form";
import InnkallingVisning, { Innkalling } from "./InnkallingVisning";

// Definert tekster,
// Header og subheader brukes kun til visning for veileder.
// Nå er det bl.a. ikke tydelig at 'standardTexts'-tekstene skal være av typen InnkallingComponent
// Skal man definere "nåværende versjon" her, eller i et default-objekt? Dette kan man flytte rundt dit man mener det er hensiktsmessig
// Kanskje det finnes en ikke-utvikler-vennlig ('vennlig for "ikke-utvikler"' eller 'ikke "utvikler-vennlig"' 🤔🤔😅) måte å løse det på, så hvem som helst kan endre?
const texts = {
  sykmeldt: {
    header: "Til den sykmeldte",
    subheader: "Innkalling til dialogmøte",
    timeTitle: "Møtetidspunkt",
    placeTitle: "Møtested",
    videoTitle: "Lenke til videomøte",
    standardTexts: [
      {
        data:
          "Velkommen til dialogmøte mellom deg og arbeidsgiveren din, bla bla bla!! Lorem ipsum!",
      },
      {
        data: "I møtet vil vi vite om du kan jobbe.",
      },
      {
        data:
          "Hvis forslaget ikke passer, synd for deg, du må møte opp uansett!",
      },
      {
        data:
          "Den som har sykmeldt deg, eller noen andre, kunne i teorien blitt invitert, men det gidder vi ikke, for da hadde vi ikke fått bruke den nye løsningen for møteinnkalling.",
      },
    ],
  },
};

// Default-verdi for en innkalling.
// Nå er det gjort enkelt ved at tekstene er InnkallingComponents, så man ikke trenger noe mapping her.
// Her må man vurdere hvor definering av "nåværende versjon" burde ligge (som nevnt over).
const defaultInnkallingArbeidstaker: Innkalling = {
  name: "Navn som ikke er hentet",
  components: [...texts.sykmeldt.standardTexts],
};

const InnkallingForhandsvisning = () => {
  const [innkallingArbeidstaker, setInnkallingArbeidstaker] = useState(
    defaultInnkallingArbeidstaker
  );

  // formsState - state til Formen
  // Denne blir kanskje litt magisk, men det funker fordi 'InnkallingForhandsvisning' brukes inne i en <Form>, bruker man denne komponenten et annet sted, vil det feile
  // Fordi denne henter state selv, burde den kanskje få vite om arbeidstaker- eller arbeidsgivervisning er valgt, så kan den hente riktig fritekstfelt.
  const formState = useFormState();

  useEffect(() => {
    // Dette er en enkel måte for å unngå at man skrive "undefined" som et avsnitt.
    const optionalText = formState.values.fritekstSykmeldt || "";

    // Enkel tekstvisning av dato/klokkeslett, må byttes ut med en datoutil-metode.
    const dateTimeText = formState.values.tidspunkt
      ? `${formState.values.tidspunkt.dato} kl ${formState.values.tidspunkt.klokkeslett}`
      : "";

    // Lag et Innkalling-objekt basert på standardtekster og input fra veileder
    // Dette må kanskje flyttes litt på, siden det blir dette, eller et tilsvarende, objekt som skal sendes til backend, sammen med "vanlige" data.
    const nyInnkalling: Innkalling = {
      name: defaultInnkallingArbeidstaker.name,
      components: [
        {
          title: texts.sykmeldt.timeTitle,
          data: dateTimeText,
        },
        {
          title: texts.sykmeldt.placeTitle,
          data: formState.values.sted,
        },
        {
          title: texts.sykmeldt.videoTitle,
          data: formState.values.videoLink,
        },
        {
          title: null,
          data: optionalText,
        },
        ...defaultInnkallingArbeidstaker.components,
      ],
    };

    setInnkallingArbeidstaker(nyInnkalling);
  }, [formState.values]);

  // Vanlig visning, pluss headere som kun er til forhåndsvisning for veileder
  return (
    <div>
      <h2>{texts.sykmeldt.header}</h2>
      <h3>{texts.sykmeldt.subheader}</h3>
      <InnkallingVisning innkalling={innkallingArbeidstaker} />
    </div>
  );
};

export default InnkallingForhandsvisning;
