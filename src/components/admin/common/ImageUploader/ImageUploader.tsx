// src/components/common/ImageUploader/ImageUploader.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaUpload, FaTrashAlt, FaPlus } from "react-icons/fa";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import {
  UploaderWrapper,
  DropzoneContainer,
  UploadInput,
  UploadIcon,
  UploadText,
  ImagePreviewGrid,
  ImagePreviewContainer,
  DeleteButton,
  PrimaryBadge,
} from "./ImageUploader.styles";

type ImageRecord = {
  id: string;
  type: "EXISTING" | "NEW";
  url: string;
  file?: File;
};

interface ImageUploaderProps {
  instanceId: string;
  initialImageUrls?: string[];
  onImagesUpdate: (newFiles: File[], deletedPublicIds: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  isMini?: boolean;
  label?: string;
  primaryImageIndex?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  instanceId,
  initialImageUrls = [],
  onImagesUpdate,
  maxFiles = 10,
  disabled = false,
  isMini = false,
  label = "Upload or drag-and-drop images",
  primaryImageIndex = 0,
}) => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This effect synchronizes the internal state whenever the initial URLs from the parent change.
  // This is crucial for initializing the component correctly in an "edit" form.
  useEffect(() => {
    const initialRecords: ImageRecord[] = initialImageUrls.map((url) => ({
      id: url, // Use the stable URL as the ID for existing images
      type: "EXISTING",
      url,
    }));
    setImages(initialRecords);
  }, [initialImageUrls]);

  // This effect is for cleanup. It revokes the temporary object URLs for newly added
  // files to prevent memory leaks when the component unmounts.
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.type === "NEW") {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  // --- ** THE DEFINITIVE FIX ** ---
  // The `updateParent` function is the core of the fix. It's stable because its dependency
  // `onImagesUpdate` is memoized in the parent. It calculates the final state and calls the parent.
  const updateParent = useCallback(
    (updatedImages: ImageRecord[]) => {
      const newFiles = updatedImages
        .filter((img) => img.type === "NEW" && img.file)
        .map((img) => img.file!);
      
      const currentExistingUrls = new Set(
        updatedImages.filter((img) => img.type === "EXISTING").map((img) => img.url)
      );
    
      const deletedPublicIds = initialImageUrls.filter(
        (initialUrl) => !currentExistingUrls.has(initialUrl)
      );
      
      onImagesUpdate(newFiles, deletedPublicIds);
    },
    [initialImageUrls, onImagesUpdate]
  );

  // --- Handlers now call `updateParent` after setting their own state ---
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
      if (selectedFiles.length === 0) return;

      setImages((currentImages) => {
        if (currentImages.length + selectedFiles.length > maxFiles) {
          alert(`You can only upload a maximum of ${maxFiles} images.`);
          return currentImages;
        }
        const newImageRecords: ImageRecord[] = selectedFiles.map((file) => ({
          id: `new-${file.name}-${Date.now()}-${Math.random()}`,
          type: "NEW",
          url: URL.createObjectURL(file),
          file,
        }));
        const updated = [...currentImages, ...newImageRecords];
        updateParent(updated); // Notify parent
        return updated;
      });
      event.target.value = "";
    },
    [maxFiles, updateParent]
  );

  const handleDelete = useCallback(
    (idToDelete: string) => {
      setImages((currentImages) => {
        const updated = currentImages.filter((img) => img.id !== idToDelete);
        updateParent(updated); // Notify parent
        return updated;
      });
    },
    [updateParent]
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      setImages((currentImages) => {
        const items = Array.from(currentImages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination!.index, 0, reorderedItem);
        updateParent(items); // Notify parent
        return items;
      });
    },
    [updateParent]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled || !fileInputRef.current) return;
      fileInputRef.current.files = event.dataTransfer.files;
      handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    },
    [disabled, handleFileChange]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <UploaderWrapper isMini={isMini}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {!isMini && (
          <DropzoneContainer
            isDraggingOver={false}
            isDisabled={disabled}
            isMini={isMini}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadInput
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={disabled}
            />
            <UploadIcon isMini={isMini}><FaUpload /></UploadIcon>
            <UploadText isMini={isMini}>
              {label} or <span>Click to Browse</span> (Max {maxFiles})
            </UploadText>
          </DropzoneContainer>
        )}

        <Droppable droppableId={`image-grid-${instanceId}`} direction="horizontal">
          {(provided) => (
            <ImagePreviewGrid {...provided.droppableProps} ref={provided.innerRef} isMini={isMini}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index} isDragDisabled={!!disabled}>
                  {(provided, snapshot) => (
                    <ImagePreviewContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      isMini={isMini}
                    >
                      <img src={image.url} alt={`Preview ${index + 1}`} />
                      {index === primaryImageIndex && (<PrimaryBadge>MAIN</PrimaryBadge>)}
                      {!disabled && (
                        <DeleteButton type="button" onClick={() => handleDelete(image.id)}>
                          <FaTrashAlt size={12} />
                        </DeleteButton>
                      )}
                    </ImagePreviewContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ImagePreviewGrid>
          )}
        </Droppable>

        {isMini && images.length < maxFiles && !disabled && (
          <DropzoneContainer
            isDraggingOver={false}
            isDisabled={disabled}
            isMini={isMini}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ marginTop: "8px", padding: "8px" }}
          >
            <UploadInput type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} disabled={disabled} />
            <UploadIcon isMini={isMini} style={{ marginBottom: "0", fontSize: "1.2rem" }}><FaPlus /></UploadIcon>
          </DropzoneContainer>
        )}
      </DragDropContext>
    </UploaderWrapper>
  );
};

export default ImageUploader;