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
    path: '/public/aboutus_addedit',
    component: asyncComponent(() => import('container/public/aboutus-addedit/aboutus-addedit'))
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
    path: '/security/user/setBumen',
    component: asyncComponent(() => import('container/security/user-setBumen/user-setBumen'))
  },
  {
    path: '/security/user/changeMobile',
    component: asyncComponent(() => import('container/security/user-changeMobile/user-changeMobile'))
  },
  {
    path: '/public/banner',
    component: asyncComponent(() => import('container/public/banner/banner'))
  },
  {
    path: '/public/banner/addedit',
    component: asyncComponent(() => import('container/public/banner-addedit/banner-addedit'))
  },
  {
    path: '/public/time_addedit',
    component: asyncComponent(() => import('container/public/time-addedit/time-addedit'))
  },
  {
    path: '/general/textParam',
    component: asyncComponent(() => import('container/general/text-param/text-param'))
  },
  {
    path: '/general/textParam/addedit',
    component: asyncComponent(() => import('container/general/text-param-addedit/text-param-addedit'))
  },
  {
    path: '/newProj/companyConstruct',
    component: asyncComponent(() => import('container/newProj/companyConstruct/companyConstruct'))
  },
  {
    path: '/newProj/kaoqin',
    component: asyncComponent(() => import('container/newProj/kaoqin/kaoqin'))
  },
  {
    path: '/newProj/bumenConstruct',
    component: asyncComponent(() => import('container/newProj/bumenConstruct/bumenConstruct'))
  },
  {
    path: '/projectManage/project/addBumen/add',
    component: asyncComponent(() => import('container/newProj/addBumen/addBumen'))
  },
  {
    path: '/projectManage/project/edit',
    component: asyncComponent(() => import('container/newProj/project-edit/project-edit'))
  },
  {
    path: '/projectManage/project/addBumen',
    component: asyncComponent(() => import('container/newProj/project-addBumen/project-addBumen'))
  },
  {
    path: '/projectStaff/projectStaff/weekday',
    component: asyncComponent(() => import('container/newProj/project-weekday/project-weekday'))
  },
  {
    path: '/newProj/project/check',
    component: asyncComponent(() => import('container/newProj/project-check/project-check'))
  },
  {
    path: '/projectStaff/projectStaff/quit',
    component: asyncComponent(() => import('container/newProj/project-quit/project-quit'))
  },
  {
    path: '/projectManage/project/check',
    component: asyncComponent(() => import('container/newProj/project-check/project-check'))
  },
  {
    path: '/projectManage/project/end',
    component: asyncComponent(() => import('container/newProj/project-end/project-end'))
  },
  {
    path: '/projectManage/project/stop',
    component: asyncComponent(() => import('container/newProj/project-stop/project-stop'))
  },
  {
    path: '/projectManage/project/leijifaxin',
    component: asyncComponent(() => import('container/newProj/project-leijifaxin/project-leijifaxin'))
  },
  {
    path: '/projectManage/project/kaoqin',
    component: asyncComponent(() => import('container/newProj/project-kaoqin/project-kaoqin'))
  },
  {
    path: '/salary',
    component: asyncComponent(() => import('container/newProj/project-salary/project-salary'))
  },
  {
    path: '/newProj/project/detail',
    component: asyncComponent(() => import('container/newProj/project-detail/project-detail'))
  },
  {
    path: '/projectManage/project/salary/edit',
    component: asyncComponent(() => import('container/newProj/project-salary-edit/project-salary-edit'))
  },
  // {
  //   path: '/projectManage/project/salary/check',
  //   component: asyncComponent(() => import('container/newProj/project-salary-check/project-salary-check'))
  // },
  {
    path: '/projectManage/project/addedit',
    component: asyncComponent(() => import('container/newProj/project-addedit/project-addedit'))
  },
  {
    path: '/projectManage/project/daka',
    component: asyncComponent(() => import('container/newProj/project-daka/project-daka'))
  },
  {
    path: '/yewuManage/account',
    component: asyncComponent(() => import('container/yewuManage/account/account'))
  },
  {
    path: '/yewuManage/account/addedit',
    component: asyncComponent(() => import('container/yewuManage/account-addedit/account-addedit'))
  },
  {
    path: '/hetong/chengbaoshang',
    component: asyncComponent(() => import('container/hetong/chengbaoshang/chengbaoshang'))
  },
  {
    path: '/hetong/chengbaoshang/addedit',
    component: asyncComponent(() => import('container/hetong/chengbaoshang-addedit/chengbaoshang-addedit'))
  },
  {
    path: '/hetong/jindu',
    component: asyncComponent(() => import('container/hetong/jindu/jindu'))
  },
  {
    path: '/hetong/jindu/addedit',
    component: asyncComponent(() => import('container/hetong/jindu-addedit/jindu-addedit'))
  },
  {
    path: '/hetong/wugong',
    component: asyncComponent(() => import('container/hetong/wugong/wugong'))
  },
  {
    path: '/hetong/wugong/addedit',
    component: asyncComponent(() => import('container/hetong/wugong-addedit/wugong-addedit'))
  },
  {
    path: '/hetong/wugong/edit',
    component: asyncComponent(() => import('container/hetong/wugong-edit/wugong-edit'))
  },
  {
    path: '/hetong/wugong/contract',
    component: asyncComponent(() => import('container/hetong/wugong-addedit/wugong-addedit'))
  },
  // {
  //   path: '/people/wugong',
  //   component: asyncComponent(() => import('container/people/wugong/wugong'))
  // },
  // {
  //   path: '/people/wugong/break',
  //   component: asyncComponent(() => import('container/people/wugong-break/wugong-break'))
  // },
  {
    path: '/people/wugong/leave',
    component: asyncComponent(() => import('container/people/wugong-leave/wugong-leave'))
  },
  // {
  //   path: '/people/history',
  //   component: asyncComponent(() => import('container/people/history/history'))
  // },
  {
    path: '/staff/allStaff',
    component: asyncComponent(() => import('container/staff/allStaff/allStaff'))
  },
  {
    path: '/staff/allStaff/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-addedit/allStaff-addedit'))
  },
  {
    path: '/staff/allStaff/leaveRecords',
    component: asyncComponent(() => import('container/staff/allStaff-leaveRecords/allStaff-leaveRecords'))
  },
  {
    path: '/staff/allStaff/skill',
    component: asyncComponent(() => import('container/staff/allStaff-skill/allStaff-skill'))
  },
  {
    path: '/staff/allStaff/skill-addedit',
    component: asyncComponent(() => import('container/staff/skill-addedit/skill-addedit'))
  },
  {
    path: '/staff/idCardQuery',
    component: asyncComponent(() => import('container/staff/idCardQuery/idCardQuery'))
  },
  {
    path: '/staff/allStaffNotice',
    component: asyncComponent(() => import('container/staff/allStaff-notice/allStaff-notice'))
  },
  {
    path: '/staff/allStaffNotice/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-noticeAddedit/allStaff-noticeAddedit'))
  },
  {
    path: '/staff/allStafferror',
    component: asyncComponent(() => import('container/staff/allStaff-error/allStaff-error'))
  },
  {
    path: '/staff/allStafferrHistory',
    component: asyncComponent(() => import('container/staff/allStaff-errHistory/allStaff-errHistory'))
  },
  {
    path: '/staff/allStafferror/history/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-errHistoryAddedit/allStaff-errHistoryAddedit'))
  },
  {
    path: '/staff/allStaff/error/Edit',
    component: asyncComponent(() => import('container/staff/allStaff-errorEdit/allStaff-errorEdit'))
  },
  {
    path: '/staff/error',
    component: asyncComponent(() => import('container/staff/allStaff-error/allStaff-error'))
  },
  {
    path: '/staff/allStaff/error/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-detail/allStaff-detail'))
  },
  {
    path: '/staff/allStafferror/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-errorAddedit/allStaff-errorAddedit'))
  },
  {
    path: '/staff/allStaff/wages',
    component: asyncComponent(() => import('container/staff/allStaff-wages/allStaff-wages'))
  },
  {
    path: '/staff/allStaff/history',
    component: asyncComponent(() => import('container/staff/allStaff-history/allStaff-history'))
  },
  {
    path: '/staff/allStaff/history-detail',
    component: asyncComponent(() => import('container/staff/history-detail/history-detail'))
  },
  {
    path: '/staff/allStaff/history/addedit',
    component: asyncComponent(() => import('container/staff/allStaff-detail/allStaff-detail'))
  },
  {
    path: '/staff/allStaff/detail',
    component: asyncComponent(() => import('container/staff/allStaff-detail/allStaff-detail'))
  },
  {
    path: '/staff/allStaff/leaveRecords-detail',
    component: asyncComponent(() => import('container/staff/leaveRecords-detail/leaveRecords-detail'))
  },
  {
    path: '/staff/bankCard',
    component: asyncComponent(() => import('container/staff/bankCard/bankCard'))
  },
  {
    path: '/staff/bankCard/edit',
    component: asyncComponent(() => import('container/staff/bankCard/bankCard-edit'))
  },
  {
    path: '/staff/bankCard/addedit',
    component: asyncComponent(() => import('container/staff/bankCard-addedit/bankCard-addedit'))
  },
  {
    path: '/staff/jiandang',
    component: asyncComponent(() => import('container/staff/archives/jiandang'))
  },
  {
    path: '/staff/jiandang1',
    component: asyncComponent(() => import('container/staff/archives/jiandang1'))
  },
  {
    path: '/staff/jiandang/mianguanRead',
    component: asyncComponent(() => import('container/staff/archives/mianguanRead'))
  },
  {
    path: '/staff/jiandang/mianguanRead1',
    component: asyncComponent(() => import('container/staff/archives/mianguanRead1'))
  },
  {
    path: '/staff/jiandang/salaryCard',
    component: asyncComponent(() => import('container/staff/archives/salaryCard'))
  },
  {
    path: '/staff/jiandang/luru',
    component: asyncComponent(() => import('container/staff/archives/luru'))
  },
  {
    path: '/staff/jiandang/luru1',
    component: asyncComponent(() => import('container/staff/archives/luru1'))
  },
  {
    path: '/staff/jiandang/luru2',
    component: asyncComponent(() => import('container/staff/archives/luru2'))
  },
  {
    path: '/staff/ruzhiInfo',
    component: asyncComponent(() => import('container/staff/archives/ruzhiInfo'))
  },
  // { path: '/staff/allStaff/addBankCard',
  //   component: asyncComponent(() => import('container/staff/allStaff-addBankCard/allStaff-addBankCard'))
  // },
  {
    path: '/staff/jiandang/idPicture',
    component: asyncComponent(() => import('container/staff/archives/idPicture'))
  },
  {
    path: '/staff/jiandang/idPicture1',
    component: asyncComponent(() => import('container/staff/archives/idPicture1'))
  },
  {
    path: '/staff/jiandang/idPicture2',
    component: asyncComponent(() => import('container/staff/archives/idPicture2'))
  },
  {
    path: '/daifa/daifa',
    component: asyncComponent(() => import('container/daifa/daifa/daifa'))
  },
  {
    path: '/daifa/daifa/addedit',
    component: asyncComponent(() => import('container/daifa/daifa-addedit/daifa-addedit'))
  },
    {
    path: '/daifa/daifa/addedit/edit',
    component: asyncComponent(() => import('container/daifa/daifa-edit/daifa-edit'))
  },
  {
    path: '/newId/bank',
    component: asyncComponent(() => import('container/newId/bank/bank'))
  },
  {
    path: '/newId/operation',
    component: asyncComponent(() => import('container/newId/operation/operation'))
  },
  {
    path: '/newId/operation/addedit',
    component: asyncComponent(() => import('container/newId/operation-addedit/operation-addedit'))
  },
  {
    path: '/newId/bank/addedit',
    component: asyncComponent(() => import('container/newId/bank-addedit/bank-addedit'))
  },
  {
    path: '/newId/yezhu',
    component: asyncComponent(() => import('container/newId/yezhu/yezhu'))
  },
  {
    path: '/newId/yezhu/addedit',
    component: asyncComponent(() => import('container/newId/yezhu-addedit/yezhu-addedit'))
  },
  {
    path: '/newId/supervise',
    component: asyncComponent(() => import('container/newId/supervise/supervise'))
  },
  {
    path: '/newId/companyConstruct',
    component: asyncComponent(() => import('container/newId/companyConstruct1/companyConstruct1'))
  },
  {
    path: 'newId/companyConstruct/addedit',
    component: asyncComponent(() => import('container/newId/addCompany/addCompany'))
  },
  {
    path: '/newId/companyConstruct/addCompany',
    component: asyncComponent(() => import('container/newId/addCompany/addCompany'))
  },
  {
    path: '/newId/supervise/addedit',
    component: asyncComponent(() => import('container/newId/supervise-addedit/supervise-addedit'))
  },
  {
    path: '/projectManage/project',
    component: asyncComponent(() => import('container/dailiManage/map/map3'))
  },
  {
    path: '/projectStaff/projectStaff',
    component: asyncComponent(() => import('container/projectStaff/projectStaff/projectStaff'))
  },
  {
    path: '/projectStaff/projectStaff/addedit',
    component: asyncComponent(() => import('container/projectStaff/projectStaff-addedit/projectStaff-addedit'))
  },
  // {
  //   path: '/projectStaff/projectStaff/addBankCard',
  //   component: asyncComponent(() => import('container/projectStaff/projectStaff-addBankCard/projectStaff-addBankCard'))
  // },
  {
    path: '/projectStaff/addContract',
    component: asyncComponent(() => import('container/projectStaff/projectStaff-addContract/projectStaff-addContract'))
  },
  {
    path: '/waitList/alreadyQuest',
    component: asyncComponent(() => import('container/waitList/alreadyQuest/alreadyQuest'))
  },
  {
    path: '/waitList/alreadyQuest/addedit',
    component: asyncComponent(() => import('container/waitList/alreadyQuest-addedit/alreadyQuest-addedit'))
  }
];

export default ROUTES;
