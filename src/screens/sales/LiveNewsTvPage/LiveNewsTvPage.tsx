/**
 * LiveNewsTv page component
 *
 * @module components/LiveNewsTvPage
 * @memberof - View Component
 */

import React, {memo, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
 
} from "react-native";

import styles from "./LiveNewsTvPage.styles";
import { useDispatch, useSelector } from 'react-redux';
import { LiveNewsCardContainer, VideoPlayer } from 'components/sales';
import { AppDispatch, RootState } from 'store';
import useNavigate from "hooks/useNavigate";
import { QUERY} from "const";
import useParams from "hooks/useParams";
import { Content } from "components/sales/LiveNewsCardContainer/LiveNewsCardContainer";
import { callAction } from "utils/formBuilderHelper";
import { metaDataAction } from "store/sales/actions/liveNewsTvPage/liveNewsTvPage.action";
import { isWeb } from "utils/platformHelper";


/** ------------------------------
 * Mock Meta Details (from your doc’s structure)
 * Replace this with a real API call later.
 * ------------------------------ */
type MockMeta = {
  meta: Array<{
    id: string;
    title: string;
    description?: string;
    startTime?: number;
    endTime?: number;
    rating?: string;
    audio?: string[];
    duration?: number;
    genre?: string[];
    boxCoverImage?: string;
    epgState?: "ON_AIR" | "OFF_AIR";
    contentType: "LIVE" | "VOD" | string;
    provider?: string; // channel name
    primaryGenre?: string;
  }>;
  detail: {
    contractName: string;
    entitlements: String[];
    offerId: {
      "key": String,
      "epids": Array<{
        epid: string,
        bid: string
      }>
    }

  }
  channelMeta?: {
    id: number | string;
    name: string;
    logo?: string;
    channelNumber?: string;
    contentType: String;
    genre?: string[];
    transparentImageUrl?: string;
  };
};

export interface PlaybackDetails {
  contentId: number;

  /** LIVE | VOD | CATCHUP (extend if needed) */
  contentType: string;

  /** Indicates if CDN delivery is enabled */
  cdnEnabled: boolean;

  /** DASH + PlayReady */
  dashPlayreadyConsumerUrl: string;
  dashPlayreadyLicenseUrl: string;

  /** DASH + Widevine */
  dashWidevineConsumeUrl: string;
  dashWidevineLicenseUrl: string;

  /** HLS + FairPlay (Safari / iOS) */
  hlsFairPlayUrl: string;

  /** FairPlay certificate URL */
  certificateUrl: string;

  /** Authorization token used for DRM license requests */
  token: string;

  /** Token expiry timestamp (epoch ms) */
  expiresIn: number;
}

function formatTime(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const hh = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  const mm = m < 10 ? `0${m}` : m;
  return `${hh}:${mm} ${ampm}`;
}
const ensureHttps = (url?: string): any => {
  if (!url) return url;
  return url.replace(/^http:/, "https:");
}

function requireString(
  value: string | undefined,
  fieldName: string
): string {
  if (!value) {
    throw new Error(`Missing required field: ${fieldName}`);
  }
  return value;
}


