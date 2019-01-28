exports['TypeSerializationTests conditional type 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wn950pf7": {
      "id": "S01m4wn950pf7",
      "entity": "symbol",
      "name": "\"--ROOT PATH--/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm5f7uvs"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "Bar": [
          "symbol",
          "S01m4wnd2k8li"
        ],
        "x": [
          "symbol",
          "S01m4wlu1hlrp"
        ],
        "y": [
          "symbol",
          "S01m4wmd0bvkd"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3qi5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3qi5"
        ],
        1,
        1,
        3,
        53
      ]
    },
    "S01m4wnd2k8li": {
      "id": "S01m4wnd2k8li",
      "entity": "symbol",
      "name": "Bar",
      "flags": [
        "TypeAlias"
      ],
      "type": [
        "type",
        "T01m4wnqg7m0m"
      ],
      "symbolString": "Bar",
      "typeString": "Bar<T>",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3qi5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3qi5"
        ],
        1,
        1,
        1,
        53
      ]
    },
    "S01m4wlu1hlrp": {
      "id": "S01m4wlu1hlrp",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2q7oq"
      ],
      "symbolString": "x",
      "typeString": "\"foo\"",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3qi5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3qi5"
        ],
        2,
        17,
        2,
        38
      ]
    },
    "S01m4wmd0bvkd": {
      "id": "S01m4wmd0bvkd",
      "entity": "symbol",
      "name": "y",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wlstx004"
      ],
      "symbolString": "y",
      "typeString": "number[]",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3qi5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3qi5"
        ],
        3,
        17,
        3,
        52
      ]
    }
  },
  "types": {
    "T01m4wm5f7uvs": {
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "entity": "type",
      "id": "T01m4wm5f7uvs",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wlu1hlrp"
        ],
        "y": [
          "symbol",
          "S01m4wmd0bvkd"
        ]
      }
    },
    "T01m4wnqg7m0m": {
      "typeString": "Bar<T>",
      "entity": "type",
      "id": "T01m4wnqg7m0m",
      "flags": [
        "Conditional"
      ],
      "conditionalInfo": {
        "extendsType": [
          "type",
          "T01m4wmr2p2yx"
        ],
        "checkType": [
          "type",
          "T01m4wlxxxspc"
        ]
      }
    },
    "T01m4wmr2q7oq": {
      "typeString": "\"foo\"",
      "entity": "type",
      "id": "T01m4wmr2q7oq",
      "flags": [
        "StringLiteral"
      ]
    },
    "T01m4wlstx004": {
      "typeString": "number[]",
      "entity": "type",
      "id": "T01m4wlstx004",
      "flags": [
        "Object"
      ]
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    },
    "T01m4wlxxxspc": {
      "typeString": "T",
      "entity": "type",
      "id": "T01m4wlxxxspc",
      "flags": [
        "TypeParameter"
      ]
    }
  },
  "nodes": {},
  "sourceFiles": {
    "F01m4wmlw3qi5": {
      "id": "F01m4wmlw3qi5",
      "entity": "sourceFile",
      "originalFileName": "--ROOT PATH--/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "--ROOT PATH--/src/index",
      "extension": "ts",
      "pathInPackage": "--ROOT PATH--/src/index",
      "symbol": [
        "symbol",
        "S01m4wn950pf7"
      ]
    }
  }
}

exports['TypeSerializationTests non-exported interface 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wnf6q9f4": {
      "id": "S01m4wnf6q9f4",
      "entity": "symbol",
      "name": "\"--ROOT PATH--/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlv88njx"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "x": [
          "symbol",
          "S01m4wmtwcpls"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkykwb"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkykwb"
        ],
        1,
        1,
        3,
        33
      ]
    },
    "S01m4wmtwcpls": {
      "id": "S01m4wmtwcpls",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmspe9wg"
      ],
      "symbolString": "x",
      "typeString": "Foo",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkykwb"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkykwb"
        ],
        3,
        13,
        3,
        32
      ]
    },
    "S01m4wlmtnitk": {
      "id": "S01m4wlmtnitk",
      "entity": "symbol",
      "name": "num",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "num",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkykwb"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkykwb"
        ],
        1,
        16,
        1,
        28
      ]
    }
  },
  "types": {
    "T01m4wlv88njx": {
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "entity": "type",
      "id": "T01m4wlv88njx",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmtwcpls"
        ]
      }
    },
    "T01m4wmspe9wg": {
      "typeString": "Foo",
      "entity": "type",
      "id": "T01m4wmspe9wg",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Interface"
      ],
      "properties": {
        "num": [
          "symbol",
          "S01m4wlmtnitk"
        ]
      }
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    }
  },
  "nodes": {},
  "sourceFiles": {
    "F01m4wnwkykwb": {
      "id": "F01m4wnwkykwb",
      "entity": "sourceFile",
      "originalFileName": "--ROOT PATH--/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "--ROOT PATH--/src/index",
      "extension": "ts",
      "pathInPackage": "--ROOT PATH--/src/index",
      "symbol": [
        "symbol",
        "S01m4wnf6q9f4"
      ]
    }
  }
}

exports['TypeSerializationTests type queries 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wmtmj4j3": {
      "id": "S01m4wmtmj4j3",
      "entity": "symbol",
      "name": "\"--ROOT PATH--/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlswldn9"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "x": [
          "symbol",
          "S01m4wmd6vimx"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        1,
        2,
        32
      ]
    },
    "S01m4wmd6vimx": {
      "id": "S01m4wmd6vimx",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wnw2ao1x"
      ],
      "symbolString": "x",
      "typeString": "{ width: number; height: number; }",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        2,
        11,
        2,
        31
      ]
    },
    "S01m4wlwnh7vg": {
      "id": "S01m4wlwnh7vg",
      "entity": "symbol",
      "name": "rectangle1",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wnw2ao1x"
      ],
      "symbolString": "rectangle1",
      "typeString": "{ width: number; height: number; }",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        4,
        1,
        44
      ]
    },
    "S01m4wmi0edvd": {
      "id": "S01m4wmi0edvd",
      "entity": "symbol",
      "name": "width",
      "flags": [
        "Property",
        "Transient"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "width",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        19,
        1,
        29
      ]
    },
    "S01m4wn1bo6qf": {
      "id": "S01m4wn1bo6qf",
      "entity": "symbol",
      "name": "height",
      "flags": [
        "Property",
        "Transient"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "height",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        31,
        1,
        42
      ]
    }
  },
  "types": {
    "T01m4wlswldn9": {
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "entity": "type",
      "id": "T01m4wlswldn9",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmd6vimx"
        ]
      }
    },
    "T01m4wnw2ao1x": {
      "typeString": "{ width: number; height: number; }",
      "entity": "type",
      "id": "T01m4wnw2ao1x",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "width": [
          "symbol",
          "S01m4wmi0edvd"
        ],
        "height": [
          "symbol",
          "S01m4wn1bo6qf"
        ]
      }
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    }
  },
  "nodes": {},
  "sourceFiles": {
    "F01m4wnwkylrf": {
      "id": "F01m4wnwkylrf",
      "entity": "sourceFile",
      "originalFileName": "--ROOT PATH--/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "--ROOT PATH--/src/index",
      "extension": "ts",
      "pathInPackage": "--ROOT PATH--/src/index",
      "symbol": [
        "symbol",
        "S01m4wmtmj4j3"
      ]
    }
  }
}
