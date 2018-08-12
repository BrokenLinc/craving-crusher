import React from 'react';
import { Animated, Easing } from 'react-native';

class Waver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animatedLeft: new Animated.Value(0),
        };
    }
    componentDidMount() {
        Animated.loop(
            Animated.timing(this.state.animatedLeft, {
                toValue: 100,
                duration: this.props.duration,
                easing: Easing.linear,
            })
        ).start();
    }
    render() {
        const { children, style } = this.props;
        const { animatedLeft } = this.state;

        const left = animatedLeft.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '-100%'],
        });

        return (
            <Animated.View style={[style, {
                position:'absolute',
                left,
            }]}>
                {children}
            </Animated.View>
        );
    }
}

Waver.defaultProps = {
    duration: 5000,
};

export default Waver;