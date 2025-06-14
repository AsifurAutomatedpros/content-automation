import React, { useState } from 'react';
import { typography } from '@/app/styles/typography';
import Icon from './icon/Icon';

interface VideoData {
  url: string;
  resolution?: string;
  duration?: string;
  tags?: string[];
}

interface OutputVideoProps {
  videos: VideoData[];
  className?: string;
}

const OutputVideo: React.FC<OutputVideoProps> = ({
  videos,
  className = '',
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-md overflow-hidden cursor-pointer group"
            onClick={() => setSelectedVideo(video)}
          >
            <video
              src={video.url}
              className="w-full h-full object-cover"
              poster={`${video.url}#t=0.1`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <Icon
                name="play-arrow"
                size={48}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
              {video.resolution && <div>Resolution: {video.resolution}</div>}
              {video.duration && <div>Duration: {video.duration}</div>}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {video.tags.map((tag, i) => (
                    <span key={i} className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              className="absolute -top-12 right-0 text-white hover:text-[var(--color-brand-orange)]"
              onClick={() => setSelectedVideo(null)}
            >
              <Icon name="close" size={24} />
            </button>
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full h-auto rounded-md"
            />
            <div className="mt-4 text-white">
              {selectedVideo.resolution && <div>Resolution: {selectedVideo.resolution}</div>}
              {selectedVideo.duration && <div>Duration: {selectedVideo.duration}</div>}
              {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVideo.tags.map((tag, i) => (
                    <span key={i} className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputVideo;
