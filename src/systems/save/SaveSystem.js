/**
 * ============================================================================
 * Save System - Game State Persistence
 * ============================================================================
 *
 * This system handles:
 * - Saving game state to localStorage
 * - Loading saved games
 * - Auto-save functionality
 * - Save slot management
 *
 * ============================================================================
 */

const SAVE_KEY_PREFIX = 'dq_rpg_save_';
const SAVE_SLOTS = 3;
const AUTO_SAVE_SLOT = 'auto';

/**
 * @typedef {Object} SaveData
 * @property {number} slot - Save slot number
 * @property {number} timestamp - Save timestamp
 * @property {string} version - Game version
 * @property {Object} player - Player data
 * @property {Object} party - Party data
 * @property {Object} inventory - Inventory state
 * @property {Object} quests - Quest states
 * @property {Object} flags - Game flags
 * @property {Object} location - Current location
 * @property {number} playTime - Total play time in seconds
 */

/**
 * Get storage key for save slot
 * @param {number | string} slot
 * @returns {string}
 */
const getSaveKey = (slot) => `${SAVE_KEY_PREFIX}${slot}`;

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * SaveSystem class
 */
export class SaveSystem {
  constructor() {
    this.storageAvailable = isStorageAvailable();
    this.currentSlot = null;
    this.autoSaveInterval = null;
  }

  /**
   * Save game to slot
   * @param {number | string} slot - Save slot
   * @param {Object} gameState - Current game state
   * @returns {boolean} - Success
   */
  save(slot, gameState) {
    if (!this.storageAvailable) {
      console.warn('LocalStorage not available');
      return false;
    }

    try {
      const saveData = {
        slot,
        timestamp: Date.now(),
        version: '0.1.0',
        ...gameState,
      };

      localStorage.setItem(getSaveKey(slot), JSON.stringify(saveData));
      this.currentSlot = slot;
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }

  /**
   * Load game from slot
   * @param {number | string} slot - Save slot
   * @returns {SaveData | null}
   */
  load(slot) {
    if (!this.storageAvailable) {
      console.warn('LocalStorage not available');
      return null;
    }

    try {
      const data = localStorage.getItem(getSaveKey(slot));
      if (!data) return null;

      const saveData = JSON.parse(data);
      this.currentSlot = slot;
      return saveData;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }

  /**
   * Delete save from slot
   * @param {number | string} slot
   * @returns {boolean}
   */
  deleteSave(slot) {
    if (!this.storageAvailable) return false;

    try {
      localStorage.removeItem(getSaveKey(slot));
      if (this.currentSlot === slot) {
        this.currentSlot = null;
      }
      return true;
    } catch (error) {
      console.error('Delete save failed:', error);
      return false;
    }
  }

  /**
   * Check if save exists in slot
   * @param {number | string} slot
   * @returns {boolean}
   */
  hasSave(slot) {
    if (!this.storageAvailable) return false;
    return localStorage.getItem(getSaveKey(slot)) !== null;
  }

  /**
   * Get save info for slot (without full data)
   * @param {number | string} slot
   * @returns {Object | null}
   */
  getSaveInfo(slot) {
    const data = this.load(slot);
    if (!data) return null;

    return {
      slot: data.slot,
      timestamp: data.timestamp,
      version: data.version,
      playerName: data.player?.name,
      level: data.player?.level,
      location: data.location?.mapName,
      playTime: data.playTime,
    };
  }

  /**
   * Get all save slot infos
   * @returns {Object[]}
   */
  getAllSaveInfos() {
    const infos = [];

    // Regular slots
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      infos.push({
        slot: i,
        info: this.getSaveInfo(i),
      });
    }

    // Auto-save slot
    infos.push({
      slot: AUTO_SAVE_SLOT,
      info: this.getSaveInfo(AUTO_SAVE_SLOT),
    });

    return infos;
  }

  /**
   * Auto-save
   * @param {Object} gameState
   * @returns {boolean}
   */
  autoSave(gameState) {
    return this.save(AUTO_SAVE_SLOT, gameState);
  }

  /**
   * Start auto-save interval
   * @param {Function} getGameState - Function to get current state
   * @param {number} [intervalMs=60000] - Interval in milliseconds
   */
  startAutoSave(getGameState, intervalMs = 60000) {
    this.stopAutoSave();
    this.autoSaveInterval = setInterval(() => {
      const state = getGameState();
      if (state) {
        this.autoSave(state);
      }
    }, intervalMs);
  }

  /**
   * Stop auto-save interval
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Export save as JSON string (for backup)
   * @param {number | string} slot
   * @returns {string | null}
   */
  exportSave(slot) {
    const data = localStorage.getItem(getSaveKey(slot));
    return data;
  }

  /**
   * Import save from JSON string
   * @param {number | string} slot
   * @param {string} jsonString
   * @returns {boolean}
   */
  importSave(slot, jsonString) {
    try {
      const data = JSON.parse(jsonString);
      data.slot = slot;
      localStorage.setItem(getSaveKey(slot), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Import save failed:', error);
      return false;
    }
  }
}

export default SaveSystem;

// Export singleton instance
export const saveSystem = new SaveSystem();
