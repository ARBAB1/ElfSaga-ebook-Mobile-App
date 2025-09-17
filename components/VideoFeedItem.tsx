// import { Image } from 'expo-image';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import { useEffect, useState } from 'react';
// import { Pressable, StyleSheet, View } from 'react-native';
// import { SCREEN_WIDTH, VIDEO_HEIGHT } from '../constants/Colors';

// interface VideoFeedItemProps {
//     videoUrl: string;
//     thumbnailUrl: string;
//     isVisible: boolean;
//     onShare: () => void;
// }

// export default function VideoFeedItem({
//     videoUrl,
//     thumbnailUrl,
//     isVisible,
//     onShare,
// }: VideoFeedItemProps) {
//     const player = useVideoPlayer(videoUrl);
//     const [showThumbnail, setShowThumbnail] = useState(true);

//     useEffect(() => {
//         if (isVisible) {
//             setTimeout(() => setShowThumbnail(false), 300); // 👈 test delay
//             player.play();
//         } else {
//             setShowThumbnail(true);
//             player.pause();
//         }
//     }, [isVisible]);


//     console.log(thumbnailUrl)
//     return (
//         <View style={styles.container}>
//             {showThumbnail && (
//                 <Image source={{ uri: `${thumbnailUrl}` }} style={styles.thumbnail} />
//             )}
//             <VideoView
//                 player={player}
//                 style={styles.video}
//                 nativeControls={true}
//             />
//             <Pressable style={styles.overlay} pointerEvents="none" />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         height: VIDEO_HEIGHT,
//         width: '100%',
//         backgroundColor: 'black',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     video: {
//         height: VIDEO_HEIGHT,
//         width: SCREEN_WIDTH,
//         position: 'absolute',
//         top: 0,
//         left: 0,
//     },
//     thumbnail: {
//         height: VIDEO_HEIGHT,
//         width: SCREEN_WIDTH,
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         zIndex: 1,
//     },
//     overlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'black',
//         opacity: 0.2,
//     },
// });







// import { useEvent } from 'expo';
// import { Image } from 'expo-image';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Animated, Platform, StyleSheet, View } from 'react-native';
// import { SCREEN_WIDTH, VIDEO_HEIGHT } from '../constants/Colors';

// type Props = { videoUrl: string; thumbnailUrl: string; isVisible: boolean; };

// export default function VideoFeedItem({ videoUrl, thumbnailUrl, isVisible }: Props) {
//     const player = useVideoPlayer(videoUrl, (p) => {
//         p.loop = false;
//         p.muted = Platform.OS === 'web';        // web-only: allow autoplay; native can be audible
//         p.timeUpdateEventInterval = 250;
//     });

//     const statusEvt = useEvent(player, 'statusChange', { status: player.status });
//     const playingEvt = useEvent(player, 'playingChange', { isPlaying: player.playing });
//     const timeEvt = useEvent(player, 'timeUpdate', {
//         currentTime: 0,
//         currentLiveTimestamp: 0,
//         currentOffsetFromLive: 0,
//         bufferedPosition: 0,
//     });
//     //   const currentTime = timeEvt?.currentTime ?? 0;

//     const status = statusEvt?.status;
//     const isPlaying = playingEvt?.isPlaying ?? false;
//     const currentTime = timeEvt?.currentTime ?? 0;

//     // --- safety against calling into a disposed native object
//     const mountedRef = useRef(true);
//     useEffect(() => () => { mountedRef.current = false; }, []);
//     const currentPlayerRef = useRef(player);
//     useEffect(() => { currentPlayerRef.current = player; }, [player]);
//     const canControl = () =>
//         mountedRef.current && currentPlayerRef.current === player && status === 'readyToPlay';

//     const safePlay = () => { if (canControl()) { try { player.play(); } catch { } } };
//     const safePause = () => { if (canControl() && player.playing) { try { player.pause(); } catch { } } };

//     // --- poster fade
//     const [showPoster, setShowPoster] = useState(true);
//     const posterOpacity = useRef(new Animated.Value(1)).current;
//     useEffect(() => {
//         if (status === 'readyToPlay' && isVisible) {
//             Animated.timing(posterOpacity, { toValue: 0, duration: 160, useNativeDriver: true })
//                 .start(() => setShowPoster(false));
//         } else {
//             setShowPoster(true);
//             posterOpacity.setValue(1);
//         }
//     }, [status, isVisible]);

//     // --- autoplay policy flags
//     const startedRef = useRef(false);        // became visible and auto-started once
//     const pausedByVisRef = useRef(false);    // we paused it because it scrolled off-screen
//     const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//     // track user pause/play so we don’t fight them
//     const lastPlayingRef = useRef<boolean>(false);
//     useEffect(() => {
//         // If it transitioned to not playing while visible and it wasn't us pausing, treat as user intent
//         if (isVisible && lastPlayingRef.current && !isPlaying) {
//             pausedByVisRef.current = false; // don't auto-resume just for visibility
//         }
//         lastPlayingRef.current = isPlaying;
//     }, [isPlaying, isVisible]);

