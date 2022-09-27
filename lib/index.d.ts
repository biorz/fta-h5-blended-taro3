import * as webpack from 'webpack';
import webpackChain from 'webpack-chain';
declare type TConfiguration = webpack.Configuration | webpackChain;
export default function <T extends TConfiguration>(_chain: T): T;
export {};
