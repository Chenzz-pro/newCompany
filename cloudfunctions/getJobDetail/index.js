const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取岗位详情
exports.main = async (event, context) => {
	const { id } = event

	if (!id) {
		return { success: false, message: '缺少岗位ID' }
	}

	try {
		const res = await db.collection('recruit')
			.doc(id)
			.get()

		console.log('查询到的岗位数据:', JSON.stringify(res.data))
		return { success: true, data: res.data }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
