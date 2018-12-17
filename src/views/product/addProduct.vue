<template>
<div class="formBox">
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
	  <el-form-item label="商品名称" prop="product_name">
	    <el-input v-model="ruleForm.product_name"></el-input>
	  </el-form-item>
	  <el-row>
	  	<el-col :span="11">
	      <el-form-item label="商品数量" prop="product_quantity">
		    <el-input type="number" v-model="ruleForm.product_quantity"></el-input>
		  </el-form-item>
	    </el-col>
	    <el-col class="line" :span="2">&nbsp;</el-col>
	    <el-col :span="11">
	      <el-form-item label="商品重量" prop="product_weight">
		    <el-input type="number" v-model.number="ruleForm.product_weight"></el-input>
		  </el-form-item>
	    </el-col>
	  </el-row>

	  <el-row>
	  	<el-col :span="11">
	      <el-form-item label="商品价格" prop="price">
		    <el-input type="number" v-model.number="ruleForm.price"></el-input>
		  </el-form-item>
	    </el-col>
	    <el-col class="line" :span="2">&nbsp;</el-col>
	    <el-col :span="11">
	      <el-form-item label="市场价" prop="market_price">
		    <el-input type="number" v-model.number="ruleForm.market_price"></el-input>
		  </el-form-item>
	    </el-col>
	  </el-row>

	  <el-row>
	  	<el-col :span="11">
	      <el-form-item label="是否新品" prop="new_flag">
		    <el-radio-group v-model="ruleForm.new_flag">
			    <el-radio :label="1">是</el-radio>
			    <el-radio :label="0">否</el-radio>
			</el-radio-group>
		  </el-form-item>
	    </el-col>
	    <el-col class="line" :span="2">&nbsp;</el-col>
	    <el-col :span="11">
	      <el-form-item label="是否特价" prop="promote_flag">
		    <el-radio-group v-model="ruleForm.promote_flag">
			    <el-radio :label="1">是</el-radio>
			    <el-radio :label="0">否</el-radio>
			</el-radio-group>
		  </el-form-item>
	    </el-col>
	  </el-row>
	  <div v-if="ruleForm.promote_flag==1">
		  <el-form-item label="促销价格" prop="promote_price">
		    <el-input type="number" v-model.number="ruleForm.promote_price"></el-input>
		  </el-form-item>

		  <el-form-item label="促销时间">
		    <el-col :span="11">
		      <el-form-item prop="promote_start_time">
		        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="促销开始时间" v-model="ruleForm.promote_start_time" style="width: 100%;"></el-date-picker>
		      </el-form-item>
		    </el-col>
		    <el-col class="line" :span="2" style="text-align:center">-</el-col>
		    <el-col :span="11">
		      <el-form-item prop="promote_end_time">
		        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="促销结束时间" v-model="ruleForm.promote_end_time" style="width: 100%;"></el-date-picker>
		      </el-form-item>
		    </el-col>
		  </el-form-item>
	  </div>

	  <el-form-item label="商品描述" prop="keywords">
	    <el-input type="textarea" v-model="ruleForm.keywords"></el-input>
	  </el-form-item>
	  <el-form-item label="商品图片" prop="product_image" >
	    <el-upload
				class="upload-demo"
				ref="upload"
				:action="this.GLOBAL.upLoadHost"
				list-type="picture"
				:limit="1" 
				:on-remove="handleRemove"
				:on-exceed="overLimit"
				:on-success="upLoadsSuccess"
				:auto-upload="true">
					<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					<!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
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
	        v-model="ruleForm.content"
	        ref="myQuillEditor"
	        :options="editorOption"
	        @change="onEditorChange($event)">
	      </quill-editor>

		</el-form-item>
	  <br/><br/>


	  <el-form-item>
	    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
	    <el-button @click="resetForm('ruleForm')">重置</el-button>
	  </el-form-item>
	</el-form>
</div>
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

        ruleForm: {
          product_name: '农家有机大米',
          product_quantity: 300,
          product_weight:500,
          price:5.5,
          market_price:6.0,
          new_flag:1,
          promote_flag:1,
          promote_price:5.00,
          promote_start_time: '',
          promote_end_time: '',
          keywords: '农家有机大米，无农药，绿色健康',
          product_image:'',
          content:'',
        },
        rules: {
          product_name: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          product_quantity: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', message: '必须为数字值'}
          ],
          product_weight: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', message: '必须为数字值'}
          ],
          price: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', message: '必须为数字值'}
          ],
          market_price: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', message: '必须为数字值'}
          ],

          promote_flag: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          promote_price: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', message: '必须为数字值'}
          ],
          promote_start_time: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          promote_end_time: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],

          keywords: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          product_image: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        },
      };
    },
    created(){
    	// console.log((moment().format('YYYYMMDD')).toString() + Date.now().toString().substr(0,10))
    	// console.log(Date.now())
    	// console.log('this.IMGRUL',this.GLOBAL.imgUrl )
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


     submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            // console.log(this.ruleForm)
            // return false
            this.$api.post('/product/add',this.ruleForm,result=>{
						  this.$dialog.toast({
						      mes: '添加成功',
						      timeout: 1500,
						      icon: 'success'
						  });
						},err=>{
						  this.$dialog.toast({
						      mes: err.msg,
						      timeout: 1500,
						      icon: 'error'
						  });
						})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},

		submitUpload() {
			this.$refs.upload.submit();
		},
		handleRemove(file, fileList) {
			this.ruleForm.product_image='';
			console.log(file, fileList);
		},
		upLoadsSuccess(response, file, fileList) {
			this.ruleForm.product_image=response.newFileName
			// console.log(response);
		},
		overLimit(files, fileList){
			this.$dialog.toast({
			    mes: '只能上传1张',
			    timeout: 1500,
			});
		}
    }
  }
</script>

<style scoped>
.formBox{padding:30px 20%;}
.el-form-item /deep/ .ql-editor .ql-blank,.el-form-item /deep/ .ql-editor {
  height: 350px;
}
</style>