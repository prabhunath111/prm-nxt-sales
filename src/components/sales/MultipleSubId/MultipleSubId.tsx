import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Radio from 'components/sales/Radio';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import { ParentObject } from 'store/sales/types/common';
import { STATE_KEY, STRINGS, STYLES, SUBSCRIBER_STATUS } from 'const';
import { Colors, Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import List from 'components/sales/List';
import styles from './MultipleSubId.styles';

/**
 * Component type definitions
 *
 * @typedef {object} MultipleSubIdProps
 * @property {function} onSelect - Callback function invoked when a radio item/subID is selected.
 * @property {string} selectedId - The currently selected subId.
 */

export type MultipleSubIdProps = {
  onSelect: (value: string | null) => void;
  selectedId: string;
  stateKey?: string;
  type?: string;
  headerText?: string;
  setDefaultNull?: boolean;
};

/**
 * Represents a MultipleSubId component
 *
 * @param {MultipleSubIdProps} props - React properties passed from composition
 * @param {function} props.onSelect - Callback function invoked when a radio item/subID is selected.
 * @param {string} props.selectedId - The currently selected subId.
 * @returns {JSX.Element | null} The rendered MultipleSubId component or null if no subIdList is available
 *
 * @example
 * <MultipleSubId onSelect={handleSelect} selectedId="subId1" />
 */

const MultipleSubId = ({ onSelect, selectedId, type = STYLES.TYPE.PRIMARY, headerText, setDefaultNull = true, stateKey = STATE_KEY.FORM_STATE }: MultipleSubIdProps) => {
  const { subIdList } = useSelector((state: RootState) => state.form[stateKey]);
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const appliedStyles = styles[type];

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  useEffect(() => {
    if (!selectedId && subIdList?.length > 0) {
      onSelect(subIdList[0]?.subId);
    } else if (subIdList.length === 0 && setDefaultNull) {
      onSelect(null);
    }
  }, [subIdList]);

  const getStatus = (status: string) => {
    switch (status) {
      case SUBSCRIBER_STATUS.ACTIVE:
        return {
          statusText: t('subscriberStatus.Active'),
          statusColor: Colors.appColors.activeGreen,
          statusBackgroundColor: Colors.appColors.activeGreenBackground,
        };
      case SUBSCRIBER_STATUS.BLACKLISTED:
        return {
          statusText: t('subscriberStatus.Blacklisted'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
      case SUBSCRIBER_STATUS.CANCELLED:
        return {
          statusText: t('subscriberStatus.Cancelled'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
      case SUBSCRIBER_STATUS.CANCEL_PENDING:
        return {
          statusText: t('subscriberStatus.CancelPending'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
      case SUBSCRIBER_STATUS.DEACTIVATED:
        return {
          statusText: t('subscriberStatus.Deactivated'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
      case SUBSCRIBER_STATUS.PENDING:
        return {
          statusText: t('subscriberStatus.Pending'),
          statusColor: Colors.appColors.pendingYellow,
          statusBackgroundColor: Colors.appColors.pendingYellowBackground,
        };
      case SUBSCRIBER_STATUS.SUSPENDED:
        return {
          statusText: t('subscriberStatus.Suspended'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
      case SUBSCRIBER_STATUS.TEMP_SUSPENSION:
        return {
          statusText: t('subscriberStatus.TempSuspension'),
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };

      default:
        return {
          statusText: status,
          statusColor: Colors.neutral.g750,
          statusBackgroundColor: Colors.neutral.g350,
        };
    }
  };

  const renderSubIdList = ({ item, index }: ParentObject) => {
    const { statusText, statusColor, statusBackgroundColor } = getStatus(item?.statusNT);

    const isSelected = selectedId === item?.subId;

    switch (type) {
      case STYLES.TYPE.PRIMARY:
        return (
          <Pressable style={[appliedStyles.radioContainer, isSelected && { borderColor: Colors.primary.brand }]} onPress={() => handleSelect(item?.subId)}>
            <View style={appliedStyles.radioCircle}>{isSelected ? <View style={appliedStyles.selectedRadioButton} /> : null}</View>
            <View style={appliedStyles.radioWrapper}>
              <View>
                <Text style={appliedStyles.id}>{item?.subId}</Text>
                <Text style={appliedStyles.name}>{item?.aliasName}</Text>
              </View>
              <View style={[appliedStyles.statusWrapper, { backgroundColor: statusBackgroundColor }]}>
                <Text style={[appliedStyles.activeText, { color: statusColor }]}>{statusText}</Text>
              </View>
            </View>
          </Pressable>
        );
      case STYLES.TYPE.SECONDARY:
        return (
          <View key={item?.subId}>
            <Radio text={item.subId} label={statusText} isActive={item?.statusNT === STRINGS.ACTIVE} isSelected={isSelected} onPress={() => handleSelect(item?.subId)} />
            {index < subIdList.length - Sizing.layout.x1 && <View style={appliedStyles.separator} />}
          </View>
        );

      default:
        return <View />;
    }
  };
  const headingLabel = headerText ?? (subIdList?.length === 1 ? t('strings.singleSID') : t('strings.multipleSID'));
  return subIdList?.length > 0 ? (
    <View style={appliedStyles.container} testID="multipleId-test-container">
      <Text style={[appliedStyles.headingText, appliedStyles[gcs('headingText', inflection, true, ['md', 'lg', 'xl'])]]}>{headingLabel}</Text>
      <List
        data={subIdList}
        containerStyle={
          type === STYLES.TYPE.PRIMARY ? appliedStyles.listContainer : [appliedStyles.subContainer, appliedStyles[gcs('subContainer', inflection, true, ['sm', 'xs'])]]
        }
        renderItem={renderSubIdList}
        keyExtractor={(item) => item.subscriberId}
        showsVerticalScrollIndicator
      />
    </View>
  ) : (
    <View testID="multipleId-test-container" />
  );
};

export default MultipleSubId;
