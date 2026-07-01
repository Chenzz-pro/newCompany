const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 获取招聘岗位列表
exports.main = async (event, context) => {
	const { page = 1, pageSize = 10, where = {}, sortOrder = 'desc' } = event

	try {
		let query = db.collection('recruit')

		// 构建筛选条件
		const conditions = {}
		if (where.status) {
			conditions.status = where.status
		} else {
			conditions.status = 'published'
		}
		if (where.category && where.category !== '全部') {
			conditions.category = where.category
		}
		if (where.location && where.location !== '全部') {
			conditions.location = where.location
		}

		query = query.where(conditions)

		// 获取总数
		const countRes = await query.count()
		const total = countRes.total

		// 排序：急招置顶 + 按发布时间排序
		const orderField = sortOrder === 'asc' ? 'asc' : 'desc'
		const dataRes = await query
			.orderBy('isUrgent', 'desc')
			.orderBy('publishTime', orderField)
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
