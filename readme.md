# the problem :

#### brief description
the problem is that when I add this ( 
```
styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
         minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true
        },

```
into cacheGroups , no errors gets logged during compilation, the output html is generated with imports ( except for css ) and neither css and javascript works anymore in the compiled output..






I've tried to keep the configuration minimal,
the problem In this configuration seems to be 2 : 

ERROR 1 :
the major is that when css splitchunk is enabled, 
- javascript doesn't work anymore even the console.log command in the main entrypoint javascript files doesn't print output, anyway no error is logged
- css is absent 

ERROR 2 : 
- why with 'minChunks: 30,' in the `commons` chunk does merge javacsript content of 'a.js' and 'b.js' ? isn't supposed to skip those files because os that rule ? ( note that commenting the whole `commons` cachegroup correctly ignore aggregation of those files ), ERROR1 anyway persist even with `commons` commented
 

 



## initial setup 
npm install
npm run serve 

## example of "working" configuration
 ( css splitchunk disabled ) 

```console
npm run build:err1-ok
```


both sample files output console log
http://127.0.0.1:8080/
http://127.0.0.1:8080/b.html

and css styles are loaded 
 ( only ERROR2 is present but I'm not sure if this is my fault in some configuration ) 


### demoes the problem : 

```console
npm run build:err1-error
```
http://127.0.0.1:8080/
http://127.0.0.1:8080/b.html

both files doesn't load css, no javascript is executed ( also console.log in the sources print nothing ) 




### diff between working and not working configuration
```
98,104c98,104
<         styles: {
<           name: 'styles',
<           test: /\.css$/,
<           chunks: 'all',
<           enforce: true,
<          minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true
<         },
---
>         // styles: {
>         //   name: 'styles',
>         //   test: /\.css$/,
>         //   chunks: 'all',
>         //   enforce: true,
>         //   minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true
>         // },

```