import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Global } from 'styles';
import { Text, Modal, ModalPlacement, Button } from 'components/sales';
import { useTranslation } from 'react-i18next';

const NetworkStatus = () => {
  const { t } = useTranslation();
  const [_isConnected, setIsConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const connected = !!state.isConnected;
      setIsConnected(connected);
      setShowModal(!connected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} placementType={ModalPlacement.CENTER}>
        <View style={Global.styles.container}>
          <Text label={t('errors.errorText')} />
          <Button label={t('errors.buttonText')} onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default NetworkStatus;
