// 2024-01-14 18:15

const url = $request.url;
if (!$response.body) $done({});
const isMG = url.includes("mgtv.com/");
let obj = JSON.parse($response.body);

if (isMG) {
  if (url.includes("/dynamic/v1/channel/index/")) {
    // 芒果 首页信息流
    if (obj?.adInfo) {
      delete obj.adInfo;
    }
    if (obj?.data?.length > 0) {
      let newItems = [];
      for (let item of obj.data) {
        // 908热剧轮播
        if (item?.moduleEntityId === "91") {
          // 首页正在追模块
          if (item?.DSLList?.length > 0) {
            let newLists = [];
            for (let i of item.DSLList) {
              if (i?.data?.items?.length > 0) {
                let newII = [];
                for (let ii of i.data.items) {
                  if (ii?.id === 0) {
                    // 正在追模块 艺人周边 小芒
                    continue;
                  } else if (["热门", "推荐"]?.includes(ii?.cornerTitle)) {
                    continue;
                  } else {
                    newII.push(ii);
                  }
                }
                i.data.items = newII;
                newLists.push(i);
              } else {
                newLists.push(i);
              }
            }
            item.DSLList = newLists;
            newItems.push(item);
          } else {
            newItems.push(item);
          }
        } else if (["842", "2237", "5418"]?.includes(item?.moduleEntityId)) {
          // 842会员首月特惠 2237横版购物tab 5418横版推广图片
          continue;
        } else {
          newItems.push(item);
        }
      }
      obj.data = newItems;
    }
    if (obj?.moduleIDS?.length > 0) {
      obj.moduleIDS = obj.moduleIDS.filter((i) => !["842", "2237", "5418"]?.includes(i?.moduleEntityId));
    }
  } else if (url.includes("/dynamic/v1/channel/vrsList/")) {
    // 芒果 顶部tab
    if (obj?.data?.length > 0) {
      let newItems = [];
      for (let item of obj.data) {
        if (item?.vclassId > 100033 && item?.vclassId !== 100160) {
          // 100033热门 100043短剧 100160会员频道精选 100308短视频
          continue;
        } else {
          newItems.push(item);
        }
      }
      obj.data = newItems;
    }
  } else if (url.includes("/mobile/config?")) {
    // 芒果 底部tab
    const items = [
      "XmVideoB",
      "XmsellSwitch",
      "damang_duanju_tab",
      "damang_tab",
      "dc_adConfig",
      "relative_ads",
      "second_floor_guide_switch"
    ];
    for (let i of items) {
      if (obj?.data?.[i]) {
        obj.data[i] = "0";
      }
    }
    if (obj?.data?.XmFsLvlCatAddr) {
      obj.data.XmFsLvlCatAddr = "";
    }
  } else if (url.includes("/mobile/recommend/v2?")) {
    // 芒果 搜索框填充词
    if (obj?.data?.default) {
      obj.data.default = { 0: ["搜索内容"] };
    }
    if (obj?.data?.recommend) {
      obj.data.recommend = [];
    }
    if (obj?.data?.interval) {
      obj.data.interval = 1000;
    }
  } else if (url.includes("/odin/c1/channel/index?")) {
    // 芒果 首页信息流
    if (obj?.data?.length > 0) {
      let newItems = [];
      for (let item of obj.data) {
        if (item?.moduleType === "childslideicon") {
          // 横版按钮
          continue;
        } else {
          newItems.push(item);
        }
      }
      obj.data = newItems;
    }
  } else if (url.includes("/v1/vod/info?")) {
    // 芒果 播放页详情页组件
    if (obj?.data?.config?.ad) {
      // 播放广告
      obj.data.config.ad.wmShowTime = 0;
    }
    if (obj?.data?.config?.videoRcMod) {
      // 播放弹窗
      obj.data.config.videoRcMod.toastStatus = 0;
      obj.data.config.videoRcMod.toastTime = 0;
    }
    if (obj?.data?.tabs?.length > 0) {
      // 播放标签页 1视频 2讨论
      obj.data.tabs = obj.data.tabs.filter((i) => ["1", "2"]?.includes(i?.type));
    }
    if (obj?.data?.template?.modules?.length > 0) {
      // 播放页组件
      // 101简介 102点赞评论收藏 201正片列表 205会员衍生模块 206音频有声剧
      // 202精彩短片 203精选特辑 301热门内容 601周边大放送 701通栏广告 702大风车浮层广告
      let newMods = [];
      for (let item of obj.data.template.modules) {
        if ([202, 203, 301, 601, 701, 702]?.includes(item?.dataType)) {
          continue;
        } else {
          if (item?.clipInfo?.rcInfo) {
            // 播放界面推荐语
            delete item.clipInfo.rcInfo;
          }
          newMods.push(item);
        }
      }
      obj.data.template.modules = newMods;
    }
    if (obj?.data?.template?.theme) {
      // 播放页主题皮肤
      delete obj.data.template.theme;
    }
  } else if (url.includes("/v3/module/list?")) {
    // 芒果 我的页面组件
    if (obj?.data?.list?.length > 0) {
      let newList = [];
      for (let item of obj.data.list) {
        // 1顶部模块 扫一扫 消息 搜索 设置
        // 2用户信息模块 芒果卡 个人信息
        // 3推荐位模块 购买会员 会员周边
        // 4用户内容模块 播放记录 追更
        // 5大芒计划 创作中心 热门作品 征稿活动
        // 5我的小芒 电商 订单
        // 6banner图模块 广告轮播图
        // 7我的服务 客服 皮肤 意见反馈
        // 8运营商专区 芒果卡 免流
        // 8兴趣中心 抓娃娃
        // 8推荐功能 钱包 福袋 芒果公益
        if ([3, 5, 6, 8]?.includes(item?.moduleType)) {
          // 推广模块
          continue;
        } else if (item?.moduleType === 2 && item?.title === "用户信息模块") {
          // 用户信息
          if (item?.data?.length > 0) {
            let newItems = [];
            for (let i of item.data) {
              if (["领取芒果卡权益", "签到赢积分"]?.includes(i?.title)) {
                continue;
              } else {
                newItems.push(i);
              }
            }
            item.data = newItems;
            newList.push(item);
          } else {
            newList.push(item);
          }
        } else if (item?.moduleType === 7 && item?.title === "我的服务") {
          // 我的服务
          if (item?.data?.length > 0) {
            let newItems = [];
            for (let i of item.data) {
              if (["功能实验室", "芒果壁纸", "我的音乐"]?.includes(i?.title)) {
                continue;
              } else {
                newItems.push(i);
              }
            }
            item.data = newItems;
            newList.push(item);
          } else {
            newList.push(item);
          }
        } else {
          newList.push(item);
        }
      }
      obj.data.list = newList;
    }
  } else if (url.includes("/v10/video/info?")) {
    // 芒果 播放详情页组件
    if (obj?.data?.categoryList?.length > 0) {
      // 1正片 2花絮片段 6设备信息 7未知 8看了还会看 9精华打包 10未知 14vip
      // 15未知 17周边大放送 18未知 20出品人 22未知 30未知 31系列推荐
      // 35音乐fm入口 36为你推荐 37音乐fm入口
      obj.data.categoryList = obj.data.categoryList.filter((i) => ![2, 8, 9, 14, 17]?.includes(i?.dataType));
    }
  }
} 

$done({ body: JSON.stringify(obj) });
