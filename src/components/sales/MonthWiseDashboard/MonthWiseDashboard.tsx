/**
 * This is monthwise bar chart  tab for the Dashboard
 *
 * @module components/MonthWiseDashboard
 * @memberof CommonComponent
 */

import React, { memo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, ChartWrapper, Dropdown, Image, RadioContainer, TableWrapper, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { CHILD_TYPE, ICONS, PROPERTIES, STRINGS } from 'const';
import BottomModal from 'components/sales/BottomModal';
import { Colors, Sizing } from 'styles';
import { RadioItem } from 'components/sales/RadioContainer';
import { TYPE } from 'const/styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './MonthWiseDashboard.styles';

/**
 * Represents a MonthWiseDashboard component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered MonthWiseDashboard component
 *
 * @example
 * <MonthWiseDashboard text="Hello World!" />
 */

export const InfoContainer = () => {
  const { t } = useTranslation();
  const { infoLastUpdatedDate } = useSelector((state: RootState) => state.dashboard);
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoDateText}>
        {t('strings.infoLastUpdatedOn')} {infoLastUpdatedDate}
      </Text>
      <View style={styles.selectDashboard}>
        <Text style={styles.primaryText}>{t('strings.selectDashboardFor')}</Text>
        <Dropdown inputFieldStyle={styles.inputStyle} innerContainerStyle={styles.inputContainerStyle} />
      </View>
    </View>
  );
};

const MonthWiseDashboard = () => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { monthWiseTableColumns }: any = PROPERTIES.DASHBOARD;
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { monthWiseFilterData, monthWiseTableData } = useSelector((state: RootState) => state.dashboard);

  const openModalHandler = () => {
    setModalVisible(true);
  };

  const closeModalHandler = () => {
    setModalVisible(false);
  };
  const filterHandler = () => {};

  const clearFilterHandler = () => {
    setSelectedFilter('');
  };

  const modalContent = (
    <>
      <View style={styles.scrollContainer}>
        <ScrollView>
          <RadioContainer
            items={monthWiseFilterData as RadioItem[]}
            onSelectionChange={(text) => setSelectedFilter(text)}
            selectedValue={selectedFilter}
            radioItemContainer={styles.radioItem}
            allowDeselect
          />
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.cancelButton}
          onPress={clearFilterHandler}
          label={t('strings.clear')}
          type={TYPE.SECONDARY}
          fontColor={Colors.neutral.black}
          fontSize={Sizing.layout.x16}
        />
        <Button onPress={filterHandler} label={t('strings.showResults')} fontSize={Sizing.layout.x16} />
      </View>
    </>
  );

  const modalProps = {
    type: CHILD_TYPE.DASHBOARD_MODAL,
    isModalVisible,
    showCloseIcon: true,
    showHeader: true,
    onClose: closeModalHandler,
    headerTitle: t(`strings.${STRINGS.FILTER_BY_PARAMETER}`),
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.dashboardContainer}>
          <InfoContainer />
          <View style={styles.lineSeprator} />
          <View style={styles.chartContainer}>
            <ChartWrapper />
          </View>
          <View style={styles.lineSeprator} />
          <View style={styles.filterContainer}>
            <Text style={styles.primaryText}>{t('strings.filterBy')}</Text>
            <Pressable testID="dashboard-filter-pressable" style={styles.filterStyle} onPress={() => openModalHandler()}>
              <Text style={styles.filterDropDown}>{t(`strings.${STRINGS.PARAMETER}`)}</Text>
              <Image iconName={ICONS.PINK_CHEVRON_DOWN} height={Sizing.layout.x1} width={Sizing.layout.x1} />
            </Pressable>
          </View>
          <View style={styles.tableWrapper}>
            <TableWrapper tableData={monthWiseTableData} tableColumns={monthWiseTableColumns} isDashboardTable />
          </View>
        </View>
      </View>
      <BottomModal modalProps={modalProps}>{modalContent}</BottomModal>
    </ScrollView>
  );
};

export default memo(MonthWiseDashboard);
