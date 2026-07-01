/**
 * 生成 tabBar 占位图标
 * 运行: node generate-icons.js
 * 生成后请替换为正式设计的图标
 */
const fs = require('fs')
const path = require('path')

// 最小有效 PNG 生成（81x81 纯色方块）
function createMinimalPNG(r, g, b) {
	// PNG signature
	const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
	
	// IHDR chunk (image header)
	const width = 81
	const height = 81
	const ihdrData = Buffer.alloc(13)
	ihdrData.writeUInt32BE(width, 0)
	ihdrData.writeUInt32BE(height, 4)
	ihdrData[8] = 8  // bit depth
	ihdrData[9] = 2  // color type (RGB)
	ihdrData[10] = 0 // compression
	ihdrData[11] = 0 // filter
	ihdrData[12] = 0 // interlace
	const ihdr = createChunk('IHDR', ihdrData)
	
	// IDAT chunk (image data)
	const rawData = []
	for (let y = 0; y < height; y++) {
		rawData.push(0) // filter byte
		for (let x = 0; x < width; x++) {
			rawData.push(r, g, b)
		}
	}
	const zlib = require('zlib')
	const compressed = zlib.deflateSync(Buffer.from(rawData))
	const idat = createChunk('IDAT', compressed)
	
	// IEND chunk
	const iend = createChunk('IEND', Buffer.alloc(0))
	
	return Buffer.concat([signature, ihdr, idat, iend])
}

function createChunk(type, data) {
	const length = Buffer.alloc(4)
	length.writeUInt32BE(data.length, 0)
	const typeBuffer = Buffer.from(type, 'ascii')
	const crcData = Buffer.concat([typeBuffer, data])
	const crc = Buffer.alloc(4)
	crc.writeUInt32BE(crc32(crcData), 0)
	return Buffer.concat([length, typeBuffer, data, crc])
}

function crc32(buf) {
	let crc = 0xFFFFFFFF
	for (let i = 0; i < buf.length; i++) {
		crc ^= buf[i]
		for (let j = 0; j < 8; j++) {
			crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
		}
	}
	return (crc ^ 0xFFFFFFFF) >>> 0
}

const iconsDir = path.join(__dirname, 'static', 'icons')

// 生成6个 tabBar 图标（3个普通 + 3个选中态）
const icons = [
	{ name: 'home.png', color: [153, 153, 153] },
	{ name: 'home-active.png', color: [22, 93, 255] },
	{ name: 'recruit.png', color: [153, 153, 153] },
	{ name: 'recruit-active.png', color: [22, 93, 255] },
	{ name: 'about.png', color: [153, 153, 153] },
	{ name: 'about-active.png', color: [22, 93, 255] }
]

icons.forEach(icon => {
	const png = createMinimalPNG(...icon.color)
	fs.writeFileSync(path.join(iconsDir, icon.name), png)
	console.log(`Generated: ${icon.name}`)
})

console.log('\n图标生成完成！请替换为正式设计的图标文件。')
