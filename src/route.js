import asyncComponent from './component/async-component/async-component';

const ROUTES = [
  {
    path: '/home',
    component: asyncComponent(() => import('container/home/home'))
  },
  {
    path: '/system/role',
    component: asyncComponent(() => import('container/security/role/role'))
  },
  {
    path: '/system/role/addedit',
    component: asyncComponent(() => import('container/security/role-addedit/role-addedit'))
  },
  {
    path: '/security/role/menu',
    component: asyncComponent(() => import('container/security/role-menu/role-menu'))
  },
  {
    path: '/system/menu',
    component: asyncComponent(() => import('container/security/menu/menu'))
  },
  {
    path: '/system/menu/addedit',
    component: asyncComponent(() => import('container/security/menu-addedit/menu-addedit'))
  },
  {
    path: '/system/user',
    component: asyncComponent(() => import('container/security/user/user'))
  },
  {
    path: '/system/user/addedit',
    component: asyncComponent(() => import('container/security/user-addedit/user-addedit'))
  },
  {
    path: '/system/sysPara',
    component: asyncComponent(() => import('container/security/sysParam/sysParam'))
  },
  {
    path: '/system/sysPara/addedit',
    component: asyncComponent(() => import('container/security/sysParam-addedit/sysParam-addedit'))
  },
  {
    path: '/system/dataDict',
    component: asyncComponent(() => import('container/security/dict/dict'))
  },
  {
    path: '/system/dataDict/addedit',
    component: asyncComponent(() => import('container/security/dict-addedit/dict-addedit'))
  },
  {
    path: '/security/user/resetPwd',
    component: asyncComponent(() => import('container/security/user-resetPwd/user-resetPwd'))
  },
  {
    path: '/security/user/setRole',
    component: asyncComponent(() => import('container/security/user-setRole/user-setRole'))
  },
  {
    path: '/security/user/changeMobile',
    component: asyncComponent(() => import('container/security/user-changeMobile/user-changeMobile'))
  },
  {
    path: '/staff/allStaff',
    component: asyncComponent(() => import('container/staff/allStaff/allStaff'))
  },
  {
    path: '/staff/allStaff/bank',
    component: asyncComponent(() => import('container/biz/bank/bank-addedit'))
  },
  {
    path: '/staff/bank',
    component: asyncComponent(() => import('container/biz/bank/bank'))
  },
  {
    path: '/staff/bank/addedit',
    component: asyncComponent(() => import('container/biz/bank/bank-addedit'))
  },
  {
    path: '/staff/allStaff/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-addedit/allStaff-addedit'))
  },
  {
    path: '/staff/jiandang',
    component: asyncComponent(() => import('container/staff/archives/jiandang'))
  },
  {
    path: '/staff/jiandang/step2',
    component: asyncComponent(() => import('container/staff/archives/jiandang-step2'))
  },
  {
    path: '/staff/jiandang/step3',
    component: asyncComponent(() => import('container/staff/archives/jiandang-step3'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位
  {
    path: '/project/projectparticipant',
    component: asyncComponent(() => import('container/biz/project/participating/participating'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位--新增修改
  {
    path: '/project/projectparticipant/addedit',
    component: asyncComponent(() => import('container/biz/project/participating/participating-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位--详情
  {
    path: '/project/projectparticipant/detail',
    component: asyncComponent(() => import('container/biz/project/participating/participating-detail'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位--导入
  {
    path: '/project/projectparticipant/import',
    component: asyncComponent(() => import('container/biz/project/participating/participating-import'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位--银行列表
  {
    path: '/project/projectparticipant/bank',
    component: asyncComponent(() => import('container/biz/bank/bank'))
  },
  // 业务管理 -- 项目管理-- 项目参建单位--银行列表--详情
  {
    path: '/project/projectparticipant/bank/addedit',
    component: asyncComponent(() => import('container/biz/bank/bank-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目班组
  {
    path: '/project/class',
    component: asyncComponent(() => import('container/biz/project/class/class'))
  },
  {
    path: '/project/videoMenu',
    component: asyncComponent(() => import('container/biz/project/videoMenu/video'))
  },
  {
    path: '/project/videoMenu/add',
    component: asyncComponent(() => import('container/biz/project/videoMenu/video-addedit'))
  },
  {
    path: '/project/videoMenu/change',
    component: asyncComponent(() => import('container/biz/project/videoMenu/video-change'))
  },
  // 业务管理 -- 项目管理-- 项目班组-- 详情
  {
    path: '/project/class/addedit',
    component: asyncComponent(() => import('container/biz/project/class/class-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目班组-- 导入
  {
    path: '/project/class/import',
    component: asyncComponent(() => import('container/biz/project/class/class-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员
  {
    path: '/project/member',
    component: asyncComponent(() => import('container/biz/project/member/member'))
  },
  // 业务管理 -- 项目管理-- 进出记录
  {
    path: '/project/outInto',
    component: asyncComponent(() => import('container/biz/project/outInto/outInto'))
  },
  // 业务管理 -- 项目管理-- 进出记录 -详情
  {
    path: '/project/outInto/addedit',
    component: asyncComponent(() => import('container/biz/project/outInto/outInto-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目人员-- 详情
  {
    path: '/project/member/addedit',
    component: asyncComponent(() => import('container/biz/project/member/member-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目人员-- 采集人脸
  {
    path: '/project/member/acquisitionFaces',
    component: asyncComponent(() => import('container/biz/project/member/acquisitionFaces'))
  },
  // 业务管理 -- 项目管理-- 项目人员-- 导入
  {
    path: '/project/member/import',
    component: asyncComponent(() => import('container/biz/project/member/member-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员进退场
  {
    path: '/project/inout',
    component: asyncComponent(() => import('container/biz/project/inout/inout'))
  },
  // 业务管理 -- 项目管理-- 项目人员进退场-- 导入
  {
    path: '/project/inout/import',
    component: asyncComponent(() => import('container/biz/project/inout/inout-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员进退场-- 详情
  {
    path: '/project/inout/addedit',
    component: asyncComponent(() => import('container/biz/project/inout/inout-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目人员合同
  {
    path: '/project/memcontract',
    component: asyncComponent(() => import('container/biz/project/memcontract/memcontract'))
  },
  // 业务管理 -- 项目管理-- 项目人员合同-- 导入
  {
    path: '/project/memcontract/import',
    component: asyncComponent(() => import('container/biz/project/memcontract/memcontract-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员合同-- 详情
  {
    path: '/project/memcontract/addedit',
    component: asyncComponent(() => import('container/biz/project/memcontract/memcontract-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目人员考勤
  {
    path: '/project/attence',
    component: asyncComponent(() => import('container/biz/project/attence/attence'))
  },
  // 业务管理 -- 项目管理-- 项目人员考勤-- 导入
  {
    path: '/project/attence/import',
    component: asyncComponent(() => import('container/biz/project/attence/attence-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员考勤-- 详情
  {
    path: '/project/attence/addedit',
    component: asyncComponent(() => import('container/biz/project/attence/attence-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目人员考勤-- 生成
  {
    path: '/project/attence/create',
    component: asyncComponent(() => import('container/biz/project/attence/attence-create'))
  },
  // 业务管理 -- 项目管理-- 项目人员工资
  {
    path: '/project/wages',
    component: asyncComponent(() => import('container/biz/project/wages/wages'))
  },
  // 业务管理 -- 项目管理-- 项目人员工资-- 新增
  {
    path: '/project/wages/add',
    component: asyncComponent(() => import('container/biz/project/wages/wages-add'))
  },
  // 业务管理 -- 项目管理-- 项目人员工资-- 导入
  {
    path: '/project/wages/import',
    component: asyncComponent(() => import('container/biz/project/wages/wages-import'))
  },
  // 业务管理 -- 项目管理-- 项目人员工资-- 详情
  {
    path: '/project/wages/addedit',
    component: asyncComponent(() => import('container/biz/project/wages/wages-addedit'))
  },
  // 业务管理 -- 项目管理-- 项目基本信息
  {
    path: '/project/basic',
    component: asyncComponent(() => import('container/biz/project/basic/basic'))
  },
  // 业务管理 -- 企业库-- 企业基本信息
  {
    path: '/company/info',
    component: asyncComponent(() => import('container/biz/company/info/info'))
  },
  // 业务管理 -- 企业库-- 企业基本信息-- 详情
  {
    path: '/company/info/addedit',
    component: asyncComponent(() => import('container/biz/company/info/info-addedit'))
  },
  // 智慧工地-闸机管理
  {
    path: '/brakeMachine',
    component: asyncComponent(() => import('container/biz/wisdom/brakeMachine/brakeMachine'))
  },
  // 智慧工地-闸机管理-新增修改
  {
    path: '/brakeMachine/addedit',
    component: asyncComponent(() => import('container/biz/wisdom/brakeMachine/brakeMachine-addedit'))
  },
  // 智慧工地-闸机人员管理
  {
    path: '/brakeMachine_per',
    component: asyncComponent(() => import('container/biz/wisdom/brakeMachine_per/brakeMachine_per'))
  }
];

export default ROUTES;
