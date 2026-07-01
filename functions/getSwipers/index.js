const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取轮播图列表
exports.main = async (event, context) => {
	try {
		const res = await db.collection('swiper')
			.where({ status: 'active' })
			.orderBy('sort', 'asc')
			.limit(10)
			.get()
		return { success: true, data: res.data }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
