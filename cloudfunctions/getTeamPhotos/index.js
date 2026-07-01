const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取团建照片列表
exports.main = async (event, context) => {
	try {
		const res = await db.collection('team_photos')
			.where({ status: 'active' })
			.orderBy('sort', 'asc')
			.limit(20)
			.get()
		return { success: true, data: res.data }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
