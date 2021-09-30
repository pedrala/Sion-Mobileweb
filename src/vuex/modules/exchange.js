import Vue from "vue";

const state = {
  isMaster: false,

  chkM1321: false,
  chkM1322: false,
  
  exchanges: [],
  coins: [],
  symbols: {},
  hogas: [],

  coinImage: {
    //binance 폴더
    '1inch': require("@/images/coinImage/binanace/1INCH.png"),
    aave: require("@/images/coinImage/binanace/AAVE.png"),
    algo: require("@/images/coinImage/binanace/ALGO.png"),
    alpha: require("@/images/coinImage/binanace/ALPHA.png"),
    avax: require("@/images/coinImage/binanace/AVAX.png"),
    axs: require("@/images/coinImage/binanace/AXS.png"),
    bal: require("@/images/coinImage/binanace/BAL.png"),
    band: require("@/images/coinImage/binanace/BAND.png"),
    bel: require("@/images/coinImage/binanace/BEL.png"),
    blz: require("@/images/coinImage/binanace/BLZ.png"),
    bzrx: require("@/images/coinImage/binanace/BZRX.png"),
    comp: require("@/images/coinImage/binanace/COMP.png"),
    crv: require("@/images/coinImage/binanace/CRV.png"),
    ctk: require("@/images/coinImage/binanace/CTK.png"),
    cvc: require("@/images/coinImage/binanace/CVC.png"),
    defi: require("@/images/coinImage/binanace/DEFI.png"),
    doge: require("@/images/coinImage/binanace/DOGE.png"),
    dot: require("@/images/coinImage/binanace/DOT.png"),
    egld: require("@/images/coinImage/binanace/EGLD.png"),
    enj: require("@/images/coinImage/binanace/ENJ.png"),
    fil: require("@/images/coinImage/binanace/FIL.png"),
    flm: require("@/images/coinImage/binanace/FLM.png"),
    ftm: require("@/images/coinImage/binanace/FTM.png"),
    grt: require("@/images/coinImage/binanace/GRT.png"),
    hnt: require("@/images/coinImage/binanace/HNT.png"),
    icx: require("@/images/coinImage/binanace/ICX.png"),
    kava: require("@/images/coinImage/binanace/KAVA.png"),
    knc: require("@/images/coinImage/binanace/KNC.png"),
    ksm: require("@/images/coinImage/binanace/KSM.png"),
    lrc: require("@/images/coinImage/binanace/LRC.png"),
    matic: require("@/images/coinImage/binanace/MATIC.png"),
    mkr: require("@/images/coinImage/binanace/MKR.png"),
    near: require("@/images/coinImage/binanace/NEAR.png"),
    ocean: require("@/images/coinImage/binanace/OCEAN.png"),
    omg: require("@/images/coinImage/binanace/OMG.png"),
    rlc: require("@/images/coinImage/binanace/RLC.png"),
    rsr: require("@/images/coinImage/binanace/RSR.png"),
    rune: require("@/images/coinImage/binanace/RUNE.png"),
    skl: require("@/images/coinImage/binanace/SKL.png"),
    snx: require("@/images/coinImage/binanace/SNX.png"),
    sol: require("@/images/coinImage/binanace/SOL.png"),
    srm: require("@/images/coinImage/binanace/SRM.png"),
    storj: require("@/images/coinImage/binanace/STORJ.png"),
    sushi: require("@/images/coinImage/binanace/SUSHI.png"),
    sxp: require("@/images/coinImage/binanace/SXP.png"),
    theta: require("@/images/coinImage/binanace/THETA.png"),
    trb: require("@/images/coinImage/binanace/TRB.png"),
    uni: require("@/images/coinImage/binanace/UNI.png"),
    waves: require("@/images/coinImage/binanace/WAVES.png"),
    yfi: require("@/images/coinImage/binanace/YFI.png"),
    yfii: require("@/images/coinImage/binanace/YFII.png"),
    zen: require("@/images/coinImage/binanace/ZEN.png"),
    zil: require("@/images/coinImage/binanace/ZIL.png"),
    zrx: require("@/images/coinImage/binanace/ZRX.png"),

    //코인마켓캡로고이미지
    aave: require("@/images/coinImage/coinMarketCap/aave.png"),
    abbc: require("@/images/coinImage/coinMarketCap/abbc.png"),
    ada: require("@/images/coinImage/coinMarketCap/ada.png"),
    algo: require("@/images/coinImage/coinMarketCap/ALGO.png"),
    ampl: require("@/images/coinImage/coinMarketCap/AMPL.png"),
    ankr: require("@/images/coinImage/coinMarketCap/ANKR.png"),
    ant: require("@/images/coinImage/coinMarketCap/ANT.png"),
    ar: require("@/images/coinImage/coinMarketCap/AR.png"),
    ardr: require("@/images/coinImage/coinMarketCap/ARDR.png"),
    atom: require("@/images/coinImage/coinMarketCap/ATOM.png"),
    avax: require("@/images/coinImage/coinMarketCap/AVAX.png"),
    bal: require("@/images/coinImage/coinMarketCap/BAL.png"),
    band: require("@/images/coinImage/coinMarketCap/BAND.png"),
    bat: require("@/images/coinImage/coinMarketCap/BAT.png"),
    bcd: require("@/images/coinImage/coinMarketCap/bcd.png"),
    bch: require("@/images/coinImage/coinMarketCap/bch.png"),
    bnb: require("@/images/coinImage/coinMarketCap/BNB.png"),
    bnt: require("@/images/coinImage/coinMarketCap/BNT.png"),
    bsv: require("@/images/coinImage/coinMarketCap/bsv.png"),
    btc: require("@/images/coinImage/coinMarketCap/btc.png"),
    btg: require("@/images/coinImage/coinMarketCap/btg.png"),
    btm: require("@/images/coinImage/coinMarketCap/BTM.png"),
    bts: require("@/images/coinImage/coinMarketCap/BTS.png"),
    btt: require("@/images/coinImage/coinMarketCap/BTT.png"),
    busd: require("@/images/coinImage/coinMarketCap/BUSD.png"),
    cel: require("@/images/coinImage/coinMarketCap/CEL.png"),
    celo: require("@/images/coinImage/coinMarketCap/CELO.png"),
    chsb: require("@/images/coinImage/coinMarketCap/CHSB.png"),
    chz: require("@/images/coinImage/coinMarketCap/CHZ.png"),
    ckb: require("@/images/coinImage/coinMarketCap/CKB.png"),
    comp: require("@/images/coinImage/coinMarketCap/COMP.png"),
    cro: require("@/images/coinImage/coinMarketCap/CRO.png"),
    crv: require("@/images/coinImage/coinMarketCap/CRV.png"),
    cvc: require("@/images/coinImage/coinMarketCap/CVC.png"),
    cvt: require("@/images/coinImage/coinMarketCap/CVT.png"),
    dai: require("@/images/coinImage/coinMarketCap/DAI.png"),  
    dash: require("@/images/coinImage/coinMarketCap/dash.png"),
    dcr: require("@/images/coinImage/coinMarketCap/DCR.png"),
    dgb: require("@/images/coinImage/coinMarketCap/DGB.png"),
    divi: require("@/images/coinImage/coinMarketCap/DIVI.png"),
    doge: require("@/images/coinImage/coinMarketCap/DOGE.png"),
    dot: require("@/images/coinImage/coinMarketCap/DOT.png"),
    dx: require("@/images/coinImage/coinMarketCap/DX.png"),
    egld: require("@/images/coinImage/coinMarketCap/EGLD.png"),
    elf: require("@/images/coinImage/coinMarketCap/elf.png"),
    enj: require("@/images/coinImage/coinMarketCap/enj.png"),
    eos: require("@/images/coinImage/coinMarketCap/eos.png"),
    etc: require("@/images/coinImage/coinMarketCap/etc.png"),
    eth: require("@/images/coinImage/coinMarketCap/eth.png"),
    ewt: require("@/images/coinImage/coinMarketCap/EWT.png"),
    fil: require("@/images/coinImage/coinMarketCap/FIL.png"),
    ftt: require("@/images/coinImage/coinMarketCap/FTT.png"),
    gno: require("@/images/coinImage/coinMarketCap/GNO.png"),
    gnt: require("@/images/coinImage/coinMarketCap/gnt.png"),
    hbar: require("@/images/coinImage/coinMarketCap/HBAR.png"),
    hedg: require("@/images/coinImage/coinMarketCap/HEDG.png"),
    hive: require("@/images/coinImage/coinMarketCap/HIVE.png"),
    hnt: require("@/images/coinImage/coinMarketCap/HNT.png"),
    hot: require("@/images/coinImage/coinMarketCap/HOT.png"),
    ht: require("@/images/coinImage/coinMarketCap/HT.png"),
    husd: require("@/images/coinImage/coinMarketCap/HUSD.png"),
    icx: require("@/images/coinImage/coinMarketCap/icx.png"),
    iost: require("@/images/coinImage/coinMarketCap/IOST.png"),
    jst: require("@/images/coinImage/coinMarketCap/JST.png"),
    kava: require("@/images/coinImage/coinMarketCap/KAVA.png"),
    kcs: require("@/images/coinImage/coinMarketCap/KCS.png"),
    kmd: require("@/images/coinImage/coinMarketCap/KMD.png"),
    knc: require("@/images/coinImage/coinMarketCap/knc.png"),
    kp3r: require("@/images/coinImage/coinMarketCap/KP3R.png"),
    ksm: require("@/images/coinImage/coinMarketCap/KSM.png"),
    leo: require("@/images/coinImage/coinMarketCap/LEO.png"),
    link: require("@/images/coinImage/coinMarketCap/LINK.png"),
    lrc: require("@/images/coinImage/coinMarketCap/lrc.png"),
    lsk: require("@/images/coinImage/coinMarketCap/LSK.png"),
    ltc: require("@/images/coinImage/coinMarketCap/ltc.png"),
    luna: require("@/images/coinImage/coinMarketCap/LUNA.png"),
    maid: require("@/images/coinImage/coinMarketCap/MAID.png"),
    mana: require("@/images/coinImage/coinMarketCap/MANA.png"),
    matic: require("@/images/coinImage/coinMarketCap/MATIC.png"),
    miota: require("@/images/coinImage/coinMarketCap/MIOTA.png"),
    mkr: require("@/images/coinImage/coinMarketCap/MKR.png"),
    mona: require("@/images/coinImage/coinMarketCap/MONA.png"),
    nano: require("@/images/coinImage/coinMarketCap/NANO.png"),
    near: require("@/images/coinImage/coinMarketCap/NEAR.png"),
    neo: require("@/images/coinImage/coinMarketCap/neo.png"),
    nexo: require("@/images/coinImage/coinMarketCap/NEXO.png"),
    nmr: require("@/images/coinImage/coinMarketCap/NMR.png"),
    nxm: require("@/images/coinImage/coinMarketCap/NXM.png"),
    ocean: require("@/images/coinImage/coinMarketCap/OCEAN.png"),
    okb: require("@/images/coinImage/coinMarketCap/OKB.png"),
    omg: require("@/images/coinImage/coinMarketCap/omg.png"),
    ont: require("@/images/coinImage/coinMarketCap/ONT.png"),
    oxt: require("@/images/coinImage/coinMarketCap/OXT.png"),
    pax: require("@/images/coinImage/coinMarketCap/PAX.png"),
    paxg: require("@/images/coinImage/coinMarketCap/PAXG.png"),
    pnk: require("@/images/coinImage/coinMarketCap/PNK.png"),
    pnt: require("@/images/coinImage/coinMarketCap/PNT.png"),
    qnt: require("@/images/coinImage/coinMarketCap/QNT.png"),
    qtum: require("@/images/coinImage/coinMarketCap/qtum.png"),
    ren: require("@/images/coinImage/coinMarketCap/REN.png"),
    renbtc: require("@/images/coinImage/coinMarketCap/RENBTC.png"),
    rep: require("@/images/coinImage/coinMarketCap/rep.png"),
    rev: require("@/images/coinImage/coinMarketCap/REV.png"),
    rif: require("@/images/coinImage/coinMarketCap/RIF.png"),
    rlc: require("@/images/coinImage/coinMarketCap/RLC.png"),
    rsr: require("@/images/coinImage/coinMarketCap/RSR.png"),
    rune: require("@/images/coinImage/coinMarketCap/RUNE.png"),
    rvn: require("@/images/coinImage/coinMarketCap/RVN.png"),
    sc: require("@/images/coinImage/coinMarketCap/SC.png"),
    snt: require("@/images/coinImage/coinMarketCap/snt.png"),
    snx: require("@/images/coinImage/coinMarketCap/SNX.png"),
    sol: require("@/images/coinImage/coinMarketCap/SOL.png"),
    srm: require("@/images/coinImage/coinMarketCap/SRM.png"),
    steem: require("@/images/coinImage/coinMarketCap/steem.png"),
    storj: require("@/images/coinImage/coinMarketCap/STORJ.png"),
    strax: require("@/images/coinImage/coinMarketCap/STRAX.png"),
    stx: require("@/images/coinImage/coinMarketCap/STX.png"),
    sushi: require("@/images/coinImage/coinMarketCap/SUSHI.png"),
    sxp: require("@/images/coinImage/coinMarketCap/SXP.png"),
    tfuel: require("@/images/coinImage/coinMarketCap/TFUEL.png"),
    theta: require("@/images/coinImage/coinMarketCap/theta.png"),
    tmtg: require("@/images/coinImage/coinMarketCap/tmtg.png"),
    tomo: require("@/images/coinImage/coinMarketCap/TOMO.png"),
    trac: require("@/images/coinImage/coinMarketCap/TRAC.png"),
    trx: require("@/images/coinImage/coinMarketCap/trx.png"),
    tusd: require("@/images/coinImage/coinMarketCap/TUSD.png"),
    ubt: require("@/images/coinImage/coinMarketCap/UBT.png"),
    uma: require("@/images/coinImage/coinMarketCap/UMA.png"),
    uni: require("@/images/coinImage/coinMarketCap/UNI.png"),
    usdc: require("@/images/coinImage/coinMarketCap/USDC.png"),
    usdt: require("@/images/coinImage/coinMarketCap/USDT.png"),
    vet: require("@/images/coinImage/coinMarketCap/vet.png"),
    vlx: require("@/images/coinImage/coinMarketCap/VLX.png"),
    wan: require("@/images/coinImage/coinMarketCap/WAN.png"),
    waves: require("@/images/coinImage/coinMarketCap/WAVES.png"),
    waxp: require("@/images/coinImage/coinMarketCap/WAXP.png"),
    wbtc: require("@/images/coinImage/coinMarketCap/WBTC.png"),
    xem: require("@/images/coinImage/coinMarketCap/xem.png"),
    xlm: require("@/images/coinImage/coinMarketCap/XLM.png"),
    xmr: require("@/images/coinImage/coinMarketCap/xmr.png"),
    xrp: require("@/images/coinImage/coinMarketCap/xrp.png"),
    xrp: require("@/images/coinImage/coinMarketCap/xrp.png"),
    xtz: require("@/images/coinImage/coinMarketCap/XTZ.png"),
    xvg: require("@/images/coinImage/coinMarketCap/XVG.png"),
    yfi: require("@/images/coinImage/coinMarketCap/YFI.png"),
    yfii: require("@/images/coinImage/coinMarketCap/YFII.png"),
    zb: require("@/images/coinImage/coinMarketCap/ZB.png"),
    zec: require("@/images/coinImage/coinMarketCap/zec.png"),
    zen: require("@/images/coinImage/coinMarketCap/ZEN.png"),    
    zil: require("@/images/coinImage/coinMarketCap/zil.png"),
    zrx: require("@/images/coinImage/coinMarketCap/zrx.png"),

    //원래 이미지 폴더
    ae: require("@/images/coinImage/basic/ae.png"),
    amo: require("@/images/coinImage/basic/amo.png"),
    apis: require("@/images/coinImage/basic/apis.png"),
    arn: require("@/images/coinImage/basic/arn.png"),
    bhpc: require("@/images/coinImage/basic/bhpc.png"),
    bznt: require("@/images/coinImage/basic/bznt.png"),
    cmt: require("@/images/coinImage/basic/cmt.png"),
    ctxc: require("@/images/coinImage/basic/ctxc.png"),
    ethos: require("@/images/coinImage/basic/ethos.png"),
    gto: require("@/images/coinImage/basic/gto.png"),
    hsr: require("@/images/coinImage/basic/hsr.png"),
    itc: require("@/images/coinImage/basic/itc.png"),
    mco: require("@/images/coinImage/basic/mco.png"),
    mith: require("@/images/coinImage/basic/mith.png"),
    pay: require("@/images/coinImage/basic/pay.png"),    
    powr: require("@/images/coinImage/basic/powr.png"),
    ppt: require("@/images/coinImage/basic/ppt.png"),
    pst: require("@/images/coinImage/basic/pst.png"),
    rdn: require("@/images/coinImage/basic/rdn.png"),
    rom: require("@/images/coinImage/basic/rom.png"),
    salt: require("@/images/coinImage/basic/salt.png"),
    strat: require("@/images/coinImage/basic/strat.png"),
    wax: require("@/images/coinImage/basic/wax.png"),
    wet: require("@/images/coinImage/basic/wet.png"),
    wtc: require("@/images/coinImage/basic/wtc.png"), 
    default: require("@/images/coinImage/basic/default.png"),

  },

  currentExid: '',
  currentCoin: '',
};

