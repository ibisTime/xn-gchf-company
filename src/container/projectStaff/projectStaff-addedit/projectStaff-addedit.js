import React from 'react';
import { getQueryString, showSucMsg, formatDate, getUserKind, formatImg, moneyFormat } from 'common/js/util';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail, query1, getEmploy, getEmployContract, getEmployContractList } from 'api/user';
import { getDict } from 'api/dict';
import { queryStaffByCode } from 'api/company';
import { Spin } from 'antd';
import ShowContractMore from '../../../component/showContractMore/showContractMore';
import './projectStaff-addedit.css';

class ProjectStaffAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      idInfo: '',
      employInfo: '',
      staffType: null,
      contractPic: [], // 分页查合同
      contractMore: false,
      contracts: [], // 列表查合同,
      projectCodeList: []
    };
    this.code = getQueryString('code', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    this.setState({ fetching: true });
    Promise.all([
      queryStaffByCode({ code: this.staffCode }),
      getEmploy(this.code),
      getDict('staff_type'),
      getEmployContract({code: this.code}),
      getUserDetail(getUserId())
    ]).then(([idInfo, employInfo, staffType, contractPic, userInfo]) => {
      this.setState({ fetching: false });
      let staffTypeObj = {};
      staffType.map((item) => {
        staffTypeObj[item.dkey] = item.dvalue;
      });
      let contractPicArr = contractPic.list.length ? contractPic.list.map(item => item.contentPicList) : [];
      this.setState({
        idInfo,
        employInfo,
        staffType: staffTypeObj,
        contractPic: contractPicArr[0]
      });
      getEmployContractList({code: this.code, projectCode: userInfo.projectCode}).then((res) => {
        let contractsArr = res.length ? res.map(item => item.contentPicList) : [];
        this.setState({ contracts: contractsArr[0] });
      });
    });
  }
  showHetongMore = (boolean) => {
    this.setState({ contractMore: boolean });
  };
  render() {
    let { idInfo, staffType, employInfo, contractPic, contractMore, contracts } = this.state;
    return (
        <Spin spinning={this.state.fetching}>
          <div>
            <div className="detail-title"><i></i><span>详情</span></div>
            <div className="detail-out">
              <div className="four">
                <div className="face">
                  <div className="four-title"><span>人脸采集照片</span></div>
                  <img src={formatImg(idInfo.pict1)} alt="" className="face-img"/>
                </div>
                <div className="hold">
                  <div className="four-title"><span>手持证件照片</span></div>
                  <img src={formatImg(idInfo.pict4)} alt="" className="hold-img"/>
                </div>
                <div className="front">
                  <div className="four-title"><span>身份证正面</span></div>
                  <img src={formatImg(idInfo.pict2)} alt="" className="front-img"/>
                </div>
                <div className="back">
                  <div className="four-title"><span>身份证反面</span></div>
                  <img src={formatImg(idInfo.pict3)} alt="" className="back-img"/>
                </div>
              </div>
              <div className="hetong" onClick={ () => { contractPic.length && this.showHetongMore(true); } }>
                <div className="hetong-title"><span>用工合同</span></div>
                <img src={contractPic && formatImg(contractPic[0])} alt="" className="hetong-img"
                     style={{ display: contractPic && contractPic.length ? 'inline-block' : 'none' }}/>
                <div className="hetong-img" style={{ display: contractPic && contractPic.length ? 'none' : 'inline-block' }}>暂无合同</div>
              </div>
              <div className="idInfo">
                <span className="detail-id-title">身份证信息采集</span>
                <p className="id-info">姓名：{idInfo.name}</p>
                <p className="id-info">性别：{idInfo.sex}</p>
                <p className="id-info">民族：{idInfo.idNation}</p>
                <p className="id-info">出生日期：{formatDate(idInfo.birthday)}</p>
                <p className="id-info">身份证号码：{idInfo.idNo}</p>
                <p className="id-info">地址：{idInfo.idAddress}</p>
                <p className="id-info">有效期开始日：{formatDate(idInfo.idStartDate)}</p>
                <p className="id-info">有效期截止日：{formatDate(idInfo.idEndDate)}</p>
                <p className="id-info">签发机关：{idInfo.idPolice}</p>
              </div>
              <div className="professionInfo">
                <span className="profession-title">入职信息</span>
                <p className="profession-info">部门：{employInfo.departmentName}</p>
                <p className="profession-info">部门负责人：{employInfo.departmentLeader}</p>
                <p className="profession-info">日薪：{moneyFormat(employInfo.salary)}/天</p>
                <p className="profession-info">扣薪：{moneyFormat(employInfo.cutAmount)}/小时</p>
                <p className="profession-info">入职时间：{formatDate(employInfo.joinDatetime)}</p>
                <p className="profession-info">员工来源：{staffType ? staffType[employInfo.type] : ''}</p>
                <p className="profession-info">联系方式：{employInfo.staff ? employInfo.staff.mobile : ''}</p>
                <p className="profession-info">紧急联系人：{employInfo.staff ? employInfo.staff.contacts : ''}</p>
                <p className="profession-info" style={{ marginBottom: '20px' }}>
                  紧急联系人联系方式：{employInfo.staff ? employInfo.staff.contactsMobile : ''}</p>
                <span className="profession-title">工资卡</span>
                <p className="profession-info">开户行：{employInfo.bankCard ? employInfo.bankCard.bankSubbranchName : ''}</p>
                <p className="profession-info">卡号：{employInfo.bankCard ? employInfo.bankCard.bankcardNumber : ''}</p>
              </div>
            </div>
            <ShowContractMore contractMoreVisible={contractMore}
                              employCode={this.code}
                              contracts={contracts}
                              setContractMoreVisible={this.showHetongMore}
            />
          </div>
        </Spin>
    );
  }
}

export default ProjectStaffAddedit;
