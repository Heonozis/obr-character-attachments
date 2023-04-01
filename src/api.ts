import axios from 'axios';

export const BASE_URL = 'http://127.0.0.1:3333/v1/'


const url = {
    playlist: 'playlist',
    playback: 'playlist/playback',
    repeat: 'playlist/playback/repeat',
    shuffle: 'playlist/playback/shuffle',
    mute: 'playlist/playback/mute',
    play: 'playlist/playback/play',
    start: 'playlist/play',
    pause: 'playlist/playback/pause',
}

export const get = async (path: string) => {
    try {
        const response = await fetch(`${BASE_URL}${path}`);
        return await response.json();
    } catch (err) {
        console.log(err);
    }
    return null;
}

export const put = async (path: string, body: any) => {
    try {
        return await fetch(`${BASE_URL}${path}`, {
            method: 'put',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.log(err);
    }
    return null;
}

export const playlists = async () => {
    return await get(url.playlist)
}

export const playback = async () => {
    return await get(url.playback)
}

export const start = async (id: string) => {
    return await put(url.start, { id })
}

export const pause = async () => {
    return await put(url.pause, {})
}

export const play = async () => {
    return await put(url.play, {})
}

export const mute = async (mute: boolean) => {
    return await put(url.mute, { mute })
}

export const shuffle = async (shuffle: boolean) => {
    return await put(url.mute, { shuffle })
}

export const repeat = async (repeat: "track" | "playlist" | "off") => {
    return await put(url.repeat, { repeat })
}

export default {
    playlists,
    playback,
    start,
    play,
    pause,
    mute,
    shuffle,
    repeat
}


