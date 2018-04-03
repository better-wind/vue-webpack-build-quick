// export default {
//   isEmptyObject: (e) => {
//     for (let t in e)
//       return !1
//     return !0
//   },
//   copyObject: (e) => {
//     const obj = {}
//     for (let i in e){
//       obj[i] = e[i]
//     }
//     return obj
//   },
//   // searchQuery: (cur, query, init) => {
//   //   const obj = {}
//   //   for (let i in cur){
//   //     obj[i] = cur[i]
//   //   }
//   //   for (let i in query){
//   //     obj[i] = query[i]
//   //   }
//   //   for (let i in init){
//   //     obj[init[i].key] = obj[init[i].key] ? obj[init[i].key] : null
//   //     if(init[i].selectType == 'selectAll' && obj[init[i].key] == null){
//   //       obj[init[i].key] = 'all'
//   //     }
//   //   }
//   //   return obj
//   // },
//   // resetQuery: (cur, init, query) => {
//   //   const obj = {}
//   //   for (let i in cur){
//   //     obj[i] = init[i] ? init[i] : ''
//   //   }
//   //   for (let i in query.searchList.all){
//   //     if(query.searchList.all[i].selectType == 'selectAll'){
//   //       obj[query.searchList.all[i].key] = 'all'
//   //     }
//   //   }
//   //   return obj;
//   // },
//   searchQuery: (query,pub,pri) => {
//
//     let  obj = {}
//     let init = pri ? pub.concat(pri) : pub
//     init.map((item)=>{
//       if(item.items){
//         item.items.map((subItem)=>{
//           let _key = subItem.key
//           // obj[_key] = query[_key] ? query[_key] : (subItem.intKey ? subItem.intKey : null)
//           obj[_key] = query[_key] ? query[_key] :  null
//         })
//       } else {
//         let _key = item.key
//         obj[_key] = query[_key] ? query[_key] : (item.intKey ? item.intKey : null)
//         if(item.selectType == 'selectAll' && obj[_key] == null){
//           obj[_key] = 'all'
//         }
//       }
//     })
//     return obj
//   },
//   resetQuery: (pub,pri) => {
//     let obj = {}
//     let init = pri ? pub.concat(pri) : pub
//     init.map((item)=>{
//       if(item.items){
//         item.items.map((subItem)=>{
//           let _key = subItem.key
//           obj[_key] =  null
//           if(subItem.selectType == 'selectAll' && obj[_key] == null){
//             obj[_key] = 'all'
//           }
//         })
//       } else {
//         let _key = item.key
//         obj[_key] = item.intKey ? item.intKey : null
//         if(item.selectType == 'selectAll' && obj[_key] == null){
//           obj[_key] = 'all'
//         }
//       }
//
//     })
//     return obj
//   },
//   formatDateCom: (pre,cur) => {
//     // console.log(pre)
//     // console.log(new Date(pre))
//     // console.log(new Date(cur))
//     const preTime = new Date(pre).getTime()
//     const curTime = new Date(cur).getTime()
//     let com = false;
//     if(preTime > curTime){
//       com = true
//     }
//     return com
//     // const preList = pre.split('-')
//     // const curList = cur.split('-')
//     // let com = false;
//     // if(preList[0] > curList[0] ||
//     //   (preList[0] == curList[0] && preList[1] > curList[1]) ||
//     //   (preList[1] == curList[1] && preList[2] > curList[2])){
//     //   com = true
//     // }
//     // return com
//   },
//   formatDate: (format,date,type) => {
//     let sDate = '';
//     if(date){
//       if(typeof date == 'string'){
//         sDate = date
//       }else{
//         let sYear = date.getFullYear(),
//           sMonth = date.getMonth() + 1,
//           sDay = date.getDate(),
//           sHour = date.getHours(),
//           sMin = date.getMinutes(),
//           sSec = date.getSeconds();
//         sMonth = sMonth < 9 ? '0'+sMonth :sMonth
//         sDay = sDay < 10 ? '0'+sDay : sDay
//         sHour = sHour < 10 ? '0'+sHour : sHour
//         sMin = sMin < 10 ? '0'+sMin: sMin
//         sSec = sSec < 10 ? '0'+sSec : sSec
//         if(type == 'day'){
//           sHour = '00'
//           sMin = '00'
//           sSec = '00'
//         } else if (type == 'hour'){
//           sMin = '00'
//           sSec = '00'
//         }
//         if(format == 'yyyy-mm-dd hh:mm:ss'){
//           sDate = sYear+'-'+sMonth+'-'+sDay+' '+sHour+':'+sMin+':'+sSec
//         } else if (format == 'yyyy-mm-dd'){
//           sDate = sYear+'-'+sMonth+'-'+sDay
//         }
//       }
//
//     }
//     return sDate
//   },
// }
const Util = {
  isEmptyObject: (e) => {
    for (let t in e)
      return !1
    return !0
  },
  deepCopy: (pre) => {
    let ch = pre.constructor === Array ? [] : {};
    if(typeof pre !== 'object'){
      ch = pre;
    }
    else if(window.JSON){
      ch = JSON.parse(JSON.stringify(pre))
    }
    else{
      for(var i in pre){
        ch[i] = typeof pre[i] === 'object' ?
          (pre[i].constructor === Array ? pre[i].slice() : deepCopy(pre[i]))
          : pre[i]
      }
    }
    return ch;
  },
  copyObject: (e) => {
    const obj = {}
    for (let i in e){
      obj[i] = e[i]
    }
    return obj
  },
  // searchQuery: (cur, query, init) => {
  //   const obj = {}
  //   for (let i in cur){
  //     obj[i] = cur[i]
  //   }
  //   for (let i in query){
  //     obj[i] = query[i]
  //   }
  //   for (let i in init){
  //     obj[init[i].key] = obj[init[i].key] ? obj[init[i].key] : null
  //     if(init[i].selectType == 'selectAll' && obj[init[i].key] == null){
  //       obj[init[i].key] = 'all'
  //     }
  //   }
  //   return obj
  // },
  // resetQuery: (cur, init, query) => {
  //   const obj = {}
  //   for (let i in cur){
  //     obj[i] = init[i] ? init[i] : ''
  //   }
  //   for (let i in query.searchList.all){
  //     if(query.searchList.all[i].selectType == 'selectAll'){
  //       obj[query.searchList.all[i].key] = 'all'
  //     }
  //   }
  //   return obj;
  // },
  searchQuery: (query,pub,pri) => {

    let  obj = {}
    let init = pri ? pub.concat(pri) : pub
    init.map((item)=>{
      if(item.items){
        item.items.map((subItem)=>{
          let _key = subItem.key
          // obj[_key] = query[_key] ? query[_key] : (subItem.intKey ? subItem.intKey : null)
          obj[_key] = query[_key] ? query[_key] :  null
        })
      } else {
        let _key = item.key
        obj[_key] = query[_key] ? query[_key] : (item.intKey ? item.intKey : null)
        if(item.selectType == 'selectAll' && obj[_key] == null){
          obj[_key] = 'all'
        }
      }
    })
    return obj
  },
  resetQuery: (pub,pri) => {
    let obj = {}
    let init = pri ? pub.concat(pri) : pub
    init.map((item)=>{
      if(item.items){
        item.items.map((subItem)=>{
          let _key = subItem.key
          obj[_key] =  null
          if(subItem.selectType == 'selectAll' && obj[_key] == null){
            obj[_key] = 'all'
          }
        })
      } else {
        let _key = item.key
        obj[_key] = item.intKey ? (item.isClear ? null : item.intKey) : null
        if(item.selectType == 'selectAll' && obj[_key] == null){
          obj[_key] = 'all'
        }
      }

    })
    return obj
  },
  formatDateCom: (pre,cur) => {
    // console.log(pre)
    // console.log(new Date(pre))
    // console.log(new Date(cur))
    const preTime = new Date(pre).getTime()
    const curTime = new Date(cur).getTime()
    let com = false;
    if(preTime > curTime){
      com = true
    }
    return com
    // const preList = pre.split('-')
    // const curList = cur.split('-')
    // let com = false;
    // if(preList[0] > curList[0] ||
    //   (preList[0] == curList[0] && preList[1] > curList[1]) ||
    //   (preList[1] == curList[1] && preList[2] > curList[2])){
    //   com = true
    // }
    // return com
  },
  formatDate: (format,date,type) => {
    let sDate = '';
    if(date){
      if(typeof date == 'string'){
        sDate = date
      }else{
        let sYear = date.getFullYear(),
          sMonth = date.getMonth() + 1,
          sDay = date.getDate(),
          sHour = date.getHours(),
          sMin = date.getMinutes(),
          sSec = date.getSeconds();
        sMonth = sMonth < 9 ? '0'+sMonth :sMonth
        sDay = sDay < 10 ? '0'+sDay : sDay
        sHour = sHour < 10 ? '0'+sHour : sHour
        sMin = sMin < 10 ? '0'+sMin: sMin
        sSec = sSec < 10 ? '0'+sSec : sSec
        if(type == 'day'){
          sHour = '00'
          sMin = '00'
          sSec = '00'
        } else if (type == 'hour'){
          sMin = '00'
          sSec = '00'
        }
        if(format == 'yyyy-mm-dd hh:mm:ss'){
          sDate = sYear+'-'+sMonth+'-'+sDay+' '+sHour+':'+sMin+':'+sSec
        } else if (format == 'yyyy-mm-dd'){
          sDate = sYear+'-'+sMonth+'-'+sDay
        }
      }

    }
    return sDate
  },
}
const RegExpType = {
  Num: /^[0-9]{1}[0-9]*$/g,
  Price: /^[0-9]{1}[0-9]*(\.[0-9]{1,2})?$/g,
  Qq: /^\d{6,}$/g,
  Tel:/^1(3|4|5|7|8)\d{9}$/g,
  Email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g,
  En:/^[a-zA-Z\d\-_\s]+$/g,
  deliverCode:/^[a-zA-Z\d\-_@%\.\*\\/\+]+$/,
  NumA:/^[a-zA-Z\d]+$/,
}

window.RegExpType = RegExpType
window.Util = Util
