const kanskjeBooleanTilJaNeiKanskje = (kanskjeBoolean) => {
  if (kanskjeBoolean === null) {
    return "Ikke oppgitt";
  }
  return kanskjeBoolean ? "Ja" : "Nei";
};

export default kanskjeBooleanTilJaNeiKanskje;
