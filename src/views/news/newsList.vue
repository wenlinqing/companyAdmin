<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" size="medium">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getArticleList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="articleList" highlight-current-row @selection-change="selsChange" style="width: 100%;" border>
			<el-table-column type="selection" width="55" align='center'>
			</el-table-column>
			<el-table-column type="index" width="60" align='center'>
			</el-table-column>
			<el-table-column prop="title" label="标题" min-width="300">
			</el-table-column>

			<el-table-column label="上下架" min-width="80" align='center'>
				<template slot-scope="scope">
					<i v-if="scope.row.isEnabled==1">已上架</i>
					<i v-if="scope.row.isEnabled==0" style="color:#f00">已下架</i>
				</template>
			</el-table-column>
			<el-table-column prop="hits" label="阅读量" min-width="80" sortable align='center'>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" min-width="180" sortable align='center'>
				<template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
			</el-table-column>
			<el-table-column prop="modify_time" label="修改时间" min-width="180" sortable align='center'>
				<template slot-scope="scope">{{scope.row.modify_time|formatDate}}</template>
			</el-table-column>
			<el-table-column label="操作" min-width="180" align='center'>
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="primary" size="mini" @click="handleEnabled(scope.row)">{{scope.row.isEnabled==1?'下架':'上架'}}</el-button>
					<el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="80%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader"
            :action="serverUrl"
            name="img"
            :headers="header"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload" style="display:none;">
          </el-upload>
          <quill-editor
            v-model="editForm.content"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)">
          </quill-editor>

				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加啊</el-button>
        <el-button v-else type="primary" @click="updateData">修改啊</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction
    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image'],
    ['clean']
 
  ]
export default {
  data() {
    return {
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      content: null,
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      serverUrl: '/api/uploads',  // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      },



      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      dialogFormVisible: false,
      filters: {
        name: "",
      },
      articleList: [],
      total: 0,
      page: 1,
      pageSize:5,
      sels: [], //列表选中列

      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
        title: "",
        content: "",
        modify_time: ""
      },
    };
  },
  mounted() {
    this.getArticleList();
    // console.log( window.location.protocol+'//'+window.location.hostname+':3000')
    // console.log(this.imgUrl)
  },
  methods: {
    onEditorChange({editor, html, text}) {//内容改变事件
      // console.log("---内容改变事件---")
      this.content = html
      // console.log(html)
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      // console.log(res);
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code == 200 ) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', this.GLOBAL.imgUrl+res.newFileName)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },



    handleCurrentChange(val) {
      this.page = val;
      this.getArticleList();
    },
    //获取文章列表
    getArticleList() {
      this.$api.post('/getArticleList',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filters.name,
      },result=>{
	      this.articleList=result.list;
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
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.editForm = {
        id: "",
        title: "",
        content: "",
        modify_time: ""
			}
    },
    //编辑
    updateData:function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editForm.content=this.content;
              this.editForm.modify_time=moment(new Date()).format('YYYY-MM-DD h:mm:ss');
              /*console.log(this.editForm)
              return */

              this.$api.post('/editArticle',this.editForm,result=>{
              	this.dialogFormVisible=false;
					      this.$dialog.toast({
					          mes: '修改成功',
					          timeout: 1500,
					          callback: () => {
	                    this.getArticleList();
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
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
    //新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editForm.content=this.content;
              this.editForm.modify_time=moment(new Date()).format('YYYY-MM-DD h:mm:ss');
              /*console.log(this.editForm)
              return */

              this.$api.post('/addArticle',this.editForm,result=>{
              	this.dialogFormVisible=false;
					      this.$dialog.toast({
					          mes: '添加成功',
					          timeout: 1500,
					          callback: () => {
	                    this.getArticleList();
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
            .catch(e => {
              // 打印一下错误
              console.log(e);
            });
        }
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
      .then(() => {
        this.$api.post('/deleteArticle',{id:row.id},result=>{
        	if (this.articleList.length==1 && this.page!=1) {
       			--this.page
       		}
		      this.$dialog.toast({
		          mes: '删除成功',
		          timeout: 1500,
		          callback: () => {
                this.getArticleList();
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
      .catch(() => {});
    },
    //全选单选多选
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
      .then(() => {
      	console.log(ids)
      	// return 
       this.$api.post('/deleteArticle',{id:ids},result=>{
       		if ( (this.sels.length==this.articleList.length) && this.page!=1) {
       			--this.page
       		}
		      this.$dialog.toast({
		          mes: '删除成功',
		          timeout: 1500,
		          callback: () => {
                this.getArticleList();
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
      .catch(() => {});
    },
    // 上下架
    handleEnabled(row){
    	this.$api.post('/enabledArticle',{
    		id:row.id,
    		isEnabled:row.isEnabled==1?0:1,
    	},result=>{
	      this.$dialog.toast({
	          mes: '操作成功',
	          timeout: 1500,
	          callback: () => {
              this.getArticleList();
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
.el-form-item /deep/ .ql-editor .ql-blank,.el-form-item /deep/ .ql-editor {
  height: 350px;
}
</style>
