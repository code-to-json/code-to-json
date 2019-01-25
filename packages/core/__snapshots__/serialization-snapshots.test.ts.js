exports['SerializationSnapshotTests Class with implied constructor 1'] = {
  "types": {
    "T01m4wn8d6tuf": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wn8d6tuf",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "SimpleClass": [
          "symbol",
          "S01m4wmw2cgh4"
        ]
      }
    },
    "T01m4wnt3kk7k": {
      "typeString": "typeof SimpleClass",
      "entity": "type",
      "id": "T01m4wnt3kk7k",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmsic0ho"
          ],
          "typeString": "(): SimpleClass"
        }
      ]
    },
    "T01m4wmsic0ho": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wmsic0ho",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmsic0ho"
      ],
      "thisType": [
        "type",
        "T01m4wmy50x4t"
      ]
    },
    "T01m4wmy50x4t": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wmy50x4t",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wmsic0ho1"
      ]
    },
    "T01m4wmsic0ho1": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wmsic0ho1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmsic0ho"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wmy50x4t"
        ]
      ]
    }
  },
  "symbols": {
    "S01m4wltmf47b": {
      "id": "S01m4wltmf47b",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wn8d6tuf"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "SimpleClass": [
          "symbol",
          "S01m4wmw2cgh4"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhu5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhu5"
        ],
        1,
        1,
        1,
        28
      ]
    },
    "S01m4wmw2cgh4": {
      "id": "S01m4wmw2cgh4",
      "entity": "symbol",
      "name": "SimpleClass",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wnt3kk7k"
      ],
      "symbolString": "SimpleClass",
      "typeString": "typeof SimpleClass",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhu5"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhu5"
        ],
        1,
        1,
        1,
        28
      ]
    }
  }
}

exports['SerializationSnapshotTests Class with properties and methods 1'] = {
  "types": {
    "T01m4wnvl28mi": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wnvl28mi",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "SimpleClass": [
          "symbol",
          "S01m4wnb81i6j"
        ]
      }
    },
    "T01m4wlocrpyg": {
      "typeString": "typeof SimpleClass",
      "entity": "type",
      "id": "T01m4wlocrpyg",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wnosh4qq"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wn1a9gr8"
            ]
          ],
          "typeString": "(bar: string): SimpleClass"
        }
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
    "T01m4wmt920g7": {
      "typeString": "(x: number[]) => number",
      "entity": "type",
      "id": "T01m4wmt920g7",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p302"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wn4xnnag"
            ]
          ],
          "typeString": "(x: number[]): number"
        }
      ]
    },
    "T01m4wnosh4qq": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wnosh4qq",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wnosh4qq"
      ],
      "properties": {
        "foo": [
          "symbol",
          "S01m4wnlhu0mc"
        ],
        "baz": [
          "symbol",
          "S01m4wnlboakp"
        ]
      },
      "thisType": [
        "type",
        "T01m4wn5xna84"
      ]
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wn5xna84": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wn5xna84",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wnosh4qq1"
      ]
    },
    "T01m4wnosh4qq1": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wnosh4qq1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wnosh4qq"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wn5xna84"
        ]
      ]
    },
    "T01m4wlstx004": {
      "typeString": "number[]",
      "entity": "type",
      "id": "T01m4wlstx004",
      "flags": [
        "Object"
      ],
      "libName": "lib.es5.d.ts"
    }
  },
  "symbols": {
    "S01m4wmqv6kah": {
      "id": "S01m4wmqv6kah",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wnvl28mi"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "SimpleClass": [
          "symbol",
          "S01m4wnb81i6j"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wnb81i6j": {
      "id": "S01m4wnb81i6j",
      "entity": "symbol",
      "name": "SimpleClass",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wlocrpyg"
      ],
      "symbolString": "SimpleClass",
      "typeString": "typeof SimpleClass",
      "members": {
        "foo": [
          "symbol",
          "S01m4wnlhu0mc"
        ],
        "baz": [
          "symbol",
          "S01m4wnlboakp"
        ]
      },
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wnlhu0mc": {
      "id": "S01m4wnlhu0mc",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "foo",
      "typeString": "string",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        3,
        0,
        3,
        29
      ]
    },
    "S01m4wnlboakp": {
      "id": "S01m4wnlboakp",
      "entity": "symbol",
      "name": "baz",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wmt920g7"
      ],
      "symbolString": "baz",
      "typeString": "(x: number[]) => number",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        4,
        0,
        4,
        59
      ]
    },
    "S01m4wn1a9gr8": {
      "id": "S01m4wn1a9gr8",
      "entity": "symbol",
      "name": "bar",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "bar",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        2,
        15,
        2,
        25
      ]
    },
    "S01m4wn4xnnag": {
      "id": "S01m4wn4xnnag",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wlstx004"
      ],
      "symbolString": "x",
      "typeString": "number[]",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3s32"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3s32"
        ],
        4,
        7,
        4,
        17
      ]
    }
  }
}

