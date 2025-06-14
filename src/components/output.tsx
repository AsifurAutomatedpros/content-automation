import React from 'react';
import OutputText from './outputtext';
import OutputImage from './outputimage';
import OutputVideo from './outputvideo';

interface MediaData {
  url: string;
  resolution?: string;
  duration?: string;
  tags?: string[];
}

interface OutputProps {
  type: 'text' | 'image' | 'video';
  content: string | MediaData[];
  className?: string;
}

const parseMediaUrl = (url: string): MediaData => {
  // Extract basic URL without query parameters
  const baseUrl = url.split('?')[0];
  
  // Extract file type from URL
  const fileType = baseUrl.split('.').pop()?.toLowerCase();
  
  // Default data structure
  const mediaData: MediaData = {
    url: url,
    tags: []
  };

  // Add file type as a tag
  if (fileType) {
    mediaData.tags = [fileType];
  }

  // You can add more parsing logic here to extract other metadata
  // For example, from query parameters or by analyzing the URL structure

  return mediaData;
};

const Output: React.FC<OutputProps> = ({
  type,
  content,
  className = '',
}) => {
  const renderContent = () => {
    switch (type) {
      case 'text':
        return <OutputText content={content as string} />;
      case 'image':
        const imageUrls = Array.isArray(content) ? content : [content];
        const imageData = imageUrls.map(url => 
          typeof url === 'string' ? parseMediaUrl(url) : url
        );
        return <OutputImage images={imageData} />;
      case 'video':
        const videoUrls = Array.isArray(content) ? content : [content];
        const videoData = videoUrls.map(url => 
          typeof url === 'string' ? parseMediaUrl(url) : url
        );
        return <OutputVideo videos={videoData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {renderContent()}
    </div>
  );
};

export default Output;
