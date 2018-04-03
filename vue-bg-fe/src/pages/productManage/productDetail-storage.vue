<template>
  <div>
    <div class="title">
      <template v-if="editType == 'new'">
        <span v-if="editStep == 1">新建商品/选择类目</span>
        <span v-else>新建商品</span>
      </template>
      <template v-else>
        <span v-if="editStep == 1">编辑商品/切换类目</span>
        <span v-else>编辑商品</span>
      </template>
    </div>
    <div class="section-box">
      <template v-if="editStep == 1">
        <div class="block-box">
          <el-cascader style="width: 500px"  :props="step1.props" :options="step1.categoryOptions" @active-item-change="handleItemChange" v-model="step1.selectedCategory">
          </el-cascader>
        </div>
        <div style="margin-top:180px" class="block-box t-c">
          <el-button @click="selectCate" type="primary" size="small">下一步，填写商品信息</el-button>
          <el-button v-if="showCancelEditStep" @click="cancelEditStep" size="small">取消</el-button>
        </div>
      </template>
      <template v-if="editStep == 2">
        <div class="item-box">
          <div class="block-item">
            <span class="label-sign">当前选择类目</span>
            {{cateTitle}}
            <el-button @click="showSelectCate" size="small">修改类目</el-button>
          </div>
        </div>
        <div class="item-box ">
          <div class="sub-title-box mg-b">
            基本信息
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>商品名称</span>
            <el-input placeholder="请填写商品名称" v-model="saveProductEdit.name" :maxlength="40" class="input-item-middle input-item-large input-item-large-title" size="small"></el-input>
            <div style="margin-left: 130px">
              <span class="c-tip c-dis">客观商品名称，不可包含卖点，限40字</span>
            </div>
          </div>
          <div class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign"><span class="c-red">*</span>卖点文案</span>
            </div>
            <div class="inline-box">
              <el-input placeholder="请填写卖点文案" type="textarea" :rows="4" :maxlength="140"  v-model="saveProductEdit.sellingPoint" class="input-item-middle input-item-large input-item-large-title" size="small"></el-input>
              <span>{{saveProductEdit.sellingPoint.length}}/140</span>
            </div>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>品牌</span>
            <el-select filterable clearable  v-model="saveProductEdit.brandId" class="input-item-middle input-item-large" size="small"  placeholder="请选择品牌">
              <template v-for="subItem in saleBrandNameList">
                <el-option :key="subItem.id" :label="subItem.name" :value="subItem.id">
                  {{subItem.name}}
                </el-option>
              </template>
            </el-select>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 1">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span>该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>

                  <div class="label-sign-wrap">
                    <span class="label-sign"><span class="c-red">*</span>{{item.propertyName}}</span>
                  </div>

                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box" v-if="item.options.length>5">
                      <template>
                        <el-select class="mg-b-h" v-model="item.selected" placeholder="请选择">
                          <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName" :value="subItem.pvName">
                            {{subItem.pvName}}
                          </el-option>
                        </el-select>
                      </template>
                    </div>
                    <div class="inline-box" v-else>
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                      <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" class="input-item-middle input-item-large" size="small"></el-input>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 6">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="date"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 7">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="datetime"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </template>
          <div class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign"><span class="c-red">*</span>发货地</span>
            </div>

            <div class="inline-box" :style="{'width':'80%'}" v-show="shipAreaOptions.length>0">
              <el-checkbox-group v-model="shipAreaValue">
                <el-checkbox v-for="(item,i) in shipAreaOptions" :disabled="item.isEditable ? false : true" :key="i" :label="item.deliverAreaId" class="mg-b-h">
                  {{item.deliverAreaName}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="inline-box mg-b-h c-dis" v-show="shipAreaOptions.length == 0">
              暂无发货地
            </div>
          </div>
          <template v-for="item in shipAreaValue">
            <div class="block-box base-box label-float-layout">
              <!--<div class="label-sign-wrap">-->
                <span class="label-sign">
                  配送地区({{shipAreaOptions.filter((obj)=>obj.deliverAreaId==item)[0].deliverAreaName}})
                </span>
              <!--</div>-->
              <div class="inline-box" >
                <el-select size="small" :clearable="true" class="mg-b-h" v-model="mapDelTempList[item]" placeholder="请选择配送模板">
                  <el-option v-for="subItem in delTempList" :key="subItem.id" :label="subItem.name" :value="subItem.id">
                  </el-option>
                </el-select>
              </div>
              <span class="c-dis c-tip">注：全国发货可不填</span>

            </div>
          </template>
        </div>
        <div class="item-box" v-if="goodsPropertyConfig.filter((item)=>item.propertyType == 3).length>0">
          <div class="sub-title-box mg-b">
            商品属性
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 3">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span>该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>
                  <div class="label-sign-wrap">
                    <span class="label-sign"><span v-if="item.isRequired" class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box" v-if="item.options.length>5">
                      <template>
                        <el-select class="mg-b-h" v-model="item.selected" placeholder="请选择">
                          <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName" :value="subItem.pvName">
                            {{subItem.pvName}}
                          </el-option>
                        </el-select>
                      </template>
                    </div>
                    <div class="inline-box" v-else>
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                      <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" class="input-item-middle input-item-large" size="small"></el-input>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 6">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="date"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 7">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="datetime"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </template>
        </div>
        <div class="item-box">
          <div class="sub-title-box mg-b">
            销售属性
            <template v-if="editType == 'edit' && !isConsult && auditAgain">
              <el-button size="small" :disabled="saleUnitDisType == 2 && saleUnitDis" @click="callEditSkuPrice" type="primary">调整供货价</el-button>
              <el-button size="small" @click="callPricePage" type="primary">调价记录</el-button>
            </template>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 2">
              <template v-if="item.isOther">

              </template>
              <template v-else>
                <div class="block-box property-box label-float-layout">
                  <div class="label-sign-wrap">
                    <span class="label-sign"><span v-if="item.isRequired" class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <template v-if="item.inputType == 4">
                    <div class="inline-box" :style="{'position':'relative'}">
                      <el-checkbox-group v-model="item.selected" @change="mulSelectChange(item.propertyNameId,$event,item)">
                        <template v-for="subItem in item.options">
                          <template v-if="subItem.saleDis">
                            <el-checkbox class="mg-b-h" disabled :label="subItem.pvName"></el-checkbox>
                          </template>
                          <template v-else>
                            <el-checkbox class="mg-b-h" :disabled="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)" :label="subItem.pvName"></el-checkbox>
                          </template>
                         </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h" :disabled="(subItem.pvName ? false : true) || ((saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis))" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName">
                            <el-input v-model="subItem.pvName" :disabled="item.selected.includes(subItem.pvName)" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input>
                          </el-checkbox>
                        </template>
                      </el-checkbox-group>
                      <div class="hide-click" @click="handleHideClick()" v-if="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)"></div>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </template>
          <div class="item-table">
            <el-table :data="goodsSkuConfig" style="width: 100%;" >
              <el-table-column align="center" label="销售状态">
                <template slot-scope="scope" >
                  <el-button :disabled="saleUnitDisType == 2 && saleUnitDis" size="small" :type="scope.row.status == 1 ? 'primary' : ''" :class="scope.row.status == 1 ? '' : 'c-red'" @click="changeSkuStatus(scope.row.status,scope.$index)">{{scope.row.status == 1 ? '可售' : '停售'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column  prop="skuName" label="销售属性值"  align="center">
                <template slot-scope="scope">
                  <span class="key-item">{{scope.row.skuName | changeSkuCode}}</span>
                  <el-button size="small" type="primary" v-if="saleUnitDisType == 1 && saleUnitDis" @click="editSaleProperty(scope.row.skuId,scope.$index,1)">补充属性</el-button>
                  <el-button size="small" type="primary" v-if="scope.row.type == 2" @click="editSaleProperty(scope.row.skuId,scope.$index,2)">修改属性</el-button>
                </template>
              </el-table-column>
              <!--<el-table-column prop="barcode" align="center" label="商品条码" width="120">-->
                <!--<template slot-scope="scope">-->
                  <!--<span class="cell-edit-input"><el-input :disabled="scope.row.type == 2 || scope.row.type == 1 ? true : false" size="small" v-model.trim="scope.row.barcode" class="input-item-middle"></el-input></span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
                <template slot-scope="scope">
                  <span class="cell-edit-input"><el-input :disabled="saleUnitDisType == 2 && saleUnitDis" class="input-item-middle" size="small" v-model.trim="scope.row.grossWeight"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
                <template slot-scope="scope">
                  <span class="cell-edit-input"><el-input :disabled="saleUnitDisType == 2 && saleUnitDis" class="input-item-middle" size="small" v-model.trim="scope.row.marketPrice"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
                <template slot-scope="scope">
                  <span class="cell-edit-input"><el-input :disabled="saleUnitDisType == 2 && saleUnitDis" class="input-item-middle" size="small" v-model.trim="scope.row.retailPrice"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="costPrice" align="center" label="供货价(不含邮)" width="120">
                <template slot-scope="scope">
                  <span class="cell-edit-input"><el-input :disabled="(editType == 'edit' && scope.row.isSave) || (saleUnitDisType == 2 && saleUnitDis)" class="input-item-middle" size="small" v-model.trim="scope.row.costPrice"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="code" align="center" :label="'发货编码('+shipAreaOptions.filter((obj)=>obj.deliverAreaId==item)[0].deliverAreaName+')'" width="120" :key="i" v-for="(item,i) in shipAreaValue" v-if="shipAreaOptions.length>0">
                <template slot-scope="scope">
                  <span class="cell-edit-input"><el-input
                      :disabled="saleUnitDisType == 2 && saleUnitDis"
                      class="input-item-middle"
                      v-model.trim="scope.row['code'+item]"
                      @focus="deliverCodeFocus(scope.row['code'+i],scope.row,i)"
                      @blur="deliverCodeBlur(scope.row['code'+i],scope.row,i)">
                    </el-input></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
          <div class="sub-title-box mg-b">
            SKU主图（销售属性项：{{skuImagePropertyName}}）
          </div>
          <div class="block-box c-dis">SKU主图：必填，分辨率640x640，文件小于400KB！</div>
          <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
            <div class="inline-box mg-r" style="overflow: hidden" v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].selected">
              <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item}}</span>
              <div class="avatar-wrap" @click="setSkuImageIdx(item)">
                <template v-if="configSaleUnitImages.list[item]">
                  <img :src="configSaleUnitImages.list[item].url" class="avatar">
                  <div class="avatar-menu">
                    <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                    <i class="el-icon-delete" @click="delProductImage(item)"></i>
                  </div>
                </template>
                <template v-else>
                  <el-upload class="avatar-wrap avatar-uploader" action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </template>
              </div>
            </div>
          </div>
        </div>
        <v-upload :uploadConfig="uploadConfig" />
        <div class="item-box t-c">
          <template v-if="isConsult">
            <el-button  @click="saveProduct" type="primary" >重新提交审核</el-button>
          </template>
          <template v-else>
            <el-button v-if="auditStatus == 0" @click="saveProduct" type="primary" >提 交 审 核</el-button>
            <span v-else-if="auditStatus == 1" class="c-red" style="font-size: 18px">审核中 . . .</span>
            <el-button v-else-if="auditStatus == 4" @click="saveProduct" type="primary" >重新提交审核</el-button>
          </template>

        </div>
      </template>
      <el-dialog title="调整供货价" size="large" :visible.sync="editSkuPriceModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="section-box">
          <el-table :data="editSkuPriceModel.list" style="width: 100%;" >
            <el-table-column  prop="skuCode" label="SKU码"  align="center" width="">
            </el-table-column>
            <el-table-column  prop="skuName" label="销售属性值"  align="center" width="">
              <template slot-scope="scope">
                <span class="key-item"><span v-if="scope.row.status == 0" class="c-red">(停售)</span>{{scope.row.skuName | changeSkuCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" align="center"  label="当前供货价" width="">

            </el-table-column>
            <el-table-column prop="newPrice" align="center" label="调后供货价" width="120">
              <template slot-scope="scope">
                <span class="cell-edit-input"><el-input class="input-item-middle" size="small" v-model.trim="scope.row.newPrice"></el-input></span>
              </template>
            </el-table-column>
          </el-table>
          <div class="item-box">
            <div class="block-box">
              <span class="label-sign" style="display:inline-block;width: 100px"><span class="c-red">*</span>待启用日期</span>
              <el-date-picker :picker-options="pickerOptions" type="date" class="input-item-large" size="small" v-model="editSkuPriceModel.opts.effectiveDate" placeholder="请选择日期" ></el-date-picker>
            </div>
            <div class="block-box">
              <span class="label-sign" style="display:inline-block;width: 100px"><span class="c-red">*</span>调价原因</span>
              <el-input size="small" class="input-item-middle input-item-large " v-model.trim="editSkuPriceModel.opts.reason" placeholder="请输入调价原因"></el-input>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditPriceModel">取 消</el-button>
          <el-button type="primary" @click="submitEditPriceModel">提交审核</el-button>
        </div>
      </el-dialog>
      <el-dialog title="供货价审核记录" class="sku-price-audit" size="large" :visible.sync="skuPriceListModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="section-box">
          <el-table :data="skuPriceListModel.list" border style="width: 100%;" >
            <el-table-column  prop="skuCode" label="提交审核信息"  align="center" width="260">
              <template slot-scope="scope">
                <div class="table-item-text">
                  <p>提交审核时间：{{scope.row.createTime}}</p>
                  <p>审核状态：
                    <span v-if="scope.row.status == 2">失败</span>
                    <span v-else-if="scope.row.status == 1">成功</span>
                    <template v-else>
                      <span >待审核</span>
                      <el-button  size="small" @click="callWithdrawCostPriceAudit">撤回</el-button>
                    </template>

                  </p>
                </div>

              </template>
            </el-table-column>
            <el-table-column  prop="skuCode" label="" :render-header="headerTitle" align="center" width="510">
              <template slot-scope="scope">
                <div class="line-wrap" v-for="(item,idx) in scope.row.auditCostPriceDetailList">
                  <p>{{item.skuCode}}</p>
                  <p><span class="c-red" v-if="item.skuStatus == 0">(停售)</span>{{item.propertyValue}}</p>
                  <p>{{item.oldCostPrice / 100}}</p>
                  <p>
                    <span class="c-red" v-if="item.newCostPrice > item.oldCostPrice">提价</span>
                    <span class="c-green" v-else>降价</span>
                  </p>
                  <p>{{item.newCostPrice / 100}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column  prop="skuCode" label="审核信息"  align="center" >
              <template slot-scope="scope">
                <div class="table-item-text">
                  <p>待启用日期：{{scope.row.effectiveDate}}</p>
                  <p>调价原因：{{scope.row.reason}}</p>
                  <p v-if="scope.row.auditResult">审核备注：{{scope.row.auditResult}}</p>
                  <p v-if="scope.row.auditTime">审核时间：{{scope.row.auditTime}}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block-box">
            <el-pagination
              @current-change="pricePageChange"
              :current-page="skuPriceListModel.opts.page"
              :page-sizes="[5]"
              small
              :page-size="skuPriceListModel.opts.rows"
              layout="total, sizes, prev, pager, next"
              :total="skuPriceListModel.opts.total">
            </el-pagination>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSkuPriceListModel">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改销售状态" size="tiny" :visible.sync="editSkuStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block-box">
          <el-radio v-model="editSkuStatusModel.type"  :label="1">可售</el-radio>
          <el-radio v-model="editSkuStatusModel.type"  :label="0">停售</el-radio>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditSkuStatusModel">取 消</el-button>
          <el-button type="primary" @click="submitEditSkuStatusModel">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="saleEditModel.type == 1 ? '补充属性' : '修改属性'"  size="large" :visible.sync="saleEditModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block">
          <span v-if="saleEditModel.type == 1">补充销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
          <span v-else-if="saleEditModel.type == 2">修改销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
        </div>
        <div class="block-box property-box label-float-layout" v-for="item in saleEditModel.propertyList">
          <div class="label-sign-wrap">
            <span class="label-sign" style="width: 120px">{{item.propertyName}}</span>
          </div>
          <!--单选可自定义-->
          <div class="inline-box" style="max-width: 600px">
            <template v-for="subItem in item.options">
              <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
            </template>
            <el-radio v-if="!saleEditModel.noKey" class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue">
              <el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input>
            </el-radio>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSaleEditModel">取 消</el-button>
          <el-button type="primary"  @click="submitSaleEditModel(saleEditModel.fn)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
//  import Util from '../../assets/js/common/utils'
  import vUpload from '@/components/productManage/uploadImage'
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload'])
    },
    filters: {
      categoryFilter(data){
        let str = ''
        data.map((item,i)=>{
          str+=item.name+' '
        })
        return str
      },
      changeSkuCode(str){
        let _str = ''
        _str = str.replace(/\$&&\$/g,'-')
        return _str
      },
    },
    data:()=>({
      skuSplitStr:'$&&$',
      skuSplitStrReg:/\$&&\$/g,
      pickerOptions: {
        disabledDate(time) {
          const start = new Date();
          return time.getTime() > start.getTime() + 3600 * 1000 * 24 * 15 || time.getTime() < start.getTime() + 3600 * 1000 * 24 * 1
        }
      },
      goodsId:'',
      cateTitle: '',
      goodsDetailFetch:{
        fetch:false,
        rs:{}
      },
      editType:'new',
      editStep:1,
      showCancelEditStep:false,
      isChangeCate: false,
      deliverCodePre: '',
      step1: {
        categoryOptions: [

        ],
        selectedCategory: [],
        props: {
//          value: 'label',
          children: 'cates'
        },
      },
      sellerOptions:[],
      selectedBelong: {
        name: '',
        id: 0
      },
      shipAreaValue: [],
      shipAreaOptions: [],
      getCateByCheck:false,
      editStepCheck:false,
      editCatePathIdArr:[],
      uploadConfig:{
        detailConfig:{
          isShow:true, // 是否有详情
          editType:2,// 1 不可修改  2 可修改 3 弹框修改
        },
        imageConfig:{
          isShow:true, // 是否有主图
          editType:2, // 1不可修改 2可修改
        }
      },
      saleBrandNameList:[],
      saveProductEdit:{
        sellerMainId:'',
        categoryId:'',
        brandId:'',
        name: '',
        sellingPoint: '',
        properties:[],
        // detail:{
        //   id:'',
        //   detail:''
        // },
        detail: '',
        images:[],
      },
      configSaleUnitImages :{
        idx:'',
        isRequiredImage:false,
        skuImagePropertyNameId:'',
        list:{},
        saleUnitImages:[],
        currentSkuImage:''
      },
      skuImagePropertyName: '',
      noSalePro:false,// 销售属性是否为空
      cateProperty:[], //类目属性
      goodsProperty:[], //商品详情属性
      goodsPropertyConfig:[], //商品详情属性配置
      mapCateProperty:{},
      goodsSku:[],
      goodsSkuConfig:[],
      mapGoodsSkuConfig:{},
      skuDimen:{},
      goodsSaleUnit:[],
      saleUnitDis:false,
      saleUnitDisType:'',
      saleSelectClear:false,
      saleEditModel:{
        type:1, // 1 补全 2 // 修改
        isShow:false,
        propertyList:[],
        skuIdx:'',
        fn:false, // 管理时
      },
      saleManageModel:{
        isShow:false
      },
      managerSkuList:[],
      mapCategoryId:{},
      selectCategoryId:'',
      editSkuStatusModel:{
        isShow:false,
        type:'',
        idx:''
      },
      picUpload:{
        picFile: null,
        getSize:1
      }, //上传格式
      editSkuPriceModel:{
        isShow:false,
        list:[],
        opts:{
          reason:'',
          effectiveDate:''
        },
      }, //调整供货价
      skuPriceListModel:{
        isShow:false,
        list:[],
        opts:{
          page:1,
          rows:5,
          total:0
        }
      },
      delTempList:[],// 配送模板列表
      mapDelTempList:{

      },
      isConsult:false,
      auditStatus:0,
      auditAgain:false
    }),
    methods:{
      ...mapActions(['getBaseGoodsAuditDetail','sellerDelTempList',
        'withdrawCostPriceAudit','costPricePageList','saveCostPriceAudit','checkCostPriceAudit',
        'getGoodsDeliver','setViewImage','setProductUpload','getPropertyDetail','getBaseGoodsDetail',
        'getCateList','getCategoryPath','getGoodsBelong','getShipArea','saveBaseGoods','validCategoryIdChange',
        'callSetNotice','getBrandSearchList']),
      initView(){
        //初始化
        //获取类目
        const query = this.$route.query
        this.editType = query.goodsId ? 'edit' : 'new'
        this.goodsId = query.goodsId ? query.goodsId : ''
        this.isConsult = query.type == 'consult' ? true : false
        this.setInitSaleBrand()
        if(this.editType == 'edit'){
          const _this = this
          this.editStep = 2
          this.callGetProductDetail()
            .then(()=>{
              return this.callGetPropertyDetail()
            })
            .then(()=>{
              //根据sellerMainId获取发货地
              this.sellerMainIdChange(function(){
                //展示已选择的发货地
                _this.goodsDetailFetch.rs.skuArray[0].deliverAreas.map((data,j)=>{
                  _this.goodsDetailFetch.rs.deliverAreas.map((area,i)=>{
                    if(data.deliverAreaId == area.deliverAreaId){
                      _this.shipAreaValue.push(area.deliverAreaId)
                    }
                  })
                })
                //遍历显示不可编辑的发货地
                _this.shipAreaOptions.map((area,i)=>{
                  _this.goodsDetailFetch.rs.deliverAreas.map((data,j)=>{
                    if (area.deliverAreaId == data.deliverAreaId) {
                      area.isEditable = data.isEditable
                    }
                  })
                })
              })
//              console.log(this.shipAreaOptions,this.shipAreaValue)
              this.checkProperty(this.editType)
            })
        }
        else {
          this.editStep = 1
          this.handleItemChange([])
          this.sellerMainIdChange()
        }
        //编辑
        this.setProductUpload({detail:'',images:[]})
        //接口获取
        this.sellerDelTempList()
          .then((rs)=>{
            this.delTempList = rs
          })
      },
      shipAreaPromise(){
        const _this = this;
        return new Promise(function(resolve){
          _this.getGoodsDeliver().then((rs)=>{
            let _rs = []
            rs.map((item)=>{
              let _opt = {
                deliverAreaName:item.name,
                deliverAreaId:item.code
              }
              _this.$set(_this.mapDelTempList, item.code, '');
              _rs.push(_opt)
            })
            resolve(_rs)
          })
        })
      },
      sellerMainIdChange(fn) {
        this.shipAreaValue = []
        this.shipAreaPromise().then((rs)=>{
          rs.map((data,i)=>{
            data.isEditable = true
          })
          if (this.editType == 'edit') {
            this.goodsDetailFetch.rs.deliverAreas.map((item)=>{
              let _id = item.deliverAreaTemplateId === 0 ? '' : item.deliverAreaTemplateId
              this.$set(this.mapDelTempList, item.deliverAreaId, _id);
            })

            if (rs.length == 0) {
              this.shipAreaOptions = this.goodsDetailFetch.rs.deliverAreas
            }
            else{
              this.shipAreaOptions = rs
              this.goodsDetailFetch.rs.deliverAreas.map((data1,i)=>{
                let _b = false
                rs.map((data2,j)=>{
                  if (data1.deliverAreaId == data2.deliverAreaId) {
                    _b = true
                  }
                })
                if (!_b) {
                  this.shipAreaOptions.push(data1)
                }
              })
            }
          }
          else{
            this.shipAreaOptions = rs
          }

          fn&&fn()
        })
      },
      // 详情页品牌获取
      setInitSaleBrand(){
        this.getBrandSearchList().then((rs)=>{
          this.saleBrandNameList = rs
        })
      },
      //确认选择类目
      selectCate(){
        let _list = JSON.parse(JSON.stringify(this.step1.selectedCategory))
        if(!_list.length){
          this.getToast('请选择类目')
          return false
        }
        let _cateId = _list.length ? _list.pop().id : 0
        let _listArr = []
        this.step1.selectedCategory.map((item)=>{
          _listArr.push(item.name)
        })
        if(this.editType == 'edit'){
          this.validCategoryIdChange({baseGoodsCode:this.goodsId,newCategoryId:_cateId})
            .then((rs)=>{
              if(rs){
                this.selectCategoryId = _cateId
                this.cateTitle = _listArr.join(' > ')
                this.callGetPropertyDetail(this.selectCategoryId)
                  .then(()=>{
                    return this.callGetProductDetail()
                  })
                  .then(()=>{
                    this.editStep = 2
                    this.isChangeCate = true
                    this.checkProperty(this.editType)
                  })
              }
              else {
                this.$alert('修改类目失败！修改目标类目尚未设置销售属性。请先设置类目的销售属性，或尝试修改为其他类目。', '提示', {
                  confirmButtonText: '我知道了',
                  callback: action => {
                  }
                });
                return false
              }
            })
        }
        else {
          this.selectCategoryId = _cateId
          this.cateTitle = _listArr.join(' > ')
          this.callGetPropertyDetail(this.selectCategoryId)
            .then(()=>{
              this.editStep = 2
              this.checkProperty(this.editType)
            })
        }
      },
      cancelEditStep(){
        this.editStep = 2
      },
      //显示选择类目面板
      showSelectCate(){
        this.$confirm('修改类目将导致商品编辑页面尚未保存的类目属性信息丢失，是否确认修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
          if(this.editType == 'edit' && !this.editStepCheck){
            this.editStepCheck = true
            this.step1.selectedCategory = []
            this.editStep = 1
            this.handleItemChange([])
          } else{
            this.editStep = 1
            this.step1.selectedCategory = []
          }
          this.showCancelEditStep = true
        })

      },
      //比较类目 和 商品详情
      checkProperty(type){
        //根据类目初始化
        this.saleSelectClear = false
        this.mapCateProperty = {}
        this.goodsPropertyConfig = []
        this.skuDimen = {}
        this.goodsSkuConfig = []
        const _this = this
        this.cateProperty.map((item,idx)=> {
          let opts = {
            selected:null,
            isDisabled:false,
            options:[]
          }
          opts.propertyName = item.propertyName
          opts.propertyNameId = item.propertyNameId
          opts.inputType = item.inputType
          opts.isRequired = item.isRequired
          opts.propertyType = item.propertyType
          opts.sortOrder = item.sortOrder
          this.mapCateProperty[item.propertyNameId] = idx
          if(opts.inputType == 2 || opts.inputType == 6 || opts.inputType == 7){
            opts.inputValue = ''
          }
          if(opts.inputType == 3 || opts.inputType == 4){
            opts.selected = []
          }
          if(opts.inputType == 4){
            opts.mulOptions = [
              {
                pvName:'',
                propertyNameId: item.propertyNameId
              }
            ]
          }
          item.propertyPairs = item.propertyPairs ? item.propertyPairs : []
          item.propertyPairs.map((subItem)=>{
            let opt = {
              id:subItem.id,
              propertyValueId:subItem.propertyValueId,
              pvName:subItem.pvName,
              propertyNameId:subItem.propertyNameId,
            }
            opts.options.push(opt)
          })
          this.goodsPropertyConfig.push(opts)
        })
        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
        //根据详情初始化
        if(type == 'new'){
          if(this.noSalePro){
            let _opts = {
              "skuName":'默认',
              "barcode": "",
              "marketPrice": '',
              "retailPrice": '',
              "costPrice": '',
              "grossWeight": '',
              "status": 1,
              "deliverAreas": [],
              "id": '',
            }
            this.goodsSkuConfig.push(_opts)
          }
          return false
        }
        this.goodsProperty.map((item,idx) =>{
          //存在
          if(this.mapCateProperty[item.propertyNameId] != null){
            let _idx = this.mapCateProperty[item.propertyNameId],
              _opts = this.goodsPropertyConfig[_idx],
              _type = _opts.inputType
            if(item.propertyPairs.length){
              let arr = [],
                extArr = [],
                arrMap = {}
              _opts.options.map((subItem)=>{
                arrMap[subItem.pvName] = subItem.pvName
              })
              item.propertyPairs.map((subItem)=>{
                if(!arrMap[subItem.pvName]){
                  let opt = {
                    propertyValueId:'',
                    pvName:subItem.pvName,
                    //propertyNameId:item.propertyNameId,
                    propertyNameId:subItem.propertyNameId,
                  }
                  extArr.push(opt)
                }
                arr.push(subItem.pvName)
              })
              Array.prototype.push.apply(_opts.options,extArr)
              // 已选sku 维度
              if(_opts.propertyType == 2){
                const _skuOpt = {
                  id:item.propertyNameId,
                  value:arr,
                  sortOrder:_opts.sortOrder
                }
                this.skuDimen[item.propertyNameId] = _skuOpt
                //this.skuDimen[item.sortOrder] = _skuOpt
                let _skuMapArr = {}
                arr.map((item)=>{
                  _skuMapArr[item] = item
                })
                _opts.options.map((item)=>{
                  if(_skuMapArr[item.pvName]){
                    item.saleDis = true
                  }
                })
              }
              _opts.selected =  _type == 1 || _type == 2 || _type == 5 || _type == 6 || _type == 7? arr[0] : arr
            }
            this.goodsPropertyConfig[_idx] = _opts
          }
          else {
            let opts =  {
              isOther:true,
              selected:'',
              propertyName:item.propertyName,
              propertyType:item.propertyType,
              sortOrder:item.sortOrder,
            }
            let arr = []
            item.propertyPairs.map((subItem)=>{
              arr.push(subItem.pvName)
            })
            opts.selected = arr.join(',')
            this.goodsPropertyConfig.push(opts)
          }
        })
        // 设置已选的 sku
//        this.goodsSkuConfig = []
        const saleUnit =this.goodsSaleUnit
        let saleProperty = [] // 销售属性
        this.cateProperty.filter((item)=>item.propertyType == 2).map((item)=>{
          saleProperty.push(item.propertyNameId)
        })
        saleUnit.map((item)=>{
          let arr = [],
            arr_vn = [],
            _this = this
          item.properties.sort(function(a,b){
                // 存在
            if(_this.goodsPropertyConfig[_this.mapCateProperty[b.propertyNameId]] && _this.goodsPropertyConfig[_this.mapCateProperty[a.propertyNameId]]){
              return _this.goodsPropertyConfig[_this.mapCateProperty[b.propertyNameId]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.propertyNameId]].sortOrder

            } else {
              return 1
            }
          })
          item.properties.map((subItem)=>{
            arr.push(subItem.pvName)
            arr_vn.push(subItem.propertyNameId)
            this.callMapGoodsSkuConfig()
          })
          let _opts = {
            id:item.id,
            skuName:arr.length>0 ? arr.join(this.skuSplitStr) : '默认',
            skuId:arr_vn,
            status:item.status,
            isSave:true,
            barcode:item.barcode,
            costPrice:item.costPrice/100,
            grossWeight:item.grossWeight,
            marketPrice:item.marketPrice/100,
            retailPrice:item.retailPrice/100,
            skuCode:item.skuCode
          }
          item.deliverAreas.map((area,i)=>{
            _opts['code'+area.deliverAreaId] = area.deliverCode
          })
          if(this.checkIncludesArr(saleProperty,arr_vn)){
            if(saleProperty.length != arr_vn.length){
              _opts.type = 1
              this.saleUnitDis = true
              this.saleUnitDisType = 1
            }
            }
          else if(saleProperty.length ||  arr_vn.length ){
              _opts.type = 2
              this.saleSelectClear = true
              this.saleUnitDis = true
              this.saleUnitDisType = 2
          }
          this.goodsSkuConfig.push(_opts)
        })
        this.callMapGoodsSkuConfig()
        if (this.isChangeCate) {
//          // console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected)
//          // console.log(this.configSaleUnitImages.saleUnitImages)
        }else{
          if(this.configSaleUnitImages.isRequiredImage){
            this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.map((unit,u_idx)=>{
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages[u_idx]
            })
          }
        }

        //补充属性时 清空已选择的 属性值
        if(this.saleSelectClear){
          this.goodsPropertyConfig.map((item)=>{
            if(item.propertyType == 2){
              item.selected = []
              if (item.options) {
                item.options.map((subItem)=>{
                  subItem.saleDis = false
                })
              }
            }
          })
        }
      },
      //类目选择切换
      handleItemChange(val){
        let list = this.step1.categoryOptions
        let valItem = {}
        if(val.length){
          valItem = val[val.length-1]
        } else {
          valItem.id = 0
        }
        if(this.mapCategoryId[valItem.id] != null){
          return false
        }
        this.mapCategoryId[valItem.id] = valItem.id

        val.map((item)=>{
          list = list[item.idx].cates
        })
        this.categoryPromise(valItem.id)
          .then((rs)=>{
            if(!rs.length)
              return false
            rs.map((item,idx)=>{
              let _opts = {
                label:item.name,
                cates:[],
                value:{
                  idx:idx,
                  id:item.id,
                  name:item.name
                }
              }
              if(item.isLeaf)
                delete _opts.cates
              list.push(_opts)
            })

          })
//        console.log(this.step1.categoryOptions)
      },
      //获取下一级类目集合
      categoryPromise(id){
        const _this = this;
        let _id = id ? id : 0
        return new Promise(function(resolve){
          _this.getCateList({categoryId:_id})
            .then((rs)=>{
              resolve(rs)
            })
        })
      },
      //获取类目属性详情
      callGetPropertyDetail(){
        const _this = this
        return new Promise(function(resolve){
          _this.getPropertyDetail({categoryId:_this.selectCategoryId})
            .then((rs)=>{
              rs.goodsProperties = rs.goodsProperties ? rs.goodsProperties : []
              rs.keyProperties = rs.keyProperties ? rs.keyProperties : []
              rs.saleProperties = rs.saleProperties ? rs.saleProperties : []
              _this.skuImagePropertyName = rs.skuImagePropertyName
              _this.noSalePro = rs.saleProperties.length ? false : true
              let list = rs.goodsProperties.concat(rs.keyProperties,rs.saleProperties)
              _this.cateProperty = list
              //_this.cateProperty.sort(function(a,b){return a.sortOrder < b.sortOrder})
              _this.configSaleUnitImages = {
                idx:'',
                isRequiredImage:rs.isRequiredSKUImage,
                skuImagePropertyNameId:rs.skuImagePropertyId,
                list:{},
                saleUnitImages:_this.configSaleUnitImages.saleUnitImages
              }

              resolve()
            })
        })
      },
      //获取商品详情
      callGetProductDetail(){
//        console.log('===获取详情===')
        const _this = this
        return new Promise(function(resolve){
          if(_this.goodsDetailFetch.fetch){
            _this.initDetail(_this.goodsDetailFetch.rs,resolve)
          } else {
            if(_this.isConsult){
              _this.getBaseGoodsAuditDetail({baseGoodsId:_this.goodsId})
                .then((rs)=>{
                  //详情属性
                  _this.goodsDetailFetch.fetch = true
                  _this.goodsDetailFetch.rs = JSON.parse(JSON.stringify(rs))
                  _this.initDetail(rs,resolve)
                })
            } else {
              _this.getBaseGoodsDetail({baseGoodsId:_this.goodsId})
                .then((rs)=>{
                  //详情属性
                  _this.goodsDetailFetch.fetch = true
                  _this.goodsDetailFetch.rs = JSON.parse(JSON.stringify(rs))
                  _this.initDetail(rs,resolve)
                })
            }

          }

        })
      },
      //详情初始化
      initDetail(rs,resolve){
        let _this = this

        _this.auditAgain = true
        _this.baseGoodsCode = rs.baseGoodsCode
        _this.auditStatus = rs.auditStatus
        _this.goodsProperty = rs.properties
        //详情销售单元
        _this.goodsSaleUnit = rs.skuArray

        //同步基本信息
        _this.saveProductEdit.name= rs.name
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.saveProductEdit.brandId = rs.brandId
        //同步商品图片详情
        _this.saveProductEdit.detail = rs.detail
        _this.setProductUpload({detail:rs.detail,images:rs.images})
        _this.configSaleUnitImages.saleUnitImages = rs.skuImages
        //同步商品已选择类目
        _this.selectCategoryId = _this.selectCategoryId ? _this.selectCategoryId : rs.categoryId
        _this.getCategoryPath({categoryId:_this.selectCategoryId})
          .then((_rs)=>{
            _this.cateTitle = _rs.pathName.split(',').join(' > ')
            _this.editCatePathIdArr = _rs.path.split('/').filter((item)=>item)
            let  _pathNameArr = _rs.pathName.split(',')
            _this.editCatePathIdArr.map((item,idx)=>{
              let _opts = {
                idx:0,
                id:Number(item),
                name:_pathNameArr[idx]
              }
              _this.step1.selectedCategory.push(_opts)
            })
          })
        resolve()
      },
      //数组间包含关系
      checkIncludesArr(pre,child){
        let mapPre = {},
          check = true
        pre.map((item)=>{
          mapPre[item] = item
        })
        if(!child.length){
          check = false
        } else {
          child.map((item)=>{
            if(!mapPre[item]){
              check = false
            }
          })
        }
//        console.log(check)
        return check
      },
      //设置选择sku选择维度
      mulSelectChange(idx,event,rs){
        let _rs = JSON.parse(JSON.stringify(rs)),
          _list = _rs.options.concat(rs.mulOptions),
          _mapList = {}
        _list.map((item)=>{
          _mapList[item.pvName] = item.pvName
        })
        let _event = event.filter((item)=>_mapList[item])
        rs.selected = _event

        const _opts = {
          id:idx,
          value:event,
          sortOrder:this.cateProperty.filter((item)=>item.propertyNameId == idx)[0].sortOrder
        }
        this.skuDimen[idx] = _opts
        let _len = 0
        for(let i in this.skuDimen){
          if(this.skuDimen[i].value.length){
            _len ++
          }
        }
//        if(_len != this.cateProperty.filter((item)=>item.propertyType == 2).length){
//          this.goodsSkuConfig = []
//          this.callMapGoodsSkuConfig()
//          return false
//        }
        this.mapSKUImage()
        this.parseSelectSale()
      },
      handleHideClick(){
        this.$alert('销售单元与商品类目的销售属性不相符，请先在销售属性列表中完成【修改属性】', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      },
      parseSelectSale(){
        let arr = []
        let _skuDimen = []
        for(let i in this.skuDimen){
          _skuDimen.push(this.skuDimen[i])
        }
        let _this = this
        _skuDimen.sort(function(a,b){
          return _this.goodsPropertyConfig[_this.mapCateProperty[b.id]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.id]].sortOrder
        })
        let _skuId = []
        for(let i in _skuDimen){
          let item = _skuDimen[i]
          let _itemArr = []
          _skuId.push(item.id)
          item.value.map((arrItem)=>{
            if(arr.length){
              arr.map((subArrItem)=>{
                _itemArr.push(subArrItem+this.skuSplitStr+arrItem)
              })
            } else {
              _itemArr.push(arrItem)
            }
          })
          if(_itemArr.length){
            arr = _itemArr
          }
        }
        let _goodsSkuConfig = []
        arr.map((item)=>{
          let _item =  item
          let _opts = {
            costPrice:'',
            skuName:item,
            skuId:_skuId,
            status:1,
            barcode: '',
            marketPrice: '',
            retailPrice: '',
            grossWeight: '',
          }
          if(this.mapGoodsSkuConfig[_item] != null){
            _opts = this.goodsSkuConfig[this.mapGoodsSkuConfig[_item]]
          }
          _goodsSkuConfig.push(_opts)
        })
        this.goodsSkuConfig = _goodsSkuConfig
        // this.goodsSkuConfig.sort((a,b)=>{
        //  if(a.skuName > b.skuName){
        //      return 1
        //  }  else if(a.skuName < b.skuName){
        //      return -1
        //  } else {
        //      return 0
        //  }
        // })
        this.callMapGoodsSkuConfig()
      },
      //已选sku Map
      callMapGoodsSkuConfig(){
        let _map = {}
        this.goodsSkuConfig.map((item,idx)=>{
//          console.log(item.skuName)
          _map[item.skuName] = idx
        })
        this.mapGoodsSkuConfig = _map
      },
      mapSKUImage(){
        if(this.configSaleUnitImages.isRequiredImage){
          let _list =  JSON.parse(JSON.stringify(this.configSaleUnitImages.list))
          this.configSaleUnitImages.list = {}
          this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.map((unit,u_idx)=>{
            if(_list[unit]){
              this.configSaleUnitImages.list[unit] =  _list[unit]
            }  else {
              let _propertyPairs = []
              this.goodsProperty.map((item)=>{
                if(item.propertyNameId == this.configSaleUnitImages.skuImagePropertyNameId){
                  _propertyPairs = item.propertyPairs
                }
              })
              let _pairsId = ''
              _propertyPairs.map((item)=>{

                if(item.pvName == unit){
                  _pairsId = item.id
                }
              })
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages.filter((item)=>item.propertyPairId == _pairsId)[0]

            }
          })
        }
      },
      //补全 修改 sku
      editSaleProperty(sku,idx,type){
        this.saleEditModel.skuIdx = idx
        let _cateProperty = this.cateProperty.filter((item)=>item.propertyType == 2)
        let list = []
        if(type == 1){
          _cateProperty.map((item)=>{
            let _check = true
            sku.map((skuId)=>{
              if(skuId == item.propertyNameId){
                _check = false
              }
            })
            if(_check){
              list.push(this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]])
            }
          })
        }
        else {
          list = this.goodsPropertyConfig.filter((item)=>item.propertyType == 2 && !item.isOther)
        }
        this.callShowEdit(list,type)

      },
      callShowEdit(list,type){
        this.saleEditModel.type = type
        this.saleEditModel.propertyList = []
        let _list = JSON.parse(JSON.stringify(list))
        _list.map((item,idx)=>{
          let opt = {
            selected:'',
            inputValue:null,
            options:item.options,
            inputType:item.inputType,
            propertyName:item.propertyName,
            propertyNameId:item.propertyNameId,
            propertyType:item.propertyType,
            sortOrder:item.sortOrder
          }
          this.saleEditModel.propertyList.push(opt)
        })
        this.saleEditModel.noKey = _list.length ? false : true
        if(this.saleEditModel.noKey){
          let opt = {
            selected:'',
            inputValue:null,
            options:[{
              pvName:'默认'
            }],
            inputType:1,
            propertyName:'默认销售属性',
            propertyNameId:'',
            propertyType:2
          }
          this.saleEditModel.propertyList.push(opt)
        }

        this.saleEditModel.isShow = true
      },
      cancelSaleEditModel(){
        this.saleEditModel.isShow = false
      },
      //修改 SKU销售类型
      changeSkuStatus(status,id){
        this.editSkuStatusModel.type = status
        this.editSkuStatusModel.idx = id
        this.editSkuStatusModel.isShow = true
      },
      //提交 修改 SKU销售类型
      submitEditSkuStatusModel(){
//        if (this.editType == 'edit' && this.editSkuStatusModel.type == 0) {
//          this.$confirm('若将SKU改为【停售】状态，如有关联该SKU的销售单元正在上架销售中，相关联的所有销售单元也会立即停售，是否确认？', '提示', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning'
//          }).then(() => {
//            this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type
//          }).catch(() => {
//          })
//        }else{
//          this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type
//        }
        this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type
        this.cancelEditSkuStatusModel()
      },
      //取消 修改 SKU销售类型
      cancelEditSkuStatusModel(){
        this.editSkuStatusModel.isShow = false
      },
      submitSaleEditModel(){
        let s = '',
          sarr = [],
          checkArr = [],
          selectCheck = false
        for(let i = 0;i<this.saleEditModel.propertyList.length;i++){
          let item = this.saleEditModel.propertyList[i]
          if(!item.selected && this.saleEditModel.type == 2){
            this.getToast('请选择'+item.propertyName)
            return false
          }
          if(item.selected){
            checkArr.push(item.selected)
            selectCheck = true
          }
        }
        if(!selectCheck && this.saleEditModel.type == 1){
          this.getToast('请至少选择一个销售属性补充')
          return false
        }
        if(this.saleEditModel.noKey){
          this.saleUnitDis = false
          this.goodsSkuConfig[0].skuName = '默认'
          this.goodsSkuConfig[0].type = 3
        } else {
          let _selectName = checkArr.join(this.skuSplitStr)
          for(let i in this.goodsSkuConfig){
            let item = this.goodsSkuConfig[i]
            if(_selectName == item.skuName){
              this.getToast('该sku已存在')
              return false
            }
          }
          this.saleEditModel.propertyList.map((item)=>{
            if(item.selected){
              if(this.saleEditModel.type == 1){
                if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
                  this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
                }
              }
              else if(this.saleEditModel.type == 2){
                if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
                  this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
                }
              }
              let _check = true
              this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.map((subItem)=>{
                if(subItem.pvName == item.selected){
                  subItem.saleDis = true
                  _check = false
                }
              })
              //不存在 添加
              if(_check){
                const  opt = {
                  id:'',
                  propertyNameId:item.propertyNameId,
                  propertyValueId:'',
                  pvName:item.selected,
                  saleDis:true
                }
                this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.push(opt)
              }
              const _skuOpt = {
                id:item.propertyNameId,
                value:this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected
              }
              this.skuDimen[item.propertyNameId] = _skuOpt
              s = item.selected+this.skuSplitStr + s
              sarr.push(item.selected)
            }

          })
          if(this.saleEditModel.type == 1){
            this.goodsSkuConfig.map((skuConfig)=>{
              let _skuName = skuConfig.skuName
              let _skuId = skuConfig.skuId
              let _skuNameArr = _skuName.indexOf(this.skuSplitStr)>-1 ? _skuName.split(this.skuSplitStr) : [_skuName]
              let _skuNamelist = []
              _skuId.map((item,idx)=>{
                let _optSku = {
                  id:item,
                  pv:_skuNameArr[idx],
                  sortOrder:this.goodsPropertyConfig[this.mapCateProperty[item]].sortOrder
                }
                _skuNamelist.push(_optSku)
              })
              this.saleEditModel.propertyList.map((item)=>{
                if(item.selected){
                  let _optSku = {
                    id:item.propertyNameId,
                    pv:item.selected,
                    sortOrder:item.sortOrder
                  }
                  _skuId.push(item.propertyNameId)
                  _skuNamelist.push(_optSku)
                }

              })
              //_skuNamelist.sort(function(a,b){return a.sortOrder < b.sortOrder})
              _skuNamelist.sort(function(a,b){return b.sortOrder - a.sortOrder})
              let _skuNameList = []
              _skuNamelist.map((item)=>{
                _skuNameList.push(item.pv)
              })
//              console.log(_skuNameList)
              skuConfig.skuName = _skuNameList.join(this.skuSplitStr)
              skuConfig.skuId = _skuId
            })

          }
          else if (this.saleEditModel.type == 2){
            let _skuModelId = []
            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join(this.skuSplitStr)
            this.cateProperty.filter((item)=>item.propertyType == 2).map((properConfig)=>{
              _skuModelId.push(properConfig.propertyNameId)
            })
            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuId = _skuModelId
          }
          this.goodsSkuConfig[this.saleEditModel.skuIdx].type = 3
          let _itemType = true
          let _itemTypeCheck = true
          let _catePropertyLength = this.cateProperty.filter((item)=>item.propertyType == 2).length
          this.goodsSkuConfig.map((item)=>{
//            if(item.type == 1 || item.type == 2){
//              _itemType = false
//            }
            if(item.type == 2){
              _itemType = false
            }
            if(item.skuId.length != _catePropertyLength){
              _itemTypeCheck = false
            }
          })
          if(_itemType){
            if(this.saleUnitDisType == 1 && _itemTypeCheck || this.saleUnitDisType == 2){
              this.saleUnitDis = false
            }
            this.callMapGoodsSkuConfig()
            this.parseSelectSale()
          }
          this.callMapGoodsSkuConfig()
        }
        this.cancelSaleEditModel()
      },
      checkPvName(rs,val,idx){
        if(!val){
          return false
        }
        for(let i in rs.options){
          let item = rs.options[i]
          if(val == item.pvName){
            if(rs.mulOptions && rs.mulOptions.length){
              rs.mulOptions[idx].pvName = ''
            } else {
              rs.inputValue = null
            }

            this.getToast('属性值已存在')
            return false
          }
        }
        if(rs.mulOptions && rs.mulOptions.length){
          let _check = 0
          rs.mulOptions.map((item)=>{
            if(val == item.pvName){
              _check ++
            }
          })
          if(_check > 1){
            rs.mulOptions[idx].pvName = ''
            this.getToast('属性值已存在')
            return false
          }
        }
      },
      //多选自定义勾选时 逻辑处理
      mulSelect(idx,event,sIdx){
        if(!event.target.checked){
          return false
        }
        let _length = 0
        this.goodsPropertyConfig[idx].mulOptions.map((item,id)=>{
          if(sIdx != id && item.pvName == ''){
            _length ++
          }
        })
        if(_length < 1){
          let opt = {
            pvName:'',
            propertyNameId: this.goodsPropertyConfig[idx].propertyNameId
          }
          this.goodsPropertyConfig[idx].mulOptions.push(opt)
        }
//        console.log(this.goodsPropertyConfig[idx])
      },
      //管理SKU表格显示
      tableRowClassName(row, index) {
        if (index === 0) {
          return 'sale-unit-row';
        } else{
          return '';
        }

      },
      deliverCodeFocus(val,line,colomn){
        if (this.editType == 'edit' && val) {
          this.deliverCodePre = val
        }
      },
      deliverCodeBlur(val,line,colomn){
        if (this.editType == 'edit' && this.deliverCodePre && val!=this.deliverCodePre) {
          this.$alert('发货编码为商品发货的重要依据，系统将记录你本次的修改行为，请确保操作准确无误！', '提示', {
            confirmButtonText: '我知道了',
            callback: action => {

            }
          });
        }
      },
      handleSuccess(res){
        if(res.status != 1){
          this.getToast('上传失败')
          return false
        }
        if(res.width != 640 || res.height != 640){
          this.getToast('图片限制640*640并且大小<=400k');
          return false;
        }
        let opts = {
          id:'',
          url:res.url,
          width:res.width,
          height:res.height,
        }
        this.configSaleUnitImages.list[this.configSaleUnitImages.currentSkuImage] = opts
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
      },
      setSkuImageIdx(item){
        this.configSaleUnitImages.currentSkuImage = item
      },
      beforeUpload(file){
//        console.log(file)
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';

        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传头像图片大小不能超过 400KB!');
        }
        this.picUpload.picFile=file
        return isJPG && isLt2M;
      },
      //查看sku主图
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      //删除sku主图
      delProductImage(item){
//        console.log(item)
//        console.log(this.configSaleUnitImages.list[item])
        delete this.configSaleUnitImages.list[item]
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
//        console.log(this.configSaleUnitImages.list)
      },
      //调整供货价
      callEditSkuPrice(){
        this.checkCostPriceAudit({baseGoodsCode:this.goodsDetailFetch.rs.baseGoodsCode})
          .then((rs)=>{
            if(rs == '20221'){
              this.$alert('当前商品存在审核通过但尚未启用的商品调价记录，请等待启用后再申请调价。', '提示', {
                confirmButtonText: '我知道了',
                callback: action => {
                }
              });
              return false
            }
            if(rs == '20220'){
              this.$alert('当前商品存在审核中的商品调价记录，请等待审核结果或撤回审核。', '提示', {
                confirmButtonText: '我知道了',
                callback: action => {
                }
              });
              return false
            }
            if(rs){
                this.callEditPriceCheck()
            } else {
              this.getToast('当前供货价不可修改')
            }
          })
      },
      callEditPriceCheck(){
        this.editSkuPriceModel.list = []
        this.goodsSkuConfig.map((item)=>{
          if(item.isSave){
            let _opt = {
              skuCode:item.skuCode,
              skuName:item.skuName,
              price:item.costPrice,
              status:item.status,
              newPrice:'',
              propertyValue:item.skuName.replace(this.skuSplitStrReg,'-')
            }
            this.editSkuPriceModel.list.push(_opt)
          }
        })
        this.editSkuPriceModel.isShow = true
      },
      submitEditPriceModel(){
        let _check = false,
            skuList = [],
            checkList = this.editSkuPriceModel.list.filter((item)=>item.newPrice === '')
        let reg = /^[0-9]{1}[0-9]*(\.[0-9]{1,2})?$/g

        if(checkList.length == this.editSkuPriceModel.list.length){
          this.getToast('请至少填写一个SKU的调后供货价')
          return false
        }
        for(let i in this.editSkuPriceModel.list){
          let _item = this.editSkuPriceModel.list[i]
          if(_item.newPrice == _item.price){
            this.getToast(_item.skuCode+'调后供货价不能等于当前供货价')
            return false
          }
          let _opt = {
            skuCode:_item.skuCode,
            oldCostPrice:_item.price,
            newCostPrice:_item.newPrice,
            propertyValue:_item.propertyValue
          }
          if(_item.newPrice === ''){

          } else {
            if(!(_item.newPrice+'').match(reg)){
              this.getToast(_item.skuCode+'调后供货价格式不正确')
              return false
            }
//            if(isNaN(_item.newPrice)){
//              this.getToast(_item.skuCode+'调后供货价格式不正确')
//              return false
//            }
            skuList.push(_opt)
          }

        }
//        for(let i in this.editSkuPriceModel.list){
//          let _item = this.editSkuPriceModel.list[i]
//          if(_item.newPrice === ''){
//            this.getToast(_item.skuCode + '调后供货价不能为空')
//            return false
//          }
//          if(isNaN(_item.newPrice)) {
//            this.getToast(_item.skuCode + '调后供货价格式不正确')
//            return false
//          }
//          if(_item.newPrice != _item.price){
//            _check = true
//          }
//          let _opt = {
//            skuCode:_item.skuCode,
//            oldCostPrice:_item.price,
//            newCostPrice:_item.newPrice,
//            propertyValue:_item.propertyValue
//          }
//          skuList.push(_opt)
//        }
//        if(!_check){
//          this.getToast('至少调整一个SKU供货价')
//          return false
//        }
        if(!this.editSkuPriceModel.opts.effectiveDate){
          this.getToast('请选择待启用日期')
          return false
        } else if(!this.editSkuPriceModel.opts.reason){
          this.getToast('请填写调价原因')
          return false
        }
        let _opts = {
          auditCostPriceDetailList:skuList,
          baseGoodsCode:this.goodsDetailFetch.rs.baseGoodsCode,
          baseGoodsId:this.goodsDetailFetch.rs.id,
          ...this.editSkuPriceModel.opts
        }

        _opts.effectiveDate = Util.formatDate('yyyy-mm-dd hh:mm:ss',_opts.effectiveDate)
        let _changeOpts = JSON.parse(JSON.stringify(_opts))
        _changeOpts.auditCostPriceDetailList.map((item)=>{
          item.newCostPrice = (Number(item.newCostPrice) * 100).toFixed(0)
          item.oldCostPrice = (Number(item.oldCostPrice) * 100).toFixed(0)
        })
        this.saveCostPriceAudit(_changeOpts)
          .then((rs)=>{
            this.getToast('提交成功')
            this.cancelEditPriceModel()
          })
      },
      cancelEditPriceModel(){
        this.editSkuPriceModel.isShow = false
        this.editSkuPriceModel.list = []
        this.editSkuPriceModel.opts.reason = ''
        this.editSkuPriceModel.opts.effectiveDate = ''
      },
      //供货价审核记录
      callPricePage(){
        this.skuPriceListModel.isShow = true
        this.skuPriceListModel.opts.page = 1
        this.skuPriceListModel.opts.total = 0
        this.pricePageChange(1)
      },
      pricePageChange(page){
         let _opt = {
           page:page,
           rows:this.skuPriceListModel.opts.rows,
           baseGoodsCode:this.goodsDetailFetch.rs.baseGoodsCode
         }
         this.costPricePageList(_opt)
           .then((rs)=>{
             this.skuPriceListModel.opts.total = rs.total
             this.skuPriceListModel.list = rs.rows || []
           })
      },
      //撤销供货价
      callWithdrawCostPriceAudit(){
        this.$confirm('是否确认撤回调价申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.checkWithdrawConstPriceAudit()
        }).catch(() => {
        });
      },
      checkWithdrawConstPriceAudit(){
        this.withdrawCostPriceAudit({baseGoodsCode:this.goodsDetailFetch.rs.baseGoodsCode})
          .then(()=>{
            this.pricePageChange(this.skuPriceListModel.opts.page)
          })
      },
      cancelSkuPriceListModel(){
        this.skuPriceListModel.isShow = false
      },
      headerTitle(createElement) {

        let label = 'SKU码-销售属性值-原供货价-调价类型-调后供货价',
          arr = label.split('-'),
          createArr = []
        arr.map((item)=>{
          createArr.push(createElement('div', {class: {'split-title':true}}, item))
        })
        return createElement(
          'div',
          createArr
        );
      },
      getToast(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
      saveProduct(){
        let otherObj = {
          id: this.goodsId?this.goodsId:''
        }
        let opts = Object.assign({},this.saveProductEdit,otherObj)
        if(!opts.name){
          this.getToast('请填写商品名称')
          return false
        }
        if(!opts.sellingPoint){
          this.getToast('请填写卖点文案')
          return false
        }
        if(!opts.brandId){
          this.getToast('请选择品牌')
          return false
        }
        if(!this.shipAreaValue.length){
          this.getToast('请选择发货地')
          return false
        }
        opts.categoryId = this.selectCategoryId
        opts.skuArray = JSON.parse(JSON.stringify(this.goodsSkuConfig))
        opts.deliverAreas = []
        this.shipAreaValue.map((item,i)=>{
          let tempId =  this.mapDelTempList[item] | 0
          opts.deliverAreas.push({
            deliverAreaId: item,
            deliverAreaTemplateId:tempId
          })
        })
        opts.skuImages = []
        let mapSkuDeliverCode = {}
        if(!opts.skuArray.length){
          this.getToast('请选择一个销售属性创建SKU')
          return false
        }
        for(let i = 0;i<opts.skuArray.length;i++){
          let num = 0
          let item = opts.skuArray[i]
          let properties = []
          item.deliverAreas = []
          item.grossWeight = item.grossWeight
          item.marketPrice = item.marketPrice != '' ?  (Number(item.marketPrice) * 100).toFixed(0) : item.marketPrice
          item.retailPrice = item.retailPrice != ''? (Number(item.retailPrice) * 100).toFixed(0) : item.retailPrice
          item.costPrice = item.costPrice != '' ? (Number(item.costPrice) * 100).toFixed(0): item.costPrice
          if(!this.noSalePro){
            let arr = item.skuName.indexOf(this.skuSplitStr) >-1 ? item.skuName.split(this.skuSplitStr) : [item.skuName]
            let salePro = JSON.parse(JSON.stringify(this.goodsPropertyConfig.filter((_item)=>!_item.isOther && _item.propertyType ==2 && item.skuId.includes(_item.propertyNameId))))
            arr.map((subItem,idx)=>{
              let temp = salePro[idx]?salePro[idx].options.concat(salePro[idx].mulOptions):null
              if (temp) {
                temp.map((del)=>{
                  if(del.pvName == subItem){
                    properties.push(del)
                  }
                })
              }
            })
          }
          if(this.saleUnitDis && this.saleUnitDisType == 2) {
            this.$alert('SKU与商品类目的销售属性不相符，请先在销售属性列表中完成【修改属性】操作。', '提示', {
              confirmButtonText: '我知道了',
              callback: action => {
              }
            })
            return
          }
          let reg1 = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
          let reg2 = /\s/g
          let regNum = /^\d{1,}$/g
//          if(!item.barcode){
//            this.getToast('商品条码不能为空')
//            return false
//          }
//          if (reg1.test(item.barcode) || reg2.test(item.barcode)) {
//            this.getToast('商品条码不允许带空格和中文')
//            return false
//          }
          if(item.grossWeight === ''){
            this.getToast('SKU商品毛重不能为空')
            return false
          } else if(!(item.grossWeight+'').match(regNum)){
            this.getToast('SKU商品毛重请填写整数')
            return false
          } else if(Number(item.grossWeight) == 0){
            this.getToast('SKU商品毛重不能为0')
            return false
          }
          if(item.marketPrice === ''){
            this.getToast('SKU商品市场价不能为空')
            return false
          } else if(!(item.marketPrice+'').match(regNum)){
            this.getToast('SKU商品市场价格式不正确')
            return false
          } else if(item.retailPrice === ''){
            this.getToast('SKU商品建议售价不能为空')
            return false
          }else if(!(item.retailPrice+'').match(regNum)){
            this.getToast('SKU商品建议售价格式不正确')
            return false
          } else if(item.costPrice === ''){
            this.getToast('SKU商品供货价不能为空')
            return false
          }else if(!(item.costPrice+'').match(regNum)){
            this.getToast('SKU商品供货价格式不正确')
            return false
          }

          this.shipAreaValue.map((shId)=>{
              let _opt = {
                deliverAreaId: shId,
                deliverCode: item['code'+shId]
              }
            item.deliverAreas.push(_opt)
          })
          for(let i=0;i<item.deliverAreas.length;i++){
            if(item.deliverAreas[i].deliverCode === '' || typeof(item.deliverAreas[i].deliverCode) === 'undefined'){
              this.getToast('发货编码不允许为空')
              return false
            }
            if(!(item.deliverAreas[i].deliverCode+'').match(RegExpType.deliverCode)){
              this.getToast('发货编码格式不正确')
              return false
            }
//            if (reg1.test(item.deliverAreas[i].deliverCode) || reg2.test(item.deliverAreas[i].deliverCode)) {
//              this.getToast('发货编码不允许带空格和中文')
//              return false
//            }
            if(mapSkuDeliverCode[item.deliverAreas[i].deliverAreaId] && mapSkuDeliverCode[item.deliverAreas[i].deliverAreaId] == item.deliverAreas[i].deliverCode){
                this.getToast(this.shipAreaOptions.filter((obj)=>obj.deliverAreaId==item.deliverAreas[i].deliverAreaId)[0].deliverAreaName+'发货编码重复')
                return false
            }
            mapSkuDeliverCode[item.deliverAreas[i].deliverAreaId] = item.deliverAreas[i].deliverCode
          }

          item.properties = properties
        }

        let properties = []
        let goodsPropertyConfig = this.goodsPropertyConfig.filter((item)=>!item.isOther)
        for(let i = 0;i<goodsPropertyConfig.length;i++){
          let item = goodsPropertyConfig[i]
          if(item.inputType == 6){
            item.selected = item.selected ? Util.formatDate('yyyy-mm-dd',item.selected) : item.selected
          }
          if(item.inputType == 7){
            item.selected = item.selected ? Util.formatDate('yyyy-mm-dd hh:mm:ss',item.selected) : item.selected
          }
          if((item.propertyType == 1) && (!item.selected || item.selected.length < 1)){
            this.getToast('请选择'+item.propertyName+'属性值')
            return false
          }
          if((item.propertyType == 3 || item.propertyType == 2 ) && item.isRequired && (!item.selected || item.selected.length < 1)){
            this.getToast('请选择'+item.propertyName+'属性值')
            return false
          }
          if(!this.baseGoodsId && item.propertyType == 2 && item.selected.length > 19){
            this.getToast('销售属性项'+item.propertyName+'属性值不超过20个')
            return false
          }
          let _opts = {
            propertyNameId:item.propertyNameId,
            propertyType:item.propertyType,
            propertyPairs:[],
          }
          let arr = []
          if(item.selected){
            arr = Object.prototype.toString.call(item.selected) === '[object Array]' ? item.selected : [item.selected]
          }
          arr.map((pv)=>{
            let _opt = {
              propertyNameId:item.propertyNameId,
              pvName:pv,
            }
            _opts.propertyPairs.push(_opt)
          })
          properties.push(_opts)
        }
        opts.properties = properties
        if(this.configSaleUnitImages.isRequiredImage){
           if(Object.keys(this.configSaleUnitImages.list).length != this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.length){
             this.getToast('请上传SKU主图')
             return false
           }
//          if (this.configSaleUnitImages.list.length>22) {
//          	this.getToast('详情图不能超过22张')
//          }

          for(let i in this.configSaleUnitImages.list){
            let item = this.configSaleUnitImages.list[i]
            if(!item){
              this.getToast('请上传'+i+'SKU主图')
              return false
            }
            item.propertyPairId = ''
//            console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].options)
            this.goodsPropertyConfig[this.configSaleUnitImages.idx].options.map((pro)=>{
              if(pro.pvName == i){
                item.propertyPairId = pro.id
              }else{
                item.pvName = i
              }
            })
            item.propertyNameId = this.configSaleUnitImages.skuImagePropertyNameId
            opts.skuImages.push(item)
          }
        }
        if(!this.productUpload.images.length){
          this.getToast('请上传商品主图')
          return false
        }
        opts.images = this.productUpload.images
        for(let i=0,length=opts.images.length;i<length;i++){
          opts.images[i].sortOrder = (length-i)*10
        }
        for(let i=0,length=opts.skuImages.length;i<length;i++){
          opts.skuImages[i].sortOrder = (length-i)*10
        }
        if(!this.productUpload.detail){
          this.getToast('请填写商品详情')
          return false
        }
        let _lenDetail = this.productUpload.detail.match(/<img src=/g) ? this.productUpload.detail.match(/<img src=/g).length : 0
        if(_lenDetail > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
        opts.detail = this.productUpload.detail
        opts.baseGoodsCode = this.baseGoodsCode ? this.baseGoodsCode : ''
////        console.log(opts)
//        debugger
//        return false
        this.saveBaseGoods(opts)
          .then((rs)=>{
            if(rs && (rs.code == '20262' || rs.code == '30600004')){
              this.$alert(rs.msg, '提示', {
                confirmButtonText: '我知道了',
                callback: action => {
                }
              });
              return false
            }
            this.getToast('提交成功')
//            this.$router.back()
              this.$router.push({
                name: 'productAudit'
              })

          })
      },
    },
    components:{
      vUpload
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .mg-r {
    span {
      text-align: right;
    }
  }
  .hide-click {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .input-item-large{
    width: 300px;
  }
  .input-item-large-select{
    width: 280px;
  }
  .input-item-large-title{
    width: 600px!important;
  }
  .mg-b-h{
    margin: 0px 10px 0px 0px;
    line-height: 30px;
  }
  .avatar-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      width: 100px;
      height: 100px;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
  }
  .avatar-uploader{
    width: 100px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .property-box{
    position: relative;
    display: block;
    .inline-box{
      max-width: 85%;
      line-height: 30px;
    }
    .label-sign{
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .property-layout-box{
    .label-sign{
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
    .inline-box{
      max-width: 430px;
      line-height: 30px;
    }
  }
  .base-box{
    .label-sign{
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .block-box{
    padding: 10px 0 0 0 !important;
  }
  .inline-box{
    margin-bottom: 0;
  }
  .label-float-layout{
    position: relative;
    overflow: hidden;
    .label-sign-wrap{
      float: left;
      .label-sign{
        display: inline-block;
        line-height: 30px;
      }
    }
  }
  .mask-box-wrap{
    position: relative;
    .mask-box{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      z-index: 9;
    }
  }
  .table-item-text{
    padding:10px;
    text-align: left;
  }
  .line-wrap{
    width: 520px;
    border-top: 1px solid #ecdfdf;
    overflow: hidden;
    &:nth-child(1){
      border-top: none;
    }
    p{
      float: left;
      width: 104px;
      padding: 10px 0;
    }
  }
</style>
