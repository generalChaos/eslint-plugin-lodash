/**
 * @fileoverview Rule to disallow the use of a chain for a single method
 */
'use strict'

/**
 * @fileoverview Rule to disallow the use of a chain for a single method
 */
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
    create(context) {
        const {getLodashMethodVisitors} = require('../util/lodashUtil')
        const {getFunctionMaxArity} = require('../util/methodDataUtil')
        const {getMethodName} = require('../util/astUtil')
        const {version} = require('../util/settingsUtil').getSettings(context)
        const includes = require('lodash/includes')

        function isBound(node) {
            return node && node.type === 'CallExpression' && getMethodName(node) === 'bind' && node.arguments.length === 1
        }

        const callExpressionReporters = {
            3(node, iteratee) {
                if (isBound(iteratee)) {
                    context.report(iteratee.callee.property, 'Unnecessary bind, pass `thisArg` to lodash method instead')
                }
            },
            4(node, iteratee, {method, callType}) {
                const argsLength = node.arguments.length + (callType === 'chained' ? 1 : 0)
                if (iteratee && argsLength > getFunctionMaxArity(4, method)) {
                    context.report(iteratee, 'Do not use Lodash 3 thisArg, use binding instead')
                }
            }
        }

        return getLodashMethodVisitors(context, callExpressionReporters[version])
    }
}
