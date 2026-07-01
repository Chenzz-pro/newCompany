const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 发布/更新招聘岗位（admin权限）
exports.main = async (event, context) => {
	const { jobData, jobId } = event

	try {
		if (!jobData.title || !jobData.category || !jobData.location || !jobData.salary) {
			return { success: false, message: '请填写完整的岗位信息' }
		}

		const wxContext = cloud.getWXContext()
		const openid = wxContext.OPENID

		// 鉴权：必须是admin
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		if (!userRes.data || userRes.data.length === 0) {
			return { success: false, message: '请先登录' }
		}
		if (userRes.data[0].role !== 'admin') {
			return { success: false, message: '仅管理员可发布岗位' }
		}

		const data = {
			title: jobData.title,
			category: jobData.category,
			location: jobData.location,
			salary: jobData.salary,
			experience: jobData.experience || '不限',
			education: jobData.education || '不限',
			count: jobData.count || 1,
			isUrgent: jobData.isUrgent || false,
			description: jobData.description || '',
			requirements: jobData.requirements || [],
			benefits: jobData.benefits || [],
			status: 'published',
			publishTime: new Date(),
			updateTime: new Date(),
			publisher: openid,
			createOpenid: openid
		}

		if (jobId) {
			await db.collection('recruit').doc(jobId).update({ data })
			return { success: true, message: '更新成功', data: { id: jobId } }
		} else {
			const result = await db.collection('recruit').add({ data })
			return { success: true, message: '发布成功', data: { id: result._id } }
		}
	} catch (e) {
		return { success: false, message: e.message }
	}
}
