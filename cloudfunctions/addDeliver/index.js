const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 投递简历
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	const { jobId, resumeInfo } = event

	console.log('========== addDeliver 收到参数 ==========')
	console.log('openid:', openid)
	console.log('jobId:', jobId)
	console.log('resumeInfo:', JSON.stringify(resumeInfo))

	try {
		if (!jobId) {
			return { success: false, message: '缺少岗位ID' }
		}
		if (!resumeInfo || !resumeInfo.realName || !resumeInfo.phone) {
			return { success: false, message: '请填写完整的简历信息' }
		}

		// 校验用户角色（仅求职者可投递）
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
		if (userRes.data && userRes.data.length > 0) {
			const user = userRes.data[0]
			if (user.role === 'company' && user.companyAuth) {
				return { success: false, message: '企业用户不能投递简历' }
			}
		}

		// 获取岗位信息，拿到发布企业的openid
		const jobRes = await db.collection('recruit').doc(jobId).get()
		if (!jobRes.data) {
			return { success: false, message: '岗位不存在' }
		}
		const job = jobRes.data
		if (job.status !== 'published') {
			return { success: false, message: '该岗位已停止招聘' }
		}

		// 检查是否重复投递
		const existRes = await db.collection('resume_deliver').where({
			jobId,
			deliverOpenid: openid
		}).limit(1).get()

		if (existRes.data && existRes.data.length > 0) {
			return { success: false, message: '您已投递过该岗位，请勿重复投递' }
		}

		// 写入投递记录
		const deliverData = {
			jobId,
			jobTitle: job.title || '',
			jobCreateOpenid: job.publisher || job._openid || '',
			deliverOpenid: openid,
			resumeInfo: {
				realName: resumeInfo.realName,
				phone: resumeInfo.phone,
				wechat: resumeInfo.wechat || '',
				education: resumeInfo.education || '',
				workExp: resumeInfo.workExp || resumeInfo.experience || '',
				selfIntro: resumeInfo.selfIntro || resumeInfo.intro || '',
				resumeFile: resumeInfo.resumeFile || resumeInfo.images || []
			},
			deliverTime: new Date(),
			readStatus: 0,
			interviewStatus: 0
		}

		console.log('准备写入数据:', JSON.stringify(deliverData))
		const res = await db.collection('resume_deliver').add({ data: deliverData })
		console.log('写入成功，返回ID:', res._id)

		return { success: true, message: '投递成功', data: { id: res._id } }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
