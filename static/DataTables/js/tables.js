document.write("<script type='text/javascript' src='DataTables/js/charts.js'></script>");

layui.use('table', function(){
  var table = layui.table;
  var params = {"question": "test_get"};

  table.render({
    elem: '#test'
    ,url:'/data_table'
    ,toolbar: 'default'
    ,title: '材料数据表'
    ,totalRow: true
    ,contentType: "contentType/json"
    // ,where: params
    ,loading: true
    ,cols: [[
      {type: 'checkbox', fixed: 'left', width: "4%"}
      ,{field:'id', title:'ID', width:"6%", fixed: 'left', unresize: true, sort: true}
      ,{field:'material_name', title:'材料名', width:"12%"}
      ,{field:'prices', title:'价格', width:"15%", sort: true}
      ,{field:'period', title:'日期', width:"15%", sort: true}
      ,{field:'unit', title:'单位', width:"8%"}
      ,{field:'type', title:'型号', width:"8%"}
      ,{field:'spec', title:'规格', width:"8%"}
      ,{field:'areas', title:'项目地区', width:"8%"}
      ,{field:'project', title:'项目名称', width:"8%"}
      ,{field:'brand', title:'品牌', width: "20%"}
      ,{field:'remarks', title:'备注', width: "20%"}
      ,{field: 'tools', "title": "数据操作", width: "20%", align:'center', toolbar: '#table_right_btn'}
    ]]
    ,page: true
  });

  //头工具栏事件
  table.on('toolbar(test)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'getCheckData':
        var data = checkStatus.data;
        layer.alert(JSON.stringify(data));
      break;
      case 'getCheckLength':
        var data = checkStatus.data;
        layer.msg('选中了：'+ data.length + ' 个');
      break;
      case 'isAll':
        layer.msg(checkStatus.isAll ? '全选': '未全选');
      break;
    }
  });

  //监听头工具栏事件
  table.on('toolbar(test)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id)
    ,data = checkStatus.data; //获取选中的数据
    var delete_url = "/data_table";
    switch(obj.event){
      case 'add':
        selectRole();
      break;
      case 'update':
        if(data.length === 0){
          layer.msg('请选择一行');
        } else if(data.length > 1){
          layer.msg('只能同时编辑一个');
        } else {
          edit_role(data);
        }
      break;
      case 'delete':
        if(data.length === 0){
          layer.msg('请选择一行');
        } else {
          layer.confirm('真的删除行么', function(index){
          console.log(obj)
          console.log(checkStatus);
          console.log(data);
          $.ajax({
            type: "delete",
            url: delete_url,
            contentType:"application/json",
            data: JSON.stringify(data),
            dataType: 'json',
            "success": function(result) {
                // obj.del();
                location.reload() 
                layer.close(index);
                layer.msg("删除成功！");
            },
            "error": function(result){
                layer.msg(result.msg);
            }
          });
        });
        }
      break;
    }
  });

  //监听行工具事件
  table.on('tool(test)', function(obj){
    var data = obj.data;
    var delete_url = "/data_table";
    //console.log(obj)
    if(obj.event === 'del'){
      layer.confirm('确认删除此行？', function(index){
        console.log(obj);
        $.ajax({
          type: "delete",
          url: delete_url,
          contentType:"application/json",
          data: JSON.stringify([data]),
          dataType: 'json',
          "success": function(result) {
              obj.del();
              layer.close(index);
              layer.msg("删除成功！");
          },
          "error": function(result){
              layer.msg(result.msg);
          }
        });
      });
    } else if(obj.event === 'edit'){
      console.log(data);
      edit_role(data);
    }
    else{
      // var body = obj.data;
      // var prices = body.prices;
      // var period = body.period;
      // var list = new Array(prices.length);
      //
      // for(var i=0;i<prices.length;i++){
      //     var dic = new Map();
      //     dic["value"] = prices[i];
      //     dic["date"] = period[i];
      //     list[i] = dic;
      // }
      location.href="charts.html?"+"txt="+encodeURI(obj.data.material_name);
    }
  });

  $('#search_button').on('click', function () {
      var params = {"question": $("input[name=question]").val()};
      console.log(params);
      //执行重载
      table.reload('idTest', {
          url: "/search"
          // ,method: "post"
          // ,dataType: 'json'
          ,toolbar: 'default'
          ,title: '材料数据表'
          ,totalRow: true
          // ,contentType: "contentType/json"
          // // ,where: params
          ,loading: true
          ,cols: [[
            {type: 'checkbox', fixed: 'left', width: "4%"}
            ,{field:'id', title:'ID', width:"6%", fixed: 'left', unresize: true, sort: true}
            ,{field:'material_name', title:'材料名', width:"12%"}
            ,{field:'prices', title:'价格', width:"15%", sort: true}
            ,{field:'period', title:'日期', width:"15%", sort: true}
            ,{field:'unit', title:'单位', width:"8%"}
            ,{field:'type', title:'型号', width:"8%"}
            ,{field:'spec', title:'规格', width:"8%"}
            ,{field:'areas', title:'项目地区', width:"8%"}
            ,{field:'project', title:'项目名称', width:"8%"}
            ,{field:'brand', title:'品牌', width: "20%"}
            ,{field:'remarks', title:'备注', width: "20%"}
            ,{field: 'tools', "title": "数据操作", width: "20%", align:'center', toolbar: '#table_right_btn'}
          ]]
          ,page: true
          ,where: params
      });
    
  });
});

