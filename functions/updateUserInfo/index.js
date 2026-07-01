const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 更新用户信息
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = wxContext.OPENID
	
	console.log('========== updateUserInfo 收到参数 ==========')
	console.log('event:', JSON.stringify(event))
	
	const { updateData, getPhone } = event
	console.log('getPhone:', getPhone, 'updateData:', JSON.stringify(updateData))

	try {
		// 处理手机号获取（通过 code 解析）
		if (getPhone && updateData) {
			let phoneNumber = null
			let errorMsg = ''
			
			// 方式1: 使用 phoneCode (新版 API)
			if (updateData.phoneCode) {
				try {
					console.log('尝试通过 code 获取手机号...')
					const phoneRes = await cloud.getPhoneNumber({
						code: updateData.phoneCode
					})
					console.log('getPhoneNumber 返回:', JSON.stringify(phoneRes))
					if (phoneRes && phoneRes.phoneNumber) {
						phoneNumber = phoneRes.phoneNumber
					}
				} catch (e) {
					console.error('通过 code 获取手机号失败:', e)
					errorMsg += 'code方式失败:' + (e.message || e.errMsg || JSON.stringify(e)) + '; '
				}
			}
			
			// 方式2: 使用 cloudID (旧版 API)
			if (!phoneNumber && updateData.cloudID) {
				try {
					console.log('尝试通过 cloudID 获取手机号...')
					const phoneRes = await cloud.getOpenData({
						list: [updateData.cloudID]
					})
					console.log('getOpenData 返回:', JSON.stringify(phoneRes))
					if (phoneRes && phoneRes.list && phoneRes.list[0]) {
						const phoneData = phoneRes.list[0]
						if (phoneData.data && phoneData.data.phoneNumber) {
							phoneNumber = phoneData.data.phoneNumber
						}
					}
				} catch (e) {
					console.error('通过 cloudID 获取手机号失败:', e)
					errorMsg += 'cloudID方式失败:' + (e.message || e.errMsg || JSON.stringify(e)) + '; '
				}
			}
			
			if (phoneNumber) {
				await updateUserData(openid, { phone: phoneNumber })
				return { success: true, message: '登录成功', data: { phone: phoneNumber } }
			}
			return { success: false, message: '手机号获取失败: ' + (errorMsg || '未知错误') }
		}

		if (!updateData || Object.keys(updateData).length === 0) {
			return { success: false, message: '缺少更新数据' }
		}

		// 安全字段白名单
		const allowedFields = ['nickName', 'avatarUrl', 'phone', 'role', 'companyInfo']
		const safeUpdate = {}
		for (const key of allowedFields) {
			if (updateData[key] !== undefined) {
				safeUpdate[key] = updateData[key]
			}
		}

		// 防止普通用户自行修改角色
		if (safeUpdate.role && safeUpdate.role !== 'user') {
			delete safeUpdate.role
		}

		safeUpdate.updateTime = new Date()
		await updateUserData(openid, safeUpdate)

		return { success: true, message: '更新成功' }
	} catch (e) {
		return { success: false, message: e.message }
	}
}

async function updateUserData(openid, data) {
	const userRes = await db.collection('user').where({ _openid: openid }).limit(1).get()
	if (userRes.data && userRes.data.length > 0) {
		await db.collection('user').where({ _openid: openid }).update({ data })
	} else {
		await db.collection('user').add({
			data: { _openid: openid, ...data, createTime: new Date() }
		})
	}
}
