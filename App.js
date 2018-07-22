import React, { Fragment } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import sample from 'lodash/sample';
import indexOf from 'lodash/indexOf';
import each from 'lodash/each';

const SOUNDS = [
    { file: require('./assets/private/andrea.mp3') },
    { file: require('./assets/private/danny.mp3') },
    { file: require('./assets/private/logan.mp3') },
    { file: require('./assets/private/magbic.mp3') },
];

const RECENT_SOUND_BUFFER_SIZE = 3; // must be less than SOUNDS.length

each(SOUNDS, async (sound) => {
    sound.object = new Expo.Audio.Sound();
    await sound.object.loadAsync(sound.file);
    await sound.object.setProgressUpdateIntervalAsync(30);
});

const loadRandomSound = () => {
    let newSound = sample(SOUNDS);
    while (indexOf(recentSounds, newSound) >= 0) {
        newSound = sample(SOUNDS);
    }
    recentSounds.push(newSound);
    if (recentSounds.length > RECENT_SOUND_BUFFER_SIZE) recentSounds.shift();

    soundObject && soundObject.setOnPlaybackStatusUpdate(null);
    soundObject = newSound.object;
};

const pauseAudio = async () => {
    await soundObject.pauseAsync();
};

const resumeAudio = async () => {
    await soundObject.playAsync();
};

const playSoundFromStart = async () => {
    try {
        await soundObject.setPositionAsync(0);
        await soundObject.playAsync();
    } catch (error) {
        // An error occurred!
    }
};

let soundObject;
const recentSounds = [];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.onPlaybackStatusUpdate = this.onPlaybackStatusUpdate.bind(this);
        this.playRandomSound = this.playRandomSound.bind(this);

        this.state = {};
    }
    componentDidMount() {
        const checkLoading = setInterval(() => {
            for (let i in SOUNDS) {
                // exit the loop if any sound is not loaded
                if (!SOUNDS[i].object._loaded) return false;
            }
            doneLoading();
        }, 100);

        const doneLoading = () => {
            clearInterval(checkLoading);
            this.setState({ isLoaded: true });
            this.playRandomSound();
        };
    }
    onPlaybackStatusUpdate(playbackStatus) {
        this.setState(playbackStatus);
    }
    playRandomSound() {
        loadRandomSound();
        soundObject.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
        playSoundFromStart();
    }
    render() {
        const { isLoaded, positionMillis, isPlaying, durationMillis } = this.state;
        const isComplete = positionMillis === durationMillis;
        const isPaused = !isComplete && !isPlaying;

        // const status = isComplete ? 'done' : (
        //     isPlaying ? 'playing' : 'paused'
        // );

        return (
            <View style={styles.container}>
                <View style={styles.centerPoint}>
                    <View style={styles.content}>
                        {isLoaded &&
                            <Fragment>
                                {!isComplete &&
                                    <Fragment>
                                        {isPlaying && <TouchableOpacity style={styles.bigButton} onPress={pauseAudio}/>}
                                        {isPaused && <TouchableOpacity style={styles.bigButton} onPress={resumeAudio}/>}
                                    </Fragment>
                                }
                                {isComplete &&
                                    <TouchableOpacity style={styles.bigButton} onPress={this.playRandomSound}/>
                                }
                            </Fragment>
                        }
                    </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ACE',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerPoint: {
        position: 'relative',
        height: 0,
        width: 0,
    },
    content: {
      position: 'absolute',
    },
    bigButton: {
        backgroundColor: '#fff',
        borderRadius: 140/2,
        width: 140,
        height: 140,
        position: 'absolute',
        top: -140/2,
        left: -140/2,
    }
});

// animation notes
// heart rate rhythm
// or breathing rhythm, in... out...
// hypnotic but not disorienting
// sin waves, pulsing
// ripples like a pond
// idea: particles, not moving but pulsing in size
// idea: background cycles through a few pastel colors