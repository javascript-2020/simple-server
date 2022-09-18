echo off
set ver=v2.0
title simple-server %ver%
cls
node %~dp0%ver%/simple-server-%ver% %*
