// カメラ設定（ドラクエ風）
export const CAMERA_CONFIG = {
  distance: 10,        // キャラからの距離
  height: 6,           // 高さ
  fov: 60,             // 視野角
  lookAtOffset: 1.5,   // 注視点のY軸オフセット
  smoothing: 0.1,      // 追従の滑らかさ
  rotationSpeed: 0.02, // 回転速度
  minDistance: 5,
  maxDistance: 20,
}

// プレイヤー設定
export const PLAYER_CONFIG = {
  moveSpeed: 5,
  runSpeed: 8,
  rotationSpeed: 5,
  jumpForce: 5,
  gravity: 20,
}

// ワールド設定
export const WORLD_CONFIG = {
  groundSize: 100,
  skyColor: '#87CEEB',
  ambientLightIntensity: 0.6,
  directionalLightIntensity: 0.8,
}

// モバイル判定
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window)
}
