/**
 * Recharge winback screen for view details
 *
 * @module components/WinBackViewDetails
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { Accordion, Card, Image, Text } from 'components/sales';
import { ICONS } from 'const';
import { Colors, Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import styles from './WinBackViewDetails.styles';

/**
 * Component to display app details dynamically.
 *
 * @param {object} props - React properties passed to the component.
 * @param {string} props.iconName - Name of the icon.
 * @param {string} props.detailText - The text to display.
 * @returns {JSX.Element} The rendered detail component.
 */
const AppDetail = ({ iconName, detailText }: { iconName: string; detailText: string }) => (
  <View style={styles.appDetails}>
    <Image iconName={iconName} height={Sizing.layout.x1} width={Sizing.layout.x1} />
    <Text style={styles.detailsText}>{detailText}</Text>
  </View>
);

const WinBackViewDetails = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();

  // Dynamic data with unpredictable keys and it will be changed when API will come
  const dummyData = {
    appsData: {
      OTT_Apps: {
        data: [
          {
            name: 'Prime Video Lite',
            quality: 'HD (720p)',
            devices: 'Up to 2 devices at a time',
            platforms: 'Watch on TV & Mobile',
            extra: 'FREE 1-Day delivery',
          },
          {
            name: 'Netflix',
            quality: 'HD (720p)',
            devices: 'On Single device at a time',
            platforms: 'Watch on TV, Laptop & Mobile',
            audio: 'Normal Audio',
          },
        ],
        totalApps: '2 Apps',
        title: 'OTT Apps',
      },
      TV_Channeles: {
        data: [
          {
            name: 'Prime Video Lite',
            quality: 'HD (720p)',
            devices: 'Up to 2 devices at a time',
            platforms: 'Watch on TV & Mobile',
            extra: 'FREE 1-Day delivery',
          },
          {
            name: 'Netflix',
            quality: 'HD (720p)',
            devices: 'On Single device at a time',
            platforms: 'Watch on TV, Laptop & Mobile',
            audio: 'Normal Audio',
          },
        ],
        totalApps: '19 Channels',
        title: 'TV Channels',
      },
    },
    total_channels: '19',
    total_apps: '2',
    pack_price: '$349',
  };

  const getIconForKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'quality':
        return ICONS.QUALITY;
      case 'devices':
        return ICONS.EYE;
      case 'platforms':
        return ICONS.PLATFORMS;
      case 'extra':
        return ICONS.DELIVERY_TRUCK;
      case 'audio':
        return ICONS.AUDIO;
      default:
        return ICONS.DEFAULT;
    }
  };

  return (
    <ScrollView style={styles.subContainer}>
      <View style={styles.container}>
        <Text style={styles.primaryText}>{t('strings.amazonAnd19TvChannels')}</Text>
        <Text style={styles.secondaryText}>{t('strings.primeAndNetflixBasic')}</Text>
        <View style={styles.packDetailsContainer}>
          <View style={[styles.packDetails, styles[gcs('packDetails', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.packText}>{t('strings.ottApps')}</Text>
            <Text style={styles.packCount}>{dummyData.total_apps}</Text>
          </View>
          <View style={[styles.packDetails, styles[gcs('packDetails', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.packText}>{t('strings.channels')}</Text>
            <Text style={styles.packCount}>{dummyData?.total_channels}</Text>
          </View>
          <View style={[styles.packDetails, { borderRightWidth: Sizing.layout.x0 }, styles[gcs('packDetails', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.packText}>{t('strings.channelPackPrice')}</Text>
            <Text style={styles.packCount}>{dummyData?.pack_price}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.secondaryText}>{t('strings.packIncludesNetworkCapacityFee')}</Text>
          <Image iconName={ICONS.INFO_PINK} height={Sizing.layout.x25} width={Sizing.layout.x25} isDimension={false} />
        </View>
        <View style={[styles.accordionContainer, styles[gcs('accordionContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          {Object.entries(dummyData.appsData).map(([categoryKey, categoryData]) => (
            <Card cardStyle={styles.cardStyle} key={categoryKey}>
              <Accordion
                title={categoryData.title}
                accordionStyle={styles.accordionStyle}
                buttonStyle={styles.accoodianButtonStyle}
                collapseIcon={ICONS.PINK_CHEVRON_UP}
                expandIcon={ICONS.PINK_CHEVRON_DOWN}
                titleColor={Colors.primary.brand}
                listStyle={styles.listStyle}
                isDimension={false}
                iconHeight={Sizing.layout.x20}
                iconWidth={Sizing.layout.x20}
                subDetails={categoryData.totalApps}
              >
                {categoryData.data.map((app, index) => (
                  <View key={app.name}>
                    <View style={styles.textContainer}>
                      <Text style={styles.ottName}>{app.name}</Text>
                      <View>{Object.entries(app).map(([key, value]) => key !== 'name' && <AppDetail key={key} iconName={getIconForKey(key)} detailText={value} />)}</View>
                    </View>
                    {index !== categoryData.data.length - Sizing.layout.x1 && <View style={styles.separator} />}
                  </View>
                ))}
              </Accordion>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(WinBackViewDetails);
