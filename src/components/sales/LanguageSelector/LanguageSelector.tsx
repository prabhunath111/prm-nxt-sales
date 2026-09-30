/**
 * Component used to show the list of languages.
 *
 * @module components/LanguageSelector
 * @memberof - Common Component
 */
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Modal, { ModalPlacement } from 'components/sales/Modal';
import List from 'components/sales/List';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { ICONS, STRINGS } from 'const';
import { Colors, Sizing } from 'styles';
import Gradient from 'components/sales/Gradient';
import { changeLanguage } from 'config/i18n';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { storageService } from 'services/storageService';
import { useTranslation } from 'react-i18next';
import { getFullLanguageName, loadLanguage } from 'utils/languageHelper';
import styles from './LanguageSelector.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type LanguageSelectorProps = {
  languages: Array<{ key: string; value: string }>;
  isVisible: boolean;
  onClose: () => void;
  langRef: MutableRefObject<null>;
};

/**
 * Represents a LanguageSelector component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LanguageSelector
 */
const LanguageList = ({ languages, isVisible, onClose, langRef }: LanguageSelectorProps) => {
  const [visible, setVisible] = useState(isVisible);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>('');
  const { i18n } = useTranslation();
  const fullLanguageName = getFullLanguageName(i18n.language);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // load and save stored language on start
  useEffect(() => {
    loadLanguage();
    if (fullLanguageName === STRINGS.BANGLA) {
      setSelectedLanguage(STRINGS.BENGALI);
    } else if (fullLanguageName === STRINGS.ODIA) {
      setSelectedLanguage(STRINGS.ORIYA);
    } else {
      setSelectedLanguage(fullLanguageName);
    }
  }, [i18n.language]);

  // fun to select language from language list
  const handleSelectLanguage = async (language: { key: string; value: string }) => {
    setSelectedLanguage(language.value);
    changeLanguage(language.key);
    await storageService.setItem(STRINGS.LANG, language.value.toLocaleLowerCase());
    await storageService.setItem(STRINGS.APP_LANGUAGE, language.key);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: { key: string; value: string } }) => (
    <TouchableOpacity testID={`language-item-${item.key}`} style={styles.languageItem} onPress={() => handleSelectLanguage(item)}>
      <Text style={styles.languageText} label={item.value} />
      {selectedLanguage === item.value ? (
        <View style={styles.checkIcon}>
          <Image iconName="checkmark" isDimension={false} height={25} width={25} />
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={visible} onClose={onClose} modalStyle={styles.optionContainer} modalTarget={langRef} placementType={ModalPlacement.BOTTOM}>
      <Gradient colors={Colors.gradient.theme} style={styles.gradientContainer}>
        <List data={languages} renderItem={renderLanguageItem} keyExtractor={(item) => item.key} style={styles.listContainer} />
      </Gradient>
    </Modal>
  );
};

const LanguageSelector = () => {
  const langRef: MutableRefObject<null> = useRef(null);
  const { languageData } = useSelector((state: RootState) => state.fetchLanguage);

  const [isLanguageSelectorVisible, setLanguageSelectorVisible] = useState(false);

  const openLanguageSelector = () => {
    setLanguageSelectorVisible(true);
  };
  const closeLanguageSelector = () => {
    setLanguageSelectorVisible(false);
  };

  return (
    <View style={[styles.container]} testID="language-test-container">
      <Pressable testID="language-selector-pressable" onPress={() => openLanguageSelector()} ref={langRef}>
        <Image iconName={ICONS.LANGUAGE} height={Sizing.layout.x3} width={Sizing.layout.x3} style={styles.iconStyle} />
      </Pressable>
      <LanguageList languages={languageData} isVisible={isLanguageSelectorVisible} onClose={closeLanguageSelector} langRef={langRef} />
    </View>
  );
};

export default LanguageSelector;
