// import { useCallback, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, FlatList, Share, View } from 'react-native';
// import VideoFeedItem from '../../components/VideoFeedItem';
// import { SPACING, VIDEO_HEIGHT } from '../../constants/Colors';

// const BASE_URL = 'https://talesfromthenorthpole.xyz:3001';

// type VideoItem = {
//   fileId: string;
//   video: string;              // absolute after mapping
//   hls?: string | null;        // absolute after mapping
//   thumbnail?: string | null;  // absolute after mapping
//   createdAt: string;
// };

// type ApiResp = {
//   total: number;
//   page: number;
//   limit: number;
//   videos: Array<{
//     fileId: string;
//     video: string;          // relative
//     hls?: string | null;    // relative
//     thumbnail?: string | null; // relative
//     createdAt: string;
//   }>;
// };

// export default function VideoFeedScreen() {
//   const [videos, setVideos] = useState<VideoItem[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // which index is visible (to auto play/pause)
//   const [visibleIndex, setVisibleIndex] = useState(0);
//   const visibleIndexRef = useRef(0);

//   const toAbs = (rel?: string | null) =>
//     rel ? (rel.startsWith('http') ? rel : `${BASE_URL}${rel}`) : undefined;

//   // fetch with support for replace (used by pull-to-refresh)
//   const fetchVideos = useCallback(
//     async (pageNum: number, opts: { replace?: boolean } = {}) => {
//       if (loading) return;
//       setLoading(true);
//       try {
//         const res = await fetch(`${BASE_URL}/videos?page=${pageNum}&limit=10&paid=false`);
//         const data: ApiResp = await res.json();

//         const newItems: VideoItem[] = (data.videos ?? []).map((v) => ({
//           ...v,
//           video: toAbs(v.video)!,
//           hls: toAbs(v.hls || undefined),
//           thumbnail: toAbs(v.thumbnail || undefined),
//         }));

//         if (opts.replace) {
//           // full refresh: replace list, reset paging to next page
//           setVideos(newItems);
//           setHasMore(newItems.length > 0);
//           setPage(newItems.length > 0 ? pageNum + 1 : 1);
//           return;
//         }

//         if (newItems.length === 0) {
//           setHasMore(false);
//           return;
//         }

//         // append with de-dupe, keep newest first by createdAt
//         setVideos((prev) => {
//           const map = new Map(prev.map((x) => [x.fileId, x]));
//           newItems.forEach((x) => map.set(x.fileId, { ...map.get(x.fileId), ...x }));
//           return Array.from(map.values()).sort(
//             (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
//           );
//         });
//         setPage((p) => p + 1);
//       } catch (err) {
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [loading],
//   );

//   // initial load (guard against double in StrictMode)
//   const didFetch = useRef(false);
//   useEffect(() => {
//     if (didFetch.current) return;
//     didFetch.current = true;
//     fetchVideos(1, { replace: true });
//   }, [fetchVideos]);

//   // stable viewability config + handler
//   const viewConfigRef = useRef({ itemVisiblePercentThreshold: 85, minimumViewTime: 120 });
//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     const idx = viewableItems?.[0]?.index ?? 0;
//     if (idx !== visibleIndexRef.current) {
//       visibleIndexRef.current = idx;
//       setVisibleIndex(idx);
//     }
//   });

//   const share = (url: string) => Share.share({ title: 'Share', message: url });

//   // pull-to-refresh handler
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     setHasMore(true);
//     visibleIndexRef.current = 0;
//     setVisibleIndex(0);
//     await fetchVideos(1, { replace: true });
//     setRefreshing(false);
//   }, [fetchVideos]);

//   // optional footer loader when paginating
//   const ListFooter = () =>
//     loading && hasMore ? (
//       <View style={{ paddingVertical: 16 }}>
//         <ActivityIndicator />
//       </View>
//     ) : (
//       <View style={{ height: SPACING }} />
//     );

