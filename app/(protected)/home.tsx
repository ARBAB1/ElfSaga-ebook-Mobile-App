import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Replace with your actual base URL
// const BASE_URL = 'http://localhost:3001';
const BASE_URL = "https://talesfromthenorthpole.xyz:3001";

type Video = {
    fileId: string;
    video: string;
    thumbnail: string;
    addedOn: string;
};

const VideoListScreen = () => {
    const [videos, setVideos] = useState<Video[]>([]); // Define type for videos state
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch videos from API
    const fetchVideos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/videos?page=${page}&limit=10&paid=true`);
            const data = await response.json();
            setVideos((prevVideos) => [...prevVideos, ...data.videos]); // Append new videos to the list
            setTotal(data.total);
            setPage((prevPage) => prevPage + 1); // Increment page for next fetch
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load videos when the component mounts
    useEffect(() => {
        fetchVideos();
    }, []);

    // Render each video item
    const renderItem = ({ item }: { item: Video }) => (
        <View style={styles.videoItem}>
            <Image
                source={{ uri: `${BASE_URL}${item.thumbnail}` }} // Video thumbnail from API
                style={styles.thumbnail}
            />
            <Text style={styles.videoTitle}>Video ID: {item.fileId}</Text>
            <Text style={styles.createdAt}>
                Added on: {new Date(item.addedOn).toLocaleDateString()}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // Navigate to video player or open video in a new screen
                    alert(`Playing video: ${item.fileId}`);
                }}
            >
                <Text style={styles.buttonText}>Watch Video</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Video List</Text>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <FlatList
                data={videos}
                keyExtractor={(item) => item.fileId}
                renderItem={renderItem}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
                }
                onEndReached={total > videos.length ? fetchVideos : null} // Load more if there are more videos
                onEndReachedThreshold={0.5} // Trigger load more when 50% is scrolled
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
    },
    videoItem: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    createdAt: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#066863',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VideoListScreen;
