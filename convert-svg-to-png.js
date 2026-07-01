const fs = require('fs');
const path = require('path');

// SVG 转 PNG 的简单方法：使用 base64 编码嵌入到 HTML canvas 中导出
// 这里我们直接生成 PNG 文件的二进制数据太复杂，改用另一种方式

// 方案：创建占位 PNG 文件（实际使用时需要用工具转换）
// 或者使用在线工具手动转换

console.log('️ 微信小程序 tabBar 不支持 SVG，需要转换为 PNG');
console.log('\n 请按以下步骤操作：\n');
console.log('1. 访问 https://svgtopng.com/ 或 https://convertio.co/zh/svg-png/');
console.log('2. 上传 static/icons/ 目录下的 6 个 SVG 文件');
console.log('3. 设置输出尺寸为 81x81 像素');
console.log('4. 下载 PNG 文件并替换到 static/icons/ 目录\n');
console.log('需要的文件：');
console.log('  - home.png / home-active.png');
console.log('  - recruit.png / recruit-active.png');
console.log('  - about.png / about-active.png\n');

// 同时修改 pages.json 改回 .png 扩展名
const pagesJsonPath = path.join(__dirname, 'pages.json');
let pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

pagesJson.tabBar.list.forEach(item => {
  item.iconPath = item.iconPath.replace('.svg', '.png');
  item.selectedIconPath = item.selectedIconPath.replace('.svg', '.png');
});

fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesJson, null, '\t'), 'utf-8');
console.log('✅ 已自动将 pages.json 中的图标路径改回 .png 格式');
