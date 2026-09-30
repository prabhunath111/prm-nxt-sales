/**
 * activation status screen with package info wo info and transaction info
 *
 * @module components/ActivationStatus
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Text from 'components/sales/Text';
import { Button, CustomerDetailsCard, List, PackageInfo, RechargeTransactions, Tabs, TextContainer, WoInformation } from 'components/sales';
import { PROPERTIES, STRINGS, STYLE_VARIANT, STYLES } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { getStatus, maskNumber } from 'utils/activationStatusHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/activationStatusDetails';
import useNavigate from 'hooks/useNavigate';
import styles from './ActivationStatus.styles';

interface TabObject {
  key: string;
  title: string;
  subTitle?: string;
  component: React.ReactNode;
}

/**
 * Represents a ActivationStatus component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ActivationStatus = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { activationStatusData, bcpActivationStatusData } = useSelector((state: RootState) => state.activationStatus);
  const { goBack } = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (activationStatusData) {
      dispatch(actions.getAccountInfo());
    }
  }, []);

  const renderSecondaryConnections = () => {
    const data = activationStatusData?.secStatusArray ?? [];

    const filteredData = data.length > 1 ? data.slice(1) : [];

    if (filteredData.length === 0) return null;

    return (
      <View style={[styles.statusBox, styles.zeroPadding]}>
        <List
          data={filteredData}
          renderItem={({ item, index }) => {
            const statusVal = item.secStatus.split(' ')[0];
            const { statusText, statusColor, statusBackgroundColor } = getStatus(statusVal, t);
            return (
              <View style={styles.secondaryConView}>
                <Text label={`${t('strings.secondaryConnection')} ${index + 1}`} style={styles.status} />
                <View style={[styles.statusWrapper, { backgroundColor: statusBackgroundColor }]}>
                  <Text style={[styles.activeText, { color: statusColor }]}>{statusText}</Text>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
        />
      </View>
    );
  };

  const { statusText, statusColor, statusBackgroundColor } = getStatus(activationStatusData?.secStatusArray?.[0]?.secStatus ?? '', t);

  const componentMap: Record<string, React.ReactNode> = {
    [STRINGS.WO_INFORMATION]: <WoInformation />,
    [STRINGS.PACKAGE_INFORMATION]: <PackageInfo />,
    [STRINGS.RECHARGE_TRANSACTION]: <RechargeTransactions />,
  };

  const tabs: TabObject[] = PROPERTIES.ACTIVATION_STATUS.RELATED_LINKS.map((el, index) => ({
    key: String(index),
    title: t(`strings.${el}`),
    component: componentMap[el],
  }));

  const renderBcpView = () => (
    <View style={[styles.subContainer, styles[gcs('subContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
      <TextContainer
        itemContainerStyle={styles.textWrapperManage}
        data={{
          subscriberId: bcpActivationStatusData?.subscriberId,
          workOrderNo: bcpActivationStatusData?.workOrderNo,
        }}
        dataArray={PROPERTIES.ACTIVATION_STATUS.BCP_ACTIVATION_STATUS}
        hasSepratorBottom
      />
    </View>
  );

  return (
    <View style={styles.container} testID="activation-status-test">
      <ScrollView style={styles.scrollViewStyle}>
        {activationStatusData ? (
          <View style={[styles.subContainer, styles[gcs('subContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
            <CustomerDetailsCard />
            <View style={styles.cardsConatinerView}>
              <TextContainer
                itemContainerStyle={styles.textWrapperManage}
                data={{
                  customerRmn: maskNumber(activationStatusData?.customerRmn),
                }}
                dataArray={PROPERTIES.ACTIVATION_STATUS.CUSTOMER_RMN}
                hasSepratorBottom
              />
              <Text label={t(`strings.status`)} fontSize={Sizing.layout.x16} style={styles.title} />
              <View style={styles.statusBox}>
                <Text label={t(`strings.primaryConnection`)} style={styles.status} />
                <View style={[styles.statusWrapper, { backgroundColor: statusBackgroundColor }]}>
                  <Text style={[styles.activeText, { color: statusColor }]}>{statusText}</Text>
                </View>
              </View>
              {renderSecondaryConnections()}
              <Text label={t(`strings.relatedLinks`)} fontSize={Sizing.layout.x16} style={[styles.title, styles.bottomMargin]} />
            </View>
            <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P3} />
          </View>
        ) : (
          <>{renderBcpView()}</>
        )}
      </ScrollView>
      <View style={styles.buttonView}>
        <Button label={t(`strings.back`)} onPress={() => goBack()} type={STYLES.TYPE.SECONDARY} outline style={styles.button} />
      </View>
    </View>
  );
};

export default memo(ActivationStatus);
