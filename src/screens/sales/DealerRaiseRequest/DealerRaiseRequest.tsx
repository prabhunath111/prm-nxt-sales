import React, { memo, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { PROPERTIES, ROUTE, STRINGS, STYLES } from 'const';
import { Button, Text, TextContainer, TextInput } from 'components/sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import Autocomplete from 'components/sales/Autocomplete';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import { Colors, Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions';
import { ParentObject } from 'store/sales/types/common';
import styles from './DealerRaiseRequest.styles';

const DealerRaiseRequest = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { natureOfRequest, typeOfRequest, dealerSubArea, dealerRoleId } = useSelector((state: RootState) => state.dealerHelp);
  const { info } = useSelector((state: RootState) => state.user);
  const [values, setValues] = useState('');
  const [typeRequest, setTypeRequest] = useState<ParentObject | null>(null);
  const [selectedNature, setSelectedNature] = useState<ParentObject | null>(null);
  const [errors, setErrors] = useState({
    nature: '',
    type: '',
    description: '',
  });
  const maxLength = Sizing.layout.x60;

  const handleFinalSubmit = () => {
    let isValid = true;
    const newErrors = {
      nature: '',
      type: '',
      description: '',
    };

    if (!selectedNature) {
      newErrors.nature = t('validations.requiredNatureofRequest');
      isValid = false;
    }

    if (!typeRequest) {
      newErrors.type = t('validations.requiredTypeofRequest');
      isValid = false;
    }

    if (!values.trim()) {
      newErrors.description = t('validations.enterDescription');
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const requestParams = {
      bposId: dealerRoleId?.[0]?.bposId,
      comment: values,
      dataEvdId: null,
      dataMobileNumber: null,
      dealerID: info?.userId,
      subArea: dealerSubArea,
      subscriberId: '',
      userName: info?.mdn,
      user_Role: dealerRoleId?.[0]?.role,
      woSubType: typeRequest?.valueNT,
      woType: selectedNature?.valueNT,
    };

    dispatch(actions.createBRSSRWorkOrder(requestParams)).then((res: any) => {
      if (res?.status) {
        navigate(ROUTE.WEB.DEALER_SUCCESS);
      }
    });
  };

  const handleCancel = () => {
    navigate(ROUTE.WEB.BINGE_RETAILER);
  };

  const handelNatureDropDownChange = (value: ParentObject) => {
    setSelectedNature(value?.object);
    setTypeRequest(null);
    setErrors((prev) => ({ ...prev, nature: '' }));
  };

  const handelTypeDropDownChange = (value: ParentObject) => {
    setTypeRequest(value?.object);
    setErrors((prev) => ({ ...prev, type: '' }));
  };
  const handleInputChange = (text: string) => {
    setValues(text);
    if (text.trim()) {
      setErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const filteredTypeOfRequest = React.useMemo(() => {
    if (!selectedNature) return [];
    return typeOfRequest;
  }, [selectedNature, typeOfRequest]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View style={[styles.detailsCardContainer]}>
          <View style={[styles.paddingContainer, styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <View style={[styles.dealerContainer, styles[gcs('dealerContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
              <TextContainer
                itemContainerStyle={styles.textWrapperManageSummary}
                data={{ RetailerRMN: info?.mdn }}
                dataArray={PROPERTIES.DEALER_NUMBER.DEALER_RMN}
                hasSepratorBottom
                primaryStyle={[styles.primaryTextManage, styles.primaryBookingNumber, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={[styles.secondaryTextManage, styles.secondaryBookingNumber]}
              />
            </View>
          </View>
          <View
            style={[
              styles.paddingContainer,
              styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
              styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            ]}
          >
            <View style={styles.rowContainerCenter}>
              <View style={styles.dropDownContainer}>
                <Text label={t('strings.natureRequest')} required style={styles.textStyle} />
                <Autocomplete
                  data={natureOfRequest}
                  onSelect={handelNatureDropDownChange}
                  placeholder={t('strings.selectNatureRequest')}
                  containerStyle={styles.outerContainer}
                  innerContainerStyle={styles.innerDropDown}
                  queryName={STRINGS.CATEGORY_DROPDOWN}
                  isCloseIconRequired={false}
                  queryParams="searchLocally"
                  actionNeeded={false}
                />
                {errors.nature ? <Text style={styles.errorText}>{errors.nature}</Text> : null}
              </View>

              <View style={styles.dropDownContainer}>
                <Text label={t('strings.typeRequest')} required style={styles.textStyle} />
                <Autocomplete
                  data={filteredTypeOfRequest}
                  onSelect={handelTypeDropDownChange}
                  placeholder={t('strings.selectTypeRequest')}
                  containerStyle={styles.outerContainer}
                  innerContainerStyle={styles.innerDropDown}
                  queryName={STRINGS.DURATION_DROPDOWN}
                  isCloseIconRequired={false}
                  queryParams="searchLocally"
                  actionNeeded={false}
                />
                {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}
              </View>

              <View>
                <Text label={t('strings.description')} required style={[styles.paddingText, styles.textStyle]} />
                <View style={styles.description}>
                  <TextInput
                    value={values}
                    placeholder={t('strings.enterHere')}
                    onChangeText={handleInputChange}
                    multiline
                    numberOfLines={5}
                    maxLength={maxLength}
                    style={styles.descriptionTextInput}
                    inputFieldStyle={styles.descriptionTextInput}
                    placeholderTextColor={Colors.neutral.g300}
                    selectionColor="transparent"
                    underlineColorAndroid="transparent"
                  />
                  <Text style={styles.charCount}>
                    {values.length}/{maxLength}
                  </Text>
                </View>
                {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.innerButtonContainer, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Button type={STYLES.TYPE.PRIMARY} style={styles.button} onPress={handleFinalSubmit} label={t('strings.submit')} fontSize={Sizing.layout.x16} />
          <Button type={STYLES.TYPE.SECONDARY} style={styles.button} onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(DealerRaiseRequest);