exports['SerializationSnapshotTests Class with properties, methods and static functions 1'] = {
  "types": {
    "T01m4wn9ycwlm": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wn9ycwlm",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "SimpleClass": [
          "symbol",
          "S01m4wmvxgfko"
        ]
      }
    },
    "T01m4wnfhvjrp": {
      "typeString": "typeof SimpleClass",
      "entity": "type",
      "id": "T01m4wnfhvjrp",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "hello": [
          "symbol",
          "S01m4wmelrlq6"
        ]
      },
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmqoo48u"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wn1a9gr8"
            ]
          ],
          "typeString": "(bar: string): SimpleClass"
        }
      ]
    },
    "T01m4wmaj70nj": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmaj70nj",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
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
    "T01m4wmqoo48u": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wmqoo48u",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmqoo48u"
      ],
      "properties": {
        "foo": [
          "symbol",
          "S01m4wnlhu0mc"
        ]
      },
      "thisType": [
        "type",
        "T01m4wndak457"
      ]
    },
    "T01m4wndak457": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wndak457",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wmqoo48u1"
      ]
    },
    "T01m4wmqoo48u1": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wmqoo48u1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmqoo48u"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wndak457"
        ]
      ]
    }
  },
  "symbols": {
    "S01m4wlqdaft2": {
      "id": "S01m4wlqdaft2",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wn9ycwlm"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "SimpleClass": [
          "symbol",
          "S01m4wmvxgfko"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3r66"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3r66"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wmvxgfko": {
      "id": "S01m4wmvxgfko",
      "entity": "symbol",
      "name": "SimpleClass",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wnfhvjrp"
      ],
      "symbolString": "SimpleClass",
      "typeString": "typeof SimpleClass",
      "exports": {
        "hello": [
          "symbol",
          "S01m4wmelrlq6"
        ]
      },
      "members": {
        "foo": [
          "symbol",
          "S01m4wnlhu0mc"
        ]
      },
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3r66"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3r66"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wmelrlq6": {
      "id": "S01m4wmelrlq6",
      "entity": "symbol",
      "name": "hello",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wmaj70nj"
      ],
      "symbolString": "hello",
      "typeString": "() => string",
      "modifiers": [
        "static"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3r66"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3r66"
        ],
        4,
        0,
        4,
        44
      ]
    },
    "S01m4wnlhu0mc": {
      "id": "S01m4wnlhu0mc",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "foo",
      "typeString": "string",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3r66"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3r66"
        ],
        3,
        0,
        3,
        29
      ]
    },
    "S01m4wn1a9gr8": {
      "id": "S01m4wn1a9gr8",
      "entity": "symbol",
      "name": "bar",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "bar",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3r66"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3r66"
        ],
        2,
        15,
        2,
        25
      ]
    }
  }
}

