/**
 * This component for video rendering UI element for Android and ios
 *
 * @module components/VideoPlayer
 * @memberof CommonComponent
 */

import React, { useEffect, useRef } from "react";
import shaka from 'shaka-player/dist/shaka-player.compiled';
import { VideoPlayerProps } from './VideoPlayer.types';

declare global {
  interface Window {
    shaka: any;
  }
}

/**
 * Component type definitions
 *
 * @typedef {object} VideoPlayerProps
 * @property {string} [text] - The content for the component
 */

/**
 * Represents a VideoPlayer component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered VideoPlayer component
 *
 * @example
 * <VideoPlayer text="Hello World!" />
 */



const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function VideoPlayer({
  widevine,
  fairplay,
  poster,
  autoPlay = false,
  controls = true,
  style
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Shaka not supported');
      return;
    }

    const player = new shaka.Player(videoRef.current);
    playerRef.current = player;

    const finalLicenseUrl =
      `${widevine?.licenseUrl}&ls_session=${widevine?.token}`;

    player.configure({
      streaming: {
        startAtSegmentBoundary: true,
        jumpLargeGaps: true,
        rebufferingGoal: 1,
        bufferingGoal: 3,
      },
      manifest: {
        dash: {
          clockSyncUri: '',
        }
      }
    });

    player.addEventListener('error', (event) => {
      console.error(
        'Shaka error:',
        event
      );
    });


    const networking = player.getNetworkingEngine();

    /* ---------- DRM CONFIG ---------- */

    const drm: Partial<shaka.extern.DrmConfiguration> = {
      servers: {},
      advanced: {}
    };

    /* Widevine */
    if (widevine) {
      drm.servers!['com.widevine.alpha'] = finalLicenseUrl;

      if (widevine.token) {

        networking?.registerRequestFilter((type, request) => {
          
          request.allowCrossSiteCredentials = true;

          if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
            request.headers['Content-Type'] = 'application/octet-stream';
          }

        });

      }
    }

    /* FairPlay */
    // if (fairplay) {
    //   drm.servers!['com.apple.fps.1_0'] = fairplay.licenseUrl;
    //   drm.advanced!['com.apple.fps.1_0'] = {
    //     serverCertificateUri: fairplay.certificateUrl
    //   };

    //   if (fairplay.token) {
    //     networking?.registerRequestFilter((type, request) => {
    //       if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
    //         request.headers['Authorization'] =
    //           `Bearer ${fairplay.token}`;
    //       }
    //     });
    //   }
    // }

    player.configure({ drm });

    /* ---------- LOAD SOURCE ---------- */
    async function load() {
      try {
        if (fairplay && isSafari()) {
          await player.load(fairplay.playUrl);
        } else if (widevine) {
          await player.load(widevine.playUrl);
          player.goToLive();

          /*  EXPLICIT PLAY (RN‑Web needs this)*/
          // if (autoPlay && videoRef.current) {
          //   try {
          //     await videoRef.current.play();
          //   } catch (e) {
          //     console.warn('Autoplay blocked', e);
          //   }
          // }


        } else {
          console.error('No playable source');
        }
      } catch (e) {
        console.error(e);

      }
    }

    load();

    return () => {
      player.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls={controls}
      autoPlay={autoPlay}
      muted
      //poster={poster}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        ...style
      }}
    />
  );
}


