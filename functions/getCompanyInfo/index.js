const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取企业信息
exports.main = async (event, context) => {
	try {
		const res = await db.collection('company_info')
			.limit(1)
			.get()
		return { success: true, data: res.data.length > 0 ? res.data[0] : null }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
