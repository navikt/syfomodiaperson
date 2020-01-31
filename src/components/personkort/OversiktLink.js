import React from 'react';
import { Link } from 'react-router';
import { fullNaisUrlDefault } from '../../utils/miljoUtil';

const texts = {
    link: 'Til oversikten',
};

const OversiktLink = () => {
    return (
        <Link to={fullNaisUrlDefault('syfooversikt', '/enhet')} className="oversiktlenke">
            {texts.link}
        </Link>
    );
};

export default OversiktLink;
