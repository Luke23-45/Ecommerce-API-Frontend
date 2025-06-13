// src/components/common/ImageUploader/ImageUploader.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaUpload, FaTrashAlt, FaPlus } from "react-icons/fa"; // Added FaPlus
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

  useEffect(() => {
    const initialRecords: ImageRecord[] = initialImageUrls.map((url) => ({
      id: url,
      type: "EXISTING",
      url,
    }));
    setImages(initialRecords);
  }, [initialImageUrls]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.type === "NEW") URL.revokeObjectURL(image.url);
      });
    };
  }, [images]);

  const updateParent = useCallback(
    (updatedImages: ImageRecord[]) => {
      const newFiles = updatedImages
        .filter((img) => img.type === "NEW")
        .map((img) => img.file!);
      const currentExistingUrls = updatedImages
        .filter((img) => img.type === "EXISTING")
        .map((img) => img.url);
      const deletedPublicIds = initialImageUrls.filter(
        (initialUrl) => !currentExistingUrls.includes(initialUrl)
      );
      onImagesUpdate(newFiles, deletedPublicIds);
    },
    [initialImageUrls, onImagesUpdate]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files
        ? Array.from(event.target.files)
        : [];
      if (selectedFiles.length === 0) return;
      if (images.length + selectedFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        event.target.value = ""; // Clear the input
        return;
      }
      const newImageRecords: ImageRecord[] = selectedFiles.map((file) => ({
        id: `new-${file.name}-${Date.now()}`,
        type: "NEW",
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((currentImages) => {
        const updated = [...currentImages, ...newImageRecords];
        updateParent(updated);
        return updated;
      });
      event.target.value = ""; // Clear the input after processing
    },
    [images, maxFiles, updateParent]
  );

  const handleDelete = useCallback(
    (idToDelete: string) => {
      setImages((currentImages) => {
        const updated = currentImages.filter((img) => img.id !== idToDelete);
        updateParent(updated);
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
        updateParent(items);
        return items;
      });
    },
    [updateParent]
  );

  // Drag and drop handlers for the dropzone container
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
        handleFileChange({
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [disabled, handleFileChange]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  return (
    <UploaderWrapper isMini={isMini}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* 1. RENDER THE MAIN DROPZONE (NON-MINI MODE) */}
        {!isMini && (
          <DropzoneContainer
            isDraggingOver={false} // This can be enhanced further if needed
            isDisabled={disabled}
            isMini={isMini}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* The hidden file input is essential */}
            <UploadInput
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={disabled}
            />
            <UploadIcon isMini={isMini}>
              <FaUpload />
            </UploadIcon>
            <UploadText isMini={isMini}>
              {label} or <span>Click to Browse</span> (Max {maxFiles})
            </UploadText>
          </DropzoneContainer>
        )}

        <Droppable
          droppableId={`image-grid-${instanceId}`}
          direction="horizontal"
        >
          {(provided) => (
            <ImagePreviewGrid
              {...provided.droppableProps}
              ref={provided.innerRef}
              isMini={isMini}
            >
              {images.map((image, index) => (
                <Draggable
                  key={image.id}
                  draggableId={image.id}
                  index={index}
                  isDragDisabled={!!disabled}
                >
                  {(provided, snapshot) => (
                    <ImagePreviewContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      isMini={isMini}
                    >
                      <img src={image.url} alt={`Preview ${index + 1}`} />
                      {index === primaryImageIndex && (
                        <PrimaryBadge>MAIN</PrimaryBadge>
                      )}
                      {!disabled && (
                        <DeleteButton
                          type="button"
                          onClick={() => handleDelete(image.id)}
                        >
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

        {/* 2. RENDER A SMALL UPLOAD BUTTON (MINI MODE) */}
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
            {/* The hidden input is shared */}
            <UploadInput
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={disabled}
            />
            <UploadIcon
              isMini={isMini}
              style={{ marginBottom: "0", fontSize: "1.2rem" }}
            >
              <FaPlus />
            </UploadIcon>
          </DropzoneContainer>
        )}
      </DragDropContext>
    </UploaderWrapper>
  );
};

export default ImageUploader;
