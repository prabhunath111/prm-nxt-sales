/**
 * this is a card for select subscriber details in the recharge winback
 *
 * @module components/SelectSubscriber
 * @memberof CommonComponent
 */

import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import Image from 'components/sales/Image';
import { Sizing } from 'styles';
import { ICONS, ROUTE } from 'const';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { ParentObject } from 'store/sales/types/common';
import List from 'components/sales/List';
import { gcs } from 'styles/webBreakpoints';
import useNavigate from 'hooks/useNavigate';
import { callAction } from 'utils/formBuilderHelper';
import actions from 'store/sales/actions/rechargeWinback';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import styles from './SelectSubscriber.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SelectSubscriberProps
 * @property {string} [heading] - The heading for the component
 * @property {string} [subId] - The id of the component
 * @property {string} [status] - The status of the component
 */

interface Subscriber {
  campName: string;
  subscriberId: string;
  status: string;
}

export type SelectSubscriberProps = {
  queryName: string;
};

/**
 * Represents a SelectSubscriber component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered SelectSubscriber component
 *
 * @example
 * <SelectSubscriber heading="Hello World!" />
 */

const SelectSubscriber = ({ queryName }: SelectSubscriberProps) => {
  const { inflection } = useInflection();
  const { navigate } = useNavigate();
  const { t } = useTranslation();
  const { filteredSubscriberList } = useSelector((state: RootState) => state.rechargeWinback);
  const dispatch = useDispatch<AppDispatch>();
  const data: Subscriber[] = filteredSubscriberList || [];

  const handleButtonPress = (item: ParentObject) => {
    dispatch(callAction({ subscriberId: item?.subscriberId, offerCode: item?.offerCode }, queryName));
    dispatch(actions.setSubscriberDetails(item));
    navigate(ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS);
  };
  const numberOfColumns = useMemo(() => {
    switch (inflection) {
      case BreakPoints.LG:
        return Sizing.layout.x2;

      case BreakPoints.XL:
        return Sizing.layout.x3;

      default:
        return Sizing.layout.x1;
    }
  }, [inflection]);

  const renderSubscriberList = (item: ParentObject) => (
    <Pressable key={item.subscriberId} style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]} onPress={() => handleButtonPress(item)}>
      <View style={styles.subContainer}>
        <Text numberOfLines={1} style={styles.heading}>
          {item.subscriberId}
        </Text>
        <View style={styles.seprator} />
        <View style={styles.subIdContainer}>
          <Text style={styles.status}>{item.responseStatus}</Text>
        </View>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
    </Pressable>
  );
  return (
    <View style={styles.itemViewStyle}>
      {filteredSubscriberList.length !== Sizing.layout.x0 ? (
        <List
          testID="selectSubscriberTest"
          key={numberOfColumns}
          data={data}
          numColumns={numberOfColumns}
          columnWrapperStyle={numberOfColumns > Sizing.layout.x1 ? styles.columnWrapper : undefined}
          renderItem={({ item }) => renderSubscriberList(item)}
        />
      ) : (
        <Text style={styles.errorText}>{t('errors.noDataFound')}</Text>
      )}
    </View>
  );
};

export default SelectSubscriber;