//     const tryAutoplay = useCallback(() => {
//         if (status !== 'readyToPlay') return;

//         if (isVisible) {
//             // only start if first time visible OR we paused due to visibility
//             if (!startedRef.current || pausedByVisRef.current) {
//                 const dur = player.duration ?? 0;
//                 if (dur > 0 && currentTime >= dur - 0.05) {
//                     try { if (canControl()) player.currentTime = 0; } catch { }
//                 }
//                 safePlay();
//                 startedRef.current = true;
//                 pausedByVisRef.current = false;

//                 // one retry if it didn’t start immediately
//                 if (!player.playing) {
//                     if (retryTimer.current) clearTimeout(retryTimer.current);
//                     retryTimer.current = setTimeout(() => {
//                         if (isVisible && (!isPlaying)) safePlay();
//                     }, 200);
//                 }
//             }
//         } else {
//             // pause when off-screen and remember it was our decision
//             if (isPlaying) {
//                 pausedByVisRef.current = true;
//                 safePause();
//             }
//         }
//     }, [status, isVisible, currentTime, isPlaying, player]);

//     useEffect(() => {
//         tryAutoplay();
//         return () => { if (retryTimer.current) clearTimeout(retryTimer.current); };
//     }, [tryAutoplay, videoUrl, isVisible, status]);

//     return (
//         <View style={styles.container}>
//             {showPoster && (
//                 <Animated.View style={[styles.posterWrapper, { opacity: posterOpacity }]}>
//                     <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} contentFit="cover" />
//                 </Animated.View>
//             )}

//             <VideoView
//                 player={player}
//                 style={styles.video}
//                 contentFit="cover"
//                 nativeControls={true}              // ✅ native controls only
//                 allowsPictureInPicture
//                 allowsVideoFrameAnalysis={false}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { height: VIDEO_HEIGHT, width: '100%', backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
//     video: { position: 'absolute', top: 0, left: 0, height: VIDEO_HEIGHT, width: SCREEN_WIDTH },
//     posterWrapper: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
//     thumbnail: { height: VIDEO_HEIGHT, width: SCREEN_WIDTH },
// });







import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH, VIDEO_HEIGHT } from '../constants/Colors';

type Props = { videoUrl: string; thumbnailUrl: string; isVisible: boolean };