exports['SerializationSnapshotTests Class with properties, methods and static functions using a variety of access modifier keywords 1'] = {
  "types": {
    "T01m4wmks8qk5": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmks8qk5",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "SimpleClass": [
          "symbol",
          "S01m4wnvit6mu"
        ]
      }
    },
    "T01m4wnd64in4": {
      "typeString": "typeof SimpleClass",
      "entity": "type",
      "id": "T01m4wnd64in4",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "hello": [
          "symbol",
          "S01m4wnsyjhqy"
        ]
      },
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wnm7v6h4"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wm3v77rp"
            ]
          ],
          "typeString": "(bar: string): SimpleClass"
        }
      ]
    },
    "T01m4wmtws9u6": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmtws9u6",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
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
    "T01m4wnm7v6h4": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wnm7v6h4",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wnm7v6h4"
      ],
      "properties": {
        "foo": [
          "symbol",
          "S01m4wmv1sanj"
        ]
      },
      "thisType": [
        "type",
        "T01m4wnckod0u"
      ]
    },
    "T01m4wnckod0u": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wnckod0u",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wnm7v6h41"
      ]
    },
    "T01m4wnm7v6h41": {
      "typeString": "SimpleClass",
      "entity": "type",
      "id": "T01m4wnm7v6h41",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wnm7v6h4"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wnckod0u"
        ]
      ]
    }
  },
  "symbols": {
    "S01m4wm17la1u": {
      "id": "S01m4wm17la1u",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmks8qk5"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "SimpleClass": [
          "symbol",
          "S01m4wnvit6mu"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3uej"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3uej"
        ],
        1,
        1,
        8,
        1
      ]
    },
    "S01m4wnvit6mu": {
      "id": "S01m4wnvit6mu",
      "entity": "symbol",
      "name": "SimpleClass",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wnd64in4"
      ],
      "symbolString": "SimpleClass",
      "typeString": "typeof SimpleClass",
      "exports": {
        "hello": [
          "symbol",
          "S01m4wnsyjhqy"
        ]
      },
      "members": {
        "foo": [
          "symbol",
          "S01m4wmv1sanj"
        ]
      },
      "modifiers": [
        "export",
        "FirstContextualKeyword"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3uej"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3uej"
        ],
        1,
        1,
        8,
        1
      ]
    },
    "S01m4wnsyjhqy": {
      "id": "S01m4wnsyjhqy",
      "entity": "symbol",
      "name": "hello",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wmtws9u6"
      ],
      "symbolString": "hello",
      "typeString": "() => string",
      "modifiers": [
        "protected",
        "static"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3uej"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3uej"
        ],
        2,
        0,
        3,
        54
      ]
    },
    "S01m4wmv1sanj": {
      "id": "S01m4wmv1sanj",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "foo",
      "typeString": "string",
      "modifiers": [
        "protected",
        "readonly"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3uej"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3uej"
        ],
        4,
        0,
        5,
        41
      ]
    },
    "S01m4wm3v77rp": {
      "id": "S01m4wm3v77rp",
      "entity": "symbol",
      "name": "bar",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "bar",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3uej"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3uej"
        ],
        7,
        23,
        7,
        33
      ]
    }
  }
}

exports['SerializationSnapshotTests abstract class Vehicle { numWheels: number = 4; abstract drive(): string; } 1'] = {
  "types": {
    "T01m4wm3y7xwt": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wm3y7xwt",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "Vehicle": [
          "symbol",
          "S01m4wn9k069r"
        ]
      }
    },
    "T01m4wmu9c278": {
      "typeString": "typeof Vehicle",
      "entity": "type",
      "id": "T01m4wmu9c278",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmb5vf23"
          ],
          "typeString": "(): Vehicle"
        }
      ]
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wnhrlf5a": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wnhrlf5a",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
      ]
    },
    "T01m4wmb5vf23": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wmb5vf23",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmb5vf23"
      ],
      "properties": {
        "numWheels": [
          "symbol",
          "S01m4wmgdtvcw"
        ],
        "drive": [
          "symbol",
          "S01m4wn33a75s"
        ]
      },
      "thisType": [
        "type",
        "T01m4wlvl7ayn"
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
    "T01m4wlvl7ayn": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wlvl7ayn",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wmb5vf231"
      ]
    },
    "T01m4wmb5vf231": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wmb5vf231",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmb5vf23"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlvl7ayn"
        ]
      ]
    }
  },
  "symbols": {
    "S01m4wnpu3s0a": {
      "id": "S01m4wnpu3s0a",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm3y7xwt"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "Vehicle": [
          "symbol",
          "S01m4wn9k069r"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wn9k069r": {
      "id": "S01m4wn9k069r",
      "entity": "symbol",
      "name": "Vehicle",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wmu9c278"
      ],
      "symbolString": "Vehicle",
      "typeString": "typeof Vehicle",
      "members": {
        "numWheels": [
          "symbol",
          "S01m4wmgdtvcw"
        ],
        "drive": [
          "symbol",
          "S01m4wn33a75s"
        ]
      },
      "modifiers": [
        "export",
        "FirstContextualKeyword"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wmgdtvcw": {
      "id": "S01m4wmgdtvcw",
      "entity": "symbol",
      "name": "numWheels",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "numWheels",
      "typeString": "number",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        2,
        0,
        2,
        31
      ]
    },
    "S01m4wn33a75s": {
      "id": "S01m4wn33a75s",
      "entity": "symbol",
      "name": "drive",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wnhrlf5a"
      ],
      "symbolString": "drive",
      "typeString": "() => string",
      "modifiers": [
        "public",
        "FirstContextualKeyword"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        3,
        0,
        4,
        34
      ]
    }
  }
}

