/**
 * ============================================================================
 * Battle System - Turn-based Combat Engine
 * ============================================================================
 *
 * This system handles all battle-related logic:
 * - Turn order calculation
 * - Action execution
 * - Damage calculation
 * - Status effects
 * - Victory/defeat conditions
 *
 * ============================================================================
 */

import { getEnemyById } from '../../data/index.js';

/**
 * @typedef {Object} BattleState
 * @property {'idle' | 'starting' | 'player_turn' | 'enemy_turn' | 'animating' | 'victory' | 'defeat' | 'escape'} phase
 * @property {Object[]} playerParty - Player party members
 * @property {Object[]} enemies - Enemy instances
 * @property {number} turnCount - Current turn number
 * @property {Object[]} turnOrder - Calculated turn order
 * @property {Object[]} actionLog - Log of actions taken
 */

/**
 * Calculate damage for a physical attack
 * @param {number} attack - Attacker's attack stat
 * @param {number} defense - Defender's defense stat
 * @param {number} [variance=0.1] - Damage variance (0-1)
 * @returns {number} - Calculated damage
 */
export const calculatePhysicalDamage = (attack, defense, variance = 0.1) => {
  const baseDamage = Math.max(1, Math.floor(attack / 2) - Math.floor(defense / 4));
  const varianceMultiplier = 1 + (Math.random() * 2 - 1) * variance;
  return Math.max(1, Math.floor(baseDamage * varianceMultiplier));
};

/**
 * Calculate damage for a magical attack
 * @param {number} wisdom - Caster's wisdom stat
 * @param {number} spellPower - Spell's base power
 * @param {number} resistance - Target's magic resistance (0-100)
 * @returns {number} - Calculated damage
 */
export const calculateMagicalDamage = (wisdom, spellPower, resistance = 0) => {
  const baseDamage = Math.floor(spellPower + wisdom / 2);
  const resistMultiplier = 1 - resistance / 100;
  return Math.max(1, Math.floor(baseDamage * resistMultiplier));
};

/**
 * Calculate turn order based on agility
 * @param {Object[]} combatants - All battle participants
 * @returns {Object[]} - Sorted by turn order
 */
export const calculateTurnOrder = (combatants) => {
  return [...combatants]
    .filter((c) => c.isAlive)
    .map((c) => ({
      ...c,
      initiative: c.stats.agility + Math.random() * 10,
    }))
    .sort((a, b) => b.initiative - a.initiative);
};

/**
 * Check if battle is over
 * @param {BattleState} state
 * @returns {'ongoing' | 'victory' | 'defeat'}
 */
export const checkBattleEnd = (state) => {
  const allEnemiesDead = state.enemies.every((e) => !e.isAlive);
  const allPlayersDead = state.playerParty.every((p) => !p.isAlive);

  if (allEnemiesDead) return 'victory';
  if (allPlayersDead) return 'defeat';
  return 'ongoing';
};

/**
 * Calculate experience and gold rewards
 * @param {Object[]} defeatedEnemies
 * @returns {{exp: number, gold: number, drops: Object[]}}
 */
export const calculateRewards = (defeatedEnemies) => {
  let totalExp = 0;
  let totalGold = 0;
  const drops = [];

  for (const enemy of defeatedEnemies) {
    totalExp += enemy.exp;
    totalGold += enemy.gold;

    // Roll for drops
    for (const drop of enemy.drops ?? []) {
      if (Math.random() * 100 < drop.chance) {
        drops.push({ itemId: drop.itemId, count: 1 });
      }
    }
  }

  return { exp: totalExp, gold: totalGold, drops };
};

/**
 * Create enemy instance from definition
 * @param {string} enemyId
 * @returns {Object} - Enemy instance for battle
 */
export const createEnemyInstance = (enemyId) => {
  const definition = getEnemyById(enemyId);
  if (!definition) return null;

  return {
    id: `${enemyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    definitionId: enemyId,
    name: definition.name,
    stats: { ...definition.stats, hp: definition.stats.hp },
    maxHp: definition.stats.hp,
    exp: definition.exp,
    gold: definition.gold,
    drops: definition.drops,
    actions: definition.actions,
    behavior: definition.behavior,
    resistances: definition.resistances,
    statusResistances: definition.statusResistances,
    isAlive: true,
    statusEffects: [],
  };
};

/**
 * BattleSystem class placeholder
 * TODO: Implement full battle system
 */
export class BattleSystem {
  constructor() {
    this.state = null;
  }

  /**
   * Start a new battle
   * @param {Object[]} party - Player party
   * @param {string[]} enemyIds - Enemy IDs to spawn
   */
  startBattle(party, enemyIds) {
    const enemies = enemyIds
      .map(createEnemyInstance)
      .filter(Boolean);

    this.state = {
      phase: 'starting',
      playerParty: party,
      enemies,
      turnCount: 0,
      turnOrder: [],
      actionLog: [],
    };

    return this.state;
  }

  /**
   * Execute a player action
   * @param {string} actionType - Action type
   * @param {Object} params - Action parameters
   */
  executePlayerAction(actionType, params) {
    // TODO: Implement action execution
  }

  /**
   * Execute enemy turn
   */
  executeEnemyTurn() {
    // TODO: Implement enemy AI
  }

  /**
   * Get current battle state
   */
  getState() {
    return this.state;
  }
}

export default BattleSystem;