//   return (
//     <View style={{ flex: 1, backgroundColor: 'black' }}>
//       <FlatList
//         data={videos}
//         keyExtractor={(item) => item.fileId}
//         renderItem={({ item, index }) => {
//           const playbackUrl = item.hls ? item.hls : item.video; // prefer HLS, fallback MP4
//           return (
//             <VideoFeedItem
//               videoUrl={playbackUrl}
//               isVisible={index === visibleIndex}
//               thumbnailUrl={item.thumbnail || ''}
//             // onShare={() => share(item.video)}
//             />
//           );
//         }}
//         pagingEnabled
//         snapToInterval={VIDEO_HEIGHT + SPACING}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         getItemLayout={(_, index) => ({
//           length: VIDEO_HEIGHT + SPACING,
//           offset: (VIDEO_HEIGHT + SPACING) * index,
//           index,
//         })}
//         ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
//         viewabilityConfig={viewConfigRef.current}
//         onViewableItemsChanged={onViewableItemsChanged.current}
//         onEndReachedThreshold={0.3}
//         onEndReached={() => hasMore && fetchVideos(page)}
//         windowSize={5}
//         initialNumToRender={3}
//         maxToRenderPerBatch={3}
//         removeClippedSubviews={false}
//         // Pull-to-refresh:
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//         // Or use RefreshControl to customize the spinner:
//         // refreshControl={
//         //   <RefreshControl
//         //     refreshing={refreshing}
//         //     onRefresh={onRefresh}
//         //     colors={['#23d18b']}   // Android spinner color
//         //     tintColor="#23d18b"    // iOS spinner color
//         //   />
//         // }
//         ListFooterComponent={ListFooter}
//       />
//     </View>
//   );
// }




import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import VideoFeedItem from '../../components/VideoFeedItem';
import { SPACING, VIDEO_HEIGHT } from '../../constants/Colors';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useSubscriptionStore } from '../../stores/subscriptionStore';


const BASE_URL = 'https://talesfromthenorthpole.xyz:3001';
const FREE_VIDEOS = 6; // 👈 gate after this many
const SUB_BG = require('@/assets/images/splash-bg.png');

type VideoItem = {
  fileId: string;
  video: string;
  hls?: string | null;
  thumbnail?: string | null;
  createdAt: string;
};

type ApiResp = {
  total: number;
  page: number;
  limit: number;
  videos: Array<{
    fileId: string;
    video: string;
    hls?: string | null;
    thumbnail?: string | null;
    createdAt: string;
  }>;
};

// Row model for FlatList (either a video or the paywall)
type Row =
  | { kind: 'video'; item: VideoItem }
  | { kind: 'gate'; id: 'subscription-gate' };

