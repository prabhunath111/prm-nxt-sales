import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AddPackageOffer from 'components/sales/AddPackageOffer';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ParentObject } from 'store/sales/types/common';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { OFFER_TYPE, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import useNavigate from 'hooks/useNavigate';
import actions from 'store/sales/actions';
import Search from 'components/sales/Search';
import Text from 'components/sales/Text';
import styles from './PackageOffersWrapper.styles';
import RadioContainer, { RadioItem } from '../RadioContainer';

export type PackageOffersWrapperProps = {
  onRemove?: () => void;
  onItemSelect?: () => void;
};

const PackageOffersWrapper = ({ onRemove = () => {}, onItemSelect = () => {} }: PackageOffersWrapperProps) => {
  const { t } = useTranslation();
  const { winBackPacks } = useSelector((state: RootState) => state.rechargeWinback);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<ParentObject | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [optionData, setOptionData] = useState(winBackPacks?.winbackOffers?.packs);
  const allPacks = winBackPacks?.winbackOffers?.packs;
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const boxDetails = winBackPacks?.accountInfo?.boxDetails?.[0];

  useEffect(() => {
    if (allPacks?.length > 0) {
      const normalizedWinBackPacks = allPacks.map((pack: ParentObject) => ({
        ...pack,
        stdPriUnit: pack.stdPriUnit?.toString() ?? '',
      }));

      let filteredData = normalizedWinBackPacks;
      // Filter by selectedFilter if it's not "All"
      if (selectedFilter && selectedFilter !== STRINGS.ALL) {
        filteredData = filteredData.filter((pack: ParentObject) => pack.uom === selectedFilter);
      }
      // Filter if boxType will be standard then show all non HD packs
      if (boxDetails?.boxType === STRINGS.STANDARD) {
        filteredData = filteredData.filter((pack: ParentObject) => pack.boxType !== STRINGS.HD);
      }
      // Further filter by searchValue if present
      if (searchValue) {
        filteredData = filterByParams(filteredData, {
          nameNT: searchValue,
          margin: searchValue,
          stdPriUnit: searchValue,
        });
      }
      setOptionData(filteredData);
    }
  }, [searchValue, allPacks, selectedFilter]);

  const handleSelectOffer = (offer: ParentObject) => {
    dispatch(actions.setWinBackPack(offer));
    setSelectedOffer(offer);
    onItemSelect();
  };

  const handleRemoveOffer = () => {
    setSelectedOffer(null);
    onRemove();
  };

  const handleViewDetails = (item: ParentObject) => {
    dispatch(
      callAction({ offerName: item.nameNT || item.packNameNT, packPrice: item.stdPriUnit ? String(item.stdPriUnit) : String(item.packPrice) }, QUERY.GetOfferPackDetails),
    )?.then((response: ParentObject) => {
      if (response?.status) {
        navigate(ROUTE.WEB.RECHARGE_WIN_BACK_VIEW_DETAILS);
      }
    });
  };

  return (
    <View style={styles.accordianChildren} testID="packageOfferTest">
      <Text style={styles.itemTextStyle}>Duration</Text>
      <RadioContainer
        radioItemContainer={[styles.radioItemBorder, { flex: null }]}
        containerStyle={styles.radioContainer}
        items={PROPERTIES.RECHARGE_WINBACK.PACKS_DURATION_FILTER as RadioItem[]}
        onSelectionChange={(text) => setSelectedFilter(text)}
        selectedValue={selectedFilter}
      />
      <Search searchStyles={styles.searchStyle} value={searchValue} onChange={(val) => setSearchValue(val)} placeholder={t('strings.searchPackage')} hasIcon />
      {optionData?.length > 0 ? (
        optionData?.map((offer: ParentObject) => (
          <AddPackageOffer
            key={offer.id}
            data={offer}
            isOfferAdded={selectedOffer?.name === offer.name}
            onAddOffer={() => handleSelectOffer(offer)}
            onRemoveOffer={handleRemoveOffer}
            onViewDetails={() => handleViewDetails(offer)}
            offerType={OFFER_TYPE.rechargeWinback}
          />
        ))
      ) : (
        <Text style={styles.noDataText}>{t('errors.searchResultText')}</Text>
      )}
    </View>
  );
};

export default PackageOffersWrapper;
