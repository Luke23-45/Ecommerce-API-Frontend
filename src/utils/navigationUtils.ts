import {
  type NavItem,
  type UserRole,
  ROLES_CONFIG,
  ALL_NAV_ITEMS,
} from "@/config/rolesConfig";

const getRoleConfiguration = (userRole: UserRole) => {
  const roleConfig = ROLES_CONFIG[userRole];
  if (!roleConfig) {
    console.error(
      `[NavigationUtils] Configuration for role "${userRole}" not found.`
    );
    throw new Error(`Configuration for role "${userRole}" not found.`);
  }
  return roleConfig;
};

/**
 * Finds a specific NavItem by its path from a list of NavItems (including children).
 * This version is updated to handle dynamic path segments by matching against the base static path.
 * For example, a currentPath like "/admin/products/123/edit" should match a NavItem
 * defined with path "/admin/products" if no more specific match (like "/admin/products/:id/edit") exists.
 * It prioritizes exact matches first, then tries prefix matching for parent routes.
 *
 * @param currentActualPath - The full, potentially dynamic path from the URL.
 * @param items - The list of NavItems to search within.
 * @returns The most relevant NavItem if found, otherwise undefined.
 */
export const findNavItemByPath = (
  currentActualPath: string,
  items: NavItem[] = ALL_NAV_ITEMS
): NavItem | undefined => {
  let bestMatch: NavItem | undefined = undefined;

  for (const item of items) {
    if (item.path === currentActualPath) {
      return item;
    }

    if (
      currentActualPath.startsWith(item.path) &&
      (item.path.endsWith("/") ||
        currentActualPath.charAt(item.path.length) === "/" ||
        currentActualPath.length === item.path.length)
    ) {
      if (!bestMatch || item.path.length > bestMatch.path.length) {
        bestMatch = item;
      }
    }

    if (item.children) {
      const foundInChild = findNavItemByPath(currentActualPath, item.children);
      if (foundInChild) {
        if (
          !bestMatch ||
          (foundInChild.path.length > bestMatch.path.length &&
            currentActualPath.startsWith(foundInChild.path))
        ) {
          bestMatch = foundInChild;
        } else if (foundInChild.path === currentActualPath) {
          return foundInChild;
        }
      }
    }
  }
  return bestMatch;
};


export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  const config = ROLES_CONFIG[role];
  if (!config) {
    // If no config exists for the role, return no nav items.
    return [];
  }

  const allowedSections = new Set(config.allowedNavSections);

  // This recursive function will build the new, filtered navigation tree.
  const filterItems = (items: NavItem[]): NavItem[] => {
    return items.reduce<NavItem[]>((acc, item) => {
      // Recursively filter the children first.
      const allowedChildren = item.children ? filterItems(item.children) : undefined;

      // An item should be included in the final tree if:
      // 1. Its own sectionId is in the role's allowed list.
      // OR
      // 2. It has children that are allowed (making it a container for accessible links).
      if (allowedSections.has(item.sectionId) || (allowedChildren && allowedChildren.length > 0)) {
        acc.push({
          ...item,
          // Assign the filtered children to the new item.
          children: allowedChildren,
        });
      }
      return acc;
    }, []);
  };

  return filterItems(ALL_NAV_ITEMS);
};

/**
 * Checks if a given path is accessible to a specific user role.
 * It now uses the updated findNavItemByPath which can handle dynamic routes.
 *
 * @param currentActualPath - The full, potentially dynamic path from the URL.
 * @param userRole - The role of the user.
 * @returns True if the path (or its base static part) corresponds to an allowed NavItem for the role, false otherwise.
 */
export const isPathAccessibleForRole = (
  currentActualPath: string,
  userRole: UserRole
): boolean => {
  try {
    const { allowedNavSections } = getRoleConfiguration(userRole);
    const allowedSectionsSet = new Set(allowedNavSections);

    const navItemConfig = findNavItemByPath(currentActualPath, ALL_NAV_ITEMS);

    if (!navItemConfig) {
      console.warn(
        `[isPathAccessibleForRole] No NavItem config found matching path (or base path of): "${currentActualPath}". Access denied by default.`
      );
      return false;
    }

    const isAllowed = allowedSectionsSet.has(navItemConfig.sectionId);
    if (!isAllowed) {
      console.warn(
        `[isPathAccessibleForRole] Path "${currentActualPath}" resolved to NavItem with sectionId "${navItemConfig.sectionId}", which is NOT ALLOWED for role "${userRole}".`
      );
    }
    return isAllowed;
  } catch (error) {
    console.error(
      `[NavigationUtils] Error checking path accessibility for role "${userRole}" and path "${currentActualPath}":`,
      error
    );
    return false;
  }
};

export const getFilteredNavItems = (userRole: UserRole): NavItem[] => {
  try {
    const { allowedNavSections } = getRoleConfiguration(userRole);
    const allowedSectionsSet = new Set(allowedNavSections);

    if (allowedSectionsSet.size === 0) {
      console.warn(
        `[NavigationUtils] No navigation sections allowed for role "${userRole}". Returning empty list.`
      );
      return [];
    }

    const filterNavItemsRecursive = (
      items: NavItem[],
      currentAllowedSectionsSet: Set<string>
    ): NavItem[] => {
      return items
        .map((item) => {
          const isItemAllowed = currentAllowedSectionsSet.has(item.sectionId);
          let filteredChildren: NavItem[] | undefined = undefined;

          if (item.children && item.children.length > 0) {
            filteredChildren = filterNavItemsRecursive(
              item.children,
              currentAllowedSectionsSet
            );
          }

          if (isItemAllowed) {
            return {
              ...item,
              children:
                filteredChildren && filteredChildren.length > 0
                  ? filteredChildren
                  : undefined,
            };
          }
          return null;
        })
        .filter((item): item is NavItem => item !== null);
    };
    return filterNavItemsRecursive(ALL_NAV_ITEMS, allowedSectionsSet);
  } catch (error) {
    console.error(
      `[NavigationUtils] Error generating filtered nav items for role "${userRole}":`,
      error
    );
    return [];
  }
};
