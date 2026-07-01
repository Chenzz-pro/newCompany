const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 更新简历状态（admin权限）
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	const { deliverId, readStatus, interviewStatus, remark } = event

	try {
		if (!deliverId) {
			return { success: false, message: '缺少投递记录ID' }
		}

		// 鉴权：必须是admin
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		if (!userRes.data || userRes.data.length === 0) {
			return { success: false, message: '请先登录' }
		}
		if (userRes.data[0].role !== 'admin') {
			return { success: false, message: '无权限操作' }
		}

		const deliverRes = await db.collection('resume_deliver').doc(deliverId).get()
		if (!deliverRes.data) {
			return { success: false, message: '记录不存在' }
		}

		const updateData = { updateTime: new Date() }
		if (readStatus !== undefined) updateData.readStatus = readStatus
		if (interviewStatus !== undefined) updateData.interviewStatus = interviewStatus
		if (remark !== undefined) updateData.remark = remark

		await db.collection('resume_deliver').doc(deliverId).update({ data: updateData })
		return { success: true, message: '更新成功' }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
