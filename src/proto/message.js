/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.AvailableModelsResponse = (function() {

    /**
     * Properties of an AvailableModelsResponse.
     * @exports IAvailableModelsResponse
     * @interface IAvailableModelsResponse
     * @property {Array.<AvailableModelsResponse.IAvailableModel>|null} [models] AvailableModelsResponse models
     * @property {Array.<string>|null} [modelNames] AvailableModelsResponse modelNames
     */

    /**
     * Constructs a new AvailableModelsResponse.
     * @exports AvailableModelsResponse
     * @classdesc Represents an AvailableModelsResponse.
     * @implements IAvailableModelsResponse
     * @constructor
     * @param {IAvailableModelsResponse=} [properties] Properties to set
     */
    function AvailableModelsResponse(properties) {
        this.models = [];
        this.modelNames = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AvailableModelsResponse models.
     * @member {Array.<AvailableModelsResponse.IAvailableModel>} models
     * @memberof AvailableModelsResponse
     * @instance
     */
    AvailableModelsResponse.prototype.models = $util.emptyArray;

    /**
     * AvailableModelsResponse modelNames.
     * @member {Array.<string>} modelNames
     * @memberof AvailableModelsResponse
     * @instance
     */
    AvailableModelsResponse.prototype.modelNames = $util.emptyArray;

    /**
     * Creates a new AvailableModelsResponse instance using the specified properties.
     * @function create
     * @memberof AvailableModelsResponse
     * @static
     * @param {IAvailableModelsResponse=} [properties] Properties to set
     * @returns {AvailableModelsResponse} AvailableModelsResponse instance
     */
    AvailableModelsResponse.create = function create(properties) {
        return new AvailableModelsResponse(properties);
    };

    /**
     * Encodes the specified AvailableModelsResponse message. Does not implicitly {@link AvailableModelsResponse.verify|verify} messages.
     * @function encode
     * @memberof AvailableModelsResponse
     * @static
     * @param {IAvailableModelsResponse} message AvailableModelsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AvailableModelsResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modelNames != null && message.modelNames.length)
            for (var i = 0; i < message.modelNames.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.modelNames[i]);
        if (message.models != null && message.models.length)
            for (var i = 0; i < message.models.length; ++i)
                $root.AvailableModelsResponse.AvailableModel.encode(message.models[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified AvailableModelsResponse message, length delimited. Does not implicitly {@link AvailableModelsResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AvailableModelsResponse
     * @static
     * @param {IAvailableModelsResponse} message AvailableModelsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AvailableModelsResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AvailableModelsResponse message from the specified reader or buffer.
     * @function decode
     * @memberof AvailableModelsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AvailableModelsResponse} AvailableModelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AvailableModelsResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AvailableModelsResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2: {
                    if (!(message.models && message.models.length))
                        message.models = [];
                    message.models.push($root.AvailableModelsResponse.AvailableModel.decode(reader, reader.uint32()));
                    break;
                }
            case 1: {
                    if (!(message.modelNames && message.modelNames.length))
                        message.modelNames = [];
                    message.modelNames.push(reader.string());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AvailableModelsResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AvailableModelsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AvailableModelsResponse} AvailableModelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AvailableModelsResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AvailableModelsResponse message.
     * @function verify
     * @memberof AvailableModelsResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AvailableModelsResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.models != null && message.hasOwnProperty("models")) {
            if (!Array.isArray(message.models))
                return "models: array expected";
            for (var i = 0; i < message.models.length; ++i) {
                var error = $root.AvailableModelsResponse.AvailableModel.verify(message.models[i]);
                if (error)
                    return "models." + error;
            }
        }
        if (message.modelNames != null && message.hasOwnProperty("modelNames")) {
            if (!Array.isArray(message.modelNames))
                return "modelNames: array expected";
            for (var i = 0; i < message.modelNames.length; ++i)
                if (!$util.isString(message.modelNames[i]))
                    return "modelNames: string[] expected";
        }
        return null;
    };

    /**
     * Creates an AvailableModelsResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AvailableModelsResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AvailableModelsResponse} AvailableModelsResponse
     */
    AvailableModelsResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.AvailableModelsResponse)
            return object;
        var message = new $root.AvailableModelsResponse();
        if (object.models) {
            if (!Array.isArray(object.models))
                throw TypeError(".AvailableModelsResponse.models: array expected");
            message.models = [];
            for (var i = 0; i < object.models.length; ++i) {
                if (typeof object.models[i] !== "object")
                    throw TypeError(".AvailableModelsResponse.models: object expected");
                message.models[i] = $root.AvailableModelsResponse.AvailableModel.fromObject(object.models[i]);
            }
        }
        if (object.modelNames) {
            if (!Array.isArray(object.modelNames))
                throw TypeError(".AvailableModelsResponse.modelNames: array expected");
            message.modelNames = [];
            for (var i = 0; i < object.modelNames.length; ++i)
                message.modelNames[i] = String(object.modelNames[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an AvailableModelsResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AvailableModelsResponse
     * @static
     * @param {AvailableModelsResponse} message AvailableModelsResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AvailableModelsResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.modelNames = [];
            object.models = [];
        }
        if (message.modelNames && message.modelNames.length) {
            object.modelNames = [];
            for (var j = 0; j < message.modelNames.length; ++j)
                object.modelNames[j] = message.modelNames[j];
        }
        if (message.models && message.models.length) {
            object.models = [];
            for (var j = 0; j < message.models.length; ++j)
                object.models[j] = $root.AvailableModelsResponse.AvailableModel.toObject(message.models[j], options);
        }
        return object;
    };

    /**
     * Converts this AvailableModelsResponse to JSON.
     * @function toJSON
     * @memberof AvailableModelsResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AvailableModelsResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AvailableModelsResponse
     * @function getTypeUrl
     * @memberof AvailableModelsResponse
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AvailableModelsResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AvailableModelsResponse";
    };

    AvailableModelsResponse.AvailableModel = (function() {

        /**
         * Properties of an AvailableModel.
         * @memberof AvailableModelsResponse
         * @interface IAvailableModel
         * @property {string|null} [name] AvailableModel name
         * @property {boolean|null} [defaultOn] AvailableModel defaultOn
         * @property {boolean|null} [isLongContextOnly] AvailableModel isLongContextOnly
         * @property {boolean|null} [isChatOnly] AvailableModel isChatOnly
         */

        /**
         * Constructs a new AvailableModel.
         * @memberof AvailableModelsResponse
         * @classdesc Represents an AvailableModel.
         * @implements IAvailableModel
         * @constructor
         * @param {AvailableModelsResponse.IAvailableModel=} [properties] Properties to set
         */
        function AvailableModel(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AvailableModel name.
         * @member {string} name
         * @memberof AvailableModelsResponse.AvailableModel
         * @instance
         */
        AvailableModel.prototype.name = "";

        /**
         * AvailableModel defaultOn.
         * @member {boolean} defaultOn
         * @memberof AvailableModelsResponse.AvailableModel
         * @instance
         */
        AvailableModel.prototype.defaultOn = false;

        /**
         * AvailableModel isLongContextOnly.
         * @member {boolean|null|undefined} isLongContextOnly
         * @memberof AvailableModelsResponse.AvailableModel
         * @instance
         */
        AvailableModel.prototype.isLongContextOnly = null;

        /**
         * AvailableModel isChatOnly.
         * @member {boolean|null|undefined} isChatOnly
         * @memberof AvailableModelsResponse.AvailableModel
         * @instance
         */
        AvailableModel.prototype.isChatOnly = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(AvailableModel.prototype, "_isLongContextOnly", {
            get: $util.oneOfGetter($oneOfFields = ["isLongContextOnly"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(AvailableModel.prototype, "_isChatOnly", {
            get: $util.oneOfGetter($oneOfFields = ["isChatOnly"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new AvailableModel instance using the specified properties.
         * @function create
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {AvailableModelsResponse.IAvailableModel=} [properties] Properties to set
         * @returns {AvailableModelsResponse.AvailableModel} AvailableModel instance
         */
        AvailableModel.create = function create(properties) {
            return new AvailableModel(properties);
        };

        /**
         * Encodes the specified AvailableModel message. Does not implicitly {@link AvailableModelsResponse.AvailableModel.verify|verify} messages.
         * @function encode
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {AvailableModelsResponse.IAvailableModel} message AvailableModel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AvailableModel.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.defaultOn != null && Object.hasOwnProperty.call(message, "defaultOn"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.defaultOn);
            if (message.isLongContextOnly != null && Object.hasOwnProperty.call(message, "isLongContextOnly"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isLongContextOnly);
            if (message.isChatOnly != null && Object.hasOwnProperty.call(message, "isChatOnly"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isChatOnly);
            return writer;
        };

        /**
         * Encodes the specified AvailableModel message, length delimited. Does not implicitly {@link AvailableModelsResponse.AvailableModel.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {AvailableModelsResponse.IAvailableModel} message AvailableModel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AvailableModel.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AvailableModel message from the specified reader or buffer.
         * @function decode
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AvailableModelsResponse.AvailableModel} AvailableModel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AvailableModel.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AvailableModelsResponse.AvailableModel();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.defaultOn = reader.bool();
                        break;
                    }
                case 3: {
                        message.isLongContextOnly = reader.bool();
                        break;
                    }
                case 4: {
                        message.isChatOnly = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AvailableModel message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AvailableModelsResponse.AvailableModel} AvailableModel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AvailableModel.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AvailableModel message.
         * @function verify
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AvailableModel.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.defaultOn != null && message.hasOwnProperty("defaultOn"))
                if (typeof message.defaultOn !== "boolean")
                    return "defaultOn: boolean expected";
            if (message.isLongContextOnly != null && message.hasOwnProperty("isLongContextOnly")) {
                properties._isLongContextOnly = 1;
                if (typeof message.isLongContextOnly !== "boolean")
                    return "isLongContextOnly: boolean expected";
            }
            if (message.isChatOnly != null && message.hasOwnProperty("isChatOnly")) {
                properties._isChatOnly = 1;
                if (typeof message.isChatOnly !== "boolean")
                    return "isChatOnly: boolean expected";
            }
            return null;
        };

        /**
         * Creates an AvailableModel message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AvailableModelsResponse.AvailableModel} AvailableModel
         */
        AvailableModel.fromObject = function fromObject(object) {
            if (object instanceof $root.AvailableModelsResponse.AvailableModel)
                return object;
            var message = new $root.AvailableModelsResponse.AvailableModel();
            if (object.name != null)
                message.name = String(object.name);
            if (object.defaultOn != null)
                message.defaultOn = Boolean(object.defaultOn);
            if (object.isLongContextOnly != null)
                message.isLongContextOnly = Boolean(object.isLongContextOnly);
            if (object.isChatOnly != null)
                message.isChatOnly = Boolean(object.isChatOnly);
            return message;
        };

        /**
         * Creates a plain object from an AvailableModel message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {AvailableModelsResponse.AvailableModel} message AvailableModel
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AvailableModel.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.defaultOn = false;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.defaultOn != null && message.hasOwnProperty("defaultOn"))
                object.defaultOn = message.defaultOn;
            if (message.isLongContextOnly != null && message.hasOwnProperty("isLongContextOnly")) {
                object.isLongContextOnly = message.isLongContextOnly;
                if (options.oneofs)
                    object._isLongContextOnly = "isLongContextOnly";
            }
            if (message.isChatOnly != null && message.hasOwnProperty("isChatOnly")) {
                object.isChatOnly = message.isChatOnly;
                if (options.oneofs)
                    object._isChatOnly = "isChatOnly";
            }
            return object;
        };

        /**
         * Converts this AvailableModel to JSON.
         * @function toJSON
         * @memberof AvailableModelsResponse.AvailableModel
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AvailableModel.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AvailableModel
         * @function getTypeUrl
         * @memberof AvailableModelsResponse.AvailableModel
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AvailableModel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/AvailableModelsResponse.AvailableModel";
        };

        return AvailableModel;
    })();

    return AvailableModelsResponse;
})();

/**
 * ClientSideToolV2 enum.
 * @exports ClientSideToolV2
 * @enum {number}
 * @property {number} CLIENT_SIDE_TOOL_V2_UNSPECIFIED=0 CLIENT_SIDE_TOOL_V2_UNSPECIFIED value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES=1 CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES value
 * @property {number} CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH=3 CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_FILE=5 CLIENT_SIDE_TOOL_V2_READ_FILE value
 * @property {number} CLIENT_SIDE_TOOL_V2_LIST_DIR=6 CLIENT_SIDE_TOOL_V2_LIST_DIR value
 * @property {number} CLIENT_SIDE_TOOL_V2_EDIT_FILE=7 CLIENT_SIDE_TOOL_V2_EDIT_FILE value
 * @property {number} CLIENT_SIDE_TOOL_V2_FILE_SEARCH=8 CLIENT_SIDE_TOOL_V2_FILE_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL=9 CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL value
 * @property {number} CLIENT_SIDE_TOOL_V2_DELETE_FILE=11 CLIENT_SIDE_TOOL_V2_DELETE_FILE value
 * @property {number} CLIENT_SIDE_TOOL_V2_REAPPLY=12 CLIENT_SIDE_TOOL_V2_REAPPLY value
 * @property {number} CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2=15 CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2 value
 * @property {number} CLIENT_SIDE_TOOL_V2_FETCH_RULES=16 CLIENT_SIDE_TOOL_V2_FETCH_RULES value
 * @property {number} CLIENT_SIDE_TOOL_V2_WEB_SEARCH=18 CLIENT_SIDE_TOOL_V2_WEB_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_MCP=19 CLIENT_SIDE_TOOL_V2_MCP value
 * @property {number} CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS=23 CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS value
 * @property {number} CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP=24 CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP value
 * @property {number} CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE=25 CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE value
 * @property {number} CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST=26 CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST value
 * @property {number} CLIENT_SIDE_TOOL_V2_DEEP_SEARCH=27 CLIENT_SIDE_TOOL_V2_DEEP_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM=28 CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM value
 * @property {number} CLIENT_SIDE_TOOL_V2_FIX_LINTS=29 CLIENT_SIDE_TOOL_V2_FIX_LINTS value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_LINTS=30 CLIENT_SIDE_TOOL_V2_READ_LINTS value
 * @property {number} CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION=31 CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION value
 * @property {number} CLIENT_SIDE_TOOL_V2_TASK=32 CLIENT_SIDE_TOOL_V2_TASK value
 * @property {number} CLIENT_SIDE_TOOL_V2_AWAIT_TASK=33 CLIENT_SIDE_TOOL_V2_AWAIT_TASK value
 * @property {number} CLIENT_SIDE_TOOL_V2_TODO_READ=34 CLIENT_SIDE_TOOL_V2_TODO_READ value
 * @property {number} CLIENT_SIDE_TOOL_V2_TODO_WRITE=35 CLIENT_SIDE_TOOL_V2_TODO_WRITE value
 * @property {number} CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2=38 CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2 value
 * @property {number} CLIENT_SIDE_TOOL_V2_LIST_DIR_V2=39 CLIENT_SIDE_TOOL_V2_LIST_DIR_V2 value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_FILE_V2=40 CLIENT_SIDE_TOOL_V2_READ_FILE_V2 value
 * @property {number} CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH=41 CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH=42 CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH value
 * @property {number} CLIENT_SIDE_TOOL_V2_CREATE_PLAN=43 CLIENT_SIDE_TOOL_V2_CREATE_PLAN value
 * @property {number} CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES=44 CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE=45 CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE value
 * @property {number} CLIENT_SIDE_TOOL_V2_READ_PROJECT=46 CLIENT_SIDE_TOOL_V2_READ_PROJECT value
 * @property {number} CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT=47 CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT value
 * @property {number} CLIENT_SIDE_TOOL_V2_TASK_V2=48 CLIENT_SIDE_TOOL_V2_TASK_V2 value
 * @property {number} CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL=49 CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL value
 * @property {number} CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF=50 CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF value
 * @property {number} CLIENT_SIDE_TOOL_V2_ASK_QUESTION=51 CLIENT_SIDE_TOOL_V2_ASK_QUESTION value
 * @property {number} CLIENT_SIDE_TOOL_V2_SWITCH_MODE=52 CLIENT_SIDE_TOOL_V2_SWITCH_MODE value
 * @property {number} CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE=53 CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE value
 * @property {number} CLIENT_SIDE_TOOL_V2_COMPUTER_USE=54 CLIENT_SIDE_TOOL_V2_COMPUTER_USE value
 * @property {number} CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN=55 CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN value
 * @property {number} CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS=63 CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS value
 */
$root.ClientSideToolV2 = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "CLIENT_SIDE_TOOL_V2_UNSPECIFIED"] = 0;
    values[valuesById[1] = "CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES"] = 1;
    values[valuesById[3] = "CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH"] = 3;
    values[valuesById[5] = "CLIENT_SIDE_TOOL_V2_READ_FILE"] = 5;
    values[valuesById[6] = "CLIENT_SIDE_TOOL_V2_LIST_DIR"] = 6;
    values[valuesById[7] = "CLIENT_SIDE_TOOL_V2_EDIT_FILE"] = 7;
    values[valuesById[8] = "CLIENT_SIDE_TOOL_V2_FILE_SEARCH"] = 8;
    values[valuesById[9] = "CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL"] = 9;
    values[valuesById[11] = "CLIENT_SIDE_TOOL_V2_DELETE_FILE"] = 11;
    values[valuesById[12] = "CLIENT_SIDE_TOOL_V2_REAPPLY"] = 12;
    values[valuesById[15] = "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2"] = 15;
    values[valuesById[16] = "CLIENT_SIDE_TOOL_V2_FETCH_RULES"] = 16;
    values[valuesById[18] = "CLIENT_SIDE_TOOL_V2_WEB_SEARCH"] = 18;
    values[valuesById[19] = "CLIENT_SIDE_TOOL_V2_MCP"] = 19;
    values[valuesById[23] = "CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS"] = 23;
    values[valuesById[24] = "CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP"] = 24;
    values[valuesById[25] = "CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE"] = 25;
    values[valuesById[26] = "CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST"] = 26;
    values[valuesById[27] = "CLIENT_SIDE_TOOL_V2_DEEP_SEARCH"] = 27;
    values[valuesById[28] = "CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM"] = 28;
    values[valuesById[29] = "CLIENT_SIDE_TOOL_V2_FIX_LINTS"] = 29;
    values[valuesById[30] = "CLIENT_SIDE_TOOL_V2_READ_LINTS"] = 30;
    values[valuesById[31] = "CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION"] = 31;
    values[valuesById[32] = "CLIENT_SIDE_TOOL_V2_TASK"] = 32;
    values[valuesById[33] = "CLIENT_SIDE_TOOL_V2_AWAIT_TASK"] = 33;
    values[valuesById[34] = "CLIENT_SIDE_TOOL_V2_TODO_READ"] = 34;
    values[valuesById[35] = "CLIENT_SIDE_TOOL_V2_TODO_WRITE"] = 35;
    values[valuesById[38] = "CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2"] = 38;
    values[valuesById[39] = "CLIENT_SIDE_TOOL_V2_LIST_DIR_V2"] = 39;
    values[valuesById[40] = "CLIENT_SIDE_TOOL_V2_READ_FILE_V2"] = 40;
    values[valuesById[41] = "CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH"] = 41;
    values[valuesById[42] = "CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH"] = 42;
    values[valuesById[43] = "CLIENT_SIDE_TOOL_V2_CREATE_PLAN"] = 43;
    values[valuesById[44] = "CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES"] = 44;
    values[valuesById[45] = "CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE"] = 45;
    values[valuesById[46] = "CLIENT_SIDE_TOOL_V2_READ_PROJECT"] = 46;
    values[valuesById[47] = "CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT"] = 47;
    values[valuesById[48] = "CLIENT_SIDE_TOOL_V2_TASK_V2"] = 48;
    values[valuesById[49] = "CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL"] = 49;
    values[valuesById[50] = "CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF"] = 50;
    values[valuesById[51] = "CLIENT_SIDE_TOOL_V2_ASK_QUESTION"] = 51;
    values[valuesById[52] = "CLIENT_SIDE_TOOL_V2_SWITCH_MODE"] = 52;
    values[valuesById[53] = "CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE"] = 53;
    values[valuesById[54] = "CLIENT_SIDE_TOOL_V2_COMPUTER_USE"] = 54;
    values[valuesById[55] = "CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN"] = 55;
    values[valuesById[63] = "CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS"] = 63;
    return values;
})();

$root.ClientSideToolV2Call = (function() {

    /**
     * Properties of a ClientSideToolV2Call.
     * @exports IClientSideToolV2Call
     * @interface IClientSideToolV2Call
     * @property {ClientSideToolV2|null} [tool] ClientSideToolV2Call tool
     * @property {string|null} [toolCallId] ClientSideToolV2Call toolCallId
     * @property {string|null} [name] ClientSideToolV2Call name
     * @property {string|null} [rawArgs] ClientSideToolV2Call rawArgs
     */

    /**
     * Constructs a new ClientSideToolV2Call.
     * @exports ClientSideToolV2Call
     * @classdesc Represents a ClientSideToolV2Call.
     * @implements IClientSideToolV2Call
     * @constructor
     * @param {IClientSideToolV2Call=} [properties] Properties to set
     */
    function ClientSideToolV2Call(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClientSideToolV2Call tool.
     * @member {ClientSideToolV2} tool
     * @memberof ClientSideToolV2Call
     * @instance
     */
    ClientSideToolV2Call.prototype.tool = 0;

    /**
     * ClientSideToolV2Call toolCallId.
     * @member {string} toolCallId
     * @memberof ClientSideToolV2Call
     * @instance
     */
    ClientSideToolV2Call.prototype.toolCallId = "";

    /**
     * ClientSideToolV2Call name.
     * @member {string} name
     * @memberof ClientSideToolV2Call
     * @instance
     */
    ClientSideToolV2Call.prototype.name = "";

    /**
     * ClientSideToolV2Call rawArgs.
     * @member {string} rawArgs
     * @memberof ClientSideToolV2Call
     * @instance
     */
    ClientSideToolV2Call.prototype.rawArgs = "";

    /**
     * Creates a new ClientSideToolV2Call instance using the specified properties.
     * @function create
     * @memberof ClientSideToolV2Call
     * @static
     * @param {IClientSideToolV2Call=} [properties] Properties to set
     * @returns {ClientSideToolV2Call} ClientSideToolV2Call instance
     */
    ClientSideToolV2Call.create = function create(properties) {
        return new ClientSideToolV2Call(properties);
    };

    /**
     * Encodes the specified ClientSideToolV2Call message. Does not implicitly {@link ClientSideToolV2Call.verify|verify} messages.
     * @function encode
     * @memberof ClientSideToolV2Call
     * @static
     * @param {IClientSideToolV2Call} message ClientSideToolV2Call message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientSideToolV2Call.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tool != null && Object.hasOwnProperty.call(message, "tool"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.tool);
        if (message.toolCallId != null && Object.hasOwnProperty.call(message, "toolCallId"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.toolCallId);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.name);
        if (message.rawArgs != null && Object.hasOwnProperty.call(message, "rawArgs"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.rawArgs);
        return writer;
    };

    /**
     * Encodes the specified ClientSideToolV2Call message, length delimited. Does not implicitly {@link ClientSideToolV2Call.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClientSideToolV2Call
     * @static
     * @param {IClientSideToolV2Call} message ClientSideToolV2Call message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientSideToolV2Call.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClientSideToolV2Call message from the specified reader or buffer.
     * @function decode
     * @memberof ClientSideToolV2Call
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClientSideToolV2Call} ClientSideToolV2Call
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientSideToolV2Call.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClientSideToolV2Call();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.tool = reader.int32();
                    break;
                }
            case 3: {
                    message.toolCallId = reader.string();
                    break;
                }
            case 9: {
                    message.name = reader.string();
                    break;
                }
            case 10: {
                    message.rawArgs = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClientSideToolV2Call message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClientSideToolV2Call
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClientSideToolV2Call} ClientSideToolV2Call
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientSideToolV2Call.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClientSideToolV2Call message.
     * @function verify
     * @memberof ClientSideToolV2Call
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClientSideToolV2Call.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.tool != null && message.hasOwnProperty("tool"))
            switch (message.tool) {
            default:
                return "tool: enum value expected";
            case 0:
            case 1:
            case 3:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 12:
            case 15:
            case 16:
            case 18:
            case 19:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 63:
                break;
            }
        if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
            if (!$util.isString(message.toolCallId))
                return "toolCallId: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.rawArgs != null && message.hasOwnProperty("rawArgs"))
            if (!$util.isString(message.rawArgs))
                return "rawArgs: string expected";
        return null;
    };

    /**
     * Creates a ClientSideToolV2Call message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClientSideToolV2Call
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClientSideToolV2Call} ClientSideToolV2Call
     */
    ClientSideToolV2Call.fromObject = function fromObject(object) {
        if (object instanceof $root.ClientSideToolV2Call)
            return object;
        var message = new $root.ClientSideToolV2Call();
        switch (object.tool) {
        default:
            if (typeof object.tool === "number") {
                message.tool = object.tool;
                break;
            }
            break;
        case "CLIENT_SIDE_TOOL_V2_UNSPECIFIED":
        case 0:
            message.tool = 0;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES":
        case 1:
            message.tool = 1;
            break;
        case "CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH":
        case 3:
            message.tool = 3;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_FILE":
        case 5:
            message.tool = 5;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_DIR":
        case 6:
            message.tool = 6;
            break;
        case "CLIENT_SIDE_TOOL_V2_EDIT_FILE":
        case 7:
            message.tool = 7;
            break;
        case "CLIENT_SIDE_TOOL_V2_FILE_SEARCH":
        case 8:
            message.tool = 8;
            break;
        case "CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL":
        case 9:
            message.tool = 9;
            break;
        case "CLIENT_SIDE_TOOL_V2_DELETE_FILE":
        case 11:
            message.tool = 11;
            break;
        case "CLIENT_SIDE_TOOL_V2_REAPPLY":
        case 12:
            message.tool = 12;
            break;
        case "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2":
        case 15:
            message.tool = 15;
            break;
        case "CLIENT_SIDE_TOOL_V2_FETCH_RULES":
        case 16:
            message.tool = 16;
            break;
        case "CLIENT_SIDE_TOOL_V2_WEB_SEARCH":
        case 18:
            message.tool = 18;
            break;
        case "CLIENT_SIDE_TOOL_V2_MCP":
        case 19:
            message.tool = 19;
            break;
        case "CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS":
        case 23:
            message.tool = 23;
            break;
        case "CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP":
        case 24:
            message.tool = 24;
            break;
        case "CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE":
        case 25:
            message.tool = 25;
            break;
        case "CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST":
        case 26:
            message.tool = 26;
            break;
        case "CLIENT_SIDE_TOOL_V2_DEEP_SEARCH":
        case 27:
            message.tool = 27;
            break;
        case "CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM":
        case 28:
            message.tool = 28;
            break;
        case "CLIENT_SIDE_TOOL_V2_FIX_LINTS":
        case 29:
            message.tool = 29;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_LINTS":
        case 30:
            message.tool = 30;
            break;
        case "CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION":
        case 31:
            message.tool = 31;
            break;
        case "CLIENT_SIDE_TOOL_V2_TASK":
        case 32:
            message.tool = 32;
            break;
        case "CLIENT_SIDE_TOOL_V2_AWAIT_TASK":
        case 33:
            message.tool = 33;
            break;
        case "CLIENT_SIDE_TOOL_V2_TODO_READ":
        case 34:
            message.tool = 34;
            break;
        case "CLIENT_SIDE_TOOL_V2_TODO_WRITE":
        case 35:
            message.tool = 35;
            break;
        case "CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2":
        case 38:
            message.tool = 38;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_DIR_V2":
        case 39:
            message.tool = 39;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_FILE_V2":
        case 40:
            message.tool = 40;
            break;
        case "CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH":
        case 41:
            message.tool = 41;
            break;
        case "CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH":
        case 42:
            message.tool = 42;
            break;
        case "CLIENT_SIDE_TOOL_V2_CREATE_PLAN":
        case 43:
            message.tool = 43;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES":
        case 44:
            message.tool = 44;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE":
        case 45:
            message.tool = 45;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_PROJECT":
        case 46:
            message.tool = 46;
            break;
        case "CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT":
        case 47:
            message.tool = 47;
            break;
        case "CLIENT_SIDE_TOOL_V2_TASK_V2":
        case 48:
            message.tool = 48;
            break;
        case "CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL":
        case 49:
            message.tool = 49;
            break;
        case "CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF":
        case 50:
            message.tool = 50;
            break;
        case "CLIENT_SIDE_TOOL_V2_ASK_QUESTION":
        case 51:
            message.tool = 51;
            break;
        case "CLIENT_SIDE_TOOL_V2_SWITCH_MODE":
        case 52:
            message.tool = 52;
            break;
        case "CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE":
        case 53:
            message.tool = 53;
            break;
        case "CLIENT_SIDE_TOOL_V2_COMPUTER_USE":
        case 54:
            message.tool = 54;
            break;
        case "CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN":
        case 55:
            message.tool = 55;
            break;
        case "CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS":
        case 63:
            message.tool = 63;
            break;
        }
        if (object.toolCallId != null)
            message.toolCallId = String(object.toolCallId);
        if (object.name != null)
            message.name = String(object.name);
        if (object.rawArgs != null)
            message.rawArgs = String(object.rawArgs);
        return message;
    };

    /**
     * Creates a plain object from a ClientSideToolV2Call message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClientSideToolV2Call
     * @static
     * @param {ClientSideToolV2Call} message ClientSideToolV2Call
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClientSideToolV2Call.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.tool = options.enums === String ? "CLIENT_SIDE_TOOL_V2_UNSPECIFIED" : 0;
            object.toolCallId = "";
            object.name = "";
            object.rawArgs = "";
        }
        if (message.tool != null && message.hasOwnProperty("tool"))
            object.tool = options.enums === String ? $root.ClientSideToolV2[message.tool] === undefined ? message.tool : $root.ClientSideToolV2[message.tool] : message.tool;
        if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
            object.toolCallId = message.toolCallId;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.rawArgs != null && message.hasOwnProperty("rawArgs"))
            object.rawArgs = message.rawArgs;
        return object;
    };

    /**
     * Converts this ClientSideToolV2Call to JSON.
     * @function toJSON
     * @memberof ClientSideToolV2Call
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClientSideToolV2Call.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ClientSideToolV2Call
     * @function getTypeUrl
     * @memberof ClientSideToolV2Call
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ClientSideToolV2Call.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ClientSideToolV2Call";
    };

    return ClientSideToolV2Call;
})();

$root.ClientSideToolV2Result = (function() {

    /**
     * Properties of a ClientSideToolV2Result.
     * @exports IClientSideToolV2Result
     * @interface IClientSideToolV2Result
     * @property {ClientSideToolV2|null} [tool] ClientSideToolV2Result tool
     * @property {string|null} [toolCallId] ClientSideToolV2Result toolCallId
     */

    /**
     * Constructs a new ClientSideToolV2Result.
     * @exports ClientSideToolV2Result
     * @classdesc Represents a ClientSideToolV2Result.
     * @implements IClientSideToolV2Result
     * @constructor
     * @param {IClientSideToolV2Result=} [properties] Properties to set
     */
    function ClientSideToolV2Result(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClientSideToolV2Result tool.
     * @member {ClientSideToolV2} tool
     * @memberof ClientSideToolV2Result
     * @instance
     */
    ClientSideToolV2Result.prototype.tool = 0;

    /**
     * ClientSideToolV2Result toolCallId.
     * @member {string} toolCallId
     * @memberof ClientSideToolV2Result
     * @instance
     */
    ClientSideToolV2Result.prototype.toolCallId = "";

    /**
     * Creates a new ClientSideToolV2Result instance using the specified properties.
     * @function create
     * @memberof ClientSideToolV2Result
     * @static
     * @param {IClientSideToolV2Result=} [properties] Properties to set
     * @returns {ClientSideToolV2Result} ClientSideToolV2Result instance
     */
    ClientSideToolV2Result.create = function create(properties) {
        return new ClientSideToolV2Result(properties);
    };

    /**
     * Encodes the specified ClientSideToolV2Result message. Does not implicitly {@link ClientSideToolV2Result.verify|verify} messages.
     * @function encode
     * @memberof ClientSideToolV2Result
     * @static
     * @param {IClientSideToolV2Result} message ClientSideToolV2Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientSideToolV2Result.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tool != null && Object.hasOwnProperty.call(message, "tool"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.tool);
        if (message.toolCallId != null && Object.hasOwnProperty.call(message, "toolCallId"))
            writer.uint32(/* id 35, wireType 2 =*/282).string(message.toolCallId);
        return writer;
    };

    /**
     * Encodes the specified ClientSideToolV2Result message, length delimited. Does not implicitly {@link ClientSideToolV2Result.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClientSideToolV2Result
     * @static
     * @param {IClientSideToolV2Result} message ClientSideToolV2Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientSideToolV2Result.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClientSideToolV2Result message from the specified reader or buffer.
     * @function decode
     * @memberof ClientSideToolV2Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClientSideToolV2Result} ClientSideToolV2Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientSideToolV2Result.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClientSideToolV2Result();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.tool = reader.int32();
                    break;
                }
            case 35: {
                    message.toolCallId = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClientSideToolV2Result message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClientSideToolV2Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClientSideToolV2Result} ClientSideToolV2Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientSideToolV2Result.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClientSideToolV2Result message.
     * @function verify
     * @memberof ClientSideToolV2Result
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClientSideToolV2Result.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.tool != null && message.hasOwnProperty("tool"))
            switch (message.tool) {
            default:
                return "tool: enum value expected";
            case 0:
            case 1:
            case 3:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 12:
            case 15:
            case 16:
            case 18:
            case 19:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 63:
                break;
            }
        if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
            if (!$util.isString(message.toolCallId))
                return "toolCallId: string expected";
        return null;
    };

    /**
     * Creates a ClientSideToolV2Result message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClientSideToolV2Result
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClientSideToolV2Result} ClientSideToolV2Result
     */
    ClientSideToolV2Result.fromObject = function fromObject(object) {
        if (object instanceof $root.ClientSideToolV2Result)
            return object;
        var message = new $root.ClientSideToolV2Result();
        switch (object.tool) {
        default:
            if (typeof object.tool === "number") {
                message.tool = object.tool;
                break;
            }
            break;
        case "CLIENT_SIDE_TOOL_V2_UNSPECIFIED":
        case 0:
            message.tool = 0;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES":
        case 1:
            message.tool = 1;
            break;
        case "CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH":
        case 3:
            message.tool = 3;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_FILE":
        case 5:
            message.tool = 5;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_DIR":
        case 6:
            message.tool = 6;
            break;
        case "CLIENT_SIDE_TOOL_V2_EDIT_FILE":
        case 7:
            message.tool = 7;
            break;
        case "CLIENT_SIDE_TOOL_V2_FILE_SEARCH":
        case 8:
            message.tool = 8;
            break;
        case "CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL":
        case 9:
            message.tool = 9;
            break;
        case "CLIENT_SIDE_TOOL_V2_DELETE_FILE":
        case 11:
            message.tool = 11;
            break;
        case "CLIENT_SIDE_TOOL_V2_REAPPLY":
        case 12:
            message.tool = 12;
            break;
        case "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2":
        case 15:
            message.tool = 15;
            break;
        case "CLIENT_SIDE_TOOL_V2_FETCH_RULES":
        case 16:
            message.tool = 16;
            break;
        case "CLIENT_SIDE_TOOL_V2_WEB_SEARCH":
        case 18:
            message.tool = 18;
            break;
        case "CLIENT_SIDE_TOOL_V2_MCP":
        case 19:
            message.tool = 19;
            break;
        case "CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS":
        case 23:
            message.tool = 23;
            break;
        case "CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP":
        case 24:
            message.tool = 24;
            break;
        case "CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE":
        case 25:
            message.tool = 25;
            break;
        case "CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST":
        case 26:
            message.tool = 26;
            break;
        case "CLIENT_SIDE_TOOL_V2_DEEP_SEARCH":
        case 27:
            message.tool = 27;
            break;
        case "CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM":
        case 28:
            message.tool = 28;
            break;
        case "CLIENT_SIDE_TOOL_V2_FIX_LINTS":
        case 29:
            message.tool = 29;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_LINTS":
        case 30:
            message.tool = 30;
            break;
        case "CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION":
        case 31:
            message.tool = 31;
            break;
        case "CLIENT_SIDE_TOOL_V2_TASK":
        case 32:
            message.tool = 32;
            break;
        case "CLIENT_SIDE_TOOL_V2_AWAIT_TASK":
        case 33:
            message.tool = 33;
            break;
        case "CLIENT_SIDE_TOOL_V2_TODO_READ":
        case 34:
            message.tool = 34;
            break;
        case "CLIENT_SIDE_TOOL_V2_TODO_WRITE":
        case 35:
            message.tool = 35;
            break;
        case "CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2":
        case 38:
            message.tool = 38;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_DIR_V2":
        case 39:
            message.tool = 39;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_FILE_V2":
        case 40:
            message.tool = 40;
            break;
        case "CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH":
        case 41:
            message.tool = 41;
            break;
        case "CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH":
        case 42:
            message.tool = 42;
            break;
        case "CLIENT_SIDE_TOOL_V2_CREATE_PLAN":
        case 43:
            message.tool = 43;
            break;
        case "CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES":
        case 44:
            message.tool = 44;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE":
        case 45:
            message.tool = 45;
            break;
        case "CLIENT_SIDE_TOOL_V2_READ_PROJECT":
        case 46:
            message.tool = 46;
            break;
        case "CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT":
        case 47:
            message.tool = 47;
            break;
        case "CLIENT_SIDE_TOOL_V2_TASK_V2":
        case 48:
            message.tool = 48;
            break;
        case "CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL":
        case 49:
            message.tool = 49;
            break;
        case "CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF":
        case 50:
            message.tool = 50;
            break;
        case "CLIENT_SIDE_TOOL_V2_ASK_QUESTION":
        case 51:
            message.tool = 51;
            break;
        case "CLIENT_SIDE_TOOL_V2_SWITCH_MODE":
        case 52:
            message.tool = 52;
            break;
        case "CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE":
        case 53:
            message.tool = 53;
            break;
        case "CLIENT_SIDE_TOOL_V2_COMPUTER_USE":
        case 54:
            message.tool = 54;
            break;
        case "CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN":
        case 55:
            message.tool = 55;
            break;
        case "CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS":
        case 63:
            message.tool = 63;
            break;
        }
        if (object.toolCallId != null)
            message.toolCallId = String(object.toolCallId);
        return message;
    };

    /**
     * Creates a plain object from a ClientSideToolV2Result message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClientSideToolV2Result
     * @static
     * @param {ClientSideToolV2Result} message ClientSideToolV2Result
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClientSideToolV2Result.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.tool = options.enums === String ? "CLIENT_SIDE_TOOL_V2_UNSPECIFIED" : 0;
            object.toolCallId = "";
        }
        if (message.tool != null && message.hasOwnProperty("tool"))
            object.tool = options.enums === String ? $root.ClientSideToolV2[message.tool] === undefined ? message.tool : $root.ClientSideToolV2[message.tool] : message.tool;
        if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
            object.toolCallId = message.toolCallId;
        return object;
    };

    /**
     * Converts this ClientSideToolV2Result to JSON.
     * @function toJSON
     * @memberof ClientSideToolV2Result
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClientSideToolV2Result.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ClientSideToolV2Result
     * @function getTypeUrl
     * @memberof ClientSideToolV2Result
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ClientSideToolV2Result.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ClientSideToolV2Result";
    };

    return ClientSideToolV2Result;
})();

$root.MessageSummary = (function() {

    /**
     * Properties of a MessageSummary.
     * @exports IMessageSummary
     * @interface IMessageSummary
     * @property {string|null} [content] MessageSummary content
     * @property {string|null} [summaryId1] MessageSummary summaryId1
     * @property {string|null} [summaryId2] MessageSummary summaryId2
     * @property {string|null} [previousSummaryId] MessageSummary previousSummaryId
     */

    /**
     * Constructs a new MessageSummary.
     * @exports MessageSummary
     * @classdesc Represents a MessageSummary.
     * @implements IMessageSummary
     * @constructor
     * @param {IMessageSummary=} [properties] Properties to set
     */
    function MessageSummary(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MessageSummary content.
     * @member {string} content
     * @memberof MessageSummary
     * @instance
     */
    MessageSummary.prototype.content = "";

    /**
     * MessageSummary summaryId1.
     * @member {string} summaryId1
     * @memberof MessageSummary
     * @instance
     */
    MessageSummary.prototype.summaryId1 = "";

    /**
     * MessageSummary summaryId2.
     * @member {string} summaryId2
     * @memberof MessageSummary
     * @instance
     */
    MessageSummary.prototype.summaryId2 = "";

    /**
     * MessageSummary previousSummaryId.
     * @member {string} previousSummaryId
     * @memberof MessageSummary
     * @instance
     */
    MessageSummary.prototype.previousSummaryId = "";

    /**
     * Creates a new MessageSummary instance using the specified properties.
     * @function create
     * @memberof MessageSummary
     * @static
     * @param {IMessageSummary=} [properties] Properties to set
     * @returns {MessageSummary} MessageSummary instance
     */
    MessageSummary.create = function create(properties) {
        return new MessageSummary(properties);
    };

    /**
     * Encodes the specified MessageSummary message. Does not implicitly {@link MessageSummary.verify|verify} messages.
     * @function encode
     * @memberof MessageSummary
     * @static
     * @param {IMessageSummary} message MessageSummary message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MessageSummary.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.content);
        if (message.summaryId1 != null && Object.hasOwnProperty.call(message, "summaryId1"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.summaryId1);
        if (message.summaryId2 != null && Object.hasOwnProperty.call(message, "summaryId2"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.summaryId2);
        if (message.previousSummaryId != null && Object.hasOwnProperty.call(message, "previousSummaryId"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.previousSummaryId);
        return writer;
    };

    /**
     * Encodes the specified MessageSummary message, length delimited. Does not implicitly {@link MessageSummary.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MessageSummary
     * @static
     * @param {IMessageSummary} message MessageSummary message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MessageSummary.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MessageSummary message from the specified reader or buffer.
     * @function decode
     * @memberof MessageSummary
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MessageSummary} MessageSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MessageSummary.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MessageSummary();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.content = reader.string();
                    break;
                }
            case 2: {
                    message.summaryId1 = reader.string();
                    break;
                }
            case 3: {
                    message.summaryId2 = reader.string();
                    break;
                }
            case 4: {
                    message.previousSummaryId = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MessageSummary message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MessageSummary
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MessageSummary} MessageSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MessageSummary.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MessageSummary message.
     * @function verify
     * @memberof MessageSummary
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MessageSummary.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.content != null && message.hasOwnProperty("content"))
            if (!$util.isString(message.content))
                return "content: string expected";
        if (message.summaryId1 != null && message.hasOwnProperty("summaryId1"))
            if (!$util.isString(message.summaryId1))
                return "summaryId1: string expected";
        if (message.summaryId2 != null && message.hasOwnProperty("summaryId2"))
            if (!$util.isString(message.summaryId2))
                return "summaryId2: string expected";
        if (message.previousSummaryId != null && message.hasOwnProperty("previousSummaryId"))
            if (!$util.isString(message.previousSummaryId))
                return "previousSummaryId: string expected";
        return null;
    };

    /**
     * Creates a MessageSummary message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MessageSummary
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MessageSummary} MessageSummary
     */
    MessageSummary.fromObject = function fromObject(object) {
        if (object instanceof $root.MessageSummary)
            return object;
        var message = new $root.MessageSummary();
        if (object.content != null)
            message.content = String(object.content);
        if (object.summaryId1 != null)
            message.summaryId1 = String(object.summaryId1);
        if (object.summaryId2 != null)
            message.summaryId2 = String(object.summaryId2);
        if (object.previousSummaryId != null)
            message.previousSummaryId = String(object.previousSummaryId);
        return message;
    };

    /**
     * Creates a plain object from a MessageSummary message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MessageSummary
     * @static
     * @param {MessageSummary} message MessageSummary
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MessageSummary.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.content = "";
            object.summaryId1 = "";
            object.summaryId2 = "";
            object.previousSummaryId = "";
        }
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = message.content;
        if (message.summaryId1 != null && message.hasOwnProperty("summaryId1"))
            object.summaryId1 = message.summaryId1;
        if (message.summaryId2 != null && message.hasOwnProperty("summaryId2"))
            object.summaryId2 = message.summaryId2;
        if (message.previousSummaryId != null && message.hasOwnProperty("previousSummaryId"))
            object.previousSummaryId = message.previousSummaryId;
        return object;
    };

    /**
     * Converts this MessageSummary to JSON.
     * @function toJSON
     * @memberof MessageSummary
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MessageSummary.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for MessageSummary
     * @function getTypeUrl
     * @memberof MessageSummary
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    MessageSummary.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/MessageSummary";
    };

    return MessageSummary;
})();

$root.MessageThinking = (function() {

    /**
     * Properties of a MessageThinking.
     * @exports IMessageThinking
     * @interface IMessageThinking
     * @property {string|null} [content] MessageThinking content
     */

    /**
     * Constructs a new MessageThinking.
     * @exports MessageThinking
     * @classdesc Represents a MessageThinking.
     * @implements IMessageThinking
     * @constructor
     * @param {IMessageThinking=} [properties] Properties to set
     */
    function MessageThinking(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MessageThinking content.
     * @member {string} content
     * @memberof MessageThinking
     * @instance
     */
    MessageThinking.prototype.content = "";

    /**
     * Creates a new MessageThinking instance using the specified properties.
     * @function create
     * @memberof MessageThinking
     * @static
     * @param {IMessageThinking=} [properties] Properties to set
     * @returns {MessageThinking} MessageThinking instance
     */
    MessageThinking.create = function create(properties) {
        return new MessageThinking(properties);
    };

    /**
     * Encodes the specified MessageThinking message. Does not implicitly {@link MessageThinking.verify|verify} messages.
     * @function encode
     * @memberof MessageThinking
     * @static
     * @param {IMessageThinking} message MessageThinking message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MessageThinking.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.content);
        return writer;
    };

    /**
     * Encodes the specified MessageThinking message, length delimited. Does not implicitly {@link MessageThinking.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MessageThinking
     * @static
     * @param {IMessageThinking} message MessageThinking message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MessageThinking.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MessageThinking message from the specified reader or buffer.
     * @function decode
     * @memberof MessageThinking
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MessageThinking} MessageThinking
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MessageThinking.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MessageThinking();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.content = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MessageThinking message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MessageThinking
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MessageThinking} MessageThinking
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MessageThinking.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MessageThinking message.
     * @function verify
     * @memberof MessageThinking
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MessageThinking.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.content != null && message.hasOwnProperty("content"))
            if (!$util.isString(message.content))
                return "content: string expected";
        return null;
    };

    /**
     * Creates a MessageThinking message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MessageThinking
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MessageThinking} MessageThinking
     */
    MessageThinking.fromObject = function fromObject(object) {
        if (object instanceof $root.MessageThinking)
            return object;
        var message = new $root.MessageThinking();
        if (object.content != null)
            message.content = String(object.content);
        return message;
    };

    /**
     * Creates a plain object from a MessageThinking message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MessageThinking
     * @static
     * @param {MessageThinking} message MessageThinking
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MessageThinking.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.content = "";
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = message.content;
        return object;
    };

    /**
     * Converts this MessageThinking to JSON.
     * @function toJSON
     * @memberof MessageThinking
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MessageThinking.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for MessageThinking
     * @function getTypeUrl
     * @memberof MessageThinking
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    MessageThinking.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/MessageThinking";
    };

    return MessageThinking;
})();

$root.StreamUnifiedChatWithToolsRequest = (function() {

    /**
     * Properties of a StreamUnifiedChatWithToolsRequest.
     * @exports IStreamUnifiedChatWithToolsRequest
     * @interface IStreamUnifiedChatWithToolsRequest
     * @property {StreamUnifiedChatWithToolsRequest.IRequest|null} [request] StreamUnifiedChatWithToolsRequest request
     */

    /**
     * Constructs a new StreamUnifiedChatWithToolsRequest.
     * @exports StreamUnifiedChatWithToolsRequest
     * @classdesc Represents a StreamUnifiedChatWithToolsRequest.
     * @implements IStreamUnifiedChatWithToolsRequest
     * @constructor
     * @param {IStreamUnifiedChatWithToolsRequest=} [properties] Properties to set
     */
    function StreamUnifiedChatWithToolsRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StreamUnifiedChatWithToolsRequest request.
     * @member {StreamUnifiedChatWithToolsRequest.IRequest|null|undefined} request
     * @memberof StreamUnifiedChatWithToolsRequest
     * @instance
     */
    StreamUnifiedChatWithToolsRequest.prototype.request = null;

    /**
     * Creates a new StreamUnifiedChatWithToolsRequest instance using the specified properties.
     * @function create
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {IStreamUnifiedChatWithToolsRequest=} [properties] Properties to set
     * @returns {StreamUnifiedChatWithToolsRequest} StreamUnifiedChatWithToolsRequest instance
     */
    StreamUnifiedChatWithToolsRequest.create = function create(properties) {
        return new StreamUnifiedChatWithToolsRequest(properties);
    };

    /**
     * Encodes the specified StreamUnifiedChatWithToolsRequest message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.verify|verify} messages.
     * @function encode
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {IStreamUnifiedChatWithToolsRequest} message StreamUnifiedChatWithToolsRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatWithToolsRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.request != null && Object.hasOwnProperty.call(message, "request"))
            $root.StreamUnifiedChatWithToolsRequest.Request.encode(message.request, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified StreamUnifiedChatWithToolsRequest message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {IStreamUnifiedChatWithToolsRequest} message StreamUnifiedChatWithToolsRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatWithToolsRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StreamUnifiedChatWithToolsRequest message from the specified reader or buffer.
     * @function decode
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StreamUnifiedChatWithToolsRequest} StreamUnifiedChatWithToolsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatWithToolsRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.request = $root.StreamUnifiedChatWithToolsRequest.Request.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StreamUnifiedChatWithToolsRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StreamUnifiedChatWithToolsRequest} StreamUnifiedChatWithToolsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatWithToolsRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StreamUnifiedChatWithToolsRequest message.
     * @function verify
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StreamUnifiedChatWithToolsRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.request != null && message.hasOwnProperty("request")) {
            var error = $root.StreamUnifiedChatWithToolsRequest.Request.verify(message.request);
            if (error)
                return "request." + error;
        }
        return null;
    };

    /**
     * Creates a StreamUnifiedChatWithToolsRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StreamUnifiedChatWithToolsRequest} StreamUnifiedChatWithToolsRequest
     */
    StreamUnifiedChatWithToolsRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.StreamUnifiedChatWithToolsRequest)
            return object;
        var message = new $root.StreamUnifiedChatWithToolsRequest();
        if (object.request != null) {
            if (typeof object.request !== "object")
                throw TypeError(".StreamUnifiedChatWithToolsRequest.request: object expected");
            message.request = $root.StreamUnifiedChatWithToolsRequest.Request.fromObject(object.request);
        }
        return message;
    };

    /**
     * Creates a plain object from a StreamUnifiedChatWithToolsRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {StreamUnifiedChatWithToolsRequest} message StreamUnifiedChatWithToolsRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamUnifiedChatWithToolsRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.request = null;
        if (message.request != null && message.hasOwnProperty("request"))
            object.request = $root.StreamUnifiedChatWithToolsRequest.Request.toObject(message.request, options);
        return object;
    };

    /**
     * Converts this StreamUnifiedChatWithToolsRequest to JSON.
     * @function toJSON
     * @memberof StreamUnifiedChatWithToolsRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamUnifiedChatWithToolsRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for StreamUnifiedChatWithToolsRequest
     * @function getTypeUrl
     * @memberof StreamUnifiedChatWithToolsRequest
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    StreamUnifiedChatWithToolsRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest";
    };

    StreamUnifiedChatWithToolsRequest.Request = (function() {

        /**
         * Properties of a Request.
         * @memberof StreamUnifiedChatWithToolsRequest
         * @interface IRequest
         * @property {Array.<StreamUnifiedChatWithToolsRequest.Request.IMessage>|null} [messages] Request messages
         * @property {number|null} [unknown2] Request unknown2
         * @property {StreamUnifiedChatWithToolsRequest.Request.IInstruction|null} [instruction] Request instruction
         * @property {number|null} [unknown4] Request unknown4
         * @property {StreamUnifiedChatWithToolsRequest.Request.IModel|null} [model] Request model
         * @property {Array.<string>|null} [wikiTool] Request wikiTool
         * @property {string|null} [webTool] Request webTool
         * @property {number|null} [unknown13] Request unknown13
         * @property {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting|null} [cursorSetting] Request cursorSetting
         * @property {number|null} [unknown19] Request unknown19
         * @property {number|null} [unknown22] Request unknown22
         * @property {string|null} [conversationId] Request conversationId
         * @property {StreamUnifiedChatWithToolsRequest.Request.IMetadata|null} [metadata] Request metadata
         * @property {boolean|null} [isAgentic] Request isAgentic
         * @property {Array.<ClientSideToolV2>|null} [supportedTools] Request supportedTools
         * @property {Array.<StreamUnifiedChatWithToolsRequest.Request.IMessageId>|null} [messageIds] Request messageIds
         * @property {number|null} [largeContext] Request largeContext
         * @property {number|null} [unknown38] Request unknown38
         * @property {number|null} [chatModeEnum] Request chatModeEnum
         * @property {string|null} [unknown47] Request unknown47
         * @property {number|null} [unknown48] Request unknown48
         * @property {number|null} [unknown49] Request unknown49
         * @property {number|null} [unknown51] Request unknown51
         * @property {number|null} [unknown53] Request unknown53
         * @property {string|null} [chatMode] Request chatMode
         */

        /**
         * Constructs a new Request.
         * @memberof StreamUnifiedChatWithToolsRequest
         * @classdesc Represents a Request.
         * @implements IRequest
         * @constructor
         * @param {StreamUnifiedChatWithToolsRequest.IRequest=} [properties] Properties to set
         */
        function Request(properties) {
            this.messages = [];
            this.wikiTool = [];
            this.supportedTools = [];
            this.messageIds = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Request messages.
         * @member {Array.<StreamUnifiedChatWithToolsRequest.Request.IMessage>} messages
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.messages = $util.emptyArray;

        /**
         * Request unknown2.
         * @member {number} unknown2
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown2 = 0;

        /**
         * Request instruction.
         * @member {StreamUnifiedChatWithToolsRequest.Request.IInstruction|null|undefined} instruction
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.instruction = null;

        /**
         * Request unknown4.
         * @member {number} unknown4
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown4 = 0;

        /**
         * Request model.
         * @member {StreamUnifiedChatWithToolsRequest.Request.IModel|null|undefined} model
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.model = null;

        /**
         * Request wikiTool.
         * @member {Array.<string>} wikiTool
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.wikiTool = $util.emptyArray;

        /**
         * Request webTool.
         * @member {string} webTool
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.webTool = "";

        /**
         * Request unknown13.
         * @member {number} unknown13
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown13 = 0;

        /**
         * Request cursorSetting.
         * @member {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting|null|undefined} cursorSetting
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.cursorSetting = null;

        /**
         * Request unknown19.
         * @member {number} unknown19
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown19 = 0;

        /**
         * Request unknown22.
         * @member {number} unknown22
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown22 = 0;

        /**
         * Request conversationId.
         * @member {string} conversationId
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.conversationId = "";

        /**
         * Request metadata.
         * @member {StreamUnifiedChatWithToolsRequest.Request.IMetadata|null|undefined} metadata
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.metadata = null;

        /**
         * Request isAgentic.
         * @member {boolean} isAgentic
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.isAgentic = false;

        /**
         * Request supportedTools.
         * @member {Array.<ClientSideToolV2>} supportedTools
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.supportedTools = $util.emptyArray;

        /**
         * Request messageIds.
         * @member {Array.<StreamUnifiedChatWithToolsRequest.Request.IMessageId>} messageIds
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.messageIds = $util.emptyArray;

        /**
         * Request largeContext.
         * @member {number} largeContext
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.largeContext = 0;

        /**
         * Request unknown38.
         * @member {number} unknown38
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown38 = 0;

        /**
         * Request chatModeEnum.
         * @member {number} chatModeEnum
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.chatModeEnum = 0;

        /**
         * Request unknown47.
         * @member {string} unknown47
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown47 = "";

        /**
         * Request unknown48.
         * @member {number} unknown48
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown48 = 0;

        /**
         * Request unknown49.
         * @member {number} unknown49
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown49 = 0;

        /**
         * Request unknown51.
         * @member {number} unknown51
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown51 = 0;

        /**
         * Request unknown53.
         * @member {number} unknown53
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.unknown53 = 0;

        /**
         * Request chatMode.
         * @member {string} chatMode
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         */
        Request.prototype.chatMode = "";

        /**
         * Creates a new Request instance using the specified properties.
         * @function create
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {StreamUnifiedChatWithToolsRequest.IRequest=} [properties] Properties to set
         * @returns {StreamUnifiedChatWithToolsRequest.Request} Request instance
         */
        Request.create = function create(properties) {
            return new Request(properties);
        };

        /**
         * Encodes the specified Request message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.verify|verify} messages.
         * @function encode
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {StreamUnifiedChatWithToolsRequest.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messages != null && message.messages.length)
                for (var i = 0; i < message.messages.length; ++i)
                    $root.StreamUnifiedChatWithToolsRequest.Request.Message.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.unknown2 != null && Object.hasOwnProperty.call(message, "unknown2"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.unknown2);
            if (message.instruction != null && Object.hasOwnProperty.call(message, "instruction"))
                $root.StreamUnifiedChatWithToolsRequest.Request.Instruction.encode(message.instruction, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.unknown4 != null && Object.hasOwnProperty.call(message, "unknown4"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.unknown4);
            if (message.model != null && Object.hasOwnProperty.call(message, "model"))
                $root.StreamUnifiedChatWithToolsRequest.Request.Model.encode(message.model, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.wikiTool != null && message.wikiTool.length)
                for (var i = 0; i < message.wikiTool.length; ++i)
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.wikiTool[i]);
            if (message.webTool != null && Object.hasOwnProperty.call(message, "webTool"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.webTool);
            if (message.unknown13 != null && Object.hasOwnProperty.call(message, "unknown13"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.unknown13);
            if (message.cursorSetting != null && Object.hasOwnProperty.call(message, "cursorSetting"))
                $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.encode(message.cursorSetting, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.unknown19 != null && Object.hasOwnProperty.call(message, "unknown19"))
                writer.uint32(/* id 19, wireType 0 =*/152).int32(message.unknown19);
            if (message.unknown22 != null && Object.hasOwnProperty.call(message, "unknown22"))
                writer.uint32(/* id 22, wireType 0 =*/176).int32(message.unknown22);
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                writer.uint32(/* id 23, wireType 2 =*/186).string(message.conversationId);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                $root.StreamUnifiedChatWithToolsRequest.Request.Metadata.encode(message.metadata, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.isAgentic != null && Object.hasOwnProperty.call(message, "isAgentic"))
                writer.uint32(/* id 27, wireType 0 =*/216).bool(message.isAgentic);
            if (message.supportedTools != null && message.supportedTools.length) {
                writer.uint32(/* id 29, wireType 2 =*/234).fork();
                for (var i = 0; i < message.supportedTools.length; ++i)
                    writer.int32(message.supportedTools[i]);
                writer.ldelim();
            }
            if (message.messageIds != null && message.messageIds.length)
                for (var i = 0; i < message.messageIds.length; ++i)
                    $root.StreamUnifiedChatWithToolsRequest.Request.MessageId.encode(message.messageIds[i], writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.largeContext != null && Object.hasOwnProperty.call(message, "largeContext"))
                writer.uint32(/* id 35, wireType 0 =*/280).int32(message.largeContext);
            if (message.unknown38 != null && Object.hasOwnProperty.call(message, "unknown38"))
                writer.uint32(/* id 38, wireType 0 =*/304).int32(message.unknown38);
            if (message.chatModeEnum != null && Object.hasOwnProperty.call(message, "chatModeEnum"))
                writer.uint32(/* id 46, wireType 0 =*/368).int32(message.chatModeEnum);
            if (message.unknown47 != null && Object.hasOwnProperty.call(message, "unknown47"))
                writer.uint32(/* id 47, wireType 2 =*/378).string(message.unknown47);
            if (message.unknown48 != null && Object.hasOwnProperty.call(message, "unknown48"))
                writer.uint32(/* id 48, wireType 0 =*/384).int32(message.unknown48);
            if (message.unknown49 != null && Object.hasOwnProperty.call(message, "unknown49"))
                writer.uint32(/* id 49, wireType 0 =*/392).int32(message.unknown49);
            if (message.unknown51 != null && Object.hasOwnProperty.call(message, "unknown51"))
                writer.uint32(/* id 51, wireType 0 =*/408).int32(message.unknown51);
            if (message.unknown53 != null && Object.hasOwnProperty.call(message, "unknown53"))
                writer.uint32(/* id 53, wireType 0 =*/424).int32(message.unknown53);
            if (message.chatMode != null && Object.hasOwnProperty.call(message, "chatMode"))
                writer.uint32(/* id 54, wireType 2 =*/434).string(message.chatMode);
            return writer;
        };

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.verify|verify} messages.
         * @function encodeDelimited
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {StreamUnifiedChatWithToolsRequest.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @function decode
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {StreamUnifiedChatWithToolsRequest.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.messages && message.messages.length))
                            message.messages = [];
                        message.messages.push($root.StreamUnifiedChatWithToolsRequest.Request.Message.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.unknown2 = reader.int32();
                        break;
                    }
                case 3: {
                        message.instruction = $root.StreamUnifiedChatWithToolsRequest.Request.Instruction.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.unknown4 = reader.int32();
                        break;
                    }
                case 5: {
                        message.model = $root.StreamUnifiedChatWithToolsRequest.Request.Model.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        if (!(message.wikiTool && message.wikiTool.length))
                            message.wikiTool = [];
                        message.wikiTool.push(reader.string());
                        break;
                    }
                case 8: {
                        message.webTool = reader.string();
                        break;
                    }
                case 13: {
                        message.unknown13 = reader.int32();
                        break;
                    }
                case 15: {
                        message.cursorSetting = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 19: {
                        message.unknown19 = reader.int32();
                        break;
                    }
                case 22: {
                        message.unknown22 = reader.int32();
                        break;
                    }
                case 23: {
                        message.conversationId = reader.string();
                        break;
                    }
                case 26: {
                        message.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Metadata.decode(reader, reader.uint32());
                        break;
                    }
                case 27: {
                        message.isAgentic = reader.bool();
                        break;
                    }
                case 29: {
                        if (!(message.supportedTools && message.supportedTools.length))
                            message.supportedTools = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.supportedTools.push(reader.int32());
                        } else
                            message.supportedTools.push(reader.int32());
                        break;
                    }
                case 30: {
                        if (!(message.messageIds && message.messageIds.length))
                            message.messageIds = [];
                        message.messageIds.push($root.StreamUnifiedChatWithToolsRequest.Request.MessageId.decode(reader, reader.uint32()));
                        break;
                    }
                case 35: {
                        message.largeContext = reader.int32();
                        break;
                    }
                case 38: {
                        message.unknown38 = reader.int32();
                        break;
                    }
                case 46: {
                        message.chatModeEnum = reader.int32();
                        break;
                    }
                case 47: {
                        message.unknown47 = reader.string();
                        break;
                    }
                case 48: {
                        message.unknown48 = reader.int32();
                        break;
                    }
                case 49: {
                        message.unknown49 = reader.int32();
                        break;
                    }
                case 51: {
                        message.unknown51 = reader.int32();
                        break;
                    }
                case 53: {
                        message.unknown53 = reader.int32();
                        break;
                    }
                case 54: {
                        message.chatMode = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {StreamUnifiedChatWithToolsRequest.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Request message.
         * @function verify
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Request.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messages != null && message.hasOwnProperty("messages")) {
                if (!Array.isArray(message.messages))
                    return "messages: array expected";
                for (var i = 0; i < message.messages.length; ++i) {
                    var error = $root.StreamUnifiedChatWithToolsRequest.Request.Message.verify(message.messages[i]);
                    if (error)
                        return "messages." + error;
                }
            }
            if (message.unknown2 != null && message.hasOwnProperty("unknown2"))
                if (!$util.isInteger(message.unknown2))
                    return "unknown2: integer expected";
            if (message.instruction != null && message.hasOwnProperty("instruction")) {
                var error = $root.StreamUnifiedChatWithToolsRequest.Request.Instruction.verify(message.instruction);
                if (error)
                    return "instruction." + error;
            }
            if (message.unknown4 != null && message.hasOwnProperty("unknown4"))
                if (!$util.isInteger(message.unknown4))
                    return "unknown4: integer expected";
            if (message.model != null && message.hasOwnProperty("model")) {
                var error = $root.StreamUnifiedChatWithToolsRequest.Request.Model.verify(message.model);
                if (error)
                    return "model." + error;
            }
            if (message.wikiTool != null && message.hasOwnProperty("wikiTool")) {
                if (!Array.isArray(message.wikiTool))
                    return "wikiTool: array expected";
                for (var i = 0; i < message.wikiTool.length; ++i)
                    if (!$util.isString(message.wikiTool[i]))
                        return "wikiTool: string[] expected";
            }
            if (message.webTool != null && message.hasOwnProperty("webTool"))
                if (!$util.isString(message.webTool))
                    return "webTool: string expected";
            if (message.unknown13 != null && message.hasOwnProperty("unknown13"))
                if (!$util.isInteger(message.unknown13))
                    return "unknown13: integer expected";
            if (message.cursorSetting != null && message.hasOwnProperty("cursorSetting")) {
                var error = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.verify(message.cursorSetting);
                if (error)
                    return "cursorSetting." + error;
            }
            if (message.unknown19 != null && message.hasOwnProperty("unknown19"))
                if (!$util.isInteger(message.unknown19))
                    return "unknown19: integer expected";
            if (message.unknown22 != null && message.hasOwnProperty("unknown22"))
                if (!$util.isInteger(message.unknown22))
                    return "unknown22: integer expected";
            if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                if (!$util.isString(message.conversationId))
                    return "conversationId: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                var error = $root.StreamUnifiedChatWithToolsRequest.Request.Metadata.verify(message.metadata);
                if (error)
                    return "metadata." + error;
            }
            if (message.isAgentic != null && message.hasOwnProperty("isAgentic"))
                if (typeof message.isAgentic !== "boolean")
                    return "isAgentic: boolean expected";
            if (message.supportedTools != null && message.hasOwnProperty("supportedTools")) {
                if (!Array.isArray(message.supportedTools))
                    return "supportedTools: array expected";
                for (var i = 0; i < message.supportedTools.length; ++i)
                    switch (message.supportedTools[i]) {
                    default:
                        return "supportedTools: enum value[] expected";
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 11:
                    case 12:
                    case 15:
                    case 16:
                    case 18:
                    case 19:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                    case 32:
                    case 33:
                    case 34:
                    case 35:
                    case 38:
                    case 39:
                    case 40:
                    case 41:
                    case 42:
                    case 43:
                    case 44:
                    case 45:
                    case 46:
                    case 47:
                    case 48:
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                    case 55:
                    case 63:
                        break;
                    }
            }
            if (message.messageIds != null && message.hasOwnProperty("messageIds")) {
                if (!Array.isArray(message.messageIds))
                    return "messageIds: array expected";
                for (var i = 0; i < message.messageIds.length; ++i) {
                    var error = $root.StreamUnifiedChatWithToolsRequest.Request.MessageId.verify(message.messageIds[i]);
                    if (error)
                        return "messageIds." + error;
                }
            }
            if (message.largeContext != null && message.hasOwnProperty("largeContext"))
                if (!$util.isInteger(message.largeContext))
                    return "largeContext: integer expected";
            if (message.unknown38 != null && message.hasOwnProperty("unknown38"))
                if (!$util.isInteger(message.unknown38))
                    return "unknown38: integer expected";
            if (message.chatModeEnum != null && message.hasOwnProperty("chatModeEnum"))
                if (!$util.isInteger(message.chatModeEnum))
                    return "chatModeEnum: integer expected";
            if (message.unknown47 != null && message.hasOwnProperty("unknown47"))
                if (!$util.isString(message.unknown47))
                    return "unknown47: string expected";
            if (message.unknown48 != null && message.hasOwnProperty("unknown48"))
                if (!$util.isInteger(message.unknown48))
                    return "unknown48: integer expected";
            if (message.unknown49 != null && message.hasOwnProperty("unknown49"))
                if (!$util.isInteger(message.unknown49))
                    return "unknown49: integer expected";
            if (message.unknown51 != null && message.hasOwnProperty("unknown51"))
                if (!$util.isInteger(message.unknown51))
                    return "unknown51: integer expected";
            if (message.unknown53 != null && message.hasOwnProperty("unknown53"))
                if (!$util.isInteger(message.unknown53))
                    return "unknown53: integer expected";
            if (message.chatMode != null && message.hasOwnProperty("chatMode"))
                if (!$util.isString(message.chatMode))
                    return "chatMode: string expected";
            return null;
        };

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {StreamUnifiedChatWithToolsRequest.Request} Request
         */
        Request.fromObject = function fromObject(object) {
            if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request)
                return object;
            var message = new $root.StreamUnifiedChatWithToolsRequest.Request();
            if (object.messages) {
                if (!Array.isArray(object.messages))
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.messages: array expected");
                message.messages = [];
                for (var i = 0; i < object.messages.length; ++i) {
                    if (typeof object.messages[i] !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.messages: object expected");
                    message.messages[i] = $root.StreamUnifiedChatWithToolsRequest.Request.Message.fromObject(object.messages[i]);
                }
            }
            if (object.unknown2 != null)
                message.unknown2 = object.unknown2 | 0;
            if (object.instruction != null) {
                if (typeof object.instruction !== "object")
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.instruction: object expected");
                message.instruction = $root.StreamUnifiedChatWithToolsRequest.Request.Instruction.fromObject(object.instruction);
            }
            if (object.unknown4 != null)
                message.unknown4 = object.unknown4 | 0;
            if (object.model != null) {
                if (typeof object.model !== "object")
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.model: object expected");
                message.model = $root.StreamUnifiedChatWithToolsRequest.Request.Model.fromObject(object.model);
            }
            if (object.wikiTool) {
                if (!Array.isArray(object.wikiTool))
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.wikiTool: array expected");
                message.wikiTool = [];
                for (var i = 0; i < object.wikiTool.length; ++i)
                    message.wikiTool[i] = String(object.wikiTool[i]);
            }
            if (object.webTool != null)
                message.webTool = String(object.webTool);
            if (object.unknown13 != null)
                message.unknown13 = object.unknown13 | 0;
            if (object.cursorSetting != null) {
                if (typeof object.cursorSetting !== "object")
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.cursorSetting: object expected");
                message.cursorSetting = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.fromObject(object.cursorSetting);
            }
            if (object.unknown19 != null)
                message.unknown19 = object.unknown19 | 0;
            if (object.unknown22 != null)
                message.unknown22 = object.unknown22 | 0;
            if (object.conversationId != null)
                message.conversationId = String(object.conversationId);
            if (object.metadata != null) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.metadata: object expected");
                message.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Metadata.fromObject(object.metadata);
            }
            if (object.isAgentic != null)
                message.isAgentic = Boolean(object.isAgentic);
            if (object.supportedTools) {
                if (!Array.isArray(object.supportedTools))
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.supportedTools: array expected");
                message.supportedTools = [];
                for (var i = 0; i < object.supportedTools.length; ++i)
                    switch (object.supportedTools[i]) {
                    default:
                        if (typeof object.supportedTools[i] === "number") {
                            message.supportedTools[i] = object.supportedTools[i];
                            break;
                        }
                    case "CLIENT_SIDE_TOOL_V2_UNSPECIFIED":
                    case 0:
                        message.supportedTools[i] = 0;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES":
                    case 1:
                        message.supportedTools[i] = 1;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH":
                    case 3:
                        message.supportedTools[i] = 3;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_FILE":
                    case 5:
                        message.supportedTools[i] = 5;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_LIST_DIR":
                    case 6:
                        message.supportedTools[i] = 6;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_EDIT_FILE":
                    case 7:
                        message.supportedTools[i] = 7;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_FILE_SEARCH":
                    case 8:
                        message.supportedTools[i] = 8;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL":
                    case 9:
                        message.supportedTools[i] = 9;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_DELETE_FILE":
                    case 11:
                        message.supportedTools[i] = 11;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_REAPPLY":
                    case 12:
                        message.supportedTools[i] = 12;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2":
                    case 15:
                        message.supportedTools[i] = 15;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_FETCH_RULES":
                    case 16:
                        message.supportedTools[i] = 16;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_WEB_SEARCH":
                    case 18:
                        message.supportedTools[i] = 18;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_MCP":
                    case 19:
                        message.supportedTools[i] = 19;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS":
                    case 23:
                        message.supportedTools[i] = 23;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP":
                    case 24:
                        message.supportedTools[i] = 24;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE":
                    case 25:
                        message.supportedTools[i] = 25;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST":
                    case 26:
                        message.supportedTools[i] = 26;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_DEEP_SEARCH":
                    case 27:
                        message.supportedTools[i] = 27;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM":
                    case 28:
                        message.supportedTools[i] = 28;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_FIX_LINTS":
                    case 29:
                        message.supportedTools[i] = 29;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_LINTS":
                    case 30:
                        message.supportedTools[i] = 30;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION":
                    case 31:
                        message.supportedTools[i] = 31;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_TASK":
                    case 32:
                        message.supportedTools[i] = 32;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_AWAIT_TASK":
                    case 33:
                        message.supportedTools[i] = 33;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_TODO_READ":
                    case 34:
                        message.supportedTools[i] = 34;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_TODO_WRITE":
                    case 35:
                        message.supportedTools[i] = 35;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2":
                    case 38:
                        message.supportedTools[i] = 38;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_LIST_DIR_V2":
                    case 39:
                        message.supportedTools[i] = 39;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_FILE_V2":
                    case 40:
                        message.supportedTools[i] = 40;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH":
                    case 41:
                        message.supportedTools[i] = 41;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH":
                    case 42:
                        message.supportedTools[i] = 42;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_CREATE_PLAN":
                    case 43:
                        message.supportedTools[i] = 43;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES":
                    case 44:
                        message.supportedTools[i] = 44;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE":
                    case 45:
                        message.supportedTools[i] = 45;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_READ_PROJECT":
                    case 46:
                        message.supportedTools[i] = 46;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT":
                    case 47:
                        message.supportedTools[i] = 47;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_TASK_V2":
                    case 48:
                        message.supportedTools[i] = 48;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL":
                    case 49:
                        message.supportedTools[i] = 49;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF":
                    case 50:
                        message.supportedTools[i] = 50;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_ASK_QUESTION":
                    case 51:
                        message.supportedTools[i] = 51;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_SWITCH_MODE":
                    case 52:
                        message.supportedTools[i] = 52;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE":
                    case 53:
                        message.supportedTools[i] = 53;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_COMPUTER_USE":
                    case 54:
                        message.supportedTools[i] = 54;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN":
                    case 55:
                        message.supportedTools[i] = 55;
                        break;
                    case "CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS":
                    case 63:
                        message.supportedTools[i] = 63;
                        break;
                    }
            }
            if (object.messageIds) {
                if (!Array.isArray(object.messageIds))
                    throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.messageIds: array expected");
                message.messageIds = [];
                for (var i = 0; i < object.messageIds.length; ++i) {
                    if (typeof object.messageIds[i] !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.messageIds: object expected");
                    message.messageIds[i] = $root.StreamUnifiedChatWithToolsRequest.Request.MessageId.fromObject(object.messageIds[i]);
                }
            }
            if (object.largeContext != null)
                message.largeContext = object.largeContext | 0;
            if (object.unknown38 != null)
                message.unknown38 = object.unknown38 | 0;
            if (object.chatModeEnum != null)
                message.chatModeEnum = object.chatModeEnum | 0;
            if (object.unknown47 != null)
                message.unknown47 = String(object.unknown47);
            if (object.unknown48 != null)
                message.unknown48 = object.unknown48 | 0;
            if (object.unknown49 != null)
                message.unknown49 = object.unknown49 | 0;
            if (object.unknown51 != null)
                message.unknown51 = object.unknown51 | 0;
            if (object.unknown53 != null)
                message.unknown53 = object.unknown53 | 0;
            if (object.chatMode != null)
                message.chatMode = String(object.chatMode);
            return message;
        };

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @function toObject
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {StreamUnifiedChatWithToolsRequest.Request} message Request
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Request.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.messages = [];
                object.wikiTool = [];
                object.supportedTools = [];
                object.messageIds = [];
            }
            if (options.defaults) {
                object.unknown2 = 0;
                object.instruction = null;
                object.unknown4 = 0;
                object.model = null;
                object.webTool = "";
                object.unknown13 = 0;
                object.cursorSetting = null;
                object.unknown19 = 0;
                object.unknown22 = 0;
                object.conversationId = "";
                object.metadata = null;
                object.isAgentic = false;
                object.largeContext = 0;
                object.unknown38 = 0;
                object.chatModeEnum = 0;
                object.unknown47 = "";
                object.unknown48 = 0;
                object.unknown49 = 0;
                object.unknown51 = 0;
                object.unknown53 = 0;
                object.chatMode = "";
            }
            if (message.messages && message.messages.length) {
                object.messages = [];
                for (var j = 0; j < message.messages.length; ++j)
                    object.messages[j] = $root.StreamUnifiedChatWithToolsRequest.Request.Message.toObject(message.messages[j], options);
            }
            if (message.unknown2 != null && message.hasOwnProperty("unknown2"))
                object.unknown2 = message.unknown2;
            if (message.instruction != null && message.hasOwnProperty("instruction"))
                object.instruction = $root.StreamUnifiedChatWithToolsRequest.Request.Instruction.toObject(message.instruction, options);
            if (message.unknown4 != null && message.hasOwnProperty("unknown4"))
                object.unknown4 = message.unknown4;
            if (message.model != null && message.hasOwnProperty("model"))
                object.model = $root.StreamUnifiedChatWithToolsRequest.Request.Model.toObject(message.model, options);
            if (message.wikiTool && message.wikiTool.length) {
                object.wikiTool = [];
                for (var j = 0; j < message.wikiTool.length; ++j)
                    object.wikiTool[j] = message.wikiTool[j];
            }
            if (message.webTool != null && message.hasOwnProperty("webTool"))
                object.webTool = message.webTool;
            if (message.unknown13 != null && message.hasOwnProperty("unknown13"))
                object.unknown13 = message.unknown13;
            if (message.cursorSetting != null && message.hasOwnProperty("cursorSetting"))
                object.cursorSetting = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.toObject(message.cursorSetting, options);
            if (message.unknown19 != null && message.hasOwnProperty("unknown19"))
                object.unknown19 = message.unknown19;
            if (message.unknown22 != null && message.hasOwnProperty("unknown22"))
                object.unknown22 = message.unknown22;
            if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                object.conversationId = message.conversationId;
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Metadata.toObject(message.metadata, options);
            if (message.isAgentic != null && message.hasOwnProperty("isAgentic"))
                object.isAgentic = message.isAgentic;
            if (message.supportedTools && message.supportedTools.length) {
                object.supportedTools = [];
                for (var j = 0; j < message.supportedTools.length; ++j)
                    object.supportedTools[j] = options.enums === String ? $root.ClientSideToolV2[message.supportedTools[j]] === undefined ? message.supportedTools[j] : $root.ClientSideToolV2[message.supportedTools[j]] : message.supportedTools[j];
            }
            if (message.messageIds && message.messageIds.length) {
                object.messageIds = [];
                for (var j = 0; j < message.messageIds.length; ++j)
                    object.messageIds[j] = $root.StreamUnifiedChatWithToolsRequest.Request.MessageId.toObject(message.messageIds[j], options);
            }
            if (message.largeContext != null && message.hasOwnProperty("largeContext"))
                object.largeContext = message.largeContext;
            if (message.unknown38 != null && message.hasOwnProperty("unknown38"))
                object.unknown38 = message.unknown38;
            if (message.chatModeEnum != null && message.hasOwnProperty("chatModeEnum"))
                object.chatModeEnum = message.chatModeEnum;
            if (message.unknown47 != null && message.hasOwnProperty("unknown47"))
                object.unknown47 = message.unknown47;
            if (message.unknown48 != null && message.hasOwnProperty("unknown48"))
                object.unknown48 = message.unknown48;
            if (message.unknown49 != null && message.hasOwnProperty("unknown49"))
                object.unknown49 = message.unknown49;
            if (message.unknown51 != null && message.hasOwnProperty("unknown51"))
                object.unknown51 = message.unknown51;
            if (message.unknown53 != null && message.hasOwnProperty("unknown53"))
                object.unknown53 = message.unknown53;
            if (message.chatMode != null && message.hasOwnProperty("chatMode"))
                object.chatMode = message.chatMode;
            return object;
        };

        /**
         * Converts this Request to JSON.
         * @function toJSON
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Request.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Request
         * @function getTypeUrl
         * @memberof StreamUnifiedChatWithToolsRequest.Request
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Request.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request";
        };

        Request.Message = (function() {

            /**
             * Properties of a Message.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface IMessage
             * @property {string|null} [content] Message content
             * @property {number|null} [role] Message role
             * @property {StreamUnifiedChatWithToolsRequest.Request.Message.IImage|null} [image] Message image
             * @property {string|null} [messageId] Message messageId
             * @property {string|null} [unknown29] Message unknown29
             * @property {string|null} [summaryId] Message summaryId
             * @property {IMessageSummary|null} [summary] Message summary
             * @property {IMessageThinking|null} [thinking] Message thinking
             * @property {number|null} [chatModeEnum] Message chatModeEnum
             */

            /**
             * Constructs a new Message.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents a Message.
             * @implements IMessage
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessage=} [properties] Properties to set
             */
            function Message(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Message content.
             * @member {string} content
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.content = "";

            /**
             * Message role.
             * @member {number} role
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.role = 0;

            /**
             * Message image.
             * @member {StreamUnifiedChatWithToolsRequest.Request.Message.IImage|null|undefined} image
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.image = null;

            /**
             * Message messageId.
             * @member {string} messageId
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.messageId = "";

            /**
             * Message unknown29.
             * @member {string} unknown29
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.unknown29 = "";

            /**
             * Message summaryId.
             * @member {string} summaryId
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.summaryId = "";

            /**
             * Message summary.
             * @member {IMessageSummary|null|undefined} summary
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.summary = null;

            /**
             * Message thinking.
             * @member {IMessageThinking|null|undefined} thinking
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.thinking = null;

            /**
             * Message chatModeEnum.
             * @member {number} chatModeEnum
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             */
            Message.prototype.chatModeEnum = 0;

            /**
             * Creates a new Message instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessage=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Message} Message instance
             */
            Message.create = function create(properties) {
                return new Message(properties);
            };

            /**
             * Encodes the specified Message message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessage} message Message message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Message.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.content);
                if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.role);
                if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                    $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.encode(message.image, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.messageId);
                if (message.unknown29 != null && Object.hasOwnProperty.call(message, "unknown29"))
                    writer.uint32(/* id 29, wireType 2 =*/234).string(message.unknown29);
                if (message.summaryId != null && Object.hasOwnProperty.call(message, "summaryId"))
                    writer.uint32(/* id 32, wireType 2 =*/258).string(message.summaryId);
                if (message.summary != null && Object.hasOwnProperty.call(message, "summary"))
                    $root.MessageSummary.encode(message.summary, writer.uint32(/* id 39, wireType 2 =*/314).fork()).ldelim();
                if (message.thinking != null && Object.hasOwnProperty.call(message, "thinking"))
                    $root.MessageThinking.encode(message.thinking, writer.uint32(/* id 45, wireType 2 =*/362).fork()).ldelim();
                if (message.chatModeEnum != null && Object.hasOwnProperty.call(message, "chatModeEnum"))
                    writer.uint32(/* id 47, wireType 0 =*/376).int32(message.chatModeEnum);
                return writer;
            };

            /**
             * Encodes the specified Message message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessage} message Message message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Message.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Message message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Message} Message
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Message.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.content = reader.string();
                            break;
                        }
                    case 2: {
                            message.role = reader.int32();
                            break;
                        }
                    case 10: {
                            message.image = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 29: {
                            message.unknown29 = reader.string();
                            break;
                        }
                    case 32: {
                            message.summaryId = reader.string();
                            break;
                        }
                    case 39: {
                            message.summary = $root.MessageSummary.decode(reader, reader.uint32());
                            break;
                        }
                    case 45: {
                            message.thinking = $root.MessageThinking.decode(reader, reader.uint32());
                            break;
                        }
                    case 47: {
                            message.chatModeEnum = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Message message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Message} Message
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Message.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Message message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Message.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                if (message.role != null && message.hasOwnProperty("role"))
                    if (!$util.isInteger(message.role))
                        return "role: integer expected";
                if (message.image != null && message.hasOwnProperty("image")) {
                    var error = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.verify(message.image);
                    if (error)
                        return "image." + error;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.unknown29 != null && message.hasOwnProperty("unknown29"))
                    if (!$util.isString(message.unknown29))
                        return "unknown29: string expected";
                if (message.summaryId != null && message.hasOwnProperty("summaryId"))
                    if (!$util.isString(message.summaryId))
                        return "summaryId: string expected";
                if (message.summary != null && message.hasOwnProperty("summary")) {
                    var error = $root.MessageSummary.verify(message.summary);
                    if (error)
                        return "summary." + error;
                }
                if (message.thinking != null && message.hasOwnProperty("thinking")) {
                    var error = $root.MessageThinking.verify(message.thinking);
                    if (error)
                        return "thinking." + error;
                }
                if (message.chatModeEnum != null && message.hasOwnProperty("chatModeEnum"))
                    if (!$util.isInteger(message.chatModeEnum))
                        return "chatModeEnum: integer expected";
                return null;
            };

            /**
             * Creates a Message message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Message} Message
             */
            Message.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Message)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message();
                if (object.content != null)
                    message.content = String(object.content);
                if (object.role != null)
                    message.role = object.role | 0;
                if (object.image != null) {
                    if (typeof object.image !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.Message.image: object expected");
                    message.image = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.fromObject(object.image);
                }
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.unknown29 != null)
                    message.unknown29 = String(object.unknown29);
                if (object.summaryId != null)
                    message.summaryId = String(object.summaryId);
                if (object.summary != null) {
                    if (typeof object.summary !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.Message.summary: object expected");
                    message.summary = $root.MessageSummary.fromObject(object.summary);
                }
                if (object.thinking != null) {
                    if (typeof object.thinking !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.Message.thinking: object expected");
                    message.thinking = $root.MessageThinking.fromObject(object.thinking);
                }
                if (object.chatModeEnum != null)
                    message.chatModeEnum = object.chatModeEnum | 0;
                return message;
            };

            /**
             * Creates a plain object from a Message message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.Message} message Message
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Message.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.content = "";
                    object.role = 0;
                    object.image = null;
                    object.messageId = "";
                    object.unknown29 = "";
                    object.summaryId = "";
                    object.summary = null;
                    object.thinking = null;
                    object.chatModeEnum = 0;
                }
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                if (message.role != null && message.hasOwnProperty("role"))
                    object.role = message.role;
                if (message.image != null && message.hasOwnProperty("image"))
                    object.image = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.toObject(message.image, options);
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.unknown29 != null && message.hasOwnProperty("unknown29"))
                    object.unknown29 = message.unknown29;
                if (message.summaryId != null && message.hasOwnProperty("summaryId"))
                    object.summaryId = message.summaryId;
                if (message.summary != null && message.hasOwnProperty("summary"))
                    object.summary = $root.MessageSummary.toObject(message.summary, options);
                if (message.thinking != null && message.hasOwnProperty("thinking"))
                    object.thinking = $root.MessageThinking.toObject(message.thinking, options);
                if (message.chatModeEnum != null && message.hasOwnProperty("chatModeEnum"))
                    object.chatModeEnum = message.chatModeEnum;
                return object;
            };

            /**
             * Converts this Message to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Message.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Message
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Message.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Message";
            };

            Message.Image = (function() {

                /**
                 * Properties of an Image.
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
                 * @interface IImage
                 * @property {Uint8Array|null} [data] Image data
                 * @property {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata|null} [metadata] Image metadata
                 */

                /**
                 * Constructs a new Image.
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message
                 * @classdesc Represents an Image.
                 * @implements IImage
                 * @constructor
                 * @param {StreamUnifiedChatWithToolsRequest.Request.Message.IImage=} [properties] Properties to set
                 */
                function Image(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Image data.
                 * @member {Uint8Array} data
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @instance
                 */
                Image.prototype.data = $util.newBuffer([]);

                /**
                 * Image metadata.
                 * @member {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata|null|undefined} metadata
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @instance
                 */
                Image.prototype.metadata = null;

                /**
                 * Creates a new Image instance using the specified properties.
                 * @function create
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.Message.IImage=} [properties] Properties to set
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image} Image instance
                 */
                Image.create = function create(properties) {
                    return new Image(properties);
                };

                /**
                 * Encodes the specified Image message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.Image.verify|verify} messages.
                 * @function encode
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.Message.IImage} message Image message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Image.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.encode(message.metadata, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Image message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.Image.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.Message.IImage} message Image message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Image.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Image message from the specified reader or buffer.
                 * @function decode
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image} Image
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Image.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.data = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.decode(reader, reader.uint32());
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Image message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image} Image
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Image.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Image message.
                 * @function verify
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Image.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        var error = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.verify(message.metadata);
                        if (error)
                            return "metadata." + error;
                    }
                    return null;
                };

                /**
                 * Creates an Image message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image} Image
                 */
                Image.fromObject = function fromObject(object) {
                    if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image)
                        return object;
                    var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length >= 0)
                            message.data = object.data;
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.Message.Image.metadata: object expected");
                        message.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.fromObject(object.metadata);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Image message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image} message Image
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Image.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                        object.metadata = null;
                    }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    if (message.metadata != null && message.hasOwnProperty("metadata"))
                        object.metadata = $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.toObject(message.metadata, options);
                    return object;
                };

                /**
                 * Converts this Image to JSON.
                 * @function toJSON
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Image.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Image
                 * @function getTypeUrl
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Image.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Message.Image";
                };

                Image.Metadata = (function() {

                    /**
                     * Properties of a Metadata.
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                     * @interface IMetadata
                     * @property {number|null} [width] Metadata width
                     * @property {number|null} [height] Metadata height
                     */

                    /**
                     * Constructs a new Metadata.
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image
                     * @classdesc Represents a Metadata.
                     * @implements IMetadata
                     * @constructor
                     * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata=} [properties] Properties to set
                     */
                    function Metadata(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Metadata width.
                     * @member {number} width
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @instance
                     */
                    Metadata.prototype.width = 0;

                    /**
                     * Metadata height.
                     * @member {number} height
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @instance
                     */
                    Metadata.prototype.height = 0;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @function create
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata=} [properties] Properties to set
                     * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata} Metadata instance
                     */
                    Metadata.create = function create(properties) {
                        return new Metadata(properties);
                    };

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.verify|verify} messages.
                     * @function encode
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.height);
                        return writer;
                    };

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.width = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.height = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Metadata message.
                     * @function verify
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Metadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.width != null && message.hasOwnProperty("width"))
                            if (!$util.isInteger(message.width))
                                return "width: integer expected";
                        if (message.height != null && message.hasOwnProperty("height"))
                            if (!$util.isInteger(message.height))
                                return "height: integer expected";
                        return null;
                    };

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata} Metadata
                     */
                    Metadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata)
                            return object;
                        var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata();
                        if (object.width != null)
                            message.width = object.width | 0;
                        if (object.height != null)
                            message.height = object.height | 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata} message Metadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Metadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.width = 0;
                            object.height = 0;
                        }
                        if (message.width != null && message.hasOwnProperty("width"))
                            object.width = message.width;
                        if (message.height != null && message.hasOwnProperty("height"))
                            object.height = message.height;
                        return object;
                    };

                    /**
                     * Converts this Metadata to JSON.
                     * @function toJSON
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Metadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Metadata
                     * @function getTypeUrl
                     * @memberof StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Metadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Message.Image.Metadata";
                    };

                    return Metadata;
                })();

                return Image;
            })();

            return Message;
        })();

        Request.Instruction = (function() {

            /**
             * Properties of an Instruction.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface IInstruction
             * @property {string|null} [instruction] Instruction instruction
             */

            /**
             * Constructs a new Instruction.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents an Instruction.
             * @implements IInstruction
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.IInstruction=} [properties] Properties to set
             */
            function Instruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Instruction instruction.
             * @member {string} instruction
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @instance
             */
            Instruction.prototype.instruction = "";

            /**
             * Creates a new Instruction instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IInstruction=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Instruction} Instruction instance
             */
            Instruction.create = function create(properties) {
                return new Instruction(properties);
            };

            /**
             * Encodes the specified Instruction message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Instruction.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IInstruction} message Instruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Instruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.instruction != null && Object.hasOwnProperty.call(message, "instruction"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.instruction);
                return writer;
            };

            /**
             * Encodes the specified Instruction message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Instruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IInstruction} message Instruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Instruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Instruction message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Instruction} Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Instruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Instruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.instruction = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Instruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Instruction} Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Instruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Instruction message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Instruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.instruction != null && message.hasOwnProperty("instruction"))
                    if (!$util.isString(message.instruction))
                        return "instruction: string expected";
                return null;
            };

            /**
             * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Instruction} Instruction
             */
            Instruction.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Instruction)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Instruction();
                if (object.instruction != null)
                    message.instruction = String(object.instruction);
                return message;
            };

            /**
             * Creates a plain object from an Instruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.Instruction} message Instruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Instruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.instruction = "";
                if (message.instruction != null && message.hasOwnProperty("instruction"))
                    object.instruction = message.instruction;
                return object;
            };

            /**
             * Converts this Instruction to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Instruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Instruction
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Instruction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Instruction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Instruction";
            };

            return Instruction;
        })();

        Request.Model = (function() {

            /**
             * Properties of a Model.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface IModel
             * @property {string|null} [name] Model name
             * @property {Uint8Array|null} [empty] Model empty
             */

            /**
             * Constructs a new Model.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents a Model.
             * @implements IModel
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.IModel=} [properties] Properties to set
             */
            function Model(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Model name.
             * @member {string} name
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @instance
             */
            Model.prototype.name = "";

            /**
             * Model empty.
             * @member {Uint8Array} empty
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @instance
             */
            Model.prototype.empty = $util.newBuffer([]);

            /**
             * Creates a new Model instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IModel=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Model} Model instance
             */
            Model.create = function create(properties) {
                return new Model(properties);
            };

            /**
             * Encodes the specified Model message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Model.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IModel} message Model message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Model.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.empty != null && Object.hasOwnProperty.call(message, "empty"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.empty);
                return writer;
            };

            /**
             * Encodes the specified Model message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Model.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IModel} message Model message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Model.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Model message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Model} Model
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Model.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Model();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 4: {
                            message.empty = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Model message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Model} Model
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Model.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Model message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Model.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.empty != null && message.hasOwnProperty("empty"))
                    if (!(message.empty && typeof message.empty.length === "number" || $util.isString(message.empty)))
                        return "empty: buffer expected";
                return null;
            };

            /**
             * Creates a Model message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Model} Model
             */
            Model.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Model)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Model();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.empty != null)
                    if (typeof object.empty === "string")
                        $util.base64.decode(object.empty, message.empty = $util.newBuffer($util.base64.length(object.empty)), 0);
                    else if (object.empty.length >= 0)
                        message.empty = object.empty;
                return message;
            };

            /**
             * Creates a plain object from a Model message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.Model} message Model
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Model.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    if (options.bytes === String)
                        object.empty = "";
                    else {
                        object.empty = [];
                        if (options.bytes !== Array)
                            object.empty = $util.newBuffer(object.empty);
                    }
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.empty != null && message.hasOwnProperty("empty"))
                    object.empty = options.bytes === String ? $util.base64.encode(message.empty, 0, message.empty.length) : options.bytes === Array ? Array.prototype.slice.call(message.empty) : message.empty;
                return object;
            };

            /**
             * Converts this Model to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Model.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Model
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Model
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Model.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Model";
            };

            return Model;
        })();

        Request.CursorSetting = (function() {

            /**
             * Properties of a CursorSetting.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface ICursorSetting
             * @property {string|null} [name] CursorSetting name
             * @property {Uint8Array|null} [unknown3] CursorSetting unknown3
             * @property {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6|null} [unknown6] CursorSetting unknown6
             * @property {number|null} [unknown8] CursorSetting unknown8
             * @property {number|null} [unknown9] CursorSetting unknown9
             */

            /**
             * Constructs a new CursorSetting.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents a CursorSetting.
             * @implements ICursorSetting
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting=} [properties] Properties to set
             */
            function CursorSetting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CursorSetting name.
             * @member {string} name
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             */
            CursorSetting.prototype.name = "";

            /**
             * CursorSetting unknown3.
             * @member {Uint8Array} unknown3
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             */
            CursorSetting.prototype.unknown3 = $util.newBuffer([]);

            /**
             * CursorSetting unknown6.
             * @member {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6|null|undefined} unknown6
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             */
            CursorSetting.prototype.unknown6 = null;

            /**
             * CursorSetting unknown8.
             * @member {number} unknown8
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             */
            CursorSetting.prototype.unknown8 = 0;

            /**
             * CursorSetting unknown9.
             * @member {number} unknown9
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             */
            CursorSetting.prototype.unknown9 = 0;

            /**
             * Creates a new CursorSetting instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting} CursorSetting instance
             */
            CursorSetting.create = function create(properties) {
                return new CursorSetting(properties);
            };

            /**
             * Encodes the specified CursorSetting message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.CursorSetting.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting} message CursorSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CursorSetting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.unknown3 != null && Object.hasOwnProperty.call(message, "unknown3"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.unknown3);
                if (message.unknown6 != null && Object.hasOwnProperty.call(message, "unknown6"))
                    $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.encode(message.unknown6, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.unknown8 != null && Object.hasOwnProperty.call(message, "unknown8"))
                    writer.uint32(/* id 8, wireType 0 =*/64).int32(message.unknown8);
                if (message.unknown9 != null && Object.hasOwnProperty.call(message, "unknown9"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.unknown9);
                return writer;
            };

            /**
             * Encodes the specified CursorSetting message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.CursorSetting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.ICursorSetting} message CursorSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CursorSetting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CursorSetting message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting} CursorSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CursorSetting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            message.unknown3 = reader.bytes();
                            break;
                        }
                    case 6: {
                            message.unknown6 = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.unknown8 = reader.int32();
                            break;
                        }
                    case 9: {
                            message.unknown9 = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CursorSetting message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting} CursorSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CursorSetting.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CursorSetting message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CursorSetting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.unknown3 != null && message.hasOwnProperty("unknown3"))
                    if (!(message.unknown3 && typeof message.unknown3.length === "number" || $util.isString(message.unknown3)))
                        return "unknown3: buffer expected";
                if (message.unknown6 != null && message.hasOwnProperty("unknown6")) {
                    var error = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.verify(message.unknown6);
                    if (error)
                        return "unknown6." + error;
                }
                if (message.unknown8 != null && message.hasOwnProperty("unknown8"))
                    if (!$util.isInteger(message.unknown8))
                        return "unknown8: integer expected";
                if (message.unknown9 != null && message.hasOwnProperty("unknown9"))
                    if (!$util.isInteger(message.unknown9))
                        return "unknown9: integer expected";
                return null;
            };

            /**
             * Creates a CursorSetting message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting} CursorSetting
             */
            CursorSetting.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.unknown3 != null)
                    if (typeof object.unknown3 === "string")
                        $util.base64.decode(object.unknown3, message.unknown3 = $util.newBuffer($util.base64.length(object.unknown3)), 0);
                    else if (object.unknown3.length >= 0)
                        message.unknown3 = object.unknown3;
                if (object.unknown6 != null) {
                    if (typeof object.unknown6 !== "object")
                        throw TypeError(".StreamUnifiedChatWithToolsRequest.Request.CursorSetting.unknown6: object expected");
                    message.unknown6 = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.fromObject(object.unknown6);
                }
                if (object.unknown8 != null)
                    message.unknown8 = object.unknown8 | 0;
                if (object.unknown9 != null)
                    message.unknown9 = object.unknown9 | 0;
                return message;
            };

            /**
             * Creates a plain object from a CursorSetting message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting} message CursorSetting
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CursorSetting.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    if (options.bytes === String)
                        object.unknown3 = "";
                    else {
                        object.unknown3 = [];
                        if (options.bytes !== Array)
                            object.unknown3 = $util.newBuffer(object.unknown3);
                    }
                    object.unknown6 = null;
                    object.unknown8 = 0;
                    object.unknown9 = 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.unknown3 != null && message.hasOwnProperty("unknown3"))
                    object.unknown3 = options.bytes === String ? $util.base64.encode(message.unknown3, 0, message.unknown3.length) : options.bytes === Array ? Array.prototype.slice.call(message.unknown3) : message.unknown3;
                if (message.unknown6 != null && message.hasOwnProperty("unknown6"))
                    object.unknown6 = $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.toObject(message.unknown6, options);
                if (message.unknown8 != null && message.hasOwnProperty("unknown8"))
                    object.unknown8 = message.unknown8;
                if (message.unknown9 != null && message.hasOwnProperty("unknown9"))
                    object.unknown9 = message.unknown9;
                return object;
            };

            /**
             * Converts this CursorSetting to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CursorSetting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CursorSetting
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CursorSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.CursorSetting";
            };

            CursorSetting.Unknown6 = (function() {

                /**
                 * Properties of an Unknown6.
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
                 * @interface IUnknown6
                 * @property {Uint8Array|null} [unknown1] Unknown6 unknown1
                 * @property {Uint8Array|null} [unknown2] Unknown6 unknown2
                 */

                /**
                 * Constructs a new Unknown6.
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting
                 * @classdesc Represents an Unknown6.
                 * @implements IUnknown6
                 * @constructor
                 * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6=} [properties] Properties to set
                 */
                function Unknown6(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Unknown6 unknown1.
                 * @member {Uint8Array} unknown1
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @instance
                 */
                Unknown6.prototype.unknown1 = $util.newBuffer([]);

                /**
                 * Unknown6 unknown2.
                 * @member {Uint8Array} unknown2
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @instance
                 */
                Unknown6.prototype.unknown2 = $util.newBuffer([]);

                /**
                 * Creates a new Unknown6 instance using the specified properties.
                 * @function create
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6=} [properties] Properties to set
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6} Unknown6 instance
                 */
                Unknown6.create = function create(properties) {
                    return new Unknown6(properties);
                };

                /**
                 * Encodes the specified Unknown6 message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.verify|verify} messages.
                 * @function encode
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6} message Unknown6 message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Unknown6.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.unknown1 != null && Object.hasOwnProperty.call(message, "unknown1"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.unknown1);
                    if (message.unknown2 != null && Object.hasOwnProperty.call(message, "unknown2"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.unknown2);
                    return writer;
                };

                /**
                 * Encodes the specified Unknown6 message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.IUnknown6} message Unknown6 message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Unknown6.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Unknown6 message from the specified reader or buffer.
                 * @function decode
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6} Unknown6
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Unknown6.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.unknown1 = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.unknown2 = reader.bytes();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Unknown6 message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6} Unknown6
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Unknown6.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Unknown6 message.
                 * @function verify
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Unknown6.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.unknown1 != null && message.hasOwnProperty("unknown1"))
                        if (!(message.unknown1 && typeof message.unknown1.length === "number" || $util.isString(message.unknown1)))
                            return "unknown1: buffer expected";
                    if (message.unknown2 != null && message.hasOwnProperty("unknown2"))
                        if (!(message.unknown2 && typeof message.unknown2.length === "number" || $util.isString(message.unknown2)))
                            return "unknown2: buffer expected";
                    return null;
                };

                /**
                 * Creates an Unknown6 message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6} Unknown6
                 */
                Unknown6.fromObject = function fromObject(object) {
                    if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6)
                        return object;
                    var message = new $root.StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6();
                    if (object.unknown1 != null)
                        if (typeof object.unknown1 === "string")
                            $util.base64.decode(object.unknown1, message.unknown1 = $util.newBuffer($util.base64.length(object.unknown1)), 0);
                        else if (object.unknown1.length >= 0)
                            message.unknown1 = object.unknown1;
                    if (object.unknown2 != null)
                        if (typeof object.unknown2 === "string")
                            $util.base64.decode(object.unknown2, message.unknown2 = $util.newBuffer($util.base64.length(object.unknown2)), 0);
                        else if (object.unknown2.length >= 0)
                            message.unknown2 = object.unknown2;
                    return message;
                };

                /**
                 * Creates a plain object from an Unknown6 message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6} message Unknown6
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Unknown6.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.unknown1 = "";
                        else {
                            object.unknown1 = [];
                            if (options.bytes !== Array)
                                object.unknown1 = $util.newBuffer(object.unknown1);
                        }
                        if (options.bytes === String)
                            object.unknown2 = "";
                        else {
                            object.unknown2 = [];
                            if (options.bytes !== Array)
                                object.unknown2 = $util.newBuffer(object.unknown2);
                        }
                    }
                    if (message.unknown1 != null && message.hasOwnProperty("unknown1"))
                        object.unknown1 = options.bytes === String ? $util.base64.encode(message.unknown1, 0, message.unknown1.length) : options.bytes === Array ? Array.prototype.slice.call(message.unknown1) : message.unknown1;
                    if (message.unknown2 != null && message.hasOwnProperty("unknown2"))
                        object.unknown2 = options.bytes === String ? $util.base64.encode(message.unknown2, 0, message.unknown2.length) : options.bytes === Array ? Array.prototype.slice.call(message.unknown2) : message.unknown2;
                    return object;
                };

                /**
                 * Converts this Unknown6 to JSON.
                 * @function toJSON
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Unknown6.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Unknown6
                 * @function getTypeUrl
                 * @memberof StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Unknown6.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.CursorSetting.Unknown6";
                };

                return Unknown6;
            })();

            return CursorSetting;
        })();

        Request.Metadata = (function() {

            /**
             * Properties of a Metadata.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface IMetadata
             * @property {string|null} [os] Metadata os
             * @property {string|null} [arch] Metadata arch
             * @property {string|null} [version] Metadata version
             * @property {string|null} [path] Metadata path
             * @property {string|null} [timestamp] Metadata timestamp
             */

            /**
             * Constructs a new Metadata.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents a Metadata.
             * @implements IMetadata
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMetadata=} [properties] Properties to set
             */
            function Metadata(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Metadata os.
             * @member {string} os
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             */
            Metadata.prototype.os = "";

            /**
             * Metadata arch.
             * @member {string} arch
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             */
            Metadata.prototype.arch = "";

            /**
             * Metadata version.
             * @member {string} version
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             */
            Metadata.prototype.version = "";

            /**
             * Metadata path.
             * @member {string} path
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             */
            Metadata.prototype.path = "";

            /**
             * Metadata timestamp.
             * @member {string} timestamp
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             */
            Metadata.prototype.timestamp = "";

            /**
             * Creates a new Metadata instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMetadata=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Metadata} Metadata instance
             */
            Metadata.create = function create(properties) {
                return new Metadata(properties);
            };

            /**
             * Encodes the specified Metadata message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Metadata.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMetadata} message Metadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Metadata.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.os != null && Object.hasOwnProperty.call(message, "os"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.os);
                if (message.arch != null && Object.hasOwnProperty.call(message, "arch"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.arch);
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
                if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.path);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.timestamp);
                return writer;
            };

            /**
             * Encodes the specified Metadata message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.Metadata.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMetadata} message Metadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Metadata message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Metadata} Metadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Metadata.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.Metadata();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.os = reader.string();
                            break;
                        }
                    case 2: {
                            message.arch = reader.string();
                            break;
                        }
                    case 3: {
                            message.version = reader.string();
                            break;
                        }
                    case 4: {
                            message.path = reader.string();
                            break;
                        }
                    case 5: {
                            message.timestamp = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Metadata message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Metadata} Metadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Metadata.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Metadata message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Metadata.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.os != null && message.hasOwnProperty("os"))
                    if (!$util.isString(message.os))
                        return "os: string expected";
                if (message.arch != null && message.hasOwnProperty("arch"))
                    if (!$util.isString(message.arch))
                        return "arch: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.path != null && message.hasOwnProperty("path"))
                    if (!$util.isString(message.path))
                        return "path: string expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isString(message.timestamp))
                        return "timestamp: string expected";
                return null;
            };

            /**
             * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.Metadata} Metadata
             */
            Metadata.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.Metadata)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.Metadata();
                if (object.os != null)
                    message.os = String(object.os);
                if (object.arch != null)
                    message.arch = String(object.arch);
                if (object.version != null)
                    message.version = String(object.version);
                if (object.path != null)
                    message.path = String(object.path);
                if (object.timestamp != null)
                    message.timestamp = String(object.timestamp);
                return message;
            };

            /**
             * Creates a plain object from a Metadata message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.Metadata} message Metadata
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Metadata.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.os = "";
                    object.arch = "";
                    object.version = "";
                    object.path = "";
                    object.timestamp = "";
                }
                if (message.os != null && message.hasOwnProperty("os"))
                    object.os = message.os;
                if (message.arch != null && message.hasOwnProperty("arch"))
                    object.arch = message.arch;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.path != null && message.hasOwnProperty("path"))
                    object.path = message.path;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                return object;
            };

            /**
             * Converts this Metadata to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Metadata.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Metadata
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.Metadata
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Metadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.Metadata";
            };

            return Metadata;
        })();

        Request.MessageId = (function() {

            /**
             * Properties of a MessageId.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @interface IMessageId
             * @property {string|null} [messageId] MessageId messageId
             * @property {string|null} [summaryId] MessageId summaryId
             * @property {number|null} [role] MessageId role
             */

            /**
             * Constructs a new MessageId.
             * @memberof StreamUnifiedChatWithToolsRequest.Request
             * @classdesc Represents a MessageId.
             * @implements IMessageId
             * @constructor
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessageId=} [properties] Properties to set
             */
            function MessageId(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MessageId messageId.
             * @member {string} messageId
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @instance
             */
            MessageId.prototype.messageId = "";

            /**
             * MessageId summaryId.
             * @member {string} summaryId
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @instance
             */
            MessageId.prototype.summaryId = "";

            /**
             * MessageId role.
             * @member {number} role
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @instance
             */
            MessageId.prototype.role = 0;

            /**
             * Creates a new MessageId instance using the specified properties.
             * @function create
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessageId=} [properties] Properties to set
             * @returns {StreamUnifiedChatWithToolsRequest.Request.MessageId} MessageId instance
             */
            MessageId.create = function create(properties) {
                return new MessageId(properties);
            };

            /**
             * Encodes the specified MessageId message. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.MessageId.verify|verify} messages.
             * @function encode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessageId} message MessageId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageId.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                if (message.summaryId != null && Object.hasOwnProperty.call(message, "summaryId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.summaryId);
                if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.role);
                return writer;
            };

            /**
             * Encodes the specified MessageId message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsRequest.Request.MessageId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.IMessageId} message MessageId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MessageId message from the specified reader or buffer.
             * @function decode
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {StreamUnifiedChatWithToolsRequest.Request.MessageId} MessageId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MessageId.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsRequest.Request.MessageId();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 2: {
                            message.summaryId = reader.string();
                            break;
                        }
                    case 3: {
                            message.role = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MessageId message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {StreamUnifiedChatWithToolsRequest.Request.MessageId} MessageId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MessageId.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MessageId message.
             * @function verify
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MessageId.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.summaryId != null && message.hasOwnProperty("summaryId"))
                    if (!$util.isString(message.summaryId))
                        return "summaryId: string expected";
                if (message.role != null && message.hasOwnProperty("role"))
                    if (!$util.isInteger(message.role))
                        return "role: integer expected";
                return null;
            };

            /**
             * Creates a MessageId message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {StreamUnifiedChatWithToolsRequest.Request.MessageId} MessageId
             */
            MessageId.fromObject = function fromObject(object) {
                if (object instanceof $root.StreamUnifiedChatWithToolsRequest.Request.MessageId)
                    return object;
                var message = new $root.StreamUnifiedChatWithToolsRequest.Request.MessageId();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.summaryId != null)
                    message.summaryId = String(object.summaryId);
                if (object.role != null)
                    message.role = object.role | 0;
                return message;
            };

            /**
             * Creates a plain object from a MessageId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {StreamUnifiedChatWithToolsRequest.Request.MessageId} message MessageId
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MessageId.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.messageId = "";
                    object.summaryId = "";
                    object.role = 0;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.summaryId != null && message.hasOwnProperty("summaryId"))
                    object.summaryId = message.summaryId;
                if (message.role != null && message.hasOwnProperty("role"))
                    object.role = message.role;
                return object;
            };

            /**
             * Converts this MessageId to JSON.
             * @function toJSON
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MessageId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MessageId
             * @function getTypeUrl
             * @memberof StreamUnifiedChatWithToolsRequest.Request.MessageId
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MessageId.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/StreamUnifiedChatWithToolsRequest.Request.MessageId";
            };

            return MessageId;
        })();

        return Request;
    })();

    return StreamUnifiedChatWithToolsRequest;
})();

$root.StreamUnifiedChatResponse = (function() {

    /**
     * Properties of a StreamUnifiedChatResponse.
     * @exports IStreamUnifiedChatResponse
     * @interface IStreamUnifiedChatResponse
     * @property {string|null} [text] StreamUnifiedChatResponse text
     * @property {string|null} [debuggingOnlyChatPrompt] StreamUnifiedChatResponse debuggingOnlyChatPrompt
     * @property {number|null} [debuggingOnlyTokenCount] StreamUnifiedChatResponse debuggingOnlyTokenCount
     * @property {string|null} [filledPrompt] StreamUnifiedChatResponse filledPrompt
     * @property {string|null} [intermediateText] StreamUnifiedChatResponse intermediateText
     * @property {string|null} [serverBubbleId] StreamUnifiedChatResponse serverBubbleId
     * @property {StreamUnifiedChatResponse.IThinking|null} [thinking] StreamUnifiedChatResponse thinking
     * @property {StreamUnifiedChatResponse.IToolCallV1|null} [toolCall] StreamUnifiedChatResponse toolCall
     * @property {string|null} [usageUuid] StreamUnifiedChatResponse usageUuid
     */

    /**
     * Constructs a new StreamUnifiedChatResponse.
     * @exports StreamUnifiedChatResponse
     * @classdesc Represents a StreamUnifiedChatResponse.
     * @implements IStreamUnifiedChatResponse
     * @constructor
     * @param {IStreamUnifiedChatResponse=} [properties] Properties to set
     */
    function StreamUnifiedChatResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StreamUnifiedChatResponse text.
     * @member {string} text
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.text = "";

    /**
     * StreamUnifiedChatResponse debuggingOnlyChatPrompt.
     * @member {string|null|undefined} debuggingOnlyChatPrompt
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.debuggingOnlyChatPrompt = null;

    /**
     * StreamUnifiedChatResponse debuggingOnlyTokenCount.
     * @member {number|null|undefined} debuggingOnlyTokenCount
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.debuggingOnlyTokenCount = null;

    /**
     * StreamUnifiedChatResponse filledPrompt.
     * @member {string|null|undefined} filledPrompt
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.filledPrompt = null;

    /**
     * StreamUnifiedChatResponse intermediateText.
     * @member {string|null|undefined} intermediateText
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.intermediateText = null;

    /**
     * StreamUnifiedChatResponse serverBubbleId.
     * @member {string|null|undefined} serverBubbleId
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.serverBubbleId = null;

    /**
     * StreamUnifiedChatResponse thinking.
     * @member {StreamUnifiedChatResponse.IThinking|null|undefined} thinking
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.thinking = null;

    /**
     * StreamUnifiedChatResponse toolCall.
     * @member {StreamUnifiedChatResponse.IToolCallV1|null|undefined} toolCall
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.toolCall = null;

    /**
     * StreamUnifiedChatResponse usageUuid.
     * @member {string|null|undefined} usageUuid
     * @memberof StreamUnifiedChatResponse
     * @instance
     */
    StreamUnifiedChatResponse.prototype.usageUuid = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_debuggingOnlyChatPrompt", {
        get: $util.oneOfGetter($oneOfFields = ["debuggingOnlyChatPrompt"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_debuggingOnlyTokenCount", {
        get: $util.oneOfGetter($oneOfFields = ["debuggingOnlyTokenCount"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_filledPrompt", {
        get: $util.oneOfGetter($oneOfFields = ["filledPrompt"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_intermediateText", {
        get: $util.oneOfGetter($oneOfFields = ["intermediateText"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_serverBubbleId", {
        get: $util.oneOfGetter($oneOfFields = ["serverBubbleId"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_thinking", {
        get: $util.oneOfGetter($oneOfFields = ["thinking"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_toolCall", {
        get: $util.oneOfGetter($oneOfFields = ["toolCall"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(StreamUnifiedChatResponse.prototype, "_usageUuid", {
        get: $util.oneOfGetter($oneOfFields = ["usageUuid"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new StreamUnifiedChatResponse instance using the specified properties.
     * @function create
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {IStreamUnifiedChatResponse=} [properties] Properties to set
     * @returns {StreamUnifiedChatResponse} StreamUnifiedChatResponse instance
     */
    StreamUnifiedChatResponse.create = function create(properties) {
        return new StreamUnifiedChatResponse(properties);
    };

    /**
     * Encodes the specified StreamUnifiedChatResponse message. Does not implicitly {@link StreamUnifiedChatResponse.verify|verify} messages.
     * @function encode
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {IStreamUnifiedChatResponse} message StreamUnifiedChatResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.text != null && Object.hasOwnProperty.call(message, "text"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
        if (message.debuggingOnlyChatPrompt != null && Object.hasOwnProperty.call(message, "debuggingOnlyChatPrompt"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.debuggingOnlyChatPrompt);
        if (message.debuggingOnlyTokenCount != null && Object.hasOwnProperty.call(message, "debuggingOnlyTokenCount"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.debuggingOnlyTokenCount);
        if (message.filledPrompt != null && Object.hasOwnProperty.call(message, "filledPrompt"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.filledPrompt);
        if (message.intermediateText != null && Object.hasOwnProperty.call(message, "intermediateText"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.intermediateText);
        if (message.toolCall != null && Object.hasOwnProperty.call(message, "toolCall"))
            $root.StreamUnifiedChatResponse.ToolCallV1.encode(message.toolCall, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.serverBubbleId != null && Object.hasOwnProperty.call(message, "serverBubbleId"))
            writer.uint32(/* id 22, wireType 2 =*/178).string(message.serverBubbleId);
        if (message.thinking != null && Object.hasOwnProperty.call(message, "thinking"))
            $root.StreamUnifiedChatResponse.Thinking.encode(message.thinking, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
        if (message.usageUuid != null && Object.hasOwnProperty.call(message, "usageUuid"))
            writer.uint32(/* id 27, wireType 2 =*/218).string(message.usageUuid);
        return writer;
    };

    /**
     * Encodes the specified StreamUnifiedChatResponse message, length delimited. Does not implicitly {@link StreamUnifiedChatResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {IStreamUnifiedChatResponse} message StreamUnifiedChatResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StreamUnifiedChatResponse message from the specified reader or buffer.
     * @function decode
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StreamUnifiedChatResponse} StreamUnifiedChatResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.text = reader.string();
                    break;
                }
            case 2: {
                    message.debuggingOnlyChatPrompt = reader.string();
                    break;
                }
            case 3: {
                    message.debuggingOnlyTokenCount = reader.int32();
                    break;
                }
            case 5: {
                    message.filledPrompt = reader.string();
                    break;
                }
            case 7: {
                    message.intermediateText = reader.string();
                    break;
                }
            case 22: {
                    message.serverBubbleId = reader.string();
                    break;
                }
            case 25: {
                    message.thinking = $root.StreamUnifiedChatResponse.Thinking.decode(reader, reader.uint32());
                    break;
                }
            case 13: {
                    message.toolCall = $root.StreamUnifiedChatResponse.ToolCallV1.decode(reader, reader.uint32());
                    break;
                }
            case 27: {
                    message.usageUuid = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StreamUnifiedChatResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StreamUnifiedChatResponse} StreamUnifiedChatResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StreamUnifiedChatResponse message.
     * @function verify
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StreamUnifiedChatResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.text != null && message.hasOwnProperty("text"))
            if (!$util.isString(message.text))
                return "text: string expected";
        if (message.debuggingOnlyChatPrompt != null && message.hasOwnProperty("debuggingOnlyChatPrompt")) {
            properties._debuggingOnlyChatPrompt = 1;
            if (!$util.isString(message.debuggingOnlyChatPrompt))
                return "debuggingOnlyChatPrompt: string expected";
        }
        if (message.debuggingOnlyTokenCount != null && message.hasOwnProperty("debuggingOnlyTokenCount")) {
            properties._debuggingOnlyTokenCount = 1;
            if (!$util.isInteger(message.debuggingOnlyTokenCount))
                return "debuggingOnlyTokenCount: integer expected";
        }
        if (message.filledPrompt != null && message.hasOwnProperty("filledPrompt")) {
            properties._filledPrompt = 1;
            if (!$util.isString(message.filledPrompt))
                return "filledPrompt: string expected";
        }
        if (message.intermediateText != null && message.hasOwnProperty("intermediateText")) {
            properties._intermediateText = 1;
            if (!$util.isString(message.intermediateText))
                return "intermediateText: string expected";
        }
        if (message.serverBubbleId != null && message.hasOwnProperty("serverBubbleId")) {
            properties._serverBubbleId = 1;
            if (!$util.isString(message.serverBubbleId))
                return "serverBubbleId: string expected";
        }
        if (message.thinking != null && message.hasOwnProperty("thinking")) {
            properties._thinking = 1;
            {
                var error = $root.StreamUnifiedChatResponse.Thinking.verify(message.thinking);
                if (error)
                    return "thinking." + error;
            }
        }
        if (message.toolCall != null && message.hasOwnProperty("toolCall")) {
            properties._toolCall = 1;
            {
                var error = $root.StreamUnifiedChatResponse.ToolCallV1.verify(message.toolCall);
                if (error)
                    return "toolCall." + error;
            }
        }
        if (message.usageUuid != null && message.hasOwnProperty("usageUuid")) {
            properties._usageUuid = 1;
            if (!$util.isString(message.usageUuid))
                return "usageUuid: string expected";
        }
        return null;
    };

    /**
     * Creates a StreamUnifiedChatResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StreamUnifiedChatResponse} StreamUnifiedChatResponse
     */
    StreamUnifiedChatResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.StreamUnifiedChatResponse)
            return object;
        var message = new $root.StreamUnifiedChatResponse();
        if (object.text != null)
            message.text = String(object.text);
        if (object.debuggingOnlyChatPrompt != null)
            message.debuggingOnlyChatPrompt = String(object.debuggingOnlyChatPrompt);
        if (object.debuggingOnlyTokenCount != null)
            message.debuggingOnlyTokenCount = object.debuggingOnlyTokenCount | 0;
        if (object.filledPrompt != null)
            message.filledPrompt = String(object.filledPrompt);
        if (object.intermediateText != null)
            message.intermediateText = String(object.intermediateText);
        if (object.serverBubbleId != null)
            message.serverBubbleId = String(object.serverBubbleId);
        if (object.thinking != null) {
            if (typeof object.thinking !== "object")
                throw TypeError(".StreamUnifiedChatResponse.thinking: object expected");
            message.thinking = $root.StreamUnifiedChatResponse.Thinking.fromObject(object.thinking);
        }
        if (object.toolCall != null) {
            if (typeof object.toolCall !== "object")
                throw TypeError(".StreamUnifiedChatResponse.toolCall: object expected");
            message.toolCall = $root.StreamUnifiedChatResponse.ToolCallV1.fromObject(object.toolCall);
        }
        if (object.usageUuid != null)
            message.usageUuid = String(object.usageUuid);
        return message;
    };

    /**
     * Creates a plain object from a StreamUnifiedChatResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {StreamUnifiedChatResponse} message StreamUnifiedChatResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamUnifiedChatResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.text = "";
        if (message.text != null && message.hasOwnProperty("text"))
            object.text = message.text;
        if (message.debuggingOnlyChatPrompt != null && message.hasOwnProperty("debuggingOnlyChatPrompt")) {
            object.debuggingOnlyChatPrompt = message.debuggingOnlyChatPrompt;
            if (options.oneofs)
                object._debuggingOnlyChatPrompt = "debuggingOnlyChatPrompt";
        }
        if (message.debuggingOnlyTokenCount != null && message.hasOwnProperty("debuggingOnlyTokenCount")) {
            object.debuggingOnlyTokenCount = message.debuggingOnlyTokenCount;
            if (options.oneofs)
                object._debuggingOnlyTokenCount = "debuggingOnlyTokenCount";
        }
        if (message.filledPrompt != null && message.hasOwnProperty("filledPrompt")) {
            object.filledPrompt = message.filledPrompt;
            if (options.oneofs)
                object._filledPrompt = "filledPrompt";
        }
        if (message.intermediateText != null && message.hasOwnProperty("intermediateText")) {
            object.intermediateText = message.intermediateText;
            if (options.oneofs)
                object._intermediateText = "intermediateText";
        }
        if (message.toolCall != null && message.hasOwnProperty("toolCall")) {
            object.toolCall = $root.StreamUnifiedChatResponse.ToolCallV1.toObject(message.toolCall, options);
            if (options.oneofs)
                object._toolCall = "toolCall";
        }
        if (message.serverBubbleId != null && message.hasOwnProperty("serverBubbleId")) {
            object.serverBubbleId = message.serverBubbleId;
            if (options.oneofs)
                object._serverBubbleId = "serverBubbleId";
        }
        if (message.thinking != null && message.hasOwnProperty("thinking")) {
            object.thinking = $root.StreamUnifiedChatResponse.Thinking.toObject(message.thinking, options);
            if (options.oneofs)
                object._thinking = "thinking";
        }
        if (message.usageUuid != null && message.hasOwnProperty("usageUuid")) {
            object.usageUuid = message.usageUuid;
            if (options.oneofs)
                object._usageUuid = "usageUuid";
        }
        return object;
    };

    /**
     * Converts this StreamUnifiedChatResponse to JSON.
     * @function toJSON
     * @memberof StreamUnifiedChatResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamUnifiedChatResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for StreamUnifiedChatResponse
     * @function getTypeUrl
     * @memberof StreamUnifiedChatResponse
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    StreamUnifiedChatResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/StreamUnifiedChatResponse";
    };

    StreamUnifiedChatResponse.Thinking = (function() {

        /**
         * Properties of a Thinking.
         * @memberof StreamUnifiedChatResponse
         * @interface IThinking
         * @property {string|null} [content] Thinking content
         */

        /**
         * Constructs a new Thinking.
         * @memberof StreamUnifiedChatResponse
         * @classdesc Represents a Thinking.
         * @implements IThinking
         * @constructor
         * @param {StreamUnifiedChatResponse.IThinking=} [properties] Properties to set
         */
        function Thinking(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Thinking content.
         * @member {string} content
         * @memberof StreamUnifiedChatResponse.Thinking
         * @instance
         */
        Thinking.prototype.content = "";

        /**
         * Creates a new Thinking instance using the specified properties.
         * @function create
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {StreamUnifiedChatResponse.IThinking=} [properties] Properties to set
         * @returns {StreamUnifiedChatResponse.Thinking} Thinking instance
         */
        Thinking.create = function create(properties) {
            return new Thinking(properties);
        };

        /**
         * Encodes the specified Thinking message. Does not implicitly {@link StreamUnifiedChatResponse.Thinking.verify|verify} messages.
         * @function encode
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {StreamUnifiedChatResponse.IThinking} message Thinking message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Thinking.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.content);
            return writer;
        };

        /**
         * Encodes the specified Thinking message, length delimited. Does not implicitly {@link StreamUnifiedChatResponse.Thinking.verify|verify} messages.
         * @function encodeDelimited
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {StreamUnifiedChatResponse.IThinking} message Thinking message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Thinking.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Thinking message from the specified reader or buffer.
         * @function decode
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {StreamUnifiedChatResponse.Thinking} Thinking
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Thinking.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatResponse.Thinking();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.content = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Thinking message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {StreamUnifiedChatResponse.Thinking} Thinking
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Thinking.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Thinking message.
         * @function verify
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Thinking.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            return null;
        };

        /**
         * Creates a Thinking message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {StreamUnifiedChatResponse.Thinking} Thinking
         */
        Thinking.fromObject = function fromObject(object) {
            if (object instanceof $root.StreamUnifiedChatResponse.Thinking)
                return object;
            var message = new $root.StreamUnifiedChatResponse.Thinking();
            if (object.content != null)
                message.content = String(object.content);
            return message;
        };

        /**
         * Creates a plain object from a Thinking message. Also converts values to other types if specified.
         * @function toObject
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {StreamUnifiedChatResponse.Thinking} message Thinking
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Thinking.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.content = "";
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            return object;
        };

        /**
         * Converts this Thinking to JSON.
         * @function toJSON
         * @memberof StreamUnifiedChatResponse.Thinking
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Thinking.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Thinking
         * @function getTypeUrl
         * @memberof StreamUnifiedChatResponse.Thinking
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Thinking.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/StreamUnifiedChatResponse.Thinking";
        };

        return Thinking;
    })();

    StreamUnifiedChatResponse.ToolCallV1 = (function() {

        /**
         * Properties of a ToolCallV1.
         * @memberof StreamUnifiedChatResponse
         * @interface IToolCallV1
         * @property {string|null} [toolCallId] ToolCallV1 toolCallId
         * @property {string|null} [name] ToolCallV1 name
         * @property {string|null} ["arguments"] ToolCallV1 arguments
         */

        /**
         * Constructs a new ToolCallV1.
         * @memberof StreamUnifiedChatResponse
         * @classdesc Represents a ToolCallV1.
         * @implements IToolCallV1
         * @constructor
         * @param {StreamUnifiedChatResponse.IToolCallV1=} [properties] Properties to set
         */
        function ToolCallV1(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ToolCallV1 toolCallId.
         * @member {string} toolCallId
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @instance
         */
        ToolCallV1.prototype.toolCallId = "";

        /**
         * ToolCallV1 name.
         * @member {string} name
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @instance
         */
        ToolCallV1.prototype.name = "";

        /**
         * ToolCallV1 arguments.
         * @member {string} arguments
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @instance
         */
        ToolCallV1.prototype["arguments"] = "";

        /**
         * Creates a new ToolCallV1 instance using the specified properties.
         * @function create
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {StreamUnifiedChatResponse.IToolCallV1=} [properties] Properties to set
         * @returns {StreamUnifiedChatResponse.ToolCallV1} ToolCallV1 instance
         */
        ToolCallV1.create = function create(properties) {
            return new ToolCallV1(properties);
        };

        /**
         * Encodes the specified ToolCallV1 message. Does not implicitly {@link StreamUnifiedChatResponse.ToolCallV1.verify|verify} messages.
         * @function encode
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {StreamUnifiedChatResponse.IToolCallV1} message ToolCallV1 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToolCallV1.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.toolCallId != null && Object.hasOwnProperty.call(message, "toolCallId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.toolCallId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message["arguments"] != null && Object.hasOwnProperty.call(message, "arguments"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message["arguments"]);
            return writer;
        };

        /**
         * Encodes the specified ToolCallV1 message, length delimited. Does not implicitly {@link StreamUnifiedChatResponse.ToolCallV1.verify|verify} messages.
         * @function encodeDelimited
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {StreamUnifiedChatResponse.IToolCallV1} message ToolCallV1 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToolCallV1.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ToolCallV1 message from the specified reader or buffer.
         * @function decode
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {StreamUnifiedChatResponse.ToolCallV1} ToolCallV1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToolCallV1.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatResponse.ToolCallV1();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.toolCallId = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message["arguments"] = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ToolCallV1 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {StreamUnifiedChatResponse.ToolCallV1} ToolCallV1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToolCallV1.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ToolCallV1 message.
         * @function verify
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ToolCallV1.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
                if (!$util.isString(message.toolCallId))
                    return "toolCallId: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message["arguments"] != null && message.hasOwnProperty("arguments"))
                if (!$util.isString(message["arguments"]))
                    return "arguments: string expected";
            return null;
        };

        /**
         * Creates a ToolCallV1 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {StreamUnifiedChatResponse.ToolCallV1} ToolCallV1
         */
        ToolCallV1.fromObject = function fromObject(object) {
            if (object instanceof $root.StreamUnifiedChatResponse.ToolCallV1)
                return object;
            var message = new $root.StreamUnifiedChatResponse.ToolCallV1();
            if (object.toolCallId != null)
                message.toolCallId = String(object.toolCallId);
            if (object.name != null)
                message.name = String(object.name);
            if (object["arguments"] != null)
                message["arguments"] = String(object["arguments"]);
            return message;
        };

        /**
         * Creates a plain object from a ToolCallV1 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {StreamUnifiedChatResponse.ToolCallV1} message ToolCallV1
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ToolCallV1.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.toolCallId = "";
                object.name = "";
                object["arguments"] = "";
            }
            if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
                object.toolCallId = message.toolCallId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message["arguments"] != null && message.hasOwnProperty("arguments"))
                object["arguments"] = message["arguments"];
            return object;
        };

        /**
         * Converts this ToolCallV1 to JSON.
         * @function toJSON
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ToolCallV1.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ToolCallV1
         * @function getTypeUrl
         * @memberof StreamUnifiedChatResponse.ToolCallV1
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ToolCallV1.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/StreamUnifiedChatResponse.ToolCallV1";
        };

        return ToolCallV1;
    })();

    return StreamUnifiedChatResponse;
})();

$root.StreamUnifiedChatWithToolsResponse = (function() {

    /**
     * Properties of a StreamUnifiedChatWithToolsResponse.
     * @exports IStreamUnifiedChatWithToolsResponse
     * @interface IStreamUnifiedChatWithToolsResponse
     * @property {StreamUnifiedChatWithToolsResponse.IToolCallV2|null} [clientSideToolV2Call] StreamUnifiedChatWithToolsResponse clientSideToolV2Call
     * @property {IStreamUnifiedChatResponse|null} [streamUnifiedChatResponse] StreamUnifiedChatWithToolsResponse streamUnifiedChatResponse
     */

    /**
     * Constructs a new StreamUnifiedChatWithToolsResponse.
     * @exports StreamUnifiedChatWithToolsResponse
     * @classdesc Represents a StreamUnifiedChatWithToolsResponse.
     * @implements IStreamUnifiedChatWithToolsResponse
     * @constructor
     * @param {IStreamUnifiedChatWithToolsResponse=} [properties] Properties to set
     */
    function StreamUnifiedChatWithToolsResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StreamUnifiedChatWithToolsResponse clientSideToolV2Call.
     * @member {StreamUnifiedChatWithToolsResponse.IToolCallV2|null|undefined} clientSideToolV2Call
     * @memberof StreamUnifiedChatWithToolsResponse
     * @instance
     */
    StreamUnifiedChatWithToolsResponse.prototype.clientSideToolV2Call = null;

    /**
     * StreamUnifiedChatWithToolsResponse streamUnifiedChatResponse.
     * @member {IStreamUnifiedChatResponse|null|undefined} streamUnifiedChatResponse
     * @memberof StreamUnifiedChatWithToolsResponse
     * @instance
     */
    StreamUnifiedChatWithToolsResponse.prototype.streamUnifiedChatResponse = null;

    /**
     * Creates a new StreamUnifiedChatWithToolsResponse instance using the specified properties.
     * @function create
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {IStreamUnifiedChatWithToolsResponse=} [properties] Properties to set
     * @returns {StreamUnifiedChatWithToolsResponse} StreamUnifiedChatWithToolsResponse instance
     */
    StreamUnifiedChatWithToolsResponse.create = function create(properties) {
        return new StreamUnifiedChatWithToolsResponse(properties);
    };

    /**
     * Encodes the specified StreamUnifiedChatWithToolsResponse message. Does not implicitly {@link StreamUnifiedChatWithToolsResponse.verify|verify} messages.
     * @function encode
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {IStreamUnifiedChatWithToolsResponse} message StreamUnifiedChatWithToolsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatWithToolsResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.clientSideToolV2Call != null && Object.hasOwnProperty.call(message, "clientSideToolV2Call"))
            $root.StreamUnifiedChatWithToolsResponse.ToolCallV2.encode(message.clientSideToolV2Call, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.streamUnifiedChatResponse != null && Object.hasOwnProperty.call(message, "streamUnifiedChatResponse"))
            $root.StreamUnifiedChatResponse.encode(message.streamUnifiedChatResponse, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified StreamUnifiedChatWithToolsResponse message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {IStreamUnifiedChatWithToolsResponse} message StreamUnifiedChatWithToolsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamUnifiedChatWithToolsResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StreamUnifiedChatWithToolsResponse message from the specified reader or buffer.
     * @function decode
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StreamUnifiedChatWithToolsResponse} StreamUnifiedChatWithToolsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatWithToolsResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.clientSideToolV2Call = $root.StreamUnifiedChatWithToolsResponse.ToolCallV2.decode(reader, reader.uint32());
                    break;
                }
            case 2: {
                    message.streamUnifiedChatResponse = $root.StreamUnifiedChatResponse.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StreamUnifiedChatWithToolsResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StreamUnifiedChatWithToolsResponse} StreamUnifiedChatWithToolsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamUnifiedChatWithToolsResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StreamUnifiedChatWithToolsResponse message.
     * @function verify
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StreamUnifiedChatWithToolsResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.clientSideToolV2Call != null && message.hasOwnProperty("clientSideToolV2Call")) {
            var error = $root.StreamUnifiedChatWithToolsResponse.ToolCallV2.verify(message.clientSideToolV2Call);
            if (error)
                return "clientSideToolV2Call." + error;
        }
        if (message.streamUnifiedChatResponse != null && message.hasOwnProperty("streamUnifiedChatResponse")) {
            var error = $root.StreamUnifiedChatResponse.verify(message.streamUnifiedChatResponse);
            if (error)
                return "streamUnifiedChatResponse." + error;
        }
        return null;
    };

    /**
     * Creates a StreamUnifiedChatWithToolsResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StreamUnifiedChatWithToolsResponse} StreamUnifiedChatWithToolsResponse
     */
    StreamUnifiedChatWithToolsResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.StreamUnifiedChatWithToolsResponse)
            return object;
        var message = new $root.StreamUnifiedChatWithToolsResponse();
        if (object.clientSideToolV2Call != null) {
            if (typeof object.clientSideToolV2Call !== "object")
                throw TypeError(".StreamUnifiedChatWithToolsResponse.clientSideToolV2Call: object expected");
            message.clientSideToolV2Call = $root.StreamUnifiedChatWithToolsResponse.ToolCallV2.fromObject(object.clientSideToolV2Call);
        }
        if (object.streamUnifiedChatResponse != null) {
            if (typeof object.streamUnifiedChatResponse !== "object")
                throw TypeError(".StreamUnifiedChatWithToolsResponse.streamUnifiedChatResponse: object expected");
            message.streamUnifiedChatResponse = $root.StreamUnifiedChatResponse.fromObject(object.streamUnifiedChatResponse);
        }
        return message;
    };

    /**
     * Creates a plain object from a StreamUnifiedChatWithToolsResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {StreamUnifiedChatWithToolsResponse} message StreamUnifiedChatWithToolsResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamUnifiedChatWithToolsResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.clientSideToolV2Call = null;
            object.streamUnifiedChatResponse = null;
        }
        if (message.clientSideToolV2Call != null && message.hasOwnProperty("clientSideToolV2Call"))
            object.clientSideToolV2Call = $root.StreamUnifiedChatWithToolsResponse.ToolCallV2.toObject(message.clientSideToolV2Call, options);
        if (message.streamUnifiedChatResponse != null && message.hasOwnProperty("streamUnifiedChatResponse"))
            object.streamUnifiedChatResponse = $root.StreamUnifiedChatResponse.toObject(message.streamUnifiedChatResponse, options);
        return object;
    };

    /**
     * Converts this StreamUnifiedChatWithToolsResponse to JSON.
     * @function toJSON
     * @memberof StreamUnifiedChatWithToolsResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamUnifiedChatWithToolsResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for StreamUnifiedChatWithToolsResponse
     * @function getTypeUrl
     * @memberof StreamUnifiedChatWithToolsResponse
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    StreamUnifiedChatWithToolsResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/StreamUnifiedChatWithToolsResponse";
    };

    StreamUnifiedChatWithToolsResponse.ToolCallV2 = (function() {

        /**
         * Properties of a ToolCallV2.
         * @memberof StreamUnifiedChatWithToolsResponse
         * @interface IToolCallV2
         * @property {ClientSideToolV2|null} [tool] ToolCallV2 tool
         * @property {string|null} [toolCallId] ToolCallV2 toolCallId
         * @property {string|null} [name] ToolCallV2 name
         * @property {string|null} [rawArgs] ToolCallV2 rawArgs
         */

        /**
         * Constructs a new ToolCallV2.
         * @memberof StreamUnifiedChatWithToolsResponse
         * @classdesc Represents a ToolCallV2.
         * @implements IToolCallV2
         * @constructor
         * @param {StreamUnifiedChatWithToolsResponse.IToolCallV2=} [properties] Properties to set
         */
        function ToolCallV2(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ToolCallV2 tool.
         * @member {ClientSideToolV2} tool
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @instance
         */
        ToolCallV2.prototype.tool = 0;

        /**
         * ToolCallV2 toolCallId.
         * @member {string} toolCallId
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @instance
         */
        ToolCallV2.prototype.toolCallId = "";

        /**
         * ToolCallV2 name.
         * @member {string} name
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @instance
         */
        ToolCallV2.prototype.name = "";

        /**
         * ToolCallV2 rawArgs.
         * @member {string} rawArgs
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @instance
         */
        ToolCallV2.prototype.rawArgs = "";

        /**
         * Creates a new ToolCallV2 instance using the specified properties.
         * @function create
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {StreamUnifiedChatWithToolsResponse.IToolCallV2=} [properties] Properties to set
         * @returns {StreamUnifiedChatWithToolsResponse.ToolCallV2} ToolCallV2 instance
         */
        ToolCallV2.create = function create(properties) {
            return new ToolCallV2(properties);
        };

        /**
         * Encodes the specified ToolCallV2 message. Does not implicitly {@link StreamUnifiedChatWithToolsResponse.ToolCallV2.verify|verify} messages.
         * @function encode
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {StreamUnifiedChatWithToolsResponse.IToolCallV2} message ToolCallV2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToolCallV2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tool != null && Object.hasOwnProperty.call(message, "tool"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.tool);
            if (message.toolCallId != null && Object.hasOwnProperty.call(message, "toolCallId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.toolCallId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.name);
            if (message.rawArgs != null && Object.hasOwnProperty.call(message, "rawArgs"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.rawArgs);
            return writer;
        };

        /**
         * Encodes the specified ToolCallV2 message, length delimited. Does not implicitly {@link StreamUnifiedChatWithToolsResponse.ToolCallV2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {StreamUnifiedChatWithToolsResponse.IToolCallV2} message ToolCallV2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToolCallV2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ToolCallV2 message from the specified reader or buffer.
         * @function decode
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {StreamUnifiedChatWithToolsResponse.ToolCallV2} ToolCallV2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToolCallV2.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.StreamUnifiedChatWithToolsResponse.ToolCallV2();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tool = reader.int32();
                        break;
                    }
                case 3: {
                        message.toolCallId = reader.string();
                        break;
                    }
                case 9: {
                        message.name = reader.string();
                        break;
                    }
                case 10: {
                        message.rawArgs = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ToolCallV2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {StreamUnifiedChatWithToolsResponse.ToolCallV2} ToolCallV2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToolCallV2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ToolCallV2 message.
         * @function verify
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ToolCallV2.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tool != null && message.hasOwnProperty("tool"))
                switch (message.tool) {
                default:
                    return "tool: enum value expected";
                case 0:
                case 1:
                case 3:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 11:
                case 12:
                case 15:
                case 16:
                case 18:
                case 19:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 38:
                case 39:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 63:
                    break;
                }
            if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
                if (!$util.isString(message.toolCallId))
                    return "toolCallId: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.rawArgs != null && message.hasOwnProperty("rawArgs"))
                if (!$util.isString(message.rawArgs))
                    return "rawArgs: string expected";
            return null;
        };

        /**
         * Creates a ToolCallV2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {StreamUnifiedChatWithToolsResponse.ToolCallV2} ToolCallV2
         */
        ToolCallV2.fromObject = function fromObject(object) {
            if (object instanceof $root.StreamUnifiedChatWithToolsResponse.ToolCallV2)
                return object;
            var message = new $root.StreamUnifiedChatWithToolsResponse.ToolCallV2();
            switch (object.tool) {
            default:
                if (typeof object.tool === "number") {
                    message.tool = object.tool;
                    break;
                }
                break;
            case "CLIENT_SIDE_TOOL_V2_UNSPECIFIED":
            case 0:
                message.tool = 0;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_SEMSEARCH_FILES":
            case 1:
                message.tool = 1;
                break;
            case "CLIENT_SIDE_TOOL_V2_RIPGREP_SEARCH":
            case 3:
                message.tool = 3;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_FILE":
            case 5:
                message.tool = 5;
                break;
            case "CLIENT_SIDE_TOOL_V2_LIST_DIR":
            case 6:
                message.tool = 6;
                break;
            case "CLIENT_SIDE_TOOL_V2_EDIT_FILE":
            case 7:
                message.tool = 7;
                break;
            case "CLIENT_SIDE_TOOL_V2_FILE_SEARCH":
            case 8:
                message.tool = 8;
                break;
            case "CLIENT_SIDE_TOOL_V2_SEMANTIC_SEARCH_FULL":
            case 9:
                message.tool = 9;
                break;
            case "CLIENT_SIDE_TOOL_V2_DELETE_FILE":
            case 11:
                message.tool = 11;
                break;
            case "CLIENT_SIDE_TOOL_V2_REAPPLY":
            case 12:
                message.tool = 12;
                break;
            case "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2":
            case 15:
                message.tool = 15;
                break;
            case "CLIENT_SIDE_TOOL_V2_FETCH_RULES":
            case 16:
                message.tool = 16;
                break;
            case "CLIENT_SIDE_TOOL_V2_WEB_SEARCH":
            case 18:
                message.tool = 18;
                break;
            case "CLIENT_SIDE_TOOL_V2_MCP":
            case 19:
                message.tool = 19;
                break;
            case "CLIENT_SIDE_TOOL_V2_SEARCH_SYMBOLS":
            case 23:
                message.tool = 23;
                break;
            case "CLIENT_SIDE_TOOL_V2_BACKGROUND_COMPOSER_FOLLOWUP":
            case 24:
                message.tool = 24;
                break;
            case "CLIENT_SIDE_TOOL_V2_KNOWLEDGE_BASE":
            case 25:
                message.tool = 25;
                break;
            case "CLIENT_SIDE_TOOL_V2_FETCH_PULL_REQUEST":
            case 26:
                message.tool = 26;
                break;
            case "CLIENT_SIDE_TOOL_V2_DEEP_SEARCH":
            case 27:
                message.tool = 27;
                break;
            case "CLIENT_SIDE_TOOL_V2_CREATE_DIAGRAM":
            case 28:
                message.tool = 28;
                break;
            case "CLIENT_SIDE_TOOL_V2_FIX_LINTS":
            case 29:
                message.tool = 29;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_LINTS":
            case 30:
                message.tool = 30;
                break;
            case "CLIENT_SIDE_TOOL_V2_GO_TO_DEFINITION":
            case 31:
                message.tool = 31;
                break;
            case "CLIENT_SIDE_TOOL_V2_TASK":
            case 32:
                message.tool = 32;
                break;
            case "CLIENT_SIDE_TOOL_V2_AWAIT_TASK":
            case 33:
                message.tool = 33;
                break;
            case "CLIENT_SIDE_TOOL_V2_TODO_READ":
            case 34:
                message.tool = 34;
                break;
            case "CLIENT_SIDE_TOOL_V2_TODO_WRITE":
            case 35:
                message.tool = 35;
                break;
            case "CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2":
            case 38:
                message.tool = 38;
                break;
            case "CLIENT_SIDE_TOOL_V2_LIST_DIR_V2":
            case 39:
                message.tool = 39;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_FILE_V2":
            case 40:
                message.tool = 40;
                break;
            case "CLIENT_SIDE_TOOL_V2_RIPGREP_RAW_SEARCH":
            case 41:
                message.tool = 41;
                break;
            case "CLIENT_SIDE_TOOL_V2_GLOB_FILE_SEARCH":
            case 42:
                message.tool = 42;
                break;
            case "CLIENT_SIDE_TOOL_V2_CREATE_PLAN":
            case 43:
                message.tool = 43;
                break;
            case "CLIENT_SIDE_TOOL_V2_LIST_MCP_RESOURCES":
            case 44:
                message.tool = 44;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_MCP_RESOURCE":
            case 45:
                message.tool = 45;
                break;
            case "CLIENT_SIDE_TOOL_V2_READ_PROJECT":
            case 46:
                message.tool = 46;
                break;
            case "CLIENT_SIDE_TOOL_V2_UPDATE_PROJECT":
            case 47:
                message.tool = 47;
                break;
            case "CLIENT_SIDE_TOOL_V2_TASK_V2":
            case 48:
                message.tool = 48;
                break;
            case "CLIENT_SIDE_TOOL_V2_CALL_MCP_TOOL":
            case 49:
                message.tool = 49;
                break;
            case "CLIENT_SIDE_TOOL_V2_APPLY_AGENT_DIFF":
            case 50:
                message.tool = 50;
                break;
            case "CLIENT_SIDE_TOOL_V2_ASK_QUESTION":
            case 51:
                message.tool = 51;
                break;
            case "CLIENT_SIDE_TOOL_V2_SWITCH_MODE":
            case 52:
                message.tool = 52;
                break;
            case "CLIENT_SIDE_TOOL_V2_GENERATE_IMAGE":
            case 53:
                message.tool = 53;
                break;
            case "CLIENT_SIDE_TOOL_V2_COMPUTER_USE":
            case 54:
                message.tool = 54;
                break;
            case "CLIENT_SIDE_TOOL_V2_WRITE_SHELL_STDIN":
            case 55:
                message.tool = 55;
                break;
            case "CLIENT_SIDE_TOOL_V2_GET_MCP_TOOLS":
            case 63:
                message.tool = 63;
                break;
            }
            if (object.toolCallId != null)
                message.toolCallId = String(object.toolCallId);
            if (object.name != null)
                message.name = String(object.name);
            if (object.rawArgs != null)
                message.rawArgs = String(object.rawArgs);
            return message;
        };

        /**
         * Creates a plain object from a ToolCallV2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {StreamUnifiedChatWithToolsResponse.ToolCallV2} message ToolCallV2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ToolCallV2.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.tool = options.enums === String ? "CLIENT_SIDE_TOOL_V2_UNSPECIFIED" : 0;
                object.toolCallId = "";
                object.name = "";
                object.rawArgs = "";
            }
            if (message.tool != null && message.hasOwnProperty("tool"))
                object.tool = options.enums === String ? $root.ClientSideToolV2[message.tool] === undefined ? message.tool : $root.ClientSideToolV2[message.tool] : message.tool;
            if (message.toolCallId != null && message.hasOwnProperty("toolCallId"))
                object.toolCallId = message.toolCallId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.rawArgs != null && message.hasOwnProperty("rawArgs"))
                object.rawArgs = message.rawArgs;
            return object;
        };

        /**
         * Converts this ToolCallV2 to JSON.
         * @function toJSON
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ToolCallV2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ToolCallV2
         * @function getTypeUrl
         * @memberof StreamUnifiedChatWithToolsResponse.ToolCallV2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ToolCallV2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/StreamUnifiedChatWithToolsResponse.ToolCallV2";
        };

        return ToolCallV2;
    })();

    return StreamUnifiedChatWithToolsResponse;
})();

module.exports = $root;
