/**
 * 全局配置文件
 */
const config = {
	// 云开发环境ID（需替换为实际环境ID）
	envId: 'cloud1-d8gilol6sdb2084d3',
	
	// 数据库集合名称
	collections: {
		swipers: 'swiper',        // 轮播图表
		video: 'video_info',      // 宣传视频表
		recruit: 'recruit',       // 招聘岗位表
		resume: 'resume',         // 投递简历表
		company: 'company_info'   // 企业信息表
	},
	
	// 企业信息（备用，也可从云数据库读取）
	company: {
		name: '厦门市凯风云燊传媒有限公司',
		phone: '17359685945',
		address: '福建省厦门市翔安区顶翔建业大厦A栋',
		wechat: 'zhzhibofuwu',
		latitude: 24.614357,
		longitude: 118.236622,
		email: '851710079@qq.com'
	},
	
	// 分页配置
	pageSize: 10,
	
	// 岗位分类
	jobCategories: ['全部', '新媒体运营','直播主播','视频摄制'],
	
	// 工作地点
	workLocations: ['全部', '厦门', '福州', '泉州', '外地']
}

export default config