exports['SerializationSnapshotTests class Vehicle { numWheels: number = 4; drive() { return "vroom";} } 1'] = {
  "types": {
    "T01m4wn7v0f21": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wn7v0f21",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "Vehicle": [
          "symbol",
          "S01m4wmhsi9fo"
        ]
      }
    },
    "T01m4wnwgm39y": {
      "typeString": "typeof Vehicle",
      "entity": "type",
      "id": "T01m4wnwgm39y",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wlum8wjm"
          ],
          "typeString": "(): Vehicle"
        }
      ]
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wmrd30df": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmrd30df",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
      ]
    },
    "T01m4wlum8wjm": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wlum8wjm",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wlum8wjm"
      ],
      "properties": {
        "numWheels": [
          "symbol",
          "S01m4wmgd91qw"
        ],
        "drive": [
          "symbol",
          "S01m4wnqvk3ho"
        ]
      },
      "thisType": [
        "type",
        "T01m4wnfjndq3"
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
    "T01m4wnfjndq3": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wnfjndq3",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wlum8wjm1"
      ]
    },
    "T01m4wlum8wjm1": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wlum8wjm1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wlum8wjm"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wnfjndq3"
        ]
      ]
    },
    "T01m4wmrd30df1": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmrd30df1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous",
        "Instantiated"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
      ]
    }
  },
  "symbols": {
    "S01m4wnpj4pis": {
      "id": "S01m4wnpj4pis",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wn7v0f21"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "Vehicle": [
          "symbol",
          "S01m4wmhsi9fo"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        1,
        1,
        7,
        1
      ]
    },
    "S01m4wmhsi9fo": {
      "id": "S01m4wmhsi9fo",
      "entity": "symbol",
      "name": "Vehicle",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wnwgm39y"
      ],
      "symbolString": "Vehicle",
      "typeString": "typeof Vehicle",
      "members": {
        "numWheels": [
          "symbol",
          "S01m4wmgd91qw"
        ],
        "drive": [
          "symbol",
          "S01m4wnn2sv3s"
        ]
      },
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        1,
        1,
        7,
        1
      ]
    },
    "S01m4wmgd91qw": {
      "id": "S01m4wmgd91qw",
      "entity": "symbol",
      "name": "numWheels",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "numWheels",
      "typeString": "number",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        2,
        0,
        2,
        31
      ]
    },
    "S01m4wnn2sv3s": {
      "id": "S01m4wnn2sv3s",
      "entity": "symbol",
      "name": "drive",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wmrd30df"
      ],
      "symbolString": "drive",
      "typeString": "() => string",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        3,
        0,
        6,
        3
      ]
    },
    "S01m4wnqvk3ho": {
      "id": "S01m4wnqvk3ho",
      "entity": "symbol",
      "name": "drive",
      "flags": [
        "Method",
        "Transient"
      ],
      "type": [
        "type",
        "T01m4wmrd30df1"
      ],
      "symbolString": "drive",
      "typeString": "() => string",
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        3,
        0,
        6,
        3
      ]
    }
  }
}

