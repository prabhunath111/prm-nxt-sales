/**
 * This screen is a pack and box selecting screen in quotation primary tv
 *
 * @module components/QuotationPrimaryOffer
 * @memberof - View Component
 */
import React, { memo, useState } from 'react';
import { View, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import useNavigate from 'hooks/useNavigate';
import { isiOS } from 'utils/platformHelper';
import { useDispatch, useSelector } from 'react-redux';
import { sliceActions } from 'store/sales/reducer/quotation';
import { AppDispatch, RootState } from 'store';
import { Button, Dropdown, PincodeDetailsCard, Text } from 'components/sales';
import { QUERY, ROUTE, STYLES } from 'const';
import Autocomplete from 'components/sales/Autocomplete';
import { ParentObject } from 'store/sales/types/common';
import { callAction } from 'utils/formBuilderHelper';
import styles from './QuotationPrimaryOffer.styles';

/**
 * Represents a QuotationPrimaryOffer component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const QuotationPrimaryOffer = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate, goHome } = useNavigate();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDas, setShowDas] = useState(false);

  const {
    etskLocationData,
    tskTypesData,
    numberOfConnectionsData,
    boxTypeData,
    etskTownLocality,
    numberOfConnections,
    primaryTskTypeObject,
    etskboxType,
    boxType1,
    boxType2,
    boxType3,
    tSKtype1SelectedObject,
    tSKtype2SelectedObject,
    tSKtype3SelectedObject,
  } = useSelector((state: RootState) => state.quotation);

  const manageSelectedTown = (value: ParentObject) => {
    setShowDas(true);
    if (value) {
      dispatch(sliceActions.quotationEtskSetTownLocality(value));
    } else {
      dispatch(sliceActions.quotationEtskSetTownLocality({}));
    }
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.townCode;
      return updated;
    });
  };
  const manageSelectedConnections = (value: ParentObject) => {
    if (value) {
      dispatch(sliceActions.quotationPrimarySetNumberOfConnections(value));
    } else {
      dispatch(sliceActions.quotationPrimarySetNumberOfConnections({}));
    }
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.numberOfConnections;
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!etskTownLocality || Object.keys(etskTownLocality).length === 0) {
      newErrors.townCode = t('errors.selectTownLocality');
    }

    if (!numberOfConnections || Object.keys(numberOfConnections).length === 0) {
      newErrors.numberOfConnections = t('strings.selectNumberOfConnections');
    }
    if (!primaryTskTypeObject || Object.keys(primaryTskTypeObject).length === 0) {
      newErrors.primaryTskType = t('errors.selectTSKType');
    }
    if (!etskboxType || Object.keys(etskboxType).length === 0) {
      newErrors.primaryBoxType = t('strings.PLEASE_SELECT_BOX_TYPE');
    }

    if (numberOfConnections?.nameNT > 1 && (!tSKtype1SelectedObject || Object.keys(tSKtype1SelectedObject).length === 0)) {
      newErrors.secondary1TskType = t('errors.selectTSKType');
    }
    if (numberOfConnections?.nameNT > 1 && (!boxType1 || Object.keys(boxType1).length === 0)) {
      newErrors.secondary1BoxType = t('strings.PLEASE_SELECT_BOX_TYPE');
    }
    if (numberOfConnections?.nameNT > 2 && (!tSKtype2SelectedObject || Object.keys(tSKtype2SelectedObject).length === 0)) {
      newErrors.secondary2TskType = t('errors.selectTSKType');
    }
    if (numberOfConnections?.nameNT > 2 && (!boxType2 || Object.keys(boxType2).length === 0)) {
      newErrors.secondary2BoxType = t('strings.PLEASE_SELECT_BOX_TYPE');
    }
    if (numberOfConnections?.nameNT > 3 && (!tSKtype3SelectedObject || Object.keys(tSKtype3SelectedObject).length === 0)) {
      newErrors.secondary3TskType = t('errors.selectTSKType');
    }
    if (numberOfConnections?.nameNT > 3 && (!boxType3 || Object.keys(boxType3).length === 0)) {
      newErrors.secondary3BoxType = t('strings.PLEASE_SELECT_BOX_TYPE');
    }

    // add other dropdowns / autocompletes here

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (!validateForm()) {
      return;
    }
    dispatch(
      callAction(
        {
          quoteETSKTownLocality: etskTownLocality,
          numberOfConnectionsQuote: numberOfConnections,
          primaryTskPinQuote: primaryTskTypeObject,
          primaryBoxTypeQuote: etskboxType,
          secondaryTskPin1Quote: tSKtype1SelectedObject,
          secondaryBoxType1Quote: boxType1,
          secondaryTskPin2Quote: tSKtype2SelectedObject,
          secondaryBoxType2Quote: boxType2,
          secondaryTskPin3Quote: tSKtype3SelectedObject,
          secondaryBoxType3Quote: boxType3,
        },
        QUERY.GetAllCategoryPacks,
      ),
    ).then((response: ParentObject) => {
      if (response) {
        navigate(ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container]} testID="EtskRegistration">
      <KeyboardAvoidingView style={styles.container} behavior={isiOS() ? 'padding' : 'position'} keyboardVerticalOffset={isiOS() ? Sizing.layout.x20 : Sizing.layout.x0}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator>
          <View
            style={[
              styles.detailsCardContainer,
              styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
              styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            ]}
          >
            <View style={[styles.paddingContainer, styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
              <PincodeDetailsCard queryName={QUERY.QuotationPrimaryPincodeModal} />
              <View style={styles.addGap}>
                {showDas && <Text>{etskTownLocality?.salesSegmentNT ? `${t('strings.DAS_SEGMENT')} ${etskTownLocality?.salesSegment}` : t('strings.NO_DAS_AVAILABLE')}</Text>}
                <View style={styles.cardDropdown}>
                  <Text required style={styles.label}>
                    {t('strings.townCode')}
                  </Text>
                  <Autocomplete
                    placeholder={t('strings.selectTownCode')}
                    innerContainerStyle={styles.smallPadding}
                    queryName="locationDropdown"
                    selectedValue={etskTownLocality}
                    onSelect={manageSelectedTown}
                    isCloseIconRequired={false}
                    queryParams="searchLocally"
                    actionNeeded={false}
                    data={etskLocationData}
                  />
                  {showErrors && errors.townCode && <Text style={styles.errorText}>{errors.townCode}</Text>}
                </View>
                <View style={styles.cardDropdown2}>
                  <Text required style={styles.label}>
                    {t('strings.numberOfConnections')}
                  </Text>
                  <Dropdown
                    placeholder={t(`strings.numberOfConnections`)}
                    innerContainerStyle={styles.innerDropDownBig}
                    data={numberOfConnectionsData}
                    selectedValue={numberOfConnections}
                    onSelect={(val: ParentObject) => manageSelectedConnections(val)}
                    iconStyle={styles.dropdowniconStyle}
                    queryName="connectionFilter"
                    queryParams="connection"
                  />
                  {showErrors && errors.numberOfConnections && <Text style={styles.errorText}>{errors.numberOfConnections}</Text>}
                </View>
                <View>
                  <Text required style={[styles.label, styles.paddingBottom]}>
                    {t('strings.primaryBox')}
                  </Text>
                  <View style={styles.rowContainer}>
                    <View style={styles.card}>
                      <Autocomplete
                        placeholder={t('strings.selectTskType')}
                        innerContainerStyle={styles.largePadding}
                        queryName="tskTypeDropdown"
                        selectedValue={primaryTskTypeObject}
                        onSelect={(val: ParentObject) => {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.primaryTskType;
                            return updated;
                          });
                          dispatch(sliceActions.quotationPrimarySetTskTypeObject(val ?? {}));
                        }}
                        isCloseIconRequired={false}
                        queryParams="searchLocally"
                        actionNeeded={false}
                        data={tskTypesData?.tskType}
                      />
                      {showErrors && errors.primaryTskType && <Text style={styles.errorText}>{errors.primaryTskType}</Text>}
                    </View>
                    <View style={styles.card}>
                      <Dropdown
                        placeholder={t(`strings.quottaionSelectBoxType`)}
                        innerContainerStyle={styles.innerDropDown}
                        data={boxTypeData}
                        selectedValue={etskboxType}
                        onSelect={(val: ParentObject) => {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.primaryBoxType;
                            return updated;
                          });
                          dispatch(sliceActions.quotationEtskSetPrimaryBoxSelected(val ?? {}));
                        }}
                        iconStyle={styles.dropdowniconStyle}
                        queryName="boxTypesFilter"
                        queryParams="type"
                      />
                      {showErrors && errors.primaryBoxType && <Text style={styles.errorText}>{errors.primaryBoxType}</Text>}
                    </View>
                  </View>
                </View>
                {numberOfConnections && numberOfConnections?.nameNT > 1 && (
                  <View>
                    <Text style={[styles.label, styles.paddingBottom]}>{`${t('strings.secondaryBox')} 1`}</Text>
                    <View style={styles.rowContainer}>
                      <View style={styles.card}>
                        <Autocomplete
                          placeholder={t('strings.selectTskType')}
                          innerContainerStyle={styles.largePadding}
                          queryName="tskTypeDropdown"
                          selectedValue={tSKtype1SelectedObject}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary1TskType;
                              return updated;
                            });
                            dispatch(sliceActions.quotSetTSKtype1SelectedObject(val ?? {}));
                          }}
                          isCloseIconRequired={false}
                          queryParams="searchLocally"
                          actionNeeded={false}
                          data={tskTypesData?.tskType}
                        />
                        {showErrors && errors.secondary1TskType && <Text style={styles.errorText}>{errors.secondary1TskType}</Text>}
                      </View>
                      <View style={styles.card}>
                        <Dropdown
                          placeholder={t(`strings.quottaionSelectBoxType`)}
                          data={boxTypeData}
                          selectedValue={boxType1}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary1BoxType;
                              return updated;
                            });
                            dispatch(sliceActions.etskSetBoxType1Selected(val ?? {}));
                          }}
                          innerContainerStyle={styles.innerDropDown}
                          iconStyle={styles.dropdowniconStyle}
                          queryName="boxTypesFilter"
                          queryParams="type"
                        />
                        {showErrors && errors.secondary1BoxType && <Text style={styles.errorText}>{errors.secondary1BoxType}</Text>}
                      </View>
                    </View>
                  </View>
                )}
                {numberOfConnections && numberOfConnections?.nameNT > 2 && (
                  <View>
                    <Text style={[styles.label, styles.paddingBottom]}>{`${t('strings.secondaryBox')} 2`}</Text>
                    <View style={styles.rowContainer}>
                      <View style={styles.card}>
                        <Autocomplete
                          placeholder={t('strings.selectTskType')}
                          innerContainerStyle={styles.largePadding}
                          queryName="tskTypeDropdown"
                          selectedValue={tSKtype2SelectedObject}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary2TskType;
                              return updated;
                            });
                            dispatch(sliceActions.quotSetTSKtype2SelectedObject(val ?? {}));
                          }}
                          isCloseIconRequired={false}
                          queryParams="searchLocally"
                          actionNeeded={false}
                          data={tskTypesData?.tskType}
                        />
                        {showErrors && errors.secondary2TskType && <Text style={styles.errorText}>{errors.secondary2TskType}</Text>}
                      </View>
                      <View style={styles.card}>
                        <Dropdown
                          placeholder={t(`strings.quottaionSelectBoxType`)}
                          innerContainerStyle={styles.innerDropDown}
                          data={boxTypeData}
                          selectedValue={boxType2}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary2BoxType;
                              return updated;
                            });
                            dispatch(sliceActions.etskSetBoxType2Selected(val ?? {}));
                          }}
                          iconStyle={styles.dropdowniconStyle}
                          queryName="boxTypesFilter"
                          queryParams="type"
                        />
                        {showErrors && errors.secondary2BoxType && <Text style={styles.errorText}>{errors.secondary2BoxType}</Text>}
                      </View>
                    </View>
                  </View>
                )}
                {numberOfConnections && numberOfConnections?.nameNT > 3 && (
                  <View>
                    <Text style={[styles.label, styles.paddingBottom]}>{`${t('strings.secondaryBox')} 3`}</Text>
                    <View style={styles.rowContainer}>
                      <View style={styles.card}>
                        <Autocomplete
                          placeholder={t('strings.selectTskType')}
                          innerContainerStyle={styles.largePadding}
                          queryName="tskTypeDropdown"
                          selectedValue={tSKtype3SelectedObject}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary3TskType;
                              return updated;
                            });
                            dispatch(sliceActions.quotSetTSKtype3SelectedObject(val ?? {}));
                          }}
                          isCloseIconRequired={false}
                          queryParams="searchLocally"
                          actionNeeded={false}
                          data={tskTypesData?.tskType}
                        />
                        {showErrors && errors.secondary3TskType && <Text style={styles.errorText}>{errors.secondary3TskType}</Text>}
                      </View>
                      <View style={styles.card}>
                        <Dropdown
                          placeholder={t(`strings.quottaionSelectBoxType`)}
                          innerContainerStyle={styles.innerDropDown}
                          data={boxTypeData}
                          selectedValue={boxType3}
                          onSelect={(val: ParentObject) => {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.secondary3BoxType;
                              return updated;
                            });
                            dispatch(sliceActions.etskSetBoxType3Selected(val ?? {}));
                          }}
                          iconStyle={styles.dropdowniconStyle}
                          queryName="boxTypesFilter"
                          queryParams="type"
                        />
                        {showErrors && errors.secondary3BoxType && <Text style={styles.errorText}>{errors.secondary3BoxType}</Text>}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonView, styles[gcs('buttonView', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Button style={styles.button} onPress={() => handleSubmit()} label={t('strings.proceed')} fontSize={Sizing.layout.x16} />
          <Button
            style={styles.button}
            type={STYLES.TYPE.SECONDARY}
            onPress={() => {
              goHome(isRedirection);
            }}
            label={t('strings.cancel')}
            fontSize={Sizing.layout.x16}
            outline
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(QuotationPrimaryOffer);
