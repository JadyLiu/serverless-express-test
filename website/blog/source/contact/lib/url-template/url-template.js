;var uritemplate=(function(){function isFunction(fn){return typeof fn=='function';}
function isEmptyObject(obj){for(var name in obj){return false;}
return true;}
function extend(base,newprops){for(var name in newprops){base[name]=newprops[name];}
return base;}
function CachingContext(context){this.raw=context;this.cache={};}
CachingContext.prototype.get=function(key){var val=this.lookupRaw(key);var result=val;if(isFunction(val)){var tupple=this.cache[key];if(tupple!==null&&tupple!==undefined){result=tupple.val;}else{result=val(this.raw);this.cache[key]={key:key,val:result};}}
return result;};CachingContext.prototype.lookupRaw=function(key){return CachingContext.lookup(this,this.raw,key);};CachingContext.lookup=function(me,context,key){var result=context[key];if(result!==undefined){return result;}else{var keyparts=key.split('.');var i=0,keysplits=keyparts.length- 1;for(i=0;i<keysplits;i++){var leadKey=keyparts.slice(0,keysplits- i).join('.');var trailKey=keyparts.slice(-i-1).join('.');var leadContext=context[leadKey];if(leadContext!==undefined){return CachingContext.lookup(me,leadContext,trailKey);}}
return undefined;}};function UriTemplate(set){this.set=set;}
UriTemplate.prototype.expand=function(context){var cache=new CachingContext(context);var res="";var i=0,cnt=this.set.length;for(i=0;i<cnt;i++){res+=this.set[i].expand(cache);}
return res;};function Literal(txt){this.txt=txt;}
Literal.prototype.expand=function(){return this.txt;};var RESERVEDCHARS_RE=new RegExp("[:/?#\\[\\]@!$&()*+,;=']","g");function encodeNormal(val){return encodeURIComponent(val).replace(RESERVEDCHARS_RE,function(s){return escape(s);});}
function encodeReserved(val){return encodeURI(val);}
function addUnNamed(name,key,val){return key+(key.length>0?"=":"")+ val;}
function addNamed(name,key,val,noName){noName=noName||false;if(noName){name="";}
if(!key||key.length===0){key=name;}
return key+(key.length>0?"=":"")+ val;}
function addLabeled(name,key,val,noName){noName=noName||false;if(noName){name="";}
if(!key||key.length===0){key=name;}
return key+(key.length>0&&val?"=":"")+ val;}
var simpleConf={prefix:"",joiner:",",encode:encodeNormal,builder:addUnNamed};var reservedConf={prefix:"",joiner:",",encode:encodeReserved,builder:addUnNamed};var fragmentConf={prefix:"#",joiner:",",encode:encodeReserved,builder:addUnNamed};var pathParamConf={prefix:";",joiner:";",encode:encodeNormal,builder:addLabeled};var formParamConf={prefix:"?",joiner:"&",encode:encodeNormal,builder:addNamed};var formContinueConf={prefix:"&",joiner:"&",encode:encodeNormal,builder:addNamed};var pathHierarchyConf={prefix:"/",joiner:"/",encode:encodeNormal,builder:addUnNamed};var labelConf={prefix:".",joiner:".",encode:encodeNormal,builder:addUnNamed};function Expression(conf,vars){extend(this,conf);this.vars=vars;}
Expression.build=function(ops,vars){var conf;switch(ops){case'':conf=simpleConf;break;case'+':conf=reservedConf;break;case'#':conf=fragmentConf;break;case';':conf=pathParamConf;break;case'?':conf=formParamConf;break;case'&':conf=formContinueConf;break;case'/':conf=pathHierarchyConf;break;case'.':conf=labelConf;break;default:throw"Unexpected operator: '"+ops+"'";}
return new Expression(conf,vars);};Expression.prototype.expand=function(context){var joiner=this.prefix;var nextjoiner=this.joiner;var buildSegment=this.builder;var res="";var i=0,cnt=this.vars.length;for(i=0;i<cnt;i++){var varspec=this.vars[i];varspec.addValues(context,this.encode,function(key,val,noName){var segm=buildSegment(varspec.name,key,val,noName);if(segm!==null&&segm!==undefined){res+=joiner+ segm;joiner=nextjoiner;}});}
return res;};var UNBOUND={};function Buffer(limit){this.str="";if(limit===UNBOUND){this.appender=Buffer.UnboundAppend;}else{this.len=0;this.limit=limit;this.appender=Buffer.BoundAppend;}}
Buffer.prototype.append=function(part,encoder){return this.appender(this,part,encoder);};Buffer.UnboundAppend=function(me,part,encoder){part=encoder?encoder(part):part;me.str+=part;return me;};Buffer.BoundAppend=function(me,part,encoder){part=part.substring(0,me.limit- me.len);me.len+=part.length;part=encoder?encoder(part):part;me.str+=part;return me;};function arrayToString(arr,encoder,maxLength){var buffer=new Buffer(maxLength);var joiner="";var i=0,cnt=arr.length;for(i=0;i<cnt;i++){if(arr[i]!==null&&arr[i]!==undefined){buffer.append(joiner).append(arr[i],encoder);joiner=",";}}
return buffer.str;}
function objectToString(obj,encoder,maxLength){var buffer=new Buffer(maxLength);var joiner="";var k;for(k in obj){if(obj.hasOwnProperty(k)){if(obj[k]!==null&&obj[k]!==undefined){buffer.append(joiner+ k+',').append(obj[k],encoder);joiner=",";}}}
return buffer.str;}
function simpleValueHandler(me,val,valprops,encoder,adder){var result;if(valprops.isArr){result=arrayToString(val,encoder,me.maxLength);}else if(valprops.isObj){result=objectToString(val,encoder,me.maxLength);}else{var buffer=new Buffer(me.maxLength);result=buffer.append(val,encoder).str;}
adder("",result);}
function explodeValueHandler(me,val,valprops,encoder,adder){if(valprops.isArr){var i=0,cnt=val.length;for(i=0;i<cnt;i++){adder("",encoder(val[i]));}}else if(valprops.isObj){var k;for(k in val){if(val.hasOwnProperty(k)){adder(k,encoder(val[k]));}}}else{adder("",encoder(val));}}
function valueProperties(val){var isArr=false;var isObj=false;var isUndef=true;if(val!==null&&val!==undefined){isArr=(val.constructor===Array);isObj=(val.constructor===Object);isUndef=(isArr&&val.length===0)||(isObj&&isEmptyObject(val));}
return{isArr:isArr,isObj:isObj,isUndef:isUndef};}
function VarSpec(name,vhfn,nums){this.name=unescape(name);this.valueHandler=vhfn;this.maxLength=nums;}
VarSpec.build=function(name,expl,part,nums){var valueHandler,valueModifier;if(!!expl){valueHandler=explodeValueHandler;}else{valueHandler=simpleValueHandler;}
if(!part){nums=UNBOUND;}
return new VarSpec(name,valueHandler,nums);};VarSpec.prototype.addValues=function(context,encoder,adder){var val=context.get(this.name);var valprops=valueProperties(val);if(valprops.isUndef){return;}
this.valueHandler(this,val,valprops,encoder,adder);};var VARSPEC_RE=/([^*:]*)((\*)|(:)([0-9]+))?/;var match2varspec=function(m){var name=m[1];var expl=m[3];var part=m[4];var nums=parseInt(m[5],10);return VarSpec.build(name,expl,part,nums);};var LISTSEP=",";var TEMPL_RE=/(\{([+#.;?&\/])?(([^.*:,{}|@!=$()][^*:,{}$()]*)(\*|:([0-9]+))?(,([^.*:,{}][^*:,{}]*)(\*|:([0-9]+))?)*)\})/g;var match2expression=function(m){var expr=m[0];var ops=m[2]||'';var vars=m[3].split(LISTSEP);var i=0,len=vars.length;for(i=0;i<len;i++){var match;if((match=vars[i].match(VARSPEC_RE))===null){throw"unexpected parse error in varspec: "+ vars[i];}
vars[i]=match2varspec(match);}
return Expression.build(ops,vars);};var pushLiteralSubstr=function(set,src,from,to){if(from<to){var literal=src.substr(from,to- from);set.push(new Literal(literal));}};var parse=function(str){var lastpos=0;var comp=[];var match;var pattern=TEMPL_RE;pattern.lastIndex=0;while((match=pattern.exec(str))!==null){var newpos=match.index;pushLiteralSubstr(comp,str,lastpos,newpos);comp.push(match2expression(match));lastpos=pattern.lastIndex;}
pushLiteralSubstr(comp,str,lastpos,str.length);return new UriTemplate(comp);};return parse;}());