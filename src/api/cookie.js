//获取cookie
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if(arr = document.cookie.match(reg)) {
        return arr[2];
    }else {
        return null;
    }
}

//设置cookie
export function setCookie(c_name, value) {
    const exdate = new Date();
    exdate.setMinutes(exdate.getMinutes() + 2*60);
    document.cookie = c_name + '=' + value + ';expires='+exdate.toGMTString()
    // escape(value)
}

//删除cookie
export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}