exports['SerializationSnapshotTests const p: Promise<number> = Promise.resolve(4); 1'] = {
  "types": {
    "T01m4wmqijhej": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmqijhej",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "p": [
          "symbol",
          "S01m4wnkhr6h7"
        ]
      }
    },
    "T01m4wm50lj61": {
      "typeString": "Promise<number>",
      "entity": "type",
      "id": "T01m4wm50lj61",
      "flags": [
        "Object"
      ],
      "libName": "lib.es5.d.ts"
    }
  },
  "symbols": {
    "S01m4wm47bq6w": {
      "id": "S01m4wm47bq6w",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmqijhej"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "p": [
          "symbol",
          "S01m4wnkhr6h7"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk33"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk33"
        ],
        1,
        1,
        1,
        53
      ]
    },
    "S01m4wnkhr6h7": {
      "id": "S01m4wnkhr6h7",
      "entity": "symbol",
      "name": "p",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wm50lj61"
      ],
      "symbolString": "p",
      "typeString": "Promise<number>",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk33"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk33"
        ],
        1,
        13,
        1,
        52
      ]
    }
  }
}

exports['SerializationSnapshotTests const x = "foo" 1'] = {
  "types": {
    "T01m4wnq6yv31": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wnq6yv31",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmirtbv4"
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
    }
  },
  "symbols": {
    "S01m4wnph853a": {
      "id": "S01m4wnph853a",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wnq6yv31"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "x": [
          "symbol",
          "S01m4wmirtbv4"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhpp"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhpp"
        ],
        1,
        1,
        1,
        23
      ]
    },
    "S01m4wmirtbv4": {
      "id": "S01m4wmirtbv4",
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
        "F01m4wnwkyhpp"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhpp"
        ],
        1,
        13,
        1,
        22
      ]
    }
  }
}

exports['SerializationSnapshotTests function add(a: number, b: string) { return a + b; } 1'] = {
  "types": {
    "T01m4wms4srob": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wms4srob",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "add": [
          "symbol",
          "S01m4wllagwsj"
        ]
      }
    },
    "T01m4wmqo0i12": {
      "typeString": "(a: number, b: string) => string",
      "entity": "type",
      "id": "T01m4wmqo0i12",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wnk0jsvw"
            ],
            [
              "symbol",
              "S01m4wm96055y"
            ]
          ],
          "typeString": "(a: number, b: string): string"
        }
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
  "symbols": {
    "S01m4wlmcgydk": {
      "id": "S01m4wlmcgydk",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wms4srob"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "add": [
          "symbol",
          "S01m4wllagwsj"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        1,
        1,
        59
      ]
    },
    "S01m4wllagwsj": {
      "id": "S01m4wllagwsj",
      "entity": "symbol",
      "name": "add",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "T01m4wmqo0i12"
      ],
      "symbolString": "add",
      "typeString": "(a: number, b: string) => string",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        1,
        1,
        59
      ]
    },
    "S01m4wnk0jsvw": {
      "id": "S01m4wnk0jsvw",
      "entity": "symbol",
      "name": "a",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "a",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        21,
        1,
        29
      ]
    },
    "S01m4wm96055y": {
      "id": "S01m4wm96055y",
      "entity": "symbol",
      "name": "b",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "b",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        31,
        1,
        40
      ]
    }
  }
}

exports['SerializationSnapshotTests interface Foo {bar: number; readonly baz: Promise<string>} 1'] = {
  "types": {
    "T01m4wm96bh7s": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wm96bh7s",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wmp9klrl": {
      "typeString": "Foo",
      "entity": "type",
      "id": "T01m4wmp9klrl",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Interface"
      ],
      "properties": {
        "bar": [
          "symbol",
          "S01m4wn7l12a9"
        ],
        "baz": [
          "symbol",
          "S01m4wma48v2g"
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
    },
    "T01m4wlxcvbvh": {
      "typeString": "Promise<string>",
      "entity": "type",
      "id": "T01m4wlxcvbvh",
      "flags": [
        "Object"
      ],
      "libName": "lib.es5.d.ts"
    }
  },
  "symbols": {
    "S01m4wntycam2": {
      "id": "S01m4wntycam2",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm96bh7s"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "default": [
          "symbol",
          "S01m4wlmu7jqa"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        1,
        1,
        73
      ]
    },
    "S01m4wlmu7jqa": {
      "id": "S01m4wlmu7jqa",
      "entity": "symbol",
      "name": "default",
      "flags": [
        "Interface"
      ],
      "members": {"bar":["symbol","S01m4wn7l12a9"],"baz":["symbol","S01m4wma48v2g"]},
      "type": [
        "type",
        "T01m4wmp9klrl"
      ],
      "symbolString": "Foo",
      "typeString": "Foo"
    },
    "S01m4wn7l12a9": {
      "id": "S01m4wn7l12a9",
      "entity": "symbol",
      "name": "bar",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "bar",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        31,
        1,
        42
      ]
    },
    "S01m4wma48v2g": {
      "id": "S01m4wma48v2g",
      "entity": "symbol",
      "name": "baz",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wlxcvbvh"
      ],
      "symbolString": "baz",
      "typeString": "Promise<string>",
      "modifiers": [
        "readonly"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        43,
        1,
        72
      ]
    }
  }
}

