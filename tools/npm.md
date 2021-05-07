# npm

## npm cli install
Perform the following operations in the same level directory of package.json

- Install all npm packages in dependencies and devDependencies

    `npm install`
- Only install all npm packages under dependencies

    `npm install —production`

- Ignore optional installation

    `npm install --no-optional --verbose`

eg: ERROR
```sh
    npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules\fsevents):
    npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.4: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
```
Explanation: Some packages depend on the fsevents package, and the fsevents package is under MacOS. Warnings will be prompted under Windows/Linux, but will not be installed

## npm low version cause `can't find folder` error

Accordation to my experience, npm <=v6.2.0, cannot support commannd: 

`{"vue-loader-v16": "npm:vue-loader@^16.0.0-beta.3"}`,

and new version v6.14.8+ don't have this problem.

So, when it happend, upgrade npm version with command:

```sh
npm i -g npm
```

## npm publish new packages

> Attention: before your publishment, run `npm run build` or others scripts command to create files build, often a folder as `./dist` 

```sh
npm login

npm publish

```