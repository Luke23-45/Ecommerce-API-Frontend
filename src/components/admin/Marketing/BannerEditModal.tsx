// src/components/Admin/Marketing/BannerEditModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled, { type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';
import { FaTimes, FaCheckCircle, FaBan, FaImage, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

import type { PromotionBanner, BannerStatus, BannerLocation } from '@/types/marketing';
import { AdminButton,AdminInput } from '../Dashboard/Common/Common.styles';
import AdminSelect from '../common/AdminSelect/AdminSelect';
import AdminTextArea from '../common/AdminTextArea/AdminTextArea';
import FormSectionWrapper, { FieldGroup, FormLabel, MultiFieldRow } from '../common/FormSectionWrapper/FormSectionWrapper';
import ImageUploader from '../common/ImageUploader/ImageUploader';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.4)};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: ${(props) => getTheme(props).spacing(6)};
    width: 90%;
    max-width: 600px; /* Wider for banner details */
    max-height: 90vh; /* Allow scrolling if content is very long */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)}; /* Gap between sections */
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding-bottom: ${(props) => getTheme(props).spacing(3)};

    h2 {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
    }

    button {
        background: none;
        border: none;
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        cursor: pointer;
        &:hover { color: ${(props) => getTheme(props).colors.adminStatusError}; }
    }
`;

export const ModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)}; /* Gap between form sections/fields */
    flex-grow: 1; /* Allow form to take space in modal */
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(2)};
    margin-top: ${(props) => getTheme(props).spacing(4)};
`;


interface BannerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: PromotionBanner, isNew: boolean) => void;
  editingBanner?: PromotionBanner | null; // Banner object if editing, null for adding new
}

