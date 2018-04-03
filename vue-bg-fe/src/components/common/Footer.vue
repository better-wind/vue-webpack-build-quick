<template>
  <div class="footer-wrap">
    <div class="footer">
      <el-row :gutter="134">
        <el-col :span="12">
          <div class="foot-item">
            <div class="fl-l item contact">
              <div class="item-title"></div>
              <div class="item-contact">
                <a href="http://www.gegejia.com/" target="_blank"><span>格格家</span></a>
                <a href="http://www.gegejia.com/#page3" target="_blank"><span>招商合作</span></a>
                <a href="http://www.gegejia.com/#page4" target="_blank"><span>商务合作</span></a>
                <a href="http://www.gegejia.com/#page5" target="_blank"><span>诚聘英才</span></a>
                <a href="http://www.gegejia.com/#page6" target="_blank"><span>联系我们</span></a>
              </div>
            </div>
            <div class="fl-r item er-code">
              <div class="item-title">
                <p class="title">格格家APP</p>
                <p>下载格格家APP</p>
              </div>
              <div class="item-code ggj"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="foot-item">
            <div class="fl-r item contact">
              <div class="item-title"></div>
              <div class="item-contact">
                <a href="http://www.globalscanner.com/#globalScanner" target="_blank"><span>环球捕手</span></a>
                <a href="http://www.globalscanner.com/#public" target="_blank"><span>公众号</span></a>
                <a href="http://www.globalscanner.com/#service" target="_blank"><span>服务保障</span></a>
                <a href="http://www.globalscanner.com/#aboutMe" target="_blank"><span>关于我们</span></a>
                <a href="http://www.globalscanner.com/#contact" target="_blank"><span>联系我们</span></a>
              </div>
            </div>
            <div class="fl-l item er-code">
              <div class="item-title">
                <p class="title">环球捕手APP</p>
                <p>下载环球捕手APP</p>
              </div>
              <div class="item-code hqbs"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="setUp-view">
        Copyright 2016-2017 浙江格家网络技术有限公司 浙ICP备10030838号-6
      </div>
    </div>
  </div>
</template>
<style lang='less' rel="stylesheet/less" scoped>
  .footer-wrap{
    background-color: rgb(255,255,255);
    .footer{
      width: 640px;
      height: 380px;
      margin:0 auto;
      .el-row {
        padding: 60px 0 40px;
      }
      .foot-item{
        position: relative;
        height: 200px;
        font-size: 14px;
        color: rgb(102,102,102);
        overflow: hidden;
        .item{
          height: 200px;
          .item-title{
            height:64px;
            text-align: center;
            p{
              margin-top: 4px;
              &.title{
                margin-top: 0;
                font-size: 16px;
                font-weight: bold;
              }
            }
            /*.title{*/
              /*font-size: 16px;*/
              /*font-weight: bold;*/
            /*}*/
          }
        }
        .er-code{
          width: 136px;
          .item-code{
            width: 136px;
            height: 136px;
            &.ggj{
              background:url('../../assets/images/erCode/ggj.jpg') no-repeat 100% 100%;
            }
            &.hqbs{
              background:url('../../assets/images/erCode/hqbs.jpg') no-repeat 100% 100%;
            }
          }
        }
        .contact{
          width: 60px;
          .item-contact{
            width: 60px;
            height: 136px;
            a{
              color: rgb(102,102,102);
              display: block;
              width: 60px;
              height: 16px;
              margin-top:14px;
              line-height: 16px;
              &:nth-child(1){
                margin-top: 0;
              }
            }
          }
        }
      }
      .setUp-view{
        font-size: 12px;
        color: rgb(153,153,153);
        text-align: center;
      }
    }

  }
</style>
