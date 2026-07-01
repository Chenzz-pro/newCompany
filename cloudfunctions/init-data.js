/**
 * 数据库集合设计与初始化数据
 * 
 * 在微信云开发控制台中手动创建以下集合，然后逐条添加初始数据
 * 
 * 集合列表：
 * 1. swiper        - 轮播图表
 * 2. video_info    - 宣传视频表
 * 3. company_info  - 企业信息表
 * 4. recruit       - 招聘岗位表
 * 5. resume        - 投递简历表
 * 6. feedback      - 留言反馈表
 */

// ==================== 1. swiper 轮播图表 ====================
// 字段说明：
// imageUrl  : String  - 图片地址（云存储fileID）
// link      : String  - 点击跳转链接（可选）
// sort      : Number  - 排序值（越小越靠前）
// status    : String  - 状态：active/inactive
// createTime: Date    - 创建时间

// 初始化数据示例（在云开发控制台的swiper集合中添加）：
const swiperData = [
	{
		imageUrl: 'cloud://your-env.xxx/swiper/banner1.jpg',
		link: '',
		sort: 1,
		status: 'active',
		createTime: new Date()
	},
	{
		imageUrl: 'cloud://your-env.xxx/swiper/banner2.jpg',
		link: '/pages/recruit/list',
		sort: 2,
		status: 'active',
		createTime: new Date()
	},
	{
		imageUrl: 'cloud://your-env.xxx/swiper/banner3.jpg',
		link: '',
		sort: 3,
		status: 'active',
		createTime: new Date()
	}
]

// ==================== 2. video_info 宣传视频表 ====================
// 字段说明：
// videoUrl   : String  - 视频地址（云存储fileID）
// posterUrl  : String  - 封面图地址
// title      : String  - 视频标题
// status     : String  - 状态：active/inactive
// createTime : Date    - 创建时间

const videoData = {
	videoUrl: 'cloud://your-env.xxx/video/company.mp4',
	posterUrl: 'cloud://your-env.xxx/video/poster.jpg',
	title: '企业宣传片',
	status: 'active',
	createTime: new Date()
}

// ==================== 3. company_info 企业信息表 ====================
// 字段说明：
// name      : String  - 企业名称
// slogan    : String  - 企业标语
// intro     : String  - 简短介绍（首页展示）
// fullIntro : String  - 完整介绍（富文本HTML）
// phone     : String  - 联系电话
// address   : String  - 公司地址
// wechat    : String  - 客服微信
// email     : String  - 邮箱
// latitude  : Number  - 纬度
// longitude : Number  - 经度
// qrcode    : String  - 公众号二维码图片
// images    : Array   - 企业实景图片数组
// business  : Array   - 核心业务列表 [{name, icon}]
// timeline  : Array   - 发展历程 [{year, event}]
// gallery   : Array   - 环境图集

const companyData = {
	name: 'XX科技有限公司',
	slogan: '科技创新，引领未来',
	intro: 'XX科技有限公司成立于2010年，是一家专注于智能制造和科技创新的高新技术企业。公司拥有先进的生产设备和专业的技术团队，致力于为客户提供优质的产品和服务。',
	fullIntro: '<p>XX科技有限公司成立于2010年，坐落于XX市高新技术产业园区。</p><p>公司占地面积50000平方米，拥有员工500余人，其中高级工程师50余人。</p><p>主营业务涵盖智能制造、自动化设备、工业软件开发等领域。</p>',
	phone: '400-888-8888',
	address: 'XX省XX市XX区XX路XX号',
	wechat: 'company_wechat',
	email: 'hr@company.com',
	latitude: 39.908823,
	longitude: 116.397470,
	qrcode: 'cloud://your-env.xxx/qrcode/wechat.jpg',
	images: [],
	business: [
		{ name: '智能制造', icon: '/static/icons/business1.png' },
		{ name: '自动化设备', icon: '/static/icons/business2.png' },
		{ name: '工业软件', icon: '/static/icons/business3.png' },
		{ name: '技术咨询', icon: '/static/icons/business4.png' }
	],
	timeline: [
		{ year: '2010年', event: '公司正式成立，入驻高新技术产业园区' },
		{ year: '2013年', event: '获得高新技术企业认定，团队突破100人' },
		{ year: '2016年', event: '成功上市新三板，年产值突破1亿' },
		{ year: '2019年', event: '成立海外事业部，产品远销东南亚' },
		{ year: '2023年', event: '年产值突破5亿，员工超500人' }
	],
	gallery: [],
	createTime: new Date()
}