const getters = {
  isMaster: state => state.isMaster,

  exchanges: state => state.exchanges,
  symbols: state => state.symbols,
  hogas: state => state.hogas,
  coins: state => state.coins,

  getSymbol: state => symbol => {
    if (symbol) {
      return state.symbols[symbol];
    } else {
      return {};
    }
  },
  getHoga: state => symbol => {
    if (symbol) {
      return state.hogas[symbol];
    } else {
      return {};
    }
  },

  currentExid: state => state.currentExid,
  currentCoin: state => state.currentCoin,

  getCoinImage: state => coin => {
    if (coin) {
      coin = coin.toLocaleLowerCase();
      var data = state.coinImage[coin];
      if (data != null) {
        return data;
      } else {
        return state.coinImage.default;
      }
    } else {
      return state.coinImage.default;
    }
  },
};

const mutations = {
  setM1321: (state, chkM1321) => {
    state.chkM1321 = chkM1321;
    if (state.chkM1321 && state.chkM1322) {
      state.isMaster = true;
    }
  },
  setM1322: (state, chkM1322) => {
    state.chkM1322 = chkM1322;
    if (state.chkM1321 && state.chkM1322) {
      state.isMaster = true;
    }
  },
  setExchanges: (state, exchanges) => {
    state.exchanges = exchanges;
  },
  setCoins: (state, coins) => {
    state.coins = coins;
  },
  setSymbols: (state, symbols) => {
    state.symbols = symbols;
  },
  setHogas: (state, hogas) => {
    state.hogas = hogas;
  },
  setCurrentExid: (state, exid) => {
    state.currentExid = exid;
  },
  setCurrentCoin: (state, coin) => {
    state.currentCoin = coin;
  },
}

