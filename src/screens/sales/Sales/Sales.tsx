/**
 * to handle all pages forms
 *
 * @module components/Sales
 * @memberof - View Component
 */
import React, { memo } from 'react';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { FORMS, SUBMISSION } from 'const';
import { Card, FormHeader, FormWrapper } from 'components/sales';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/form';
import useNavigate from 'hooks/useNavigate';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { ScrollView, View } from 'react-native';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { capitalizeFirstLetter } from 'utils/mixPanelHelper';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import styles from './Sales.styles';

/**
 * Represents a Sales component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
export type FormNameKeys = keyof typeof FORMS;
interface ParentObject {
  [key: string]: any;
}

const Sales = () => {
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const formName = routeName as FormNameKeys;
  const { info } = useSelector((state: RootState) => state.user);
  const { inflection } = useInflection();

  usePlatformFocusEffect(() => {
    // handle page visit events for moengage and mixpanel
    MoengageMixpanel.trackEvent(capitalizeFirstLetter(`${formName}_PageVisit`), { Status: true });
    if (formName === FORMS.changeEVDPin) {
      dispatch(actions.setFormDependentDefault(info));
    }
  }, [routeName]);

  const onSubmit = (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => {
    if (submitType === SUBMISSION.NAVIGATION && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      navigate(navigateTo);
    } else if ((submitType === SUBMISSION.SUBMIT_NAVIGATION || submitType === SUBMISSION.LINK) && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      dispatch(actions.submitForm(values, queryName)).then((response: ParentObject) => {
        if (response?.status) {
          navigate(navigateTo);
        }
      });
    } else {
      dispatch(actions.submitForm(values, queryName));
    }
  };

  return (
    <>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={formName} />
      </View>
      <ScrollView testID="sales">
        <Card cardStyle={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <FormWrapper style={{}} onSubmit={onSubmit} formName={formName} isHeaderRequire />
        </Card>
      </ScrollView>
    </>
  );
};

export default memo(Sales);
