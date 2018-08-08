import React, { Fragment } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import sample from 'lodash/sample';
import indexOf from 'lodash/indexOf';
import each from 'lodash/each';
import { LinearGradient } from 'expo';

const IMAGE = {
    PLAY: require('./assets/play.png'),
    PAUSE: require('./assets/pause.png'),
};

const COLOR = {
    PINK: '#DAB4B9',
    BEIGE: '#FFF6EB',
    BLUE: '#789FB8',
};

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
                <LinearGradient
                    colors={[ COLOR.PINK, COLOR.BLUE ]}
                    style={styles.gradient}
                />
                <View style={styles.content}>
                    {isLoaded &&
                        <Fragment>
                            {!isComplete &&
                                <Fragment>
                                    {isPlaying && <TouchableOpacity style={styles.bigButton} onPress={pauseAudio}>
                                        <Image resizeMode="stretch" style={styles.icon} source={IMAGE.PAUSE} />
                                    </TouchableOpacity>}
                                    {isPaused && <TouchableOpacity style={styles.bigButton} onPress={resumeAudio}>
                                        <Image resizeMode="stretch" style={styles.icon} source={IMAGE.PLAY} />
                                    </TouchableOpacity>}
                                </Fragment>
                            }
                            {isComplete &&
                                <TouchableOpacity style={styles.bigButton} onPress={this.playRandomSound}>
                                    <Image resizeMode="stretch" style={styles.icon} source={IMAGE.PLAY} />
                                </TouchableOpacity>
                            }
                        </Fragment>
                    }
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigButton: {
        borderWidth: 2,
        borderColor: '#fff',
        borderStyle: 'solid',
        borderRadius: 96/2,
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 48,
        height: 48,
    }
});