/**
 * Webcam Capture is a very simple webcam snapshot software that enables you to monitor your cam from a streamlined, minimalistic user interface
 *
 * @module components/Camera
 * @memberof - Common Component
 */
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Sizing } from 'styles';
import { View } from 'react-native';
import Button from 'components/sales/Button';
import styles from './Camera.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type CameraProps = {
  isScanner?: boolean;
  audio?: boolean;
  onScan?: (value: string | null) => void;
};

/**
 * Represents a Camera component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Camera
 */
const Camera = ({ isScanner = false, audio = false, onScan }: CameraProps) => {
  const webcamRef = useRef(null);
  const [isMediaStreamLoaded, setIsMediaStreamLoaded] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      onScan?.(detectedCodes[0].rawValue || null);
    }
  };

  const handleCapture = () => {
    try {
      const webcamCurrentRef = webcamRef.current as any;
      const imageUrl = webcamCurrentRef?.getScreenshot();
      onScan?.(imageUrl);
    } catch (error) {
      // Error is caught and doesn't crash the app
    }
  };

  const getMediaStream = () => {
    setIsMediaStreamLoaded(true);
  };

  return (
    <View>
      {isScanner ? (
        <Scanner styles={styles} onScan={handleScan} />
      ) : (
        <View>
          <Webcam ref={webcamRef} videoConstraints={styles.cameraStyle} audio={audio} onUserMedia={getMediaStream} />
          {isMediaStreamLoaded ? (
            <View style={styles.buttonWrapper}>
              <Button style={styles.circleButton} borderRadius={Sizing.layout.x50} onPress={handleCapture} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};
export default Camera;
