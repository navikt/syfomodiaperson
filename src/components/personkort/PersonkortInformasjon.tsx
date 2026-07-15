import React from "react";
import { Table } from "@navikt/ds-react";

interface Props {
  informasjonNokkelTekster: Map<string, string>;
  informasjon: any;
}

export default function PersonkortInformasjon({
  informasjonNokkelTekster,
  informasjon,
}: Props) {
  const nokler = Object.keys(informasjon);

  return (
    <Table size="small" className={"mb-4"}>
      <Table.Header>
        <Table.Row>
          {nokler.map((nokkel, idx) => (
            <Table.ColumnHeader key={`${nokkel}.${idx}`} scope="col">
              {informasjonNokkelTekster.get(nokkel)}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          {nokler.map((nokkel, idx) => (
            <Table.DataCell key={`${nokkel}.${idx}`} textSize="small">
              {informasjon[nokkel] ?? "—"}
            </Table.DataCell>
          ))}
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
