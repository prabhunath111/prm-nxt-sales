/**
 * This component for video rendering UI element for Android and ios
 *
 * @module components/VideoPlayer
 * @memberof CommonComponent
 */

import styles from "./VideoPlayer.styles";

import React from 'react';
import { Platform } from 'react-native';
import Video, { DRMType } from 'react-native-video';
import { VideoPlayerProps } from './VideoPlayer.types';

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
 

export default function VideoPlayer({
  widevine,
  fairplay,
  autoPlay = false,
  controls = true,
  style,
}: VideoPlayerProps) {
  const isIOS = Platform.OS === 'ios';
  const source = isIOS && fairplay ? fairplay : widevine;

  if (!source) return null;

  // const headers = source.token
  //   ? { Authorization: `Bearer ${source.token}` }
  //   : undefined;

  const finalLicenseUrl =
        `${source?.licenseUrl}&ls_session=${source?.token}`;

  return (
    <Video
      source={{
        uri: source.playUrl,
        drm: isIOS
          ? {
              type: DRMType.FAIRPLAY,
              licenseServer: finalLicenseUrl,
              certificateUrl: source.certificateUrl,
              // headers,
            }
          : {
              type: DRMType.WIDEVINE,
              licenseServer: finalLicenseUrl,
              // headers,
            },
      }}
      controls={controls}
      paused={!autoPlay}
      resizeMode="contain"
      style={[
        { width: '100%', height: '100%', backgroundColor: 'black' },
        style,
      ]}
    />
  );
}