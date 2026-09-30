/**
 * This screen will show all the notifications list
 *
 * @module components/Notifications
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import actions from 'store/sales/actions';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ICONS, STATE_KEY } from 'const';
import { Checkbox, Image, List, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { getCustomMoEngagePayload, getMoEngageImageUrl } from 'utils/mixPanelHelper';
import { ParentObject } from 'store/sales/types/common';
import { MOENGAGE, ROUTE, STRINGS } from 'const/strings';
import { getRelativeTime } from 'utils/dateHelper';
import MoEReactInbox, { MoEInboxMessage } from 'react-native-moengage-inbox';
import usePathNavigator from 'hooks/usePathNavigator';
import styles from './Notifications.styles';

/**
 * Represents a Notifications component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const goToPath = usePathNavigator();

  const { listData } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { read, unRead } = useSelector((state: RootState) => state.notifications);

  const handleAllNotification = async () => {
    dispatch(actions.setAllNotifications());
  };

  usePlatformFocusEffect(() => {
    handleAllNotification();

    return () => {
      dispatch(actions.resetNotification());
    };
  }, []);

  const handleNotificationPress = async (message: MoEInboxMessage) => {
    MoEReactInbox.trackMessageClicked(message);
    const messageAction = message.action?.[0];
    if (messageAction && messageAction.actionType === 'navigation') {
      const route = messageAction.value.replace(MOENGAGE.DEEPLINK_URL, '').split('?')[0];
      goToPath(route);
    } else {
      goToPath(ROUTE.MOBILE.DASHBOARD);
    }
  };

  const renderItem = ({ item }: ParentObject) => {
    const keyValuePair = getCustomMoEngagePayload(item?.action?.[0]?.kvPair);
    const imageUrl = getMoEngageImageUrl(item) || MOENGAGE.SOUND_NAME;
    return (
      <TouchableOpacity
        style={[styles.notificationContainer, !item.isClicked && styles.unReadContainer]}
        testID="navigationTileTestId"
        onPress={() => handleNotificationPress(item as MoEInboxMessage)}
      >
        <Image
          style={styles.notificationImageStyle}
          isUrl={!!imageUrl.startsWith(STRINGS.HTTP)}
          iconName={imageUrl.startsWith(STRINGS.HTTP) ? imageUrl : ICONS.DEFAULT}
          isDimension={false}
        />
        <View style={styles.notificationMiddleContainer}>
          <View style={styles.timeStyle}>
            {item.receivedTime && <Text label={getRelativeTime(item.receivedTime)} style={styles.textStyle} />}
            {item.isClicked === false && <View style={styles.prupleDot} />}
          </View>
          <View style={styles.checkboxStyle}>
            <View style={[styles.notificationMiddleContainer]}>
              {item.text?.title && <Text label={item.text?.title} style={styles.notificationTextStyle} />}
              {item.text?.message && <Text label={item.text?.message} style={styles.notificationSubTextStyle} />}
              <View style={styles.dataContainer}>
                {keyValuePair &&
                  Object.entries(keyValuePair).map(([key, value]) => (
                    <View style={styles.keyValueContainer} key={key}>
                      <Text label={key} style={styles.keyText} />
                      <Text label={value} style={styles.valueText} />
                    </View>
                  ))}
              </View>
            </View>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} testID="notification-test">
      <View style={styles.filterContainer}>
        <Text label={t('strings.filterNotifications')} style={styles.filterText} />
        <Checkbox label={t('strings.read')} labelStyle={styles.filterText} value={read} onValueChange={(value) => dispatch(actions.setRead(value))} />
        <Checkbox label={t('strings.unRead')} labelStyle={styles.filterText} value={unRead} onValueChange={(value) => dispatch(actions.setUnRead(value))} />
      </View>
      {listData.length !== 0 ? (
        <List
          data={listData}
          renderItem={renderItem}
          contentContainerStyle={styles.containerStyle}
          showsVerticalScrollIndicator={false}
          style={styles.listContainer}
          scrollEnabled
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text label={t('strings.noNotification')} />
        </View>
      )}
    </View>
  );
};

export default memo(Notifications);
