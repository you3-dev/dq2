/**
 * ============================================================================
 * Game Systems Index - Central System Access Point
 * ============================================================================
 *
 * This is the main entry point for all game systems.
 *
 * Example usage:
 *   import { BattleSystem, QuestSystem, DialogSystem } from '@/systems';
 *
 * ============================================================================
 */

export * from './battle/index.js';
export * from './quest/index.js';
export * from './dialog/index.js';
export * from './inventory/index.js';
export * from './save/index.js';

// Re-export default classes
import { BattleSystem } from './battle/index.js';
import { QuestSystem } from './quest/index.js';
import { DialogSystem } from './dialog/index.js';
import { InventorySystem } from './inventory/index.js';
import { SaveSystem, saveSystem } from './save/index.js';

/**
 * Game Systems manager
 * Creates and manages all game system instances
 */
export class GameSystems {
  constructor() {
    this.battle = new BattleSystem();
    this.quest = new QuestSystem();
    this.dialog = new DialogSystem();
    this.inventory = new InventorySystem();
    this.save = saveSystem;
  }

  /**
   * Initialize all systems
   * @param {Object} [savedState] - Optional saved state to restore
   */
  initialize(savedState) {
    if (savedState) {
      // Restore state from save
      if (savedState.inventory) {
        this.inventory.importState(savedState.inventory);
      }
      // TODO: Restore other systems
    }
  }

  /**
   * Export all systems state for saving
   * @returns {Object}
   */
  exportState() {
    return {
      inventory: this.inventory.exportState(),
      quests: {
        active: this.quest.getActiveQuests(),
        completed: this.quest.getCompletedQuestIds(),
      },
    };
  }

  /**
   * Cleanup all systems
   */
  cleanup() {
    this.save.stopAutoSave();
  }
}

export default GameSystems;
