// 操作DOM节点的所有方法

/**
 * 如果dom节点没有这个class类，那么就添加进去
 * @param {DOM} node
 * @param {Class} className
 */
export function addClass (node, className) {
    if (!node.classList.contains(className)) {
        node.classList.add(className)
    }
}

/**
 * 没有第三参数：获取这个DOM的自定义属性值；
 * 有第三参数：设置这个DOM的自定义属性值
 * @param {DOM} element
 * @param {自定义属性名后缀} name
 * @param {可选：自定义属性值} value
 */
export function customAttr (element, name, value) {
    const prefix = 'data-'
    if (!value) {
        return element.getAttribute(prefix + name)
    } else {
        return element.setAttribute(prefix + name, value)
    }
}

let elementTest = document.createElement('div')
let vendor = (function () {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for (let key in transformNames) {
        if (elementTest.style[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false
})()

/**
 * 检测当前浏览器供应商，并传入对应的前缀
 * @param {String} style
 */
export function prefixStyle (style) {
    if (vendor === false) return false

    if (vendor === 'standard') return style

    return vendor + style.charAt(0).toUpperCase() + style.substring(1)
}
