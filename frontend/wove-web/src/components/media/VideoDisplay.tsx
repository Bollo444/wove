import React from 'react';

interface VideoDisplayProps {
  src: string;
  alt?: string; // For accessibility, though video alt is complex
  caption?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean; // Good default for autoplay
  controls?: boolean;
  poster?: string; // Thumbnail image
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  src,
  alt,
  caption,
  className,
  width = '100%',
  height = 'auto',
  autoPlay = false,
  loop = false,
  muted = false, // Muted is often required for autoplay in browsers
  controls = true,
  poster,
}) => {
  if (!src) return null;

  return (
    <figure className={`my-4 ${className || ''}`} data-oid="38vrbwp">
      <video
        src={src}
        width={width}
        height={height}
        autoPlay={autoPlay}
        loop={loop}
        muted={autoPlay ? true : muted} // If autoplay is true, force muted unless explicitly unmuted
        controls={controls}
        poster={poster}
        className="w-full h-auto rounded-md shadow-md bg-black" // bg-black for letterboxing
        aria-label={alt || 'Video content'}
        data-oid="l71sntw"
      >
        Your browser does not support the video tag.
        {/* TODO: Add <track> elements for subtitles, captions, descriptions */}
      </video>
      {caption && (
        <figcaption className="mt-2 text-xs text-center text-gray-500 italic" data-oid="61vv8qc">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoDisplay;
