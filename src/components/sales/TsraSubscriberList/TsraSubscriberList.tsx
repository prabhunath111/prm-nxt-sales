/**
 * it will show  tsra subscriber list and other related data
 *
 * @module components/TsraSubscriberList
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ParentObject } from 'store/sales/types/common';
import List from 'components/sales/List';
import Image from 'components/sales/Image';
import { ICONS, PROPERTIES, QUERY, ROUTE } from 'const';
import TextContainer from 'components/sales/TextContainer';
import useNavigate from 'hooks/useNavigate';
import { callAction } from 'utils/formBuilderHelper';
import styles from './TsraSubscriberList.styles';

/**
 * Represents a TsraSubscriberList component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered TsraSubscriberList component
 *
 * @example
 * <TsraSubscriberList text="Hello World!" />
 */

const TsraSubscriberList = () => {
  const { tsraSubscriberList } = useSelector((state: RootState) => state.tsraLifeCycle);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();

  const handleOnPress = (item: ParentObject) => {
    dispatch(callAction({ partnerCode: item?.partnerCode }, QUERY.GetTsraPartnerDetails));
    navigate(ROUTE.WEB.UPDATE_TSRA_ACTION);
  };

  const renderListData = (item: ParentObject) => (
    <Pressable style={styles.cardContainer} onPress={() => handleOnPress(item)} testID="action-tile-card">
      <View style={styles.container}>
        <TextContainer
          textContainerStyle={styles.textContainerStyle}
          itemContainerStyle={styles.itemContainerStyle}
          primaryStyle={styles.primaryTextStyle}
          secondaryStyle={styles.secondaryTextStyle}
          dataArray={PROPERTIES.TSRA_LIFECYCLE.subscriberDetails}
          data={item}
        />
      </View>
      <View style={styles.iconContainer}>
        <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} />
      </View>
    </Pressable>
  );

  const numberOfColumns = 1;

  return <List testID="tsraSubscriberListTest" key={numberOfColumns} data={tsraSubscriberList} numColumns={numberOfColumns} renderItem={({ item }) => renderListData(item)} />;
};

export default TsraSubscriberList;
