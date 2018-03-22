define('<%- moduleName -%>', ['require', 'exports', 'module' <% if (requireArr) { %> ,<%- requireArr -%> <% } %>], function(require, exports, module) {

    /* get render function */
    var _module1 = {
        exports: {}
    };
    (function(module, exports) {


        module.exports = {
            render: function() {
                <%- render -%>

            },
            staticRenderFns: [
                <%- staticRenderFns -%>
            ]
        };


    })(_module1, _module1.exports);


    /* get script output data */
    var _module2 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        <%- script -%>
    })(_module2, _module2.exports);

    var obj = _module2.exports.default || _module2.exports;
    obj.render = obj.render || _module1.exports.render;
    obj.staticRenderFns = _module1.exports.staticRenderFns;


    /* get config */
    var _module3 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        module.exports = <%- config -%>

    })(_module3, _module3.exports);

    _module3.exports.data && (obj.data = _module3.exports.data);
    _module3.exports.props && (obj.props = _module3.exports.props);
    _module3.exports.components && (obj.components = _module3.exports.components);


    obj._scopeId = "<%- scopeId -%>";

    module.exports = obj;
});