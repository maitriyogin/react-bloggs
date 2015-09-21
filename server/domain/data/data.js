data = [
  {name :'users', data :[
    {'_id':'1','username' : 'stephen','email':'stephen.white@callistaenterprise.se'},
    {'_id':'2','username' : 'sedina','email':'sedina.oruc@callistaenterprise.se'},
    {'_id':'3','username' : 'jonas','email':'jonas.behmer@callistaenterprise.com'}
  ]},

  {name:'posts', data : [
    {'_id':'1', 'title':'Stephens Blog', 'body':'Ember Rocks!', 'userfk':'1'},
    {'_id':'2', 'title':'Jonases Blog', 'body':'A host, of golden daffodils', 'userfk':'2'},
    {'_id':'3', 'title':'Sedinas Blog', 'body':'I wandered lonely as a cloud', 'userfk':'3'}
  ]},

  {name:'comments', data : [
    {'_id':'1', 'body':'A framework for creating ambitous web applications', 'updatedate':new Date(), 'postfk':'1', 'userfk': '3'},
    {'_id':'2', 'body':'It really is!', 'updatedate':new Date(), 'postfk':'1', 'userfk': '3'},
    {'_id':'3', 'body':'Beside the lake, beneath the trees', 'updatedate':new Date(), 'postfk':'2', 'userfk': '1'},
    {'_id':'4', 'body':'Fluttering and dancing in the breeze', 'updatedate':new Date(), 'postfk':'2', 'userfk': '1'},
    {'_id':'5', 'body':'That floats on high o er vales and hills', 'updatedate':new Date(), 'postfk':'3', 'userfk': '2'},
    {'_id':'6', 'body':'Continuous as the stars that shine', 'updatedate':new Date(), 'postfk':'3', 'userfk': '2'}
  ]}
];

