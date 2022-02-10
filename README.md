# 自动布点工具

## 安装插件

```bash
$ npm install dot
```

## 命令

TODO

## 事件

TODO

## 配置
在应用根目录下添加配置文件dot-config.js

```json
module.exports = [{
  'workPath': './pages/testdot',
  'template': 'data-spm-click="{{random}}" data-test="{{number}}"',
  'filter': [
    '[onClick]'
  ],
  'processor': {
    'number': function(){
      return 111;
    }
  }
}]

```

|字段|类型|说明|
|-------|---|---|
|workPath|String|需要静态代码分析的工作目录,需填写app.dir的相对路径|
|template|String|点位模板,random为处理器名,处理器支持自定义扩展|
|filter|Array|需要打点节点的选择器列表|
|processor|Object|自定义处理器Map.processor的作用域为plugin的context.参数为当前点位的配置信息(dot-config.js中配置的内容)|

## 支持的点位解析方式
1. id选择器
    '#main' 匹配id值为main的元素
2. attr选择器(需要带值)
    '[__TD__]' 匹配有__TD__,并且__TD__有值的元素

## 历史记录

参见 [历史记录](HISTORY.md)
