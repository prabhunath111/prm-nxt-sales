/**
 * filter pop up appears on selecting hamburg icon
 *
 * @module components/HeaderFilters
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ICONS, STRINGS, STYLES } from 'const';
import { Sizing, Typography } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { storageService } from 'services/storageService';
import { getScreenHeight, getScreenWidth } from 'styles/dimentionHelper';
import { useTranslation } from 'react-i18next';
import Checkbox from 'components/sales/Checkbox';
import Button from 'components/sales/Button';
import Image from 'components/sales/Image';
import Modal from 'components/sales/Modal';
import { getFullLanguageName, loadLanguage } from 'utils/languageHelper';
import actions from 'store/sales/actions/fetchLanguage';
import styles from './HeaderFilters.styles';

/**
 * Component type definitions
 *
 * @typedef {object} HeaderFiltersProps
 * @property {string} [text] - The content for the component
 */

export type HeaderFiltersProps = {
  closeModal: () => void;
};

/**
 * Represents a HeaderFilters component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered HeaderFilters component
 *
 * @example
 * <HeaderFilters text="Hello World!" />
 */

const HeaderFilters = ({ closeModal }: HeaderFiltersProps) => {
  const { isLangSelectorModalVisible } = useSelector((state: RootState) => state.ui);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>('');
  const { languageData } = useSelector((state: RootState) => state.fetchLanguage);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const fullLanguageName = getFullLanguageName(i18n.language);

  useEffect(() => {
    loadLanguage(); // load last saved language
    // set language locally
    if (fullLanguageName === STRINGS.BANGLA) {
      setSelectedLanguage(STRINGS.BENGALI);
    } else if (fullLanguageName === STRINGS.ODIA) {
      setSelectedLanguage(STRINGS.ORIYA);
    } else {
      setSelectedLanguage(fullLanguageName);
    }
  }, [i18n.language]);

  // funtion when selecting languages
  const handleSelectLanguage = async (language: { key: string; value: string }) => {
    setSelectedLanguage(language.value);
    await storageService.setItem(STRINGS.LANG, language.value.toLocaleLowerCase());
    await storageService.setItem(STRINGS.APP_LANGUAGE, language.key);
  };

  // render language list
  const languageList = () => (
    <ScrollView style={styles.languageScrollContainer}>
      <View style={styles.languageListView}>
        {languageData?.map((item: any) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              label={item.value}
              value={selectedLanguage === item.value}
              labelStyle={styles.checkBoxLabel}
              onValueChange={() => {
                handleSelectLanguage(item);
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <Modal isVisible={isLangSelectorModalVisible} backgroundStyle={styles.modalBackgroundStyle} onClose={closeModal} height={getScreenHeight() * 0.65} width={getScreenWidth()}>
      <View style={styles.modalContainer} testID="header-filters-test-container">
        <View style={styles.headerView}>
          <Text style={styles.heading}>{t('strings.filters')}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Image iconName={ICONS.CLOSE} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.menuContainer}>
            <View style={styles.menuSelect} />
            <Text style={styles.menuText}>{t('strings.languages')}</Text>
          </View>
          {languageList()}
        </View>
        <View style={styles.buttonContainer}>
          <Button label={t('modal.close')} onPress={closeModal} outline type={STYLES.TYPE.SECONDARY} fontSize={Typography.fontSize.x16.fontSize} />
          <Button
            label={t('modal.showResults')}
            fontSize={Typography.fontSize.x16.fontSize}
            onPress={() => {
              dispatch(actions.getMenus());
              loadLanguage();
              closeModal();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default HeaderFilters;
