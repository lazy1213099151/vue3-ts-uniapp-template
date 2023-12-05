// import proxyPlugin from './http-plugin-proxy';
import injectPlugin from './http-plugin-inject';
import { getHttpCache, setHttpCache } from './http-plugin-cache';
import httpReConnect from './http-plugin-connect';
import httpIdent from './http-plugin-ident';

export default [injectPlugin, httpIdent, getHttpCache, setHttpCache, httpReConnect];
