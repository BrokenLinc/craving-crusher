import each from "lodash/each";

const SOUNDS = [
    { file: require('../assets/private/andrea.mp3') },
    { file: require('../assets/private/danny.mp3') },
    { file: require('../assets/private/logan.mp3') },
    { file: require('../assets/private/magbic.mp3') },
];

each(SOUNDS, async (sound) => {
    sound.object = new Expo.Audio.Sound();
    await sound.object.loadAsync(sound.file);
    await sound.object.setProgressUpdateIntervalAsync(30);
});

export default SOUNDS;