const BannerEditModal: React.FC<BannerEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBanner,
}) => {
  const isAddingNew = !editingBanner;
  const [banner, setBanner] = useState<PromotionBanner>(
    editingBanner || {
      _id: '', // Will be assigned on save
      name: '',
      imageUrl: '', // Requires image upload
      linkUrl: '',
      startDate: new Date().toISOString().split('T')[0], // Default to today
      endDate: '',
      status: 'draft',
      location: 'homepage_hero', // Default location
      description: '',
      priority: 1,
    }
  );

  const [newImageFile, setNewImageFile] = useState<File[]>([]); // For image uploader component


  // Sync internal state with prop if editingBanner changes
  useEffect(() => {
    if (editingBanner) {
      setBanner(editingBanner);
    } else {
      setBanner({
        _id: '', name: '', imageUrl: '', linkUrl: '',
        startDate: new Date().toISOString().split('T')[0], endDate: '', // Today as default
        status: 'draft', location: 'homepage_hero', description: '', priority: 1,
      });
    }
    setNewImageFile([]); // Clear any old new files on banner switch
  }, [editingBanner]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBanner(prev => {
        let newValue: any = value;
        if (type === 'number') {
            newValue = parseInt(value) || 0; // Parse as number
        }
        return { ...prev, [name]: newValue };
    });
  }, []);

  const handleImageChange = useCallback((files: File[]) => {
      // ImageUploader gives back files. We only care about the first one for a banner.
      setNewImageFile(files);
      if (files.length > 0) {
          // Immediately update preview URL. In real app, this is actual upload + URL.
          setBanner(prev => ({ ...prev, imageUrl: URL.createObjectURL(files[0]) }));
      } else {
          // If all new files are removed, revert to original image or empty
          setBanner(prev => ({ ...prev, imageUrl: editingBanner?.imageUrl || '' }));
      }
  }, [editingBanner]);

  const handleImageDelete = useCallback((urlToDelete: string) => {
      // If it's an existing URL from the prop, remove it.
      setBanner(prev => ({ ...prev, imageUrl: '' })); // Clear image
      // Clean up object URL if the one being deleted was from a fresh upload session
      if (urlToDelete.startsWith('blob:')) URL.revokeObjectURL(urlToDelete);
      setNewImageFile([]); // Clear new file as well
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!banner.name.trim() || !banner.imageUrl.trim() || !banner.linkUrl.trim() || !banner.startDate.trim()) {
      alert("Name, Image, Link URL, and Start Date are required.");
      return;
    }
    if (new Date(banner.endDate || '2999-01-01') < new Date(banner.startDate)) {
        alert("End Date cannot be before Start Date.");
        return;
    }

    // In a real app:
    // 1. Upload newImageFile (if any) to storage, get its new URL.
    // 2. Prepare banner object for API, ensuring correct image URL.
    // 3. Assign _id if new (mock here).
    const bannerToSave: PromotionBanner = { ...banner };
    if (isAddingNew) {
        bannerToSave._id = `bnr-${Date.now()}`;
    }

    onSave(bannerToSave, isAddingNew); // Callback to parent
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{isAddingNew ? 'Add New Banner' : `Edit Banner: ${editingBanner?.name}`}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal"><FaTimes /></button>
        </ModalHeader>
        <ModalForm onSubmit={handleSubmit}>
          {/* FormSectionWrapper for organizational grouping */}
          <FormSectionWrapper title="Banner Details">
            <FieldGroup>
                <FormLabel htmlFor="name">Internal Name</FormLabel>
                <AdminInput type="text" id="name" name="name" value={banner.name} onChange={handleChange} placeholder="e.g., Winter Sale Homepage" required />
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="linkUrl">Destination URL</FormLabel>
                <AdminInput type="url" id="linkUrl" name="linkUrl" value={banner.linkUrl} onChange={handleChange} placeholder="e.g., /collections/winter-sale" required />
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="location">Display Location</FormLabel>
                <AdminSelect 
                    id="location" 
                    name="location" 
                    value={banner.location} 
                    onChange={handleChange}
                    options={[
                        { value: 'homepage_hero', label: 'Homepage Hero Banner' },
                        { value: 'homepage_cta', label: 'Homepage CTA Section' },
                        { value: 'collection_top', label: 'Collection Page Top' },
                        { value: 'product_detail_promo', label: 'Product Detail Promo' },
                        { value: 'checkout_banner', label: 'Checkout Page' },
                        { value: 'sidebar', label: 'Sidebar (Global)' },
                    ]}
                />
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="priority">Priority (lower = higher priority)</FormLabel>
                <AdminInput type="number" id="priority" name="priority" value={banner.priority || ''} onChange={handleChange} min="1" placeholder="e.g., 1 (highest), 10 (lowest)" />
            </FieldGroup>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="startDate">Start Date <FaCalendarAlt /></FormLabel>
                    <AdminInput type="date" id="startDate" name="startDate" value={banner.startDate.split('T')[0]} onChange={handleChange} required /> {/* Strip time for date input */}
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="endDate">End Date (Optional) <FaCalendarAlt /></FormLabel>
                    <AdminInput type="date" id="endDate" name="endDate" value={banner.endDate ? banner.endDate.split('T')[0] : ''} onChange={handleChange} /> {/* Strip time */}
                </FieldGroup>
            </MultiFieldRow>
            <FieldGroup>
                <FormLabel htmlFor="status">Status</FormLabel>
                <AdminSelect 
                    id="status" 
                    name="status" 
                    value={banner.status} 
                    onChange={handleChange}
                    options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'active', label: 'Active' },
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'expired', label: 'Expired' },
                    ]}
                />
            </FieldGroup>
            <FieldGroup $fullWidth>
                <FormLabel htmlFor="description">Internal Description</FormLabel>
                <AdminTextArea id="description" name="description" value={banner.description || ''} onChange={handleChange} placeholder="Brief description for internal use." rows={3} />
            </FieldGroup>
          </FormSectionWrapper>

          <FormSectionWrapper title="Banner Image">
            <FieldGroup $fullWidth>
                <ImageUploader
                    initialImageUrls={banner.imageUrl ? [banner.imageUrl] : []}
                    onImagesChange={handleImageChange}
                    onImageUrlsDelete={handleImageDelete}
                    maxFiles={1} // Banners usually have one image
                    accept="image/jpeg,image/png,image/gif"
                />
            </FieldGroup>
            {banner.imageUrl && (
                <div style={{marginTop: '10px', fontSize: '0.85em', color: '#888', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    Current Image URL: <a href={banner.imageUrl} target="_blank" rel="noopener noreferrer" style={{color: '#A46E4A'}}>{banner.imageUrl.substring(0, 50)}... <FaExternalLinkAlt /></a>
                </div>
            )}
          </FormSectionWrapper>
        </ModalForm>

        <ModalActions>
          <AdminButton $variant="secondary" onClick={onClose} type="button">
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton $variant="primary" type="submit">
            <FaCheckCircle /> {isAddingNew ? 'Create Banner' : 'Save Changes'}
          </AdminButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BannerEditModal;