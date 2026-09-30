import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { handleEngValidation } from 'store/sales/actions/utility/utility.action';

export const useEnglishInputValidation = (onChangeCallback?: (text: string) => void, initialValue = '') => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [inputError, setInputError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // eslint-disable-next-line no-control-regex
  const isEnglishText = (text: string): boolean => /^[\x00-\x7F]*$/.test(text); // ASCII only

  const { t } = useTranslation();

  useEffect(() => {
    const isEngValidate = !inputError;
    dispatch(handleEngValidation(isEngValidate));
  }, [inputError]);

  const onInputChange = (text: string) => {
    if (!isEnglishText(text)) {
      const errorMsg = t(`errors.engValidationError`);
      setInputError(errorMsg);
    } else {
      setInputError(null);
    }
    setInputValue(text);
    if (onChangeCallback) {
      onChangeCallback(text);
    }
  };

  return {
    inputValue,
    inputError,
    onInputChange,
    setInputValue,
    setInputError,
  };
};
