const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 提交简历或留言反馈
exports.main = async (event, context) => {
	const { type = 'resume', data } = event

	if (!data) {
		return { success: false, message: '缺少提交数据' }
	}

	try {
		// 获取用户openid
		const wxContext = cloud.getWXContext()

		const record = {
			...data,
			openid: wxContext.OPENID,
			createTime: data.createTime || new Date(),
			status: 'pending'
		}

		// 根据类型存入不同集合
		const collection = type === 'feedback' ? 'feedback' : 'resume'
		const res = await db.collection(collection).add({ data: record })

		return { success: true, data: res, message: '提交成功' }
	} catch (e) {
		return { success: false, message: e.message }
	}
}
