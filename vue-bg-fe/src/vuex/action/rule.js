import baseFn from './base'
export default {
  //规则相关
  /*
   * 获取一级规则
   *  /rule/first
   * */
  getRuleFirstList({commit},data){
    const opts = {
      method: 'GET',
      url: baseFn.Api + '/rule/first',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取二级规则
   * /rule/second/list
   * */
  getRuleList({commit}, data){
    const opts = {
      method: 'GET',
      url: baseFn.Api + '/rule/second/list',
      params: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取规则详情
   * /rule/ruleSecond/detail
   * */
  getRuleDetail({commit}, data){
    const opts = {
      method: 'GET',
      url: baseFn.Api + '/rule/ruleSecond/detail',
      params: data
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/ruleDetail'+data.ruleSecondId+'.json',
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 规则置顶前五条
   * /rule/top/five
   * */
  getTopRule({commit}, data){
    const opts = {
      method: 'GET',
      url: baseFn.Api + '/rule/top/five',
    }
    return baseFn.nextFetch(commit,opts)
  },
}
