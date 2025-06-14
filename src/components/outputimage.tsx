import React, { useState } from 'react';
import { typography } from '@/app/styles/typography';
import Icon from './icon/Icon';

interface ImageData {
  url: string;
  resolution?: string;
  duration?: string;
  tags?: string[];
}

interface OutputImageProps {
  images: ImageData[];
  className?: string;
}

const OutputImage: React.FC<OutputImageProps> = ({
  images,
  className = '',
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

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
              src={image.url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
              {image.resolution && <div>Resolution: {image.resolution}</div>}
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {image.tags.map((tag, i) => (
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
              src={selectedImage.url}
              alt="Preview"
              className="w-full h-auto rounded-md"
            />
            <div className="mt-4 text-white">
              {selectedImage.resolution && <div>Resolution: {selectedImage.resolution}</div>}
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedImage.tags.map((tag, i) => (
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

export default OutputImage;
