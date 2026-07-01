const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 获取当前用户信息
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID

	try {
		const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()

		if (userRes.data && userRes.data.length > 0) {
			const user = userRes.data[0]
			return {
				success: true,
				data: {
					openid,
					role: user.role || 'user',
					nickName: user.nickName || '',
					avatarUrl: user.avatarUrl || '',
					phone: user.phone || '',
					companyInfo: user.companyInfo || {},
					isNew: false
				}
			}
		}

		// 新用户自动注册
		await db.collection('user').add({
			data: {
				_openid: openid,
				role: 'user',
				nickName: '',
				avatarUrl: '',
				phone: '',
				companyInfo: {},
				createTime: new Date()
			}
		})

		return {
			success: true,
			data: {
				openid,
				role: 'user',
				nickName: '',
				avatarUrl: '',
				phone: '',
				companyInfo: {},
				isNew: true
			}
		}
	} catch (e) {
		return { success: false, message: e.message }
	}
}
