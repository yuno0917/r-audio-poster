// generateAudioJSON.js
const fs = require('fs');
const path = require('path');

// 音声フォルダのパス
const audioDir = path.join(__dirname, 'assets', 'audio');

// 音声ファイルの取得（拡張子 .mp3 だけ）
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

// ターゲット番号と紐付けたJSON形式に変換
const audioList = files.map((file, index) => ({
  target: index,
  file: file
}));

// list.json に書き出す
const jsonPath = path.join(audioDir, 'list.json');
fs.writeFileSync(jsonPath, JSON.stringify(audioList, null, 2));

console.log('✅ JSON生成完了:', jsonPath);
console.log(audioList);
