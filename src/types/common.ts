// src/types/common.types.ts

import type { ReactNode } from 'react';

/**
 * A generic type for options used in dropdowns, select components, and radio groups.
 * It's designed to be flexible and reusable throughout the application.
 *
 * By using a generic type parameter `T`, we can enforce a specific type for the
 * 'value' property, providing better type safety.
 *
 * @template T The type of the `value` property. Defaults to `string`.
 *
 * @example
 * // A simple string-based option
 * const categoryOption: SelectOption = { value: 'electronics-123', label: 'Electronics' };
 *
 * // An option with a number value, explicitly typed
 * const statusOption: SelectOption<number> = { value: 1, label: 'Active', icon: <FaCheck /> };
 *
 * // An option for a custom enum/type
 * type UserRole = 'admin' | 'editor' | 'viewer';
 * const roleOption: SelectOption<UserRole> = { value: 'admin', label: 'Administrator' };
 */
export interface SelectOption<T = string> {
  /**
   * The actual value of the option that is used in logic or sent to a server.
   * This should be unique among the options in a single select component.
   */
  readonly value: T;

  /**
   * The human-readable text that is displayed to the user in the UI.
   */
  readonly label: string;

  /**
   * Optional: If true, the option will be visible but cannot be selected by the user.
   * @default false
   */
  readonly isDisabled?: boolean;

  /**
   * Optional: An icon component or other React node to display alongside the label for
   * enhanced visual context.
   */
  readonly icon?: ReactNode;

  /**
   * Allows for additional, untyped properties to be added.
   * This is particularly useful for compatibility with third-party libraries like `react-select`,
   * which may add their own properties to the option objects.
   */
  [key: string]: any;
}