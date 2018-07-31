new Vue({
	el:'#app',
	data:{
		shopNum:0,
		//购物车里的数据
		shopAllList:[],	
		//是否全选	
		isSelected:false,
		//所有商品的总价格
		totalPrice:0,
		//删除面板是否显示
		isShow:false,
		//删除指定商品
		currentShop:{}
	},
	//组件加载完毕，请求网络数据
	mounted(){
		//请求json数据
		this.getData();
	},
	methods:{
		//请求json数据
		getData(){
			this.$http.get("data/data.json").then(response=>{			
				const res=response.body;
				if(res){
					this.shopAllList=res.allShops.shopList;
					console.log(this.shopAllList)
				}
			},response=>{
				alert("请求数据失败");
			})
		},

		//计算购物车数量
		getShopNum(shopNum){
			return this.shopNum=this.shopAllList.length;
		},

		//格式化价格
		moneyFormat(str){
			return "￥"+str.toFixed(2)
		},
		//计算单个商品数量加减
		singlePrice(shop,flag){
			if (flag) {
				shop.shopNumber+=1;  //加
			}else{
				if (shop.shopNumber<=1) {
					shop.shopNumber=1
				}else{
					shop.shopNumber-=1  //减
				}
			}
			//计算总价格
			this.getTotalPrice()
		},
		selectedAll(flag){
			//控制所有商品
			this.isSelected=!flag;	
			//控制每个商品	
			this.shopAllList.forEach((value,index)=>{      //value代表每个shop
				if (typeof value.checked==='undefined') {
					this.$set(value,'checked',!flag)
				}else{
					value.checked=!flag
				}
			});
			//计算总价格
			this.getTotalPrice()
			},
		//计算商品总价格
		getTotalPrice(){
			var totalPrice=0
			this.shopAllList.forEach((value,index)=>{
				if (value.checked) {
					totalPrice+=(value.shopPrice*value.shopNumber)
				}
			});
			this.totalPrice=totalPrice;
		},
		//单个商品的选中
		singleSelect(shop){
			if (typeof shop.checked==='undefined') {
				this.$set(shop,'checked',true)
			}else{
				shop.checked=!shop.checked;
			}
			//计算总价格
			this.getTotalPrice();
			//判断是否全选
			this.hasSelectedAll();
		},
		//判断是否通过单个商品全选
		hasSelectedAll(){
			var flag=true;
			this.shopAllList.forEach((value,index)=>{
				if (!value.checked) {
					flag=false;
				}
			});
			this.isSelected=flag;
		},
		//显示删除面板
		delDesk(shop){
			this.isShow=true;
			this.currentShop=shop;
		},
		//隐藏删除面板
		hideDelDesk(){
			this.isShow=false;
		},
		//垃圾桶删除
		delShop(){			
			this.hideDelDesk();
			var index=this.shopAllList.indexOf(this.currentShop);
			this.shopAllList.splice(index,1);
			//计算商品总价格
			this.getTotalPrice()
		}
	}
})