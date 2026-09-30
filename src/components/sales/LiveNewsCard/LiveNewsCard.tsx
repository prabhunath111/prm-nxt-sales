/**
 * LiveNewsCard UI component.
 *
 * @module components/LiveNewsCard
 * @memberof CommonComponent
 */

import React from 'react';
import { JSX } from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import styles from './LiveNewsCard.styles';
import { Content } from '../LiveNewsCardContainer/LiveNewsCardContainer';
import Gradient from '../Gradient';


/**
 * Component type definitions
 *
 * @typedef {object} LiveNewsCardProps
 * @property {string}  [contentId] - Unique contentId for testing/keys
 * @property {string}  contentTitle - Primary contentTitle of the news/live program
 * @property {string}  [subtitle] - Secondary text (e.g., provider/channel name)
 * @property {string}  contentImg - Poster/thumbnail image (16:9 recommended)
 * @property {string}  [channelLogoUrl] - Optional channel logo for branding
 * @property {boolean} [isLive=true] - Whether to show the LIVE badge
 * @property {string}  [contentType="LIVE"] - Text inside the badge
 * @property {string}  [displayDate] - Optional “On Air” or HH:MM label
 * @property {boolean} [genre] - Disable card interactions
 * @property {() => void} [onPress] - Press handler
 * @property {StyleProp<ViewStyle>} [style] - Container style override
 * @property {ColorValue} [accentColor="#FF3B30"] - Badge/Accent color
 */

/**
 * Represents a LiveNewsCard component
 *
 * @param {LiveNewsCardProps} props - React properties passed from composition
 * @returns {JSX.Element} The rendered LiveNewsCard component
 *
 * @example
 * <LiveNewsCard
 *   contentId="bbc-188"
 *   contentTitle="Business Today"
 *   subtitle="BBC News • On Air"
 *   displayDate="Now"
 *   contentImg="https://example.com/thumb.jpg"
 *   channelLogoUrl="https://example.com/logo.png"
 *   onPress={() => {}}
 * />
 */

const LiveNewsCard = ({
  contentId,
  contentTitle,
  displayDate,
  contentImg,
  contentType = 'LIVE',
  onPress,
}: Content): JSX.Element => {

  function formatTimeRange(timeRange: string): string {
  const formatTime = (time: string): string => {
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);

    const suffix = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12; // Convert 0 → 12

    return minute === '00'
      ? `${hour}${suffix}`
      : `${hour}:${minute}${suffix}`;
  };

  const [start, end] = timeRange.split('-');

  return `${formatTime(start)} - ${formatTime(end)}`;
}

  const ensureHttps = (url: string): string => {
    if (!url) return url;
    return url.replace(/^http:/, "https:");
  }


  return (
    <Pressable
      testID={String(contentId)}
      accessibilityRole="button"
      accessibilityLabel={contentTitle}
      disabled={false}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
      ]}
    >
      {/* Thumbnail with a subtle dark fade at the bottom for text legibility */}
     <ImageBackground
  source={{ uri: ensureHttps(contentImg) }}
  resizeMode="cover"
  style={styles.thumbnail}
  imageStyle={styles.thumbnailImage}
>
  {/* Top row */}
  <View style={styles.topRow}>
    {contentType === 'LIVE_EVENT' && (
      <View style={styles.liveBadge}>
        <View style={styles.dot} />
        <Text style={styles.contentType}>Live</Text>
      </View>
    )}
  </View>

  {/* ✅ Gradient overlay */}
  <Gradient
    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
    direction="to bottom"
    style={styles.gradientOverlay}
  />

  {/* Bottom content */}
  <View style={styles.bottomOverlay}>
    <View style={styles.textBlock}>
      <Text numberOfLines={1} style={styles.contentTitle}>
        {contentTitle}
      </Text>
    </View>

    {displayDate ? (
      <Text style={styles.timeText}>{formatTimeRange(displayDate)}</Text>
    ) : null}
  </View>
</ImageBackground>
    </Pressable >
  );
};

export default LiveNewsCard;