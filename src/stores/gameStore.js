import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // ゲーム状態
  gameState: 'playing', // 'playing', 'paused', 'menu', 'dialog', 'battle'
  setGameState: (state) => set({ gameState: state }),

  // プレイヤー状態
  player: {
    position: [0, 0, 0],
    rotation: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    level: 1,
    exp: 0,
    gold: 0,
  },
  updatePlayerPosition: (position) => set((state) => ({
    player: { ...state.player, position }
  })),
  updatePlayerRotation: (rotation) => set((state) => ({
    player: { ...state.player, rotation }
  })),
  updatePlayerStats: (stats) => set((state) => ({
    player: { ...state.player, ...stats }
  })),

  // カメラ状態
  cameraAngle: 0,
  setCameraAngle: (angle) => set({ cameraAngle: angle }),

  // ダイアログ状態
  dialog: {
    isOpen: false,
    speaker: '',
    text: '',
    choices: [],
  },
  openDialog: (speaker, text, choices = []) => set({
    dialog: { isOpen: true, speaker, text, choices },
    gameState: 'dialog',
  }),
  closeDialog: () => set({
    dialog: { isOpen: false, speaker: '', text: '', choices: [] },
    gameState: 'playing',
  }),

  // メニュー状態
  menuOpen: false,
  toggleMenu: () => set((state) => ({
    menuOpen: !state.menuOpen,
    gameState: state.menuOpen ? 'playing' : 'menu',
  })),

  // インベントリ
  inventory: [],
  addItem: (item) => set((state) => ({
    inventory: [...state.inventory, item]
  })),
  removeItem: (itemId) => set((state) => ({
    inventory: state.inventory.filter((item) => item.id !== itemId)
  })),

  // 入力状態
  input: {
    moveX: 0,
    moveZ: 0,
    action: false,
    cancel: false,
  },
  setInput: (input) => set((state) => ({
    input: { ...state.input, ...input }
  })),
}))
