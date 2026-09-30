/**
 * This component displays dealer details in a card format with an option to edit dealer information.
 * It uses data from the Redux store and provides navigation to a different route when editing.
 *
 * @module components/DealerDetailsCard
 * @memberof CommonComponent
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import Image from 'components/sales/Image';
import { CHILD_TYPE, ICONS, PROPERTIES } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import uiActions from 'store/sales/actions/ui';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './DealerDetailsCard.styles';

/**
 * DealerDetailRow component
 *
 * Renders a single row showing a label and its corresponding value, with optional styles.
 *
 * @param {object} props - React properties for DealerDetailRow
 * @param {string} props.label - The label for the dealer detail
 * @param {string} props.value - The value for the dealer detail
 * @param {boolean} [props.removeBorder] - Whether to remove the bottom border from the row
 * @param {boolean} [props.removePadding] - Whether to remove padding from the row
 * @returns {JSX.Element} The rendered row
 */

const DealerDetailRow = ({ label, value, removeBorder = false, removePadding = false }: { label: string; value: string; removeBorder?: boolean; removePadding?: boolean }) => {
  const { inflection } = useInflection();
  return (
    <View style={[styles.dealerDetails, removeBorder && styles.withoutBorder, removePadding && styles.withoutPadding]}>
      <Text style={styles.primaryText}>{label}</Text>
      <Text style={[styles.secondaryCount, styles[gcs('secondaryCount', inflection, true, ['md', 'lg', 'xl', 'xs'])]]}>{value}</Text>
    </View>
  );
};

export type DealerDetailsProps = {
  routeName?: string;
  mdn?: string;
  evdCode?: string;
  name?: string;
  formName?: string;
  bottomModalHeader?: string;
  link?: boolean;
  title?: string;
};

/**
 * DealerDetailsCard component
 *
 * Renders a card displaying dealer details fetched from Redux, with an option to change the dealer.
 * Navigates to a specified route when the "change dealer" option is pressed.
 *
 * @param {DealerDetailsProps} props - React properties passed to the DealerDetailsCard component
 * @returns {JSX.Element} The rendered DealerDetailsCard component
 *
 * @example
 * <DealerDetailsCard routeName="DealerEditScreen" />
 */
const DealerDetailsCard = ({ routeName, mdn, evdCode, name, formName = '', bottomModalHeader, title, link = true }: DealerDetailsProps) => {
  const { dealerDetails } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { info } = useSelector((state: RootState) => state.user);

  const handleChangeDealer = () => {
    if (routeName) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.StoreDashboard.StoreDashboardChangeDistributor.moduleName, {
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardChangeDistributor.attributes.Status]: true,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardChangeDistributor.attributes.dealerID]: dealerDetails?.dealerID,
      });
      navigate(routeName);
    } else {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureChangeDealer.moduleName, {
        [MoengageMixpanelModules.CompetitorDataCapture.CompetitorDataCaptureChangeDealer.attributes.Status]: true,
      });
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.DYNAMIC_FORM,
          headerTitle: bottomModalHeader,
          showCloseIcon: true,
          showHeader: true,
          formName,
          isCenterModal: true,
        }),
      );
    }
  };
  const enableLink = info?.internalRole !== PROPERTIES.ROLES.dealer && link;
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        {title ? <Text style={styles.headingText}>{title}</Text> : <Text style={styles.headingText}>{t('strings.dealerDetails')}</Text>}
        {enableLink && (
          <Pressable style={styles.headingContainer} onPress={handleChangeDealer}>
            <Image iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
            <Text style={styles.changeDealer}>{title ? t('strings.changeDistributor') : t('strings.changeDealer')}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.dealerDetailsContainer}>
        <DealerDetailRow label={t('strings.evdCode')} value={evdCode ?? dealerDetails.evdCode} removePadding />
        <DealerDetailRow label={t('strings.mdn')} value={mdn ?? dealerDetails.mdn} />
        <DealerDetailRow label={t('strings.name')} value={name ?? dealerDetails.name} removeBorder />
      </View>
    </View>
  );
};

export default DealerDetailsCard;
