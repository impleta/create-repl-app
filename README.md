# create-repl-app

Creates a new Node-based REPL application, and optionally executes an initialization script.

### Usage
npx create-repl-app my-repl-name

This will create a folder named `my-repl-name`

run npm link `my-repl-name`

This will create a globally accessible executable named `my-repl-name`.

```javascript
$ my-repl-name
> let myLib = new MyLib1()  // See ReplApp.init.ts
> myLib.Method1("Hello")
> MyLib1.Method1("Hello") called
```
