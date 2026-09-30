declare module 'react-native-web';
interface WebkitMessageHandlers {
  cordova_iab: {
    postMessage: (exit: string) => void;
  };
}

interface Window {
  webkit?: {
    messageHandlers: WebkitMessageHandlers;
  };
  MSStream?: any;
}