export default function VideoFeedItem({ videoUrl, thumbnailUrl, isVisible }: Props) {
    const startedRef = useRef(false);       // first auto-start happened
    const pausedByVisRef = useRef(false);   // we paused due to invisibility
    const userPausedRef = useRef(false);    // user hit pause

    // detect user-intent pause/resume
    const lastPlayingRef = useRef<boolean>(false);

    const player = useVideoPlayer(videoUrl, (p) => {
        p.loop = true;
        p.muted = Platform.OS === 'web';
        p.timeUpdateEventInterval = 100;
    });

    const statusEvt = useEvent(player, 'statusChange', { status: player.status });
    const playingEvt = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const timeEvt = useEvent(player, 'timeUpdate', {
        currentTime: 0,
        currentLiveTimestamp: 0,
        currentOffsetFromLive: 0,
        bufferedPosition: 0,
    });

    const status = statusEvt?.status;
    const isPlaying = playingEvt?.isPlaying ?? false;
    const currentTime = timeEvt?.currentTime ?? 0;

    // --- poster fade (unchanged, but make sure it doesn't capture touches)
    const [showPoster, setShowPoster] = useState(true);
    const posterOpacity = useRef(new Animated.Value(1)).current;

    // NEW: safety guards so we never call into a disposed native object
    const mountedRef = useRef(true);
    useEffect(() => () => { mountedRef.current = false; }, []);
    const currentPlayerRef = useRef(player);
    useEffect(() => { currentPlayerRef.current = player; }, [player]);

    const canControl = () =>
        mountedRef.current && currentPlayerRef.current === player && status === 'readyToPlay';

    const safePlay = () => { if (canControl()) { try { player.play(); } catch { } } };
    const safePause = () => { if (canControl() && player.playing) { try { player.pause(); } catch { } } };

    // NEW: short cool-off after user hits Pause to avoid instant auto-resume
    const noAutoUntilRef = useRef(0);

    // Reset intent flags when the URL changes
    useEffect(() => {
        startedRef.current = false;
        pausedByVisRef.current = false;
        userPausedRef.current = false;
        endedRef.current = false;
    }, [videoUrl]);

    // Detect user-intent pause/resume (unchanged + cool-off on pause)
    useEffect(() => {
        if (isVisible) {
            // user paused while visible (not our visibility pause)
            if (lastPlayingRef.current && !isPlaying && !pausedByVisRef.current) {
                userPausedRef.current = true;
                noAutoUntilRef.current = Date.now() + 800; // 0.8s cool-off
            }
            // user pressed Play
            if (!lastPlayingRef.current && isPlaying) {
                userPausedRef.current = false;
            }
        }
        lastPlayingRef.current = isPlaying;
    }, [isPlaying, isVisible]);

    // Autoplay / visibility pause with cool-off & safety
    useEffect(() => {
        if (status !== 'readyToPlay') return;

        if (!isVisible) {
            if (isPlaying) {
                pausedByVisRef.current = true;
                userPausedRef.current = false;  // this pause was our decision
                safePause();
            }
            return;
        }

        // visible again
        if (endedRef.current) return;                              // don’t auto after end
        if (Date.now() < noAutoUntilRef.current) return;           // honor cool-off
        if (userPausedRef.current) return;                         // user wants it paused

        // start only first time or when we paused due to visibility
        if (!isPlaying && (!startedRef.current || pausedByVisRef.current)) {
            safePlay();
            startedRef.current = true;
            pausedByVisRef.current = false;
        }
    }, [isVisible, status, isPlaying, player]);

    useEffect(() => {
        if (status === 'readyToPlay' && isVisible) {
            Animated.timing(posterOpacity, { toValue: 0, duration: 160, useNativeDriver: true })
                .start(() => setShowPoster(false));
        } else {
            setShowPoster(true);
            posterOpacity.setValue(1);
        }
    }, [status, isVisible]);

    // --- controls refresh when ended
    const endedRef = useRef(false);
    const [controlsRefreshKey, setControlsRefreshKey] = useState(0);

    // Mark ended once when we actually hit the end
    useEffect(() => {
        const dur = player.duration ?? 0;
        if (status === 'readyToPlay' && dur > 0 && currentTime >= dur - 0.01) {
            if (!endedRef.current) {
                endedRef.current = true;

                // Pause and seek a hair back so iOS shows the scrubber at the end frame
                try { player.pause(); } catch { }
                try { player.currentTime = Math.max(dur - 0.001, 0); } catch { }

                // Force-refresh the native controls by remounting the view
                setControlsRefreshKey((k) => k + 1);
            }
        } else if (dur > 0 && currentTime < dur - 0.05) {
            endedRef.current = false;
        }
    }, [currentTime, status, player]);

    // When you return to this item and it was ended before, refresh once
    useEffect(() => {
        if (isVisible && endedRef.current) {
            setControlsRefreshKey((k) => k + 1);
        }
    }, [isVisible]);

    // Optional: simple auto-play/pause on visibility (keeps native-only controls)
    // useEffect(() => {
    //     if (status !== 'readyToPlay') return;
    //     if (isVisible && !isPlaying && !endedRef.current) {
    //         try { player.play(); } catch { }
    //     } else if (!isVisible && isPlaying) {
    //         try { player.pause(); } catch { }
    //     }
    // }, [isVisible, status, isPlaying, player]);

    // add these refs near the top

    useEffect(() => {
        if (isVisible) {
            // transitioned playing -> not playing while visible and not our visibility pause
            if (lastPlayingRef.current && !isPlaying && !pausedByVisRef.current) {
                userPausedRef.current = true;     // respect user pause
            }
            // transitioned not playing -> playing (user hit play)
            if (!lastPlayingRef.current && isPlaying) {
                userPausedRef.current = false;    // clear user-pause once they resume
            }
        }
        lastPlayingRef.current = isPlaying;
    }, [isPlaying, isVisible]);

    // replace your autoplay/pause effect with this:
    useEffect(() => {
        if (status !== 'readyToPlay') return;

        if (!isVisible) {
            // we choose to pause when off-screen
            if (isPlaying) {
                pausedByVisRef.current = true;
                try { player.pause(); } catch { }
            }
            return;
        }

        // visible:
        // never auto-resume if the video ended (you remount to show controls)
        if (endedRef.current) return;

        // never auto-resume if the user paused
        if (userPausedRef.current) return;

        // only autostart if first time OR we paused due to visibility
        if (!isPlaying && (!startedRef.current || pausedByVisRef.current)) {
            try { player.play(); } catch { }
            startedRef.current = true;
            pausedByVisRef.current = false;
        }
    }, [isVisible, status, isPlaying, player]);


    return (
        <View style={styles.container}>
            {showPoster && (
                <Animated.View pointerEvents="none" style={[styles.posterWrapper, { opacity: posterOpacity }]}>
                    <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} contentFit="cover" />
                </Animated.View>
            )}

            <VideoView
                key={`${videoUrl}-${controlsRefreshKey}`}   // <— remount ONLY when ended/returned
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={true}                       // native controls only
                allowsPictureInPicture
                allowsVideoFrameAnalysis={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: VIDEO_HEIGHT,
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: VIDEO_HEIGHT,
        width: SCREEN_WIDTH,
    },
    posterWrapper: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
    thumbnail: { height: VIDEO_HEIGHT, width: SCREEN_WIDTH },
});
