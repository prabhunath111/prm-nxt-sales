// hooks/usePathNavigator.ts
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import useNavigate from 'hooks/useNavigate';
import actions from 'store/sales/actions';
import { CHILD_TYPE, FORMS, ROUTE } from 'const';
import { LOG } from 'config/logger';
import { useTranslation } from 'react-i18next';

const usePathNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { t } = useTranslation();

  const goToPath = async (path: string): Promise<void> => {
    if (!path) {
      LOG.warn(`No route found for path: ${path}`);
      navigate(ROUTE.WEB.DEFAULT);
      return;
    }
    switch (path) {
      case FORMS.demoBoxDetail:
        dispatch(
          actions.showBottomModal({
            isModalVisible: true,
            isCenterModal: true,
            type: CHILD_TYPE.DYNAMIC_FORM,
            headerTitle: t('forms.demoBoxDetails'),
            showCloseIcon: true,
            showHeader: true,
            formName: FORMS.demoBoxDetail,
          }),
        );
        break;

      default:
        navigate(path);
        break;
    }
  };
  return goToPath;
};

export default usePathNavigator;
