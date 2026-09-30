/**
 * To track customer request
 *
 * @module components/TrackTheRequest
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, FormBuilder, FormHeader, Search, TableWrapper } from 'components/sales';
import { FORMS, PROPERTIES, QUERY, STRINGS, STYLES } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/customerService';
import formActions from 'store/sales/actions/form';
import { ParentObject } from 'store/sales/types/common';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { View } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { getFullScreenWidth } from 'styles/dimentionHelper';
import { closeWebView } from 'utils/navigationHelper';
import useNavigate from 'hooks/useNavigate';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { useTranslation } from 'react-i18next';
import styles from './TrackTheRequest.styles';

/**
 * Represents a TrackTheRequest component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered TrackTheRequest component
 *
 * @example
 * <TrackTheRequest text="Hello World!" />
 */

const TrackTheRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriberRequests } = useSelector((state: RootState) => state.customerService);
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { goHome } = useNavigate();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const [requestType, setRequestType] = useState<ParentObject | undefined>(undefined);
  const [filteredTableData, setFilteredData] = useState([]);
  const [finalFilteredData, setFinalFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<ParentObject | undefined>(undefined);

  useEffect(() => {
    setRequestType(PROPERTIES.CUSTOMER_SERVICE.REQUEST_TYPE[0]);
    setFilteredData(subscriberRequests?.wo || []);
    setFinalFilteredData(subscriberRequests?.wo || []);
  }, [subscriberRequests]);

  // reset form on unmount
  useEffect(() => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceTrackRequest.moduleName, {
      Status: true,
    });
    // This will run when the component mounts
    dispatch(formActions.setSubIdListDefault());

    // Cleanup function: this will run when the component unmounts
    return () => {
      dispatch(actions.resetTrackRequest());
    };
  }, []); // Empty dependency array means this runs only once on mount and unmount

  useEffect(() => {
    if (!filteredTableData || !Array.isArray(filteredTableData)) {
      setFinalFilteredData([]);
      return;
    }
    let filtered = [...filteredTableData];
    // 1. Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item: ParentObject) =>
          item?.requestNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.natureOfRequest?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.requestType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.resolutionCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.openedDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    // 2. Status filter
    if (status?.id && status?.name.toLowerCase() !== STRINGS.All) {
      filtered = filtered.filter((item: ParentObject) => item?.status === status?.name);
    }
    setFinalFilteredData(filtered);
  }, [searchQuery, status, filteredTableData]);

  const handleRequestType = (val: any) => {
    setRequestType(val);
    const type = val?.id;
    const data = subscriberRequests?.[type] ?? subscriberRequests?.suspension;
    setFilteredData(data ?? []);
    setSearchQuery('');
    setStatus(undefined);
  };

  const handleFilter = (val: any) => {
    setStatus(val);
  };

  const onsubmit = (values: ParentObject) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServiceTrackRequestProceed.moduleName, {
      Status: true,
      [MoengageMixpanelModules.CustomerService.CustomerServiceTrackRequestProceed.attributes.SubscriberID]: values,
    });
    dispatch(actions.trackServiceRequest(values, QUERY.TrackServiceRequest));
  };

  const cancelButton = () => {
    if (isRedirection) {
      closeWebView();
    } else {
      goHome();
    }
  };

  const { tableColumns }: any = requestType?.id === STRINGS.SR ? PROPERTIES.TRACK_REQUEST_SR : PROPERTIES.TRACK_REQUEST;
  const ContainerSize = getFullScreenWidth() * 0.92;

  return subscriberRequests?.wo?.length > 0 || subscriberRequests?.sr?.length > 0 || subscriberRequests?.suspension?.length > 0 ? (
    <View style={[styles.tableContainer, styles[gcs('tableContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="track-request">
      <Search placeholder={t('strings.search')} innerContainer={styles.inputStyle} inputFeildStyle={styles.inputStyle} value={searchQuery} onChange={setSearchQuery} />
      <View style={styles.dropDownWrapper}>
        <Dropdown
          data={PROPERTIES.CUSTOMER_SERVICE.REQUEST_TYPE}
          selectedValue={requestType}
          required
          onSelect={(value) => handleRequestType(value)}
          innerContainerStyle={styles.dropdownContainerStyle}
          inputFieldStyle={styles.inputFieldStyle}
          iconStyle={styles.chevronIconStyle}
        />
        <Dropdown
          data={subscriberRequests?.status}
          selectedValue={status}
          onSelect={(value) => handleFilter(value)}
          innerContainerStyle={styles.dropdownContainerStyle}
          inputFieldStyle={styles.inputFieldStyle}
          iconStyle={styles.chevronIconStyle}
          placeholder={t('strings.status')}
        />
      </View>
      <TableWrapper tableData={finalFilteredData} tableColumns={tableColumns} parentSize={ContainerSize} maxWidthScroll />
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          onPress={cancelButton}
          label={t('strings.cancel')}
          style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]}
          type={STYLES.TYPE.SECONDARY}
          outline
        />
      </View>
    </View>
  ) : (
    <Card cardStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]} childrenStyle={styles.content}>
      <View style={styles.formContainer} testID="track-request">
        <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
          <FormHeader formName={FORMS.raiseRequest as FormNameKeys} />
        </View>
        <FormBuilder formName={FORMS.trackRequest} onSubmit={onsubmit} style={{}} />
      </View>
    </Card>
  );
};

export default TrackTheRequest;
