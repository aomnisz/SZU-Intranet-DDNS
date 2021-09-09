// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const axios = require('axios');
const DnspodClient = require("tencentcloud-sdk-nodejs").dnspod.v20210323.Client;
const config = require('./config');

const client = new DnspodClient({
  credential: config.credential,
  region: "",
  profile: {
    httpProfile: {
      endpoint: "dnspod.tencentcloudapi.com",
    },
  },
});

const ddns = async () => {
  // 获取解析记录列表
  let recordList;
  try {
    const res = await client.DescribeRecordList({ Domain: config.domain });
    recordList = res.RecordList;
  } catch (err) {
    console.error(err.message);
    return;
  }

  // 检查解析记录是否存在，不存在则退出
  const targetRecord = recordList.filter(item => item.Name === config.subDomain)[0];
  if (!targetRecord) {
    // 可以支持新增记录。TO 以后想 DO 就 DO，大概率是不想的了。。
    console.log('无此记录，请先新增。');
    return;
  }

  // 获取现在的 IP
  let nowIP;
  try {
    const res = await axios.get('https://www1.szu.edu.cn/nc/');
    nowIP = res.data.match(/172.(?:[0-9]+\.){2}[0-9]+/)[0];
  } catch (err) {
    console.error(err);
    return;
  }

  // 检查原纪录与现记录的 IP 是否相同，相同则退出
  if (targetRecord.Value === nowIP) {
    console.log(`解析记录未发生改变，原记录 = 现记录 = ${nowIP}`);
    return;
  }

  // 修改解析记录
  console.log(`准备修改 ${config.subDomain}.${config.domain} 解析记录：${targetRecord.Value} => ${nowIP}`);
  try {
    await client.ModifyRecord({
      Domain: config.domain,
      SubDomain: config.subDomain,
      Value: nowIP,
      // DomainId: 0, // 优先级比参数 Domain 高，但作用同 Domain ，所以懒得发 API 查了。
      MX: targetRecord.MX,
      TTL: targetRecord.TTL,
      Weight: targetRecord.Weight,
      Status: targetRecord.Status,
      RecordId: targetRecord.RecordId,
      RecordType: targetRecord.Type,
      RecordLine: targetRecord.Line,
      RecordLineId: targetRecord.LineId,
    });
    console.log('修改记录成功！');
  } catch (err) {
    console.error(err.message);
  }
}

ddns();
setInterval(ddns, 600 * 1000);
