/**
 * Webcam Capture is a very simple webcam snapshot software that enables you to monitor your cam from a streamlined, minimalistic user interface
 *
 * @module components/Camera
 * @memberof - Common Component
 */
import React, { useRef } from 'react';
import { View } from 'react-native';
import { Camera as RNCamera, useCameraPermission, useCodeScanner, useCameraDevice } from 'react-native-vision-camera';
import { SCANNER_FORMATS } from 'const';
import { Sizing } from 'styles';
import { toBase64 } from 'utils/imageHelper';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import Button from 'components/sales/Button';
import styles from './Camera.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type CameraProps = {
  isActive?: boolean;
  isScanner?: boolean;
  isFocusable?: boolean;
  audio?: boolean;
  onScan?: (value: string | undefined) => void;
};

const codeTypes: any[] = SCANNER_FORMATS;

/**
 * Represents a Camera component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Camera
 */
const Camera = ({ isActive = false, isScanner = false, isFocusable = false, audio = false, onScan }: CameraProps) => {
  const { t } = useTranslation();
  const webcamRef = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  // Check for permissions and request if not granted
  if (!hasPermission) {
    if (typeof requestPermission === 'function') {
      requestPermission();
    }
  }

  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: (codes) => {
      onScan?.(codes[1]?.value);
    },
  });

  const handleCapture = async () => {
    try {
      const webcamCurrentRef = webcamRef.current as any;
      const image = await webcamCurrentRef?.takePhoto({
        qualityPrioritization: 'quality',
      });
      const base64String = await toBase64(image.path);
      onScan?.(base64String);
    } catch (error) {
      // Error is caught and doesn't crash the app
    }
  };

  return !hasPermission || !device ? (
    <View style={styles.errorStyle}>
      <Text>{!hasPermission ? t('errors.noCameraPermission') : t('errors.noDeviceFound')}</Text>
    </View>
  ) : (
    <>
      <RNCamera style={styles.cameraStyle} device={device} codeScanner={codeScanner} isActive={isActive} focusable={isFocusable} audio={audio} photo={!isScanner} ref={webcamRef} />
      <View style={styles.buttonWrapper}>
        <Button style={styles.circleButton} borderRadius={Sizing.layout.x50} onPress={handleCapture} />
      </View>
    </>
  );
};

export default Camera;
