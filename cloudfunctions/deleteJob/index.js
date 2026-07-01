const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 删除/下架招聘岗位（admin权限）
exports.main = async (event, context) => {
	const { jobId, action } = event

	try {
		if (!jobId) {
			return { success: false, message: '缺少岗位ID' }
		}

		const wxContext = cloud.getWXContext()
		const openid = wxContext.OPENID

		// 鉴权：必须是admin
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		if (!userRes.data || userRes.data.length === 0) {
			return { success: false, message: '请先登录' }
		}
		if (userRes.data[0].role !== 'admin') {
			return { success: false, message: '仅管理员可操作岗位' }
		}

		if (action === 'offline' || action === 'online') {
			const newStatus = action === 'online' ? 'published' : 'offline'
			await db.collection('recruit').doc(jobId).update({
				data: { status: newStatus, updateTime: new Date() }
			})
			return { success: true, message: action === 'online' ? '已上架' : '已下架' }
		} else {
			await db.collection('recruit').doc(jobId).remove()
			return { success: true, message: '删除成功' }
		}
	} catch (e) {
		return { success: false, message: e.message }
	}
}
