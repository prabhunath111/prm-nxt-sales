/**
 * Tabs make it easy to explore and switch between different views.
 *
 * @module components/Tabs
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Text from 'components/sales/Text';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { STYLE_VARIANT } from 'const';
import styles from './Tabs.styles';

/**
 * Represents an individual tab in the Tabs component.
 *
 * @typedef {Object} TabObject
 * @property {string} key - A unique identifier for the tab.
 * @property {string} title - The title displayed on the tab.
 * @property {React.ReactNode} component - The content to be rendered when the tab is active.
 */
interface TabObject {
  key: string;
  title: string;
  subTitle?: string;
  component: React.ReactNode;
}

/**
 * Props for the Tabs component.
 *
 * @typedef {Object} TabsProps
 * @property {TabObject[]} tabs - An array of tab objects defining the tabs to be displayed.
 * @property {boolean} [isPortrait] - Optional flag to indicate if the orientation is portrait.
 * @property {string} [styleVariant] - Style variant for the tab properties to be displayed in the UI
 */
export type TabsProps = {
  tabs: TabObject[];
  isPortrait?: boolean;
  styleVariant?: string;
  isScroll?: boolean;
  setSelectedTab?: any;
};

/**
 * Represents a Tabs component
 *
 * @param {TabsProps} props - React properties passed from composition
 * @returns {JSX.Element} The rendered Tabs component
 *
 * @example
 * <Tabs tabs={[{ key: '1', title: 'Tab 1', component: <Component1 /> }]} isPortrait={false} />
 */

const Tabs = ({ tabs, isPortrait = false, isScroll = false, styleVariant = STYLE_VARIANT.P2, setSelectedTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { inflection } = useInflection();

  const currentTab = tabs.find((_, index) => activeTab === index);
  const appliedStyles = styles[styleVariant];

  useEffect(() => {
    setSelectedTab?.(activeTab);
  }, [activeTab]);

  return (
    <View style={[appliedStyles.container, appliedStyles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]} testID="tabs-test">
      <View
        style={[
          appliedStyles.tabBar,
          isPortrait ? appliedStyles.tabBarVertical : [appliedStyles.tabBarHorizontal, appliedStyles[gcs('tabBarHorizontal', inflection, true, ['md', 'lg', 'xl'])]],
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              style={[appliedStyles.tab, activeTab === index && appliedStyles.activeTab, isPortrait ? appliedStyles.tabVertical : null]}
              onPress={() => setActiveTab(index)}
            >
              <View>
                <Text style={[appliedStyles.tabText, activeTab === index && appliedStyles.activeTabText]}>{tab.title}</Text>
                {tab.subTitle && <Text style={appliedStyles.tabSubText}>{tab.subTitle}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        horizontal={isPortrait}
        contentContainerStyle={appliedStyles.contentContainerStyle}
        showsHorizontalScrollIndicator={isScroll}
        showsVerticalScrollIndicator={isScroll}
      >
        <View style={[appliedStyles.contentContainer, isPortrait ? appliedStyles.contentVertical : appliedStyles.contentHorizontal]}>
          {currentTab && (
            <View key={currentTab.key} style={[appliedStyles.content, appliedStyles.visibleContent]}>
              {currentTab.component}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Tabs;
