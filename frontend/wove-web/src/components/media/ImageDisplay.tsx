import React from 'react';

interface ImageDisplayProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt, caption, className }) => {
  if (!src) return null;

  return (
    <figure className={`my-4 ${className || ''}`} data-oid="gv7pes5">
      <img
        src={src}
        alt={alt || 'Story image'}
        className="w-full h-auto rounded-md shadow-md object-cover"
        data-oid="cyy:fze"
      />

      {caption && (
        <figcaption className="mt-2 text-xs text-center text-gray-500 italic" data-oid="e3fbfb8">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageDisplay;
