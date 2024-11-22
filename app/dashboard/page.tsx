'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface Video {
  extractedId: string
  title: string
  votes: number
  thumbnailSml: string
}

export default function Dashboard() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoQueue, setVideoQueue] = useState<Video[]>([
    { extractedId: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', votes: 5, thumbnailSml: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { extractedId: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', votes: 4, thumbnailSml: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { extractedId: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', votes: 2, thumbnailSml: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
  ])

  const [currentVideo, setCurrentVideo] = useState<Video>({
    extractedId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    votes: 0,
    thumbnailSml: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
  })

  const REFRESH_INTERVAL_MS = 10 * 1000;

  useEffect(() => {
    const insertStreams = async () => {
      const userDetailsResponse = await fetch("/api/userContext");
      
      if (!userDetailsResponse.ok) {
        console.log("Failed to fetch user details");
        return;
      }

      const userDetails = await userDetailsResponse.json();
      const userId = userDetails.id;

      try {
        await Promise.all(videoQueue.map(async (video) => {
          const response = await fetch("/api/streams", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              creatorId: userId,
              url: `https://www.youtube.com/watch?v=${video.extractedId}`,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            console.log("Stream added successfully:", result);
          } else {
            console.error("Failed to insert stream:", result.message);
          }
        }));
      } catch (error) {
        console.error("Error inserting streams:", error);
      }
    };

    insertStreams();
  }, []);

  useEffect(() => {
    const refreshStreams = async () => {
      const res = await fetch(`/api/streams/my`, {
        credentials: "include"
      });
      console.log(res);
    };

    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const addVideo = async () => {
    if (!videoUrl.trim()) {
      console.log("Please enter a valid URL");
      return;
    }

    try {
      const userDetailsResponse = await fetch("/api/userContext");
      
      if (!userDetailsResponse.ok) {
        console.log("Failed to fetch user details");
        return;
      }
      const userDetails = await userDetailsResponse.json();
      const userId = userDetails.id;

      const addVideoResponse = await fetch(`/api/streams`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: userId,
          url: videoUrl
        })
      });

      if (!addVideoResponse.ok) {
        console.error('Failed to add video');
        return;
      }

      const responseJson = await addVideoResponse.json();
      const streamId = responseJson.id;
      
      if (!streamId) {
        console.error('No stream ID returned');
        return;
      }
      else{
        console.log(streamId);
      }

      const videoDetailsResponse = await fetch(`/api/streams/?creatorId=${userId}&streamId=${streamId}`);
      
      if (!videoDetailsResponse.ok) {
        console.error('Failed to fetch video details');
        return;
      }

      const videoDetails = await videoDetailsResponse.json();
      console.log(videoDetails)
      
      if (!videoDetails.stream.title || !videoDetails.stream.thumbnailSml) {
        console.log(videoDetails.stream.title);
        console.log(videoDetails.stream.thumbnailSml);
        console.error('Invalid video details returned');
        return;
      }

      setVideoQueue(prevQueue => [...prevQueue, {
        extractedId: extractVideoId(videoUrl) ?? "",
        title: videoDetails.stream.title || 'Untitled Video',
        votes: 0,
        thumbnailSml: videoDetails.stream.thumbnailSml || ''
      }]);
      
      setVideoUrl('');
    } catch (error) {
      console.error('Error adding video:', error);
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const vote = async (index: number, amount: number) => {
    try {
      const response = await fetch(`/api/streams/?extractedId=${videoQueue[index].extractedId}`);
      const data = await response.json();
      console.log(data);
      const streamId = data.streamId;
      
      if (!streamId) {
        console.log(streamId);
        console.log("streamId is wrong");
        return;
      }
      
      const upvoteResponse = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          streamId: streamId
        })
      });
      const responseJson = await upvoteResponse.json();
      if (upvoteResponse.ok && responseJson.message !== "Removing the upvote") {
        setVideoQueue(prevQueue => {
          const newQueue = prevQueue.map((video, i) => {
            if (i === index) {
              return { ...video, votes: video.votes + amount };
            }
            return video;
          });
          return newQueue.sort((a, b) => b.votes - a.votes);
        });
      } else if (responseJson.message === "Removing the upvote") {
        console.log(responseJson.message);
        setVideoQueue(prevQueue => {
          const newQueue = prevQueue.map((video, i) => {
            if (i === index) {
              return { ...video, votes: video.votes - amount };
            }
            return video;
          });
          return newQueue.sort((a, b) => b.votes - a.votes);
        });
      } else {
        console.log(responseJson.message);
      }
    } catch (error) {
      console.error("Error during voting:", error);
    }
  }

  const removeVideo = (index: number) => {
    setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  }

  const playNext = () => {
    setVideoQueue(prevQueue => {
      if (prevQueue.length > 0) {
        setCurrentVideo(prevQueue[0]);
        return prevQueue.slice(1);
      }
      return prevQueue;
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Song Voting Queue</h1>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
        
        {/* Currently playing video */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.extractedId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Currently playing video"
            ></iframe>
          </div>
          <h2 className="text-xl font-semibold text-center">{currentVideo.title}</h2>
          <Button onClick={playNext} size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Play Next Song
          </Button>
        </div>

        {/* Input for new video */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Add a new video</h2>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                aria-label="YouTube URL input"
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-400"
              />
              <Button onClick={addVideo} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video queue */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Upcoming Videos</h2>
            <ul className="space-y-4">
              {videoQueue.map((video, index) => (
                <li key={video.extractedId} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <div className="flex items-center space-x-4">
                    {video.thumbnailSml && (
                      <Image
                        src={video.thumbnailSml}
                        alt={`Thumbnail for ${video.title}`}
                        width={120}
                        height={90}
                        className="rounded"
                      />
                    )}
                    <span className="font-medium">{video.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{video.votes} votes</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, 1)}
                      aria-label={`Upvote ${video.title}`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, -1)}
                      aria-label={`Downvote ${video.title}`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeVideo(index)}
                      aria-label={`Remove ${video.title} from queue`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

