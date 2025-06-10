import React from 'react';
import OutputText from './outputtext';
import OutputImage from './outputimage';
import OutputVideo from './outputvideo';

interface OutputProps {
  type: 'text' | 'image' | 'video';
  content: string | string[];
  className?: string;
}

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
        return <OutputImage images={content as string[]} />;
      case 'video':
        return <OutputVideo videos={content as string[]} />;
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
