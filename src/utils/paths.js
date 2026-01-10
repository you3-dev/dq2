// GitHub Pagesのベースパスを考慮したパス解決
export function getAssetPath(path) {
  const base = import.meta.env.BASE_URL || '/'
  // パスが/で始まる場合は、ベースパスを付加
  if (path.startsWith('/')) {
    return `${base}${path.slice(1)}`
  }
  return `${base}${path}`
}

// モデルパスのショートカット
export function getModelPath(relativePath) {
  return getAssetPath(`/models/${relativePath}`)
}

// テクスチャパスのショートカット
export function getTexturePath(relativePath) {
  return getAssetPath(`/textures/${relativePath}`)
}

// オーディオパスのショートカット
export function getAudioPath(relativePath) {
  return getAssetPath(`/audio/${relativePath}`)
}
