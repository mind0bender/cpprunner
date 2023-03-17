#!/bin/sh

filename=$1

echo compiling $filename.cpp

g++ -std=c++20 $filename.cpp -o $filename

echo running $filename

$filename

echo "\nprogram exited"
