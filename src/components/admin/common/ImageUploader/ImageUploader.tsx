// src/components/Admin/Common/ImageUploader/ImageUploader.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import {
  ImageUploaderContainer,
  UploadInput,
  UploadText,
  ImagePreviewGrid,
  ImagePreview,
} from './ImageUploader.styles';

interface ImageUploaderProps {
  initialImageUrls?: string[]; // Existing images (URLs)
  onImagesChange: (newImageFiles: File[]) => void; // Callback for newly selected files (File objects)
  onImageUrlsDelete?: (urlToDelete: string) => void; // Callback when an existing URL is deleted
  maxFiles?: number;
  accept?: string; // e.g., "image/jpeg, image/png"
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImageUrls = [],
  onImagesChange,
  onImageUrlsDelete,
  maxFiles = 5,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageFiles, setCurrentImageFiles] = useState<File[]>([]); // For new files
  const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>(initialImageUrls); // For both existing and new preview URLs

  // Update displayedImageUrls when initialImageUrls prop changes (e.g., when editing different products)
  useEffect(() => {
    setDisplayedImageUrls(initialImageUrls);
    // When prop changes, reset new files if appropriate (e.g., switching products)
    setCurrentImageFiles([]);
  }, [initialImageUrls]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      const newFilesCount = selectedFiles.length + displayedImageUrls.length + currentImageFiles.length;
      if (newFilesCount > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        return;
      }

      setCurrentImageFiles(prevFiles => {
        const updatedFiles = [...prevFiles, ...selectedFiles];
        onImagesChange(updatedFiles); // Inform parent about new file objects
        return updatedFiles;
      });

      // For preview purposes, combine existing URLs with new file URLs
      setDisplayedImageUrls(prevUrls => [
        ...prevUrls,
        ...selectedFiles.map(file => URL.createObjectURL(file)),
      ]);
    }
  }, [maxFiles, onImagesChange, displayedImageUrls.length, currentImageFiles.length]);

  const handleDeleteImage = useCallback((indexToDelete: number) => {
    // Determine if it's an initial URL or a newly added file
    const isInitialUrl = indexToDelete < initialImageUrls.length;
    const urlToDelete = displayedImageUrls[indexToDelete];

    if (isInitialUrl && onImageUrlsDelete) {
      onImageUrlsDelete(urlToDelete); // Callback for deleting an existing image by its URL
    } else {
      // It's a newly added file, remove it from currentImageFiles
      const fileIndex = indexToDelete - initialImageUrls.length; // Index within the new files array
      setCurrentImageFiles(prevFiles => {
        const updatedFiles = prevFiles.filter((_, idx) => idx !== fileIndex);
        onImagesChange(updatedFiles); // Update parent about remaining new file objects
        return updatedFiles;
      });
    }

    // Update local display preview
    setDisplayedImageUrls(prevUrls => prevUrls.filter((_, idx) => idx !== indexToDelete));

    // Revoke object URL for newly added files that are removed (optional but good for memory)
    if (!isInitialUrl) {
      URL.revokeObjectURL(urlToDelete);
    }

  }, [initialImageUrls, displayedImageUrls, onImagesChange, onImageUrlsDelete]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (fileInputRef.current) {
        fileInputRef.current.files = files; // Assign files to input element for reusability
        handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>); // Trigger existing change handler
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default to allow drop
    event.stopPropagation();
  }, []);

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <ImageUploaderContainer onClick={() => fileInputRef.current?.click()}>
        <UploadInput
          type="file"
          multiple
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <FaUpload size={48} />
        <UploadText>
          Drag & Drop your images here, or <span>Click to Browse</span> (Max {maxFiles})
        </UploadText>
      </ImageUploaderContainer>
      
      {displayedImageUrls.length > 0 && (
        <ImagePreviewGrid>
          {displayedImageUrls.map((url, index) => (
            <ImagePreview key={index}>
              <img src={url} alt={`Product Image ${index + 1}`} />
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteImage(index); }} aria-label="Delete image">
                <FaTrashAlt />
              </button>
            </ImagePreview>
          ))}
        </ImagePreviewGrid>
      )}
    </div>
  );
};

export default ImageUploader;