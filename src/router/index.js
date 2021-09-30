import Vue from 'vue'
import Router from 'vue-router'
import store from "../vuex/store";

const Main = () => import(/* webpackChunkName: "main" */ '../components/view/main/Main');

const Home = () => import(/* webpackChunkName: "home" */ '../components/view/home/index');
const HomeInterest = () => import(/* webpackChunkName: "HomeInterest" */ '../components/view/home/inter/interest.vue');
const HomeTaste = () => import(/* webpackChunkName: "HomeTaste" */ '../components/view/home/taste/taste.vue');
const HomeProfitRate = () => import(/* webpackChunkName: "HomeProfitRate" */ '../components/view/home/profitRate.vue');
const HomeInfo = () => import(/* webpackChunkName: "HomeInfo" */ '../components/view/home/info.vue');

const Intro = () => import(/* webpackChunkName: "intro" */ '../components/view/intro/Intro');
const IntroService = () => import(/* webpackChunkName: "intro" */ '../components/view/intro/Service');

const AutoTrading = () => import(/* webpackChunkName: "AutoTrading" */ '../components/view/auto/Index');
const AutoTradingMain = () => import(/* webpackChunkName: "AutoTrading" */ '../components/view/auto/Trading');
const AutoTradingAvailStraDetail = () => import(/* webpackChunkName: "AutoTrading" */ '../components/view/auto/TradingAvailStraDetail');
const AutoTradingRunningStraDetail = () => import(/* webpackChunkName: "AutoTrading" */ '../components/view/auto/TradingRunningStraDetail');
const AutoTradingHistory = () => import(/* webpackChunkName: "AutoTrading" */ '../components/view/auto/TradingHistory');

const TimeLine = () => import(/* webpackChunkName: "TimeLine" */ '../components/view/timeLine');
const TimeLineNotice = () => import(/* webpackChunkName: "TimeLine" */ '../components/view/timeLine/notice.vue');
const TimeLinePush = () => import(/* webpackChunkName: "TimeLine" */ '../components/view/timeLine/push.vue');
const TimeLineView = () => import(/* webpackChunkName: "TimeLine" */ '../components/view/timeLine/view.vue');

const Sise = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise');
const SiseList = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise/list');
const SisePrice = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise/price');
const SiseChart = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise/chart');
const SiseDiag = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise/diag/diagnosis');
const SiseComp = () => import(/* webpackChunkName: "Sise" */ '../components/view/sise/compare');

const Profile = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/Index');
const ProfileMain = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/Profile');
const ProfileInfo = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/Index');
const ProfileInfoMain = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/ProfileInfo');
const ProfileInfoPassword = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/ModifyPassword');
const ProfileInfoEmail = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/ModifyEmail');
const ProfileInfoImageNick = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/ModifyImageNick');
const ProfileInfoEtc = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/ProfileEtc');
const ProfileInfoDrop = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/info/DropUser');
const ProfileApi = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/api/Index');
const ProfileApiMain = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/api/Api');
const ProfileApiRegister = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/api/ApiRegister');
const ProfilePoint = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/Index');
const ProfilePointMain = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/Point');
const ProfilePointConvert = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/PointConvert');
const ProfilePointRecharge = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/PointRecharge');
const ProfilePointFee = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/PointFee');
const ProfilePointEtc = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/point/PointEtc');
const ProfileNotice = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/notice/Index');
const ProfileNoticeMain = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/notice/NoticeList');
const ProfileNoticeSetting = () => import(/* webpackChunkName: "profile" */ '../components/view/profile/notice/NoticeSetting');
const ProfileFaq = () => import(/* webpackChunkName: "cs" */ '../components/view/profile/Faq/Index');
const ProfileQnA = () => import(/* webpackChunkName: "cs" */ '../components/view/profile/qna/Index');
const ProfileQnAList = () => import(/* webpackChunkName: "cs" */ '../components/view/profile/qna/List');
const ProfileQnAView = () => import(/* webpackChunkName: "cs" */ '../components/view/profile/qna/View');
const ProfileQnAWrite = () => import(/* webpackChunkName: "cs" */ '../components/view/profile/qna/Write');

const Registration = () => import(/* webpackChunkName: "etc" */ '../components/view/member/Registration.vue');
const IdpwFind = () => import(/* webpackChunkName: "etc" */ '../components/view/member/IdpwFind.vue');

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

const checkLogin = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    next();
  } else {
    store.commit("setNeedLogin", true);
    store.commit("setLoginCallbackUrl", to.fullPath);
  }
};

