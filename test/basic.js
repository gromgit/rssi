var assert = require('assert'),
    fmt = require('../rssi')

describe('rssi', function () {
    function eq(a, b) { assert.strictEqual(a, b) }
    function noeq(a, b) { assert.notEqual(a, b) }
    var opt_blank = {blank: true}
    var opt_nocache = {noCache: true}

    it('should be a function', function () { eq(typeof fmt, 'function') })

    it('should return function returning string', function () {
        var t = fmt('')
        eq(typeof t, 'function')
        eq(typeof t({}), 'string')
    })

    it('should retain plain text', function () {
        eq(fmt('')({foo: 'bar'}), '')
        eq(fmt('{{mustache}}')({foo: 'bar'}), '{{mustache}}')
        eq(fmt('#define foo bar')({foo: 'bar'}), '#define foo bar')
    })

    it('should interpolate things', function () {
        var c1 = {from: 'meters', to: 'feet', mul: 3.28},
            c2 = {from: 'kilojoules', to: 'BTUs', mul: 0.9478},
            c3 = {from: 'megabytes', to: 'gigabytes', mul: 1024},
            t = fmt('Multiply by #{mul} to convert from #{from} to #{to}.')

        eq(t(c1), 'Multiply by 3.28 to convert from meters to feet.')
        eq(t(c2), 'Multiply by 0.9478 to convert from kilojoules to BTUs.')
        eq(t(c3), 'Multiply by 1024 to convert from megabytes to gigabytes.')
    })

    it('should cache templates', function () {
        eq(fmt('#{a}'), fmt('#{a}'))
        noeq(fmt('#{a}'), fmt('#{b}'))
        eq(fmt('#{a}', opt_blank), fmt('#{a}', opt_blank))
        noeq(fmt('#{a}'), fmt('#{a}', opt_blank))
    })

    it('should accept noCache option', function () {
        eq(fmt('#{a}', opt_nocache), fmt('#{a}'))
        noeq(fmt('#{b}'), fmt('#{b}', opt_nocache))
        noeq(fmt('#{a}', opt_nocache), fmt('#{a}', opt_nocache))
    })

    it('should accept blank option', function() {
        eq(fmt('it is #{blank_opt} here', opt_blank)(), 'it is  here')
        eq(fmt('with#{blank_opt} object', opt_blank)({}), 'with object')
        eq(fmt('it is only #{a}#{b}', opt_blank)({a:'a'}), 'it is only a')
    })
})