export default function VideoFeedScreen() {
  const router = useRouter();

  // Use real subscription state from store
  const {
    isSubscribed,
    isLoading: subscriptionLoading,
    annualPrice,
    checkSubscriptionStatus,
    setSubscribedForTesting
  } = useSubscriptionStore();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // visible ROW index (includes the gate)
  const [visibleRowIndex, setVisibleRowIndex] = useState(0);
  const visibleRowIndexRef = useRef(0);

  const toAbs = (rel?: string | null) =>
    rel ? (rel.startsWith('http') ? rel : `${BASE_URL}${rel}`) : undefined;

  const fetchVideos = useCallback(
    async (pageNum: number, opts: { replace?: boolean } = {}) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/videos?page=${pageNum}&limit=10&paid=false`);
        const data: ApiResp = await res.json();

        const newItems: VideoItem[] = (data.videos ?? []).map((v) => ({
          ...v,
          video: toAbs(v.video)!,
          hls: toAbs(v.hls || undefined),
          thumbnail: toAbs(v.thumbnail || undefined),
        }));

        if (opts.replace) {
          setVideos(newItems);
          setHasMore(newItems.length > 0);
          setPage(newItems.length > 0 ? pageNum + 1 : 1);
          return;
        }

        if (newItems.length === 0) {
          setHasMore(false);
          return;
        }

        // append + de-dupe
        setVideos((prev) => {
          const map = new Map(prev.map((x) => [x.fileId, x]));
          newItems.forEach((x) => map.set(x.fileId, { ...map.get(x.fileId), ...x }));
          return Array.from(map.values()).sort(
            (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
          );
        });
        setPage((p) => p + 1);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  // initial load and subscription check
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchVideos(1, { replace: true });
    // Check subscription status on app start
    checkSubscriptionStatus();
  }, [fetchVideos, checkSubscriptionStatus]);

  // Build rows with a gate if not subscribed
  const rows: Row[] = useMemo(() => {
    if (isSubscribed) {
      return videos.map((v) => ({ kind: 'video', item: v }));
    }
    const slice = videos.slice(0, FREE_VIDEOS).map((v) => ({ kind: 'video', item: v }) as Row);
    return [...slice, { kind: 'gate', id: 'subscription-gate' }];
  }, [videos, isSubscribed]);

  // viewability
  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 85, minimumViewTime: 120 });
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const idx = viewableItems?.[0]?.index ?? 0;
    if (idx !== visibleRowIndexRef.current) {
      visibleRowIndexRef.current = idx;
      setVisibleRowIndex(idx);
    }
  });

  // const share = (url: string) => Share.share({ title: 'Share', message: url });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    visibleRowIndexRef.current = 0;
    setVisibleRowIndex(0);
    await fetchVideos(1, { replace: true });
    setRefreshing(false);
  }, [fetchVideos]);

  const ListFooter = () =>
    loading && hasMore ? (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    ) : (
      <View style={{ height: SPACING }} />
    );

  // Do not paginate past the gate unless subscribed
  const handleEndReached = () => {
    if (!isSubscribed && videos.length >= FREE_VIDEOS) return;
    if (hasMore) fetchVideos(page);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={rows}
        keyExtractor={(row, i) => (row.kind === 'video' ? row.item.fileId : row.id)}
        renderItem={({ item: row, index: rowIndex }) => {
          if (row.kind === 'gate') {
            return (
              <SubscriptionGate
                onSubscribe={() => router.push('/subscribe')}
                onRestore={() => router.push('/subscribe')}
                annualPrice={annualPrice}
                isLoading={subscriptionLoading}
                router={router}
                // temp: simulate purchase success
                onDevUnlock={() => setSubscribedForTesting(true)}
              />
            );
          }

          const item = row.item;
          const playbackUrl = item.hls ? item.hls : item.video;

          return (
            <VideoFeedItem
              videoUrl={playbackUrl}
              isVisible={rowIndex === visibleRowIndex}
              thumbnailUrl={item.thumbnail || ''}
            // onShare={() => share(item.video)}
            />
          );
        }}
        pagingEnabled
        snapToInterval={VIDEO_HEIGHT + SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: VIDEO_HEIGHT + SPACING,
          offset: (VIDEO_HEIGHT + SPACING) * index,
          index,
        })}
        ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onEndReachedThreshold={0.3}
        onEndReached={handleEndReached}
        windowSize={5}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        removeClippedSubviews={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={ListFooter}
      />
    </View>
  );
}

/** Enhanced Apple-compliant subscription gate */
function SubscriptionGate({
  onSubscribe,
  onRestore,
  onDevUnlock,
  annualPrice = '$19.99',
  isLoading = false,
  router,
}: {
  onSubscribe: () => void;
  onRestore: () => void;
  onDevUnlock?: () => void;
  annualPrice?: string;
  isLoading?: boolean;
  router: any;
}) {
  const { width } = useWindowDimensions();
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  // Responsive scale
  const scale = Math.min(width, 520) / 375;
  const titleSize = clamp(26 * scale, 22, 32);
  const subtitleSize = clamp(16 * scale, 14, 18);
  const priceSize = clamp(32 * scale, 26, 40);
  const periodSize = clamp(16 * scale, 14, 18);
  const featureSize = clamp(15 * scale, 13, 17);
  const ctaHeight = clamp(52 * scale, 46, 60);
  const ctaRadius = clamp(16 * scale, 14, 20);
  const maxCardWidth = Math.min(width - 24, 580);

  // Apple-required subscription terms
  const subscriptionTerms = {
    renewalInfo: 'Auto-renews yearly unless cancelled 24 hours before renewal.',
    managementInfo: 'Manage in Apple ID settings after purchase.',
  };

  return (
    <View style={{ height: VIDEO_HEIGHT, backgroundColor: '#000' }}>
      {/* Premium background */}
      <ImageBackground source={SUB_BG} style={StyleSheet.absoluteFill} blurRadius={12} />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Main content */}
      <View style={gateStyles.container}>
        {/* Premium badge */}
        <View style={gateStyles.premiumBadge}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={gateStyles.premiumBadgeText}>PREMIUM</Text>
        </View>

        {/* Main card */}
        <View style={[gateStyles.mainCard, { maxWidth: maxCardWidth }]}>
          {/* Header */}
          <View style={gateStyles.header}>
            <Ionicons name="lock-open" size={32} color="#FFD700" />
            <Text style={[gateStyles.title, { fontSize: titleSize }]}>
              Unlock All Stories
            </Text>
            <Text style={[gateStyles.subtitle, { fontSize: subtitleSize }]}>
              Continue your magical journey with unlimited access
            </Text>
          </View>

          {/* Features grid */}
          <View style={gateStyles.featuresGrid}>
            <FeatureItem icon="play-circle" text="Unlimited videos" size={featureSize} />
            <FeatureItem icon="calendar" text="New stories weekly" size={featureSize} />
            <FeatureItem icon="shield-checkmark" text="Ad-free experience" size={featureSize} />
            <FeatureItem icon="people" text="Family-safe content" size={featureSize} />
          </View>

          {/* Pricing */}
          <View style={gateStyles.pricingSection}>
            <View style={gateStyles.priceRow}>
              <Text style={[gateStyles.price, { fontSize: priceSize }]}>{annualPrice}</Text>
              <Text style={[gateStyles.period, { fontSize: periodSize }]}>/year</Text>
            </View>
            <Text style={gateStyles.priceSubtext}>Just {(parseFloat(annualPrice.replace('$', '')) / 12).toFixed(2)}/month</Text>
          </View>

          {/* Subscribe Button - Apple Compliant */}
          <Pressable
            onPress={onSubscribe}
            accessibilityRole="button"
            accessibilityLabel={`Subscribe for ${annualPrice} per year`}
            disabled={isLoading}
            style={[
              gateStyles.subscribeButton,
              {
                height: ctaHeight,
                borderRadius: ctaRadius,
              },
              isLoading && gateStyles.subscribeButtonDisabled
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="star" size={20} color="white" />
                <Text style={[gateStyles.subscribeButtonText, { fontSize: clamp(17 * scale, 15, 19) }]}>
                  Start Premium - {annualPrice}/year
                </Text>
              </>
            )}
          </Pressable>

          {/* Apple Required Terms */}
          <View style={gateStyles.termsSection}>
            <Text style={gateStyles.termsText}>
              • {subscriptionTerms.renewalInfo}
            </Text>
            <Text style={gateStyles.termsText}>
              • {subscriptionTerms.managementInfo}
            </Text>
          </View>

          {/* Secondary Actions */}
          <View style={gateStyles.secondaryActions}>
            <Pressable onPress={onRestore} style={gateStyles.restoreButton}>
              <Text style={gateStyles.restoreText}>Restore Purchase</Text>
            </Pressable>

            {__DEV__ && onDevUnlock && (
              <Pressable onPress={onDevUnlock} hitSlop={8} style={{ marginTop: 10, alignSelf: 'center' }}>
                <Text style={gateStyles.devText}>(Dev) Temporarily Unlock</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Legal Footer */}
        <View style={gateStyles.footer}>
          <View style={gateStyles.legalLinks}>
            <Pressable onPress={() => router.push('/legal?type=terms')} style={gateStyles.legalButton}>
              <Text style={gateStyles.legalText}>Terms of Service</Text>
            </Pressable>
            <Text style={gateStyles.legalSeparator}>•</Text>
            <Pressable onPress={() => router.push('/legal?type=privacy')} style={gateStyles.legalButton}>
              <Text style={gateStyles.legalText}>Privacy Policy</Text>
            </Pressable>
          </View>

          <Text style={gateStyles.disclaimer}>
            Price may vary by region. Subscription automatically renews unless cancelled.
          </Text>
        </View>
      </View>
    </View >
  );
}

// Feature Item Component for the gate
interface GateFeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  size: number;
}

const FeatureItem: React.FC<GateFeatureItemProps> = ({ icon, text, size }) => (
  <View style={gateStyles.featureItem}>
    <Ionicons name={icon} size={18} color="#4CAF50" />
    <Text style={[gateStyles.featureText, { fontSize: size }]}>{text}</Text>
  </View>
);

const gateStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Premium badge
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  premiumBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 1,
  },

  // Main card
  mainCard: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },

  // Header section
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 12,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },

  // Features grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  featureText: {
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    flex: 1,
  },

  // Pricing section
  pricingSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  price: {
    color: '#FFD700',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  period: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  priceSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },

  // Subscribe button
  subscribeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  // Terms section
  termsSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  termsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },

  // Secondary actions
  secondaryActions: {
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  restoreText: {
    color: '#007AFF',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  devButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  devText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  legalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  legalText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginHorizontal: 8,
  },
  disclaimer: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
