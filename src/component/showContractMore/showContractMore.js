import React from 'react';
import { getUserId, showSucMsg, showWarnMsg } from 'common/js/util';
import { Form, Carousel } from 'antd';
import { popUpLayout } from 'common/js/config';
import './showContractMore.css';
import {formatImg} from '../../common/js/util';
import close from './../contactWithUs/close.png';

class ShowContractMore extends React.Component {
  constructor(props) {
    super(props);
    this.text = 'https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg';
    this.state = {
      projectCode: ''
    };
  }
  render() {
    return (
        <div className="modal-out ant-modal-mask" style={{ display: this.props.contractMoreVisible ? 'block' : 'none' }}>
          <div className="my-modal-pop-up">
            <div className="closeContractMore" onClick={(e) => { this.props.setContractMoreVisible(false, event); }}><img src={close} alt=""/></div>
            <div className="content">
              {
                this.props.contracts && this.props.contracts.map((item) => {
                  return (
                      <img src={formatImg(item)} alt="" key={item} className="showContractMore-contacts"/>
                  );
                })
              }
            </div>
          </div>
        </div>
    );
  }
}
//
// ReactDOM.render(<App />, mountNode);

export default Form.create()(ShowContractMore);
