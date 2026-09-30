/**
 * this header will have details of the user
 *
 * @module components/DetailsHeader
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { PROPERTIES } from 'const';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import TextContainer from 'components/sales/TextContainer';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { useTranslation } from 'react-i18next';
import { Colors, Sizing } from 'styles';
import styles from './DetailsHeader.styles';
import { version } from '../../../../package.json'; // adjust path as needed

/**
 * Represents a DetailsHeader component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered DetailsHeader component
 *
 * @example
 * <DetailsHeader text="Hello World!" />
 */

const DetailsHeader = () => {
  const { info } = useSelector((state: RootState) => state.user);
  const { inflection } = useInflection();
  const { t } = useTranslation();

  const data = {
    dealerID: info?.userId,
    mobileNoInHeader: info?.mdn,
    name: t(`strings.${info?.name}`, { defaultValue: info?.name }),
  };
  const isDesktop = inflection === BreakPoints.XL || inflection === BreakPoints.LG || inflection === BreakPoints.MD;
  const separator = isDesktop ? ': ' : '';
  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])]]}>
      <View style={[styles.detailsContainer, styles[gcs('detailsContainer', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])]]}>
        <View
          style={[
            styles.textContainer,
            styles[gcs('textContainer', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])],
            isDesktop && { borderRightWidth: Sizing.layout.x1, borderRightColor: Colors.violet.v300 },
          ]}
        >
          <Text style={styles.titleText}>{`${t(`strings.${info?.internalRole}`, { defaultValue: info?.internalRole })} ID${separator}`}</Text>
          <Text style={isDesktop ? styles.valueTextWeb : styles.valueText}>{info?.userId}</Text>
        </View>
        <TextContainer
          textContainerStyle={[styles.subContainer, styles[gcs('subContainer', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])]]}
          itemContainerStyle={[styles.itemTextContainer, styles[gcs('textContainer', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])]]}
          data={data}
          primaryStyle={styles.titleText}
          secondaryStyle={isDesktop ? styles.valueTextWeb : styles.valueText}
          dataArray={PROPERTIES.DETAILS_HEADER.GET_HEADER_DETAILS}
          separator={separator}
          hasSepratorRight={isDesktop}
        />
        <View style={[styles.versionContainer, styles[gcs('versionContainer', inflection, true, ['md', 'lg', 'xl', 'xs', 'sm'])]]}>
          <Text style={styles.titleText}>{isDesktop ? `${t('strings.version')} : ${version}` : `V${version}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailsHeader;
