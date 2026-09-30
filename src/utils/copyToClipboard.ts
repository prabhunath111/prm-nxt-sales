/* eslint-disable import/no-mutable-exports, global-require, @typescript-eslint/no-var-requires */
import { LOG } from 'config/logger';
import { Platform } from 'react-native';

let copyToClipboard: (text: string) => void;

if (Platform.OS === 'web') {
  copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        LOG.error('Failed to copy: ', err);
      });
    } else {
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // prevent scrolling
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        LOG.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };
} else {
  // React Native mobile
  const Clipboard = require('@react-native-clipboard/clipboard').default;
  copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };
}

export default copyToClipboard;
