import * as React from 'react';
import { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import PengestoppModal from './PengestoppModal';
import styled from 'styled-components';
import PengestoppDropdown from './PengestoppDropdown';
import { connect } from 'react-redux';
import {
    Status,
    StatusEndring,
    Sykmelding,
} from '../../types/FlaggPerson';
import { initialState as FlaggPerson } from '../../reducers/flaggperson';
import {
    allStoppAutomatikkStatusEndringer,
    arbeidsgivereWithStoppAutomatikkStatus,
    sykmeldingerToArbeidsgiver,
    unikeArbeidsgivereMedSykmeldingSiste3Maneder,
    uniqueArbeidsgivere
} from '../../utils/pengestoppUtils';

const texts = {
    stansSykepenger: 'Stans sykepenger',
};

const Wrapper = styled.div`
    margin: 1rem 0;
`;

interface IPengestoppProps {
    brukernavn: String,
    sykmeldinger: Sykmelding[],
    flaggperson: typeof FlaggPerson,
    fnr: string,
}


const Pengestopp = ({ brukernavn, sykmeldinger, flaggperson }: IPengestoppProps) => {
    const [modalIsOpen, setModelIsOpen] = useState(false);

    const toggleModal = () => {
        setModelIsOpen(!modalIsOpen);
    };

    const data: StatusEndring[] = flaggperson.data;

    const pengestopp: StatusEndring | undefined =
        data.find((statusEndring: StatusEndring) => statusEndring.status === Status.STOPP_AUTOMATIKK);

    const statusEndringerWithStoppedAutomatikk = allStoppAutomatikkStatusEndringer(data);
    const uniqueArbeidsgivereWithSykmeldingLast3Months = unikeArbeidsgivereMedSykmeldingSiste3Maneder(sykmeldinger);

    const allTimeUniqueArbeidsgivere = uniqueArbeidsgivere(sykmeldingerToArbeidsgiver(sykmeldinger));

    const stoppedArbeidsgivere = arbeidsgivereWithStoppAutomatikkStatus(allTimeUniqueArbeidsgivere, statusEndringerWithStoppedAutomatikk); // TODO Dette må gjøres om til å bli alle AGer som er stoppet, uavhengig av om de har aktiv sykmelding eller ikke.

    return (
        <Wrapper>
            {pengestopp?.status === Status.STOPP_AUTOMATIKK
                ? <PengestoppDropdown dato={pengestopp.opprettet} stoppedArbeidsgivere={stoppedArbeidsgivere} />
                : <Knapp type="fare" onClick={toggleModal}>{texts.stansSykepenger}</Knapp>
            }

            <PengestoppModal brukernavn={brukernavn} statusEndringer={data} arbeidsgivere={uniqueArbeidsgivereWithSykmeldingLast3Months} isOpen={modalIsOpen} toggle={toggleModal} />
        </Wrapper>
    );
};

const mapStateToProps = (state: { flaggperson: { data: StatusEndring[] } }) => {
    const { flaggperson } = state;
    return { flaggperson };
};

export default connect(mapStateToProps)(Pengestopp);
