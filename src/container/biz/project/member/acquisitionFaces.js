import React, {useState, useEffect, useCallback} from 'react';
import { Button, Modal, message } from 'antd';
import {getQueryString, getUserId} from 'common/js/util';
import { UPLOAD_URL, PIC_PREFIX } from 'common/js/config';
import { getQiniuToken } from 'api/general';
import axios from 'axios';
import fetch from 'common/js/fetch';

const code = getQueryString('code');
const styled = {
  fh5: {
    fontSize: '17px',
    fontWeight: 400,
    padding: '5px 0 5px 10px',
    backgroundColor: '#1890ff',
    marginBottom: '20px',
    color: '#fff'
  },
  fh5_sp: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '3px',
    height: '34px',
    marginRight: '5px',
    backgroundColor: '#fff'
  },
  content: {
    marginTop: '30px',
    textAlign: 'center',
    paddingBottom: '30px'
  },
  con_sp: {
    display: 'inline-block',
    width: '300px',
    height: '300px',
    backgroundColor: '#abcdef'
  }
};

export default function AcquisitionFaces() {
  const [visible, setVisible] = useState(false);
  let updateUrl = '';
  let ctxShow = null;
  let upUrl = '';
  let streamTrack = null;
  const [mediaStreamTrack, setMediaStreamTrack] = useState(null);
  const getUserPic = useCallback(() => {
    fetch(631806, {
      userId: getUserId(),
      code
    }).then(data => {
      updateUrl = data.attendancePicture;
      upUrl = data.attendancePicture;
      let picEle = document.getElementById('pic');
      if(!updateUrl.includes('http')) {
        picEle.style.backgroundImage = `url(${PIC_PREFIX}${updateUrl})`;
        picEle.style.backgroundSize = '100% 100%';
      }else {
        picEle.style.backgroundImage = `url(${updateUrl})`;
        picEle.style.backgroundSize = '100% 100%';
      }
    });
  }, []);
  const putb64 = useCallback((basePic, index) => {
    getQiniuToken().then((data) => {
      let pic = basePic.replace(/^.*?base64,/, '');
      axios({
        method: 'post',
        url: UPLOAD_URL + '/putb64/-1',
        data: pic,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': 'UpToken ' + data.uploadToken
        }
      }).then(upData => {
        const url = upData.data.hash;
        upUrl = url;
      });
    }).catch(() => this.setState({ fetching: false }));
  }, []);
  const takePhoto = useCallback(() => {
    const doc = document;
    // 获得Canvas对象
    let video = doc.getElementById('video');
    let canvasShow = doc.getElementById('canvasShow');
    const ctx = canvasShow.getContext('2d');
    ctxShow = ctx;
    ctx.drawImage(video, 0, 0, 300, 300);
    const dataUrl = canvasShow.toDataURL();
    updateUrl = dataUrl;
    putb64(dataUrl);
  }, []);
  const getMedia = useCallback(() => {
    const hasMsg = message.loading('');
    setTimeout(() => {
      hasMsg();
      let constraints = {
        video: {width: 500, height: 500},
        audio: true
      };
      // 获得video摄像头区域
      let video = document.getElementById('video');
      // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
      // 避免数据没有获取到
      let promise = navigator.mediaDevices.getUserMedia(constraints);
      promise.then((MediaStream) => {
        setMediaStreamTrack(MediaStream);
        streamTrack = MediaStream;
        video.srcObject = MediaStream;
        video.play();
      });
    }, 400);
  }, []);
  const showModal = useCallback(() => {
    setVisible(true);
    getMedia();
  }, []);
  const sendPic = useCallback(() => {
    const hasMsg = message.loading('');
    if(!upUrl) {
      message.warning('请先进行拍照上传');
      return;
    }
    fetch(631794, {
      code,
      attendancePicture: upUrl
    }).then(() => {
      hasMsg();
      message.success('操作成功', 1, () => {
        window.history.go(-1);
      });
    }, hasMsg);
  }, []);
  const handleOk = useCallback(() => {
    if(!updateUrl) {
      message.warning('请选择拍照后操作', 1.5);
      return;
    }
    let picEle = document.getElementById('pic');
    picEle.style.backgroundImage = `url(${updateUrl})`;
    picEle.style.backgroundSize = '100% 100%';
    setVisible(false);
    ctxShow.clearRect(0, 0, 500, 500);
    streamTrack.getTracks().forEach(function (track) {
      track.stop();
    });
  }, []);
  const handleCancel = useCallback(() => {
    setVisible(false);
    if(ctxShow) {
      ctxShow.clearRect(0, 0, 500, 500);
    }
    streamTrack.getTracks().forEach(function (track) {
      track.stop();
    });
  }, []);
  useEffect(() => {
    getUserPic();
  }, []);
  return (
    <div>
      <h5 style={styled.fh5}><span style={styled.fh5_sp}></span> 人脸采集</h5>
      <div><Button type='primary' onClick={() => {
        showModal();
      }}>打开摄像头</Button></div>
      <div style={styled.content}>
        <span id="pic" style={styled.con_sp}></span>
      </div>
      <div style={{'paddingBottom': '40px', 'paddingLeft': '100px'}}>
        <Button type='primary' onClick={() => {
          sendPic();
        }} style={{'marginRight': '30px'}}>保存</Button>
        <Button onClick={() => {
          window.history.go(-1);
        }}>返回</Button>
      </div>
      <Modal
        width={1000}
        visible={visible}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确认
          </Button>
        ]}
      >
        <div>
          <div style={{'display': 'flex'}}>
            <div>
              <video id="video" width="500px" height="500px" muted="muted">您的浏览器不支持拍照上传功能</video>
            </div>
            <div>
              <canvas id="canvasShow" width="300px" height="300px" style={{'marginLeft': '100px'}}></canvas>
            </div>
          </div>
          <div>
            <Button onClick={() => {
              takePhoto();
            }} style={{'marginLeft': '10px'}}>拍照</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}