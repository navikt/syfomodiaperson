const express = require('express');
const mockFastlegerest = require('./mockFastlegerest');
const mockIspersonoppgave = require('./ispersonoppgave/mockIspersonoppgave');
const mockModiacontextholder = require('./mockModiacontextholder');
const mockModiasyforest = require('./mockModiasyforest');
const mockSyfomoteadmin = require('./mockSyfomoteadmin');
const mockSyfomotebehov = require('./mockSyfomotebehov');
const mockSyfooppfolgingsplanservice = require('./mockSyfooppfolgingsplanservice');
const mockSyfosoknad = require('./mockSyfosoknad');
const mockSyfotekster = require('./mockSyfotekster');
const mockSyfotilgangskoontroll = require('./mockSyfotilgangskontroll');
const mockSyfobehandlendeenhet = require('./mockSyfobehandlendeenhet');
const mockSyfoperson = require('./mockSyfoperson');
const mockSyfosmregiser = require('./mockSyfosmregister');
const mockIspengestopp = require('./mockIspengestopp');
const mockIsprediksjon = require('./mockIsprediksjon');
const mockVedtak = require('./mockVedtak');

function mockEndepunkter(server, erLokal) {
    server.use(express.json());
    server.use(express.urlencoded());

    [
        mockFastlegerest,
        mockIspersonoppgave,
        mockModiacontextholder,
        mockModiasyforest,
        mockSyfomoteadmin,
        mockSyfomotebehov,
        mockSyfooppfolgingsplanservice,
        mockSyfosoknad,
        mockSyfotekster,
        mockSyfotilgangskoontroll,
        mockSyfobehandlendeenhet,
        mockSyfoperson,
        mockSyfosmregiser,
        mockIspengestopp,
        mockIsprediksjon,
        mockVedtak,
    ].forEach((func) => {
        func(server, erLokal);
    });
}

module.exports = mockEndepunkter;
