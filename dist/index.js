"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generate_interfaces_1 = require("./generate-interfaces");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generate_interfaces_1.generate; } });
var validate_schemas_1 = require("./validate-schemas");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validate_schemas_1.validate; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "loadExternalSchema", { enumerable: true, get: function () { return utils_1.loadExternalSchema; } });
