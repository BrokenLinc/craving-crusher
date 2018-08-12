import React from 'react';
import { Svg } from 'expo';

import COLOR from '../constants/color';
import Waver from './Waver';

const Wave1 = ({ duration, height, style, width }) => (
    <Waver duration={duration} style={style}>
        <Svg width={width} height={height} viewBox={`0 0 784 ${height}`} preserveAspectRatio="none">
            <Svg.Defs>
                <Svg.LinearGradient id="a" x1="50%" x2="50%" y1="100%" y2="0%">
                    <Svg.Stop stopColor={COLOR.BLUE} offset="0%"/>
                    <Svg.Stop stopColor={COLOR.BEIGE} offset="100%"/>
                </Svg.LinearGradient>
            </Svg.Defs>
            <Svg.Path fill="url(#a)" d={`M784,${height} L0,${height} L0,32.5 C73.8351159,32.5 122.979697,0 196,0 C269.020303,0 319.170873,32.5 392,32.5 C464.829127,32.5 514.554518,0 588,0 C661.445482,0 710.32727,32.5 784,32.5 L784,${height} Z`}/>
        </Svg>
    </Waver>
);

Wave1.defaultProps = {
    height: '100%',
    width: '100%',
};

export default Wave1;