# **cpprunner**

This is a Node.js project that compiles and runs C/C++ code. It takes the name of the C/C++ file as input, compiles and runs it on changes.
The project also includes some extra options, such as -h for help and -st for saving temporary files.

## Getting Started
___

To use this project, you must have Node.js and a [C/C++ compiler](https://gcc.gnu.org/install/) installed on your system.

### Using npx
___

```bash
npx cpprunner <filename>
```

### Using as npm package in a project
_____

Install as npm package
```bash
npm i cpprunner
```

Usage:
```js
import run from "cpprunner";

const filepath = "path/to/your/file"; // without the extension
const extension = "c";

run(filepath, extension);
```

### With Git
___
1. Clone the repository to your local machine using [`git clone https://github.com/mind0bender/cpprunner.git`](https://github.com/mind0bender/cpprunner.git).
2. Navigate to the project directory using `cd cpprunner`.
3. Install the required dependencies using `yarn`.

Usage:

The `cpprunner` takes the following options:

To compile and run a C/C++ file, navigate to the project directory and run the following command:

```
yarn start <filename>
```

## Options

```
optional arguments:
        -st : save temp files
        -h  : help
```

Make sure to replace `<filename>` with the name of your program file.