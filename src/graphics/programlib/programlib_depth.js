pc.gfx.programlib.depth = {
    generateKey: function (device, options) {
        var key = "depth";
        if (options.skin) key += "_skin";
        if (options.opacityMap) key += "_opam";
        return key;
    },

    generateVertexShader: function (device, options) {
        var getSnippet = pc.gfx.programlib.getSnippet;
        var code = '';

        // VERTEX SHADER DECLARATIONS
        if (options.skin) {
            code += getSnippet(device, 'vs_skin_position_decl');
        } else {
            code += getSnippet(device, 'vs_static_position_decl');
        }

        if (options.opacityMap) {
            code += "attribute vec2 vertex_texCoord0;\n\n";
            code += 'varying vec2 vUv0;\n\n';
        }

        // VERTEX SHADER BODY
        code += getSnippet(device, 'common_main_begin');

        // Skinning is performed in world space
        if (options.skin) {
            code += getSnippet(device, 'vs_skin_position');
        } else {
            code += getSnippet(device, 'vs_static_position');
        }

        if (options.opacityMap) {
            code += '    vUv0 = vertex_texCoord0;\n';
        }

        code += getSnippet(device, 'common_main_end');
        
        return code;
    },

    generateFragmentShader: function (device, options) {
        var getSnippet = pc.gfx.programlib.getSnippet;
        var code = getSnippet(device, 'fs_precision');

        if (options.opacityMap) {
            code += 'varying vec2 vUv0;\n\n';
            code += 'uniform sampler2D texture_opacityMap;\n\n';
        }

        // FRAGMENT SHADER BODY
        code += getSnippet(device, 'common_main_begin');

        if (options.opacityMap) {
            code += '    if (texture2D(texture_opacityMap, vUv0).r < 0.25) discard;\n\n';
        }

        code += getSnippet(device, 'fs_depth_write');

        code += getSnippet(device, 'common_main_end');

        return code;
    }
};