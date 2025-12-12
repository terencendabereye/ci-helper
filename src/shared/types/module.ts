/**
 * Base interface for all CI Helper modules
 * Ensures consistency across all feature modules
 */
export interface CIModule {
  id: string;
  name: string;
  description: string;
  icon: string; // MUI icon name
  component: React.ComponentType<any>;
  category?: string; // e.g., 'calibration', 'calculation', 'measurement'
}

/**
 * Module registry for easy discovery and lazy loading
 */
export type ModuleRegistry = Record<string, CIModule>;
