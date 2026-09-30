/**
 * in this user can ans all the question checklist
 *
 * @module components/ExclusiveStoreQuestion
 * @memberof - View Component
 */
import React, { memo, useMemo, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Button, Checkbox, DateAndTimeDetails, IconTextInput, RadioContainer, Text } from 'components/sales';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import uiActions from 'store/sales/actions/ui';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { t } from 'i18next';
import { Sizing } from 'styles';
import { ACTION_TYPE, ALERT, MODAL, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import i18next from 'i18next';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import styles from './ExclusiveStoreQuestion.styles';
/**
 * Component prop types.
 *
 * @typedef {object} ExclusiveStoreQuestionProps
 * @property {string} [text] - The text to display inside the component.
 */
export type ExclusiveStoreQuestionProps = {
  text?: string;
};

interface StoreQuestion {
  QUESTIONID: number;
  QUESTIONSDESC: string;
  QUESTIONTYPE: string;
  DISPLAYVALUES: string;
  DEFAULTVALUES: string;
}

type GroupedQuestions = Record<string, StoreQuestion[]>;

/**
 * Represents a ExclusiveStoreQuestion component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ExclusiveStoreQuestion = () => {
  const { storeOpenQuestion, isStoreOpen } = useSelector((state: RootState) => state.exclusiveStore);
  const { resultStoreActionQues = [], strOpnSection = [], strClsSection = [] } = storeOpenQuestion || {};
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { inflection } = useInflection();

  const handleChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const action = isStoreOpen ? strOpnSection : strClsSection;
  const groupedQuestions: GroupedQuestions = useMemo(
    () =>
      (action || []).reduce(
        (acc: GroupedQuestions, section: string) => {
          const filtered = (resultStoreActionQues || []).filter((q: StoreQuestion) => q.QUESTIONSDESC.startsWith(`${section}~`));
          acc[section] = filtered;
          return acc;
        },
        {} as Record<string, any[]>,
      ),
    [resultStoreActionQues, strOpnSection, strClsSection, isStoreOpen],
  );

  const renderQuestionInput = (question: any) => {
    const { QUESTIONTYPE, DISPLAYVALUES, QUESTIONID, DEFAULTVALUES } = question;
    const displayValues = DISPLAYVALUES.split('~');

    switch (QUESTIONTYPE) {
      case STRINGS.BOOLEAN: {
        const options = displayValues.map((val: string) => ({ text: val, value: val }));
        return (
          <View style={styles.optionRow}>
            <RadioContainer
              items={options}
              selectedValue={answers[QUESTIONID]}
              onSelectionChange={(selected: string) => handleChange(QUESTIONID, selected)}
              containerStyle={styles.optionRow}
              noDefaultSelect
            />
          </View>
        );
      }
      case STRINGS.CHECKBOX:
        return (
          <View>
            {displayValues.map((val: string) => (
              <Checkbox
                key={val}
                label={val}
                value={answers[QUESTIONID]?.includes(val)}
                onValueChange={(checked) => {
                  const prevVals = answers[QUESTIONID] || [];
                  const newVals = checked ? [...prevVals, val] : prevVals.filter((v: string) => v !== val);
                  handleChange(QUESTIONID, newVals);
                }}
              />
            ))}
          </View>
        );

      case STRINGS.TEXT_INPUT:
        return <IconTextInput placeholder={DEFAULTVALUES} value={answers[QUESTIONID] || ''} onInputChange={(text) => handleChange(QUESTIONID, text)} />;

      default:
        return null;
    }
  };

  const handleProcced = async () => {
    const allQuestionIds = resultStoreActionQues.map((q: StoreQuestion) => q.QUESTIONID);

    const unanswered = allQuestionIds.filter((id: number) => {
      const answer = answers[id];
      return answer === undefined || answer === null || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && answer.trim() === '');
    });
    if (unanswered.length > 0) {
      const alertMessage = `${i18next.t('strings.allRequiredAns')}`;
      return dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
    }

    const actionType = isStoreOpen ? ACTION_TYPE.STORE_OPEN : ACTION_TYPE.STORE_CLOSE;
    try {
      const preCheckResponse = await dispatch(callAction({ actionType }, 'checkStoreStatus'));
      const isAllowed = preCheckResponse?.resultstoreCheckDetails === STRINGS.EXIST;
      if (isAllowed) {
        const msg = isStoreOpen ? `${i18next.t('strings.strOpnAlrSubmit')}` : `${i18next.t('strings.strClsAlrSubmit')}`;
        dispatch(uiActions.showAlert(msg, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
        return { status: false };
      }
      const submitPromises = Object.entries(answers).map(([questionId, ansValue]) =>
        dispatch(callAction({ action: actionType, questionId: Number(questionId), answer: ansValue }, QUERY.submitStoreAns)),
      );

      await Promise.all(submitPromises);
      const msg = isStoreOpen ? i18next.t('strings.storeOpenChecklist') : i18next.t('strings.storeCloseChecklist');
      dispatch(uiActions.showAlert(msg, ALERT.SUCCESS, { primaryText: MODAL.OK }, {}));
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  };

  const handleCancel = () => {
    navigate(ROUTE.WEB.EXCLUSIVE_STORE);
  };
  let questionCounter = 0;
  return (
    <SafeAreaView style={[styles.container]} testID="BoxUpgradeSuccess">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <View>
            <Text style={styles.headerText}>{isStoreOpen ? t('strings.storeOpenChecklistHeading') : t('strings.storeCloseChecklistHeading')}</Text>
          </View>
          <View>
            <DateAndTimeDetails />
          </View>
          {(action || []).map((section: string) => (
            <View key={section} style={styles.section}>
              <Text style={styles.sectionTitle} label={section} />
              {groupedQuestions[section]?.map((question: StoreQuestion) => {
                questionCounter += 1;
                const desc = question.QUESTIONSDESC.split('~')[1] || question.QUESTIONSDESC;
                return (
                  <View key={question.QUESTIONID} style={styles.questionCard}>
                    <Text label={`${questionCounter}. ${desc}`} style={styles.questionText} />
                    {renderQuestionInput(question)}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <View>
          <Text style={styles.infoText}>{i18next.t('strings.checklistSubmitionWarning')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
            <Button onPress={handleProcced} label={t('strings.proceed')} fontSize={Sizing.layout.x16} />
            <Button onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline type={STYLES.TYPE.SECONDARY} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(ExclusiveStoreQuestion);
