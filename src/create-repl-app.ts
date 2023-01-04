#!/usr/bin/env node

import { AppCreator } from './AppCreator.js';

try {
  AppCreator.start();
} catch (error) {
  console.log(error)
}