// src/components/common/ImageUploader/ImageUploader.styles.ts

import styled, { css, type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const UploaderWrapper = styled.div<{ isMini?: boolean }>`
  width: 100%;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily};
  ${(props) => props.isMini && 'max-width: 250px;'} // Constrain width in mini mode
`;

export const PrimaryBadge = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: ${(props) => props.theme.colors.accent1};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  pointer-events: none; 
`;

export const DropzoneContainer = styled.div<{ isDraggingOver: boolean; isDisabled?: boolean; isMini?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => getTheme(props).spacing(props.isMini ? 2 : 5)};
  border: 2px dashed ${(props) => getTheme(props).colors.adminBorder};
  border-radius: 12px;
  background-color: ${(props) => props.isDraggingOver ? rgba(getTheme(props).colors.accent1, 0.05) : getTheme(props).colors.adminSecondaryBg};
  color: ${(props) => getTheme(props).colors.adminTextMuted};
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  text-align: center;

  &:hover {
    border-color: ${(props) => !props.isDisabled && getTheme(props).colors.accent1};
  }
  
  opacity: ${(props) => (props.isDisabled ? 0.6 : 1)};
`;

export const UploadInput = styled.input`
  display: none;
`;

export const UploadIcon = styled.div<{ isMini?: boolean }>`
    font-size: ${(props) => (props.isMini ? '1.5rem' : '2.5rem')};
    color: ${(props) => getTheme(props).colors.accent1};
    margin-bottom: ${(props) => getTheme(props).spacing(props.isMini ? 1 : 2)};
`;

export const UploadText = styled.p<{ isMini?: boolean }>`
  margin: 0;
  font-size: ${(props) => (props.isMini ? '0.75rem' : '0.9rem')};
  line-height: 1.5;

  span {
    color: ${(props) => getTheme(props).colors.accent1};
    font-weight: 500;
  }
  ${(props) => props.isMini && 'display: none;'}
`;

export const ImagePreviewGrid = styled.div<{ isMini?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.isMini ? 'repeat(auto-fill, minmax(50px, 1fr))' : 'repeat(auto-fill, minmax(100px, 1fr))')};
  gap: ${(props) => getTheme(props).spacing(props.isMini ? 1.5 : 2)};
  margin-top: ${(props) => getTheme(props).spacing(3)};
`;

export const ImagePreviewContainer = styled.div<{ isDragging: boolean; isMini?: boolean; }>`
  position: relative;
  aspect-ratio: 1 / 1; // Perfect square
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${(props) => (props.isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)')};
  transition: box-shadow 0.2s ease-in-out;
  outline: none; // Draggable adds an outline we don't want
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${ImagePreviewContainer}:hover & {
    opacity: 1;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;