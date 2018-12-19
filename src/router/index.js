import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'  // 普通加载

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: '',
      hidden: true,
      component: resolve => require(['@/views/login'], resolve),
      meta:{
      	title:'登录'
      }
    },
    {
      path:'*',
      name:'',
      hidden: true,
      component: resolve => require(['@/views/404'], resolve),
      meta:{
      	title:'404'
      }
    },
    {
      path: '/',
      name: '管理员管理',
      iconCls: 'el-icon-message',
      // leaf: true,//只有一个节点
      component: resolve => require(['@/views/home'], resolve),
      children:[
      	{
      		path: '/administrators',
      		name:'管理员列表',
      		component: resolve => require(['@/views/administrators'], resolve),
          meta:{requireAuth:true},
      	}
      ]
    },
    {
      path: '/',
      name: '商品管理',
      iconCls: 'el-icon-message',
      // leaf: true,//只有一个节点
      component: resolve => require(['@/views/home'], resolve),
      children:[
        {
          path: '/productList',
          name:'商品列表',
          component: resolve => require(['@/views/product/productList'], resolve),
          meta:{requireAuth:true},
        },
        {
          path: '/addProduct',
          name:'添加商品',
          component: resolve => require(['@/views/product/addProduct'], resolve),
          meta:{requireAuth:true},
        }
      ]
    },
    {
      path: '/',
      name: '新闻管理',
      iconCls: 'el-icon-message',
      component: resolve => require(['@/views/home'], resolve),
      children:[
      	{
      		path: '/newsList',
      		name:'新闻列表',
      		component: resolve => require(['@/views/news/newsList'], resolve),
          meta:{requireAuth:true},
      	}
      ]
    },
  ]
})

router.beforeEach((to,from,next)=>{
	if (to.path == '/login') {
		sessionStorage.removeItem('loginName');
	}
	let loginName = sessionStorage.getItem('loginName')
	if (!loginName && to.path != '/login') {
		next({path: '/login'})
	}else{
		next()
	}
})


export default router