import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class BankAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.bCode = getQueryString('bcode', this.props.location.search);
    this.code = getQueryString('code', this.props.location.search);
    this.type = getQueryString('type', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    let fields = [{
      field: 'bankCode',
      title: '银行名称',
      key: 'bank_code',
      type: 'select',
      required: true
    }, {
      title: '银行支行名称',
      field: 'subranch',
      required: true
    }, {
      title: '银行卡号',
      field: 'bankNumber',
      required: true,
      bankCard: true
    }, {
      title: '银行联号',
      field: 'bankLinkNumber',
      required: true
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }, {
      field: 'businessType',
      value: this.type,
      hidden: true
    }];
    // type 001 参建单位、002 人员
    // 建档进入的
    if (this.type === '001') {
      // 新增
      if (!this.code) {
        fields.push({
          field: 'businessSysNo',
          value: this.bCode,
          hidden: true
        });
      // 修改、详情
      } else {
        fields.push({
          field: 'businessSysNo',
          hidden: true
        });
      }
    // 人员进入的或者直接通过银行卡菜单进入的
    } else {
      // 说明通过人员档案添加银行卡进入
      if (this.bCode) {
        if (!this.code) {
          fields.push({
            field: 'businessSysNo',
            value: this.bCode,
            hidden: true
          });
        // 修改、详情
        } else {
          fields.push({
            field: 'businessSysNo',
            hidden: true
          });
        }
      // 通过银行卡菜单进入的
      } else {
        if (!this.code) {
          fields.unshift({
            title: '人员编号',
            field: 'businessSysNo',
            type: 'select',
            pageCode: '631605',
            keyName: 'code',
            valueName: '{{projectName.DATA}}-{{teamName.DATA}}-{{workerName.DATA}}-{{idcardNumber.DATA}}',
            searchName: 'workerName',
            params: { userId: getUserId() },
            require: true,
            formatter(v, d) {
              if(v) {
                return `${d.projectName ? d.projectName : ''}-${d.teamName ? d.teamName : ''}-${d.workerName ? d.workerName : ''}-${d.idcardNumber ? d.idcardNumber : ''}`;
              }else {
                return '';
              }
            }
          });
        } else {
          if (!this.view) {
            fields.unshift({
              field: 'businessSysNo',
              hidden: true
            });
          }
          fields.unshift({
            title: '人员编号',
            field: 'businessSysNo1',
            _keys: ['businessSysNo'],
            type: 'select',
            pageCode: '631605',
            keyName: 'code',
            valueName: '{{projectName.DATA}}-{{teamName.DATA}}-{{workerName.DATA}}-{{idcardNumber.DATA}}',
            searchName: 'workerName',
            params: { userId: getUserId() },
            require: true,
            formatter(v, d) {
              if(v) {
                return `${d.projectName ? d.projectName : ''}-${d.teamName ? d.teamName : ''}-${d.workerName ? d.workerName : ''}-${d.idcardNumber ? d.idcardNumber : ''}`;
              }else {
                return '';
              }
            }
          });
        }
      }
    }
    return this.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631766,
      addCode: 631750,
      editCode: 631752,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default BankAddEdit;