const LiveNewsTvPage = () => {
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [meta, setMeta] = useState<MockMeta | null>(null);
  const [playBack,setPlayBack] =useState<PlaybackDetails>();
  const { railData, railFilterLanguages } = useSelector((state: RootState) => state.homePage);
  const { metaData,playBackData } = useSelector((state: RootState) => state.liveNewsTvPage);
  const dispatch = useDispatch<AppDispatch>();
  const { contentId, contntType } = useParams();
  useEffect(() => {
    const apiParams = {
      metaContentType: contntType,
      metaContentId: String(contentId),
      isWeb:isWeb,
    }
    dispatch(metaDataAction(QUERY.MetaData, apiParams));
  }, [contentId, contntType])
  useEffect(() => {
    if (!(railData[0]?.id))
      dispatch(callAction({}, QUERY.GetRailsData))
  }, [])
  useEffect(() => {
    console.log("contentId" + contentId);
    console.log("contntType" + contntType);
    console.log("railData:->" + ((railData[0]?.id) ?? null));
    console.log(metaData);
  })

  // For demo: mock fetch
  useEffect(() => {
    if (metaData?.channelMeta?.id!==meta?.channelMeta?.id) {
      setMeta(metaData);
      setLoadingMeta(false);
      setPlayBack(playBackData);

    }
    else {
      setLoadingMeta(true);
    }
  }, [metaData, contntType, contentId]);


  // Extract primary meta fields
  const primary = useMemo(() => {
    6
    const m = meta?.meta?.[0];
    const c = meta?.channelMeta;
    return {
      title: m?.title ?? "",
      description: m?.description ?? "",
      channelName: c?.name || m?.provider || "",
      channelLogo: ensureHttps(c?.logo),
      transparentImageUrl: ensureHttps(c?.transparentImageUrl),
      language: m?.audio?.[0] ?? "",
      genre: m?.primaryGenre || m?.genre?.[0] || c?.genre?.[0] || "",
      start: formatTime(m?.startTime),
      end: formatTime(m?.endTime),
      cover: ensureHttps(m?.boxCoverImage),
      epgState: m?.epgState,
      channelNumber: c?.channelNumber,
    };
  }, [meta,contentId]);

  if (loadingMeta) {
    return (
      <View style={styles.infoCard}>
        <View >
          <ActivityIndicator />
          <Text>Loading details…</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>

      {/* ================= VIDEO PLAYER ================= */}
      <View style={styles.videoWrapper}>

        <VideoPlayer
          autoPlay
          controls
          //poster={primary.cover}
          widevine={{
            playUrl: requireString(playBack?.dashWidevineConsumeUrl,'dashWidevineConsumeUrl'),
            licenseUrl: requireString(playBack?.dashWidevineLicenseUrl,'dashWidevineLicenseUrl'),
            token:playBack?.token
          }}
          // fairplay={{
          //   playUrl: 'https://example.com/fairplay/playlist.m3u8',
          //   licenseUrl: 'https://fairplay-license.com',
          //   certificateUrl: 'https://fairplay-cert.com/cert',
          //   token: 'FAIRPLAY_TOKEN'
          // }}
        />;



      </View>

      {/* ================= INFO CARD ================= */}
      <View style={styles.infoCard}>

        {/* Channel Row */}
        <View style={styles.channelRow}>
          <View>
            <View style={styles.channelHD}><Text>HD</Text></View>
            <Image
              source={{ uri: primary.channelLogo }}
              style={styles.channelLogo}
              resizeMode="contain"
            />
            <View style={styles.channelNumberPill}><Text>ch. {primary.channelNumber}</Text></View>
          </View>
          <View style={styles.channelTextWrap}>
            <Text style={styles.channelName}>
              {primary.channelName}
              {/* {primary.channelNumber ? ` · ${primary.channelNumber}` : ''} */}
            </Text>

            <Text style={styles.programTitle}>
              {primary.title}
            </Text>

            <Text style={styles.programTime}>
              <View style={styles.onNowContainer}><View style={styles.dot}></View><Text style={styles.onNow}>On Now</Text></View>
              {primary.start} - {primary.end}
            </Text>
          </View>

          <Pressable style={styles.moreIcon}>
            <Text style={styles.moreIconText}>⋮</Text>
          </Pressable>
        </View>

        {/* Audio Language */}
        <View style={styles.audioRow}>
          <Text style={styles.audioLabel}>Audio in:</Text>
          <Text style={styles.audioActive}>{primary.language || 'English'}</Text>
        </View>
      </View>

      {/* ================= MORE LIKE THIS ================= */}
      <View style={styles.moreLikeSection}>
        <LiveNewsCardContainer
          title="More like this"
          data={railData[0]?.contents as Content[]}
          languages={railFilterLanguages}
        />
      </View>
    </ScrollView>
  );
};

export default memo(LiveNewsTvPage);
