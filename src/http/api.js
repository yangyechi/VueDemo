/** 
 * api接口统一管理
 */
import { get, post,uploadFile,downloadFile} from './http'

export const getPlugList = p => get('/api/PlugInfo/list', p);

export const getSearchList = p => get('/api/PlugInfo/search', p);

export const getPlugIdAndName = p => get('/api/PlugInfo/listIdAndName', p);

export const getDocList = p => get('/api/Document/list', p);

export const postLoginInfo = p => post('/api/User/login', p);

export const uploadPlug = formData => uploadFile('/api/PlugInfo/add',formData);

export const uploadDoc = formData => uploadFile('/api/Document/add',formData);

export const downloadPlug = id => downloadFile('/api/PlugInfo/download',id);

export const downloadDoc = id => downloadFile('/api/Document/download',id);
 
