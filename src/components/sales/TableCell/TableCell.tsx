/**
 * Table cell is one grouping within a chart table used for storing information or data
 *
 * @module components/TableCell
 * @memberof CommonComponent
 */
import React, { ReactNode, memo, useEffect, useState } from 'react';
import { TableCellProps, TableColumnProps, TableMeta, TableRow } from 'hooks/useDataTable';
import { NativeSyntheticEvent, Pressable, TextInputChangeEventData, View } from 'react-native';
import TextInput from 'components/sales/TextInput';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { Sizing } from 'styles';
import { updateUserInput } from 'utils/tableHelper';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { ICONS, STRINGS } from 'const';
import styles from './TableCell.styles';

type CustomEvent = NativeSyntheticEvent<TextInputChangeEventData>;

/**
 * Represents a TableCell component
 *
 * @component
 * @param {TableCellProps} props - React properties passed from composition
 * @returns {JSX.Element} TableCell component
 */
const TableCell = ({ getValue, row, column, table }: TableCellProps) => {
  const initialValue = getValue();
  const columnDef = column?.columnDef as TableColumnProps<any>;
  const tableMeta = table?.options?.meta as TableMeta;
  const [value, setValue] = useState(initialValue);
  const { inflection } = useInflection();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, columnDef?.accessorKey, value, true, (tableRecords: TableRow[]) => {
      columnDef?.onTableDataSubmit?.(tableRecords, table);
    });
  };

  const handleInputChange = (inputValue: CustomEvent | null, icon: string | null) => {
    let textValue = inputValue?.nativeEvent?.text ? inputValue.nativeEvent.text : inputValue;
    textValue = updateUserInput(textValue, columnDef, tableMeta, row, table, icon);
    if (!icon) {
      setValue(textValue);
    }
  };

  const renderIcon = (icon: string): ReactNode => (
    <Pressable
      onPress={() => {
        handleInputChange(value, icon);
      }}
    >
      <Image
        iconName={icon}
        height={inflection === 'xs' || inflection === 'sm' ? Sizing.layout.x1Dot5 : Sizing.layout.x2}
        width={inflection === 'xs' || inflection === 'sm' ? Sizing.layout.x1Dot5 : Sizing.layout.x2}
      />
    </Pressable>
  );

  const renderTableCell = (): ReactNode => {
    switch (columnDef?.type) {
      case STRINGS.TEXT:
        return (
          <View style={styles.cellGroupStyle}>
            <TextInput
              id={columnDef?.accessorKey}
              text={String(value)}
              value={String(value)}
              placeholder={columnDef.placeholder}
              disabled={columnDef.disabled}
              onChange={(text: any) => handleInputChange(text, null)}
              onBlur={onBlur}
              inputFieldStyle={[styles.inputStyle, styles[gcs('inputStyle', inflection, true, ['sm', 'xs'])]]}
            />
            <View style={styles.cellGroupIconStyle}>
              {columnDef?.isAddRemoveRequired ? renderIcon(ICONS.ADD) : null}
              {columnDef?.isAddRemoveRequired ? renderIcon(ICONS.REMOVE) : null}
            </View>
          </View>
        );
      case STRINGS.ICON_FORMATTER:
        return renderIcon(columnDef.icon);
      case STRINGS.CENTERED_TEXT:
        return <Text style={[styles.textStyle, styles.centeredText, { fontFamily: columnDef?.fontFamily }]}>{value}</Text>;
      case STRINGS.LEFT_ALIGNED_TEXT:
        return <Text style={[styles.textStyle, { fontFamily: columnDef?.fontFamily }]}>{value}</Text>;
      case STRINGS.STATUS:
        return <Text style={[styles.textStyle, styles.statusText, { fontFamily: columnDef?.fontFamily }]}>{value}</Text>;
      default:
        return null;
    }
  };

  if (columnDef?.isRowFormatter) {
    return renderTableCell();
  }

  return <Text style={[styles.textStyle, { fontFamily: columnDef?.fontFamily }]}>{value}</Text>;
};

export default memo(TableCell);
