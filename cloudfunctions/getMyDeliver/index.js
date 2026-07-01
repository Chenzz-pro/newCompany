const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取求职者我的投递记录
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	const { page = 1, pageSize = 10 } = event

	try {
		const query = db.collection('resume_deliver').where({
			deliverOpenid: openid
		})

		const countRes = await query.count()
		const total = countRes.total

		const dataRes = await query
			.orderBy('deliverTime', 'desc')
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.get()

		return {
			success: true,
			data: {
				list: dataRes.data,
				total,
				hasMore: page * pageSize < total
			}
		}
	} catch (e) {
		return { success: false, message: e.message }
	}
}
