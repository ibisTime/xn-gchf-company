import fetch from 'common/js/fetch';
import { showWarnMsg, getUserId, showConfirm, showSucMsg } from 'common/js/util';

export function showUploadConfirm(keys, items, getPageData, doFetching,
                                  cancelFetching, bizCode,
                                  wranMsg = '选择的记录中包含已上传的数据',
                                  titleMsg = '您确定要上传选中的记录吗',
                                  contentMsg = '上传成功后，需要等待几分钟。国家平台最终反馈回来的结果有可能会上传失败。如果失败，可以到详细页面查看操作日志里的失败原因。',
                                  type) {
  if (!checkUploadStatus(items, type)) {
    showWarnMsg(wranMsg);
    return false;
  } else {
    const PARAMS = {
      userId: getUserId(),
      codeList: keys
    };
    showConfirm({
      title: titleMsg,
      content: contentMsg,
      onOk: () => {
        doFetching();
        fetch(bizCode, PARAMS).then(() => {
          showSucMsg('操作成功');
          getPageData();
        }).catch(cancelFetching);
      }
    });
  }
}

function checkUploadStatus(list, type) {
  let arr = [];
  if(type) {
    arr = list.filter(l => l.uploadStatus === '0');
  }else {
    arr = list.filter(l => l.uploadStatus !== '0' && l.uploadStatus !== '-1');
  }
  return !arr.length;
}
