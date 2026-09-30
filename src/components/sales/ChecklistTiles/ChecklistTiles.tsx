import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { ParentObject } from 'store/sales/types/common';
import { Text } from 'components/sales';
import { VALIDATIONS } from 'const';
import styles from './ChecklistTiles.styles';

type ChecklistTilesProps = {
  header?: string;
};
const ChecklistTiles = ({ header = '' }: ChecklistTilesProps) => {
  const { formState } = useSelector((state: RootState) => state.form);
  return (
    <View style={styles.container} testID="ChecklistTiles">
      <View>
        <Text style={styles.checkListHeader}>{header}</Text>
      </View>
      {formState?.setChecklistTileDetails?.map((item: ParentObject) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Text style={styles.id}>{item.id}.</Text>
              <Text style={styles.desc}>{item.question}</Text>
            </View>
            <View style={styles.response}>
              {item?.response?.split(',').map((item: string, index: number, arr: string[]) => (
                <Text key={item} style={[styles.response, item === VALIDATIONS.YES ? styles.responseYes : styles.responseNo]}>
                  {item?.trim()}
                  {index < arr.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ChecklistTiles;
