import React, { useState } from 'react';
import { typography } from '@/app/styles/typography';
import Icon from './icon/Icon';

interface OutputVideoProps {
  videos: string[];
  className?: string;
}

const OutputVideo: React.FC<OutputVideoProps> = ({
  videos,
  className = '',
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
              src={video}
              className="w-full h-full object-cover"
              poster={`${video}#t=0.1`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <Icon
                name="play-arrow"
                size={48}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
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
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputVideo;
