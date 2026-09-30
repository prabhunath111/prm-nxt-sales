/**
 * RadioButton component for slab-list of xtra milage
 *
 * @module components/SlabList
 * @memberof CommonComponent
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Radio from 'components/sales/Radio';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import { ParentObject } from 'store/sales/types/common';
import { STATE_KEY, STRINGS, STYLES } from 'const';
import { Colors, Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import List from 'components/sales/List';
import Image from 'components/sales/Image';
import { ICONS } from 'const/icons';
import styles from './SlabList.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SlabListProps
 * @property {function} onSelect - Callback function invoked when a radio slab is selected.
 * @property {string} selectedId - The currently selected slab.
 */

export type SlabListProps = {
  onSelect: (value: string | null) => void;
  selectedId: string;
  stateKey?: string;
  type?: string;
};

/**
 * Represents a SlabList component
 *
 * @param {SlabListProps} props - React properties passed from composition
 * @param {function} props.onSelect - Callback function invoked when a radio item is selected.
 * @param {string} props.selectedId - The currently selected slab.
 * @returns {JSX.Element | null} The rendered slabs component or null if no slab is available
 *
 * @example
 * <SlabList onSelect={handleSelect} selectedId="slab" />
 */

const SlabList = ({ onSelect, selectedId, type = STYLES.TYPE.PRIMARY, stateKey = STATE_KEY.FORM_STATE }: SlabListProps) => {
  const { slabList } = useSelector((state: RootState) => state.form[stateKey]);
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const appliedStyles = styles[type];

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  const renderSlabList = ({ item, index }: ParentObject) => {
    const isSelected = selectedId === item?.label;

    switch (type) {
      case STYLES.TYPE.PRIMARY:
        return (
          <Pressable style={[appliedStyles.radioContainer, isSelected && { borderColor: Colors.primary.brand }]} onPress={() => handleSelect(item?.label)}>
            <View style={appliedStyles.radioCircle}>{isSelected ? <View style={appliedStyles.selectedRadioButton} /> : null}</View>
            <View style={appliedStyles.radioWrapper}>
              <View>
                <Text style={appliedStyles.id}>{item?.label}</Text>
                <View style={appliedStyles.row}>
                  <Image iconName={ICONS.CUSTOMER_RECHARGE_HOME} height={Sizing.layout.x15} width={Sizing.layout.x15} isDimension={false} style={appliedStyles.icon} />
                  <Text style={appliedStyles.name}>{item?.offer}</Text>
                </View>

                <View style={appliedStyles.row}>
                  <Text style={appliedStyles.nameValue}>{t('alertMessages.partnerMarginText')}</Text>
                  <Text style={appliedStyles.nameValue}>{item?.parterMargin}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        );
      case STYLES.TYPE.SECONDARY:
        return (
          <View key={item?.label}>
            <Radio text={item.label} showStatus={false} isActive={item?.statusNT === STRINGS.ACTIVE} isSelected={isSelected} onPress={() => handleSelect(item?.label)} />
            {index < slabList.length - Sizing.layout.x1 && <View style={appliedStyles.separator} />}
          </View>
        );

      default:
        return <View />;
    }
  };
  return slabList?.length > 0 ? (
    <View style={appliedStyles.container} testID="slabList-test-container">
      <List
        data={slabList}
        containerStyle={
          type === STYLES.TYPE.PRIMARY ? appliedStyles.listContainer : [appliedStyles.subContainer, appliedStyles[gcs('subContainer', inflection, true, ['sm', 'xs'])]]
        }
        renderItem={renderSlabList}
        keyExtractor={(item) => item.subscriberId}
        showsVerticalScrollIndicator
      />
      <View style={appliedStyles.row}>
        <Text style={appliedStyles.nameValue}>{t('alertMessages.offerBonusNote')}</Text>
      </View>
    </View>
  ) : (
    <View testID="slabList-test-container" />
  );
};

export default SlabList;
