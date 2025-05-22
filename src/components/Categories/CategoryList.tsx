// src/components/Admin/Categories/CategoryList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import {
  CategoryListContainer,
  CategoryListHeader,
  HeaderTitle,
  CategorySearchInput,
  CategoryTreeContainer,
  NoCategoryMessage,
} from './CategoryList.styles';

import { AdminButton } from '../admin/Dashboard/Common/Common.styles';
import CategoryNode from './CategoryNode'; // Import CategoryNode
import CategoryEditModal from './CategoryEditModal'; // Import CategoryEditModal
import type{ Category, CategoryStatus } from '@/types/category'; // Import Category interface


// --- Dummy Data (mimicking fetched categories) ---
// This function constructs a flat list with parent/child relationships
// For the UI, we'll transform it into a nested tree.
const dummyFlatCategories: Category[] = [
    { _id: 'cat-001', name: 'Living Room Furniture', slug: 'living-room-furniture', parentCategoryId: null, level: 0, status: 'active', displayOrder: 1, isExpanded: true },
    { _id: 'cat-001-a', name: 'Sofas & Sectionals', slug: 'sofas-sectionals', parentCategoryId: 'cat-001', level: 1, status: 'active', displayOrder: 1, isExpanded: true },
    { _id: 'cat-001-a1', name: 'Leather Sofas', slug: 'leather-sofas', parentCategoryId: 'cat-001-a', level: 2, status: 'active', displayOrder: 1 },
    { _id: 'cat-001-a2', name: 'Fabric Sofas', slug: 'fabric-sofas', parentCategoryId: 'cat-001-a', level: 2, status: 'active', displayOrder: 2 },
    { _id: 'cat-001-b', name: 'Coffee Tables', slug: 'coffee-tables', parentCategoryId: 'cat-001', level: 1, status: 'active', displayOrder: 2 },
    { _id: 'cat-001-c', name: 'Accent Chairs', slug: 'accent-chairs', parentCategoryId: 'cat-001', level: 1, status: 'inactive', displayOrder: 3 },
    { _id: 'cat-002', name: 'Bedroom Essentials', slug: 'bedroom-essentials', parentCategoryId: null, level: 0, status: 'active', displayOrder: 2, isExpanded: true },
    { _id: 'cat-002-a', name: 'Beds & Frames', slug: 'beds-frames', parentCategoryId: 'cat-002', level: 1, status: 'active', displayOrder: 1 },
    { _id: 'cat-002-b', name: 'Mattresses', slug: 'mattresses', parentCategoryId: 'cat-002', level: 1, status: 'active', displayOrder: 2 },
    { _id: 'cat-003', name: 'Kitchen & Dining', slug: 'kitchen-dining', parentCategoryId: null, level: 0, status: 'active', displayOrder: 3, isExpanded: true },
    { _id: 'cat-003-a', name: 'Dining Tables', slug: 'dining-tables', parentCategoryId: 'cat-003', level: 1, status: 'active', displayOrder: 1 },
    { _id: 'cat-003-b', name: 'Cookware', slug: 'cookware', parentCategoryId: 'cat-003', level: 1, status: 'active', displayOrder: 2 },
    { _id: 'cat-004', name: 'Home Decor', slug: 'home-decor', parentCategoryId: null, level: 0, status: 'inactive', displayOrder: 4 },
];

// Helper to convert flat list of categories into a nested tree structure
// Crucial for the CategoryList tree view rendering.
const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap: Map<string, Category> = new Map(flatCategories.map(c => [c._id, { ...c, children: [] }])); // Initialize with empty children array
    const tree: Category[] = [];

    categoryMap.forEach(category => {
        if (category.parentCategoryId === null) {
            tree.push(category);
        } else {
            const parent = categoryMap.get(category.parentCategoryId);
            if (parent) {
                // Ensure parent.children exists
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(category);
            } else {
                // Orphan category, add as top-level if parent not found in map
                tree.push(category);
            }
        }
    });

    // Recursively sort children and top-level categories by displayOrder
    const sortTree = (nodes: Category[]) => {
        nodes.sort((a, b) => a.displayOrder - b.displayOrder);
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) { // Only recurse if children exist
                sortTree(node.children);
            } else {
                delete node.children; // Clean up empty children array if no actual children after filtering/sorting
            }
        });
    };
    sortTree(tree); // Sort the top-level
    return tree;
};


