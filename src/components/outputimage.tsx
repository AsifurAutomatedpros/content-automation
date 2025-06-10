import React, { useState } from 'react';
import { typography } from '@/app/styles/typography';
import Icon from './icon/Icon';

interface OutputImageProps {
  images: string[];
  className?: string;
}

const OutputImage: React.FC<OutputImageProps> = ({
  images,
  className = '',
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-md overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              className="absolute -top-12 right-0 text-white hover:text-[var(--color-brand-orange)]"
              onClick={() => setSelectedImage(null)}
            >
              <Icon name="close" size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputImage;