const checkLogout = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    next("/home/interest");
  } else {
    next();
  }
};

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,     
      hidden: true,
      children: [   
        {
          path: 'interest',
          component: HomeInterest,
          name: 'HomeInterest',
          hidden: true,
        },  
        {
          path: 'taste',
          component: HomeTaste,
          name: 'HomeTaste',
          hidden: true,
        },
        {
          path: 'profitRate',
          component: HomeProfitRate,
          name: 'HomeProfitRate',
          hidden: true
        },
        {
          path: 'info',
          component: HomeInfo,
          name: 'HomeInfo',
          hidden: true
        },
      ]
    },    
    {
      path: '/view',
      name: 'MobileMain',
      component: Main,
      hidden: true
    },
    {
      path: '/registration',
      component: Registration,
      name: 'registration',
      beforeEnter: checkLogout,
      hidden: true
    },
    {
      path: '/idpwfind',
      component: IdpwFind,
      name: 'idpwfind',
      beforeEnter: checkLogout,
      hidden: true
    },
    {
      path: '/intro',
      name: 'Intro',
      component: Intro,
      hidden: true,
      children: [       
        {
          path: 'service',
          name: 'IntroService',
          component: IntroService,
          hidden: true
        }
      ]
    },
    {
      path: '/auto',
      name: 'AutoTrading',
      component: AutoTrading,
      hidden: true,
      children: [     
        {
          path: 'Trading',
          name: 'AutoTradingMain',
          component: AutoTradingMain,
          hidden: true
        },
        {
          path: 'TradingAvailStraDetail',
          name: 'AutoTradingAvailStraDetail',
          component: AutoTradingAvailStraDetail,
          hidden: true
        },
        {
          path: 'TradingRunningStraDetail',
          name: 'AutoTradingRunningStraDetail',
          component: AutoTradingRunningStraDetail,
          hidden: true
        },
        {
          path: 'autoTradingHistory',
          name: 'AutoTradingHistory',
          component: AutoTradingHistory,
          hidden: true
        }                          
      ]
    }, 
    {
      path: '/timeLine',
      component: TimeLine,
      name: 'TimeLine',     
      hidden: true,
      children: [     
        {
          path: 'notice',
          component: TimeLineNotice,
          name: 'TimeLineNotice',
          hidden: true,
        },
        {
          path: 'push',
          component: TimeLinePush,
          beforeEnter: checkLogin,
          name: 'TimeLinePush',
          hidden: true
        },
      ]
    },
    {
      path: '/timeLine/view',
      component: TimeLineView,
      name: 'TimeLineView',
      hidden: true,
    },
    {
      path: '/sise',
      component: Sise,
      name: 'Sise',
      children: [
        {
          path: 'list',
          name: 'SiseList',
          component: SiseList,
        },
        {
          path: 'diagnosis',
          name: 'SiseDiag',
          component: SiseDiag,
        },
        {
          path: 'compare',
          name: 'SiseComp',
          component: SiseComp,
        }
      ]
    },
    {
      path: '/sise/price',
      name: 'SisePrice',
      component: SisePrice,
      hidden: true,
    },
    {
      path: '/sise/chart',
      name: 'SiseChart',
      component: SiseChart,
      hidden: true,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: checkLogin,
      hidden: true ,
      children: [    
        {
          path: 'main',
          component: ProfileMain,
          name: 'ProfileMain',
          hidden: true
        },       
        {
          path: 'info',
          component: ProfileInfo,
          name: 'ProfileInfo',
          hidden: true,
          children: [    
            {
              path: 'main',
              component: ProfileInfoMain,
              name: 'ProfileInfoMain',
              hidden: true
            },
            {   
              path: 'infoPassword',
              name: 'ProfileInfoPassword',
              component: ProfileInfoPassword,
              hidden: true      
            },
            {
              path: 'infoEmail',     
              name: 'ProfileInfoEmail',
              component: ProfileInfoEmail,
              hidden: true
            },
            {
              path: 'infoImageNick',     
              name: 'ProfileInfoImageNick',
              component: ProfileInfoImageNick,
              hidden: true
            },
            {
              path: 'etc',
              component: ProfileInfoEtc,
              name: 'ProfileInfoEtc',
              hidden: true
            },
            {
              path: 'drop',
              component: ProfileInfoDrop,
              name: 'ProfileInfoDrop',
              hidden: true
            }    
            
          ]
        },  

        {
          path: 'api',
          component: ProfileApi,
          name: 'ProfileApi',
          hidden: true,
          children: [    
            {
              path: 'api',
              component: ProfileApiMain,
              name: 'ProfileApiMain',
              hidden: true
            },
            {   
              path: 'apiRegister',
              name: 'ProfileApiRegister',
              component: ProfileApiRegister,
              hidden: true      
            }
          ]
        },        
        {
          path: 'point',
          name: 'ProfilePoint',
          component: ProfilePoint,
          hidden: true,
          children: [    
            {
              path: 'point',
              component: ProfilePointMain,
              name: 'ProfilePointMain',
              hidden: true
            },           
            {   
              path: 'pointRecharge',
              name: 'ProfilePointRecharge',
              component: ProfilePointRecharge,
              hidden: true      
            },
            {   
              path: 'pointConvert',
              name: 'ProfilePointConvert',
              component: ProfilePointConvert,
              hidden: true      
            },
            {   
              path: 'pointFee',
              name: 'ProfilePointFee',
              component: ProfilePointFee,
              hidden: true      
            },
            {   
              path: 'pointEtc',
              name: 'ProfilePointEtc',
              component: ProfilePointEtc,
              hidden: true      
            }           
          ]
        },
        {
          path: 'notice',
          name: 'ProfileNotice',
          component: ProfileNotice,
          hidden: true,
          children: [    
            {
              path: 'notice',
              name: 'ProfileNoticeMain',
              component: ProfileNoticeMain,
              hidden: true
            },
            {   
              path: 'noticeSetting',
              name: 'ProfileNoticeSetting',
              component: ProfileNoticeSetting,
              hidden: true      
            }
            
          ]
        },
        {
          path: 'faq',
          name: 'ProfileFaq',
          component: ProfileFaq,
          hidden: true,
        },
        {
          path: 'qna',
          name: 'ProfileQnA',
          component: ProfileQnA,
          hidden: true,
          children: [    
            {
              path: 'list',
              name: 'ProfileQnAList',
              component: ProfileQnAList,
              hidden: true
            },
            {
              path: 'view',
              name: 'ProfileQnAView',
              component: ProfileQnAView,
              hidden: true
            },
            {
              path: 'write',
              name: 'ProfileQnAWrite',
              component: ProfileQnAWrite,
              hidden: true
            },
          
          ]
        }            
      ]
    },  
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { X: 0, y: 0 };
    }
  }
})
