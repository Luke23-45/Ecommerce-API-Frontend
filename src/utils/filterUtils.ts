import { type ICategoryResponse } from "@/types/category";
import { type FilterGroup, type FilterOption } from "@/data/mockData";

/**
 * **REWRITTEN AND CORRECTED**
 * Transforms a flat array of category documents into a hierarchical FilterGroup structure.
 * This version correctly handles a flat list of descendants without needing the top-level
 * parent to be in the list itself.
 *
 * @param {ICategoryResponse[]} descendantCategories - The flat array of categories from the API.
 * @param {string} currentCategoryId - The ID of the category the user is currently viewing.
 * @returns {FilterGroup | null} A single FilterGroup object or null if data is invalid.
 */
export const transformCategoriesToFilterGroup = (
  descendantCategories: ICategoryResponse[],
  currentCategoryId: string
): FilterGroup | null => {
  if (!descendantCategories || descendantCategories.length === 0) {
    return null;
  }

  let currentCategory = descendantCategories.find(
    (cat) => cat._id === currentCategoryId
  );
  let parentName = "Category";
  let parentSlug = "";

  if (currentCategory) {
    parentName = currentCategory.name;
    parentSlug = currentCategory.slug;
  } else {
    const firstChild = descendantCategories[0];
    const parentInAncestors = firstChild.ancestors.find(
      (anc) => anc._id === currentCategoryId
    );
    if (parentInAncestors) {
      parentName = parentInAncestors.name;
      parentSlug = parentInAncestors.slug;
    }
  }

  const categoryMap = new Map<string, ICategoryResponse[]>();
  descendantCategories.forEach((cat) => {
    const parentId = cat.parentId;
    if (parentId) {
      if (!categoryMap.has(parentId)) {
        categoryMap.set(parentId, []);
      }
      categoryMap.get(parentId)!.push(cat);
    }
  });

  const buildOptions = (parentId: string): FilterOption[] => {
    const children = categoryMap.get(parentId) || [];

    children.sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name)
    );

    return children.map((child) => ({
      id: child._id,
      label: child.name,
      value: child.slug,
      count: child.productCount || 0,
      children: buildOptions(child._id),
    }));
  };

  const filterGroup: FilterGroup = {
    id: "category",
    name: parentName,
    type: "hierarchy",
    isCollapsed: false,

    options: buildOptions(currentCategoryId),
  };

  return filterGroup;
};
