<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" size="medium">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProductList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增商品</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="productList" highlight-current-row style="width: 100%;" border>
			<!-- <el-table-column type="selection" width="55" align='center'>
			</el-table-column> -->
			<el-table-column type="index" width="60" align='center'>
			</el-table-column>
			<el-table-column prop="product_name" label="商品名称" min-width="200">
			</el-table-column>

			<el-table-column prop="product_quantity" label="库存" min-width="100" sortable align='center'>
				<!-- <template slot-scope="scope">
					<i v-if="scope.row.isEnabled==1">已上架</i>
					<i v-if="scope.row.isEnabled==0" style="color:#f00">已下架</i>
				</template> -->
			</el-table-column>
			<el-table-column prop="sale_num" label="销售数" min-width="100" sortable align='center'>
			</el-table-column>
      <el-table-column prop="price" label="商品价格" min-width="100" sortable align='center'>
      </el-table-column>
      <el-table-column prop="market_price" label="市场价" min-width="100" sortable align='center'>
      </el-table-column>
      <el-table-column label="商品图片" min-width="110" align='center'>
        <template slot-scope="scope">
          <div style="padding:5px;"><img :src="imgUrl+scope.row.product_image" v-if="scope.row.product_image" style="max-width:50px;max-height:50px"></div>
        </template>
      </el-table-column>


			<el-table-column prop="create_time" label="创建时间" min-width="120" sortable align='center'>
				<template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
			</el-table-column>
			<!-- <el-table-column prop="update_time" label="修改时间" min-width="180" sortable align='center'>
				<template slot-scope="scope">{{scope.row.modify_time|formatDate}}</template>
			</el-table-column> -->
			<el-table-column label="操作" min-width="180" align='center'>
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">库存变更</el-button>
					<el-button type="primary" size="mini" @click="handleEnabled(scope.row)">{{scope.row.isEnabled==1?'下架':'上架'}}</el-button>
					<el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
export default {
  data() {
    return {
      imgUrl:this.GLOBAL.imgUrl,

      filters: {
        name: "",
      },
      productList: [],
      total: 0,
      page: 1,
      pageSize:20,
      sels: [], //列表选中列
    };
  },
  mounted() {
    this.getProductList();
    // console.log( moment().format('YYYY-MM-DD HH:mm:ss') )
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getProductList();
    },
    //获取文章列表
    getProductList() {
      this.$api.post('/product/getProductList',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filters.name,
      },result=>{
	      this.productList=result.list;
	      this.total=result.totals
	    },err=>{
	      this.$dialog.toast({
	          mes: err.msg,
	          timeout: 1500,
	          icon: 'error'
	      });
	    })
    },
    
    //显示编辑界面
    handleEdit: function(index, row) {
      this.$prompt('请输入库存', '提示', {
        closeOnClickModal:false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /^\d+/g,
        // inputErrorMessage: '只能输入数字'
      }).then(({ value }) => {
        // console.log(value)
        if(!isNaN(value)&&value){
          this.$api.post('/product/editQuantity',{
            product_id:row.product_id,
            product_quantity:value,
          },result=>{
            this.$dialog.toast({
                mes: '操作成功',
                timeout: 1500,
                callback: () => {
                  this.getProductList();
                }
            });
          },err=>{
            this.$dialog.toast({
                mes: err.msg,
                timeout: 1500,
                icon: 'error'
            });
          })
        }else{
          this.$dialog.toast({
              mes: '请输入库存',
              timeout: 1500,
              icon: 'error'
          });
        }
      })

    },
    //显示新增界面
    handleAdd: function() {
      this.$router.push('/addProduct')
    },
    
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
      .then(() => {
        this.$api.post('/product/delete',{product_id:row.product_id},result=>{
        	if (this.productList.length==1 && this.page!=1) {
       			--this.page
       		}
		      this.$dialog.toast({
		          mes: '删除成功',
		          timeout: 1500,
		          callback: () => {
                this.getProductList();
              }
		      });
		    },err=>{
		      this.$dialog.toast({
		          mes: err.msg,
		          timeout: 1500,
		          icon: 'error'
		      });
		    })
      })
    },
    
    // 上下架
    handleEnabled(row){
    	this.$api.post('/product/enabledProduct',{
    		product_id:row.product_id,
    		isEnabled:row.isEnabled==1?0:1,
    	},result=>{
	      this.$dialog.toast({
	          mes: '操作成功',
	          timeout: 1500,
	          callback: () => {
              this.getProductList();
            }
	      });
	    },err=>{
	      this.$dialog.toast({
	          mes: err.msg,
	          timeout: 1500,
	          icon: 'error'
	      });
	    })
    }
  },
  
};
</script>

<style scoped>
.el-table /deep/ thead{color: #1f2d3d;}
.el-table /deep/ th{height: 40px;padding:0;background-color: #eef1f6;}
.el-table /deep/ td{height: 40px;padding:0;}

</style>