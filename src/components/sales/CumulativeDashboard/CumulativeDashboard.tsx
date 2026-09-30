/**
 * This is cumulative char tab for dahboard
 *
 * @module components/CumulativeDashboard
 * @memberof CommonComponent
 */

import React, { memo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, ChartWrapper, Image, MultiFilters, Search, TableWrapper, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { CHILD_TYPE, ICONS, STRINGS, STYLES } from 'const';
import BottomModal from 'components/sales/BottomModal';
import { Colors, Sizing } from 'styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { ParentObject } from 'store/sales/query/common';
import { InfoContainer } from 'components/sales/MonthWiseDashboard/MonthWiseDashboard';
import styles from './CumulativeDashboard.styles';

/**
 * Represents a CumulativeDashboard component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered CumulativeDashboard component
 *
 * @example
 * <CumulativeDashboard text="Hello World!" />
 */

const CumulativeDashboard = () => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<{ id: string; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<{ id: string; name: string }[]>([]);
  const [selectedBoxType, setSelectedBoxType] = useState<{ id: string; name: string }[]>([]);
  const { cumulativeFilterData, cumulativeTableData } = useSelector((state: RootState) => state.dashboard);
  const openModalHandler = () => {
    setModalVisible(true);
  };

  const closeModalHandler = () => {
    setModalVisible(false);
  };
  const filterHandler = () => {};

  const clearFilterHandler = () => {
    setSelectedLanguages([]);
    setSelectedGenre([]);
    setSelectedBoxType([]);
  };

  const modalContent = (
    <>
      <Search
        searchStyles={styles.searchStyle}
        innerContainer={styles.searchInnerContainer}
        inputFeildStyle={styles.inputFeildStyle}
        value={searchValue}
        onChange={(val) => setSearchValue(val)}
        placeholder={t('strings.filterByKeywords')}
        hasIcon={false}
      />
      <View style={styles.scrollContainer}>
        <MultiFilters
          data={cumulativeFilterData}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedBoxType={selectedBoxType}
          setSelectedBoxType={setSelectedBoxType}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.cancelButton}
          onPress={clearFilterHandler}
          label={t('strings.clear')}
          type={STYLES.TYPE.SECONDARY}
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
    headerTitle: t(`strings.${STRINGS.FILTERS}`),
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.dashboardContainer}>
          <InfoContainer />
          <View style={styles.lineSeprator} />
          <View style={styles.chartContainer}>
            <ChartWrapper isCumulativeChart={false} />
          </View>
          <View style={styles.lineSeprator} />
          <View style={styles.filterContainer}>
            <Pressable style={styles.filterStyle} onPress={() => openModalHandler()}>
              <Image iconName={ICONS.FILTERS} height={Sizing.layout.x18} width={Sizing.layout.x18} isDimension={false} />
              <Text style={styles.filterText}>{t('strings.filters')}</Text>
            </Pressable>
          </View>
          <View style={styles.tableWrapper}>
            {cumulativeTableData?.map((table: ParentObject, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <View key={index.toString()}>
                <View style={styles.activationContainer}>
                  <Text style={styles.activationText}>{t('strings.activationTotal')}</Text>
                </View>
                <TableWrapper tableData={table.data} tableColumns={table.tableColumns} isDashboardTable />
              </View>
            ))}
          </View>
        </View>
      </View>
      <BottomModal modalProps={modalProps}>{modalContent}</BottomModal>
    </ScrollView>
  );
};

export default memo(CumulativeDashboard);
