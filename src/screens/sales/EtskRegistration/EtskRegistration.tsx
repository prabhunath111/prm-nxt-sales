/**
 * This screen is used to add etsk regisration module screen
 *
 * @module components/EtskRegistration
 * @memberof - View Component
 */
import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Pressable, KeyboardAvoidingView } from 'react-native';
import { CustomerDetailsCard, Text, OfferSelectionTable, Search, Button, PillsGroup, PacksListItem, Image, List, BottomModal, MultiFilters, TextContainer } from 'components/sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { callAction } from 'utils/formBuilderHelper';
import { STRINGS, STYLES, ICONS, CHILD_TYPE, ROUTE, QUERY, PROPERTIES, ALERT, MODAL } from 'const';
import { Sizing, Colors } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { changeCategory, doGetPacksETSK, doGetRentlPackETSK, checkRentalPackFlag, doCheckRentalPackFlagPrice } from 'store/sales/actions/etskRegistration/etskRegistration.action';
import { doGetRentalPackNewPartnerQuoteEtsk, doGetRentalPackNewPartnerQuote } from 'store/sales/actions/quotation/quotation.action';
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as commonActions } from 'store/sales/reducer/common';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import uiActions from 'store/sales/actions/ui';
import useCurrentRoute from 'hooks/useCurrentRoute';
import Autocomplete from 'components/sales/Autocomplete';
import { getScreenWidth } from 'styles/dimentionHelper';
import { formatDurationForUI, getAllCategoryNames, hasDisabledCategory } from 'utils/responseHelper';
import { isiOS } from 'utils/platformHelper';
import styles from './EtskRegistration.styles';

