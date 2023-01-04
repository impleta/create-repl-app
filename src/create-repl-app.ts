#!/usr/bin/env node

import { AppCreator } from './AppCreator';

try {
  AppCreator.start();
} catch (error) {
  console.log(error)
}