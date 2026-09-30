/**
 * Container UI component for LiveNewsCardContainer.
 *
 * @module components/LiveNewsCardContainer
 * @memberof CommonComponent
 */

import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ColorValue,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle,
  ViewToken,
} from "react-native";
import styles from "./LiveNewsCardContainer.styles";
import LiveNewsCard from "../LiveNewsCard";
import useNavigate from "hooks/useNavigate";
import { ROUTE } from "const";
import { MoengageMixpanel } from "services/moengageMixpanel";
import { MoengageMixpanelModules } from "services/moengageMixpanel/config";
import { RAIL_FILTER_DEFAULT_LANGUAGES, RAIL_TITLE } from "const/strings";




/**
 * Component type definitions
 *
 * @typedef {object} LiveNewsCardContainerProps
 * @property {string}  [title]                 - Rail title (e.g., "Live News")
 * @property {Array<LiveNewsCardProps & {key?: string|number}>} data
 *                                            - Items to render (each item accepts LiveNewsCard props)
 * @property {boolean} [loading]               - Show loading indicator/skeletons
 * @property {string}  [errorText]             - Optional error text to show instead of list
 * @property {() => void} [onPressViewAll]     - Handler for "View all" action (if provided, the action shows)
 * @property {string}  [viewAllText="View all"]- Text for the action button
 * @property {() => void} [onRetry]            - Retry handler when error state is shown
 * @property {() => void} [onEndReached]       - Called when list end is reached (pagination)
 * @property {number}  [initialNumToRender=6]  - Initial items to render
 * @property {(info:{viewableItems:ViewToken[], changed:ViewToken[]}) => void}
 *                    [onViewableItemsChanged] - Visibility callback for analytics
 * @property {number}  [itemSpacing=12]        - Horizontal spacing between cards
 * @property {number}  [contentPadding=12]     - Horizontal padding for the rail
 */
export type LiveNewsCardContainerProps = {
  title?: string;
  data: (Content & { key?: string | number })[];
  loading?: boolean;
  errorText?: string;
  onPressViewAll?: () => void;
  viewAllText?: string;
  onRetry?: () => void;
  onEndReached?: () => void;
  initialNumToRender?: number;
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => void;
  itemSpacing?: number;
  contentPadding?: number;
  languages?: string[];               // e.g., ['All', 'English', 'Tamil', 'Hindi', 'Telugu']
  defaultLanguage?: string;           // e.g., 'All'
  selectedLanguage?: string;          // controlled prop (if parent wants to control)
  onChangeLanguage?: (lang: string) => void;

};

export interface Rail {
  id: number;
  railTitle: string;
  railType: string;
  layoutType: string;
  pageType: string;
  contents: Content[];
}

export interface Content {
  contentId: number;
  contentImg: string;
  contentType: string;
  contentShowType: string;
  epgState: string;
  airedDate: number;
  displayDate: string;
  airStartDate: number;
  airEndDate: number;
  contentTitle: string;
  genre: string[];
  language: string[];
  ott: boolean;
  onPress?: () => void
}

export type RailResponse = Rail[];


/**
 * Represents a LiveNewsCardContainer component
 *
 * @param {LiveNewsCardContainerProps} props - React properties passed from composition
 * @returns {JSX.Element} The rendered LiveNewsCardContainer component
 *
 */


const LiveNewsCardContainer = ({
  title = RAIL_TITLE,
  data,
  loading,
  errorText,
  onPressViewAll,
  onRetry,
  onEndReached,
  initialNumToRender = 6,
  onViewableItemsChanged,
  itemSpacing = 12,
  contentPadding = 12,
  languages = RAIL_FILTER_DEFAULT_LANGUAGES,

}: LiveNewsCardContainerProps): JSX.Element => {

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const { navigate } = useNavigate();

  type Params = Record<string, any>;
  const navigateTo = (routeName: string, params?: object) => {
    navigate(routeName, params);
  };


  const keyExtractor = (item: Content, index: number) =>
    String(item.contentId ?? item.contentTitle ?? index);

  //select handler
  const handleSelectLang = useCallback((lang: string) => {
    setSelectedLanguage((prev) => (prev === lang ? null : lang));
    MoengageMixpanel.trackEvent(
      MoengageMixpanelModules.LiveNews.LiveNewsFilterClick.moduleName,
      { Status: 'Success', selectedFilter: lang }
    );
  }, []);

  // Filter data by language
  const filteredData = useMemo(() => {
    if (!selectedLanguage) {
      return data; // show all initially or when unselected
    }

    return data.filter(item =>
      Array.isArray(item.language) &&
      item.language.includes(selectedLanguage)
    );
  }, [data, selectedLanguage]);

  const renderItem: ListRenderItem<Content> = ({ item }) => {

    const apiParams: Params = {
      contentId: item.contentId,
      contntType: item.contentType,
    };
    return (<View style={{ marginRight: itemSpacing }}>
      <LiveNewsCard
        {...item}
        onPress={() => {
          MoengageMixpanel.trackEvent(
            MoengageMixpanelModules.LiveNews.LiveNewsCardClick.moduleName,
            { Status: 'Success', contentId: item.contentId, contentType: item.contentType, contentTitle: item.contentTitle, genre: item.genre[0], language: item.language[0] }
          );
          navigateTo(ROUTE.WEB.LIVE_NEWS_TV_PAGE, apiParams);
        }}
      />
    </View>);
  };

  // Loading
  if (loading) {
    return (
      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </View>
    );
  }

  // Error
  if (errorText) {
    return (
      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorText}</Text>
          {onRetry ? (
            <Pressable
              accessibilityRole="button"
              onPress={onRetry}
              style={styles.retryButton}
            >
              <Text style={styles.retryLabel}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  // Empty(after filtering)
  if (!filteredData || filteredData.length === 0) {
    return (
      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        {/* Header row */}
        {(title || onPressViewAll) ? (
          <View style={styles.headerRow}>
            {title ? <Text style={styles.title}>{title}</Text> : <View />}
            {/* {onPressViewAll ? (
              <Pressable
                onPress={onPressViewAll}
                accessibilityRole="button"
                accessibilityLabel={viewAllText}
                hitSlop={8}
                style={styles.viewAllBtn}
              >
                <Text style={styles.viewAllText}>{viewAllText}</Text>
              </Pressable>
            ) : null} */}
          </View>
        ) : null}

        {/* Tag bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {languages.map((lang) => {
            const active = lang === selectedLanguage;

            return (
              <Pressable
                key={lang}
                onPress={() => handleSelectLang(lang)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${lang}`}
                style={[styles.tagChip, active && styles.tagChipActive]}
              >
                <Text style={[styles.tagLabel, active && styles.tagLabelActive]}>
                  {lang}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.emptyText}>No live news to show.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
      {/* Header row */}
      {(title) ? (
        <View style={styles.headerRow}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
        </View>
      ) : null}

      {/* Tag bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsRow}
      >
        {languages.map((lang) => {
          const active = lang === selectedLanguage;
          return (
            <Pressable
              key={lang}
              onPress={() => handleSelectLang(lang)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${lang}`}
              style={[styles.tagChip, active && styles.tagChipActive]}
            >
              <Text style={[styles.tagLabel, active && styles.tagLabelActive]}>
                {lang}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Horizontal rail */}
      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={initialNumToRender}
        onEndReachedThreshold={0.6}
        onEndReached={onEndReached}
        contentContainerStyle={{ paddingRight: contentPadding }}
        style={{ marginTop: 8 }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
};

export default LiveNewsCardContainer;