/**
 * Represents a EtskRegistration component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const EtskRegistration = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    filtersData,
    accountCreationSuccessData,
    categorySelectedPacksData,
    selectedPacksToBuy,
    categorySelectedRed,
    durationSelectedRed,
    selctedPillRed,
    categoryDropdownDataRed,
    durationDropdownDataRed,
  } = useSelector((state: RootState) => state.etskRegistration);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { navigate } = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState<{ id: string; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<{ id: string; name: string }[]>([]);
  const [selectedBoxType, setSelectedBoxType] = useState<{ id: string; name: string }[]>([]);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const { routeName } = useCurrentRoute();
  const screenWidth = getScreenWidth();
  const isMobileView = screenWidth <= Sizing.layout.x500;

  const isInCart = (item: ParentObject) => {
    // Normalize selected category names: trim + lowercase
    const selectedCategoryNames = new Set(getAllCategoryNames(selectedPacksToBuy).map((name) => name?.trim().toLowerCase()));

    return selectedPacksToBuy.some((cartItem: ParentObject) => {
      const sameSiebel = cartItem.siebelName === item.siebelName;

      if (!item?.category) {
        return sameSiebel;
      }

      // Normalize item category: trim + lowercase
      const itemCategoryName =
        typeof item.category === 'string' ? item.category.trim().toLowerCase() : item.category.nameNT?.trim().toLowerCase() || item.category.name?.trim().toLowerCase() || '';

      return sameSiebel && selectedCategoryNames.has(itemCategoryName);
    });
  };

  const hasMounted = useRef(false);

  const manageSelectedPill = (text: string) => {
    dispatch(sliceActions.etskSetSelectedPill(text));
    dispatch(changeCategory(text, STRINGS.PILLS));
    dispatch(sliceActions.etskSetCategorySelected(undefined));
    // check selected category is Dhamaka or cod
    const isEligibleRoute = [ROUTE.WEB.WO_RECREATION_CHANNELS, ROUTE.WEB.PRIMARY_REGISTRATION_CHANNELS, ROUTE.WEB.RE_PUSH_ORDER_CHANNELS].includes(routeName);

    const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];
    if (isEligibleRoute) {
      const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, bingeOffers);
      if (hasMatch) {
        dispatch(sliceActions.etskSetDurationDropdownData([{ name: t('strings.MONTHLY'), value: STRINGS.MONTHLY }]));
      }
    }

    dispatch(sliceActions.etskSetDurationSelected(undefined));
    dispatch(commonActions.setDropdownVisibility(false));
  };

  const handlePillPress = (text: string) => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    manageSelectedPill(text);
    setSearchQuery('');
  };

  const closeModalHandler = () => {
    setModalVisible(false);
  };
  const closeCartHandler = () => {
    setIsCartVisible(false);
  };

  const manageSelectedCategory = (value: ParentObject) => {
    setSearchQuery('');
    if (value) {
      dispatch(sliceActions.etskSetCategorySelected(value));
      setHasUserInteracted(true);
      dispatch(sliceActions.etskSetDurationSelected({ name: t('strings.All'), value: STRINGS.ALL }));
      let queryName = '';
      switch (routeName) {
        case ROUTE.WEB.PRIMARY_REGISTRATION_CHANNELS:
        case ROUTE.WEB.RE_PUSH_ORDER_CHANNELS:
        case ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS: {
          queryName = QUERY.GetPacks;
          dispatch(callAction({ value, filters: { selectedLanguages, selectedGenre, selectedBoxType } }, queryName));
          const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
          const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];
          const durations = accountCreationSuccessData?.durations || [];
          if (selectedPacksToBuy.length > 0) {
            const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, bingeOffers);
            const durationData = hasMatch ? [{ name: t('strings.MONTHLY'), value: STRINGS.MONTHLY }] : durations;
            dispatch(sliceActions.etskSetDurationDropdownData(durationData));
            const selectedDuration = hasMatch ? { name: t('strings.MONTHLY'), value: STRINGS.MONTHLY } : { name: t('strings.All'), value: STRINGS.ALL };
            dispatch(sliceActions.etskSetDurationSelected(selectedDuration));
          } else {
            dispatch(sliceActions.etskSetDurationDropdownData(durations));
          }
          break;
        }
        case ROUTE.WEB.WO_RECREATION_CHANNELS: {
          queryName = STRINGS.GET_WO_PACKS;
          dispatch(callAction({ value, filters: { selectedLanguages, selectedGenre, selectedBoxType } }, queryName));
          const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
          const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];
          const durations = accountCreationSuccessData?.durations || [];
          if (selectedPacksToBuy.length > 0) {
            const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, bingeOffers);
            const durationData = hasMatch ? [{ name: t('strings.MONTHLY'), value: STRINGS.MONTHLY }] : durations;
            dispatch(sliceActions.etskSetDurationDropdownData(durationData));
            const selectedDuration = hasMatch ? { name: t('strings.MONTHLY'), value: STRINGS.MONTHLY } : { name: t('strings.All'), value: STRINGS.ALL };
            dispatch(sliceActions.etskSetDurationSelected(selectedDuration));
          } else {
            dispatch(sliceActions.etskSetDurationDropdownData(durations));
          }
          break;
        }
        case ROUTE.WEB.BOX_TYPE_CHANNELS: {
          queryName = QUERY.getWoPacksBoxType;
          dispatch(callAction({ value, filters: { selectedLanguages, selectedGenre, selectedBoxType } }, queryName));
          const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
          const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];
          const durations = accountCreationSuccessData?.durations || [];
          if (selectedPacksToBuy.length > 0) {
            const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, bingeOffers);
            const durationData = hasMatch ? [{ name: t('strings.Monthly'), value: STRINGS.MONTHLY }] : durations;
            dispatch(sliceActions.etskSetDurationDropdownData(durationData));
            const selectedDuration = hasMatch ? { name: t('strings.Monthly'), value: STRINGS.MONTHLY } : { name: t('strings.All'), value: STRINGS.ALL };
            dispatch(sliceActions.etskSetDurationSelected(selectedDuration));
          } else {
            dispatch(sliceActions.etskSetDurationDropdownData(durations));
          }
          break;
        }
        default:
          queryName = selctedPillRed === STRINGS.BINGE_PLUS_CATEGORY ? STRINGS.DO_GET_BINGE_PLUS_PACKS : STRINGS.DO_GET_PACKS;
          dispatch(doGetPacksETSK({ value, filters: { selectedLanguages, selectedGenre, selectedBoxType } }, queryName));
          break;
      }
    } else {
      dispatch(sliceActions.etskSetCategorySelected(undefined));
    }
  };

  const handleDurationSelect = (item: ParentObject | null) => {
    if (item) {
      dispatch(sliceActions.etskSetDurationSelected(item));
    } else {
      dispatch(sliceActions.etskSetDurationSelected(undefined));
    }
  };

  const handlePacksSubmission = () => {
    const goTo = async (route: string) => {
      await dispatch(uiActions.clearLoader());
      navigate(route);
    };
    switch (routeName) {
      case ROUTE.WEB.PRIMARY_REGISTRATION_CHANNELS:
        dispatch(callAction({}, QUERY.GetRentalPackNew)).then((response: ParentObject) => {
          if (response) goTo(ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY);
        });
        break;

      case ROUTE.WEB.RE_PUSH_ORDER_CHANNELS:
        dispatch(callAction({}, QUERY.GetRentalPackNew)).then((response: ParentObject) => {
          if (response) goTo(ROUTE.WEB.RE_PUSH_ORDER_SUMMARY);
        });
        break;

      case ROUTE.WEB.WO_RECREATION_CHANNELS:
        dispatch(callAction({}, STRINGS.GET_WO_RENTAL_PACK)).then((response: ParentObject) => {
          if (response?.status) goTo(ROUTE.WEB.WO_RECREATION_SUMMARY);
        });
        break;

      case ROUTE.WEB.BOX_TYPE_CHANNELS:
        dispatch(callAction({}, QUERY.getRentalPackBoxType)).then((response: ParentObject) => {
          if (response?.status) goTo(ROUTE.WEB.BOX_TYPE_SUMMARY);
        });
        break;
      case ROUTE.WEB.QUOTATION_ETSK_CHANNELS:
        dispatch(doGetRentalPackNewPartnerQuoteEtsk({}, QUERY.DoGetRentalPackNewPartnerQuoteEtsk)).then((response: ParentObject) => {
          if (response?.status) goTo(ROUTE.WEB.QUOTATION_ETSK_SUMMARY);
        });
        break;
      case ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS:
        dispatch(doGetRentalPackNewPartnerQuote({}, QUERY.DoGetRentalPackNewPartnerQuote)).then((response: ParentObject) => {
          if (response?.status) goTo(ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY);
        });
        break;

      default:
        dispatch(checkRentalPackFlag({}, QUERY.checkRentalPackFlag))
          .then((response: ParentObject) => {
            if (response?.rentalFlag === STRINGS.YES) {
              return dispatch(doGetRentlPackETSK({}, STRINGS.DO_GET_RENTAL_PACKS));
            }
            return dispatch(doCheckRentalPackFlagPrice({}, QUERY.doCheckRentalPackFlagPrice));
          })
          .then((response: ParentObject) => {
            if (response) {
              const targetRoute = routeName === ROUTE.WEB.ETSK_REPUSH_CHANNELS ? ROUTE.WEB.ETSK_REPUSH_SUMMARY : ROUTE.WEB.ETSK_REGISTRATION_SUMMARY;
              goTo(targetRoute);
            }
          });
        break;
    }
  };

  const handleViewDetails = (item: ParentObject) => {
    setIsCartVisible(false);
    dispatch(callAction({ offerName: item.siebelNameNT, packPrice: String(item.price) }, QUERY.GetOfferPackDetails))
      ?.then(async (response: ParentObject) => {
        if (response?.status) {
          await dispatch(uiActions.clearLoader());
          switch (routeName) {
            case ROUTE.WEB.PRIMARY_REGISTRATION_CHANNELS:
              navigate(ROUTE.WEB.PRIMARY_REG_OFFERS_DETAILS);
              break;
            case ROUTE.WEB.RE_PUSH_ORDER_CHANNELS:
              navigate(ROUTE.WEB.RE_PUSH_ORDER_OFFERS_DETAILS);
              break;
            case ROUTE.WEB.WO_RECREATION_CHANNELS:
              navigate(ROUTE.WEB.WO_OFFER_VIEW_DETAILS);
              break;
            case ROUTE.WEB.ETSK_REPUSH_CHANNELS:
              navigate(ROUTE.WEB.ETSK_REPUSH_OFFERS_VIEW_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_ETSK_CHANNELS:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_MULTITV_SUMMARY:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.BOX_TYPE_CHANNELS:
              navigate(ROUTE.WEB.BOX_TYPE_CHANGE_DETAILS);
              break;
            default:
              navigate(ROUTE.WEB.ETSK_OFFERS_VIEW_DETAILS);
              break;
          }
        } else {
          dispatch(uiActions.clearLoader());
          // Optional: Show error message here if needed
        }
      })
      .catch(() => {
        dispatch(uiActions.clearLoader());
      });
  };

  const totalFiltersSelected = (selectedGenre?.length ?? 0) + (selectedLanguages?.length ?? 0) + (selectedBoxType?.length ?? 0);

  const [filteredData, setFilteredData] = useState(categorySelectedPacksData);

  useEffect(() => {
    const timer = setTimeout(() => {
      let result = categorySelectedPacksData;

      if (durationSelectedRed?.value && durationSelectedRed.value.toLowerCase() !== STRINGS.ALL.toLowerCase()) {
        const selectedDuration = formatDurationForUI(durationSelectedRed.value);
        result = result.filter((item: ParentObject) => formatDurationForUI(item.durationNT) === selectedDuration);

        if (result.length === 0) {
          dispatch(uiActions.showAlert(`${t('strings.noPackForFilter')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
        }
      }

      if (searchQuery?.trim()) {
        const query = searchQuery.trim().toLowerCase();
        result = result.filter(
          (item: ParentObject) =>
            item.friendlyName?.toLowerCase().includes(query) ||
            item.siebelName?.toLowerCase().includes(query) ||
            item.price?.toLowerCase().includes(query) ||
            item.siebelNameNT?.toLowerCase().includes(query),
        );
      }

      setFilteredData(result);
    }, 200);

    return () => clearTimeout(timer); // clean up if dependencies change
  }, [categorySelectedPacksData, durationSelectedRed?.value, searchQuery]);

  useEffect(() => {
    if (categorySelectedPacksData.length > 0) {
      const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
      const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];
      const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, bingeOffers);
      if (hasMatch && filteredData.length === 0) {
        dispatch(uiActions.showAlert(`${t('strings.noPackForFilter')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
      }
    }
  }, [filteredData]);

  const disableLDPPacks = accountCreationSuccessData?.disableLDPPacks || [];
  const bingeOffers = accountCreationSuccessData?.bingeOfferArrRes || [];

  const getRenderItem = (listData: ParentObject) => (
    <PacksListItem
      data={listData}
      isOfferAdded={isInCart(listData)}
      onAddOffer={(value: ParentObject) => {
        switch (routeName) {
          case ROUTE.WEB.WO_RECREATION_CHANNELS:
          case ROUTE.WEB.PRIMARY_REGISTRATION_CHANNELS:
          case ROUTE.WEB.RE_PUSH_ORDER_CHANNELS:
          case ROUTE.WEB.BOX_TYPE_CHANNELS:
          case ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS: {
            const selectedCategoryName = categorySelectedRed?.nameNT;
            const isDisabledCategory = disableLDPPacks.some((disPack: ParentObject) => disPack.category === selectedCategoryName);

            if (isDisabledCategory) {
              dispatch(sliceActions.etskSetDurationDropdownData([{ name: t('strings.MONTHLY'), value: STRINGS.MONTHLY }]));
              dispatch(sliceActions.etskClearSelectedPacksToBuyData());
              dispatch(
                sliceActions.etskSetDurationSelected({
                  name: t('strings.MONTHLY'),
                  value: STRINGS.MONTHLY,
                }),
              );
            }

            if (bingeOffers.includes(selectedCategoryName)) {
              dispatch(sliceActions.etskSetDurationDropdownData([{ name: t('strings.MONTHLY'), value: STRINGS.MONTHLY }]));
              const selectedPacksToBuyAll = selectedPacksToBuy;
              dispatch(sliceActions.etskClearSelectedPacksToBuyData());
              dispatch(
                sliceActions.etskSetDurationSelected({
                  name: t('strings.MONTHLY'),
                  value: STRINGS.MONTHLY,
                }),
              );

              // Reuse category names for lookup
              const ldpCategoryNames = disableLDPPacks?.map((pack: ParentObject) => pack.category).filter(Boolean) as string[];

              const disableLDPPack = selectedPacksToBuyAll?.find((pack: ParentObject) => ldpCategoryNames.includes(pack?.category?.nameNT));

              if (disableLDPPack) {
                dispatch(sliceActions.etskAddSelectedPacksToBuyData(disableLDPPack));
              }
            }

            break;
          }

          default:
            break;
        }
        dispatch(sliceActions.etskAddSelectedPacksToBuyData({ ...value, category: categorySelectedRed, pill: selctedPillRed }));
      }}
      onRemoveOffer={(value: ParentObject) => {
        dispatch(sliceActions.etskRemoveSelectedPacksToBuyData(value));

        const splOfferArrChkFlag = disableLDPPacks?.some((disPack: ParentObject) => value?.category === disPack.category) || false;
        if (splOfferArrChkFlag) {
          const bingeOffersFlag = selectedPacksToBuy?.some((pack: ParentObject) => bingeOffers.includes(pack?.category?.nameNT));
          if (!bingeOffersFlag) {
            dispatch(sliceActions.etskSetDurationDropdownData(accountCreationSuccessData?.durations || []));
            dispatch(sliceActions.etskSetDurationSelected({ name: t('strings.All'), value: STRINGS.ALL }));
          }
        }
      }}
      onViewDetails={() => handleViewDetails(listData)}
    />
  );

  const getProps = (title: string, closeHandler: () => void, visible: boolean) => ({
    type: CHILD_TYPE.DASHBOARD_MODAL,
    isModalVisible: visible,
    showCloseIcon: true,
    isCenterModal: true,
    showHeader: true,
    onClose: closeHandler,
    headerTitle: t(`strings.${title}`),
  });

  const openModalHandler = () => {
    setModalVisible(true);
  };
  const openCartHandler = () => {
    setIsCartVisible(true);
  };

  const clearFilterHandler = () => {
    setSelectedLanguages([]);
    setSelectedGenre([]);
    setSelectedBoxType([]);
  };
  const applyFiltersHandler = () => {
    closeModalHandler();
    dispatch(sliceActions.etskSetCategorySelected(undefined));
    dispatch(sliceActions.etskSetDurationSelected(undefined));
  };

  const filteredFilterData = useMemo(() => {
    if (!searchValue.trim()) return filtersData;

    const lowerSearch = searchValue.toLowerCase();

    const filterCategory = (category: ParentObject) => ({
      ...category,
      data: category.data.filter(
        (item: ParentObject) =>
          item.name.toLowerCase().includes(lowerSearch) || item.nameNT.toLowerCase().includes(lowerSearch) || item.secondaryName?.toLowerCase().includes(lowerSearch),
      ),
    });

    return {
      languages: filterCategory(filtersData.languages),
      genre: filterCategory(filtersData.genre),
      boxType: filterCategory(filtersData.boxType),
    };
  }, [searchValue, filtersData]);

  const modalContent = (
    <>
      <Search
        searchStyles={styles.searchStyle}
        innerContainer={styles.searchInnerContainer}
        inputFeildStyle={styles.inputFeildStyle}
        value={searchValue}
        onChange={(val) => setSearchValue(val)}
        placeholder={t('strings.filterByKeywords')}
        hasIcon={false}
      />
      <View style={styles.scrollContainer}>
        <MultiFilters
          data={filteredFilterData}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedBoxType={selectedBoxType}
          setSelectedBoxType={setSelectedBoxType}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.cancelButton}
          onPress={clearFilterHandler}
          label={t('strings.clear')}
          type={STYLES.TYPE.SECONDARY}
          fontColor={Colors.neutral.black}
          fontSize={Sizing.layout.x16}
        />
        <Button onPress={applyFiltersHandler} label={t('strings.applyFilter')} fontSize={Sizing.layout.x16} />
      </View>
    </>
  );
  const cartContent = (
    <View style={styles.cartList}>
      <List
        data={selectedPacksToBuy}
        renderItem={({ item }) => getRenderItem(item)}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text label={t('strings.noOffersAdded')} fontSize={Sizing.layout.x20} />
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container]} testID="EtskRegistration">
      <KeyboardAvoidingView style={styles.container} behavior={isiOS() ? 'padding' : 'position'} keyboardVerticalOffset={isiOS() ? Sizing.layout.x20 : Sizing.layout.x0}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator>
          <View
            style={[
              styles.detailsCardContainer,
              styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
              styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            ]}
          >
            {routeName !== ROUTE.WEB.QUOTATION_ETSK_CHANNELS && routeName !== ROUTE.WEB.QUOTATION_PRIMARY_CHANNELS && (
              <CustomerDetailsCard
                secondaryStyle={styles.secondaryBookingNumber}
                primaryStyle={styles.secondaryBookingNumber}
                keysToShow={
                  (routeName === ROUTE.WEB.ETSK_REGISTRATION_CHANNELS || routeName === ROUTE.WEB.ETSK_REPUSH_CHANNELS) && !isMobileView
                    ? PROPERTIES.ETSK_REGISTRATION.CUSTOMER_DETAILS_ETSK
                    : undefined
                }
              />
            )}
            <View style={[styles.paddingContainer, styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
              {(routeName === ROUTE.WEB.ETSK_REGISTRATION_CHANNELS || routeName === ROUTE.WEB.ETSK_REPUSH_CHANNELS) && isMobileView ? (
                <View style={styles.etskContainer}>
                  <TextContainer
                    itemContainerStyle={styles.textWrapperManage}
                    data={{
                      bookingFormNumber: accountCreationSuccessData.bookingFormNumber,
                    }}
                    dataArray={PROPERTIES.ETSK_REGISTRATION.BOOKING_FORM_NUMBER}
                    hasSepratorBottom
                    secondaryStyle={styles.secondaryBookingNumber}
                    primaryStyle={styles.secondaryBookingNumber}
                  />
                </View>
              ) : null}

              <Text style={styles.titleLeftText}>{t('strings.ADD_PACKS_CHANNELS')}</Text>
              <OfferSelectionTable placeholder1={t('strings.DURATION')} placeholder2={t('strings.SELECT_OFFER_TYPE')} placeholder3={t('strings.SELECT_OFFER_NAME')} />
              <Text style={styles.mediumLeftText}>{t('strings.SELECT_PACKS_CHANNELS')}</Text>
              <PillsGroup
                itemsArr={JSON.parse(JSON.stringify(accountCreationSuccessData.offerCategories || []))}
                onPillPress={handlePillPress}
                defaultSelected
                selectedPillText={selctedPillRed}
                showsHorizontalScrollIndicator
              />
              <View style={styles.rowContainerCenter}>
                <View style={styles.dropDownContainer}>
                  <Autocomplete
                    placeholder={t('strings.SELECT_CATEGORY')}
                    containerStyle={styles.outerContainer}
                    innerContainerStyle={styles.innerDropDown}
                    queryName={STRINGS.CATEGORY_DROPDOWN}
                    selectedValue={categorySelectedRed}
                    onSelect={manageSelectedCategory}
                    isCloseIconRequired={false}
                    queryParams="searchLocally"
                    actionNeeded={false}
                    data={categoryDropdownDataRed}
                  />
                </View>
                <View style={styles.dropDownContainer}>
                  <Autocomplete
                    placeholder={t('strings.SELECT_DURATION')}
                    containerStyle={styles.outerContainer}
                    innerContainerStyle={styles.innerDropDown}
                    queryName={STRINGS.DURATION_DROPDOWN}
                    selectedValue={durationSelectedRed}
                    onSelect={handleDurationSelect}
                    isCloseIconRequired={false}
                    queryParams="searchLocally"
                    actionNeeded={false}
                    data={durationDropdownDataRed}
                  />
                </View>
              </View>
              <View style={styles.rowContainerCenter}>
                <View style={styles.itemViewStyle}>
                  <Search placeholder={t('strings.SEARCH_FOR_A_OFFER')} searchStyles={styles.minWidthContainer} value={searchQuery} onChange={setSearchQuery} />
                </View>
                <View>
                  <Button
                    type={STYLES.TYPE.VIOLET}
                    outline
                    style={styles.filter}
                    label={t('strings.filters')}
                    iconName={ICONS.FILTERS}
                    iconPosition={STYLES.POSITION.LEFT}
                    iconHeight={Sizing.layout.x1Dot5}
                    iconWidth={Sizing.layout.x1Dot5}
                    iconStyle={styles.primaryIconStyle}
                    onPress={() => openModalHandler()}
                  />
                  {totalFiltersSelected > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalFiltersSelected}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View>
                <List
                  testID="searchBarItemTest"
                  data={categorySelectedRed ? filteredData : []}
                  renderItem={({ item }) => getRenderItem(item)}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled
                  ListEmptyComponent={
                    hasUserInteracted ? (
                      <View style={styles.emptyContainer}>
                        <Text label={t('strings.noOffersApplicable')} fontSize={Sizing.layout.x20} />
                      </View>
                    ) : null
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <View style={styles.cartContainer}>
            <Pressable style={styles.iconContainer} onPress={() => openCartHandler()}>
              <Image iconName={ICONS.CART} width={Sizing.layout.x2} height={Sizing.layout.x2} />
              {selectedPacksToBuy?.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedPacksToBuy.length}</Text>
                </View>
              )}
            </Pressable>
            <Text>{t('strings.itemsAdded')}</Text>
          </View>
          <Button style={styles.button} onPress={handlePacksSubmission} label={t('strings.proceed')} fontSize={Sizing.layout.x16} />
        </View>
      </View>
      <BottomModal modalProps={getProps(STRINGS.Filters, closeModalHandler, isModalVisible)}>{modalContent}</BottomModal>
      <BottomModal modalProps={getProps(STRINGS.cart, closeCartHandler, isCartVisible)}>{cartContent}</BottomModal>
    </SafeAreaView>
  );
};

export default memo(EtskRegistration);
