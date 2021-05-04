# http-responseHeader

- Content-Disposition 如果是要求下载文件，值为`attachment;filename="[filename].[filetype]"`
- X-frame-options 如果要兼容IE11的下载，要设置 sameorigin 同源，`X-frame-options: sameorigin`