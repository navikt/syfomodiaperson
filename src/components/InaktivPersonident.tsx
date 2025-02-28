import { Alert, BodyShort, Button, Link, Modal } from "@navikt/ds-react";
import React, { ReactNode, useState } from "react";
import { usePostAktivBruker } from "@/data/modiacontext/usePostAktivBruker";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

interface ChangeAktivBrukerLinkProps {
  personident: string;
  children: ReactNode;
}

function ChangeAktivBrukerLink({
  personident,
  children,
}: ChangeAktivBrukerLinkProps) {
  const postAktivBruker = usePostAktivBruker();

  return (
    <Link
      onClick={(event) => {
        event.preventDefault();
        postAktivBruker.mutate(personident, {
          onSuccess: () => {
            window.location.href = "/sykefravaer";
          },
        });
      }}
      href="/sykefravaer"
    >
      {children}
    </Link>
  );
}

const texts = {
  intro: "Personen har byttet fødselsnummer/d-nummer. ",
  link: (personident: string) =>
    `Klikk her for å åpne person på aktivt f.nr/d.nr ${personident}.`,
  label: "Inaktivt fødselsnummer/d-nummer",
  close: "Lukk",
};

export function InaktivPersonident() {
  const {
    brukerinfo: { aktivPersonident },
  } = useBrukerinfoQuery();
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      <Alert variant="error" contentMaxWidth={false}>
        {texts.intro}
        <ChangeAktivBrukerLink personident={aktivPersonident}>
          {texts.link(aktivPersonident)}
        </ChangeAktivBrukerLink>
      </Alert>
      <Modal
        closeOnBackdropClick
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-label={texts.label}
        header={{
          heading: texts.intro,
          closeButton: false,
          size: "small",
        }}
      >
        <Modal.Body className="p-8">
          <ChangeAktivBrukerLink personident={aktivPersonident}>
            <BodyShort size="medium">{texts.link(aktivPersonident)}</BodyShort>
          </ChangeAktivBrukerLink>
        </Modal.Body>
        <Modal.Footer className="self-center">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            {texts.close}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
