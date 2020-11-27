import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { hentPrediksjon } from "../../actions/prediksjon_actions";
import Prediksjontittel from "./Prediksjontittel";
import ViktigeFaktorer from "./ViktigeFaktorer";
import DetaljertInformasjon from "./DetaljertInformasjon";
import { PrediksjonState } from "../../reducers/prediksjon";
import PrediksjonResultat from "./PrediksjonResultat";

interface PrediksjonProps {
  fnr: string;
}

const PrediksjonPanel = styled.div`
  margin-bottom: 1em;
`;

const PrediksjonVisning = ({ fnr }: PrediksjonProps) => {
  const dispatch = useDispatch();
  dispatch(hentPrediksjon(fnr));
  const prediksjonReducer: PrediksjonState = useSelector(
    (state: any) => state.prediksjon
  );
  const data = prediksjonReducer && prediksjonReducer.data;

  return (
    <>
      {!!data && (
        <PrediksjonPanel className="panel">
          <Prediksjontittel />
          <PrediksjonResultat prediksjon={data} />
          <ViktigeFaktorer prediksjon={data} />
          <DetaljertInformasjon
            kortereFaktorer={data.kortereVarighetGrunner}
            lengreFaktorer={data.lengreVarighetGrunner}
          />
        </PrediksjonPanel>
      )}
    </>
  );
};

export default PrediksjonVisning;
