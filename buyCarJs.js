/**
 * Created by liqiankun on 2018/1/28.
 */
window.onload = function () {
	// var cartTable = document.getElementById('cartTable');
	// var tr = cartTable.children[1].rows;//.rows是表格中的特有属性，就是获取当前下的所有的行（tr）
	// var checkInputs = document.getElementsByClassName('check');
	// var checkAllInputs = document.getElementsByClassName('check-all');

	//由于IE浏览器不兼容document.getElementsByClassName的写法，所以要兼容

	if(document.getElementsByClassName){
		document.getElementsByClassName = function(cls){
			var ret = [];
			var eles =document.getElementsByTagName('*');
			for(var i=0, len = eles.length;i<len;i++){
				console.log('jjj:',eles[i])
				if(eles[i] === cls
					|| eles[i].indexOf(cls + ' ')
					|| eles[i].indexOf(' ' + cls + ' ')
					|| eles[i].indexOf(' '+cls)
				){
					ret.push(eles[i]);
				}
			}
			return ret;
		}
	}
	var cartTable = document.getElementById('cartTable');
	var tr = cartTable.children[1].rows;//.rows是表格中的特有属性，就是获取当前下的所有的行（tr）
	var checkInputs = document.getElementsByClassName('check');//每一行的选择按钮
	var checkAllInputs = document.getElementsByClassName('check-all');//两个全选按钮
	var seletedTotal = document.getElementById('seletedTotal');//总的 已选择商品数
	var priceTotal = document.getElementById('priceTotal');//总的 已选择商品钱数

	var foot = document.getElementById('foot');
	var selected = document.getElementById('selected');//显示已选商品的按钮
	var selectedViewList = document.getElementById('selectedViewList');//存放已选商品的图片
	var deleteAll = document.getElementById('deleteAll');
	//计算总价
	function getTotal(){
		var seleteNum = 0;
		var price = 0;
		var HTMLstr = '';
		for(var j=0;j<tr.length;j++){
			console.log('here:',tr[j].getElementsByClassName('check')[0].checked)
			if(tr[j].getElementsByClassName('check')[0].checked){
				console.log('inner:',HTMLstr)
				tr[j].style.background = 'RGB(238,246,255)';
				seleteNum += parseInt(tr[j].getElementsByClassName('count-input')[0].value) ;
				price += parseFloat(tr[j].getElementsByClassName('subtotal')[0].innerHTML);
				HTMLstr += '<div><img src="' +tr[j].getElementsByTagName('img')[0].src+ ' " alt=""><span class="del" index="'+j+'">取消商品</span></div>'
				console.log('inner2:',HTMLstr);
			}else{
				tr[j].style.background = '';
			}
		}
		if(seleteNum ===0){
			foot.className = 'foot'
		}

		seletedTotal.innerHTML = seleteNum;
		priceTotal.innerHTML = price.toFixed(2);
		selectedViewList.innerHTML = HTMLstr;
		console.log('out:',HTMLstr)
	}

	for(var i=0;i<checkInputs.length;i++){//循环元素添加事件
		checkInputs[i].onclick=function () {
			if(this.className === 'check-all check'){
				for(var k=0;k<checkInputs.length;k++){
					checkInputs[k].checked = this.checked;
				}
			}
			if(!this.checked){
				for(var p=0;p<checkAllInputs.length;p++){
					checkAllInputs[p].checked = false;
				}
			}
			// console.log(this.parentNode.parentNode,'111')

			getTotal()
		}
	}

	selected.onclick = function () {
		console.log('1')
		if(foot.className === 'foot'){
			console.log('2')
			if(seletedTotal.innerHTML!=0){
				foot.className = 'foot show'
			}

		}else{
			console.log('3')
			foot.className = 'foot'
		}
	}

	selectedViewList.onclick = function(ev){
		var e = ev || window.event;
		console.log('e:',e);

		var el = e.srcElement;
		if(el.className=='del'){
			var index=el.getAttribute('index');
			var input = tr[index].getElementsByClassName('check')[0];
			input.checked = false;
			input.onclick();
		}
	}

//小记 计算
	function subTotal(tr){
		var tds = tr.cells;//取每一行的小格；
		console.log('tes:',tds);
		var price = parseFloat(tds[2].innerHTML);
		var count = tr.getElementsByClassName('count-input')[0].value;
		var subTotal = parseFloat(count * price).toFixed(2);
		tds[4].innerHTML = subTotal;
	}
	for(var i=0;i<tr.length;i++){
		tr[i].onclick = function (ev) {
			ev = ev || window.event;
			var el = ev.srcElement;
			var cls = el.className;
			var input = this.getElementsByClassName('count-input')[0];
			var inputNum = parseInt(input.value);
			var reduceEle = this.getElementsByTagName('span')[1];

			switch (cls){
				case 'add':
					input.value = inputNum + 1;
					if(input.value>1){
						reduceEle.innerHTML = '-'
					}
					subTotal(this);
					break;
				case 'reduce':
					if(input.value>1){
						input.value = inputNum - 1;
					}
					if(input.value<=1){
						reduceEle.innerHTML=''
					}
					subTotal(this);
					break;
				case 'delete':
					var conf = confirm('确定删除吗？');
					if(conf){
						this.parentNode.removeChild(this);//原生中只有父级删除子级；
					}
					break;
				default:
					break;

			}
			getTotal()
		}

		tr[i].getElementsByClassName('count-input')[0].onkeyup = function () {
			var val = parseInt(this.value);
			var tr = this.parentNode.parentNode;
			var reduce = tr.getElementsByClassName('reduce')[0];
			console.log('val:',val);
			if(isNaN(val) || val<1){
				val = 1;
			};
			this.value = val;
			if(this.value<=1){
				reduce.innerHTML=''
			}else{
				reduce.innerHTML='-'
			}
			subTotal(tr);
			getTotal()
		}
	}

	deleteAll.onclick = function () {
		if(seletedTotal.innerHTML != 0){
			var conf = confirm('确定删除？');
			if(conf){
				for(var i=0;i<tr.length;i++){
					var input = tr[i].getElementsByClassName('check')[0];
					if(input.checked){
						tr[i].parentNode.removeChild(tr[i]);
						i--;//注意这个知识点
					}
				}
				getTotal();
			}
		}

	}

	checkAllInputs[0].checked = true;//进来时默认是全选的；
	checkAllInputs[0].onclick();//手动调用点击事件，全选商品




	// cartTable.addEventListener('click',function(ev){//事件监听的写法
	// 	var target = ev.target;
	// 	while(target !== cartTable ){
	// 		if(target.tagName.toLowerCase() == 'input'){
	// 			if(target.className = 'check-all'){
	// 				checkInputs.checked = true;
	// 			}
	// 			console.log('li click~',target);
	// 			getTotal()
	// 		}
	// 		target = target.parentNode;
	// 	}
	// })




}