/**
 * here we will enable redirection for those models who have a modal
 *
 * @module components/ManageModalRedirection
 * @memberof - View Component
 */
import React, { memo, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { CHILD_TYPE, HEADER_TITLE, MODAL, PROPERTIES, QUERY, ROUTE, STATE_KEY } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import uiActions from 'store/sales/actions/ui';
import actions from 'store/sales/actions';
import useNavigate from 'hooks/useNavigate';
import demoBoxDetailsAction from 'store/sales/actions/demoBoxDetails';
import dealerStockAction from 'store/sales/actions/dealerStock';
import { showModalWithTransition } from 'utils/modalWithTransition';
import { ParentObject } from 'store/sales/types/common';
import DynamicSalesNext from '../DynamicSalesNext';
import styles from './ManageModalRedirection.styles';

/**
 * Component prop types.
 *
 * @typedef {object} ManageModalRedirectionProps
 * @property {string} [text] - The text to display inside the component.
 */
export type ManageModalRedirectionProps = {
  text?: string;
};

/**
 * Represents a ManageModalRedirection component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ManageModalRedirection = ({ text }: ManageModalRedirectionProps) => {
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { info } = useSelector((state: RootState) => state.user);
  const { bottomModal } = useSelector((state: RootState) => state.ui);
  const { navigate } = useNavigate();
  const { dashboard } = useSelector((state: RootState) => state.user.navigation);

  const timeoutsRef: any = useRef([]);

  const delayedDispatch = (action: any, delay: number = 200) => {
    const timeout = setTimeout(() => {
      dispatch(action);
    }, delay);
    timeoutsRef.current.push(timeout);
  };

  useEffect(() => {
    if (bottomModal.isModalVisible) {
      dispatch(uiActions.hideBottomModal());
    }
    const menuCards = dashboard.find((item: ParentObject) => item.path === routeName);

    switch (routeName) {
      case ROUTE.WEB.DEMO_BOX_DETAIL:
        if (info?.internalRole === PROPERTIES.ROLES.dealer) {
          delayedDispatch(dispatch(demoBoxDetailsAction.demoBoxDetails({ evdCode: info.userId }, QUERY.DemoBoxDetails)));
          navigate(ROUTE.WEB.DEMO_BOX_DETAILS);
        }
        break;

      case ROUTE.WEB.CUSTOMER_INVOICE:
        delayedDispatch(dispatch(actions.customerInvoiceModal()));
        break;

      case ROUTE.WEB.PRIMARY_TV_REGISTRATION:
        delayedDispatch(dispatch(actions.primaryTvRegistrationModal()));
        break;

      case ROUTE.WEB.CUSTOMER_OFFERS:
        delayedDispatch(dispatch(actions.customerOfferModal()));
        break;

      case ROUTE.WEB.WORK_ORDER_RECREATION:
        delayedDispatch(dispatch(actions.woRecreationOfferModal()));
        break;

      case ROUTE.WEB.DEALER_STOCK:
        if (info?.internalRole === PROPERTIES.ROLES.dealer) {
          dispatch(uiActions.setLoader());
          delayedDispatch(dispatch(dealerStockAction.getProductTypes({ subscriberInfo: info.userId }, QUERY.GetProductTypes, '', navigate)));
          navigate(ROUTE.WEB.DEALER_STOCK_LIST);
        } else {
          delayedDispatch(dispatch(actions.dealerStockModal()));
        }
        break;
      case ROUTE.WEB.ETSK_REPUSH:
        delayedDispatch(dispatch(actions.etskRepushModal()));
        break;
      case ROUTE.WEB.MODIFY_PACK:
        delayedDispatch(dispatch(actions.modifyPackModal()));
        break;
      case ROUTE.WEB.ACTIVATION_STATUS:
        delayedDispatch(dispatch(actions.activationStatusModal()));
        break;
      case ROUTE.WEB.MANAGE_APPS:
        delayedDispatch(dispatch(actions.manageAppsModal()));
        break;
      case ROUTE.WEB.QUOTATION:
        dispatch(actions.quotationModal());
        break;
      case ROUTE.WEB.DEMO_ACCOUNT:
        delayedDispatch(dispatch(actions.demoAccountCreationModal()));
        break;

      case ROUTE.WEB.STORE_DASHBOARD:
        delayedDispatch(dispatch(actions.storeDashboardRMNModel()));
        break;

      case ROUTE.WEB.BOX_UPGRADE:
        delayedDispatch(dispatch(actions.modelForRMN()));
        break;

      case ROUTE.WEB.BOX_TYPE_CHANGE:
        delayedDispatch(dispatch(actions.modelForBoxTypeRMN()));
        break;

      case ROUTE.WEB.COMPETITOR_DATA_CAPTURE:
        dispatch(actions.modelForCompetitorDataCapture());
        break;

      case ROUTE.WEB.TSK_VOUCHER:
        dispatch(actions.modelForTskVoucher());
        break;

      case ROUTE.WEB.TSK_CANCELLATION:
        dispatch(actions.tskCancellationModal());
        break;

      default:
        if (menuCards?.isDisable)
          delayedDispatch(
            dispatch(
              showModalWithTransition({
                isModalVisible: true,
                type: CHILD_TYPE.LABEl,
                headerTitle: HEADER_TITLE.CONFIRMATION,
                showCloseIcon: true,
                showHeader: false,
                buttonInfo: {
                  primaryButtonLabel: MODAL.OK,
                  childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
                  centerLabel: true,
                  isRedirection: true,
                },
              }),
            ),
          );
        break;
    }
    return () => {
      clearTimeout(timeoutsRef);
    };
  }, [routeName]); // Add dependencies

  return (
    <View testID="manageModalTest">
      {routeName === ROUTE.WEB.DEMO_BOX_DETAIL && (
        <DynamicSalesNext customFormName={routeName} stateKey={STATE_KEY.FORM_STATE} containerStyle={styles.salesContainer} formContainerStyle={styles.formContainer} />
      )}
      <Text>{text}</Text>
    </View>
  );
};

export default memo(ManageModalRedirection);
