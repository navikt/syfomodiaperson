import React from 'react';
import { fullNaisUrlDefault } from '../../utils/miljoUtil';

const texts = {
    link: 'Til oversikten',
};

const OversiktLink = () => {
    return (
        <a href={fullNaisUrlDefault('syfooversikt', '/enhet')} alt="syfooversikt" className="oversiktlenke">
            {texts.link}
        </a>
    );
};

export default OversiktLink;
