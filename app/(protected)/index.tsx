import { useEffect, useState } from 'react';
import { FlatList, Share, View } from 'react-native';
import VideoFeedItem from '../../components/VideoFeedItem';
import { SPACING, VIDEO_HEIGHT } from '../../constants/Colors';

// const BASE_URL = 'http://localhost:3001';
const BASE_URL = "https://talesfromthenorthpole.xyz:3001";

interface VideoItem {
  fileId: string;
  video: string;
  thumbnail: string;
}

export default function VideoFeedScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [page, setPage] = useState(1);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const fetchVideos = async (pageNum: number) => {
    if (!hasMore) return;
    try {
      const res = await fetch(`${BASE_URL}/videos?page=${pageNum}&limit=10&paid=false`);
      const data = await res.json();
      console.log(data)
      const newVideos: VideoItem[] = data.videos || [];
      if (newVideos.length === 0) return setHasMore(false);
      setVideos(prev => [...prev, ...newVideos]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };
  console.log(videos)

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    const newIndex = viewableItems?.[0]?.index ?? 0;
    setVisibleIndex(newIndex);
  };

  const share = (url: string) => {
    Share.share({ title: 'Share', message: url });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        // keyExtractor={(item) => item.fileId}
        renderItem={({ item, index }) => (
          <VideoFeedItem
            videoUrl={`${BASE_URL}${item.video}`}
            isVisible={index === visibleIndex}
            onShare={() => share(`${BASE_URL}${item.video}`)}
            thumbnailUrl={`${BASE_URL}${item.thumbnail}`}
          />
        )}
        pagingEnabled
        snapToInterval={VIDEO_HEIGHT + SPACING}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: VIDEO_HEIGHT + SPACING,
          offset: (VIDEO_HEIGHT + SPACING) * index,
          index,
        })}
        ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasMore && fetchVideos(page)}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => <View style={{ height: SPACING }} />}
      />
    </View>
  );
}
