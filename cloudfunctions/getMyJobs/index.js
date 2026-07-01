const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取岗位列表（admin查看全部，普通用户看已发布的）
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	const { page = 1, pageSize = 20, status } = event

	try {
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		const isAdmin = userRes.data && userRes.data.length > 0 && userRes.data[0].role === 'admin'

		// admin看所有岗位，普通用户只看已发布的
		const conditions = {}
		if (!isAdmin) {
			conditions.status = 'published'
		} else if (status) {
			conditions.status = status
		}

		const query = db.collection('recruit').where(conditions)
		const countRes = await query.count()
		const total = countRes.total

		const dataRes = await query
			.orderBy('publishTime', 'desc')
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.get()

		return {
			success: true,
			data: {
				list: dataRes.data,
				total,
				hasMore: page * pageSize < total,
				isAdmin
			}
		}
	} catch (e) {
		return { success: false, message: e.message }
	}
}
