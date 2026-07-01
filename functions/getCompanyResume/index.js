const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 获取简历列表（admin查看全部，普通用户无权限）
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	const { jobId, page = 1, pageSize = 10, interviewStatus } = event

	try {
		// 鉴权：必须是admin
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		if (!userRes.data || userRes.data.length === 0) {
			return { success: false, message: '请先登录' }
		}
		if (userRes.data[0].role !== 'admin') {
			return { success: false, message: '无权限查看简历' }
		}

		console.log('========== getCompanyResume ==========')
		console.log('jobId:', jobId)
		console.log('page:', page)
		console.log('interviewStatus:', interviewStatus)

		// 构建查询条件
		const conditions = {}
		if (jobId) conditions.jobId = jobId
		if (interviewStatus !== undefined && interviewStatus !== null && interviewStatus !== -1) {
			conditions.interviewStatus = interviewStatus
		}

		const query = db.collection('resume_deliver').where(conditions)
		const countRes = await query.count()
		const total = countRes.total
		console.log('查询条件:', JSON.stringify(conditions))
		console.log('总记录数:', total)

		const dataRes = await query
			.orderBy('readStatus', 'asc')
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