const actions = {
  m1321: ({ commit }, payload) => {
    let header = { trName: 'm1321' };
    let input = {
      InBlock1: [{
        exid: '',
      }]
    }
    return new Promise((resolve, reject) => {
      Vue.prototype.$socket.sendProcessByName(header, input, (queryData) => {
        if (queryData) {
          if (queryData.header.errCode == '00000') {
            const iconv = require('iconv-lite');

            let outblocks = queryData.queryObj.OutBlock2;
            let exchanges = [];
            let symbols = {};
            let coins = [];

            outblocks.forEach(item => {
              if (item.vexid == '002') {
                return;
              }
              item.name = item.symbol.substr(5);
              var exidnm = item.exidnm;
              exidnm = iconv.decode(Object.values(exidnm), 'euc-kr');
              item.exidnm = exidnm.rtrim();

              var hname = item.hname;
              hname = iconv.decode(Object.values(hname), 'euc-kr');
              item.hname = hname.rtrim();

              //거래소 확인
              var tmp1 = exchanges.filter(exchange => exchange.vexid === item.vexid);
              if (tmp1.length === 0) {
                exchanges.push({
                  vexid: item.vexid,
                  vexidnm: item.vexidnm,
                  exidnm: item.exidnm,
                })
              }

              //코인 확인
              var tmp2 = coins.filter(coin => coin === item.coincd);
              if (tmp2.length === 0) {
                coins.push(item.coincd);
              }

              //심볼
              symbols[item.symbol] = item;
            });

            commit('setExchanges', exchanges);
            commit('setCoins', coins);
            commit('setSymbols', symbols);
            commit('setM1321', true);

            resolve(queryData.header);
          } else {
            reject(queryData.header);
          }
        } else {
          reject();
        }
      });
    });
  },
  m1322: ({ commit }, payload) => {
    let header = { trName: 'm1322' };
    let input = {
      InBlock1: [{
        req_cnt: '',
      }]
    }
    return new Promise((resolve, reject) => {
      Vue.prototype.$socket.sendProcessByName(header, input, (queryData) => {
        if (queryData) {
          if (queryData.header.errCode == '00000') {

            let outblocks = queryData.queryObj.OutBlock2;
            let hogas = {};

            outblocks.forEach(item => {
              if (hogas[item.symbol] == null) {
                hogas[item.symbol] = [];
              }
              hogas[item.symbol].push(item);
            });

            commit('setHogas', hogas);
            commit('setM1322', true);

            resolve(queryData.header);
          } else {
            reject(queryData.header);
          }
        } else {
          reject();
        }
      });
    });
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}
