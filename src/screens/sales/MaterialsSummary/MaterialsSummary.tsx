/**
 *  Materials summary screen for purchase order
 *
 * @module components/MaterialsSummary
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, List } from 'components/sales';
import { Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { ParentObject } from 'store/sales/types/common';
import { QUERY } from 'const';
import useParams from 'hooks/useParams';
import styles from './MaterialsSummary.styles';

/**
 * Represents a MaterialsSummary component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const MaterialsSummary = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedMaterial } = useParams();

  const submitRequest = () => {
    dispatch(callAction({ selectedMaterial }, QUERY.DoRaiseReqRCVTSKPOSMWeb));
  };

  const renderListData = (item: ParentObject) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.productName}</Text>
      <View style={styles.addContainer}>
        <Text style={styles.addText}>{item.totalCount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.flex} testID="materials-summary">
      <ScrollView nestedScrollEnabled style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>{t('strings.items')}</Text>
              <Text style={[styles.headerText, { marginRight: Sizing.layout.x35 }]}>{t('strings.quantity')}</Text>
            </View>
            <List
              testID="tsraSubscriberListTest"
              key={0}
              data={selectedMaterial}
              numColumns={1}
              renderItem={({ item }) => renderListData(item)}
              style={styles.listContainerStyle}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="primary"
          fontSize={Sizing.layout.x16}
          label={t('strings.submitRequest')}
          isDimension={false}
          onPress={() => submitRequest()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(MaterialsSummary);
