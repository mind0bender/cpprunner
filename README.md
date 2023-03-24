# Compile and Run

This is a Node.js project that compiles and runs C/C++ code. It takes the name of the C/C++ file as input and compiles and runs it on changes.
The project also includes some extra options, such as -h for help and -st for saving temporary files.

## Getting Started

To use this project, you must have Node.js and a [C/C++ compiler](https://gcc.gnu.org/install/) installed on your system.

1. Clone the repository to your local machine using [`git clone https://github.com/mind0bender/cpprunner.git`](https://github.com/mind0bender/cpprunner.git).
2. Navigate to the project directory using `cd cpprunner`.
3. Install the required dependencies using `yarn`.

## Usage

The `cpprunner` takes the following options:


```
yarn start <filename>
      optional arguments:
        -st : save temp files
        -h  : help
```

To compile and run a C/C++ file, navigate to the project directory and run the following command:

```
yarn start <filename>
```

Make sure to replace `<filename>` with the name of your program file.