exports['SerializationSnapshotTests let x = "foo" 1'] = {
  "types": {
    "T01m4wlqrgfql": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wlqrgfql",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmirrx8p"
        ]
      }
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "symbols": {
    "S01m4wnc6adxq": {
      "id": "S01m4wnc6adxq",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlqrgfql"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "x": [
          "symbol",
          "S01m4wmirrx8p"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhnx"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhnx"
        ],
        1,
        1,
        1,
        21
      ]
    },
    "S01m4wmirrx8p": {
      "id": "S01m4wmirrx8p",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "x",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhnx"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhnx"
        ],
        1,
        11,
        1,
        20
      ]
    }
  }
}

exports['SerializationSnapshotTests type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T | undefined } 1'] = {
  "types": {
    "T01m4wmqcfkr3": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmqcfkr3",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wlmpiil5": {
      "typeString": "Dict<T>",
      "entity": "type",
      "id": "T01m4wlmpiil5",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlxxxspc"
        ]
      ],
      "stringIndexType": [
        "type",
        "T01m4wlxxxspc"
      ]
    },
    "T01m4wlxxxspc": {
      "typeString": "T",
      "entity": "type",
      "id": "T01m4wlxxxspc",
      "flags": [
        "TypeParameter"
      ],
      "constraint": [
        "type",
        "T01m4wntf4uds"
      ]
    },
    "T01m4wntf4uds": {
      "typeString": "\"foo\" | \"bar\" | \"baz\"",
      "entity": "type",
      "id": "T01m4wntf4uds",
      "flags": [
        "Union"
      ]
    }
  },
  "symbols": {
    "S01m4wlp33qpb": {
      "id": "S01m4wlp33qpb",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmqcfkr3"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "Dict": [
          "symbol",
          "S01m4wmnqibyq"
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
        1,
        78
      ]
    },
    "S01m4wmnqibyq": {
      "id": "S01m4wmnqibyq",
      "entity": "symbol",
      "name": "Dict",
      "flags": [
        "TypeAlias"
      ],
      "type": [
        "type",
        "T01m4wlmpiil5"
      ],
      "symbolString": "Dict",
      "typeString": "Dict<T>",
      "modifiers": [
        "export"
      ],
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
        1,
        78
      ]
    }
  }
}

exports['SerializationSnapshotTests type Dict<T> = { [k: string]: T | undefined } 1'] = {
  "types": {
    "T01m4wlwowu0v": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wlwowu0v",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wlmpiil5": {
      "typeString": "Dict<T>",
      "entity": "type",
      "id": "T01m4wlmpiil5",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlxxxspc"
        ]
      ],
      "stringIndexType": [
        "type",
        "T01m4wlxxxspc"
      ]
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
  "symbols": {
    "S01m4wly6rqhi": {
      "id": "S01m4wly6rqhi",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlwowu0v"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "Dict": [
          "symbol",
          "S01m4wmnqibyq"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk27"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk27"
        ],
        1,
        1,
        1,
        52
      ]
    },
    "S01m4wmnqibyq": {
      "id": "S01m4wmnqibyq",
      "entity": "symbol",
      "name": "Dict",
      "flags": [
        "TypeAlias"
      ],
      "type": [
        "type",
        "T01m4wlmpiil5"
      ],
      "symbolString": "Dict",
      "typeString": "Dict<T>",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk27"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk27"
        ],
        1,
        1,
        1,
        52
      ]
    }
  }
}
