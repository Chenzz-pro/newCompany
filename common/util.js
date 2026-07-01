/**
 * 工具函数库
 */

/**
 * 调用云函数封装
 */
export function callCloud(name, data = {}) {
	return new Promise((resolve, reject) => {
		wx.cloud.callFunction({
			name,
			data,
			success: res => resolve(res.result),
			fail: err => {
				console.error(`云函数[${name}]调用失败:`, err)
				reject(err)
			}
		})
	})
}

/**
 * 显示加载提示
 */
export function showLoading(title = '加载中...') {
	wx.showLoading({ title, mask: true })
}

export function hideLoading() {
	wx.hideLoading()
}

/**
 * 显示消息提示
 */
export function showToast(title, icon = 'none') {
	wx.showToast({ title, icon, duration: 2000 })
}

/**
 * 格式化时间
 */
export function formatTime(date) {
	if (!date) return ''
	const d = new Date(date)
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/**
 * 相对时间（如"3天前"）
 */
export function relativeTime(date) {
	if (!date) return ''
	const now = Date.now()
	const diff = now - new Date(date).getTime()
	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour
	
	if (diff < minute) return '刚刚'
	if (diff < hour) return Math.floor(diff / minute) + '分钟前'
	if (diff < day) return Math.floor(diff / hour) + '小时前'
	if (diff < 30 * day) return Math.floor(diff / day) + '天前'
	return formatTime(date)
}

/**
 * 手机号校验
 */
export function isValidPhone(phone) {
	return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 拨打电话
 */
export function makePhoneCall(phoneNumber) {
	wx.makePhoneCall({ phoneNumber })
}

/**
 * 复制到剪贴板
 */
export function copyToClipboard(data) {
	wx.setClipboardData({
		data,
		success: () => showToast('已复制')
	})
}

/**
 * 预览图片
 */
export function previewImage(urls, current = 0) {
	wx.previewImage({ urls, current })
}

/**
 * 获取云数据库引用
 */
export function getDB() {
	return wx.cloud.database()
}

/**
 * 分页获取数据
 */
export async function getPageData(collection, { page = 1, pageSize = 10, where = {}, orderBy = {} } = {}) {
	const db = getDB()
	const skip = (page - 1) * pageSize
	
	let query = db.collection(collection)
	
	// 筛选条件
	if (where && Object.keys(where).length) {
		query = query.where(where)
	}
	
	// 排序
	if (orderBy.field) {
		query = query.orderBy(orderBy.field, orderBy.order || 'desc')
	}
	
	const countRes = await query.count()
	const total = countRes.total
	
	const dataRes = await query.skip(skip).limit(pageSize).get()
	
	return {
		list: dataRes.data,
		total,
		hasMore: page * pageSize < total
	}
}