// ==================== 4. recruit 招聘岗位表 ====================
// 字段说明：
// title         : String  - 岗位名称
// category      : String  - 岗位分类
// salary        : String  - 薪资范围
// location      : String  - 工作地点
// experience    : String  - 经验要求
// headcount     : Number  - 招聘人数
// workType      : String  - 工作类型（全职/兼职/实习）
// responsibility: String  - 岗位职责（富文本）
// requirement   : String  - 任职要求（富文本）
// benefits      : Array   - 公司福利列表
// tags          : Array   - 标签列表
// isUrgent      : Boolean - 是否急招
// freshGrad     : Boolean - 是否接受应届生
// status        : String  - 状态：published/draft/closed
// publishTime   : Date    - 发布时间
// address       : String  - 工作地址
// latitude      : Number  - 纬度（可选）
// longitude     : Number  - 经度（可选）

const recruitSamples = [
	{
		title: 'Java高级开发工程师',
		category: '技术/研发',
		salary: '15K-25K',
		location: '总部',
		experience: '3-5年',
		headcount: 3,
		workType: '全职',
		responsibility: '<p>1. 负责公司核心产品的后端开发与架构设计</p><p>2. 参与系统需求分析与技术方案设计</p><p>3. 负责系统性能优化与稳定性保障</p>',
		requirement: '<p>1. 本科及以上学历，计算机相关专业</p><p>2. 3年以上Java开发经验，精通Spring Boot/Cloud</p><p>3. 熟悉MySQL、Redis、MQ等中间件</p><p>4. 良好的编码习惯和团队协作能力</p>',
		benefits: ['五险一金', '年终奖', '餐补', '带薪年假', '团建活动', '技术培训'],
		tags: ['急招', '技术大牛带队'],
		isUrgent: true,
		freshGrad: false,
		status: 'published',
		publishTime: new Date(),
		address: 'XX省XX市XX区XX路XX号'
	},
	{
		title: '行政专员',
		category: '行政/人事',
		salary: '5K-8K',
		location: '总部',
		experience: '1-3年',
		headcount: 1,
		workType: '全职',
		responsibility: '<p>1. 负责日常行政事务管理</p><p>2. 协助组织公司活动与会议</p><p>3. 负责办公用品采购与管理</p>',
		requirement: '<p>1. 大专及以上学历</p><p>2. 1年以上行政工作经验</p><p>3. 熟练使用Office办公软件</p><p>4. 沟通能力强，工作细致认真</p>',
		benefits: ['五险一金', '双休', '带薪年假', '节日福利'],
		tags: ['双休', '五险一金'],
		isUrgent: false,
		freshGrad: true,
		status: 'published',
		publishTime: new Date(),
		address: 'XX省XX市XX区XX路XX号'
	},
	{
		title: '销售经理',
		category: '销售/市场',
		salary: '8K-15K',
		location: '分公司A',
		experience: '3-5年',
		headcount: 2,
		workType: '全职',
		responsibility: '<p>1. 负责公司产品的销售与推广</p><p>2. 开拓新客户，维护老客户关系</p><p>3. 完成销售目标与业绩指标</p>',
		requirement: '<p>1. 大专及以上学历，市场营销相关专业优先</p><p>2. 3年以上销售经验，有B2B销售经验优先</p><p>3. 优秀的沟通谈判能力</p><p>4. 能承受工作压力，适应出差</p>',
		benefits: ['底薪+提成', '五险一金', '交通补贴', '通讯补贴'],
		tags: ['高薪', '提成丰厚'],
		isUrgent: true,
		freshGrad: false,
		status: 'published',
		publishTime: new Date(),
		address: 'XX省XX市XX区XX路XX号'
	}
]

// ==================== 5. resume 投递简历表 ====================
// 由用户提交自动生成，字段：
// name       : String  - 姓名
// phone      : String  - 手机号
// position   : String  - 意向岗位
// experience : String  - 工作经验
// images     : Array   - 简历图片
// intro      : String  - 自我介绍
// jobId      : String  - 关联岗位ID
// openid     : String  - 用户openid
// status     : String  - 状态：pending/contacted/hired/rejected
// createTime : Date    - 提交时间

// ==================== 6. feedback 留言反馈表 ====================
// 由用户提交自动生成，字段：
// name       : String  - 姓名
// phone      : String  - 手机号
// content    : String  - 留言内容
// openid     : String  - 用户openid
// createTime : Date    - 提交时间

/**
 * 操作步骤：
 * 1. 在微信云开发控制台创建以上6个集合
 * 2. 设置集合权限：
 *    - swiper, video_info, company_info, recruit：所有用户可读，仅管理员可写
 *    - resume, feedback：仅创建者可读写（或所有用户可写）
 * 3. 将上述示例数据逐条添加到对应集合
 * 4. 上传实际图片/视频到云存储，替换示例中的fileID
 */
