/**
 * Materials raise request screen for purchase order
 *
 * @module components/MaterialsRaiseRequest
 * @memberof - View Component
 */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Button, Image, List, PillsGroup, Search, Text } from 'components/sales';
import { Sizing } from 'styles';
import uiActions from 'store/sales/actions/ui';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, ICONS, MODAL, QUERY, ROUTE } from 'const';
import { LOG } from 'config/logger';
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import styles from './MaterialsRaiseRequest.styles';

/**
 * Represents a MaterialsRaiseRequest component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const MaterialsRaiseRequest = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { materialDetailsData, selectedMaterial, selectedMaterialPill } = useSelector((state: RootState) => state.purchaseOrder);
  const { isRedirection } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(callAction({}, QUERY.GetPOSMData));
  }, []);

  const filteredData = useMemo(() => {
    let result = materialDetailsData?.posmProductsArray ?? [];

    if (selectedMaterialPill && selectedMaterialPill !== t('strings.All')) {
      result = result.filter((item: ParentObject) => {
        const type = item.materialType?.toUpperCase();
        if (selectedMaterialPill === t('strings.POS')) {
          return type?.startsWith(t('strings.POS'));
        }
        if (selectedMaterialPill === t('strings.TSK&RCV')) {
          return type === t('strings.TSK') || type === t('strings.RCV');
        }
        return type === selectedMaterialPill;
      });
    }

    if (searchQuery?.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter(
        (item: ParentObject) =>
          item.productFriendlyNameNT?.toLowerCase()?.includes(query) ||
          item.productNameNT?.toLowerCase()?.includes(query) ||
          item.productCodeNT?.toLowerCase()?.includes(query) ||
          item.materialTypeNT?.toLowerCase()?.includes(query),
      );
    }

    return result;
  }, [materialDetailsData?.posmProductsArray, searchQuery, selectedMaterialPill]);

  const raiseTheRequest = () => {
    // Process the selected materials with their quantities
    LOG.info('Selected Materials:', selectedMaterial);
    navigate(ROUTE.WEB.MATERIALS_SUMMARY, { selectedMaterial });
  };

  const addMaterial = (item: ParentObject, countChange: number) => {
    const existingIndex = selectedMaterial.findIndex((mat: ParentObject) => mat.productCode === item.productCode);

    if (existingIndex !== -1) {
      const updatedMaterials = [...selectedMaterial];
      const newCount = updatedMaterials[existingIndex].totalCount + countChange;

      if (newCount <= 0) {
        updatedMaterials.splice(existingIndex, 1);
      } else {
        updatedMaterials[existingIndex] = {
          ...updatedMaterials[existingIndex],
          totalCount: newCount,
        };
      }
      dispatch(sliceActions.setSelectedMaterial(updatedMaterials));
      return;
    }

    if (countChange > 0) {
      dispatch(
        sliceActions.setSelectedMaterial([
          ...selectedMaterial,
          {
            productCode: item.productCode,
            productName: item.productName,
            productFriendlyName: item.productFriendlyName,
            materialType: item.materialType,
            totalCount: countChange,
          },
        ]),
      );
    }
  };

  const getItemCount = (productCode: string) => {
    const item = selectedMaterial.find((mat: ParentObject) => mat.productCode === productCode);
    return item ? item.totalCount : 0;
  };

  const changeTheCategory = (item: string) => {
    const alertMessage = t('errors.TSKPOSnotAllowed');
    dispatch(
      uiActions.showAlert(
        alertMessage,
        ALERT.CONFIRM,
        {
          primaryText: MODAL.PROCEED,
          isSecondaryRequire: true,
          secondaryText: MODAL.CANCEL,
          onProceed: () => {
            dispatch(sliceActions.setSelectedMaterial([]));
            dispatch(sliceActions.setSelectedMaterialPill(item));
          },
        },
        {},
      ),
    );
  };

  const getTotalItemsCount = () => selectedMaterial.length;

  const renderListData = (item: ParentObject) => {
    const itemCount = getItemCount(item.productCode);
    return (
      <View style={styles.productContainer}>
        <Text style={styles.productName}>{item.productName}</Text>
        {itemCount === 0 ? (
          <Pressable style={styles.addContainer} onPress={() => addMaterial(item, 1)}>
            <Text style={styles.addText}>+ {t('strings.add')}</Text>
          </Pressable>
        ) : (
          <View style={styles.addSubtractContainer}>
            <Pressable style={styles.plusMinusContainer} onPress={() => addMaterial(item, -1)}>
              <Text style={styles.plusMinus}>-</Text>
            </Pressable>
            <Text style={styles.productName}>{itemCount}</Text>
            <Pressable style={styles.plusMinusContainer} onPress={() => addMaterial(item, 1)}>
              <Text style={styles.plusMinus}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const totalItems = getTotalItemsCount();

  return (
    <View style={styles.flex}>
      <ScrollView nestedScrollEnabled style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Search placeholder={t('strings.searchForMaterial')} value={searchQuery} onChange={setSearchQuery} />
          <PillsGroup
            itemsArr={[t('strings.TSK&RCV'), t('strings.POS')]}
            onPillPress={changeTheCategory}
            selectedPillText={selectedMaterialPill}
            itemStyles={{ width: Sizing.layout.x90 }}
          />
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>{t('strings.items')}</Text>
              <Text style={[styles.headerText, { marginRight: Sizing.layout.x35 }]}>{t('strings.quantity')}</Text>
            </View>
            <List testID="tsraSubscriberListTest" key={0} data={filteredData} numColumns={1} renderItem={({ item }) => renderListData(item)} style={styles.listContainerStyle} />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        {totalItems !== 0 && (
          <>
            <View style={styles.cartcontainer}>
              <View style={styles.iconContainer}>
                <Image iconName={ICONS.CART} width={Sizing.layout.x2} height={Sizing.layout.x2} />
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.productName}>{totalItems === 1 ? t('strings.itemAdded') : t('strings.itemsAdded')}</Text>
            </View>
            <Button
              type="primary"
              fontSize={Sizing.layout.x16}
              label={t('strings.proceed')}
              isDimension={false}
              onPress={() => raiseTheRequest()}
              disabled={totalItems === 0}
              style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            />
          </>
        )}

        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('strings.cancel')}
          isDimension={false}
          onPress={() => goBack(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(MaterialsRaiseRequest);
