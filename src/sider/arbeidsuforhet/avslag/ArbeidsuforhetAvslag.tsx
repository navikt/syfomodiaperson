import { ReactElement } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/AppRouter";
import AvslagFormContainer from "@/sider/arbeidsuforhet/avslag/AvslagFormContainer";

export default function ArbeidsuforhetAvslag(): ReactElement {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];

  return sisteVurdering.varsel?.isExpired ? (
    <AvslagFormContainer sisteVurdering={sisteVurdering} />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
}