function selectRole(){
		layer.open({
        	//layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            type:1,
            title:"添加数据",
            area: ['80%','80%'],
            content:$("#popSearchRoleTest"),
            anim: 5,
        });
	}

function add_material_data(data){
  var url = "/data_table";
  var d = data;

  $.ajax({
        type: "put",
        url: url,
        contentType:"application/json",
        data: JSON.stringify(data.field),
        dataType: 'json',
        "success": function(result) {
            if (result.code == 1) {
                layer.open({
                    // type: 4,
                    skin: 'layui-layer-molv',
                    content: result.msg,
                    btn: ["确定", "取消"],
                    btn1: function () {
                        d.field["update"] = true;
                        console.log(d);
                        add_material_data(d);
                        return true;
                    },
                    btn2: function () {
                        return true;
                    }
                });
            } else {
                layer.msg(result.msg);
                layer.closeAll();
            }
        },
        "error": function(result){
        layer.msg(result.msg);
      }
    })
}

function edit_role(body){
  layer.open({
          //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            type:1,
            title:"添加数据",
            area: ['80%','80%'],
            content: $("#popSearchRoleTest"),
            anim: 5,
            success: function(layero, index){
              console.log(body);
              $("#material_name").val(body.material_name);
              $("#prices").val(body.prices);
              $("#period").val(body.period);
              $("#unit").val(body.unit);
              $("#type").val(body.type);
              $("#specs").val(body.specs);
              $("#areas").val(body.areas);
              $("#project").val(body.project);
              $("#brand").val(body.brand);
              $("#remarks").val(body.remarks);
              // var enhanceForm = layui.enhanceform;
              // var enhance = new enhanceForm({
              //           elem: '#popSearchRoleTest' //表单选择器
              // });
              // enhance.filling(body);//其中jsonData为表单数据的json对象
              // var bb = layer.getChildFrame('body', index);
              // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
              //   //console.log(body.html())
              // bb.find("#material_name").val("admin");
            }
        });
}


layui.use('form', function(){
  var form = layui.form;

  //监听提交
  form.on('submit(formDemo)', function(data){
    add_material_data(data);
    // layer.msg(JSON.stringify(data.field));
    console.log(data.field);
    // data = data.add({"_method": "PUT"});
  });
});

function keyup_submit(e){ 
 var evt = window.event || e; 
 console.log(evt.keyCode);
  if (evt.keyCode == 13){
    document.getElementById("search_button").click();
  }
}

// function search_layui(){
//   var url = "/search";
//   var params = {"question":document.getElementById("question").value};

//   // layui.use('table', function(){
//     // var table = layui.table;
//     table.reload({
//       elem: '#test'
//       ,where: params
//     });

//   // });

// }