const CategoryList: React.FC = () => {
    // Categories are managed as a flat list, but rendered as a tree
    const [flatCategories, setFlatCategories] = useState<Category[]>(dummyFlatCategories);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state for add/edit category
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Category object if editing, null for add new
    const [parentCategoryForNew, setParentCategoryForNew] = useState<string | null>(null); // To pre-select parent in modal for 'add sub-category'

    // Memoized tree structure from flat categories
    const categoryTree = useMemo(() => buildCategoryTree(flatCategories), [flatCategories]);

    // Memoized filtered categories (flat list matching search term, then built into a tree)
    const filteredAndSearchedCategories = useMemo(() => {
        if (!searchTerm) {
            // If no search term, use the full categories (built into a tree)
            // Ensure expansion state is preserved for search results if previously expanded
            const resetExpansion = (nodes: Category[]): Category[] => nodes.map(node => ({
                ...node,
                isExpanded: node.isExpanded === undefined ? true : node.isExpanded, // Default to true if not set
                children: node.children ? resetExpansion(node.children) : undefined
            }));
            return resetExpansion(buildCategoryTree(flatCategories));
        }

        const term = searchTerm.toLowerCase();
        // A simple search that returns all matching nodes AND ensures their parent chain is expanded
        const matchingIds = new Set<string>();
        const parentChainIds = new Set<string>();

        const findMatchesAndParents = (nodes: Category[]) => {
            nodes.forEach(node => {
                const nameMatches = node.name.toLowerCase().includes(term);
                const slugMatches = node.slug.toLowerCase().includes(term);
                
                if (nameMatches || slugMatches) {
                    matchingIds.add(node._id);
                    let currentParentId = node.parentCategoryId;
                    while (currentParentId && !parentChainIds.has(currentParentId)) {
                        parentChainIds.add(currentParentId);
                        const parent = flatCategories.find(c => c._id === currentParentId);
                        currentParentId = parent?.parentCategoryId || null;
                    }
                }
                if (node.children) findMatchesAndParents(node.children);
            });
        };
        // Visit the *full flatCategories* to ensure all matches are found regardless of current tree expansion
        findMatchesAndParents(buildCategoryTree(flatCategories)); // Pass the initially built tree to find matches correctly

        // Build a filtered tree: only include categories that directly match or are in the parent chain
        const filterAndExpandTree = (nodes: Category[]): Category[] => {
            return nodes
                .filter(node => matchingIds.has(node._id) || parentChainIds.has(node._id) || node.children?.some(c => matchingIds.has(c._id) || parentChainIds.has(c._id))) // Keep parents too
                .map(node => ({
                    ...node,
                    children: node.children ? filterAndExpandTree(node.children) : undefined,
                    isExpanded: matchingIds.has(node._id) || parentChainIds.has(node._id) ? true : node.isExpanded // Auto-expand if direct match or in parent chain
                }))
                .filter(node => { // Final filter to remove empty branches that don't lead to matches
                    if (matchingIds.has(node._id)) return true; // Direct matches always show
                    if (parentChainIds.has(node._id)) return true; // Parents in the chain always show
                    // If a node is not a direct match/parent, only show if it has filtered children
                    return node.children && node.children.length > 0;
                });
        };
        // Filter the initially built full tree
        return filterAndExpandTree(buildCategoryTree(flatCategories));

    }, [flatCategories, searchTerm]);


    // Handlers for category actions (passed to CategoryNode)
    const handleAddTopLevel = () => {
        setEditingCategory(null); // Clear any editing state (add new)
        setParentCategoryForNew(null); // Ensure no parent is pre-selected for top-level
        setIsModalOpen(true);
    };

    const handleEditCategory = (id: string) => {
        const categoryToEdit = flatCategories.find(cat => cat._id === id); // Find in flat list
        if (categoryToEdit) {
            setEditingCategory(categoryToEdit);
            setIsModalOpen(true);
        }
    };

    const handleAddSubCategory = (parentId: string) => {
        setEditingCategory(null); // Add new
        setParentCategoryForNew(parentId); // Pre-select parent for new sub-category
        setIsModalOpen(true);
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this category and all its subcategories? This cannot be undone.`)) {
            const idsToDelete = new Set<string>();
            idsToDelete.add(id);

            // Find all children recursively to delete them too
            const findChildren = (parentId: string) => {
                flatCategories.forEach(cat => {
                    if (cat.parentCategoryId === parentId) {
                        idsToDelete.add(cat._id);
                        findChildren(cat._id);
                    }
                });
            };
            findChildren(id); // Start recursion from the target ID

            setFlatCategories(prev => prev.filter(cat => !idsToDelete.has(cat._id)));
            console.log(`Category ${id} and its subcategories deleted (demo).`);
        }
    };

    const handleToggleExpand = useCallback((id: string) => {
        // Toggle expansion state in the flat list
        setFlatCategories(prev => prev.map(cat =>
            cat._id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
        ));
    }, []);

    const handleSaveCategory = (categoryData: Category) => {
        const isEdit = flatCategories.some(cat => cat._id === categoryData._id);

        setFlatCategories(prev => {
            if (isEdit) {
                // Update existing category in flat list
                return prev.map(cat =>
                    cat._id === categoryData._id ? { ...cat, ...categoryData } : cat
                );
            } else {
                // Add new category to flat list
                const newCategory: Category = {
                    ...categoryData,
                    _id: `cat-${Date.now()}`, // Assign a unique ID for new categories
                    // Ensure correct level and parent if it's a sub-category add
                    level: parentCategoryForNew ? (findCategoryInTree(categoryTree, parentCategoryForNew)?.level || 0) + 1 : 0,
                    parentCategoryId: parentCategoryForNew,
                    // isExpanded defaults to true, no children yet
                };
                return [...prev, newCategory];
            }
        });

        setIsModalOpen(false); // Close modal
        setEditingCategory(null); // Clear editing state
        setParentCategoryForNew(null); // Clear parent for new state
        console.log(`Category ${isEdit ? 'updated' : 'added'}:`, categoryData);
    };

    // Helper to find a category in the (built) tree structure for level information
    // This is useful for dynamically calculating 'level' in new sub-categories
    const findCategoryInTree = (nodes: Category[], id: string): Category | null => {
        for (const node of nodes) {
            if (node._id === id) return node;
            if (node.children) {
                const found = findCategoryInTree(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };


    // Prepare parent options for modal: flat list of all categories except the one being edited (to prevent self-parenting or parenting to child)
    // Needs to generate option objects for AdminSelect
    const allFlatCategoriesForParentOptions = useMemo(() => {
        // Filter out categories that are children of editingCategory (can't be parent to self or descendant)
        const getDescendantIds = (catId: string, currentFlatList: Category[]): Set<string> => {
            const descendantIds = new Set<string>();
            const findDescendants = (parentId: string) => {
                currentFlatList.forEach(c => {
                    if (c.parentCategoryId === parentId) {
                        descendantIds.add(c._id);
                        findDescendants(c._id);
                    }
                });
            };
            findDescendants(catId);
            return descendantIds;
        };

        const forbiddenIds = editingCategory ? getDescendantIds(editingCategory._id, flatCategories).add(editingCategory._id) : new Set<string>();
        
        // Return flattened categories for the dropdown, excluding forbidden
        const options: { value: string; label: string }[] = flatCategories
            .filter(cat => !forbiddenIds.has(cat._id))
            .map(cat => ({
                value: cat._id,
                label: `${'- '.repeat(cat.level)}${cat.name} (Level ${cat.level})`
            }))
            .sort((a,b) => a.label.localeCompare(b.label)); // Sort alphabetically by display label

        return options;
    }, [flatCategories, editingCategory]);


    return (
        <CategoryListContainer>
            <CategoryListHeader>
                <HeaderTitle>Product Categories</HeaderTitle>
                <AdminButton $variant="primary" onClick={handleAddTopLevel}>
                    <FaPlus /> Add New Category
                </AdminButton>
            </CategoryListHeader>

            <CategorySearchInput
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredAndSearchedCategories.length > 0 ? (
                <CategoryTreeContainer>
                    {filteredAndSearchedCategories.map(category => (
                        <CategoryNode
                            key={category._id}
                            category={category}
                            level={category.level}
                            onEdit={handleEditCategory}
                            onAddSubCategory={handleAddSubCategory}
                            onDelete={handleDeleteCategory}
                            onToggleExpand={handleToggleExpand}
                            filteredCategoryIds={
                                searchTerm ? new Set(filteredAndSearchedCategories.flatMap(c => {
                                    const allIds = new Set<string>();
                                    const traverse = (node: Category) => {
                                        allIds.add(node._id);
                                        node.children?.forEach(traverse);
                                    };
                                    traverse(c);
                                    return Array.from(allIds);
                                })) : undefined // Only pass filtered IDs when searching
                            }
                        />
                    ))}
                </CategoryTreeContainer>
            ) : (
                <NoCategoryMessage>
                    {searchTerm ? 'No categories found matching your search criteria.' : 'No categories defined yet. Add one!'}
                </NoCategoryMessage>
            )}

            {/* Category Edit/Add Modal */}
            <CategoryEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCategory}
                editingCategory={editingCategory}
                // Options for parent category dropdown in the modal
                parentCategoryOptions={allFlatCategoriesForParentOptions}
                // Pre-selected parent ID for new sub-category (if adding as sub-category)
                initialParentCategoryId={parentCategoryForNew}
            />
        </CategoryListContainer>
    );
};

export default CategoryList;