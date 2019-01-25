exports['FunctionAnalysisTests function with multiple signatures 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wmbp5uex": {
      "id": "S01m4wmbp5uex",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlsbev3t"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "adder": [
          "symbol",
          "S01m4wmhl7gmd"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        2,
        0,
        7,
        0
      ]
    },
    "S01m4wmhl7gmd": {
      "id": "S01m4wmhl7gmd",
      "entity": "symbol",
      "name": "adder",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "T01m4wlwbo9w4"
      ],
      "symbolString": "adder",
      "typeString": "{ (a: string, b: string): string; (a: number, b: number): number; }",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        2,
        0,
        2,
        52
      ]
    },
    "S01m4wn1g47sh": {
      "id": "S01m4wn1g47sh",
      "entity": "symbol",
      "name": "a",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "a",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        2,
        23,
        2,
        31
      ]
    },
    "S01m4wm96284k": {
      "id": "S01m4wm96284k",
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
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        2,
        33,
        2,
        42
      ]
    },
    "S01m4wnk3qofp": {
      "id": "S01m4wnk3qofp",
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
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        3,
        23,
        3,
        31
      ]
    },
    "S01m4wmrsooqs": {
      "id": "S01m4wmrsooqs",
      "entity": "symbol",
      "name": "b",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "symbolString": "b",
      "typeString": "number",
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw4cia"
        ],
        3,
        33,
        3,
        42
      ]
    }
  },
  "types": {
    "T01m4wlsbev3t": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wlsbev3t",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "adder": [
          "symbol",
          "S01m4wmhl7gmd"
        ]
      }
    },
    "T01m4wlwbo9w4": {
      "typeString": "{ (a: string, b: string): string; (a: number, b: number): number; }",
      "entity": "type",
      "id": "T01m4wlwbo9w4",
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
              "S01m4wn1g47sh"
            ],
            [
              "symbol",
              "S01m4wm96284k"
            ]
          ],
          "typeString": "(a: string, b: string): string"
        },
        {
          "returnType": [
            "type",
            "T01m4wmr2p302"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wnk3qofp"
            ],
            [
              "symbol",
              "S01m4wmrsooqs"
            ]
          ],
          "typeString": "(a: number, b: number): number"
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
  "nodes": {},
  "sourceFiles": {
    "F01m4wmlw4cia": {
      "id": "F01m4wmlw4cia",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "S01m4wmbp5uex"
      ]
    }
  }
}

exports['FunctionAnalysisTests unary function 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wmnellk3": {
      "id": "S01m4wmnellk3",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmbyn5qs"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "foo": [
          "symbol",
          "S01m4wmca6m9w"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyktn"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyktn"
        ],
        1,
        1,
        1,
        62
      ]
    },
    "S01m4wmca6m9w": {
      "id": "S01m4wmca6m9w",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "T01m4wngke8ae"
      ],
      "symbolString": "foo",
      "typeString": "(str: string) => string",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyktn"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyktn"
        ],
        1,
        1,
        1,
        62
      ]
    },
    "S01m4wnbju447": {
      "id": "S01m4wnbju447",
      "entity": "symbol",
      "name": "str",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "symbolString": "str",
      "typeString": "string",
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyktn"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyktn"
        ],
        1,
        21,
        1,
        31
      ]
    }
  },
  "types": {
    "T01m4wmbyn5qs": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmbyn5qs",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "foo": [
          "symbol",
          "S01m4wmca6m9w"
        ]
      }
    },
    "T01m4wngke8ae": {
      "typeString": "(str: string) => string",
      "entity": "type",
      "id": "T01m4wngke8ae",
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
              "S01m4wnbju447"
            ]
          ],
          "typeString": "(str: string): string"
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
    }
  },
  "nodes": {},
  "sourceFiles": {
    "F01m4wnwkyktn": {
      "id": "F01m4wnwkyktn",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "S01m4wmnellk3"
      ]
    }
  }
}

exports['FunctionAnalysisTests zero-argument function 1'] = {
  "declarations": {},
  "symbols": {
    "S01m4wn1vt837": {
      "id": "S01m4wn1vt837",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm1n9xbg"
      ],
      "symbolString": "\"--ROOT PATH--/src/index\"",
      "typeString": "typeof import(\"--ROOT PATH--/src/index\")",
      "exports": {
        "foo": [
          "symbol",
          "S01m4wmuyncsu"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyinh"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyinh"
        ],
        1,
        1,
        1,
        39
      ]
    },
    "S01m4wmuyncsu": {
      "id": "S01m4wmuyncsu",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "T01m4wmn9vqoi"
      ],
      "symbolString": "foo",
      "typeString": "() => string",
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyinh"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyinh"
        ],
        1,
        1,
        1,
        39
      ]
    }
  },
  "types": {
    "T01m4wm1n9xbg": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wm1n9xbg",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "foo": [
          "symbol",
          "S01m4wmuyncsu"
        ]
      }
    },
    "T01m4wmn9vqoi": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmn9vqoi",
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
    }
  },
  "nodes": {},
  "sourceFiles": {
    "F01m4wnwkyinh": {
      "id": "F01m4wnwkyinh",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "S01m4wn1vt837"
      ]
    }
  }
}
