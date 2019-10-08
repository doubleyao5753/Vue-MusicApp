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
