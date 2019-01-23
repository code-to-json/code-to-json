exports['FunctionAnalysisTests function with multiple signatures 1'] = {
  "declarations": {},
  "symbols": {
    "01m4wm12rc17": {
      "id": "01m4wm12rc17",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "01m4wm12rc17"
      ],
      "exports": {
        "adder": [
          "symbol",
          "01m4wmo80kqn"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        2,
        0,
        7,
        0
      ]
    },
    "01m4wmo80kqn": {
      "id": "01m4wmo80kqn",
      "entity": "symbol",
      "name": "adder",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "01m4wmo80kqn"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        2,
        0,
        2,
        52
      ]
    },
    "01m4wn1tctb0": {
      "id": "01m4wn1tctb0",
      "entity": "symbol",
      "name": "a",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "01m4wma3aq6x"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        2,
        23,
        2,
        31
      ]
    },
    "01m4wm2evg9w": {
      "id": "01m4wm2evg9w",
      "entity": "symbol",
      "name": "b",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "01m4wma3aq6x"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        2,
        33,
        2,
        42
      ]
    },
    "01m4wmy4h27v": {
      "id": "01m4wmy4h27v",
      "entity": "symbol",
      "name": "a",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "01m4wm7dey3t"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        3,
        23,
        3,
        31
      ]
    },
    "01m4wlyp0o6s": {
      "id": "01m4wlyp0o6s",
      "entity": "symbol",
      "name": "b",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "01m4wm7dey3t"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wmlw4cia"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wmlw4cia"
        ],
        3,
        33,
        3,
        42
      ]
    }
  },
  "types": {
    "01m4wm12rc17": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "01m4wm12rc17",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "adder": [
          "symbol",
          "01m4wmo80kqn"
        ]
      }
    },
    "01m4wmo80kqn": {
      "typeString": "{ (a: string, b: string): string; (a: number, b: number): number; }",
      "entity": "type",
      "id": "01m4wmo80kqn",
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
            "01m4wma3aq6x"
          ],
          "parameters": [
            [
              "symbol",
              "01m4wn1tctb0"
            ],
            [
              "symbol",
              "01m4wm2evg9w"
            ]
          ],
          "typeString": "(a: string, b: string): string"
        },
        {
          "returnType": [
            "type",
            "01m4wm7dey3t"
          ],
          "parameters": [
            [
              "symbol",
              "01m4wmy4h27v"
            ],
            [
              "symbol",
              "01m4wlyp0o6s"
            ]
          ],
          "typeString": "(a: number, b: number): number"
        }
      ]
    },
    "01m4wma3aq6x": {
      "typeString": "string",
      "entity": "type",
      "id": "01m4wma3aq6x",
      "flags": [
        "String"
      ],
      "primitive": true
    },
    "01m4wm7dey3t": {
      "typeString": "number",
      "entity": "type",
      "id": "01m4wm7dey3t",
      "flags": [
        "Number"
      ],
      "primitive": true
    }
  },
  "nodes": {},
  "sourceFiles": {
    "01m4wmlw4cia": {
      "id": "01m4wmlw4cia",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "01m4wm12rc17"
      ]
    }
  }
}

exports['FunctionAnalysisTests unary function 1'] = {
  "declarations": {},
  "symbols": {
    "01m4wmumncgp": {
      "id": "01m4wmumncgp",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "01m4wmumncgp"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wnwkyktn"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wnwkyktn"
        ],
        1,
        1,
        1,
        62
      ]
    },
    "01m4wlopx484": {
      "id": "01m4wlopx484",
      "entity": "symbol",
      "name": "str",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "01m4wma3aq6x"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wnwkyktn"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wnwkyktn"
        ],
        1,
        21,
        1,
        31
      ]
    }
  },
  "types": {
    "01m4wmumncgp": {
      "typeString": "(str: string) => string",
      "entity": "type",
      "id": "01m4wmumncgp",
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
            "01m4wma3aq6x"
          ],
          "parameters": [
            [
              "symbol",
              "01m4wlopx484"
            ]
          ],
          "typeString": "(str: string): string"
        }
      ]
    },
    "01m4wma3aq6x": {
      "typeString": "string",
      "entity": "type",
      "id": "01m4wma3aq6x",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "nodes": {},
  "sourceFiles": {
    "01m4wnwkyktn": {
      "id": "01m4wnwkyktn",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "01m4wmumncgp"
      ]
    }
  }
}

exports['FunctionAnalysisTests zero-argument function 1'] = {
  "declarations": {},
  "symbols": {
    "01m4wnc0q8ra": {
      "id": "01m4wnc0q8ra",
      "entity": "symbol",
      "name": "foo",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "01m4wnc0q8ra"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "01m4wnwkyinh"
      ],
      "location": [
        [
          "sourceFile",
          "01m4wnwkyinh"
        ],
        1,
        1,
        1,
        39
      ]
    }
  },
  "types": {
    "01m4wnc0q8ra": {
      "typeString": "() => string",
      "entity": "type",
      "id": "01m4wnc0q8ra",
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
            "01m4wma3aq6x"
          ],
          "typeString": "(): string"
        }
      ]
    },
    "01m4wma3aq6x": {
      "typeString": "string",
      "entity": "type",
      "id": "01m4wma3aq6x",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "nodes": {},
  "sourceFiles": {
    "01m4wnwkyinh": {
      "id": "01m4wnwkyinh",
      "entity": "sourceFile",
      "originalFileName": "/src/index.ts",
      "isDeclarationFile": false,
      "moduleName": "/src/index",
      "extension": "ts",
      "pathInPackage": "/src/index",
      "symbol": [
        "symbol",
        "01m4wnc0q8ra"
      ]
    }
  }
}
