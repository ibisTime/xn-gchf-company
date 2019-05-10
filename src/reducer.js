import { combineReducers } from 'redux';
import { user } from './redux/user';
import { menu } from './redux/menu';
import { modalDetail } from './redux/modal/build-modal-detail';
import { securityRole } from './redux/security/role';
import { securityRoleAddEdit } from './redux/security/role-addedit';
import { securityMenu } from './redux/security/menu';
import { securityMenuAddEdit } from './redux/security/menu-addedit';
import { securityUser } from './redux/security/user';
import { securityUserAddEdit } from './redux/security/user-addedit';
import { securityUserResetPwd } from './redux/security/user-resetPwd';
import { securityUserSetRole } from './redux/security/user-setRole';
import { securitySysParam } from './redux/security/sysParam';
import { securitySysparamAddEdit } from './redux/security/sysParam-addedit';
import { securityUserChangeMobile } from './redux/security/user-changeMobile';
import { securityDict } from './redux/security/dict';
import { securityDictAddEdit } from './redux/security/dict-addedit';
import { staffAllStaff } from './redux/staff/allStaff';
import { staffAllStaffAddEdit } from './redux/staff/allStaff-addedit';
import { jiandangStep2 } from './redux/staff/jiandang-step2';
import { jiandangStep3 } from './redux/staff/jiandang-step3';
import { bizBank } from './redux/biz/bank';
import { wisdomBrakeMachine } from './redux/biz/wisdom/brakeMachine';
import { wisdomBrakeMachinePer } from './redux/biz/wisdom/brakeMachine_per';
import { projectOutInto } from '../../xn-gchf-company/src/redux/biz/project/outInto';
// 项目管理
import { projectParticipating } from './redux/biz/project/participating';
import { projectClass } from './redux/biz/project/class';
import { projectMember } from './redux/biz/project/member';
import { projectInout } from './redux/biz/project/inout';
import { projectMemContract } from './redux/biz/project/memcontract';
import { projectAttence } from './redux/biz/project/attence';
import { projectWages } from './redux/biz/project/wages';
import { projectBasic } from './redux/biz/project/basic';
import { companyInfo } from './redux/biz/company/info';

export default combineReducers({
  user,
  menu,
  modalDetail,
  securityRole,
  securityRoleAddEdit,
  securityMenu,
  securityMenuAddEdit,
  securityUser,
  securityUserAddEdit,
  securityUserSetRole,
  securityUserResetPwd,
  securitySysParam,
  securitySysparamAddEdit,
  securityUserChangeMobile,
  securityDict,
  securityDictAddEdit,
  staffAllStaff,
  staffAllStaffAddEdit,
  jiandangStep2,
  jiandangStep3,
  bizBank,
  projectParticipating,
  projectClass,
  projectMember,
  projectInout,
  projectMemContract,
  projectAttence,
  projectWages,
  projectBasic,
  companyInfo,
  wisdomBrakeMachine,
  wisdomBrakeMachinePer,
  projectOutInto
});
