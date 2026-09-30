/**
 * it will show transaction history for recharge reversal
 *
 * @module components/TransactionHistory
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/transactionHistory';
import formAction from 'store/sales/actions/form';
import { Button, Card, FormHeader, TextContainer } from 'components/sales';
import { ROUTE, PROPERTIES, FORMS } from 'const';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import { ParentObject } from 'store/sales/types/common';
import { Sizing, Typography } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import styles from './TransactionHistory.styles';

/**
 * Represents a TransactionHistory component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const TransactionHistory = () => {
  const { transactionHistory, isTransactionDetails } = useSelector((state: RootState) => state.transactionHistory);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();

  useEffect(() => {
    if (isTransactionDetails) {
      navigate(ROUTE.WEB.CONFIRM_REVERSAL);
    }
  }, [isTransactionDetails]);

  const BackHandler = () => {
    navigate(ROUTE.WEB.RECHARGE_REVERSAL);
    dispatch(actions.resetTransactionHistory());
    dispatch(formAction.resetNavigationData());
  };

  const handleReverse = (history: ParentObject) => {
    const payload = { transactionID: history?.transactionId, subscriberId: null };

    dispatch(actions.retrieveTransactionDetails(payload)).then((response: ParentObject) => {
      if (response?.status) {
        dispatch(actions.resetIsTransactionDetails());
        navigate(ROUTE.WEB.CONFIRM_REVERSAL);
      }
    });
  };

  return (
    <View style={styles.contentContainer}>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={FORMS.transectionHistory as FormNameKeys} />
      </View>
      <ScrollView>
        <View style={styles.listContainer}>
          {transactionHistory &&
            transactionHistory.map((history: ParentObject, index: number) => (
              <Card
                key={history.transactionId ?? index}
                cardStyle={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['xs', 'md', 'lg', 'xl'])]]}
                childrenStyle={[styles.cardContent, index === 0 && styles[gcs('firstCardContent', inflection, true, ['md', 'lg', 'xl'])]]}
              >
                <View style={styles.infoContainer}>
                  <View style={styles.detailsContainer}>
                    <TextContainer
                      itemContainerStyle={styles.textWrapper}
                      primaryStyle={styles.primaryText}
                      secondaryStyle={styles.secondaryText}
                      data={history}
                      dataArray={PROPERTIES.TRANSACTION_HISTORY.GET_TRANSACTIONS}
                      separator=": "
                    />
                  </View>
                  <View>
                    <Button
                      useHover
                      label={t('strings.reverse')}
                      onPress={() => handleReverse(history)}
                      style={[styles.reverseButton, styles[gcs('reverseButton', inflection, true, ['sm', 'xs'])]]}
                      borderRadius={Sizing.layout.x0}
                      fontSize={Typography.fontSize.x14.fontSize}
                    />
                  </View>
                </View>
              </Card>
            ))}
        </View>
        <View style={styles.backButton}>
          <Button onPress={() => BackHandler()} label={t('strings.back')} />
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(TransactionHistory);
